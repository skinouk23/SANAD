using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Pharmacy.DTOs;
using SanadPlatform.API.Features.Pharmacy.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Pharmacy.Controllers;

/// <summary>
/// Endpoints for pharmacy orders — patient-side and provider-side.
/// </summary>
[ApiController]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/pharmacy")]
public class PharmacyController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    /// <summary>
    /// Initializes a new instance of the <see cref="PharmacyController"/> class.
    /// </summary>
    public PharmacyController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== Patient Endpoints ====================

    /// <summary>
    /// Returns the authenticated patient's pharmacy orders, optionally filtered by status.
    /// </summary>
    /// <param name="filter">Optional filter: "active" or "completed". Defaults to all orders.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    [HttpGet("orders")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<PharmacyOrderResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<PharmacyOrderResponse>>>> GetOrders(
        [FromQuery] string? filter,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token."));

        var result = await _mediator.Send(
            new GetPharmacyOrdersQuery(CallerUserId: userId.Value, Filter: filter),
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<PharmacyOrderResponse>>
            .SuccessResponse(result, "Pharmacy orders retrieved successfully"));
    }

    /// <summary>
    /// Returns pharmacy order statistics for the authenticated patient.
    /// </summary>
    [HttpGet("orders/stats")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<PharmacyOrderStatsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<PharmacyOrderStatsResponse>>> GetOrderStats(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token."));

        var result = await _mediator.Send(
            new GetPharmacyOrderStatsQuery(CallerUserId: userId.Value),
            cancellationToken);

        return Ok(ApiResponse<PharmacyOrderStatsResponse>
            .SuccessResponse(result, "Pharmacy order stats retrieved successfully"));
    }

    // ==================== Provider Endpoints ====================

    /// <summary>
    /// Returns pharmacy orders assigned to the authenticated provider.
    /// </summary>
    [HttpGet("provider-orders")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProviderPharmacyOrderResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProviderPharmacyOrderResponse>>>> GetProviderOrders(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token."));

        var result = await _mediator.Send(
            new GetProviderPharmacyOrdersQuery(CallerUserId: userId.Value),
            cancellationToken);

        return Ok(ApiResponse<IReadOnlyList<ProviderPharmacyOrderResponse>>
            .SuccessResponse(result, "Provider pharmacy orders retrieved successfully"));
    }

    /// <summary>
    /// Streams prescription content for a provider-owned pharmacy order.
    /// </summary>
    [HttpGet("provider-orders/{orderId:guid}/prescription/content")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProviderOrderPrescriptionContent(
        Guid orderId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token."));

        var result = await _mediator.Send(
            new GetProviderPharmacyOrderPrescriptionContentQuery(
                CallerUserId: userId.Value,
                OrderId: orderId,
                IpAddress: GetIpAddress(),
                UserAgent: GetUserAgent(),
                CorrelationId: GetCorrelationId()),
            cancellationToken);

        var entityTag = string.IsNullOrWhiteSpace(result.ETag)
            ? null
            : new Microsoft.Net.Http.Headers.EntityTagHeaderValue($"\"{result.ETag.Trim('\"')}\"");
        Response.Headers.ETag = entityTag?.ToString();
        Response.Headers.LastModified = result.LastModified?.ToString("R");
        Response.Headers.CacheControl = "private, no-store";
        Response.Headers.ContentDisposition = result.ContentDisposition;
        Response.ContentType = result.ContentType;
        Response.ContentLength = result.SizeBytes;

        await using (result.Content)
        {
            await result.Content.CopyToAsync(Response.Body, cancellationToken);
            await result.Completion;
        }

        return new EmptyResult();
    }

    // ==================== Helpers ====================

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);
    private string? GetIpAddress() => HttpContext.Connection.RemoteIpAddress?.ToString();
    private string? GetUserAgent() => Request.Headers.UserAgent.ToString();
    private string? GetCorrelationId() => HttpContext.Response.Headers.TryGetValue("X-Correlation-Id", out var correlationId)
        ? correlationId.ToString()
        : HttpContext.Request.Headers["X-Correlation-Id"].ToString();
}
