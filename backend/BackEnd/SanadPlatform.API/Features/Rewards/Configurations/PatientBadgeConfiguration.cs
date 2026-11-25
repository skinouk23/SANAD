using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Rewards.Entities;

namespace SanadPlatform.API.Features.Rewards.Configurations;

public class PatientBadgeConfiguration : IEntityTypeConfiguration<PatientBadge>
{
    public void Configure(EntityTypeBuilder<PatientBadge> builder)
    {
        builder.ToTable("patient_badges");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.BadgeId)
            .HasColumnName("badge_id")
            .IsRequired();

        builder.Property(e => e.EarnedAt)
            .HasColumnName("earned_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Patient)
            .WithMany(p => p.Badges)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Badge)
            .WithMany(b => b.PatientBadges)
            .HasForeignKey(e => e.BadgeId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => new { e.PatientId, e.BadgeId })
            .IsUnique();
    }
}
