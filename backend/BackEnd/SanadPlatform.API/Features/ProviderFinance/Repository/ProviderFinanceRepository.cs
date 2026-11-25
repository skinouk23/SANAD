using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Finance;
using SanadPlatform.API.Features.Finance.Entities;
using SanadPlatform.API.Features.Payments;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.ProviderFinance.Repository;

/// <summary>
/// EF Core repository for provider wallet projection and top-up data access.
/// </summary>
public class ProviderFinanceRepository : IProviderFinanceRepository
{
    private static readonly string[] ProviderFacingWalletMovementTimelineTypes =
    [
        LedgerConstants.TransactionTypes.CashBookingFeeSettled,
        LedgerConstants.TransactionTypes.WalletAdjustment,
        LedgerConstants.TransactionTypes.CompensatingAdjustment
    ];

    private const string FinanceTimelinePaymentSourceType = "payment";
    private const string FinanceTimelineLedgerTransactionSourceType = "ledger_transaction";

    private readonly SanadDbContext _context;
    private readonly ILogger<ProviderFinanceRepository> _logger;

    public ProviderFinanceRepository(
        SanadDbContext context,
        ILogger<ProviderFinanceRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Wallet?> GetWalletByProviderIdAsync(Guid providerId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Wallet>()
            .AsNoTracking()
            .FirstOrDefaultAsync(wallet => wallet.ProviderId == providerId, cancellationToken);
    }

    public async Task<Wallet?> GetWalletByProviderIdForUpdateAsync(Guid providerId, CancellationToken cancellationToken = default)
    {
        return await _context.Set<Wallet>()
            .FirstOrDefaultAsync(wallet => wallet.ProviderId == providerId, cancellationToken);
    }

    public Task<Wallet> CreateWalletAsync(Wallet wallet, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(wallet);

        _context.Set<Wallet>().Add(wallet);
        _logger.LogDebug("Provider wallet projection staged for creation for provider {ProviderId}", wallet.ProviderId);
        return Task.FromResult(wallet);
    }

    public async Task<ProviderWalletTopUp?> GetTopUpByIdAndProviderIdForUpdateAsync(
        Guid topUpId,
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<ProviderWalletTopUp>()
            .Include(request => request.Payment)
            .ThenInclude(payment => payment!.PaymentAttempts)
            .FirstOrDefaultAsync(
                request => request.Id == topUpId && request.ProviderId == providerId,
                cancellationToken);
    }

    public async Task<ProviderWalletTopUp?> GetTopUpByIdForUpdateAsync(
        Guid topUpId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<ProviderWalletTopUp>()
            .Include(request => request.Payment)
            .ThenInclude(payment => payment!.PaymentAttempts)
            .FirstOrDefaultAsync(request => request.Id == topUpId, cancellationToken);
    }

    public Task<ProviderWalletTopUp> CreateTopUpAsync(
        ProviderWalletTopUp topUp,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(topUp);

        _context.Set<ProviderWalletTopUp>().Add(topUp);
        _logger.LogDebug(
            "Provider wallet top-up {ReferenceNumber} staged for creation for provider {ProviderId}",
            topUp.ReferenceNumber,
            topUp.ProviderId);

        return Task.FromResult(topUp);
    }

    public async Task<IReadOnlyList<ProviderWalletTopUp>> GetTopUpsByProviderIdAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<ProviderWalletTopUp>()
            .AsNoTracking()
            .Include(request => request.Payment)
            .Where(request => request.ProviderId == providerId)
            .OrderByDescending(request => request.InitiatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ProviderWalletTopUp>> GetTopUpsForAdminAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.Set<ProviderWalletTopUp>()
            .AsNoTracking()
            .Include(request => request.Provider)
            .ThenInclude(provider => provider.User)
            .Include(request => request.Payment)
            .OrderByDescending(request => request.InitiatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<string?> GetLatestKnownCurrencyAsync(
        Guid providerId,
        DateTime asOfUtc,
        CancellationToken cancellationToken = default)
    {
        return Task.FromResult<string?>(ProviderFinanceConstants.DefaultCurrency);
    }

    public async Task<WalletBalanceSnapshot> GetWalletBalanceSnapshotAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var availableBalance = await _context.Set<LedgerEntry>()
            .AsNoTracking()
            .Where(entry => entry.ProviderId == providerId
                && entry.AccountCode == LedgerConstants.AccountCodes.ProviderWalletAvailable)
            .SumAsync(entry => (decimal?)entry.SignedAmount, cancellationToken)
            ?? 0.00m;

        var reservedBalance = await _context.Set<LedgerEntry>()
            .AsNoTracking()
            .Where(entry => entry.ProviderId == providerId
                && entry.AccountCode == LedgerConstants.AccountCodes.ProviderWalletReserved)
            .SumAsync(entry => (decimal?)entry.SignedAmount, cancellationToken)
            ?? 0.00m;

        var currency = await GetLatestKnownCurrencyAsync(providerId, DateTime.UtcNow, cancellationToken)
            ?? ProviderFinanceConstants.DefaultCurrency;

        return new WalletBalanceSnapshot(
            availableBalance,
            reservedBalance,
            availableBalance,
            currency);
    }

    public async Task<IReadOnlyList<ProviderWalletLedgerRecord>> GetWalletLedgerRecordsByProviderIdAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        return await _context.LedgerTransactions
            .AsNoTracking()
            .Where(transaction => transaction.Status == LedgerConstants.TransactionStatuses.Posted)
            .Where(transaction => transaction.Entries.Any(entry => entry.ProviderId == providerId
                && (entry.AccountCode == LedgerConstants.AccountCodes.ProviderWalletAvailable
                    || entry.AccountCode == LedgerConstants.AccountCodes.ProviderWalletReserved)))
            .OrderBy(transaction => transaction.OccurredAt)
            .ThenBy(transaction => transaction.CreatedAt)
            .ThenBy(transaction => transaction.Id)
            .Select(transaction => new ProviderWalletLedgerRecord(
                transaction.Id,
                transaction.Type,
                transaction.Status,
                providerId,
                transaction.Entries
                    .Where(entry => entry.ProviderId == providerId)
                    .Select(entry => entry.BookingId)
                    .FirstOrDefault(),
                transaction.Entries
                    .Where(entry => entry.ProviderId == providerId)
                    .Select(entry => entry.PaymentId)
                    .FirstOrDefault(),
                transaction.Entries
                    .Where(entry => entry.ProviderId == providerId)
                    .Select(entry => entry.ProviderWalletTopUpId)
                    .FirstOrDefault(),
                transaction.Entries
                    .Where(entry => entry.ProviderId == providerId
                        && entry.AccountCode == LedgerConstants.AccountCodes.ProviderWalletAvailable)
                    .Sum(entry => (decimal?)entry.SignedAmount) ?? 0.00m,
                transaction.Entries
                    .Where(entry => entry.ProviderId == providerId
                        && entry.AccountCode == LedgerConstants.AccountCodes.ProviderWalletReserved)
                    .Sum(entry => (decimal?)entry.SignedAmount) ?? 0.00m,
                transaction.Currency,
                transaction.ReferenceNumber,
                transaction.Description,
                transaction.CreatedByUserId,
                transaction.OccurredAt,
                transaction.CreatedAt))
            .ToListAsync(cancellationToken);
    }

    public async Task<(IReadOnlyList<ProviderWalletMovementResponse> Items, int TotalCount)> GetWalletMovementsAsync(
        Guid providerId,
        ProviderWalletMovementQuerySpec query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var normalizedQuery = query.Normalize();
        var filteredQuery = ApplyWalletMovementFilters(BuildProviderWalletMovementsQuery(providerId), normalizedQuery);
        var totalCount = await filteredQuery.CountAsync(cancellationToken);
        var items = await filteredQuery
            .OrderByDescending(movement => movement.OccurredAt)
            .ThenByDescending(movement => movement.Id)
            .Skip((normalizedQuery.Page - 1) * normalizedQuery.Limit)
            .Take(normalizedQuery.Limit)
            .ToListAsync(cancellationToken);

        return (items.AsReadOnly(), totalCount);
    }

    public async Task<ProviderWalletActivitySnapshot> GetWalletActivitySnapshotAsync(
        Guid providerId,
        DateTime asOfUtc,
        CancellationToken cancellationToken = default)
    {
        var walletMovements = BuildProviderWalletMovementsQuery(providerId);
        var currentMonthMovements = walletMovements.Where(movement => movement.OccurredAt.Year == asOfUtc.Year
            && movement.OccurredAt.Month == asOfUtc.Month);

        var currentMonthDeposits = await currentMonthMovements
            .Where(movement => movement.Type == ProviderFinanceConstants.WalletMovementTypes.Deposit)
            .SumAsync(movement => (decimal?)movement.Amount, cancellationToken)
            ?? 0.00m;

        var currentMonthDeductions = await currentMonthMovements
            .Where(movement => movement.Type == ProviderFinanceConstants.WalletMovementTypes.Deduction)
            .SumAsync(movement => (decimal?)movement.Amount, cancellationToken)
            ?? 0.00m;

        var availableYears = await walletMovements
            .Select(movement => movement.OccurredAt.Year)
            .Distinct()
            .OrderByDescending(year => year)
            .ToListAsync(cancellationToken);

        return new ProviderWalletActivitySnapshot(
            currentMonthDeposits,
            currentMonthDeductions,
            availableYears.AsReadOnly());
    }

    private IQueryable<ProviderWalletMovementResponse> BuildProviderWalletMovementsQuery(Guid providerId)
    {
        return from item in _context.FinanceTimelineItems.AsNoTracking()
               join topUp in _context.Set<ProviderWalletTopUp>().AsNoTracking()
                   on item.ProviderWalletTopUpId equals topUp.Id into topUpGroup
               from topUp in topUpGroup.DefaultIfEmpty()
               where item.ProviderId == providerId
                   && (
                       (item.ProviderWalletTopUpId.HasValue
                           && item.SourceType == FinanceTimelinePaymentSourceType
                           && item.Type == PaymentConstants.Purposes.WalletTopUp)
                       || (item.LedgerTransactionId.HasValue
                           && item.SourceType == FinanceTimelineLedgerTransactionSourceType
                           && item.Status == LedgerConstants.TransactionStatuses.Posted
                           && ProviderFacingWalletMovementTimelineTypes.Contains(item.Type)))
               select new ProviderWalletMovementResponse
               {
                   Id = item.ProviderWalletTopUpId ?? item.LedgerTransactionId ?? item.Id,
                   Type = item.ProviderWalletTopUpId.HasValue
                       ? ProviderFinanceConstants.WalletMovementTypes.Deposit
                       : item.Type == LedgerConstants.TransactionTypes.CashBookingFeeSettled
                           ? ProviderFinanceConstants.WalletMovementTypes.Deduction
                           : item.Direction == ProviderFinanceConstants.LedgerDirections.Credit
                               ? ProviderFinanceConstants.WalletMovementTypes.Deposit
                               : ProviderFinanceConstants.WalletMovementTypes.Deduction,
                    Status = item.ProviderWalletTopUpId.HasValue
                        ? (item.Status == ProviderFinanceConstants.TopUpStatuses.Credited
                            || item.Status == ProviderFinanceConstants.TopUpStatuses.Failed
                            || item.Status == ProviderFinanceConstants.TopUpStatuses.Cancelled
                            || item.Status == ProviderFinanceConstants.TopUpStatuses.Expired
                                ? item.Status
                                : ProviderFinanceConstants.TopUpStatuses.Expired)
                        : ProviderFinanceConstants.WalletMovementStatuses.Completed,
                   Amount = item.Amount,
                   Currency = item.Currency,
                   OccurredAt = item.OccurredAt,
                   Reference = item.ReferenceNumber ?? string.Empty,
                   Description = item.Description,
                   SourceType = item.ProviderWalletTopUpId.HasValue
                       ? ProviderFinanceConstants.WalletMovementSourceTypes.TopUp
                       : ProviderFinanceConstants.WalletMovementSourceTypes.WalletLedger,
                   TopUpNumber = item.ProviderWalletTopUpId.HasValue
                       ? (topUp == null ? item.ReferenceNumber : topUp.ReferenceNumber)
                       : null,
                   PaymentChannel = item.ProviderWalletTopUpId.HasValue
                       ? topUp == null
                           ? null
                           : topUp.MethodType == PaymentConstants.MethodTypes.ManualBankTransfer
                               ? ProviderFinanceConstants.PaymentChannels.BankTransfer
                               : topUp.MethodType == PaymentConstants.MethodTypes.ManualD17
                                   ? ProviderFinanceConstants.PaymentChannels.D17
                                   : null
                       : null,
                   ProviderTransferReference = item.ProviderWalletTopUpId.HasValue && topUp != null
                       ? topUp.ProviderSubmittedReference
                       : null,
                   EvidenceUrl = item.ProviderWalletTopUpId.HasValue && topUp != null
                       ? topUp.EvidenceUrl
                       : null,
                   MarkedTransferredAt = item.ProviderWalletTopUpId.HasValue && topUp != null
                       ? topUp.SubmittedAt
                       : null,
                   ExpiresAt = item.ProviderWalletTopUpId.HasValue && topUp != null
                       ? topUp.ExpiresAt
                       : null,
                    CanMarkTransferred = false,
                    CanCancel = false
                };
    }

    private static IQueryable<ProviderWalletMovementResponse> ApplyWalletMovementFilters(
        IQueryable<ProviderWalletMovementResponse> queryable,
        ProviderWalletMovementQuerySpec query)
    {
        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            queryable = queryable.Where(movement => movement.Type == query.Type);
        }

        if (query.Month.HasValue)
        {
            queryable = queryable.Where(movement => movement.OccurredAt.Month == query.Month.Value);
        }

        if (query.Year.HasValue)
        {
            queryable = queryable.Where(movement => movement.OccurredAt.Year == query.Year.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchPattern = $"%{query.Search}%";
            queryable = queryable.Where(movement => EF.Functions.ILike(movement.Description, searchPattern)
                || EF.Functions.ILike(movement.Reference, searchPattern)
                || (movement.TopUpNumber != null && EF.Functions.ILike(movement.TopUpNumber, searchPattern))
                || (movement.ProviderTransferReference != null && EF.Functions.ILike(movement.ProviderTransferReference, searchPattern))
                || (movement.EvidenceUrl != null && EF.Functions.ILike(movement.EvidenceUrl, searchPattern)));
        }

        return queryable;
    }
}
