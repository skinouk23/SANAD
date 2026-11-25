using AutoMapper;
using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve all available providers in the given country, ordered by rating.
/// </summary>
public record GetProvidersByCountryQuery(string Country) : IRequest<IReadOnlyList<ProviderResponse>>;

/// <summary>
/// Handler for <see cref="GetProvidersByCountryQuery"/>.
/// </summary>
public class GetProvidersByCountryQueryHandler : IRequestHandler<GetProvidersByCountryQuery, IReadOnlyList<ProviderResponse>>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetProvidersByCountryQueryHandler> _logger;

    public GetProvidersByCountryQueryHandler(
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<GetProvidersByCountryQueryHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<ProviderResponse>> Handle(
        GetProvidersByCountryQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Retrieving providers for country {Country}", query.Country);
        var providers = await _providerRepository.GetByCountryAsync(query.Country, cancellationToken);
        var responses = _mapper.Map<IReadOnlyList<ProviderResponse>>(providers);
        await _providerRepository.EnrichWithProfilePictureUrlsAsync(responses, cancellationToken);
        return responses;
    }
}
