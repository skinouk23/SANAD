using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Services.Repository;

namespace SanadPlatform.API.Features.Services.Services;

/// <summary>
/// Result of resolving requested service items against the provider's active catalog.
/// </summary>
public sealed record ResolvedServiceItem(Service Service, int Quantity);

/// <summary>
/// Resolves and validates service selections for a given provider.
/// Shared by availability queries (untracked reads) and booking commands (tracked reads).
/// </summary>
public interface IServiceResolutionService
{
    /// <summary>
    /// Resolves requested service items against the provider's catalog using untracked reads.
    /// Suitable for read-only operations like availability checks.
    /// </summary>
    Task<IReadOnlyList<ResolvedServiceItem>> ResolveAsync(
        Guid providerId,
        IReadOnlyList<ServiceItemRequest> requestedItems,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Resolves requested service items against the provider's catalog using tracked reads.
    /// Suitable for write operations like booking creation where entities will be mutated.
    /// </summary>
    Task<IReadOnlyList<ResolvedServiceItem>> ResolveForUpdateAsync(
        Guid providerId,
        IReadOnlyList<ServiceItemRequest> requestedItems,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns <c>true</c> if the category supports exactly one service item
    /// (e.g. EquipmentRental, Pharmacy).
    /// </summary>
    static bool IsSingleServiceCategory(string category)
    {
        return string.Equals(category, ServiceCategories.EquipmentRental, StringComparison.OrdinalIgnoreCase)
            || string.Equals(category, ServiceCategories.Pharmacy, StringComparison.OrdinalIgnoreCase);
    }
}

/// <summary>
/// A single requested service item (service ID + quantity).
/// </summary>
public sealed record ServiceItemRequest(Guid ServiceId, int Quantity);

/// <summary>
/// EF-backed service resolution implementation.
/// </summary>
public class ServiceResolutionService : IServiceResolutionService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly ILogger<ServiceResolutionService> _logger;

    public ServiceResolutionService(
        IServiceRepository serviceRepository,
        ILogger<ServiceResolutionService> logger)
    {
        _serviceRepository = serviceRepository ?? throw new ArgumentNullException(nameof(serviceRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ResolvedServiceItem>> ResolveAsync(
        Guid providerId,
        IReadOnlyList<ServiceItemRequest> requestedItems,
        CancellationToken cancellationToken = default)
    {
        return await ResolveInternalAsync(providerId, requestedItems, tracked: false, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<ResolvedServiceItem>> ResolveForUpdateAsync(
        Guid providerId,
        IReadOnlyList<ServiceItemRequest> requestedItems,
        CancellationToken cancellationToken = default)
    {
        return await ResolveInternalAsync(providerId, requestedItems, tracked: true, cancellationToken);
    }

    private async Task<IReadOnlyList<ResolvedServiceItem>> ResolveInternalAsync(
        Guid providerId,
        IReadOnlyList<ServiceItemRequest> requestedItems,
        bool tracked,
        CancellationToken cancellationToken)
    {
        if (requestedItems.Count == 0)
        {
            throw new InvalidOperationException("At least one service item is required.");
        }

        var serviceIds = requestedItems.Select(item => item.ServiceId).Distinct().ToList();

        var services = tracked
            ? await _serviceRepository.GetServicesByIdsForProviderForUpdateAsync(providerId, serviceIds, cancellationToken)
            : await _serviceRepository.GetServicesByIdsForProviderAsync(providerId, serviceIds, cancellationToken);

        var servicesById = services.ToDictionary(service => service.Id);
        var resolved = new List<ResolvedServiceItem>(requestedItems.Count);

        foreach (var requested in requestedItems)
        {
            if (!servicesById.TryGetValue(requested.ServiceId, out var service))
            {
                throw new KeyNotFoundException(
                    $"Service '{requested.ServiceId}' was not found, is inactive, or does not belong to provider '{providerId}'.");
            }

            if (tracked && !service.IsActive)
            {
                throw new InvalidOperationException($"Service '{service.Id}' is no longer active.");
            }

            resolved.Add(new ResolvedServiceItem(service, requested.Quantity));
        }

        var primaryCategory = resolved[0].Service.Category;
        if (resolved.Any(item => !string.Equals(item.Service.Category, primaryCategory, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("All selected services must belong to the same category.");
        }

        if (IServiceResolutionService.IsSingleServiceCategory(primaryCategory)
            && (resolved.Count != 1 || resolved[0].Quantity != 1))
        {
            throw new InvalidOperationException("This booking category supports exactly one selected service item.");
        }

        _logger.LogDebug(
            "Resolved {Count} service items for provider {ProviderId} in category {Category} (tracked={Tracked})",
            resolved.Count,
            providerId,
            primaryCategory,
            tracked);

        return resolved.AsReadOnly();
    }
}
