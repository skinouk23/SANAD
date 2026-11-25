using SanadPlatform.API.Common.Models;

namespace SanadPlatform.API.Features.Conversations.DTOs;

/// <summary>
/// Stable blocked-reason codes for conversation sendability decisions.
/// </summary>
public static class ConversationMessagingBlockedReasons
{
    public const string PatientDisabledProviderMessages = "patient_disabled_provider_messages";
    public const string ProviderDisabledPatientMessages = "provider_disabled_patient_messages";
    public const string NoActiveReservation = "no_active_reservation";
}

/// <summary>
/// Messaging access for a patient/provider pair, projected for later command enforcement.
/// </summary>
public record ConversationMessagingAccess
{
    public Guid PatientId { get; init; }
    public Guid ProviderId { get; init; }

    public bool HasActiveReservation { get; init; }

    public bool CanPatientSendMessage { get; init; }
    public string? PatientBlockedReason { get; init; }

    public bool CanProviderSendMessage { get; init; }
    public string? ProviderBlockedReason { get; init; }
}


/// <summary>
/// Query-string parameters for the paginated conversations list endpoint.
/// </summary>
public record GetConversationsRequest
{
    /// <summary>When <c>true</c>, return only conversations with unread messages for the caller.</summary>
    public bool UnreadOnly { get; init; } = false;

    /// <summary>When <c>true</c>, include inactive (closed) conversations in the results.</summary>
    public bool IncludeInactive { get; init; } = false;

    /// <summary>One-based page number.</summary>
    public int Page { get; init; } = 1;

    /// <summary>Maximum items per page.</summary>
    public int Limit { get; init; } = 20;

    /// <summary>Column to sort by: <c>lastMessageAt</c>, <c>createdAt</c>, or <c>updatedAt</c>.</summary>
    public string? SortBy { get; init; } = "lastMessageAt";

    /// <summary>Optional backend search term applied to the counterpart name and last message preview.</summary>
    public string? SearchQuery { get; init; }

    /// <summary>When <c>true</c> (default) results are sorted descending (newest first).</summary>
    public bool SortDesc { get; init; } = true;
}

/// <summary>
/// Paginated response wrapper for a list of conversations.
/// </summary>
public record ConversationsResponse
{
    /// <summary>Conversation items for the current page.</summary>
    public IReadOnlyList<ConversationResponse> Items { get; init; } = Array.Empty<ConversationResponse>();

    /// <summary>Pagination metadata.</summary>
    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Advisory status for opening or creating a patient-provider conversation from provider entry points.
/// </summary>
public record ConversationEntryStatusResponse
{
    public Guid ProviderId { get; init; }
    public Guid? ExistingConversationId { get; init; }
    public bool CanOpenConversation { get; init; }
    public bool CanCreateConversation { get; init; }
    public bool CanSendMessage { get; init; }
    public string? MessagingBlockedReason { get; init; }
}

/// <summary>
/// Projected conversation details returned by list and get-by-id endpoints.
/// </summary>
public record ConversationResponse
{
    public Guid Id { get; init; }
    public bool IsActive { get; init; }
    public ConversationPatientResponse Patient { get; init; } = null!;
    public ConversationProviderResponse Provider { get; init; } = null!;
    public DateTime? LastMessageAt { get; init; }
    public string? LastMessagePreview { get; init; }
    public Guid? LastMessageBy { get; init; }
    /// <summary>
    /// Unread message count for the caller.
    /// Patients see <c>PatientUnreadCount</c>, providers see <c>ProviderUnreadCount</c>,
    /// admins see the combined total.
    /// </summary>
    public int UnreadCount { get; init; }
    /// <summary>
    /// Whether the authenticated caller can currently send a message in this conversation.
    /// Patients/providers reflect counterpart preference rules; admin/non-participant reads are always <c>false</c>.
    /// </summary>
    public bool CanSendMessage { get; init; }

    /// <summary>Preference-based blocked-reason code for participant callers; <c>null</c> when allowed or not applicable.</summary>
    public string? MessagingBlockedReason { get; init; }

