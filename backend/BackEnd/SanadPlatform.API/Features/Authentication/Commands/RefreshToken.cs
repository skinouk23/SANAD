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
/// Command to rotate a refresh token.
/// <para>
/// The caller supplies the raw refresh token and the current request's IP address /
/// user-agent.  A new access token + refresh token pair is returned; the old session
/// is revoked and a new one is created (single-use rotation).
/// </para>
/// </summary>
public record RefreshTokenCommand(
    string RefreshToken,
    string? DeviceFingerprint,
    string? IpAddress,
    string? UserAgent) : IRequest<LoginResponse>, ISensitiveRequest;

/// <summary>
/// Handler for <see cref="RefreshTokenCommand"/>.
/// <list type="bullet">
///   <item>Hashes the incoming token and looks up an active session.</item>
///   <item>If no active session is found, checks if the token was already used
///         (revoked session).  A match means the token was stolen — all active
///         sessions for that user are immediately revoked (token-family invalidation).</item>
///   <item>If the active session has expired, revokes that session and rejects the request.</item>
///   <item>On a valid active session: revokes the old session, creates a new one
///         with a fresh refresh token, and issues a new JWT.</item>
/// </list>
/// </summary>
public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    private readonly IUserSessionRepository _sessionRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<RefreshTokenHandler> _logger;

    public RefreshTokenHandler(
        IUserSessionRepository sessionRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtTokenService,
        IOptions<JwtSettings> jwtOptions,
        ILogger<RefreshTokenHandler> logger)
    {
        _sessionRepository = sessionRepository ?? throw new ArgumentNullException(nameof(sessionRepository));
        _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _jwtTokenService = jwtTokenService ?? throw new ArgumentNullException(nameof(jwtTokenService));
        _jwtSettings = jwtOptions?.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<LoginResponse> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
    {
        var tokenHash = _jwtTokenService.HashToken(command.RefreshToken);

        // ── Look up active session ────────────────────────────────────────────
        var session = await _sessionRepository.GetByRefreshTokenHashAsync(tokenHash, cancellationToken);

        if (session == null)
        {
            // The token did not match any active session.
            // Check if it matches a revoked session — if so, this is a stolen-token replay.
            var revokedSession = await _sessionRepository.GetRevokedByRefreshTokenHashAsync(tokenHash, cancellationToken);

            if (revokedSession != null)
            {
                // Stolen-token detected: revoke ALL active sessions for this user.
                _logger.LogWarning(
                    "Refresh token reuse detected for user {UserId}. Revoking all sessions.",
                    revokedSession.UserId);

                await _sessionRepository.RevokeAllUserSessionsAsync(revokedSession.UserId, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        // ── Validate session expiry ───────────────────────────────────────────
        if (session.ExpiresAt <= DateTime.UtcNow)
        {
            await _sessionRepository.RevokeSessionAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedAccessException("Refresh token has expired. Please log in again.");
        }

        // ── Load user with profiles ───────────────────────────────────────────
        var user = await _userRepository.GetByIdWithProfilesAsync(session.UserId, cancellationToken)
            ?? throw new KeyNotFoundException($"User {session.UserId} not found.");

        if (user.IsSuspended || !user.IsActive)
        {
            await _sessionRepository.RevokeSessionAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedAccessException("User account is no longer active.");
        }

        if (string.Equals(user.Role, "provider", StringComparison.OrdinalIgnoreCase)
            && user.Provider is not { IsApproved: true })
        {
            await _sessionRepository.RevokeSessionAsync(session, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            throw new UnauthorizedAccessException("Provider account is no longer approved. Please contact support.");
        }

        // ── Rotate: revoke old session, create new one ────────────────────────
        await _sessionRepository.RevokeSessionAsync(session, cancellationToken);

        var rawRefreshToken = _jwtTokenService.GenerateRefreshToken();
        var refreshTokenHash = _jwtTokenService.HashToken(rawRefreshToken);
        var deviceFingerprint = NormalizeDeviceFingerprint(command.DeviceFingerprint)
            ?? session.DeviceFingerprint;

        // Explicitly generate ID in C# so it's available before SaveChanges
        var sessionId = Guid.NewGuid();

        var newSession = new UserSession
        {
            Id = sessionId, // Assign generated ID
            UserId = user.Id,
            RefreshTokenHash = refreshTokenHash,
            DeviceFingerprint = deviceFingerprint,
            IpAddress = command.IpAddress,
            UserAgent = command.UserAgent,
            IsActive = true,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays)
        };
        newSession.TokenHash = sessionId.ToString();

        await _sessionRepository.CreateAsync(newSession, cancellationToken);

        try
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
        {
            // Another concurrent request already rotated or revoked this session
            // (xmin mismatch on UserSession). Treat as an invalid/already-used token.
            _logger.LogWarning(
                "Refresh token rotation conflict for session {SessionId} (user {UserId}). " +
                "Concurrent rotation detected — rejecting request.",
                session.Id, user.Id);
            throw new UnauthorizedAccessException(
                "Refresh token has already been used. Please log in again.");
        }

        // ── Issue new JWT ─────────────────────────────────────────────────────
        var expiryMinutes = _jwtSettings.ExpiryMinutes;
        var token = _jwtTokenService.GenerateToken(
            user.Email,
            user.Id.ToString(),
            user.Role,
            sessionId,
            expiryMinutes);

        // ── Build profile payload (mirrors LoginUser) ─────────────────────────
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

        _logger.LogInformation(
            "Refresh token rotated for user {UserId}: old session {OldSessionId} → new session {NewSessionId}",
            user.Id, session.Id, newSession.Id);

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
