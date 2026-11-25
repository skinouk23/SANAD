using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Repository;

/// <summary>
/// Repository interface for <see cref="UserSession"/> data access.
/// All methods accept a <see cref="CancellationToken"/> to support request cancellation.
/// </summary>
public interface IUserSessionRepository
{
    /// <summary>
    /// Stages a new session in the EF change tracker.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    Task<UserSession> CreateAsync(UserSession session, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the active session with the given PK, or <c>null</c> if not found or revoked.
    /// Used by the JWT <c>OnTokenValidated</c> event to verify the session is still live.
    /// </summary>
    Task<UserSession?> GetActiveByIdAsync(Guid sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns all non-expired active sessions for the given user as read-only entities,
    /// ordered newest-first for the security overview endpoint.
    /// </summary>
    Task<IReadOnlyList<UserSession>> GetActiveSessionsByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked non-expired active session owned by the given user,
    /// or <c>null</c> if the session does not exist or is not revocable.
    /// </summary>
    Task<UserSession?> GetTrackedSessionByIdAndUserIdAsync(
        Guid sessionId,
        Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked active session owned by the given user,
    /// or <c>null</c> if the session does not exist or is already revoked.
    /// This lookup intentionally does not require <c>ExpiresAt</c> to be in the future.
    /// </summary>
    Task<UserSession?> GetTrackedActiveSessionByIdAndUserIdAsync(
        Guid sessionId,
        Guid userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Finds an <em>active</em> session whose <c>refresh_token_hash</c> matches the provided hash.
    /// Returns <c>null</c> if not found.
    /// </summary>
    Task<UserSession?> GetByRefreshTokenHashAsync(string refreshTokenHash, CancellationToken cancellationToken = default);

    /// <summary>
    /// Finds a <em>revoked</em> session whose <c>refresh_token_hash</c> matches the provided hash.
    /// Used for stolen-token detection: if the old (already-rotated) token is presented again,
    /// this returns the revoked session so the handler can revoke all user sessions.
    /// </summary>
    Task<UserSession?> GetRevokedByRefreshTokenHashAsync(string refreshTokenHash, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns <c>true</c> only when the session exists, is active, has not expired,
    /// and its owning user is still active and not soft-deleted.
    /// O(1) primary-key lookup; used on every authenticated request.
    /// </summary>
    Task<bool> IsActiveAsync(Guid sessionId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks the given session as revoked (<c>is_active = false</c>, <c>revoked_at = now</c>).
    /// The session must have been loaded as tracked (e.g. via <see cref="GetByRefreshTokenHashAsync"/>).
    /// EF change tracking detects the mutations — no explicit Update() call is needed.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    Task RevokeSessionAsync(UserSession session, CancellationToken cancellationToken = default);

    /// <summary>
    /// Atomically revokes all active sessions for the given user except the current session.
    /// Uses <c>ExecuteUpdateAsync</c> when the provider supports set-based updates.
    /// </summary>
    Task RevokeAllOtherSessionsAsync(
        Guid userId,
        Guid currentSessionId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Revokes active sessions for the given user and non-empty device fingerprint.
    /// Uses <c>ExecuteUpdateAsync</c> when the provider supports set-based updates
    /// and stages tracked entity updates otherwise.
    /// </summary>
    Task RevokeActiveSessionsForDeviceAsync(
        Guid userId,
        string deviceFingerprint,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages revocation of ALL active sessions for the given user.
    /// Uses <c>ExecuteUpdateAsync</c> when the provider supports set-based updates
    /// and stages tracked entity updates otherwise.
    /// The caller must invoke <c>IUnitOfWork.SaveChangesAsync</c> to persist.
    /// </summary>
    Task RevokeAllUserSessionsAsync(Guid userId, CancellationToken cancellationToken = default);
}
