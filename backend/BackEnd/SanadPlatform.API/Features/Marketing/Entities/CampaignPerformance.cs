using SanadPlatform.API.Common.Interfaces;

namespace SanadPlatform.API.Features.Marketing.Entities;

/// <summary>
/// Represents daily performance metrics for a marketing campaign.
/// Tracks daily impressions, clicks, conversions, and spending.
/// </summary>
public class CampaignPerformance : IHasCreatedAt
{
    public Guid Id { get; set; }

    public Guid CampaignId { get; set; }

    // ==================== Date ====================

    public DateOnly Date { get; set; }

    // ==================== Performance Metrics ====================

    public int Impressions { get; set; }

    public int Clicks { get; set; }

    public int Conversions { get; set; }

    // ==================== Cost ====================

    public decimal SpentAmount { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual MarketingCampaign Campaign { get; set; } = null!;
}
