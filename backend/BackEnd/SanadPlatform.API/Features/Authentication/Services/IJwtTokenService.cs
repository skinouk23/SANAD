namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// Contract for JWT access token generation and refresh token utilities.
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Generates a signed JWT access token containing the standard identity claims
    /// plus a <c>session_id</c> claim that links the token to a <c>UserSession</c> row.
    /// </summary>
    /// <param name="email">User's email address.</param>
    /// <param name="userId">User's unique identifier (stored in <c>ClaimTypes.NameIdentifier</c>).</param>
    /// <param name="role">User's role (patient, provider, admin, …).</param>
    /// <param name="sessionId">The <see cref="Guid"/> PK of the corresponding <c>UserSession</c> row.</param>
    /// <param name="expiryMinutes">How many minutes until the access token expires.</param>
    /// <returns>Signed JWT string.</returns>
    string GenerateToken(string email, string userId, string role, Guid sessionId, int expiryMinutes);

    /// <summary>
    /// Generates a cryptographically random refresh token (64 random bytes, Base64-encoded).
    /// Store the result of <see cref="HashToken"/> in the database; send the raw value to the client.
    /// </summary>
    string GenerateRefreshToken();

    /// <summary>
    /// Computes a SHA-256 hash of <paramref name="token"/> (Base64-encoded result).
    /// Use this to store refresh tokens in the database so raw tokens are never persisted.
    /// </summary>
    string HashToken(string token);
}
