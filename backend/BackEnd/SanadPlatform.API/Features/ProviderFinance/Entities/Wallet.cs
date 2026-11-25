using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.Entities;

/// <summary>
/// Represents the provider wallet projection derived from canonical ledger entries.
/// </summary>
public class Wallet : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }

    public decimal AvailableBalance { get; set; } = 0.00m;

    public decimal ReservedBalance { get; set; } = 0.00m;

    public decimal UsableBalance { get; set; } = 0.00m;

    public string Currency { get; set; } = ProviderFinanceConstants.DefaultCurrency;

    public DateTime? LastRebuiltAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Provider Provider { get; set; } = null!;
}
