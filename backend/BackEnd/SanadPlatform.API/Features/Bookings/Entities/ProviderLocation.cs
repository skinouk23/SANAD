namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a provider GPS location update recorded during an active tracking session.
/// </summary>
public class ProviderLocation
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }

    // ==================== Location ====================

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public decimal? AccuracyMeters { get; set; }

    public decimal? Heading { get; set; }

    public decimal? SpeedKmh { get; set; }

    // ==================== Related Booking ====================

    public Guid? BookingId { get; set; }

    // ==================== Timestamps ====================

    public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
}
