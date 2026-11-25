using MediatR;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Repository;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Query to retrieve aggregate statistics for the authenticated provider's services.
/// </summary>
public record GetProviderServiceStatsQuery(
    Guid UserId) : IRequest<ServiceStatsResponse>;

/// <summary>
/// Handler for <see cref="GetProviderServiceStatsQuery"/>.
/// Returns total, active, inactive service counts and total bookings.
/// </summary>
public class GetProviderServiceStatsHandler
    : IRequestHandler<GetProviderServiceStatsQuery, ServiceStatsResponse>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetProviderServiceStatsHandler> _logger;

    public GetProviderServiceStatsHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        ILogger<GetProviderServiceStatsHandler> logger)
    {
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the stats query.
    /// </summary>
    public async Task<ServiceStatsResponse> Handle(
        GetProviderServiceStatsQuery request,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        _logger.LogDebug("Retrieving service statistics for provider {ProviderId}", providerId);

        var (total, active, inactive, totalBookings) = await _serviceRepository.GetStatsAsync(
            providerId, cancellationToken);

        return new ServiceStatsResponse
        {
            TotalServices = total,
            ActiveServices = active,
            InactiveServices = inactive,
            TotalBookings = totalBookings
        };
    }
}
