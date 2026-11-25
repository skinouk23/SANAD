using MediatR;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Queries;

/// <summary>
/// Query for a single booking session detail.
/// </summary>
public record GetBookingSessionByIdQuery(
    Guid SessionId,
    Guid CallerUserId,
    bool IsAdmin) : IRequest<BookingSessionResponse>;

/// <summary>
/// Handles <see cref="GetBookingSessionByIdQuery"/>.
/// </summary>
public class GetBookingSessionByIdHandler : IRequestHandler<GetBookingSessionByIdQuery, BookingSessionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;
    private readonly IBookingSessionMapper _mapper;

    public GetBookingSessionByIdHandler(
        IBookingSessionRepository sessionRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        IBookingRollupService rollupService,
        IBookingSessionVerificationCodeService verificationCodeService,
        IBookingSessionMapper mapper)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<BookingSessionResponse> Handle(
        GetBookingSessionByIdQuery query,
        CancellationToken cancellationToken)
    {
        var session = await _sessionRepository.GetByIdAsync(query.SessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {query.SessionId} was not found.");

        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.CallerUserId, cancellationToken);
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.CallerUserId, cancellationToken);
        var isPatientOwner = patientId == session.PatientId;
        var isProviderOwner = providerId == session.ProviderId;

        if (!query.IsAdmin && !isPatientOwner && !isProviderOwner)
        {
            throw new UnauthorizedAccessException("You do not have permission to view this booking session.");
        }

        var siblings = await _sessionRepository.GetByBookingIdAsync(session.BookingId, cancellationToken);
        var counts = _rollupService.CountSessions(siblings);
        var code = isPatientOwner
            ? _verificationCodeService.GetVisibleCode(session, session.PatientId, DateTime.UtcNow)
            : null;

        if (isProviderOwner)
        {
            session.VerificationCode = null;
        }

        return _mapper.MapSession(session, counts, code);
    }
}
