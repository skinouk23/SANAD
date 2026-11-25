using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Reviews.Entities;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents one executable service occurrence inside a parent booking.
/// </summary>
public class BookingSession : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingId { get; set; }

    public Guid ProviderId { get; set; }

    public Guid PatientId { get; set; }

    public DateOnly ScheduledDate { get; set; }

    public TimeOnly ScheduledStartTime { get; set; }

    public TimeOnly? ScheduledEndTime { get; set; }

    public int? ScheduledDurationMinutes { get; set; }

    public string Timezone { get; set; } = "Africa/Tunis";

    public BookingSessionStatus Status { get; set; } = BookingSessionStatus.Pending;

    // ==================== Provider Execution ====================

    public DateTime? ProviderDepartedAt { get; set; }

    public DateTime? ProviderArrivedAt { get; set; }

    public DateTime? ServiceStartedAt { get; set; }

    public DateTime? ServiceCompletedAt { get; set; }

    // ==================== Verification ====================

    /// <summary>
    /// Encrypted 6-digit patient verification code. Encryption is performed explicitly by
    /// <c>BookingSessionVerificationCodeService</c>, not by an EF value converter.
    /// </summary>
    public string? VerificationCode { get; set; }

    public DateTime? VerificationCodeGeneratedAt { get; set; }

    public DateTime? VerificationCodeExpiresAt { get; set; }

    public int VerificationAttempts { get; set; } = 0;

    public DateTime? VerifiedAt { get; set; }

    public string? VerificationMethod { get; set; }

    // ==================== Cancellation, No-Show, Dispute ====================

    public DateTime? CancelledAt { get; set; }

    public Guid? CancelledBy { get; set; }

    public string? CancellationReason { get; set; }

    public DateTime? NoShowAt { get; set; }

    public string? NoShowReason { get; set; }

    public DateTime? DisputedAt { get; set; }

    public string? DisputeReason { get; set; }

    // ==================== Audit ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;

    public virtual Provider Provider { get; set; } = null!;

    public virtual Patient Patient { get; set; } = null!;

    public virtual Review? Review { get; set; }
}
