namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Data transfer object for provider notification and privacy preferences.
/// </summary>
public record ProviderPreferencesResponse
{
    public bool EmailNotifications { get; init; }
    public bool SmsNotifications { get; init; }
    public bool PushNotifications { get; init; }
    public bool MarketingEmails { get; init; }

    public bool AllowPatientMessages { get; init; }
    public string ProfileVisibility { get; init; } = "public";

    public DateTime UpdatedAt { get; init; }
}
