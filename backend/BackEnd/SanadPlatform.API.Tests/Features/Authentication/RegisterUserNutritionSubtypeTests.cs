using FluentValidation.TestHelper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Authentication.Commands;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Features.Authentication.Validators;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Tests.Features.Authentication;

public class RegisterUserNutritionSubtypeTests
{
    [Fact]
    public void Validator_RejectsLegacyServiceCodes()
    {
        var validator = new RegisterUserCommandValidator();
        var command = CreateProviderCommand(serviceType: "equipment");

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.ServiceType)
            .WithErrorMessage("Service type must use a canonical provider category code");
    }

    [Fact]
    public void Validator_RequiresSubtype_ForNutritionProviders()
    {
        var validator = new RegisterUserCommandValidator();
        var command = CreateProviderCommand(
            serviceType: ServiceCategories.Nutrition,
            nutritionProviderSubtype: null);

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NutritionProviderSubtype)
            .WithErrorMessage("Nutrition provider subtype is required when service type is 'nutrition'");
    }

    [Fact]
    public void Validator_RejectsSubtype_ForNonNutritionProviders()
    {
        var validator = new RegisterUserCommandValidator();
        var command = CreateProviderCommand(
            serviceType: ServiceCategories.Doctor,
            nutritionProviderSubtype: "Chef");

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(x => x.NutritionProviderSubtype)
            .WithErrorMessage("Nutrition provider subtype can only be supplied when service type is 'nutrition'");
    }

    [Fact]
    public void Validator_AcceptsNonNutritionProviders_WhenSubtypeIsOmitted()
    {
        var validator = new RegisterUserCommandValidator();
        var command = CreateProviderCommand(
            serviceType: ServiceCategories.Doctor,
            nutritionProviderSubtype: null);

        var result = validator.TestValidate(command);

        result.ShouldNotHaveValidationErrorFor(x => x.ServiceType);
        result.ShouldNotHaveValidationErrorFor(x => x.NutritionProviderSubtype);
    }

    [Fact]
    public async Task Handler_PersistsNutritionProviderSubtype_ForNutritionRegistrations()
    {
        await using var context = CreateContext();
        var handler = CreateHandler(context);

        var response = await handler.Handle(
            CreateProviderCommand(
                serviceType: ServiceCategories.Nutrition,
                nutritionProviderSubtype: "Chef"),
            CancellationToken.None);

        var provider = await context.Providers.SingleAsync();
        var sessionCount = await context.UserSessions.CountAsync();

        Assert.Equal(ServiceCategories.Nutrition, provider.ServiceCategory);
        Assert.Equal(NutritionProviderSubtype.Chef, provider.NutritionProviderSubtype);
        Assert.Equal(response.User.Id, provider.UserId);
        Assert.Equal("provider", response.User.Role);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.False(string.IsNullOrWhiteSpace(response.RefreshToken));
        Assert.Equal(1, sessionCount);
    }

    [Fact]
    public async Task Handler_LeavesSubtypeNull_ForNonNutritionRegistrations()
    {
        await using var context = CreateContext();
        var handler = CreateHandler(context);

        var response = await handler.Handle(
            CreateProviderCommand(
                serviceType: ServiceCategories.Doctor,
                nutritionProviderSubtype: null),
            CancellationToken.None);

        var provider = await context.Providers.SingleAsync();

        Assert.Equal(ServiceCategories.Doctor, provider.ServiceCategory);
        Assert.Null(provider.NutritionProviderSubtype);
        Assert.Equal(response.User.Id, provider.UserId);
    }

    [Fact]
    public async Task Handler_UsesExistingDuplicateEmailFailurePath()
    {
        await using var context = CreateContext();
        context.Users.Add(new User
        {
            Email = "existing@example.com",
            PasswordHash = "hashed-password",
            Role = "provider",
            Phone = "+21620123456",
            PreferredLanguage = "fr",
            IsActive = true
        });
        await context.SaveChangesAsync();

        var handler = CreateHandler(context);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            CreateProviderCommand(
                serviceType: ServiceCategories.Nutrition,
                nutritionProviderSubtype: "Nutritionist",
                email: "existing@example.com"),
            CancellationToken.None));

        Assert.Equal(
            "Registration could not be completed. If this email is already in use, please try logging in.",
            exception.Message);
        Assert.Equal(1, await context.Users.CountAsync());
        Assert.Equal(0, await context.Providers.CountAsync());
        Assert.Equal(0, await context.UserSessions.CountAsync());
    }

    private static RegisterUserHandler CreateHandler(SanadDbContext context)
    {
        var jwtOptions = Options.Create(new JwtSettings
        {
            SecretKey = "this-is-a-test-secret-key-with-32-chars",
            Issuer = "SanadPlatform.Tests",
            Audience = "SanadPlatform.Tests",
            ExpiryMinutes = 60,
            RefreshTokenExpiryDays = 7
        });

        return new RegisterUserHandler(
            context,
            new UserRepository(context, NullLogger<UserRepository>.Instance),
            new UserSessionRepository(context, NullLogger<UserSessionRepository>.Instance),
            new PasswordHashingService(NullLogger<PasswordHashingService>.Instance),
            new JwtTokenService(jwtOptions, NullLogger<JwtTokenService>.Instance),
            jwtOptions,
            NullLogger<RegisterUserHandler>.Instance);
    }

    private static RegisterUserCommand CreateProviderCommand(
        string serviceType,
        string? nutritionProviderSubtype = null,
        string? email = null)
    {
        return new RegisterUserCommand(
            Email: email ?? $"{Guid.NewGuid():N}@example.com",
            Password: "Password1!",
            FirstName: "Amal",
            LastName: "Ben Ali",
            Phone: "+21620123456",
            City: "Tunis",
            Role: "provider",
            ServiceType: serviceType,
            NutritionProviderSubtype: nutritionProviderSubtype,
            CountryCode: "TN",
            IpAddress: "127.0.0.1",
            UserAgent: "xunit");
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }
}
