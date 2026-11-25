using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Reviews.Entities;

/// <summary>
/// Represents a report of an inappropriate or problematic review.
/// </summary>
public class ReviewReport : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ReviewId { get; set; }

    // ==================== Report Details ====================

    public Guid ReportedBy { get; set; }

    public string Reason { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Description { get; set; }

    // ==================== Resolution ====================

    public string Status { get; set; } = "pending";

    public DateTime? ResolvedAt { get; set; }

    public Guid? ResolvedBy { get; set; }

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? ResolutionNotes { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Review Review { get; set; } = null!;
}
