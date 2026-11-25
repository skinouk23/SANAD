using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Rewards.Entities;

/// <summary>
/// Represents patient rewards summary and progress.
/// Tracks points, streaks, levels, and achievement statistics.
/// </summary>
public class PatientRewards : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    // ==================== Points ====================

    public int TotalPoints { get; set; }

    public int AvailablePoints { get; set; }

    public int RedeemedPoints { get; set; }

    // ==================== Streaks ====================

    public int CurrentStreak { get; set; }

    public int LongestStreak { get; set; }

    public DateOnly? LastActivityDate { get; set; }

    // ==================== Level & Status ====================

    public int Level { get; set; } = 1;

    public string LevelName { get; set; } = "Bronze";

    // ==================== Statistics ====================

    public int TotalBookings { get; set; }

    public int TotalReviews { get; set; }

    public int TotalReferrals { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
