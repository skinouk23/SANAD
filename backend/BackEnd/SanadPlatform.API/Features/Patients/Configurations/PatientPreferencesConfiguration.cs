using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;

namespace SanadPlatform.API.Features.Patients.Configurations;

public class PatientPreferencesConfiguration : IEntityTypeConfiguration<PatientPreferences>
{
    public void Configure(EntityTypeBuilder<PatientPreferences> builder)
    {
        builder.ToTable("patient_preferences");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        // ==================== Notification Toggles ====================

        builder.Property(e => e.EmailNotifications)
            .HasColumnName("email_notifications")
            .HasDefaultValue(true);

        builder.Property(e => e.SmsNotifications)
            .HasColumnName("sms_notifications")
            .HasDefaultValue(true);

        builder.Property(e => e.PushNotifications)
            .HasColumnName("push_notifications")
            .HasDefaultValue(true);

        builder.Property(e => e.MarketingEmails)
            .HasColumnName("marketing_emails")
            .HasDefaultValue(false);

        // ==================== Booking Behavior ====================

        builder.Property(e => e.AutoValidationEnabled)
            .HasColumnName("auto_validation_enabled")
            .HasDefaultValue(false);

        builder.Property(e => e.ValidationReminderHours)
            .HasColumnName("validation_reminder_hours")
            .HasDefaultValue(24);

        // ==================== Privacy Settings ====================

        builder.Property(e => e.ShareWithFamily)
            .HasColumnName("share_with_family")
            .HasDefaultValue(true);

        builder.Property(e => e.AllowProviderMessages)
            .HasColumnName("allow_provider_messages")
            .HasDefaultValue(true);

        // ==================== Metadata ====================

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // ==================== Relationships ====================

        // One-to-One relationship with Patient
        builder.HasOne(e => e.Patient)
            .WithOne(e => e.Preferences)
            .HasForeignKey<PatientPreferences>(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes for performance
        builder.HasIndex(e => e.PatientId).IsUnique();
    }
}
