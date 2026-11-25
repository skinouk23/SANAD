using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.ProviderFinance;

namespace SanadPlatform.API.Features.Payments;

/// <summary>
/// Canonical constants and mapping helpers for payment workflows.
/// </summary>
public static class PaymentConstants
{
    public static class Purposes
    {
        public const string BookingPayment = "booking_payment";
        public const string WalletTopUp = "wallet_top_up";

        public static readonly string[] All =
        [
            BookingPayment,
            WalletTopUp
        ];
    }

    public static class MethodTypes
    {
        public const string Cash = "cash";
        public const string ManualBankTransfer = "manual_bank_transfer";
        public const string ManualD17 = "manual_d17";
        public const string ExternalPlaceholder = "external_placeholder";
        public const string AdminAdjustment = "admin_adjustment";

        public static readonly string[] All =
        [
            Cash,
            ManualBankTransfer,
            ManualD17,
            ExternalPlaceholder,
            AdminAdjustment
        ];
    }

    public static class Statuses
    {
        public const string Pending = "pending";
        public const string Processing = "processing";
        public const string Reserved = "reserved";
        public const string Settled = "settled";
        public const string Failed = "failed";
        public const string Expired = "expired";
        public const string Cancelled = "cancelled";

        public static readonly string[] All =
        [
            Pending,
            Processing,
            Reserved,
            Settled,
            Failed,
            Expired,
            Cancelled
        ];
    }

    public static class AttemptStatuses
    {
        public const string Initiated = "initiated";
        public const string Submitted = "submitted";
        public const string Processing = "processing";
        public const string Succeeded = "succeeded";
        public const string Failed = "failed";
        public const string Expired = "expired";
        public const string Cancelled = "cancelled";

        public static readonly string[] All =
        [
            Initiated,
            Submitted,
            Processing,
            Succeeded,
            Failed,
            Expired,
            Cancelled
        ];
    }

    /// <summary>
    /// Resolves a booking-facing payment method into the canonical payment method type.
    /// </summary>
    public static string ResolveBookingMethodType(string paymentMethod)
    {
        var normalized = PaymentMethods.Normalize(paymentMethod);

        return normalized switch
        {
            PaymentMethods.Cash => MethodTypes.Cash,
            _ => MethodTypes.ExternalPlaceholder
        };
    }

    /// <summary>
    /// Resolves a provider wallet top-up channel into the canonical payment method type.
    /// </summary>
    public static string ResolveTopUpMethodType(string paymentChannel)
    {
        var normalized = ProviderFinanceConstants.NormalizePaymentChannel(paymentChannel);

        return normalized switch
        {
            ProviderFinanceConstants.PaymentChannels.BankTransfer => MethodTypes.ManualBankTransfer,
            ProviderFinanceConstants.PaymentChannels.D17 => MethodTypes.ManualD17,
            _ => throw new ArgumentException($"Unsupported top-up payment channel '{paymentChannel}'.", nameof(paymentChannel))
        };
    }
}
