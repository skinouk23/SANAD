using System.Net;

namespace SanadPlatform.API.Common.Exceptions;

/// <summary>
/// Upload-specific exception carrying a stable machine-readable API error code.
/// </summary>
public class UploadApiException : Exception
{
    public UploadApiException(HttpStatusCode statusCode, string code, string message, object? details = null)
        : base(message)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        StatusCode = statusCode;
        Code = code;
        Details = details;
    }

    public UploadApiException(
        HttpStatusCode statusCode,
        string code,
        string message,
        object? details,
        Exception innerException)
        : base(message, innerException)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(code);

        StatusCode = statusCode;
        Code = code;
        Details = details;
    }

    /// <summary>HTTP status code to return for this upload error.</summary>
    public HttpStatusCode StatusCode { get; }

    /// <summary>Stable machine-readable error code.</summary>
    public string Code { get; }

    /// <summary>Structured details for clients and logs.</summary>
    public object? Details { get; }
}
