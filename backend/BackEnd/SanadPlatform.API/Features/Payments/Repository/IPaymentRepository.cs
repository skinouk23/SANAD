using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Payments.Repository;

/// <summary>
/// Repository contract for canonical payment lookups.
/// </summary>
public interface IPaymentRepository
{
    /// <summary>
    /// Returns the canonical payment attempt previously initiated with the supplied idempotency key.
    /// </summary>
    Task<PaymentAttempt?> GetAttemptByIdempotencyKeyAsync(string idempotencyKey, CancellationToken cancellationToken = default);
}
