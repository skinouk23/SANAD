using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Rewards.Entities;

namespace SanadPlatform.API.Features.Rewards.Configurations;

public class ReferralConfiguration : IEntityTypeConfiguration<Referral>
{
    public void Configure(EntityTypeBuilder<Referral> builder)
    {
        builder.ToTable("referrals");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ReferrerId)
            .HasColumnName("referrer_id")
            .IsRequired();

        builder.Property(e => e.ReferredUserId)
            .HasColumnName("referred_user_id");

        builder.Property(e => e.ReferralCode)
            .HasColumnName("referral_code")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("pending");

        builder.Property(e => e.ReferrerPoints)
            .HasColumnName("referrer_points")
            .HasDefaultValue(0);

        builder.Property(e => e.ReferredPoints)
            .HasColumnName("referred_points")
            .HasDefaultValue(0);

        builder.Property(e => e.ReferrerRewardedAt)
            .HasColumnName("referrer_rewarded_at");

        builder.Property(e => e.ReferredRewardedAt)
            .HasColumnName("referred_rewarded_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Referrer)
            .WithMany(p => p.Referrals)
            .HasForeignKey(e => e.ReferrerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ReferredUser)
            .WithMany()
            .HasForeignKey(e => e.ReferredUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
