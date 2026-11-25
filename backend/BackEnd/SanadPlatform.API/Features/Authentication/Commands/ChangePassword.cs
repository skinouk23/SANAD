using MediatR;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Infrastructure.Logging;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command to change the authenticated user's password.
/// </summary>
public record ChangePasswordCommand(
    Guid UserId,
    Guid CurrentSessionId,
    string CurrentPassword,
    string NewPassword) : IRequest<Unit>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="ChangePasswordCommand"/>.
/// </summary>
public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangePasswordHandler> _logger;

    public ChangePasswordHandler(
        IUserRepository userRepository,
        IUserSessionRepository sessionRepository,
        IPasswordHashingService passwordHashingService,
        IUnitOfWork unitOfWork,
        ILogger<ChangePasswordHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _passwordHashingService = passwordHashingService ?? throw new ArgumentNullException(nameof(passwordHashingService));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Unit> Handle(ChangePasswordCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdWithProfilesAsync(command.UserId, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Password change failed: User not found for ID {UserId}", command.UserId);
            throw new KeyNotFoundException($"User with id {command.UserId} not found");
        }

        if (!_passwordHashingService.VerifyPassword(command.CurrentPassword, user.PasswordHash))
        {
            _logger.LogWarning("Password change failed due to invalid current password for User {UserId}", command.UserId);
            throw new InvalidOperationException("Current password is incorrect");
        }

        if (_passwordHashingService.VerifyPassword(command.NewPassword, user.PasswordHash))
        {
            throw new InvalidOperationException("New password must be different from the current password");
        }

        user.PasswordHash = _passwordHashingService.HashPassword(command.NewPassword);
        user.PasswordChangedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _sessionRepository.RevokeAllOtherSessionsAsync(command.UserId, command.CurrentSessionId, cancellationToken);

        _logger.LogInformation("Password changed for User {UserId}", command.UserId);

        return Unit.Value;
    }
}
