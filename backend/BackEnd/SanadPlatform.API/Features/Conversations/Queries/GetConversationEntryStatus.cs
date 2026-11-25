using MediatR;
using SanadPlatform.API.Features.Conversations.Commands;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Repository;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Conversations.Queries;

/// <summary>
/// Retrieves advisory entry status for a patient opening a provider conversation.
/// </summary>
public record GetConversationEntryStatusQuery(
    Guid UserId,
    Guid ProviderId) : IRequest<ConversationEntryStatusResponse>;

/// <summary>
/// Handles <see cref="GetConversationEntryStatusQuery"/> by resolving the patient-provider pair
/// and applying the same messaging access rules used by conversation creation and sending.
/// </summary>
public class GetConversationEntryStatusHandler
    : IRequestHandler<GetConversationEntryStatusQuery, ConversationEntryStatusResponse>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;

    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationEntryStatusHandler"/>.
    /// </summary>
    public GetConversationEntryStatusHandler(
        IConversationRepository conversationRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository)
    {
        _conversationRepository = conversationRepository ?? throw new ArgumentNullException(nameof(conversationRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
    }

    /// <inheritdoc />
    public async Task<ConversationEntryStatusResponse> Handle(
        GetConversationEntryStatusQuery query,
        CancellationToken cancellationToken)
    {
        var patientId = await _patientRepository.GetPatientIdByUserIdAsync(query.UserId, cancellationToken)
            ?? throw new KeyNotFoundException("Patient profile not found for the authenticated user.");

        if (!await _providerRepository.ExistsByIdAsync(query.ProviderId, cancellationToken))
            throw new KeyNotFoundException($"Provider with ID '{query.ProviderId}' was not found.");

        var existing = await _conversationRepository.GetByParticipantsAsync(
            patientId,
            query.ProviderId,
            cancellationToken);

        var access = await _conversationRepository.GetMessagingAccessAsync(
            patientId,
            query.ProviderId,
            cancellationToken)
            ?? throw new KeyNotFoundException("Conversation participants could not be resolved.");

        var canSendByAccess = ConversationMessagingGuard.CanSendMessage(
            access,
            isPatient: true,
            isProvider: false);
        var canSendMessage = (existing?.IsActive ?? true) && canSendByAccess;
        var canCreateConversation = existing is null && canSendByAccess;

        var blockedReason = existing is { IsActive: false }
            ? null
            : existing is null && !access.HasActiveReservation
                ? ConversationMessagingBlockedReasons.NoActiveReservation
                : ConversationMessagingGuard.GetBlockedReason(
                    access,
                    isPatient: true,
                    isProvider: false);

        return new ConversationEntryStatusResponse
        {
            ProviderId = query.ProviderId,
            ExistingConversationId = existing?.Id,
            CanOpenConversation = existing is not null || canCreateConversation,
            CanCreateConversation = canCreateConversation,
            CanSendMessage = canSendMessage,
            MessagingBlockedReason = blockedReason
        };
    }
}
