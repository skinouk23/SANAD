using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Admin.Entities;

/// <summary>
/// Represents a system configuration setting.
/// </summary>
public class SystemSetting : IAuditableEntity
{
    public Guid Id { get; set; }

    // ==================== Setting ====================

    public string SettingKey { get; set; } = string.Empty;

    public string? SettingValue { get; set; }

    public string SettingType { get; set; } = "string";

    // ==================== Description ====================

    public string? Description { get; set; }

    public bool IsPublic { get; set; }

    // ==================== Audit ====================

    public Guid? UpdatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
