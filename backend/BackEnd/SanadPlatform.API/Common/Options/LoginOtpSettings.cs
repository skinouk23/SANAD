using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Settings for login one-time password challenges.
/// </summary>
public class LoginOtpSettings
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "LoginOtpSettings";

    /// <summary>Number of numeric digits in generated codes.</summary>
    [Range(4, 10)]
    public int CodeLength { get; set; } = 6;

    /// <summary>How long a code remains valid, in seconds.</summary>
    [Range(60, 1800)]
    public int ExpirationSeconds { get; set; } = 300;

    /// <summary>How long the UI should wait before offering resend, in seconds.</summary>
    [Range(10, 600)]
    public int ResendCooldownSeconds { get; set; } = 60;

    /// <summary>Maximum failed verification attempts before a challenge is locked.</summary>
    [Range(1, 10)]
    public int MaxFailedAttempts { get; set; } = 5;

    /// <summary>Server-side secret used to HMAC OTP codes and destinations.</summary>
    [Required(AllowEmptyStrings = false)]
    [MinLength(32)]
    public string CodeHashSecret { get; set; } = string.Empty;
}
