using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Providers.Entities;

/// <summary>
/// Stores notification and privacy settings for a provider.
/// Linked 1-to-1 with the provider profile.
/// </summary>
public class ProviderPreferences : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid ProviderId { get; set; }
    public virtual Provider Provider { get; set; } = null!;

    // ==================== Notification Toggles ====================

    public bool EmailNotifications { get; set; } = true;
    public bool SmsNotifications { get; set; } = true;
    public bool PushNotifications { get; set; } = true;
    public bool MarketingEmails { get; set; } = false;

    // ==================== Privacy Settings ====================

    public bool AllowPatientMessages { get; set; } = true;
    public string ProfileVisibility { get; set; } = "public";

    // ==================== Metadata ====================

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
