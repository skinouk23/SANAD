using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Marketing.Entities;

namespace SanadPlatform.API.Features.Marketing.Configurations;

public class DiscountCodeUsageConfiguration : IEntityTypeConfiguration<DiscountCodeUsage>
{
    public void Configure(EntityTypeBuilder<DiscountCodeUsage> builder)
    {
        builder.ToTable("discount_code_usage");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.DiscountCodeId)
            .HasColumnName("discount_code_id")
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.DiscountAmount)
            .HasColumnName("discount_amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.DiscountCode)
            .WithMany(e => e.Usages)
            .HasForeignKey(e => e.DiscountCodeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
