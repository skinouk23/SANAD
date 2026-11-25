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
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Bookings.Queries;

public class ProviderBookingReadsTests
{
    [Fact]
    public async Task GetMyProviderBookingDelivery_ReturnsProviderOwnedDeliveryProjection()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser, "Pacific/Kiritimati");
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.ProviderOnWay, "BK-DELIVERY");
        booking.PatientNotes = "Call on arrival";
        booking.AddressLine1 = "12 Rue du Lac";
        booking.City = "Tunis";
        booking.Latitude = 36.8065m;
        booking.Longitude = 10.1815m;
        booking.ProviderAcceptedAt = DateTime.UtcNow.AddHours(-1);
        booking.ProviderDepartedAt = DateTime.UtcNow.AddMinutes(-20);
        booking.ProviderArrivedAt = DateTime.UtcNow.AddMinutes(-5);
        booking.StatusChangedBy = providerUser.Id;
        booking.StatusChangeReason = "Provider arrived";

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new GetMyProviderBookingDeliveryHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            NullLogger<GetMyProviderBookingDeliveryHandler>.Instance);

        var response = await handler.Handle(
            new GetMyProviderBookingDeliveryQuery(booking.Id, providerUser.Id),
            CancellationToken.None);

        Assert.Equal(booking.Id, response.Id);
        Assert.Equal("Sami Trabelsi", response.PatientName);
        Assert.Equal(patientUser.Phone, response.PatientPhone);
        Assert.Equal(service.Name, response.ServiceName);
        Assert.Equal(service.Category, response.ServiceCategory);
        Assert.Equal("12 Rue du Lac, Tunis", response.Location.Address);
        Assert.Equal(36.8065m, response.Location.Lat);
        Assert.Equal(10.1815m, response.Location.Lng);
        Assert.Equal("Call on arrival", response.Notes);
        Assert.Equal(providerUser.Id, response.StatusChangedBy);
        Assert.Equal("Provider arrived", response.StatusChangeReason);
        Assert.Equal(booking.ProviderArrivedAt, response.ProviderArrivedAt);
    }

    [Fact]
    public async Task GetMyProviderTodayBookings_ProjectsLifecycleAndCancellationMetadata()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser, "Africa/Tunis");
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.Completed, "BK-TODAY-META");
        booking.ProviderAcceptedAt = DateTime.UtcNow.AddHours(-3);
        booking.ProviderDepartedAt = DateTime.UtcNow.AddHours(-2);
        booking.ProviderArrivedAt = DateTime.UtcNow.AddHours(-1);
        booking.ServiceStartedAt = DateTime.UtcNow.AddMinutes(-50);
        booking.ServiceCompletedAt = DateTime.UtcNow.AddMinutes(-5);
        booking.StatusChangedBy = providerUser.Id;
        booking.StatusChangeReason = "Service completed by provider";

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new GetMyProviderTodayBookingsHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            NullLogger<GetMyProviderTodayBookingsHandler>.Instance);

        var response = await handler.Handle(new GetMyProviderTodayBookingsQuery(providerUser.Id), CancellationToken.None);
        var item = Assert.Single(response);

        Assert.Equal(booking.ProviderAcceptedAt, item.ProviderAcceptedAt);
        Assert.Equal(booking.ProviderDepartedAt, item.ProviderDepartedAt);
        Assert.Equal(booking.ProviderArrivedAt, item.ProviderArrivedAt);
        Assert.Equal(booking.ServiceStartedAt, item.ServiceStartedAt);
        Assert.Equal(booking.ServiceCompletedAt, item.ServiceCompletedAt);
        Assert.Equal(providerUser.Id, item.StatusChangedBy);
        Assert.Equal("Service completed by provider", item.StatusChangeReason);
        Assert.Null(item.Provider);
        Assert.NotNull(item.Patient);
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
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile<BookingMappingProfile>());
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
            StartDate = DateOnly.FromDateTime(now),
            EndDate = DateOnly.FromDateTime(now),
            DailyStartTime = new TimeOnly(9, 0),
            DailyEndTime = new TimeOnly(10, 0),
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
            ProviderAmount = 100m,
            Currency = "TND",
            CreatedAt = now,
            UpdatedAt = now
        };
    }
}
