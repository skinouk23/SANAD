using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Files.Entities;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Represents provider certifications.
/// </summary>
public class ProviderCertification : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }

    // ==================== Certification Info ====================

    public string CertificationName { get; set; } = string.Empty;

    public string? IssuingOrganization { get; set; }

    public string? CertificationNumber { get; set; }

    public DateOnly? IssueDate { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public Guid? FileId { get; set; }

    // ==================== Verification ====================

    public bool IsVerified { get; set; } = false;

    public DateTime? VerifiedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;
    public virtual StoredFile? File { get; set; }
}
