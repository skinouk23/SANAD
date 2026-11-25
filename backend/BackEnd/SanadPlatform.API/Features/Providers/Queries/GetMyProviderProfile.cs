using AutoMapper;
using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to get the current authenticated provider's profile.
/// </summary>
public record GetMyProviderProfileQuery(Guid UserId) : IRequest<ProviderProfileResponse?>;

/// <summary>
/// Handler for <see cref="GetMyProviderProfileQuery"/>.
/// Returns null when no provider profile exists for the user (controller maps this to 404).
/// </summary>
public class GetMyProviderProfileQueryHandler : IRequestHandler<GetMyProviderProfileQuery, ProviderProfileResponse?>
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetMyProviderProfileQueryHandler> _logger;

    public GetMyProviderProfileQueryHandler(
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<GetMyProviderProfileQueryHandler> logger)
    {
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderProfileResponse?> Handle(
        GetMyProviderProfileQuery query,
        CancellationToken cancellationToken)
    {
        var provider = await _providerRepository.GetByUserIdAsync(query.UserId, cancellationToken);
        if (provider == null)
        {
            _logger.LogDebug("Provider profile not found for user {UserId}", query.UserId);
            return null;
        }

        // CompletionRate is computed in AfterMap inside ProviderMappingProfile.
        return _mapper.Map<ProviderProfileResponse>(provider);
    }
}
