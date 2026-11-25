using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Booking/Appointment entity
    /// </summary>
    [Table("bookings")]
    public class Booking
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [Column("service_id")]
        public Guid ServiceId { get; set; }

        [Required]
        [Column("booking_date")]
        public DateTime BookingDate { get; set; }

        [Required]
        [Column("booking_time")]
        public TimeSpan BookingTime { get; set; }

        [Column("duration")]
        public int? Duration { get; set; }

        [MaxLength(50)]
        [Column("status")]
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        [MaxLength(200)]
        [Column("patient_name")]
        public string PatientName { get; set; }

        [MaxLength(20)]
        [Column("patient_phone")]
        public string PatientPhone { get; set; }

        [Column("patient_address")]
        public string PatientAddress { get; set; }

        [MaxLength(100)]
        [Column("patient_city")]
        public string PatientCity { get; set; }

        [Column("patient_notes")]
        public string PatientNotes { get; set; }

        [MaxLength(50)]
        [Column("service_location")]
        public ServiceLocation? ServiceLocation { get; set; }

        [Column("latitude", TypeName = "decimal(10,8)")]
        public decimal? Latitude { get; set; }

        [Column("longitude", TypeName = "decimal(11,8)")]
        public decimal? Longitude { get; set; }

        [Required]
        [Column("service_price", TypeName = "decimal(10,2)")]
        public decimal ServicePrice { get; set; }

        [Column("platform_fee", TypeName = "decimal(10,2)")]
        public decimal? PlatformFee { get; set; }

        [Required]
        [Column("total_amount", TypeName = "decimal(10,2)")]
        public decimal TotalAmount { get; set; }

        [MaxLength(6)]
        [Column("validation_code")]
        public string ValidationCode { get; set; }

        [Column("validation_required")]
        public bool ValidationRequired { get; set; } = true;

        [Column("validated_at")]
        public DateTime? ValidatedAt { get; set; }

        [Column("provider_arrived_at")]
        public DateTime? ProviderArrivedAt { get; set; }

        [Column("service_started_at")]
        public DateTime? ServiceStartedAt { get; set; }

        [Column("service_completed_at")]
        public DateTime? ServiceCompletedAt { get; set; }

        [Column("cancellation_reason")]
        public string CancellationReason { get; set; }

        [Column("cancelled_by")]
        public Guid? CancelledBy { get; set; }

        [Column("cancelled_at")]
        public DateTime? CancelledAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        public ICollection<BookingStatusHistory> StatusHistory { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
        public Review Review { get; set; }
        public ICollection<Message> Messages { get; set; }
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        InProgress,
        Completed,
        Cancelled,
        NoShow
    }
}
