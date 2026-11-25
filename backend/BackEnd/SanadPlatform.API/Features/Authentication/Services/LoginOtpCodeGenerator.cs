using System.Security.Cryptography;

namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// Generates numeric login OTP codes.
/// </summary>
public interface ILoginOtpCodeGenerator
{
    /// <summary>Generate a cryptographically random numeric code.</summary>
    string GenerateNumericCode(int length);
}

/// <summary>
/// Cryptographic numeric OTP generator.
/// </summary>
public class LoginOtpCodeGenerator : ILoginOtpCodeGenerator
{
    public string GenerateNumericCode(int length)
    {
        if (length <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(length), "OTP length must be positive.");
        }

        Span<char> code = stackalloc char[length];
        for (var index = 0; index < length; index++)
        {
            code[index] = (char)('0' + RandomNumberGenerator.GetInt32(0, 10));
        }

        return new string(code);
    }
}
