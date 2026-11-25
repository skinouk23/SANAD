using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Notifications;
using SanadPlatform.API.Infrastructure.Database;
namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Command to confirm a pending booking. Only the assigned provider may confirm.
/// Transitions the booking from <see cref="BookingStatus.Pending"/> to
/// <see cref="BookingStatus.Confirmed"/>.
/// </summary>
public record ConfirmBookingCommand(
    Guid BookingId,
    Guid CallerUserId) : IRequest<ConfirmBookingResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="ConfirmBookingCommand"/>.
/// Enforces provider ownership, validates the state machine transition
/// (Pending → Confirmed), sets tracking timestamps, and persists.
/// </summary>
public class ConfirmBookingHandler : IRequestHandler<ConfirmBookingCommand, ConfirmBookingResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingSessionRepository _bookingSessionRepository;
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ConfirmBookingHandler> _logger;

    public ConfirmBookingHandler(
        IBookingRepository bookingRepository,
        IBookingSessionRepository bookingSessionRepository,
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<ConfirmBookingHandler> logger)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _bookingSessionRepository = bookingSessionRepository ?? throw new ArgumentNullException(nameof(bookingSessionRepository));
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ConfirmBookingResponse> Handle(
        ConfirmBookingCommand command,
        CancellationToken cancellationToken)
    {
        // ==================== Load Tracked Booking with Owners ====================
        var booking = await _bookingRepository.GetByIdWithPaymentAndOwnersForUpdateAsync(
                command.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {command.BookingId} was not found.");

        // ==================== Ownership Check ====================
        if (booking.Provider?.UserId != command.CallerUserId)
            throw new UnauthorizedAccessException("Only the assigned provider may confirm this booking.");

        var sessions = await _bookingSessionRepository.GetByBookingIdForUpdateAsync(booking.Id, cancellationToken);
        if (sessions.Count == 0)
        {
            throw new InvalidOperationException("Booking has no executable sessions to confirm.");
        }

        if (sessions.Count > 1)
        {
            throw new InvalidOperationException("Multi-session bookings must be confirmed one session at a time. Use POST /api/v1/booking-sessions/{sessionId}/confirm.");
        }

        // ==================== State Machine Guard ====================
        BookingStateMachine.ValidateTransition(booking.Status, BookingStatus.Confirmed);

        // ==================== Mutate ====================
        booking.Status = BookingStatus.Confirmed;
        booking.StatusChangedBy = command.CallerUserId;
        booking.StatusChangeReason = "Confirmed by provider";
        booking.ProviderAcceptedAt = DateTime.UtcNow;

        var session = sessions[0];
        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Confirmed);
        session.Status = BookingSessionStatus.Confirmed;
        _db.Notifications.Add(NotificationFactory.CreateBookingConfirmedForPatient(booking));

        // ==================== Persist ====================
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Booking {BookingId} confirmed by provider {UserId}",
            command.BookingId, command.CallerUserId);

        // ==================== Build Response ====================
        return new ConfirmBookingResponse
        {
            Id = booking.Id,
            Status = booking.Status.ToString(),
            ConfirmedAt = booking.ProviderAcceptedAt
        };
    }

}
