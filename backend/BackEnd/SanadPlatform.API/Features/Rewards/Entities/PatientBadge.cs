using System;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Rewards.Entities;

/// <summary>
/// Represents a badge earned by a patient.
/// Tracks which patient earned which badge and when.
/// </summary>
public class PatientBadge
{
    public Guid Id { get; set; }

    // ==================== Foreign Keys ====================

    public Guid PatientId { get; set; }

    public Guid BadgeId { get; set; }

    // ==================== Timestamps ====================

    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;

    public virtual Badge Badge { get; set; } = null!;
}
