using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Common.Options;

/// <summary>
/// SMS delivery options for authentication messages.
/// </summary>
public class SmsOptions
{
    /// <summary>The configuration section name.</summary>
    public const string SectionName = "Sms";

    /// <summary>SMS provider name.</summary>
    public string Provider { get; set; } = "TunisieSMS";

    /// <summary>Whether live provider delivery is enabled.</summary>
    public bool Enabled { get; set; } = false;

    /// <summary>TunisieSMS API endpoint URL supplied by the provider.</summary>
    public string ApiUrl { get; set; } = string.Empty;

    /// <summary>TunisieSMS client identifier supplied by the provider.</summary>
    public string ClientId { get; set; } = string.Empty;

    /// <summary>TunisieSMS API key or password supplied by the provider.</summary>
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>Registered SMS sender name.</summary>
    [MaxLength(11)]
    public string SenderName { get; set; } = "SANAD";

    /// <summary>Default supported country code for this slice.</summary>
    public string DefaultCountryCode { get; set; } = "TN";

}
