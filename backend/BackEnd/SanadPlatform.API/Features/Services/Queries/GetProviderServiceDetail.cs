using AutoMapper;
using MediatR;
using SanadPlatform.API.Features.Providers.Repository;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Repository;

namespace SanadPlatform.API.Features.Services.Queries;

/// <summary>
/// Query to retrieve a single service's full details by ID,
/// scoped to the authenticated provider.
/// </summary>
public record GetProviderServiceDetailQuery(
    Guid UserId,
    Guid ServiceId) : IRequest<ServiceDetailResponse>;

/// <summary>
/// Handler for <see cref="GetProviderServiceDetailQuery"/>.
/// Returns full service detail including addons for the owning provider.
/// </summary>
public class GetProviderServiceDetailHandler
    : IRequestHandler<GetProviderServiceDetailQuery, ServiceDetailResponse>
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetProviderServiceDetailHandler> _logger;

    public GetProviderServiceDetailHandler(
        IServiceRepository serviceRepository,
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<GetProviderServiceDetailHandler> logger)
    {
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Handles the service detail query.
    /// </summary>
    public async Task<ServiceDetailResponse> Handle(
        GetProviderServiceDetailQuery request,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Provider profile not found.");

        var service = await _serviceRepository.GetByIdAndProviderAsync(
            request.ServiceId, providerId, cancellationToken)
            ?? throw new KeyNotFoundException($"Service {request.ServiceId} not found.");

        _logger.LogDebug(
            "Retrieved service detail {ServiceId} for provider {ProviderId}",
            service.Id, providerId);

        return _mapper.Map<ServiceDetailResponse>(service);
    }
}
