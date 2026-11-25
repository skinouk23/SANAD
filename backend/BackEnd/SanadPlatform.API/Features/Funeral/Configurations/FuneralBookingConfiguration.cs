using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Funeral.Entities;

namespace SanadPlatform.API.Features.Funeral.Configurations;

public class FuneralBookingConfiguration : IEntityTypeConfiguration<FuneralBooking>
{
    public void Configure(EntityTypeBuilder<FuneralBooking> builder)
    {
        builder.ToTable("funeral_bookings");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.DeceasedName)
            .HasColumnName("deceased_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.DeceasedAge)
            .HasColumnName("deceased_age")
            .HasMaxLength(20);

        builder.Property(e => e.DeceasedBirthDate)
            .HasColumnName("deceased_birth_date")
            .HasMaxLength(20);

        builder.Property(e => e.DeceasedDeathDate)
            .HasColumnName("deceased_death_date")
            .HasMaxLength(20);

        builder.Property(e => e.DeathPlace)
            .HasColumnName("death_place")
            .HasMaxLength(500);

        builder.Property(e => e.Religion)
            .HasColumnName("religion")
            .HasMaxLength(100);

        builder.Property(e => e.ContactName)
            .HasColumnName("contact_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.ContactPhone)
            .HasColumnName("contact_phone")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(e => e.ContactEmail)
            .HasColumnName("contact_email")
            .HasMaxLength(200);

        builder.Property(e => e.ContactRelationship)
            .HasColumnName("contact_relationship")
            .HasMaxLength(100);

        builder.Property(e => e.CeremonyType)
            .HasColumnName("ceremony_type")
            .HasMaxLength(50);

        builder.Property(e => e.CeremonyLocation)
            .HasColumnName("ceremony_location")
            .HasMaxLength(500);

        builder.Property(e => e.BurialType)
            .HasColumnName("burial_type")
            .HasMaxLength(50);

        builder.Property(e => e.RequiresRepatriation)
            .HasColumnName("requires_repatriation")
            .HasDefaultValue(false);

        builder.Property(e => e.RepatriationCountry)
            .HasColumnName("repatriation_country")
            .HasMaxLength(200);

        builder.Property(e => e.FloralService)
            .HasColumnName("floral_service")
            .HasDefaultValue(false);

        builder.Property(e => e.TransportService)
            .HasColumnName("transport_service")
            .HasDefaultValue(false);

        builder.Property(e => e.AdminAssistance)
            .HasColumnName("admin_assistance")
            .HasDefaultValue(false);

        builder.Property(e => e.GriefSupport)
            .HasColumnName("grief_support")
            .HasDefaultValue(false);

        builder.Property(e => e.SpecialRequests)
            .HasColumnName("special_requests");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithOne(b => b.FuneralBooking)
            .HasForeignKey<FuneralBooking>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
