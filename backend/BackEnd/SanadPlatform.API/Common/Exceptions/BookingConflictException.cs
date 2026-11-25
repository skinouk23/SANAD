namespace SanadPlatform.API.Common.Exceptions;

/// <summary>
/// Thrown when a booking request conflicts with the latest availability or pricing state.
/// Mapped to HTTP 409 Conflict by <see cref="Middleware.GlobalExceptionHandlingMiddleware"/>.
/// </summary>
public class BookingConflictException : Exception
{
    /// <summary>
    /// Gets the stable machine-readable error code for the conflict.
    /// </summary>
    public string Code { get; }

    /// <summary>
    /// Gets structured details that help clients recover from the conflict.
    /// </summary>
    public object? Details { get; }

    /// <summary>
    /// Initializes a new instance of <see cref="BookingConflictException"/>.
    /// </summary>
    /// <param name="code">Stable machine-readable conflict code.</param>
    /// <param name="message">Human-readable message describing the conflict.</param>
    /// <param name="details">Optional structured conflict details.</param>
    public BookingConflictException(string code, string message, object? details = null)
        : base(message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        Code = code;
        Details = details;
    }

    /// <summary>
    /// Initializes a new instance of <see cref="BookingConflictException"/> with an inner exception.
    /// </summary>
    /// <param name="code">Stable machine-readable conflict code.</param>
    /// <param name="message">Human-readable message describing the conflict.</param>
    /// <param name="details">Optional structured conflict details.</param>
    /// <param name="innerException">The underlying exception that caused the conflict.</param>
    public BookingConflictException(string code, string message, object? details, Exception innerException)
        : base(message, innerException)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        Code = code;
        Details = details;
    }
}
