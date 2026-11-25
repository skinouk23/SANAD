using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    // ============================================
    // PROVIDER RELATED
    // ============================================

    [Table("provider_certifications")]
    public class ProviderCertification
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("certification_name")]
        public string CertificationName { get; set; }

        [MaxLength(200)]
        [Column("issuing_organization")]
        public string IssuingOrganization { get; set; }

        [Column("issue_date")]
        public DateTime? IssueDate { get; set; }

        [Column("expiry_date")]
        public DateTime? ExpiryDate { get; set; }

        [Column("document_url")]
        public string DocumentUrl { get; set; }

        [Column("verified")]
        public bool Verified { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }
    }

    [Table("provider_schedules")]
    public class ProviderSchedule
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [Range(0, 6)]
        [Column("day_of_week")]
        public int DayOfWeek { get; set; }

        [Required]
        [Column("start_time")]
        public TimeSpan StartTime { get; set; }

        [Required]
        [Column("end_time")]
        public TimeSpan EndTime { get; set; }

        [Column("is_available")]
        public bool IsAvailable { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }
    }

    [Table("provider_unavailability")]
    public class ProviderUnavailability
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Required]
        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Column("start_time")]
        public TimeSpan? StartTime { get; set; }

        [Column("end_time")]
        public TimeSpan? EndTime { get; set; }

        [Column("reason")]
        public string Reason { get; set; }

        [Column("is_all_day")]
        public bool IsAllDay { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }
    }

    // ============================================
    // SERVICE RELATED
    // ============================================

    [Table("service_facilities")]
    public class ServiceFacility
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("service_id")]
        public Guid ServiceId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("facility_name")]
        public string FacilityName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
    }

    [Table("service_equipment")]
    public class ServiceEquipment
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("service_id")]
        public Guid ServiceId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("equipment_name")]
        public string EquipmentName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }
    }

    // ============================================
    // BOOKING RELATED
    // ============================================

    [Table("booking_status_history")]
    public class BookingStatusHistory
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("booking_id")]
        public Guid BookingId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("status")]
        public string Status { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        [Column("changed_by")]
        public Guid? ChangedBy { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }

        [ForeignKey("ChangedBy")]
        public User ChangedByUser { get; set; }
    }

    // ============================================
    // CAMPAIGN RELATED
    // ============================================

    [Table("campaign_interests")]
    public class CampaignInterest
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("campaign_id")]
        public Guid CampaignId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("interest")]
        public string Interest { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CampaignId")]
        public MarketingCampaign Campaign { get; set; }
    }

    [Table("campaign_performance")]
    public class CampaignPerformance
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("campaign_id")]
        public Guid CampaignId { get; set; }

        [Required]
        [Column("date")]
        public DateTime Date { get; set; }

        [Column("impressions")]
        public int Impressions { get; set; } = 0;

        [Column("clicks")]
        public int Clicks { get; set; } = 0;

        [Column("conversions")]
        public int Conversions { get; set; } = 0;

        [Column("spent_amount", TypeName = "decimal(10,2)")]
        public decimal SpentAmount { get; set; } = 0.00m;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("CampaignId")]
        public MarketingCampaign Campaign { get; set; }
    }
}
