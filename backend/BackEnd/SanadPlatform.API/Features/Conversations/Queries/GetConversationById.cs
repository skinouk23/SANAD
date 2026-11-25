using MediatR;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Repository;

namespace SanadPlatform.API.Features.Conversations.Queries;

/// <summary>
/// Retrieves a single conversation by its ID.
/// Returns 404 (not 403) for non-participants to avoid leaking conversation existence.
/// </summary>
public record GetConversationByIdQuery(
    Guid Id,
    Guid UserId,
    bool IsPatient,
    bool IsProvider,
    bool IsAdmin) : IRequest<ConversationResponse>;

/// <summary>
/// Handles <see cref="GetConversationByIdQuery"/> by delegating to the repository.
/// </summary>
public class GetConversationByIdHandler
    : IRequestHandler<GetConversationByIdQuery, ConversationResponse>
{
    private readonly IConversationRepository _repository;

    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationByIdHandler"/>.
    /// </summary>
    public GetConversationByIdHandler(IConversationRepository repository)
        => _repository = repository;

    /// <inheritdoc />
    public async Task<ConversationResponse> Handle(
        GetConversationByIdQuery query,
        CancellationToken ct)
    {
        var result = await _repository.GetByIdAsync(
            query.Id, query.UserId,
            query.IsPatient, query.IsProvider, query.IsAdmin, ct);

        if (result is null)
            throw new KeyNotFoundException("Conversation not found.");

        return result;
    }
}
