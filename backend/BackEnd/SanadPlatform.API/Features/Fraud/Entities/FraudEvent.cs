using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Fraud.Entities;

/// <summary>
/// Represents a fraud detection event with ML scoring results.
/// </summary>
public class FraudEvent : IHasCreatedAt
{
    public Guid Id { get; set; }

    // ==================== Event Type ====================

    public string EventType { get; set; } = string.Empty;

    // ==================== Related Entities ====================

    public Guid? UserId { get; set; }

    public Guid? ProviderId { get; set; }

    public Guid? BookingId { get; set; }

    public Guid? PaymentAttemptId { get; set; }

    public Guid? ReviewId { get; set; }

    // ==================== Scoring ====================

    public decimal FraudScore { get; set; }

    public string Decision { get; set; } = string.Empty;

    public string RiskLevel { get; set; } = string.Empty;

    // ==================== Features (for explainability) ====================

    public string Features { get; set; } = "{}";

    public string? TopRiskFactors { get; set; }

    // ==================== Model Info ====================

    public string ModelVersion { get; set; } = string.Empty;

    public int? ProcessingTimeMs { get; set; }

    // ==================== Manual Review ====================

    public bool RequiresReview { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public Guid? ReviewedBy { get; set; }

    public string? ReviewDecision { get; set; }

    public string? ReviewNotes { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }
}
