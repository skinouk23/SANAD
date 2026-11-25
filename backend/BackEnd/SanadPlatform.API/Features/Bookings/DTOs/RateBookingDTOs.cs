namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request body for POST /api/v1/booking-sessions/{sessionId}/rate.
/// Only the session's patient may rate, and only after session validation.
/// </summary>
public class RateBookingRequest
{
    /// <summary>Overall rating (1-5).</summary>
    public int Rating { get; init; }

    /// <summary>Optional review comment.</summary>
    public string? Comment { get; init; }
}

/// <summary>
/// Response body for POST /api/v1/booking-sessions/{sessionId}/rate (201 Created).
/// </summary>
public class RateBookingResponse
{
    /// <summary>The review identifier.</summary>
    public Guid Id { get; init; }

    /// <summary>The booking session identifier.</summary>
    public Guid BookingSessionId { get; init; }

    /// <summary>The booking identifier.</summary>
    public Guid BookingId { get; init; }

    /// <summary>The overall rating given (1-5).</summary>
    public int Rating { get; init; }

    /// <summary>The review comment, if provided.</summary>
    public string? Comment { get; init; }

    /// <summary>Timestamp when the review was created.</summary>
    public DateTime CreatedAt { get; init; }
}
