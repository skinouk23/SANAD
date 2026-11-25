using MediatR;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;
using SanadPlatform.API.Features.Bookings.Services;
using SanadPlatform.API.Features.Bookings.Services.Policies;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance.Services;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Bookings.Commands;

// ==================== Command ====================

/// <summary>
/// Command to cancel a booking. Both patients and providers may cancel,
/// subject to the booking state machine rules. Cancellation fees and refunds
/// are calculated based on the current booking status.
/// </summary>
public record CancelBookingCommand(
    Guid BookingId,
    Guid CallerUserId,
    bool IsPatient,
    bool IsProvider,
    string? CancellationReason,
    bool IsDeclineAction = false) : IRequest<CancelBookingResponse>, ISensitiveRequest;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="CancelBookingCommand"/>.
/// Enforces ownership, state machine guard, calculates cancellation fee,
/// creates refund if applicable, delegates category-specific cancellation logic
/// (e.g. stock restoration) to <see cref="IBookingCategoryPolicy.ProcessCancellation"/>,
/// and updates provider/patient stats.
/// Wrapped in a transaction to ensure atomicity across booking, refund, stock, and stats mutations.
/// </summary>
public class CancelBookingHandler : IRequestHandler<CancelBookingCommand, CancelBookingResponse>
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingSessionRepository _bookingSessionRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderWalletService _providerWalletService;
    private readonly BookingCategoryPolicyRegistry _policyRegistry;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CancelBookingHandler> _logger;

    public CancelBookingHandler(
        IBookingRepository bookingRepository,
        IBookingSessionRepository bookingSessionRepository,
        IProviderRepository providerRepository,
        IPatientRepository patientRepository,
        IServiceRepository serviceRepository,
        IProviderWalletService providerWalletService,
        BookingCategoryPolicyRegistry policyRegistry,
        IUnitOfWork unitOfWork,
        ILogger<CancelBookingHandler> logger)
    {
        _bookingRepository = bookingRepository ?? throw new ArgumentNullException(nameof(bookingRepository));
        _bookingSessionRepository = bookingSessionRepository ?? throw new ArgumentNullException(nameof(bookingSessionRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _providerWalletService = providerWalletService ?? throw new ArgumentNullException(nameof(providerWalletService));
        _policyRegistry = policyRegistry ?? throw new ArgumentNullException(nameof(policyRegistry));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<CancelBookingResponse> Handle(
        CancelBookingCommand command,
        CancellationToken cancellationToken)
    {
        // ==================== Load Tracked Booking with Payment + Patient/Provider ====================
        var booking = await _bookingRepository.GetByIdWithPaymentAndOwnersForUpdateAsync(command.BookingId, cancellationToken)
            ?? throw new KeyNotFoundException($"Booking {command.BookingId} was not found.");

        if (command.IsDeclineAction && booking.Status != BookingStatus.Pending)
        {
            throw new InvalidOperationException(
                $"Only pending bookings can be declined. Current status is '{booking.Status}'.");
        }

        // ==================== Ownership Check (using loaded Patient/Provider nav properties) ====================
        // Patient/Provider are loaded via IgnoreQueryFilters so soft-deleted entities are included,
        // but a null-check guards against orphaned FK or data integrity issues.
        var isOwner = (command.IsPatient && booking.Patient?.UserId == command.CallerUserId)
                   || (command.IsProvider && booking.Provider?.UserId == command.CallerUserId);

        if (!isOwner)
            throw new UnauthorizedAccessException("You do not have permission to cancel this booking.");

        // ==================== State Machine Guard + Calculate Cancellation Fee ====================
        // Validate before reading status for fee calculation — the assignment below overwrites it.
        BookingStateMachine.ValidateTransition(booking.Status, BookingStatus.Cancelled);

        var cancellationFeeRate = booking.Status switch
        {
            BookingStatus.Pending => 0.00m,
            BookingStatus.Confirmed => 0.10m,
            BookingStatus.ProviderOnWay => 0.25m,
            BookingStatus.Disputed => 0.00m, // Disputed->Cancelled is 0% fee (admin-only restriction deferred)
            _ => 0.00m
        };

        // Calculate fee on Subtotal (ServicePrice + AddonsPrice - Discount), not TotalAmount which includes PlatformFee.
        // Business rule: refundAmount = TotalAmount - cancellationFee.
        // Because TotalAmount = Subtotal + PlatformFee and the fee is based only on Subtotal,
        // the PlatformFee is always fully refunded to the patient regardless of cancellation stage.
        var cancellationFee = booking.Subtotal * cancellationFeeRate;
        var refundAmount = booking.TotalAmount - cancellationFee;

        // ==================== Execute within transaction ====================
        // Multi-entity mutation (booking status + refund + stock restore + provider/patient stats)
        // must be atomic. ExecuteInTransactionAsync wraps the execution strategy + begin/commit/rollback.
        return await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
        {
            // ==================== Mutate Booking ====================
            // Status + trigger context set atomically. Transition is pre-validated above.
            booking.Status = BookingStatus.Cancelled;
            booking.StatusChangedBy = command.CallerUserId;
            booking.StatusChangeReason = ResolveStatusChangeReason(command);

            booking.CancelledAt = DateTime.UtcNow;
            booking.CancelledBy = command.CallerUserId;
            booking.CancellationReason = command.CancellationReason;
            booking.CancellationFee = cancellationFee;

            var sessions = await _bookingSessionRepository.GetByBookingIdForUpdateAsync(booking.Id, ct);
            foreach (var session in sessions.Where(session => !BookingSessionStateMachine.IsTerminal(session.Status)))
            {
                if (BookingSessionStateMachine.CanTransition(session.Status, BookingSessionStatus.Cancelled))
                {
                    session.Status = BookingSessionStatus.Cancelled;
                    session.CancelledAt = booking.CancelledAt;
                    session.CancelledBy = command.CallerUserId;
                    session.CancellationReason = command.CancellationReason;
                }
            }

            // ==================== Create Refund if Applicable ====================
            string? refundStatus = null;
            decimal? responseRefundAmount = null;
            var isCashPayment = booking.Payment != null
                && string.Equals(booking.Payment.MethodType, PaymentConstants.MethodTypes.Cash, StringComparison.Ordinal);

            var alreadyRefundedAmount = booking.Payment?.Refunds.Sum(refund => refund.Amount) ?? 0m;
            var remainingRefundAmount = Math.Max(0m, refundAmount - alreadyRefundedAmount);

            if (booking.Payment != null && remainingRefundAmount > 0 && !isCashPayment)
            {
                var refund = new Refund
                {
                    PaymentId = booking.Payment.Id,
                    BookingId = booking.Id,
                    Amount = remainingRefundAmount,
                    Reason = command.CancellationReason ?? "Booking cancelled",
                    Status = "pending",
                    RequestedBy = command.CallerUserId
                };

                await _bookingRepository.CreateRefundAsync(refund, ct);
                PaymentModelFactory.MarkCancelled(booking.Payment, DateTime.UtcNow);
                PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment).Status = PaymentConstants.AttemptStatuses.Cancelled;
                refundStatus = "pending";
                responseRefundAmount = remainingRefundAmount;
            }
            else if ((booking.Payment == null || isCashPayment) && booking.TotalAmount > 0)
            {
                // When no transaction exists but amount > 0, indicate no payment was processed
                refundStatus = "no_payment";
                responseRefundAmount = 0m;
            }

            if (booking.Payment != null && (remainingRefundAmount <= 0m || isCashPayment))
            {
                PaymentModelFactory.MarkCancelled(booking.Payment, DateTime.UtcNow);
                PaymentModelFactory.GetOrCreateLatestAttempt(booking.Payment).Status = PaymentConstants.AttemptStatuses.Cancelled;
            }

            // ==================== Category-Specific Cancellation (e.g. stock restoration) ====================
            // Delegate to the category policy so new categories don't require changes to this handler.
            // Mirrors the creation pattern in CreateBooking (lines 128-129) where StockDelta is applied generically.
            var service = await _serviceRepository.GetByIdForUpdateAsync(booking.ServiceId, ct);
            if (service != null)
            {
                var policy = _policyRegistry.Resolve(service.Category);
                var cancellationResult = policy.ProcessCancellation(
                    new BookingCancellationContext(service.Category, service.AvailableQuantity));

                if (cancellationResult.StockDelta != 0)
                {
                    service.AvailableQuantity = (service.AvailableQuantity ?? 0) + cancellationResult.StockDelta;
                    _logger.LogInformation(
                        "Adjusted stock for service {ServiceId} by {StockDelta} (new quantity: {Quantity}) due to cancelled booking {BookingId}",
                        service.Id, cancellationResult.StockDelta, service.AvailableQuantity, command.BookingId);
                }

                // C4: Guard against negative BookingCount caused by data inconsistency
                // or duplicate cancellation paths. Math.Max ensures the counter never drifts below zero.
                service.BookingCount = Math.Max(0, service.BookingCount - 1);
            }

            await _providerWalletService.ReleaseCashBookingHoldAsync(booking, ct);

            // ==================== Update Provider Stats ====================
            // Only increment provider's CancelledBookings when the provider cancels
            if (command.IsProvider)
            {
                var provider = await _providerRepository.GetByIdForUpdateAsync(booking.ProviderId, ct);
                if (provider != null)
                {
                    provider.CancelledBookings++;
                }
                else
                {
                    // Log warning when provider not found (e.g., soft-deleted)
                    _logger.LogWarning(
                        "Provider {ProviderId} not found when updating cancellation stats for booking {BookingId}",
                        booking.ProviderId, command.BookingId);
                }
            }

            // ==================== Update Patient Stats ====================
            // Increment patient's CancelledBookings when the patient cancels
            if (command.IsPatient)
            {
                var patient = await _patientRepository.GetByIdForUpdateAsync(booking.PatientId, ct);
                if (patient != null)
                {
                    patient.CancelledBookings++;
                }
                else
                {
                    _logger.LogWarning(
                        "Patient {PatientId} not found when updating cancellation stats for booking {BookingId}",
                        booking.PatientId, command.BookingId);
                }
            }

            // ==================== Persist ====================
            await _unitOfWork.SaveChangesAsync(ct);

            if (booking.WalletReservedAmount > 0m && booking.WalletReservationReleasedAt.HasValue)
            {
                await _providerWalletService.SyncWalletProjectionFromLedgerAsync(booking.ProviderId, ct);
                await _unitOfWork.SaveChangesAsync(ct);
            }

            _logger.LogInformation(
                "Booking {BookingId} cancelled by {UserId} (fee: {CancellationFee}, refund: {RefundAmount})",
                command.BookingId, command.CallerUserId, cancellationFee, remainingRefundAmount);

            // ==================== Build Response ====================
            return new CancelBookingResponse
            {
                Id = booking.Id,
                Status = booking.Status.ToString(),
                CancelledAt = booking.CancelledAt,
                CancelledBy = booking.CancelledBy,
                CancellationReason = booking.CancellationReason,
                StatusChangedBy = booking.StatusChangedBy,
                StatusChangeReason = booking.StatusChangeReason,
                RefundAmount = responseRefundAmount,
                RefundStatus = refundStatus,
                PaymentId = booking.Payment?.Id,
                PaymentStatus = booking.Payment?.Status
            };
        }, cancellationToken);
    }

    private static string ResolveStatusChangeReason(CancelBookingCommand command)
    {
        if (command.IsDeclineAction)
        {
            return "Declined by provider";
        }

        if (command.IsProvider)
        {
            return command.CancellationReason ?? "Cancelled by provider";
        }

        if (command.IsPatient)
        {
            return command.CancellationReason ?? "Cancelled by patient";
        }

        return command.CancellationReason ?? "Cancelled by user";
    }

}
