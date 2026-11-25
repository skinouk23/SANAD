using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Authentication.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Authentication.Repository;

/// <summary>
/// User repository implementation.
/// Provides data access for User entities, following the repository pattern.
/// All DB operations accept a CancellationToken to honour request cancellation.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<UserRepository> _logger;

    public UserRepository(SanadDbContext context, ILogger<UserRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>Get user by ID.</summary>
    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    /// <summary>Get user by email (case-insensitive match against stored lowercase value).</summary>
    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);
    }

    /// <summary>
    /// Returns a tracked user (with Patient and Provider navigation properties) for the given email.
    /// Tracked so that callers can mutate and save (e.g. LastLoginAt, FailedLoginAttempts).
    /// </summary>
    public async Task<User?> GetByEmailWithProfilesAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return await _context.Users
            .Include(u => u.Patient)
                .ThenInclude(p => p!.AvatarFile)
            .Include(u => u.Provider)
                .ThenInclude(p => p!.AvatarFile)
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);
    }

    /// <summary>
    /// Returns a tracked user (with Patient and Provider navigation properties) for the given normalized phone number.
    /// </summary>
    public async Task<User?> GetByPhoneWithProfilesAsync(
        string normalizedPhoneNumber,
        CancellationToken cancellationToken = default)
    {
        var candidates = BuildPhoneLookupCandidates(normalizedPhoneNumber);

        return await _context.Users
            .Include(u => u.Patient)
                .ThenInclude(p => p!.AvatarFile)
            .Include(u => u.Provider)
                .ThenInclude(p => p!.AvatarFile)
            .FirstOrDefaultAsync(
                u => u.Phone != null && candidates.Contains(u.Phone),
                cancellationToken);
    }

    /// <summary>
    /// Returns a tracked user (with Patient and Provider navigation properties) for the given ID.
    /// </summary>
    public async Task<User?> GetByIdWithProfilesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.Patient)
                .ThenInclude(p => p!.AvatarFile)
            .Include(u => u.Provider)
                .ThenInclude(p => p!.AvatarFile)
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    /// <summary>
    /// Returns an untracked user with Patient and Provider navigation properties loaded.
    /// Uses <c>AsNoTracking()</c> for better read performance on GET-only paths.
    /// </summary>
    public async Task<User?> GetByIdWithProfilesReadOnlyAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.Patient)
                .ThenInclude(p => p!.AvatarFile)
            .Include(u => u.Provider)
                .ThenInclude(p => p!.AvatarFile)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    /// <summary>Get all users.</summary>
    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Stages a new user in the EF change tracker.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Add(user);
        _logger.LogDebug("User with ID {UserId} staged for insertion", user.Id);
        return Task.FromResult(user);
    }

    /// <summary>Stages an existing user for update.
    /// The entity must have been loaded as tracked before mutation.
    /// EF change tracking detects mutated properties and generates a minimal UPDATE statement.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// </summary>
    public Task<User> UpdateAsync(User user, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(user);

        _logger.LogDebug("User with ID {UserId} staged for update", user.Id);
        return Task.FromResult(user);
    }

    /// <summary>
    /// Stages a soft-delete for the given user ID.
    /// The caller must invoke IUnitOfWork.SaveChangesAsync to persist.
    /// Returns false if the user was not found.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user == null)
        {
            _logger.LogWarning("Delete requested for non-existent user ID {UserId}", id);
            return false;
        }

        // Soft delete: set DeletedAt; the interceptor will also handle this via ISoftDeletable,
        // but being explicit keeps the intent clear.
        user.DeletedAt = DateTime.UtcNow;
        _logger.LogDebug("User with ID {UserId} staged for soft-delete", id);
        return true;
    }

    /// <summary>Returns true if a user with the given email (normalized) already exists.</summary>
    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return await _context.Users.AnyAsync(u => u.Email == normalizedEmail, cancellationToken);
    }

    /// <summary>
    /// Atomically increments <c>FailedLoginAttempts</c> and conditionally sets <c>LockedUntil</c>
    /// using a single SQL <c>UPDATE</c> statement, eliminating the read-modify-write race condition.
    /// <para>
    /// <b>Self-committing:</b> Uses <c>ExecuteUpdateAsync</c> which issues the <c>UPDATE</c>
    /// directly against the database, bypassing the EF change tracker and <c>IUnitOfWork</c>.
    /// The caller must NOT call <c>SaveChangesAsync</c> after invoking this method.
    /// </para>
    /// </summary>
    public async Task IncrementFailedLoginAttemptsAsync(
        Guid userId,
        int lockoutThreshold,
        TimeSpan lockoutDuration,
        CancellationToken cancellationToken = default)
    {
        var lockoutAt = DateTime.UtcNow.Add(lockoutDuration);

        await _context.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(
                    u => u.FailedLoginAttempts,
                    u => u.FailedLoginAttempts + 1)
                .SetProperty(
                    u => u.LockedUntil,
                    u => u.FailedLoginAttempts + 1 >= lockoutThreshold ? lockoutAt : u.LockedUntil),
                cancellationToken);

        _logger.LogDebug(
            "Incremented FailedLoginAttempts for User {UserId} (lockout threshold: {Threshold})",
            userId, lockoutThreshold);
    }

    private static string[] BuildPhoneLookupCandidates(string normalizedPhoneNumber)
    {
        var nationalNumber = normalizedPhoneNumber.StartsWith("+216", StringComparison.Ordinal)
            ? normalizedPhoneNumber[4..]
            : normalizedPhoneNumber;

        return
        [
            normalizedPhoneNumber,
            normalizedPhoneNumber.Replace(" ", string.Empty),
            $"216{nationalNumber}",
            $"00216{nationalNumber}",
            nationalNumber
        ];
    }
}
