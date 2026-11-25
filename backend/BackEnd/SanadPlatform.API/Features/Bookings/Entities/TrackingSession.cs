namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a live tracking session for a provider travelling to a booking.
/// </summary>
public class TrackingSession
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Sharing ====================

    public string? ShareToken { get; set; }

    public DateTime? ShareExpiresAt { get; set; }

    // ==================== ETA ====================

    public DateTime? EstimatedArrivalAt { get; set; }

    public DateTime? LastEtaUpdateAt { get; set; }

    // ==================== Stats ====================

    public decimal? TotalDistanceKm { get; set; }

    // ==================== Timestamps ====================

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? EndedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
