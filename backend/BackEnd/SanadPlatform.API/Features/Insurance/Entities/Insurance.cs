using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Insurance.Entities;

/// <summary>
/// Represents a medical insurance claim filed by a provider.
/// </summary>
public class InsuranceClaim : IAuditableEntity
{
    public Guid Id { get; set; }

    public string ClaimNumber { get; set; } = string.Empty;

    // ==================== Foreign Keys ====================

    public Guid ProviderId { get; set; }

    public Guid? BookingId { get; set; }

    // ==================== Patient Info ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string PatientName { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? PatientInsuranceProvider { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? PatientInsuranceNumber { get; set; }

    // ==================== Service Info ====================

    public DateOnly ServiceDate { get; set; }

    public string ServiceDescription { get; set; } = string.Empty;

    public List<string>? DiagnosisCodes { get; set; }

    public List<string>? ProcedureCodes { get; set; }

    // ==================== Amounts ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public decimal ClaimedAmount { get; set; }

    public decimal? ApprovedAmount { get; set; }

    public decimal? PaidAmount { get; set; }

    // ==================== Status ====================

    public string Status { get; set; } = "draft";

    // ==================== Dates ====================

    public DateTime? SubmittedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    // ==================== Review ====================

    public string? RejectionReason { get; set; }

    public string? ReviewerNotes { get; set; }

    // ==================== Documents ====================

    public string? InvoiceUrl { get; set; }

    public string? MedicalReportUrl { get; set; }

    public List<string>? SupportingDocuments { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
}
