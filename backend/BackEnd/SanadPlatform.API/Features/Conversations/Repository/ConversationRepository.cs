using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Enums;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Common.Specifications;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Conversations.Specifications;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Conversations.Repository;

/// <summary>
/// EF Core implementation of <see cref="IConversationRepository"/>.
/// </summary>
/// <remarks>
/// Role-based methods assume <c>isPatient</c> and <c>isProvider</c> are mutually exclusive.
/// The controller enforces this via <c>EnsureSingleConversationRole</c> before any handler runs.
/// </remarks>
public class ConversationRepository : IConversationRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<ConversationRepository> _logger;

    /// <summary>
    /// Initializes a new instance of <see cref="ConversationRepository"/>.
    /// </summary>
    public ConversationRepository(SanadDbContext context, ILogger<ConversationRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    // ==================== Projections ====================

    private IQueryable<ConversationResponse> ProjectConversations(
        IQueryable<Conversation> query,
        bool isPatient,
        bool isProvider)
    {
        return query
            .Select(c => new
            {
                c.Id,
                c.IsActive,
                c.LastMessageAt,
                c.LastMessagePreview,
                c.LastMessageBy,
                c.PatientUnreadCount,
                c.ProviderUnreadCount,
                PatientId = c.Patient.Id,
                PatientFullName = c.Patient.FirstName + " " + c.Patient.LastName,
                ProviderId = c.Provider.Id,
                ProviderFullName = !string.IsNullOrEmpty(c.Provider.BusinessName)
                    ? c.Provider.BusinessName
                    : c.Provider.FirstName + " " + c.Provider.LastName,
                ProviderSpecialty = c.Provider.ServiceCategory,
                ProviderAllowsPatientMessages = c.Provider.Preferences == null
                    || c.Provider.Preferences.AllowPatientMessages,
                PatientAllowsProviderMessages = c.Patient.Preferences == null
                    || c.Patient.Preferences.AllowProviderMessages,
                HasActiveReservation = _context.Bookings
                    .AsNoTracking()
                    .Any(booking => booking.PatientId == c.PatientId
                        && booking.ProviderId == c.ProviderId
                        && (booking.Status == BookingStatus.Confirmed
                            || booking.Status == BookingStatus.ProviderOnWay
                            || booking.Status == BookingStatus.InProgress)),
                c.UpdatedAt
            })
            .Select(c => new ConversationResponse
            {
                Id = c.Id,
                IsActive = c.IsActive,
                LastMessageAt = c.LastMessageAt,
                LastMessagePreview = c.LastMessagePreview,
                LastMessageBy = c.LastMessageBy,
                UnreadCount = isPatient
                    ? c.PatientUnreadCount
                    : isProvider
                        ? c.ProviderUnreadCount
                        : c.PatientUnreadCount + c.ProviderUnreadCount,
                CanSendMessage = c.IsActive && (isPatient
                    ? c.ProviderAllowsPatientMessages && c.HasActiveReservation
                    : isProvider
                        ? c.PatientAllowsProviderMessages && c.HasActiveReservation
                        : false),
                MessagingBlockedReason = !c.IsActive
                    ? null
                    : isPatient
                        ? !c.ProviderAllowsPatientMessages
                            ? ConversationMessagingBlockedReasons.ProviderDisabledPatientMessages
                            : c.HasActiveReservation
                                ? null
                                : ConversationMessagingBlockedReasons.NoActiveReservation
                        : isProvider
                            ? !c.PatientAllowsProviderMessages
                                ? ConversationMessagingBlockedReasons.PatientDisabledProviderMessages
                                : c.HasActiveReservation
                                    ? null
                                    : ConversationMessagingBlockedReasons.NoActiveReservation
                            : null,
                UpdatedAt = c.UpdatedAt,
                Patient = new ConversationPatientResponse
                {
                    Id = c.PatientId,
                    FullName = c.PatientFullName,
                    AvatarUrl = null
                },
                Provider = new ConversationProviderResponse
                {
                    Id = c.ProviderId,
                    FullName = c.ProviderFullName,
                    Specialty = c.ProviderSpecialty,
                    AvatarUrl = null
                }
            });
    }

    private async Task<bool> HasActiveReservationAsync(
        Guid patientId,
        Guid providerId,
        CancellationToken ct)
    {
        return await _context.Bookings
            .AsNoTracking()
            .AnyAsync(booking => booking.PatientId == patientId
                && booking.ProviderId == providerId
                && (booking.Status == BookingStatus.Confirmed
                    || booking.Status == BookingStatus.ProviderOnWay
                    || booking.Status == BookingStatus.InProgress), ct);
    }

    // ==================== List Conversations ====================

    /// <inheritdoc />
    public async Task<ConversationsResponse> GetConversationsAsync(
        ConversationSpecification spec,
        CancellationToken ct)
    {
        var baseQuery = _context.Conversations.AsNoTracking();

        // Count (criteria only, no paging/ordering)
        var totalCount = await SpecificationEvaluator
            .GetCountQuery(baseQuery, spec)
            .CountAsync(ct);

        // Project directly in SQL to avoid loading every column.
        // UnreadCount is resolved per-role: patient sees PatientUnreadCount,
        // provider sees ProviderUnreadCount, admin sees the combined total.
        bool isPatient = spec.IsPatient;
        bool isProvider = spec.IsProvider;

        var conversationsQuery = SpecificationEvaluator.GetQuery(baseQuery, spec);
        var conversations = await ProjectConversations(conversationsQuery, isPatient, isProvider)
            .ToListAsync(ct);

        // ── Pagination metadata ───────────────────────────────────────────────
        int pageSize = spec.Take > 0 ? spec.Take : 1;
        int pageNumber = (spec.Skip / pageSize) + 1;
        int totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new ConversationsResponse
        {
            Items = conversations,
            Pagination = new PaginationMetadata
            {
                Page = pageNumber,
                Limit = pageSize,
                Total = totalCount,
                TotalPages = totalPages
            }
        };
    }

    // ==================== Get By Id ====================

    /// <inheritdoc />
    public async Task<ConversationResponse?> GetByIdAsync(
        Guid id,
        Guid userId,
        bool isPatient,
        bool isProvider,
        bool isAdmin,
        CancellationToken ct)
    {
        var query = _context.Conversations
            .AsNoTracking()
            .Where(c => c.Id == id);

        // Scope to participant only.
        // A non-participant gets null (-> 404), not 403.
        if (isPatient)
            query = query.Where(c => c.Patient.UserId == userId);
        else if (isProvider)
            query = query.Where(c => c.Provider.UserId == userId);
        else if (!isAdmin)
            throw new UnauthorizedAccessException("Unknown role — access denied.");
        // admin: no additional filter — sees all conversations

        return await ProjectConversations(query, isPatient, isProvider)
            .FirstOrDefaultAsync(ct);
    }

    // ==================== Get Messages ====================

    /// <inheritdoc />
    public async Task<ConversationMessagesResponse?> GetMessagesByConversationIdAsync(
        Guid conversationId,
        GetConversationMessagesRequest request,
        Guid userId,
        bool isPatient,
        bool isProvider,
        bool isAdmin,
        CancellationToken ct)
    {
        // Verify conversation exists and user is a participant.
        // Returns null (-> 404) rather than 403 to avoid leaking conversation existence.
        var conversationQuery = _context.Conversations
            .AsNoTracking()
            .Where(c => c.Id == conversationId);

        if (isPatient)
            conversationQuery = conversationQuery.Where(c => c.Patient.UserId == userId);
        else if (isProvider)
            conversationQuery = conversationQuery.Where(c => c.Provider.UserId == userId);
        else if (!isAdmin)
            throw new UnauthorizedAccessException("Unknown role — access denied.");
        // admin: no additional filter — sees all conversations

        var exists = await conversationQuery.AnyAsync(ct);
        if (!exists)
            return null;

        // Build messages query
        var messagesQuery = _context.Messages
            .AsNoTracking()
            .Where(m => m.ConversationId == conversationId);

        // Hybrid pagination: the optional "Before" cursor narrows the window
        // to messages older than a timestamp (for infinite-scroll), and then
        // standard Page/Limit offset pagination is applied within that window.
        // When no cursor is supplied this behaves as normal offset pagination.
        if (request.Before.HasValue)
            messagesQuery = messagesQuery.Where(m => m.CreatedAt < request.Before.Value);

        // Count total matching messages (before paging)
        var totalCount = await messagesQuery.CountAsync(ct);

        // Fetch page — newest first
        var messages = await messagesQuery
            .OrderByDescending(m => m.CreatedAt)
            .Skip((request.Page - 1) * request.Limit)
            .Take(request.Limit)
            .Select(m => new MessageResponse
            {
                Id = m.Id,
                ConversationId = m.ConversationId,
                SenderId = m.SenderId,
                Sender = new MessageSenderResponse
                {
                    Id = m.Sender.Id,
                    FullName = m.Sender.Role == "provider"
                        ? (m.Sender.Provider != null
                            ? (!string.IsNullOrEmpty(m.Sender.Provider.BusinessName)
                                ? m.Sender.Provider.BusinessName
                                : m.Sender.Provider.FirstName + " " + m.Sender.Provider.LastName)
                            : "Unknown Provider")
                        : (m.Sender.Patient != null
                            ? m.Sender.Patient.FirstName + " " + m.Sender.Patient.LastName
                            : "Unknown User"),
                    Role = m.Sender.Role,
                    AvatarUrl = null
                },
                MessageType = m.MessageType,
                Content = m.Content,
                AttachmentUrl = m.AttachmentUrl,
                AttachmentName = m.AttachmentName,
                AttachmentSizeBytes = m.AttachmentSizeBytes,
                AttachmentMimeType = m.AttachmentMimeType,
                Latitude = m.Latitude,
                Longitude = m.Longitude,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt,
                Metadata = m.Metadata,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync(ct);

        int totalPages = (int)Math.Ceiling(totalCount / (double)request.Limit);

        return new ConversationMessagesResponse
        {
            Items = messages,
            Pagination = new PaginationMetadata
            {
                Page = request.Page,
                Limit = request.Limit,
                Total = totalCount,
                TotalPages = totalPages
            }
        };
    }

    // ==================== Tracked Read for Update ====================

    /// <inheritdoc />
    public async Task<Conversation?> GetConversationForUpdateAsync(
        Guid conversationId,
        CancellationToken ct)
    {
        return await _context.Conversations
            .Include(c => c.Patient)
                .ThenInclude(p => p.User)
            .Include(c => c.Provider)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(c => c.Id == conversationId, ct);
    }

    // ==================== Create Message ====================

    /// <inheritdoc />
    public Task CreateMessageAsync(Message message, CancellationToken ct)
    {
        _context.Messages.Add(message);
        return Task.CompletedTask;
    }

    // ==================== Mark As Read ====================

    /// <inheritdoc />
    public async Task<int> MarkMessagesAsReadAsync(
       Guid conversationId,
       Guid userId,
       CancellationToken ct)
    {
        var readAt = DateTime.UtcNow;

        // Mark as read only messages NOT sent by the current user.
        // ExecuteUpdateAsync issues a single bulk UPDATE statement — no change tracker involvement.
        var affected = await _context.Messages
            .Where(m =>
                m.ConversationId == conversationId &&
                m.IsRead == false &&
                m.SenderId != userId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(m => m.IsRead, true)
                .SetProperty(m => m.ReadAt, readAt),
            ct);

        _logger.LogDebug(
            "Marked {Count} messages as read in conversation {ConversationId} for user {UserId}",
            affected, conversationId, userId);
        return affected;
    }

    // ==================== Unread Count ====================

    /// <inheritdoc />
    public async Task<int> GetTotalUnreadCountAsync(
        Guid userId,
        bool isPatient,
        bool isProvider,
        bool isAdmin,
        CancellationToken ct)
    {
        // Single aggregated SUM query — no per-conversation round-trips.
        // We read the denormalized unread counters stored on the Conversation row
        // rather than counting Message rows, keeping this query very fast.
        var query = _context.Conversations.AsNoTracking();

        if (isPatient)
        {
            return await query
                .Where(c => c.Patient.UserId == userId)
                .SumAsync(c => c.PatientUnreadCount, ct);
        }

        if (isProvider)
        {
            return await query
                .Where(c => c.Provider.UserId == userId)
                .SumAsync(c => c.ProviderUnreadCount, ct);
        }

        if (!isAdmin)
            throw new UnauthorizedAccessException("Unknown role — access denied.");

        // Admin: sum all unread across both participants
        return await query
            .SumAsync(c => c.PatientUnreadCount + c.ProviderUnreadCount, ct);
    }

    // ==================== Atomic Counter Updates ====================

    /// <inheritdoc />
    public async Task ResetUnreadCountAsync(
        Guid conversationId,
        bool isPatient,
        int markedCount,
        CancellationToken ct)
    {
        if (isPatient)
        {
            await _context.Conversations
                .Where(c => c.Id == conversationId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(c => c.PatientUnreadCount,
                        c => c.PatientUnreadCount - markedCount < 0
                            ? 0
                            : c.PatientUnreadCount - markedCount)
                    .SetProperty(c => c.UpdatedAt, DateTime.UtcNow), ct);
        }
        else
        {
            await _context.Conversations
                .Where(c => c.Id == conversationId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(c => c.ProviderUnreadCount,
                        c => c.ProviderUnreadCount - markedCount < 0
                            ? 0
                            : c.ProviderUnreadCount - markedCount)
                    .SetProperty(c => c.UpdatedAt, DateTime.UtcNow), ct);
        }

        _logger.LogDebug(
            "Decremented {Role} unread counter by {Count} for conversation {ConversationId}",
            isPatient ? "patient" : "provider", markedCount, conversationId);
    }

    /// <inheritdoc />
    public async Task UpdateConversationOnNewMessageAsync(
        Guid conversationId,
        string preview,
        Guid lastMessageBy,
        bool incrementPatientUnread,
        bool incrementProviderUnread,
        CancellationToken ct)
    {
        await _context.Conversations
            .Where(c => c.Id == conversationId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.LastMessageAt, DateTime.UtcNow)
                .SetProperty(c => c.LastMessagePreview, preview)
                .SetProperty(c => c.LastMessageBy, lastMessageBy)
                .SetProperty(c => c.PatientUnreadCount,
                    c => c.PatientUnreadCount + (incrementPatientUnread ? 1 : 0))
                .SetProperty(c => c.ProviderUnreadCount,
                    c => c.ProviderUnreadCount + (incrementProviderUnread ? 1 : 0))
                .SetProperty(c => c.UpdatedAt, DateTime.UtcNow),
            ct);

        _logger.LogDebug(
            "Updated denormalized fields for conversation {ConversationId} (sender {SenderId})",
            conversationId, lastMessageBy);
    }

    // ==================== Lookup & Create ====================

    /// <inheritdoc />
    public async Task<Conversation?> GetByParticipantsAsync(
        Guid patientId,
        Guid providerId,
        CancellationToken ct)
    {
        return await _context.Conversations
            .AsNoTracking()
            .FirstOrDefaultAsync(
                c => c.PatientId == patientId && c.ProviderId == providerId, ct);
    }

    /// <inheritdoc />
    public async Task<ConversationMessagingAccess?> GetMessagingAccessAsync(
        Guid patientId,
        Guid providerId,
        CancellationToken ct)
    {
        var preferenceAccess = await _context.Patients
            .AsNoTracking()
            .Where(patient => patient.Id == patientId)
            .SelectMany(
                patient => _context.Providers
                    .AsNoTracking()
                    .Where(provider => provider.Id == providerId),
                (patient, provider) => new
                {
                    PatientId = patient.Id,
                    ProviderId = provider.Id,
                    CanPatientSendByPreference = provider.Preferences == null || provider.Preferences.AllowPatientMessages,
                    CanProviderSendByPreference = patient.Preferences == null || patient.Preferences.AllowProviderMessages
                })
            .FirstOrDefaultAsync(ct);

        if (preferenceAccess is null)
            return null;

        var hasActiveReservation = await HasActiveReservationAsync(patientId, providerId, ct);

        return new ConversationMessagingAccess
        {
            PatientId = preferenceAccess.PatientId,
            ProviderId = preferenceAccess.ProviderId,
            HasActiveReservation = hasActiveReservation,
            CanPatientSendMessage = preferenceAccess.CanPatientSendByPreference && hasActiveReservation,
            PatientBlockedReason = !preferenceAccess.CanPatientSendByPreference
                ? ConversationMessagingBlockedReasons.ProviderDisabledPatientMessages
                : hasActiveReservation
                    ? null
                    : ConversationMessagingBlockedReasons.NoActiveReservation,
            CanProviderSendMessage = preferenceAccess.CanProviderSendByPreference && hasActiveReservation,
            ProviderBlockedReason = !preferenceAccess.CanProviderSendByPreference
                ? ConversationMessagingBlockedReasons.PatientDisabledProviderMessages
                : hasActiveReservation
                    ? null
                    : ConversationMessagingBlockedReasons.NoActiveReservation
        };
    }

    /// <inheritdoc />
    public Task CreateConversationAsync(Conversation conversation, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(conversation);
        _context.Conversations.Add(conversation);
        _logger.LogDebug(
            "Conversation {ConversationId} staged for insertion (patient {PatientId} / provider {ProviderId})",
            conversation.Id, conversation.PatientId, conversation.ProviderId);
        return Task.CompletedTask;
    }
}