    public DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Lightweight patient info embedded in a conversation response.
/// </summary>
public record ConversationPatientResponse
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

/// <summary>
/// Lightweight provider info embedded in a conversation response.
/// </summary>
public record ConversationProviderResponse
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Specialty { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

/// <summary>
/// Query-string parameters for the paginated messages list endpoint.
/// </summary>
public record GetConversationMessagesRequest
{
    /// <summary>One-based page number.</summary>
    public int Page { get; init; } = 1;

    /// <summary>Maximum items per page.</summary>
    public int Limit { get; init; } = 30;

    /// <summary>Optional cursor for infinite-scroll: only messages created before this timestamp.</summary>
    public DateTime? Before { get; init; }
}

/// <summary>
/// Paginated response wrapper for a list of messages.
/// </summary>
public record ConversationMessagesResponse
{
    /// <summary>Message items for the current page.</summary>
    public IReadOnlyList<MessageResponse> Items { get; init; } = Array.Empty<MessageResponse>();

    /// <summary>Pagination metadata.</summary>
    public PaginationMetadata Pagination { get; init; } = new();
}

/// <summary>
/// Projected message details returned by the messages endpoint.
/// </summary>
public record MessageResponse
{
    public Guid Id { get; init; }
    public Guid ConversationId { get; init; }
    public Guid SenderId { get; init; }
    public MessageSenderResponse Sender { get; init; } = null!;
    public string MessageType { get; init; } = "text";
    public string Content { get; init; } = string.Empty;

    public string? AttachmentUrl { get; init; }
    public string? AttachmentName { get; init; }
    public int? AttachmentSizeBytes { get; init; }
    public string? AttachmentMimeType { get; init; }

    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }

    public bool IsRead { get; init; }
    public DateTime? ReadAt { get; init; }

    public string? Metadata { get; init; }

    public DateTime CreatedAt { get; init; }
}

/// <summary>
/// Lightweight sender info embedded in a message response.
/// </summary>
public record MessageSenderResponse
{
    public Guid Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string? AvatarUrl { get; init; }
}

/// <summary>
/// Request body for the send-message endpoint.
/// </summary>
public record SendMessageRequest
{
    /// <summary>Message type: text, image, file, location, or system.</summary>
    public string MessageType { get; init; } = "text";

    /// <summary>Message content (required for text and system types).</summary>
    public string? Content { get; init; }

    /// <summary>Attachment URL (required for image and file types).</summary>
    public string? AttachmentUrl { get; init; }

    /// <summary>Original file name of the attachment.</summary>
    public string? AttachmentName { get; init; }

    /// <summary>Attachment file size in bytes.</summary>
    public int? AttachmentSizeBytes { get; init; }

    /// <summary>MIME type of the attachment.</summary>
    public string? AttachmentMimeType { get; init; }

    /// <summary>Latitude (required for location type).</summary>
    public decimal? Latitude { get; init; }

    /// <summary>Longitude (required for location type).</summary>
    public decimal? Longitude { get; init; }
}

/// <summary>
/// Response returned after marking messages as read.
/// </summary>
public record MarkAsReadResponse
{
    /// <summary>The conversation whose messages were marked as read.</summary>
    public Guid ConversationId { get; init; }

    /// <summary>Number of messages that were marked as read.</summary>
    public int MarkedCount { get; init; }
}

/// <summary>
/// Response returned by the unread-count endpoint.
/// </summary>
public record UnreadCountResponse
{
    /// <summary>Total unread message count across all conversations.</summary>
    public int Count { get; init; }
}

/// <summary>
/// Request body for the get-or-create conversation endpoint.
/// Patients supply <c>ProviderId</c>; providers supply <c>PatientId</c>.
/// </summary>
public record GetOrCreateConversationRequest
{
    /// <summary>Target provider ID (required when the caller is a patient).</summary>
    public Guid? ProviderId { get; init; }

    /// <summary>Target patient ID (required when the caller is a provider).</summary>
    public Guid? PatientId { get; init; }
}
