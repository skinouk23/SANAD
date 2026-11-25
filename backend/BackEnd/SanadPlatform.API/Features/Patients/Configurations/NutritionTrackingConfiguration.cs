using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class NutritionTrackingConfiguration : IEntityTypeConfiguration<NutritionTracking>
{
    public void Configure(EntityTypeBuilder<NutritionTracking> builder)
    {
        builder.ToTable("nutrition_tracking");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // Properties
        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.Date)
            .HasColumnName("date")
            .IsRequired();

        builder.Property(e => e.MealType)
            .HasColumnName("meal_type")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.FoodName)
            .HasColumnName("food_name")
            .HasMaxLength(200);

        builder.Property(e => e.Calories)
            .HasColumnName("calories");

        builder.Property(e => e.ProteinG)
            .HasColumnName("protein_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.CarbsG)
            .HasColumnName("carbs_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.FatG)
            .HasColumnName("fat_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.FiberG)
            .HasColumnName("fiber_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.SugarG)
            .HasColumnName("sugar_g")
            .HasPrecision(10, 2);

        builder.Property(e => e.SodiumMg)
            .HasColumnName("sodium_mg")
            .HasPrecision(10, 2);

        builder.Property(e => e.Notes)
            .HasColumnName("notes");

        builder.Property(e => e.PhotoUrl)
            .HasColumnName("photo_url");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(e => e.NutritionTrackings)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
