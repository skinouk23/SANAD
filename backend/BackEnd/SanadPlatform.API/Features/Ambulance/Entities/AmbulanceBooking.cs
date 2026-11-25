using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Ambulance.Entities;

/// <summary>
/// Represents ambulance-specific booking details.
/// </summary>
public class AmbulanceBooking : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid BookingId { get; set; }

    // ==================== Type ====================

    public string ServiceType { get; set; } = string.Empty;

    // ==================== Pickup ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string PickupAddress { get; set; } = string.Empty;

    public decimal? PickupLatitude { get; set; }

    public decimal? PickupLongitude { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? PickupContactName { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? PickupContactPhone { get; set; }

    // ==================== Destination ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string DestinationAddress { get; set; } = string.Empty;

    public decimal? DestinationLatitude { get; set; }

    public decimal? DestinationLongitude { get; set; }

    public string? DestinationFacilityName { get; set; }

    // ==================== Patient Condition ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? PatientCondition { get; set; }

    public bool RequiresStretcher { get; set; }

    public bool RequiresOxygen { get; set; }

    public bool RequiresMedicalStaff { get; set; }

    // ==================== Vehicle ====================

    public string? VehicleType { get; set; }

    public string? VehicleRegistration { get; set; }

    // ==================== Crew ====================

    public string? DriverName { get; set; }

    public string? MedicName { get; set; }

    // ==================== Timing ====================

    public DateTime? RequestedPickupTime { get; set; }

    public DateTime? ActualPickupTime { get; set; }

    public DateTime? ActualArrivalTime { get; set; }

    // ==================== Distance ====================

    public decimal? EstimatedDistanceKm { get; set; }

    public decimal? ActualDistanceKm { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
