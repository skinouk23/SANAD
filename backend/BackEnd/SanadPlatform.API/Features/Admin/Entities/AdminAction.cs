using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Admin.Entities;

/// <summary>
/// Represents an admin action log entry.
/// </summary>
public class AdminAction : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid AdminId { get; set; }

    // ==================== Action ====================

    public string Action { get; set; } = string.Empty;

    public string? EntityType { get; set; }

    public Guid? EntityId { get; set; }

    // ==================== Details ====================

    public string? Description { get; set; }

    public string? OldValues { get; set; }

    public string? NewValues { get; set; }

    // ==================== Context ====================

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
