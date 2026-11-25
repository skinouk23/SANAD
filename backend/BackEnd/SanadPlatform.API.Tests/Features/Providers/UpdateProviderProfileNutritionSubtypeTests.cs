using AutoMapper;
using FluentValidation.TestHelper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Providers.Commands;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Mappings;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Validators;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers;

public class UpdateProviderProfileNutritionSubtypeTests
{
    [Fact]
    public void Validator_RejectsUnknownNutritionProviderSubtype()
    {
        var validator = new UpdateProviderProfileValidator();
        var command = CreateCommand(
            userId: Guid.NewGuid(),
            nutritionProviderSubtype: "SousChef");

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NutritionProviderSubtype)
            .WithErrorMessage("Nutrition provider subtype must be one of: Restaurant, Chef, Nutritionist");
    }

    [Fact]
    public async Task Handler_UpdatesNutritionProviderSubtype_ForNutritionProviders()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(ServiceCategories.Nutrition, NutritionProviderSubtype.Restaurant, "Maison Nutrition");
        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = CreateHandler(context, mapper);

        var response = await handler.Handle(
            CreateCommand(
                userId: provider.UserId,
                city: "Sousse",
                nutritionProviderSubtype: "Chef"),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persistedProvider = await context.Providers.AsNoTracking().SingleAsync();

        Assert.NotNull(response);
        Assert.Equal("Chef", response!.NutritionProviderSubtype);
        Assert.Equal("Sousse", response.City);
        Assert.Equal(NutritionProviderSubtype.Chef, persistedProvider.NutritionProviderSubtype);
        Assert.Equal("Sousse", persistedProvider.City);
    }

    [Fact]
    public async Task Handler_RejectsSubtypeUpdate_ForNonNutritionProviders()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(ServiceCategories.Doctor, null, "Dr. Selim");
        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = CreateHandler(context, mapper);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            CreateCommand(
                userId: provider.UserId,
                nutritionProviderSubtype: "Chef"),
            CancellationToken.None));

        context.ChangeTracker.Clear();
        var persistedProvider = await context.Providers.AsNoTracking().SingleAsync();

        Assert.Equal(
            "Nutrition provider subtype can only be updated when the persisted provider category is 'nutrition'.",
            exception.Message);
        Assert.Null(persistedProvider.NutritionProviderSubtype);
    }

    [Fact]
    public async Task Handler_LeavesExistingSubtypeUntouched_WhenFieldIsOmitted()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(ServiceCategories.Nutrition, NutritionProviderSubtype.Nutritionist, "Hana Turki");
        provider.ServiceRadiusKm = 35;
        provider.Specializations = ["Meal plans", "Diabetes"];
        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = CreateHandler(context, mapper);

        var response = await handler.Handle(
            CreateCommand(
                userId: provider.UserId,
                city: "Nabeul"),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persistedProvider = await context.Providers.AsNoTracking().SingleAsync();

        Assert.NotNull(response);
        Assert.Equal("Nutritionist", response!.NutritionProviderSubtype);
        Assert.Equal("Nabeul", response.City);
        Assert.Equal(35, response.ServiceRadius);
        Assert.Equal("Meal plans, Diabetes", response.Specialization);
        Assert.Equal(NutritionProviderSubtype.Nutritionist, persistedProvider.NutritionProviderSubtype);
        Assert.Equal(35, persistedProvider.ServiceRadiusKm);
        Assert.Collection(
            persistedProvider.Specializations,
            specialization => Assert.Equal("Meal plans", specialization),
            specialization => Assert.Equal("Diabetes", specialization));
    }

    private static UpdateProviderProfileCommandHandler CreateHandler(SanadDbContext context, IMapper mapper)
    {
        return new UpdateProviderProfileCommandHandler(
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            context,
            mapper,
            NullLogger<UpdateProviderProfileCommandHandler>.Instance);
    }

    private static IMapper CreateMapper()
    {
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile<ProviderMappingProfile>());
        return configuration.CreateMapper();
    }

    private static UpdateProviderProfileCommand CreateCommand(
        Guid userId,
        string? businessName = null,
        string? firstName = null,
        string? lastName = null,
        string? specialization = null,
        string? bio = null,
        string? address = null,
        string? city = null,
        string? postalCode = null,
        int? serviceRadius = null,
        string? timezone = null,
        string? nutritionProviderSubtype = null)
    {
        return new UpdateProviderProfileCommand(
            userId,
            businessName,
            firstName,
            lastName,
            specialization,
            bio,
            address,
            city,
            postalCode,
            serviceRadius,
            timezone,
            nutritionProviderSubtype);
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
            ServiceRadiusKm = 20,
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
