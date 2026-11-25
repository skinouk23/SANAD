using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    // ============================================
    // FAMILY CIRCLE
    // ============================================

    [Table("family_members")]
    public class FamilyMember
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("first_name")]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("last_name")]
        public string LastName { get; set; }

        [MaxLength(50)]
        [Column("relationship")]
        public string Relationship { get; set; }

        [Column("date_of_birth")]
        public DateTime? DateOfBirth { get; set; }

        [MaxLength(20)]
        [Column("gender")]
        public string Gender { get; set; }

        [Column("medical_history")]
        public string MedicalHistory { get; set; }

        [Column("allergies")]
        public string Allergies { get; set; }

        [Column("current_medications")]
        public string CurrentMedications { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }

    // ============================================
    // REWARDS & GAMIFICATION
    // ============================================

    [Table("patient_rewards")]
    public class PatientReward
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Column("total_points")]
        public int TotalPoints { get; set; } = 0;

        [Column("current_streak")]
        public int CurrentStreak { get; set; } = 0;

        [Column("longest_streak")]
        public int LongestStreak { get; set; } = 0;

        [Column("total_bookings")]
        public int TotalBookings { get; set; } = 0;

        [Column("total_reviews_given")]
        public int TotalReviewsGiven { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }
    }

    [Table("badges")]
    public class Badge
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("icon_url")]
        public string IconUrl { get; set; }

        [Column("points_required")]
        public int? PointsRequired { get; set; }

        [MaxLength(50)]
        [Column("category")]
        public string Category { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<PatientBadge> PatientBadges { get; set; }
    }

    [Table("patient_badges")]
    public class PatientBadge
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("badge_id")]
        public Guid BadgeId { get; set; }

        [Column("earned_at")]
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        [ForeignKey("BadgeId")]
        public Badge Badge { get; set; }
    }

    [Table("reward_transactions")]
    public class RewardTransaction
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("points")]
        public int Points { get; set; }

        [MaxLength(50)]
        [Column("transaction_type")]
        public RewardTransactionType TransactionType { get; set; }

        [Column("reason")]
        public string Reason { get; set; }

        [Column("booking_id")]
        public Guid? BookingId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }
    }

    public enum RewardTransactionType
    {
        Earned,
        Redeemed,
        Expired
    }
}
