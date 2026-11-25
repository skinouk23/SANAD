using MediatR;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns the authenticated provider's canonical wallet ledger view.
/// </summary>
public record GetMyProviderWalletLedgerQuery(Guid UserId) : IRequest<IReadOnlyList<ProviderWalletLedgerEntryResponse>>;

/// <summary>
/// Handles <see cref="GetMyProviderWalletLedgerQuery"/>.
/// </summary>
public class GetMyProviderWalletLedgerHandler : IRequestHandler<GetMyProviderWalletLedgerQuery, IReadOnlyList<ProviderWalletLedgerEntryResponse>>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetMyProviderWalletLedgerHandler(
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<IReadOnlyList<ProviderWalletLedgerEntryResponse>> Handle(
        GetMyProviderWalletLedgerQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider profile not found for user {query.UserId}.");

        var records = await _providerFinanceRepository.GetWalletLedgerRecordsByProviderIdAsync(providerId, cancellationToken);
        return ProviderFinanceResponseMapper.ToLedgerEntryResponses(records);
    }
}
