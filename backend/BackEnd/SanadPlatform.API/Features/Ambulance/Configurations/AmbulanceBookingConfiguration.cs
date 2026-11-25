using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Ambulance.Entities;

namespace SanadPlatform.API.Features.Ambulance.Configurations;

public class AmbulanceBookingConfiguration : IEntityTypeConfiguration<AmbulanceBooking>
{
    public void Configure(EntityTypeBuilder<AmbulanceBooking> builder)
    {
        builder.ToTable("ambulance_bookings");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.ServiceType)
            .HasColumnName("service_type")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.PickupAddress)
            .HasColumnName("pickup_address")
            .IsRequired();

        builder.Property(e => e.PickupLatitude)
            .HasColumnName("pickup_latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.PickupLongitude)
            .HasColumnName("pickup_longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.PickupContactName)
            .HasColumnName("pickup_contact_name")
            .HasMaxLength(200);

        builder.Property(e => e.PickupContactPhone)
            .HasColumnName("pickup_contact_phone")
            .HasMaxLength(30);

        builder.Property(e => e.DestinationAddress)
            .HasColumnName("destination_address")
            .IsRequired();

        builder.Property(e => e.DestinationLatitude)
            .HasColumnName("destination_latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.DestinationLongitude)
            .HasColumnName("destination_longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.DestinationFacilityName)
            .HasColumnName("destination_facility_name")
            .HasMaxLength(200);

        builder.Property(e => e.PatientCondition)
            .HasColumnName("patient_condition");

        builder.Property(e => e.RequiresStretcher)
            .HasColumnName("requires_stretcher")
            .HasDefaultValue(false);

        builder.Property(e => e.RequiresOxygen)
            .HasColumnName("requires_oxygen")
            .HasDefaultValue(false);

        builder.Property(e => e.RequiresMedicalStaff)
            .HasColumnName("requires_medical_staff")
            .HasDefaultValue(false);

        builder.Property(e => e.VehicleType)
            .HasColumnName("vehicle_type")
            .HasMaxLength(50);

        builder.Property(e => e.VehicleRegistration)
            .HasColumnName("vehicle_registration")
            .HasMaxLength(50);

        builder.Property(e => e.DriverName)
            .HasColumnName("driver_name")
            .HasMaxLength(200);

        builder.Property(e => e.MedicName)
            .HasColumnName("medic_name")
            .HasMaxLength(200);

        builder.Property(e => e.RequestedPickupTime)
            .HasColumnName("requested_pickup_time");

        builder.Property(e => e.ActualPickupTime)
            .HasColumnName("actual_pickup_time");

        builder.Property(e => e.ActualArrivalTime)
            .HasColumnName("actual_arrival_time");

        builder.Property(e => e.EstimatedDistanceKm)
            .HasColumnName("estimated_distance_km")
            .HasPrecision(10, 2);

        builder.Property(e => e.ActualDistanceKm)
            .HasColumnName("actual_distance_km")
            .HasPrecision(10, 2);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ==================== Relationships ====================

        builder.HasOne(e => e.Booking)
            .WithOne(b => b.AmbulanceBooking)
            .HasForeignKey<AmbulanceBooking>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
