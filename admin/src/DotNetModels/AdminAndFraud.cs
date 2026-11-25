using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareAtHome.Models
{
    // ============================================
    // SUBSCRIPTIONS
    // ============================================

    [Table("subscriptions")]
    public class Subscription
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("tier")]
        public SubscriptionTier Tier { get; set; }

        [MaxLength(50)]
        [Column("status")]
        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;

        [Required]
        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("end_date")]
        public DateTime? EndDate { get; set; }

        [Column("next_billing_date")]
        public DateTime? NextBillingDate { get; set; }

        [Required]
        [Column("monthly_price", TypeName = "decimal(10,2)")]
        public decimal MonthlyPrice { get; set; }

        [Column("commission_rate", TypeName = "decimal(5,2)")]
        public decimal? CommissionRate { get; set; }

        [Column("marketing_budget", TypeName = "decimal(10,2)")]
        public decimal? MarketingBudget { get; set; }

        [Column("priority_listing")]
        public bool PriorityListing { get; set; } = false;

        [Column("advanced_analytics")]
        public bool AdvancedAnalytics { get; set; } = false;

        [Column("auto_renew")]
        public bool AutoRenew { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        public ICollection<SubscriptionPayment> Payments { get; set; }
    }

    [Table("subscription_payments")]
    public class SubscriptionPayment
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("subscription_id")]
        public Guid SubscriptionId { get; set; }

        [Required]
        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [MaxLength(50)]
        [Column("payment_method")]
        public string PaymentMethod { get; set; }

        [MaxLength(50)]
        [Column("payment_status")]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        [Required]
        [Column("billing_period_start")]
        public DateTime BillingPeriodStart { get; set; }

        [Required]
        [Column("billing_period_end")]
        public DateTime BillingPeriodEnd { get; set; }

        [MaxLength(200)]
        [Column("payment_gateway_id")]
        public string PaymentGatewayId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("SubscriptionId")]
        public Subscription Subscription { get; set; }
    }

    public enum SubscriptionStatus
    {
        Active,
        Cancelled,
        Expired,
        Suspended
    }

    // ============================================
    // INSURANCE
    // ============================================

    [Table("insurance_claims")]
    public class InsuranceClaim
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Column("booking_id")]
        public Guid? BookingId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("claim_number")]
        public string ClaimNumber { get; set; }

        [Required]
        [MaxLength(200)]
        [Column("patient_name")]
        public string PatientName { get; set; }

        [MaxLength(100)]
        [Column("patient_insurance_number")]
        public string PatientInsuranceNumber { get; set; }

        [Required]
        [Column("service_date")]
        public DateTime ServiceDate { get; set; }

        [Column("service_description")]
        public string ServiceDescription { get; set; }

        [Required]
        [Column("claimed_amount", TypeName = "decimal(10,2)")]
        public decimal ClaimedAmount { get; set; }

        [Column("approved_amount", TypeName = "decimal(10,2)")]
        public decimal? ApprovedAmount { get; set; }

        [MaxLength(50)]
        [Column("status")]
        public InsuranceClaimStatus Status { get; set; } = InsuranceClaimStatus.Pending;

        [Column("submission_date")]
        public DateTime? SubmissionDate { get; set; }

        [Column("approval_date")]
        public DateTime? ApprovalDate { get; set; }

        [Column("payment_date")]
        public DateTime? PaymentDate { get; set; }

        [Column("rejection_reason")]
        public string RejectionReason { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        [Column("invoice_url")]
        public string InvoiceUrl { get; set; }

        [Column("medical_report_url")]
        public string MedicalReportUrl { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }
    }

    public enum InsuranceClaimStatus
    {
        Pending,
        Submitted,
        UnderReview,
        Approved,
        Rejected,
        Paid
    }

    // ============================================
    // PAYOUTS
    // ============================================

    [Table("payouts")]
    public class Payout
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("provider_id")]
        public Guid ProviderId { get; set; }

        [Required]
        [Column("amount", TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [MaxLength(50)]
        [Column("status")]
        public PayoutStatus Status { get; set; } = PayoutStatus.Pending;

        [MaxLength(50)]
        [Column("payout_method")]
        public PayoutMethod? PayoutMethod { get; set; }

        [MaxLength(100)]
        [Column("bank_account_number")]
        public string BankAccountNumber { get; set; }

        [MaxLength(200)]
        [Column("bank_name")]
        public string BankName { get; set; }

        [Column("processed_at")]
        public DateTime? ProcessedAt { get; set; }

        [Column("completed_at")]
        public DateTime? CompletedAt { get; set; }

        [Column("notes")]
        public string Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ProviderId")]
        public Provider Provider { get; set; }
    }

    public enum PayoutStatus
    {
        Pending,
        Processing,
        Completed,
        Failed
    }

    public enum PayoutMethod
    {
        BankTransfer,
        MobileMoney
    }

    // ============================================
    // FRAUD DETECTION
    // ============================================

    [Table("fraud_alerts")]
    public class FraudAlert
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [MaxLength(50)]
        [Column("alert_type")]
        public FraudAlertType AlertType { get; set; }

        [MaxLength(50)]
        [Column("severity")]
        public FraudSeverity Severity { get; set; }

        [Column("user_id")]
        public Guid? UserId { get; set; }

        [Column("booking_id")]
        public Guid? BookingId { get; set; }

        [Column("transaction_id")]
        public Guid? TransactionId { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("fraud_score", TypeName = "decimal(5,2)")]
        public decimal? FraudScore { get; set; }

        [MaxLength(50)]
        [Column("status")]
        public FraudAlertStatus Status { get; set; } = FraudAlertStatus.Pending;

        [Column("investigated_by")]
        public Guid? InvestigatedBy { get; set; }

        [Column("investigated_at")]
        public DateTime? InvestigatedAt { get; set; }

        [Column("resolution_notes")]
        public string ResolutionNotes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; }

        [ForeignKey("TransactionId")]
        public Transaction Transaction { get; set; }

        [ForeignKey("InvestigatedBy")]
        public User Investigator { get; set; }
    }

    public enum FraudAlertType
    {
        SuspiciousBooking,
        PaymentFraud,
        FakeReview,
        AccountTakeover,
        MultipleAccounts
    }

    public enum FraudSeverity
    {
        Low,
        Medium,
        High,
        Critical
    }

    public enum FraudAlertStatus
    {
        Pending,
        Investigating,
        Confirmed,
        FalsePositive,
        Resolved
    }

    [Table("user_behavior")]
    public class UserBehavior
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("action")]
        public string Action { get; set; }

        [MaxLength(45)]
        [Column("ip_address")]
        public string IpAddress { get; set; }

        [Column("user_agent")]
        public string UserAgent { get; set; }

        [MaxLength(200)]
        [Column("device_fingerprint")]
        public string DeviceFingerprint { get; set; }

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public User User { get; set; }
    }

    // ============================================
    // ADMIN
    // ============================================

    [Table("admin_actions")]
    public class AdminAction
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("admin_id")]
        public Guid AdminId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("action")]
        public string Action { get; set; }

        [MaxLength(50)]
        [Column("entity_type")]
        public string EntityType { get; set; }

        [Column("entity_id")]
        public Guid? EntityId { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("metadata", TypeName = "jsonb")]
        public string Metadata { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("AdminId")]
        public User Admin { get; set; }
    }

    [Table("system_settings")]
    public class SystemSetting
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        [Column("setting_key")]
        public string SettingKey { get; set; }

        [Column("setting_value")]
        public string SettingValue { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("updated_by")]
        public Guid? UpdatedBy { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UpdatedBy")]
        public User UpdatedByUser { get; set; }
    }
}
