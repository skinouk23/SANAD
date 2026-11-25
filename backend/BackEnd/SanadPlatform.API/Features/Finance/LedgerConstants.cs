namespace SanadPlatform.API.Features.Finance;

/// <summary>
/// Canonical constants for the finance ledger foundation.
/// </summary>
public static class LedgerConstants
{
    public static class AccountCodes
    {
        public const string ProviderWalletAvailable = "ProviderWalletAvailable";
        public const string ProviderWalletReserved = "ProviderWalletReserved";
        public const string PlatformRevenue = "PlatformRevenue";
        public const string AdjustmentSuspense = "AdjustmentSuspense";

        public static readonly string[] Required =
        [
            ProviderWalletAvailable,
            ProviderWalletReserved,
            PlatformRevenue,
            AdjustmentSuspense
        ];
    }

    public static class TransactionTypes
    {
        public const string CashBookingFeeReserved = "cash_booking_fee_reserved";
        public const string CashBookingFeeReleased = "cash_booking_fee_released";
        public const string CashBookingFeeSettled = "cash_booking_fee_settled";
        public const string WalletTopUpCredited = "wallet_top_up_credited";
        public const string WalletAdjustment = "wallet_adjustment";
        public const string CompensatingAdjustment = "compensating_adjustment";

        public static readonly string[] All =
        [
            CashBookingFeeReserved,
            CashBookingFeeReleased,
            CashBookingFeeSettled,
            WalletTopUpCredited,
            WalletAdjustment,
            CompensatingAdjustment
        ];
    }

    public static class TransactionStatuses
    {
        public const string Posted = "posted";
        public const string Voided = "voided";

        public static readonly string[] All =
        [
            Posted,
            Voided
        ];
    }

    public static class SourceTypes
    {
        public const string Booking = "booking";
        public const string ProviderWalletTopUp = "provider_wallet_top_up";
        public const string ManualAdjustment = "manual_adjustment";

        public static readonly string[] All =
        [
            Booking,
            ProviderWalletTopUp,
            ManualAdjustment
        ];
    }

    public static class SeedIds
    {
        public static readonly Guid ProviderWalletAvailable = Guid.Parse("A87C3317-3C34-4AB7-8990-49E2B7FE1801");
        public static readonly Guid ProviderWalletReserved = Guid.Parse("1292EA52-34AF-4F42-9C46-995ABAB5DAA2");
        public static readonly Guid PlatformRevenue = Guid.Parse("B9CB6688-ACCE-4B92-9A1A-BDFF59C4E703");
        public static readonly Guid AdjustmentSuspense = Guid.Parse("BB9BA9B7-AFC5-45E5-964A-3B2892AF7904");
    }
}
