using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.Entities;

/// <summary>
/// Represents a provider wallet top-up workflow without admin review.
/// </summary>
public class ProviderWalletTopUp : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string ReferenceNumber { get; set; } = string.Empty;

    public Guid ProviderId { get; set; }

    public decimal InitiatedAmount { get; set; }

    public decimal? CreditedAmount { get; set; }

    public string Currency { get; set; } = ProviderFinanceConstants.DefaultCurrency;

    public string MethodType { get; set; } = string.Empty;

    public string? ProviderSubmittedReference { get; set; }

    public string? EvidenceUrl { get; set; }

    public string Status { get; set; } = ProviderFinanceConstants.TopUpStatuses.Credited;

    public DateTime InitiatedAt { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public DateTime? CreditedAt { get; set; }

    public DateTime? FailedAt { get; set; }

    public DateTime? CancelledAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Provider Provider { get; set; } = null!;

    public virtual Payment? Payment { get; set; }
}
