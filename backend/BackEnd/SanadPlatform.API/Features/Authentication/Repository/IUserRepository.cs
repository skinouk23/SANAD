using SanadPlatform.API.Features.Authentication.Entities;

namespace SanadPlatform.API.Features.Authentication.Repository;

/// <summary>
/// Repository interface for User data access.
/// All methods accept a CancellationToken to support request cancellation.
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked user with Patient and Provider navigation properties loaded.
    /// Use this for operations that require writing back to the user (e.g. login audit, lockout).
    /// </summary>
    Task<User?> GetByEmailWithProfilesAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked user with Patient and Provider navigation properties loaded for a normalized phone number.
    /// Use this for SMS OTP login.
    /// </summary>
    Task<User?> GetByPhoneWithProfilesAsync(string normalizedPhoneNumber, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns a tracked user (with Patient and Provider navigation properties) for the given ID.
    /// Use this for operations that need profile data plus the ability to write back to the user
    /// (e.g. refresh-token response construction).
    /// </summary>
    Task<User?> GetByIdWithProfilesAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns an untracked user with Patient and Provider navigation properties loaded.
    /// Use this for read-only queries that need profile data but do not mutate the user
    /// (e.g. GET /auth/profile). Uses <c>AsNoTracking()</c> for better read performance.
    /// </summary>
    Task<User?> GetByIdWithProfilesReadOnlyAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<User> CreateAsync(User user, CancellationToken cancellationToken = default);

    /// <summary>
    /// Stages an existing user for update.
    /// The entity must have been loaded as tracked before mutation.
    /// EF change tracking detects mutated properties and generates a minimal UPDATE statement.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Returns true if a user with the given email (normalized) already exists.</summary>
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);

    /// <summary>
    /// Atomically increments <c>FailedLoginAttempts</c> and, if the new count reaches
    /// <paramref name="lockoutThreshold"/>, sets <c>LockedUntil</c> to <c>UtcNow + lockoutDuration</c>
    /// — all in a single <c>UPDATE</c> statement to eliminate the lost-update race condition
    /// that exists in the read-modify-write pattern.
    /// </summary>
    Task IncrementFailedLoginAttemptsAsync(
        Guid userId,
        int lockoutThreshold,
        TimeSpan lockoutDuration,
        CancellationToken cancellationToken = default);
}
