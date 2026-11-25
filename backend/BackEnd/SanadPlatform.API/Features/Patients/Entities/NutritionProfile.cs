using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Nutrition profile for patients (goals and restrictions).
/// </summary>
public class NutritionProfile : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    // ==================== Physical Stats ====================

    public decimal? HeightCm { get; set; }

    public decimal? WeightKg { get; set; }

    public decimal? TargetWeightKg { get; set; }

    // ==================== Activity Level ====================

    public string? ActivityLevel { get; set; }

    // ==================== Goals ====================

    public string? Goal { get; set; }

    // ==================== Daily Targets ====================

    public int? DailyCalories { get; set; }

    public decimal? DailyProteinG { get; set; }

    public decimal? DailyCarbsG { get; set; }

    public decimal? DailyFatG { get; set; }

    public decimal? DailyFiberG { get; set; }

    public int DailyWaterMl { get; set; } = 2000;

    // ==================== Restrictions ====================

    public List<string> DietaryRestrictions { get; set; } = new();

    public List<string> FoodAllergies { get; set; } = new();

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
