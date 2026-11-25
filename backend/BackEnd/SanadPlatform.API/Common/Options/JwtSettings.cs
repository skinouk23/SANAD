using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Strongly-typed options for JWT authentication configuration.
/// Bound from the "JwtSettings" configuration section.
/// </summary>
public class JwtSettings
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "JwtSettings";

    /// <summary>HMAC-SHA256 signing key. Must be at least 32 characters (256 bits).</summary>
    [Required(AllowEmptyStrings = false)]
    [MinLength(32)]
    public string SecretKey { get; set; } = string.Empty;

    /// <summary>Token issuer identifier.</summary>
    [Required(AllowEmptyStrings = false)]
    public string Issuer { get; set; } = "SanadPlatform";

    /// <summary>Token audience identifier.</summary>
    [Required(AllowEmptyStrings = false)]
    public string Audience { get; set; } = "SanadPlatformAPI";

    /// <summary>Access token lifetime in minutes. Defaults to 15.</summary>
    [Range(1, 10080)] // max 1 week
    public int ExpiryMinutes { get; set; } = 15;

    /// <summary>Refresh token lifetime in days. Defaults to 30.</summary>
    [Range(1, 90)]
    public int RefreshTokenExpiryDays { get; set; } = 30;
}
