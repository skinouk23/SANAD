using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Insurance.DTOs;
using SanadPlatform.API.Features.Insurance.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Insurance.Controllers;

/// <summary>
/// Insurance endpoints for provider coverage, claims, documents, and stats.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/insurance")]
[Authorize]
public class InsuranceController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public InsuranceController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    /// <summary>
    /// Get insurance coverage sections for the authenticated provider.
    /// </summary>
    [HttpGet("coverage")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<CoverageSectionResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CoverageSectionResponse>>>> GetCoverage(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var coverage = await _mediator.Send(new GetInsuranceCoverageQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<CoverageSectionResponse>>.SuccessResponse(coverage, "Coverage retrieved successfully"));
    }

    /// <summary>
    /// Get insurance claims for the authenticated provider.
    /// </summary>
    [HttpGet("claims")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<InsuranceClaimResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<InsuranceClaimResponse>>>> GetClaims(
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var claims = await _mediator.Send(new GetInsuranceClaimsQuery(userId.Value, status), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<InsuranceClaimResponse>>.SuccessResponse(claims, "Claims retrieved successfully"));
    }

    /// <summary>
    /// Get insurance documents for the authenticated provider.
    /// </summary>
    [HttpGet("documents")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<InsuranceDocumentResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<InsuranceDocumentResponse>>>> GetDocuments(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var documents = await _mediator.Send(new GetInsuranceDocumentsQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<InsuranceDocumentResponse>>.SuccessResponse(documents, "Documents retrieved successfully"));
    }

    /// <summary>
    /// Get insurance stats for the authenticated provider.
    /// </summary>
    [HttpGet("stats")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<InsuranceStatsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<InsuranceStatsResponse>>> GetStats(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));

        var stats = await _mediator.Send(new GetInsuranceStatsQuery(userId.Value), cancellationToken);
        return Ok(ApiResponse<InsuranceStatsResponse>.SuccessResponse(stats, "Stats retrieved successfully"));
    }
}
