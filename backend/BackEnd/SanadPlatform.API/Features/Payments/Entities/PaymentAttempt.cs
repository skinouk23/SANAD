using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Payments.Entities;

/// <summary>
/// Canonical payment-attempt record holding method, reference, gateway, and fraud metadata.
/// </summary>
public class PaymentAttempt : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PaymentId { get; set; }

    public int AttemptNumber { get; set; }

    public string MethodType { get; set; } = string.Empty;

    public string Status { get; set; } = PaymentConstants.AttemptStatuses.Initiated;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "TND";

    public string? ProviderCode { get; set; }

    public string? ExternalReference { get; set; }

    public string? ManualReference { get; set; }

    public string? SafeMetadataJson { get; set; }

    public string? Gateway { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? GatewayPaymentId { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? GatewayChargeId { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? GatewayTransferId { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? GatewayRefundId { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? GatewayPayoutId { get; set; }

    public string? GatewayResponse { get; set; }

    public string? GatewayFraudResponse { get; set; }

    public decimal? FraudScore { get; set; }

    public string? FraudDecision { get; set; }

    public List<string> FraudFlags { get; set; } = new();

    public bool IsFlagged { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? IpAddress { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? DeviceFingerprint { get; set; }

    public string? CardLastFour { get; set; }

    public string? CardBrand { get; set; }

    public string? CardCountry { get; set; }

    public DateTime? AuthorizedAt { get; set; }

    public DateTime? HeldAt { get; set; }

    public DateTime? CapturedAt { get; set; }

    public DateTime? ReleasedAt { get; set; }

    public string? IdempotencyKey { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
