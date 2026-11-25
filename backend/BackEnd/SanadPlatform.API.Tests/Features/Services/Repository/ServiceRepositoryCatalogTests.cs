using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Features.Services.Specifications;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Services.Repository;

public class ServiceRepositoryCatalogTests
{
    [Fact]
    public async Task GetCatalogAsync_MapsTypeConfig_UsesGalleryFallback_AndFiltersInactiveAddons()
    {
        await using var context = CreateContext();

        var service = CreateService(
            providerBusinessName: "Nutrition Pro",
            serviceName: "Nutrition Consultation",
            metadata: """
            {"subcategoryCode":"consultation","dietTypeCode":"diabetic"}
            """);

        service.ImageUrl = null;
        service.GalleryUrls = ["https://cdn.example.com/services/nutrition-consultation.jpg"];
        service.Addons.Add(new ServiceAddon
        {
            Id = Guid.NewGuid(),
            ServiceId = service.Id,
            Name = "Follow-up Call",
            Description = "15-minute follow-up call",
            Price = 15m,
            DurationMinutes = 15,
            Icon = "phone",
            IsSupplement = false,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        service.Addons.Add(new ServiceAddon
        {
            Id = Guid.NewGuid(),
            ServiceId = service.Id,
            Name = "Inactive Addon",
            Description = "Should not be exposed",
            Price = 5m,
            DurationMinutes = 5,
            Icon = "x",
            IsSupplement = false,
            IsActive = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        context.Services.Add(service);
        await context.SaveChangesAsync();

        var repository = new ServiceRepository(context, NullLogger<ServiceRepository>.Instance);
        var result = await repository.GetCatalogAsync(CreateSpecification(), CancellationToken.None);

        var item = Assert.Single(result.Items);
        var typeConfig = Assert.IsType<JsonElement>(item.TypeConfig);

        Assert.Equal(JsonValueKind.Object, typeConfig.ValueKind);
        Assert.Equal("consultation", typeConfig.GetProperty("subcategoryCode").GetString());
        Assert.Equal("diabetic", typeConfig.GetProperty("dietTypeCode").GetString());
        Assert.Equal("https://cdn.example.com/services/nutrition-consultation.jpg", item.ImageUrl);

        var subService = Assert.Single(item.SubServices);
        Assert.Equal("Follow-up Call", subService.Name);
        Assert.True(subService.IsActive);

        Assert.Equal("Nutrition Pro", item.Provider.Name);
        Assert.Equal(1, result.Pagination.Page);
        Assert.Equal(10, result.Pagination.Limit);
        Assert.Equal(1, result.Pagination.Total);
        Assert.Equal(1, result.Pagination.TotalPages);
    }

    [Fact]
    public async Task GetCatalogAsync_ReturnsNullTypeConfig_WhenMetadataIsMissingOrMalformed()
    {
        await using var context = CreateContext();

        var missingMetadataService = CreateService(
            providerBusinessName: "Nutrition Missing Metadata",
            serviceName: "Missing Metadata Service",
            metadata: null);

        var malformedMetadataService = CreateService(
            providerBusinessName: "Nutrition Bad Metadata",
            serviceName: "Malformed Metadata Service",
            metadata: "{bad json}");

        context.Services.AddRange(missingMetadataService, malformedMetadataService);
        await context.SaveChangesAsync();

        var repository = new ServiceRepository(context, NullLogger<ServiceRepository>.Instance);
        var result = await repository.GetCatalogAsync(CreateSpecification(limit: 20), CancellationToken.None);
        var itemsByName = result.Items.ToDictionary(item => item.Name, StringComparer.Ordinal);

        Assert.Null(itemsByName["Missing Metadata Service"].TypeConfig);
        Assert.Empty(itemsByName["Missing Metadata Service"].SubServices);
        Assert.Null(itemsByName["Malformed Metadata Service"].TypeConfig);
        Assert.Empty(itemsByName["Malformed Metadata Service"].SubServices);
        Assert.Equal(2, result.Pagination.Total);
    }

    [Fact]
    public async Task GetPagedSummaryAsync_ProjectsDescriptionAndServiceLocation()
    {
        await using var context = CreateContext();

        var service = CreateService(
            providerBusinessName: "Summary Provider",
            serviceName: "Clinic Visit",
            metadata: null);

        service.Description = "Detailed provider-managed description.";
        service.ServiceLocation = "clinic";
        service.Addons.Add(new ServiceAddon
        {
            Id = Guid.NewGuid(),
            ServiceId = service.Id,
            Name = "Wheelchair Assistance",
            Description = "Optional clinic entry assistance",
            Price = 20m,
            DurationMinutes = 15,
            Icon = "accessibility",
            IsSupplement = false,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        context.Services.Add(service);
        await context.SaveChangesAsync();

        var repository = new ServiceRepository(context, NullLogger<ServiceRepository>.Instance);
        var specification = new ProviderServiceSpecification(service.ProviderId, page: 1, limit: 10);

        var (items, total) = await repository.GetPagedSummaryAsync(specification, CancellationToken.None);

        var item = Assert.Single(items);
        Assert.Equal(1, total);
        Assert.Equal(service.ShortDescription, item.ShortDescription);
        Assert.Equal(service.Description, item.Description);
        Assert.Equal("clinic", item.ServiceLocation);
        Assert.Equal(1, item.SubServiceCount);
    }

    private static ServiceCatalogSpecification CreateSpecification(int limit = 10)
    {
        return new ServiceCatalogSpecification(
            new GetServiceCatalogRequest
            {
                Category = ServiceCategories.Nutrition,
                SortBy = "createdAt",
                SortDesc = true,
                Page = 1,
                Limit = limit
            },
            categoryCodes: null);
    }

    private static Service CreateService(
        string providerBusinessName,
        string serviceName,
        string? metadata)
    {
        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = "hashed-password",
            Role = "provider",
            CreatedAt = now,
            UpdatedAt = now
        };

        var provider = new Provider
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            ServiceCategory = ServiceCategories.Nutrition,
            BusinessName = providerBusinessName,
            City = "Tunis",
            IsApproved = true,
            IsVerified = true,
            RatingAverage = 4.7m,
            RatingCount = 23,
            CreatedAt = now,
            UpdatedAt = now
        };

        return new Service
        {
            Id = Guid.NewGuid(),
            ProviderId = provider.Id,
            Provider = provider,
            Category = ServiceCategories.Nutrition,
            Name = serviceName,
            ShortDescription = "Localized nutrition service",
            Description = "A nutrition service used for repository tests.",
            Price = 120m,
            PriceType = "fixed",
            Currency = "EUR",
            ServiceLocation = "home",
            RequiresPrescription = false,
            DurationMinutes = 45,
            Metadata = metadata,
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }
}
