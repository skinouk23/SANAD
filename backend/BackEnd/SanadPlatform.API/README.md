# Sanad Platform API

A modern, scalable .NET 8.0 Web API following **Vertical Slice Architecture** with enterprise-grade security, logging, and performance optimization.

## 📋 Architecture Overview

### Vertical Slice Architecture

The application is organized around business features (vertical slices) rather than technical layers. Each slice contains:

```
Features/
├── Authentication/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Entities/
│   ├── Services/
│   ├── Repository/
│   ├── Commands/
│   ├── Queries/
│   └── Validators/
├── Providers/
├── Appointments/
└── Services/
```

**Benefits:**
- ✅ Better code organization by feature
- ✅ Easier to understand and maintain individual features
- ✅ Promotes feature team independence
- ✅ Facilitates parallel development
- ✅ Clear separation of concerns

### Key Architectural Patterns Implemented

#### 1. **MediatR CQRS Pattern**
- Commands for state-changing operations
- Queries for read operations
- Decouples handlers from controllers
- Enables pipeline behaviors for cross-cutting concerns

#### 2. **Repository Pattern**
- Abstracts data access logic
- Interfaces for each entity
- Testable and maintainable data layer
- Centralized query logic

#### 3. **Dependency Injection**
- All services registered in `Program.cs`
- Loose coupling throughout the application
- Easy to swap implementations for testing

#### 4. **Service Layer**
- Business logic separated from controllers and repositories
- Reusable across commands/queries
- Single Responsibility Principle

#### 5. **FluentValidation**
- Declarative validation rules
- Centralized validators per DTO
- Automatic validation in MediatR pipeline

#### 6. **AutoMapper**
- Entity to DTO mapping
- Configured in `MappingProfile.cs`
- Reduces boilerplate code

## 🔐 Security Features

### JWT Authentication
```csharp
// Token generation with claims
var token = _jwtTokenService.GenerateToken(
    email: user.Email,
    userId: user.Id.ToString(),
    role: user.Role,
    expiryMinutes: 60
);
```

### Password Security
- SHA-256 hashing
- Cannot be reversed
- Salting can be added for production

### Authorization
- Role-based access control (RBAC)
- Route-level authorization: `[Authorize(Roles = "Admin")]`
- Token validation on every request

### CORS Protection
- Configured whitelist of allowed origins
- Prevents unauthorized cross-origin requests

## 📊 Logging & Monitoring

### Request Logging Middleware
Located in `Middleware/RequestLoggingMiddleware.cs`:

```csharp
// Logs asynchronously on a separate thread
// Captures:
// - Request method, path, body
// - Response status, body
// - Execution time
// - Correlation ID for tracing
```

**Key Features:**
- ✅ Async logging (non-blocking)
- ✅ Correlation ID for request tracing
- ✅ Body buffering for reading multiple times
- ✅ Performance metrics (execution time)
- ✅ Runs on background thread to not impact API performance

### Structured Logging with Serilog
- Configured in `Program.cs`
- Writes to:
  - Console (development)
  - SQL Server database (all environments)
- Structured data for better querying

### Database Logging Schema
```sql
-- RequestLogs table created automatically by Serilog
CREATE TABLE [RequestLogs] (
    [Id] [int] IDENTITY(1,1) PRIMARY KEY,
    [MessageTemplate] [nvarchar](max),
    [Level] [varchar](128),
    [TimeStamp] [datetime2],
    [Exception] [nvarchar](max),
    [LogEvent] [nvarchar](max)
);
```

## ⚡ Performance Optimization

### 1. **Caching Strategy**
- In-Memory Cache (development)
- Redis Cache (production-ready configuration)
- Cache invalidation on data changes

Example:
```csharp
const string cacheKey = "active_providers";
if (!_cache.TryGetValue(cacheKey, out List<ProviderResponse>? providers))
{
    providers = await _providerRepository.GetActiveAsync();
    _cache.Set(cacheKey, providers, TimeSpan.FromHours(1));
}
```

### 2. **Database Optimization**
- Connection pooling
- Retry policy for resilience
- No-tracking queries for read operations
- Proper indexing (via Entity Framework)

