namespace SanadPlatform.API.Common.Constants;

/// <summary>
/// Shared status values used across deposit tracking, transactions,
/// refunds, payouts, and subscription payments.
/// </summary>
public static class PaymentStatuses
{
    public const string Pending = "pending";
    public const string Held = "held";
    public const string Released = "released";
    public const string Refunded = "refunded";
}
