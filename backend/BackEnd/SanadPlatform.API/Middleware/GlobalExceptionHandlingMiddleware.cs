using Serilog;
using SanadPlatform.API.Common.Exceptions;
using SanadPlatform.API.Common.Models;
using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace SanadPlatform.API.Middleware;

/// <summary>
/// Global exception handling middleware.
/// Centralizes error handling logic to ensure consistent API responses.
/// </summary>
public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private static readonly JsonSerializerOptions _jsonOptions = new() 
    { 
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
    };

    public GlobalExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Default values for unhandled exceptions
        var statusCode = HttpStatusCode.InternalServerError;
        var message = "An unexpected error occurred.";
        Dictionary<string, string[]>? errors = null;
        string? code = null;
        object? details = null;

        // Map exception types to status codes and meaningful messages
        switch (exception)
        {
            case ValidationException valEx:
                // 400 Bad Request - For input validation failures
                statusCode = HttpStatusCode.BadRequest;
                message = "Validation failed.";
                errors = valEx.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key, 
                        g => g.Select(e => e.ErrorMessage).ToArray());
                break;

            case KeyNotFoundException:
                // 404 Not Found - For missing resources (Patients, Bookings, etc.)
                statusCode = HttpStatusCode.NotFound;
                message = exception.Message;
                break;

            case ForbiddenAccessException:
                // 403 Forbidden - For authorization failures (authenticated but not permitted)
                statusCode = HttpStatusCode.Forbidden;
                message = exception.Message;
                break;

            case UnauthorizedAccessException:
                // 401 Unauthorized - For authentication failures
                statusCode = HttpStatusCode.Unauthorized;
                message = exception.Message;
                break;

            case DbUpdateConcurrencyException:
                // 409 Conflict - For optimistic concurrency failures
                statusCode = HttpStatusCode.Conflict;
                message = "The record was modified by another user. Please refresh and try again.";
                break;

            case BookingConflictException bookingConflictEx:
                // 409 Conflict - For booking availability and pricing conflicts with recovery details
                statusCode = HttpStatusCode.Conflict;
                message = bookingConflictEx.Message;
                code = bookingConflictEx.Code;
                details = bookingConflictEx.Details;
                break;

            case BookingSessionVerificationException bookingSessionVerificationEx:
                statusCode = HttpStatusCode.BadRequest;
                message = bookingSessionVerificationEx.Message;
                code = bookingSessionVerificationEx.Code;
                details = bookingSessionVerificationEx.Details;
                break;

            case UploadApiException uploadEx:
                statusCode = uploadEx.StatusCode;
                message = uploadEx.Message;
                code = uploadEx.Code;
                details = uploadEx.Details;
                break;

            case InvalidOperationException:
                // 400 Bad Request - Often used for business rule violations
                statusCode = HttpStatusCode.BadRequest;
                message = exception.Message;
                break;

            case ArgumentNullException or ArgumentException:
                // 400 Bad Request - For invalid parameters
                statusCode = HttpStatusCode.BadRequest;
                message = exception.Message;
                break;

            case TimeoutException:
                // 408 Request Timeout - For database or external service timeouts
                statusCode = HttpStatusCode.RequestTimeout;
                message = "The request timed out. Please try again later.";
                break;

            case NotImplementedException:
                // 501 Not Implemented - For features currently in development
                statusCode = HttpStatusCode.NotImplemented;
                message = "This feature is not yet implemented.";
                break;

            case DbUpdateException dbEx when dbEx.InnerException is PostgresException pgEx:
                if (pgEx.SqlState == PostgresErrorCodes.ForeignKeyViolation)
                {
                    statusCode = HttpStatusCode.BadRequest;
                    message = "The request could not be completed because a related record was not found or has been deleted.";
                }
                else if (pgEx.SqlState == PostgresErrorCodes.UniqueViolation)
                {
                    Log.Warning(
                        pgEx,
                        "PostgreSQL unique violation on table {TableName}, constraint {ConstraintName}, detail {Detail}",
                        pgEx.TableName,
                        pgEx.ConstraintName,
                        pgEx.Detail);

                    statusCode = HttpStatusCode.Conflict;
                    message = "A record with the same unique identifier already exists.";
                }
                else if (pgEx.SqlState == PostgresErrorCodes.ExclusionViolation)
                {
                    statusCode = HttpStatusCode.Conflict;
                    message = "The operation conflicts with an existing record. Please refresh and try again.";
                }
                break;

            default:
                // 500 Internal Server Error - Log unexpected system crashes
                Log.Error(exception, "An unhandled exception occurred");
                break;
        }

        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse<object>.ErrorResponse(message, errors, code, details);
        return context.Response.WriteAsJsonAsync(response, _jsonOptions);
    }
}
