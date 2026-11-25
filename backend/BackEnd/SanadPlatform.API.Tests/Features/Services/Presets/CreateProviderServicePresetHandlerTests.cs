using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class CreateProviderServicePresetHandlerTests
{
    [Fact]
    public async Task Handle_CreatesPreset_NormalizesPolicyPayload_InvalidatesCache_AndLogsStructuredFields()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());
        ProviderPresetCommandTestSupport.SeedCategoryCache(cache, "nutrition");

        var logger = new ListLogger<CreateProviderServicePresetHandler>();
        var handler = new CreateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            logger);

        var result = await handler.Handle(
            new CreateProviderServicePresetCommand(
                ProviderCategory: " nutrition ",
                Code: "nutrition_assessment",
                NameEn: "  Nutrition Assessment  ",
                NameFr: "  Bilan nutritionnel  ",
                NameAr: " تقييم غذائي ",
                NameDe: null,
                DescriptionEn: " English description ",
                DescriptionFr: " Description francaise ",
                DescriptionAr: null,
                DescriptionDe: null,
                Price: 89m,
                PriceType: "fixed",
                Currency: "tnd",
                DurationMinutes: 45,
                ServiceLocation: "home",
                RequiresPrescription: false,
                IsUrgent: true,
                RequiresMedicalHistory: true,
                TypeConfig: ProviderPresetCommandTestSupport.ParseJson("""
                {
                  "subcategoryCode": " CONSULTATION ",
                  "dietTypes": ["VEGAN", "vegan"]
                }
                """),
                IsActive: true,
                DisplayOrder: 3),
            CancellationToken.None);

        var preset = await context.ProviderServicePresets.SingleAsync();

        Assert.Equal("nutrition", preset.ProviderCategory);
        Assert.Equal("nutrition_assessment", preset.Code);
        Assert.Equal("Nutrition Assessment", preset.NameEn);
        Assert.Equal("Bilan nutritionnel", preset.NameFr);
        Assert.Equal("تقييم غذائي", preset.NameAr);
        Assert.Equal("English description", preset.DescriptionEn);
        Assert.Equal("Description francaise", preset.DescriptionFr);
        Assert.Equal("TND", preset.Currency);
        Assert.Equal("fixed", preset.PriceType);
        Assert.Equal("home", preset.ServiceLocation);
        Assert.NotEqual(default, preset.CreatedAt);
        Assert.NotEqual(default, preset.UpdatedAt);

        Assert.Equal(preset.Id, result.Id);
        Assert.True(result.TypeConfig.HasValue);
        Assert.Equal("consultation", result.TypeConfig.Value.GetProperty("subcategoryCode").GetString());
        Assert.Equal(
            ["vegan"],
            result.TypeConfig.Value.GetProperty("dietTypes").EnumerateArray().Select(item => item.GetString()!).ToArray());

        ProviderPresetCommandTestSupport.AssertCategoryCacheInvalidated(cache, "nutrition");

        var entry = Assert.Single(logger.Entries);
        Assert.Equal(LogLevel.Information, entry.Level);
        Assert.Contains("Admin created provider preset", entry.Message, StringComparison.Ordinal);
        Assert.Equal(result.Id, Assert.IsType<Guid>(entry.Properties["PresetId"]));
        Assert.Equal("nutrition", Assert.IsType<string>(entry.Properties["ProviderCategory"]));
        Assert.Equal("nutrition_assessment", Assert.IsType<string>(entry.Properties["PresetCode"]));
    }

    [Fact]
    public async Task Handle_ThrowsInvalidOperationException_WhenPresetAlreadyExists()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        context.ProviderServicePresets.Add(
            ProviderPresetCommandTestSupport.CreatePreset(category: "nutrition", code: "assessment"));
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var handler = new CreateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            new ListLogger<CreateProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new CreateProviderServicePresetCommand(
                ProviderCategory: "nutrition",
                Code: "assessment",
                NameEn: "Assessment",
                NameFr: "Bilan",
                NameAr: null,
                NameDe: null,
                DescriptionEn: null,
                DescriptionFr: null,
                DescriptionAr: null,
                DescriptionDe: null,
                Price: 50m,
                PriceType: "fixed",
                Currency: "TND",
                DurationMinutes: 30,
                ServiceLocation: "home",
                RequiresPrescription: false,
                IsUrgent: false,
                RequiresMedicalHistory: false,
                TypeConfig: ProviderPresetCommandTestSupport.ParseJson("""
                {
                  "subcategoryCode": "consultation"
                }
                """),
                IsActive: true,
                DisplayOrder: 1),
            CancellationToken.None));

        Assert.Equal("A preset with this category and code already exists.", exception.Message);
        Assert.Equal(1, await context.ProviderServicePresets.CountAsync());
    }

    [Fact]
    public async Task Handle_ThrowsInvalidOperationException_WhenStrictPolicyTypeConfigIsInvalid()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());

        var handler = new CreateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            new ListLogger<CreateProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new CreateProviderServicePresetCommand(
                ProviderCategory: "nutrition",
                Code: "invalid_nutrition_payload",
                NameEn: "Assessment",
                NameFr: "Bilan",
                NameAr: null,
                NameDe: null,
                DescriptionEn: null,
                DescriptionFr: null,
                DescriptionAr: null,
                DescriptionDe: null,
                Price: 50m,
                PriceType: "fixed",
                Currency: "TND",
                DurationMinutes: 30,
                ServiceLocation: "home",
                RequiresPrescription: false,
                IsUrgent: false,
                RequiresMedicalHistory: false,
                TypeConfig: ProviderPresetCommandTestSupport.ParseJson("""
                {
                  "dietTypes": ["vegan"]
                }
                """),
                IsActive: true,
                DisplayOrder: 1),
            CancellationToken.None));

        Assert.Equal("typeConfig.subcategoryCode is required and must be a non-empty string.", exception.Message);
        Assert.Equal(0, await context.ProviderServicePresets.CountAsync());
    }

    [Fact]
    public async Task Handle_ThrowsInvalidOperationException_WhenProviderCategoryIsUnknown()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());

        var handler = new CreateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            new ListLogger<CreateProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new CreateProviderServicePresetCommand(
                ProviderCategory: "unknown_category",
                Code: "assessment",
                NameEn: "Assessment",
                NameFr: "Bilan",
                NameAr: null,
                NameDe: null,
                DescriptionEn: null,
                DescriptionFr: null,
                DescriptionAr: null,
                DescriptionDe: null,
                Price: 50m,
                PriceType: "fixed",
                Currency: "TND",
                DurationMinutes: 30,
                ServiceLocation: "home",
                RequiresPrescription: false,
                IsUrgent: false,
                RequiresMedicalHistory: false,
                TypeConfig: null,
                IsActive: true,
                DisplayOrder: 1),
            CancellationToken.None));

        Assert.Equal("Unsupported provider category 'unknown_category'.", exception.Message);
        Assert.Empty(context.ProviderServicePresets);
    }
}
