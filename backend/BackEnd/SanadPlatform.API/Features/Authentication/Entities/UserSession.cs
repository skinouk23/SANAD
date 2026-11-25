using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Entities;

/// <summary>
/// Represents a user session for security tracking and device management.
/// </summary>
public class UserSession : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    // ==================== Session Info ====================

    [Encrypted(Classification = DataClassification.Critical)]
    public string TokenHash { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Critical)]
    public string? RefreshTokenHash { get; set; }

    // ==================== Device Info ====================

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? IpAddress { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? UserAgent { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? DeviceFingerprint { get; set; }

    public string? DeviceType { get; set; } // mobile, tablet, desktop

    // ==================== Status ====================

    public bool IsActive { get; set; } = true;

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
}
