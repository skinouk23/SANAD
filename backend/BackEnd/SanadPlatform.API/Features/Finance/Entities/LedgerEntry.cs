using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Finance.Entities;

/// <summary>
/// Immutable ledger entry tied to a canonical ledger transaction.
/// </summary>
public class LedgerEntry : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid LedgerTransactionId { get; set; }

    public string AccountCode { get; set; } = string.Empty;

    public Guid? ProviderId { get; set; }

    public Guid? BookingId { get; set; }

    public Guid? PaymentId { get; set; }

    public Guid? ProviderWalletTopUpId { get; set; }

    public decimal Amount { get; set; }

    public decimal SignedAmount { get; set; }

    public string Currency { get; set; } = "TND";

    public DateTime CreatedAt { get; set; }

    public virtual LedgerTransaction LedgerTransaction { get; set; } = null!;

    public virtual Account Account { get; set; } = null!;

    public virtual Provider? Provider { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual Payment? Payment { get; set; }

    public virtual ProviderWalletTopUp? ProviderWalletTopUp { get; set; }
}
