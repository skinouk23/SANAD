using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class ActivityTrackingConfiguration : IEntityTypeConfiguration<ActivityTracking>
{
    public void Configure(EntityTypeBuilder<ActivityTracking> builder)
    {
        builder.ToTable("activity_tracking");

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

        builder.Property(e => e.Steps)
            .HasColumnName("steps")
            .HasDefaultValue(0);

        builder.Property(e => e.DistanceKm)
            .HasColumnName("distance_km")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.CaloriesBurned)
            .HasColumnName("calories_burned")
            .HasDefaultValue(0);

        builder.Property(e => e.ActiveMinutes)
            .HasColumnName("active_minutes")
            .HasDefaultValue(0);

        builder.Property(e => e.FloorsClimbed)
            .HasColumnName("floors_climbed")
            .HasDefaultValue(0);

        builder.Property(e => e.Source)
            .HasColumnName("source")
            .HasMaxLength(50);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(e => e.ActivityTrackings)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => new { e.PatientId, e.Date })
            .IsUnique();
    }
}
