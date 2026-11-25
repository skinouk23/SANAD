using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class RefundConfiguration : IEntityTypeConfiguration<Refund>
{
    public void Configure(EntityTypeBuilder<Refund> builder)
    {
        builder.ToTable("refunds");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.PaymentId)
            .HasColumnName("payment_id")
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.Reason)
            .HasColumnName("reason")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .HasDefaultValue("pending");

        builder.Property(e => e.GatewayRefundId)
            .HasColumnName("gateway_refund_id")
            .HasMaxLength(200);

        builder.Property(e => e.GatewayResponse)
            .HasColumnName("gateway_response")
            .HasColumnType("jsonb");

        builder.Property(e => e.RequestedBy)
            .HasColumnName("requested_by");

        builder.Property(e => e.ApprovedBy)
            .HasColumnName("approved_by");

        builder.Property(e => e.ProcessedAt)
            .HasColumnName("processed_at");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Payment)
            .WithMany(e => e.Refunds)
            .HasForeignKey(e => e.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Booking>()
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
