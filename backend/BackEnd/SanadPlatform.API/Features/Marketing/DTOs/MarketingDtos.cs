namespace SanadPlatform.API.Features.Marketing.DTOs;

/// <summary>
/// Marketing campaign summary response.
/// </summary>
public record MarketingCampaignResponse(
    Guid Id,
    string Name,
    string Type,
    string Status,
    string StartDate,
    string EndDate,
    decimal Budget,
    decimal Spent,
    int Impressions,
    int Clicks,
    int Conversions,
    decimal Ctr,
    decimal Roi);

/// <summary>
/// Marketing dashboard stats response.
/// </summary>
public record MarketingStatsResponse(
    string TotalImpressions,
    string TotalClicks,
    string TotalConversions,
    string AverageRoi,
    string ImpressionsChange,
    string ClicksChange,
    string ConversionsChange,
    string RoiChange);

/// <summary>
/// Campaign idea / template response.
/// </summary>
public record CampaignIdeaResponse(
    string Title,
    string Desc,
    string Template);

/// <summary>
/// Campaign content for detail view.
/// </summary>
public record CampaignContentResponse(
    string Headline,
    string Description,
    string Cta);

/// <summary>
/// Full campaign detail response.
/// </summary>
public record CampaignDetailResponse(
    Guid Id,
    string Name,
    string Type,
    string Status,
    string StartDate,
    string EndDate,
    decimal Budget,
    decimal Spent,
    int Impressions,
    int Clicks,
    int Conversions,
    decimal Ctr,
    decimal Roi,
    string Objective,
    CampaignContentResponse Content);

/// <summary>
/// Daily performance data point.
/// </summary>
public record DailyPerformanceResponse(
    string Date,
    int Impressions,
    int Clicks,
    int Conversions);

/// <summary>
/// Audience age group breakdown.
/// </summary>
public record AudienceAgeGroupResponse(
    string Range,
    int Percentage);

/// <summary>
/// Audience location breakdown.
/// </summary>
public record AudienceLocationResponse(
    string City,
    int Percentage);

/// <summary>
/// Audience device breakdown.
/// </summary>
public record AudienceDeviceResponse(
    string Type,
    int Percentage,
    string Icon);

/// <summary>
/// Raw audience data response.
/// </summary>
public record AudienceDataRawResponse(
    IReadOnlyList<AudienceAgeGroupResponse> AgeGroups,
    IReadOnlyList<AudienceLocationResponse> TopLocations,
    IReadOnlyList<AudienceDeviceResponse> Devices);
