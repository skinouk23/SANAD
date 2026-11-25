using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Conversations.Commands;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Queries;
using SanadPlatform.API.Infrastructure.Security;
using SanadPlatform.API.Infrastructure.Versioning;

namespace SanadPlatform.API.Features.Conversations.Controllers;

/// <summary>
/// Endpoints for managing patient-provider conversations and messages.
/// </summary>
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/conversations")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IClaimsService _claimsService;

    /// <summary>
    /// Initializes a new instance of <see cref="ConversationsController"/>.
    /// </summary>
    public ConversationsController(IMediator mediator, IClaimsService claimsService)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _claimsService = claimsService ?? throw new ArgumentNullException(nameof(claimsService));
    }

    // ==================== Helpers ====================

    private Guid? GetAuthenticatedUserId() => _claimsService.GetUserId(User);

    private bool IsPatient() => _claimsService.HasRole(User, "patient");

    private bool IsProvider() => _claimsService.HasRole(User, "provider");

    private bool IsAdmin() => _claimsService.HasRole(User, "admin");

    /// <summary>
    /// Guards against dual-role ambiguity. A user who holds both patient and
    /// provider roles cannot use conversation endpoints because the feature
    /// assumes these roles are mutually exclusive when resolving participation.
    /// </summary>
    private void EnsureSingleConversationRole(bool isPatient, bool isProvider)
    {
        if (isPatient && isProvider)
            throw new InvalidOperationException(
                "Users with both Patient and Provider roles cannot use conversation endpoints. "
                + "Contact support to resolve the role conflict.");
    }

    // ==================== Get or Create Conversation ====================

    /// <summary>
    /// Returns the existing conversation for the caller and the specified counterpart,
    /// or creates a new one if none exists. Patients supply <c>ProviderId</c>;
    /// providers supply <c>PatientId</c>.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "patient,provider")]
    [ProducesResponseType(typeof(ApiResponse<ConversationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ConversationResponse>>> GetOrCreateConversation(
        [FromBody] GetOrCreateConversationRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(
                ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));
        }

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var command = new GetOrCreateConversationCommand(
            UserId: userId.Value,
            IsPatient: isPatient,
            IsProvider: isProvider,
            TargetProviderId: request.ProviderId,
            TargetPatientId: request.PatientId);

        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<ConversationResponse>.SuccessResponse(
            result, "Conversation retrieved or created successfully"));
    }

    // ==================== List Conversations ====================

    /// <summary>
    /// Returns a paginated list of conversations for the authenticated user,
    /// ordered by most recent message by default.
    /// </summary>
    /// <remarks>
    /// Accessible by patients, providers, and admins.
    /// Each role sees only their own conversations; admins see all.
    /// The unreadOnly filter resolves against the caller's unread count:
    /// patients see PatientUnreadCount &gt; 0, providers see ProviderUnreadCount &gt; 0.
    /// </remarks>
    [HttpGet]
    [Authorize(Roles = "patient,provider,admin")]
    [ProducesResponseType(typeof(ApiResponse<ConversationsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<ConversationsResponse>>> GetConversations(
        [FromQuery] GetConversationsRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(
                ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));
        }

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var query = new GetConversationsQuery(
            request, userId.Value,
            isPatient, isProvider, IsAdmin());
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ConversationsResponse>.SuccessResponse(
            result, "Conversations retrieved successfully"));
    }

    /// <summary>
    /// Returns advisory status for a patient opening or creating a conversation with a provider.
    /// </summary>
    [HttpGet("entry-status")]
    [Authorize(Roles = "patient")]
    [ProducesResponseType(typeof(ApiResponse<ConversationEntryStatusResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ConversationEntryStatusResponse>>> GetEntryStatus(
        [FromQuery] Guid providerId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(
                ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));
        }

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var query = new GetConversationEntryStatusQuery(userId.Value, providerId);
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ConversationEntryStatusResponse>.SuccessResponse(
            result, "Conversation entry status retrieved successfully"));
    }

    /// <summary>
    /// Returns a single conversation by ID.
    /// Only participants (the patient or provider of that conversation) can access it.
    /// A non-participant receives 404, not 403 — to avoid leaking conversation existence.
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize(Roles = "patient,provider,admin")]
    [ProducesResponseType(typeof(ApiResponse<ConversationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ConversationResponse>>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(
                ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));
        }

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var query = new GetConversationByIdQuery(
            id, userId.Value,
            isPatient, isProvider, IsAdmin());

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ConversationResponse>.SuccessResponse(
            result, "Conversation retrieved successfully"));
    }

    /// <summary>
    /// Returns a paginated list of messages within a specific conversation.
    /// Supports offset-based pagination and cursor-based infinite scroll via the <c>Before</c> timestamp.
    /// </summary>
    [HttpGet("{id:guid}/messages")]
    [Authorize(Roles = "patient,provider,admin")]
    [ProducesResponseType(typeof(ApiResponse<ConversationMessagesResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ConversationMessagesResponse>>> GetMessages(
       Guid id,
       [FromQuery] GetConversationMessagesRequest request,
       CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(
                ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));
        }

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var query = new GetConversationMessagesQuery(
            id, request, userId.Value,
            isPatient, isProvider, IsAdmin());

        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<ConversationMessagesResponse>.SuccessResponse(
            result, "Messages retrieved successfully"));
    }

    /// <summary>
    /// Sends a new message in a conversation. Only patients and providers may send messages.
    /// </summary>
    [HttpPost("{id:guid}/messages")]
    [Authorize(Roles = "patient,provider")]
    [ProducesResponseType(typeof(ApiResponse<MessageResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<MessageResponse>>> SendMessage(
        Guid id,
        [FromBody] SendMessageRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(
                ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));
        }

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var command = new SendMessageCommand(
            ConversationId: id,
            UserId: userId.Value,
            IsPatient: isPatient,
            IsProvider: isProvider,
            MessageType: request.MessageType,
            Content: request.Content,
            AttachmentUrl: request.AttachmentUrl,
            AttachmentName: request.AttachmentName,
            AttachmentSizeBytes: request.AttachmentSizeBytes,
            AttachmentMimeType: request.AttachmentMimeType,
            Latitude: request.Latitude,
            Longitude: request.Longitude);

        var result = await _mediator.Send(command, cancellationToken);

        return CreatedAtAction(
            nameof(GetMessages),
            new { id, version = "1" },
            ApiResponse<MessageResponse>.SuccessResponse(result, "Message sent successfully"));
    }

    /// <summary>
    /// Marks all unread messages in a conversation as read for the current user.
    /// Only patients and providers may mark messages as read.
    /// </summary>
    [HttpPost("{id:guid}/read")]
    [Authorize(Roles = "patient,provider")]
    [ProducesResponseType(typeof(ApiResponse<MarkAsReadResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<MarkAsReadResponse>>> MarkAsRead(
       Guid id,
       CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var command = new MarkConversationAsReadCommand(
            id, userId.Value,
            isPatient, isProvider);
        var result = await _mediator.Send(command, cancellationToken);

        return Ok(ApiResponse<MarkAsReadResponse>.SuccessResponse(
            result, "Conversation marked as read"));
    }

    /// <summary>
    /// Returns the total number of unread messages across all conversations for the authenticated user.
    /// </summary>
    [HttpGet("unread-count")]
    [Authorize(Roles = "patient,provider,admin")]
    [ProducesResponseType(typeof(ApiResponse<UnreadCountResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ApiResponse<UnreadCountResponse>>> GetUnreadCount(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();
        if (!userId.HasValue)
            return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid or missing authentication token."));

        var isPatient = IsPatient();
        var isProvider = IsProvider();
        EnsureSingleConversationRole(isPatient, isProvider);

        var query = new GetUnreadCountQuery(
            userId.Value,
            isPatient, isProvider, IsAdmin());
        var result = await _mediator.Send(query, cancellationToken);

        return Ok(ApiResponse<UnreadCountResponse>.SuccessResponse(
            result, "Unread count retrieved successfully"));
    }
}
