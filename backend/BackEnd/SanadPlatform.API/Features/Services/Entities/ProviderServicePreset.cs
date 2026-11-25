using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Services.Entities;

/// <summary>
/// Represents a backend-owned provider service preset that can be localized and seeded by provider category.
/// </summary>
public class ProviderServicePreset : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // ==================== Code & Categorization ====================

    /// <summary>
    /// Provider category that owns this preset (for example: nurse, physiotherapist, nutritionist).
    /// </summary>
    public string ProviderCategory { get; set; } = string.Empty;

    /// <summary>
    /// Stable preset code used by shipped seed data and read contracts.
    /// </summary>
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

    // ==================== Common Draft Fields ====================

    public decimal Price { get; set; }

    public string PriceType { get; set; } = "fixed";

    public string Currency { get; set; } = "TND";

    public int? DurationMinutes { get; set; }

    public string ServiceLocation { get; set; } = "home";

    // ==================== Service Requirements ====================

    public bool RequiresPrescription { get; set; } = false;

    public bool IsUrgent { get; set; } = false;

    public bool RequiresMedicalHistory { get; set; } = false;

    // ==================== Category-specific Configuration ====================

    /// <summary>
    /// JSON string holding category-specific preset configuration and defaults.
    /// Stored as JSONB in PostgreSQL.
    /// </summary>
    public string? TypeConfig { get; set; }

    // ==================== Display ====================

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; } = 0;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
