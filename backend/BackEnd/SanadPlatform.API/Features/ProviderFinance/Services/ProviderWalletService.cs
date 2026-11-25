using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Exceptions;
using System.Text.Json;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Finance;
using SanadPlatform.API.Features.Finance.Services;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.ProviderFinance.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Services;

/// <summary>
/// Implements canonical provider wallet posting and projection rebuild operations.
/// </summary>
public class ProviderWalletService : IProviderWalletService
{
    private const string CashBookingUnavailableCode = "BOOKING_CASH_UNAVAILABLE";

    private readonly IProviderFinanceRepository _providerFinanceRepository;
    private readonly ILedgerPostingService _ledgerPostingService;
    private readonly ILogger<ProviderWalletService> _logger;

    public ProviderWalletService(
        IProviderFinanceRepository providerFinanceRepository,
        ILedgerPostingService ledgerPostingService,
        ILogger<ProviderWalletService> logger)
    {
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
        _ledgerPostingService = ledgerPostingService ?? throw new ArgumentNullException(nameof(ledgerPostingService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<CashBookingAvailabilityResult> GetCashBookingAvailabilityAsync(
        Guid providerId,
        decimal requiredPlatformFee,
        CancellationToken cancellationToken = default)
    {
        if (requiredPlatformFee <= 0m)
        {
            return new CashBookingAvailabilityResult(true);
        }

        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(providerId, cancellationToken);
        if (snapshot.AvailableBalance >= requiredPlatformFee)
        {
            return new CashBookingAvailabilityResult(true);
        }

        _logger.LogInformation(
            "Cash booking is unavailable for provider {ProviderId}. Required platform fee exposure {RequiredExposure} {Currency}, available balance {AvailableBalance} {Currency}",
            providerId,
            requiredPlatformFee,
            ProviderFinanceConstants.DefaultCurrency,
            snapshot.AvailableBalance,
            ProviderFinanceConstants.DefaultCurrency);

        return new CashBookingAvailabilityResult(false, CashBookingUnavailableCode);
    }

    public async Task ReserveCashBookingExposureAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(booking);

        if (!string.Equals(booking.PaymentMethod, PaymentMethods.Cash, StringComparison.Ordinal))
        {
            return;
        }

        ArgumentNullException.ThrowIfNull(booking.Payment);

        if (booking.WalletReservedAt.HasValue)
        {
            return;
        }

        booking.Currency = ProviderFinanceConstants.DefaultCurrency;
        var wallet = await GetOrCreateWalletProjectionForUpdateAsync(booking.ProviderId, cancellationToken);

        var requiredExposure = booking.PlatformFee;
        booking.WalletReservedAmount = requiredExposure;

        if (requiredExposure <= 0m)
        {
            booking.WalletReservedAt = DateTime.UtcNow;
            PaymentModelFactory.MarkReserved(booking.Payment);
            return;
        }

        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;
        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(booking.ProviderId, cancellationToken);

        if (snapshot.AvailableBalance < requiredExposure)
        {
            _logger.LogWarning(
                "Cash booking reserve rejected for provider {ProviderId}. Required platform fee exposure {RequiredExposure} {Currency}, available balance {AvailableBalance} {Currency}, booking {BookingId}",
                booking.ProviderId,
                requiredExposure,
                ProviderFinanceConstants.DefaultCurrency,
                snapshot.AvailableBalance,
                ProviderFinanceConstants.DefaultCurrency,
                booking.Id);

            throw new BookingConflictException(
                CashBookingUnavailableCode,
                "Cash payment is temporarily unavailable for this provider. Please choose another payment method.");
        }

        var now = DateTime.UtcNow;
        await _ledgerPostingService.PostAsync(
            new LedgerPostingRequest(
                BuildLedgerReferenceNumber(booking.BookingNumber, "RESERVE"),
                LedgerConstants.TransactionTypes.CashBookingFeeReserved,
                $"Reserved platform-fee wallet exposure for cash booking {booking.BookingNumber}.",
                LedgerConstants.SourceTypes.Booking,
                booking.Id,
                ProviderFinanceConstants.DefaultCurrency,
                now,
                null,
                BuildBookingLedgerIdempotencyKey(booking.Id, LedgerConstants.TransactionTypes.CashBookingFeeReserved),
                [
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.ProviderWalletAvailable,
                        -requiredExposure,
                        booking.ProviderId,
                        booking.Id,
                        booking.Payment.Id),
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.ProviderWalletReserved,
                        requiredExposure,
                        booking.ProviderId,
                        booking.Id,
                        booking.Payment.Id)
                ]),
            cancellationToken);

        booking.WalletReservedAt = now;
        PaymentModelFactory.MarkReserved(booking.Payment);

        var latestAttempt = PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment);
        latestAttempt.Status = PaymentConstants.AttemptStatuses.Succeeded;
        latestAttempt.HeldAt ??= now;

