using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Strongly-typed options for security configuration.
/// Bound from the "Security" configuration section.
/// </summary>
public class SecuritySettings
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "Security";

    /// <summary>
    /// Base64-encoded AES-256 key used by the <c>EncryptionService</c> to
    /// encrypt and decrypt sensitive fields at rest. Must be set in production.
    /// </summary>
    [Required(AllowEmptyStrings = false)]
    public string EncryptionKey { get; set; } = string.Empty;

    /// <summary>Certificate pinning configuration.</summary>
    public CertificatePinningSettings CertificatePinning { get; set; } = new();
}

/// <summary>
/// Strongly-typed options for TLS certificate pinning.
/// Bound from the "Security:CertificatePinning" configuration sub-section.
/// </summary>
public class CertificatePinningSettings
{
    /// <summary>
    /// List of trusted certificate thumbprints.
    /// If empty, certificate pinning is disabled.
    /// </summary>
    public string[] Thumbprints { get; set; } = Array.Empty<string>();
}
