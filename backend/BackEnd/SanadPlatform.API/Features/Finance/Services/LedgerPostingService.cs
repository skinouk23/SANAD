using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Finance.Entities;
using SanadPlatform.API.Features.ProviderFinance;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Finance.Services;

/// <summary>
/// EF Core-backed implementation of canonical ledger posting.
/// </summary>
public class LedgerPostingService : ILedgerPostingService
{
    private readonly SanadDbContext _context;
    private readonly ILogger<LedgerPostingService> _logger;

    public LedgerPostingService(
        SanadDbContext context,
        ILogger<LedgerPostingService> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<LedgerTransaction> PostAsync(LedgerPostingRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        if (request.Entries.Count == 0)
        {
            throw new InvalidOperationException("Ledger postings must contain at least one entry.");
        }

        var normalizedIdempotencyKey = string.IsNullOrWhiteSpace(request.IdempotencyKey)
            ? null
            : request.IdempotencyKey.Trim();

        if (normalizedIdempotencyKey != null)
        {
            var existingTransaction = await _context.LedgerTransactions
                .Include(transaction => transaction.Entries)
                .FirstOrDefaultAsync(
                    transaction => transaction.IdempotencyKey == normalizedIdempotencyKey,
                    cancellationToken);

            if (existingTransaction != null)
            {
                _logger.LogDebug(
                    "Reused existing ledger transaction {LedgerTransactionId} for Idempotency-Key {IdempotencyKey}",
                    existingTransaction.Id,
                    normalizedIdempotencyKey);

                return existingTransaction;
            }
        }

        var normalizedCurrency = ProviderFinanceConstants.DefaultCurrency;
        var accountCodes = request.Entries
            .Select(entry => entry.AccountCode)
            .Distinct(StringComparer.Ordinal)
            .ToList();

        var existingAccountCodes = await _context.Accounts
            .AsNoTracking()
            .Where(account => account.IsActive && accountCodes.Contains(account.Code))
            .Select(account => account.Code)
            .ToListAsync(cancellationToken);

        var missingAccountCodes = accountCodes
            .Except(existingAccountCodes, StringComparer.Ordinal)
            .ToArray();

        if (missingAccountCodes.Length > 0)
        {
            throw new InvalidOperationException(
                $"Ledger posting references inactive or missing account codes: {string.Join(", ", missingAccountCodes)}.");
        }

        var transaction = new LedgerTransaction
        {
            Id = Guid.NewGuid(),
            ReferenceNumber = request.ReferenceNumber,
            Type = request.Type,
            Status = LedgerConstants.TransactionStatuses.Posted,
            Description = request.Description,
            SourceType = request.SourceType,
            SourceId = request.SourceId,
            Currency = normalizedCurrency,
            OccurredAt = request.OccurredAt,
            CreatedByUserId = request.CreatedByUserId,
            IdempotencyKey = normalizedIdempotencyKey,
            Entries = request.Entries
                .Select(entry => new LedgerEntry
                {
                    Id = Guid.NewGuid(),
                    AccountCode = entry.AccountCode,
                    ProviderId = entry.ProviderId,
                    BookingId = entry.BookingId,
                    PaymentId = entry.PaymentId,
                    ProviderWalletTopUpId = entry.ProviderWalletTopUpId,
                    Amount = Math.Abs(entry.SignedAmount),
                    SignedAmount = entry.SignedAmount,
                    Currency = normalizedCurrency
                })
                .ToList()
        };

        _context.LedgerTransactions.Add(transaction);

        _logger.LogInformation(
            "Staged ledger transaction {ReferenceNumber} with {EntryCount} entries",
            transaction.ReferenceNumber,
            transaction.Entries.Count);

        return transaction;
    }
}
