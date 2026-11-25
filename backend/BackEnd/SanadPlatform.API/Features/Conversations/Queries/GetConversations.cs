using MediatR;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Repository;
using SanadPlatform.API.Features.Conversations.Specifications;

namespace SanadPlatform.API.Features.Conversations.Queries;

/// <summary>
/// Retrieves a paginated list of conversations for the authenticated user.
/// </summary>
public record GetConversationsQuery(
    GetConversationsRequest Request,
    Guid UserId,
    bool IsPatient,
    bool IsProvider,
    bool IsAdmin) : IRequest<ConversationsResponse>;

/// <summary>
/// Handles <see cref="GetConversationsQuery"/> by building a specification and delegating to the repository.
/// </summary>
public class GetConversationsHandler
    : IRequestHandler<GetConversationsQuery, ConversationsResponse>
{
    private readonly IConversationRepository _repository;

    /// <summary>
    /// Initializes a new instance of <see cref="GetConversationsHandler"/>.
    /// </summary>
    public GetConversationsHandler(IConversationRepository repository)
        => _repository = repository;

    /// <inheritdoc />
    public async Task<ConversationsResponse> Handle(
        GetConversationsQuery query,
        CancellationToken ct)
    {
        var spec = new ConversationSpecification(
            query.Request, query.UserId,
            query.IsPatient, query.IsProvider, query.IsAdmin);
        return await _repository.GetConversationsAsync(spec, ct);
    }
}
