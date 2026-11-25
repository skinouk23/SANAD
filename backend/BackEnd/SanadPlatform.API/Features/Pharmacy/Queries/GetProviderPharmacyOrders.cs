using MediatR;
using SanadPlatform.API.Features.Pharmacy.DTOs;
using SanadPlatform.API.Features.Pharmacy.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Pharmacy.Queries;

// ==================== Query ====================

/// <summary>
/// Retrieves pharmacy orders assigned to the authenticated provider.
/// </summary>
public record GetProviderPharmacyOrdersQuery(
    Guid CallerUserId) : IRequest<IReadOnlyList<ProviderPharmacyOrderResponse>>;

// ==================== Handler ====================

/// <summary>
/// Handles <see cref="GetProviderPharmacyOrdersQuery"/> by resolving the provider ID
/// from the caller's user ID and delegating to the repository.
/// </summary>
public class GetProviderPharmacyOrdersHandler : IRequestHandler<GetProviderPharmacyOrdersQuery, IReadOnlyList<ProviderPharmacyOrderResponse>>
{
    private readonly IPharmacyOrderRepository _pharmacyRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly ILogger<GetProviderPharmacyOrdersHandler> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetProviderPharmacyOrdersHandler"/> class.
    /// </summary>
    public GetProviderPharmacyOrdersHandler(
        IPharmacyOrderRepository pharmacyRepository,
        IProviderRepository providerRepository,
        ILogger<GetProviderPharmacyOrdersHandler> logger)
    {
        _pharmacyRepository = pharmacyRepository ?? throw new ArgumentNullException(nameof(pharmacyRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Resolves the provider identity and returns their pharmacy orders.
    /// </summary>
    public async Task<IReadOnlyList<ProviderPharmacyOrderResponse>> Handle(
        GetProviderPharmacyOrdersQuery query,
        CancellationToken cancellationToken)
    {
        var providerId = await _providerRepository.GetProviderIdByUserIdAsync(query.CallerUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException("Provider profile not found for the authenticated user.");

        _logger.LogDebug(
            "Fetching pharmacy orders for provider {ProviderId} (user {UserId})",
            providerId, query.CallerUserId);

        return await _pharmacyRepository.GetProviderOrdersAsync(providerId, cancellationToken);
    }
}
