# Get List of Appointments - Implementation Checklist & Best Practices Reference

A comprehensive checklist and quick reference guide for implementing list endpoints with security and performance.

---

## QUICK REFERENCE: THE 4-LAYER PATTERN

```
┌─────────────────────────────────────────────┐
│ CONTROLLER LAYER                            │
│ • Receive HTTP request                      │
│ • Extract & validate user context (JWT)     │
│ • Validate request parameters               │
│ • Call service                              │
│ • Format response + error handling          │
│ • Return HTTP response                      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ SERVICE LAYER                               │
│ • Business logic & authorization            │
│ • Apply role-based security filters         │
│ • Build specification                       │
│ • Call repository                           │
│ • Map entities to DTOs                      │
│ • Error handling                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ REPOSITORY LAYER                            │
│ • Data access operations                    │
│ • Build IQueryable from specification       │
│ • Execute database queries                  │
│ • Return raw entities                       │
│ • Error handling                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ SPECIFICATION LAYER                         │
│ • Encapsulate query logic                   │
│ • Build WHERE criteria                      │
│ • Add INCLUDES (eager loading)              │
│ • Define SORTING                            │
│ • Calculate PAGINATION                      │
└─────────────────────────────────────────────┘
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Setup & Configuration
- [ ] Create feature folder structure:
  ```
  Features/
    Bookings/
      Controllers/
        AppointmentsController.cs
      Services/
        AppointmentService.cs
        IAppointmentService.cs
      Repository/
        AppointmentRepository.cs
        IAppointmentRepository.cs
        GetAppointmentsSpecification.cs
      DTOs/
        GetAppointmentsRequest.cs
        AppointmentResponse.cs
        PaginatedAppointmentsResponse.cs
      Entities/
        Booking.cs
  ```

- [ ] Register dependencies in `Program.cs`:
  ```csharp
  builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
  builder.Services.AddScoped<IAppointmentService, AppointmentService>();
  builder.Services.AddAutoMapper(typeof(Program).Assembly);
  ```

- [ ] Configure database:
  ```csharp
  builder.Services.AddDbContext<SanadDbContext>(options =>
      options.UseSqlServer(connectionString, sqlOptions =>
          sqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null)));
  ```

- [ ] Configure JWT authentication:
  ```csharp
  builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options => { ... });
  builder.Services.AddAuthorization();
  ```

### Phase 2: Database & Entity Setup
- [ ] Create `Booking` entity with:
  - [ ] Id (GUID)
  - [ ] BookingNumber (searchable encrypted string)
  - [ ] PatientId, ProviderId, ServiceId (encrypted GUIDs)
  - [ ] BookingDate, StartTime, EndTime
  - [ ] Status (string)
  - [ ] PatientName, ProviderName, ServiceName (encrypted snapshots)
  - [ ] Navigation properties: Patient, Provider, Service
  - [ ] Timestamps: CreatedAt, UpdatedAt

- [ ] Create database indexes:
  ```sql
  CREATE INDEX IX_Bookings_BookingDate ON dbo.Bookings(BookingDate);
  CREATE INDEX IX_Bookings_Status ON dbo.Bookings(Status);
  CREATE INDEX IX_Bookings_PatientId ON dbo.Bookings(PatientId);
  CREATE INDEX IX_Bookings_ProviderId ON dbo.Bookings(ProviderId);
  CREATE INDEX IX_Bookings_BookingNumber ON dbo.Bookings(BookingNumber);
  ```

- [ ] Run migrations:
  ```bash
  dotnet ef migrations add AddAppointmentsTable
  dotnet ef database update
  ```

### Phase 3: DTOs Implementation
- [ ] Create `GetAppointmentsRequest` with:
  - [ ] `Page` (Range: 1-int.MaxValue, default: 1)
  - [ ] `PageSize` (Range: 1-100, default: 20)
  - [ ] `Status` (optional filter)
  - [ ] `StartDateFrom`, `StartDateTo` (optional date range)
  - [ ] `PatientId`, `ProviderId` (optional, admin only)
  - [ ] `ServiceId` (optional filter)
  - [ ] `SearchQuery` (StringLength: 100 max)
  - [ ] `SortBy` (StringLength: 50 max, default: "startDate")
  - [ ] `SortDirection` (StringLength: 4 max, default: "asc")
  - [ ] `IncludeRelated` (bool, default: true)

- [ ] Create `AppointmentResponse` with:
  - [ ] Main fields (Id, BookingNumber, Dates, Status, etc.)
  - [ ] Decrypted snapshots (PatientName, ProviderName, ServiceName)
  - [ ] Optional nested DTOs:
    - [ ] PatientSummary
    - [ ] ProviderSummary
    - [ ] ServiceSummary

- [ ] Create `PaginatedAppointmentsResponse` with:
  - [ ] `Items` (List<AppointmentResponse>)
  - [ ] `TotalCount`
  - [ ] `PageNumber`
  - [ ] `PageSize`
  - [ ] Calculated properties:
    - [ ] `TotalPages`
    - [ ] `HasNextPage`
    - [ ] `HasPreviousPage`

### Phase 4: AutoMapper Configuration
- [ ] Create mapping profile:
  ```csharp
  public class BookingMappingProfile : Profile
  {
      public BookingMappingProfile()
      {
          CreateMap<Booking, AppointmentResponse>()
              .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient))
              .ForMember(dest => dest.Provider, opt => opt.MapFrom(src => src.Provider))
              .ForMember(dest => dest.Service, opt => opt.MapFrom(src => src.Service));
              
          CreateMap<Patient, AppointmentResponse.PatientSummary>();
          CreateMap<Provider, AppointmentResponse.ProviderSummary>();
          CreateMap<Service, AppointmentResponse.ServiceSummary>();
      }
  }
  ```

### Phase 5: Specification Pattern
- [ ] Create base `AppointmentSpecification`:
  - [ ] `Criteria` property (filter expression)
  - [ ] `Includes` property (eager loading list)
  - [ ] `OrderBy` property (ascending sort)
  - [ ] `OrderByDescending` property (descending sort)
  - [ ] `Skip`, `Take` properties (pagination)
  - [ ] `IsPagingEnabled` property

- [ ] Create `GetAppointmentsSpecification : AppointmentSpecification`:
  - [ ] Constructor with all parameters
  - [ ] Build filter criteria using PredicateBuilder
  - [ ] Add includes for related entities
  - [ ] Apply sorting logic
  - [ ] Calculate pagination

- [ ] Create `PredicateBuilder` helper:
  - [ ] `True<T>()` method
  - [ ] `False<T>()` method
  - [ ] `And<T>()` extension method
  - [ ] `Or<T>()` extension method

### Phase 6: Repository Implementation
- [ ] Create `IAppointmentRepository` interface with:
  - [ ] `GetAppointmentsAsync(specification, cancellationToken)`
  - [ ] `GetByIdAsync(id, cancellationToken)`
  - [ ] `GetByProviderIdAsync(providerId, cancellationToken)`
  - [ ] `GetByPatientIdAsync(patientId, cancellationToken)`
  - [ ] Other CRUD operations

- [ ] Implement `AppointmentRepository`:
  - [ ] Inject `SanadDbContext` and `ILogger`
  - [ ] `GetAppointmentsAsync` method:
    - [ ] Start with `AsNoTracking()`
    - [ ] Apply specification criteria
    - [ ] Count total before paging
    - [ ] Add includes
    - [ ] Apply sorting
    - [ ] Apply pagination
    - [ ] Execute query
    - [ ] Log results
    - [ ] Handle exceptions
  - [ ] Implement other methods following same pattern

### Phase 7: Service Implementation
- [ ] Create `IAppointmentService` interface with:
  - [ ] `GetAppointmentsAsync(request, userId, role, cancellationToken)`

- [ ] Implement `AppointmentService`:
  - [ ] Inject repository, mapper, logger
  - [ ] `GetAppointmentsAsync` method:
    - [ ] Log entry
    - [ ] Apply security filters based on role
    - [ ] Build specification
    - [ ] Call repository
    - [ ] Map entities to DTOs
    - [ ] Log success
    - [ ] Return paginated response
  - [ ] `ApplySecurityFilters` method:
    - [ ] Patient: `(currentUserId, null)`
    - [ ] Provider: `(null, currentUserId)`
    - [ ] Admin: `(request.PatientId, request.ProviderId)`
    - [ ] Default: throw UnauthorizedAccessException

### Phase 8: Controller Implementation
- [ ] Create `AppointmentsController`:
  - [ ] Inherit from `ControllerBase`
  - [ ] Add route: `[Route("api/[controller]")]`
  - [ ] Add authorization: `[Authorize]`
  - [ ] Inject `IAppointmentService` and `ILogger`

  - [ ] Create `GetAppointments` endpoint:
    - [ ] Method: `[HttpGet]`
    - [ ] Parameter: `[FromQuery] GetAppointmentsRequest request`
    - [ ] Parameter: `CancellationToken cancellationToken`
    - [ ] Response types: `[ProducesResponseType(...)]`
    
    - [ ] Implementation:
      - [ ] Extract user claims (NameIdentifier, Role)
      - [ ] Validate user ID is valid GUID
      - [ ] Validate role exists
      - [ ] Validate ModelState
      - [ ] Call service
      - [ ] Log success with details
      - [ ] Return 200 OK with wrapped response
      - [ ] Catch UnauthorizedAccessException → 403
      - [ ] Catch ArgumentException → 400
      - [ ] Catch generic Exception → 500

### Phase 9: API Response Wrapper
- [ ] Create `ApiResponse<T>` class:
  - [ ] `Success` property (bool)
  - [ ] `Message` property (string)
  - [ ] `Data` property (T)
  - [ ] `Errors` property (Dictionary<string, string[]>)
  - [ ] `SuccessResponse(data, message)` factory method
  - [ ] `ErrorResponse(message, errors)` factory method

### Phase 10: Security Configuration
- [ ] JWT authentication:
  - [ ] Validate issuer signing key
  - [ ] Validate issuer
  - [ ] Validate audience
  - [ ] Extract user claims properly

- [ ] Authorization:
  - [ ] Require `[Authorize]` on controller
  - [ ] Enforce role-based filtering in service
  - [ ] Prevent cross-user data access

- [ ] Encryption:
  - [ ] Mark sensitive fields with `[Encrypted]`
  - [ ] Mark searchable fields with `[SearchableEncrypted]`
  - [ ] EF Core handles encryption/decryption

### Phase 11: Error Handling
- [ ] ModelState validation:
  - [ ] Check in controller
  - [ ] Return 400 with validation errors

- [ ] Authorization errors:
  - [ ] Return 401 for missing/invalid token
  - [ ] Return 403 for insufficient permissions

- [ ] Business logic errors:
  - [ ] Return 400 for invalid arguments
  - [ ] Log with context

- [ ] Unexpected errors:
  - [ ] Return 500
  - [ ] Log full exception
  - [ ] Don't expose internal details

### Phase 12: Logging
- [ ] Controller logging:
  - [ ] Log method entry with user context
  - [ ] Log validation failures
  - [ ] Log authorization failures
  - [ ] Log successful operations with counts

- [ ] Service logging:
  - [ ] Log method entry
  - [ ] Log security filter application
  - [ ] Log successful retrieval

- [ ] Repository logging:
  - [ ] Log query execution
  - [ ] Log result counts
  - [ ] Log errors with context

- [ ] Don't log:
  - [ ] ❌ Full request bodies
  - [ ] ❌ JWT tokens
  - [ ] ❌ Passwords
  - [ ] ❌ Encrypted sensitive data

### Phase 13: Testing
- [ ] Unit tests:
  - [ ] Test security filters for each role
  - [ ] Test pagination calculations
  - [ ] Test sorting logic
  - [ ] Test filter combinations
  - [ ] Test request validation

- [ ] Integration tests:
  - [ ] Test authenticated request
  - [ ] Test unauthenticated request
  - [ ] Test patient getting own appointments
  - [ ] Test provider getting own appointments
  - [ ] Test admin getting filtered appointments
  - [ ] Test invalid pagination
  - [ ] Test no results case

### Phase 14: Documentation
- [ ] XML documentation comments on all public members
- [ ] OpenAPI/Swagger documentation:
  - [ ] ProducesResponseType for all response codes
  - [ ] Parameter descriptions
  - [ ] Example requests/responses
- [ ] README with usage examples
- [ ] Implementation guide document

### Phase 15: Performance Testing
- [ ] Run queries with monitoring
- [ ] Verify:
  - [ ] Single database query (no N+1)
  - [ ] Execution time < 500ms for 100 items
  - [ ] Memory usage reasonable
  - [ ] No unnecessary includes
  - [ ] Proper indexing

- [ ] Optimize if needed:
  - [ ] Add database indexes
  - [ ] Add caching for frequently accessed data
  - [ ] Adjust page size defaults
  - [ ] Add query hints if necessary

---

## SECURITY CHECKLIST

### Authentication & Authorization
- [ ] `[Authorize]` attribute on controller
- [ ] JWT token validation in startup
- [ ] User context extracted from claims
- [ ] Role claim validated and not empty
- [ ] Invalid tokens return 401
- [ ] Missing authorization returns 403

### Role-Based Access Control
- [ ] Patient role: Can only see own appointments
- [ ] Provider role: Can only see own appointments
- [ ] Admin role: Can see all with optional filters
- [ ] Unknown roles rejected
- [ ] Security filters applied in service (not client-side)
- [ ] Request parameters cannot override security filters

### Data Protection
- [ ] Sensitive fields encrypted at rest
- [ ] Encryption keys in secure configuration
- [ ] Encrypted fields handled transparently by EF Core
- [ ] No sensitive data in API responses (except authorized)
- [ ] Decrypted snapshots stored separately

### Input Validation
- [ ] PageSize limited (1-100 max)
- [ ] Search query length limited (100 chars max)
- [ ] SortBy length limited (50 chars max)
- [ ] SortDirection length limited (4 chars max)
- [ ] Invalid values rejected with 400
- [ ] Validation errors returned to client

### Logging & Monitoring
- [ ] No JWT tokens logged
- [ ] No encrypted sensitive data logged
- [ ] No complete request bodies logged
- [ ] User context (ID, role) included in logs
- [ ] Security events logged (401, 403)
- [ ] Structured logging for filtering/alerting

---

## PERFORMANCE CHECKLIST

### Query Optimization
- [ ] Pagination applied (max 100 items/page)
- [ ] Sorting at database level (not in-memory)
- [ ] Filtering applied as SQL WHERE clause
- [ ] Includes prevent N+1 queries
- [ ] AsNoTracking() for read-only operations
- [ ] Single database query for list operation

### Database Indexing
- [ ] Index on BookingDate
- [ ] Index on Status
- [ ] Index on PatientId
- [ ] Index on ProviderId
- [ ] Index on BookingNumber (searchable field)
- [ ] Composite indexes if needed

### Memory Management
- [ ] Pagination limits result set size
- [ ] No unnecessary includes when not requested
- [ ] DTOs only include necessary fields
- [ ] Streaming results if list is large
- [ ] Connection pooling enabled

### Caching (Optional)
- [ ] Identify frequently accessed queries
- [ ] Cache results with TTL (10-60 minutes)
- [ ] Invalidate cache on data changes
- [ ] Cache key includes pagination/filters
- [ ] Monitor cache hit rate

### Async/Non-Blocking
- [ ] All I/O operations async (database, files, HTTP)
- [ ] No blocking calls (`.Result`, `.Wait()`)
- [ ] CancellationToken support throughout
- [ ] Proper exception handling for cancellation

---

## COMMON PITFALLS TO AVOID

### ❌ SECURITY PITFALLS

**1. Forgetting Role-Based Filtering**
```csharp
// ❌ BAD: Returns all if patient can see others' appointments
var appointments = await _repo.GetAppointments(request);

