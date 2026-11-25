using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Authentication.Helpers;
using SanadPlatform.API.Features.Files.Entities;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Providers.Repository;

/// <summary>
/// Implementation of IProviderRepository.
/// Write methods stage changes in the EF change tracker only.
/// Callers must invoke IUnitOfWork.SaveChangesAsync to persist.
/// </summary>
public class ProviderRepository : IProviderRepository
{
    private readonly SanadDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ProviderRepository> _logger;

    public ProviderRepository(
        SanadDbContext context,
        IMapper mapper,
        ILogger<ProviderRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // ==================== Read (untracked) ====================

    public async Task<Provider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<ProviderDetailResponse?> GetPublicDetailByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var provider = await _context.Providers
            .AsNoTracking()
            .Where(p => p.Id == id && p.IsApproved)
            .Select(p => new ProviderDetailResponse
            {
                Id = p.Id,
                ServiceCategory = p.ServiceCategory,
                NutritionProviderSubtype = p.NutritionProviderSubtype.HasValue
                    ? p.NutritionProviderSubtype.Value.ToString()
                    : null,
                IsIndividual = p.IsIndividual,
                BusinessName = p.BusinessName,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Bio = p.Bio,
                ShortDescription = p.ShortDescription,
                AddressLine1 = p.AddressLine1,
                City = p.City,
                CountryCode = p.CountryCode,
                RatingAverage = p.RatingAverage,
                RatingCount = p.RatingCount,
                IsVerified = p.IsVerified,
                IsAvailable = p.IsAvailable,
                AvailabilityStatus = p.AvailabilityStatus,
                AvatarFileId = p.AvatarFileId,
                YearsOfExperience = p.YearsOfExperience,
                Specialties = p.Specializations,
                Phone = p.IsApproved && p.User != null ? p.User.Phone : null,
                Timezone = p.Timezone,
                CommissionRate = p.CommissionRate,
                CreatedAt = p.CreatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (provider is not null)
        {
            await EnrichWithProfilePictureUrlAsync(provider, cancellationToken);
        }

        return provider;
    }

    /// <inheritdoc />
    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Checking provider existence for ID {ProviderId}", id);
        return await _context.Providers
            .AnyAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Provider?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    public async Task<ProviderPreferencesResponse?> GetPreferencesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching provider preferences for user ID {UserId}", userId);
        return await _context.ProviderPreferences
            .AsNoTracking()
            .Where(p => p.Provider.UserId == userId)
            .ProjectTo<ProviderPreferencesResponse>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Provider>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Provider>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .Where(p => p.IsApproved && p.IsAvailable)
            .OrderByDescending(p => p.RatingAverage)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Provider>> GetByCountryAsync(string country, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .Where(p => p.CountryCode == country && p.IsApproved && p.IsAvailable)
            .OrderByDescending(p => p.RatingAverage)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Providers.CountAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<Guid?> GetProviderIdByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Projecting provider ID for user ID {UserId}", userId);
        return await _context.Providers
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <inheritdoc/>
    public async Task<(Guid ProviderId, string ServiceCategory)?> GetProviderIdAndCategoryByUserIdAsync(
        Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Projecting provider ID and service category for user ID {UserId}", userId);
        var result = await _context.Providers
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .Select(p => new { p.Id, p.ServiceCategory })
            .FirstOrDefaultAsync(cancellationToken);

        if (result is null)
            return null;

        return (result.Id, result.ServiceCategory);
    }

    // ==================== Read (tracked - for updates) ====================

    /// <summary>
    /// Returns a tracked provider by ID for use in update operations.
    /// Keeps the xmin concurrency token in the change tracker so that
    /// SaveChangesAsync will throw DbUpdateConcurrencyException on a lost-update race.
    /// </summary>
    public async Task<Provider?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Provider?> GetByIdWithDocumentsForUpdateAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .Include(p => p.Documents)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    /// <summary>
    /// Returns a tracked provider by UserId for use in update operations.
    /// Keeps the xmin concurrency token in the change tracker so that
    /// SaveChangesAsync will throw DbUpdateConcurrencyException on a lost-update race.
    /// </summary>
    public async Task<Provider?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Provider?> GetByUserIdWithAvailabilityForUpdateAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .Include(p => p.Schedules)
            .Include(p => p.Unavailabilities)
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
    }

    /// <summary>
    /// Retrieves the tracked provider preferences entity for a user.
    /// Use for write operations. Returns <c>null</c> if no preferences record exists.
    /// </summary>
    public async Task<ProviderPreferences?> GetPreferencesByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogDebug("Fetching tracked provider preferences for update for user ID {UserId}", userId);
        return await _context.ProviderPreferences
            .FirstOrDefaultAsync(p => p.Provider.UserId == userId, cancellationToken);
    }

    // ==================== Reviews (cross-feature read) ====================

    /// <summary>
    /// Returns a paginated, specification-driven page of visible reviews for the given provider,
    /// together with the total count of matching rows (for pagination metadata).
    /// Projections are handled at the database level (ProjectTo ProviderReviewDto).
    /// </summary>
    public async Task<(IReadOnlyList<ProviderReviewDto> Items, int Total)> GetReviewsAsync(
        ISpecification<Review> spec,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.Reviews.AsNoTracking();

        var total = await SpecificationEvaluator
            .GetCountQuery(baseQuery, spec)
            .CountAsync(cancellationToken);

        var items = await SpecificationEvaluator
            .GetQuery(baseQuery, spec)
            .ProjectTo<ProviderReviewDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    /// <summary>
    /// Returns the counts of each star rating (1–5) for the given provider.
    /// Aggregation is performed at the database level using GroupBy.
    /// </summary>
    public async Task<Dictionary<int, int>> GetRatingDistributionAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .AsNoTracking()
            .Where(r => r.ProviderId == providerId && r.IsVisible)
            .GroupBy(r => r.Rating)
            .Select(g => new { Rating = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Rating, x => x.Count, cancellationToken);
    }

    /// <summary>
    /// Computes aggregate rating statistics (average and count) from the reviews table
    /// for the given provider. Only visible reviews are included.
    /// Returns (0, 0) if no visible reviews exist.
    /// </summary>
    public async Task<(decimal Average, int Count)> ComputeRatingStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var stats = await _context.Reviews
            .AsNoTracking()
            .Where(r => r.ProviderId == providerId && r.IsVisible)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Average = g.Average(r => (decimal)r.Rating),
                Count = g.Count()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (stats is null)
            return (0m, 0);

        return (stats.Average, stats.Count);
    }

    /// <inheritdoc />
    public async Task<(decimal Average, int Count)> ComputeRatingStatsForPeriodAsync(
        Guid providerId,
        DateTime createdAtUtcFromInclusive,
        DateTime createdAtUtcToExclusive,
        CancellationToken cancellationToken = default)
    {
        var stats = await _context.Reviews
            .AsNoTracking()
            .Where(r => r.ProviderId == providerId
                        && r.IsVisible
                        && r.CreatedAt >= createdAtUtcFromInclusive
                        && r.CreatedAt < createdAtUtcToExclusive)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                Average = g.Average(r => (decimal)r.Rating),
                Count = g.Count()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (stats is null)
            return (0m, 0);

        return (stats.Average, stats.Count);
    }

    // ==================== Availability History ====================

    /// <summary>
    /// Returns a paginated page of availability history records matching the specification,
    /// along with the total count of matching rows (for pagination metadata).
    /// </summary>
    public async Task<(IReadOnlyList<ProviderAvailabilityHistory> Items, int Total)> GetAvailabilityHistoryAsync(
        ISpecification<ProviderAvailabilityHistory> spec,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.ProviderAvailabilityHistories.AsNoTracking();

        var total = await SpecificationEvaluator
            .GetCountQuery(baseQuery, spec)
            .CountAsync(cancellationToken);

        var items = await SpecificationEvaluator
            .GetQuery(baseQuery, spec)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    // ==================== Provider Listing Queries ====================

    /// <inheritdoc />
    public async Task<(IReadOnlyList<ProviderResponse> Items, int Total)> GetProvidersAsync(
        ISpecification<Provider> spec,
        CancellationToken cancellationToken = default)
    {
        var baseQuery = _context.Providers.AsNoTracking();

        var total = await SpecificationEvaluator
            .GetCountQuery(baseQuery, spec)
            .CountAsync(cancellationToken);

        var items = await SpecificationEvaluator
            .GetQuery(baseQuery, spec)
            .ProjectTo<ProviderResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        await EnrichWithProfilePictureUrlsAsync(items, cancellationToken);

        return (items, total);
    }

    /// <inheritdoc />
    public async Task<ProviderFilterOptionsResponse> GetFilterOptionsAsync(
        string? serviceCategory,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Providers
            .AsNoTracking()
            .Where(provider => provider.IsApproved);

        var trimmedServiceCategory = serviceCategory?.Trim();
        if (!string.IsNullOrWhiteSpace(trimmedServiceCategory))
        {
            query = query.Where(provider => provider.ServiceCategory == trimmedServiceCategory);
        }

        var providers = await query
            .Select(provider => new
            {
                provider.City,
                provider.Specializations,
                provider.NutritionProviderSubtype
            })
            .ToListAsync(cancellationToken);

        return new ProviderFilterOptionsResponse
        {
            Cities = GetDistinctOrderedNonEmptyValues(providers.Select(provider => provider.City)),
            Specialties = GetDistinctOrderedNonEmptyValues(
                providers.SelectMany(provider => provider.Specializations)),
            NutritionProviderSubtypes = providers
                .Where(provider => provider.NutritionProviderSubtype.HasValue)
                .Select(provider => provider.NutritionProviderSubtype!.Value.ToString())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(value => value)
                .ToList()
        };
    }

    private static IReadOnlyList<string> GetDistinctOrderedNonEmptyValues(IEnumerable<string?> values)
    {
        return values
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value!.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(value => value)
            .ToList();
    }

    /// <inheritdoc />
    public async Task EnrichWithProfilePictureUrlsAsync(
        IReadOnlyList<ProviderResponse> providers,
        CancellationToken cancellationToken = default)
    {
        if (providers.Count == 0)
        {
            return;
        }

        var avatarFileIds = providers
            .Where(provider => provider.AvatarFileId.HasValue)
            .Select(provider => provider.AvatarFileId!.Value)
            .Distinct()
            .ToList();

        if (avatarFileIds.Count == 0)
        {
            return;
        }

        var filesById = await _context.StoredFiles
            .AsNoTracking()
            .Where(file => avatarFileIds.Contains(file.Id) && file.Status == StoredFileStatus.Ready)
            .ToDictionaryAsync(file => file.Id, cancellationToken);

        foreach (var provider in providers)
        {
            if (!provider.AvatarFileId.HasValue ||
                !filesById.TryGetValue(provider.AvatarFileId.Value, out var file))
            {
                provider.ProfilePictureUrl = null;
                continue;
            }

            provider.ProfilePictureUrl = AvatarUrlResolver.Resolve(file);
        }
    }

    private async Task EnrichWithProfilePictureUrlAsync(
        ProviderDetailResponse provider,
        CancellationToken cancellationToken)
    {
        if (!provider.AvatarFileId.HasValue)
        {
            return;
        }

        var file = await _context.StoredFiles
            .AsNoTracking()
            .FirstOrDefaultAsync(
                item => item.Id == provider.AvatarFileId.Value && item.Status == StoredFileStatus.Ready,
                cancellationToken);

        provider.ProfilePictureUrl = AvatarUrlResolver.Resolve(file);
    }

    /// <inheritdoc />
    public async Task EnrichWithServiceStatsAsync(
        IReadOnlyList<ProviderResponse> providers,
        string serviceCategory,
        CancellationToken cancellationToken = default)
    {
        if (providers.Count == 0) return;

        var providerIds = providers.Select(p => p.Id).ToList();

        var stats = await _context.Services
            .AsNoTracking()
            .Where(s => providerIds.Contains(s.ProviderId)
                     && s.Category == serviceCategory
                     && s.IsActive)
            .GroupBy(s => s.ProviderId)
            .Select(g => new { ProviderId = g.Key, MinPrice = g.Min(s => s.Price), Count = g.Count() })
            .ToDictionaryAsync(x => x.ProviderId, cancellationToken);

        foreach (var p in providers)
        {
            if (stats.TryGetValue(p.Id, out var s))
            {
                p.MinPrice = s.MinPrice;
                p.ServiceCount = s.Count;
            }
        }
    }

    // ==================== Write ====================

    /// <summary>
    /// Stages a new provider in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Provider> CreateAsync(Provider provider, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(provider);
        _context.Providers.Add(provider);
        _logger.LogDebug("Provider with ID {ProviderId} staged for insertion", provider.Id);
        return Task.FromResult(provider);
    }

    /// <summary>
    /// Stages an existing tracked provider for update.
    /// The entity must have been loaded via <see cref="GetByIdForUpdateAsync"/> or
    /// <see cref="GetByUserIdForUpdateAsync"/>. EF change tracking detects mutated properties
    /// and generates a minimal UPDATE statement.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<Provider> UpdateAsync(Provider provider, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(provider);
        _logger.LogDebug("Provider with ID {ProviderId} staged for update", provider.Id);
        return Task.FromResult(provider);
    }

