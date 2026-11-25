using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Settles a parent booking exactly once when payable execution is fully validated.
/// </summary>
public interface IBookingSettlementService
{
    Task<bool> SettleIfReadyAsync(
        Booking booking,
        IReadOnlyList<BookingSession> sessions,
        Guid actorUserId,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Default booking settlement service for final session completion.
/// </summary>
public class BookingSettlementService : IBookingSettlementService
{
    private readonly IProviderRepository _providerRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderWalletService _providerWalletService;
    private readonly IBookingRollupService _rollupService;
    private readonly ILogger<BookingSettlementService> _logger;

    public BookingSettlementService(
        IProviderRepository providerRepository,
        IPatientRepository patientRepository,
        IProviderWalletService providerWalletService,
        IBookingRollupService rollupService,
        ILogger<BookingSettlementService> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<bool> SettleIfReadyAsync(
        Booking booking,
        IReadOnlyList<BookingSession> sessions,
        Guid actorUserId,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(booking);
        ArgumentNullException.ThrowIfNull(sessions);

        if (booking.SettlementCompletedAt.HasValue)
        {
            return false;
        }

        if (!_rollupService.AreAllPayableSessionsValidated(sessions))
        {
            return false;
        }

        var now = DateTime.UtcNow;
        booking.Status = BookingStatus.Validated;
        booking.StatusChangedBy = actorUserId;
        booking.StatusChangeReason = sessions.Count > 0
            ? "All payable booking sessions validated"
            : "Booking validated with code";
        booking.ValidatedAt ??= now;
        booking.ValidationMethod ??= sessions.Count > 0 ? "session_code" : "code";
        booking.SettlementCompletedAt = now;
        booking.SettlementCompletedBy = actorUserId;

        if (booking.Payment != null
            && string.Equals(booking.Payment.MethodType, PaymentConstants.MethodTypes.Cash, StringComparison.Ordinal))
        {
            PaymentModelFactory.MarkSettled(booking.Payment, now);
            PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment).Status = PaymentConstants.AttemptStatuses.Succeeded;
        }

        await _providerWalletService.SettleCashBookingDebitAsync(booking, cancellationToken);

        var alreadyRefundedAmount = booking.Payment?.Refunds.Sum(refund => refund.Amount) ?? 0m;
        var settledPatientAmount = Math.Max(0m, booking.TotalAmount - alreadyRefundedAmount);
        var settlementRatio = booking.TotalAmount > 0m
            ? settledPatientAmount / booking.TotalAmount
            : 1m;
        var settledProviderAmount = decimal.Round(
            booking.ProviderAmount * settlementRatio,
            2,
            MidpointRounding.AwayFromZero);

        var provider = await _providerRepository.GetByIdForUpdateAsync(booking.ProviderId, cancellationToken);
        if (provider != null)
        {
            provider.CompletedBookings++;
            provider.TotalRevenue += settledProviderAmount;
        }
        else
        {
            _logger.LogWarning(
                "Provider {ProviderId} not found when updating stats for validated booking {BookingId}",
                booking.ProviderId,
                booking.Id);
        }

        var patient = await _patientRepository.GetByIdForUpdateAsync(booking.PatientId, cancellationToken);
        if (patient != null)
        {
            patient.CompletedBookings++;
            patient.TotalSpent += settledPatientAmount;
        }
        else
        {
            _logger.LogWarning(
                "Patient {PatientId} not found when updating stats for validated booking {BookingId}",
                booking.PatientId,
                booking.Id);
        }

        return true;
    }
}
