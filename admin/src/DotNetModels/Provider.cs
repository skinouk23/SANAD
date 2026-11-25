using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Provider profile entity (healthcare professionals, facilities)
    /// </summary>
    [Table("providers")]
    public class Provider
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("service_type")]
        public ServiceType ServiceType { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("business_name")]
        public string BusinessName { get; set; }

        [MaxLength(100)]
        [Column("first_name")]
        public string FirstName { get; set; }

        [MaxLength(100)]
        [Column("last_name")]
        public string LastName { get; set; }

        [MaxLength(100)]
        [Column("license_number")]
        public string LicenseNumber { get; set; }

        [MaxLength(200)]
        [Column("specialization")]
        public string Specialization { get; set; }

        [Column("years_of_experience")]
        public int? YearsOfExperience { get; set; }

        [Column("bio")]
        public string Bio { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [MaxLength(100)]
        [Column("city")]
        public string City { get; set; }

        [MaxLength(20)]
        [Column("postal_code")]
        public string PostalCode { get; set; }

        [Column("service_radius")]
        public int? ServiceRadius { get; set; }

        [Column("rating", TypeName = "decimal(3,2)")]
        public decimal Rating { get; set; } = 0.00m;

        [Column("total_reviews")]
        public int TotalReviews { get; set; } = 0;

        [Column("total_bookings")]
        public int TotalBookings { get; set; } = 0;

        [Column("is_approved")]
        public bool IsApproved { get; set; } = false;

        [Column("approval_date")]
        public DateTime? ApprovalDate { get; set; }

        [MaxLength(50)]
        [Column("subscription_tier")]
        public SubscriptionTier SubscriptionTier { get; set; } = SubscriptionTier.Basic;

        [Column("profile_picture_url")]
        public string ProfilePictureUrl { get; set; }

        [Column("cover_image_url")]
        public string CoverImageUrl { get; set; }

        [Column("is_online")]
        public bool IsOnline { get; set; } = false;

        [Column("last_online_at")]
        public DateTime? LastOnlineAt { get; set; }

        [Column("completion_rate", TypeName = "decimal(5,2)")]
        public decimal CompletionRate { get; set; } = 0.00m;

        [Column("response_rate", TypeName = "decimal(5,2)")]
        public decimal ResponseRate { get; set; } = 0.00m;

        [Column("average_response_time_minutes")]
        public int? AverageResponseTimeMinutes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<Service> Services { get; set; }
        public ICollection<ProviderCertification> Certifications { get; set; }
        public ICollection<ProviderDocument> Documents { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
        public ICollection<ProviderSchedule> Schedules { get; set; }
        public ICollection<ProviderUnavailability> Unavailabilities { get; set; }
        public ICollection<MarketingCampaign> MarketingCampaigns { get; set; }
        public ICollection<Subscription> Subscriptions { get; set; }
        public ICollection<InsuranceClaim> InsuranceClaims { get; set; }
        public ICollection<Payout> Payouts { get; set; }
        public ICollection<ProviderAvailabilityStatus> AvailabilityHistory { get; set; }
        public ICollection<PatientFavorite> FavoritedBy { get; set; }
    }

    public enum ServiceType
    {
        Nursing,
        NightCare,
        ElderlyCare,
        Physio,
        Nutrition,
        Ambulance,
        Equipment,
        Laboratory,
        Radiology,
        Gym
    }

    public enum SubscriptionTier
    {
        Basic,
        Premium,
        Elite
    }
}