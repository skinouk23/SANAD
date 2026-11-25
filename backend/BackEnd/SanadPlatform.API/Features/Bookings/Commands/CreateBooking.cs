using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.AppFeatures;
using SanadPlatform.API.Features.AppFeatures.Repository;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Notifications.Services;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.Payments.Repository;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Features.Services.Services;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Logging;
using Patient = SanadPlatform.API.Features.Patients.Entities.Patient;
using Provider = SanadPlatform.API.Features.Providers.Entities.Provider;
using Service = SanadPlatform.API.Features.Services.Entities.Service;

namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Command to create a new booking package.
/// </summary>
public record CreateBookingCommand(
    Guid CallerUserId,
    Guid ProviderId,
    IReadOnlyList<ServiceItemSelection> ServiceItems,
    DateOnly StartDate,
    DateOnly EndDate,
    TimeOnly DailyStartTime,
    string? AddressLine1,
    string? AddressLine2,
    string? City,
    string? PostalCode,
    decimal? Latitude,
    decimal? Longitude,
    string? AddressInstructions,
    string? PatientNotes,
    string PaymentMethod,
    JsonElement? TypeConfig,
    decimal? ExpectedTotalAmount,
    string? PatientLocationChoice,
    Guid? PrescriptionFileId) : IRequest<CreateBookingResponse>, ISensitiveRequest;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="CreateBookingCommand"/>.
/// </summary>
public class CreateBookingHandler : IRequestHandler<CreateBookingCommand, CreateBookingResponse>
{
    private const string SlotConflictCode = "BOOKING_SLOT_CONFLICT";
    private const string PriceMismatchCode = "BOOKING_PRICE_MISMATCH";

    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingSessionRepository _bookingSessionRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IFeatureRepository _featureRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IBookingPricingService _pricingService;
    private readonly IProviderWalletService _providerWalletService;
    private readonly IBookingSessionGenerationService _sessionGenerationService;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionMapper _sessionMapper;
    private readonly INotificationService _notificationService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateBookingHandler> _logger;

