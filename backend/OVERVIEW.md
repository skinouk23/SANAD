# Project - Sanad CareAtHome Backend

## Project Overview

ASP.NET Core 8.0 Web API using **Vertical Slice Architecture** with CQRS (MediatR).
Single project: `BackEnd/SanadPlatform.API/`. Solution file: `Sanad Platform Official.sln`.
Database: PostgreSQL via EF Core (Npgsql). No test projects exist yet.

## Build & Run Commands

```bash
# Restore and build (from solution root or project directory)
dotnet build "Sanad Platform Official.sln"
dotnet build BackEnd/SanadPlatform.API/SanadPlatform.API.csproj

# Run the API (launches on http://localhost:5000, Swagger at root)
dotnet run --project BackEnd/SanadPlatform.API/SanadPlatform.API.csproj

# EF Core migrations
dotnet ef migrations add <MigrationName> --project BackEnd/SanadPlatform.API
dotnet ef database update --project BackEnd/SanadPlatform.API

# Health check (once running)
curl http://localhost:5000/health
```

There are **no test projects** in this solution. If tests are added, they should use xUnit
(the .NET standard) with the pattern `dotnet test` or `dotnet test --filter "FullyQualifiedName~TestName"`.

## Project Structure

```
SanadPlatform.API/
  Program.cs                          # DI registration, middleware pipeline
  Features/                           # Vertical slices by business domain
    {Feature}/
      Controllers/                    # Thin API controllers
      Commands/                       # MediatR commands + handlers (same file)
      Queries/                        # MediatR queries + handlers (same file)
      DTOs/                           # Request/Response models
      Entities/                       # EF Core entities
      Configurations/                 # IEntityTypeConfiguration<T> (EF Fluent API)
      Validators/                     # FluentValidation validators
      Repositories/                   # Repository interface + implementation
      Services/                       # Business logic services
      Mappings/                       # Feature-specific AutoMapper profiles
  Common/                             # Shared cross-cutting code
    Models/ApiResponse.cs             # ApiResponse<T>, PaginatedResponse<T>
    Extensions/ValidationExtensions.cs # Reusable FluentValidation rules
    Enums/                            # Shared enums (Gender, BookingStatus, etc.)
    Interfaces/IAuditableEntity.cs    # extends IHasCreatedAt; adds UpdatedAt (mutable entities)
    Interfaces/IHasCreatedAt.cs       # CreatedAt timestamp (all entities with a creation time)
    Interfaces/ISoftDeletable.cs      # DeletedAt nullable timestamp (soft-deletable entities)
    Mapping/MappingProfile.cs         # Global AutoMapper profile
    Specifications/                   # Specification pattern base classes
  Infrastructure/
    Database/SanadDbContext.cs         # EF Core DbContext (50+ DbSets)
    Database/Interceptors/            # AuditableEntityInterceptor
    Logging/PipelineBehaviors.cs      # ValidationBehavior, LoggingBehavior
    Security/                         # Encryption, hashing, claims services
    Versioning/                       # API versioning config
  Middleware/
    GlobalExceptionHandlingMiddleware.cs  # Central error -> ApiResponse mapping
    RequestLoggingMiddleware.cs           # Request/response logging
  Migrations/                         # EF Core migrations
```

## Architecture Patterns

- **Vertical Slice**: Each feature is self-contained under `Features/{Name}/`.
- **CQRS with MediatR**: Commands mutate state, Queries read. Controller -> `_mediator.Send()`.
- **Command/Query + Handler in same file**: The record and its handler class live together.
- **Repository Pattern**: Interface `I{Entity}Repository` + implementation `{Entity}Repository`.
- **FluentValidation pipeline**: Validators target MediatR command records. `ValidationBehavior<,>`
  runs them automatically before the handler executes.
- **AutoMapper**: Entity-to-DTO mapping via profiles. Use `ProjectTo<>()` in repositories for read queries.
- **Audit Trail**: `AuditableEntityInterceptor` automatically sets timestamps — never set them manually
  in entity constructors or application code.
  - `IHasCreatedAt` → implement on any entity that needs a `CreatedAt` timestamp (58 entities)
  - `IAuditableEntity : IHasCreatedAt` → implement on mutable entities that also need `UpdatedAt` (32 entities)
  - `ISoftDeletable` → implement on soft-deletable entities (`User`, `Patient`, `Provider`); a global
    EF query filter in `SanadDbContext` automatically excludes deleted records from all queries.
  - Entities with domain-semantic timestamps (e.g. `StartedAt`, `EarnedAt`, `RecordedAt`) do **not**
    implement these interfaces — those fields carry business meaning and are set by application logic.
- **IUnitOfWork transactions**: Repositories stage changes; handlers call `SaveChangesAsync()`.
  For multi-step atomic writes use `BeginTransactionAsync()` / `CommitTransactionAsync()` /
  `RollbackTransactionAsync()`. Use `CreateExecutionStrategy()` for retriable operations.
- **ISensitiveRequest**: A marker interface in `Infrastructure/Logging/PipelineBehaviors.cs`.
  Commands implementing it have their request body **suppressed** from `LoggingBehavior` log output
  (e.g. login, password-change commands). Apply it to any command carrying credentials or PII.
- **Repository folder naming is inconsistent** across features: `Patients` uses `Repositories/`
  (plural) while most others use `Repository/` (singular). Follow the convention of the feature
  you are working in rather than introducing a new inconsistency.

## Code Style Guidelines

