using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.ProviderFinance.DTOs;
using SanadPlatform.API.Features.ProviderFinance.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.ProviderFinance.Queries;

/// <summary>
/// Returns the authenticated provider's unified wallet movement history.
/// </summary>
public record GetMyProviderWalletMovementsQuery(
    Guid UserId,
    int Page = 1,
    int Limit = 10,
    string? Type = null,
    string? Search = null,
    int? Month = null,
    int? Year = null) : IRequest<ProviderWalletMovementsResponse>;

/// <summary>
/// Handles <see cref="GetMyProviderWalletMovementsQuery"/>.
/// </summary>
public class GetMyProviderWalletMovementsHandler : IRequestHandler<GetMyProviderWalletMovementsQuery, ProviderWalletMovementsResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderFinanceRepository _providerFinanceRepository;

    public GetMyProviderWalletMovementsHandler(
        IProviderRepository providerRepository,
        IProviderFinanceRepository providerFinanceRepository)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _providerFinanceRepository = providerFinanceRepository ?? throw new ArgumentNullException(nameof(providerFinanceRepository));
    }

    public async Task<ProviderWalletMovementsResponse> Handle(
        GetMyProviderWalletMovementsQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider profile not found for user {query.UserId}.");

        var spec = new ProviderWalletMovementQuerySpec(
            Page: query.Page,
            Limit: query.Limit,
            Type: query.Type,
            Search: query.Search,
            Month: query.Month,
            Year: query.Year).Normalize();

        var (items, total) = await _providerFinanceRepository.GetWalletMovementsAsync(providerId, spec, cancellationToken);

        return new ProviderWalletMovementsResponse
        {
            Items = items,
            Pagination = new PaginationMetadata
            {
                Page = spec.Page,
                Limit = spec.Limit,
                Total = total,
                TotalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)spec.Limit)
            }
        };
    }
}
