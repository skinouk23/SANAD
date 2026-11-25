using System.Text.Json;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Services.Services;
using Provider = SanadPlatform.API.Features.Providers.Entities.Provider;
using Service = SanadPlatform.API.Features.Services.Entities.Service;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// A single selected service line carried from booking requests into pricing flows.
/// </summary>
public sealed record ServiceItemSelection(Guid ServiceId, int Quantity);

/// <summary>
/// Shared input contract for booking pricing calculations.
/// </summary>
public sealed record BookingPricingInput(
    Guid CallerUserId,
    Guid PatientId,
    Guid ProviderId,
    IReadOnlyList<ServiceItemSelection> ServiceItems,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly DailyStartTime,
    string? AddressLine1,
    JsonElement? TypeConfig,
    string? PatientLocationChoice,
    Guid? PrescriptionFileId);

/// <summary>
/// Computed timing details for a booking range.
/// </summary>
public sealed record BookingTimingInfo(
    int DayCount,
    int DailyDurationMinutes,
    TimeOnly DailyEndTime);

/// <summary>
/// Computed pricing details for a booking.
/// </summary>
public sealed record BookingPricingInfo(
    decimal ServicePrice,
    decimal AddonsPrice,
    decimal PerDaySubtotal,
    decimal BookingSubtotal,
    decimal PlatformFee,
    decimal TotalAmount,
    decimal ProviderAmount);

/// <summary>
/// Full pricing calculation result consumed by booking creation and quote flows.
/// </summary>
public sealed record BookingPricingResult(
    Provider Provider,
    IReadOnlyList<ResolvedServiceItem> SelectedItems,
    Service PrimaryService,
    DateOnly EffectiveEndDate,
    BookingTimingInfo Timing,
    BookingPricingInfo Pricing,
    IBookingCategoryPolicy ResolvedPolicy,
    BookingCategoryResult CategoryResult);

/// <summary>
/// Calculates authoritative booking timing and pricing using the same pipeline as booking creation.
/// </summary>
public interface IBookingPricingService
{
    /// <summary>
    /// Calculates booking timing and pricing for the supplied input.
    /// </summary>
    Task<BookingPricingResult> CalculateAsync(
        BookingPricingInput input,
        bool tracked,
        CancellationToken cancellationToken = default);
}
