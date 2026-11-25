namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response returned when a provider records arrival for a booking.
/// </summary>
public record ArriveBookingResponse
{
    public Guid Id { get; init; }

    public string Status { get; init; } = string.Empty;

    public DateTime? ProviderArrivedAt { get; init; }
}
