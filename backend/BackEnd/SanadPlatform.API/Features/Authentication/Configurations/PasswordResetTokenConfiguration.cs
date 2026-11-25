using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Configurations;

public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
{
    public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
    {
        builder.ToTable("password_reset_tokens");

        // ==================== Primary Key ====================
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        // ==================== Foreign Key ====================
        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        // ==================== Token ====================
        builder.Property(e => e.TokenHash)
            .HasColumnName("token_hash")
            .HasMaxLength(255)
            .IsRequired();

        // ==================== Status ====================
        builder.Property(e => e.ExpiresAt)
            .HasColumnName("expires_at")
            .IsRequired();

        builder.Property(e => e.UsedAt)
            .HasColumnName("used_at");

        // ==================== Timestamps ====================
        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ==================== Relationships ====================
        builder.HasOne(e => e.User)
            .WithMany(e => e.PasswordResetTokens)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
