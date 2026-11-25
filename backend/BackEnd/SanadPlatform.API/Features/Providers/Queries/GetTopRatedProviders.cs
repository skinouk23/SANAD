using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Specifications;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve the top-rated providers.
/// Maps to GET /api/v1/providers/top-rated.
/// </summary>
public record GetTopRatedProvidersQuery(
    int Page,
    int Limit) : IRequest<PaginatedProviderResponse>;

/// <summary>
/// Handler for <see cref="GetTopRatedProvidersQuery"/>.
/// Creates a <see cref="TopRatedProvidersSpecification"/> and delegates to the provider repository.
/// </summary>
public class GetTopRatedProvidersQueryHandler
    : IRequestHandler<GetTopRatedProvidersQuery, PaginatedProviderResponse>
{
    private readonly IProviderRepository _repository;
    private readonly ILogger<GetTopRatedProvidersQueryHandler> _logger;

    public GetTopRatedProvidersQueryHandler(
        IProviderRepository repository,
        ILogger<GetTopRatedProvidersQueryHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PaginatedProviderResponse> Handle(
        GetTopRatedProvidersQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Fetching top {Limit} rated providers", query.Limit);

        var spec = new TopRatedProvidersSpecification(query.Page, query.Limit);

        var (items, total) = await _repository.GetProvidersAsync(spec, cancellationToken);

        var totalPages = (int)Math.Ceiling((double)total / query.Limit);

        _logger.LogDebug("Retrieved {Count} top-rated providers", items.Count);

        return new PaginatedProviderResponse
        {
            Items = items,
            Pagination = new PaginationMetadata
            {
                Page = query.Page,
                Limit = query.Limit,
                Total = total,
                TotalPages = totalPages
            }
        };
    }
}
