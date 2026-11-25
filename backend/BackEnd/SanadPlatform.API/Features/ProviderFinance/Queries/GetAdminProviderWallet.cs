using MediatR;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns an admin-facing wallet summary for a provider.
/// </summary>
public record GetAdminProviderWalletQuery(Guid ProviderId) : IRequest<AdminProviderWalletSummaryResponse>;

/// <summary>
/// Handles <see cref="GetAdminProviderWalletQuery"/>.
/// </summary>
public class GetAdminProviderWalletHandler : IRequestHandler<GetAdminProviderWalletQuery, AdminProviderWalletSummaryResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetAdminProviderWalletHandler(
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<AdminProviderWalletSummaryResponse> Handle(
        GetAdminProviderWalletQuery query,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByIdAsync(query.ProviderId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider {query.ProviderId} was not found.");

        var snapshot = await _providerFinanceRepository.GetWalletBalanceSnapshotAsync(query.ProviderId, cancellationToken);
        var currency = ProviderFinanceConstants.DefaultCurrency;

        var reservedBalance = snapshot.ReservedBalance;
        var usableBalance = snapshot.UsableBalance;

        return new AdminProviderWalletSummaryResponse
        {
            ProviderId = provider.Id,
            ProviderDisplayName = ProviderFinanceResponseMapper.BuildProviderDisplayName(provider),
            ProviderBusinessName = provider.BusinessName,
            ReservedBalance = reservedBalance,
            UsableBalance = usableBalance,
            Currency = currency
        };
    }
}
