# Best Practices & Performance Guide

## 🎯 Clean Code Principles

### 1. Single Responsibility Principle (SRP)
Each class should have ONE reason to change.

```csharp
// ✅ Good - Each class has one responsibility
public class User { }                          // Entity
public class UserRepository { }                // Data access
public class AuthenticationService { }         // Business logic
public class RegisterUserCommandHandler { }    // Request handling

// ❌ Bad - Multiple responsibilities
public class UserManager
{
    public void Register() { }      // Registration
    public void SaveToDb() { }      // Data access
    public void SendEmail() { }     // Email
    public void GenerateToken() { } // Token generation
}
```

### 2. Open/Closed Principle
Classes should be open for extension but closed for modification.

```csharp
// ✅ Good - Extend with new handlers, no modification needed
public interface IPipelineBehavior<TRequest, TResponse> { }
public class ValidationBehavior : IPipelineBehavior { }  // New behavior
public class LoggingBehavior : IPipelineBehavior { }     // Another behavior

// ❌ Bad - Need to modify service for each new behavior
public class RequestHandler
{
    public async Task<T> Handle<T>(IRequest<T> request)
    {
        // Validate
        // Log
        // Handle
        // How to add new behavior? Modify this class!
    }
}
```

### 3. Liskov Substitution Principle (LSP)
Derived classes must be substitutable for base classes.

```csharp
// ✅ Good - All implementations fulfill the contract
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(Guid id);
    Task<T> CreateAsync(T entity);
}

public class UserRepository : IRepository<User> { } // Can be used wherever IRepository<User> is expected
public class ProviderRepository : IRepository<Provider> { } // Same contract
```

### 4. Interface Segregation Principle (ISP)
Many specific interfaces are better than one generic.

```csharp
// ✅ Good - Specific, focused interfaces
public interface IReadRepository<T>
{
    Task<T?> GetByIdAsync(Guid id);
}

public interface IWriteRepository<T>
{
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
}

// ❌ Bad - Too many unrelated methods in one interface
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(Guid id);
}
```

### 5. Dependency Inversion Principle (DIP)
Depend on abstractions, not concretions.

```csharp
// ✅ Good - Depends on IUserRepository (abstraction)
public class AuthenticationService
{
    private readonly IUserRepository _repository;
    
    public AuthenticationService(IUserRepository repository)
    {
        _repository = repository;  // Injected abstraction
    }
}

// ❌ Bad - Depends on UserRepository (concrete class)
public class AuthenticationService
{
    private readonly UserRepository _repository = new UserRepository();  // Tightly coupled!
}
```

## ⚡ Performance Optimization

### 1. Database Query Optimization

#### ✅ Good Practices

**Use AsNoTracking for read-only queries:**
```csharp
public async Task<IEnumerable<Provider>> GetActiveAsync()
{
    return await _context.Providers
        .AsNoTracking()  // Disable change tracking
        .Where(p => p.IsActive)
        .ToListAsync();
}
```

**Eager load related data:**
```csharp
public async Task<Appointment?> GetByIdAsync(Guid id)
{
    return await _context.Appointments
        .Include(a => a.User)
        .Include(a => a.Provider)
        .Include(a => a.Service)
        .FirstOrDefaultAsync(a => a.Id == id);
}
```

**Pagination for large datasets:**
```csharp
public async Task<PaginatedResponse<ProviderResponse>> GetPagedAsync(int pageNumber, int pageSize)
{
    var total = await _context.Providers.CountAsync();
    var providers = await _context.Providers
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
    
    return new PaginatedResponse<ProviderResponse>
    {
        Items = _mapper.Map<List<ProviderResponse>>(providers),
        PageNumber = pageNumber,
        PageSize = pageSize,
        TotalCount = total,
        TotalPages = (int)Math.Ceiling(total / (double)pageSize)
    };
}
```

#### ❌ Bad Practices

