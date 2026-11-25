using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Repository;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command to revoke a single authenticated user's non-current session.
/// </summary>
public record RevokeSessionCommand(
    Guid UserId,
    Guid CurrentSessionId,
    Guid TargetSessionId) : IRequest<Unit>;

/// <summary>
/// Handler for <see cref="RevokeSessionCommand"/>.
/// </summary>
public class RevokeSessionHandler : IRequestHandler<RevokeSessionCommand, Unit>
{
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RevokeSessionHandler> _logger;

    public RevokeSessionHandler(
        IUserSessionRepository sessionRepository,
        IUnitOfWork unitOfWork,
        ILogger<RevokeSessionHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Unit> Handle(RevokeSessionCommand command, CancellationToken cancellationToken)
    {
        if (command.TargetSessionId == command.CurrentSessionId)
        {
            throw new InvalidOperationException("Cannot revoke the current session");
        }

        var session = await _sessionRepository.GetTrackedSessionByIdAndUserIdAsync(
            command.TargetSessionId,
            command.UserId,
            cancellationToken);

        if (session == null)
        {
            _logger.LogWarning(
                "Session revocation failed: Session {SessionId} not found for User {UserId}",
                command.TargetSessionId,
                command.UserId);
            throw new KeyNotFoundException("Session not found.");
        }

        await _sessionRepository.RevokeSessionAsync(session, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Session {SessionId} revoked for User {UserId}",
            command.TargetSessionId,
            command.UserId);

        return Unit.Value;
    }
}
