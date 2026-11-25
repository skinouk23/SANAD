using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Entities;

/// <summary>
/// Represents an email verification token for account activation.
/// </summary>
public class EmailVerificationToken : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    [SearchableEncrypted(Classification = DataClassification.Critical)]
    public string Email { get; set; } = string.Empty;

    [Encrypted(Classification = DataClassification.Critical)]
    public string TokenHash { get; set; } = string.Empty;

    // ==================== Status ====================

    public DateTime ExpiresAt { get; set; }

    public DateTime? VerifiedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual User User { get; set; } = null!;
}
