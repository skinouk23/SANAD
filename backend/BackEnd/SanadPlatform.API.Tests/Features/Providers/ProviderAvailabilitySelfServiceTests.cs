using System.Reflection;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
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

public class ProviderAvailabilitySelfServiceTests
{
    [Fact]
    public async Task ReplaceMyProviderSchedulesCommand_ReplacesExistingWeeklySchedule()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();

        provider.Schedules.Add(new ProviderSchedule
        {
            DayOfWeek = DayOfWeek.Monday,
            StartTime = new TimeOnly(8, 0),
            EndTime = new TimeOnly(10, 0),
            IsAvailable = true
        });

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new ReplaceMyProviderSchedulesCommandHandler(
            CreateRepository(context, mapper),
            context);

        var response = await handler.Handle(
            new ReplaceMyProviderSchedulesCommand(
                provider.UserId,
                [
                    new ProviderScheduleIntervalRequest
                    {
                        DayOfWeek = DayOfWeek.Monday,
                        StartTime = new TimeOnly(9, 0),
                        EndTime = new TimeOnly(12, 0)
                    },
                    new ProviderScheduleIntervalRequest
                    {
                        DayOfWeek = DayOfWeek.Monday,
                        StartTime = new TimeOnly(13, 0),
                        EndTime = new TimeOnly(17, 0)
                    }
                ]),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persisted = await context.ProviderSchedules.AsNoTracking().OrderBy(item => item.StartTime).ToListAsync();

        Assert.Equal(2, persisted.Count);
        Assert.Equal(2, response.Count);
        Assert.Equal(new TimeOnly(9, 0), persisted[0].StartTime);
        Assert.Equal(new TimeOnly(12, 0), persisted[0].EndTime);
        Assert.Equal(new TimeOnly(13, 0), persisted[1].StartTime);
        Assert.Equal(new TimeOnly(17, 0), persisted[1].EndTime);
    }

