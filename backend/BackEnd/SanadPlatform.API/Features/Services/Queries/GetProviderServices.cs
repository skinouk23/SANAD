using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Repository;
using SanadPlatform.API.Features.Services.Specifications;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Query to retrieve a paginated, filtered list of services
/// for the authenticated provider.
/// </summary>
public record GetProviderServicesQuery(
    Guid UserId,
    string? Search = null,
    bool? IsActive = null,
    string? SortBy = "created",
    bool SortDesc = true,
    int Page = 1,
    int Limit = 20) : IRequest<ProviderServiceListResponse>;

/// <summary>
/// Handler for <see cref="GetProviderServicesQuery"/>.
/// Resolves the provider, builds a specification, and returns paginated results.
/// </summary>
public class GetProviderServicesHandler
    : IRequestHandler<GetProviderServicesQuery, ProviderServiceListResponse>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetProviderServicesHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetProviderServicesHandler"/> class.
    /// </summary>
    public GetProviderServicesHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        ILogger<GetProviderServicesHandler> logger)
    {
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the paginated service list query.
    /// </summary>
    public async Task<ProviderServiceListResponse> Handle(
        GetProviderServicesQuery request,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        _logger.LogDebug(
            "Retrieving services for provider {ProviderId} (page {Page}, limit {Limit}, search={Search})",
            providerId, request.Page, request.Limit, request.Search);

        var spec = new ProviderServiceSpecification(
            providerId,
            request.Search,
            request.IsActive,
            request.SortBy,
            request.SortDesc,
            request.Page,
            request.Limit);

        var (items, total) = await _serviceRepository.GetPagedSummaryAsync(spec, cancellationToken);

        return new ProviderServiceListResponse
        {
            Items = items,
            Pagination = new PaginationMetadata
            {
                Page = request.Page,
                Limit = request.Limit,
                Total = total,
                TotalPages = (int)Math.Ceiling(total / (double)request.Limit)
            }
        };
    }
}
