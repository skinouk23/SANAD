using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Commands;

/// <summary>
/// Marks an owned in-route or arrived booking session as patient no-show.
/// </summary>
public record MarkNoShowBookingSessionCommand(
    Guid SessionId,
    Guid CallerUserId,
    string? NoShowReason) : IRequest<BookingSessionActionResponse>, ISensitiveRequest;

/// <summary>
/// Handles <see cref="MarkNoShowBookingSessionCommand"/>.
/// </summary>
public class MarkNoShowBookingSessionHandler : IRequestHandler<MarkNoShowBookingSessionCommand, BookingSessionActionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderWalletService _providerWalletService;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public MarkNoShowBookingSessionHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        IProviderWalletService providerWalletService,
        IBookingRollupService rollupService,
        IBookingSessionMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<BookingSessionActionResponse> Handle(
        MarkNoShowBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        var session = await LoadOwnedSessionAsync(command.SessionId, command.CallerUserId, cancellationToken);
        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.NoShow);

        return await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            session.Status = BookingSessionStatus.NoShow;
            session.NoShowAt = DateTime.UtcNow;
            session.NoShowReason = command.NoShowReason?.Trim();

            var siblings = await _sessionRepository.GetByBookingIdForUpdateAsync(session.BookingId, ct);
            var counts = _rollupService.RollUp(session.Booking, siblings, command.CallerUserId, "Provider marked booking session as no-show");
            var allSessionsClosedWithoutPayment = siblings.All(sibling => sibling.Status is BookingSessionStatus.Cancelled or BookingSessionStatus.NoShow);

            if (allSessionsClosedWithoutPayment)
            {
                await _providerWalletService.ReleaseCashBookingHoldAsync(session.Booking, ct);
            }

            await _unitOfWork.SaveChangesAsync(ct);

            if (allSessionsClosedWithoutPayment
                && session.Booking.WalletReservedAmount > 0m
                && session.Booking.WalletReservationReleasedAt.HasValue)
            {
                await _providerWalletService.SyncWalletProjectionFromLedgerAsync(session.Booking.ProviderId, ct);
                await _unitOfWork.SaveChangesAsync(ct);
            }

            return _mapper.MapAction(session, counts);
        }, cancellationToken);
    }

    private async Task<BookingSession> LoadOwnedSessionAsync(Guid sessionId, Guid callerUserId, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(callerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        var session = await _sessionRepository.GetByIdWithBookingForUpdateAsync(sessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {sessionId} was not found.");

        if (session.ProviderId != providerId)
        {
            throw new UnauthorizedAccessException("Only the assigned provider may mark this booking session as no-show.");
        }

        return session;
    }
}
