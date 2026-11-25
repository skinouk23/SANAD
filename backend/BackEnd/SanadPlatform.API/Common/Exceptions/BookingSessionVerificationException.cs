namespace SanadPlatform.API.Common.Exceptions;

/// <summary>
/// Thrown when session verification-code completion fails with client-actionable details.
/// </summary>
public class BookingSessionVerificationException : Exception
{
    public BookingSessionVerificationException(string code, string message, object? details = null)
        : base(message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        Code = code;
        Details = details;
    }

    /// <summary>Stable machine-readable verification failure code.</summary>
    public string Code { get; }

    /// <summary>Structured failure details for callers.</summary>
    public object? Details { get; }
}
