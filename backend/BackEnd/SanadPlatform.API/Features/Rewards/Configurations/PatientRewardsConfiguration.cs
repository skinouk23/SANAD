using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Rewards.Entities;

namespace SanadPlatform.API.Features.Rewards.Configurations;

public class PatientRewardsConfiguration : IEntityTypeConfiguration<PatientRewards>
{
    public void Configure(EntityTypeBuilder<PatientRewards> builder)
    {
        builder.ToTable("patient_rewards");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.TotalPoints)
            .HasColumnName("total_points")
            .HasDefaultValue(0);

        builder.Property(e => e.AvailablePoints)
            .HasColumnName("available_points")
            .HasDefaultValue(0);

        builder.Property(e => e.RedeemedPoints)
            .HasColumnName("redeemed_points")
            .HasDefaultValue(0);

        builder.Property(e => e.CurrentStreak)
            .HasColumnName("current_streak")
            .HasDefaultValue(0);

        builder.Property(e => e.LongestStreak)
            .HasColumnName("longest_streak")
            .HasDefaultValue(0);

        builder.Property(e => e.LastActivityDate)
            .HasColumnName("last_activity_date");

        builder.Property(e => e.Level)
            .HasColumnName("level")
            .HasDefaultValue(1);

        builder.Property(e => e.LevelName)
            .HasColumnName("level_name")
            .HasMaxLength(50)
            .HasDefaultValue("Bronze");

        builder.Property(e => e.TotalBookings)
            .HasColumnName("total_bookings")
            .HasDefaultValue(0);

        builder.Property(e => e.TotalReviews)
            .HasColumnName("total_reviews")
            .HasDefaultValue(0);

        builder.Property(e => e.TotalReferrals)
            .HasColumnName("total_referrals")
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithOne(p => p.Rewards)
            .HasForeignKey<PatientRewards>(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => e.PatientId)
            .IsUnique();
    }
}
