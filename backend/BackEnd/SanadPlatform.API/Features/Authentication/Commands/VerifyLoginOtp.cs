using MediatR;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Infrastructure.Logging;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command for verifying a login OTP and issuing an authenticated session.
/// </summary>
public record VerifyLoginOtpCommand(
    Guid ChallengeId,
    string Code,
    bool RememberMe,
    string? DeviceFingerprint,
    string? IpAddress,
    string? UserAgent) : IRequest<LoginResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="VerifyLoginOtpCommand"/>.
/// </summary>
public class VerifyLoginOtpHandler : IRequestHandler<VerifyLoginOtpCommand, LoginResponse>
{
    private readonly ILoginOtpChallengeRepository _challengeRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILoginOtpCodeHasher _codeHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly LoginOtpSettings _otpSettings;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<VerifyLoginOtpHandler> _logger;

    public VerifyLoginOtpHandler(
        ILoginOtpChallengeRepository challengeRepository,
        IUserSessionRepository sessionRepository,
        IUnitOfWork unitOfWork,
        ILoginOtpCodeHasher codeHasher,
        IJwtTokenService jwtTokenService,
        IOptions<LoginOtpSettings> otpOptions,
        IOptions<JwtSettings> jwtOptions,
        ILogger<VerifyLoginOtpHandler> logger)
    {
        _challengeRepository = challengeRepository ?? throw new ArgumentNullException(nameof(challengeRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _codeHasher = codeHasher ?? throw new ArgumentNullException(nameof(codeHasher));
        _jwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
        _otpSettings = otpOptions?.Value ?? throw new ArgumentNullException(nameof(otpOptions));
        _jwtSettings = jwtOptions?.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<LoginResponse> Handle(
        VerifyLoginOtpCommand command,
        CancellationToken cancellationToken)
    {
        var challenge = await _challengeRepository.GetByIdWithUserForUpdateAsync(
            command.ChallengeId,
            cancellationToken);

        if (challenge == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired verification code.");
        }

        var now = DateTime.UtcNow;
        if (challenge.ConsumedAt.HasValue
            || challenge.ExpiresAt <= now
            || challenge.FailedAttempts >= _otpSettings.MaxFailedAttempts)
        {
            throw new UnauthorizedAccessException("Invalid or expired verification code.");
        }

        if (!_codeHasher.VerifyCode(challenge.Id, command.Code, challenge.CodeHash))
        {
            challenge.FailedAttempts += 1;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedAccessException("Invalid or expired verification code.");
        }

        var user = challenge.User;
        EnsureUserCanLogin(user);

        challenge.ConsumedAt = now;
        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = now;
        user.LastLoginIp = command.IpAddress;

        var deviceFingerprint = NormalizeDeviceFingerprint(command.DeviceFingerprint)
            ?? NormalizeDeviceFingerprint(challenge.DeviceFingerprint);

        if (deviceFingerprint != null)
        {
            await _sessionRepository.RevokeActiveSessionsForDeviceAsync(
                user.Id,
                deviceFingerprint,
                cancellationToken);
        }

        var rawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var refreshTokenHash = _jwtTokenService.HashToken(rawRefreshToken);
        var sessionId = Guid.NewGuid();

        var session = new UserSession
        {
            Id = sessionId,
            UserId = user.Id,
            RefreshTokenHash = refreshTokenHash,
            DeviceFingerprint = deviceFingerprint,
            IpAddress = command.IpAddress,
            UserAgent = command.UserAgent,
            IsActive = true,
            ExpiresAt = now.AddDays(_jwtSettings.RefreshTokenExpiryDays)
        };
        session.TokenHash = sessionId.ToString();

        await _sessionRepository.CreateAsync(session, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var expiryMinutes = _jwtSettings.ExpiryMinutes;
        var token = _jwtTokenService.GenerateToken(
            user.Email,
            user.Id.ToString(),
            user.Role,
            sessionId,
            expiryMinutes);

        var (name, avatarFileId, countryCode) = BuildProfile(user);

        _logger.LogInformation(
            "User {UserId} logged in successfully with {Channel} OTP (session {SessionId})",
            user.Id,
            challenge.Channel,
            session.Id);

        return new LoginResponse
        {
            User = new LoginUserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Name = name,
                Role = user.Role,
                Phone = user.Phone,
                Avatar = null,
                AvatarFileId = avatarFileId,
                CountryCode = countryCode,
                CreatedAt = user.CreatedAt
            },
            Token = token,
            RefreshToken = rawRefreshToken,
            ExpiresIn = expiryMinutes * 60
        };
    }

    private static void EnsureUserCanLogin(User user)
    {
        if (user.IsSuspended)
        {
            throw new UnauthorizedAccessException("User account is suspended");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User account is inactive");
        }

        if (!string.Equals(user.Role, "provider", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }

        if (user.Provider is null)
        {
            throw new UnauthorizedAccessException("Provider profile is not available for this account.");
        }

        if (!user.Provider.IsApproved)
        {
            var message = string.IsNullOrWhiteSpace(user.Provider.RejectionReason)
                ? "Your provider account is still under review. Login will be available after admin approval."
                : $"Your provider account was rejected: {user.Provider.RejectionReason}";

            throw new UnauthorizedAccessException(message);
        }
    }

    private static (string Name, Guid? AvatarFileId, string? CountryCode) BuildProfile(User user)
    {
        string name = string.Empty;
        Guid? avatarFileId = null;
        string? countryCode = null;

        if (user.Role == "patient" && user.Patient != null)
        {
            name = $"{user.Patient.FirstName} {user.Patient.LastName}";
            avatarFileId = user.Patient.AvatarFileId;
            countryCode = user.Patient.CountryCode;
        }
        else if (user.Role == "provider" && user.Provider != null)
        {
            name = $"{user.Provider.FirstName} {user.Provider.LastName}";
            avatarFileId = user.Provider.AvatarFileId;
            countryCode = user.Provider.CountryCode;
        }

        return (name, avatarFileId, countryCode);
    }

    private static string? NormalizeDeviceFingerprint(string? deviceFingerprint)
    {
        return string.IsNullOrWhiteSpace(deviceFingerprint)
            ? null
            : deviceFingerprint.Trim();
    }
}
