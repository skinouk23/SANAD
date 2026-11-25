using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Configurations;

public class ServiceCategoryConfigConfiguration : IEntityTypeConfiguration<ServiceCategoryConfig>
{
    public void Configure(EntityTypeBuilder<ServiceCategoryConfig> builder)
    {
        builder.ToTable("service_categories_config");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .IsRequired();

        builder.Property(e => e.NameEn)
            .HasColumnName("name_en")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.NameFr)
            .HasColumnName("name_fr")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.NameAr)
            .HasColumnName("name_ar")
            .HasMaxLength(100);

        builder.Property(e => e.NameDe)
            .HasColumnName("name_de")
            .HasMaxLength(100);

        builder.Property(e => e.DescriptionEn)
            .HasColumnName("description_en");

        builder.Property(e => e.DescriptionFr)
            .HasColumnName("description_fr");

        builder.Property(e => e.DescriptionAr)
            .HasColumnName("description_ar")
            .HasMaxLength(500);

        builder.Property(e => e.DescriptionDe)
            .HasColumnName("description_de")
            .HasMaxLength(500);

        builder.Property(e => e.Icon)
            .HasColumnName("icon")
            .HasMaxLength(50);

        builder.Property(e => e.DisplayGroup)
            .HasColumnName("display_group")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Color)
            .HasColumnName("color")
            .HasMaxLength(20);

        builder.Property(e => e.Badge)
            .HasColumnName("badge")
            .HasMaxLength(50);

        builder.Property(e => e.DefaultCommissionRate)
            .HasColumnName("default_commission_rate")
            .HasPrecision(5, 2)
            .HasDefaultValue(15.00m);

        builder.Property(e => e.MinPrice)
            .HasColumnName("min_price")
            .HasPrecision(10, 2);

        builder.Property(e => e.MaxPrice)
            .HasColumnName("max_price")
            .HasPrecision(10, 2);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.DisplayOrder)
            .HasColumnName("display_order")
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(e => e.Code)
            .IsUnique();

        builder.HasIndex(e => e.DisplayGroup);
    }
}
