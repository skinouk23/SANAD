using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Specifications;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve providers that are currently available for a given service category.
/// Maps to GET /api/v1/providers/available.
/// </summary>
public record GetAvailableProvidersQuery(
    string ServiceCategory,
    int Page,
    int Limit) : IRequest<PaginatedProviderResponse>;

/// <summary>
/// Handler for <see cref="GetAvailableProvidersQuery"/>.
/// Creates an <see cref="AvailableProvidersSpecification"/> and delegates to the provider repository.
/// </summary>
public class GetAvailableProvidersQueryHandler
    : IRequestHandler<GetAvailableProvidersQuery, PaginatedProviderResponse>
{
    private readonly IProviderRepository _repository;
    private readonly ILogger<GetAvailableProvidersQueryHandler> _logger;

    public GetAvailableProvidersQueryHandler(
        IProviderRepository repository,
        ILogger<GetAvailableProvidersQueryHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<PaginatedProviderResponse> Handle(
        GetAvailableProvidersQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Fetching available providers for service category {ServiceCategory}", query.ServiceCategory);

        var spec = new AvailableProvidersSpecification(
            query.ServiceCategory,
            query.Page,
            query.Limit);

        var (items, total) = await _repository.GetProvidersAsync(spec, cancellationToken);

        var totalPages = (int)Math.Ceiling((double)total / query.Limit);

        _logger.LogDebug("Found {Count} available providers for service category {ServiceCategory}",
            items.Count, query.ServiceCategory);

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
