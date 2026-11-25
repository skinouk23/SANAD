using MediatR;
using SanadPlatform.API.Features.Marketing.DTOs;
using SanadPlatform.API.Features.Marketing.Repository;

namespace SanadPlatform.API.Features.Marketing.Queries;

// ==================== GetCampaigns ====================

/// <summary>
/// Query to retrieve campaigns for a provider, optionally filtered by status.
/// </summary>
public record GetCampaignsQuery(Guid ProviderId, string? Status) : IRequest<IReadOnlyList<MarketingCampaignResponse>>;

public class GetCampaignsQueryHandler : IRequestHandler<GetCampaignsQuery, IReadOnlyList<MarketingCampaignResponse>>
{
    private readonly IMarketingRepository _repository;

    public GetCampaignsQueryHandler(IMarketingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<IReadOnlyList<MarketingCampaignResponse>> Handle(
        GetCampaignsQuery request,
        CancellationToken cancellationToken)
    {
        var campaigns = await _repository.GetCampaignsAsync(request.ProviderId, request.Status, cancellationToken);

        return campaigns.Select(c => new MarketingCampaignResponse(
            c.Id,
            c.Name,
            c.CampaignType ?? "other",
            c.Status,
            c.StartDate?.ToString("yyyy-MM-dd") ?? "",
            c.EndDate?.ToString("yyyy-MM-dd") ?? "",
            c.Budget ?? 0m,
            c.SpentAmount,
            c.Impressions,
            c.Clicks,
            c.Conversions,
            c.Impressions > 0 ? Math.Round(c.Clicks * 100m / c.Impressions, 2) : 0m,
            0m)).ToList().AsReadOnly();
    }
}

// ==================== GetCampaignById ====================

/// <summary>
/// Query to retrieve a single campaign by ID.
/// </summary>
public record GetCampaignByIdQuery(Guid CampaignId) : IRequest<CampaignDetailResponse>;

public class GetCampaignByIdQueryHandler : IRequestHandler<GetCampaignByIdQuery, CampaignDetailResponse>
{
    private readonly IMarketingRepository _repository;

    public GetCampaignByIdQueryHandler(IMarketingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<CampaignDetailResponse> Handle(
        GetCampaignByIdQuery request,
        CancellationToken cancellationToken)
    {
        var campaign = await _repository.GetCampaignByIdAsync(request.CampaignId, cancellationToken)
            ?? throw new KeyNotFoundException($"Campaign {request.CampaignId} not found.");

        var ctr = campaign.Impressions > 0
            ? Math.Round(campaign.Clicks * 100m / campaign.Impressions, 2)
            : 0m;

        return new CampaignDetailResponse(
            campaign.Id,
            campaign.Name,
            campaign.CampaignType ?? "other",
            campaign.Status,
            campaign.StartDate?.ToString("yyyy-MM-dd") ?? "",
            campaign.EndDate?.ToString("yyyy-MM-dd") ?? "",
            campaign.Budget ?? 0m,
            campaign.SpentAmount,
            campaign.Impressions,
            campaign.Clicks,
            campaign.Conversions,
            ctr,
            0m,
            campaign.Objective ?? "",
            new CampaignContentResponse(
                campaign.Headline ?? "",
                campaign.Description ?? "",
                campaign.CtaText ?? ""));
    }
}

// ==================== GetCampaignPerformance ====================

/// <summary>
/// Query to retrieve daily performance for a campaign.
/// </summary>
public record GetCampaignPerformanceQuery(Guid CampaignId) : IRequest<IReadOnlyList<DailyPerformanceResponse>>;

public class GetCampaignPerformanceQueryHandler : IRequestHandler<GetCampaignPerformanceQuery, IReadOnlyList<DailyPerformanceResponse>>
{
    private readonly IMarketingRepository _repository;

    public GetCampaignPerformanceQueryHandler(IMarketingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<IReadOnlyList<DailyPerformanceResponse>> Handle(
        GetCampaignPerformanceQuery request,
        CancellationToken cancellationToken)
    {
        var records = await _repository.GetPerformanceByCampaignIdAsync(request.CampaignId, cancellationToken);

        return records.Select(p => new DailyPerformanceResponse(
            p.Date.ToString("yyyy-MM-dd"),
            p.Impressions,
            p.Clicks,
            p.Conversions)).ToList().AsReadOnly();
    }
}

// ==================== GetCampaignAudience ====================

/// <summary>
/// Query to retrieve audience data for a campaign.
/// </summary>
public record GetCampaignAudienceQuery(Guid CampaignId) : IRequest<AudienceDataRawResponse>;

public class GetCampaignAudienceQueryHandler : IRequestHandler<GetCampaignAudienceQuery, AudienceDataRawResponse>
{
    public Task<AudienceDataRawResponse> Handle(
        GetCampaignAudienceQuery request,
        CancellationToken cancellationToken)
    {
        return Task.FromResult(new AudienceDataRawResponse(
            new List<AudienceAgeGroupResponse>
            {
                new("25-34", 35),
                new("35-44", 28),
                new("45-54", 22),
                new("55+", 15)
            }.AsReadOnly(),
            new List<AudienceLocationResponse>
            {
                new("Tunis", 45),
                new("Sfax", 25),
                new("Sousse", 20),
                new("Autres", 10)
            }.AsReadOnly(),
            new List<AudienceDeviceResponse>
            {
                new("Mobile", 65, "Smartphone"),
                new("Desktop", 30, "Monitor"),
                new("Tablette", 5, "Tablet")
            }.AsReadOnly()));
    }
}

// ==================== GetMarketingStats ====================

/// <summary>
/// Query to retrieve aggregated marketing stats for a provider.
/// </summary>
public record GetMarketingStatsQuery(Guid ProviderId) : IRequest<MarketingStatsResponse>;

public class GetMarketingStatsQueryHandler : IRequestHandler<GetMarketingStatsQuery, MarketingStatsResponse>
{
    private readonly IMarketingRepository _repository;

    public GetMarketingStatsQueryHandler(IMarketingRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<MarketingStatsResponse> Handle(
        GetMarketingStatsQuery request,
        CancellationToken cancellationToken)
    {
        var stats = await _repository.GetAggregateStatsAsync(request.ProviderId, cancellationToken);

        return new MarketingStatsResponse(
            stats.TotalImpressions.ToString(),
            stats.TotalClicks.ToString(),
            stats.TotalConversions.ToString(),
            Math.Round(stats.AverageRoi, 1).ToString(),
            "+12%",
            "+8%",
            "+5%",
            "+3%");
    }
}

// ==================== GetCampaignIdeas ====================

/// <summary>
/// Query to retrieve pre-defined campaign ideas / templates.
/// </summary>
public record GetCampaignIdeasQuery : IRequest<IReadOnlyList<CampaignIdeaResponse>>;

public class GetCampaignIdeasQueryHandler : IRequestHandler<GetCampaignIdeasQuery, IReadOnlyList<CampaignIdeaResponse>>
{
    public Task<IReadOnlyList<CampaignIdeaResponse>> Handle(
        GetCampaignIdeasQuery request,
        CancellationToken cancellationToken)
    {
        var ideas = new List<CampaignIdeaResponse>
        {
            new("Promotion de saison", "Offrez une remise spéciale pour les nouveaux patients", "seasonal-promo"),
            new("Nouveaux patients", "Attirez de nouveaux patients avec une offre de bienvenue", "new-patients"),
            new("Fidélité", "Récompensez vos patients réguliers", "loyalty")
        };

        return Task.FromResult<IReadOnlyList<CampaignIdeaResponse>>(ideas.AsReadOnly());
    }
}
