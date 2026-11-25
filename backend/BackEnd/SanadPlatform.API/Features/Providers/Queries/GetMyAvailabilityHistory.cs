using AutoMapper;
using MediatR;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Providers.Specifications;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve a paginated list of availability status change history
/// for the authenticated provider, optionally filtered by date range.
/// </summary>
public record GetMyAvailabilityHistoryQuery(
    Guid UserId,
    DateTime? StartDate = null,
    DateTime? EndDate = null,
    int Page = 1,
    int Limit = 20
) : IRequest<ProviderAvailabilityHistoryResponse>;

/// <summary>
/// Handler for <see cref="GetMyAvailabilityHistoryQuery"/>.
/// Throws <see cref="KeyNotFoundException"/> (→ 404) when no provider profile exists for the user.
/// </summary>
public class GetMyAvailabilityHistoryQueryHandler
    : IRequestHandler<GetMyAvailabilityHistoryQuery, ProviderAvailabilityHistoryResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetMyAvailabilityHistoryQueryHandler> _logger;

    public GetMyAvailabilityHistoryQueryHandler(
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<GetMyAvailabilityHistoryQueryHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the availability history query by resolving the provider,
    /// building a specification, and mapping the results.
    /// </summary>
    public async Task<ProviderAvailabilityHistoryResponse> Handle(
        GetMyAvailabilityHistoryQuery request,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        _logger.LogDebug(
            "Retrieving availability history for provider {ProviderId} (page {Page}, limit {Limit})",
            provider.Id, request.Page, request.Limit);

        var spec = new ProviderAvailabilityHistorySpecification(
            provider.Id,
            request.StartDate,
            request.EndDate,
            request.Page,
            request.Limit);

        var (items, total) = await _providerRepository.GetAvailabilityHistoryAsync(spec, cancellationToken);

        return new ProviderAvailabilityHistoryResponse
        {
            Items = _mapper.Map<IReadOnlyList<ProviderAvailabilityHistoryDto>>(items),
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
