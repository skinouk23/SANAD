using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Admin.Entities;

/// <summary>
/// Represents an audit log entry for data changes.
/// </summary>
public class AuditLog : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== What Changed ====================

    public string TableName { get; set; } = string.Empty;

    public Guid RecordId { get; set; }

    public string Action { get; set; } = string.Empty;

    // ==================== Who Changed ====================

    public Guid? UserId { get; set; }

    // ==================== Changes ====================

    public string? OldData { get; set; }

    public string? NewData { get; set; }

    public List<string>? ChangedFields { get; set; }

    // ==================== Context ====================

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
