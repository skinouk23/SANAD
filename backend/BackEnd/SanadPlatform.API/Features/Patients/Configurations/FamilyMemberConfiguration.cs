using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class FamilyMemberConfiguration : IEntityTypeConfiguration<FamilyMember>
{
    public void Configure(EntityTypeBuilder<FamilyMember> builder)
    {
        builder.ToTable("family_members");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // Properties
        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Relationship)
            .HasColumnName("relationship")
            .HasMaxLength(50)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.DateOfBirth)
            .HasColumnName("date_of_birth");

        builder.Property(e => e.Gender)
            .HasColumnName("gender")
            .HasMaxLength(20)
            .HasConversion<string>();

        builder.Property(e => e.Phone)
            .HasColumnName("phone")
            .HasMaxLength(30);

        builder.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(255);

        builder.Property(e => e.BloodType)
            .HasColumnName("blood_type")
            .HasMaxLength(10);

        builder.Property(e => e.MedicalConditions)
            .HasColumnName("medical_conditions");

        builder.Property(e => e.Allergies)
            .HasColumnName("allergies");

        builder.Property(e => e.CurrentMedications)
            .HasColumnName("current_medications");

        builder.Property(e => e.ProfilePictureUrl)
            .HasColumnName("profile_picture_url");

        builder.Property(e => e.CanBookFor)
            .HasColumnName("can_book_for")
            .HasDefaultValue(true);

        builder.Property(e => e.CanViewHistory)
            .HasColumnName("can_view_history")
            .HasDefaultValue(true);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(e => e.FamilyMembers)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => new { e.PatientId, e.FirstName, e.LastName, e.DateOfBirth })
            .IsUnique()
            .HasDatabaseName("idx_family_members_unique_profile");
    }
}
