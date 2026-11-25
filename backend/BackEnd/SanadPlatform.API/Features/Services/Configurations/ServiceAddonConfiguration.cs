using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="ServiceAddon"/> entity.
/// Maps to the "service_addons" table with soft-delete support.
/// </summary>
public class ServiceAddonConfiguration : IEntityTypeConfiguration<ServiceAddon>
{
    /// <summary>
    /// Configures the ServiceAddon entity mapping.
    /// </summary>
    public void Configure(EntityTypeBuilder<ServiceAddon> builder)
    {
        builder.ToTable("service_addons");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ServiceId)
            .HasColumnName("service_id")
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.Price)
            .HasColumnName("price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.DurationMinutes)
            .HasColumnName("duration_minutes");

        builder.Property(e => e.Icon)
            .HasColumnName("icon")
            .HasMaxLength(100);

        builder.Property(e => e.IsSupplement)
            .HasColumnName("is_supplement")
            .HasDefaultValue(false);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // ==================== Relationships ====================

        builder.HasOne(e => e.Service)
            .WithMany(e => e.Addons)
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        // ==================== Indexes ====================

        builder.HasIndex(e => e.ServiceId)
            .HasDatabaseName("idx_service_addons_service_id");
    }
}
