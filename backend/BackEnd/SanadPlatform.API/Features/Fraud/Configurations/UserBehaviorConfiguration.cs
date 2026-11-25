using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Fraud.Entities;

namespace SanadPlatform.API.Features.Fraud.Configurations;

public class UserBehaviorConfiguration : IEntityTypeConfiguration<UserBehavior>
{
    public void Configure(EntityTypeBuilder<UserBehavior> builder)
    {
        builder.ToTable("user_behavior");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.UserId)
            .HasColumnName("user_id");

        builder.Property(e => e.SessionId)
            .HasColumnName("session_id")
            .HasMaxLength(100);

        builder.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(e => e.UserAgent)
            .HasColumnName("user_agent");

        builder.Property(e => e.DeviceFingerprint)
            .HasColumnName("device_fingerprint")
            .HasMaxLength(255);

        builder.Property(e => e.CountryCode)
            .HasColumnName("country_code")
            .HasMaxLength(2)
            .IsFixedLength();

        builder.Property(e => e.City)
            .HasColumnName("city")
            .HasMaxLength(100);

        builder.Property(e => e.Metadata)
            .HasColumnName("metadata")
            .HasColumnType("jsonb");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("idx_user_behavior_user");

        builder.HasIndex(e => e.IpAddress)
            .HasDatabaseName("idx_user_behavior_ip");

        builder.HasIndex(e => e.DeviceFingerprint)
            .HasDatabaseName("idx_user_behavior_device");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_user_behavior_created")
            .IsDescending();
    }
}
