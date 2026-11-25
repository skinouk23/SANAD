# Architectural Guidelines for Sanad Platform API

## 📐 Design Principles

This document outlines the architectural decisions, patterns, and best practices implemented in the Sanad Platform API.

## 🏗️ Vertical Slice Architecture

### Definition
Each feature is implemented as a complete vertical slice from presentation to data access, rather than horizontal layers.

### Structure
```
Features/FeatureName/
├── Controllers/          # HTTP endpoints
├── DTOs/                 # Data transfer objects for API
├── Entities/             # Domain entities
├── Services/             # Business logic
├── Repository/           # Data access interfaces
├── Repositories/         # Data access implementations
├── Commands/             # State-changing operations (MediatR)
├── Queries/              # Read operations (MediatR)
└── Validators/           # Input validation (FluentValidation)
```

### Advantages
1. **Feature Independence**: Each slice is self-contained
2. **Parallel Development**: Teams can work on different features
3. **Discoverability**: Easy to find all code related to a feature
4. **Testability**: Each slice can be tested in isolation
5. **Maintainability**: Changes are localized to the feature

### When to Create a New Feature
- New business capability needed
- Clear separation from existing features
- Will have its own entities, business logic, and API endpoints

## 🔄 Design Patterns Implemented

### 1. MediatR (CQRS Pattern)

**Commands** - For operations that change state:
```csharp
public class CreateProviderCommand : IRequest<ProviderResponse>
{
    public string Name { get; set; }
    // properties...
}

public class CreateProviderCommandHandler : IRequestHandler<CreateProviderCommand, ProviderResponse>
{
    public async Task<ProviderResponse> Handle(CreateProviderCommand request, CancellationToken cancellationToken)
    {
        // Business logic here
    }
}
```

**Queries** - For operations that read data:
```csharp
public class GetProvidersByCountryQuery : IRequest<IEnumerable<ProviderResponse>>
{
    public string Country { get; set; }
}

public class GetProvidersByCountryQueryHandler : IRequestHandler<GetProvidersByCountryQuery, IEnumerable<ProviderResponse>>
{
    public async Task<IEnumerable<ProviderResponse>> Handle(GetProvidersByCountryQuery request, CancellationToken cancellationToken)
    {
        // Read-only logic here
    }
}
```

**Benefits:**
- Clear separation of concerns
- Testable handlers
- Pipeline behaviors for cross-cutting concerns
- Reusable logic across controllers

### 2. Repository Pattern

**Purpose**: Abstract data access logic

```csharp
// Interface
public interface IProviderRepository
{
    Task<Provider?> GetByIdAsync(Guid id);
    Task<IEnumerable<Provider>> GetAllAsync();
    Task<Provider> CreateAsync(Provider provider);
    Task<Provider> UpdateAsync(Provider provider);
    Task<bool> DeleteAsync(Guid id);
}

// Implementation
public class ProviderRepository : IProviderRepository
{
    public async Task<Provider?> GetByIdAsync(Guid id)
    {
        return await _context.Providers.FirstOrDefaultAsync(p => p.Id == id);
    }
}
```

**Benefits:**
- Testable (can be mocked)
- Centralized query logic
- Easy to switch implementations
- LINQ queries only in repository

### 3. Service Layer

**Purpose**: Contains business logic, validation, and orchestration

```csharp
public interface IAuthenticationService
{
    Task<LoginResponse> RegisterAsync(RegisterUserRequest request);
    Task<LoginResponse> LoginAsync(LoginRequest request);
}

public class AuthenticationService : IAuthenticationService
{
    public async Task<LoginResponse> RegisterAsync(RegisterUserRequest request)
    {
        // Validation
        if (await _userRepository.ExistsAsync(request.Email))
            throw new InvalidOperationException("User already exists");

        // Business logic
        var user = new User { /* ... */ };
        var createdUser = await _userRepository.CreateAsync(user);

        // Token generation
        var token = _jwtTokenService.GenerateToken(/* ... */);

        return new LoginResponse { /* ... */ };
    }
}
```

**Benefits:**
- Reusable across handlers
- Easier to test
- Separation from data access

