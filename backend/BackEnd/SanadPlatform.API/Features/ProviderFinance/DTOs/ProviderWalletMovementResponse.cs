namespace SanadPlatform.API.Features.ProviderFinance.DTOs;

/// <summary>
/// Provider-facing unified wallet movement row for the wallet history table.
/// </summary>
public record ProviderWalletMovementResponse
{
    public Guid Id { get; init; }

    public string Type { get; init; } = string.Empty;

    public string Status { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;

    public DateTime OccurredAt { get; init; }

    public string Reference { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public string SourceType { get; init; } = string.Empty;

    public string? TopUpNumber { get; init; }

    public string? PaymentChannel { get; init; }

    public string? ProviderTransferReference { get; init; }

    public string? EvidenceUrl { get; init; }

    public DateTime? MarkedTransferredAt { get; init; }

    public DateTime? ExpiresAt { get; init; }

    public bool CanMarkTransferred { get; init; }

    public bool CanCancel { get; init; }
}