    public CreateBookingHandler(
        IBookingRepository bookingRepository,
        IBookingSessionRepository bookingSessionRepository,
        IPatientRepository patientRepository,
        IFeatureRepository featureRepository,
        IPaymentRepository paymentRepository,
        IBookingPricingService pricingService,
        IProviderWalletService providerWalletService,
        IBookingSessionGenerationService sessionGenerationService,
        IBookingRollupService rollupService,
        IBookingSessionMapper sessionMapper,
        INotificationService notificationService,
        IHttpContextAccessor httpContextAccessor,
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<CreateBookingHandler> logger)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _bookingSessionRepository = bookingSessionRepository ?? throw new ArgumentNullException(nameof(bookingSessionRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _featureRepository = featureRepository ?? throw new ArgumentNullException(nameof(featureRepository));
        _paymentRepository = paymentRepository ?? throw new ArgumentNullException(nameof(paymentRepository));
        _pricingService = pricingService ?? throw new ArgumentNullException(nameof(pricingService));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _sessionGenerationService = sessionGenerationService ?? throw new ArgumentNullException(nameof(sessionGenerationService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _sessionMapper = sessionMapper ?? throw new ArgumentNullException(nameof(sessionMapper));
        _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
        _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<CreateBookingResponse> Handle(
        CreateBookingCommand command,
        CancellationToken cancellationToken)
    {
        var paymentMethod = PaymentMethods.Normalize(command.PaymentMethod);
        await EnsurePaymentMethodEnabledAsync(paymentMethod, cancellationToken);

        var patient = await LoadRequiredEntitiesAsync(command, cancellationToken);
        var idempotencyKey = GetIdempotencyKey();

        if (!string.IsNullOrWhiteSpace(idempotencyKey))
        {
            var existingResponse = await TryGetExistingBookingResponseAsync(patient, idempotencyKey, cancellationToken);
            if (existingResponse != null)
            {
                return existingResponse;
            }
        }

        var pricingInput = new BookingPricingInput(
            command.CallerUserId,
            patient.Id,
            command.ProviderId,
            command.ServiceItems,
            command.StartDate,
            command.EndDate,
            command.DailyStartTime,
            command.AddressLine1,
            command.TypeConfig,
            command.PatientLocationChoice,
            command.PrescriptionFileId);

        var pricingResult = await _pricingService.CalculateAsync(
            pricingInput,
            tracked: true,
            cancellationToken: cancellationToken);

        var provider = pricingResult.Provider;
        var selectedItems = pricingResult.SelectedItems;
        var primaryService = pricingResult.PrimaryService;
        var effectiveEndDate = pricingResult.EffectiveEndDate;
        var timing = pricingResult.Timing;
        var pricing = pricingResult.Pricing;

        if (command.ExpectedTotalAmount.HasValue
            && command.ExpectedTotalAmount.Value != pricing.TotalAmount)
        {
            throw CreatePriceMismatchException(
                message: $"Price mismatch: the expected total {command.ExpectedTotalAmount.Value:F2} "
                    + $"does not match the current total {pricing.TotalAmount:F2}. "
                    + "Please refresh the quote and try again.",
                pricing: pricing,
                currency: ProviderFinanceConstants.DefaultCurrency,
                expectedTotalAmount: command.ExpectedTotalAmount.Value);
        }

        try
        {
            Notification? providerNotification = null;

            var response = await _unitOfWork.ExecuteInTransactionAsync(async ct =>
            {
                var bookingNumber = await _bookingRepository.GenerateBookingNumberAsync(command.StartDate, ct);

                var booking = BuildBookingEntity(
                    command,
                    patient,
                    provider,
                    primaryService,
                    bookingNumber,
                    paymentMethod,
                    effectiveEndDate,
                    timing,
                    pricing,
                    pricingResult.CategoryResult.ServiceLocationOverride);

                var applyContext = new BookingApplyContext(primaryService.Name, pricing.PlatformFee);
                pricingResult.ResolvedPolicy.ApplyToBooking(pricingResult.CategoryResult, booking, applyContext);
                booking.Provider = provider;
                booking.Service = primaryService;

                if (pricingResult.CategoryResult.StockDelta != 0)
                {
                    primaryService.AvailableQuantity = (primaryService.AvailableQuantity ?? 0) + pricingResult.CategoryResult.StockDelta;
                }

                booking.LineItems = BuildBookingLineItemEntities(booking.Id, selectedItems);

                foreach (var trackedService in selectedItems.Select(item => item.Service).DistinctBy(service => service.Id))
                {
                    trackedService.BookingCount++;
                }

                booking.Payment = PaymentModelFactory.CreateBookingPayment(booking, idempotencyKey);
                await _providerWalletService.ReserveCashBookingExposureAsync(booking, ct);

                await _bookingRepository.CreateAsync(booking, ct);
                var sessions = _sessionGenerationService.GenerateSessions(booking);
                await _bookingSessionRepository.CreateRangeAsync(sessions, ct);
                providerNotification = BuildProviderBookingCreatedNotification(booking, patient, provider, primaryService);
                await _db.Notifications.AddAsync(providerNotification, ct);

                try
                {
                    await _unitOfWork.SaveChangesAsync(ct);

                    if (booking.WalletReservedAmount > 0m && booking.WalletReservedAt.HasValue)
                    {
                        await _providerWalletService.SyncWalletProjectionFromLedgerAsync(booking.ProviderId, ct);
                        await _unitOfWork.SaveChangesAsync(ct);
                    }
                }
                catch (DbUpdateException ex)
                    when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.ExclusionViolation })
                {
                    throw CreateSlotConflictException(
                        message: "The selected time slot overlaps with an existing booking. Please choose a different time.",
                        startDate: booking.StartDate,
                        endDate: booking.EndDate,
                        dailyStartTime: booking.DailyStartTime,
                        dailyEndTime: booking.DailyEndTime,
                        conflictType: "exclusion_violation",
                        innerException: ex);
                }

                _logger.LogInformation(
                    "Booking {BookingNumber} created for patient {PatientId} with provider {ProviderId} and {LineItemCount} selected service items",
                    bookingNumber,
                    patient.Id,
                    provider.Id,
                    booking.LineItems.Count);

                var response = MapToResponse(booking, sessions, _rollupService, _sessionMapper);
                pricingResult.ResolvedPolicy.ApplyToResponse(pricingResult.CategoryResult, response, applyContext);
                return response;
            }, cancellationToken);

            if (providerNotification is not null)
            {
                try
                {
                    await _notificationService.DispatchAsync(providerNotification, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Notification dispatch failed for booking {BookingId}",
                        providerNotification.BookingId);
                }
            }

            return response;
        }
        catch (DbUpdateException ex) when (IsPaymentAttemptIdempotencyUniqueViolation(ex, idempotencyKey))
        {
            var existingResponse = await TryGetExistingBookingResponseAsync(patient, idempotencyKey!, cancellationToken);
            if (existingResponse != null)
            {
                return existingResponse;
            }

            throw;
        }
    }

    // ==================== Entity Loading ====================

    private async Task<Patient> LoadRequiredEntitiesAsync(
        CreateBookingCommand command,
        CancellationToken ct)
    {
        return await _patientRepository.GetByUserIdWithUserAsync(command.CallerUserId, ct)
            ?? throw new KeyNotFoundException($"Patient profile not found for user {command.CallerUserId}.");
    }

    // ==================== Entity Building ====================

    private static Booking BuildBookingEntity(
        CreateBookingCommand command,
        Patient patient,
        Provider provider,
        Service primaryService,
        string bookingNumber,
        string paymentMethod,
        DateOnly effectiveEndDate,
        BookingTimingInfo timing,
        BookingPricingInfo pricing,
        string? serviceLocationOverride)
    {
        return new Booking
        {
            Id = Guid.NewGuid(),
            BookingNumber = bookingNumber,
            PatientId = patient.Id,
            ProviderId = provider.Id,
            ServiceId = primaryService.Id,
            StartDate = command.StartDate,
            EndDate = effectiveEndDate,
            DailyStartTime = command.DailyStartTime,
            DailyEndTime = timing.DailyEndTime,
            DailyDurationMinutes = timing.DailyDurationMinutes,
            Timezone = provider.Timezone,

            Status = Common.Enums.BookingStatus.Pending,
            PaymentMethod = paymentMethod,

            PatientName = $"{patient.FirstName} {patient.LastName}".Trim(),
            PatientPhone = patient.User?.Phone,
            PatientEmail = patient.User?.Email,

            ServiceLocation = serviceLocationOverride ?? primaryService.ServiceLocation,
            AddressLine1 = command.AddressLine1,
            AddressLine2 = command.AddressLine2,
            City = command.City,
            PostalCode = command.PostalCode,
            Latitude = command.Latitude,
            Longitude = command.Longitude,
            AddressInstructions = command.AddressInstructions,

            PatientNotes = command.PatientNotes,
            PrescriptionFileId = command.PrescriptionFileId,

            ServicePrice = pricing.ServicePrice,
            AddonsPrice = pricing.AddonsPrice,
            Subtotal = pricing.BookingSubtotal,
            PlatformFee = pricing.PlatformFee,
            TotalAmount = pricing.TotalAmount,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            CommissionRate = provider.CommissionRate,
            CommissionAmount = pricing.PlatformFee,
            ProviderAmount = pricing.ProviderAmount,
            WalletReservedAmount = 0.00m,

            ValidationRequired = true,
            ValidationCode = null,
            ValidationCodeExpiresAt = null,
        };
    }

    private static Notification BuildProviderBookingCreatedNotification(
        Booking booking,
        Patient patient,
        Provider provider,
        Service primaryService)
    {
        var patientName = $"{patient.FirstName} {patient.LastName}".Trim();

        return new Notification
        {
            Id = Guid.NewGuid(),
            UserId = provider.UserId,
            Type = "booking_created",
            Title = "Nouvelle reservation",
            Message = $"{patientName} a cree la reservation {booking.BookingNumber} pour {primaryService.Name}.",
            BookingId = booking.Id,
            ProviderId = provider.Id,
            ActionUrl = "/provider/schedule",
            ActionData = JsonSerializer.Serialize(new BookingNotificationActionData(
                BookingId: booking.Id,
                BookingNumber: booking.BookingNumber,
                ServiceName: primaryService.Name,
                PatientName: patientName,
                StartDate: booking.StartDate.ToString("yyyy-MM-dd"),
                DailyStartTime: booking.DailyStartTime.ToString("HH:mm"))),
        };
    }

    private async Task EnsurePaymentMethodEnabledAsync(
        string paymentMethod,
        CancellationToken cancellationToken)
    {
        var requiredFeatureCode = paymentMethod switch
        {
            PaymentMethods.Cash => null,
            PaymentMethods.Card => AppFeatureCodes.BookingPaymentCard,
            PaymentMethods.D17 => AppFeatureCodes.BookingPaymentD17,
            _ => throw new InvalidOperationException($"Payment method '{paymentMethod}' is not supported.")
        };

        if (requiredFeatureCode is null)
        {
            return;
        }

        var isActive = await _featureRepository.IsActiveAsync(requiredFeatureCode, cancellationToken);
        if (!isActive)
        {
            throw new InvalidOperationException($"Payment method '{paymentMethod}' is currently disabled.");
        }
    }

    private static ICollection<BookingLineItem> BuildBookingLineItemEntities(
        Guid bookingId,
        IReadOnlyList<ResolvedServiceItem> selectedItems)
    {
        return selectedItems.Select(item => new BookingLineItem
        {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            ServiceId = item.Service.Id,
            ServiceName = item.Service.Name,
            ServiceCategory = item.Service.Category,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            Quantity = item.Quantity,
            UnitPrice = item.Service.Price,
            Subtotal = Math.Round(item.Service.Price * item.Quantity, 2),
        }).ToList();
    }

    // ==================== Response Mapping ====================

    private static CreateBookingResponse MapToResponse(
        Booking booking,
        IReadOnlyList<BookingSession>? sessions,
        IBookingRollupService rollupService,
        IBookingSessionMapper sessionMapper)
    {
        ArgumentNullException.ThrowIfNull(booking);

        var scheduledAt = booking.StartDate.ToDateTime(booking.DailyStartTime, DateTimeKind.Utc);
        var dayCount = booking.EndDate.DayNumber - booking.StartDate.DayNumber + 1;
        var perDaySubtotal = booking.ServicePrice + booking.AddonsPrice;

        var counts = sessions is { Count: > 0 }
            ? rollupService.CountSessions(sessions)
            : new BookingSessionCountsResponse();

        return new CreateBookingResponse
        {
            Id = booking.Id,
            BookingNumber = booking.BookingNumber,
            BookingType = booking.Service?.Category ?? string.Empty,
            Status = booking.Status.ToString(),
            PaymentMethod = booking.PaymentMethod,
            PaymentId = booking.Payment?.Id,
            PaymentStatus = booking.Payment?.Status,
            PaymentMethodType = booking.Payment?.MethodType,
            PaymentReferenceNumber = booking.Payment?.ReferenceNumber,
            ScheduledAt = scheduledAt,
            StartDate = booking.StartDate,
            EndDate = booking.EndDate,
            DailyStartTime = booking.DailyStartTime,
            DailyEndTime = booking.DailyEndTime,
            DailyDurationMinutes = booking.DailyDurationMinutes ?? 0,
            DayCount = dayCount,
            Pricing = new CreateBookingPricingResponse
            {
                PerDaySubtotal = perDaySubtotal,
                BookingSubtotal = booking.Subtotal,
                PlatformFee = booking.PlatformFee,
                TotalAmount = booking.TotalAmount,
                Currency = booking.Currency,
            },
            ValidationCode = null,
            Provider = new BookingPartyResponse
            {
                Id = booking.ProviderId,
                Name = booking.Provider is null
                    ? booking.ProviderId.ToString()
                    : $"{booking.Provider.FirstName} {booking.Provider.LastName}".Trim(),
            },
            Service = new BookingServiceResponse
            {
                Id = booking.ServiceId,
                Name = booking.Service?.Name ?? string.Empty,
            },
            ServiceItems = booking.LineItems
                .Select(item => new BookingLineItemResponse
                {
                    Id = item.Id,
                    ServiceId = item.ServiceId,
                    ServiceName = item.ServiceName,
                    ServiceCategory = item.ServiceCategory,
                    Currency = item.Currency,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Subtotal = item.Subtotal,
                })
                .ToList()
                .AsReadOnly(),
            SessionCounts = counts,
            Sessions = sessions is { Count: > 0 }
                ? sessions
                    .Select(session => sessionMapper.MapSession(session, counts, verificationCode: null))
                    .ToList()
                    .AsReadOnly()
                : []
        };
    }

    private async Task<CreateBookingResponse?> TryGetExistingBookingResponseAsync(
        Patient patient,
        string idempotencyKey,
        CancellationToken cancellationToken)
    {
        var existingAttempt = await _paymentRepository.GetAttemptByIdempotencyKeyAsync(idempotencyKey, cancellationToken);
        if (existingAttempt == null)
        {
            return null;
        }

        if (!existingAttempt.Payment.BookingId.HasValue)
        {
            throw new InvalidOperationException(
                "The supplied Idempotency-Key is already associated with a different payment initiation request.");
        }

        var existingBooking = await _bookingRepository.GetByIdAsync(existingAttempt.Payment.BookingId.Value, cancellationToken)
            ?? throw new InvalidOperationException(
                $"The booking linked to Idempotency-Key '{idempotencyKey}' could not be loaded.");

        if (existingBooking.PatientId != patient.Id)
        {
            throw new UnauthorizedAccessException(
                "The supplied Idempotency-Key is already associated with another user's booking request.");
        }

        return MapToResponse(existingBooking, existingBooking.Sessions.ToList().AsReadOnly(), _rollupService, _sessionMapper);
    }

    private string? GetIdempotencyKey()
    {
        var headerValue = _httpContextAccessor.HttpContext?.Request.Headers["Idempotency-Key"].FirstOrDefault();
        return string.IsNullOrWhiteSpace(headerValue) ? null : headerValue.Trim();
    }

    private static bool IsPaymentAttemptIdempotencyUniqueViolation(DbUpdateException exception, string? idempotencyKey)
    {
        return !string.IsNullOrWhiteSpace(idempotencyKey)
            && exception.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation,
                ConstraintName: "ux_payment_attempts_idempotency_key"
            };
    }

    private static BookingConflictException CreateSlotConflictException(
        string message,
        DateOnly startDate,
        DateOnly endDate,
        TimeOnly dailyStartTime,
        TimeOnly? dailyEndTime,
        string conflictType,
        Exception? innerException = null)
    {
        var details = new BookingSlotConflictDetails(
            startDate,
            endDate,
            dailyStartTime,
            dailyEndTime,
            conflictType);

        return innerException is null
            ? new BookingConflictException(SlotConflictCode, message, details)
            : new BookingConflictException(SlotConflictCode, message, details, innerException);
    }

    private static BookingConflictException CreatePriceMismatchException(
        string message,
        BookingPricingInfo pricing,
        string currency,
        decimal expectedTotalAmount)
    {
        var details = new BookingPriceMismatchDetails(
            pricing.PerDaySubtotal,
            pricing.BookingSubtotal,
            pricing.PlatformFee,
            pricing.TotalAmount,
            currency,
            expectedTotalAmount);

        return new BookingConflictException(PriceMismatchCode, message, details);
    }
    // ==================== Internal Types ====================

    private sealed record BookingSlotConflictDetails(
        DateOnly StartDate,
        DateOnly EndDate,
        TimeOnly DailyStartTime,
        TimeOnly? DailyEndTime,
        string ConflictType);

    private sealed record BookingPriceMismatchDetails(
        decimal PerDaySubtotal,
        decimal BookingSubtotal,
        decimal PlatformFee,
        decimal TotalAmount,
        string Currency,
        decimal ExpectedTotalAmount);

    private sealed record BookingNotificationActionData(
        Guid BookingId,
        string BookingNumber,
        string ServiceName,
        string PatientName,
        string StartDate,
        string DailyStartTime);
}
