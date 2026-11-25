using MediatR;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns the authenticated provider's wallet summary.
/// </summary>
public record GetMyProviderWalletQuery(Guid UserId) : IRequest<ProviderWalletSummaryResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderWalletQuery"/>.
/// </summary>
public class GetMyProviderWalletHandler : IRequestHandler<GetMyProviderWalletQuery, ProviderWalletSummaryResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetMyProviderWalletHandler(
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<ProviderWalletSummaryResponse> Handle(
        GetMyProviderWalletQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider profile not found for user {query.UserId}.");

        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(providerId, cancellationToken);
        var currency = ProviderFinanceConstants.DefaultCurrency;

        var reservedBalance = snapshot.ReservedBalance;
        var usableBalance = snapshot.UsableBalance;

        return new ProviderWalletSummaryResponse
        {
            ReservedBalance = reservedBalance,
            UsableBalance = usableBalance,
            Currency = currency
        };
    }
}
