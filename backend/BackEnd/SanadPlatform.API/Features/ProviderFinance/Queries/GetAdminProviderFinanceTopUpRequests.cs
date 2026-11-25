using MediatR;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns admin-facing provider wallet top-ups with provider identification.
/// </summary>
public record GetAdminProviderFinanceTopUpRequestsQuery() : IRequest<IReadOnlyList<AdminProviderFinanceTopUpRequestResponse>>;

/// <summary>
/// Handles <see cref="GetAdminProviderFinanceTopUpRequestsQuery"/>.
/// </summary>
public class GetAdminProviderFinanceTopUpRequestsHandler : IRequestHandler<GetAdminProviderFinanceTopUpRequestsQuery, IReadOnlyList<AdminProviderFinanceTopUpRequestResponse>>
{
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetAdminProviderFinanceTopUpRequestsHandler(IProviderFinanceRepository providerFinanceRepository)
    {
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<IReadOnlyList<AdminProviderFinanceTopUpRequestResponse>> Handle(
        GetAdminProviderFinanceTopUpRequestsQuery query,
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var topUps = await _providerFinanceRepository.GetTopUpsForAdminAsync(cancellationToken);

        return topUps
            .Select(topUp => ProviderFinanceResponseMapper.ToAdminTopUpResponse(topUp, now))
            .ToList()
            .AsReadOnly();
    }
}
