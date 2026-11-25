using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Constants;
using SanadPlatform.API.Features.Ambulance.Entities;
using SanadPlatform.API.Features.Equipment.Entities;
using SanadPlatform.API.Features.Funeral.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Payments.Entities;
using SanadPlatform.API.Features.Pharmacy.Entities;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Features.Services.Entities;
using SanadPlatform.API.Features.Veterinary.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Bookings.Entities;

/// <summary>
/// Represents a booking package in the system.
/// </summary>
public class Booking : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // ==================== Reference ====================

    [SearchableEncrypted(Classification = DataClassification.Sensitive)]
    public string BookingNumber { get; set; } = string.Empty;

    // ==================== Parties ====================

    public Guid PatientId { get; set; }

    public Guid ProviderId { get; set; }

    /// <summary>
    /// Primary service anchor for the booking.
    /// For care bookings with multiple selected services, the full selection lives in <see cref="LineItems"/>.
    /// </summary>
    public Guid ServiceId { get; set; }

    // ==================== Timing ====================

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public TimeOnly DailyStartTime { get; set; }

    public TimeOnly? DailyEndTime { get; set; }

    public int? DailyDurationMinutes { get; set; }

    public string Timezone { get; set; } = "Africa/Tunis";

    // ==================== Status ====================

    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public string PaymentMethod { get; set; } = PaymentMethods.Card;

    /// <summary>
    /// The user who triggered the most recent status change.
    /// Used by the <c>trg_booking_status_change</c> trigger to populate
    /// <c>booking_status_history.changed_by</c>.
    /// </summary>
    public Guid? StatusChangedBy { get; set; }

    /// <summary>
    /// The reason for the most recent status change.
    /// Used by the <c>trg_booking_status_change</c> trigger to populate
    /// <c>booking_status_history.change_reason</c>.
    /// </summary>
    public string? StatusChangeReason { get; set; }

    // ==================== Patient Info (snapshot) ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string PatientName { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Critical)]
    public string? PatientPhone { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? PatientEmail { get; set; }

    // ==================== Location ====================

    public string? ServiceLocation { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? AddressLine1 { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? AddressLine2 { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? City { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? PostalCode { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal? Latitude { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal? Longitude { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? AddressInstructions { get; set; }

    // ==================== Medical Notes ====================

    public Guid? PrescriptionFileId { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? PatientNotes { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string? Symptoms { get; set; }

    public bool MedicalHistoryShared { get; set; } = false;

    // ==================== Family Member Booking ====================

    public bool IsForFamilyMember { get; set; } = false;

    public Guid? FamilyMemberId { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? FamilyMemberName { get; set; }

    public int? FamilyMemberAge { get; set; }

    // ==================== Pricing ====================

    public decimal ServicePrice { get; set; }

    public decimal AddonsPrice { get; set; } = 0.00m;

    public decimal DiscountAmount { get; set; } = 0.00m;

    public string? DiscountCode { get; set; }

    /// <summary>
    /// Full booking subtotal before platform fees and taxes.
    /// For range care bookings this already includes every booked day.
    /// </summary>
    public decimal Subtotal { get; set; }

    public decimal PlatformFee { get; set; }

    public decimal TaxAmount { get; set; } = 0.00m;

    public decimal TotalAmount { get; set; }

    public string Currency { get; set; } = "TND";

    // ==================== Commission ====================

    public decimal CommissionRate { get; set; }

    public decimal CommissionAmount { get; set; }

    public decimal ProviderAmount { get; set; }

    // ==================== Cash Wallet Reservation ====================

    public decimal WalletReservedAmount { get; set; } = 0.00m;

    public DateTime? WalletReservedAt { get; set; }

    public DateTime? WalletReservationReleasedAt { get; set; }

    public DateTime? WalletSettledAt { get; set; }

    // ==================== Validation (escrow) ====================

    public bool ValidationRequired { get; set; } = true;

    [SearchableEncrypted(Classification = DataClassification.Sensitive)]
    public string? ValidationCode { get; set; }

    public DateTime? ValidationCodeExpiresAt { get; set; }

    public DateTime? ValidatedAt { get; set; }

    public DateTime? SettlementCompletedAt { get; set; }

    public Guid? SettlementCompletedBy { get; set; }

    public string? ValidationMethod { get; set; }

    public int ValidationAttempts { get; set; } = 0;

    public DateTime? AutoValidateAt { get; set; }

    // ==================== Tracking ====================

    public DateTime? ProviderAcceptedAt { get; set; }

    public DateTime? ProviderDepartedAt { get; set; }

    public DateTime? ProviderArrivedAt { get; set; }

    public DateTime? ServiceStartedAt { get; set; }

    public DateTime? ServiceCompletedAt { get; set; }

    // ==================== Cancellation ====================

    public DateTime? CancelledAt { get; set; }

    public Guid? CancelledBy { get; set; }

    public string? CancellationReason { get; set; }

    public decimal? CancellationFee { get; set; }

    // ==================== Rescheduling ====================

    public Guid? RescheduledFromId { get; set; }

    public int RescheduleCount { get; set; } = 0;

    // ==================== Provider Notes ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? ProviderNotes { get; set; }

    // ==================== Metadata ====================

    public string Source { get; set; } = "web";

    public string? UtmSource { get; set; }

    public string? UtmMedium { get; set; }

    public string? UtmCampaign { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
    public virtual Provider Provider { get; set; } = null!;
    public virtual Service Service { get; set; } = null!;
    public virtual EquipmentRental? EquipmentRental { get; set; }
    public virtual PharmacyOrder? PharmacyOrder { get; set; }
    public virtual AmbulanceBooking? AmbulanceBooking { get; set; }
    public virtual VeterinaryBooking? VeterinaryBooking { get; set; }
    public virtual FuneralBooking? FuneralBooking { get; set; }
    public virtual ICollection<BookingLineItem> LineItems { get; set; } = new List<BookingLineItem>();
    public virtual ICollection<BookingSession> Sessions { get; set; } = new List<BookingSession>();
    public virtual ICollection<BookingStatusHistory> StatusHistory { get; set; } = new List<BookingStatusHistory>();
    public virtual Payment? Payment { get; set; }
    public virtual TrackingSession? TrackingSession { get; set; }
    public virtual Dispute? Dispute { get; set; }
}
