using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve a single provider by its ID.
/// </summary>
public record GetProviderByIdQuery(Guid Id) : IRequest<ProviderDetailResponse>;

/// <summary>
/// Handler for <see cref="GetProviderByIdQuery"/>.
/// Throws <see cref="KeyNotFoundException"/> (→ 404) when no provider exists with the given ID.
/// </summary>
public class GetProviderByIdQueryHandler : IRequestHandler<GetProviderByIdQuery, ProviderDetailResponse>
{
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetProviderByIdQueryHandler> _logger;

    public GetProviderByIdQueryHandler(
        IProviderRepository providerRepository,
        ILogger<GetProviderByIdQueryHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderDetailResponse> Handle(
        GetProviderByIdQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Retrieving provider {ProviderId}", query.Id);

        var provider = await _providerRepository.GetPublicDetailByIdAsync(query.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Provider {query.Id} not found.");

        return provider;
    }
}
