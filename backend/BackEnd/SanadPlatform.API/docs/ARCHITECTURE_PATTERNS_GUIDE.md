# Architecture Patterns Guide

## Sanad CareAtHome Platform — When to Use What

**Last updated:** February 2026

---

## Table of Contents

1. [Current State of the Codebase](#1-current-state-of-the-codebase)
2. [MediatR (CQRS) — When to Use It](#2-mediatr-cqrs--when-to-use-it)
3. [Specification Pattern — When to Use It](#3-specification-pattern--when-to-use-it)
4. [Repository — What Belongs There](#4-repository--what-belongs-there)
5. [Service Layer — What Belongs There](#5-service-layer--what-belongs-there)
6. [DTOs — What to Include and What to Leave Out](#6-dtos--what-to-include-and-what-to-leave-out)
7. [Decision Flowchart](#7-decision-flowchart)
8. [Pattern Combinations by Feature Complexity](#8-pattern-combinations-by-feature-complexity)
9. [Inconsistencies to Avoid](#9-inconsistencies-to-avoid)

---

## 1. Current State of the Codebase

The project currently uses **three different patterns** across features, which creates confusion. This guide standardizes the rules.

| Feature | Controller Pattern | Has Service? | Has MediatR? | Has Specification? | Has Validator? |
|---|---|---|---|---|---|
| Authentication | MediatR | Yes | Yes | No | Yes |
| Patients | Service Layer | Yes | No | No | Yes |
| Providers | Mixed (Service + Direct Repo) | Partial | No | No | No |
| Bookings | Service Layer | Yes | No | Yes | No |
| Health | None (static) | No | No | No | No |

**The goal:** Every new feature should follow a **consistent** pattern. The rules below define which pattern to use based on the feature's complexity and requirements.

---

## 2. MediatR (CQRS) — When to Use It

### What MediatR does

MediatR decouples the **caller** (controller) from the **handler** (business logic). The controller sends a message object, and a handler somewhere processes it. Pipeline behaviors (validation, logging) run automatically on every request.

```
Controller → _mediator.Send(command) → [ValidationBehavior] → [LoggingBehavior] → Handler → Service/Repo
```

### When to use MediatR

Use MediatR when **ALL** of these are true:

1. **The operation has cross-cutting concerns** that should run automatically — validation, logging, authorization, caching, retry logic
2. **The feature has multiple distinct operations** (commands + queries) that benefit from being separate classes
3. **You want pipeline behaviors** to intercept every request without manually calling them

### Concrete examples where MediatR fits

| Operation | Why MediatR fits |
|---|---|
| `RegisterUserCommand` | Needs validation pipeline (password rules), logging, and the handler orchestrates multiple steps (check duplicate, hash password, create user, generate token) |
| `LoginCommand` | Needs validation, logging, rate-limit behavior (future), and orchestrates multiple steps |
| `GetUserProfileQuery` | Benefits from caching behavior (future) |

### When NOT to use MediatR

- **Simple CRUD** with no cross-cutting concerns — MediatR adds indirection for no benefit
- **Single-step operations** — fetching a provider by ID doesn't need a pipeline
- **When the controller already has only 1-2 endpoints** — the overhead of command/query classes isn't worth it
- **Performance-critical hot paths** — MediatR adds ~1-2μs per request from reflection/DI resolution

### Rule of thumb

> **If the operation needs validation + logging + authorization that should run automatically via pipeline, use MediatR. If it's a straightforward fetch/update, use a service method.**

### How MediatR works in this codebase

**Request + Handler (in one file per convention):**

```csharp
// Features/Authentication/Commands/AuthenticationCommands.cs

public record RegisterUserCommand(
    string Email,
    string Password,
    string Role) : IRequest<LoginResponse>;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, LoginResponse>
{
    private readonly IAuthenticationService _authService;

    public RegisterUserHandler(IAuthenticationService authService)
    {
        _authService = authService;
    }

    public async Task<LoginResponse> Handle(RegisterUserCommand request, CancellationToken ct)
    {
        return await _authService.RegisterAsync(request.Email, request.Password, request.Role);
    }
}
```

**Controller:**

```csharp
[HttpPost("register")]
public async Task<ActionResult<ApiResponse<LoginResponse>>> Register(RegisterUserCommand command)
{
    var result = await _mediator.Send(command);
    return Ok(ApiResponse<LoginResponse>.SuccessResponse(result));
}
```

**Pipeline behaviors run automatically** on every `_mediator.Send()`:
- `ValidationBehavior` — finds any `IValidator<TRequest>` and runs it before the handler
- `LoggingBehavior` — logs request name, data, duration

### File structure for MediatR features

```
Features/
  Authentication/
    Commands/
      AuthenticationCommands.cs     ← RegisterUserCommand + handler, LoginCommand + handler
    Queries/
      AuthenticationQueries.cs      ← GetUserProfileQuery + handler
    Validators/
      AuthenticationValidators.cs   ← RegisterUserValidator, LoginValidator
    Services/
      AuthenticationService.cs      ← Business logic (handlers delegate here)
    Controllers/
      AuthController.cs             ← Uses _mediator.Send()
```

---

## 3. Specification Pattern — When to Use It

### What the Specification Pattern does

A specification encapsulates **complex query logic** (filters, sorting, paging, includes) into a reusable object. Instead of building LINQ queries directly in the repository, you build a specification object and pass it to the repository.

```
Service builds spec → Repository applies spec to IQueryable → Returns results
```

### When to use a Specification

Use the Specification Pattern when **ANY** of these are true:

1. **The query has 3+ filter parameters** that can be combined in different ways
2. **The same filtering logic is needed from multiple callers** (different endpoints, background jobs)
3. **Role-based filtering** changes the query — e.g., patients see their own bookings, providers see theirs, admins see all
4. **Pagination + sorting + filtering** are all needed together

### Concrete examples where Specification fits

| Operation | Why Specification fits |
|---|---|
| List bookings with filters | 6+ filters (status, date range, patient, provider, service type), role-based security, pagination, sorting — too complex for repository method parameters |
| Search providers with filters | Location radius, category, rating range, availability, language — combinatorial filters |
| Transaction history with filters | Date range, status, amount range, payment method — similar to bookings |

### When NOT to use a Specification

- **Simple lookups** — `GetByIdAsync`, `GetByUserIdAsync` — just put these on the repository directly
- **Fixed queries with no variable filters** — `GetActiveProviders()` always has the same filter
- **Queries with 1-2 parameters** — a repository method with parameters is simpler

### Rule of thumb

> **If the query has 3+ optional filter parameters that combine dynamically, use a Specification. If it's a fixed query or has 1-2 parameters, use a repository method.**

### How it works in this codebase

**Base specification class:**

```csharp
// Features/Bookings/Repository/GetAppointmentsSpecification.cs

public abstract class AppointmentSpecification
{
    public Expression<Func<Booking, bool>>? Criteria { get; protected set; }
    public List<Expression<Func<Booking, object>>> Includes { get; } = new();
    public Expression<Func<Booking, object>>? OrderBy { get; protected set; }
    public Expression<Func<Booking, object>>? OrderByDescending { get; protected set; }
    public int Skip { get; protected set; }
    public int Take { get; protected set; }
    public bool IsPagingEnabled { get; protected set; }
}
```

**Concrete specification (builds dynamic filters):**

```csharp
public class GetAppointmentsSpecification : AppointmentSpecification
{
    public GetAppointmentsSpecification(GetAppointmentsRequest request, Guid? userId, string? role)
    {
        var predicate = PredicateBuilder.True<Booking>();

        // Role-based security filter
        if (role == "patient")
            predicate = predicate.And(b => b.PatientId == userId);
        else if (role == "provider")
            predicate = predicate.And(b => b.ProviderId == userId);

        // Optional filters
        if (!string.IsNullOrEmpty(request.Status))
            predicate = predicate.And(b => b.Status == request.Status);

        if (request.StartDate.HasValue)
            predicate = predicate.And(b => b.BookingDate >= request.StartDate.Value);

        // ... more filters, sorting, paging ...

        Criteria = predicate;
    }
}
```

**Repository applies the spec:**

```csharp
public async Task<(List<Booking> items, int total)> GetAppointmentsAsync(AppointmentSpecification spec)
{
    var query = _context.Bookings.AsNoTracking();

    if (spec.Criteria != null)
        query = query.Where(spec.Criteria);

    foreach (var include in spec.Includes)
        query = query.Include(include);

    var total = await query.CountAsync();

    if (spec.OrderByDescending != null)
        query = query.OrderByDescending(spec.OrderByDescending);

    if (spec.IsPagingEnabled)
        query = query.Skip(spec.Skip).Take(spec.Take);

    return (await query.ToListAsync(), total);
}
```

**Service constructs the spec:**

```csharp
public async Task<PaginatedResponse<AppointmentResponse>> GetAppointmentsAsync(
    GetAppointmentsRequest request, Guid userId, string role)
{
    var spec = new GetAppointmentsSpecification(request, userId, role);
    var (bookings, total) = await _repository.GetAppointmentsAsync(spec);
    // ... map to DTOs ...
}
```

### File structure for Specification features

```
Features/
  Bookings/
    Repository/
      IAppointmentRepository.cs              ← Has GetAppointmentsAsync(spec)
      AppointmentRepository.cs               ← Applies spec to IQueryable
      GetAppointmentsSpecification.cs        ← Base class + concrete spec + PredicateBuilder
    Services/
      AppointmentService.cs                  ← Builds spec from request + security context
    DTOs/
      GetAppointmentsRequest.cs              ← Filter/sort/page parameters
```

---

## 4. Repository — What Belongs There

### The repository's job

The repository is a **thin data access layer**. It talks to the database via `SanadDbContext` and returns entities. It does NOT contain business logic, mapping, or authorization.

### What BELONGS in the repository

| Method Type | Example | Why it belongs |
|---|---|---|
| Get by ID | `GetByIdAsync(Guid id)` | Basic data access |
| Get by FK | `GetByUserIdAsync(Guid userId)` | Basic data access |
| Get filtered list (simple) | `GetActiveAsync()` | Fixed query, no dynamic parameters |
| Get by specification | `GetAppointmentsAsync(spec)` | Applies spec to IQueryable |
| Existence check | `ExistsAsync(Guid id)` | Simple boolean query |
| Create/Update/Delete | `CreateAsync(entity)` | Basic persistence |
| Count | `GetTotalCountAsync()` | Aggregate query |
| Paged query (simple) | `GetPagedAsync(page, size)` | Data access with pagination |

### What does NOT belong in the repository

| Concern | Where it goes instead | Why |
|---|---|---|
| Mapping to DTOs | Service layer | Repository returns entities, not DTOs |
| Authorization checks | Service layer | "Can this user access this entity?" is business logic |
| Computed fields | Service layer | `CompletionRate = Completed / Total * 100` |
| Validation | Validator classes | `FluentValidation` or pipeline behavior |
| Caching | Controller or service | Repository shouldn't know about cache |
| Sending notifications | Service or event handler | Side effects don't belong in data access |
| Complex multi-step orchestration | Service layer | "Create user, send email, create profile" spans multiple repos |

### Repository method naming convention

Use these verbs consistently:

```
GetByIdAsync(Guid id)              ← single entity by PK
GetByUserIdAsync(Guid userId)      ← single entity by FK
GetAllAsync()                      ← all entities (use sparingly)
GetActiveAsync()                   ← filtered list, fixed criteria
GetPagedAsync(int page, int size)  ← paginated list
GetAppointmentsAsync(spec)         ← specification-based query
CreateAsync(Entity entity)         ← insert
UpdateAsync(Entity entity)         ← update
DeleteAsync(Guid id)               ← delete (returns bool)
ExistsAsync(Guid id)               ← existence check
GetTotalCountAsync()               ← count
```

### Always use `AsNoTracking()` for read queries

```csharp
// ✅ Read query — no tracking needed
return await _context.Providers.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

// ✅ Write query — tracking IS needed (EF needs to track changes)
var entity = await _context.Providers.FindAsync(id);
_context.Providers.Remove(entity);
await _context.SaveChangesAsync();
```

### Always use `CancellationToken`

Every async repository method should accept `CancellationToken` so that cancelled HTTP requests stop the database query:

```csharp
// ✅ Correct
Task<Provider?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

// ❌ Missing cancellation support
Task<Provider?> GetByIdAsync(Guid id);
```

**Note:** The current codebase is inconsistent on this — `PatientRepository` uses `CancellationToken`, others don't. New code should always include it.

---

## 5. Service Layer — What Belongs There

### The service's job

The service sits between the controller and the repository. It contains **business logic**, **authorization**, **mapping**, and **orchestration**.

### What BELONGS in the service

| Concern | Example |
|---|---|
| Authorization | `if (entity.UserId != authenticatedUserId) throw` |
| Entity → DTO mapping | `_mapper.Map<ProviderProfileResponse>(provider)` |
| Computed/derived fields | `CompletionRate = CompletedBookings / TotalBookings * 100` |
| Multi-repo orchestration | Create user in `UserRepo`, then create profile in `PatientRepo` |
| Building specifications | `new GetAppointmentsSpecification(request, userId, role)` |
| Business rules | "Cannot cancel booking less than 2 hours before start time" |
| Duplicate checking | "A patient profile already exists for this user" |
| Audit logging | Log who changed what and when |

### What does NOT belong in the service

| Concern | Where it goes instead |
|---|---|
| HTTP concerns (status codes, `ActionResult`) | Controller |
| Request deserialization | Controller / model binding |
| Caching | Controller (or a decorator around the service) |
| Input validation (format, required fields) | Validator classes |
| Direct `DbContext` access | Repository |
| JWT claim extraction | Controller (private helper method) |

### Service method pattern

```csharp
public async Task<ProviderProfileResponse?> GetMyProviderProfileAsync(
    Guid userId,
    CancellationToken cancellationToken = default)
{
    // 1. Validate input
    ArgumentNullException.ThrowIfNull(userId);

    // 2. Fetch from repository
    var provider = await _providerRepository.GetByUserIdAsync(userId, cancellationToken);
    if (provider == null) return null;

    // 3. Map to DTO
    var response = _mapper.Map<ProviderProfileResponse>(provider);

    // 4. Compute derived fields
    if (provider.TotalBookings > 0)
        response.CompletionRate = Math.Round(
            (decimal)provider.CompletedBookings / provider.TotalBookings * 100, 2);

    return response;
}
```

### When you DON'T need a service layer

If the controller endpoint is just "fetch by ID and return" with zero business logic, you **can** skip the service and call the repository directly. But be consistent within a feature — if one endpoint in a feature needs a service, all endpoints in that feature should use the service.

---

## 6. DTOs — What to Include and What to Leave Out

### The DTO's job

DTOs (Data Transfer Objects) define the **shape of data** crossing the API boundary. They are the contract between your API and the client. They are NOT entity mirrors.

### Types of DTOs

| DTO Type | Naming Convention | Purpose |
|---|---|---|
| Create request | `CreateProviderRequest` | What the client sends to create a resource |
| Update request | `UpdateProviderRequest` | What the client sends to update a resource |
| Response | `ProviderResponse` | What the API returns for listing/public use |
| Detailed response | `ProviderProfileResponse` | What the API returns for the owner's own profile |
| Filter/query request | `GetAppointmentsRequest` | Filter, sort, and pagination parameters |

### What to INCLUDE in request DTOs

| Include | Why | Example |
|---|---|---|
| Fields the client provides | These are user input | `FirstName`, `Email`, `Bio` |
| Only writable fields | Don't accept computed or system fields | `ServiceCategory`, `IsIndividual` |
| Sensible defaults | Reduce required fields for the client | `CountryCode = "TN"` |

### What to LEAVE OUT of request DTOs

| Leave out | Why | Example |
|---|---|---|
| `Id` (for Create) | Server generates the ID | `Guid Id` — don't accept from client |
| `CreatedAt` / `UpdatedAt` | Server manages timestamps | System-controlled |
| `UserId` (for authenticated endpoints) | Extracted from JWT, not from request body | Security — client can't impersonate |
| Computed fields | Server calculates these | `CompletionRate`, `RatingAverage` |
| Internal/admin fields | Client shouldn't set these | `IsVerified`, `IsApproved`, `VerifiedBy` |
| Sensitive backend fields | Security risk | `StripeAccountId`, `BankAccountNumber` |
| Navigation properties | Not serializable / not needed | `virtual Patient Patient` |

**Example — Create request:**

```csharp
public class CreateProviderRequest
{
    // ✅ Client provides these
    public string ServiceCategory { get; set; } = string.Empty;
    public bool IsIndividual { get; set; } = true;
    public string? BusinessName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string CountryCode { get; set; } = "TN";

    // ❌ NOT here — server generates
    // public Guid Id { get; set; }
    // public DateTime CreatedAt { get; set; }

    // ❌ NOT here — from JWT
    // public Guid UserId { get; set; }

    // ❌ NOT here — admin-only
    // public bool IsVerified { get; set; }
    // public bool IsApproved { get; set; }
}
```

### What to INCLUDE in response DTOs

| Include | Why | Example |
|---|---|---|
| ID | Client needs it for subsequent requests | `Guid Id` |
| All fields the client needs to display | UI rendering | `FirstName`, `Rating`, `City` |
| Computed/derived fields | Saves client-side computation | `CompletionRate`, `FullName` |
| Timestamps | Display and sorting | `CreatedAt`, `UpdatedAt` |
| Status fields | UI state management | `IsApproved`, `IsOnline` |

### What to LEAVE OUT of response DTOs

| Leave out | Why | Example |
|---|---|---|
| Password hashes | Security — never expose | `PasswordHash` |
| Encryption keys / secrets | Security | `TwoFactorSecret`, `StripeAccountId` |
| Internal IDs the client doesn't need | Noise | `VerifiedBy` (admin Guid) |
| Full bank details | PCI/security | `BankAccountNumber`, `BankRoutingNumber` |
| Raw gateway responses | Internal debugging data | `GatewayResponse` (JSONB) |
| Navigation properties | Not serializable | `virtual User User` |
| Large text arrays (if not needed) | Payload size | `GalleryUrls` (return only on detail endpoint) |

**Example — Response for listing vs. own profile:**

```csharp
// Public listing — minimal, safe to show to any authenticated user
public class ProviderResponse
{
    public Guid Id { get; set; }
    public string ServiceCategory { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? City { get; set; }
    public decimal RatingAverage { get; set; }
    public int RatingCount { get; set; }
    public bool IsAvailable { get; set; }
    public string? ProfilePictureUrl { get; set; }
    // ❌ No bank details, no Stripe ID, no admin fields
}

// Own profile — more fields, includes things only the owner should see
public class ProviderProfileResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ServiceType { get; set; } = string.Empty;
    public string? LicenseNumber { get; set; }       // ← Owner sees this
    public string SubscriptionTier { get; set; }      // ← Owner sees this
    public decimal ResponseRate { get; set; }          // ← Owner sees this
    public decimal CompletionRate { get; set; }        // ← Computed field
    // ❌ Still no bank details or Stripe IDs in the response
}
```

### DTO field naming — match the API spec, not the entity

The DTO is the client-facing contract. If the API spec says `serviceType`, the DTO property is `ServiceType` — even if the entity calls it `ServiceCategory`. AutoMapper handles the translation.

```csharp
// Entity property:       ServiceCategory
// DTO property:          ServiceType
// AutoMapper mapping:    .ForMember(dest => dest.ServiceType, opt => opt.MapFrom(src => src.ServiceCategory))
```

### Filter/Query DTOs

For list endpoints with filtering, create a dedicated request DTO:

```csharp
public class GetAppointmentsRequest
{
    // Filters
    public string? Status { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public Guid? ProviderId { get; set; }

    // Pagination
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    // Sorting
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = true;

    // ❌ NOT here — security context comes from JWT, not query params
    // public Guid UserId { get; set; }
    // public string Role { get; set; }
}
```

---

## 7. Decision Flowchart

Use this to decide which pattern to apply for a new feature or endpoint:

```
New endpoint needed
│
├─ Is it a simple health check or static response?
│  └─ YES → Controller only, no service/repo needed
│
├─ Does it need cross-cutting pipeline behaviors
│  (auto-validation, logging, caching, retry)?
│  └─ YES → Use MediatR (Command/Query + Handler)
│           Handler delegates to a Service for business logic
│
├─ Is it a list endpoint with 3+ dynamic filter parameters?
│  └─ YES → Use Specification Pattern
│           Service builds spec → Repo applies spec
│
├─ Does it have business logic (auth checks, computed fields,
│  multi-step orchestration, business rules)?
│  └─ YES → Use Service Layer
│           Controller → Service → Repository
│
└─ Is it a simple CRUD operation with no business logic?
   └─ YES → Service Layer (for consistency within the feature)
            OR direct Repository (only if the entire feature is simple)
```

---

## 8. Pattern Combinations by Feature Complexity

### Simple Feature (1-3 endpoints, basic CRUD)

**Example:** Equipment Rentals, System Settings

```
Controller → Service → Repository
```

- No MediatR (overkill)
- No Specification (queries are simple)
- Service handles mapping + basic validation
- Repository handles data access

### Medium Feature (3-6 endpoints, some business logic)

**Example:** Providers, Patients

```
Controller → Service → Repository
                    ↘ AutoMapper
```

- Service layer for authorization, mapping, computed fields
- Repository with `GetByIdAsync`, `GetByUserIdAsync`, CRUD
- FluentValidation validators for create/update requests
- Feature-specific mapping profile if mappings are complex

### Complex Feature (many endpoints, dynamic queries, pipelines)

**Example:** Bookings/Appointments, future Payments

```
Controller → MediatR → Handler → Service → Repository
                ↓                        ↘ Specification
         [Validation]                    ↘ AutoMapper
         [Logging]
```

- MediatR for commands that need pipeline behaviors
- Specification for list queries with dynamic filters
- Service for business rules, authorization, orchestration
- Repository applies specifications to IQueryable
- Validators for every command/request

---

## 9. Inconsistencies to Avoid

These are patterns currently in the codebase that should NOT be repeated:

### 1. Controller injecting BOTH Service AND Repository

```csharp
// ❌ ProvidersController currently does this
public ProvidersController(
    IProviderRepository _providerRepository,   // direct repo access
    IProviderService _providerService,         // AND service
    ...)

// ✅ Pick one. If a feature has a service, ALL endpoints go through the service.
public ProvidersController(
    IProviderService _providerService,
    ...)
```

### 2. Missing CancellationToken on some repos but not others

```csharp
// ❌ UserRepository, ProviderRepository — no CancellationToken
Task<Provider?> GetByIdAsync(Guid id);

// ✅ PatientRepository — has CancellationToken
Task<Patient?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
```

All new repository methods should accept `CancellationToken`.

### 3. Inconsistent method naming

```csharp
// ❌ PatientRepository uses AddAsync, others use CreateAsync
Task<Patient> AddAsync(Patient patient, CancellationToken ct);
Task<Provider> CreateAsync(Provider provider);

// ✅ Pick one and stick with it. Recommendation: CreateAsync
```

### 4. Interface and implementation in the same file

```csharp
// ❌ AppointmentService.cs contains BOTH IAppointmentService and AppointmentService
// ✅ Separate files: IAppointmentService.cs and AppointmentService.cs
```

### 5. Mixing validation approaches

```csharp
// ❌ Patient DTOs use BOTH FluentValidation AND DataAnnotations
[Required]
[StringLength(100)]                    // DataAnnotation
public string FirstName { get; set; }  // ALSO has a FluentValidation rule

// ✅ Pick one. Recommendation: FluentValidation only (works with MediatR pipeline)
```

### 6. Missing validators for features that accept user input

```csharp
// ❌ CreateProviderRequest has no FluentValidation validator
// ❌ Booking creation has no validator
// ✅ Every request DTO that accepts user input should have a validator
```

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                    PATTERN DECISION MATRIX                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  "I need auto-validation + logging pipeline"                   │
│     → MediatR Command/Query + Handler                          │
│                                                                │
│  "I need dynamic filters (3+ optional params)"                 │
│     → Specification Pattern                                    │
│                                                                │
│  "I need to fetch/save data from the DB"                       │
│     → Repository method                                        │
│                                                                │
│  "I need authorization, mapping, business rules"               │
│     → Service layer method                                     │
│                                                                │
│  "Client sends data → What fields do I accept?"                │
│     → Request DTO (no Id, no timestamps, no admin fields)      │
│                                                                │
│  "Server returns data → What fields do I expose?"              │
│     → Response DTO (no passwords, no secrets, no nav props)    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Controller  →  NEVER contains business logic                  │
│  Service     →  NEVER touches DbContext directly               │
│  Repository  →  NEVER maps to DTOs                             │
│  DTO         →  NEVER contains entity navigation properties    │
│  Validator   →  NEVER throws — returns validation errors       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```
