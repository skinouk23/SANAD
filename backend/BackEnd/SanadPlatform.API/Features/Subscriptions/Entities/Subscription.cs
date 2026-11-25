using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Subscriptions.Entities;

/// <summary>
/// Represents a subscription plan for a provider.
/// Tracks subscription tier, status, features, and billing information.
/// </summary>
public class Subscription : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid ProviderId { get; set; }

    // ==================== Plan ====================

    public string Tier { get; set; } = "free";

    // ==================== Status ====================

    public string Status { get; set; } = "active";

    // ==================== Dates ====================

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public DateOnly? TrialEndDate { get; set; }

    public DateOnly? NextBillingDate { get; set; }

    public DateTime? CancelledAt { get; set; }

    // ==================== Pricing ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal MonthlyPrice { get; set; }

    public string Currency { get; set; } = "TND";

    // ==================== Features ====================

    public decimal CommissionRate { get; set; }

    public decimal MarketingBudget { get; set; }

    public bool PriorityListing { get; set; }

    public bool AdvancedAnalytics { get; set; }

    public bool ApiAccess { get; set; }

    public bool DedicatedSupport { get; set; }

    // ==================== Auto-renewal ====================

    public bool AutoRenew { get; set; } = true;

    // ==================== Gateway ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string? GatewaySubscriptionId { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;

    public virtual ICollection<SubscriptionPayment> Payments { get; set; } = new List<SubscriptionPayment>();
}