**N+1 Query Problem:**
```csharp
// ❌ BAD - Executes N+1 queries (1 for appointments + N for each provider)
var appointments = await _context.Appointments.ToListAsync();
foreach (var appointment in appointments)
{
    var provider = await _context.Providers
        .FirstOrDefaultAsync(p => p.Id == appointment.ProviderId);  // Extra query!
}

// ✅ GOOD - Single query with join
var appointments = await _context.Appointments
    .Include(a => a.Provider)
    .ToListAsync();
```

**Loading entire objects when only specific fields needed:**
```csharp
// ❌ BAD - Loads entire object
var providers = await _context.Providers.ToListAsync();
var names = providers.Select(p => p.Name).ToList();

// ✅ GOOD - Load only needed fields
var names = await _context.Providers
    .Select(p => p.Name)
    .ToListAsync();
```

### 2. Caching Strategy

```csharp
// ✅ Good - Cache expensive operations
public async Task<List<ProviderResponse>> GetActiveProvidersAsync()
{
    const string cacheKey = "active_providers";
    
    if (_cache.TryGetValue(cacheKey, out List<ProviderResponse>? cached))
    {
        _logger.LogInformation("Cache hit for active providers");
        return cached!;
    }

    _logger.LogInformation("Cache miss for active providers, fetching from database");
    var providers = await _repository.GetActiveAsync();
    var response = _mapper.Map<List<ProviderResponse>>(providers);
    
    // Cache for 1 hour
    _cache.Set(cacheKey, response, TimeSpan.FromHours(1));
    
    return response;
}

// ✅ Good - Invalidate cache on updates
public async Task<ProviderResponse> UpdateProviderAsync(Guid id, UpdateProviderRequest request)
{
    var provider = await _repository.GetByIdAsync(id);
    _mapper.Map(request, provider);
    await _repository.UpdateAsync(provider);
    
    // Invalidate cache
    _cache.Remove("active_providers");
    
    return _mapper.Map<ProviderResponse>(provider);
}
```

### 3. Async/Await Best Practices

```csharp
// ✅ Good - Truly async end-to-end
public async Task<LoginResponse> LoginAsync(LoginRequest request)
{
    var user = await _userRepository.GetByEmailAsync(request.Email);
    if (user == null)
        throw new UnauthorizedAccessException("Invalid credentials");
    
    var token = _jwtTokenService.GenerateToken(user.Email, user.Id.ToString(), user.Role, 60);
    return new LoginResponse { Token = token };
}

// ❌ Bad - Blocking async operations
public async Task<LoginResponse> LoginAsync(LoginRequest request)
{
    var user = _userRepository.GetByEmailAsync(request.Email).Result;  // BLOCKS!
    if (user == null)
        throw new UnauthorizedAccessException("Invalid credentials");
    
    var token = _jwtTokenService.GenerateToken(user.Email, user.Id.ToString(), user.Role, 60);
    return new LoginResponse { Token = token };
}

// ❌ Bad - Fire and forget
public void LogUserActivity(Guid userId, string action)
{
    _ = _logger.LogAsync(userId, action);  // Lost error handling!
}
```

### 4. Memory Efficiency

```csharp
// ✅ Good - Dispose resources
public async Task<List<ProviderResponse>> GetProvidersByCountryAsync(string country)
{
    using (var connection = new SqlConnection(connectionString))
    {
        await connection.OpenAsync();
        // Use connection
        // Automatically disposed
    }
}

// ✅ Good - Stream large datasets
public async IAsyncEnumerable<ProviderResponse> GetProvidersStreamAsync()
{
    var providers = _context.Providers
        .AsNoTracking()
        .AsAsyncEnumerable();
    
    await foreach (var provider in providers)
    {
        yield return _mapper.Map<ProviderResponse>(provider);
    }
}

// ❌ Bad - Load entire collection
public async Task<List<ProviderResponse>> GetAllProvidersAsync()
{
    return _mapper.Map<List<ProviderResponse>>(
        await _context.Providers.ToListAsync()  // All in memory!
    );
}
```

## 🔒 Security Best Practices

### 1. Never Log Sensitive Data
```csharp
// ❌ Bad - Logging password
_logger.LogInformation("User login: {Email}, Password: {Password}", email, password);

// ✅ Good - Don't log sensitive data
_logger.LogInformation("User login attempt: {Email}", email);
```

