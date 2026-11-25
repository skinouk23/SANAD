using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class VitalSignConfiguration : IEntityTypeConfiguration<VitalSign>
{
    public void Configure(EntityTypeBuilder<VitalSign> builder)
    {
        builder.ToTable("vital_signs");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // Properties
        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.MeasuredAt)
            .HasColumnName("measured_at")
            .IsRequired();

        builder.Property(e => e.BloodPressureSystolic)
            .HasColumnName("blood_pressure_systolic");

        builder.Property(e => e.BloodPressureDiastolic)
            .HasColumnName("blood_pressure_diastolic");

        builder.Property(e => e.HeartRate)
            .HasColumnName("heart_rate");

        builder.Property(e => e.TemperatureCelsius)
            .HasColumnName("temperature_celsius")
            .HasPrecision(4, 2);

        builder.Property(e => e.OxygenSaturation)
            .HasColumnName("oxygen_saturation");

        builder.Property(e => e.BloodGlucose)
            .HasColumnName("blood_glucose")
            .HasPrecision(5, 2);

        builder.Property(e => e.WeightKg)
            .HasColumnName("weight_kg")
            .HasPrecision(5, 2);

        builder.Property(e => e.Notes)
            .HasColumnName("notes");

        builder.Property(e => e.MeasuredBy)
            .HasColumnName("measured_by")
            .HasMaxLength(50);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(e => e.VitalSigns)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
