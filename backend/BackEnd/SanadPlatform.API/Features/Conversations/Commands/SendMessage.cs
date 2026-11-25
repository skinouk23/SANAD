using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Conversations.Repository;
using SanadPlatform.API.Features.Notifications;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Conversations.Commands;

/// <summary>
/// Sends a new message in a conversation on behalf of the authenticated patient or provider.
/// </summary>
public record SendMessageCommand(
    Guid ConversationId,
    Guid UserId,
    bool IsPatient,
    bool IsProvider,
    string MessageType,
    string? Content,
    string? AttachmentUrl,
    string? AttachmentName,
    int? AttachmentSizeBytes,
    string? AttachmentMimeType,
    decimal? Latitude,
    decimal? Longitude) : IRequest<MessageResponse>, ISensitiveRequest;


/// <summary>
/// Handles <see cref="SendMessageCommand"/> by verifying participation, creating the message,
/// and updating denormalized conversation fields.
/// </summary>
public class SendMessageHandler : IRequestHandler<SendMessageCommand, MessageResponse>
{
    private readonly IConversationRepository _repository;
    private readonly SanadDbContext _db;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<SendMessageHandler> _logger;

    public SendMessageHandler(
        IConversationRepository repository,
        SanadDbContext db,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<SendMessageHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<MessageResponse> Handle(SendMessageCommand command, CancellationToken cancellationToken)
    {
        // Wrap message creation + counter update in an explicit transaction so
        // SaveChangesAsync (insert) and ExecuteUpdateAsync (counter increment)
        // are atomic — rollback is guaranteed on failure by ExecuteInTransactionAsync.
        Message? message = null;
        Conversation? conversation = null;

        await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
        {
            // Load conversation with Patient/Provider + their User nav properties
            conversation = await _repository.GetConversationForUpdateAsync(
                command.ConversationId, ct)
                ?? throw new KeyNotFoundException("Conversation not found.");

            // Verify the authenticated user is a participant
            var isParticipant = command.IsPatient
                ? conversation.Patient.UserId == command.UserId
                : command.IsProvider
                    ? conversation.Provider.UserId == command.UserId
                    : false;

            if (!isParticipant)
                throw new UnauthorizedAccessException("You do not have access to this conversation.");

            // Enforce active state
            if (!conversation.IsActive)
                throw new InvalidOperationException(
                    "This conversation has been closed and no longer accepts new messages.");

            var access = await _repository.GetMessagingAccessAsync(
                conversation.PatientId,
                conversation.ProviderId,
                ct)
                ?? throw new KeyNotFoundException("Conversation participants could not be resolved.");
            ConversationMessagingGuard.ThrowIfMessagingDisabled(access, command.IsPatient, command.IsProvider);

            // Resolve the sender's User ID from the linked profile
            var senderId = command.IsPatient
                ? conversation.Patient.UserId
                : conversation.Provider.UserId;

            // Map command -> Message entity via AutoMapper
            message = _mapper.Map<Message>(command);
            message.SenderId = senderId;

            await _repository.CreateMessageAsync(message, ct);
            _db.Notifications.Add(NotificationFactory.CreateNewMessage(conversation, command.IsPatient));

            // Persist the new message via change tracker
            await _unitOfWork.SaveChangesAsync(ct);

            // Atomic SQL update of denormalized fields — avoids lost-update race
            // when two messages are sent concurrently (counter uses SQL-level increment)
            var preview = TruncatePreview(command.MessageType, command.Content);
            await _repository.UpdateConversationOnNewMessageAsync(
                command.ConversationId,
                preview,
                senderId,
                incrementPatientUnread: !command.IsPatient,
                incrementProviderUnread: !command.IsProvider,
                ct);
        }, cancellationToken);

        _logger.LogInformation(
            "User {UserId} sent message {MessageId} in conversation {ConversationId}",
            command.UserId, message!.Id, conversation!.Id);

        // Attach Sender for the response mapping
        message.Sender = command.IsPatient
            ? conversation.Patient.User
                ?? throw new KeyNotFoundException("Patient's user account not found.")
            : conversation.Provider.User
                ?? throw new KeyNotFoundException("Provider's user account not found.");

        return _mapper.Map<MessageResponse>(message);
    }

    /// <summary>
    /// Builds a short preview string for the conversation's LastMessagePreview field.
    /// Non-text message types use a fixed label so the preview is always human-readable.
    /// </summary>
    private static string TruncatePreview(string messageType, string? content)
    {
        const int MaxPreviewLength = 100;

        return messageType switch
        {
            "image" => "📷 Image",
            "file" => "📎 File",
            "location" => "📍 Location",
            "system" => content ?? "System message",
            _ => content is { Length: > MaxPreviewLength }
                              ? content[..MaxPreviewLength] + "…"
                              : content ?? string.Empty
        };
    }
}
