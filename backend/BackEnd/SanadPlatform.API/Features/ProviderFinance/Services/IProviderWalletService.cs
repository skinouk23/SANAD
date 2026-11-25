using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.ProviderFinance.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.Services;

public sealed record CashBookingAvailabilityResult(
    bool Available,
    string? ReasonCode = null);

/// <summary>
/// Encapsulates canonical wallet posting and projection updates.
/// </summary>
public interface IProviderWalletService
{
    Task<CashBookingAvailabilityResult> GetCashBookingAvailabilityAsync(
        Guid providerId,
        decimal requiredPlatformFee,
        CancellationToken cancellationToken = default);

    Task ReserveCashBookingExposureAsync(Booking booking, CancellationToken cancellationToken = default);

    Task ReleaseCashBookingHoldAsync(Booking booking, CancellationToken cancellationToken = default);

    Task SettleCashBookingDebitAsync(Booking booking, CancellationToken cancellationToken = default);

    Task CreditTopUpAsync(
        ProviderWalletTopUp topUp,
        Guid? actorUserId,
        CancellationToken cancellationToken = default);

    Task SyncWalletProjectionFromLedgerAsync(Guid providerId, CancellationToken cancellationToken = default);
}
