using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Payments.Repository;

/// <summary>
/// EF Core repository for canonical payment lookups.
/// </summary>
public class PaymentRepository : IPaymentRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<PaymentRepository> _logger;

    public PaymentRepository(
        SanadDbContext context,
        ILogger<PaymentRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PaymentAttempt?> GetAttemptByIdempotencyKeyAsync(
        string idempotencyKey,
        CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(idempotencyKey);

        var normalizedKey = idempotencyKey.Trim();
        var attempt = await _context.PaymentAttempts
            .AsNoTracking()
            .Include(existingAttempt => existingAttempt.Payment)
            .FirstOrDefaultAsync(existingAttempt => existingAttempt.IdempotencyKey == normalizedKey, cancellationToken);

        if (attempt != null)
        {
            _logger.LogDebug(
                "Resolved payment attempt {PaymentAttemptId} from Idempotency-Key {IdempotencyKey}",
                attempt.Id,
                normalizedKey);
        }

        return attempt;
    }
}
