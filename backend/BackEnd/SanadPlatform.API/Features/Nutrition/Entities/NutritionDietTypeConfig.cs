using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Nutrition.Entities;

/// <summary>
/// Represents a localized nutrition diet type option.
/// </summary>
public class NutritionDietTypeConfig : IHasCreatedAt
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

    // ==================== Display Properties ====================

    public string? Icon { get; set; }

    public string? Color { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
