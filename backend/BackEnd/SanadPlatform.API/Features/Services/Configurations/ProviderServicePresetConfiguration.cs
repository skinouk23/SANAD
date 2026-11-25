using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Configurations;

public class ProviderServicePresetConfiguration : IEntityTypeConfiguration<ProviderServicePreset>
{
    public void Configure(EntityTypeBuilder<ProviderServicePreset> builder)
    {
        builder.ToTable("provider_service_presets");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderCategory)
            .HasColumnName("provider_category")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.NameEn)
            .HasColumnName("name_en")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.NameFr)
            .HasColumnName("name_fr")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.NameAr)
            .HasColumnName("name_ar")
            .HasMaxLength(200);

        builder.Property(e => e.NameDe)
            .HasColumnName("name_de")
            .HasMaxLength(200);

        builder.Property(e => e.DescriptionEn)
            .HasColumnName("description_en")
            .HasMaxLength(1000);

        builder.Property(e => e.DescriptionFr)
            .HasColumnName("description_fr")
            .HasMaxLength(1000);

        builder.Property(e => e.DescriptionAr)
            .HasColumnName("description_ar")
            .HasMaxLength(1000);

        builder.Property(e => e.DescriptionDe)
            .HasColumnName("description_de")
            .HasMaxLength(1000);

        builder.Property(e => e.Price)
            .HasColumnName("price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.PriceType)
            .HasColumnName("price_type")
            .HasMaxLength(20)
            .HasDefaultValue("fixed")
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(10)
            .HasDefaultValue("TND")
            .IsRequired();

        builder.Property(e => e.DurationMinutes)
            .HasColumnName("duration_minutes");

        builder.Property(e => e.ServiceLocation)
            .HasColumnName("service_location")
            .HasMaxLength(20)
            .HasDefaultValue("home")
            .IsRequired();

        builder.Property(e => e.RequiresPrescription)
            .HasColumnName("requires_prescription")
            .HasDefaultValue(false);

        builder.Property(e => e.IsUrgent)
            .HasColumnName("is_urgent")
            .HasDefaultValue(false);

        builder.Property(e => e.RequiresMedicalHistory)
            .HasColumnName("requires_medical_history")
            .HasDefaultValue(false);

        builder.Property(e => e.TypeConfig)
            .HasColumnName("type_config")
            .HasColumnType("jsonb");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.DisplayOrder)
            .HasColumnName("display_order")
            .HasDefaultValue(0);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(e => new { e.ProviderCategory, e.Code })
            .IsUnique()
            .HasDatabaseName("ix_provider_service_presets_category_code");

        builder.HasIndex(e => new { e.ProviderCategory, e.IsActive, e.DisplayOrder })
            .HasDatabaseName("ix_provider_service_presets_category_active_order");
    }
}
