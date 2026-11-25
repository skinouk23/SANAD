using Microsoft.Extensions.Caching.Memory;
using SanadPlatform.API.Features.Services.Commands;
using SanadPlatform.API.Features.Services.Helpers;
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class PresetCacheFreshnessTests
{
    [Fact]
    public async Task Handle_CreateAfterCachedProviderRead_InvalidatesCache_AndNextReadReturnsFreshData()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        context.ProviderServicePresets.Add(
            ProviderPresetCommandTestSupport.CreatePreset(
                category: "nutrition",
                code: "assessment",
                displayOrder: 0));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var providerLogger = new ListLogger<GetProviderPresetsHandler>();
        var providerHandler = CreateProviderHandler(context, cache, providerLogger, "nutrition");

        using (new UiCultureScope("en"))
        {
            var first = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
            var second = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Single(first);
            Assert.Single(second);
        }

        Assert.True(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "en"), out _));
        Assert.Equal(1, CountMessages(providerLogger, "Cache miss for provider presets"));
        Assert.Equal(1, CountMessages(providerLogger, "Cache hit for provider presets"));

        var createHandler = CreateCreateHandler(context, cache);
        await createHandler.Handle(
            CreateNutritionCommand(
                code: "meal_plan",
                nameEn: "Meal Plan",
                nameFr: "Plan repas",
                displayOrder: 1,
                subcategoryCode: "meal_plan"),
            CancellationToken.None);

        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "en"), out _));

        using (new UiCultureScope("en"))
        {
            var refreshed = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Equal(["assessment", "meal_plan"], refreshed.Select(item => item.Code).ToArray());
        }

        Assert.Equal(2, CountMessages(providerLogger, "Cache miss for provider presets"));
    }

    [Fact]
    public async Task Handle_UnsupportedCultureUsesFrenchBucket_AndAdminMutationInvalidatesThatBucket()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        context.ProviderServicePresets.Add(
            ProviderPresetCommandTestSupport.CreatePreset(
                category: "nutrition",
                code: "assessment",
                displayOrder: 0));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var providerLogger = new ListLogger<GetProviderPresetsHandler>();
        var providerHandler = CreateProviderHandler(context, cache, providerLogger, "nutrition");

        using (new UiCultureScope("nl"))
        {
            var first = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
            var second = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Single(first);
            Assert.Single(second);
            Assert.Equal(["Bilan"], first.Select(item => item.Name).ToArray());
        }

        Assert.True(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "fr"), out _));
        Assert.False(cache.TryGetValue("provider-presets:nutrition:nl", out _));
        Assert.Equal(1, CountMessages(providerLogger, "Cache miss for provider presets"));
        Assert.Equal(1, CountMessages(providerLogger, "Cache hit for provider presets"));

        var createHandler = CreateCreateHandler(context, cache);
        await createHandler.Handle(
            CreateNutritionCommand(
                code: "meal_delivery",
                nameEn: "Meal Delivery",
                nameFr: "Livraison repas",
                displayOrder: 1,
                subcategoryCode: "meal_delivery"),
            CancellationToken.None);

        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "fr"), out _));
        Assert.False(cache.TryGetValue("provider-presets:nutrition:nl", out _));

        using (new UiCultureScope("nl"))
        {
            var refreshed = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Equal(["Bilan", "Livraison repas"], refreshed.Select(item => item.Name).ToArray());
        }

        Assert.Equal(2, CountMessages(providerLogger, "Cache miss for provider presets"));
    }

    [Fact]
    public async Task Handle_ToggleAfterCachedProviderRead_HidesInactivePreset_AndToggleBackRestoresIt()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var preset = ProviderPresetCommandTestSupport.CreatePreset(
            category: "nutrition",
            code: "assessment",
            displayOrder: 0,
            isActive: true);
        context.ProviderServicePresets.Add(preset);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var providerLogger = new ListLogger<GetProviderPresetsHandler>();
        var providerHandler = CreateProviderHandler(context, cache, providerLogger, "nutrition");
        var toggleHandler = new ToggleProviderServicePresetHandler(
            context,
            context,
            cache,
            new ListLogger<ToggleProviderServicePresetHandler>());

        using (new UiCultureScope("en"))
        {
            var first = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);
            var second = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Single(first);
            Assert.Single(second);
        }

        Assert.True(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "en"), out _));

        await toggleHandler.Handle(new ToggleProviderServicePresetCommand(preset.Id, false), CancellationToken.None);

        Assert.False(cache.TryGetValue(ProviderPresetCacheHelper.GetCacheKey("nutrition", "en"), out _));

        using (new UiCultureScope("en"))
        {
            var inactive = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Empty(inactive);
        }

        await toggleHandler.Handle(new ToggleProviderServicePresetCommand(preset.Id, true), CancellationToken.None);

        using (new UiCultureScope("en"))
        {
            var restored = await providerHandler.Handle(new GetProviderPresetsQuery(Guid.NewGuid()), CancellationToken.None);

            Assert.Equal(["assessment"], restored.Select(item => item.Code).ToArray());
        }

        Assert.Equal(3, CountMessages(providerLogger, "Cache miss for provider presets"));
        Assert.Equal(1, CountMessages(providerLogger, "Cache hit for provider presets"));
    }

    private static GetProviderPresetsHandler CreateProviderHandler(
        SanadDbContext context,
        IMemoryCache cache,
        ListLogger<GetProviderPresetsHandler> logger,
        string category)
    {
        return new GetProviderPresetsHandler(
            context,
            new StubProviderRepository((Guid.NewGuid(), category)),
            cache,
            logger);
    }

    private static CreateProviderServicePresetHandler CreateCreateHandler(
        SanadDbContext context,
        IMemoryCache cache)
    {
        return new CreateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            new ListLogger<CreateProviderServicePresetHandler>());
    }

    private static CreateProviderServicePresetCommand CreateNutritionCommand(
        string code,
        string nameEn,
        string nameFr,
        int displayOrder,
        string subcategoryCode)
    {
        return new CreateProviderServicePresetCommand(
            ProviderCategory: "nutrition",
            Code: code,
            NameEn: nameEn,
            NameFr: nameFr,
            NameAr: null,
            NameDe: null,
            DescriptionEn: $"{nameEn} description",
            DescriptionFr: $"{nameFr} description",
            DescriptionAr: null,
            DescriptionDe: null,
            Price: 60m,
            PriceType: "fixed",
            Currency: "TND",
            DurationMinutes: 30,
            ServiceLocation: "home",
            RequiresPrescription: false,
            IsUrgent: false,
            RequiresMedicalHistory: false,
            TypeConfig: ProviderPresetCommandTestSupport.ParseJson($$"""
            {
              "subcategoryCode": "{{subcategoryCode}}"
            }
            """),
            IsActive: true,
            DisplayOrder: displayOrder);
    }

    private static int CountMessages<T>(ListLogger<T> logger, string contains)
    {
        return logger.Entries.Count(entry => entry.Message.Contains(contains, StringComparison.Ordinal));
    }
}
