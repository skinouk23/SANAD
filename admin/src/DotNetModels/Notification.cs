using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Notification entity for user notifications
    /// </summary>
    [Table("notifications")]
    public class Notification
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("type")]
        public string Type { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("title")]
        public string Title { get; set; }

        [Required]
        [Column("message")]
        public string Message { get; set; }

        [Column("is_read")]
        public bool IsRead { get; set; } = false;

        [Column("read_at")]
        public DateTime? ReadAt { get; set; }

        [Column("action_url")]
        public string ActionUrl { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
