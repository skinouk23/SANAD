using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Activity tracking for patients (daily).
/// </summary>
public class ActivityTracking : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    // ==================== Date ====================

    public DateOnly Date { get; set; }

    // ==================== Activity Metrics ====================

    public int Steps { get; set; } = 0;

    public decimal DistanceKm { get; set; } = 0.00m;

    public int CaloriesBurned { get; set; } = 0;

    public int ActiveMinutes { get; set; } = 0;

    public int FloorsClimbed { get; set; } = 0;

    // ==================== Source ====================

    public string? Source { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
