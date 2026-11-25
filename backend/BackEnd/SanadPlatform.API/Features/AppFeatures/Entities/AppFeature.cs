using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.AppFeatures.Entities;

/// <summary>
/// Represents a global app feature whose active state controls frontend visibility.
/// </summary>
public class AppFeature : IHasCreatedAt
{
    public Guid Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsActive { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