### Language & Formatting
- **File-scoped namespaces**: `namespace X;` (not block-scoped `namespace X { }`)
- **4-space indentation**, Allman brace style (opening brace on new line)
- **Nullable reference types** enabled (`<Nullable>enable</Nullable>`)
- **Implicit usings** enabled (`<ImplicitUsings>enable</ImplicitUsings>`)
- XML doc comments (`/// <summary>`) on all public classes and methods
- No `.editorconfig`, Roslyn analyzers, or StyleCop are configured. Code style is convention-based only.

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Classes, records, enums | PascalCase | `UpdatePatientProfileCommand` |
| Interfaces | `I` prefix + PascalCase | `IPatientRepository` |
| Methods | PascalCase, async suffix `Async` | `GetByUserIdAsync()` |
| Properties | PascalCase | `FirstName`, `DateOfBirth` |
| Private fields | `_camelCase` | `_mediator`, `_patientRepository` |
| Constants | PascalCase | `NameRegex` |
| Enums | PascalCase (singular) | `Gender`, `BookingStatus` |
| DTOs (request) | `{Action}{Entity}Request` | `UpdatePatientProfileRequest` |
| DTOs (response) | `{Entity}{Detail}Response` | `MyPatientProfileResponse` |
| Commands | `{Action}{Entity}Command` | `AddFamilyMemberCommand` |
| Queries | `Get{Entity}{Detail}Query` | `GetMyPatientProfileQuery` |
| Validators | `{CommandName}Validator` | `UpdatePatientProfileValidator` |
| Handlers | `{CommandName}Handler` | `UpdatePatientProfileHandler` |
| Controllers | `{Feature}Controller` | `PatientsController` |

### Imports (usings)
- Placed outside namespace, at top of file
- Not strictly sorted, but loosely grouped: System -> Microsoft -> third-party -> project

### Types
- Commands and Queries are **C# records** with positional parameters: `public record XCommand(...) : IRequest<T>;`
- DTOs: prefer `record` with `init` properties for new code; older code uses `class` with `get/set`
- Entity IDs are `Guid` with default `Guid.NewGuid()`
- No shared base entity class; entities implement `IAuditableEntity` for audit fields

### Error Handling
- **Do NOT use try-catch in controllers** (newer pattern). Let exceptions propagate to
  `GlobalExceptionHandlingMiddleware` which maps them to `ApiResponse<T>`:
  - `KeyNotFoundException` -> 404 (use for missing resources)
  - `InvalidOperationException` -> 400 (use for business rule violations)
  - `UnauthorizedAccessException` -> 401
  - `ValidationException` (FluentValidation) -> 400 with structured errors
  - `ArgumentException`/`ArgumentNullException` -> 400
  - `DbUpdateConcurrencyException` -> 409
  - `TimeoutException` -> 408
  - `NotImplementedException` -> 501
  - Unhandled -> 500 (logged via Serilog)
- Throw `KeyNotFoundException` with a descriptive message when an entity is not found.
- Throw `InvalidOperationException` for business rule violations.

### API Response Pattern
All endpoints return `ApiResponse<T>`:
```csharp
return Ok(ApiResponse<MyDto>.SuccessResponse(data, "Description of success"));
return Unauthorized(ApiResponse<object>.ErrorResponse("Error message"));
// For POST/create:
return CreatedAtAction(nameof(GetX), ApiResponse<MyDto>.SuccessResponse(result, "Created"));
```

### Controller Pattern (preferred, newer style)
```csharp
[ApiController]
[ApiVersion(ApiVersions.V1_0)]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class XController : ControllerBase
{
    private readonly IMediator _mediator;
    // Inject ONLY IMediator. Keep controllers thin.
    // Accept CancellationToken in all action methods.
    // Use [ProducesResponseType] attributes on all actions.
}
```

Each controller also contains a private `GetAuthenticatedUserId()` helper that extracts the user ID
from JWT claims (`User.FindFirst(ClaimTypes.NameIdentifier)`). This pattern is repeated per-controller
rather than a shared base class.

### Validation Pattern
- Validators extend `AbstractValidator<TCommand>` and target the MediatR command, not the DTO.
- Use shared extension methods from `ValidationExtensions`: `ValidName()`, `ValidPhoneNumber()`,
  `ValidBirthDate()`, `ValidLargeText()`, `ValidMediumText()`.
- Use `.When()` for optional/nullable fields.

### Repository Pattern
- Read queries: use `AsNoTracking()` and `ProjectTo<TDto>()` for performance.
- Write queries: tracked (no `AsNoTracking()`), return entity, let handler map to DTO.
- All DB methods accept `CancellationToken`.

### Logging
- Use Serilog structured logging with message templates: `_logger.LogInformation("Profile updated for User ID {UserId}", userId)`
- Never interpolate strings in log messages; use template placeholders `{PropertyName}`.

### Dependency Injection
- All services registered as **Scoped** in `Program.cs`.
- MediatR, FluentValidation, and AutoMapper auto-scan the assembly.
- Constructor null-checks: `_x = x ?? throw new ArgumentNullException(nameof(x));`

### Section Headers in Code
Use comment banners to separate logical sections within large files:
```csharp
// ==================== Section Name ====================
```

## Git Workflow
- **Never push directly to `main`**. Create feature branches: `feature/short-description`,
  `bugfix/short-description`, or `hotfix/short-description`.
- Write clear commit messages (e.g., "Add login form validation", not "fix" or "done").
- All changes go through Pull Requests.
- Keep branches up-to-date by merging `main` before PR.
- No CI/CD pipeline or Dockerfile exists yet.
