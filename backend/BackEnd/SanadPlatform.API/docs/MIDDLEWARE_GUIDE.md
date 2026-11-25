# Custom Middleware Guide

This document explains the custom HTTP middleware used in the Sanad CareAtHome API, how they work, and how they fit into the ASP.NET Core request pipeline.

---

## Pipeline Registration Order

Middleware is registered in `Program.cs` (lines 232-237) in the following order:

```
Request → RequestLoggingMiddleware → GlobalExceptionHandlingMiddleware → Authentication → Authorization → Controllers
```

```csharp
// Program.cs
app.UseMiddleware<RequestLoggingMiddleware>();    // line 233
app.UseMiddleware<GlobalExceptionHandlingMiddleware>(); // line 234
app.UseAuthentication();                                // line 236
app.UseAuthorization();                                 // line 237
```

**Why this order matters:**

1. `RequestLoggingMiddleware` is outermost so it captures the full request lifecycle — including exceptions handled by the next middleware — and measures total elapsed time accurately.
2. `GlobalExceptionHandlingMiddleware` wraps everything downstream (auth, controllers) so any unhandled exception from any layer is caught and converted to a standardized JSON response.
3. Authentication/Authorization run after both custom middlewares so auth failures are still logged and any auth-related exceptions are still caught.

> **Note:** Serilog's built-in `app.UseSerilogRequestLogging()` is also registered earlier (line 210), before `UseCookiePolicy()` and the Swagger/CORS setup. The custom `RequestLoggingMiddleware` provides more detailed logging (request/response bodies, correlation IDs) on top of Serilog's basic request logging.

---

## GlobalExceptionHandlingMiddleware

**File:** `Middleware/GlobalExceptionHandlingMiddleware.cs` (73 lines)

### Purpose

Catches any unhandled exception thrown during request processing and converts it into a standardized `ApiResponse<object>` JSON response. This prevents raw exception details or stack traces from leaking to clients, and ensures every error response follows the same shape.

### How It Works

1. Wraps the entire downstream pipeline in a `try/catch`.
2. On exception, maps the exception type to an HTTP status code.
3. Serializes an `ApiResponse<object>` with `Success = false` and a message.
4. Writes the JSON response with camelCase property naming.

### Exception-to-Status Mapping

| Exception Type               | HTTP Status | Response Message                        | Logged? |
| ---------------------------- | ----------- | --------------------------------------- | ------- |
| `ArgumentNullException`      | 400         | Exception's own message                 | No      |
| `ArgumentException`          | 400         | Exception's own message                 | No      |
| `UnauthorizedAccessException`| 401         | `"Unauthorized access."`               | No      |
| `KeyNotFoundException`       | 404         | Exception's own message                 | No      |
| Any other exception          | 500         | `"An unexpected error occurred."`      | Yes     |

Only truly unexpected (500) exceptions are logged via `Log.Error(exception, ...)`. Known exception types (400/401/404) are treated as expected control flow and not logged at error level.

### Response Shape

Every error response follows the `ApiResponse<T>` contract defined in `Common/Models/ApiResponse.cs`:

```json
{
  "success": false,
  "message": "The error message",
  "data": null,
  "errors": null
}
```

Properties are serialized as camelCase via `JsonNamingPolicy.CamelCase`.

### Usage Guidelines

| Scenario | Recommendation |
| -------- | -------------- |
| Entity not found in repository | Throw `KeyNotFoundException` — middleware returns 404 |
| Invalid input caught in service layer | Throw `ArgumentException` — middleware returns 400 |
| Unauthorized operation in service layer | Throw `UnauthorizedAccessException` — middleware returns 401 |
| Validation errors (FluentValidation) | Handled by `ValidationBehavior` pipeline (MediatR) or controller-level `ModelState` — do NOT rely on exception middleware |
| Business logic failure with custom detail | Return an explicit `ApiResponse.ErrorResponse(...)` from the controller instead of throwing — gives you control over status code and error dictionary |

---

## RequestLoggingMiddleware

**File:** `Middleware/RequestLoggingMiddleware.cs` (131 lines)

### Purpose

Logs every HTTP request and response with full context: method, path, status code, elapsed time, request body, response body, and a correlation ID for distributed tracing. Logging is performed asynchronously on a background thread to avoid adding latency to the response.

### How It Works

#### 1. Correlation ID

```
Client sends X-Correlation-Id header?
  ├─ Yes → Use the provided value
  └─ No  → Generate a new GUID and add it to the response headers
```

