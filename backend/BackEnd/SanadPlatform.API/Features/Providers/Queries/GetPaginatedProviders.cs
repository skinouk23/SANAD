using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Specifications;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve a paginated, filterable list of providers.
/// Maps to GET /api/v1/providers.
/// </summary>
public record GetPaginatedProvidersQuery(
    int Page,
    int Limit,
    string? Status,
    string? ServiceCategory,
    string? SearchQuery,
    string? SortBy,
    bool SortDesc,
    string? City) : IRequest<PaginatedProviderResponse>;

/// <summary>
/// Handler for <see cref="GetPaginatedProvidersQuery"/>.
/// Creates a <see cref="PaginatedProvidersSpecification"/> and delegates to the provider repository.
/// </summary>
public class GetPaginatedProvidersQueryHandler
    : IRequestHandler<GetPaginatedProvidersQuery, PaginatedProviderResponse>
{
    private readonly IProviderRepository _repository;
    private readonly ILogger<GetPaginatedProvidersQueryHandler> _logger;

    public GetPaginatedProvidersQueryHandler(
        IProviderRepository repository,
        ILogger<GetPaginatedProvidersQueryHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PaginatedProviderResponse> Handle(
        GetPaginatedProvidersQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug(
            "Fetching paginated providers: Page={Page}, Limit={Limit}, Search={Search}",
            query.Page, query.Limit, query.SearchQuery);

        var spec = new PaginatedProvidersSpecification(
            query.Page,
            query.Limit,
            query.Status,
            query.ServiceCategory,
            query.SearchQuery,
            query.SortBy,
            query.SortDesc,
            query.City);

        var (items, total) = await _repository.GetProvidersAsync(spec, cancellationToken);

        if (!string.IsNullOrEmpty(query.ServiceCategory))
        {
            await _repository.EnrichWithServiceStatsAsync(items, query.ServiceCategory, cancellationToken);
        }

        var totalPages = (int)Math.Ceiling((double)total / query.Limit);

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
