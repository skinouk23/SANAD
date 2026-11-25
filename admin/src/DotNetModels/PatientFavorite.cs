using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Patient favorite providers
    /// </summary>
    [Table("patient_favorites")]
    public class PatientFavorite
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

        [Column("added_at")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }
    }
}
