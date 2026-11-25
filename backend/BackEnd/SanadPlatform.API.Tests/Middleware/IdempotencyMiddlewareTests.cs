using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using SanadPlatform.API.Middleware;

namespace SanadPlatform.API.Tests.Middleware;

public class IdempotencyMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_RestoresOriginalResponseBody_WhenDownstreamThrows()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        await using var originalBody = new MemoryStream();

        var context = CreateContext("exception-key", originalBody);
        var middleware = new IdempotencyMiddleware(
            _ => throw new InvalidOperationException("boom"),
            cache,
            NullLogger<IdempotencyMiddleware>.Instance);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => middleware.InvokeAsync(context));

        Assert.Equal("boom", exception.Message);
        Assert.Same(originalBody, context.Response.Body);

        await context.Response.WriteAsync("handled");
        originalBody.Position = 0;

        using var reader = new StreamReader(originalBody, leaveOpen: true);
        var body = await reader.ReadToEndAsync();

        Assert.Equal("handled", body);
    }

    [Fact]
    public async Task InvokeAsync_DoesNotCacheFailedAttempt_WhenRetriedWithSameKey()
    {
        using var cache = new MemoryCache(new MemoryCacheOptions());
        var executionCount = 0;

        var middleware = new IdempotencyMiddleware(async context =>
        {
            executionCount++;

            if (executionCount == 1)
            {
                throw new InvalidOperationException("boom");
            }

            context.Response.StatusCode = StatusCodes.Status200OK;
            await context.Response.WriteAsync("ok");
        }, cache, NullLogger<IdempotencyMiddleware>.Instance);

        await Assert.ThrowsAsync<InvalidOperationException>(() => middleware.InvokeAsync(CreateContext("retry-key")));

        await using var retryBody = new MemoryStream();
        var retryContext = CreateContext("retry-key", retryBody);

        await middleware.InvokeAsync(retryContext);

        retryBody.Position = 0;
        using var reader = new StreamReader(retryBody, leaveOpen: true);
        var body = await reader.ReadToEndAsync();

        Assert.Equal(2, executionCount);
        Assert.Equal("ok", body);
    }

    private static DefaultHttpContext CreateContext(string idempotencyKey, Stream? responseBody = null)
    {
        var context = new DefaultHttpContext();
        context.Request.Method = HttpMethods.Post;
        context.Request.Headers["Idempotency-Key"] = idempotencyKey;
        context.Response.Body = responseBody ?? new MemoryStream();
        return context;
    }
}
