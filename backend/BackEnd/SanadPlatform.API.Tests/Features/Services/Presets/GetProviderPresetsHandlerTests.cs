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
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class GetProviderPresetsHandlerTests
{
    [Fact]
    public void SanadDbContext_MapsProviderServicePreset_ToExpectedTableAndIndexes()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(ProviderServicePreset));

        Assert.NotNull(entityType);
        Assert.Equal("provider_service_presets", entityType!.GetTableName());
        Assert.Contains(
            entityType.GetIndexes(),
            index => index.IsUnique
                && index.GetDatabaseName() == "ix_provider_service_presets_category_code"
                && index.Properties.Select(property => property.Name).SequenceEqual(
                    [nameof(ProviderServicePreset.ProviderCategory), nameof(ProviderServicePreset.Code)]));
        Assert.Contains(
            entityType.GetIndexes(),
            index => !index.IsUnique
                && index.GetDatabaseName() == "ix_provider_service_presets_category_active_order"
                && index.Properties.Select(property => property.Name).SequenceEqual(
                    [
                        nameof(ProviderServicePreset.ProviderCategory),
                        nameof(ProviderServicePreset.IsActive),
                        nameof(ProviderServicePreset.DisplayOrder)
                    ]));
    }

    [Fact]
    public async Task Handle_ReturnsPresetsFilteredByProviderCategory()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.AddRange(
            CreatePreset("nursing", "wound_care", "Wound Care", "Soin plaies", "علاج الجروح", displayOrder: 2),
            CreatePreset("nursing", "vitals_check", "Vitals Check", "Controle constantes", "فحص المؤشرات", displayOrder: 1),
            CreatePreset("doctor", "consultation", "Consultation", "Consultation", "استشارة", displayOrder: 1));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), "nursing")),
            cache,
            logger);

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> result;
        using (new UiCultureScope("en"))
        {
            result = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        Assert.Equal(2, result.Count);
        Assert.Equal(["vitals_check", "wound_care"], result.Select(item => item.Code).ToArray());
        Assert.All(result, item => Assert.DoesNotContain("consultation", item.Code, StringComparison.Ordinal));
    }

    [Fact]
    public async Task Handle_LocalizesNameAndDescription_PerCultureWithFallbacks()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.AddRange(
            CreatePreset(
                category: "nutrition",
                code: "fallback_row",
                nameEn: "Nutrition Assessment",
                nameFr: "Bilan nutritionnel",
                nameAr: null,
                nameDe: null,
                descriptionEn: "English plan",
                descriptionFr: "Plan francais",
                descriptionAr: null,
                descriptionDe: null,
                displayOrder: 1),
            CreatePreset(
                category: "nutrition",
                code: "localized_row",
                nameEn: "Family Support",
                nameFr: "Soutien familial",
                nameAr: "دعم عائلي",
                nameDe: "Familienhilfe",
                descriptionEn: "English support",
                descriptionFr: "Support francais",
                descriptionAr: "دعم عربي",
                descriptionDe: "Deutsche Hilfe",
                displayOrder: 2));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), "nutrition")),
            cache,
            logger);

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> english;
        using (new UiCultureScope("en"))
        {
            english = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> french;
        using (new UiCultureScope("fr"))
        {
            french = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> arabic;
        using (new UiCultureScope("ar"))
        {
            arabic = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> german;
        using (new UiCultureScope("de"))
        {
            german = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        Assert.Equal("Nutrition Assessment", english[0].Name);
        Assert.Equal("English plan", english[0].Description);
        Assert.Equal("Bilan nutritionnel", french[0].Name);
        Assert.Equal("Plan francais", french[0].Description);
        Assert.Equal("Bilan nutritionnel", arabic[0].Name); // fallback to fr
        Assert.Equal("Plan francais", arabic[0].Description); // fallback to fr
        Assert.Equal("دعم عائلي", arabic[1].Name);
        Assert.Equal("دعم عربي", arabic[1].Description);
        Assert.Equal("Nutrition Assessment", german[0].Name); // fallback to en
        Assert.Equal("English plan", german[0].Description); // fallback to en
        Assert.Equal("Familienhilfe", german[1].Name);
        Assert.Equal("Deutsche Hilfe", german[1].Description);
    }

    [Fact]
    public async Task Handle_NormalizesUnsupportedCultureIntoFrenchCacheBucket()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.Add(
            CreatePreset(
                category: "nutrition",
                code: "assessment",
                nameEn: "Nutrition Assessment",
                nameFr: "Bilan nutritionnel",
                nameAr: null,
                nameDe: null,
                descriptionEn: "English plan",
                descriptionFr: "Plan francais",
                descriptionAr: null,
                descriptionDe: null,
                displayOrder: 1));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), "nutrition")),
            cache,
            logger);

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> result;
        using (new UiCultureScope("nl"))
        {
            result = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        var preset = Assert.Single(result);
        Assert.Equal("Bilan nutritionnel", preset.Name);
        Assert.Equal("Plan francais", preset.Description);
        Assert.True(cache.TryGetValue("provider-presets:nutrition:fr", out var cached));
        Assert.NotNull(cached);
        Assert.False(cache.TryGetValue("provider-presets:nutrition:nl", out _));
    }

    [Fact]
    public async Task Handle_ReturnsEmptyList_WhenCategoryHasNoPresets()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.Add(
            CreatePreset("doctor", "consultation", "Consultation", "Consultation", "استشارة", displayOrder: 1));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), "equipment_rental")),
            cache,
            logger);

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> result;
        using (new UiCultureScope("en"))
        {
            result = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        Assert.Empty(result);
        Assert.Contains(
            logger.Entries,
            entry => entry.Message.Contains("Cache miss for provider presets", StringComparison.Ordinal));
    }

    [Fact]
    public async Task Handle_LogsCacheMissAndHit_AndReusesCachedPayload()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.Add(
            CreatePreset("nursing", "wound_care", "Wound Care", "Soin plaies", "علاج الجروح", displayOrder: 1));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), "nursing")),
            cache,
            logger);

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> first;
        using (new UiCultureScope("en"))
        {
            first = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        context.ProviderServicePresets.Add(
            CreatePreset("nursing", "follow_up", "Follow Up", "Suivi", "متابعة", displayOrder: 2));
        await context.SaveChangesAsync();

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> second;
        using (new UiCultureScope("en"))
        {
            second = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        Assert.Single(first);
        Assert.Single(second);
        Assert.Equal("wound_care", second[0].Code);
        Assert.Contains(
            logger.Entries,
            entry => entry.Message.Contains("Cache miss for provider presets", StringComparison.Ordinal));
        Assert.Contains(
            logger.Entries,
            entry => entry.Message.Contains("Cache hit for provider presets", StringComparison.Ordinal));
    }

    [Fact]
    public async Task Handle_DeserializesTypeConfig_AsNativeJsonElement()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.Add(
            CreatePreset(
                category: "nutrition",
                code: "nutrition_assessment",
                nameEn: "Nutrition Assessment",
                nameFr: "Bilan nutritionnel",
                nameAr: "تقييم غذائي",
                typeConfig: "{\"subcategoryCode\":\"consultation\",\"dietTypes\":[\"diabetic\"]}",
                displayOrder: 1));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), "nutrition")),
            cache,
            logger);

        IReadOnlyList<SanadPlatform.API.Features.Services.DTOs.ProviderServicePresetResponse> result;
        using (new UiCultureScope("en"))
        {
            result = await handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
        }

        var typeConfig = Assert.Single(result).Draft.TypeConfig;
        Assert.True(typeConfig.HasValue);
        Assert.Equal(JsonValueKind.Object, typeConfig.Value.ValueKind);
        Assert.Equal("consultation", typeConfig.Value.GetProperty("subcategoryCode").GetString());
        Assert.Equal("diabetic", typeConfig.Value.GetProperty("dietTypes")[0].GetString());
    }

    [Fact]
    public async Task Handle_ThrowsKeyNotFoundException_WhenProviderProfileIsMissing()
    {
        await using var context = CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = new ListLogger<GetProviderPresetsHandler>();
        var handler = new GetProviderPresetsHandler(
            context,
            new StubProviderRepository(providerInfo: null),
            cache,
            logger);

        using (new UiCultureScope("en"))
        {
            var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
                handler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None));

            Assert.Equal("Provider profile not found.", exception.Message);
        }
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    private static ProviderServicePreset CreatePreset(
        string category,
        string code,
        string nameEn,
        string nameFr,
        string? nameAr,
        string? nameDe = null,
        string? descriptionEn = null,
        string? descriptionFr = null,
        string? descriptionAr = null,
        string? descriptionDe = null,
        decimal price = 50m,
        int? durationMinutes = 30,
        string serviceLocation = "home",
        bool requiresPrescription = false,
        bool isUrgent = false,
        bool requiresMedicalHistory = true,
        string? typeConfig = null,
        int displayOrder = 1,
        bool isActive = true)
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
            DescriptionEn = descriptionEn ?? $"{nameEn} description",
            DescriptionFr = descriptionFr ?? $"{nameFr} description",
            DescriptionAr = descriptionAr,
            DescriptionDe = descriptionDe,
            Price = price,
            PriceType = "fixed",
            Currency = "TND",
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

    private sealed class UiCultureScope : IDisposable
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

    private sealed class StubProviderRepository : IProviderRepository
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

    private sealed class ListLogger<T> : ILogger<T>
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
            Entries.Add(new LogEntry(logLevel, formatter(state, exception)));
        }
    }

    private sealed record LogEntry(LogLevel Level, string Message);

    private sealed class NullScope : IDisposable
    {
        public static NullScope Instance { get; } = new();

        public void Dispose()
        {
        }
    }
}
