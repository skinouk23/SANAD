using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Commands;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Mappings;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Tests.Features.Bookings.Commands;

public class ProviderBookingActionsTests
{
    [Fact]
    public async Task CancelBooking_WhenProviderDeclines_StoresProviderDecisionMetadata()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.Pending, "BK-DECLINE");

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new CancelBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            new PatientRepository(context, mapper, NullLogger<PatientRepository>.Instance),
            new ServiceRepository(context, NullLogger<ServiceRepository>.Instance),
            CreatePolicyRegistry(),
            context,
            NullLogger<CancelBookingHandler>.Instance);

        var response = await handler.Handle(
            new CancelBookingCommand(
                BookingId: booking.Id,
                CallerUserId: providerUser.Id,
                IsPatient: false,
                IsProvider: true,
                CancellationReason: "Double-booked slot",
                IsDeclineAction: true),
            CancellationToken.None);

        var persistedBooking = await context.Bookings.AsNoTracking().FirstAsync(b => b.Id == booking.Id);
        var persistedProvider = await context.Providers.AsNoTracking().FirstAsync(p => p.Id == provider.Id);

        Assert.Equal(BookingStatus.Cancelled, persistedBooking.Status);
        Assert.Equal(providerUser.Id, persistedBooking.CancelledBy);
        Assert.Equal(providerUser.Id, persistedBooking.StatusChangedBy);
        Assert.Equal("Declined by provider", persistedBooking.StatusChangeReason);
        Assert.Equal("Double-booked slot", persistedBooking.CancellationReason);
        Assert.Equal(providerUser.Id, response.CancelledBy);
        Assert.Equal(providerUser.Id, response.StatusChangedBy);
        Assert.Equal("Declined by provider", response.StatusChangeReason);
        Assert.Equal(1, persistedProvider.CancelledBookings);
    }

    [Fact]
    public async Task CancelBooking_WhenProviderDeclinesNonPendingBooking_ThrowsInvalidOperationException()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.Confirmed, "BK-DECLINE-CONFIRMED");

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new CancelBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            new ProviderRepository(context, mapper, NullLogger<ProviderRepository>.Instance),
            new PatientRepository(context, mapper, NullLogger<PatientRepository>.Instance),
            new ServiceRepository(context, NullLogger<ServiceRepository>.Instance),
            CreatePolicyRegistry(),
            context,
            NullLogger<CancelBookingHandler>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new CancelBookingCommand(
                BookingId: booking.Id,
                CallerUserId: providerUser.Id,
                IsPatient: false,
                IsProvider: true,
                CancellationReason: "Too late",
                IsDeclineAction: true),
            CancellationToken.None));

        Assert.Equal("Only pending bookings can be declined. Current status is 'Confirmed'.", exception.Message);
    }

    [Fact]
    public async Task StartBooking_WhenProviderStartsConfirmedBooking_SetsProviderOnWayWithoutArrival()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.Confirmed, "BK-START-STEP1");

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new StartBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            context,
            NullLogger<StartBookingHandler>.Instance);

        var response = await handler.Handle(
            new StartBookingCommand(booking.Id, providerUser.Id),
            CancellationToken.None);

        var persistedBooking = await context.Bookings.AsNoTracking().FirstAsync(b => b.Id == booking.Id);

        Assert.Equal(BookingStatus.ProviderOnWay, persistedBooking.Status);
        Assert.NotNull(persistedBooking.ProviderDepartedAt);
        Assert.Null(persistedBooking.ProviderArrivedAt);
        Assert.Null(persistedBooking.ServiceStartedAt);
        Assert.Equal("Provider departed", persistedBooking.StatusChangeReason);
        Assert.Equal(BookingStatus.ProviderOnWay.ToString(), response.Status);
        Assert.Equal(persistedBooking.ProviderDepartedAt, response.ProviderDepartedAt);
        Assert.Null(response.ProviderArrivedAt);
        Assert.Null(response.ServiceStartedAt);
    }

    [Fact]
    public async Task StartBooking_WhenProviderStartsProviderOnWayBookingWithoutArrival_ThrowsInvalidOperationException()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.ProviderOnWay, "BK-START-STEP2-BLOCKED");
        booking.ProviderDepartedAt = DateTime.UtcNow.AddMinutes(-20);

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new StartBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            context,
            NullLogger<StartBookingHandler>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new StartBookingCommand(booking.Id, providerUser.Id),
            CancellationToken.None));

        Assert.Equal("Provider arrival must be recorded before the service can start.", exception.Message);
    }

    [Fact]
    public async Task StartBooking_WhenProviderStartsProviderOnWayBookingAfterArrival_SetsInProgressWithoutChangingArrival()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.ProviderOnWay, "BK-START-STEP2");
        var arrivedAt = DateTime.UtcNow.AddMinutes(-3);
        booking.ProviderDepartedAt = DateTime.UtcNow.AddMinutes(-18);
        booking.ProviderArrivedAt = arrivedAt;

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new StartBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            context,
            NullLogger<StartBookingHandler>.Instance);

        var response = await handler.Handle(
            new StartBookingCommand(booking.Id, providerUser.Id),
            CancellationToken.None);

        var persistedBooking = await context.Bookings.AsNoTracking().FirstAsync(b => b.Id == booking.Id);

        Assert.Equal(BookingStatus.InProgress, persistedBooking.Status);
        Assert.Equal(arrivedAt, persistedBooking.ProviderArrivedAt);
        Assert.NotNull(persistedBooking.ServiceStartedAt);
        Assert.Equal("Service started", persistedBooking.StatusChangeReason);
        Assert.Equal(BookingStatus.InProgress.ToString(), response.Status);
        Assert.Equal(arrivedAt, response.ProviderArrivedAt);
        Assert.Equal(persistedBooking.ServiceStartedAt, response.ServiceStartedAt);
    }

    [Fact]
    public async Task ArriveBooking_WhenProviderOwnsProviderOnWayBooking_SetsArrivalTimestampOnly()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.ProviderOnWay, "BK-ARRIVE");
        booking.ProviderDepartedAt = DateTime.UtcNow.AddMinutes(-15);

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new ArriveBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            context,
            NullLogger<ArriveBookingHandler>.Instance);

        var response = await handler.Handle(
            new ArriveBookingCommand(booking.Id, providerUser.Id),
            CancellationToken.None);

        var persistedBooking = await context.Bookings.AsNoTracking().FirstAsync(b => b.Id == booking.Id);

        Assert.Equal(BookingStatus.ProviderOnWay, persistedBooking.Status);
        Assert.NotNull(persistedBooking.ProviderArrivedAt);
        Assert.Equal(providerUser.Id, persistedBooking.StatusChangedBy);
        Assert.Equal("Provider arrived", persistedBooking.StatusChangeReason);
        Assert.Equal(persistedBooking.ProviderArrivedAt, response.ProviderArrivedAt);
        Assert.Equal(BookingStatus.ProviderOnWay.ToString(), response.Status);
    }

    [Fact]
    public async Task ArriveBooking_WhenBookingAlreadyInProgress_ThrowsInvalidOperationException()
    {
        await using var context = CreateContext();
        var mapper = CreateMapper();
        var providerUser = CreateUser("provider");
        var provider = CreateProvider(providerUser);
        var patientUser = CreateUser("patient");
        var patient = CreatePatient(patientUser);
        var service = CreateService(provider);
        var booking = CreateBooking(provider, patient, service, BookingStatus.InProgress, "BK-ARRIVE-BLOCKED");
        booking.ProviderDepartedAt = DateTime.UtcNow.AddMinutes(-15);
        booking.ServiceStartedAt = DateTime.UtcNow.AddMinutes(-5);

        context.Users.AddRange(providerUser, patientUser);
        context.Providers.Add(provider);
        context.Patients.Add(patient);
        context.Services.Add(service);
        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var handler = new ArriveBookingHandler(
            new BookingRepository(context, mapper, NullLogger<BookingRepository>.Instance),
            context,
            NullLogger<ArriveBookingHandler>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(
            new ArriveBookingCommand(booking.Id, providerUser.Id),
            CancellationToken.None));

        Assert.Equal("Cannot record arrival while booking status is 'InProgress'. Only ProviderOnWay bookings support arrival tracking.", exception.Message);
    }

    private static BookingCategoryPolicyRegistry CreatePolicyRegistry()
    {
        var defaultPolicy = new DefaultBookingCategoryPolicy();
        return new BookingCategoryPolicyRegistry([defaultPolicy], defaultPolicy);
    }

    private static SanadDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SanadDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString("N"))
            .ConfigureWarnings(warnings => warnings.Ignore(InMemoryEventId.TransactionIgnoredWarning))
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

    private static Provider CreateProvider(User user)
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
            Timezone = "Africa/Tunis",
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
