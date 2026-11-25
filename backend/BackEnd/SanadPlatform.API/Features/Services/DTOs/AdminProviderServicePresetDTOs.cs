using System.Text.Json;

namespace SanadPlatform.API.Features.Services.DTOs;

// ==================== Admin Provider Service Preset DTOs ====================

/// <summary>
/// Admin response exposing the full raw preset payload, including all localized fields.
/// </summary>
public record AdminProviderServicePresetResponse
{
    public Guid Id { get; init; }

    public string ProviderCategory { get; init; } = string.Empty;

    public string Code { get; init; } = string.Empty;

    public string NameEn { get; init; } = string.Empty;

    public string NameFr { get; init; } = string.Empty;

    public string? NameAr { get; init; }

    public string? NameDe { get; init; }

    public string? DescriptionEn { get; init; }

    public string? DescriptionFr { get; init; }

    public string? DescriptionAr { get; init; }

    public string? DescriptionDe { get; init; }

    public decimal Price { get; init; }

    public string PriceType { get; init; } = "fixed";

    public string Currency { get; init; } = "TND";

    public int? DurationMinutes { get; init; }

    public string ServiceLocation { get; init; } = "home";

    public bool RequiresPrescription { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresMedicalHistory { get; init; }

    public JsonElement? TypeConfig { get; init; }

    public bool IsActive { get; init; }

    public int DisplayOrder { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Request payload for creating a provider service preset.
/// </summary>
public record CreateProviderServicePresetRequest
{
    public string ProviderCategory { get; init; } = string.Empty;

    public string Code { get; init; } = string.Empty;

    public string NameEn { get; init; } = string.Empty;

    public string NameFr { get; init; } = string.Empty;

    public string? NameAr { get; init; }

    public string? NameDe { get; init; }

    public string? DescriptionEn { get; init; }

    public string? DescriptionFr { get; init; }

    public string? DescriptionAr { get; init; }

    public string? DescriptionDe { get; init; }

    public decimal Price { get; init; }

    public string PriceType { get; init; } = "fixed";

    public string Currency { get; init; } = "TND";

    public int? DurationMinutes { get; init; }

    public string ServiceLocation { get; init; } = "home";

    public bool RequiresPrescription { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresMedicalHistory { get; init; }

    public JsonElement? TypeConfig { get; init; }

    public bool IsActive { get; init; } = true;

    public int DisplayOrder { get; init; }
}

/// <summary>
/// Request payload for updating a provider service preset.
/// Provider category and code are immutable and therefore excluded.
/// </summary>
public record UpdateProviderServicePresetRequest
{
    public string NameEn { get; init; } = string.Empty;

    public string NameFr { get; init; } = string.Empty;

    public string? NameAr { get; init; }

    public string? NameDe { get; init; }

    public string? DescriptionEn { get; init; }

    public string? DescriptionFr { get; init; }

    public string? DescriptionAr { get; init; }

    public string? DescriptionDe { get; init; }

    public decimal Price { get; init; }

    public string PriceType { get; init; } = "fixed";

    public string Currency { get; init; } = "TND";

    public int? DurationMinutes { get; init; }

    public string ServiceLocation { get; init; } = "home";

    public bool RequiresPrescription { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresMedicalHistory { get; init; }

    public JsonElement? TypeConfig { get; init; }

    public bool IsActive { get; init; }

    public int DisplayOrder { get; init; }
}

/// <summary>
/// Request payload for toggling preset activation.
/// </summary>
public record ToggleProviderServicePresetRequest
{
    public bool IsActive { get; init; }
}

/// <summary>
/// Request payload for reordering presets within a provider category.
/// </summary>
public record ReorderProviderServicePresetsRequest
{
    public string ProviderCategory { get; init; } = string.Empty;

    public IReadOnlyList<Guid> OrderedIds { get; init; } = Array.Empty<Guid>();
}
