using SanadPlatform.API.Features.Insurance.Entities;

namespace SanadPlatform.API.Features.Insurance.Repository;

/// <summary>
/// Repository interface for Insurance data access.
/// </summary>
public interface IInsuranceRepository
{
    /// <summary>
    /// Returns coverage sections with items for a provider.
    /// </summary>
    Task<IReadOnlyList<InsuranceCoverage>> GetCoverageAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns claims for a provider, optionally filtered by status.
    /// </summary>
    Task<IReadOnlyList<InsuranceClaim>> GetClaimsAsync(
        Guid providerId,
        string? status,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns insurance documents for a provider.
    /// </summary>
    Task<IReadOnlyList<InsuranceDocument>> GetDocumentsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the count of claims for a provider.
    /// </summary>
    Task<int> GetClaimsCountAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);
}
