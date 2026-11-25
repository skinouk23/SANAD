using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Bookings.Commands;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Bookings.Controllers;

/// <summary>
/// Handles execution-level booking session operations.
/// </summary>
[ApiController]
[Route("api/v{version:apiVersion}/booking-sessions")]
[Authorize]
[ApiVersion(ApiVersions.V1_0)]
public class BookingSessionsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    public BookingSessionsController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    /// <summary>
    /// Lists booking sessions visible to the authenticated caller.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<GetBookingSessionsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<GetBookingSessionsResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<GetBookingSessionsResponse>>> GetSessions(
        [FromQuery] GetBookingSessionsRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<GetBookingSessionsResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new GetBookingSessionsQuery(
            userId.Value,
            _claimsService.HasRole(User, "Patient"),
            _claimsService.HasRole(User, "Provider"),
            _claimsService.HasRole(User, "Admin"),
            request.BookingId,
            request.PatientId,
            request.ProviderId,
            request.Status,
            request.DateFrom ?? request.ScheduledDateFrom ?? request.StartDateFrom,
            request.DateTo ?? request.ScheduledDateTo ?? request.StartDateTo,
            request.SortBy,
            request.SortDesc,
            request.Page,
            request.Limit), cancellationToken);

        return Ok(ApiResponse<GetBookingSessionsResponse>.SuccessResponse(result, "Booking sessions retrieved successfully."));
    }

    /// <summary>
    /// Returns one booking session visible to the authenticated caller.
    /// </summary>
    [HttpGet("{sessionId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<BookingSessionResponse>>> GetSession(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new GetBookingSessionByIdQuery(
            sessionId,
            userId.Value,
            _claimsService.HasRole(User, "Admin")), cancellationToken);

        return Ok(ApiResponse<BookingSessionResponse>.SuccessResponse(result, "Booking session retrieved successfully."));
    }

    /// <summary>
    /// Rates a validated booking session by creating a review.
    /// Only the session's patient may rate, and only once per session.
    /// </summary>
    [HttpPost("{sessionId:guid}/rate")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<RateBookingResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<RateBookingResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<RateBookingResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<RateBookingResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<RateBookingResponse>>> RateSession(
        Guid sessionId,
        [FromBody] RateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<RateBookingResponse>.ErrorResponse("Invalid authentication token."));
        }

        var command = new RateBookingSessionCommand(
            SessionId: sessionId,
            CallerUserId: userId.Value,
            Rating: request.Rating,
            Comment: request.Comment);

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetSession),
            new { sessionId = command.SessionId },
            ApiResponse<RateBookingResponse>.SuccessResponse(result, "Booking session rated successfully."));
    }

    /// <summary>
    /// Returns the provider delivery view for one owned session.
    /// </summary>
    [HttpGet("{sessionId:guid}/delivery")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<ProviderBookingSessionDeliveryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ProviderBookingSessionDeliveryResponse>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<ProviderBookingSessionDeliveryResponse>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProviderBookingSessionDeliveryResponse>>> GetProviderDelivery(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<ProviderBookingSessionDeliveryResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new GetMyProviderBookingSessionDeliveryQuery(sessionId, userId.Value),
            cancellationToken);

        return Ok(ApiResponse<ProviderBookingSessionDeliveryResponse>.SuccessResponse(result, "Booking session delivery retrieved successfully."));
    }

    /// <summary>
    /// Confirms one pending session assigned to the authenticated provider.
    /// </summary>
    [HttpPost("{sessionId:guid}/confirm")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> Confirm(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new ConfirmBookingSessionCommand(sessionId, userId.Value), cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session confirmed successfully."));
    }

    /// <summary>
    /// Starts provider journey for a confirmed session.
    /// </summary>
    [HttpPost("{sessionId:guid}/start-journey")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> StartJourney(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new StartBookingSessionJourneyCommand(sessionId, userId.Value), cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session journey started successfully."));
    }

    /// <summary>
    /// Marks provider arrival and activates the session verification code.
    /// </summary>
    [HttpPost("{sessionId:guid}/arrive")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> Arrive(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new ArriveBookingSessionCommand(sessionId, userId.Value), cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Provider arrival recorded successfully."));
    }

    /// <summary>
    /// Starts service delivery for an arrived session.
    /// </summary>
    [HttpPost("{sessionId:guid}/start-service")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> StartService(
        Guid sessionId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new StartBookingSessionServiceCommand(sessionId, userId.Value), cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session service started successfully."));
    }

    /// <summary>
    /// Completes a session with the patient-provided 6-digit code.
    /// </summary>
    [HttpPost("{sessionId:guid}/complete")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> Complete(
        Guid sessionId,
        [FromBody] CompleteBookingSessionRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new CompleteBookingSessionCommand(sessionId, userId.Value, request.ValidationCode),
            cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session completed and validated successfully."));
    }

    /// <summary>
    /// Opens a dispute for a session when code-based completion is blocked.
    /// </summary>
    [HttpPost("{sessionId:guid}/dispute")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> Dispute(
        Guid sessionId,
        [FromBody] DisputeBookingSessionRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new DisputeBookingSessionCommand(sessionId, userId.Value, request.DisputeReason ?? request.Reason),
            cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session disputed successfully."));
    }

    /// <summary>
    /// Marks a provider-owned in-route or arrived session as no-show.
    /// </summary>
    [HttpPost("{sessionId:guid}/no-show")]
    [Authorize(Roles = "provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> MarkNoShow(
        Guid sessionId,
        [FromBody] MarkNoShowBookingSessionRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(
            new MarkNoShowBookingSessionCommand(sessionId, userId.Value, request.NoShowReason),
            cancellationToken);
        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session marked as no-show successfully."));
    }

    /// <summary>
    /// Cancels one future session.
    /// </summary>
    [HttpPost("{sessionId:guid}/cancel")]
    [Authorize(Roles = "patient,provider")]
    [ProducesResponseType(typeof(ApiResponse<BookingSessionActionResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<BookingSessionActionResponse>>> Cancel(
        Guid sessionId,
        [FromBody] CancelBookingSessionRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(ApiResponse<BookingSessionActionResponse>.ErrorResponse("Invalid authentication token."));
        }

        var result = await _mediator.Send(new CancelBookingSessionCommand(
            sessionId,
            userId.Value,
            _claimsService.HasRole(User, "Patient"),
            _claimsService.HasRole(User, "Provider"),
            request.CancellationReason), cancellationToken);

        return Ok(ApiResponse<BookingSessionActionResponse>.SuccessResponse(result, "Session cancelled successfully."));
    }

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);
}
