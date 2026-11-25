namespace SanadPlatform.API.Common.Constants;

/// <summary>
/// Canonical payment method codes supported by booking and payment flows.
/// </summary>
public static class PaymentMethods
{
    public const string Card = "card";
    public const string D17 = "d17";
    public const string Cash = "cash";

    public static readonly string[] All = [Card, D17, Cash];

    /// <summary>
    /// Returns the canonical lower-case payment method value.
    /// </summary>
    public static string Normalize(string value)
    {
        return value.Trim().ToLowerInvariant();
    }

    /// <summary>
    /// Returns <c>true</c> when the provided value matches a supported payment method.
    /// </summary>
    public static bool IsSupported(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        var normalized = Normalize(value);
        return normalized == Card || normalized == D17 || normalized == Cash;
    }
}
