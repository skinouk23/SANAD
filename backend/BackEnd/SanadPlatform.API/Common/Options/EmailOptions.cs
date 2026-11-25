using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// SMTP email delivery options.
/// </summary>
public class EmailOptions
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "Email";

    /// <summary>SMTP server host name.</summary>
    [Required(AllowEmptyStrings = false)]
    public string SmtpServer { get; set; } = string.Empty;

    /// <summary>SMTP server port.</summary>
    [Range(1, 65535)]
    public int SmtpPort { get; set; } = 587;

    /// <summary>Email address used as the sender.</summary>
    [Required(AllowEmptyStrings = false)]
    [EmailAddress]
    public string SenderEmail { get; set; } = string.Empty;

    /// <summary>Password or app password used to authenticate with SMTP.</summary>
    [Required(AllowEmptyStrings = false)]
    public string SenderPassword { get; set; } = string.Empty;

    /// <summary>Display name used in outbound emails.</summary>
    [Required(AllowEmptyStrings = false)]
    public string SenderName { get; set; } = "Sanad";

    /// <summary>Whether to connect with STARTTLS.</summary>
    public bool UseStartTls { get; set; } = true;
}