### 3. **Async/Await Throughout**
- All I/O operations are asynchronous
- Non-blocking pipeline

### 4. **Entity Framework Optimization**
- Compiled queries
- Batch operations
- Lazy loading disabled by default

## 🏗️ Project Structure

```
SanadPlatform.API/
├── Features/                          # Business features (vertical slices)
│   ├── Authentication/
│   ├── Providers/
│   ├── Appointments/
│   ├── Services/
│   └── Health/
├── Infrastructure/                    # Cross-cutting concerns
│   ├── Database/                     # EF Core context
│   ├── Logging/                      # Serilog, pipeline behaviors
│   ├── Security/                     # Auth, encryption
│   └── Exceptions/                   # Custom exceptions
├── Middleware/                        # HTTP middleware
│   ├── RequestLoggingMiddleware.cs   # Logs all requests
│   └── GlobalExceptionHandlingMiddleware.cs
├── Common/                            # Shared utilities
│   ├── Models/                       # API response models
│   ├── Mapping/                      # AutoMapper profiles
│   ├── Utilities/
│   └── Constants/
├── Program.cs                         # Application configuration
├── appsettings.json                  # Configuration
└── SanadPlatform.API.csproj          # Project file
```

## 🗄️ Database

### Connection Strings Configuration
Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=SanadPlatformDb;Trusted_Connection=true;",
    "LoggingDatabase": "Server=.;Database=SanadPlatformLogsDb;Trusted_Connection=true;"
  }
}
```

### Entity Relationships

```
User (1) ──→ (M) Appointment ←── (1) Provider
                     ↓
                 Service
```

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- SQL Server 2019+
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**
```bash
cd BackEnd/SanadPlatform.API
```

2. **Restore dependencies**
```bash
dotnet restore
```

3. **Update appsettings.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string",
    "LoggingDatabase": "your-logging-connection-string"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-min-32-chars"
  }
}
```

4. **Create & migrate database**
```bash
dotnet ef database update
```

5. **Run the application**
```bash
dotnet run
```

### API will be available at:
- Swagger UI: `https://localhost:5001/swagger/index.html`
- Health Check: `https://localhost:5001/api/health/live`

## 📚 API Endpoints

### Files
- `POST /api/v1/files` - Authenticated multipart upload. Returns `fileId`; does not return MinIO URLs.
- `GET /api/v1/files/{fileId}` - Authenticated metadata read with safe file state only.
- `GET /api/v1/files/{fileId}/content` - Authenticated binary content stream for ready files.
- `DELETE /api/v1/files/{fileId}` - Soft-delete file metadata and enqueue object cleanup.
- `POST /api/v1/provider-signup-applications` - Create or initialize a draft provider signup application. Returns `applicationId`, `uploadToken`, `uploadTokenExpiresAt`, and `headerName`.
- `POST /api/v1/provider-signup-applications/{applicationId}/files` - Upload provider signup documents using the scoped upload token in the returned header. This flow is anonymous and does not use cookie or session auth.

File bytes are stored in MinIO buckets `files-staging`, `files-private`, `files-public`, `files-quarantine`, and `files-exports`. RabbitMQ publishes file workflow events through the durable topic exchange `sanad.files`; when `RabbitMQ:Enabled` is true, `files.scan` and `files.cleanup` are consumed through RabbitMQ with manual ack/nack and DB polling is disabled to avoid duplicate work. When RabbitMQ is disabled, the scan and cleanup workers use the DB polling fallback. Local compose includes RabbitMQ and ClamAV services. Legacy presigned upload/download endpoints are retained only for compile compatibility and should not be used by new clients.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Providers
- `GET /api/providers/active` - Get all active providers
- `GET /api/providers/{id}` - Get provider by ID
- `GET /api/providers/country/{country}` - Get providers by country
- `POST /api/providers` - Create provider (Admin)
- `PUT /api/providers/{id}` - Update provider (Admin)
- `DELETE /api/providers/{id}` - Delete provider (Admin)

### Health
- `GET /api/health/live` - Liveness check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/version` - API version

## 🔄 Request/Response Flow

```
1. HTTP Request
   ↓
