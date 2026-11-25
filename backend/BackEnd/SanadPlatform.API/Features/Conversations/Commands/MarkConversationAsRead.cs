using MediatR;
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Repository;

namespace SanadPlatform.API.Features.Conversations.Commands;

/// <summary>
/// Marks all unread messages in a conversation as read for the current user.
/// Only patients and providers may invoke this command.
/// </summary>
public record MarkConversationAsReadCommand(
    Guid ConversationId,
    Guid UserId,
    bool IsPatient,
    bool IsProvider) : IRequest<MarkAsReadResponse>;


/// <summary>
/// Handles <see cref="MarkConversationAsReadCommand"/> by bulk-updating message read status
/// and resetting the caller's denormalized unread counter inside an explicit transaction.
/// </summary>
public class MarkConversationAsReadHandler
    : IRequestHandler<MarkConversationAsReadCommand, MarkAsReadResponse>
{
    private readonly IConversationRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MarkConversationAsReadHandler> _logger;

    public MarkConversationAsReadHandler(
        IConversationRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<MarkConversationAsReadHandler> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<MarkAsReadResponse> Handle(
        MarkConversationAsReadCommand command,
        CancellationToken cancellationToken)
    {
        // Wrap the entire operation (load + verify + bulk-update + counter reset)
        // inside a transaction so no concurrent SendMessage can interleave.
        // Rollback is guaranteed on failure by ExecuteInTransactionAsync.
        var markedCount = 0;

        await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
        {
            // Load inside the transaction to prevent stale reads
            var conversation = await _repository.GetConversationForUpdateAsync(
                command.ConversationId, ct)
                ?? throw new KeyNotFoundException("Conversation not found.");

            var isParticipant = command.IsPatient
                ? conversation.Patient.UserId == command.UserId
                : command.IsProvider
                    ? conversation.Provider.UserId == command.UserId
                    : false;

            if (!isParticipant)
                throw new KeyNotFoundException("Conversation not found.");

            markedCount = await _repository.MarkMessagesAsReadAsync(
                command.ConversationId,
                command.UserId,
                ct);

            // Atomic SQL decrement — avoids lost-update race with SendMessage
            await _repository.ResetUnreadCountAsync(
                command.ConversationId,
                command.IsPatient,
                markedCount,
                ct);
        }, cancellationToken);

        _logger.LogInformation(
            "User {UserId} marked {Count} messages as read in conversation {ConversationId}",
            command.UserId, markedCount, command.ConversationId);

        return new MarkAsReadResponse
        {
            ConversationId = command.ConversationId,
            MarkedCount = markedCount
        };
    }
}
