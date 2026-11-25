using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Notifications;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Bookings.Commands;

/// <summary>
/// Records provider arrival for a booking session and activates the patient code.
/// </summary>
public record ArriveBookingSessionCommand(
    Guid SessionId,
    Guid CallerUserId) : IRequest<BookingSessionActionResponse>;

/// <summary>
/// Handles <see cref="ArriveBookingSessionCommand"/>.
/// </summary>
public class ArriveBookingSessionHandler : IRequestHandler<ArriveBookingSessionCommand, BookingSessionActionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionMapper _mapper;
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;

    public ArriveBookingSessionHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        IBookingSessionVerificationCodeService verificationCodeService,
        IBookingRollupService rollupService,
        IBookingSessionMapper mapper,
        SanadDbContext db,
        IUnitOfWork unitOfWork)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<BookingSessionActionResponse> Handle(
        ArriveBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        var session = await LoadOwnedSessionAsync(command.SessionId, command.CallerUserId, cancellationToken);
        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Arrived);

        var now = DateTime.UtcNow;
        session.Status = BookingSessionStatus.Arrived;
        session.ProviderArrivedAt = now;
        _verificationCodeService.GenerateForArrival(session, now);

        var siblings = await _sessionRepository.GetByBookingIdForUpdateAsync(session.BookingId, cancellationToken);
        var counts = _rollupService.RollUp(session.Booking, siblings, command.CallerUserId, "Provider arrived at booking session");
        _db.Notifications.Add(NotificationFactory.CreateValidationPendingForPatient(session));
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.MapAction(session, counts);
    }

    private async Task<BookingSession> LoadOwnedSessionAsync(Guid sessionId, Guid callerUserId, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(callerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        var session = await _sessionRepository.GetByIdWithBookingForUpdateAsync(sessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {sessionId} was not found.");

        if (session.ProviderId != providerId)
        {
            throw new UnauthorizedAccessException("Only the assigned provider may update this booking session.");
        }

        return session;
    }
}
