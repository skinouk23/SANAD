using System;

namespace SanadPlatform.API.Features.Patients.DTOs;

/// <summary>
/// Data transfer object for patient notification and privacy preferences.
/// </summary>
public record PatientPreferencesResponse
{
    public bool EmailNotifications { get; init; }
    public bool SmsNotifications { get; init; }
    public bool PushNotifications { get; init; }
    public bool MarketingEmails { get; init; }

    public bool AutoValidationEnabled { get; init; }
    public int ValidationReminderHours { get; init; }

    public bool ShareWithFamily { get; init; }
    public bool AllowProviderMessages { get; init; }

    public DateTime UpdatedAt { get; init; }
}
