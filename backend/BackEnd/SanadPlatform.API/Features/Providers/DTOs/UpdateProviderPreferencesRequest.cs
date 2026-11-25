namespace SanadPlatform.API.Features.Providers.DTOs;

/// <summary>
/// Data transfer object for updating provider preferences.
/// All fields are optional to support partial updates.
/// </summary>
public record UpdateProviderPreferencesRequest(
    bool? EmailNotifications = null,
    bool? SmsNotifications = null,
    bool? PushNotifications = null,
    bool? MarketingEmails = null,
    bool? AllowPatientMessages = null,
    string? ProfileVisibility = null);
