using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Services.Entities;

/// <summary>
/// Represents service category configuration and settings.
/// Defines service categories, localization, commission rates, and display properties.
/// </summary>
public class ServiceCategoryConfig : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== Code & Identifiers ====================

    [SearchableEncrypted(Classification = DataClassification.Internal)]
    public string Code { get; set; } = string.Empty;

    // ==================== Localized Names ====================

    public string NameEn { get; set; } = string.Empty;

    public string NameFr { get; set; } = string.Empty;

    public string? NameAr { get; set; }

    public string? NameDe { get; set; }

    // ==================== Localized Descriptions ====================

    public string? DescriptionEn { get; set; }

    public string? DescriptionFr { get; set; }

    public string? DescriptionAr { get; set; }

    public string? DescriptionDe { get; set; }

    // ==================== Display Properties ====================

    /// <summary>
    /// Patient-facing browse group for the service selection screen.
    /// Powers the filter tabs: medical | daily | rehabilitation | wellness.
    /// </summary>
    public DisplayGroup DisplayGroup { get; set; }

    public string? Icon { get; set; }

    public string? Color { get; set; }

    /// <summary>
    /// Optional marketing badge label (e.g. "Premium", "Nouveau", "Abonnement").
    /// </summary>
    public string? Badge { get; set; }

    public decimal DefaultCommissionRate { get; set; } = 15m;

    // ==================== Market Pricing (Denormalized) ====================

    /// <summary>
    /// Minimum price across all active, approved provider services in this category.
    /// Updated periodically when provider services are created or modified.
    /// </summary>
    public decimal? MinPrice { get; set; }

    /// <summary>
    /// Maximum price across all active, approved provider services in this category.
    /// Updated periodically when provider services are created or modified.
    /// </summary>
    public decimal? MaxPrice { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
