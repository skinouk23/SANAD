using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Rewards.Entities;

/// <summary>
/// Represents a badge that can be earned by patients.
/// Stores badge metadata, requirements, and point rewards.
/// </summary>
public class Badge : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== Badge Info ====================

    [SearchableEncrypted(Classification = DataClassification.Internal)]
    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    // ==================== Display Properties ====================

    public string? IconUrl { get; set; }

    public string? Color { get; set; }

    // ==================== Requirements ====================

    public string? RequirementType { get; set; }

    public int? RequirementValue { get; set; }

    // ==================== Rewards ====================

    public int PointsAwarded { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual ICollection<PatientBadge> PatientBadges { get; set; } = new List<PatientBadge>();
}
