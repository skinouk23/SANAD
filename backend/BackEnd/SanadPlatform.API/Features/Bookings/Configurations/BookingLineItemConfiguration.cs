using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Services.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class BookingLineItemConfiguration : IEntityTypeConfiguration<BookingLineItem>
{
    public void Configure(EntityTypeBuilder<BookingLineItem> builder)
    {
        builder.ToTable("booking_line_items");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.ServiceId)
            .HasColumnName("service_id")
            .IsRequired();

        builder.Property(e => e.ServiceName)
            .HasColumnName("service_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.ServiceCategory)
            .HasColumnName("service_category")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND");

        builder.Property(e => e.Quantity)
            .HasColumnName("quantity")
            .HasDefaultValue(1);

        builder.Property(e => e.UnitPrice)
            .HasColumnName("unit_price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.Subtotal)
            .HasColumnName("subtotal")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithMany(e => e.LineItems)
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Service>()
            .WithMany()
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.BookingId)
            .HasDatabaseName("idx_booking_line_items_booking_id");

        builder.HasIndex(e => e.ServiceId)
            .HasDatabaseName("idx_booking_line_items_service_id");
    }
}
