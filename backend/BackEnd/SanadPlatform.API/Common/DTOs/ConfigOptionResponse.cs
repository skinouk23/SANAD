namespace SanadPlatform.API.Common.DTOs;

/// <summary>
/// Represents a localized configuration option for public booking flows.
/// </summary>
public record ConfigOptionResponse
{
    public string Code { get; init; } = string.Empty;

    public string Label { get; init; } = string.Empty;

    public string? Icon { get; init; }

    public string? Color { get; init; }
}
