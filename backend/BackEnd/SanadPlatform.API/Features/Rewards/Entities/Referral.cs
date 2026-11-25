using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Rewards.Entities;

/// <summary>
/// Represents a referral from one patient to another user.
/// Tracks referral status and rewards for both referrer and referred.
/// </summary>
public class Referral : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== Parties ====================

    public Guid ReferrerId { get; set; }

    public Guid? ReferredUserId { get; set; }

    // ==================== Referral Code ====================

    [SearchableEncrypted(Classification = DataClassification.Internal)]
    public string ReferralCode { get; set; } = string.Empty;

    // ==================== Status ====================

    public string Status { get; set; } = "pending";

    // ==================== Referrer Rewards ====================

    public int ReferrerPoints { get; set; }

    public DateTime? ReferrerRewardedAt { get; set; }

    // ==================== Referred Rewards ====================

    public int ReferredPoints { get; set; }

    public DateTime? ReferredRewardedAt { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Referrer { get; set; } = null!;

    public virtual User? ReferredUser { get; set; }
}
