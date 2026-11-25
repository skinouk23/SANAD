using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Providers.Repository;

/// <summary>
/// Interface for Provider repository.
/// Write methods stage changes in the EF change tracker only.
/// Callers must invoke IUnitOfWork.SaveChangesAsync to persist.
/// Update methods rely on EF change tracking — the entity must be loaded tracked
/// (via GetByIdForUpdateAsync / GetByUserIdForUpdateAsync) before mutation.
/// </summary>
public interface IProviderRepository
{
    // ==================== Read (untracked) ====================

    Task<Provider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Provider?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ProviderDetailResponse?> GetPublicDetailByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Efficiently checks if a provider exists by its entity ID without loading the full entity.
    /// </summary>
    Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Provider>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Provider>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Provider>> GetByCountryAsync(string country, CancellationToken cancellationToken = default);
    Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Efficiently retrieves the provider's ID for a given user ID via projection.
    /// </summary>
    Task<Guid?> GetProviderIdByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Efficiently retrieves the provider's ID and service category for a given user ID via projection.
    /// Returns null if the provider does not exist.
    /// </summary>
    Task<(Guid ProviderId, string ServiceCategory)?> GetProviderIdAndCategoryByUserIdAsync(
        Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a provider's preferences projected to <see cref="ProviderPreferencesResponse"/>.
    /// Returns <c>null</c> if no preferences record exists for this provider.
    /// </summary>
    Task<ProviderPreferencesResponse?> GetPreferencesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    // ==================== Read (tracked — for updates) ====================

    /// <summary>
    /// Returns a tracked (change-tracked) provider by ID for update operations.
    /// Preserves the xmin concurrency token so optimistic concurrency checks fire correctly.
    /// </summary>
    Task<Provider?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked provider with approval documents loaded for admin approval decisions.
    /// </summary>
    Task<Provider?> GetByIdWithDocumentsForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked (change-tracked) provider by UserId for update operations.
    /// Preserves the xmin concurrency token so optimistic concurrency checks fire correctly.
    /// </summary>
    Task<Provider?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the tracked provider preferences entity for a user.
    /// Use for write operations. Returns <c>null</c> if no preferences record exists.
    /// </summary>
    Task<ProviderPreferences?> GetPreferencesByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default);

    // ==================== Reviews (cross-feature read) ====================

    /// <summary>
    /// Returns a paginated, specification-driven page of visible reviews for the given provider,
    /// together with the total count of matching rows.
    /// Projections are handled at the database level (ProjectTo ProviderReviewDto).
    /// </summary>
    /// <param name="spec">The specification encapsulating filter, ordering, and paging logic.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<(IReadOnlyList<ProviderReviewDto> Items, int Total)> GetReviewsAsync(
        ISpecification<Review> spec,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the counts of each star rating (1–5) for the given provider.
    /// Only visible reviews are counted. Aggregation is performed at the database level.
    /// </summary>
    Task<Dictionary<int, int>> GetRatingDistributionAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Computes aggregate rating statistics (average and count) from the reviews table
    /// for the given provider. Only visible reviews are included.
    /// Use this instead of in-memory arithmetic to avoid read-modify-write race conditions
    /// on the denormalized <see cref="Entities.Provider.RatingAverage"/> / <see cref="Entities.Provider.RatingCount"/> fields.
    /// </summary>
    /// <returns>A tuple of (Average, Count). Returns (0, 0) if no visible reviews exist.</returns>
    Task<(decimal Average, int Count)> ComputeRatingStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Computes aggregate rating statistics from visible reviews created within the given UTC window.
    /// Returns (0, 0) if no visible reviews exist in the period.
    /// </summary>
    Task<(decimal Average, int Count)> ComputeRatingStatsForPeriodAsync(
        Guid providerId,
        DateTime createdAtUtcFromInclusive,
        DateTime createdAtUtcToExclusive,
        CancellationToken cancellationToken = default);

