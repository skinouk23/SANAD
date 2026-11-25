using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Provider availability status tracking (online/offline history)
    /// </summary>
    [Table("provider_availability_status")]
    public class ProviderAvailabilityStatus
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [Column("is_available")]
        public bool IsAvailable { get; set; }

        [Column("status_changed_at")]
        public DateTime StatusChangedAt { get; set; } = DateTime.UtcNow;

        [Column("changed_by")]
        public Guid? ChangedBy { get; set; }

        [Column("reason")]
        public string Reason { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        [ForeignKey("ChangedBy")]
        public User ChangedByUser { get; set; }
    }
}
