using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Logging;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Features.Admin.Entities;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Infrastructure.Database;
using SanadPlatform.API.Infrastructure.Logging;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command to soft-delete the authenticated user's account and linked profiles.
/// </summary>
public record DeleteAccountCommand(
    Guid UserId,
    string CurrentPassword,
    string? IpAddress,
    string? UserAgent) : IRequest<Unit>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="DeleteAccountCommand"/>.
/// </summary>
public class DeleteAccountHandler : IRequestHandler<DeleteAccountCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IPasswordHashingService _passwordHashingService;
    private readonly SanadDbContext _dbContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteAccountHandler> _logger;

    public DeleteAccountHandler(
        IUserRepository userRepository,
        IUserSessionRepository sessionRepository,
        IPasswordHashingService passwordHashingService,
        SanadDbContext dbContext,
        IUnitOfWork unitOfWork,
        ILogger<DeleteAccountHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _passwordHashingService = passwordHashingService ?? throw new ArgumentNullException(nameof(passwordHashingService));
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<Unit> Handle(DeleteAccountCommand command, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async (ct) =>
        {
            var user = await _userRepository.GetByIdWithProfilesAsync(command.UserId, ct);

            if (user == null)
            {
                throw new KeyNotFoundException($"User with id {command.UserId} not found");
            }

            if (!_passwordHashingService.VerifyPassword(command.CurrentPassword, user.PasswordHash))
            {
                throw new InvalidOperationException("Current password is incorrect");
            }

            var oldData = SerializeDeletionState(user);

            await _sessionRepository.RevokeAllUserSessionsAsync(command.UserId, ct);

            var deletedAt = DateTime.UtcNow;
            user.IsActive = false;
            user.DeletedAt = deletedAt;

            if (user.Patient != null)
            {
                user.Patient.DeletedAt = deletedAt;
            }

            if (user.Provider != null)
            {
                user.Provider.DeletedAt = deletedAt;
            }

            var changedFields = new List<string>
            {
                "is_active",
                "deleted_at"
            };

            if (user.Patient != null)
            {
                changedFields.Add("patient.deleted_at");
            }

            if (user.Provider != null)
            {
                changedFields.Add("provider.deleted_at");
            }

            var auditLog = new AuditLog
            {
                Id = Guid.NewGuid(),
                TableName = "users",
                RecordId = user.Id,
                Action = "account_deleted",
                UserId = user.Id,
                OldData = oldData,
                NewData = SerializeDeletionState(user),
                ChangedFields = changedFields,
                IpAddress = command.IpAddress,
                UserAgent = command.UserAgent
            };

            _dbContext.AuditLogs.Add(auditLog);

            await _unitOfWork.SaveChangesAsync(ct);
        }, cancellationToken);

        _logger.LogInformation("Deleted account for User {UserId}", command.UserId);

        return Unit.Value;
    }

    private static string SerializeDeletionState(User user)
    {
        return JsonSerializer.Serialize(new
        {
            isActive = user.IsActive,
            deletedAt = user.DeletedAt,
            patientDeletedAt = user.Patient?.DeletedAt,
            providerDeletedAt = user.Provider?.DeletedAt
        });
    }
}
