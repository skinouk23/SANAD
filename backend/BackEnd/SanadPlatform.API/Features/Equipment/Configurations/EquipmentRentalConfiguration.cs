using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Features.Equipment.Entities;

namespace SanadPlatform.API.Features.Equipment.Configurations;

public class EquipmentRentalConfiguration : IEntityTypeConfiguration<EquipmentRental>
{
    public void Configure(EntityTypeBuilder<EquipmentRental> builder)
    {
        builder.ToTable("equipment_rentals");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.EquipmentName)
            .HasColumnName("equipment_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.EquipmentSerialNumber)
            .HasColumnName("equipment_serial_number")
            .HasMaxLength(100);

        builder.Property(e => e.RentalStartDate)
            .HasColumnName("rental_start_date")
            .IsRequired();

        builder.Property(e => e.RentalEndDate)
            .HasColumnName("rental_end_date")
            .IsRequired();

        builder.Property(e => e.ActualReturnDate)
            .HasColumnName("actual_return_date");

        builder.Property(e => e.RentalDurationType)
            .HasColumnName("rental_duration_type")
            .HasMaxLength(20)
            .IsRequired()
            .HasDefaultValue("daily");

        builder.Property(e => e.PeriodRate)
            .HasColumnName("period_rate")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.PeriodCount)
            .HasColumnName("period_count")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(e => e.DepositAmount)
            .HasColumnName("deposit_amount")
            .HasPrecision(10, 2);

        builder.Property(e => e.DepositPaid)
            .HasColumnName("deposit_paid")
            .HasDefaultValue(false);

        builder.Property(e => e.DepositReturned)
            .HasColumnName("deposit_returned")
            .HasDefaultValue(false);

        builder.Property(e => e.ConditionAtPickup)
            .HasColumnName("condition_at_pickup")
            .HasMaxLength(50);

        builder.Property(e => e.ConditionAtReturn)
            .HasColumnName("condition_at_return")
            .HasMaxLength(50);

        builder.Property(e => e.DamageNotes)
            .HasColumnName("damage_notes");

        builder.Property(e => e.DamageFee)
            .HasColumnName("damage_fee")
            .HasPrecision(10, 2);

        builder.Property(e => e.PickupPhotos)
            .HasColumnName("pickup_photos")
            .HasColumnType("text[]");

        builder.Property(e => e.ReturnPhotos)
            .HasColumnName("return_photos")
            .HasColumnType("text[]");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ==================== Relationships ====================

        builder.HasOne(e => e.Booking)
            .WithOne(b => b.EquipmentRental)
            .HasForeignKey<EquipmentRental>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
