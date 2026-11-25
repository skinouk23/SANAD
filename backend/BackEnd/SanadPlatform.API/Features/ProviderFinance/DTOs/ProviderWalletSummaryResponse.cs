namespace SanadPlatform.API.Features.ProviderFinance.DTOs;

/// <summary>
/// Provider-facing prepaid-wallet summary.
/// </summary>
public record ProviderWalletSummaryResponse
{
    public decimal ReservedBalance { get; init; }

    public decimal UsableBalance { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;
}

/// <summary>
/// Admin-facing provider prepaid-wallet summary.
/// </summary>
public record AdminProviderWalletSummaryResponse
{
    public Guid ProviderId { get; init; }

    public string ProviderDisplayName { get; init; } = string.Empty;

    public string? ProviderBusinessName { get; init; }

    public decimal ReservedBalance { get; init; }

    public decimal UsableBalance { get; init; }

    public string Currency { get; init; } = ProviderFinanceConstants.DefaultCurrency;
}
