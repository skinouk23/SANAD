using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Fraud.Entities;

/// <summary>
/// Represents user behavior tracking for fraud detection.
/// </summary>
public class UserBehavior : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string? SessionId { get; set; }

    // ==================== Action ====================

    public string Action { get; set; } = string.Empty;

    // ==================== Context ====================

    public string? IpAddress { get; set; }

    public string? UserAgent { get; set; }

    public string? DeviceFingerprint { get; set; }

    // ==================== Location ====================

    public string? CountryCode { get; set; }

    public string? City { get; set; }

    // ==================== Metadata ====================

    public string? Metadata { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
