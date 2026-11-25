using SanadPlatform.API.Features.Finance.Entities;

namespace SanadPlatform.API.Features.Finance.Services;

/// <summary>
/// Posts canonical ledger transactions and entries.
/// </summary>
public interface ILedgerPostingService
{
    /// <summary>
    /// Stages a posted ledger transaction and its entries in the current unit of work.
    /// Returns an existing transaction when the idempotency key has already been used.
    /// </summary>
    Task<LedgerTransaction> PostAsync(LedgerPostingRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// Canonical ledger posting request.
/// </summary>
public sealed record LedgerPostingRequest(
    string ReferenceNumber,
    string Type,
    string Description,
    string SourceType,
    Guid SourceId,
    string Currency,
    DateTime OccurredAt,
    Guid? CreatedByUserId,
    string? IdempotencyKey,
    IReadOnlyList<LedgerPostingLine> Entries);

/// <summary>
/// Canonical ledger posting line.
/// </summary>
public sealed record LedgerPostingLine(
    string AccountCode,
    decimal SignedAmount,
    Guid? ProviderId = null,
    Guid? BookingId = null,
    Guid? PaymentId = null,
    Guid? ProviderWalletTopUpId = null);
