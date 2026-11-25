using MediatR;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns aggregate stats for the authenticated provider's wallet movements.
/// </summary>
public record GetMyProviderWalletStatsQuery(Guid UserId) : IRequest<ProviderWalletStatsResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderWalletStatsQuery"/>.
/// </summary>
public class GetMyProviderWalletStatsHandler : IRequestHandler<GetMyProviderWalletStatsQuery, ProviderWalletStatsResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetMyProviderWalletStatsHandler(
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<ProviderWalletStatsResponse> Handle(
        GetMyProviderWalletStatsQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider profile not found for user {query.UserId}.");

        var now = DateTime.UtcNow;
        var activity = await _providerFinanceRepository.GetWalletActivitySnapshotAsync(providerId, now, cancellationToken);
        var currency = ProviderFinanceConstants.DefaultCurrency;

        return new ProviderWalletStatsResponse
        {
            CurrentMonthDeposits = activity.CurrentMonthDeposits,
            CurrentMonthDeductions = activity.CurrentMonthDeductions,
            Currency = currency,
            AvailableYears = activity.AvailableYears
        };
    }
}
