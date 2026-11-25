using SanadPlatform.API.Common.Enums;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Enforces valid execution transitions for booking sessions.
/// </summary>
public static class BookingSessionStateMachine
{
    private static readonly IReadOnlyDictionary<BookingSessionStatus, IReadOnlySet<BookingSessionStatus>> ValidTransitions =
        new Dictionary<BookingSessionStatus, IReadOnlySet<BookingSessionStatus>>
        {
            [BookingSessionStatus.Pending] = new HashSet<BookingSessionStatus>
            {
                BookingSessionStatus.Confirmed,
                BookingSessionStatus.Cancelled
            },
            [BookingSessionStatus.Confirmed] = new HashSet<BookingSessionStatus>
            {
                BookingSessionStatus.ProviderOnWay,
                BookingSessionStatus.Cancelled
            },
            [BookingSessionStatus.ProviderOnWay] = new HashSet<BookingSessionStatus>
            {
                BookingSessionStatus.Arrived,
                BookingSessionStatus.NoShow
            },
            [BookingSessionStatus.Arrived] = new HashSet<BookingSessionStatus>
            {
                BookingSessionStatus.InProgress,
                BookingSessionStatus.Disputed,
                BookingSessionStatus.NoShow
            },
            [BookingSessionStatus.InProgress] = new HashSet<BookingSessionStatus>
            {
                BookingSessionStatus.Completed,
                BookingSessionStatus.Validated,
                BookingSessionStatus.Disputed
            },
            [BookingSessionStatus.Completed] = new HashSet<BookingSessionStatus>
            {
                BookingSessionStatus.Validated,
                BookingSessionStatus.Disputed
            },
            [BookingSessionStatus.Validated] = new HashSet<BookingSessionStatus>(),
            [BookingSessionStatus.Cancelled] = new HashSet<BookingSessionStatus>(),
            [BookingSessionStatus.NoShow] = new HashSet<BookingSessionStatus>(),
            [BookingSessionStatus.Disputed] = new HashSet<BookingSessionStatus>()
        };

    public static bool CanTransition(BookingSessionStatus from, BookingSessionStatus to)
        => ValidTransitions.TryGetValue(from, out var allowed) && allowed.Contains(to);

    public static void ValidateTransition(BookingSessionStatus from, BookingSessionStatus to)
    {
        if (!CanTransition(from, to))
        {
            throw new InvalidOperationException(
                $"Invalid booking session status transition: '{from}' to '{to}'. " +
                $"Allowed transitions from '{from}': {GetAllowedTransitions(from)}.");
        }
    }

    public static bool IsTerminal(BookingSessionStatus status)
        => status is BookingSessionStatus.Validated
            or BookingSessionStatus.Cancelled
            or BookingSessionStatus.NoShow
            or BookingSessionStatus.Disputed;

    private static string GetAllowedTransitions(BookingSessionStatus from)
    {
        if (!ValidTransitions.TryGetValue(from, out var allowed) || allowed.Count == 0)
        {
            return "(none - terminal state)";
        }

        return string.Join(", ", allowed);
    }
}
