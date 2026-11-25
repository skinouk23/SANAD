namespace SanadPlatform.API.Common.Exceptions;

/// <summary>
/// Thrown when a user attempts to access a resource they do not have permission for.
/// Mapped to HTTP 403 Forbidden by <see cref="Middleware.GlobalExceptionHandlingMiddleware"/>.
/// </summary>
public class ForbiddenAccessException : Exception
{
    /// <summary>
    /// Initializes a new instance of <see cref="ForbiddenAccessException"/> with a default message.
    /// </summary>
    public ForbiddenAccessException()
        : base("You do not have permission to access this resource.")
    {
    }

    /// <summary>
    /// Initializes a new instance of <see cref="ForbiddenAccessException"/> with a custom message.
    /// </summary>
    /// <param name="message">A message describing the access denial.</param>
    public ForbiddenAccessException(string message)
        : base(message)
    {
    }

    /// <summary>
    /// Initializes a new instance of <see cref="ForbiddenAccessException"/> with a custom message
    /// and an inner exception.
    /// </summary>
    /// <param name="message">A message describing the access denial.</param>
    /// <param name="innerException">The exception that caused this denial.</param>
    public ForbiddenAccessException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
