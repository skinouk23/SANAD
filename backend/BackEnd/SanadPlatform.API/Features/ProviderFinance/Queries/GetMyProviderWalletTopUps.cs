using MediatR;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns the authenticated provider's wallet top-ups.
/// </summary>
public record GetMyProviderWalletTopUpsQuery(Guid UserId) : IRequest<IReadOnlyList<ProviderWalletTopUpRequestResponse>>;

/// <summary>
/// Handles <see cref="GetMyProviderWalletTopUpsQuery"/>.
/// </summary>
public class GetMyProviderWalletTopUpsHandler : IRequestHandler<GetMyProviderWalletTopUpsQuery, IReadOnlyList<ProviderWalletTopUpRequestResponse>>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetMyProviderWalletTopUpsHandler(
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<IReadOnlyList<ProviderWalletTopUpRequestResponse>> Handle(
        GetMyProviderWalletTopUpsQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider profile not found for user {query.UserId}.");

        var now = DateTime.UtcNow;
        var topUps = await _providerFinanceRepository.GetTopUpsByProviderIdAsync(providerId, cancellationToken);

        return topUps
            .Select(topUp => ProviderFinanceResponseMapper.ToProviderTopUpResponse(topUp, now))
            .ToList()
            .AsReadOnly();
    }
}
