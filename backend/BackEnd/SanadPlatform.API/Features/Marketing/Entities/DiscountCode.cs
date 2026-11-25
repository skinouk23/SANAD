using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Marketing.Entities;

/// <summary>
/// Represents a discount code for marketing promotions.
/// Stores discount rules, validity period, usage limits, and restrictions.
/// </summary>
public class DiscountCode : IAuditableEntity
{
    public Guid Id { get; set; }

    // ==================== Code Info ====================

    [SearchableEncrypted(Classification = DataClassification.Internal)]
    public string Code { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Description { get; set; }

    // ==================== Discount Details ====================

    public string DiscountType { get; set; } = string.Empty;

    public decimal DiscountValue { get; set; }

    public decimal? MaxDiscountAmount { get; set; }

    // ==================== Validity Period ====================

    public DateTime ValidFrom { get; set; }

    public DateTime ValidUntil { get; set; }

    // ==================== Usage Limits ====================

    public int? MaxUses { get; set; }

    public int MaxUsesPerUser { get; set; } = 1;

    public int CurrentUses { get; set; }

    // ==================== Restrictions ====================

    public decimal? MinOrderAmount { get; set; }

    public List<Guid>? ApplicableServices { get; set; }

    public List<string>? ApplicableCategories { get; set; }

    public bool FirstBookingOnly { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual ICollection<DiscountCodeUsage> Usages { get; set; } = new List<DiscountCodeUsage>();
}
