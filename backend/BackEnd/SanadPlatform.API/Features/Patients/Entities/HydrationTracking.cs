using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Hydration tracking for patients (daily).
/// </summary>
public class HydrationTracking : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    // ==================== Date ====================

    public DateOnly Date { get; set; }

    // ==================== Hydration Metrics ====================

    public int WaterMl { get; set; } = 0;

    public int GoalMl { get; set; } = 2000;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
