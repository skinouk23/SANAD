using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Equipment.Entities;

/// <summary>
/// Represents an equipment rental associated with a booking.
/// </summary>
public class EquipmentRental : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid BookingId { get; set; }

    // ==================== Equipment Details ====================

    public string EquipmentName { get; set; } = string.Empty;

    public string? EquipmentSerialNumber { get; set; }

    // ==================== Rental Period ====================

    public DateOnly RentalStartDate { get; set; }

    public DateOnly RentalEndDate { get; set; }

    public DateOnly? ActualReturnDate { get; set; }

    // ==================== Pricing ====================

    /// <summary>
    /// Patient-selected billing tier at booking time (daily, weekly, monthly).
    /// </summary>
    public string RentalDurationType { get; set; } = "daily";

    /// <summary>
    /// Snapshotted rate per period unit from services.metadata.pricing at booking time.
    /// </summary>
    public decimal PeriodRate { get; set; }

    /// <summary>
    /// Number of billing periods (calculated at booking time, never changes).
    /// </summary>
    public int PeriodCount { get; set; }

    public decimal? DepositAmount { get; set; }

    public bool DepositPaid { get; set; }

    public bool DepositReturned { get; set; }

    // ==================== Condition ====================

    public string? ConditionAtPickup { get; set; }

    public string? ConditionAtReturn { get; set; }

    public string? DamageNotes { get; set; }

    public decimal? DamageFee { get; set; }

    // ==================== Photos ====================

    public List<string>? PickupPhotos { get; set; }

    public List<string>? ReturnPhotos { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
