using System.Text;

namespace SanadPlatform.API.Features.Authentication.Services;

/// <summary>
/// Normalizes Tunisia phone numbers to E.164 format.
/// </summary>
public interface ITunisiaPhoneNumberNormalizer
{
    /// <summary>Normalize the supplied phone number to +216XXXXXXXX.</summary>
    string Normalize(string phoneNumber);
}

/// <summary>
/// Tunisia-only phone number normalizer for SMS OTP login.
/// </summary>
public class TunisiaPhoneNumberNormalizer : ITunisiaPhoneNumberNormalizer
{
    /// <inheritdoc />
    public string Normalize(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            throw new InvalidOperationException("Phone number is required.");
        }

        var compact = CompactPhoneNumber(phoneNumber);

        if (compact.StartsWith("00216", StringComparison.Ordinal))
        {
            compact = $"+216{compact[5..]}";
        }
        else if (compact.StartsWith("216", StringComparison.Ordinal))
        {
            compact = $"+{compact}";
        }
        else if (compact.StartsWith("+216", StringComparison.Ordinal))
        {
            compact = $"+216{compact[4..]}";
        }
        else if (!compact.StartsWith('+') && compact.Length == 8)
        {
            compact = $"+216{compact}";
        }

        if (!compact.StartsWith("+216", StringComparison.Ordinal) || compact.Length != 12)
        {
            throw new InvalidOperationException("Phone number must be a valid Tunisia number.");
        }

        var nationalNumber = compact[4..];
        if (nationalNumber.Length != 8 || nationalNumber.Any(c => !char.IsDigit(c)))
        {
            throw new InvalidOperationException("Phone number must be a valid Tunisia number.");
        }

        return compact;
    }

    private static string CompactPhoneNumber(string phoneNumber)
    {
        var builder = new StringBuilder(phoneNumber.Length);

        foreach (var character in phoneNumber.Trim())
        {
            if (char.IsDigit(character))
            {
                builder.Append(character);
                continue;
            }

            if (character == '+' && builder.Length == 0)
            {
                builder.Append(character);
            }
        }

        return builder.ToString();
    }
}