// ✅ GOOD: Apply security filters based on role
var (patientId, providerId) = ApplySecurityFilters(request, userId, role);
var spec = new GetAppointmentsSpecification(patientId, providerId, ...);
```

**2. Client-Side Security**
```csharp
// ❌ BAD: Security enforced in JavaScript (client can disable it!)
if (userRole === 'patient') {
    // Only show own appointments
}

// ✅ GOOD: Security enforced in backend (server always checks)
// Service.cs
var (patientId, providerId) = ApplySecurityFilters(...);
```

**3. Logging Sensitive Data**
```csharp
// ❌ BAD: Logs user IDs and encrypted data
_logger.LogInformation($"User {userId} requested {request}");

// ✅ GOOD: Logs safe context
_logger.LogInformation("Appointments retrieved for user {UserId}: {Count} items",
    userId, appointments.Count);
```

**4. Not Validating Input**
```csharp
// ❌ BAD: No validation, could fetch 1 million rows
var appointments = _context.Bookings.ToList();

// ✅ GOOD: Validate with ranges
[Range(1, 100)]
public int PageSize { get; set; } = 20;
```

### ❌ PERFORMANCE PITFALLS

**5. N+1 Query Problem**
```csharp
// ❌ BAD: N+1 queries (1 for bookings, N for each patient)
var bookings = _context.Bookings.ToList();
foreach (var booking in bookings)
{
    var patient = _context.Patients.Find(booking.PatientId);  // N+1!
}

