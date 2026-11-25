using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Authentication.Repository;

/// <summary>
/// EF Core implementation of <see cref="IUserSessionRepository"/>.
/// All DB operations accept a <see cref="CancellationToken"/> to honour request cancellation.
/// </summary>
public class UserSessionRepository : IUserSessionRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<UserSessionRepository> _logger;

    public UserSessionRepository(SanadDbContext context, ILogger<UserSessionRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Stages a new session in the EF change tracker.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    public Task<UserSession> CreateAsync(UserSession session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        _context.UserSessions.Add(session);
        _logger.LogDebug("UserSession {SessionId} staged for insertion (user {UserId})", session.Id, session.UserId);
        return Task.FromResult(session);
    }

    /// <summary>
    /// Returns the active session with the given PK, or null if not found / revoked.
    /// </summary>
    public async Task<UserSession?> GetActiveByIdAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        return await _context.UserSessions
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.IsActive, cancellationToken);
    }

    /// <summary>
    /// Returns all live active sessions for the given user, ordered newest-first.
    /// </summary>
    public async Task<IReadOnlyList<UserSession>> GetActiveSessionsByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        return await _context.UserSessions
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.IsActive && s.ExpiresAt > now)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Returns a tracked live active session owned by the given user.
    /// </summary>
    public async Task<UserSession?> GetTrackedSessionByIdAndUserIdAsync(
        Guid sessionId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        return await _context.UserSessions
            .FirstOrDefaultAsync(
                s => s.Id == sessionId
                    && s.UserId == userId
                    && s.IsActive
                    && s.ExpiresAt > now,
                cancellationToken);
    }

    /// <summary>
    /// Returns a tracked active session owned by the given user without enforcing expiry.
    /// </summary>
    public async Task<UserSession?> GetTrackedActiveSessionByIdAndUserIdAsync(
        Guid sessionId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.UserSessions
            .FirstOrDefaultAsync(
                s => s.Id == sessionId
                    && s.UserId == userId
                    && s.IsActive,
                cancellationToken);
    }

    /// <summary>
    /// Finds an active session by its refresh token hash.
    /// </summary>
    public async Task<UserSession?> GetByRefreshTokenHashAsync(string refreshTokenHash, CancellationToken cancellationToken = default)
    {
        return await _context.UserSessions
            .FirstOrDefaultAsync(s => s.RefreshTokenHash == refreshTokenHash && s.IsActive, cancellationToken);
    }

    /// <summary>
    /// Finds a revoked session by its refresh token hash (stolen-token detection).
    /// </summary>
    public async Task<UserSession?> GetRevokedByRefreshTokenHashAsync(string refreshTokenHash, CancellationToken cancellationToken = default)
    {
        return await _context.UserSessions
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.RefreshTokenHash == refreshTokenHash && !s.IsActive, cancellationToken);
    }

    /// <summary>
    /// Returns true if a session exists, is active, unexpired, and still belongs to a live user.
    /// </summary>
    public async Task<bool> IsActiveAsync(Guid sessionId, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        return await _context.UserSessions
            .AsNoTracking()
            .AnyAsync(
                s => s.Id == sessionId
                    && s.IsActive
                    && s.ExpiresAt > now
                    && s.User.IsActive
                    && s.User.DeletedAt == null,
                cancellationToken);
    }

    /// <summary>
    /// Marks a single session as revoked.
    /// The session must have been loaded as tracked (e.g. via <see cref="GetByRefreshTokenHashAsync"/>).
    /// EF change tracking detects the property mutations — no explicit Update() call is needed.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    public Task RevokeSessionAsync(UserSession session, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(session);

        session.IsActive = false;
        session.RevokedAt = DateTime.UtcNow;
        _logger.LogDebug("UserSession {SessionId} staged for revocation", session.Id);
        return Task.CompletedTask;
    }

    /// <summary>
    /// Atomically revokes all active sessions for the given user except the current session.
    /// Falls back to tracked entity updates when the provider does not support set-based updates
    /// (e.g. the EF Core InMemory provider used by unit tests).
    /// </summary>
    public async Task RevokeAllOtherSessionsAsync(
        Guid userId,
        Guid currentSessionId,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var query = _context.UserSessions
            .Where(s => s.UserId == userId && s.Id != currentSessionId && s.IsActive);

        int count;

        if (_context.Database.IsRelational())
        {
            count = await query.ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(s => s.IsActive, false)
                    .SetProperty(s => s.RevokedAt, now),
                cancellationToken);
        }
        else
        {
            var sessions = await query.ToListAsync(cancellationToken);
            foreach (var session in sessions)
            {
                session.IsActive = false;
                session.RevokedAt = now;
            }

            count = sessions.Count;
            await _context.SaveChangesAsync(cancellationToken);
        }

        _logger.LogDebug(
            "Revoked {Count} other active session(s) for user {UserId} while preserving current session {CurrentSessionId}",
            count,
            userId,
            currentSessionId);
    }

    /// <summary>
    /// Revokes active sessions for the given user and device fingerprint.
    /// Falls back to tracked entity updates when the provider does not support set-based updates
    /// (e.g. the EF Core InMemory provider used by unit tests).
    /// </summary>
    public async Task RevokeActiveSessionsForDeviceAsync(
        Guid userId,
        string deviceFingerprint,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(deviceFingerprint))
        {
            return;
        }

        var normalizedDeviceFingerprint = deviceFingerprint.Trim();
        var now = DateTime.UtcNow;
        var query = _context.UserSessions
            .Where(s => s.UserId == userId
                && s.DeviceFingerprint == normalizedDeviceFingerprint
                && s.IsActive);

        int count;

        if (_context.Database.IsRelational())
        {
            count = await query.ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(s => s.IsActive, false)
                    .SetProperty(s => s.RevokedAt, now),
                cancellationToken);
        }
        else
        {
            var sessions = await query.ToListAsync(cancellationToken);
            foreach (var session in sessions)
            {
                session.IsActive = false;
                session.RevokedAt = now;
            }

            count = sessions.Count;
        }

        _logger.LogDebug(
            "Revoked {Count} active session(s) for user {UserId} and device fingerprint",
            count,
            userId);
    }

    /// <summary>
    /// Stages revocation of ALL active sessions for the given user.
    /// Uses <c>ExecuteUpdateAsync</c> when the provider supports set-based updates (relational)
    /// and stages tracked entity updates otherwise (non-relational, e.g. InMemory).
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    public async Task RevokeAllUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var query = _context.UserSessions
            .Where(s => s.UserId == userId && s.IsActive);

        int count;

        if (_context.Database.IsRelational())
        {
            count = await query.ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(s => s.IsActive, false)
                    .SetProperty(s => s.RevokedAt, now),
                cancellationToken);
        }
        else
        {
            var sessions = await query.ToListAsync(cancellationToken);
            foreach (var session in sessions)
            {
                session.IsActive = false;
                session.RevokedAt = now;
            }

            count = sessions.Count;
        }

        _logger.LogDebug(
            "Revoked {Count} active session(s) for user {UserId}",
            count,
            userId);
    }
}
