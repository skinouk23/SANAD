using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Bookings.Commands;

/// <summary>
/// Starts provider journey for a confirmed booking session.
/// </summary>
public record StartBookingSessionJourneyCommand(
    Guid SessionId,
    Guid CallerUserId) : IRequest<BookingSessionActionResponse>;

/// <summary>
/// Handles <see cref="StartBookingSessionJourneyCommand"/>.
/// </summary>
public class StartBookingSessionJourneyHandler : IRequestHandler<StartBookingSessionJourneyCommand, BookingSessionActionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public StartBookingSessionJourneyHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        IBookingRollupService rollupService,
        IBookingSessionMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<BookingSessionActionResponse> Handle(
        StartBookingSessionJourneyCommand command,
        CancellationToken cancellationToken)
    {
        var session = await LoadOwnedSessionAsync(command.SessionId, command.CallerUserId, cancellationToken);
        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.ProviderOnWay);

        session.Status = BookingSessionStatus.ProviderOnWay;
        session.ProviderDepartedAt = DateTime.UtcNow;

        var siblings = await _sessionRepository.GetByBookingIdForUpdateAsync(session.BookingId, cancellationToken);
        var counts = _rollupService.RollUp(session.Booking, siblings, command.CallerUserId, "Provider started session journey");
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