// ✅ GOOD: Single query with eager loading
var bookings = _context.Bookings
    .Include(b => b.Patient)
    .Include(b => b.Provider)
    .ToList();
```

**6. Entity Tracking for Read-Only**
```csharp
// ❌ BAD: Unnecessary tracking overhead
var bookings = _context.Bookings.Where(...).ToList();

// ✅ GOOD: Disable tracking for read-only
var bookings = _context.Bookings
    .AsNoTracking()
    .Where(...)
    .ToList();
```

**7. In-Memory Sorting**
```csharp
// ❌ BAD: Sorts in memory after fetching all records
var appointments = _context.Bookings
    .ToList()  // Fetches ALL records
    .OrderBy(x => x.BookingDate)  // Sorts in memory
    .Skip(skip)
    .Take(take);

// ✅ GOOD: Sort at database level before pagination
var appointments = _context.Bookings
    .OrderBy(x => x.BookingDate)  // SQL ORDER BY
    .Skip(skip)
    .Take(take)
    .ToListAsync();  // Fetches only needed records
```

**8. Missing Pagination**
```csharp
// ❌ BAD: Could return millions of records
var allAppointments = await _context.Bookings.ToListAsync();

// ✅ GOOD: Always paginate
var appointments = await _context.Bookings
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

**9. Blocking Calls**
```csharp
// ❌ BAD: Blocks thread pool thread
var result = _repo.GetAppointmentsAsync().Result;

// ✅ GOOD: Async all the way
var result = await _repo.GetAppointmentsAsync();
```

