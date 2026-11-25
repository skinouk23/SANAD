using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Payments.Entities;

/// <summary>
/// Represents a payout to a provider.
/// Tracks payment transfers, gateway details, and processing status.
/// </summary>
public class Payout : IAuditableEntity
{
    public Guid Id { get; set; }

    // ==================== Reference ====================

    [SearchableEncrypted(Classification = DataClassification.Confidential)]
    public string PayoutNumber { get; set; } = string.Empty;

    public Guid ProviderId { get; set; }

    // ==================== Amount ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TND";

    // ==================== Status ====================

    public string Status { get; set; } = "pending";

    // ==================== Payout Method ====================

    public string? PayoutMethod { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? BankAccountLastFour { get; set; }

    // ==================== Gateway Integration ====================

    public string? Gateway { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? GatewayPayoutId { get; set; }

    public string? GatewayResponse { get; set; }

    // ==================== Processing Dates ====================

    public DateOnly? ScheduledFor { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? FailureReason { get; set; }

    // ==================== Notes ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Notes { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;

    public virtual ICollection<PayoutItem> Items { get; set; } = new List<PayoutItem>();
}
