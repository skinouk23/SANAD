using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Services.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Service"/> entity.
/// Maps to the "services" table with soft-delete support, concurrency token,
/// and indexes for common query patterns.
/// </summary>
public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    /// <summary>
    /// Configures the Service entity mapping.
    /// </summary>
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable("services");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.Category)
            .HasColumnName("category")
            .IsRequired();

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.ShortDescription)
            .HasColumnName("short_description")
            .HasMaxLength(500);

        builder.Property(e => e.Price)
            .HasColumnName("price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.PriceType)
            .HasColumnName("price_type")
            .HasMaxLength(20)
            .HasDefaultValue("fixed");

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND");

        builder.Property(e => e.MinPrice)
            .HasColumnName("min_price")
            .HasPrecision(10, 2);

        builder.Property(e => e.MaxPrice)
            .HasColumnName("max_price")
            .HasPrecision(10, 2);

        builder.Property(e => e.DurationMinutes)
            .HasColumnName("duration_minutes");

        builder.Property(e => e.MinDurationMinutes)
            .HasColumnName("min_duration_minutes");

        builder.Property(e => e.MaxDurationMinutes)
            .HasColumnName("max_duration_minutes");

        builder.Property(e => e.ServiceLocation)
            .HasColumnName("service_location")
            .HasMaxLength(20)
            .HasDefaultValue("home");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.IsFeatured)
            .HasColumnName("is_featured")
            .HasDefaultValue(false);

        builder.Property(e => e.RequiresPrescription)
            .HasColumnName("requires_prescription")
            .HasDefaultValue(false);

        builder.Property(e => e.IsUrgent)
            .HasColumnName("is_urgent")
            .HasDefaultValue(false);

        builder.Property(e => e.RequiresMedicalHistory)
            .HasColumnName("requires_medical_history")
            .HasDefaultValue(false);

        builder.Property(e => e.AgeRestrictionMin)
            .HasColumnName("age_restriction_min");

        builder.Property(e => e.AgeRestrictionMax)
            .HasColumnName("age_restriction_max");

        builder.Property(e => e.MainImageFileId)
            .HasColumnName("main_image_file_id");

        builder.Property(e => e.BookingCount)
            .HasColumnName("booking_count")
            .HasDefaultValue(0);

        builder.Property(e => e.AvailableQuantity)
            .HasColumnName("available_quantity");

        builder.Property(e => e.Metadata)
            .HasColumnName("metadata")
            .HasColumnType("jsonb")
            .HasDefaultValueSql("'{}'");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // ==================== Relationships ====================

        builder.HasOne(e => e.Provider)
            .WithMany(e => e.Services)
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<SanadPlatform.API.Features.Files.Entities.StoredFile>()
            .WithMany()
            .HasForeignKey(e => e.MainImageFileId)
            .OnDelete(DeleteBehavior.SetNull);

        // ==================== Indexes ====================

        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_services_provider");

        builder.HasIndex(e => e.Category)
            .HasDatabaseName("idx_services_category");

        builder.HasIndex(e => e.IsActive)
            .HasDatabaseName("idx_services_active")
            .HasFilter("is_active = TRUE");

        builder.HasIndex(e => e.Price)
            .HasDatabaseName("idx_services_price");

        builder.HasIndex(e => e.AvailableQuantity)
            .HasDatabaseName("idx_services_available_quantity")
            .HasFilter("available_quantity IS NOT NULL");

        builder.HasIndex(e => new { e.Category, e.IsActive, e.CreatedAt })
            .HasDatabaseName("ix_services_equipment_catalog");

        builder.HasIndex(e => new { e.Category, e.IsActive, e.Price })
            .HasDatabaseName("ix_services_equipment_price");

        builder.HasIndex(e => new { e.ProviderId, e.Name })
            .IsUnique()
            .HasDatabaseName("ix_services_provider_name")
            .HasFilter("deleted_at IS NULL");

        // ==================== Trigram Indexes (pg_trgm) ====================

        builder.HasIndex(e => e.Name)
            .HasDatabaseName("idx_services_name_trgm")
            .HasMethod("gin")
            .HasOperators("gin_trgm_ops");

        builder.HasIndex(e => e.Description)
            .HasDatabaseName("idx_services_description_trgm")
            .HasMethod("gin")
            .HasOperators("gin_trgm_ops");
    }
}
