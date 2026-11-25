using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Exceptions;
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
/// Completes and validates a booking session using the patient-provided code.
/// </summary>
public record CompleteBookingSessionCommand(
    Guid SessionId,
    Guid CallerUserId,
    string ValidationCode) : IRequest<BookingSessionActionResponse>, ISensitiveRequest;

/// <summary>
/// Handles <see cref="CompleteBookingSessionCommand"/>.
/// </summary>
public class CompleteBookingSessionHandler : IRequestHandler<CompleteBookingSessionCommand, BookingSessionActionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IBookingSessionVerificationCodeService _verificationCodeService;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSettlementService _settlementService;
    private readonly IBookingSessionMapper _mapper;
    private readonly IProviderWalletService _providerWalletService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CompleteBookingSessionHandler> _logger;

    public CompleteBookingSessionHandler(
        IBookingSessionRepository sessionRepository,
        IProviderRepository providerRepository,
        IBookingSessionVerificationCodeService verificationCodeService,
        IBookingRollupService rollupService,
        IBookingSettlementService settlementService,
        IBookingSessionMapper mapper,
        IProviderWalletService providerWalletService,
        IUnitOfWork unitOfWork,
        ILogger<CompleteBookingSessionHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _verificationCodeService = verificationCodeService ?? throw new ArgumentNullException(nameof(verificationCodeService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _settlementService = settlementService ?? throw new ArgumentNullException(nameof(settlementService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<BookingSessionActionResponse> Handle(
        CompleteBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        var session = await LoadOwnedSessionAsync(command.SessionId, command.CallerUserId, cancellationToken);
        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Validated);

        var now = DateTime.UtcNow;
        var codeCheck = _verificationCodeService.Verify(session, command.ValidationCode, now);
        if (!codeCheck.IsValid)
        {
            if (!codeCheck.IsLocked || session.VerificationAttempts < _verificationCodeService.MaxAttempts)
            {
                session.VerificationAttempts++;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            _logger.LogWarning(
                "Invalid session verification code for session {SessionId}. Attempts remaining {AttemptsRemaining}",
                command.SessionId,
                Math.Max(0, _verificationCodeService.MaxAttempts - session.VerificationAttempts));

            var attemptsRemaining = Math.Max(0, _verificationCodeService.MaxAttempts - session.VerificationAttempts);
            throw new BookingSessionVerificationException(
                ResolveVerificationFailureCode(codeCheck),
                codeCheck.FailureReason ?? "The verification code could not be accepted.",
                new { remainingAttempts = attemptsRemaining, verificationAttemptsRemaining = attemptsRemaining });
        }

        return await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            session.Status = BookingSessionStatus.Validated;
            session.ServiceCompletedAt = now;
            session.VerifiedAt = now;
            session.VerificationMethod = "provider_entered_patient_code";

            var siblings = await _sessionRepository.GetByBookingIdForUpdateAsync(session.BookingId, ct);
            var settled = await _settlementService.SettleIfReadyAsync(session.Booking, siblings, command.CallerUserId, ct);
            var counts = _rollupService.RollUp(session.Booking, siblings, command.CallerUserId, "Provider completed session with patient code");

            await _unitOfWork.SaveChangesAsync(ct);

            if (session.Booking.WalletReservedAmount > 0m && session.Booking.WalletSettledAt.HasValue)
            {
                await _providerWalletService.SyncWalletProjectionFromLedgerAsync(session.Booking.ProviderId, ct);
                await _unitOfWork.SaveChangesAsync(ct);
            }

            _logger.LogInformation(
                "Booking session {SessionId} validated by provider {UserId}; parent settled={Settled}",
                command.SessionId,
                command.CallerUserId,
                settled);

            return _mapper.MapAction(session, counts, settled);
        }, cancellationToken);
    }

    private static string ResolveVerificationFailureCode(VerificationCodeCheckResult codeCheck)
    {
        if (codeCheck.IsLocked)
        {
            return "BOOKING_SESSION_CODE_LOCKED";
        }

        if (codeCheck.IsExpired)
        {
            return "BOOKING_SESSION_CODE_EXPIRED";
        }

        return "BOOKING_SESSION_CODE_INVALID";
    }

    private async Task<BookingSession> LoadOwnedSessionAsync(Guid sessionId, Guid callerUserId, CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(callerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        var session = await _sessionRepository.GetByIdWithBookingForUpdateAsync(sessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {sessionId} was not found.");

        if (session.ProviderId != providerId)
        {
            throw new UnauthorizedAccessException("Only the assigned provider may complete this booking session.");
        }

        return session;
    }
}
