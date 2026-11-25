using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Provider document entity for licenses, insurance, etc.
    /// </summary>
    [Table("provider_documents")]
    public class ProviderDocument
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("document_type")]
        public DocumentType DocumentType { get; set; }

        [Required]
        [Column("document_url")]
        public string DocumentUrl { get; set; }

        [Column("verified")]
        public bool Verified { get; set; } = false;

        [Column("verified_by")]
        public Guid? VerifiedBy { get; set; }

        [Column("verified_at")]
        public DateTime? VerifiedAt { get; set; }

        [Column("expiry_date")]
        public DateTime? ExpiryDate { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        [ForeignKey("VerifiedBy")]
        public User VerifiedByUser { get; set; }
    }

    public enum DocumentType
    {
        License,
        Insurance,
        IdCard,
        Diploma,
        Other
    }
}
