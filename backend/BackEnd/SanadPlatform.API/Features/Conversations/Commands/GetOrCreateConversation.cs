using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Entities;
using SanadPlatform.API.Features.Conversations.Repository;
using SanadPlatform.API.Features.Patients.Repository;
using SanadPlatform.API.Features.Providers.Repository;

namespace SanadPlatform.API.Features.Conversations.Commands;

/// <summary>
/// Returns the existing conversation for a patient-provider pair, or creates one.
/// Patients supply a <c>TargetProviderId</c>; providers supply a <c>TargetPatientId</c>.
/// </summary>
public record GetOrCreateConversationCommand(
    Guid UserId,
    bool IsPatient,
    bool IsProvider,
    Guid? TargetProviderId,
    Guid? TargetPatientId) : IRequest<ConversationResponse>;

/// <summary>
/// Handles <see cref="GetOrCreateConversationCommand"/> by resolving participant entity IDs,
/// validating the target exists, and performing an idempotent upsert.
/// If a concurrent caller creates the same conversation, the unique-constraint violation
/// propagates to <c>GlobalExceptionHandlingMiddleware</c> which returns 409;
/// the client retries and finds the existing row.
/// </summary>
public class GetOrCreateConversationHandler : IRequestHandler<GetOrCreateConversationCommand, ConversationResponse>
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IPatientRepository _patientRepository;
    private readonly IProviderRepository _providerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<GetOrCreateConversationHandler> _logger;

    /// <summary>
    /// Initializes a new instance of <see cref="GetOrCreateConversationHandler"/>.
    /// </summary>
    public GetOrCreateConversationHandler(
        IConversationRepository conversationRepository,
        IPatientRepository patientRepository,
        IProviderRepository providerRepository,
        IUnitOfWork unitOfWork,
        ILogger<GetOrCreateConversationHandler> logger)
    {
        _conversationRepository = conversationRepository ?? throw new ArgumentNullException(nameof(conversationRepository));
        _patientRepository = patientRepository ?? throw new ArgumentNullException(nameof(patientRepository));
        _providerRepository = providerRepository ?? throw new ArgumentNullException(nameof(providerRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<ConversationResponse> Handle(
        GetOrCreateConversationCommand command,
        CancellationToken cancellationToken)
    {
        Guid patientId;
        Guid providerId;

        if (command.IsPatient)
        {
            // Resolve the caller's patient entity ID from their user ID
            patientId = await _patientRepository.GetPatientIdByUserIdAsync(command.UserId, cancellationToken)
                ?? throw new KeyNotFoundException("Patient profile not found for the authenticated user.");

            // Validate the target provider exists
            providerId = command.TargetProviderId
                ?? throw new InvalidOperationException("TargetProviderId is required for patients.");

            if (!await _providerRepository.ExistsByIdAsync(providerId, cancellationToken))
                throw new KeyNotFoundException($"Provider with ID '{providerId}' was not found.");
        }
        else if (command.IsProvider)
        {
            // Resolve the caller's provider entity ID from their user ID
            providerId = await _providerRepository.GetProviderIdByUserIdAsync(command.UserId, cancellationToken)
                ?? throw new KeyNotFoundException("Provider profile not found for the authenticated user.");

            // Validate the target patient exists
            patientId = command.TargetPatientId
                ?? throw new InvalidOperationException("TargetPatientId is required for providers.");

            if (!await _patientRepository.ExistsByIdAsync(patientId, cancellationToken))
                throw new KeyNotFoundException($"Patient with ID '{patientId}' was not found.");
        }
        else
        {
            throw new UnauthorizedAccessException("Only patients and providers can create conversations.");
        }

        // Check whether a conversation already exists for this pair
        var existing = await _conversationRepository.GetByParticipantsAsync(patientId, providerId, cancellationToken);
        Guid conversationId;

        if (existing is null)
        {
            var access = await _conversationRepository.GetMessagingAccessAsync(patientId, providerId, cancellationToken)
                ?? throw new KeyNotFoundException("Conversation participants could not be resolved.");

            if (!access.HasActiveReservation)
                throw new InvalidOperationException(
                    "Reserve first: messaging is available after there is a confirmed active reservation with this professional.");

            ConversationMessagingGuard.ThrowIfMessagingDisabled(access, command.IsPatient, command.IsProvider);

            // Create a new conversation — the unique constraint on (PatientId, ProviderId)
            // guards against concurrent duplicates. If a race occurs the DbUpdateException
            // propagates to GlobalExceptionHandlingMiddleware which returns 409 (Conflict).
            var conversation = new Conversation
            {
                PatientId = patientId,
                ProviderId = providerId
            };

            await _conversationRepository.CreateConversationAsync(conversation, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            conversationId = conversation.Id;

            _logger.LogInformation(
                "Created new conversation {ConversationId} for patient {PatientId} / provider {ProviderId} by user {UserId}",
                conversationId, patientId, providerId, command.UserId);
        }
        else
        {
            conversationId = existing.Id;

            _logger.LogDebug(
                "Found existing conversation {ConversationId} for patient {PatientId} / provider {ProviderId}",
                conversationId, patientId, providerId);
        }

        // Return a projected DTO via the existing GetByIdAsync path.
        // Both the existing and newly-created conversation use the same projection
        // to guarantee a consistent response shape. We intentionally re-query here
        // rather than mapping in-memory, because the response requires Patient/Provider
        // display data (names, avatars, specialty) that we don't have loaded. A single
        // indexed PK lookup with two FK joins is cheaper than two sequential queries
        // on the same DbContext (which is not thread-safe for parallel queries).
        var dto = await _conversationRepository.GetByIdAsync(
            conversationId,
            command.UserId,
            command.IsPatient,
            command.IsProvider,
            isAdmin: false,
            cancellationToken)
            ?? throw new KeyNotFoundException("Conversation could not be retrieved after creation.");

        return dto;
    }
}

internal static class ConversationMessagingGuard
{
    public static bool CanSendMessage(
        ConversationMessagingAccess access,
        bool isPatient,
        bool isProvider)
    {
        ArgumentNullException.ThrowIfNull(access);

        if (isPatient)
            return access.CanPatientSendMessage;

        if (isProvider)
            return access.CanProviderSendMessage;

        return false;
    }

    public static string? GetBlockedReason(
        ConversationMessagingAccess access,
        bool isPatient,
        bool isProvider)
    {
        ArgumentNullException.ThrowIfNull(access);

        if (isPatient)
            return access.CanPatientSendMessage ? null : access.PatientBlockedReason;

        if (isProvider)
            return access.CanProviderSendMessage ? null : access.ProviderBlockedReason;

        return null;
    }

    public static void ThrowIfMessagingDisabled(
        ConversationMessagingAccess access,
        bool isPatient,
        bool isProvider)
    {
        ArgumentNullException.ThrowIfNull(access);

        if (isPatient && !access.CanPatientSendMessage)
            throw new InvalidOperationException(GetBlockedMessage(GetBlockedReason(access, isPatient, isProvider)));

        if (isProvider && !access.CanProviderSendMessage)
            throw new InvalidOperationException(GetBlockedMessage(GetBlockedReason(access, isPatient, isProvider)));
    }

    private static string GetBlockedMessage(string? blockedReason)
    {
        return blockedReason switch
        {
            ConversationMessagingBlockedReasons.ProviderDisabledPatientMessages
                => "Provider has disabled patient messages.",
            ConversationMessagingBlockedReasons.PatientDisabledProviderMessages
                => "Patient has disabled provider messages.",
            ConversationMessagingBlockedReasons.NoActiveReservation
                => "Reserve first: messaging is available after there is a confirmed active reservation with this professional.",
            _ => "Messaging is disabled for this conversation."
        };
    }
}
