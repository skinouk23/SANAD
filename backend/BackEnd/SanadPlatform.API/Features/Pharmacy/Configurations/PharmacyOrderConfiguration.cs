using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Pharmacy.Entities;

namespace SanadPlatform.API.Features.Pharmacy.Configurations;

/// <summary>
/// EF Core Fluent API configuration for <see cref="PharmacyOrder"/>.
/// Maps to the <c>pharmacy_orders</c> table with snake_case columns.
/// </summary>
public class PharmacyOrderConfiguration : IEntityTypeConfiguration<PharmacyOrder>
{
    public void Configure(EntityTypeBuilder<PharmacyOrder> builder)
    {
        builder.ToTable("pharmacy_orders");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        // ==================== Order Details ====================

        builder.Property(e => e.Items)
            .HasColumnName("items")
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.PrescriptionFileId)
            .HasColumnName("prescription_file_id");

        builder.Property(e => e.DeliveryAddress)
            .HasColumnName("delivery_address")
            .HasMaxLength(500);

        builder.Property(e => e.PatientPhone)
            .HasColumnName("patient_phone")
            .HasMaxLength(50);

        builder.Property(e => e.Notes)
            .HasColumnName("notes")
            .HasMaxLength(1000);

        // ==================== Dates ====================

        builder.Property(e => e.OrderDate)
            .HasColumnName("order_date")
            .IsRequired();

        builder.Property(e => e.CompletedAt)
            .HasColumnName("completed_at");

        // ==================== Timestamps ====================

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // ==================== Relationships ====================

        builder.HasOne(e => e.Booking)
            .WithOne(b => b.PharmacyOrder)
            .HasForeignKey<PharmacyOrder>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<SanadPlatform.API.Features.Files.Entities.StoredFile>()
            .WithMany()
            .HasForeignKey(e => e.PrescriptionFileId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
