using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Main user entity for patients, providers, and admins
    /// </summary>
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(255)]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("password_hash")]
        public string PasswordHash { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("role")]
        public UserRole Role { get; set; }

        [MaxLength(20)]
        [Column("phone")]
        public string Phone { get; set; }

        [Column("is_verified")]
        public bool IsVerified { get; set; } = false;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("last_login")]
        public DateTime? LastLogin { get; set; }

        [Column("profile_completed")]
        public bool ProfileCompleted { get; set; } = false;

        // Navigation properties
        public Patient Patient { get; set; }
        public Provider Provider { get; set; }
        public ICollection<Message> SentMessages { get; set; }
        public ICollection<Message> ReceivedMessages { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<UserBehavior> BehaviorLogs { get; set; }
        public ICollection<AdminAction> AdminActions { get; set; }
    }

    public enum UserRole
    {
        Patient,
        Provider,
        Admin
    }

    public enum UserStatus
    {
        Active,
        Inactive,
        Suspended,
        Pending
    }

    public enum UserSegment
    {
        Vip,
        Active,
        Occasional,
        Inactive,
        AtRisk
    }
}
