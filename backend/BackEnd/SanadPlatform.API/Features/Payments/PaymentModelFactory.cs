using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Features.ProviderFinance.Entities;

namespace SanadPlatform.API.Features.Payments;

/// <summary>
/// Factory and lifecycle helpers for canonical payment models.
/// </summary>
public static class PaymentModelFactory
{
    /// <summary>
    /// Creates the canonical payment and initial attempt for a new booking.
    /// </summary>
    public static Payment CreateBookingPayment(Booking booking, string? idempotencyKey)
    {
        ArgumentNullException.ThrowIfNull(booking);

        var now = DateTime.UtcNow;
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            ReferenceNumber = GenerateReferenceNumber("BKG", now),
            Purpose = PaymentConstants.Purposes.BookingPayment,
            MethodType = PaymentConstants.ResolveBookingMethodType(booking.PaymentMethod),
            Status = string.Equals(booking.PaymentMethod, PaymentMethods.Cash, StringComparison.Ordinal)
                ? PaymentConstants.Statuses.Reserved
                : PaymentConstants.Statuses.Pending,
            Amount = booking.TotalAmount,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            BookingId = booking.Id
        };

        payment.PaymentAttempts.Add(CreateInitialAttempt(payment, idempotencyKey));
        return payment;
    }

    /// <summary>
    /// Creates the canonical payment and initial attempt for a new provider wallet top-up.
    /// </summary>
    public static Payment CreateProviderWalletTopUpPayment(ProviderWalletTopUp topUpRequest, string? idempotencyKey)
    {
        ArgumentNullException.ThrowIfNull(topUpRequest);

        var now = DateTime.UtcNow;
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            ReferenceNumber = GenerateReferenceNumber("TUP", now),
            Purpose = PaymentConstants.Purposes.WalletTopUp,
            MethodType = topUpRequest.MethodType,
            Status = PaymentConstants.Statuses.Pending,
            Amount = topUpRequest.InitiatedAmount,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            ProviderWalletTopUpId = topUpRequest.Id
        };

        payment.PaymentAttempts.Add(CreateInitialAttempt(payment, idempotencyKey));
        return payment;
    }

    /// <summary>
    /// Returns the latest attempt for the payment, creating a fallback attempt when legacy data lacks one.
    /// </summary>
    public static PaymentAttempt GetOrCreateLatestAttempt(Payment payment)
    {
        ArgumentNullException.ThrowIfNull(payment);

        var latestAttempt = payment.PaymentAttempts
            .OrderByDescending(attempt => attempt.AttemptNumber)
            .FirstOrDefault();

        if (latestAttempt != null)
        {
            return latestAttempt;
        }

        latestAttempt = CreateInitialAttempt(payment, null);
        payment.PaymentAttempts.Add(latestAttempt);
        return latestAttempt;
    }

    /// <summary>
    /// Applies the canonical reserved payment state.
    /// </summary>
    public static void MarkReserved(Payment payment)
    {
        ArgumentNullException.ThrowIfNull(payment);
        payment.Status = PaymentConstants.Statuses.Reserved;
    }

    /// <summary>
    /// Applies the canonical processing payment state.
    /// </summary>
    public static void MarkProcessing(Payment payment)
    {
        ArgumentNullException.ThrowIfNull(payment);
        payment.Status = PaymentConstants.Statuses.Processing;
    }

    /// <summary>
    /// Applies the canonical settled payment state.
    /// </summary>
    public static void MarkSettled(Payment payment, DateTime occurredAt)
    {
        ArgumentNullException.ThrowIfNull(payment);
        payment.Status = PaymentConstants.Statuses.Settled;
        payment.SettledAt ??= occurredAt;
    }

    /// <summary>
    /// Applies the canonical failed payment state.
    /// </summary>
    public static void MarkFailed(Payment payment, DateTime occurredAt)
    {
        ArgumentNullException.ThrowIfNull(payment);
        payment.Status = PaymentConstants.Statuses.Failed;
        payment.FailedAt ??= occurredAt;
    }

    /// <summary>
    /// Applies the canonical cancelled payment state.
    /// </summary>
    public static void MarkCancelled(Payment payment, DateTime occurredAt)
    {
        ArgumentNullException.ThrowIfNull(payment);
        payment.Status = PaymentConstants.Statuses.Cancelled;
        payment.CancelledAt ??= occurredAt;
    }

    /// <summary>
    /// Applies the canonical expired payment state.
    /// </summary>
    public static void MarkExpired(Payment payment, DateTime occurredAt)
    {
        ArgumentNullException.ThrowIfNull(payment);
        payment.Status = PaymentConstants.Statuses.Expired;
        payment.ExpiredAt ??= occurredAt;
    }

    private static PaymentAttempt CreateInitialAttempt(Payment payment, string? idempotencyKey)
    {
        return new PaymentAttempt
        {
            Id = Guid.NewGuid(),
            PaymentId = payment.Id,
            AttemptNumber = 1,
            MethodType = payment.MethodType,
            Status = PaymentConstants.AttemptStatuses.Initiated,
            Amount = payment.Amount,
            Currency = ProviderFinanceConstants.DefaultCurrency,
            IdempotencyKey = NormalizeIdempotencyKey(idempotencyKey)
        };
    }

    private static string GenerateReferenceNumber(string scope, DateTime occurredAt)
    {
        return $"PAY-{scope}-{occurredAt:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..10].ToUpperInvariant()}";
    }

    private static string? NormalizeIdempotencyKey(string? idempotencyKey)
    {
        return string.IsNullOrWhiteSpace(idempotencyKey)
            ? null
            : idempotencyKey.Trim();
    }
}
