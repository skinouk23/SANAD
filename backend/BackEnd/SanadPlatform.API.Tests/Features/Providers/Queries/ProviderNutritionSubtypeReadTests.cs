using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Mappings;
using SanadPlatform.API.Features.Providers.Queries;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers.Queries;

public class ProviderNutritionSubtypeReadTests
{
    [Fact]
    public async Task Handlers_ProjectPersistedNutritionSubtypeAcrossListDetailAndProfile()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(ServiceCategories.Nutrition, NutritionProviderSubtype.Chef, "Chef Amal");

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context, mapper);
        var listHandler = new GetPaginatedProvidersQueryHandler(
            repository,
            NullLogger<GetPaginatedProvidersQueryHandler>.Instance);
        var detailHandler = new GetProviderByIdQueryHandler(
            repository,
            NullLogger<GetProviderByIdQueryHandler>.Instance);
        var profileHandler = new GetMyProviderProfileQueryHandler(
            repository,
            mapper,
            NullLogger<GetMyProviderProfileQueryHandler>.Instance);

        var listResponse = await listHandler.Handle(
            new GetPaginatedProvidersQuery(
                Page: 1,
                Limit: 10,
                Status: null,
                ServiceCategory: ServiceCategories.Nutrition,
                SearchQuery: null,
                SortBy: "created",
                SortDesc: false,
                City: null),
            CancellationToken.None);
        var listItem = Assert.Single(listResponse.Items);

        var detailResponse = await detailHandler.Handle(
            new GetProviderByIdQuery(provider.Id),
            CancellationToken.None);

        var profileResponse = await profileHandler.Handle(
            new GetMyProviderProfileQuery(provider.UserId),
            CancellationToken.None);

        Assert.Equal(1, listResponse.Pagination.Total);
        Assert.Equal("Chef", listItem.NutritionProviderSubtype);
        Assert.Equal("Chef", detailResponse.NutritionProviderSubtype);
        Assert.NotNull(profileResponse);
        Assert.Equal("Chef", profileResponse!.NutritionProviderSubtype);
        Assert.Equal(listItem.NutritionProviderSubtype, detailResponse.NutritionProviderSubtype);
        Assert.Equal(detailResponse.NutritionProviderSubtype, profileResponse.NutritionProviderSubtype);
    }

    [Fact]
    public async Task Handlers_LeaveNutritionProviderSubtypeNull_WhenNutritionProviderIsUnclassified()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(ServiceCategories.Nutrition, null, "Nutrition Center");

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context, mapper);
        var listHandler = new GetPaginatedProvidersQueryHandler(
            repository,
            NullLogger<GetPaginatedProvidersQueryHandler>.Instance);
        var detailHandler = new GetProviderByIdQueryHandler(
            repository,
            NullLogger<GetProviderByIdQueryHandler>.Instance);
        var profileHandler = new GetMyProviderProfileQueryHandler(
            repository,
            mapper,
            NullLogger<GetMyProviderProfileQueryHandler>.Instance);

        var listResponse = await listHandler.Handle(
            new GetPaginatedProvidersQuery(
                Page: 1,
                Limit: 10,
                Status: null,
                ServiceCategory: ServiceCategories.Nutrition,
                SearchQuery: null,
                SortBy: "created",
                SortDesc: false,
                City: null),
            CancellationToken.None);
        var listItem = Assert.Single(listResponse.Items);

        var detailResponse = await detailHandler.Handle(
            new GetProviderByIdQuery(provider.Id),
            CancellationToken.None);

        var profileResponse = await profileHandler.Handle(
            new GetMyProviderProfileQuery(provider.UserId),
            CancellationToken.None);

        Assert.Null(listItem.NutritionProviderSubtype);
        Assert.Null(detailResponse.NutritionProviderSubtype);
        Assert.NotNull(profileResponse);
        Assert.Null(profileResponse!.NutritionProviderSubtype);
    }

    [Fact]
    public async Task Handlers_KeepNutritionProviderSubtypeNull_ForNonNutritionProviders()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(ServiceCategories.Doctor, null, "Dr. Selim");

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var repository = CreateRepository(context, mapper);
        var listHandler = new GetPaginatedProvidersQueryHandler(
            repository,
            NullLogger<GetPaginatedProvidersQueryHandler>.Instance);
        var detailHandler = new GetProviderByIdQueryHandler(
            repository,
            NullLogger<GetProviderByIdQueryHandler>.Instance);
        var profileHandler = new GetMyProviderProfileQueryHandler(
            repository,
            mapper,
            NullLogger<GetMyProviderProfileQueryHandler>.Instance);

        var listResponse = await listHandler.Handle(
            new GetPaginatedProvidersQuery(
                Page: 1,
                Limit: 10,
                Status: null,
                ServiceCategory: ServiceCategories.Doctor,
                SearchQuery: null,
                SortBy: "created",
                SortDesc: false,
                City: null),
            CancellationToken.None);
        var listItem = Assert.Single(listResponse.Items);

        var detailResponse = await detailHandler.Handle(
            new GetProviderByIdQuery(provider.Id),
            CancellationToken.None);

        var profileResponse = await profileHandler.Handle(
            new GetMyProviderProfileQuery(provider.UserId),
            CancellationToken.None);

        Assert.Null(listItem.NutritionProviderSubtype);
        Assert.Null(detailResponse.NutritionProviderSubtype);
        Assert.NotNull(profileResponse);
        Assert.Null(profileResponse!.NutritionProviderSubtype);
    }

    private static ProviderRepository CreateRepository(SanadDbContext context, IMapper mapper)
    {
        return new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance);
    }

    private static IMapper CreateMapper()
    {
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile<ProviderMappingProfile>());
        return configuration.CreateMapper();
    }

    private static Provider CreateProvider(
        string serviceCategory,
        NutritionProviderSubtype? nutritionProviderSubtype,
        string displayName)
    {
        var now = DateTime.UtcNow;
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = "hashed-password",
            Phone = "+21620123456",
            Role = "provider",
            CreatedAt = now,
            UpdatedAt = now
        };

        return new Provider
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            ServiceCategory = serviceCategory,
            NutritionProviderSubtype = nutritionProviderSubtype,
            BusinessName = displayName,
            City = "Tunis",
            CountryCode = "TN",
            Specializations = ["Healthy meals"],
            IsApproved = true,
            IsVerified = true,
            IsAvailable = true,
            AvailabilityStatus = "available",
            Timezone = "Africa/Tunis",
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
