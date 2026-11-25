using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Insurance.Entities;

/// <summary>
/// Represents an insurance coverage section with items.
/// </summary>
public class InsuranceCoverage : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid ProviderId { get; set; }

    public string Category { get; set; } = string.Empty;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;

    public virtual ICollection<InsuranceCoverageItem> Items { get; set; } = new List<InsuranceCoverageItem>();
}
