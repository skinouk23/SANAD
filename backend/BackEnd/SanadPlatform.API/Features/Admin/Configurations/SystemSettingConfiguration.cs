using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Admin.Entities;

namespace SanadPlatform.API.Features.Admin.Configurations;

public class SystemSettingConfiguration : IEntityTypeConfiguration<SystemSetting>
{
    public void Configure(EntityTypeBuilder<SystemSetting> builder)
    {
        builder.ToTable("system_settings");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.SettingKey)
            .HasColumnName("setting_key")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.SettingValue)
            .HasColumnName("setting_value");

        builder.Property(e => e.SettingType)
            .HasColumnName("setting_type")
            .HasMaxLength(20)
            .HasDefaultValue("string");

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.IsPublic)
            .HasColumnName("is_public")
            .HasDefaultValue(false);

        builder.Property(e => e.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(e => e.SettingKey)
            .IsUnique();
    }
}
