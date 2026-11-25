using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Vital signs tracking for patients.
/// </summary>
public class VitalSign : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    // ==================== Measurement Time ====================

    public DateTime MeasuredAt { get; set; }

    // ==================== Vital Measurements ====================

    public int? BloodPressureSystolic { get; set; }

    public int? BloodPressureDiastolic { get; set; }

    public int? HeartRate { get; set; }

    public decimal? TemperatureCelsius { get; set; }

    public int? OxygenSaturation { get; set; }

    public decimal? BloodGlucose { get; set; }

    public decimal? WeightKg { get; set; }

    // ==================== Context ====================

    public string? Notes { get; set; }

    public string? MeasuredBy { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
