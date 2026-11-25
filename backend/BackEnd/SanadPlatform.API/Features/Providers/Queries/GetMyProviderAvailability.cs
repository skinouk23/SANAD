using MediatR;
using SanadPlatform.API.Features.Providers.DTOs;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Providers.Queries;

/// <summary>
/// Query to retrieve the authenticated provider's own availability for a specific date.
/// Maps to GET /api/v1/providers/me/availability (with ?date= query param).
/// Reuses the same availability computation logic as the public endpoint but resolves
/// the provider ID from the authenticated user's claims.
/// </summary>
public record GetMyProviderAvailabilityQuery(
    Guid UserId,
    DateOnly Date,
    Guid? ServiceId) : IRequest<ProviderAvailabilityResponse>;

/// <summary>
/// Handler for <see cref="GetMyProviderAvailabilityQuery"/>.
/// Resolves the provider ID from the user ID, then delegates to the same availability
/// computation used by <see cref="GetProviderAvailabilityQuery"/>.
/// </summary>
public class GetMyProviderAvailabilityQueryHandler
    : IRequestHandler<GetMyProviderAvailabilityQuery, ProviderAvailabilityResponse>
{
    private readonly IMediator _mediator;
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetMyProviderAvailabilityQueryHandler> _logger;

    public GetMyProviderAvailabilityQueryHandler(
        IMediator mediator,
        IProviderRepository providerRepository,
        ILogger<GetMyProviderAvailabilityQueryHandler> logger)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<ProviderAvailabilityResponse> Handle(
        GetMyProviderAvailabilityQuery query,
        CancellationToken cancellationToken)
    {
        _logger.LogDebug("Resolving provider ID for user {UserId} to fetch own availability", query.UserId);

        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.UserId, cancellationToken);
        if (providerId is null)
        {
            throw new KeyNotFoundException($"No provider profile found for user '{query.UserId}'.");
        }

        // Delegate to the existing availability query to avoid duplicating logic
        return await _mediator.Send(
            new GetProviderAvailabilityQuery(providerId.Value, query.Date, query.ServiceId),
            cancellationToken);
    }
}
