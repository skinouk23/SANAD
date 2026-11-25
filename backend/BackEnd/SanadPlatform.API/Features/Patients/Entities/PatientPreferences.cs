using System;
using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Patients.Entities;

/// <summary>
/// Stores granular notification and privacy settings for a patient.
/// Linked 1-to-1 with the Patient profile.
/// </summary>
public class PatientPreferences : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid PatientId { get; set; }
    public virtual Patient Patient { get; set; } = null!;

    // ==================== Notification Toggles ====================
    
    public bool EmailNotifications { get; set; } = true;
    public bool SmsNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public bool MarketingEmails { get; set; } = false;

    // ==================== Booking Behavior ====================

    public bool AutoValidationEnabled { get; set; } = false;
    public int ValidationReminderHours { get; set; } = 24;

    // ==================== Privacy Settings ====================

    public bool ShareWithFamily { get; set; } = true;
    public bool AllowProviderMessages { get; set; } = true;

    // ==================== Metadata ====================

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
