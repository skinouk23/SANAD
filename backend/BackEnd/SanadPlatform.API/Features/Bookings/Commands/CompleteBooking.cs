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
/// Command to complete an in-progress booking. Only the assigned provider may complete.
/// Transitions the booking from <see cref="BookingStatus.InProgress"/> to
/// <see cref="BookingStatus.Completed"/>, after which the patient may validate.
/// </summary>
public record CompleteBookingCommand(
    Guid BookingId,
    Guid CallerUserId) : IRequest<CompleteBookingResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="CompleteBookingCommand"/>.
/// Enforces provider ownership, validates the state machine transition
/// (InProgress → Completed), sets the service completion timestamp, and persists.
/// </summary>
public class CompleteBookingHandler : IRequestHandler<CompleteBookingCommand, CompleteBookingResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingSessionRepository _bookingSessionRepository;
    private readonly IBookingRollupService _rollupService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CompleteBookingHandler> _logger;

    public CompleteBookingHandler(
        IBookingRepository bookingRepository,
        IBookingSessionRepository bookingSessionRepository,
        IBookingRollupService rollupService,
        IUnitOfWork unitOfWork,
        ILogger<CompleteBookingHandler> logger)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _bookingSessionRepository = bookingSessionRepository ?? throw new ArgumentNullException(nameof(bookingSessionRepository));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<CompleteBookingResponse> Handle(
        CompleteBookingCommand command,
        CancellationToken cancellationToken)
    {
        // ==================== Load Tracked Booking with Owners ====================
        var booking = await _bookingRepository.GetByIdWithPaymentAndOwnersForUpdateAsync(
                command.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {command.BookingId} was not found.");

        // ==================== Ownership Check ====================
        if (booking.Provider?.UserId != command.CallerUserId)
            throw new UnauthorizedAccessException("Only the assigned provider may complete this booking.");

        var now = DateTime.UtcNow;
        var sessions = await _bookingSessionRepository.GetByBookingIdForUpdateAsync(booking.Id, cancellationToken);
        var session = sessions
            .Where(item => item.Status == BookingSessionStatus.InProgress)
            .OrderBy(item => item.ScheduledDate)
            .ThenBy(item => item.ScheduledStartTime)
            .FirstOrDefault()
            ?? throw new InvalidOperationException(
                "Legacy booking completion without a code is only available for in-progress compatibility sessions. Use the session complete endpoint for code validation.");

        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Completed);
        session.Status = BookingSessionStatus.Completed;
        session.ServiceCompletedAt = now;
        booking.AutoValidateAt = now.AddHours(48);
        _rollupService.RollUp(booking, sessions, command.CallerUserId, "Legacy booking completed by provider");

        // ==================== Persist ====================
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Legacy booking {BookingId} completed without session code by provider {UserId}",
            command.BookingId, command.CallerUserId);

        // ==================== Build Response ====================
        return new CompleteBookingResponse
        {
            Id = booking.Id,
            Status = booking.Status.ToString(),
            ServiceCompletedAt = session.ServiceCompletedAt,
            AutoValidateAt = booking.AutoValidateAt
        };
    }
}