**10. No Database Indexes**
```sql
-- ❌ BAD: Slow queries on large tables
SELECT * FROM Bookings WHERE BookingDate > @date;

-- ✅ GOOD: Indexed columns for fast queries
CREATE INDEX IX_Bookings_BookingDate ON Bookings(BookingDate);
```

### ❌ CODE QUALITY PITFALLS

**11. Tight Coupling**
```csharp
// ❌ BAD: Controller directly uses DbContext
public class AppointmentsController
{
    public AppointmentsController(SanadDbContext context)
    {
        _context = context;
        // Directly queries database
    }
}

// ✅ GOOD: Dependency injection with interfaces
public class AppointmentsController
{
    public AppointmentsController(IAppointmentService service)
    {
        _service = service;
        // Depends on abstraction
    }
}
```

**12. No Error Handling**
```csharp
// ❌ BAD: Unhandled exceptions crash endpoint
public async Task<ActionResult> GetAppointments(GetAppointmentsRequest request)
{
    var result = await _service.GetAppointmentsAsync(request);
    return Ok(result);
}

// ✅ GOOD: Proper error handling and logging
public async Task<ActionResult> GetAppointments(GetAppointmentsRequest request)
{
    try
    {
        var result = await _service.GetAppointmentsAsync(request);
        return Ok(ApiResponse<...>.SuccessResponse(result));
    }
    catch (UnauthorizedAccessException ex)
    {
        _logger.LogWarning(ex, "Unauthorized access");
        return Forbid();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error");
        return StatusCode(500, ApiResponse<...>.ErrorResponse("Error"));
    }
}
```