2. RequestLoggingMiddleware
   ├─ Captures request details
   └─ Logs asynchronously (separate thread)
   ↓
3. GlobalExceptionHandlingMiddleware
   └─ Catches unhandled exceptions
   ↓
4. Authentication Middleware
   └─ Validates JWT token
   ↓
5. Controller
   └─ Routes to appropriate handler
   ↓
6. MediatR Handler
   ├─ ValidationBehavior (validates input)
   ├─ LoggingBehavior (logs operation)
   ├─ Service Layer (business logic)
   └─ Repository (data access)
   ↓
7. Response
   ├─ Wrapped in ApiResponse<T>
   └─ Returned to client
```

## 🛡️ Error Handling

All errors follow standardized `ApiResponse<T>` format:

```json
{
  "success": false,
  "message": "User with email already exists",
  "data": null,
  "errors": {
    "email": ["Email already registered"]
  }
}
```

## 📝 Validation Example

```csharp
public class RegisterUserValidator : AbstractValidator<RegisterUserRequest>
{
    public RegisterUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches(@"[A-Z]")  // Uppercase
            .Matches(@"[0-9]")  // Digit
            .Matches(@"[!@#$%^&*]");  // Special char
    }
}
```

## 🔗 Integration with Frontend

### Authentication Flow
1. User registers/logs in
2. API returns JWT token
3. Frontend stores token in localStorage/sessionStorage
4. Every subsequent request includes token in `Authorization: Bearer {token}` header
5. API validates token and proceeds

### CORS Configuration
Frontend origin must be in `CorsSettings:AllowedOrigins`:

```json
{
  "CorsSettings": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://yourdomain.com"
    ]
  }
}
```

## 📊 Performance Monitoring

### Request Duration Tracking
All requests logged with execution time:

```
HTTP GET /api/providers/active responded 200 in 125.45ms
```

### Database Connection Pooling
Automatically enabled by Entity Framework Core

### Async Throughout
No blocking operations in async context

## 🧪 Testing Ready

The architecture enables easy unit testing:

```csharp
// Mock repositories
var mockRepo = new Mock<IProviderRepository>();

// Mock logger
var mockLogger = new Mock<ILogger<ProvidersController>>();

// Create controller with mocks
var controller = new ProvidersController(mockRepo.Object, mapper, mockLogger.Object, cache);
```

## 📦 Dependencies

- **ASP.NET Core 8.0** - Web framework
- **Entity Framework Core** - ORM
- **MediatR** - CQRS pattern
- **FluentValidation** - Validation
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **JWT** - Authentication
- **StackExchange.Redis** - Caching

## 🚦 Environment Configuration

### Development
- SQL Server Express or LocalDB
- Debug logging enabled
- CORS enabled for local development
- In-memory cache

### Production
- SQL Server
- Minimal console logging (structured only)
- Strict CORS policy
- Redis caching
- HTTPS enforced

## 🔧 Configuration Best Practices

1. **Store secrets in User Secrets (development)**
```bash
dotnet user-secrets set "JwtSettings:SecretKey" "your-secret-key"
```

2. **Use Azure Key Vault (production)**
```csharp
builder.Configuration.AddAzureKeyVault(...);
```

3. **Environment variables for sensitive data**
```bash
set ASPNETCORE_ENVIRONMENT=Production
```

## 📈 Scalability Considerations

1. **Horizontal Scaling**
   - Stateless API design
   - Redis for distributed cache
   - Database connection pooling

2. **Performance**
   - Async operations throughout
   - Caching strategy
   - Database indexing

3. **Monitoring**
   - Structured logging to database
   - Health check endpoints
   - Correlation IDs for tracing

## 🤝 Contributing

When adding new features:

1. **Create a new vertical slice** in `Features/`
2. **Follow the pattern**: Controller → MediatR Handler → Service → Repository
3. **Add validation** with FluentValidation
4. **Add mapping** in MappingProfile
5. **Register services** in Program.cs
6. **Add logging** at appropriate levels
7. **Add tests** for business logic

## 📄 License

This project is part of the Sanad Platform.

## 🆘 Support

For issues or questions, please check the documentation or contact the development team.

---

**Built with ❤️ following clean architecture principles and best practices**
