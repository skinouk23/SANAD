using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("patients");

        // Primary Key
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // Properties
        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(e => e.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.DateOfBirth)
            .HasColumnName("date_of_birth");

        builder.Property(e => e.Gender)
            .HasColumnName("gender")
            .HasMaxLength(20)
            .HasConversion<string>();

        builder.Property(e => e.AddressLine1)
            .HasColumnName("address_line1");

        builder.Property(e => e.AddressLine2)
            .HasColumnName("address_line2");

        builder.Property(e => e.City)
            .HasColumnName("city")
            .HasMaxLength(100);

        builder.Property(e => e.StateProvince)
            .HasColumnName("state_province")
            .HasMaxLength(100);

        builder.Property(e => e.PostalCode)
            .HasColumnName("postal_code")
            .HasMaxLength(20);

        builder.Property(e => e.CountryCode)
            .HasColumnName("country_code")
            .HasMaxLength(2)
            .IsFixedLength()
            .HasDefaultValue("TN");

        builder.Property(e => e.Latitude)
            .HasColumnName("latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.Longitude)
            .HasColumnName("longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.EmergencyContactName)
            .HasColumnName("emergency_contact_name")
            .HasMaxLength(200);

        builder.Property(e => e.EmergencyContactPhone)
            .HasColumnName("emergency_contact_phone")
            .HasMaxLength(30);

        builder.Property(e => e.EmergencyContactRelationship)
            .HasColumnName("emergency_contact_relationship")
            .HasMaxLength(50);

        builder.Property(e => e.BloodType)
            .HasColumnName("blood_type")
            .HasMaxLength(10);

        builder.Property(e => e.MedicalConditions)
            .HasColumnName("medical_conditions");

        builder.Property(e => e.Allergies)
            .HasColumnName("allergies");

        builder.Property(e => e.CurrentMedications)
            .HasColumnName("current_medications");

        builder.Property(e => e.MedicalNotes)
            .HasColumnName("medical_notes");

        builder.Property(e => e.InsuranceProvider)
            .HasColumnName("insurance_provider")
            .HasMaxLength(200);

        builder.Property(e => e.InsurancePolicyNumber)
            .HasColumnName("insurance_policy_number")
            .HasMaxLength(100);

        builder.Property(e => e.InsuranceExpiryDate)
            .HasColumnName("insurance_expiry_date");

        builder.Property(e => e.AvatarFileId)
            .HasColumnName("avatar_file_id");

        builder.Property(e => e.Bio)
            .HasColumnName("bio");

        builder.Property(e => e.PreferredCommunication)
            .HasColumnName("preferred_communication")
            .HasMaxLength(20)
            .HasConversion<string>()
            .HasDefaultValue(CommunicationChannel.App);

        builder.Property(e => e.MarketingConsent)
            .HasColumnName("marketing_consent")
            .HasDefaultValue(false);

        builder.Property(e => e.DataSharingConsent)
            .HasColumnName("data_sharing_consent")
            .HasDefaultValue(false);

        builder.Property(e => e.TotalBookings)
            .HasColumnName("total_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.CompletedBookings)
            .HasColumnName("completed_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.CancelledBookings)
            .HasColumnName("cancelled_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.TotalSpent)
            .HasColumnName("total_spent")
            .HasPrecision(12, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.ProfileCompleted)
            .HasColumnName("profile_completed")
            .HasDefaultValue(false);

        builder.Property(e => e.OnboardingCompletedAt)
            .HasColumnName("onboarding_completed_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // Relationships
        builder.HasOne(e => e.User)
            .WithOne(e => e.Patient)
            .HasForeignKey<Patient>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.AvatarFile)
            .WithMany()
            .HasForeignKey(e => e.AvatarFileId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(e => e.UserId)
            .IsUnique()
            .HasDatabaseName("idx_patients_user_id");

        builder.HasIndex(e => e.City)
            .HasDatabaseName("idx_patients_city");

        builder.HasIndex(e => e.AvatarFileId)
            .HasDatabaseName("idx_patients_avatar_file_id");
    }
}
