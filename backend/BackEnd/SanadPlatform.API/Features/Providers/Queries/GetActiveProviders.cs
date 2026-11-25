using AutoMapper;
using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve all active (approved and available) providers, ordered by rating.
/// </summary>
public record GetActiveProvidersQuery : IRequest<IReadOnlyList<ProviderResponse>>;

/// <summary>
/// Handler for <see cref="GetActiveProvidersQuery"/>.
/// </summary>
public class GetActiveProvidersQueryHandler : IRequestHandler<GetActiveProvidersQuery, IReadOnlyList<ProviderResponse>>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetActiveProvidersQueryHandler> _logger;

    public GetActiveProvidersQueryHandler(
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<GetActiveProvidersQueryHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<ProviderResponse>> Handle(
        GetActiveProvidersQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Retrieving all active providers");
        var providers = await _providerRepository.GetActiveAsync(cancellationToken);
        var responses = _mapper.Map<IReadOnlyList<ProviderResponse>>(providers);
        await _providerRepository.EnrichWithProfilePictureUrlsAsync(responses, cancellationToken);
        return responses;
    }
}
