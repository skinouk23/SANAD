namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for updating patient preferences.
/// All fields are optional to support partial updates.
/// </summary>
public record UpdatePatientPreferencesRequest(
    bool? EmailNotifications = null,
    bool? SmsNotifications = null,
    bool? PushNotifications = null,
    bool? MarketingEmails = null,
    bool? AutoValidationEnabled = null,
    int? ValidationReminderHours = null,
    bool? ShareWithFamily = null,
    bool? AllowProviderMessages = null);
