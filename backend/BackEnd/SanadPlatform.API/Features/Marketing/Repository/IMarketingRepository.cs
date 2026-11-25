using SanadPlatform.API.Features.Marketing.Entities;

namespace SanadPlatform.API.Features.Marketing.Repository;

/// <summary>
/// Repository interface for Marketing campaign data access.
/// All methods are read-only; write operations would be added when campaign management is built.
/// </summary>
public interface IMarketingRepository
{
    /// <summary>
    /// Returns campaigns filtered by status and provider.
    /// </summary>
    Task<IReadOnlyList<MarketingCampaign>> GetCampaignsAsync(
        Guid providerId,
        string? status,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a single campaign by ID with performance data loaded.
    /// </summary>
    Task<MarketingCampaign?> GetCampaignByIdAsync(
        Guid campaignId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns daily performance records for a campaign.
    /// </summary>
    Task<IReadOnlyList<CampaignPerformance>> GetPerformanceByCampaignIdAsync(
        Guid campaignId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns aggregated marketing stats for the given provider.
    /// </summary>
    Task<(int TotalImpressions, int TotalClicks, int TotalConversions, decimal AverageRoi)> GetAggregateStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default);
}
