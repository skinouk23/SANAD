using System.Reflection;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Providers.Commands;
using SanadPlatform.API.Features.Providers.Controllers;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Mappings;
using SanadPlatform.API.Features.Providers.Queries;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers;

public class ProviderPreferencesTests
{
    [Fact]
    public void ProviderPreferences_DefaultsMatchExpectedNotificationAndPrivacyValues()
    {
        var preferences = new ProviderPreferences();

        Assert.True(preferences.EmailNotifications);
        Assert.True(preferences.SmsNotifications);
        Assert.True(preferences.PushNotifications);
        Assert.False(preferences.MarketingEmails);
        Assert.True(preferences.AllowPatientMessages);
        Assert.Equal("public", preferences.ProfileVisibility);
    }

    [Fact]
    public void SanadDbContext_ModelConfiguresProviderPreferencesRelationshipAndDefaults()
    {
        using var context = CreateContext();

        var entityType = context.Model.FindEntityType(typeof(ProviderPreferences));
        Assert.NotNull(entityType);

        var foreignKey = Assert.Single(entityType!.GetForeignKeys());

        Assert.Equal("provider_preferences", entityType.GetTableName());
        Assert.Equal(nameof(ProviderPreferences.ProviderId), Assert.Single(foreignKey.Properties).Name);
        Assert.True(foreignKey.IsUnique);
        Assert.Equal(DeleteBehavior.Cascade, foreignKey.DeleteBehavior);
        Assert.Equal(true, entityType.FindProperty(nameof(ProviderPreferences.EmailNotifications))!.GetDefaultValue());
        Assert.Equal(true, entityType.FindProperty(nameof(ProviderPreferences.SmsNotifications))!.GetDefaultValue());
        Assert.Equal(true, entityType.FindProperty(nameof(ProviderPreferences.PushNotifications))!.GetDefaultValue());
        Assert.Equal(false, entityType.FindProperty(nameof(ProviderPreferences.MarketingEmails))!.GetDefaultValue());
        Assert.Equal(true, entityType.FindProperty(nameof(ProviderPreferences.AllowPatientMessages))!.GetDefaultValue());
        Assert.Equal("public", entityType.FindProperty(nameof(ProviderPreferences.ProfileVisibility))!.GetDefaultValue());
    }

    [Fact]
    public async Task GetProviderPreferencesHandler_ReturnsExistingPreferences()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();
        provider.Preferences = new ProviderPreferences
        {
            EmailNotifications = false,
            SmsNotifications = true,
            PushNotifications = false,
            MarketingEmails = true,
            AllowPatientMessages = false,
            ProfileVisibility = "private"
        };

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new GetProviderPreferencesHandler(
            CreateRepository(context, mapper),
            NullLogger<GetProviderPreferencesHandler>.Instance);

        var response = await handler.Handle(
            new GetProviderPreferencesQuery(provider.UserId),
            CancellationToken.None);

