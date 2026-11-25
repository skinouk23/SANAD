namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Shared equipment rental block used in both Patient and Provider booking list responses.
/// <c>periodCount</c> and <c>depositStatus</c> are dynamically derived (never read from DB).
/// </summary>
public class EquipmentRentalResponse
{
    public DateOnly EndDate { get; init; }
    public DateOnly? ActualReturnDate { get; init; }
    public string RentalDurationType { get; init; } = string.Empty;
    public decimal PeriodRate { get; init; }

    /// <summary>Derived at response time via RentalPricingCalculator.CalculatePeriodCount.</summary>
    public int PeriodCount { get; init; }

    /// <summary>Derived at response time via RentalPricingCalculator.DeriveDepositStatus.</summary>
    public string DepositStatus { get; init; } = string.Empty;

    public decimal DepositAmount { get; init; }
}
