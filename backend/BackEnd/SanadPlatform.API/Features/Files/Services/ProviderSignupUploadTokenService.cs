using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Files.Services;

/// <summary>
/// HMAC-signed stateless token service for anonymous provider signup document uploads.
/// Tokens are bound to one application ID and expire quickly. They are not auth sessions.
/// </summary>
public class ProviderSignupUploadTokenService : IProviderSignupUploadTokenService
{
    private readonly ProviderSignupUploadTokenOptions _options;

    public ProviderSignupUploadTokenService(IOptions<ProviderSignupUploadTokenOptions> options)
    {
        _options = options?.Value ?? throw new ArgumentNullException(nameof(options));
    }

    /// <inheritdoc />
    public (string Token, Guid ApplicationId, DateTime ExpiresAt) Issue()
    {
        var applicationId = Guid.NewGuid();

        var expiresAt = DateTime.UtcNow.AddMinutes(_options.ExpirationMinutes);
        var payload = string.Join(
            '.',
            applicationId.ToString("D"),
            new DateTimeOffset(expiresAt).ToUnixTimeSeconds().ToString(CultureInfo.InvariantCulture),
            Convert.ToHexString(RandomNumberGenerator.GetBytes(16)));
        var signature = Sign(payload);
        var token = Base64UrlEncode(Encoding.UTF8.GetBytes(payload)) + "." + Base64UrlEncode(signature);

        return (token, applicationId, expiresAt);
    }

    /// <inheritdoc />
    public ProviderSignupUploadTokenValidation Validate(string token, Guid applicationId)
    {
        if (string.IsNullOrWhiteSpace(token) || applicationId == Guid.Empty)
        {
            throw new UnauthorizedAccessException("Provider signup upload token is missing or invalid.");
        }

        var parts = token.Split('.', 2);
        if (parts.Length != 2)
        {
            throw new UnauthorizedAccessException("Provider signup upload token is malformed.");
        }

        var payload = Encoding.UTF8.GetString(Base64UrlDecode(parts[0]));
        var suppliedSignature = Base64UrlDecode(parts[1]);
        var expectedSignature = Sign(payload);
        if (!CryptographicOperations.FixedTimeEquals(suppliedSignature, expectedSignature))
        {
            throw new UnauthorizedAccessException("Provider signup upload token signature is invalid.");
        }

        var payloadParts = payload.Split('.', 3);
        if (payloadParts.Length != 3
            || !Guid.TryParse(payloadParts[0], out var tokenApplicationId)
            || !long.TryParse(payloadParts[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var expiresUnix))
        {
            throw new UnauthorizedAccessException("Provider signup upload token payload is invalid.");
        }

        if (tokenApplicationId != applicationId)
        {
            throw new UnauthorizedAccessException("Provider signup upload token is not valid for this application.");
        }

        var expiresAt = DateTimeOffset.FromUnixTimeSeconds(expiresUnix).UtcDateTime;
        if (DateTime.UtcNow > expiresAt)
        {
            throw new UnauthorizedAccessException("Provider signup upload token has expired.");
        }

        return new ProviderSignupUploadTokenValidation(applicationId, expiresAt);
    }

    private byte[] Sign(string payload)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_options.SigningKey);
        return HMACSHA256.HashData(keyBytes, Encoding.UTF8.GetBytes(payload));
    }

    private static string Base64UrlEncode(byte[] bytes)
    {
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static byte[] Base64UrlDecode(string value)
    {
        var padded = value.Replace('-', '+').Replace('_', '/');
        padded += new string('=', (4 - padded.Length % 4) % 4);
        return Convert.FromBase64String(padded);
    }
}
