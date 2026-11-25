using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Centralizes parent booking status derivation from child session states.
/// </summary>
public interface IBookingRollupService
{
    BookingSessionCountsResponse CountSessions(IReadOnlyList<BookingSession> sessions);

    BookingSessionCountsResponse RollUp(Booking booking, IReadOnlyList<BookingSession> sessions, Guid? actorUserId, string reason);

    bool AreAllPayableSessionsValidated(IReadOnlyList<BookingSession> sessions);
}

/// <summary>
/// Default roll-up service for parent booking status and session counts.
/// </summary>
public class BookingRollupService : IBookingRollupService
{
    public BookingSessionCountsResponse CountSessions(IReadOnlyList<BookingSession> sessions)
    {
        ArgumentNullException.ThrowIfNull(sessions);

        var total = sessions.Count;
        var cancelled = sessions.Count(session => session.Status == BookingSessionStatus.Cancelled);
        var disputed = sessions.Count(session => session.Status == BookingSessionStatus.Disputed);
        var noShow = sessions.Count(session => session.Status == BookingSessionStatus.NoShow);
        var validated = sessions.Count(session => session.Status == BookingSessionStatus.Validated);
        var inProgress = sessions.Count(session => session.Status is BookingSessionStatus.ProviderOnWay or BookingSessionStatus.Arrived or BookingSessionStatus.InProgress);
        var confirmed = sessions.Count(session => session.Status == BookingSessionStatus.Confirmed);

        return new BookingSessionCountsResponse
        {
            TotalSessions = total,
            ConfirmedSessions = confirmed,
            InProgressSessions = inProgress,
            ValidatedSessions = validated,
            CancelledSessions = cancelled,
            DisputedSessions = disputed,
            NoShowSessions = noShow,
            RemainingSessions = sessions.Count(IsPayable)
        };
    }

    public BookingSessionCountsResponse RollUp(
        Booking booking,
        IReadOnlyList<BookingSession> sessions,
        Guid? actorUserId,
        string reason)
    {
        ArgumentNullException.ThrowIfNull(booking);
        ArgumentNullException.ThrowIfNull(sessions);

        var counts = CountSessions(sessions);
        var newStatus = ResolveParentStatus(booking, sessions);
        if (booking.Status != newStatus)
        {
            booking.Status = newStatus;
            booking.StatusChangedBy = actorUserId;
            booking.StatusChangeReason = reason;
        }

        ApplyAggregateTimestamps(booking, sessions);
        return counts;
    }

    public bool AreAllPayableSessionsValidated(IReadOnlyList<BookingSession> sessions)
    {
        ArgumentNullException.ThrowIfNull(sessions);

        var payable = sessions.Where(IsPayable).ToList();
        return payable.Count > 0 && payable.All(session => session.Status == BookingSessionStatus.Validated);
    }

    private static BookingStatus ResolveParentStatus(Booking booking, IReadOnlyList<BookingSession> sessions)
    {
        if (sessions.Count == 0)
        {
            return booking.Status;
        }

        if (sessions.All(session => session.Status == BookingSessionStatus.Cancelled))
        {
            return BookingStatus.Cancelled;
        }

        if (sessions.Any(session => session.Status == BookingSessionStatus.Disputed))
        {
            return BookingStatus.Disputed;
        }

        if (sessions.All(session => session.Status is BookingSessionStatus.Cancelled or BookingSessionStatus.NoShow)
            && sessions.Any(session => session.Status == BookingSessionStatus.NoShow))
        {
            return BookingStatus.NoShow;
        }

        var payable = sessions.Where(IsPayable).ToList();
        if (booking.SettlementCompletedAt.HasValue
            && payable.Count > 0
            && payable.All(session => session.Status == BookingSessionStatus.Validated))
        {
            return BookingStatus.Validated;
        }

        if (sessions.Any(session => session.Status is BookingSessionStatus.ProviderOnWay or BookingSessionStatus.Arrived or BookingSessionStatus.InProgress))
        {
            return BookingStatus.InProgress;
        }

        if (sessions.Any(session => session.Status == BookingSessionStatus.Completed))
        {
            return BookingStatus.Completed;
        }

        if (sessions.Any(session => session.Status == BookingSessionStatus.Confirmed))
        {
            return BookingStatus.Confirmed;
        }

        return BookingStatus.Pending;
    }

    private static void ApplyAggregateTimestamps(Booking booking, IReadOnlyList<BookingSession> sessions)
    {
        booking.ProviderDepartedAt = sessions
            .Where(session => session.ProviderDepartedAt.HasValue)
            .OrderBy(session => session.ProviderDepartedAt)
            .Select(session => session.ProviderDepartedAt)
            .FirstOrDefault();

        booking.ProviderArrivedAt = sessions
            .Where(session => session.ProviderArrivedAt.HasValue)
            .OrderBy(session => session.ProviderArrivedAt)
            .Select(session => session.ProviderArrivedAt)
            .FirstOrDefault();

        booking.ServiceStartedAt = sessions
            .Where(session => session.ServiceStartedAt.HasValue)
            .OrderBy(session => session.ServiceStartedAt)
            .Select(session => session.ServiceStartedAt)
            .FirstOrDefault();

        booking.ServiceCompletedAt = sessions
            .Where(session => session.ServiceCompletedAt.HasValue)
            .OrderByDescending(session => session.ServiceCompletedAt)
            .Select(session => session.ServiceCompletedAt)
            .FirstOrDefault();

        if (booking.SettlementCompletedAt.HasValue && booking.Status == BookingStatus.Validated)
        {
            booking.ValidatedAt = sessions
                .Where(session => session.VerifiedAt.HasValue)
                .OrderByDescending(session => session.VerifiedAt)
                .Select(session => session.VerifiedAt)
                .FirstOrDefault();
            booking.ValidationMethod = "session_code";
        }

        if (booking.Status == BookingStatus.Cancelled)
        {
            var latestCancellation = sessions
                .Where(session => session.CancelledAt.HasValue)
                .OrderByDescending(session => session.CancelledAt)
                .FirstOrDefault();

            booking.CancelledAt ??= latestCancellation?.CancelledAt;
            booking.CancelledBy ??= latestCancellation?.CancelledBy;
            booking.CancellationReason ??= latestCancellation?.CancellationReason;
        }
    }

    private static bool IsPayable(BookingSession session)
    {
        return session.Status != BookingSessionStatus.Cancelled
            && session.Status != BookingSessionStatus.NoShow;
    }
}
