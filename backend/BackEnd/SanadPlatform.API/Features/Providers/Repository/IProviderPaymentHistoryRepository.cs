using SanadPlatform.API.Features.Providers.DTOs;

namespace SanadPlatform.API.Features.Providers.Repository;

/// <summary>
/// Read-only repository for provider payment history and payment-history metrics.
/// </summary>
public interface IProviderPaymentHistoryRepository
{
    /// <summary>
    /// Returns a paginated provider-scoped payment history backed by canonical booking and payment data.
    /// </summary>
    Task<(IReadOnlyList<ProviderPaymentHistoryItemResponse> Items, int Total)> GetPaymentHistoryAsync(
        Guid providerId,
        GetMyProviderPaymentHistoryRequest request,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns aggregate metrics for the provider payment-history screen.
    /// </summary>
    Task<ProviderPaymentHistoryStatsResponse> GetPaymentHistoryStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);
}
