using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Queries;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Services.Presets;

public class GetAdminProviderServicePresetsHandlerTests
{
    [Fact]
    public async Task Handle_ReturnsActiveAndInactivePresets_OrderedByDisplayOrderThenCode()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.AddRange(
            CreatePreset(
                category: "nutrition",
                code: "beta",
                nameEn: "Beta EN",
                nameFr: "Beta FR",
                nameAr: "بيتا",
                nameDe: "Beta DE",
                descriptionEn: "Beta description EN",
                descriptionFr: "Beta description FR",
                descriptionAr: "Beta description AR",
                descriptionDe: "Beta description DE",
                price: 70m,
                durationMinutes: 45,
                requiresPrescription: true,
                isUrgent: false,
                requiresMedicalHistory: true,
                typeConfig: "{\"subcategoryCode\":\"consultation\"}",
                displayOrder: 1,
                isActive: false),
            CreatePreset(
                category: "nutrition",
                code: "alpha",
                nameEn: "Alpha EN",
                nameFr: "Alpha FR",
                nameAr: "ألفا",
                nameDe: "Alpha DE",
                descriptionEn: "Alpha description EN",
                descriptionFr: "Alpha description FR",
                descriptionAr: "Alpha description AR",
                descriptionDe: "Alpha description DE",
                price: 50m,
                durationMinutes: 30,
                requiresPrescription: false,
                isUrgent: true,
                requiresMedicalHistory: false,
                typeConfig: null,
                displayOrder: 1,
                isActive: true),
            CreatePreset(
                category: "nutrition",
                code: "gamma",
                nameEn: "Gamma EN",
                nameFr: "Gamma FR",
                nameAr: null,
                nameDe: null,
                descriptionEn: "Gamma description EN",
                descriptionFr: "Gamma description FR",
                descriptionAr: null,
                descriptionDe: null,
                price: 90m,
                durationMinutes: 60,
                requiresPrescription: false,
                isUrgent: false,
                requiresMedicalHistory: true,
                typeConfig: null,
                displayOrder: 2,
                isActive: true),
            CreatePreset(
                category: "nursing",
                code: "ignored",
                nameEn: "Ignored EN",
                nameFr: "Ignored FR",
                nameAr: null,
                nameDe: null,
                descriptionEn: "Ignored description EN",
                descriptionFr: "Ignored description FR",
                descriptionAr: null,
                descriptionDe: null,
                price: 10m,
                durationMinutes: 10,
                requiresPrescription: false,
                isUrgent: false,
                requiresMedicalHistory: false,
                typeConfig: null,
                displayOrder: 1,
                isActive: true));
        await context.SaveChangesAsync();

        var handler = new GetAdminProviderServicePresetsHandler(context);

        var result = await handler.Handle(
            new GetAdminProviderServicePresetsQuery("nutrition"),
            CancellationToken.None);

        Assert.Equal(["alpha", "beta", "gamma"], result.Select(item => item.Code).ToArray());
        Assert.Equal([true, false, true], result.Select(item => item.IsActive).ToArray());

        var beta = result[1];
        Assert.Equal("nutrition", beta.ProviderCategory);
        Assert.Equal("Beta EN", beta.NameEn);
        Assert.Equal("Beta FR", beta.NameFr);
        Assert.Equal("بيتا", beta.NameAr);
        Assert.Equal("Beta DE", beta.NameDe);
        Assert.Equal("Beta description EN", beta.DescriptionEn);
        Assert.Equal("Beta description FR", beta.DescriptionFr);
        Assert.Equal("Beta description AR", beta.DescriptionAr);
        Assert.Equal("Beta description DE", beta.DescriptionDe);
        Assert.Equal(70m, beta.Price);
        Assert.Equal("fixed", beta.PriceType);
        Assert.Equal("TND", beta.Currency);
        Assert.Equal(45, beta.DurationMinutes);
        Assert.Equal("home", beta.ServiceLocation);
        Assert.True(beta.RequiresPrescription);
        Assert.False(beta.IsUrgent);
        Assert.True(beta.RequiresMedicalHistory);
        Assert.Equal(1, beta.DisplayOrder);
        Assert.NotEqual(default, beta.CreatedAt);
        Assert.NotEqual(default, beta.UpdatedAt);
        Assert.True(beta.TypeConfig.HasValue);
        Assert.Equal(JsonValueKind.Object, beta.TypeConfig.Value.ValueKind);
        Assert.Equal("consultation", beta.TypeConfig.Value.GetProperty("subcategoryCode").GetString());
    }

    [Fact]
    public async Task Handle_ReturnsEmptyList_WhenProviderCategoryIsBlank()
    {
        await using var context = CreateContext();
        context.ProviderServicePresets.Add(
            CreatePreset(
                category: "nutrition",
                code: "assessment",
                nameEn: "Assessment EN",
                nameFr: "Assessment FR",
                nameAr: null,
                nameDe: null,
                descriptionEn: "Assessment description EN",
                descriptionFr: "Assessment description FR",
                descriptionAr: null,
                descriptionDe: null,
                price: 25m,
                durationMinutes: 20,
                requiresPrescription: false,
                isUrgent: false,
                requiresMedicalHistory: false,
                typeConfig: null,
                displayOrder: 1,
                isActive: true));
        await context.SaveChangesAsync();

        var handler = new GetAdminProviderServicePresetsHandler(context);

        var result = await handler.Handle(
            new GetAdminProviderServicePresetsQuery("   "),
            CancellationToken.None);

        Assert.Empty(result);
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
        string? nameDe,
        string? descriptionEn,
        string? descriptionFr,
        string? descriptionAr,
        string? descriptionDe,
        decimal price,
        int? durationMinutes,
        bool requiresPrescription,
        bool isUrgent,
        bool requiresMedicalHistory,
        string? typeConfig,
        int displayOrder,
        bool isActive)
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
            PriceType = "fixed",
            Currency = "TND",
            DurationMinutes = durationMinutes,
            ServiceLocation = "home",
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
