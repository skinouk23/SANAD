using MediatR;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Repository;

namespace SanadPlatform.API.Features.Authentication.Queries;

/// <summary>
/// Query to get the user profile.
/// </summary>
public record GetUserProfileQuery(Guid UserId) : IRequest<UserResponse>;

/// <summary>
/// Query handler for getting user profile.
/// Loads user with Patient/Provider navigation properties via <see cref="IUserRepository"/>
/// using a non-tracked (read-only) query.
/// </summary>
public class GetUserProfileHandler : IRequestHandler<GetUserProfileQuery, UserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<GetUserProfileHandler> _logger;

    public GetUserProfileHandler(
        IUserRepository userRepository,
        ILogger<GetUserProfileHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<UserResponse> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdWithProfilesReadOnlyAsync(request.UserId, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Profile request failed: User not found for ID {UserId}", request.UserId);
            throw new KeyNotFoundException($"User with id {request.UserId} not found");
        }

        string firstName = string.Empty;
        string lastName = string.Empty;
        Guid? avatarFileId = null;

        if (user.Role == "patient" && user.Patient != null)
        {
            firstName = user.Patient.FirstName;
            lastName = user.Patient.LastName;
            avatarFileId = user.Patient.AvatarFileId;
        }
        else if (user.Role == "provider" && user.Provider != null)
        {
            firstName = user.Provider.FirstName ?? string.Empty;
            lastName = user.Provider.LastName ?? string.Empty;
            avatarFileId = user.Provider.AvatarFileId;
        }

        _logger.LogInformation("Profile retrieved for User ID {UserId}", request.UserId);

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
}
