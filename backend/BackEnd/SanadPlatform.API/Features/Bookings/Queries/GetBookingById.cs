using MediatR;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Patients.Repository;

namespace SanadPlatform.API.Features.Bookings.Queries;

// ==================== Query ====================

/// <summary>
/// Query to retrieve a single booking by its ID.
/// Only the booking's patient, provider, or an admin may view it.
/// </summary>
public record GetBookingByIdQuery(
    Guid BookingId,
    Guid CallerUserId,
    bool IsAdmin) : IRequest<BookingResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetBookingByIdQuery"/>.
/// Uses a two-step approach for efficiency:
/// 1. Lightweight ownership check (2-column SELECT) for authorisation.
/// 2. Projected read (ProjectTo) that generates minimal SQL for the response DTO.
/// </summary>
public class GetBookingByIdHandler : IRequestHandler<GetBookingByIdQuery, BookingResponse>
{
    private readonly IBookingRepository _repository;
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;
    private readonly IBookingSessionMapper _sessionMapper;
    private readonly ILogger<GetBookingByIdHandler> _logger;

    public GetBookingByIdHandler(
        IBookingRepository repository,
        IBookingSessionRepository sessionRepository,
        IPatientRepository patientRepository,
        IBookingRollupService rollupService,
        IBookingSessionVerificationCodeService verificationCodeService,
        IBookingSessionMapper sessionMapper,
        ILogger<GetBookingByIdHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
        _sessionMapper = sessionMapper ?? throw new ArgumentNullException(nameof(sessionMapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BookingResponse> Handle(
        GetBookingByIdQuery query,
        CancellationToken cancellationToken)
    {
        // ==================== Authorisation Check (lightweight) ====================
        // SELECT only Patient.UserId and Provider.UserId — no full entity graph needed.
        var ownership = await _repository.GetBookingOwnershipAsync(query.BookingId, cancellationToken);

        if (ownership == null)
            throw new KeyNotFoundException($"Booking {query.BookingId} was not found.");

        if (!query.IsAdmin)
        {
            bool isPatientOwner  = ownership.PatientUserId  == query.CallerUserId;
            bool isProviderOwner = ownership.ProviderUserId == query.CallerUserId;

            if (!isPatientOwner && !isProviderOwner)
            {
                _logger.LogDebug(
                    "Unauthorised access attempt: user {UserId} requested booking {BookingId}",
                    query.CallerUserId,
                    query.BookingId);

                throw new UnauthorizedAccessException(
                    "You do not have permission to view this booking.");
            }
        }

        // ==================== Projected Read (efficient) ====================
        // ProjectTo generates SQL with only the columns mapped in BookingResponse.
        // Sub-collections (Addons) use correlated subqueries instead of cartesian JOINs.
        var result = await _repository.GetByIdProjectedAsync<BookingResponse>(query.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {query.BookingId} was not found.");

        var sessions = await _sessionRepository.GetByBookingIdAsync(query.BookingId, cancellationToken);
        if (sessions.Count == 0)
        {
            return result;
        }

        var counts = _rollupService.CountSessions(sessions);
        var callerPatientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken);
        var now = DateTime.UtcNow;
        var sessionResponses = sessions
            .Select(session =>
            {
                var code = callerPatientId.HasValue
                    ? _verificationCodeService.GetVisibleCode(session, callerPatientId.Value, now)
                    : null;
                return _sessionMapper.MapSession(session, counts, code);
            })
            .ToList()
            .AsReadOnly();

        return new BookingResponse
        {
            Id = result.Id,
            BookingNumber = result.BookingNumber,
            PatientId = result.PatientId,
            ProviderId = result.ProviderId,
            PrimaryServiceId = result.PrimaryServiceId,
            StartDate = result.StartDate,
            EndDate = result.EndDate,
            DailyStartTime = result.DailyStartTime,
            DailyEndTime = result.DailyEndTime,
            DailyDurationMinutes = result.DailyDurationMinutes,
            DayCount = result.DayCount,
            Timezone = result.Timezone,
            Status = result.Status,
            PaymentMethod = result.PaymentMethod,
            PaymentId = result.PaymentId,
            PaymentStatus = result.PaymentStatus,
            PaymentMethodType = result.PaymentMethodType,
            PaymentReferenceNumber = result.PaymentReferenceNumber,
            PatientName = result.PatientName,
            PatientPhoneNumber = result.PatientPhoneNumber,
            PatientEmail = result.PatientEmail,
            ProviderName = result.ProviderName,
            ProviderPhoneNumber = result.ProviderPhoneNumber,
            ProviderProfilePhotoUrl = result.ProviderProfilePhotoUrl,
            ServiceName = result.ServiceName,
            EstimatedCost = result.EstimatedCost,
            ServiceModality = result.ServiceModality,
            ServiceCategory = result.ServiceCategory,
            AddressLine1 = result.AddressLine1,
            AddressLine2 = result.AddressLine2,
            City = result.City,
            PostalCode = result.PostalCode,
            Latitude = result.Latitude,
            Longitude = result.Longitude,
            AddressInstructions = result.AddressInstructions,
            PerDaySubtotal = result.PerDaySubtotal,
            PlatformFee = result.PlatformFee,
            TotalAmount = result.TotalAmount,
            Currency = result.Currency,
            IsProviderConfirmed = result.IsProviderConfirmed,
            ProviderConfirmedAt = result.ProviderConfirmedAt,
            IsRescheduleRequested = result.IsRescheduleRequested,
            RescheduleCount = result.RescheduleCount,
            AutoValidateAt = result.AutoValidateAt,
            ProviderAcceptedAt = result.ProviderAcceptedAt,
            ProviderDepartedAt = result.ProviderDepartedAt,
            ProviderArrivedAt = result.ProviderArrivedAt,
            ServiceStartedAt = result.ServiceStartedAt,
            ServiceCompletedAt = result.ServiceCompletedAt,
            ValidatedAt = result.ValidatedAt,
            CancelledAt = result.CancelledAt,
            CancelledBy = result.CancelledBy,
            CancellationReason = result.CancellationReason,
            StatusChangedBy = result.StatusChangedBy,
            StatusChangeReason = result.StatusChangeReason,
            CreatedAt = result.CreatedAt,
            UpdatedAt = result.UpdatedAt,
            Patient = result.Patient,
            Provider = result.Provider,
            Service = result.Service,
            LineItems = result.LineItems,
            SessionCounts = counts,
            Sessions = sessionResponses
        };
    }
}
