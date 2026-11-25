using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Patient profile entity
    /// </summary>
    [Table("patients")]
    public class Patient
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("first_name")]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("last_name")]
        public string LastName { get; set; }

        [Column("date_of_birth")]
        public DateTime? DateOfBirth { get; set; }

        [MaxLength(20)]
        [Column("gender")]
        public Gender? Gender { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [MaxLength(100)]
        [Column("city")]
        public string City { get; set; }

        [MaxLength(20)]
        [Column("postal_code")]
        public string PostalCode { get; set; }

        [MaxLength(200)]
        [Column("emergency_contact_name")]
        public string EmergencyContactName { get; set; }

        [MaxLength(20)]
        [Column("emergency_contact_phone")]
        public string EmergencyContactPhone { get; set; }

        [MaxLength(50)]
        [Column("emergency_contact_relationship")]
        public string EmergencyContactRelationship { get; set; }

        [Column("medical_history")]
        public string MedicalHistory { get; set; }

        [Column("allergies")]
        public string Allergies { get; set; }

        [Column("current_medications")]
        public string CurrentMedications { get; set; }

        [MaxLength(200)]
        [Column("insurance_provider")]
        public string InsuranceProvider { get; set; }

        [MaxLength(100)]
        [Column("insurance_number")]
        public string InsuranceNumber { get; set; }

        [Column("profile_picture_url")]
        public string ProfilePictureUrl { get; set; }

        // NEW: Patient engagement tracking
        [Column("care_streak_days")]
        public int CareStreakDays { get; set; } = 0;

        [Column("longest_care_streak")]
        public int LongestCareStreak { get; set; } = 0;

        [Column("last_activity_date")]
        public DateTime? LastActivityDate { get; set; }

        [Column("total_points")]
        public int TotalPoints { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Transaction> Transactions { get; set; }
        public ICollection<FamilyMember> FamilyMembers { get; set; }
        public ICollection<ActivityTracking> ActivityTrackings { get; set; }
        public ICollection<HydrationTracking> HydrationTrackings { get; set; }
        public ICollection<NutritionTracking> NutritionTrackings { get; set; }
        public NutritionProfile NutritionProfile { get; set; }
        public PatientReward PatientReward { get; set; }
        public ICollection<PatientBadge> PatientBadges { get; set; }
        public ICollection<RewardTransaction> RewardTransactions { get; set; }
        public PatientPreferences Preferences { get; set; }
        public ICollection<PatientFavorite> Favorites { get; set; }
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }
}