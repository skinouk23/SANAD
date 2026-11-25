using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// EF Core implementation of <see cref="IBookingRepository"/>.
/// All DB operations accept a <see cref="CancellationToken"/> to honour request cancellation.
/// Write methods stage changes in the EF change tracker only;
/// callers must invoke IUnitOfWork.SaveChangesAsync to persist.
/// </summary>
public class BookingRepository : IBookingRepository
{
    private readonly SanadDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<BookingRepository> _logger;

    public BookingRepository(
        SanadDbContext context,
        IMapper mapper,
        ILogger<BookingRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public async Task<(IReadOnlyList<TDestination> Items, int TotalCount)> GetBookingsProjectedAsync<TDestination>(
        ISpecification<Booking> specification,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(specification);

        var baseQuery = _context.Bookings.AsNoTracking();

        var totalCount = await SpecificationEvaluator
            .GetCountQuery(baseQuery, specification)
            .CountAsync(cancellationToken);

        var items = await SpecificationEvaluator
            .GetQuery(baseQuery, specification)
            .ProjectTo<TDestination>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} projected bookings (Total {Total})",
            items.Count,
            totalCount);

        return (items, totalCount);
    }

    /// <inheritdoc/>
    public async Task<IReadOnlyList<Booking>> GetBookingsAsync(
        ISpecification<Booking> specification,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(specification);

        var baseQuery = _context.Bookings.AsNoTracking();

        return await SpecificationEvaluator
            .GetQuery(baseQuery, specification)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<BookingOwnership?> GetBookingOwnershipAsync(Guid bookingId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Where(b => b.Id == bookingId)
            .Select(b => new BookingOwnership(
                b.Patient != null ? b.Patient.UserId : (Guid?)null,
                b.Provider != null ? b.Provider.UserId : (Guid?)null))
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<TDestination?> GetByIdProjectedAsync<TDestination>(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Where(b => b.Id == id)
            .ProjectTo<TDestination>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <summary>
    /// Returns a single booking by ID with Patient, Provider, Service, Payment, line items, and sessions loaded.
    /// Uses AsNoTracking — for read-only display. Use <see cref="GetByIdForUpdateAsync"/> for writes.
    /// </summary>
    public async Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var booking = await _context.Bookings
            .AsNoTracking()
            .Include(b => b.Patient).ThenInclude(p => p.User)
            .Include(b => b.Provider).ThenInclude(p => p.User)
            .Include(b => b.Service)
            .Include(b => b.Payment)
            .Include(b => b.EquipmentRental)
            .Include(b => b.LineItems)
            .Include(b => b.Sessions)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

        if (booking == null)
            _logger.LogDebug("Booking not found with ID: {BookingId}", id);

        return booking;
    }

    /// <summary>
    /// Returns a tracked booking by ID for use in update operations.
    /// Keeps the xmin concurrency token in the change tracker so that
    /// SaveChangesAsync will throw DbUpdateConcurrencyException on a lost-update race.
    /// </summary>
    public async Task<Booking?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    /// <summary>
    /// Returns true if a booking with the given ID exists.
    /// </summary>
    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .AnyAsync(b => b.Id == id, cancellationToken);
    }

    /// <summary>
    /// Stages a new booking in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Booking> CreateAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(booking);

        _context.Bookings.Add(booking);
        _logger.LogDebug(
            "Booking {BookingNumber} staged for creation (Patient {PatientId}, Provider {ProviderId})",
            booking.BookingNumber,
            booking.PatientId,
            booking.ProviderId);

        return Task.FromResult(booking);
    }

    /// <summary>
    /// Stages a booking update in the EF change tracker.
    /// The entity must have been loaded as tracked (via <see cref="GetByIdForUpdateAsync"/>).
    /// EF change tracking detects mutated properties and generates a minimal UPDATE statement.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Booking> UpdateAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(booking);

        _logger.LogDebug("Booking {BookingNumber} staged for update", booking.BookingNumber);
        return Task.FromResult(booking);
    }

    /// <summary>
    /// Loads the booking by ID and stages it for soft deletion.
    /// The AuditableEntityInterceptor converts the Remove call into a soft delete.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// Returns false if the booking was not found.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var booking = await _context.Bookings.FindAsync(new object[] { id }, cancellationToken);
        if (booking == null)
        {
            _logger.LogDebug("Booking not found for deletion: {BookingId}", id);
            return false;
        }

        _context.Bookings.Remove(booking);
        _logger.LogDebug("Booking {BookingId} staged for soft deletion", id);
        return true;
    }

    /// <summary>
    /// Generates the next sequential booking number for the given date.
    /// Pattern: <c>BK{YYMMDD}-{NNNNN}</c> (e.g. <c>BK260320-00042</c>).
    /// Uses a PostgreSQL sequence for O(1) atomic generation — no sorting/scanning needed.
    /// </summary>
    public async Task<string> GenerateBookingNumberAsync(DateOnly date, CancellationToken cancellationToken = default)
    {
        var prefix = $"BK{date:yyMMdd}-";

        var next = await _context.Database
            .SqlQueryRaw<long>("SELECT nextval('booking_number_seq') AS \"Value\"")
            .FirstAsync(cancellationToken);

        return $"{prefix}{next:D5}";
    }

    /// <summary>
    /// Returns a tracked booking by ID with its canonical payment eagerly loaded.
    /// Used by the validate and cancel flows that may mutate both the booking and its payment.
    /// </summary>
    public async Task<Booking?> GetByIdWithPaymentForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.Payment)
            .ThenInclude(payment => payment!.PaymentAttempts)
            .Include(b => b.Payment)
            .ThenInclude(payment => payment!.Refunds)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    /// <summary>
    /// Returns a tracked booking by ID with Payment, Patient, and Provider eagerly loaded.
    /// Uses <see cref="EntityFrameworkQueryableExtensions.IgnoreQueryFilters{TEntity}"/> so that
    /// soft-deleted Patient/Provider navigation properties are still loaded (their UserId is
    /// needed for ownership checks). A manual <c>DeletedAt == null</c> filter is applied to the
    /// Booking itself to preserve soft-delete semantics on the root entity.
    /// Used by flows (e.g. cancel) that need to check ownership via Patient/Provider UserIds
    /// AND mutate both the booking and its payment in a single round-trip.
    /// </summary>
    public async Task<Booking?> GetByIdWithPaymentAndOwnersForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .IgnoreQueryFilters()
            .Where(b => b.DeletedAt == null)
            .Include(b => b.Payment)
            .ThenInclude(payment => payment!.PaymentAttempts)
            .Include(b => b.Payment)
            .ThenInclude(payment => payment!.Refunds)
            .Include(b => b.Patient)
            .Include(b => b.Provider)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    /// <summary>
    /// Returns true if a review already exists for the given booking session.
    /// Uses an efficient AnyAsync check on the Reviews table.
    /// </summary>
    public async Task<bool> ReviewExistsForBookingSessionAsync(Guid bookingSessionId, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .AsNoTracking()
            .AnyAsync(r => r.BookingSessionId == bookingSessionId, cancellationToken);
    }

    /// <summary>
    /// Stages a new review in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Review> CreateReviewAsync(Review review, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(review);

        _context.Reviews.Add(review);
        _logger.LogDebug(
            "Review staged for creation (BookingId {BookingId}, SessionId {SessionId}, Rating {Rating})",
            review.BookingId,
            review.BookingSessionId,
            review.Rating);

        return Task.FromResult(review);
    }

    /// <summary>
    /// Stages a new refund entry in the EF change tracker.
    /// Added directly via DbSet to ensure EF Core marks it as <c>Added</c>,
    /// avoiding the <c>Modified</c>-state bug that occurs when adding to an
    /// un-loaded navigation collection on a tracked parent entity.
    /// </summary>
    public Task CreateRefundAsync(Refund refund, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(refund);

        _context.Set<Refund>().Add(refund);
        _logger.LogDebug(
            "Refund staged for creation (BookingId {BookingId}, Amount {Amount})",
            refund.BookingId,
            refund.Amount);

        return Task.CompletedTask;
    }

    /// <inheritdoc/>
    public async Task<bool> HasActiveBookingsForServiceAsync(Guid serviceId, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .AnyAsync(
                b => b.ServiceId == serviceId
                     && (b.Status == BookingStatus.Pending
                         || b.Status == BookingStatus.Confirmed
                         || b.Status == BookingStatus.ProviderOnWay
                         || b.Status == BookingStatus.InProgress),
                cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<bool> HasCareRelationshipAsync(Guid userIdA, Guid userIdB, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .AnyAsync(b =>
                b.Status != BookingStatus.Cancelled &&
                (
                    (b.Provider.UserId == userIdA && b.Patient.UserId == userIdB) ||
                    (b.Patient.UserId == userIdA && b.Provider.UserId == userIdB)
                ),
                cancellationToken);
    }
}
