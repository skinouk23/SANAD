using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Configurations;

public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.ToTable("user_sessions");

        // ==================== Primary Key ====================
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // ==================== Foreign Key ====================
        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        // ==================== Session Info ====================
        builder.Property(e => e.TokenHash)
            .HasColumnName("token_hash")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.RefreshTokenHash)
            .HasColumnName("refresh_token_hash")
            .HasMaxLength(255);

        // ==================== Device Info ====================
        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(45);

        builder.Property(e => e.UserAgent)
            .HasColumnName("user_agent");

        builder.Property(e => e.DeviceFingerprint)
            .HasColumnName("device_fingerprint")
            .HasMaxLength(255);

        builder.Property(e => e.DeviceType)
            .HasColumnName("device_type")
            .HasMaxLength(50);

        // ==================== Status ====================
        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.ExpiresAt)
            .HasColumnName("expires_at")
            .IsRequired();

        builder.Property(e => e.RevokedAt)
            .HasColumnName("revoked_at");

        // ==================== Timestamps ====================
        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // ==================== Indexes ====================

        // Speeds up "get all sessions for a user" queries (session list / revoke-all).
        builder.HasIndex(e => e.UserId)
            .HasDatabaseName("ix_user_sessions_user_id");

        // Partial index: only active sessions with a non-null refresh token hash.
        // Used by the refresh-token lookup (O(1) at token-rotation time).
        builder.HasIndex(e => e.RefreshTokenHash)
            .HasDatabaseName("ix_user_sessions_refresh_token_hash")
            .HasFilter("refresh_token_hash IS NOT NULL AND is_active = true");

        // Composite: supports "is there an active session for this user?" check
        // (used by the OnTokenValidated event in Program.cs).
        builder.HasIndex(e => new { e.UserId, e.IsActive })
            .HasDatabaseName("ix_user_sessions_user_id_is_active");

        // Composite: supports replacing active sessions from the same browser/device.
        builder.HasIndex(e => new { e.UserId, e.DeviceFingerprint, e.IsActive })
            .HasDatabaseName("ix_user_sessions_user_id_device_fingerprint_is_active");

        // ==================== Relationships ====================
        builder.HasOne(e => e.User)
            .WithMany(e => e.UserSessions)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
