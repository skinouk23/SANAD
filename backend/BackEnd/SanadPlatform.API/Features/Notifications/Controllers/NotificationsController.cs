using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Notifications.Commands;
using SanadPlatform.API.Features.Notifications.DTOs;
using SanadPlatform.API.Features.Notifications.Queries;
using SanadPlatform.API.Features.Notifications.Services;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Notifications.Controllers;

[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IWebPushSubscriptionService _webPushSubscriptionService;
    private readonly IClaimsService _claimsService;

    public NotificationsController(
        IMediator mediator,
        IWebPushSubscriptionService webPushSubscriptionService,
        IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _webPushSubscriptionService = webPushSubscriptionService ?? throw new ArgumentNullException(nameof(webPushSubscriptionService));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<NotificationFeedResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<NotificationFeedResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<NotificationFeedResponse>>> GetMyNotifications(
        [FromQuery] GetMyNotificationsRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<NotificationFeedResponse>.ErrorResponse(
                "Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new GetMyNotificationsQuery(
                userId.Value,
                request.Status,
                request.Category,
                request.Cursor,
                request.Limit,
                request.UnreadOnly),
            cancellationToken);

        return Ok(ApiResponse<NotificationFeedResponse>.SuccessResponse(
            result,
            "Notifications retrieved successfully."));
    }

    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(ApiResponse<NotificationUnreadCountResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<NotificationUnreadCountResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<NotificationUnreadCountResponse>>> GetUnreadCount(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<NotificationUnreadCountResponse>.ErrorResponse(
                "Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new GetNotificationsUnreadCountQuery(userId.Value),
            cancellationToken);

        return Ok(ApiResponse<NotificationUnreadCountResponse>.SuccessResponse(
            result,
            "Unread notification count retrieved successfully."));
    }

    [HttpPatch("{id:guid}/read")]
    [ProducesResponseType(typeof(ApiResponse<NotificationFeedItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<NotificationFeedItemResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<NotificationFeedItemResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<NotificationFeedItemResponse>>> MarkAsRead(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<NotificationFeedItemResponse>.ErrorResponse(
                "Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new MarkNotificationAsReadCommand(id, userId.Value),
            cancellationToken);

        return Ok(ApiResponse<NotificationFeedItemResponse>.SuccessResponse(
            result,
            "Notification marked as read."));
    }

    [HttpPatch("read-all")]
    [ProducesResponseType(typeof(ApiResponse<MarkAllNotificationsReadResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<MarkAllNotificationsReadResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<MarkAllNotificationsReadResponse>>> MarkAllAsRead(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<MarkAllNotificationsReadResponse>.ErrorResponse(
                "Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new MarkAllNotificationsReadCommand(userId.Value),
            cancellationToken);

        return Ok(ApiResponse<MarkAllNotificationsReadResponse>.SuccessResponse(
            result,
            "Notifications marked as read."));
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object?>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object?>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object?>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object?>>> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<object?>.ErrorResponse(
                "Invalid authentication token."));
        }

        await _mediator.Send(new DeleteNotificationCommand(id, userId.Value), cancellationToken);

        return Ok(ApiResponse<object?>.SuccessResponse(
            null,
            "Notification deleted."));
    }

    [HttpGet("push/vapid-public-key")]
    [ProducesResponseType(typeof(ApiResponse<WebPushPublicKeyResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status503ServiceUnavailable)]
    public ActionResult<ApiResponse<WebPushPublicKeyResponse>> GetVapidPublicKey()
    {
        try
        {
            var response = _webPushSubscriptionService.GetPublicKey();
            return Ok(ApiResponse<WebPushPublicKeyResponse>.SuccessResponse(
                response,
                "Web Push public key retrieved successfully."));
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    [HttpPost("push/subscriptions")]
    [ProducesResponseType(typeof(ApiResponse<WebPushSubscriptionResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<ApiResponse<WebPushSubscriptionResponse>>> RegisterWebPushSubscription(
        [FromBody] RegisterWebPushSubscriptionRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token."));
        }

        try
        {
            var response = await _webPushSubscriptionService.RegisterAsync(
                userId.Value,
                request,
                Request.Headers["User-Agent"].ToString(),
                cancellationToken);

            return Ok(ApiResponse<WebPushSubscriptionResponse>.SuccessResponse(
                response,
                "Web Push subscription registered successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    [HttpDelete("push/subscriptions")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteWebPushSubscription(
        [FromBody] DeleteWebPushSubscriptionRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token."));
        }

        try
        {
            await _webPushSubscriptionService.DeactivateAsync(
                userId.Value,
                request,
                cancellationToken);

            return Ok(ApiResponse<object>.SuccessResponse(
                new { },
                "Web Push subscription deleted successfully."));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);
}
