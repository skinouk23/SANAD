using System.Text.Json;
using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Commands;

/// <summary>
/// Cancels one future booking session without introducing a parent partial-cancel status.
/// </summary>
public record CancelBookingSessionCommand(
    Guid SessionId,
    Guid CallerUserId,
    bool IsPatient,
    bool IsProvider,
    string? CancellationReason) : IRequest<BookingSessionActionResponse>, ISensitiveRequest;

/// <summary>
/// Handles <see cref="CancelBookingSessionCommand"/>.
/// </summary>
public class CancelBookingSessionHandler : IRequestHandler<CancelBookingSessionCommand, BookingSessionActionResponse>
{
    private readonly IBookingSessionRepository _sessionRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderWalletService _providerWalletService;
    private readonly IBookingRollupService _rollupService;
    private readonly IBookingSessionMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public CancelBookingSessionHandler(
        IBookingSessionRepository sessionRepository,
        IBookingRepository bookingRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        IProviderWalletService providerWalletService,
        IBookingRollupService rollupService,
        IBookingSessionMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _rollupService = rollupService ?? throw new ArgumentNullException(nameof(rollupService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<BookingSessionActionResponse> Handle(
        CancelBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        var session = await _sessionRepository.GetByIdWithBookingForUpdateAsync(command.SessionId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking session {command.SessionId} was not found.");

        await EnsureOwnershipAsync(session, command, cancellationToken);

        if (session.Status is BookingSessionStatus.ProviderOnWay or BookingSessionStatus.Arrived or BookingSessionStatus.InProgress)
        {
            throw new InvalidOperationException("Session cancellation is allowed only before the session starts.");
        }

        BookingSessionStateMachine.ValidateTransition(session.Status, BookingSessionStatus.Cancelled);

        var previousStatus = session.Status;
        return await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            session.Status = BookingSessionStatus.Cancelled;
            session.CancelledAt = DateTime.UtcNow;
            session.CancelledBy = command.CallerUserId;
            session.CancellationReason = command.CancellationReason?.Trim();

            var siblings = await _sessionRepository.GetByBookingIdForUpdateAsync(session.BookingId, ct);
            var allSessionsCancelled = siblings.All(sibling => sibling.Status == BookingSessionStatus.Cancelled);
            var financeAllocation = CalculateFinanceAllocation(session.Booking, siblings, previousStatus, allSessionsCancelled);
            await ApplyCancellationFinanceAsync(session.Booking, financeAllocation, allSessionsCancelled, command, ct);

            var counts = _rollupService.RollUp(session.Booking, siblings, command.CallerUserId, "Booking session cancelled");

            if (allSessionsCancelled)
            {
                session.Booking.CancelledAt ??= session.CancelledAt;
                session.Booking.CancelledBy ??= command.CallerUserId;
                session.Booking.CancellationReason ??= command.CancellationReason;
                await _providerWalletService.ReleaseCashBookingHoldAsync(session.Booking, ct);
            }

            await _unitOfWork.SaveChangesAsync(ct);

            if (allSessionsCancelled
                && session.Booking.WalletReservedAmount > 0m
                && session.Booking.WalletReservationReleasedAt.HasValue)
            {
                await _providerWalletService.SyncWalletProjectionFromLedgerAsync(session.Booking.ProviderId, ct);
                await _unitOfWork.SaveChangesAsync(ct);
            }

            var response = _mapper.MapAction(session, counts);
            return response with
            {
                AllocatedSessionAmount = financeAllocation.AllocatedSessionAmount,
                CancellationFee = financeAllocation.CancellationFee,
                RefundAmount = financeAllocation.RefundAmount,
                RefundStatus = financeAllocation.RefundStatus,
                PaymentId = session.Booking.Payment?.Id,
                PaymentStatus = session.Booking.Payment?.Status
            };
        }, cancellationToken);
    }

    private async Task ApplyCancellationFinanceAsync(
        Booking booking,
        SessionCancellationFinanceAllocation allocation,
        bool allSessionsCancelled,
        CancelBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        if (allocation.CancellationFee > 0m)
        {
            booking.CancellationFee = (booking.CancellationFee ?? 0m) + allocation.CancellationFee;
        }

        if (booking.Payment == null)
        {
            allocation.RefundStatus = booking.TotalAmount > 0m ? "no_payment" : null;
            return;
        }

        var isCashPayment = string.Equals(
            booking.Payment.MethodType,
            PaymentConstants.MethodTypes.Cash,
            StringComparison.Ordinal);

        if (allocation.RefundAmount > 0m && !isCashPayment)
        {
            var refund = new Refund
            {
                PaymentId = booking.Payment.Id,
                BookingId = booking.Id,
                Amount = allocation.RefundAmount,
                Reason = command.CancellationReason?.Trim() ?? "Booking session cancelled",
                Status = "pending",
                RequestedBy = command.CallerUserId,
                GatewayResponse = BuildRefundMetadataJson(command.SessionId, allocation, allSessionsCancelled)
            };

            await _bookingRepository.CreateRefundAsync(refund, cancellationToken);
            allocation.RefundStatus = "pending";
        }
        else if (allocation.RefundAmount > 0m && isCashPayment)
        {
            allocation.RefundStatus = "no_payment";
        }

        if (allSessionsCancelled)
        {
            PaymentModelFactory.MarkCancelled(booking.Payment, DateTime.UtcNow);
            PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment).Status = PaymentConstants.AttemptStatuses.Cancelled;
        }
    }

    private static SessionCancellationFinanceAllocation CalculateFinanceAllocation(
        Booking booking,
        IReadOnlyList<BookingSession> siblings,
        BookingSessionStatus previousStatus,
        bool allSessionsCancelled)
    {
        var cancellableCount = siblings.Count(session => session.Status == BookingSessionStatus.Cancelled);
        if (cancellableCount <= 0 || booking.TotalAmount <= 0m)
        {
            return new SessionCancellationFinanceAllocation();
        }

        var standardSessionAmount = decimal.Round(booking.TotalAmount / siblings.Count, 2, MidpointRounding.AwayFromZero);
        var standardSessionSubtotal = decimal.Round(booking.Subtotal / siblings.Count, 2, MidpointRounding.AwayFromZero);
        var allocatedSessionAmount = allSessionsCancelled
            ? Math.Max(0m, booking.TotalAmount - (standardSessionAmount * (siblings.Count - 1)))
            : standardSessionAmount;
        var allocatedSubtotal = allSessionsCancelled
            ? Math.Max(0m, booking.Subtotal - (standardSessionSubtotal * (siblings.Count - 1)))
            : standardSessionSubtotal;
        var cancellationFeeRate = previousStatus switch
        {
            BookingSessionStatus.Pending => 0.00m,
            BookingSessionStatus.Confirmed => 0.10m,
            _ => 0.00m
        };

        var cancellationFee = decimal.Round(allocatedSubtotal * cancellationFeeRate, 2, MidpointRounding.AwayFromZero);
        var refundAmount = Math.Max(0m, allocatedSessionAmount - cancellationFee);

        return new SessionCancellationFinanceAllocation
        {
            AllocatedSessionAmount = allocatedSessionAmount,
            CancellationFee = cancellationFee,
            RefundAmount = refundAmount
        };
    }

    private static string BuildRefundMetadataJson(
        Guid sessionId,
        SessionCancellationFinanceAllocation allocation,
        bool allSessionsCancelled)
    {
        return JsonSerializer.Serialize(new
        {
            scope = "booking_session_cancellation",
            sessionId,
            allocatedSessionAmount = allocation.AllocatedSessionAmount,
            cancellationFee = allocation.CancellationFee,
            refundAmount = allocation.RefundAmount,
            allSessionsCancelled
        });
    }

    private async Task EnsureOwnershipAsync(
        BookingSession session,
        CancelBookingSessionCommand command,
        CancellationToken cancellationToken)
    {
        if (command.IsPatient)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(command.CallerUserId, cancellationToken)
                ?? throw new UnauthorizedAccessException("Patient profile not found for the authenticated user.");
            if (session.PatientId == patientId)
            {
                return;
            }
        }

        if (command.IsProvider)
        {
            var providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.CallerUserId, cancellationToken)
                ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");
            if (session.ProviderId == providerId)
            {
                return;
            }
        }

        throw new UnauthorizedAccessException("You do not have permission to cancel this booking session.");
    }
}

internal sealed class SessionCancellationFinanceAllocation
{
    public decimal AllocatedSessionAmount { get; init; }

    public decimal CancellationFee { get; init; }

    public decimal RefundAmount { get; init; }

    public string? RefundStatus { get; set; }
}
