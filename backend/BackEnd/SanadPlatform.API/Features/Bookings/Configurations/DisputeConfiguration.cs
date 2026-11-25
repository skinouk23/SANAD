using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Payments.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class DisputeConfiguration : IEntityTypeConfiguration<Dispute>
{
    public void Configure(EntityTypeBuilder<Dispute> builder)
    {
        builder.ToTable("disputes");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.DisputeNumber)
            .HasColumnName("dispute_number")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.PaymentId)
            .HasColumnName("payment_id");

        builder.Property(e => e.ReportedBy)
            .HasColumnName("reported_by")
            .IsRequired();

        builder.Property(e => e.ReportedAgainst)
            .HasColumnName("reported_against")
            .IsRequired();

        builder.Property(e => e.Reason)
            .HasColumnName("reason")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(e => e.EvidenceUrls)
            .HasColumnName("evidence_urls")
            .HasColumnType("text[]");

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(50)
            .HasDefaultValue("open");

        builder.Property(e => e.Resolution)
            .HasColumnName("resolution")
            .HasMaxLength(2000);

        builder.Property(e => e.ResolutionAmount)
            .HasColumnName("resolution_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.ResolvedBy)
            .HasColumnName("resolved_by");

        builder.Property(e => e.ResolvedAt)
            .HasColumnName("resolved_at");

        builder.Property(e => e.IsEscalated)
            .HasColumnName("is_escalated")
            .HasDefaultValue(false);

        builder.Property(e => e.EscalatedAt)
            .HasColumnName("escalated_at");

        builder.Property(e => e.EscalatedTo)
            .HasColumnName("escalated_to");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne(e => e.Booking)
            .WithOne(e => e.Dispute)
            .HasForeignKey<Dispute>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Payment>()
            .WithMany()
            .HasForeignKey(e => e.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.ReportedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.ReportedAgainst)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.ResolvedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.EscalatedTo)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.DisputeNumber)
            .IsUnique()
            .HasDatabaseName("idx_disputes_number");
    }
}
