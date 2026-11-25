namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Aggregated session counts for a parent booking.
/// </summary>
public record BookingSessionCountsResponse
{
    public int TotalSessions { get; init; }

    public int ConfirmedSessions { get; init; }

    public int InProgressSessions { get; init; }

    public int ValidatedSessions { get; init; }

    public int CancelledSessions { get; init; }

    public int DisputedSessions { get; init; }

    public int NoShowSessions { get; init; }

    public int RemainingSessions { get; init; }
}
