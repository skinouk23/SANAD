using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Notifications.Entities;

public class WebPushSubscription : IAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string Endpoint { get; set; } = string.Empty;

    public string P256dh { get; set; } = string.Empty;

    public string Auth { get; set; } = string.Empty;

    public DateTime? ExpirationTime { get; set; }

    public string? UserAgent { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? LastUsedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
