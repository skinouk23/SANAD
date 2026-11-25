using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Equipment.Entities;

/// <summary>
/// Represents an equipment category (e.g. wheelchair, hospital bed, oxygen concentrator).
/// Mirrors the structure of <see cref="SanadPlatform.API.Features.Services.Entities.ServiceCategoryConfig"/> — code-keyed, localised, with a
/// default commission rate and display ordering.
/// </summary>
public class EquipmentCategoryConfig : IHasCreatedAt
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

    // ==================== Display Properties ====================

    public string? Icon { get; set; }

    public string? Color { get; set; }

    public decimal DefaultCommissionRate { get; set; } = 15m;

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}