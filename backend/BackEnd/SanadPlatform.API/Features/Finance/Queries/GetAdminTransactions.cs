using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Subscriptions.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Finance.Queries;

/// <summary>
/// Returns the admin transaction datasets consumed by the finance page.
/// </summary>
public record GetAdminTransactionsQuery() : IRequest<AdminTransactionsResponse>;

/// <summary>
/// Handles <see cref="GetAdminTransactionsQuery"/>.
/// </summary>
public class GetAdminTransactionsHandler : IRequestHandler<GetAdminTransactionsQuery, AdminTransactionsResponse>
{
    private readonly SanadDbContext _context;
    private readonly ILogger<GetAdminTransactionsHandler> _logger;

    public GetAdminTransactionsHandler(
        SanadDbContext context,
        ILogger<GetAdminTransactionsHandler> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<AdminTransactionsResponse> Handle(
        GetAdminTransactionsQuery request,
        CancellationToken cancellationToken)
    {
        var bookingPayments = await _context.Payments
            .AsNoTracking()
            .Where(payment =>
                payment.Purpose == PaymentConstants.Purposes.BookingPayment &&
                payment.BookingId.HasValue)
            .Include(payment => payment.Booking)
                .ThenInclude(booking => booking!.Provider)
            .Include(payment => payment.Booking)
                .ThenInclude(booking => booking!.Service)
            .Include(payment => payment.Refunds)
            .ToListAsync(cancellationToken);

        var subscriptionPayments = await _context.SubscriptionPayments
            .AsNoTracking()
            .Include(payment => payment.Subscription)
                .ThenInclude(subscription => subscription.Provider)
            .ToListAsync(cancellationToken);

        var payments = bookingPayments
            .Where(payment => payment.Booking is not null)
            .Select(MapServicePayment)
            .OrderByDescending(item => item.Date)
            .ThenByDescending(item => item.Id)
            .ToList()
            .AsReadOnly();

        var commissions = bookingPayments
            .Where(payment => payment.Booking is not null)
            .Select(MapCommission)
            .Where(item => item.CommissionAmount > 0m)
            .OrderByDescending(item => item.Date)
            .ThenByDescending(item => item.Id)
            .ToList()
            .AsReadOnly();

        var subscriptions = subscriptionPayments
            .Where(payment => payment.Subscription is not null)
            .Select(MapSubscriptionPayment)
            .OrderByDescending(item => item.Date)
            .ThenByDescending(item => item.Id)
            .ToList()
            .AsReadOnly();

        _logger.LogInformation(
            "Admin transactions retrieved: {PaymentCount} payments, {SubscriptionCount} subscriptions, {CommissionCount} commissions",
            payments.Count,
            subscriptions.Count,
            commissions.Count);

        return new AdminTransactionsResponse
        {
            Payments = payments,
            Subscriptions = subscriptions,
            Commissions = commissions
        };
    }

    private static AdminServiceTransactionResponse MapServicePayment(Payment payment)
    {
        var booking = payment.Booking
            ?? throw new InvalidOperationException("Booking payment is missing its booking relation.");

        return new AdminServiceTransactionResponse
        {
            Id = payment.Id,
            Date = ResolvePaymentDate(payment),
            PatientName = string.IsNullOrWhiteSpace(booking.PatientName) ? booking.PatientId.ToString() : booking.PatientName,
            ProviderName = BuildProviderDisplayName(booking.Provider),
            ServiceName = booking.Service?.Name ?? booking.ServiceCategoryFallback(),
            Amount = payment.Amount,
            Commission = booking.CommissionAmount,
            NetAmount = booking.ProviderAmount,
            PaymentMethod = ResolvePaymentMethod(booking.PaymentMethod, payment.MethodType),
            Status = ResolveAdminStatus(payment),
            Direction = "in",
            BookingReference = booking.BookingNumber,
            PaymentReference = payment.ReferenceNumber
        };
    }

    private static AdminCommissionTransactionResponse MapCommission(Payment payment)
    {
        var booking = payment.Booking
            ?? throw new InvalidOperationException("Booking payment is missing its booking relation.");

        return new AdminCommissionTransactionResponse
        {
            Id = payment.Id,
            Date = ResolvePaymentDate(payment),
            ProviderName = BuildProviderDisplayName(booking.Provider),
            ServiceName = booking.Service?.Name ?? booking.ServiceCategoryFallback(),
            GrossAmount = payment.Amount,
            CommissionRate = booking.CommissionRate,
            CommissionAmount = booking.CommissionAmount,
            NetAmount = booking.ProviderAmount,
            BookingRef = booking.BookingNumber,
            Status = ResolveAdminStatus(payment)
        };
    }

    private static AdminSubscriptionTransactionResponse MapSubscriptionPayment(SubscriptionPayment payment)
    {
        var subscription = payment.Subscription
            ?? throw new InvalidOperationException("Subscription payment is missing its subscription relation.");

        return new AdminSubscriptionTransactionResponse
        {
            Id = payment.Id,
            Date = payment.PaidAt ?? payment.CreatedAt,
            ProviderName = BuildProviderDisplayName(subscription.Provider),
            ProviderService = subscription.Provider?.ServiceCategory ?? "service",
            Plan = ResolveSubscriptionPlan(payment),
            Amount = payment.Amount,
            PeriodStart = payment.BillingPeriodStart,
            PeriodEnd = payment.BillingPeriodEnd,
            PaymentMethod = ResolveSubscriptionPaymentMethod(payment),
            Status = ResolveSubscriptionStatus(payment)
        };
    }

    private static DateTime ResolvePaymentDate(Payment payment)
    {
        return payment.SettledAt
            ?? payment.CancelledAt
            ?? payment.FailedAt
            ?? payment.ExpiredAt
            ?? payment.UpdatedAt;
    }

    private static string ResolveAdminStatus(Payment payment)
    {
        if (HasRefund(payment.Refunds))
        {
            return "refunded";
        }

        return payment.Status switch
        {
            PaymentConstants.Statuses.Settled => "completed",
            PaymentConstants.Statuses.Pending => "pending",
            PaymentConstants.Statuses.Processing => "pending",
            PaymentConstants.Statuses.Reserved => "pending",
            PaymentConstants.Statuses.Failed => "failed",
            PaymentConstants.Statuses.Cancelled => "failed",
            PaymentConstants.Statuses.Expired => "failed",
            _ => string.IsNullOrWhiteSpace(payment.Status)
                ? "pending"
                : payment.Status.Trim().ToLowerInvariant()
        };
    }

    private static bool HasRefund(ICollection<Refund> refunds)
    {
        return refunds.Any(refund =>
            refund.ProcessedAt.HasValue ||
            string.Equals(refund.Status, PaymentStatuses.Refunded, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(refund.Status, "completed", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(refund.Status, "processed", StringComparison.OrdinalIgnoreCase));
    }

    private static string ResolvePaymentMethod(string? bookingPaymentMethod, string? fallbackMethodType)
    {
        if (!string.IsNullOrWhiteSpace(bookingPaymentMethod))
        {
            var normalizedMethod = PaymentMethods.Normalize(bookingPaymentMethod);
            if (PaymentMethods.IsSupported(normalizedMethod))
            {
                return normalizedMethod;
            }
        }

        if (string.Equals(fallbackMethodType, PaymentConstants.MethodTypes.ManualD17, StringComparison.OrdinalIgnoreCase))
        {
            return PaymentMethods.D17;
        }

        if (string.Equals(fallbackMethodType, PaymentConstants.MethodTypes.ManualBankTransfer, StringComparison.OrdinalIgnoreCase))
        {
            return "bank_transfer";
        }

        if (string.Equals(fallbackMethodType, PaymentConstants.MethodTypes.Cash, StringComparison.OrdinalIgnoreCase))
        {
            return PaymentMethods.Cash;
        }

        return "unknown";
    }

    private static string ResolveSubscriptionStatus(SubscriptionPayment payment)
    {
        if (payment.PaidAt.HasValue)
        {
            return "completed";
        }

        return payment.Status.Trim().ToLowerInvariant() switch
        {
            "paid" => "completed",
            "completed" => "completed",
            "settled" => "completed",
            "pending" => "pending",
            "processing" => "pending",
            "failed" => "failed",
            "cancelled" => "failed",
            "expired" => "failed",
            var value when string.IsNullOrWhiteSpace(value) => "pending",
            var value => value
        };
    }

    private static string ResolveSubscriptionPlan(SubscriptionPayment payment)
    {
        var totalDays = payment.BillingPeriodEnd.DayNumber - payment.BillingPeriodStart.DayNumber + 1;
        return totalDays >= 330 ? "annuel" : "mensuel";
    }

    private static string ResolveSubscriptionPaymentMethod(SubscriptionPayment payment)
    {
        return string.IsNullOrWhiteSpace(payment.GatewayPaymentId) ? "unknown" : PaymentMethods.Card;
    }

    private static string BuildProviderDisplayName(Provider? provider)
    {
        if (provider is null)
        {
            return "Provider";
        }

        if (!string.IsNullOrWhiteSpace(provider.BusinessName))
        {
            return provider.BusinessName.Trim();
        }

        var fullName = $"{provider.FirstName} {provider.LastName}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? provider.Id.ToString() : fullName;
    }
}

internal static class BookingTransactionExtensions
{
    public static string ServiceCategoryFallback(this Booking booking)
    {
        return string.IsNullOrWhiteSpace(booking.Provider?.ServiceCategory)
            ? "service"
            : booking.Provider.ServiceCategory;
    }
}
