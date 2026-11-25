using SanadPlatform.API.Features.Pharmacy.DTOs;

namespace SanadPlatform.API.Features.Pharmacy.Repository;

/// <summary>
/// Repository interface for pharmacy order operations.
/// </summary>
public interface IPharmacyOrderRepository
{
    /// <summary>
    /// Retrieves pharmacy orders for the given patient, optionally filtered by active/completed status.
    /// </summary>
    Task<IReadOnlyList<PharmacyOrderResponse>> GetPatientOrdersAsync(
        Guid patientId,
        string? filter,
        CancellationToken ct);

    /// <summary>
    /// Retrieves pharmacy order statistics for the given patient.
    /// </summary>
    Task<PharmacyOrderStatsResponse> GetPatientOrderStatsAsync(
        Guid patientId,
        CancellationToken ct);

    /// <summary>
    /// Retrieves pharmacy orders assigned to the given provider.
    /// </summary>
    Task<IReadOnlyList<ProviderPharmacyOrderResponse>> GetProviderOrdersAsync(
        Guid providerId,
        CancellationToken ct);

    /// <summary>
    /// Retrieves the prescription file ID for a provider-owned pharmacy order.
    /// </summary>
    Task<Guid?> GetProviderOrderPrescriptionFileIdAsync(
        Guid providerId,
        Guid orderId,
        CancellationToken ct);

    /// <summary>
    /// Determines whether a pharmacy order belongs to the given provider.
    /// </summary>
    Task<bool> ProviderOrderExistsAsync(
        Guid providerId,
        Guid orderId,
        CancellationToken ct);
}
