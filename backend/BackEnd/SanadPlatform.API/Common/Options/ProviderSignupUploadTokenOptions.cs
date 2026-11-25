using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// Signed draft application token settings for anonymous provider signup file uploads.
/// </summary>
public class ProviderSignupUploadTokenOptions
{
    public const string SectionName = "ProviderSignupUploadTokens";
    public const string UploadTokenHeaderName = "X-Provider-Signup-Upload-Token";
    public const string ApplicationUploadTokenHeaderName = "X-Application-Upload-Token";

    [Required]
    [MinLength(32)]
    public string SigningKey { get; set; } = string.Empty;

    [Range(1, 1440)]
    public int ExpirationMinutes { get; set; } = 30;

    [Range(1, 100)]
    public int MaxFilesPerApplication { get; set; } = 20;
}
