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
/// Command to record provider arrival without introducing a new booking status.
/// </summary>
public record ArriveBookingCommand(
    Guid BookingId,
    Guid CallerUserId) : IRequest<ArriveBookingResponse>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="ArriveBookingCommand"/>.
/// </summary>
public class ArriveBookingHandler : IRequestHandler<ArriveBookingCommand, ArriveBookingResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingSessionRepository _bookingSessionRepository;
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;
    private readonly IBookingRollupService _rollupService;
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ArriveBookingHandler> _logger;

    public ArriveBookingHandler(
        IBookingRepository bookingRepository,
        IBookingSessionRepository bookingSessionRepository,
        IBookingSessionVerificationCodeService verificationCodeService,
        IBookingRollupService rollupService,
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        ILogger<ArriveBookingHandler> logger)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _bookingSessionRepository = bookingSessionRepository ?? throw new ArgumentNullException(nameof(bookingSessionRepository));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ArriveBookingResponse> Handle(
        ArriveBookingCommand command,
        CancellationToken cancellationToken)
    {
        var booking = await _bookingRepository.GetByIdWithPaymentAndOwnersForUpdateAsync(
                command.BookingId,
                cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {command.BookingId} was not found.");

        if (booking.Provider?.UserId != command.CallerUserId)
        {
            throw new UnauthorizedAccessException("Only the assigned provider may record arrival for this booking.");
        }

        var sessions = await _bookingSessionRepository.GetByBookingIdForUpdateAsync(booking.Id, cancellationToken);
        var session = sessions
            .Where(item => item.Status == BookingSessionStatus.ProviderOnWay)
            .OrderBy(item => item.ScheduledDate)
            .ThenBy(item => item.ScheduledStartTime)
            .FirstOrDefault()
            ?? throw new InvalidOperationException("No provider-on-way session is available for arrival tracking.");

        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Arrived);
        var now = DateTime.UtcNow;
        session.Status = BookingSessionStatus.Arrived;
        session.ProviderArrivedAt ??= now;
        _verificationCodeService.GenerateForArrival(session, now);
        _rollupService.RollUp(booking, sessions, command.CallerUserId, "Provider arrived at booking session");
        _db.Notifications.Add(NotificationFactory.CreateValidationPendingForPatient(session));

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Provider {UserId} recorded arrival for booking {BookingId}",
            command.CallerUserId,
            command.BookingId);

        return new ArriveBookingResponse
        {
            Id = booking.Id,
            Status = booking.Status.ToString(),
            ProviderArrivedAt = session.ProviderArrivedAt
        };
    }
}
