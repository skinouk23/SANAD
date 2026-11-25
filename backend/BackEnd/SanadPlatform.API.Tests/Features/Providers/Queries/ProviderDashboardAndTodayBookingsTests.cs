using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Mappings;
using SanadPlatform.API.Features.Bookings.Queries;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Mappings;
using SanadPlatform.API.Features.Providers.Queries;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Reviews.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers.Queries;

public class ProviderDashboardAndTodayBookingsTests
{
    [Fact]
    public async Task GetMyProviderDashboard_UsesProviderLocalWindowsAndBuildsDeltas()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var now = DateTime.UtcNow;

        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser, timezone: "Pacific/Kiritimati");
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);

        var localToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(now, TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone)));
        var currentWeekStart = GetWeekStart(localToday);
        var previousWeekStart = currentWeekStart.AddDays(-7);
        var currentMonthStart = new DateOnly(localToday.Year, localToday.Month, 1);

        var monthOnlyDate = currentMonthStart < currentWeekStart
            ? currentMonthStart
            : currentWeekStart.AddDays(6) < localToday
                ? currentWeekStart.AddDays(6)
                : localToday.AddDays(-1);

        var bookings = new[]
        {
            CreateBooking(provider, patient, service, localToday, localToday, new TimeOnly(9, 0), BookingStatus.Pending, providerAmount: 0m, bookingNumber: "BK-TODAY"),
            CreateBooking(provider, patient, service, currentWeekStart.AddDays(1), currentWeekStart.AddDays(1), new TimeOnly(10, 0), BookingStatus.Completed, providerAmount: 120m, bookingNumber: "BK-WEEK-1"),
            CreateBooking(provider, patient, service, currentWeekStart.AddDays(2), currentWeekStart.AddDays(2), new TimeOnly(11, 0), BookingStatus.Validated, providerAmount: 80m, bookingNumber: "BK-WEEK-2"),
            CreateBooking(provider, patient, service, previousWeekStart.AddDays(1), previousWeekStart.AddDays(1), new TimeOnly(12, 0), BookingStatus.Completed, providerAmount: 100m, bookingNumber: "BK-PREV-1"),
            CreateBooking(provider, patient, service, previousWeekStart.AddDays(2), previousWeekStart.AddDays(2), new TimeOnly(13, 0), BookingStatus.Confirmed, providerAmount: 0m, bookingNumber: "BK-PREV-2"),
            CreateBooking(provider, patient, service, monthOnlyDate, monthOnlyDate, new TimeOnly(14, 0), BookingStatus.Completed, providerAmount: 50m, bookingNumber: "BK-MONTH")
        };

        var reviews = new[]
        {
            CreateReview(provider, patient, service, rating: 5, createdAtUtc: ConvertLocalMiddayToUtc(provider.Timezone, localToday.AddDays(-2))),
            CreateReview(provider, patient, service, rating: 4, createdAtUtc: ConvertLocalMiddayToUtc(provider.Timezone, localToday.AddDays(-10))),
            CreateReview(provider, patient, service, rating: 3, createdAtUtc: ConvertLocalMiddayToUtc(provider.Timezone, localToday.AddDays(-35))),
            CreateReview(provider, patient, service, rating: 4, createdAtUtc: ConvertLocalMiddayToUtc(provider.Timezone, localToday.AddDays(-45)))
        };

        context.Bookings.AddRange(bookings);
        context.Reviews.AddRange(reviews);

        await context.SaveChangesAsync();

        var handler = new GetMyProviderDashboardHandler(
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            NullLogger<GetMyProviderDashboardHandler>.Instance);

        var response = await handler.Handle(new GetMyProviderDashboardQuery(provider.UserId), CancellationToken.None);

        var includedStatuses = new[]
        {
            BookingStatus.Pending,
            BookingStatus.Confirmed,
            BookingStatus.ProviderOnWay,
            BookingStatus.InProgress,
            BookingStatus.Completed,
            BookingStatus.Validated
        };
        var revenueStatuses = new[]
        {
            BookingStatus.Completed,
            BookingStatus.Validated
        };

        var todayCount = bookings.Count(b => b.StartDate <= localToday && b.EndDate >= localToday && includedStatuses.Contains(b.Status));
        var weekBookings = bookings.Where(b => b.StartDate <= currentWeekStart.AddDays(6) && b.EndDate >= currentWeekStart && includedStatuses.Contains(b.Status)).ToList();
        var previousWeekBookings = bookings.Where(b => b.StartDate <= previousWeekStart.AddDays(6) && b.EndDate >= previousWeekStart && includedStatuses.Contains(b.Status)).ToList();
        var currentMonthBookings = bookings.Where(b => b.StartDate <= currentMonthStart.AddMonths(1).AddDays(-1) && b.EndDate >= currentMonthStart && revenueStatuses.Contains(b.Status)).ToList();
        var currentWeekRevenue = weekBookings.Where(b => revenueStatuses.Contains(b.Status)).Sum(b => b.ProviderAmount);
        var previousWeekRevenue = previousWeekBookings.Where(b => revenueStatuses.Contains(b.Status)).Sum(b => b.ProviderAmount);
        var currentCompletionRate = Math.Round((decimal)weekBookings.Count(b => b.Status is BookingStatus.Completed or BookingStatus.Validated) / weekBookings.Count * 100m, 2);
        var previousCompletionRate = Math.Round((decimal)previousWeekBookings.Count(b => b.Status is BookingStatus.Completed or BookingStatus.Validated) / previousWeekBookings.Count * 100m, 2);
        var providerTimezone = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone);
        var currentRatingStats = await new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance)
            .ComputeRatingStatsForPeriodAsync(
                provider.Id,
                TimeZoneInfo.ConvertTimeToUtc(localToday.AddDays(-29).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), providerTimezone),
                TimeZoneInfo.ConvertTimeToUtc(localToday.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), providerTimezone),
                CancellationToken.None);
        var previousRatingStats = await new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance)
            .ComputeRatingStatsForPeriodAsync(
                provider.Id,
                TimeZoneInfo.ConvertTimeToUtc(localToday.AddDays(-59).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), providerTimezone),
                TimeZoneInfo.ConvertTimeToUtc(localToday.AddDays(-29).ToDateTime(TimeOnly.MinValue, DateTimeKind.Unspecified), providerTimezone),
                CancellationToken.None);

        Assert.Equal(todayCount, response.AppointmentStats.TodayCount);
        Assert.Equal(weekBookings.Count, response.AppointmentStats.WeekCount);
        Assert.Equal(currentCompletionRate, response.AppointmentStats.CompletionRate);
        Assert.Equal(weekBookings.Count - previousWeekBookings.Count, response.AppointmentStats.WeekCountDelta.AbsoluteChange);
        Assert.Equal(Math.Round((decimal)(weekBookings.Count - previousWeekBookings.Count) / previousWeekBookings.Count * 100m, 2), response.AppointmentStats.WeekCountDelta.PercentageChange);
        Assert.True(response.AppointmentStats.WeekCountDelta.HasBaseline);
        Assert.Equal(Math.Round(currentCompletionRate - previousCompletionRate, 2), response.AppointmentStats.CompletionRateDelta.AbsoluteChange);
        Assert.Null(response.AppointmentStats.CompletionRateDelta.PercentageChange);
        Assert.True(response.AppointmentStats.CompletionRateDelta.HasBaseline);

        Assert.Equal(currentWeekRevenue, response.RevenueStats.ThisWeekRevenue);
        Assert.Equal(currentMonthBookings.Sum(b => b.ProviderAmount), response.RevenueStats.ThisMonthRevenue);
        Assert.Equal(currentWeekRevenue - previousWeekRevenue, response.RevenueStats.ThisWeekRevenueDelta.AbsoluteChange);
        Assert.Equal(Math.Round((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue * 100m, 2), response.RevenueStats.ThisWeekRevenueDelta.PercentageChange);
        Assert.True(response.RevenueStats.ThisWeekRevenueDelta.HasBaseline);

        Assert.Equal(provider.RatingAverage, response.Provider.Rating);
        Assert.Equal(Math.Round(currentRatingStats.Average - previousRatingStats.Average, 2), response.Provider.RatingDelta.AbsoluteChange);
        Assert.Null(response.Provider.RatingDelta.PercentageChange);
        Assert.Equal(previousRatingStats.Count > 0, response.Provider.RatingDelta.HasBaseline);
    }

    [Fact]
    public async Task GetMyProviderDashboard_WhenNoMeaningfulBaseline_KeepsDeltaTruthful()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();

        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser, timezone: "Africa/Tunis");
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);

        var localToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone)));
        var currentWeekStart = GetWeekStart(localToday);

        context.Bookings.AddRange(
            CreateBooking(provider, patient, service, localToday, localToday, new TimeOnly(8, 0), BookingStatus.Completed, providerAmount: 90m, bookingNumber: "BK-ONLY-TODAY"),
            CreateBooking(provider, patient, service, currentWeekStart.AddDays(1), currentWeekStart.AddDays(1), new TimeOnly(9, 0), BookingStatus.Completed, providerAmount: 110m, bookingNumber: "BK-ONLY-WEEK"));

        context.Reviews.Add(
            CreateReview(provider, patient, service, rating: 5, createdAtUtc: ConvertLocalMiddayToUtc(provider.Timezone, localToday.AddDays(-1))));

        await context.SaveChangesAsync();

        var handler = new GetMyProviderDashboardHandler(
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            NullLogger<GetMyProviderDashboardHandler>.Instance);

        var response = await handler.Handle(new GetMyProviderDashboardQuery(provider.UserId), CancellationToken.None);

        Assert.False(response.AppointmentStats.WeekCountDelta.HasBaseline);
        Assert.Null(response.AppointmentStats.WeekCountDelta.PercentageChange);
        Assert.False(response.RevenueStats.ThisWeekRevenueDelta.HasBaseline);
        Assert.Null(response.RevenueStats.ThisWeekRevenueDelta.PercentageChange);
        Assert.False(response.Provider.RatingDelta.HasBaseline);
        Assert.Null(response.Provider.RatingDelta.PercentageChange);
        Assert.False(response.AppointmentStats.CompletionRateDelta.HasBaseline);
    }

    [Fact]
    public async Task GetMyProviderTodayBookings_ResolvesProviderFiltersStatusesAndSortsByStartTime()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();

        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser, timezone: "Pacific/Kiritimati");
        var otherProviderUser = CreateUser("provider");
        var otherProvider = CreateProvider(otherProviderUser, timezone: "Pacific/Kiritimati");
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var otherService = CreateService(otherProvider);

        context.Users.AddRange(providerUser, otherProviderUser, patientUser);
        context.Providers.AddRange(provider, otherProvider);
        context.Patients.Add(patient);
        context.Services.AddRange(service, otherService);

        var localToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone)));

        context.Bookings.AddRange(
            CreateBooking(provider, patient, service, localToday.AddDays(-1), localToday, new TimeOnly(10, 0), BookingStatus.Confirmed, providerAmount: 0m, bookingNumber: "BK-LATER"),
            CreateBooking(provider, patient, service, localToday, localToday.AddDays(1), new TimeOnly(8, 0), BookingStatus.Pending, providerAmount: 0m, bookingNumber: "BK-EARLY"),
            CreateBooking(provider, patient, service, localToday, localToday, new TimeOnly(12, 0), BookingStatus.Completed, providerAmount: 80m, bookingNumber: "BK-DONE"),
            CreateBooking(provider, patient, service, localToday, localToday, new TimeOnly(9, 0), BookingStatus.Cancelled, providerAmount: 0m, bookingNumber: "BK-CANCELLED"),
            CreateBooking(provider, patient, service, localToday, localToday, new TimeOnly(7, 0), BookingStatus.Disputed, providerAmount: 0m, bookingNumber: "BK-DISPUTED"),
            CreateBooking(otherProvider, patient, otherService, localToday, localToday, new TimeOnly(6, 0), BookingStatus.Confirmed, providerAmount: 0m, bookingNumber: "BK-OTHER-PROVIDER"));

        await context.SaveChangesAsync();

        var handler = new GetMyProviderTodayBookingsHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            NullLogger<GetMyProviderTodayBookingsHandler>.Instance);

        var response = await handler.Handle(new GetMyProviderTodayBookingsQuery(provider.UserId), CancellationToken.None);

        Assert.Equal(["BK-EARLY", "BK-LATER", "BK-DONE"], response.Select(item => item.BookingNumber).ToArray());
        Assert.All(response, item => Assert.NotNull(item.Patient));
        Assert.All(response, item => Assert.Null(item.Provider));
        Assert.All(response, item => Assert.Null(item.ValidationCode));
        Assert.All(response, item => Assert.Null(item.Notes));
        Assert.All(response, item => Assert.Null(item.Rating));
        Assert.All(response, item => Assert.Null(item.ReviewComment));
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .Options;

        return new SanadDbContext(options);
    }

    private static IMapper CreateMapper()
    {
        var configuration = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<ProviderMappingProfile>();
            cfg.AddProfile<BookingMappingProfile>();
        });

        return configuration.CreateMapper();
    }

    private static User CreateUser(string role)
    {
        var now = DateTime.UtcNow;
        return new User
        {
            Id = Guid.NewGuid(),
            Email = $"{Guid.NewGuid():N}@example.com",
            PasswordHash = "hashed-password",
            Phone = "+21620123456",
            Role = role,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Provider CreateProvider(User user, string timezone)
    {
        var now = DateTime.UtcNow;
        return new Provider
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            ServiceCategory = "nursing",
            BusinessName = "Provider Care",
            FirstName = "Amel",
            LastName = "Ben Ali",
            CountryCode = "TN",
            Timezone = timezone,
            IsApproved = true,
            IsVerified = true,
            IsAvailable = true,
            AvailabilityStatus = "available",
            RatingAverage = 4.8m,
            RatingCount = 12,
            SubscriptionTier = "pro",
            AvailableBalance = 320m,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Patient CreatePatient(User user)
    {
        var now = DateTime.UtcNow;
        return new Patient
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
            FirstName = "Sami",
            LastName = "Trabelsi",
            CountryCode = "TN",
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Service CreateService(Provider provider)
    {
        var now = DateTime.UtcNow;
        return new Service
        {
            Id = Guid.NewGuid(),
            ProviderId = provider.Id,
            Provider = provider,
            Category = provider.ServiceCategory,
            Name = "Home Visit",
            Price = 100m,
            Currency = "TND",
            DurationMinutes = 60,
            ServiceLocation = "home",
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Booking CreateBooking(
        Provider provider,
        Patient patient,
        Service service,
        DateOnly startDate,
        DateOnly endDate,
        TimeOnly dailyStartTime,
        BookingStatus status,
        decimal providerAmount,
        string bookingNumber)
    {
        var now = DateTime.UtcNow;
        return new Booking
        {
            Id = Guid.NewGuid(),
            BookingNumber = bookingNumber,
            PatientId = patient.Id,
            Patient = patient,
            ProviderId = provider.Id,
            Provider = provider,
            ServiceId = service.Id,
            Service = service,
            StartDate = startDate,
            EndDate = endDate,
            DailyStartTime = dailyStartTime,
            DailyEndTime = dailyStartTime.AddMinutes(60),
            DailyDurationMinutes = 60,
            Timezone = provider.Timezone,
            Status = status,
            PatientName = $"{patient.FirstName} {patient.LastName}",
            PatientPhone = patient.User.Phone,
            ServiceLocation = "home",
            ServicePrice = providerAmount,
            AddonsPrice = 0m,
            Subtotal = providerAmount,
            PlatformFee = 0m,
            TotalAmount = providerAmount,
            ProviderAmount = providerAmount,
            Currency = "TND",
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static Review CreateReview(
        Provider provider,
        Patient patient,
        Service service,
        int rating,
        DateTime createdAtUtc)
    {
        return new Review
        {
            Id = Guid.NewGuid(),
            BookingId = Guid.NewGuid(),
            PatientId = patient.Id,
            Patient = patient,
            ProviderId = provider.Id,
            Provider = provider,
            ServiceId = service.Id,
            Rating = rating,
            IsVisible = true,
            CreatedAt = createdAtUtc,
            UpdatedAt = createdAtUtc
        };
    }

    private static DateOnly GetWeekStart(DateOnly date)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        var daysSinceMonday = dayOfWeek == 0 ? 6 : dayOfWeek - 1;
        return date.AddDays(-daysSinceMonday);
    }

    private static DateTime ConvertLocalMiddayToUtc(string timezone, DateOnly localDate)
    {
        var providerTimezone = TimeZoneInfo.FindSystemTimeZoneById(timezone);
        return TimeZoneInfo.ConvertTimeToUtc(
            localDate.ToDateTime(new TimeOnly(12, 0), DateTimeKind.Unspecified),
            providerTimezone);
    }
}
