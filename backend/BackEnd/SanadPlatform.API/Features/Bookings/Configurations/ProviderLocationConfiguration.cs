using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class ProviderLocationConfiguration : IEntityTypeConfiguration<ProviderLocation>
{
    public void Configure(EntityTypeBuilder<ProviderLocation> builder)
    {
        builder.ToTable("provider_locations");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.Latitude)
            .HasColumnName("latitude")
            .HasPrecision(10, 8)
            .IsRequired();

        builder.Property(e => e.Longitude)
            .HasColumnName("longitude")
            .HasPrecision(11, 8)
            .IsRequired();

        builder.Property(e => e.AccuracyMeters)
            .HasColumnName("accuracy_meters")
            .HasPrecision(10, 2);

        builder.Property(e => e.Heading)
            .HasColumnName("heading")
            .HasPrecision(5, 2);

        builder.Property(e => e.SpeedKmh)
            .HasColumnName("speed_kmh")
            .HasPrecision(6, 2);

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id");

        builder.Property(e => e.RecordedAt)
            .HasColumnName("recorded_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Relationships
        builder.HasOne<Provider>()
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Booking>()
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_provider_locations_provider");

        builder.HasIndex(e => e.BookingId)
            .HasDatabaseName("idx_provider_locations_booking");

        builder.HasIndex(e => e.RecordedAt)
            .HasDatabaseName("idx_provider_locations_time")
            .IsDescending();
    }
}
