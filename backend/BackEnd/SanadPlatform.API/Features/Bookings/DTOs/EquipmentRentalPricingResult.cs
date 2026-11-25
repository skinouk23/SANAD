namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Represents the result of equipment rental pricing calculation.
/// Used by <see cref="SanadPlatform.API.Features.Bookings.Services.Policies.EquipmentRentalBookingCategoryPolicy"/>.
/// </summary>
public sealed record EquipmentRentalPricingResult(
    decimal PeriodRate,
    int PeriodCount,
    decimal RentalTotal,
    decimal PlatformFee,
    decimal DepositAmount);
