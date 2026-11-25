using System.Text.Json;

namespace SanadPlatform.API.Features.Services.DTOs;

// ==================== Provider Service Preset Response DTOs ====================

/// <summary>
/// Localized provider service preset returned to the authenticated provider.
/// </summary>
public record ProviderServicePresetResponse
{
    public Guid Id { get; init; }

    public string Code { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public int DisplayOrder { get; init; }

    public ProviderServicePresetDraftPayload Draft { get; init; } = null!;
}

/// <summary>
/// Draft payload shaped like the create-service contract so the frontend can apply it directly.
/// </summary>
public record ProviderServicePresetDraftPayload
{
    public decimal Price { get; init; }

    public string PriceType { get; init; } = "fixed";

    public string Currency { get; init; } = "TND";

    public int? DurationMinutes { get; init; }

    public string ServiceLocation { get; init; } = "home";

    public bool RequiresPrescription { get; init; }

    public bool IsUrgent { get; init; }

    public bool RequiresMedicalHistory { get; init; }

    public JsonElement? TypeConfig { get; init; }
}
