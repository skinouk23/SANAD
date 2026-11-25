using SanadPlatform.API.Features.AppFeatures.DTOs;

namespace SanadPlatform.API.Features.AppFeatures.Repository;

/// <summary>
/// Repository interface for global app feature visibility reads.
/// </summary>
public interface IFeatureRepository
{
    /// <summary>
    /// Retrieves all app features ordered for display, including inactive rows.
    /// </summary>
    Task<IReadOnlyList<FeatureResponse>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns whether the app feature exists and is active.
    /// </summary>
    Task<bool> IsActiveAsync(string code, CancellationToken cancellationToken = default);
}
