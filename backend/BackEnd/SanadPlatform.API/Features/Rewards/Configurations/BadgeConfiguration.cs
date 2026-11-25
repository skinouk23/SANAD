using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Rewards.Entities;

namespace SanadPlatform.API.Features.Rewards.Configurations;

public class BadgeConfiguration : IEntityTypeConfiguration<Badge>
{
    public void Configure(EntityTypeBuilder<Badge> builder)
    {
        builder.ToTable("badges");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.IconUrl)
            .HasColumnName("icon_url");

        builder.Property(e => e.Color)
            .HasColumnName("color")
            .HasMaxLength(20);

        builder.Property(e => e.RequirementType)
            .HasColumnName("requirement_type")
            .HasMaxLength(50);

        builder.Property(e => e.RequirementValue)
            .HasColumnName("requirement_value");

        builder.Property(e => e.PointsAwarded)
            .HasColumnName("points_awarded")
            .HasDefaultValue(0);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(e => e.Code)
            .IsUnique();
    }
}
