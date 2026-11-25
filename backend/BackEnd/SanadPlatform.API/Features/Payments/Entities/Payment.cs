using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.ProviderFinance.Entities;

namespace SanadPlatform.API.Features.Payments.Entities;

/// <summary>
/// Canonical business payment object for bookings and provider wallet top-ups.
/// </summary>
public class Payment : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string ReferenceNumber { get; set; } = string.Empty;

    public string Purpose { get; set; } = string.Empty;

    public string MethodType { get; set; } = string.Empty;

    public string Status { get; set; } = PaymentConstants.Statuses.Pending;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TND";

    public Guid? BookingId { get; set; }

    public Guid? ProviderWalletTopUpId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? SettledAt { get; set; }

    public DateTime? FailedAt { get; set; }

    public DateTime? CancelledAt { get; set; }

    public DateTime? ExpiredAt { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual ProviderWalletTopUp? ProviderWalletTopUp { get; set; }

    public virtual ICollection<PaymentAttempt> PaymentAttempts { get; set; } = new List<PaymentAttempt>();

    public virtual ICollection<Refund> Refunds { get; set; } = new List<Refund>();

    public virtual ICollection<PayoutItem> PayoutItems { get; set; } = new List<PayoutItem>();
}
