using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Services.DTOs;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Repository;

/// <summary>
/// Repository interface for Service entity operations.
/// Write methods stage changes in the EF change tracker only.
/// Callers must invoke IUnitOfWork.SaveChangesAsync to persist.
/// </summary>
public interface IServiceRepository
{
    // ==================== Read (untracked) ====================

    /// <summary>
    /// Gets a service by ID without tracking, including its addons.
    /// </summary>
    Task<Service?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a service by ID without tracking, including its addons,
    /// and also verifying that it belongs to the specified provider.
    /// </summary>
    Task<Service?> GetByIdAndProviderAsync(Guid id, Guid providerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a paginated, specification-driven page of service summaries for the provider,
    /// projected at the database level for optimal performance.
    /// </summary>
    Task<(IReadOnlyList<ServiceSummaryResponse> Items, int Total)> GetPagedSummaryAsync(
        ISpecification<Service> spec,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Batch-loads active services by their IDs for a given provider.
    /// Used by the booking handler to validate sub-service selections.
    /// </summary>
    Task<IReadOnlyList<Service>> GetServicesByIdsForProviderAsync(
        Guid providerId,
        IEnumerable<Guid> serviceIds,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Batch-loads active services by their IDs for a given provider with EF tracking enabled.
    /// Used by booking flows that need to mutate service aggregates such as BookingCount or stock.
    /// </summary>
    Task<IReadOnlyList<Service>> GetServicesByIdsForProviderForUpdateAsync(
        Guid providerId,
        IEnumerable<Guid> serviceIds,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Checks whether a service with the given name already exists for the provider.
    /// Optionally excludes a specific service ID (for updates).
    /// </summary>
    Task<bool> ExistsByNameAsync(
        Guid providerId,
        string name,
        Guid? excludeServiceId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns aggregate statistics for the provider's services.
    /// </summary>
    Task<(int Total, int Active, int Inactive, int TotalBookings)> GetStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    // ==================== Read (tracked — for updates) ====================

    /// <summary>
    /// Gets a service by ID with tracking (for updates), including its addons.
    /// </summary>
    Task<Service?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a service by ID and provider ID with tracking (for updates), including its addons.
    /// </summary>
    Task<Service?> GetByIdAndProviderForUpdateAsync(Guid id, Guid providerId, CancellationToken cancellationToken = default);

    // ==================== Write ====================

    /// <summary>
    /// Stages a new service in the EF change tracker.
    /// </summary>
    Task<Service> CreateAsync(Service service, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages an existing tracked service for update.
    /// The entity must have been loaded via a tracked read method.
    /// </summary>
    Task<Service> UpdateAsync(Service service, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a service for soft-deletion by marking it in the EF change tracker.
    /// Because Service implements ISoftDeletable, the AuditableEntityInterceptor
    /// automatically converts the EF Deleted state to Modified and sets DeletedAt.
    /// </summary>
    Task<bool> DeleteAsync(Guid id, Guid providerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages a tracked service entity for soft-deletion.
    /// The entity must have been loaded with tracking (via a ForUpdate method).
    /// Because Service implements ISoftDeletable, the AuditableEntityInterceptor
    /// automatically converts the EF Deleted state to Modified and sets DeletedAt.
    /// </summary>
    void Remove(Service service);

    /// <summary>
    /// Removes addon entities from the EF change tracker (stages for deletion).
    /// </summary>
    void RemoveAddons(IEnumerable<ServiceAddon> addons);

    /// <summary>
    /// Recomputes MinPrice and MaxPrice on the <see cref="ServiceCategoryConfig"/> for the given
    /// category code by aggregating prices across all active services in that category.
    /// The entity is loaded tracked so changes are persisted by the caller's SaveChangesAsync.
    /// </summary>
    Task RecalculateCategoryPricesAsync(string categoryCode, CancellationToken cancellationToken = default);

    // ==================== Patient-Facing Catalog (read-only) ====================

    /// <summary>
    /// Retrieves all active service categories, ordered by DisplayOrder.
    /// </summary>
    Task<IReadOnlyList<ServiceCategoryConfig>> GetCategoriesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves category codes that belong to the specified <see cref="DisplayGroup"/>.
    /// Used by the catalog query to resolve display-group filtering.
    /// </summary>
    Task<IReadOnlyList<string>> GetCategoryCodesByDisplayGroupAsync(
        DisplayGroup displayGroup,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a paginated, patient-facing service catalog driven by a specification.
    /// </summary>
    Task<PatientServiceCatalogResponse> GetCatalogAsync(
        ISpecification<Service> spec,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves patient-facing detail for a single service, or null if not found.
    /// </summary>
    Task<PatientServiceDetailResponse?> GetServiceDetailAsync(
        Guid serviceId,
        CancellationToken cancellationToken = default);

}
