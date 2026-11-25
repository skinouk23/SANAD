using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Marketing.Entities;

namespace SanadPlatform.API.Features.Marketing.Configurations;

public class DiscountCodeConfiguration : IEntityTypeConfiguration<DiscountCode>
{
    public void Configure(EntityTypeBuilder<DiscountCode> builder)
    {
        builder.ToTable("discount_codes");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description");

        builder.Property(e => e.DiscountType)
            .HasColumnName("discount_type")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.DiscountValue)
            .HasColumnName("discount_value")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.MaxDiscountAmount)
            .HasColumnName("max_discount_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.ValidFrom)
            .HasColumnName("valid_from")
            .IsRequired();

        builder.Property(e => e.ValidUntil)
            .HasColumnName("valid_until")
            .IsRequired();

        builder.Property(e => e.MaxUses)
            .HasColumnName("max_uses");

        builder.Property(e => e.MaxUsesPerUser)
            .HasColumnName("max_uses_per_user")
            .HasDefaultValue(1);

        builder.Property(e => e.CurrentUses)
            .HasColumnName("current_uses")
            .HasDefaultValue(0);

        builder.Property(e => e.MinOrderAmount)
            .HasColumnName("min_order_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.ApplicableServices)
            .HasColumnName("applicable_services")
            .HasColumnType("uuid[]");

        builder.Property(e => e.ApplicableCategories)
            .HasColumnName("applicable_categories")
            .HasColumnType("text[]");

        builder.Property(e => e.FirstBookingOnly)
            .HasColumnName("first_booking_only")
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

        // ==================== Concurrency Token ====================
        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        // Indexes
        builder.HasIndex(e => e.Code)
            .IsUnique();
    }
}
