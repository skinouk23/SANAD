using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Features.Services.Services.Policies;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

internal static class ProviderPresetCommandTestSupport
{
    public static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    public static ServiceCategoryPolicyRegistry CreatePolicyRegistry()
    {
        var defaultPolicy = new DefaultServiceCategoryPolicy();
        IServiceCategoryPolicy[] policies =
        [
            defaultPolicy,
            new EquipmentRentalServiceCategoryPolicy(),
            new NutritionServiceCategoryPolicy(),
            new AmbulanceServiceCategoryPolicy(),
            new VeterinaryServiceCategoryPolicy()
        ];

        return new ServiceCategoryPolicyRegistry(policies, defaultPolicy);
    }

    public static JsonElement ParseJson(string json)
    {
        using var document = JsonDocument.Parse(json);
        return document.RootElement.Clone();
    }

    public static void SeedCategoryCache(IMemoryCache cache, string category)
    {
        cache.Set(ProviderPresetCacheHelper.GetCacheKey(category, "en"), "cached-en");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey(category, "fr"), "cached-fr");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey(category, "ar"), "cached-ar");
        cache.Set(ProviderPresetCacheHelper.GetCacheKey(category, "de"), "cached-de");
    }

    public static void AssertCategoryCacheInvalidated(IMemoryCache cache, string category)
    {
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey(category, "en"), out _));
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey(category, "fr"), out _));
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey(category, "ar"), out _));
        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey(category, "de"), out _));
    }

    public static ProviderServicePreset CreatePreset(
        string category = "nutrition",
        string code = "assessment",
        string nameEn = "Assessment",
        string nameFr = "Bilan",
        string? nameAr = "تقييم",
        string? nameDe = null,
        string? descriptionEn = "English description",
        string? descriptionFr = "Description francaise",
        string? descriptionAr = null,
        string? descriptionDe = null,
        decimal price = 75m,
        string priceType = "fixed",
        string currency = "TND",
        int? durationMinutes = 45,
        string serviceLocation = "home",
        bool requiresPrescription = false,
        bool isUrgent = false,
        bool requiresMedicalHistory = false,
        string? typeConfig = null,
        bool isActive = true,
        int displayOrder = 1)
    {
        return new ProviderServicePreset
        {
            Id = Guid.NewGuid(),
            ProviderCategory = category,
            Code = code,
            NameEn = nameEn,
            NameFr = nameFr,
            NameAr = nameAr,
            NameDe = nameDe,
            DescriptionEn = descriptionEn,
            DescriptionFr = descriptionFr,
            DescriptionAr = descriptionAr,
            DescriptionDe = descriptionDe,
            Price = price,
            PriceType = priceType,
            Currency = currency,
            DurationMinutes = durationMinutes,
            ServiceLocation = serviceLocation,
            RequiresPrescription = requiresPrescription,
            IsUrgent = isUrgent,
            RequiresMedicalHistory = requiresMedicalHistory,
            TypeConfig = typeConfig,
            IsActive = isActive,
            DisplayOrder = displayOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}

internal sealed class UiCultureScope : IDisposable
{
    private readonly CultureInfo _previousCulture;
    private readonly CultureInfo _previousUiCulture;

    public UiCultureScope(string cultureName)
    {
        _previousCulture = CultureInfo.CurrentCulture;
        _previousUiCulture = CultureInfo.CurrentUICulture;

        var culture = CultureInfo.GetCultureInfo(cultureName);
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;
    }

    public void Dispose()
    {
        CultureInfo.CurrentCulture = _previousCulture;
        CultureInfo.CurrentUICulture = _previousUiCulture;
    }
}

internal sealed class StubProviderRepository : IProviderRepository
{
    private readonly (Guid ProviderId, string ServiceCategory)? _providerInfo;

    public StubProviderRepository((Guid ProviderId, string ServiceCategory)? providerInfo)
    {
        _providerInfo = providerInfo;
    }

    public Task<Provider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Provider?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderDetailResponse?> GetPublicDetailByIdAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<Provider>> GetAllAsync(CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<Provider>> GetActiveAsync(CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<Provider>> GetByCountryAsync(string country, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<int> GetTotalCountAsync(CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Guid?> GetProviderIdByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<(Guid ProviderId, string ServiceCategory)?> GetProviderIdAndCategoryByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => Task.FromResult(_providerInfo);
    public Task<Provider?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Provider?> GetByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Provider?> GetByUserIdWithAvailabilityForUpdateAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderPreferencesResponse?> GetPreferencesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderPreferences?> GetPreferencesByUserIdForUpdateAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<(IReadOnlyList<ProviderReviewDto> Items, int Total)> GetReviewsAsync(ISpecification<Review> spec, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Dictionary<int, int>> GetRatingDistributionAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<(decimal Average, int Count)> ComputeRatingStatsAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<(decimal Average, int Count)> ComputeRatingStatsForPeriodAsync(Guid providerId, DateTime createdAtUtcFromInclusive, DateTime createdAtUtcToExclusive, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<(IReadOnlyList<ProviderAvailabilityHistory> Items, int Total)> GetAvailabilityHistoryAsync(ISpecification<ProviderAvailabilityHistory> spec, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDayAsync(Guid providerId, DayOfWeek dayOfWeek, Guid? serviceId = null, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(Guid providerId, DateOnly windowStart, DateOnly windowEnd, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesAsync(Guid providerId, DateTime utcWindowStartInclusive, DateTime utcWindowEndExclusive, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<ProviderUnavailability>> GetUnavailabilitiesByUserIdAsync(Guid userId, DateTime utcWindowStartInclusive, DateTime utcWindowEndExclusive, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<BookingTimeSlotDto>> GetActiveBookingTimeSlotsAsync(Guid providerId, DateOnly date, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<ProviderSchedule>> GetSchedulesByDaysAsync(Guid providerId, IReadOnlyCollection<DayOfWeek> daysOfWeek, IReadOnlyCollection<Guid>? serviceIds = null, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<BookingTimeSlotWithDateDto>> GetActiveBookingTimeSlotsForRangeAsync(Guid providerId, DateOnly startDate, DateOnly endDate, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<int?> GetMaxBookingAdvanceDaysAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<string?> GetProviderTimezoneAsync(Guid providerId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<IReadOnlyList<Service>> GetActiveServicesByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<(IReadOnlyList<ProviderResponse> Items, int Total)> GetProvidersAsync(ISpecification<Provider> spec, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task EnrichWithServiceStatsAsync(IReadOnlyList<ProviderResponse> providers, string serviceCategory, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Provider> CreateAsync(Provider provider, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<Provider> UpdateAsync(Provider provider, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderPreferences> CreatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderPreferences> UpdatePreferencesAsync(ProviderPreferences preferences, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task CreateSchedulesAsync(IEnumerable<ProviderSchedule> schedules, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public void RemoveSchedules(IEnumerable<ProviderSchedule> schedules) => throw new NotSupportedException();
    public Task<ProviderUnavailability> CreateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderUnavailability> UpdateUnavailabilityAsync(ProviderUnavailability unavailability, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public Task<ProviderUnavailability?> GetUnavailabilityByIdForUpdateAsync(Guid providerId, Guid unavailabilityId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    public void RemoveUnavailability(ProviderUnavailability unavailability) => throw new NotSupportedException();
    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) => throw new NotSupportedException();
}

internal sealed class ListLogger<T> : ILogger<T>
{
    public List<LogEntry> Entries { get; } = [];

    public IDisposable BeginScope<TState>(TState state)
        where TState : notnull
        => NullScope.Instance;

    public bool IsEnabled(LogLevel logLevel) => true;

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter)
    {
        var properties = state is IEnumerable<KeyValuePair<string, object?>> structuredState
            ? structuredState.ToDictionary(pair => pair.Key, pair => pair.Value)
            : new Dictionary<string, object?>();

        Entries.Add(new LogEntry(logLevel, formatter(state, exception), properties));
    }
}

internal sealed record LogEntry(
    LogLevel Level,
    string Message,
    IReadOnlyDictionary<string, object?> Properties);

internal sealed class NullScope : IDisposable
{
    public static NullScope Instance { get; } = new();

    public void Dispose()
    {
    }
}
