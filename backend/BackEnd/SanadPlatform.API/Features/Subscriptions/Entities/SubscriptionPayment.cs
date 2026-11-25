using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Subscriptions.Entities;

/// <summary>
/// Represents a subscription payment record.
/// Tracks billing cycles, payment status, and gateway integration.
/// </summary>
public class SubscriptionPayment : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid SubscriptionId { get; set; }

    // ==================== Amount ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TND";

    // ==================== Period ====================

    public DateOnly BillingPeriodStart { get; set; }

    public DateOnly BillingPeriodEnd { get; set; }

    // ==================== Status ====================

    public string Status { get; set; } = "pending";

    // ==================== Gateway ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? GatewayPaymentId { get; set; }

    public string? GatewayResponse { get; set; }

    // ==================== Payment Date ====================

    public DateTime? PaidAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Subscription Subscription { get; set; } = null!;
}
