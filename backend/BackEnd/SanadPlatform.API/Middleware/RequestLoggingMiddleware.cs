using System.Diagnostics;
using Serilog;
using Serilog.Context;
using Serilog.Events;

namespace SanadPlatform.API.Middleware;

/// <summary>
/// Middleware for logging HTTP requests and responses asynchronously
/// Runs on a separate thread to prevent impact on API performance
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetOrCreateCorrelationId(context);
        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            if (ShouldSkipBodyBuffering(context))
            {
                var startTime = Stopwatch.GetTimestamp();
                await _next(context);
                var elapsedMs = GetElapsedMilliseconds(startTime);
                LogRequestResponse(context, "[body omitted]", "[body omitted]", elapsedMs, correlationId);
                return;
            }

            var originalBodyStream = context.Response.Body;

            try
            {
                // Enable buffering to read request body multiple times
                context.Request.EnableBuffering();

                var requestBody = await ReadBodyAsync(context.Request);
                context.Request.Body.Position = 0;

                var startTime = Stopwatch.GetTimestamp();

                using (var responseBody = new MemoryStream())
                {
                    context.Response.Body = responseBody;

                    await _next(context);

                    var elapsedMs = GetElapsedMilliseconds(startTime);

                    var responseBodyContent = await ReadResponseBodyAsync(context.Response);
                    context.Response.Body.Position = 0;

                    // Log asynchronously to avoid blocking
                    _ = Task.Run(() => LogRequestResponse(context, requestBody, responseBodyContent, elapsedMs, correlationId));

                    await responseBody.CopyToAsync(originalBodyStream);
                }
            }
            finally
            {
                context.Response.Body = originalBodyStream;
            }
        }
    }

    private static string GetOrCreateCorrelationId(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Correlation-Id", out var correlationId))
        {
            return correlationId.ToString();
        }

        var newCorrelationId = Guid.NewGuid().ToString();
        context.Response.Headers.Append("X-Correlation-Id", newCorrelationId);
        return newCorrelationId;
    }

    private static bool ShouldSkipBodyBuffering(HttpContext context)
    {
        var request = context.Request;
        if (request.HasFormContentType)
        {
            return true;
        }

        if (request.Path.StartsWithSegments("/api/v1/files")
            && request.Path.Value?.Contains("/content", StringComparison.OrdinalIgnoreCase) == true)
        {
            return true;
        }

        if (request.ContentType?.Contains("multipart/form-data", StringComparison.OrdinalIgnoreCase) == true)
        {
            return true;
        }

        return false;
    }

    private static async Task<string> ReadBodyAsync(HttpRequest request)
    {
        try
        {
            request.Body.Position = 0;
            using var reader = new StreamReader(request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            request.Body.Position = 0;
            return string.IsNullOrEmpty(body) ? string.Empty : body;
        }
        catch
        {
            return "[Unable to read request body]";
        }
    }

    private static async Task<string> ReadResponseBodyAsync(HttpResponse response)
    {
        try
        {
            response.Body.Position = 0;
            using var reader = new StreamReader(response.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            response.Body.Position = 0;
            return string.IsNullOrEmpty(body) ? string.Empty : body;
        }
        catch
        {
            return "[Unable to read response body]";
        }
    }

    private void LogRequestResponse(HttpContext context, string requestBody, string responseBody, double elapsedMs, string correlationId)
    {
        var logLevel = context.Response.StatusCode >= 500 ? LogEventLevel.Error :
                       context.Response.StatusCode >= 400 ? LogEventLevel.Warning :
                       LogEventLevel.Information;

        Log.Write(logLevel,
            "HTTP {Method} {Path} responded {StatusCode} in {ElapsedMilliseconds}ms | CorrelationId: {CorrelationId} | Request: {@RequestBody} | Response: {@ResponseBody}",
            context.Request.Method,
            context.Request.Path.Value,
            context.Response.StatusCode,
            elapsedMs,
            correlationId,
            requestBody.Length > 1000 ? requestBody.Substring(0, 1000) + "..." : requestBody,
            responseBody.Length > 1000 ? responseBody.Substring(0, 1000) + "..." : responseBody);
    }

    private static double GetElapsedMilliseconds(long startTicks)
    {
        var stopTicks = Stopwatch.GetTimestamp();
        var elapsedTicks = stopTicks - startTicks;
        return (double)elapsedTicks * 1000 / Stopwatch.Frequency;
    }
}