    // ==================== Availability History ====================

    /// <summary>
    /// Returns a paginated, specification-driven page of availability history records
    /// for the given provider, together with the total count of matching rows.
    /// </summary>
    /// <param name="spec">The specification encapsulating filter, ordering, and paging logic.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<(IReadOnlyList<ProviderAvailabilityHistory> Items, int Total)> GetAvailabilityHistoryAsync(
        ISpecification<ProviderAvailabilityHistory> spec,
        CancellationToken cancellationToken = default);

    // ==================== Availability Slots ====================

    /// <summary>
    /// Returns the provider's schedule entries for a specific day of week.
    /// Filters to <c>IsAvailable == true</c> entries only.
    /// When <paramref name="serviceId"/> is provided, returns entries where
    /// <c>ServiceId</c> is null (general) or matches the given service.
    /// </summary>
    Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDayAsync(
        Guid providerId,
        DayOfWeek dayOfWeek,
        Guid? serviceId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns <see cref="ProviderUnavailability"/> entries for a provider within a date window.
    /// Non-recurring entries are filtered to those whose <c>EndDatetime</c> falls on or after
    /// <paramref name="windowStart"/> and whose <c>StartDatetime</c> falls on or before
    /// <paramref name="windowEnd"/>. Recurring entries are always included because their
    /// occurrences must be evaluated in memory via iCal recurrence rules.
    /// </summary>
    /// <param name="providerId">The provider's ID.</param>
    /// <param name="windowStart">Earliest date of interest (inclusive).</param>
    /// <param name="windowEnd">Latest date of interest (inclusive).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(
        Guid providerId,
        DateOnly windowStart,
        DateOnly windowEnd,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns lightweight time-slot projections for active bookings
    /// (Pending, Confirmed, ProviderOnWay, InProgress) on a specific date.
    /// Joins to the <c>Services</c> table to include the service's duration as a fallback.
    /// </summary>
    Task<IReadOnlyList<BookingTimeSlotDto>> GetActiveBookingTimeSlotsAsync(
        Guid providerId,
        DateOnly date,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the provider's schedule entries for the given days of week.
    /// Batch alternative to <see cref="GetSchedulesByDayAsync"/> when querying multiple days at once.
    /// Filters to <c>IsAvailable == true</c> entries only.
    /// When <paramref name="serviceIds"/> is provided, returns entries where
    /// <c>ServiceId</c> is null (general) or matches one of the given services.
    /// </summary>
    Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDaysAsync(
        Guid providerId,
        IReadOnlyCollection<DayOfWeek> daysOfWeek,
        IReadOnlyCollection<Guid>? serviceIds = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns lightweight time-slot projections for active bookings
    /// (Pending, Confirmed, ProviderOnWay, InProgress) across a date range.
    /// Batch alternative to <see cref="GetActiveBookingTimeSlotsAsync"/> when querying multiple days.
    /// Each projection includes the booking date range for grouping.
    /// </summary>
    Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveBookingTimeSlotsForRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the provider's <see cref="Provider.MaxBookingAdvanceDays"/> setting,
    /// or <c>null</c> if the provider does not exist.
    /// </summary>
    Task<int?> GetMaxBookingAdvanceDaysAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the provider's IANA timezone identifier (e.g. "Africa/Tunis"),
    /// or <c>null</c> if the provider does not exist.
    /// </summary>
    Task<string?> GetProviderTimezoneAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked provider entity with schedules and unavailabilities loaded.
    /// Suitable for provider-owned availability mutations.
    /// </summary>
    Task<Provider?> GetByUserIdWithAvailabilityForUpdateAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns all provider schedule rows for the authenticated provider.
    /// </summary>
    Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns provider unavailability rows overlapping the specified UTC window.
    /// Recurring rows are always included for in-memory occurrence expansion.
    /// </summary>
    Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(
        Guid providerId,
        DateTime utcWindowStartInclusive,
        DateTime utcWindowEndExclusive,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns provider unavailability rows for the authenticated provider overlapping the specified UTC window.
    /// </summary>
    Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesByUserIdAsync(
        Guid userId,
        DateTime utcWindowStartInclusive,
        DateTime utcWindowEndExclusive,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns active services for the authenticated provider.
    /// </summary>
    Task<IReadOnlyList<Service>> GetActiveServicesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    // ==================== Provider Listing Queries ====================

    /// <summary>
    /// Returns a paginated list of providers matching the given specification,
    /// projected to <see cref="ProviderResponse"/> at the database level (ProjectTo).
    /// Returns the projected items and the total count of matching rows (before paging)
    /// so callers can build <see cref="SanadPlatform.API.Common.Models.PaginationMetadata"/>.
    /// </summary>
    /// <param name="spec">The specification encapsulating filter, ordering, and paging logic.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task<(IReadOnlyList<ProviderResponse> Items, int Total)> GetProvidersAsync(
        ISpecification<Provider> spec,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns distinct provider listing filter options for approved providers,
    /// optionally scoped to a service category.
    /// </summary>
    Task<ProviderFilterOptionsResponse> GetFilterOptionsAsync(
        string? serviceCategory,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Populates public provider avatar URLs from ready avatar assets without exposing storage internals.
    /// </summary>
    Task EnrichWithProfilePictureUrlsAsync(
        IReadOnlyList<ProviderResponse> providers,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Enriches provider responses with per-category service stats (min price, count).
    /// Called after the main listing query when a serviceCategory filter is active.
    /// </summary>
    Task EnrichWithServiceStatsAsync(
        IReadOnlyList<ProviderResponse> providers,
        string serviceCategory,
        CancellationToken cancellationToken = default);

    // ==================== Write ====================

    /// <summary>Stages a new provider in the EF change tracker.</summary>
    Task<Provider> CreateAsync(Provider provider, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages an existing tracked provider for update.
    /// The entity must have been loaded via <see cref="GetByIdForUpdateAsync"/> or
    /// <see cref="GetByUserIdForUpdateAsync"/> so EF change tracking can detect mutations.
    /// </summary>
    Task<Provider> UpdateAsync(Provider provider, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages new provider preferences in the EF change tracker.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    Task<ProviderPreferences> CreatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages provider preference changes in the EF change tracker.
    /// The entity must have been loaded via <see cref="GetPreferencesByUserIdForUpdateAsync"/>
    /// so EF change tracking can detect mutations.
    /// </summary>
    Task<ProviderPreferences> UpdatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages new provider schedule rows in the EF change tracker.
    /// </summary>
    Task CreateSchedulesAsync(IEnumerable<ProviderSchedule> schedules, CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes provider schedule rows from the EF change tracker.
    /// </summary>
    void RemoveSchedules(IEnumerable<ProviderSchedule> schedules);

    /// <summary>
    /// Stages a new provider unavailability row in the EF change tracker.
    /// </summary>
    Task<ProviderUnavailability> CreateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a tracked provider unavailability row for update.
    /// </summary>
    Task<ProviderUnavailability> UpdateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked provider-owned unavailability row for update/delete operations.
    /// </summary>
    Task<ProviderUnavailability?> GetUnavailabilityByIdForUpdateAsync(
        Guid providerId,
        Guid unavailabilityId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Removes a provider unavailability row from the EF change tracker.
    /// </summary>
    void RemoveUnavailability(ProviderUnavailability unavailability);

    /// <summary>
    /// Stages a provider for deletion.
    /// Because Provider implements ISoftDeletable the AuditableEntityInterceptor converts
    /// the EF Deleted state to Modified and sets DeletedAt = UtcNow automatically �
    /// no manual soft-delete logic is needed here.
    /// Returns false if the provider was not found.
    /// </summary>
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
