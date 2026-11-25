using Microsoft.Extensions.Caching.Memory;

namespace SanadPlatform.API.Middleware;

/// <summary>
/// Caches responses for POST/PUT/PATCH requests that carry an <c>Idempotency-Key</c> header.
/// Subsequent requests with the same key receive the original response without re-executing
/// the pipeline — preventing accidental double-submissions.
/// </summary>
public class IdempotencyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly ILogger<IdempotencyMiddleware> _logger;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);
    private const string IdempotencyHeader = "Idempotency-Key";

    public IdempotencyMiddleware(
        RequestDelegate next,
        IMemoryCache cache,
        ILogger<IdempotencyMiddleware> logger)
    {
        _next = next ?? throw new ArgumentNullException(nameof(next));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Processes the HTTP request, returning a cached response when a previously-seen
    /// <c>Idempotency-Key</c> is detected, or caching the new response for future replays.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        // Only apply to state-mutating methods
        var method = context.Request.Method;
        if (!HttpMethods.IsPost(method)
            && !HttpMethods.IsPut(method)
            && !HttpMethods.IsPatch(method))
        {
            await _next(context);
            return;
        }

        // If no idempotency key is provided, pass through
        if (!context.Request.Headers.TryGetValue(IdempotencyHeader, out var keyValues)
            || string.IsNullOrWhiteSpace(keyValues.FirstOrDefault()))
        {
            await _next(context);
            return;
        }

        var idempotencyKey = keyValues.First()!;
        var cacheKey = $"idempotency:{idempotencyKey}";

        // Return cached response if available
        if (_cache.TryGetValue(cacheKey, out CachedResponse? cached) && cached is not null)
        {
            _logger.LogDebug("Returning cached response for Idempotency-Key {IdempotencyKey}", idempotencyKey);

            context.Response.StatusCode = cached.StatusCode;
            context.Response.ContentType = cached.ContentType;
            await context.Response.Body.WriteAsync(cached.Body);
            return;
        }

        // Buffer the response so we can capture it.
        // Always restore the original stream before any exception bubbles up,
        // otherwise upstream middleware (for example global exception handling)
        // will try to write to a disposed buffer.
        var originalBodyStream = context.Response.Body;
        var bufferedStream = new MemoryStream();
        context.Response.Body = bufferedStream;

        try
        {
            await _next(context);

            // Read the response body
            bufferedStream.Seek(0, SeekOrigin.Begin);
            var responseBody = bufferedStream.ToArray();

            // Only cache successful responses — failed requests did not mutate state,
            // so retries with the same key should re-execute rather than replay an error.
            if (context.Response.StatusCode is >= 200 and <= 299)
            {
                var cachedResponse = new CachedResponse(
                    context.Response.StatusCode,
                    context.Response.ContentType ?? "application/json",
                    responseBody);

                _cache.Set(cacheKey, cachedResponse, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = CacheDuration
                });

                _logger.LogDebug("Cached response for Idempotency-Key {IdempotencyKey}", idempotencyKey);
            }

            // Write the buffered response to the original stream
            bufferedStream.Seek(0, SeekOrigin.Begin);
            await bufferedStream.CopyToAsync(originalBodyStream);
        }
        finally
        {
            context.Response.Body = originalBodyStream;
            await bufferedStream.DisposeAsync();
        }
    }

    /// <summary>
    /// Immutable snapshot of an HTTP response stored in the idempotency cache.
    /// </summary>
    private sealed record CachedResponse(int StatusCode, string ContentType, byte[] Body);
}
