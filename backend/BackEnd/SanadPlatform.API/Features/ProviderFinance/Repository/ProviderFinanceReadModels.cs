namespace SanadPlatform.API.Features.ProviderFinance.Repository;

/// <summary>
/// Aggregated wallet projection balances derived from canonical ledger entries.
/// </summary>
public sealed record WalletBalanceSnapshot(
    decimal AvailableBalance,
    decimal ReservedBalance,
    decimal UsableBalance,
    string Currency);

/// <summary>
/// Transaction-level provider wallet ledger record derived from canonical ledger tables.
/// </summary>
public sealed record ProviderWalletLedgerRecord(
    Guid LedgerTransactionId,
    string TransactionType,
    string TransactionStatus,
    Guid? ProviderId,
    Guid? BookingId,
    Guid? PaymentId,
    Guid? ProviderWalletTopUpId,
    decimal AvailableDelta,
    decimal ReservedDelta,
    string Currency,
    string ReferenceNumber,
    string Description,
    Guid? CreatedByUserId,
    DateTime OccurredAt,
    DateTime CreatedAt);
