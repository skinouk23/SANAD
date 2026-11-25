using MediatR;
using SanadPlatform.API.Features.Authentication.Repository;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command to revoke all authenticated user's live sessions except the current one.
/// </summary>
public record RevokeOtherSessionsCommand(Guid UserId, Guid CurrentSessionId) : IRequest<Unit>;

/// <summary>
/// Handler for <see cref="RevokeOtherSessionsCommand"/>.
/// </summary>
public class RevokeOtherSessionsHandler : IRequestHandler<RevokeOtherSessionsCommand, Unit>
{
    private readonly IUserSessionRepository _sessionRepository;
    private readonly ILogger<RevokeOtherSessionsHandler> _logger;

    public RevokeOtherSessionsHandler(
        IUserSessionRepository sessionRepository,
        ILogger<RevokeOtherSessionsHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Unit> Handle(RevokeOtherSessionsCommand command, CancellationToken cancellationToken)
    {
        await _sessionRepository.RevokeAllOtherSessionsAsync(
            command.UserId,
            command.CurrentSessionId,
            cancellationToken);

        _logger.LogInformation(
            "All other sessions revoked for User {UserId} while preserving current session {CurrentSessionId}",
            command.UserId,
            command.CurrentSessionId);

        return Unit.Value;
    }
}
