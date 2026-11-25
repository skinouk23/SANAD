using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// EF Core implementation of <see cref="IBookingSessionRepository"/>.
/// </summary>
public class BookingSessionRepository : IBookingSessionRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<BookingSessionRepository> _logger;

    public BookingSessionRepository(SanadDbContext context, ILogger<BookingSessionRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public Task<BookingSession> CreateAsync(BookingSession session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        _context.BookingSessions.Add(session);
        _logger.LogDebug("Booking session {SessionId} staged for booking {BookingId}", session.Id, session.BookingId);
        return Task.FromResult(session);
    }

    public Task<IReadOnlyList<BookingSession>> CreateRangeAsync(
        IReadOnlyList<BookingSession> sessions,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(sessions);

        _context.BookingSessions.AddRange(sessions);
        _logger.LogDebug("{Count} booking sessions staged for creation", sessions.Count);
        return Task.FromResult(sessions);
    }

    public async Task<BookingSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await BaseReadQuery()
            .FirstOrDefaultAsync(session => session.Id == id, cancellationToken);
    }

    public async Task<BookingSession?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await BaseTrackedQuery()
            .FirstOrDefaultAsync(session => session.Id == id, cancellationToken);
    }

    public async Task<BookingSession?> GetByIdWithBookingForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await BaseTrackedQuery()
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Payment)
                    .ThenInclude(payment => payment!.PaymentAttempts)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Payment)
                    .ThenInclude(payment => payment!.Refunds)
            .FirstOrDefaultAsync(session => session.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<BookingSession>> GetByBookingIdForUpdateAsync(
        Guid bookingId,
        CancellationToken cancellationToken = default)
    {
        return await BaseTrackedQuery()
            .Where(session => session.BookingId == bookingId)
            .OrderBy(session => session.ScheduledDate)
            .ThenBy(session => session.ScheduledStartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<BookingSession>> GetByBookingIdAsync(
        Guid bookingId,
        CancellationToken cancellationToken = default)
    {
        return await BaseReadQuery()
            .Where(session => session.BookingId == bookingId)
            .OrderBy(session => session.ScheduledDate)
            .ThenBy(session => session.ScheduledStartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<BookingSession?> GetFirstNonTerminalByBookingIdForUpdateAsync(
        Guid bookingId,
        CancellationToken cancellationToken = default)
    {
        return await BaseTrackedQuery()
            .Where(session => session.BookingId == bookingId
                && session.Status != BookingSessionStatus.Validated
                && session.Status != BookingSessionStatus.Cancelled
                && session.Status != BookingSessionStatus.NoShow
                && session.Status != BookingSessionStatus.Disputed)
            .OrderBy(session => session.ScheduledDate)
            .ThenBy(session => session.ScheduledStartTime)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<BookingSession> Items, int TotalCount)> GetSessionsAsync(
        Guid? bookingId,
        Guid? patientId,
        Guid? providerId,
        BookingSessionStatus? status,
        DateOnly? dateFrom,
        DateOnly? dateTo,
        string sortBy,
        bool sortDesc,
        int page,
        int limit,
        CancellationToken cancellationToken = default)
    {
        var safePage = Math.Max(1, page);
        var safeLimit = Math.Clamp(limit, 1, 100);
        var query = BaseReadQuery();

        if (bookingId.HasValue)
        {
            query = query.Where(session => session.BookingId == bookingId.Value);
        }

        if (patientId.HasValue)
        {
            query = query.Where(session => session.PatientId == patientId.Value);
        }

        if (providerId.HasValue)
        {
            query = query.Where(session => session.ProviderId == providerId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(session => session.Status == status.Value);
        }

        if (dateFrom.HasValue)
        {
            query = query.Where(session => session.ScheduledDate >= dateFrom.Value);
        }

        if (dateTo.HasValue)
        {
            query = query.Where(session => session.ScheduledDate <= dateTo.Value);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await ApplySorting(query, sortBy, sortDesc)
            .Skip((safePage - 1) * safeLimit)
            .Take(safeLimit)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<IReadOnlyDictionary<Guid, BookingSessionCountsResponse>> GetSessionCountsByBookingIdsAsync(
        IReadOnlyCollection<Guid> bookingIds,
        CancellationToken cancellationToken = default)
    {
        if (bookingIds.Count == 0)
        {
            return new Dictionary<Guid, BookingSessionCountsResponse>();
        }

        return await _context.BookingSessions
            .AsNoTracking()
            .Where(session => bookingIds.Contains(session.BookingId))
            .GroupBy(session => session.BookingId)
            .Select(group => new
            {
                BookingId = group.Key,
                TotalSessions = group.Count(),
                ConfirmedSessions = group.Count(session => session.Status == BookingSessionStatus.Confirmed),
                InProgressSessions = group.Count(session => session.Status == BookingSessionStatus.ProviderOnWay
                    || session.Status == BookingSessionStatus.Arrived
                    || session.Status == BookingSessionStatus.InProgress),
                ValidatedSessions = group.Count(session => session.Status == BookingSessionStatus.Validated),
                CancelledSessions = group.Count(session => session.Status == BookingSessionStatus.Cancelled),
                DisputedSessions = group.Count(session => session.Status == BookingSessionStatus.Disputed),
                NoShowSessions = group.Count(session => session.Status == BookingSessionStatus.NoShow),
                RemainingSessions = group.Count(session => session.Status != BookingSessionStatus.Cancelled
                    && session.Status != BookingSessionStatus.NoShow)
            })
            .ToDictionaryAsync(
                item => item.BookingId,
                item => new BookingSessionCountsResponse
                {
                    TotalSessions = item.TotalSessions,
                    ConfirmedSessions = item.ConfirmedSessions,
                    InProgressSessions = item.InProgressSessions,
                    ValidatedSessions = item.ValidatedSessions,
                    CancelledSessions = item.CancelledSessions,
                    DisputedSessions = item.DisputedSessions,
                    NoShowSessions = item.NoShowSessions,
                    RemainingSessions = item.RemainingSessions
                },
                cancellationToken);
    }

    public async Task<bool> HasSessionsAsync(Guid bookingId, CancellationToken cancellationToken = default)
    {
        return await _context.BookingSessions
            .AsNoTracking()
            .AnyAsync(session => session.BookingId == bookingId, cancellationToken);
    }

    public async Task<IReadOnlyList<BookingSession>> GetProviderSessionsByDateRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        IReadOnlyCollection<BookingSessionStatus> statuses,
        CancellationToken cancellationToken = default)
    {
        return await BaseReadQuery()
            .Where(session => session.ProviderId == providerId
                && session.ScheduledDate >= startDate
                && session.ScheduledDate <= endDate
                && statuses.Contains(session.Status))
            .OrderBy(session => session.ScheduledDate)
            .ThenBy(session => session.ScheduledStartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveProviderTimeSlotsForRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default)
    {
        return await _context.BookingSessions
            .AsNoTracking()
            .Where(session => session.ProviderId == providerId
                && session.ScheduledDate >= startDate
                && session.ScheduledDate <= endDate
                && (session.Status == BookingSessionStatus.Pending
                    || session.Status == BookingSessionStatus.Confirmed
                    || session.Status == BookingSessionStatus.ProviderOnWay
                    || session.Status == BookingSessionStatus.Arrived
                    || session.Status == BookingSessionStatus.InProgress))
            .Select(session => new BookingTimeSlotWithDateDto(
                session.ScheduledDate,
                session.ScheduledDate,
                session.ScheduledStartTime,
                session.ScheduledEndTime,
                session.ScheduledDurationMinutes,
                session.Booking.Service.DurationMinutes))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<BookingTimeSlotDto>> GetActiveProviderTimeSlotsAsync(
        Guid providerId,
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        return await _context.BookingSessions
            .AsNoTracking()
            .Where(session => session.ProviderId == providerId
                && session.ScheduledDate == date
                && (session.Status == BookingSessionStatus.Pending
                    || session.Status == BookingSessionStatus.Confirmed
                    || session.Status == BookingSessionStatus.ProviderOnWay
                    || session.Status == BookingSessionStatus.Arrived
                    || session.Status == BookingSessionStatus.InProgress))
            .Select(session => new BookingTimeSlotDto(
                session.ScheduledStartTime,
                session.ScheduledEndTime,
                session.ScheduledDurationMinutes,
                session.Booking.Service.DurationMinutes))
            .ToListAsync(cancellationToken);
    }

    private IQueryable<BookingSession> BaseReadQuery()
    {
        return _context.BookingSessions
            .AsNoTracking()
            .Include(session => session.Review)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Service)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Patient)
                    .ThenInclude(patient => patient.User)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Provider)
                    .ThenInclude(provider => provider.User)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Payment);
    }

    private IQueryable<BookingSession> BaseTrackedQuery()
    {
        return _context.BookingSessions
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Service)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Patient)
            .Include(session => session.Booking)
                .ThenInclude(booking => booking.Provider);
    }

    private static IQueryable<BookingSession> ApplySorting(
        IQueryable<BookingSession> query,
        string sortBy,
        bool sortDesc)
    {
        var normalizedSortBy = NormalizeSortBy(sortBy);
        return normalizedSortBy switch
        {
            "status" => sortDesc
                ? query.OrderByDescending(session => session.Status).ThenByDescending(session => session.ScheduledDate).ThenByDescending(session => session.ScheduledStartTime)
                : query.OrderBy(session => session.Status).ThenBy(session => session.ScheduledDate).ThenBy(session => session.ScheduledStartTime),
            "createdat" => sortDesc
                ? query.OrderByDescending(session => session.CreatedAt)
                : query.OrderBy(session => session.CreatedAt),
            "bookingid" => sortDesc
                ? query.OrderByDescending(session => session.BookingId).ThenByDescending(session => session.ScheduledDate).ThenByDescending(session => session.ScheduledStartTime)
                : query.OrderBy(session => session.BookingId).ThenBy(session => session.ScheduledDate).ThenBy(session => session.ScheduledStartTime),
            _ => sortDesc
                ? query.OrderByDescending(session => session.ScheduledDate).ThenByDescending(session => session.ScheduledStartTime)
                : query.OrderBy(session => session.ScheduledDate).ThenBy(session => session.ScheduledStartTime)
        };
    }

    private static string NormalizeSortBy(string sortBy)
    {
        return string.IsNullOrWhiteSpace(sortBy)
            ? "scheduleddate"
            : sortBy.Replace("_", string.Empty, StringComparison.Ordinal).ToLowerInvariant();
    }
}
