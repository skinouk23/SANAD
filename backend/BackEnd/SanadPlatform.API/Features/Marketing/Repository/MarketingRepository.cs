using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Marketing.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Marketing.Repository;

/// <summary>
/// EF Core implementation of <see cref="IMarketingRepository"/>.
/// </summary>
public class MarketingRepository : IMarketingRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<MarketingRepository> _logger;

    public MarketingRepository(
        SanadDbContext context,
        ILogger<MarketingRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<IReadOnlyList<MarketingCampaign>> GetCampaignsAsync(
        Guid providerId,
        string? status,
        CancellationToken cancellationToken = default)
    {
        var query = _context.MarketingCampaigns
            .AsNoTracking()
            .Where(c => c.ProviderId == providerId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(c => c.Status == status);

        var campaigns = await query
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        _logger.LogDebug(
            "Retrieved {Count} campaigns for provider {ProviderId} with status '{Status}'",
            campaigns.Count, providerId, status ?? "(any)");

        return campaigns.AsReadOnly();
    }

    public async Task<MarketingCampaign?> GetCampaignByIdAsync(
        Guid campaignId,
        CancellationToken cancellationToken = default)
    {
        return await _context.MarketingCampaigns
            .AsNoTracking()
            .Include(c => c.DailyPerformance)
            .FirstOrDefaultAsync(c => c.Id == campaignId, cancellationToken);
    }

    public async Task<IReadOnlyList<CampaignPerformance>> GetPerformanceByCampaignIdAsync(
        Guid campaignId,
        CancellationToken cancellationToken = default)
    {
        var records = await _context.CampaignPerformances
            .AsNoTracking()
            .Where(p => p.CampaignId == campaignId)
            .OrderBy(p => p.Date)
            .ToListAsync(cancellationToken);

        return records.AsReadOnly();
    }

    public async Task<(int TotalImpressions, int TotalClicks, int TotalConversions, decimal AverageRoi)> GetAggregateStatsAsync(
        Guid providerId,
        CancellationToken cancellationToken = default)
    {
        var campaigns = await _context.MarketingCampaigns
            .AsNoTracking()
            .Where(c => c.ProviderId == providerId)
            .ToListAsync(cancellationToken);

        var totalImpressions = campaigns.Sum(c => c.Impressions);
        var totalClicks = campaigns.Sum(c => c.Clicks);
        var totalConversions = campaigns.Sum(c => c.Conversions);

        // ROI = (Budget - SpentAmount) / SpentAmount * 100 for each campaign with spend > 0
        var campaignsWithSpend = campaigns.Where(c => c.SpentAmount > 0).ToList();
        var averageRoi = campaignsWithSpend.Count > 0
            ? campaignsWithSpend.Average(c => (c.Budget.GetValueOrDefault() - c.SpentAmount) / c.SpentAmount * 100)
            : 0m;

        return (totalImpressions, totalClicks, totalConversions, averageRoi);
    }
}
