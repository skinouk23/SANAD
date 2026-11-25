using System;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Represents provider verification documents.
/// </summary>
public class ProviderDocument : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }

    // ==================== Document Info ====================

    public string DocumentType { get; set; } = string.Empty;

    public string? DocumentName { get; set; }

    public Guid FileId { get; set; }

    public int? FileSizeBytes { get; set; }

    public string? MimeType { get; set; }

    // ==================== Extracted Data ====================

    public string? ExtractedData { get; set; }

    // ==================== Verification ====================

    public bool IsVerified { get; set; } = false;

    public DateTime? VerifiedAt { get; set; }

    public Guid? VerifiedBy { get; set; }

    public string? VerificationNotes { get; set; }

    // ==================== Validity ====================

    public DateOnly? IssueDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public bool IsExpired { get; set; } = false;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
    public virtual StoredFile File { get; set; } = null!;
}
