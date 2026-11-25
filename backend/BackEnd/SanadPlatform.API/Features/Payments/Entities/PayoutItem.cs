using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Payments.Entities;

/// <summary>
/// Represents a payment item included in a payout.
/// Links canonical payments to payouts for financial reconciliation.
/// </summary>
public class PayoutItem : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid PayoutId { get; set; }

    public Guid PaymentId { get; set; }

    // ==================== Amount ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal Amount { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Payout Payout { get; set; } = null!;
}
