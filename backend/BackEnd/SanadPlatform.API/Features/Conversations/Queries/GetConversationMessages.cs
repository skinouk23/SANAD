using MediatR;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Repository;

namespace SanadPlatform.API.Features.Conversations.Queries;

/// <summary>
/// Retrieves a paginated list of messages within a specific conversation.
/// Supports offset-based pagination and cursor-based infinite scroll via the <c>Before</c> timestamp.
/// </summary>
/// <param name="ConversationId">The conversation UUID.</param>
/// <param name="Request">Pagination and cursor parameters.</param>
/// <param name="UserId">Authenticated user's ID (from JWT claims).</param>
/// <param name="IsPatient">Whether the caller has the patient role.</param>
/// <param name="IsProvider">Whether the caller has the provider role.</param>
/// <param name="IsAdmin">Whether the caller has the admin role.</param>
public record GetConversationMessagesQuery(
    Guid ConversationId,
    GetConversationMessagesRequest Request,
    Guid UserId,
    bool IsPatient,
    bool IsProvider,
    bool IsAdmin) : IRequest<ConversationMessagesResponse>;

/// <summary>
/// Handles <see cref="GetConversationMessagesQuery"/> by delegating to the repository.
/// </summary>
public class GetConversationMessagesHandler
    : IRequestHandler<GetConversationMessagesQuery, ConversationMessagesResponse>
{
    private readonly IConversationRepository _repository;

    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationMessagesHandler"/>.
    /// </summary>
    public GetConversationMessagesHandler(IConversationRepository repository)
        => _repository = repository;

    /// <inheritdoc />
    public async Task<ConversationMessagesResponse> Handle(
        GetConversationMessagesQuery query,
        CancellationToken ct)
    {
        var result = await _repository.GetMessagesByConversationIdAsync(
            query.ConversationId,
            query.Request,
            query.UserId,
            query.IsPatient, query.IsProvider, query.IsAdmin,
            ct);

        if (result is null)
            throw new KeyNotFoundException("Conversation not found.");

        return result;
    }
}
