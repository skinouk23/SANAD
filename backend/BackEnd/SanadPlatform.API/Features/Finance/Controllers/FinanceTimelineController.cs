using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Finance.DTOs;
using SanadPlatform.API.Features.Finance.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Finance.Controllers;

/// <summary>
/// Read-only finance timeline endpoints.
/// </summary>
[ApiController]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}")]
public class FinanceTimelineController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public FinanceTimelineController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    /// <summary>
    /// Returns the authenticated caller's finance timeline.
    /// </summary>
    [HttpGet("me/finance/timeline")]
    [ProducesResponseType(typeof(ApiResponse<FinanceTimelineResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<FinanceTimelineResponse>>> GetMyTimeline(
        [FromQuery] GetFinanceTimelineRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(
            new GetMyFinanceTimelineQuery(
                userId.Value,
                _claimsService.HasRole(User, "provider"),
                _claimsService.HasRole(User, "patient"),
                _claimsService.HasRole(User, "admin"),
                request.Type,
                request.Status,
                request.DateFrom,
                request.DateTo,
                request.Page,
                request.Limit,
                request.Sort),
            cancellationToken);

        return Ok(ApiResponse<FinanceTimelineResponse>.SuccessResponse(result, "Finance timeline retrieved successfully."));
    }

    /// <summary>
    /// Returns the finance timeline for a provider.
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpGet("providers/{providerId:guid}/finance/timeline")]
    [ProducesResponseType(typeof(ApiResponse<FinanceTimelineResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<FinanceTimelineResponse>>> GetProviderTimeline(
        Guid providerId,
        [FromQuery] GetFinanceTimelineRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetProviderFinanceTimelineQuery(
                providerId,
                request.BookingId,
                request.Type,
                request.Status,
                request.DateFrom,
                request.DateTo,
                request.Page,
                request.Limit,
                request.Sort),
            cancellationToken);

        return Ok(ApiResponse<FinanceTimelineResponse>.SuccessResponse(result, "Provider finance timeline retrieved successfully."));
    }

    /// <summary>
    /// Returns the admin finance timeline.
    /// </summary>
    [Authorize(Roles = "admin")]
    [HttpGet("admin/finance/timeline")]
    [ProducesResponseType(typeof(ApiResponse<FinanceTimelineResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<FinanceTimelineResponse>>> GetAdminTimeline(
        [FromQuery] GetFinanceTimelineRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetAdminFinanceTimelineQuery(
                request.ProviderId,
                request.BookingId,
                request.Type,
                request.Status,
                request.DateFrom,
                request.DateTo,
                request.Page,
                request.Limit,
                request.Sort),
            cancellationToken);

        return Ok(ApiResponse<FinanceTimelineResponse>.SuccessResponse(result, "Admin finance timeline retrieved successfully."));
    }

    /// <summary>
    /// Returns the finance timeline for a booking.
    /// </summary>
    [Authorize(Roles = "patient,provider,admin")]
    [HttpGet("bookings/{bookingId:guid}/finance/timeline")]
    [ProducesResponseType(typeof(ApiResponse<FinanceTimelineResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<FinanceTimelineResponse>>> GetBookingTimeline(
        Guid bookingId,
        [FromQuery] GetFinanceTimelineRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing user token"));
        }

        var result = await _mediator.Send(
            new GetBookingFinanceTimelineQuery(
                bookingId,
                userId.Value,
                _claimsService.HasRole(User, "admin"),
                request.Type,
                request.Status,
                request.DateFrom,
                request.DateTo,
                request.Page,
                request.Limit,
                request.Sort),
            cancellationToken);

        return Ok(ApiResponse<FinanceTimelineResponse>.SuccessResponse(result, "Booking finance timeline retrieved successfully."));
    }
}
