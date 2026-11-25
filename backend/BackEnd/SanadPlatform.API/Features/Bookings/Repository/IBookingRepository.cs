using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Reviews.Entities;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// Repository interface for Booking data access operations.
/// Write methods stage changes in the EF change tracker only.
/// Callers must invoke IUnitOfWork.SaveChangesAsync to persist.
/// Update methods rely on EF change tracking — the entity must be loaded tracked
/// (via <see cref="GetByIdForUpdateAsync"/>) before mutation.
/// All methods accept a <see cref="CancellationToken"/> to support request cancellation.
/// </summary>
public interface IBookingRepository
{
    /// <summary>
    /// Returns a paginated list of bookings projected to a DTO, matching the given specification.
    /// This is more efficient than GetBookingsAsync as it only fetches required columns.
    /// </summary>
    Task<(IReadOnlyList<TDestination> Items, int TotalCount)> GetBookingsProjectedAsync<TDestination>(
        ISpecification<Booking> specification,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns bookings matching the specification without projection.
    /// </summary>
    Task<IReadOnlyList<Booking>> GetBookingsAsync(
        ISpecification<Booking> specification,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the authenticated user IDs linked to a booking's Patient and Provider.
    /// Uses a lightweight projection: only 2 columns selected instead of the full entity graph.
    /// Returns null when the booking does not exist.
    /// </summary>
    /// <param name="bookingId">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<BookingOwnership?> GetBookingOwnershipAsync(Guid bookingId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a single booking by ID projected to <typeparamref name="TDestination"/> via AutoMapper.
    /// Much more efficient than loading the full entity graph with Includes — only the columns
    /// required by the destination DTO are SELECTed, and sub-collections use correlated subqueries.
    /// </summary>
    /// <typeparam name="TDestination">DTO type mapped from Booking in AutoMapper.</typeparam>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<TDestination?> GetByIdProjectedAsync<TDestination>(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a single booking by ID with Patient, Provider, Service, EquipmentRental,
    /// Payment, line items, and sessions loaded. Uses AsNoTracking — for read-only display.
    /// Use <see cref="GetByIdForUpdateAsync"/> for writes.
    /// </summary>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked booking by ID for use in update operations.
    /// Keeps the xmin concurrency token in the change tracker so that
    /// SaveChangesAsync will throw DbUpdateConcurrencyException on a lost-update race.
    /// </summary>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Booking?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns true if a booking with the given ID exists.
    /// Uses AnyAsync for an efficient existence check without loading the entity.
    /// </summary>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a new booking in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    /// <param name="booking">The booking entity to create.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Booking> CreateAsync(Booking booking, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a booking update in the EF change tracker.
    /// The entity must have been loaded as tracked (via <see cref="GetByIdForUpdateAsync"/>).
    /// EF change tracking detects mutated properties and generates a minimal UPDATE statement.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    /// <param name="booking">The tracked booking entity.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Booking> UpdateAsync(Booking booking, CancellationToken cancellationToken = default);

    /// <summary>
    /// Loads the booking by ID and stages it for soft deletion.
    /// The AuditableEntityInterceptor converts the Remove call into a soft delete.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// Returns false if the booking was not found.
    /// </summary>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates the next sequential booking number for the given date.
    /// Pattern: <c>BK{YYMMDD}-{NNNNN}</c> (e.g. <c>BK260320-00042</c>).
    /// </summary>
    Task<string> GenerateBookingNumberAsync(DateOnly date, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked booking by ID with its canonical payment eagerly loaded.
    /// Used by the validate and cancel flows that may mutate both the booking and its payment.
    /// </summary>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Booking?> GetByIdWithPaymentForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked booking by ID with Payment, Patient, and Provider eagerly loaded.
    /// Used by flows (e.g. cancel) that need to check ownership via Patient/Provider UserIds
    /// AND mutate both the booking and its payment in a single round-trip.
    /// </summary>
    /// <param name="id">The booking identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Booking?> GetByIdWithPaymentAndOwnersForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns true if a review already exists for the given booking session.
    /// Uses an efficient AnyAsync check on the Reviews table.
    /// </summary>
    /// <param name="bookingSessionId">The booking session identifier.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<bool> ReviewExistsForBookingSessionAsync(Guid bookingSessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a new review in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    /// <param name="review">The review entity to create.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<Review> CreateReviewAsync(Review review, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a new refund entry in the EF change tracker.
    /// Must be added directly via DbSet (not via navigation collection) when the
    /// parent transaction was loaded without <c>.Include(t =&gt; t.Refunds)</c>,
    /// to ensure EF Core marks the entity as <c>Added</c> instead of <c>Modified</c>.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    /// <param name="refund">The refund entity to create.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task CreateRefundAsync(Refund refund, CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks whether any active bookings exist for the given service.
    /// Active bookings are those with status Pending, Confirmed, ProviderOnWay, or InProgress.
    /// Used by the Services feature to guard service deletion and deactivation.
    /// </summary>
    /// <param name="serviceId">The service identifier to check.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<bool> HasActiveBookingsForServiceAsync(Guid serviceId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns <c>true</c> if any non-cancelled booking links the two users via a
    /// Patient ↔ Provider relationship (in either direction).
    /// Used by the Documents feature for care-relationship access control checks.
    /// </summary>
    /// <param name="userIdA">The first user's authenticated ID.</param>
    /// <param name="userIdB">The second user's authenticated ID.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<bool> HasCareRelationshipAsync(Guid userIdA, Guid userIdB, CancellationToken cancellationToken = default);
}