        Assert.False(response.EmailNotifications);
        Assert.True(response.SmsNotifications);
        Assert.False(response.PushNotifications);
        Assert.True(response.MarketingEmails);
        Assert.False(response.AllowPatientMessages);
        Assert.Equal("private", response.ProfileVisibility);
    }

    [Fact]
    public async Task UpdateProviderPreferencesHandler_PersistsPartialUpdate()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();
        provider.Preferences = new ProviderPreferences
        {
            EmailNotifications = true,
            SmsNotifications = true,
            PushNotifications = true,
            MarketingEmails = false,
            AllowPatientMessages = true,
            ProfileVisibility = "public"
        };

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new UpdateProviderPreferencesCommandHandler(
            CreateRepository(context, mapper),
            context,
            mapper,
            NullLogger<UpdateProviderPreferencesCommandHandler>.Instance);

        var response = await handler.Handle(
            new UpdateProviderPreferencesCommand(
                provider.UserId,
                EmailNotifications: false,
                MarketingEmails: true,
                ProfileVisibility: " PRIVATE "),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persisted = await context.ProviderPreferences.AsNoTracking().SingleAsync();

        Assert.False(response.EmailNotifications);
        Assert.True(response.SmsNotifications);
        Assert.True(response.PushNotifications);
        Assert.True(response.MarketingEmails);
        Assert.True(response.AllowPatientMessages);
        Assert.Equal("private", response.ProfileVisibility);

        Assert.False(persisted.EmailNotifications);
        Assert.True(persisted.SmsNotifications);
        Assert.True(persisted.PushNotifications);
        Assert.True(persisted.MarketingEmails);
        Assert.True(persisted.AllowPatientMessages);
        Assert.Equal("private", persisted.ProfileVisibility);
    }

    [Fact]
    public async Task UpdateProviderPreferencesHandler_CreatesPreferencesForLegacyProviderOnFirstSave()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new UpdateProviderPreferencesCommandHandler(
            CreateRepository(context, mapper),
            context,
            mapper,
            NullLogger<UpdateProviderPreferencesCommandHandler>.Instance);

        var response = await handler.Handle(
            new UpdateProviderPreferencesCommand(
                provider.UserId,
                PushNotifications: false,
                AllowPatientMessages: false),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persisted = await context.ProviderPreferences.AsNoTracking().SingleAsync();

        Assert.True(response.EmailNotifications);
        Assert.False(response.PushNotifications);
        Assert.False(response.AllowPatientMessages);
        Assert.Equal(provider.Id, persisted.ProviderId);
        Assert.False(persisted.PushNotifications);
        Assert.False(persisted.AllowPatientMessages);
        Assert.Equal("public", persisted.ProfileVisibility);
    }

    [Fact]
    public async Task GetProviderPreferencesHandler_ReturnsDefaultPreferencesWhenPreferencesAreMissing()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var logger = new CapturingLogger<GetProviderPreferencesHandler>();
        var handler = new GetProviderPreferencesHandler(
            CreateRepository(context, mapper),
            logger);

        var before = DateTime.UtcNow;
        var response = await handler.Handle(
            new GetProviderPreferencesQuery(provider.UserId),
            CancellationToken.None);
        var after = DateTime.UtcNow;

        Assert.True(response.EmailNotifications);
        Assert.True(response.SmsNotifications);
        Assert.True(response.PushNotifications);
        Assert.False(response.MarketingEmails);
        Assert.True(response.AllowPatientMessages);
        Assert.Equal("public", response.ProfileVisibility);
        Assert.InRange(response.UpdatedAt, before, after);
        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Returning default preferences for provider", StringComparison.Ordinal)
                && entry.Message.Contains(provider.UserId.ToString(), StringComparison.Ordinal));
    }

    [Fact]
    public async Task UpdateProviderPreferencesHandler_LogsStructuredMutation()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();
        provider.Preferences = new ProviderPreferences();

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var logger = new CapturingLogger<UpdateProviderPreferencesCommandHandler>();
        var handler = new UpdateProviderPreferencesCommandHandler(
            CreateRepository(context, mapper),
            context,
            mapper,
            logger);

        await handler.Handle(
            new UpdateProviderPreferencesCommand(
                provider.UserId,
                EmailNotifications: false),
            CancellationToken.None);

        Assert.Contains(
            logger.Entries,
            entry => entry.Level == LogLevel.Information
                && entry.Message.Contains("Provider preferences updated", StringComparison.Ordinal)
                && entry.Message.Contains(provider.UserId.ToString(), StringComparison.Ordinal));
    }

    [Fact]
    public void ProvidersController_DeclaresProviderPreferencesRoutesForAuthenticatedProviders()
    {
        var getMethod = typeof(ProvidersController).GetMethod(nameof(ProvidersController.GetMyPreferences));
        var putMethod = typeof(ProvidersController).GetMethod(nameof(ProvidersController.UpdateMyPreferences));

        Assert.NotNull(getMethod);
        Assert.NotNull(putMethod);

        var getRoute = getMethod!.GetCustomAttribute<HttpGetAttribute>();
        var putRoute = putMethod!.GetCustomAttribute<HttpPutAttribute>();
        var getAuthorize = getMethod.GetCustomAttribute<AuthorizeAttribute>();
        var putAuthorize = putMethod.GetCustomAttribute<AuthorizeAttribute>();

        Assert.NotNull(getRoute);
        Assert.NotNull(putRoute);
        Assert.Equal("me/preferences", getRoute!.Template);
        Assert.Equal("me/preferences", putRoute!.Template);
        Assert.Equal("provider", getAuthorize!.Roles);
        Assert.Equal("provider", putAuthorize!.Roles);
        Assert.Contains(
            putMethod.GetParameters(),
            parameter => parameter.ParameterType == typeof(UpdateProviderPreferencesRequest));
        Assert.Contains(
            putMethod.GetParameters(),
            parameter => parameter.ParameterType == typeof(CancellationToken));
    }

    private sealed class CapturingLogger<T> : ILogger<T>
    {
        public List<LogEntry> Entries { get; } = [];

        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull
        {
            return NullScope.Instance;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            Entries.Add(new LogEntry(logLevel, formatter(state, exception)));
        }

        public record LogEntry(LogLevel Level, string Message);

        private sealed class NullScope : IDisposable
        {
            public static readonly NullScope Instance = new();

            public void Dispose()
            {
            }
        }
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

    private static Provider CreateProvider()
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
            ServiceCategory = "nurse",
            BusinessName = "Amel Care",
            City = "Tunis",
            CountryCode = "TN",
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
