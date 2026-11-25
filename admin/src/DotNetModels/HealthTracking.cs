using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    // ============================================
    // HEALTH TRACKING MODELS
    // ============================================

    [Table("activity_tracking")]
    public class ActivityTracking
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("date")]
        public DateTime Date { get; set; }

        [Column("steps")]
        public int Steps { get; set; } = 0;

        [Column("distance", TypeName = "decimal(10,2)")]
        public decimal Distance { get; set; } = 0.00m;

        [Column("calories_burned")]
        public int CaloriesBurned { get; set; } = 0;

        [Column("active_minutes")]
        public int ActiveMinutes { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }

    [Table("hydration_tracking")]
    public class HydrationTracking
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("date")]
        public DateTime Date { get; set; }

        [Column("water_intake")]
        public int WaterIntake { get; set; } = 0;

        [Column("goal")]
        public int Goal { get; set; } = 2000;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }

    [Table("nutrition_tracking")]
    public class NutritionTracking
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("date")]
        public DateTime Date { get; set; }

        [MaxLength(50)]
        [Column("meal_type")]
        public MealType? MealType { get; set; }

        [MaxLength(200)]
        [Column("food_name")]
        public string FoodName { get; set; }

        [Column("calories")]
        public int? Calories { get; set; }

        [Column("protein", TypeName = "decimal(10,2)")]
        public decimal? Protein { get; set; }

        [Column("carbs", TypeName = "decimal(10,2)")]
        public decimal? Carbs { get; set; }

        [Column("fat", TypeName = "decimal(10,2)")]
        public decimal? Fat { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }

    [Table("nutrition_profiles")]
    public class NutritionProfile
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Column("height", TypeName = "decimal(5,2)")]
        public decimal? Height { get; set; }

        [Column("weight", TypeName = "decimal(5,2)")]
        public decimal? Weight { get; set; }

        [Column("age")]
        public int? Age { get; set; }

        [MaxLength(20)]
        [Column("gender")]
        public string Gender { get; set; }

        [MaxLength(50)]
        [Column("activity_level")]
        public ActivityLevel? ActivityLevel { get; set; }

        [MaxLength(50)]
        [Column("goal")]
        public NutritionGoal? Goal { get; set; }

        [Column("daily_calorie_goal")]
        public int? DailyCalorieGoal { get; set; }

        [Column("daily_protein_goal", TypeName = "decimal(10,2)")]
        public decimal? DailyProteinGoal { get; set; }

        [Column("daily_carbs_goal", TypeName = "decimal(10,2)")]
        public decimal? DailyCarbsGoal { get; set; }

        [Column("daily_fat_goal", TypeName = "decimal(10,2)")]
        public decimal? DailyFatGoal { get; set; }

        [Column("dietary_restrictions")]
        public string DietaryRestrictions { get; set; }

        [Column("allergies")]
        public string Allergies { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }

    public enum MealType
    {
        Breakfast,
        Lunch,
        Dinner,
        Snack
    }

    public enum ActivityLevel
    {
        Sedentary,
        Light,
        Moderate,
        Active,
        VeryActive
    }

    public enum NutritionGoal
    {
        LoseWeight,
        Maintain,
        GainWeight,
        BuildMuscle
    }
}
