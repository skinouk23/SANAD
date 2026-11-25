using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        // ==================== Primary Key ====================
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // ==================== Authentication ====================
        builder.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.EmailVerified)
            .HasColumnName("email_verified")
            .HasDefaultValue(false);

        builder.Property(e => e.EmailVerifiedAt)
            .HasColumnName("email_verified_at");

        builder.Property(e => e.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(255)
            .IsRequired();

        // ==================== Role & Status ====================
        builder.Property(e => e.Role)
            .HasColumnName("role")
            .IsRequired()
            .HasDefaultValue("patient");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.IsSuspended)
            .HasColumnName("is_suspended")
            .HasDefaultValue(false);

        builder.Property(e => e.SuspendedAt)
            .HasColumnName("suspended_at");

        builder.Property(e => e.SuspendedReason)
            .HasColumnName("suspended_reason");

        // ==================== Contact ====================
        builder.Property(e => e.Phone)
            .HasColumnName("phone")
            .HasMaxLength(30);

        builder.Property(e => e.PhoneVerified)
            .HasColumnName("phone_verified")
            .HasDefaultValue(false);

        builder.Property(e => e.PhoneVerifiedAt)
            .HasColumnName("phone_verified_at");

        // ==================== Security ====================
        builder.Property(e => e.TwoFactorEnabled)
            .HasColumnName("two_factor_enabled")
            .HasDefaultValue(false);

        builder.Property(e => e.TwoFactorSecret)
            .HasColumnName("two_factor_secret")
            .HasMaxLength(100);

        builder.Property(e => e.FailedLoginAttempts)
            .HasColumnName("failed_login_attempts")
            .HasDefaultValue(0);

        builder.Property(e => e.LockedUntil)
            .HasColumnName("locked_until");

        builder.Property(e => e.PasswordChangedAt)
            .HasColumnName("password_changed_at");

        // ==================== Profile Settings ====================
        builder.Property(e => e.PreferredLanguage)
            .HasColumnName("preferred_language")
            .HasMaxLength(10)
            .HasDefaultValue("fr");

        builder.Property(e => e.Timezone)
            .HasColumnName("timezone")
            .HasMaxLength(50)
            .HasDefaultValue("Europe/Paris");

        // ==================== Metadata ====================
        builder.Property(e => e.LastLoginAt)
            .HasColumnName("last_login_at");

        builder.Property(e => e.LastLoginIp)
            .HasColumnName("last_login_ip")
            .HasMaxLength(45);

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

        // ==================== Indexes ====================
        // Partial unique index on email where not soft-deleted
        builder.HasIndex(e => e.Email)
            .IsUnique()
            .HasDatabaseName("idx_users_email")
            .HasFilter("deleted_at IS NULL");

        builder.HasIndex(e => e.Role)
            .HasDatabaseName("idx_users_role");

        builder.HasIndex(e => e.Phone)
            .HasDatabaseName("idx_users_phone");

    }
}
