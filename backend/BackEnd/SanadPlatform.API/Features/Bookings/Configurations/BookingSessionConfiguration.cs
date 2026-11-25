using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Configurations;

/// <summary>
/// EF Core configuration for <see cref="BookingSession"/>.
/// </summary>
public class BookingSessionConfiguration : IEntityTypeConfiguration<BookingSession>
{
    public void Configure(EntityTypeBuilder<BookingSession> builder)
    {
        builder.ToTable("booking_sessions");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(e => e.BookingId)
            .HasColumnName("booking_id")
            .IsRequired();

        builder.Property(e => e.ProviderId)
            .HasColumnName("provider_id")
            .IsRequired();

        builder.Property(e => e.PatientId)
            .HasColumnName("patient_id")
            .IsRequired();

        builder.Property(e => e.ScheduledDate)
            .HasColumnName("scheduled_date")
            .IsRequired();

        builder.Property(e => e.ScheduledStartTime)
            .HasColumnName("scheduled_start_time")
            .IsRequired();

        builder.Property(e => e.ScheduledEndTime)
            .HasColumnName("scheduled_end_time");

        builder.Property(e => e.ScheduledDurationMinutes)
            .HasColumnName("scheduled_duration_minutes");

        builder.Property(e => e.Timezone)
            .HasColumnName("timezone")
            .HasMaxLength(50)
            .HasDefaultValue("Africa/Tunis")
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(50)
            .HasConversion<string>()
            .HasDefaultValue(BookingSessionStatus.Pending)
            .IsRequired();

        builder.Property(e => e.ProviderDepartedAt)
            .HasColumnName("provider_departed_at");

        builder.Property(e => e.ProviderArrivedAt)
            .HasColumnName("provider_arrived_at");

        builder.Property(e => e.ServiceStartedAt)
            .HasColumnName("service_started_at");

        builder.Property(e => e.ServiceCompletedAt)
            .HasColumnName("service_completed_at");

        builder.Property(e => e.VerificationCode)
            .HasColumnName("verification_code")
            .HasMaxLength(512);

        builder.Property(e => e.VerificationCodeGeneratedAt)
            .HasColumnName("verification_code_generated_at");

        builder.Property(e => e.VerificationCodeExpiresAt)
            .HasColumnName("verification_code_expires_at");

        builder.Property(e => e.VerificationAttempts)
            .HasColumnName("verification_attempts")
            .HasDefaultValue(0)
            .IsRequired();

        builder.Property(e => e.VerifiedAt)
            .HasColumnName("verified_at");

        builder.Property(e => e.VerificationMethod)
            .HasColumnName("verification_method")
            .HasMaxLength(50);

        builder.Property(e => e.CancelledAt)
            .HasColumnName("cancelled_at");

        builder.Property(e => e.CancelledBy)
            .HasColumnName("cancelled_by");

        builder.Property(e => e.CancellationReason)
            .HasColumnName("cancellation_reason")
            .HasMaxLength(1000);

        builder.Property(e => e.NoShowAt)
            .HasColumnName("no_show_at");

        builder.Property(e => e.NoShowReason)
            .HasColumnName("no_show_reason")
            .HasMaxLength(1000);

        builder.Property(e => e.DisputedAt)
            .HasColumnName("disputed_at");

        builder.Property(e => e.DisputeReason)
            .HasColumnName("dispute_reason")
            .HasMaxLength(1000);

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property<uint>("xmin")
            .IsRowVersion()
            .HasColumnName("xmin")
            .HasColumnType("xid");

        builder.HasOne(e => e.Booking)
            .WithMany(e => e.Sessions)
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Provider)
            .WithMany()
            .HasForeignKey(e => e.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Patient)
            .WithMany()
            .HasForeignKey(e => e.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CancelledBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.BookingId)
            .HasDatabaseName("idx_booking_sessions_booking");

        builder.HasIndex(e => new { e.ProviderId, e.ScheduledDate })
            .HasDatabaseName("idx_booking_sessions_provider_date");

        builder.HasIndex(e => new { e.PatientId, e.ScheduledDate })
            .HasDatabaseName("idx_booking_sessions_patient_date");

        builder.HasIndex(e => e.Status)
            .HasDatabaseName("idx_booking_sessions_status");

        builder.HasIndex(e => new { e.ScheduledDate, e.ScheduledStartTime })
            .HasDatabaseName("idx_booking_sessions_date_time");

        builder.HasIndex(e => new { e.ProviderId, e.ScheduledDate, e.ScheduledStartTime })
            .HasDatabaseName("idx_booking_sessions_provider_date_time");
    }
}
