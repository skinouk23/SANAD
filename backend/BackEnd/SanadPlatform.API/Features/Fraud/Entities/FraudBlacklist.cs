using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Fraud.Entities;

/// <summary>
/// Represents a blacklisted entity for fraud prevention.
/// </summary>
public class FraudBlacklist : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== Entity ====================

    public string EntityType { get; set; } = string.Empty;

    public string EntityValue { get; set; } = string.Empty;

    // ==================== Reason ====================

    public string? Reason { get; set; }

    public string Severity { get; set; } = "high";

    // ==================== Source ====================

    public string? Source { get; set; }

    public Guid? AddedBy { get; set; }

    // ==================== Expiration ====================

    public DateTime? ExpiresAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
