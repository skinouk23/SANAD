using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Providers.Configurations;

public class ProviderPreferencesConfiguration : IEntityTypeConfiguration<ProviderPreferences>
{
    public void Configure(EntityTypeBuilder<ProviderPreferences> builder)
    {
        builder.ToTable("provider_preferences");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
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

        // ==================== Privacy Settings ====================

        builder.Property(e => e.AllowPatientMessages)
            .HasColumnName("allow_patient_messages")
            .HasDefaultValue(true);

        builder.Property(e => e.ProfileVisibility)
            .HasColumnName("profile_visibility")
            .HasMaxLength(20)
            .HasDefaultValue("public")
            .IsRequired();

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

        builder.HasOne(e => e.Provider)
            .WithOne(e => e.Preferences)
            .HasForeignKey<ProviderPreferences>(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => e.ProviderId)
            .IsUnique();
    }
}
