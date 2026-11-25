using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Notifications;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Bookings.Commands;

/// <summary>
/// Confirms one pending booking session assigned to the authenticated provider.
/// </summary>
public record ConfirmBookingSessionCommand(
    Guid SessionId,
    Guid CallerUserId) : IRequest<BookingSessionActionResponse>;

/// <summary>
/// Handles <see cref="ConfirmBookingSessionCommand"/>.
/// </summary>
public class ConfirmBookingSessionHandler : IRequestHandler<ConfirmBookingSessionCommand, BookingSessionActionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionMapper _mapper;
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ConfirmBookingSessionHandler> _logger;

    public ConfirmBookingSessionHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        IBookingRollupService rollupService,
        IBookingSessionMapper mapper,
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<ConfirmBookingSessionHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BookingSessionActionResponse> Handle(
        ConfirmBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.CallerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        var session = await _sessionRepository.GetByIdWithBookingForUpdateAsync(command.SessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {command.SessionId} was not found.");

        if (session.ProviderId != providerId)
        {
            throw new UnauthorizedAccessException("Only the assigned provider may confirm this booking session.");
        }

        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Confirmed);

        session.Status = BookingSessionStatus.Confirmed;
        session.Booking.ProviderAcceptedAt ??= DateTime.UtcNow;

        var siblings = await _sessionRepository.GetByBookingIdForUpdateAsync(session.BookingId, cancellationToken);
        var previousBookingStatus = session.Booking.Status;
        var counts = _rollupService.RollUp(session.Booking, siblings, command.CallerUserId, "Booking session confirmed");

        if (previousBookingStatus != BookingStatus.Confirmed
            && session.Booking.Status == BookingStatus.Confirmed)
        {
            _db.Notifications.Add(NotificationFactory.CreateBookingConfirmedForPatient(session.Booking));
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Booking session {SessionId} for booking {BookingId} confirmed by provider {UserId}",
            session.Id,
            session.BookingId,
            command.CallerUserId);

        return _mapper.MapAction(session, counts);
    }
}