**13. No Logging**
```csharp
// ❌ BAD: No visibility into what's happening
var result = await _repo.GetAppointmentsAsync(spec);

// ✅ GOOD: Structured logging at key points
_logger.LogInformation("Getting appointments for user {UserId}", userId);
var result = await _repo.GetAppointmentsAsync(spec);
_logger.LogInformation("Retrieved {Count} appointments", result.Count);
```

**14. Magic Numbers and Strings**
```csharp
// ❌ BAD: What does 100 mean? What is "startDate"?
[Range(1, 100)]
public int PageSize { get; set; }
public string SortBy { get; set; } = "startDate";

// ✅ GOOD: Constants with clear meaning
public const int MAX_PAGE_SIZE = 100;
public const string DEFAULT_SORT = "startDate";

[Range(1, MAX_PAGE_SIZE)]
public int PageSize { get; set; }
public string SortBy { get; set; } = DEFAULT_SORT;
```

**15. No XML Documentation**
```csharp
// ❌ BAD: Unclear what parameters and return values are
public async Task<PaginatedAppointmentsResponse> GetAppointmentsAsync(
    GetAppointmentsRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)

// ✅ GOOD: Clear documentation with examples
/// <summary>
/// Get paginated appointments with filtering, sorting, and authorization checks.
/// </summary>
/// <param name="request">Query parameters with filters and pagination</param>
/// <param name="currentUserId">ID of the authenticated user</param>
/// <param name="userRole">User's role (patient, provider, admin)</param>
/// <param name="cancellationToken">Cancellation token</param>
/// <returns>Paginated list of appointments</returns>
public async Task<PaginatedAppointmentsResponse> GetAppointmentsAsync(
    GetAppointmentsRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
```

