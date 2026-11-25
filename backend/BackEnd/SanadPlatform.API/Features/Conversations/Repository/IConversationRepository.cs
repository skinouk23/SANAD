using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Conversations.Specifications;

namespace SanadPlatform.API.Features.Conversations.Repository;

/// <summary>
/// Data-access contract for the Conversations feature.
/// </summary>
public interface IConversationRepository
{
    /// <summary>
    /// Returns a paginated list of conversations matching the given specification.
    /// </summary>
    Task<ConversationsResponse> GetConversationsAsync(
        ConversationSpecification spec,
        CancellationToken ct);

    /// <summary>
    /// Returns a single conversation by ID, scoped to the caller's role.
    /// Returns <c>null</c> when the conversation does not exist or the caller is not a participant.
    /// </summary>
    Task<ConversationResponse?> GetByIdAsync(
        Guid id,
        Guid userId,
        bool isPatient,
        bool isProvider,
        bool isAdmin,
        CancellationToken ct);

    /// <summary>
    /// Returns a paginated list of messages for a conversation, scoped to the caller's role.
    /// Returns <c>null</c> when the conversation does not exist or the caller is not a participant.
    /// </summary>
    Task<ConversationMessagesResponse?> GetMessagesByConversationIdAsync(
        Guid conversationId,
        GetConversationMessagesRequest request,
        Guid userId,
        bool isPatient,
        bool isProvider,
        bool isAdmin,
        CancellationToken ct);

    /// <summary>
    /// Returns the total unread message count across all conversations for the given user.
    /// </summary>
    Task<int> GetTotalUnreadCountAsync(
        Guid userId,
        bool isPatient,
        bool isProvider,
        bool isAdmin,
        CancellationToken ct);

    /// <summary>
    /// Loads a conversation with Patient/Provider (and their User) navigation properties
    /// for tracked updates (no <c>AsNoTracking</c>).
    /// </summary>
    Task<Conversation?> GetConversationForUpdateAsync(
        Guid conversationId,
        CancellationToken ct);

    /// <summary>
    /// Adds a new message to the change tracker.
    /// </summary>
    Task CreateMessageAsync(Message message, CancellationToken ct);

    /// <summary>
    /// Bulk-updates all unread messages not sent by the given user as read.
    /// Uses <c>ExecuteUpdateAsync</c> (bypasses change tracker, commits immediately).
    /// </summary>
    Task<int> MarkMessagesAsReadAsync(
        Guid conversationId,
        Guid userId,
        CancellationToken ct);

    /// <summary>
    /// Atomically decrements the caller's denormalized unread counter by the number
    /// of messages that were just marked as read, clamping at zero.
    /// Uses <c>ExecuteUpdateAsync</c> to avoid read-modify-write race conditions.
    /// </summary>
    Task ResetUnreadCountAsync(
        Guid conversationId,
        bool isPatient,
        int markedCount,
        CancellationToken ct);

    /// <summary>
    /// Atomically updates denormalized conversation fields after a new message is sent.
    /// Increments the other participant's unread counter via SQL-level arithmetic
    /// to avoid lost-update race conditions.
    /// </summary>
    Task UpdateConversationOnNewMessageAsync(
        Guid conversationId,
        string preview,
        Guid lastMessageBy,
        bool incrementPatientUnread,
        bool incrementProviderUnread,
        CancellationToken ct);

    // ==================== Lookup & Upsert ====================

    /// <summary>
    /// Returns the existing conversation for the given patient-provider pair,
    /// or <c>null</c> if none exists. Uses <c>AsNoTracking</c>.
    /// </summary>
    Task<Conversation?> GetByParticipantsAsync(
        Guid patientId,
        Guid providerId,
        CancellationToken ct);

    /// <summary>
    /// Returns directional messaging access for the given patient-provider pair,
    /// including active-reservation state, or <c>null</c> when either participant does not exist.
    /// </summary>
    Task<ConversationMessagingAccess?> GetMessagingAccessAsync(
        Guid patientId,
        Guid providerId,
        CancellationToken ct);

    /// <summary>
    /// Adds a new <see cref="Conversation"/> to the change tracker.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    Task CreateConversationAsync(Conversation conversation, CancellationToken ct);
}