    /// <summary>
    /// Stages new provider preferences in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<ProviderPreferences> CreatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(preferences);
        _context.ProviderPreferences.Add(preferences);
        _logger.LogDebug("Provider preferences for provider {ProviderId} staged for insertion", preferences.ProviderId);
        return Task.FromResult(preferences);
    }

    /// <summary>
    /// Stages provider preference changes in the EF change tracker.
    /// The entity must have been loaded via GetPreferencesByUserIdForUpdateAsync.
    /// Property mutations are already tracked by EF Core, so no explicit Update() call is needed.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<ProviderPreferences> UpdatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(preferences);
        _logger.LogDebug("Provider preferences for provider {ProviderId} staged for update", preferences.ProviderId);
        return Task.FromResult(preferences);
    }

    /// <summary>
    /// Stages a provider for deletion by marking it in the EF change tracker.
    /// Because Provider implements ISoftDeletable, the AuditableEntityInterceptor
    /// automatically converts the EF Deleted state to Modified and sets
    /// DeletedAt = UtcNow — no manual soft-delete logic is required here.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// Returns false if the provider was not found.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var provider = await _context.Providers.FindAsync(new object[] { id }, cancellationToken);
        if (provider == null)
            return false;

        _context.Providers.Remove(provider);
        _logger.LogDebug("Provider with ID {ProviderId} staged for deletion", id);
        return true;
    }

    // ==================== Availability Slots ====================

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDayAsync(
        Guid providerId,
        DayOfWeek dayOfWeek,
        Guid? serviceId = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ProviderSchedules
            .AsNoTracking()
            .Where(s => s.ProviderId == providerId
                        && s.DayOfWeek == dayOfWeek
                        && s.IsAvailable);

        if (serviceId.HasValue)
        {
            query = query.Where(s => s.ServiceId == null || s.ServiceId == serviceId.Value);
        }

        var schedules = await query
            .OrderBy(s => s.StartTime)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} schedule entries for provider {ProviderId} on {DayOfWeek}",
            schedules.Count, providerId, dayOfWeek);

        return schedules;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(
        Guid providerId,
        DateOnly windowStart,
        DateOnly windowEnd,
        CancellationToken cancellationToken = default)
    {
        var windowStartUtc = windowStart.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var windowEndUtc = windowEnd.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

        return await _context.ProviderUnavailabilities
            .AsNoTracking()
            .Where(u => u.ProviderId == providerId
                        && (u.IsRecurring
                            || (u.EndDatetime >= windowStartUtc && u.StartDatetime <= windowEndUtc)))
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<BookingTimeSlotDto>> GetActiveBookingTimeSlotsAsync(
        Guid providerId,
        DateOnly date,
        CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Where(b => b.ProviderId == providerId
                        && b.StartDate <= date
                        && b.EndDate >= date
                        && (b.Status == BookingStatus.Pending
                            || b.Status == BookingStatus.Confirmed
                            || b.Status == BookingStatus.ProviderOnWay
                            || b.Status == BookingStatus.InProgress))
            .Select(b => new BookingTimeSlotDto(
                b.DailyStartTime,
                b.DailyEndTime,
                b.DailyDurationMinutes,
                b.Service.DurationMinutes))
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDaysAsync(
        Guid providerId,
        IReadOnlyCollection<DayOfWeek> daysOfWeek,
        IReadOnlyCollection<Guid>? serviceIds = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ProviderSchedules
            .AsNoTracking()
            .Where(s => s.ProviderId == providerId
                        && daysOfWeek.Contains(s.DayOfWeek)
                        && s.IsAvailable);

        if (serviceIds is { Count: > 0 })
        {
            query = query.Where(s => s.ServiceId == null || serviceIds.Contains(s.ServiceId.Value));
        }

        var schedules = await query
            .OrderBy(s => s.DayOfWeek)
            .ThenBy(s => s.StartTime)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} schedule entries for provider {ProviderId} across {DayCount} days of week",
            schedules.Count, providerId, daysOfWeek.Count);

        return schedules;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveBookingTimeSlotsForRangeAsync(
        Guid providerId,
        DateOnly startDate,
        DateOnly endDate,
        CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .AsNoTracking()
            .Where(b => b.ProviderId == providerId
                        && b.StartDate <= endDate
                        && b.EndDate >= startDate
                        && (b.Status == BookingStatus.Pending
                            || b.Status == BookingStatus.Confirmed
                            || b.Status == BookingStatus.ProviderOnWay
                            || b.Status == BookingStatus.InProgress))
            .Select(b => new BookingTimeSlotWithDateDto(
                b.StartDate,
                b.EndDate,
                b.DailyStartTime,
                b.DailyEndTime,
                b.DailyDurationMinutes,
                b.Service.DurationMinutes))
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<int?> GetMaxBookingAdvanceDaysAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .Where(p => p.Id == providerId)
            .Select(p => (int?)p.MaxBookingAdvanceDays)
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<string?> GetProviderTimezoneAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Providers
            .AsNoTracking()
            .Where(p => p.Id == providerId)
            .Select(p => (string?)p.Timezone)
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.ProviderSchedules
            .AsNoTracking()
            .Where(s => s.Provider.UserId == userId)
            .OrderBy(s => s.DayOfWeek)
            .ThenBy(s => s.ServiceId.HasValue ? 1 : 0)
            .ThenBy(s => s.ServiceId)
            .ThenBy(s => s.StartTime)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(
        Guid providerId,
        DateTime utcWindowStartInclusive,
        DateTime utcWindowEndExclusive,
        CancellationToken cancellationToken = default)
    {
        return await _context.ProviderUnavailabilities
            .AsNoTracking()
            .Where(u => u.ProviderId == providerId
                        && (u.IsRecurring
                            || (u.EndDatetime > utcWindowStartInclusive && u.StartDatetime < utcWindowEndExclusive)))
            .OrderBy(u => u.StartDatetime)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesByUserIdAsync(
        Guid userId,
        DateTime utcWindowStartInclusive,
        DateTime utcWindowEndExclusive,
        CancellationToken cancellationToken = default)
    {
        return await _context.ProviderUnavailabilities
            .AsNoTracking()
            .Where(u => u.Provider.UserId == userId
                        && (u.IsRecurring
                            || (u.EndDatetime > utcWindowStartInclusive && u.StartDatetime < utcWindowEndExclusive)))
            .OrderBy(u => u.StartDatetime)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Service>> GetActiveServicesByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Services
            .AsNoTracking()
            .Where(service => service.Provider.UserId == userId && service.IsActive)
            .OrderBy(service => service.Name)
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public Task CreateSchedulesAsync(IEnumerable<ProviderSchedule> schedules, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(schedules);
        _context.ProviderSchedules.AddRange(schedules);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public void RemoveSchedules(IEnumerable<ProviderSchedule> schedules)
    {
        ArgumentNullException.ThrowIfNull(schedules);
        _context.ProviderSchedules.RemoveRange(schedules);
    }

    /// <inheritdoc />
    public Task<ProviderUnavailability> CreateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(unavailability);
        _context.ProviderUnavailabilities.Add(unavailability);
        return Task.FromResult(unavailability);
    }

    /// <inheritdoc />
    public Task<ProviderUnavailability> UpdateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(unavailability);
        return Task.FromResult(unavailability);
    }

    /// <inheritdoc />
    public async Task<ProviderUnavailability?> GetUnavailabilityByIdForUpdateAsync(
        Guid providerId,
        Guid unavailabilityId,
        CancellationToken cancellationToken = default)
    {
        return await _context.ProviderUnavailabilities
            .FirstOrDefaultAsync(
                item => item.ProviderId == providerId && item.Id == unavailabilityId,
                cancellationToken);
    }

    /// <inheritdoc />
    public void RemoveUnavailability(ProviderUnavailability unavailability)
    {
        ArgumentNullException.ThrowIfNull(unavailability);
        _context.ProviderUnavailabilities.Remove(unavailability);
    }
}
