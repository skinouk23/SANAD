using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Entities;

/// <summary>
/// Represents a password reset token for account recovery.
/// </summary>
public class PasswordResetToken : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string TokenHash { get; set; } = string.Empty;

    // ==================== Status ====================

    public DateTime ExpiresAt { get; set; }

    public DateTime? UsedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
}
