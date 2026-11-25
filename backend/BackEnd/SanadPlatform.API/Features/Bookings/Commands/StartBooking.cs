using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Command to advance a booking through the provider delivery lifecycle.
/// Only the assigned provider may call this.
/// <para>
/// The handler advances one step at a time:
/// <list type="bullet">
///   <item><description>If the booking is <c>Confirmed</c> → transitions to <c>ProviderOnWay</c>.</description></item>
///   <item><description>If the booking is <c>ProviderOnWay</c> and arrival was already recorded → transitions to <c>InProgress</c>.</description></item>
/// </list>
/// Arrival is tracked separately via <c>ProviderArrivedAt</c> and does not change the booking status.
/// </para>
/// </summary>
public record StartBookingCommand(
    Guid BookingId,
    Guid CallerUserId) : IRequest<StartBookingResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="StartBookingCommand"/>.
/// Enforces provider ownership, determines the next valid forward status
/// from the current booking state, sets lifecycle timestamps, and persists.
/// </summary>
public class StartBookingHandler : IRequestHandler<StartBookingCommand, StartBookingResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingSessionRepository _bookingSessionRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<StartBookingHandler> _logger;

    public StartBookingHandler(
        IBookingRepository bookingRepository,
        IBookingSessionRepository bookingSessionRepository,
        IBookingRollupService rollupService,
        IUnitOfWork unitOfWork,
        ILogger<StartBookingHandler> logger)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _bookingSessionRepository = bookingSessionRepository ?? throw new ArgumentNullException(nameof(bookingSessionRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<StartBookingResponse> Handle(
        StartBookingCommand command,
        CancellationToken cancellationToken)
    {
        // ==================== Load Tracked Booking with Owners ====================
        var booking = await _bookingRepository.GetByIdWithPaymentAndOwnersForUpdateAsync(
                command.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {command.BookingId} was not found.");

        // ==================== Ownership Check ====================
        if (booking.Provider?.UserId != command.CallerUserId)
            throw new UnauthorizedAccessException("Only the assigned provider may start this booking.");

        var now = DateTime.UtcNow;
        var sessions = await _bookingSessionRepository.GetByBookingIdForUpdateAsync(booking.Id, cancellationToken);
        var session = ResolveLegacyTargetSession(sessions, booking.Id);
        var targetStatus = session.Status switch
        {
            BookingSessionStatus.Confirmed => BookingSessionStatus.ProviderOnWay,
            BookingSessionStatus.Arrived => BookingSessionStatus.InProgress,
            _ => throw new InvalidOperationException(
                $"Cannot start a booking session that is currently '{session.Status}'. Only Confirmed or Arrived sessions can be advanced.")
        };

        BookingSessionStateMachine.ValidateTransition(session.Status, targetStatus);
        session.Status = targetStatus;

        if (targetStatus == BookingSessionStatus.ProviderOnWay)
        {
            session.ProviderDepartedAt = now;
        }

        if (targetStatus == BookingSessionStatus.InProgress)
        {
            session.ServiceStartedAt = now;
        }

        _rollupService.RollUp(booking, sessions, command.CallerUserId, "Legacy booking start advanced session");

        // ==================== Persist ====================
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Booking {BookingId} advanced to {Status} by provider {UserId}",
            command.BookingId, targetStatus, command.CallerUserId);

        // ==================== Build Response ====================
        return new StartBookingResponse
        {
            Id = booking.Id,
            Status = booking.Status.ToString(),
            ProviderDepartedAt = session.ProviderDepartedAt,
            ProviderArrivedAt = session.ProviderArrivedAt,
            ServiceStartedAt = session.ServiceStartedAt
        };
    }

    private static BookingSession ResolveLegacyTargetSession(IReadOnlyList<BookingSession> sessions, Guid bookingId)
    {
        return sessions
            .Where(session => !BookingSessionStateMachine.IsTerminal(session.Status))
            .OrderBy(session => session.ScheduledDate)
            .ThenBy(session => session.ScheduledStartTime)
            .FirstOrDefault()
            ?? throw new InvalidOperationException($"Booking {bookingId} has no active sessions to advance.");
    }
}
