using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SanadPlatform.API.Common.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// JWT token service implementation.
/// Generates signed JWT access tokens (with an embedded <c>session_id</c> claim),
/// cryptographically random refresh tokens, and SHA-256 token hashes.
/// </summary>
public class JwtTokenService : IJwtTokenService
{
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<JwtTokenService> _logger;

    public JwtTokenService(IOptions<JwtSettings> jwtOptions, ILogger<JwtTokenService> logger)
    {
        _jwtSettings = jwtOptions?.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public string GenerateToken(string email, string userId, string role, Guid sessionId, int expiryMinutes)
    {
        // UTF-8 encoding must match the key used in TokenValidationParameters (Program.cs).
        // ASCII was the previous encoding — it silently truncates non-ASCII characters and
        // produces a different key than UTF-8 for any secret containing characters > 0x7F.
        var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Role, role),
            new Claim("session_id", sessionId.ToString()),
            new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        _logger.LogDebug("JWT token generated for user ID {UserId}, session {SessionId}", userId, sessionId);
        return tokenString;
    }

    /// <inheritdoc/>
    public string GenerateRefreshToken()
    {
        // 64 random bytes → Base64 string (~88 chars). Cryptographically strong.
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }

    /// <inheritdoc/>
    public string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }
}
