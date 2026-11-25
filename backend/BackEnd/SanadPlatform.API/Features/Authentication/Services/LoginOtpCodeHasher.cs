using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using SanadPlatform.API.Common.Options;

namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// HMAC-based login OTP hashing and verification.
/// </summary>
public interface ILoginOtpCodeHasher
{
    /// <summary>Hash an OTP code for a specific challenge.</summary>
    string HashCode(Guid challengeId, string code);

    /// <summary>Verify a submitted OTP code against a stored hash.</summary>
    bool VerifyCode(Guid challengeId, string code, string expectedHash);

    /// <summary>Hash a destination identifier such as a normalized email.</summary>
    string HashDestination(string channel, string destination);
}

/// <summary>
/// HMAC-SHA256 OTP hasher.
/// HMAC stands for Hash-based Message Authentication Code
/// HMAC = secret key + message + hash function → authentication tag
/// </summary>
public class LoginOtpCodeHasher : ILoginOtpCodeHasher
{
    private readonly byte[] _secret;

    public LoginOtpCodeHasher(IOptions<LoginOtpSettings> options)
    {
        var settings = options?.Value ?? throw new ArgumentNullException(nameof(options));
        _secret = Encoding.UTF8.GetBytes(settings.CodeHashSecret);
    }

    public string HashCode(Guid challengeId, string code)
    {
        var payload = $"code:{challengeId:N}:{code.Trim()}";
        return HashPayload(payload);
    }

    public bool VerifyCode(Guid challengeId, string code, string expectedHash)
    {
        if (string.IsNullOrWhiteSpace(expectedHash))
        {
            return false;
        }

        var actualHash = HashCode(challengeId, code);
        var actualBytes = Encoding.UTF8.GetBytes(actualHash);
        var expectedBytes = Encoding.UTF8.GetBytes(expectedHash);

        // This tries to compare the whole value without stopping early just because one byte is wrong. 
        // Microsoft documents FixedTimeEquals as a fixed-time equality check where the time depends on the length of the sequences, not their contents.
        // A normal comparison may stop as soon as it finds the first different character.
        // Those time differences are tiny, but in some systems an attacker can send many requests and average the response times.
        return actualBytes.Length == expectedBytes.Length
            && CryptographicOperations.FixedTimeEquals(actualBytes, expectedBytes); 
    }

    public string HashDestination(string channel, string destination)
    {
        var payload = $"destination:{channel.Trim().ToLowerInvariant()}:{destination.Trim().ToLowerInvariant()}";
        return HashPayload(payload);
    }

    private string HashPayload(string payload)
    {
        using var hmac = new HMACSHA256(_secret);
        var bytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToHexString(bytes);
    }
}
