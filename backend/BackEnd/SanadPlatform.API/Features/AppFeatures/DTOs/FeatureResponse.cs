namespace SanadPlatform.API.Features.AppFeatures.DTOs;

/// <summary>
/// Public app feature visibility contract returned to frontend clients.
/// </summary>
public record FeatureResponse
{
    public string Code { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public bool IsActive { get; init; }

    public int DisplayOrder { get; init; }
}
