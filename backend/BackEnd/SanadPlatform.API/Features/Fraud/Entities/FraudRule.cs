using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Fraud.Entities;

/// <summary>
/// Represents a manual fraud detection rule.
/// </summary>
public class FraudRule : IAuditableEntity
{
    public Guid Id { get; set; }

    // ==================== Rule Info ====================

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    // ==================== Rule Type ====================

    public string RuleType { get; set; } = string.Empty;

    // ==================== Configuration ====================

    public string Config { get; set; } = "{}";

    // ==================== Action ====================

    public string Action { get; set; } = string.Empty;

    // ==================== Priority ====================

    public int Priority { get; set; }

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
