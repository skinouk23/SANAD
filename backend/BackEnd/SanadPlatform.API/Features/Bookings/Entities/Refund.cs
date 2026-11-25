using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a refund issued against a booking payment.
/// </summary>
public class Refund : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PaymentId { get; set; }

    public Guid BookingId { get; set; }

    // ==================== Amounts ====================

    public decimal Amount { get; set; }

    public string Reason { get; set; } = string.Empty;

    // ==================== Status ====================

    public string Status { get; set; } = "pending";

    // ==================== Gateway ====================

    public string? GatewayRefundId { get; set; }

    public string? GatewayResponse { get; set; }

    // ==================== Processing ====================

    public Guid? RequestedBy { get; set; }

    public Guid? ApprovedBy { get; set; }

    public DateTime? ProcessedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Payment Payment { get; set; } = null!;
}
