using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class TrackingSessionConfiguration : IEntityTypeConfiguration<TrackingSession>
{
    public void Configure(EntityTypeBuilder<TrackingSession> builder)
    {
        builder.ToTable("tracking_sessions");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(e => e.ShareToken)
            .HasColumnName("share_token")
            .HasMaxLength(100);

        builder.Property(e => e.ShareExpiresAt)
            .HasColumnName("share_expires_at");

        builder.Property(e => e.EstimatedArrivalAt)
            .HasColumnName("estimated_arrival_at");

        builder.Property(e => e.LastEtaUpdateAt)
            .HasColumnName("last_eta_update_at");

        builder.Property(e => e.TotalDistanceKm)
            .HasColumnName("total_distance_km")
            .HasPrecision(10, 2);

        builder.Property(e => e.StartedAt)
            .HasColumnName("started_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.EndedAt)
            .HasColumnName("ended_at");

        // Relationships
        builder.HasOne(e => e.Booking)
            .WithOne(e => e.TrackingSession)
            .HasForeignKey<TrackingSession>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.ShareToken)
            .IsUnique()
            .HasDatabaseName("idx_tracking_sessions_share_token");
    }
}