The correlation ID is also pushed into Serilog's `LogContext` via `LogContext.PushProperty("CorrelationId", ...)`, making it available to all downstream log statements within the same request scope.

#### 2. Request Body Capture

- Calls `context.Request.EnableBuffering()` so the request body stream can be read multiple times (once here for logging, once later by model binding).
- Reads the full request body into a string, then resets `Body.Position = 0`.
- If reading fails for any reason, logs `"[Unable to read request body]"` instead of throwing.

#### 3. Response Body Capture

- Replaces `context.Response.Body` with a `MemoryStream` to intercept the response.
- After the downstream pipeline writes the response, reads the `MemoryStream` content.
- Copies the captured response back to the original response stream so the client receives it normally.
- Restores the original body stream in a `finally` block to prevent stream corruption.

#### 4. Timing

Uses `Stopwatch.GetTimestamp()` before and after calling `_next(context)`, then computes elapsed milliseconds using `Stopwatch.Frequency`. This is more accurate than `DateTime.UtcNow` subtraction.

#### 5. Async Logging

```csharp
_ = Task.Run(() => LogRequestResponse(context, requestBody, responseBody, elapsedMs, correlationId));
```

The actual log write is dispatched to a thread pool thread via `Task.Run()`. The fire-and-forget (`_ =`) pattern means the response is sent to the client without waiting for the log to be written.

**Trade-off:** This avoids adding logging latency to the response, but means log entries could theoretically be lost if the process crashes immediately after sending the response.

#### 6. Log Level by Status Code

| Status Code Range | Log Level     |
| ----------------- | ------------- |
| 5xx               | `Error`       |
| 4xx               | `Warning`     |
| 2xx, 3xx          | `Information` |

#### 7. Body Truncation

Both request and response bodies are truncated to **1000 characters** in the log output. If a body exceeds 1000 chars, it is cut and `"..."` is appended. This prevents large payloads (file uploads, bulk responses) from bloating log storage.

### Log Output Format

Each log entry includes these structured properties:

```
HTTP {Method} {Path} responded {StatusCode} in {ElapsedMilliseconds}ms
  | CorrelationId: {CorrelationId}
  | Request: {RequestBody}
  | Response: {ResponseBody}
```

Example:
```
[INF] HTTP POST /api/v1/auth/login responded 200 in 142.35ms
  | CorrelationId: 3f2504e0-4f89-11d3-9a0c-0305e82c3301
  | Request: {"email":"user@example.com","password":"***"}
  | Response: {"success":true,"message":"Login successful","data":{...}}
```

> **Security note:** The middleware does NOT redact sensitive fields (passwords, tokens) from request/response bodies. Sensitive data redaction should be handled by Serilog destructuring policies or by avoiding logging bodies for sensitive endpoints.

---

## Interaction Between the Two Middlewares

Since `RequestLoggingMiddleware` wraps `GlobalExceptionHandlingMiddleware`:

1. A request comes in → `RequestLoggingMiddleware` starts the stopwatch and reads the request body.
2. The request passes to `GlobalExceptionHandlingMiddleware`, then to auth, then to the controller.
3. **If the controller throws an unhandled exception:**
   - `GlobalExceptionHandlingMiddleware` catches it, writes a 4xx/5xx `ApiResponse` JSON to the (intercepted) response stream.
   - Control returns to `RequestLoggingMiddleware`, which reads the error JSON as the response body and logs it with the appropriate log level.
4. **If the controller returns normally:**
   - The response passes back through both middlewares normally.
   - `RequestLoggingMiddleware` logs the successful response.

This means **every request gets logged** — whether it succeeds, fails with a known exception, or fails with an unexpected error. The logged response body will always be the final JSON sent to the client.

---

## Adding a New Custom Middleware

1. Create a class in the `Middleware/` directory following the convention:
   - Constructor accepts `RequestDelegate next` (and any DI services).
   - Public `async Task InvokeAsync(HttpContext context)` method.
   - Call `await _next(context)` to pass control downstream.

2. Register in `Program.cs` at the correct position in the pipeline. Consider:
   - Should it run before or after logging? (Before = its behavior gets logged. After = it doesn't.)
   - Should it run before or after exception handling? (Before = its exceptions are caught. After = they aren't.)
   - Should it run before or after authentication? (Before = no user context available. After = `context.User` is populated.)

3. Document it in this file.