        _logger.LogInformation(
            "Reserved {Amount} {Currency} on provider wallet for cash booking {BookingId}",
            requiredExposure,
            ProviderFinanceConstants.DefaultCurrency,
            booking.Id);
    }

    public async Task ReleaseCashBookingHoldAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(booking);

        if (!CanReleaseCashBookingHold(booking))
        {
            return;
        }

        booking.Currency = ProviderFinanceConstants.DefaultCurrency;
        var wallet = await GetRequiredWalletProjectionForUpdateAsync(booking.ProviderId, cancellationToken);
        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;

        var amount = booking.WalletReservedAmount;
        if (amount <= 0m)
        {
            return;
        }

        ArgumentNullException.ThrowIfNull(booking.Payment);

        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(booking.ProviderId, cancellationToken);
        if (snapshot.ReservedBalance < amount)
        {
            throw new InvalidOperationException(
                $"Provider wallet reservation state is inconsistent for booking {booking.BookingNumber}. Reserved balance cannot cover the held amount.");
        }

        var now = DateTime.UtcNow;
        await _ledgerPostingService.PostAsync(
            new LedgerPostingRequest(
                BuildLedgerReferenceNumber(booking.BookingNumber, "RELEASE"),
                LedgerConstants.TransactionTypes.CashBookingFeeReleased,
                $"Released platform-fee wallet reservation for cancelled cash booking {booking.BookingNumber}.",
                LedgerConstants.SourceTypes.Booking,
                booking.Id,
                ProviderFinanceConstants.DefaultCurrency,
                now,
                null,
                BuildBookingLedgerIdempotencyKey(booking.Id, LedgerConstants.TransactionTypes.CashBookingFeeReleased),
                [
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.ProviderWalletAvailable,
                        amount,
                        booking.ProviderId,
                        booking.Id,
                        booking.Payment.Id),
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.ProviderWalletReserved,
                        -amount,
                        booking.ProviderId,
                        booking.Id,
                        booking.Payment.Id)
                ]),
            cancellationToken);

        booking.WalletReservationReleasedAt = now;

        var latestAttempt = PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment);
        latestAttempt.ReleasedAt ??= now;

        _logger.LogInformation(
            "Released provider wallet hold of {Amount} {Currency} for booking {BookingId}",
            amount,
            ProviderFinanceConstants.DefaultCurrency,
            booking.Id);
    }

    public async Task SettleCashBookingDebitAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(booking);

        if (!CanSettleCashBookingHold(booking))
        {
            return;
        }

        if (booking.WalletReservationReleasedAt.HasValue)
        {
            throw new InvalidOperationException(
                $"The wallet hold for booking {booking.BookingNumber} has already been released and cannot be debited.");
        }

        booking.Currency = ProviderFinanceConstants.DefaultCurrency;
        var wallet = await GetRequiredWalletProjectionForUpdateAsync(booking.ProviderId, cancellationToken);
        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;

        var amount = booking.WalletReservedAmount;
        if (amount <= 0m)
        {
            return;
        }

        ArgumentNullException.ThrowIfNull(booking.Payment);

        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(booking.ProviderId, cancellationToken);
        if (snapshot.ReservedBalance < amount)
        {
            throw new InvalidOperationException(
                $"Provider wallet balance is inconsistent for booking {booking.BookingNumber}. The reserved amount cannot be settled.");
        }

        var now = DateTime.UtcNow;
        await _ledgerPostingService.PostAsync(
            new LedgerPostingRequest(
                BuildLedgerReferenceNumber(booking.BookingNumber, "SETTLE"),
                LedgerConstants.TransactionTypes.CashBookingFeeSettled,
                $"Settled platform-fee wallet exposure for validated cash booking {booking.BookingNumber}.",
                LedgerConstants.SourceTypes.Booking,
                booking.Id,
                ProviderFinanceConstants.DefaultCurrency,
                now,
                null,
                BuildBookingLedgerIdempotencyKey(booking.Id, LedgerConstants.TransactionTypes.CashBookingFeeSettled),
                [
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.ProviderWalletReserved,
                        -amount,
                        booking.ProviderId,
                        booking.Id,
                        booking.Payment.Id),
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.PlatformRevenue,
                        amount,
                        booking.ProviderId,
                        booking.Id,
                        booking.Payment.Id)
                ]),
            cancellationToken);

        booking.WalletSettledAt = now;

        var latestAttempt = PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment);
        latestAttempt.Status = PaymentConstants.AttemptStatuses.Succeeded;
        latestAttempt.CapturedAt ??= now;

        _logger.LogInformation(
            "Settled provider wallet debit of {Amount} {Currency} for booking {BookingId}",
            amount,
            ProviderFinanceConstants.DefaultCurrency,
            booking.Id);
    }

    public async Task CreditTopUpAsync(
        ProviderWalletTopUp topUp,
        Guid? actorUserId,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(topUp);
        ArgumentNullException.ThrowIfNull(topUp.Payment);

        topUp.Currency = ProviderFinanceConstants.DefaultCurrency;
        var wallet = await GetOrCreateWalletProjectionForUpdateAsync(topUp.ProviderId, cancellationToken);
        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;

        var reviewedAt = DateTime.UtcNow;
        var creditedAmount = topUp.CreditedAmount ?? topUp.InitiatedAmount;

        await _ledgerPostingService.PostAsync(
            new LedgerPostingRequest(
                BuildLedgerReferenceNumber(topUp.ReferenceNumber, "CREDIT"),
                LedgerConstants.TransactionTypes.WalletTopUpCredited,
                $"Credited provider wallet top-up {topUp.ReferenceNumber}.",
                LedgerConstants.SourceTypes.ProviderWalletTopUp,
                topUp.Id,
                ProviderFinanceConstants.DefaultCurrency,
                reviewedAt,
                actorUserId,
                BuildTopUpLedgerIdempotencyKey(topUp.Id),
                [
                    new LedgerPostingLine(
                        LedgerConstants.AccountCodes.ProviderWalletAvailable,
                        creditedAmount,
                        topUp.ProviderId,
                        null,
                        topUp.Payment.Id,
                        topUp.Id)
                ]),
            cancellationToken);

        topUp.Status = ProviderFinanceConstants.TopUpStatuses.Credited;
        topUp.CreditedAmount = creditedAmount;
        topUp.CreditedAt ??= reviewedAt;
        topUp.SubmittedAt ??= reviewedAt;

        PaymentModelFactory.MarkSettled(topUp.Payment, reviewedAt);

        var latestAttempt = PaymentModelFactory.GetOrCreateLatestAttempt(topUp.Payment);
        latestAttempt.Status = PaymentConstants.AttemptStatuses.Succeeded;
        latestAttempt.ManualReference = topUp.ProviderSubmittedReference;

        if (!string.IsNullOrWhiteSpace(topUp.EvidenceUrl))
        {
            latestAttempt.SafeMetadataJson = JsonSerializer.Serialize(new { topUp.EvidenceUrl });
        }

        _logger.LogInformation(
            "Credited provider wallet top-up {TopUpId} using canonical ledger posting",
            topUp.Id);
    }

    public async Task SyncWalletProjectionFromLedgerAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var wallet = await GetOrCreateWalletProjectionForUpdateAsync(providerId, cancellationToken);
        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;
        await RebuildWalletProjectionAsync(wallet, cancellationToken);
    }

    private static bool CanReleaseCashBookingHold(Booking booking)
    {
        return string.Equals(booking.PaymentMethod, PaymentMethods.Cash, StringComparison.Ordinal)
            && booking.WalletReservedAmount > 0m
            && booking.WalletReservedAt.HasValue
            && !booking.WalletReservationReleasedAt.HasValue
            && !booking.WalletSettledAt.HasValue;
    }

    private static bool CanSettleCashBookingHold(Booking booking)
    {
        return string.Equals(booking.PaymentMethod, PaymentMethods.Cash, StringComparison.Ordinal)
            && booking.WalletReservedAmount > 0m
            && booking.WalletReservedAt.HasValue
            && !booking.WalletSettledAt.HasValue;
    }

    private async Task<Wallet> GetOrCreateWalletProjectionForUpdateAsync(
        Guid providerId,
        CancellationToken cancellationToken)
    {
        var wallet = await _providerFinanceRepository.GetWalletByProviderIdForUpdateAsync(providerId, cancellationToken);
        if (wallet != null)
        {
            wallet.Currency = ProviderFinanceConstants.DefaultCurrency;
            return wallet;
        }

        wallet = new Wallet
        {
            Id = Guid.NewGuid(),
            ProviderId = providerId,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            AvailableBalance = 0.00m,
            ReservedBalance = 0.00m,
            UsableBalance = 0.00m
        };

        await _providerFinanceRepository.CreateWalletAsync(wallet, cancellationToken);
        return wallet;
    }

    private async Task<Wallet> GetRequiredWalletProjectionForUpdateAsync(
        Guid providerId,
        CancellationToken cancellationToken)
    {
        var wallet = await _providerFinanceRepository.GetWalletByProviderIdForUpdateAsync(providerId, cancellationToken)
            ?? await GetOrCreateWalletProjectionForUpdateAsync(providerId, cancellationToken);

        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;
        return wallet;
    }

    private async Task RebuildWalletProjectionAsync(
        Wallet wallet,
        CancellationToken cancellationToken)
    {
        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(wallet.ProviderId, cancellationToken);
        var rebuiltAt = DateTime.UtcNow;

        wallet.Currency = ProviderFinanceConstants.DefaultCurrency;
        wallet.AvailableBalance = snapshot.AvailableBalance;
        wallet.ReservedBalance = snapshot.ReservedBalance;
        wallet.UsableBalance = snapshot.UsableBalance;
        wallet.LastRebuiltAt = rebuiltAt;

        _logger.LogDebug(
            "Rebuilt wallet projection for provider {ProviderId}: available {AvailableBalance}, reserved {ReservedBalance}",
            wallet.ProviderId,
            wallet.AvailableBalance,
            wallet.ReservedBalance);
    }

    private static string BuildLedgerReferenceNumber(string sourceReferenceNumber, string suffix)
    {
        return $"LED-{sourceReferenceNumber}-{suffix}";
    }

    private static string BuildBookingLedgerIdempotencyKey(Guid bookingId, string transactionType)
    {
        return $"booking:{bookingId}:{transactionType}";
    }

    private static string BuildTopUpLedgerIdempotencyKey(Guid topUpId)
    {
        return $"provider_wallet_top_up:{topUpId}:{LedgerConstants.TransactionTypes.WalletTopUpCredited}";
    }
}
