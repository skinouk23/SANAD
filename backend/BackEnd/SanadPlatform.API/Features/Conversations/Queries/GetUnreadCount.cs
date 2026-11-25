using MediatR;
using SanadPlatform.API.Features.Conversations.DTOs;
using SanadPlatform.API.Features.Conversations.Repository;

namespace SanadPlatform.API.Features.Conversations.Queries;

/// <summary>
/// Retrieves the total number of unread messages across all conversations for the authenticated user.
/// </summary>
public record GetUnreadCountQuery(
    Guid UserId,
    bool IsPatient,
    bool IsProvider,
    bool IsAdmin) : IRequest<UnreadCountResponse>;

/// <summary>
/// Handles <see cref="GetUnreadCountQuery"/> by delegating to the repository.
/// </summary>
public class GetUnreadCountHandler
    : IRequestHandler<GetUnreadCountQuery, UnreadCountResponse>
{
    private readonly IConversationRepository _repository;

    /// <summary>
    /// Initializes a new instance of <see cref="GetUnreadCountHandler"/>.
    /// </summary>
    public GetUnreadCountHandler(IConversationRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    /// <inheritdoc />
    public async Task<UnreadCountResponse> Handle(
        GetUnreadCountQuery query,
        CancellationToken ct)
    {
        var count = await _repository.GetTotalUnreadCountAsync(
            query.UserId,
            query.IsPatient, query.IsProvider, query.IsAdmin, ct);

        return new UnreadCountResponse { Count = count };
    }
}
