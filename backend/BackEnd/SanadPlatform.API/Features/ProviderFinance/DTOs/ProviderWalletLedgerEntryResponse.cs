namespace SanadPlatform.API.Features.ProviderFinance.DTOs;

/// <summary>
/// Provider-facing prepaid-wallet ledger entry.
/// </summary>
public record ProviderWalletLedgerEntryResponse
{
    public Guid Id { get; init; }

    public string EntryType { get; init; } = string.Empty;

    public decimal Amount { get; init; }

    public string Direction { get; init; } = string.Empty;

    public decimal CurrentBalanceBefore { get; init; }

    public decimal CurrentBalanceAfter { get; init; }

    public decimal ReservedBalanceBefore { get; init; }

    public decimal ReservedBalanceAfter { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;

    public string Reference { get; init; } = string.Empty;

    public string Description { get; init; } = string.Empty;

    public Guid? TopUpRequestId { get; init; }

    public Guid? BookingId { get; init; }

    public Guid? AdminId { get; init; }

    public DateTime CreatedAt { get; init; }
}
