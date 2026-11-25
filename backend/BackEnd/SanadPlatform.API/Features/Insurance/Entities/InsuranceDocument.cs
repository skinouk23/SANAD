using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Insurance.Entities;

/// <summary>
/// Represents an insurance-related document for a provider.
/// </summary>
public class InsuranceDocument : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid ProviderId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Size { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    public string? Url { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
}
