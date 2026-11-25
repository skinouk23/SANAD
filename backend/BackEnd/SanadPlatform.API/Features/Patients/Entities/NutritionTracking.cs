using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Nutrition tracking for patients (per meal).
/// </summary>
public class NutritionTracking : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }

    // ==================== Date ====================

    public DateOnly Date { get; set; }

    // ==================== Meal Information ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string MealType { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? FoodName { get; set; }

    // ==================== Nutritional Values ====================

    public int? Calories { get; set; }

    public decimal? ProteinG { get; set; }

    public decimal? CarbsG { get; set; }

    public decimal? FatG { get; set; }

    public decimal? FiberG { get; set; }

    public decimal? SugarG { get; set; }

    public decimal? SodiumMg { get; set; }

    // ==================== Notes & Photo ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Notes { get; set; }

    public string? PhotoUrl { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
