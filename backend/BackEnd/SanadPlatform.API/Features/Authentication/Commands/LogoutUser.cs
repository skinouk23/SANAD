using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command to revoke the caller's current session or a session identified by refresh token.
/// </summary>
public record LogoutUserCommand(Guid? UserId, Guid? SessionId, string? RefreshToken) : IRequest<Unit>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="LogoutUserCommand"/>.
/// Logout is idempotent: missing or already-revoked sessions are treated as success.
/// </summary>
public class LogoutUserHandler : IRequestHandler<LogoutUserCommand, Unit>
{
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILogger<LogoutUserHandler> _logger;

    public LogoutUserHandler(
        IUserSessionRepository sessionRepository,
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtTokenService,
        ILogger<LogoutUserHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _jwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<Unit> Handle(LogoutUserCommand command, CancellationToken cancellationToken)
    {
        var session = await FindSessionToRevokeAsync(command, cancellationToken);

        if (session == null)
        {
            _logger.LogInformation(
                "Logout completed without session revocation. UserId present: {HasUserId}, SessionId present: {HasSessionId}, RefreshToken supplied: {HasRefreshToken}",
                command.UserId.HasValue,
                command.SessionId.HasValue,
                HasRefreshToken(command.RefreshToken));

            return Unit.Value;
        }

        await _sessionRepository.RevokeSessionAsync(session, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Session {SessionId} revoked for User {UserId} during logout",
            session.Id,
            session.UserId);

        return Unit.Value;
    }

    private async Task<UserSession?> FindSessionToRevokeAsync(
        LogoutUserCommand command,
        CancellationToken cancellationToken)
    {
        if (command.UserId.HasValue && command.SessionId.HasValue)
        {
            var session = await _sessionRepository.GetTrackedActiveSessionByIdAndUserIdAsync(
                command.SessionId.Value,
                command.UserId.Value,
                cancellationToken);

            if (session != null)
            {
                return session;
            }

            _logger.LogInformation(
                "Logout did not find active session {SessionId} for User {UserId}; refresh-token fallback available: {HasRefreshToken}",
                command.SessionId.Value,
                command.UserId.Value,
                HasRefreshToken(command.RefreshToken));
        }

        if (!HasRefreshToken(command.RefreshToken))
        {
            return null;
        }

        var refreshTokenHash = _jwtTokenService.HashToken(command.RefreshToken!);
        return await _sessionRepository.GetByRefreshTokenHashAsync(refreshTokenHash, cancellationToken);
    }

    private static bool HasRefreshToken(string? refreshToken)
    {
        return !string.IsNullOrWhiteSpace(refreshToken);
    }
}
