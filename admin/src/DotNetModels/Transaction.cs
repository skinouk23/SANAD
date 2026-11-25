using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    /// <summary>
    /// Transaction entity for payments and escrow
    /// </summary>
    [Table("transactions")]
    public class Transaction
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
        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [Required]
        [Column("platform_fee", TypeName = "decimal(10,2)")]
        public decimal PlatformFee { get; set; }

        [Required]
        [Column("provider_amount", TypeName = "decimal(10,2)")]
        public decimal ProviderAmount { get; set; }

        [MaxLength(50)]
        [Column("payment_method")]
        public PaymentMethod? PaymentMethod { get; set; }

        [MaxLength(50)]
        [Column("payment_status")]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        [Column("held_at")]
        public DateTime? HeldAt { get; set; }

        [Column("released_at")]
        public DateTime? ReleasedAt { get; set; }

        [Column("refunded_at")]
        public DateTime? RefundedAt { get; set; }

        [MaxLength(200)]
        [Column("payment_gateway_id")]
        public string PaymentGatewayId { get; set; }

        [Column("payment_gateway_response")]
        public string PaymentGatewayResponse { get; set; }

        [Column("fraud_score", TypeName = "decimal(5,2)")]
        public decimal? FraudScore { get; set; }

        [Column("fraud_flags")]
        public string FraudFlags { get; set; }

        [Column("is_flagged")]
        public bool IsFlagged { get; set; } = false;

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

    public enum PaymentMethod
    {
        Card,
        D17,
        Sobflous,
        Cash
    }

    public enum PaymentStatus
    {
        Pending,
        Held,
        Released,
        Refunded,
        Failed
    }
}
