using SanadPlatform.API.Common.Enums;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Enforces the booking lifecycle state machine.
/// <para>
/// Every write operation that changes <see cref="BookingStatus"/> must call
/// <see cref="ValidateTransition"/> (or <see cref="CanTransition"/>) before persisting,
/// ensuring the booking can never skip states or move backwards illegally.
/// </para>
/// <para>
/// This class is a pure schema + validation utility — it does not interact with the
/// database directly.  CQRS command handlers are responsible for loading the entity,
/// calling this class, mutating the entity, and saving.
/// </para>
/// </summary>
public static class BookingStateMachine
{
    // ==================== Valid Transitions Map ====================
    // Key   = current (from) status
    // Value = set of valid next (to) statuses

    private static readonly IReadOnlyDictionary<BookingStatus, IReadOnlySet<BookingStatus>> ValidTransitions =
        new Dictionary<BookingStatus, IReadOnlySet<BookingStatus>>
        {
            // A newly created booking can be confirmed by the provider or cancelled by either party.
            [BookingStatus.Pending] = new HashSet<BookingStatus>
            {
                BookingStatus.Confirmed,
                BookingStatus.Cancelled
            },

            // A confirmed booking can either move to ProviderOnWay (single-visit flows),
            // jump directly to InProgress (package-level multi-day care flows), or be cancelled.
            [BookingStatus.Confirmed] = new HashSet<BookingStatus>
            {
                BookingStatus.ProviderOnWay,
                BookingStatus.InProgress,
                BookingStatus.Cancelled
            },

            // Provider is en route: they arrive and the service begins, or the patient is absent.
            [BookingStatus.ProviderOnWay] = new HashSet<BookingStatus>
            {
                BookingStatus.InProgress,
                BookingStatus.NoShow,
                BookingStatus.Cancelled
            },

            // Service is actively being delivered: it completes, or a dispute is raised.
            [BookingStatus.InProgress] = new HashSet<BookingStatus>
            {
                BookingStatus.Completed,
                BookingStatus.Disputed
            },

            // Service finished, waiting for patient validation.
            [BookingStatus.Completed] = new HashSet<BookingStatus>
            {
                BookingStatus.Validated,
                BookingStatus.Disputed
            },

            // Terminal states — no further transitions are permitted.
            [BookingStatus.Validated] = new HashSet<BookingStatus>(),
            [BookingStatus.Cancelled] = new HashSet<BookingStatus>(),
            [BookingStatus.NoShow]    = new HashSet<BookingStatus>(),

            // A disputed booking can be resolved back to Validated or closed as Cancelled.
            [BookingStatus.Disputed] = new HashSet<BookingStatus>
            {
                BookingStatus.Validated,
                BookingStatus.Cancelled
            }
        };

    // ==================== Public API ====================

    /// <summary>
    /// Returns <c>true</c> if moving a booking from <paramref name="from"/> to
    /// <paramref name="to"/> is a permitted transition.
    /// </summary>
    public static bool CanTransition(BookingStatus from, BookingStatus to)
        => ValidTransitions.TryGetValue(from, out var allowed) && allowed.Contains(to);

    /// <summary>
    /// Asserts that the transition from <paramref name="from"/> to <paramref name="to"/>
    /// is permitted.  Throws <see cref="InvalidOperationException"/> if it is not.
    /// </summary>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the requested transition is not in the valid-transitions map.
    /// </exception>
    public static void ValidateTransition(BookingStatus from, BookingStatus to)
    {
        if (!CanTransition(from, to))
        {
            throw new InvalidOperationException(
                $"Invalid booking status transition: '{from}' → '{to}'. " +
                $"Allowed transitions from '{from}': {GetAllowedTransitions(from)}.");
        }
    }

    /// <summary>
    /// Returns the set of statuses that a booking in <paramref name="current"/> state
    /// may legally transition to.
    /// </summary>
    public static IReadOnlySet<BookingStatus> GetAllowedNextStatuses(BookingStatus current)
        => ValidTransitions.TryGetValue(current, out var allowed)
            ? allowed
            : new HashSet<BookingStatus>();

    /// <summary>
    /// Returns <c>true</c> if the given status is a terminal state (no further transitions).
    /// </summary>
    public static bool IsTerminal(BookingStatus status)
        => ValidTransitions.TryGetValue(status, out var allowed) && allowed.Count == 0;

    // ==================== Private Helpers ====================

    private static string GetAllowedTransitions(BookingStatus from)
    {
        if (!ValidTransitions.TryGetValue(from, out var allowed) || allowed.Count == 0)
            return "(none — terminal state)";

        return string.Join(", ", allowed);
    }
}