---

## VALIDATION RULES SUMMARY

| Field | Type | Validation | Purpose |
|-------|------|-----------|---------|
| Page | int | Range: 1+ | Pagination |
| PageSize | int | Range: 1-100 | Prevent abuse |
| Status | string | Nullable | Filter |
| StartDateFrom | DateTime? | Nullable | Date range |
| StartDateTo | DateTime? | Nullable | Date range |
| PatientId | GUID? | Nullable, admin only | Filter |
| ProviderId | GUID? | Nullable, admin only | Filter |
| ServiceId | GUID? | Nullable | Filter |
| SearchQuery | string | Max 100 chars | Search |
| SortBy | string | Max 50 chars | Sort field |
| SortDirection | string | Max 4 chars | asc/desc |
| IncludeRelated | bool | - | Related data |

---

## HTTP STATUS CODES

| Code | Scenario | Response |
|------|----------|----------|
| 200 | Success | Full data with pagination |
| 400 | Invalid request | Error message with field details |
| 401 | Missing/invalid token | "Invalid authentication token" |
| 403 | Insufficient permissions | "Forbidden" |
| 500 | Server error | Generic error message |

---

## SUMMARY

This implementation provides:

✅ **Security**: Authentication, authorization, encryption, input validation  
✅ **Performance**: Pagination, eager loading, indexing, async operations  
✅ **Maintainability**: Clean architecture, design patterns, documentation  
✅ **Reliability**: Error handling, logging, testing  
✅ **Scalability**: Async, efficient queries, resource limits  

Follow this checklist and avoid common pitfalls to build robust, secure, and performant endpoints.
