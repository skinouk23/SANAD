using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class BookingStatusHistoryConfiguration : IEntityTypeConfiguration<BookingStatusHistory>
{
    public void Configure(EntityTypeBuilder<BookingStatusHistory> builder)
    {
        builder.ToTable("booking_status_history");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.PreviousStatus)
            .HasColumnName("previous_status")
            .HasConversion<string>();

        builder.Property(e => e.NewStatus)
            .HasColumnName("new_status")
            .HasConversion<string>()
            .IsRequired();

        builder.Property(e => e.ChangedBy)
            .HasColumnName("changed_by");

        builder.Property(e => e.ChangeReason)
            .HasColumnName("change_reason")
            .HasMaxLength(500);

        builder.Property(e => e.Notes)
            .HasColumnName("notes")
            .HasMaxLength(2000);

        builder.Property(e => e.Latitude)
            .HasColumnName("latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.Longitude)
            .HasColumnName("longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Booking)
            .WithMany(e => e.StatusHistory)
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.ChangedBy)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
