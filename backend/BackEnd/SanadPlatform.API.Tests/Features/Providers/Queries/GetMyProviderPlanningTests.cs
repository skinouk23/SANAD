using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Mappings;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Mappings;
using SanadPlatform.API.Features.Providers.Queries;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Providers.Queries;

public class GetMyProviderPlanningTests
{
    [Fact]
    public async Task GetMyProviderPlanning_ReturnsCompositePlanningPayloadForRequestedLocalWindow()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();

        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser, "Pacific/Kiritimati");
        provider.IsAvailable = false;
        provider.AvailabilityStatus = "offline";

        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var otherUser = CreateUser("provider");
        var otherProvider = CreateProvider(otherUser, "Pacific/Kiritimati");
        var otherService = CreateService(otherProvider);

        var from = new DateOnly(2026, 4, 14);
        var to = new DateOnly(2026, 4, 16);
        var providerTimezone = TimeZoneInfo.FindSystemTimeZoneById(provider.Timezone);

        var schedules = new[]
        {
            new ProviderSchedule
            {
                Id = Guid.NewGuid(),
                ProviderId = provider.Id,
                Provider = provider,
                DayOfWeek = DayOfWeek.Tuesday,
                StartTime = new TimeOnly(8, 0),
                EndTime = new TimeOnly(10, 0),
                IsAvailable = true
            },
            new ProviderSchedule
            {
                Id = Guid.NewGuid(),
                ProviderId = provider.Id,
                Provider = provider,
                DayOfWeek = DayOfWeek.Tuesday,
                ServiceId = service.Id,
                StartTime = new TimeOnly(13, 0),
                EndTime = new TimeOnly(15, 0),
                IsAvailable = true
            }
        };

        var overlappingUnavailability = new ProviderUnavailability
        {
            Id = Guid.NewGuid(),
            ProviderId = provider.Id,
            Provider = provider,
            StartDatetime = ConvertLocalToUtc(providerTimezone, new DateTime(2026, 4, 15, 9, 0, 0)),
            EndDatetime = ConvertLocalToUtc(providerTimezone, new DateTime(2026, 4, 15, 11, 0, 0)),
            IsAllDay = false,
            Reason = "Personal errand"
        };

        var recurringUnavailability = new ProviderUnavailability
        {
            Id = Guid.NewGuid(),
            ProviderId = provider.Id,
            Provider = provider,
            StartDatetime = ConvertLocalToUtc(providerTimezone, new DateTime(2026, 4, 1, 18, 0, 0)),
            EndDatetime = ConvertLocalToUtc(providerTimezone, new DateTime(2026, 4, 1, 20, 0, 0)),
            IsRecurring = true,
            RecurrenceRule = "FREQ=WEEKLY;BYDAY=WE"
        };

        var outsideUnavailability = new ProviderUnavailability
        {
            Id = Guid.NewGuid(),
            ProviderId = provider.Id,
            Provider = provider,
            StartDatetime = ConvertLocalToUtc(providerTimezone, new DateTime(2026, 4, 20, 8, 0, 0)),
            EndDatetime = ConvertLocalToUtc(providerTimezone, new DateTime(2026, 4, 20, 9, 0, 0))
        };

        var includedBookings = new[]
        {
            CreateBooking(provider, patient, service, new DateOnly(2026, 4, 14), new DateOnly(2026, 4, 14), new TimeOnly(9, 0), BookingStatus.Confirmed, "BK-PLAN-1"),
            CreateBooking(provider, patient, service, new DateOnly(2026, 4, 16), new DateOnly(2026, 4, 18), new TimeOnly(7, 30), BookingStatus.Cancelled, "BK-PLAN-2")
        };

        includedBookings[0].ProviderAcceptedAt = DateTime.UtcNow.AddHours(-4);
        includedBookings[0].ProviderArrivedAt = DateTime.UtcNow.AddHours(-2);
        includedBookings[0].StatusChangedBy = providerUser.Id;
        includedBookings[0].StatusChangeReason = "Provider arrived";
        includedBookings[0].PatientNotes = "Bring supplies";

        includedBookings[1].CancelledAt = DateTime.UtcNow.AddHours(-1);
        includedBookings[1].CancelledBy = providerUser.Id;
        includedBookings[1].CancellationReason = "Double booked";
        includedBookings[1].StatusChangedBy = providerUser.Id;
        includedBookings[1].StatusChangeReason = "Declined by provider";

        var excludedBookings = new[]
        {
            CreateBooking(provider, patient, service, new DateOnly(2026, 4, 10), new DateOnly(2026, 4, 12), new TimeOnly(8, 0), BookingStatus.Confirmed, "BK-OUTSIDE"),
            CreateBooking(provider, patient, service, new DateOnly(2026, 4, 15), new DateOnly(2026, 4, 15), new TimeOnly(12, 0), BookingStatus.Disputed, "BK-STATUS-EXCLUDED"),
            CreateBooking(otherProvider, patient, otherService, new DateOnly(2026, 4, 15), new DateOnly(2026, 4, 15), new TimeOnly(6, 0), BookingStatus.Confirmed, "BK-OTHER-PROVIDER")
        };

        context.Users.AddRange(providerUser, patientUser, otherUser);
        context.Providers.AddRange(provider, otherProvider);
        context.Patients.Add(patient);
        context.Services.AddRange(service, otherService);
        context.ProviderSchedules.AddRange(schedules);
        context.ProviderUnavailabilities.AddRange(overlappingUnavailability, recurringUnavailability, outsideUnavailability);
        context.Bookings.AddRange(includedBookings);
        context.Bookings.AddRange(excludedBookings);

        await context.SaveChangesAsync();

        var handler = new GetMyProviderPlanningQueryHandler(
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance));

        var response = await handler.Handle(new GetMyProviderPlanningQuery(providerUser.Id, from, to), CancellationToken.None);

        Assert.Equal(provider.Timezone, response.Timezone);
        Assert.False(response.IsOnline);
        Assert.Equal("offline", response.AvailabilityStatus);

        Assert.Equal(2, response.Schedules.Count);
        Assert.Collection(
            response.Schedules,
            first =>
            {
                Assert.Equal(DayOfWeek.Tuesday, first.DayOfWeek);
                Assert.Null(first.ServiceId);
                Assert.Equal(new TimeOnly(8, 0), first.StartTime);
                Assert.Equal(new TimeOnly(10, 0), first.EndTime);
            },
            second =>
            {
                Assert.Equal(DayOfWeek.Tuesday, second.DayOfWeek);
                Assert.Equal(service.Id, second.ServiceId);
                Assert.Equal(new TimeOnly(13, 0), second.StartTime);
                Assert.Equal(new TimeOnly(15, 0), second.EndTime);
            });

        Assert.Equal(2, response.Unavailabilities.Count);
        Assert.Contains(response.Unavailabilities, item => item.Id == overlappingUnavailability.Id && item.Reason == "Personal errand");
        Assert.Contains(response.Unavailabilities, item => item.Id == recurringUnavailability.Id && item.RecurrenceRule == "FREQ=WEEKLY;BYDAY=WE");
        Assert.DoesNotContain(response.Unavailabilities, item => item.Id == outsideUnavailability.Id);

        Assert.Equal(["BK-PLAN-1", "BK-PLAN-2"], response.Bookings.Select(item => item.BookingNumber).ToArray());

        var firstBooking = response.Bookings[0];
        Assert.Equal("Confirmed", firstBooking.Status);
        Assert.Equal(includedBookings[0].ProviderArrivedAt, firstBooking.ProviderArrivedAt);
        Assert.Equal(providerUser.Id, firstBooking.StatusChangedBy);
        Assert.Equal("Provider arrived", firstBooking.StatusChangeReason);
        Assert.Equal("Bring supplies", firstBooking.Notes);
        Assert.NotNull(firstBooking.Patient);
        Assert.NotNull(firstBooking.Service);

        var declinedBooking = response.Bookings[1];
        Assert.Equal("Cancelled", declinedBooking.Status);
        Assert.Equal(includedBookings[1].CancelledAt, declinedBooking.CancelledAt);
        Assert.Equal(providerUser.Id, declinedBooking.CancelledBy);
        Assert.Equal("Double booked", declinedBooking.CancellationReason);
        Assert.Equal("Declined by provider", declinedBooking.StatusChangeReason);
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
        TimeOnly startTime,
        BookingStatus status,
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
            DailyStartTime = startTime,
            DailyEndTime = startTime.AddMinutes(60),
            DailyDurationMinutes = 60,
            Timezone = provider.Timezone,
            Status = status,
            PatientName = $"{patient.FirstName} {patient.LastName}",
            PatientPhone = patient.User.Phone,
            ServiceLocation = "home",
            ServicePrice = 100m,
            AddonsPrice = 0m,
            Subtotal = 100m,
            PlatformFee = 0m,
            TotalAmount = 100m,
            ProviderAmount = 80m,
            Currency = "TND",
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static DateTime ConvertLocalToUtc(TimeZoneInfo timezone, DateTime localDateTime)
    {
        return TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(localDateTime, DateTimeKind.Unspecified), timezone);
    }
}
