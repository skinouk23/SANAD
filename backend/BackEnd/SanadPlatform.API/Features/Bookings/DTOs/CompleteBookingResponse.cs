namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response returned when a provider completes a booking.
/// </summary>
public record CompleteBookingResponse
{
    /// <summary>The booking ID.</summary>
    public Guid Id { get; init; }

    /// <summary>The new booking status (should be "Completed").</summary>
    public string Status { get; init; } = string.Empty;

    /// <summary>When the service was completed.</summary>
    public DateTime? ServiceCompletedAt { get; init; }

    /// <summary>Deadline after which the booking auto-validates without patient action.</summary>
    public DateTime? AutoValidateAt { get; init; }
}
