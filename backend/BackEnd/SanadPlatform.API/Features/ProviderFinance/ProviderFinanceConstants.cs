using SanadPlatform.API.Features.Finance;
using SanadPlatform.API.Features.Payments;

namespace SanadPlatform.API.Features.ProviderFinance;

/// <summary>
/// Canonical constants for provider prepaid cash-wallet flows.
/// </summary>
public static class ProviderFinanceConstants
{
    public const string DefaultCurrency = "TND";
    public const int TopUpExpiryHours = 48;

    public static class PaymentChannels
    {
        public const string BankTransfer = "bank_transfer";
        public const string D17 = "d17";

        public static readonly string[] All = [BankTransfer, D17];
    }

    public static class TopUpStatuses
    {
        public const string Credited = "credited";
        public const string Failed = "failed";
        public const string Cancelled = "cancelled";
        public const string Expired = "expired";

        public static readonly string[] All =
        [
            Credited,
            Failed,
            Cancelled,
            Expired
        ];
    }

    public static class WalletEntryTypes
    {
        public const string TopUpCredit = "topup_credit";
        public const string CashBookingHold = "cash_booking_hold";
        public const string CashBookingHoldRelease = "cash_booking_hold_release";
        public const string CashBookingDebit = "cash_booking_debit";
        public const string AdminAdjustmentCredit = "admin_adjustment_credit";
        public const string AdminAdjustmentDebit = "admin_adjustment_debit";
        public const string TopUpReversal = "topup_reversal";

        public static readonly string[] All =
        [
            TopUpCredit,
            CashBookingHold,
            CashBookingHoldRelease,
            CashBookingDebit,
            AdminAdjustmentCredit,
            AdminAdjustmentDebit,
            TopUpReversal
        ];

        public static readonly string[] ProviderFacing =
        [
            CashBookingDebit,
            AdminAdjustmentCredit,
            AdminAdjustmentDebit,
            TopUpReversal
        ];
    }

    public static class LedgerDirections
    {
        public const string Credit = "credit";
        public const string Debit = "debit";

        public static readonly string[] All = [Credit, Debit];
    }

    public static class WalletMovementTypes
    {
        public const string Deposit = "deposit";
        public const string Deduction = "deduction";

        public static readonly string[] All = [Deposit, Deduction];
    }

    public static class WalletMovementStatuses
    {
        public const string Completed = "completed";
    }

    public static class WalletMovementSourceTypes
    {
        public const string TopUp = "topup_request";
        public const string WalletLedger = "wallet_ledger";
    }

    /// <summary>
    /// Returns the canonical lower-case payment channel value.
    /// </summary>
    public static string NormalizePaymentChannel(string value)
    {
        return value.Trim().ToLowerInvariant();
    }

    /// <summary>
    /// Returns <c>true</c> when the given payment channel is supported.
    /// </summary>
    public static bool IsSupportedPaymentChannel(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var normalized = NormalizePaymentChannel(value);
        return normalized == PaymentChannels.BankTransfer || normalized == PaymentChannels.D17;
    }

    /// <summary>
    /// Returns <c>true</c> when the top-up has reached a terminal status.
    /// </summary>
    public static bool IsTerminalTopUpStatus(string? status)
    {
        return string.Equals(status, TopUpStatuses.Credited, StringComparison.Ordinal)
            || string.Equals(status, TopUpStatuses.Failed, StringComparison.Ordinal)
            || string.Equals(status, TopUpStatuses.Cancelled, StringComparison.Ordinal)
            || string.Equals(status, TopUpStatuses.Expired, StringComparison.Ordinal);
    }

    /// <summary>
    /// Resolves the provider-facing payment channel label from the canonical payment method type.
    /// </summary>
    public static string ResolvePaymentChannelFromMethodType(string methodType)
    {
        if (string.Equals(methodType, PaymentConstants.MethodTypes.ManualBankTransfer, StringComparison.Ordinal))
        {
            return PaymentChannels.BankTransfer;
        }

        if (string.Equals(methodType, PaymentConstants.MethodTypes.ManualD17, StringComparison.Ordinal))
        {
            return PaymentChannels.D17;
        }

        throw new ArgumentException($"Unsupported top-up method type '{methodType}'.", nameof(methodType));
    }

    /// <summary>
    /// Returns <c>true</c> when the provider-facing wallet history should expose the given ledger transaction type.
    /// </summary>
    public static bool IsProviderFacingWalletMovementTransactionType(string? transactionType)
    {
        return string.Equals(transactionType, LedgerConstants.TransactionTypes.CashBookingFeeSettled, StringComparison.Ordinal)
            || string.Equals(transactionType, LedgerConstants.TransactionTypes.WalletAdjustment, StringComparison.Ordinal)
            || string.Equals(transactionType, LedgerConstants.TransactionTypes.CompensatingAdjustment, StringComparison.Ordinal);
    }

    /// <summary>
    /// Returns <c>true</c> when the provider-facing wallet movement type is supported.
    /// </summary>
    public static bool IsSupportedWalletMovementType(string? type)
    {
        return WalletMovementTypes.All.Contains(type, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Resolves the provider-facing wallet movement type for a supported ledger transaction type and wallet delta.
    /// </summary>
    public static string GetProviderFacingWalletMovementType(string transactionType, decimal availableDelta)
    {
        if (string.Equals(transactionType, LedgerConstants.TransactionTypes.CashBookingFeeSettled, StringComparison.Ordinal))
        {
            return WalletMovementTypes.Deduction;
        }

        if (string.Equals(transactionType, LedgerConstants.TransactionTypes.WalletAdjustment, StringComparison.Ordinal)
            || string.Equals(transactionType, LedgerConstants.TransactionTypes.CompensatingAdjustment, StringComparison.Ordinal))
        {
            return availableDelta >= 0m ? WalletMovementTypes.Deposit : WalletMovementTypes.Deduction;
        }

        throw new ArgumentException(
            $"Ledger transaction type '{transactionType}' is not exposed in the provider wallet movements feed.",
            nameof(transactionType));
    }

    /// <summary>
    /// Returns the terminal status that should be shown to clients.
    /// </summary>
    public static string ResolveDisplayTopUpStatus(string status, DateTime? expiresAt, DateTime asOfUtc)
    {
        _ = expiresAt;
        _ = asOfUtc;

        if (IsTerminalTopUpStatus(status))
        {
            return status;
        }

        return TopUpStatuses.Expired;
    }
}
