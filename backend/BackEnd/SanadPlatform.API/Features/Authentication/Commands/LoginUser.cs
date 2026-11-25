using MediatR;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Interfaces;
using SanadPlatform.API.Common.Options;
using SanadPlatform.API.Features.Authentication.DTOs;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Features.Authentication.Repository;
using SanadPlatform.API.Features.Authentication.Services;
using SanadPlatform.API.Infrastructure.Logging;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Authentication.Commands;

/// <summary>
/// Command for user login.
/// <para>
/// <c>IpAddress</c> and <c>UserAgent</c> are captured in the controller from <c>HttpContext</c>
/// and stored in the new <see cref="UserSession"/> row created on every successful login.
/// </para>
/// </summary>
public record LoginUserCommand(
    string Email,
    string Password,
    bool RememberMe,
    string? DeviceFingerprint,
    string? IpAddress,
    string? UserAgent) : IRequest<LoginResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="LoginUserCommand"/>.
/// Normalizes the email before querying, enforces account lockout, checks suspension,
/// updates audit fields (<c>LastLoginAt</c>, <c>LastLoginIp</c>, <c>FailedLoginAttempts</c>),
/// creates a <see cref="UserSession"/>, embeds its ID as a <c>session_id</c> JWT claim,
/// and returns a signed access token plus a raw refresh token.
/// </summary>
public class LoginUserHandler : IRequestHandler<LoginUserCommand, LoginResponse>
{
    // Number of consecutive failures before the account is temporarily locked.
    private const int MaxFailedAttempts = 5;

    // How long to lock the account after MaxFailedAttempts consecutive failures.
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);

    private readonly IUserRepository _userRepository;
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHashingService _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<LoginUserHandler> _logger;

    public LoginUserHandler(
        IUserRepository userRepository,
        IUserSessionRepository sessionRepository,
        IUnitOfWork unitOfWork,
        IPasswordHashingService passwordHasher,
        IJwtTokenService jwtTokenService,
        IOptions<JwtSettings> jwtOptions,
        ILogger<LoginUserHandler> logger)
    {
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
        _jwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
        _jwtSettings = jwtOptions?.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<LoginResponse> Handle(LoginUserCommand command, CancellationToken cancellationToken)
    {
        // ── #1: Normalize email to match how registration stores it ──────────
        // Registration calls Trim().ToLowerInvariant() before saving; the query
        // must use the same form or it will never match a mixed-case input.
        // GetByEmailWithProfilesAsync normalizes internally AND returns a tracked
        // entity (so we can write back FailedLoginAttempts / LastLoginAt).
        var user = await _userRepository.GetByEmailWithProfilesAsync(command.Email, cancellationToken);

        // ── Account lockout check ─────────────────────────────────────────────
        // Check lockout BEFORE verifying the password to prevent timing side-channels
        // that could hint whether the account exists.
        if (user != null && user.LockedUntil.HasValue && user.LockedUntil.Value > DateTime.UtcNow)
        {
            var remaining = (int)Math.Ceiling((user.LockedUntil.Value - DateTime.UtcNow).TotalMinutes);
            _logger.LogWarning("Login attempt on locked account {UserId}", user.Id);
            throw new UnauthorizedAccessException(
                $"Account is temporarily locked. Please try again in {remaining} minute(s).");
        }

        // ── Credential validation ─────────────────────────────────────────────
        var credentialsValid = user != null
            && _passwordHasher.VerifyPassword(command.Password, user.PasswordHash);

        if (!credentialsValid)
        {
            // Atomically increment failure counter and conditionally lock the account
            // in a single UPDATE statement — avoids the lost-update race condition that
            // occurs when multiple concurrent failed logins all read the same count,
            // increment it in memory, and write back different values.
            if (user != null)
            {
                await _userRepository.IncrementFailedLoginAttemptsAsync(
                    user.Id,
                    MaxFailedAttempts,
                    LockoutDuration,
                    cancellationToken);

                _logger.LogWarning(
                    "Failed login attempt for User {UserId}. Lockout threshold: {Threshold}",
                    user.Id, MaxFailedAttempts);
            }

            // Return the same generic message regardless of whether the user exists
            // to prevent email enumeration.
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // ── Suspension check ──────────────────────────────────────────────────
        if (user!.IsSuspended)
        {
            throw new UnauthorizedAccessException("User account is suspended");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("User account is inactive");
        }

        if (string.Equals(user.Role, "provider", StringComparison.OrdinalIgnoreCase))
        {
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

        // ── Reset lockout counters and update audit fields ────────────────────
        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        user.LastLoginIp = command.IpAddress;

        // ── Create UserSession ────────────────────────────────────────────────
        // The session ID is embedded in the JWT as a `session_id` claim, enabling
        // O(1) revocation checks on every authenticated request.
        var deviceFingerprint = NormalizeDeviceFingerprint(command.DeviceFingerprint);

        if (deviceFingerprint != null)
        {
            await _sessionRepository.RevokeActiveSessionsForDeviceAsync(
                user.Id,
                deviceFingerprint,
                cancellationToken);
        }

        var rawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var refreshTokenHash = _jwtTokenService.HashToken(rawRefreshToken);

        // Explicitly generate ID in C# so it's available before SaveChanges
        var sessionId = Guid.NewGuid();

        var session = new UserSession
        {
            Id = sessionId, // Assign generated ID
            UserId = user.Id,
            // TokenHash carries the session ID string to satisfy the NOT NULL DB constraint.
            // The session_id claim in the JWT points back to this row's PK directly.
            RefreshTokenHash = refreshTokenHash,
            DeviceFingerprint = deviceFingerprint,
            IpAddress = command.IpAddress,
            UserAgent = command.UserAgent,
            IsActive = true,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays)
        };
        // Satisfy NOT NULL constraint using the session's own ID.
        session.TokenHash = sessionId.ToString();

        // User is already tracked (loaded via GetByEmailWithProfilesAsync which does not use
        // AsNoTracking). The EF change tracker detects the mutations above (FailedLoginAttempts,
        // LastLoginAt, LastLoginIp, LockedUntil) and will include them in the UPDATE statement
        // issued by SaveChangesAsync — no explicit UpdateAsync call needed.
        await _sessionRepository.CreateAsync(session, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // ── Generate JWT (after session is persisted so session.Id is stable) ─
        var expiryMinutes = _jwtSettings.ExpiryMinutes;
        var token = _jwtTokenService.GenerateToken(
            user.Email,
            user.Id.ToString(),
            user.Role,
            sessionId,
            expiryMinutes);

        // ── Build profile response ────────────────────────────────────────────
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

        _logger.LogInformation("User {UserId} logged in successfully (session {SessionId})", user.Id, session.Id);

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

    private static string? NormalizeDeviceFingerprint(string? deviceFingerprint)
    {
        return string.IsNullOrWhiteSpace(deviceFingerprint)
            ? null
            : deviceFingerprint.Trim();
    }
}
