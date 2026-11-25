using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Configurations;

public class LoginOtpChallengeConfiguration : IEntityTypeConfiguration<LoginOtpChallenge>
{
    public void Configure(EntityTypeBuilder<LoginOtpChallenge> builder)
    {
        builder.ToTable("login_otp_challenges");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(e => e.Channel)
            .HasColumnName("channel")
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(e => e.DestinationHash)
            .HasColumnName("destination_hash")
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(e => e.CodeHash)
            .HasColumnName("code_hash")
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(e => e.ExpiresAt)
            .HasColumnName("expires_at")
            .IsRequired();

        builder.Property(e => e.ConsumedAt)
            .HasColumnName("consumed_at");

        builder.Property(e => e.FailedAttempts)
            .HasColumnName("failed_attempts")
            .HasDefaultValue(0);

        builder.Property(e => e.LastSentAt)
            .HasColumnName("last_sent_at")
            .IsRequired();

        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(e => e.UserAgent)
            .HasColumnName("user_agent");

        builder.Property(e => e.DeviceFingerprint)
            .HasColumnName("device_fingerprint")
            .HasMaxLength(255);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("ix_login_otp_challenges_user_id");

        builder.HasIndex(e => e.ExpiresAt)
            .HasDatabaseName("ix_login_otp_challenges_expires_at");

        builder.HasIndex(e => new { e.Id, e.ConsumedAt, e.ExpiresAt })
            .HasDatabaseName("ix_login_otp_challenges_active_lookup");

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
