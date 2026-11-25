using MediatR;
using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Storage;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Files.Repository;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Request body for partially updating the authenticated account's shared profile state.
/// </summary>
public record UpdateAccountProfileRequest
{
    public string? Phone { get; init; }
    public Guid? AvatarFileId { get; init; }
}

/// <summary>
/// Command to update the authenticated account's shared phone and avatar state.
/// </summary>
public record UpdateAccountProfileCommand(
    Guid UserId,
    string UserRole,
    UpdateAccountProfileRequest Request) : IRequest<UserResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="UpdateAccountProfileCommand"/>.
/// </summary>
public class UpdateAccountProfileHandler : IRequestHandler<UpdateAccountProfileCommand, UserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IStoredFileRepository _storedFileRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateAccountProfileHandler> _logger;

    public UpdateAccountProfileHandler(
        IUserRepository userRepository,
        IStoredFileRepository storedFileRepository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateAccountProfileHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _storedFileRepository = storedFileRepository ?? throw new ArgumentNullException(nameof(storedFileRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UserResponse> Handle(UpdateAccountProfileCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdWithProfilesAsync(command.UserId, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Account profile update failed: User not found for ID {UserId}", command.UserId);
            throw new KeyNotFoundException($"User with id {command.UserId} not found");
        }

        if (command.Request.Phone != null)
        {
            user.Phone = command.Request.Phone;
        }

        var effectiveRole = string.IsNullOrWhiteSpace(user.Role)
            ? command.UserRole
            : user.Role;

        if (command.Request.AvatarFileId.HasValue)
        {
            var expectedAvatarUseCase = GetExpectedAvatarUseCase(effectiveRole);
            var file = await _storedFileRepository.GetByIdAsync(command.Request.AvatarFileId.Value, cancellationToken)
                ?? throw new KeyNotFoundException("Avatar file was not found.");

            if (file.OwnerUserId != command.UserId
                || file.UseCase != expectedAvatarUseCase
                || file.Status != StoredFileStatus.Ready)
            {
                throw new ForbiddenAccessException("Avatar file does not belong to the authenticated user or is not ready.");
            }

            SetAvatarFile(user, effectiveRole, file.Id);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var avatarFileId = GetAvatarFileId(user, effectiveRole);
        var (firstName, lastName) = GetNameParts(user, effectiveRole);

        _logger.LogInformation("Account profile updated for User {UserId}", command.UserId);

        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = user.Phone,
            Avatar = null,
            AvatarFileId = avatarFileId,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    private static (string FirstName, string LastName) GetNameParts(User user, string userRole)
    {
        return userRole.Trim().ToLowerInvariant() switch
        {
            "patient" when user.Patient != null => (user.Patient.FirstName, user.Patient.LastName),
            "provider" when user.Provider != null =>
                (user.Provider.FirstName ?? string.Empty, user.Provider.LastName ?? string.Empty),
            _ => (string.Empty, string.Empty)
        };
    }

    private static FileUseCase GetExpectedAvatarUseCase(string userRole)
    {
        return userRole.Trim().ToLowerInvariant() switch
        {
            "patient" => FileUseCase.Avatar,
            "provider" => FileUseCase.ProviderAvatar,
            _ => throw new InvalidOperationException(
                "Shared account avatar updates are only supported for patient and provider users.")
        };
    }

    private static Guid? GetAvatarFileId(User user, string userRole)
    {
        return userRole.Trim().ToLowerInvariant() switch
        {
            "patient" => user.Patient?.AvatarFileId,
            "provider" => user.Provider?.AvatarFileId,
            _ => null
        };
    }

    private static void SetAvatarFile(User user, string userRole, Guid fileId)
    {
        switch (userRole.Trim().ToLowerInvariant())
        {
            case "patient" when user.Patient != null:
                user.Patient.AvatarFileId = fileId;
                return;

            case "provider" when user.Provider != null:
                user.Provider.AvatarFileId = fileId;
                return;

            case "patient":
                throw new KeyNotFoundException($"Patient profile not found for user ID {user.Id}");

            case "provider":
                throw new KeyNotFoundException($"Provider profile not found for user ID {user.Id}");

            default:
                throw new InvalidOperationException(
                    "Shared account avatar updates are only supported for patient and provider users.");
        }
    }
}
