using SanadPlatform.API.Features.Equipment.DTOs;

namespace SanadPlatform.API.Features.Equipment.Repository;

/// <summary>
/// Repository interface for equipment-related operations.
/// </summary>
public interface IEquipmentRepository
{
    /// <summary>
    /// Retrieves all active equipment categories.
    /// </summary>
    Task<IReadOnlyList<EquipmentCategoryResponse>> GetCategoriesAsync(CancellationToken ct);

    /// <summary>
    /// Retrieves a paginated list of equipment based on the provided specification.
    /// </summary>
    Task<EquipmentCatalogResponse> GetCatalogAsync(EquipmentCatalogSpecification spec, CancellationToken ct);

    /// <summary>
    /// Retrieves detailed information for a specific piece of equipment.
    /// </summary>
    Task<EquipmentDetailResponse?> GetByIdAsync(Guid id, CancellationToken ct);
}