### 4. Dependency Injection

All dependencies registered in `Program.cs`:

```csharp
// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// Validation
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
```

**Benefits:**
- Loose coupling
- Easy mocking for tests
- Flexible configuration per environment
- Single responsibility

### 5. Pipeline Behaviors (Cross-Cutting Concerns)

**Validation Behavior**:
```csharp
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        // Validate request
        var failures = await ValidateAsync(request);
        if (failures.Any())
            throw new ValidationException(failures);

        return await next();
    }
}
```

**Logging Behavior**:
```csharp
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling {Request}", typeof(TRequest).Name);
        return await next();
    }
}
```

**Benefits:**
- Automatic validation/logging
- Applied to all handlers
- DRY principle (Don't Repeat Yourself)

## 🔐 Security Best Practices

### 1. Authentication
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProtectedController : ControllerBase
{
    [Authorize]
    [HttpGet("protected-endpoint")]
    public async Task<ActionResult> ProtectedEndpoint()
    {
        // Only authenticated users can access
    }
}
```

### 2. Authorization (Role-Based)
```csharp
[Authorize(Roles = "Admin")]
[HttpPost("admin-only")]
public async Task<ActionResult> AdminOnly()
{
    // Only admin users can access
}
```

### 3. Password Hashing
```csharp
// Never store plain text passwords
private static string HashPassword(string password)
{
    using (var sha256 = SHA256.Create())
    {
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}
```

### 4. JWT Token Security
```csharp
// Tokens include:
// - User ID, Email, Role (claims)
// - Expiration time
// - Signature for integrity
// - Issued and Validated time

var claims = new List<Claim>
{
    new Claim(ClaimTypes.Email, email),
    new Claim(ClaimTypes.NameIdentifier, userId),
    new Claim(ClaimTypes.Role, role),
    new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
};
```

### 5. CORS Configuration
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", corsPolicyBuilder =>
    {
        corsPolicyBuilder
            .WithOrigins(allowedOrigins)  // Whitelist only specific origins
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

## 📊 Logging Strategy

### Structured Logging with Serilog

```csharp
Log.Information("User registered: {Email} at {Timestamp}", email, DateTime.UtcNow);
Log.Warning("Failed login attempt for: {Email}", email);
Log.Error(exception, "Database error while creating user: {UserId}", userId);
```

### Logging Levels
- **Information**: Normal operation milestones
- **Warning**: Unexpected but recoverable situations
- **Error**: Something failed that needs attention
- **Fatal**: Service cannot continue

### Correlation ID Tracking
```csharp
// RequestLoggingMiddleware generates unique ID per request
using (LogContext.PushProperty("CorrelationId", correlationId))
{
    // All logs within this scope include the correlation ID
}
```

## ⚡ Performance Optimization

### 1. Caching Strategy
```csharp
const string cacheKey = "active_providers";

// Try cache first
if (_cache.TryGetValue(cacheKey, out var cachedData))
    return cachedData;

// Load from database
var data = await _repository.GetActiveAsync();

// Cache for 1 hour
_cache.Set(cacheKey, data, TimeSpan.FromHours(1));

return data;
```

### 2. Asynchronous Operations
```csharp
// ✅ Good - Non-blocking
public async Task<ProviderResponse> GetProviderAsync(Guid id)
{
    var provider = await _repository.GetByIdAsync(id);
    return _mapper.Map<ProviderResponse>(provider);
}

// ❌ Bad - Blocking
public ProviderResponse GetProvider(Guid id)
{
    var provider = _repository.GetById(id).Result;  // Blocks thread!
    return _mapper.Map<ProviderResponse>(provider);
}
```

### 3. Database Optimization
```csharp
// ✅ Good - No tracking for reads
public async Task<IEnumerable<Provider>> GetActiveAsync()
{
    return await _context.Providers
        .AsNoTracking()  // Don't track changes
        .Where(p => p.IsActive)
        .ToListAsync();
}

// ✅ Good - Lazy load avoided
public async Task<Provider?> GetByIdAsync(Guid id)
{
    return await _context.Providers
        .Include(p => p.Services)  // Eager load if needed
        .FirstOrDefaultAsync(p => p.Id == id);
}
```

### 4. Request/Response Size
```csharp
// ✅ Good - Only needed fields
public class ListProviderResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Rating { get; set; }
}

// ❌ Bad - Everything, including unnecessary nested objects
public class ListProviderResponse : Provider  // Inherits all fields
{
}
```

## 📝 Naming Conventions

### Entities
```csharp
public class User { }          // Singular, PascalCase
public class Provider { }
public class Appointment { }
```

### DTOs
```csharp
public class CreateProviderRequest { }   // Suffix with Request/Response
public class UpdateProviderRequest { }
public class ProviderResponse { }
```

### Repositories
```csharp
public interface IProviderRepository { }        // Prefix with I
public class ProviderRepository { }
```

### Services
```csharp
public interface IAuthenticationService { }
public class AuthenticationService { }
```

### Commands/Queries
```csharp
public class CreateProviderCommand : IRequest<ProviderResponse> { }
public class GetProviderByIdQuery : IRequest<ProviderResponse> { }
```

### Methods
```csharp
// ✅ Good - Descriptive
public async Task<User> GetUserByEmailAsync(string email) { }
public async Task<bool> ValidatePasswordAsync(string password) { }

// ❌ Bad - Ambiguous
public async Task<User> GetAsync(string value) { }
public async Task<bool> CheckAsync() { }
```

## 🧪 Testability

### Mockable Dependencies
```csharp
// ✅ Easy to test - dependencies injected
public class ProvidersController
{
    private readonly IProviderRepository _repository;
    public ProvidersController(IProviderRepository repository) { }
}

// ❌ Hard to test - tight coupling
public class ProvidersController
{
    private readonly ProviderRepository _repository = new ProviderRepository();
}
```

### Unit Test Example
```csharp
[Fact]
public async Task CreateProvider_ValidRequest_ReturnsCreatedProvider()
{
    // Arrange
    var mockRepository = new Mock<IProviderRepository>();
    mockRepository.Setup(r => r.CreateAsync(It.IsAny<Provider>()))
        .ReturnsAsync(new Provider { Id = Guid.NewGuid(), Name = "Test" });

    // Act
    var result = await _service.CreateAsync(request);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("Test", result.Name);
}
```

## 🚀 Deployment Considerations

### Configuration by Environment
```json
// appsettings.Development.json
{
  "Logging": { "LogLevel": "Debug" }
}

// appsettings.Production.json
{
  "Logging": { "LogLevel": "Warning" }
}
```

### Health Checks
```csharp
// Kubernetes/Docker uses these for readiness
GET /api/health/live   // Is service running?
GET /api/health/ready  // Can it handle requests?
```

### Monitoring
- Request logging to database
- Structured logging for analysis
- Correlation IDs for distributed tracing
- Performance metrics (response times)

## 📚 Code Review Checklist

- [ ] Is the code following the vertical slice structure?
- [ ] Are dependencies injected?
- [ ] Is validation implemented with FluentValidation?
- [ ] Are security attributes applied ([Authorize], roles)?
- [ ] Is logging added for important operations?
- [ ] Are exceptions handled appropriately?
- [ ] Is caching considered for read operations?
- [ ] Are responses wrapped in ApiResponse<T>?
- [ ] Are DTOs used (not entities) in API responses?
- [ ] Is the code testable (mockable dependencies)?

## 🔄 Extension Points

To add new functionality:

1. **New Feature**
   ```
   Features/NewFeature/
   ├── Controllers/
   ├── DTOs/
   ├── Entities/
   ├── Repository/
   ├── Repositories/
   ├── Services/
   ├── Commands/
   ├── Queries/
   └── Validators/
   ```

2. **Update Program.cs**
   - Register entity in DbContext
   - Register repository interface and implementation
   - Register service interface and implementation
   - Add Swagger documentation

3. **Database Migration**
   ```bash
   dotnet ef migrations add AddNewFeature
   dotnet ef database update
   ```

---

**Last Updated**: 2026-02-02
**Version**: 1.0.0
