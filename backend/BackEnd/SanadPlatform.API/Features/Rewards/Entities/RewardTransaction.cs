using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Patients.Entities;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Rewards.Entities;

/// <summary>
/// Represents a reward transaction record.
/// Tracks points earned, redeemed, expired, or adjusted.
/// </summary>
public class RewardTransaction : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }

    // ==================== Transaction Type ====================

    public string TransactionType { get; set; } = string.Empty;

    // ==================== Points ====================

    public int Points { get; set; }

    public int BalanceAfter { get; set; }

    // ==================== Reason ====================

    [Encrypted(Classification = DataClassification.Sensitive)]
    public string Reason { get; set; } = string.Empty;

    // ==================== Related Entities ====================

    public Guid? BookingId { get; set; }

    public Guid? BadgeId { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Patient Patient { get; set; } = null!;
}
