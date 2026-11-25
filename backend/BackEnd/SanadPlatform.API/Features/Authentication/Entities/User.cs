using System;
using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Authentication.Entities;

/// <summary>
/// Main User entity representing all account types in the Sanad Platform.
/// </summary>
public class User : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // ==================== Authentication ====================

    [SearchableEncrypted(Classification = DataClassification.Critical)]
    public string Email { get; set; } = string.Empty;

    public bool EmailVerified { get; set; } = false;

    public DateTime? EmailVerifiedAt { get; set; }

    [Encrypted(Classification = DataClassification.Critical)]
    public string PasswordHash { get; set; } = string.Empty;

    // ==================== Role & Status ====================

    /// <summary>
    /// User role (patient, provider, admin, staff).
    /// </summary>
    public string Role { get; set; } = "patient";

    public bool IsActive { get; set; } = true;

    public bool IsSuspended { get; set; } = false;

    public DateTime? SuspendedAt { get; set; }

    public string? SuspendedReason { get; set; }

    // ==================== Contact ====================

    [SearchableEncrypted(Classification = DataClassification.Critical)]
    public string? Phone { get; set; }

    public bool PhoneVerified { get; set; } = false;

    public DateTime? PhoneVerifiedAt { get; set; }

    // ==================== Security ====================

    public bool TwoFactorEnabled { get; set; } = false;

    [Encrypted(Classification = DataClassification.Critical)]
    public string? TwoFactorSecret { get; set; }

    public int FailedLoginAttempts { get; set; } = 0;

    public DateTime? LockedUntil { get; set; }

    public DateTime? PasswordChangedAt { get; set; }

    // ==================== Profile Settings ====================

    public string PreferredLanguage { get; set; } = "fr";

    public string Timezone { get; set; } = "Europe/Paris";

    // ==================== Metadata ====================

    public DateTime? LastLoginAt { get; set; }

    [Encrypted(Classification = DataClassification.Confidential)]
    public string? LastLoginIp { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; } // For soft delete

    // ==================== Navigation Properties ====================
    
    /// <summary>
    /// Linked Patient profile (if Role is 'patient').
    /// </summary>
    public virtual Patient? Patient { get; set; }

    /// <summary>
    /// Linked Provider profile (if Role is 'provider').
    /// </summary>
    public virtual Provider? Provider { get; set; }

    /// <summary>
    /// Collection of active sessions for this user.
    /// </summary>
    public virtual ICollection<UserSession> UserSessions { get; set; } = new HashSet<UserSession>();

    /// <summary>
    /// Collection of password reset tokens.
    /// </summary>
    public virtual ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new HashSet<PasswordResetToken>();

    /// <summary>
    /// Collection of email verification tokens.
    /// </summary>
    public virtual ICollection<EmailVerificationToken> EmailVerificationTokens { get; set; } = new HashSet<EmailVerificationToken>();
}
