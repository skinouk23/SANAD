using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Notifications.Entities;

namespace SanadPlatform.API.Features.Notifications.Configurations;

public class WebPushSubscriptionConfiguration : IEntityTypeConfiguration<WebPushSubscription>
{
    public void Configure(EntityTypeBuilder<WebPushSubscription> builder)
    {
        builder.ToTable("web_push_subscriptions");

        builder.HasKey(subscription => subscription.Id);

        builder.Property(subscription => subscription.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(subscription => subscription.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(subscription => subscription.Endpoint)
            .HasColumnName("endpoint")
            .HasMaxLength(2048)
            .IsRequired();

        builder.Property(subscription => subscription.P256dh)
            .HasColumnName("p256dh")
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(subscription => subscription.Auth)
            .HasColumnName("auth")
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(subscription => subscription.ExpirationTime)
            .HasColumnName("expiration_time");

        builder.Property(subscription => subscription.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(512);

        builder.Property(subscription => subscription.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(subscription => subscription.LastUsedAt)
            .HasColumnName("last_used_at");

        builder.Property(subscription => subscription.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(subscription => subscription.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(subscription => subscription.User)
            .WithMany()
            .HasForeignKey(subscription => subscription.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(subscription => new { subscription.UserId, subscription.Endpoint })
            .IsUnique();

        builder.HasIndex(subscription => new { subscription.UserId, subscription.IsActive });
    }
}
