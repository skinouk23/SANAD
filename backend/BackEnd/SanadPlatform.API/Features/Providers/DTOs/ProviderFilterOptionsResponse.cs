namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Response payload containing provider listing filter option values.
/// </summary>
public record ProviderFilterOptionsResponse
{
    /// <summary>Distinct approved-provider cities.</summary>
    public IReadOnlyList<string> Cities { get; init; } = Array.Empty<string>();

    /// <summary>Distinct approved-provider specialties.</summary>
    public IReadOnlyList<string> Specialties { get; init; } = Array.Empty<string>();

    /// <summary>Distinct approved nutrition provider subtype names.</summary>
    public IReadOnlyList<string> NutritionProviderSubtypes { get; init; } = Array.Empty<string>();
}
