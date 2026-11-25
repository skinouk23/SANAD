using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Entities;

namespace SanadPlatform.API.Features.ProviderFinance.Repository;

/// <summary>
/// Repository contract for provider wallet projections and canonical top-up persistence.
/// </summary>
public interface IProviderFinanceRepository
{
    Task<Wallet?> GetWalletByProviderIdAsync(Guid providerId, CancellationToken cancellationToken = default);

    Task<Wallet?> GetWalletByProviderIdForUpdateAsync(Guid providerId, CancellationToken cancellationToken = default);

    Task<Wallet> CreateWalletAsync(Wallet wallet, CancellationToken cancellationToken = default);

    Task<ProviderWalletTopUp?> GetTopUpByIdAndProviderIdForUpdateAsync(
        Guid topUpId,
        Guid providerId,
        CancellationToken cancellationToken = default);

    Task<ProviderWalletTopUp?> GetTopUpByIdForUpdateAsync(Guid topUpId, CancellationToken cancellationToken = default);

    Task<ProviderWalletTopUp> CreateTopUpAsync(
        ProviderWalletTopUp topUp,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProviderWalletTopUp>> GetTopUpsByProviderIdAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProviderWalletTopUp>> GetTopUpsForAdminAsync(CancellationToken cancellationToken = default);

    Task<string?> GetLatestKnownCurrencyAsync(
        Guid providerId,
        DateTime asOfUtc,
        CancellationToken cancellationToken = default);

    Task<WalletBalanceSnapshot> GetWalletBalanceSnapshotAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProviderWalletLedgerRecord>> GetWalletLedgerRecordsByProviderIdAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<ProviderWalletMovementResponse> Items, int TotalCount)> GetWalletMovementsAsync(
        Guid providerId,
        ProviderWalletMovementQuerySpec query,
        CancellationToken cancellationToken = default);

    Task<ProviderWalletActivitySnapshot> GetWalletActivitySnapshotAsync(
        Guid providerId,
        DateTime asOfUtc,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Filter spec for provider-facing wallet movement reads.
/// </summary>
public sealed record ProviderWalletMovementQuerySpec(
    int Page = 1,
    int Limit = 10,
    string? Type = null,
    string? Search = null,
    int? Month = null,
    int? Year = null)
{
    public const int DefaultPage = 1;
    public const int DefaultLimit = 10;
    public const int MaxLimit = 100;

    public ProviderWalletMovementQuerySpec Normalize()
    {
        return this with
        {
            Page = Page < DefaultPage ? DefaultPage : Page,
            Limit = Limit <= 0 ? DefaultLimit : Math.Min(Limit, MaxLimit),
            Type = NormalizeType(Type),
            Search = NormalizeValue(Search),
            Month = Month is >= 1 and <= 12 ? Month : null,
            Year = Year is >= 1 and <= 9999 ? Year : null
        };
    }

    private static string? NormalizeType(string? value)
    {
        var normalized = NormalizeValue(value);
        return normalized?.ToLowerInvariant();
    }

    private static string? NormalizeValue(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}

/// <summary>
/// Aggregate provider wallet activity values computed from provider-facing movement history.
/// </summary>
public sealed record ProviderWalletActivitySnapshot(
    decimal CurrentMonthDeposits,
    decimal CurrentMonthDeductions,
    IReadOnlyList<int> AvailableYears);
