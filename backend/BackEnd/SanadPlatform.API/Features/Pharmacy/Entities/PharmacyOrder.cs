using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Pharmacy.Entities;

/// <summary>
/// Represents a pharmacy order associated with a booking.
/// Follows the 1:1 child-entity pattern used by <see cref="SanadPlatform.API.Features.Equipment.Entities.EquipmentRental"/>.
/// </summary>
public class PharmacyOrder : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }

    // ==================== Order Details ====================

    /// <summary>
    /// Comma-separated or structured description of items ordered.
    /// </summary>
    public string Items { get; set; } = string.Empty;

    /// <summary>
    /// Total cost of the pharmacy order.
    /// </summary>
    public decimal? Amount { get; set; }

    /// <summary>
    /// Ready prescription file referenced by this order, if any.
    /// </summary>
    public Guid? PrescriptionFileId { get; set; }

    /// <summary>
    /// Delivery address for the pharmacy order.
    /// </summary>
    [Encrypted(Classification = DataClassification.Confidential)]
    public string? DeliveryAddress { get; set; }

    /// <summary>
    /// Patient contact phone number for delivery coordination.
    /// </summary>
    [Encrypted(Classification = DataClassification.Critical)]
    public string? PatientPhone { get; set; }

    /// <summary>
    /// Additional notes from the patient or pharmacy.
    /// </summary>
    public string? Notes { get; set; }

    // ==================== Dates ====================

    /// <summary>
    /// When the order was placed.
    /// </summary>
    public DateTime OrderDate { get; set; }

    /// <summary>
    /// When the order was delivered/completed.
    /// </summary>
    public DateTime? CompletedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
