using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Features.Services.Commands;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class UpdateProviderServicePresetHandlerTests
{
    [Fact]
    public async Task Handle_UpdatesMutableFields_ReNormalizesTypeConfig_InvalidatesCache_AndLogsStructuredFields()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var preset = ProviderPresetCommandTestSupport.CreatePreset(
            category: "nutrition",
            code: "assessment",
            nameEn: "Initial name",
            nameFr: "Nom initial",
            typeConfig: """
            {"subcategoryCode":"consultation","dietTypes":["diabetic"]}
            """);
        context.ProviderServicePresets.Add(preset);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        ProviderPresetCommandTestSupport.SeedCategoryCache(cache, "nutrition");

        var logger = new ListLogger<UpdateProviderServicePresetHandler>();
        var handler = new UpdateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            logger);

        var result = await handler.Handle(
            new UpdateProviderServicePresetCommand(
                Id: preset.Id,
                NameEn: " Updated assessment ",
                NameFr: " Bilan mis a jour ",
                NameAr: " تقييم محدث ",
                NameDe: " Aktualisiert ",
                DescriptionEn: " Updated EN ",
                DescriptionFr: " Updated FR ",
                DescriptionAr: " وصف محدث ",
                DescriptionDe: " Beschreibung ",
                Price: 95m,
                PriceType: "fixed",
                Currency: "eur",
                DurationMinutes: 60,
                ServiceLocation: "home",
                RequiresPrescription: true,
                IsUrgent: false,
                RequiresMedicalHistory: true,
                TypeConfig: ProviderPresetCommandTestSupport.ParseJson("""
                {
                  "subcategoryCode": "MEAL_PLAN",
                  "dietTypes": ["VEGAN", "vegan", "gluten_free"]
                }
                """),
                IsActive: false,
                DisplayOrder: 8),
            CancellationToken.None);

        var stored = await context.ProviderServicePresets.SingleAsync();

        Assert.Equal("nutrition", result.ProviderCategory);
        Assert.Equal("assessment", result.Code);
        Assert.Equal("nutrition", stored.ProviderCategory);
        Assert.Equal("assessment", stored.Code);
        Assert.Equal("Updated assessment", result.NameEn);
        Assert.Equal("Bilan mis a jour", result.NameFr);
        Assert.Equal("تقييم محدث", result.NameAr);
        Assert.Equal("Aktualisiert", result.NameDe);
        Assert.Equal("Updated EN", result.DescriptionEn);
        Assert.Equal("Updated FR", result.DescriptionFr);
        Assert.Equal("EUR", result.Currency);
        Assert.Equal(95m, result.Price);
        Assert.Equal(60, result.DurationMinutes);
        Assert.False(result.IsActive);
        Assert.Equal(8, result.DisplayOrder);
        Assert.True(result.TypeConfig.HasValue);
        Assert.Equal("meal_plan", result.TypeConfig.Value.GetProperty("subcategoryCode").GetString());
        Assert.Equal(
            ["vegan", "gluten_free"],
            result.TypeConfig.Value.GetProperty("dietTypes").EnumerateArray().Select(item => item.GetString()!).ToArray());

        ProviderPresetCommandTestSupport.AssertCategoryCacheInvalidated(cache, "nutrition");

        var entry = Assert.Single(logger.Entries);
        Assert.Equal(LogLevel.Information, entry.Level);
        Assert.Contains("Admin updated provider preset", entry.Message, StringComparison.Ordinal);
        Assert.Equal(preset.Id, Assert.IsType<Guid>(entry.Properties["PresetId"]));
        Assert.Equal("nutrition", Assert.IsType<string>(entry.Properties["ProviderCategory"]));
        Assert.Equal("assessment", Assert.IsType<string>(entry.Properties["PresetCode"]));
    }

    [Fact]
    public async Task Handle_ThrowsKeyNotFoundException_WhenPresetDoesNotExist()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        using var cache = new MemoryCache(new MemoryCacheOptions());

        var handler = new UpdateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            new ListLogger<UpdateProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(
            new UpdateProviderServicePresetCommand(
                Id: Guid.NewGuid(),
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

        Assert.StartsWith("Provider service preset", exception.Message, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Handle_RevalidatesExistingTypeConfig_WhenPolicyRequiresItAndRelevantFieldsChange()
    {
        await using var context = ProviderPresetCommandTestSupport.CreateContext();
        var preset = ProviderPresetCommandTestSupport.CreatePreset(
            category: "equipment_rental",
            code: "wheelchair_daily",
            nameEn: "Wheelchair",
            nameFr: "Fauteuil roulant",
            price: 20m,
            typeConfig: """
            {
              "equipment_type_code": "wheelchair",
              "pricing": {
                "weekly": 100,
                "monthly": 300
              },
              "deposit_amount": 0
            }
            """);
        context.ProviderServicePresets.Add(preset);
        await context.SaveChangesAsync();

        using var cache = new MemoryCache(new MemoryCacheOptions());
        var handler = new UpdateProviderServicePresetHandler(
            context,
            ProviderPresetCommandTestSupport.CreatePolicyRegistry(),
            context,
            cache,
            new ListLogger<UpdateProviderServicePresetHandler>());

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new UpdateProviderServicePresetCommand(
                Id: preset.Id,
                NameEn: preset.NameEn,
                NameFr: preset.NameFr,
                NameAr: preset.NameAr,
                NameDe: preset.NameDe,
                DescriptionEn: preset.DescriptionEn,
                DescriptionFr: preset.DescriptionFr,
                DescriptionAr: preset.DescriptionAr,
                DescriptionDe: preset.DescriptionDe,
                Price: 0m,
                PriceType: preset.PriceType,
                Currency: preset.Currency,
                DurationMinutes: preset.DurationMinutes,
                ServiceLocation: preset.ServiceLocation,
                RequiresPrescription: preset.RequiresPrescription,
                IsUrgent: preset.IsUrgent,
                RequiresMedicalHistory: preset.RequiresMedicalHistory,
                TypeConfig: null,
                IsActive: preset.IsActive,
                DisplayOrder: preset.DisplayOrder),
            CancellationToken.None));

        Assert.Equal("Equipment rental services require a positive price (daily rate).", exception.Message);
    }
}
