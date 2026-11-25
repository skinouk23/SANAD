using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable(
            "bookings",
            table => table.HasCheckConstraint(
                "ck_bookings_payment_method",
                "payment_method IN ('card', 'd17', 'cash')"));

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingNumber)
            .HasColumnName("booking_number")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.ServiceId)
            .HasColumnName("service_id")
            .IsRequired();

        builder.Property(e => e.StartDate)
            .HasColumnName("start_date")
            .IsRequired();

        builder.Property(e => e.EndDate)
            .HasColumnName("end_date")
            .IsRequired();

        builder.Property(e => e.DailyStartTime)
            .HasColumnName("daily_start_time")
            .IsRequired();

        builder.Property(e => e.DailyEndTime)
            .HasColumnName("daily_end_time");

        builder.Property(e => e.DailyDurationMinutes)
            .HasColumnName("daily_duration_minutes");

        builder.Property(e => e.Timezone)
            .HasColumnName("timezone")
            .HasMaxLength(50)
            .HasDefaultValue("Africa/Tunis");

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(50)
            .HasConversion<string>()
            .HasDefaultValue(BookingStatus.Pending);

        builder.Property(e => e.PaymentMethod)
            .HasColumnName("payment_method")
            .HasMaxLength(20)
            .HasDefaultValue(PaymentMethods.Card)
            .IsRequired();

        builder.Property(e => e.StatusChangedBy)
            .HasColumnName("status_changed_by");

        builder.Property(e => e.StatusChangeReason)
            .HasColumnName("status_change_reason")
            .HasMaxLength(500);

        builder.Property(e => e.PatientName)
            .HasColumnName("patient_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.PatientPhone)
            .HasColumnName("patient_phone")
            .HasMaxLength(30);

        builder.Property(e => e.PatientEmail)
            .HasColumnName("patient_email")
            .HasMaxLength(255);

        builder.Property(e => e.ServiceLocation)
            .HasColumnName("service_location")
            .HasMaxLength(20);

        builder.Property(e => e.AddressLine1)
            .HasColumnName("address_line1");

        builder.Property(e => e.AddressLine2)
            .HasColumnName("address_line2");

        builder.Property(e => e.City)
            .HasColumnName("city")
            .HasMaxLength(100);

        builder.Property(e => e.PostalCode)
            .HasColumnName("postal_code")
            .HasMaxLength(20);

        builder.Property(e => e.Latitude)
            .HasColumnName("latitude")
            .HasPrecision(10, 8);

        builder.Property(e => e.Longitude)
            .HasColumnName("longitude")
            .HasPrecision(11, 8);

        builder.Property(e => e.AddressInstructions)
            .HasColumnName("address_instructions");

        builder.Property(e => e.PrescriptionFileId)
            .HasColumnName("prescription_file_id");

        builder.Property(e => e.PatientNotes)
            .HasColumnName("patient_notes");

        builder.Property(e => e.Symptoms)
            .HasColumnName("symptoms");

        builder.Property(e => e.MedicalHistoryShared)
            .HasColumnName("medical_history_shared")
            .HasDefaultValue(false);

        builder.Property(e => e.IsForFamilyMember)
            .HasColumnName("is_for_family_member")
            .HasDefaultValue(false);

        builder.Property(e => e.FamilyMemberId)
            .HasColumnName("family_member_id");

        builder.Property(e => e.FamilyMemberName)
            .HasColumnName("family_member_name")
            .HasMaxLength(200);

        builder.Property(e => e.FamilyMemberAge)
            .HasColumnName("family_member_age");

        builder.Property(e => e.ServicePrice)
            .HasColumnName("service_price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.AddonsPrice)
            .HasColumnName("addons_price")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.DiscountAmount)
            .HasColumnName("discount_amount")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.DiscountCode)
            .HasColumnName("discount_code")
            .HasMaxLength(50);

        builder.Property(e => e.Subtotal)
            .HasColumnName("subtotal")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.PlatformFee)
            .HasColumnName("platform_fee")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.TaxAmount)
            .HasColumnName("tax_amount")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m);

        builder.Property(e => e.TotalAmount)
            .HasColumnName("total_amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsFixedLength()
            .HasDefaultValue("TND");

        builder.Property(e => e.CommissionRate)
            .HasColumnName("commission_rate")
            .HasPrecision(5, 2)
            .IsRequired();

        builder.Property(e => e.CommissionAmount)
            .HasColumnName("commission_amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.ProviderAmount)
            .HasColumnName("provider_amount")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.WalletReservedAmount)
            .HasColumnName("wallet_reserved_amount")
            .HasPrecision(10, 2)
            .HasDefaultValue(0.00m)
            .IsRequired();

        builder.Property(e => e.WalletReservedAt)
            .HasColumnName("wallet_reserved_at");

        builder.Property(e => e.WalletReservationReleasedAt)
            .HasColumnName("wallet_reservation_released_at");

        builder.Property(e => e.WalletSettledAt)
            .HasColumnName("wallet_settled_at");

        builder.Property(e => e.ValidationRequired)
            .HasColumnName("validation_required")
            .HasDefaultValue(true);

        builder.Property(e => e.ValidationCode)
            .HasColumnName("validation_code")
            .HasMaxLength(6);

        builder.Property(e => e.ValidationCodeExpiresAt)
            .HasColumnName("validation_code_expires_at");

        builder.Property(e => e.ValidatedAt)
            .HasColumnName("validated_at");

        builder.Property(e => e.SettlementCompletedAt)
            .HasColumnName("settlement_completed_at");

        builder.Property(e => e.SettlementCompletedBy)
            .HasColumnName("settlement_completed_by");

        builder.Property(e => e.ValidationMethod)
            .HasColumnName("validation_method")
            .HasMaxLength(20);

        builder.Property(e => e.AutoValidateAt)
            .HasColumnName("auto_validate_at");

        builder.Property(e => e.ValidationAttempts)
            .HasColumnName("validation_attempts")
            .HasDefaultValue(0);

        builder.Property(e => e.ProviderAcceptedAt)
            .HasColumnName("provider_accepted_at");

        builder.Property(e => e.ProviderDepartedAt)
            .HasColumnName("provider_departed_at");

        builder.Property(e => e.ProviderArrivedAt)
            .HasColumnName("provider_arrived_at");

        builder.Property(e => e.ServiceStartedAt)
            .HasColumnName("service_started_at");

        builder.Property(e => e.ServiceCompletedAt)
            .HasColumnName("service_completed_at");

        builder.Property(e => e.CancelledAt)
            .HasColumnName("cancelled_at");

        builder.Property(e => e.CancelledBy)
            .HasColumnName("cancelled_by");

        builder.Property(e => e.CancellationReason)
            .HasColumnName("cancellation_reason");

        builder.Property(e => e.CancellationFee)
            .HasColumnName("cancellation_fee")
            .HasPrecision(10, 2);

        builder.Property(e => e.RescheduledFromId)
            .HasColumnName("rescheduled_from_id");

        builder.Property(e => e.RescheduleCount)
            .HasColumnName("reschedule_count")
            .HasDefaultValue(0);

        builder.Property(e => e.ProviderNotes)
            .HasColumnName("provider_notes");

        builder.Property(e => e.Source)
            .HasColumnName("source")
            .HasMaxLength(50)
            .HasDefaultValue("web");

        builder.Property(e => e.UtmSource)
            .HasColumnName("utm_source")
            .HasMaxLength(100);

        builder.Property(e => e.UtmMedium)
            .HasColumnName("utm_medium")
            .HasMaxLength(100);

        builder.Property(e => e.UtmCampaign)
            .HasColumnName("utm_campaign")
            .HasMaxLength(100);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        builder.HasQueryFilter(e => e.DeletedAt == null);

        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        builder.HasOne(e => e.Patient)
            .WithMany(e => e.Bookings)
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Service)
            .WithMany()
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CancelledBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.StatusChangedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.SettlementCompletedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<FamilyMember>()
            .WithMany()
            .HasForeignKey(e => e.FamilyMemberId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Booking>()
            .WithMany()
            .HasForeignKey(e => e.RescheduledFromId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.PatientId)
            .HasDatabaseName("idx_bookings_patient");

        builder.HasIndex(e => e.ProviderId)
            .HasDatabaseName("idx_bookings_provider");

        builder.HasIndex(e => e.Status)
            .HasDatabaseName("idx_bookings_status");

        builder.HasIndex(e => e.StartDate)
            .HasDatabaseName("idx_bookings_start_date");

        builder.HasIndex(e => e.EndDate)
            .HasDatabaseName("idx_bookings_end_date");

        builder.HasIndex(e => e.CreatedAt)
            .HasDatabaseName("idx_bookings_created")
            .IsDescending();

        builder.HasIndex(e => e.SettlementCompletedBy);

        builder.HasIndex(e => e.BookingNumber)
            .IsUnique()
            .HasDatabaseName("idx_bookings_number");

        builder.HasIndex(e => new { e.PatientId, e.StartDate })
            .HasFilter("deleted_at IS NULL")
            .HasDatabaseName("idx_bookings_patient_start_date");

        builder.HasIndex(e => new { e.ProviderId, e.StartDate })
            .HasFilter("deleted_at IS NULL")
            .HasDatabaseName("idx_bookings_provider_start_date");

        builder.HasIndex(e => new { e.ProviderId, e.StartDate, e.DailyStartTime })
            .HasFilter("deleted_at IS NULL")
            .HasDatabaseName("idx_bookings_provider_start_date_time");
    }
}
