using System.Collections.Generic;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Providers.Entities;

namespace SanadPlatform.API.Features.Marketing.Entities;

/// <summary>
/// Represents a marketing campaign created and managed by a provider.
/// </summary>
public class MarketingCampaign : IAuditableEntity
{
    public Guid Id { get; set; }

    public Guid ProviderId { get; set; }

    // ==================== Campaign Info ====================

    public string Name { get; set; } = string.Empty;

    public string? CampaignType { get; set; }

    public string? Objective { get; set; }

    // ==================== Status ====================

    public string Status { get; set; } = "draft";

    // ==================== Schedule ====================

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    // ==================== Budget ====================

    public decimal? Budget { get; set; }

    public decimal SpentAmount { get; set; }

    // ==================== Targeting ====================

    public int? TargetAgeMin { get; set; }

    public int? TargetAgeMax { get; set; }

    public string? TargetGender { get; set; }

    public List<string>? TargetLocations { get; set; }

    public List<string>? TargetInterests { get; set; }

    // ==================== Content ====================

    public string? Headline { get; set; }

    public string? Description { get; set; }

    public string? CtaText { get; set; }

    public string? ImageUrl { get; set; }

    public string? LandingUrl { get; set; }

    // ==================== Metrics ====================

    public int Impressions { get; set; }

    public int Clicks { get; set; }

    public int Conversions { get; set; }

    // ==================== Timestamps ====================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // ==================== Navigation Properties ====================

    public virtual Provider Provider { get; set; } = null!;

    public virtual ICollection<CampaignPerformance> DailyPerformance { get; set; } = new List<CampaignPerformance>();
}
