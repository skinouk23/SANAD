namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response returned when a provider advances a booking toward in-progress.
/// The resulting status may be <c>ProviderOnWay</c> (from Confirmed) or
/// <c>InProgress</c> (from ProviderOnWay).
/// </summary>
public record StartBookingResponse
{
    /// <summary>The booking ID.</summary>
    public Guid Id { get; init; }

    /// <summary>The new booking status after the transition.</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>When the provider departed (set on Confirmed → ProviderOnWay).</summary>
    public DateTime? ProviderDepartedAt { get; init; }

    /// <summary>When the provider arrived on site.</summary>
    public DateTime? ProviderArrivedAt { get; init; }

    /// <summary>When the service started (set on ProviderOnWay → InProgress).</summary>
    public DateTime? ServiceStartedAt { get; init; }
}
