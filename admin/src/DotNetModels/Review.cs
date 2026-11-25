using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Review entity for provider ratings
    /// </summary>
    [Table("reviews")]
    public class Review
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("booking_id")]
        public Guid BookingId { get; set; }

        [Required]
        [Column("patient_id")]
        public Guid PatientId { get; set; }

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [Range(1, 5)]
        [Column("rating")]
        public int Rating { get; set; }

        [Column("comment")]
        public string Comment { get; set; }

        [Range(1, 5)]
        [Column("professionalism_rating")]
        public int? ProfessionalismRating { get; set; }

        [Range(1, 5)]
        [Column("punctuality_rating")]
        public int? PunctualityRating { get; set; }

        [Range(1, 5)]
        [Column("quality_rating")]
        public int? QualityRating { get; set; }

        [Column("is_verified")]
        public bool IsVerified { get; set; } = true;

        [Column("is_visible")]
        public bool IsVisible { get; set; } = true;

        [Column("provider_response")]
        public string ProviderResponse { get; set; }

        [Column("provider_responded_at")]
        public DateTime? ProviderRespondedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }

        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }
    }
}
