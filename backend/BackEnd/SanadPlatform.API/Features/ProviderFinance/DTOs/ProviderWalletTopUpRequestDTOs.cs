namespace SanadPlatform.API.Features.ProviderFinance.DTOs;

/// <summary>
/// Request payload for creating and crediting a provider manual top-up request.
/// </summary>
public class CreateAndSubmitProviderWalletTopUpRequest
{
    public decimal Amount { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;

    public string PaymentChannel { get; init; } = ProviderFinanceConstants.PaymentChannels.BankTransfer;

    public string ProviderTransferReference { get; init; } = string.Empty;

    public string? EvidenceUrl { get; init; }
}

/// <summary>
/// Provider-facing top-up request summary.
/// </summary>
public record ProviderWalletTopUpRequestResponse
{
    public Guid Id { get; init; }

    public string TopUpNumber { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;

    public string PaymentChannel { get; init; } = ProviderFinanceConstants.PaymentChannels.BankTransfer;

    public string PlatformReference { get; init; } = string.Empty;

    public string? ProviderTransferReference { get; init; }

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    public string Status { get; init; } = string.Empty;

    public DateTime RequestedAt { get; init; }

    public DateTime? MarkedTransferredAt { get; init; }

    public DateTime? CreditedAt { get; init; }

    public DateTime? FailedAt { get; init; }

    public DateTime? CancelledAt { get; init; }

    public DateTime ExpiresAt { get; init; }

    public string? EvidenceUrl { get; init; }
}

/// <summary>
/// Admin-facing top-up request summary with provider identification.
/// </summary>
public record AdminProviderFinanceTopUpRequestResponse
{
    public Guid Id { get; init; }

    public string TopUpNumber { get; init; } = string.Empty;

    public Guid ProviderId { get; init; }

    public string ProviderDisplayName { get; init; } = string.Empty;

    public string? ProviderBusinessName { get; init; }

    public string? ProviderEmail { get; init; }

    public string? ProviderPhone { get; init; }

    public decimal Amount { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;

    public string PaymentChannel { get; init; } = ProviderFinanceConstants.PaymentChannels.BankTransfer;

    public string PlatformReference { get; init; } = string.Empty;

    public string? ProviderTransferReference { get; init; }

    public Guid? PaymentId { get; init; }

    public string? PaymentStatus { get; init; }

    public string? PaymentMethodType { get; init; }

    public string? PaymentReferenceNumber { get; init; }

    public string Status { get; init; } = string.Empty;

    public DateTime RequestedAt { get; init; }

    public DateTime? MarkedTransferredAt { get; init; }

    public DateTime? CreditedAt { get; init; }

    public DateTime? FailedAt { get; init; }

    public DateTime? CancelledAt { get; init; }

    public DateTime ExpiresAt { get; init; }

    public string? EvidenceUrl { get; init; }
}