### 2. Validate Input
```csharp
// ✅ Good - FluentValidation
public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
    }
}

// Automatically validated via MediatR pipeline
public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
{
    // Input is already validated
    return await _authService.LoginAsync(request);
}
```

### 3. Use HTTPS in Production
```csharp
// ✅ Good - Force HTTPS
app.UseHttpsRedirection();  // In production

// ✅ Good - Secure cookies
var cookieOptions = new CookieOptions
{
    HttpOnly = true,      // No JavaScript access
    Secure = true,        // Only over HTTPS
    SameSite = SameSiteMode.Strict  // CSRF protection
};
```

### 4. Implement Rate Limiting
```csharp
// ✅ Good - Prevent brute force attacks
// Add AspNetCoreRateLimitInvoker NuGet package
builder.Services.AddMemoryCache();
builder.Services.AddInMemoryRateLimiting();

[HttpPost("login")]
[RateLimit(rateLimitDuration: 60, maxRequests: 5)]  // 5 attempts per minute
public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(LoginRequest request)
{
    // Only 5 login attempts per minute
}
```

### 5. SQL Injection Prevention
```csharp
// ✅ Good - Parameterized queries (Entity Framework)
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == email);  // Parameterized

// ❌ Bad - String concatenation (never do this!)
var query = $"SELECT * FROM Users WHERE Email = '{email}'";  // SQL Injection!
```

## 📊 Monitoring & Observability

### 1. Structured Logging
```csharp
// ✅ Good - Structured data for querying
_logger.LogInformation(
    "User registered: UserId={UserId}, Email={Email}, Timestamp={Timestamp}",
    user.Id, user.Email, DateTime.UtcNow);

// Query in database:
// SELECT * FROM RequestLogs WHERE Email = 'user@example.com'
```

### 2. Performance Monitoring
```csharp
// ✅ Good - Track operation duration
var stopwatch = Stopwatch.StartNew();

var result = await _repository.GetAllAsync();

stopwatch.Stop();
_logger.LogInformation("Database query took {DurationMs}ms", stopwatch.ElapsedMilliseconds);
```

### 3. Error Tracking
```csharp
// ✅ Good - Log exceptions with context
catch (Exception ex)
{
    _logger.LogError(ex,
        "Failed to create appointment for UserId={UserId}, ProviderId={ProviderId}",
        userId, providerId);
}
```

## 🧪 Testing Tips

### 1. Mock Dependencies
```csharp
[Fact]
public async Task GetProvider_ValidId_ReturnsProvider()
{
    // Arrange
    var mockRepository = new Mock<IProviderRepository>();
    var provider = new Provider { Id = Guid.NewGuid(), Name = "Test" };
    mockRepository
        .Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
        .ReturnsAsync(provider);
    
    var controller = new ProvidersController(mockRepository.Object, /* ... */);

    // Act
    var result = await controller.GetProviderById(provider.Id);

    // Assert
    Assert.NotNull(result.Value);
    Assert.Equal(provider.Name, result.Value.Data.Name);
}
```

### 2. Avoid Hard-Coded Values
```csharp
// ❌ Bad
const int PAGE_SIZE = 10;

// ✅ Good
public class PaginationConstants
{
    public const int DEFAULT_PAGE_SIZE = 10;
    public const int MAX_PAGE_SIZE = 100;
}
```

## 📋 Code Review Checklist

Before committing code:

- [ ] **SRP**: Does each class have a single responsibility?
- [ ] **DI**: Are dependencies injected, not created?
- [ ] **Naming**: Are names clear and descriptive?
- [ ] **Logging**: Is there appropriate logging (not too much)?
- [ ] **Security**: No hardcoded secrets? Input validated?
- [ ] **Performance**: No N+1 queries? Async used? Caching considered?
- [ ] **Errors**: Are exceptions handled properly?
- [ ] **Tests**: Is business logic testable?
- [ ] **Comments**: Are complex parts documented?
- [ ] **Formatting**: Does code follow project conventions?

---

**Remember**: Write code not for the compiler, but for the developers who will maintain it!
