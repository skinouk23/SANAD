using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Notifications.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Notifications.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(e => e.Type)
            .HasColumnName("type")
            .IsRequired();

        builder.Property(e => e.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Message)
            .HasColumnName("message")
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id");

        builder.Property(e => e.ActionUrl)
            .HasColumnName("action_url");

        builder.Property(e => e.ActionData)
            .HasColumnName("action_data")
            .HasColumnType("jsonb");

        builder.Property(e => e.IsRead)
            .HasColumnName("is_read")
            .HasDefaultValue(false);

        builder.Property(e => e.ReadAt)
            .HasColumnName("read_at");

        builder.Property(e => e.SentViaPush)
            .HasColumnName("sent_via_push")
            .HasDefaultValue(false);

        builder.Property(e => e.SentViaEmail)
            .HasColumnName("sent_via_email")
            .HasDefaultValue(false);

        builder.Property(e => e.SentViaSms)
            .HasColumnName("sent_via_sms")
            .HasDefaultValue(false);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Booking>()
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Provider>()
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("idx_notifications_user");

        builder.HasIndex(e => new { e.UserId, e.IsRead })
            .HasDatabaseName("idx_notifications_unread")
            .HasFilter("is_read = FALSE");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_notifications_created")
            .IsDescending();
    }
}
