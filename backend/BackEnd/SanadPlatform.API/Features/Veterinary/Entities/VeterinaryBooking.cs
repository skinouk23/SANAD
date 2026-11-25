using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Veterinary.Entities;

/// <summary>
/// Represents veterinary-specific booking details.
/// </summary>
public class VeterinaryBooking : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid BookingId { get; set; }

    // ==================== Animal ====================

    public string AnimalType { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string AnimalName { get; set; } = string.Empty;

    public string? AnimalBreed { get; set; }

    public string? AnimalAge { get; set; }

    public string? AnimalWeight { get; set; }

    // ==================== Intake Flags ====================

    public bool IsSterilized { get; set; }

    public bool IsVaccinated { get; set; }

    public bool IsAggressive { get; set; }

    public bool HasMedicalRecord { get; set; }

    // ==================== Notes ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Notes { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? HomeVisitAddress { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
