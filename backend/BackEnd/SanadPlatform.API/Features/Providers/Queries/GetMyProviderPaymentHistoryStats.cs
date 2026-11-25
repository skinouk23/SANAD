using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve aggregate payment-history metrics for the authenticated provider.
/// </summary>
public record GetMyProviderPaymentHistoryStatsQuery(Guid UserId) : IRequest<ProviderPaymentHistoryStatsResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderPaymentHistoryStatsQuery"/>.
/// </summary>
public class GetMyProviderPaymentHistoryStatsHandler
    : IRequestHandler<GetMyProviderPaymentHistoryStatsQuery, ProviderPaymentHistoryStatsResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderPaymentHistoryRepository _paymentHistoryRepository;
    private readonly ILogger<GetMyProviderPaymentHistoryStatsHandler> _logger;

    public GetMyProviderPaymentHistoryStatsHandler(
        IProviderRepository providerRepository,
        IProviderPaymentHistoryRepository paymentHistoryRepository,
        ILogger<GetMyProviderPaymentHistoryStatsHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _paymentHistoryRepository = paymentHistoryRepository ?? throw new ArgumentNullException(nameof(paymentHistoryRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderPaymentHistoryStatsResponse> Handle(
        GetMyProviderPaymentHistoryStatsQuery request,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        _logger.LogDebug("Retrieving payment-history stats for provider {ProviderId}", providerId);

        return await _paymentHistoryRepository.GetPaymentHistoryStatsAsync(providerId, cancellationToken);
    }
}
