namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response returned when a provider confirms a pending booking.
/// </summary>
public record ConfirmBookingResponse
{
    /// <summary>The booking ID.</summary>
    public Guid Id { get; init; }

    /// <summary>The new booking status (should be "Confirmed").</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>When the provider confirmed the booking.</summary>
    public DateTime? ConfirmedAt { get; init; }
}
