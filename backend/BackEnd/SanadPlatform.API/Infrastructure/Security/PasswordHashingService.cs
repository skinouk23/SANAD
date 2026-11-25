using Microsoft.Extensions.Logging;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Service for securely hashing and verifying passwords using bcrypt algorithm.
/// Provides protection against rainbow table and brute force attacks.
/// </summary>
public interface IPasswordHashingService
{
    /// <summary>
    /// Hashes a plain text password using bcrypt.
    /// </summary>
    /// <param name="password">The plain text password to hash</param>
    /// <returns>The hashed password</returns>
    string HashPassword(string password);

    /// <summary>
    /// Verifies a plain text password against a hashed password.
    /// Uses constant-time comparison to prevent timing attacks.
    /// </summary>
    /// <param name="password">The plain text password to verify</param>
    /// <param name="hash">The hashed password to compare against</param>
    /// <returns>True if password matches hash, false otherwise</returns>
    bool VerifyPassword(string password, string hash);
}

/// <summary>
/// Implementation of password hashing using bcrypt.
/// </summary>
public class PasswordHashingService : IPasswordHashingService
{
    private const int WorkFactor = 12; // BCrypt work factor (higher = slower, more secure)

    private readonly ILogger<PasswordHashingService> _logger;

    public PasswordHashingService(ILogger<PasswordHashingService> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Hashes a password using bcrypt with work factor of 12.
    /// </summary>
    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Password cannot be null or empty", nameof(password));
        }

        if (password.Length < 8)
        {
            throw new ArgumentException("Password must be at least 8 characters", nameof(password));
        }

        // Use BCrypt to hash the password
        // Note: Requires BCrypt.Net-Next NuGet package
        var salt = BCrypt.Net.BCrypt.GenerateSalt(WorkFactor);
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);

        return hashedPassword;
    }

    /// <summary>
    /// Verifies a password against a bcrypt hash using constant-time comparison.
    /// </summary>
    public bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hash))
        {
            return false;
        }

        try
        {
            // BCrypt.Verify uses constant-time comparison internally
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Password verification failed due to an invalid hash format");
            return false;
        }
    }
}
