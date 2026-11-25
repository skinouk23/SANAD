using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Strongly-typed options for CORS policy configuration.
/// Bound from the "CorsSettings" configuration section.
/// </summary>
public class CorsSettings
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "CorsSettings";

    /// <summary>
    /// Allowed origin URLs for the frontend CORS policy.
    /// Defaults to localhost:5173 (Vite dev server).
    /// </summary>
    [Required]
    [MinLength(1)]
    public string[] AllowedOrigins { get; set; } = new[] { "http://localhost:5173" };
}
