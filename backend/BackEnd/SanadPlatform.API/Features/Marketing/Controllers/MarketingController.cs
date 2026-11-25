using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Marketing.DTOs;
using SanadPlatform.API.Features.Marketing.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Marketing.Controllers;

/// <summary>
/// Marketing endpoints for provider campaign management and analytics.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/marketing")]
[Authorize]
public class MarketingController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public MarketingController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    /// <summary>
    /// List provider marketing campaigns, optionally filtered by status.
    /// </summary>
    [HttpGet("campaigns")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<MarketingCampaignResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<MarketingCampaignResponse>>>> GetCampaigns(
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var campaigns = await _mediator.Send(new GetCampaignsQuery(userId.Value, status), cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<MarketingCampaignResponse>>.SuccessResponse(campaigns, "Campaigns retrieved successfully"));
    }

    /// <summary>
    /// Get a single campaign by ID.
    /// </summary>
    [HttpGet("campaigns/{id:guid}")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<CampaignDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CampaignDetailResponse>>> GetCampaignById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var campaign = await _mediator.Send(new GetCampaignByIdQuery(id), cancellationToken);
        return Ok(ApiResponse<CampaignDetailResponse>.SuccessResponse(campaign, "Campaign retrieved successfully"));
    }

    /// <summary>
    /// Get daily performance data for a campaign.
    /// </summary>
    [HttpGet("campaigns/{id:guid}/performance")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<DailyPerformanceResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<DailyPerformanceResponse>>>> GetCampaignPerformance(
        Guid id,
        CancellationToken cancellationToken)
    {
        var performance = await _mediator.Send(new GetCampaignPerformanceQuery(id), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<DailyPerformanceResponse>>.SuccessResponse(performance, "Performance data retrieved successfully"));
    }

    /// <summary>
    /// Get audience data for a campaign.
    /// </summary>
    [HttpGet("campaigns/{id:guid}/audience")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<AudienceDataRawResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<AudienceDataRawResponse>>> GetCampaignAudience(
        Guid id,
        CancellationToken cancellationToken)
    {
        var audience = await _mediator.Send(new GetCampaignAudienceQuery(id), cancellationToken);
        return Ok(ApiResponse<AudienceDataRawResponse>.SuccessResponse(audience, "Audience data retrieved successfully"));
    }

    /// <summary>
    /// Get aggregated marketing stats for the authenticated provider.
    /// </summary>
    [HttpGet("stats")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<MarketingStatsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<MarketingStatsResponse>>> GetStats(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var stats = await _mediator.Send(new GetMarketingStatsQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<MarketingStatsResponse>.SuccessResponse(stats, "Stats retrieved successfully"));
    }

    /// <summary>
    /// Get pre-defined campaign ideas / templates.
    /// </summary>
    [HttpGet("ideas")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CampaignIdeaResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CampaignIdeaResponse>>>> GetIdeas(CancellationToken cancellationToken)
    {
        var ideas = await _mediator.Send(new GetCampaignIdeasQuery(), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<CampaignIdeaResponse>>.SuccessResponse(ideas, "Campaign ideas retrieved successfully"));
    }
}