    [Fact]
    public async Task ReplaceMyProviderSchedulesCommand_RejectsOverlappingIntervalsForSameDayAndService()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new ReplaceMyProviderSchedulesCommandHandler(
            CreateRepository(context, mapper),
            context);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new ReplaceMyProviderSchedulesCommand(
                provider.UserId,
                [
                    new ProviderScheduleIntervalRequest
                    {
                        DayOfWeek = DayOfWeek.Monday,
                        StartTime = new TimeOnly(9, 0),
                        EndTime = new TimeOnly(12, 0)
                    },
                    new ProviderScheduleIntervalRequest
                    {
                        DayOfWeek = DayOfWeek.Monday,
                        StartTime = new TimeOnly(11, 30),
                        EndTime = new TimeOnly(13, 0)
                    }
                ]),
            CancellationToken.None));

        Assert.Contains("Overlapping schedule intervals", exception.Message, StringComparison.Ordinal);
    }

    [Fact]
    public async Task CreateAndUpdateMyProviderUnavailabilityCommand_StoresValuesInProviderTimezoneCorrectly()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(timezone: "Africa/Tunis");

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var createHandler = new CreateMyProviderUnavailabilityCommandHandler(
            CreateRepository(context, mapper),
            context);

        var created = await createHandler.Handle(
            new CreateMyProviderUnavailabilityCommand(
                provider.UserId,
                new DateTime(2026, 4, 20, 9, 0, 0),
                new DateTime(2026, 4, 20, 11, 0, 0),
                false,
                false,
                null,
                "Clinic",
                "Blocked"),
            CancellationToken.None);

        var updateHandler = new UpdateMyProviderUnavailabilityCommandHandler(
            CreateRepository(context, mapper),
            context);

        var updated = await updateHandler.Handle(
            new UpdateMyProviderUnavailabilityCommand(
                provider.UserId,
                created.Id,
                new DateTime(2026, 4, 20, 14, 0, 0),
                new DateTime(2026, 4, 20, 16, 0, 0),
                false,
                false,
                null,
                "Updated",
                "Updated notes"),
            CancellationToken.None);

        context.ChangeTracker.Clear();
        var persisted = await context.ProviderUnavailabilities.AsNoTracking().SingleAsync();

        Assert.Equal(new DateTime(2026, 4, 20, 9, 0, 0), created.StartDatetime);
        Assert.Equal(new DateTime(2026, 4, 20, 11, 0, 0), created.EndDatetime);
        Assert.Equal(new DateTime(2026, 4, 20, 14, 0, 0), updated.StartDatetime);
        Assert.Equal(new DateTime(2026, 4, 20, 16, 0, 0), updated.EndDatetime);
        Assert.Equal("Updated", persisted.Reason);
        Assert.Equal("Updated notes", persisted.Notes);
    }

    [Fact]
    public async Task DeleteMyProviderUnavailabilityCommand_RemovesOwnedEntry()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider();
        var unavailability = new ProviderUnavailability
        {
            Provider = provider,
            ProviderId = provider.Id,
            StartDatetime = new DateTime(2026, 4, 20, 9, 0, 0, DateTimeKind.Utc),
            EndDatetime = new DateTime(2026, 4, 20, 11, 0, 0, DateTimeKind.Utc)
        };

        provider.Unavailabilities.Add(unavailability);
        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new DeleteMyProviderUnavailabilityCommandHandler(
            CreateRepository(context, mapper),
            context);

        await handler.Handle(
            new DeleteMyProviderUnavailabilityCommand(provider.UserId, unavailability.Id),
            CancellationToken.None);

        Assert.Empty(await context.ProviderUnavailabilities.AsNoTracking().ToListAsync());
    }

    [Fact]
    public async Task GetProviderAvailabilityHandler_ReturnsIntervalsAndLeavesPartialDayOutOfUnavailableDates()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(timezone: "UTC");
        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        provider.Schedules.Add(new ProviderSchedule
        {
            DayOfWeek = targetDate.DayOfWeek,
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(17, 0),
            IsAvailable = true
        });
        provider.Unavailabilities.Add(new ProviderUnavailability
        {
            StartDatetime = targetDate.ToDateTime(new TimeOnly(12, 0), DateTimeKind.Utc),
            EndDatetime = targetDate.ToDateTime(new TimeOnly(13, 0), DateTimeKind.Utc),
            IsAllDay = false
        });

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new GetProviderAvailabilityHandler(
            CreateRepository(context, mapper),
            NullLogger<GetProviderAvailabilityHandler>.Instance);

        var response = await handler.Handle(
            new GetProviderAvailabilityQuery(provider.Id, targetDate, null),
            CancellationToken.None);

        Assert.Equal(2, response.AvailableIntervals.Count);
        Assert.Equal("09:00", response.AvailableIntervals[0].StartTime);
        Assert.Equal("12:00", response.AvailableIntervals[0].EndTime);
        Assert.Equal("13:00", response.AvailableIntervals[1].StartTime);
        Assert.Equal("17:00", response.AvailableIntervals[1].EndTime);
        Assert.Single(response.UnavailableIntervals);
        Assert.Equal("12:00", response.UnavailableIntervals[0].StartTime);
        Assert.Equal("13:00", response.UnavailableIntervals[0].EndTime);
        Assert.DoesNotContain(targetDate, response.UnavailableDates);
    }

    [Fact]
    public async Task GetProviderScheduleQuery_ReturnsMultipleIntervalsForBroadWindow()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var provider = CreateProvider(timezone: "UTC");
        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow);

        provider.Schedules.Add(new ProviderSchedule
        {
            DayOfWeek = targetDate.DayOfWeek,
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(12, 0),
            IsAvailable = true
        });
        provider.Schedules.Add(new ProviderSchedule
        {
            DayOfWeek = targetDate.DayOfWeek,
            StartTime = new TimeOnly(13, 0),
            EndTime = new TimeOnly(17, 0),
            IsAvailable = true
        });

        context.Providers.Add(provider);
        await context.SaveChangesAsync();

        var handler = new GetProviderScheduleQueryHandler(
            CreateRepository(context, mapper),
            NullLogger<GetProviderScheduleQueryHandler>.Instance);

        var response = await handler.Handle(
            new GetProviderScheduleQuery(provider.Id, 1),
            CancellationToken.None);

        Assert.Single(response);
        Assert.Equal(2, response[0].AvailableIntervals.Count);
        Assert.Equal("09:00", response[0].AvailableIntervals[0].StartTime);
        Assert.Equal("12:00", response[0].AvailableIntervals[0].EndTime);
        Assert.Equal("13:00", response[0].AvailableIntervals[1].StartTime);
        Assert.Equal("17:00", response[0].AvailableIntervals[1].EndTime);
    }

    [Fact]
    public void ProvidersController_DeclaresSelfServiceScheduleAndUnavailabilityRoutes()
    {
        AssertRoute(nameof(ProvidersController.GetMySchedules), typeof(HttpGetAttribute), "me/schedules");
        AssertRoute(nameof(ProvidersController.ReplaceMySchedules), typeof(HttpPutAttribute), "me/schedules");
        AssertRoute(nameof(ProvidersController.GetMyUnavailabilities), typeof(HttpGetAttribute), "me/unavailabilities");
        AssertRoute(nameof(ProvidersController.CreateMyUnavailability), typeof(HttpPostAttribute), "me/unavailabilities");
        AssertRoute(nameof(ProvidersController.UpdateMyUnavailability), typeof(HttpPatchAttribute), "me/unavailabilities/{id:guid}");
        AssertRoute(nameof(ProvidersController.DeleteMyUnavailability), typeof(HttpDeleteAttribute), "me/unavailabilities/{id:guid}");
    }

    private static void AssertRoute(string methodName, Type routeAttributeType, string template)
    {
        var method = typeof(ProvidersController).GetMethod(methodName);
        Assert.NotNull(method);

        var route = method!.GetCustomAttribute(routeAttributeType) as HttpMethodAttribute;
        var authorize = method.GetCustomAttribute<AuthorizeAttribute>();

        Assert.NotNull(route);
        Assert.Equal(template, route!.Template);
        Assert.Equal("provider", authorize!.Roles);
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

    private static Provider CreateProvider(string timezone = "Africa/Tunis")
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
            ServiceCategory = "nursing",
            BusinessName = "Provider Care",
            CountryCode = "TN",
            Timezone = timezone,
            IsApproved = true,
            IsVerified = true,
            IsAvailable = true,
            AvailabilityStatus = "available",
            MaxBookingAdvanceDays = 365,
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
