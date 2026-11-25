using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class NutritionProfileConfiguration : IEntityTypeConfiguration<NutritionProfile>
{
    public void Configure(EntityTypeBuilder<NutritionProfile> builder)
    {
        builder.ToTable("nutrition_profiles");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // Properties
        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.HeightCm)
            .HasColumnName("height_cm")
            .HasPrecision(5, 2);

        builder.Property(e => e.WeightKg)
            .HasColumnName("weight_kg")
            .HasPrecision(5, 2);

        builder.Property(e => e.TargetWeightKg)
            .HasColumnName("target_weight_kg")
            .HasPrecision(5, 2);

        builder.Property(e => e.ActivityLevel)
            .HasColumnName("activity_level")
            .HasMaxLength(20);

        builder.Property(e => e.Goal)
            .HasColumnName("goal")
            .HasMaxLength(30);

        builder.Property(e => e.DailyCalories)
            .HasColumnName("daily_calories");

        builder.Property(e => e.DailyProteinG)
            .HasColumnName("daily_protein_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.DailyCarbsG)
            .HasColumnName("daily_carbs_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.DailyFatG)
            .HasColumnName("daily_fat_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.DailyFiberG)
            .HasColumnName("daily_fiber_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.DailyWaterMl)
            .HasColumnName("daily_water_ml")
            .HasDefaultValue(2000);

        builder.Property(e => e.DietaryRestrictions)
            .HasColumnName("dietary_restrictions")
            .HasColumnType("text[]");

        builder.Property(e => e.FoodAllergies)
            .HasColumnName("food_allergies")
            .HasColumnType("text[]");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithOne(e => e.NutritionProfile)
            .HasForeignKey<NutritionProfile>(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => e.PatientId)
            .IsUnique();
    }
}
