using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Notifications.Entities;

/// <summary>
/// Represents a notification for a user.
/// </summary>
public class Notification : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    // ==================== Content ====================

    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    // ==================== Related Entities ====================

    public Guid? BookingId { get; set; }

    public Guid? ProviderId { get; set; }

    // ==================== Action ====================

    public string? ActionUrl { get; set; }

    public string? ActionData { get; set; }

    // ==================== Status ====================

    public bool IsRead { get; set; } = false;

    public DateTime? ReadAt { get; set; }

    // ==================== Delivery ====================

    public bool SentViaPush { get; set; } = false;

    public bool SentViaEmail { get; set; } = false;

    public bool SentViaSms { get; set; } = false;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
}

/// <summary>
/// Represents a push notification token.
/// </summary>
public class PushToken : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string Token { get; set; } = string.Empty;

    public string Platform { get; set; } = string.Empty;

    public string? DeviceId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
}
