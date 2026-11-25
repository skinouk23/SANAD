using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Veterinary.Entities;

namespace SanadPlatform.API.Features.Veterinary.Configurations;

public class VeterinaryBookingConfiguration : IEntityTypeConfiguration<VeterinaryBooking>
{
    public void Configure(EntityTypeBuilder<VeterinaryBooking> builder)
    {
        builder.ToTable("veterinary_bookings");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.AnimalType)
            .HasColumnName("animal_type")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.AnimalName)
            .HasColumnName("animal_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.AnimalBreed)
            .HasColumnName("animal_breed")
            .HasMaxLength(100);

        builder.Property(e => e.AnimalAge)
            .HasColumnName("animal_age")
            .HasMaxLength(50);

        builder.Property(e => e.AnimalWeight)
            .HasColumnName("animal_weight")
            .HasMaxLength(20);

        builder.Property(e => e.IsSterilized)
            .HasColumnName("is_sterilized")
            .HasDefaultValue(false);

        builder.Property(e => e.IsVaccinated)
            .HasColumnName("is_vaccinated")
            .HasDefaultValue(false);

        builder.Property(e => e.IsAggressive)
            .HasColumnName("is_aggressive")
            .HasDefaultValue(false);

        builder.Property(e => e.HasMedicalRecord)
            .HasColumnName("has_medical_record")
            .HasDefaultValue(false);

        builder.Property(e => e.Notes)
            .HasColumnName("notes");

        builder.Property(e => e.HomeVisitAddress)
            .HasColumnName("home_visit_address");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithOne(b => b.VeterinaryBooking)
            .HasForeignKey<VeterinaryBooking>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
