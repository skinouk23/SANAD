using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Storage;

namespace SanadPlatform.API.Features.Files.Entities;

/// <summary>
/// Canonical backend-owned file metadata row. Bucket and object keys are internal only.
/// </summary>
public class StoredFile : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public FileUseCase UseCase { get; set; }
    public FileCategory Category { get; set; }
    public FileVisibility Visibility { get; set; }
    public StoredFileStatus Status { get; set; } = StoredFileStatus.PendingScan;
    public FileScanStatus ScanStatus { get; set; } = FileScanStatus.Pending;
    public FileScanVerdict ScanVerdict { get; set; } = FileScanVerdict.Unknown;
    public string? ScanEngine { get; set; }
    public string? ScanEngineVersion { get; set; }
    public string Bucket { get; set; } = string.Empty;
    public string ObjectKey { get; set; } = string.Empty;
    public string? ObjectVersionId { get; set; }
    public string StagingBucket { get; set; } = string.Empty;
    public string StagingObjectKey { get; set; } = string.Empty;
    public string? QuarantineBucket { get; set; }
    public string? QuarantineObjectKey { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string DeclaredContentType { get; set; } = string.Empty;
    public string? DetectedContentType { get; set; }
    public long SizeBytes { get; set; }
    public string Sha256 { get; set; } = string.Empty;
    public string? ETag { get; set; }
    public Guid? OwnerUserId { get; set; }
    public string? OwnerRole { get; set; }
    public Guid? RelatedPatientId { get; set; }
    public Guid? RelatedProviderId { get; set; }
    public Guid? RelatedServiceId { get; set; }
    public Guid? RelatedBookingId { get; set; }
    public Guid? RelatedApplicationId { get; set; }
    public RetentionPolicy RetentionPolicy { get; set; } = RetentionPolicy.Standard1Year;
    public DateTime? RetentionExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? ReadyAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? RejectionReason { get; set; }

    public virtual ICollection<FileAccessAudit> AccessAudits { get; set; } = new List<FileAccessAudit>();
}
