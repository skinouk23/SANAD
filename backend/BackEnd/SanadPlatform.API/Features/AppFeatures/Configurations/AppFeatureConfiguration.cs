using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.AppFeatures.Entities;

namespace SanadPlatform.API.Features.AppFeatures.Configurations;

/// <summary>
/// EF Core mapping for global app feature visibility rows.
/// </summary>
public class AppFeatureConfiguration : IEntityTypeConfiguration<AppFeature>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<AppFeature> builder)
    {
        builder.ToTable("features");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .HasMaxLength(80)
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(160)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(false);

        builder.Property(e => e.DisplayOrder)
            .HasColumnName("display_order")
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasIndex(e => e.Code)
            .IsUnique();

        builder.HasIndex(e => e.IsActive);
    }
}
