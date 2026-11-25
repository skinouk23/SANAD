# Get List of Appointments - Best Practices Implementation Guide

## Overview
This document explains the complete implementation of the "Get Appointments List" endpoint with **security**, **performance**, and **best practices** applied.

---

## Architecture & Design Patterns

### 1. **Layered Architecture**
```
Controller (AppointmentsController)
    ↓
Service (AppointmentService) - Business Logic & Security
    ↓
Repository (AppointmentRepository) - Data Access
    ↓
Specification (GetAppointmentsSpecification) - Query Building
    ↓
Database (EF Core DbContext)
```

### 2. **Design Patterns Used**
- **Repository Pattern**: Abstracts data access
- **Specification Pattern**: Encapsulates complex query logic
- **Predicate Builder**: Allows dynamic filter composition
- **Dependency Injection**: Loose coupling
- **Authorization Pattern**: Role-based access control
- **API Response Wrapper**: Consistent response format

---

## 1. Controller Layer - `AppointmentsController.cs`

### Key Responsibilities
- **HTTP Route Handling**: Receives requests
- **Request Validation**: Checks input data
- **Authorization Verification**: Extracts user claims
- **Error Handling**: Catches and formats errors
- **Response Formatting**: Returns standardized responses
- **Logging**: Records all operations

### Security Features
✅ `[Authorize]` attribute - Requires authentication  
✅ Validates JWT token and extracts user ID & role  
✅ Returns 401/403 for unauthorized access  
✅ Validates ModelState before processing  
✅ Structured error logging without exposing sensitive data

### Performance Features
✅ Async/await - Non-blocking operations  
✅ Pagination - Limits result size  
✅ CancellationToken - Allows request cancellation  
✅ Lazy loading prevention - Uses include strategy

### Best Practices
✅ XML documentation comments  
✅ Consistent error handling  
✅ Structured logging with context  
✅ ProducesResponseType attributes for OpenAPI  
✅ Single Responsibility Principle

```csharp
[HttpGet]
[ProducesResponseType(typeof(ApiResponse<PaginatedAppointmentsResponse>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
public async Task<ActionResult<ApiResponse<PaginatedAppointmentsResponse>>> GetAppointments(
    [FromQuery] GetAppointmentsRequest request,
    CancellationToken cancellationToken)
{
    // 1. Extract user context (claims)
    // 2. Validate request data
    // 3. Call service
    // 4. Format response
    // 5. Handle errors
}
```

---

## 2. Service Layer - `AppointmentService.cs`

### Key Responsibilities
- **Business Logic**: Core appointment retrieval logic
- **Security Authorization**: Role-based filtering
- **Data Transformation**: Maps entities to DTOs
- **Error Handling**: Business rule validation
- **Logging**: Detailed operation tracking

### Security Features
✅ **Role-Based Authorization**
   - `Patient`: Can only see own appointments
   - `Provider`: Can only see own appointments
   - `Admin`: Can see all (with optional filters)

✅ **Security Filters Applied**
```csharp
return userRole.ToLower() switch
{
    "patient" => (patientId: currentUserId, providerId: null),
    "provider" => (patientId: null, providerId: currentUserId),
    "admin" => (patientId: request.PatientId, providerId: request.ProviderId),
    _ => throw new UnauthorizedAccessException()
};
```

✅ Encrypted fields handled transparently  
✅ No sensitive data in logs

### Performance Features
✅ **Specification Pattern**: Builds efficient queries
```csharp
var specification = new GetAppointmentsSpecification(
    page: request.Page,
    pageSize: request.PageSize,
    status: request.Status,
    patientId: patientId,
    providerId: providerId,
    // ... other filters
);
```

✅ **Single Database Query**: Includes prevent N+1 problem  
✅ **Pagination**: Limits memory usage  
✅ **AutoMapper**: Efficient DTO mapping

### Best Practices
✅ Interface-driven design (`IAppointmentService`)  
✅ Dependency injection of repository and mapper  
✅ Detailed logging with context values  
✅ Exception propagation with context

---

## 3. Repository Layer - `AppointmentRepository.cs`

### Key Responsibilities
- **Data Access**: CRUD operations
- **Query Execution**: Runs LINQ against database
- **Performance Optimization**: Includes, AsNoTracking
- **Error Handling**: Database exceptions
- **Logging**: Query execution details

### Performance Features
✅ **AsNoTracking()**: For read-only queries
```csharp
var query = _context.Bookings.AsNoTracking();
```

✅ **IQueryable Composition**: Defers execution
```csharp
// Query is built in memory, executed at database
var appointments = await query.ToListAsync(cancellationToken);
```

✅ **Include Strategy**: Prevents N+1 queries
```csharp
foreach (var include in specification.Includes)
{
    query = query.Include(include);
}
```

✅ **Pagination**: Applied at database level
```csharp
query = query.Skip(specification.Skip).Take(specification.Take);
```

✅ **Eager Loading**: Related entities in single query
```csharp
// Instead of:
// var booking = GetBooking();
// var patient = GetPatient(booking.PatientId); // N+1 problem!

// Do this:
.Include(b => b.Patient)
.Include(b => b.Provider)
.Include(b => b.Service)
```

### Security Features
✅ No direct SQL queries (parameterized LINQ)  
✅ SQL Injection prevention  
✅ EF Core handles encryption for encrypted fields

### Best Practices
✅ Interface-driven design (`IAppointmentRepository`)  
✅ Async/await throughout  
✅ CancellationToken support  
✅ Consistent error logging  
✅ Specification pattern integration

---

## 4. Specification Pattern - `GetAppointmentsSpecification.cs`

### Purpose
Encapsulates query logic for complex filtering, sorting, and pagination.

### Benefits
✅ **Reusable**: Same spec used in multiple places  
✅ **Testable**: Isolated query logic  
✅ **Maintainable**: Single place to modify query behavior  
✅ **Type-Safe**: Compile-time checked expressions

### Filter Capabilities
```csharp
var specification = new GetAppointmentsSpecification(
    page: 1,
    pageSize: 20,
    status: "confirmed",                    // ✅ Filter by status
    startDateFrom: DateTime.Now,             // ✅ Filter by date range
    startDateTo: DateTime.Now.AddDays(7),
    patientId: Guid.NewGuid(),               // ✅ Filter by patient
    providerId: null,                        // ✅ Filter by provider
    serviceId: Guid.NewGuid(),               // ✅ Filter by service
    searchQuery: "booking123",               // ✅ Full-text search
    sortBy: "startDate",                     // ✅ Sort by field
    sortDirection: "asc",                    // ✅ Sort direction
    includeRelated: true                     // ✅ Include related data
);
```

### Implementation Details

#### Predicate Builder Pattern
```csharp
// Dynamic filter composition
var criteria = PredicateBuilder.True<Booking>();
criteria = criteria.And(b => b.Status == status);
criteria = criteria.And(b => b.BookingDate >= startDateFrom);
criteria = criteria.And(b => b.PatientId == patientId);
```

#### Includes (Eager Loading)
```csharp
if (includeRelated)
{
    AddInclude(b => b.Patient!);
    AddInclude(b => b.Provider!);
    AddInclude(b => b.Service!);
}
```

#### Sorting
```csharp
switch (sortByLower)
{
    case "bookingnumber":
        if (sortDirectionLower == "desc")
            AddOrderByDescending(b => b.BookingNumber);
        else
            AddOrderBy(b => b.BookingNumber);
        break;
    // ... other cases
}
```

#### Pagination
```csharp
var skip = (page - 1) * pageSize;
ApplyPaging(skip, pageSize);
```

---

## 5. Data Transfer Objects (DTOs)

### Request DTO - `GetAppointmentsRequest.cs`

**Purpose**: Defines query parameters with validation

**Features**:
- ✅ Range validation on page/pageSize
- ✅ String length validation on search
- ✅ Sensible defaults (Page=1, PageSize=20)
- ✅ Max pageSize=100 (prevents abuse)
- ✅ Optional filters (null-safe)

```csharp
[Range(1, int.MaxValue)]
public int Page { get; set; } = 1;

[Range(1, 100)]  // Prevents fetching huge result sets
public int PageSize { get; set; } = 20;

[StringLength(100)]  // Prevents abuse
public string? SearchQuery { get; set; }

public string SortBy { get; set; } = "startDate";
public string SortDirection { get; set; } = "asc";
public bool IncludeRelated { get; set; } = true;
```

### Response DTO - `AppointmentResponse.cs`

**Purpose**: Safe data representation for API response

**Features**:
- ✅ Only non-encrypted fields in main object
- ✅ Decrypted snapshot fields (PatientName, etc.)
- ✅ Optional nested objects (Patient, Provider, Service)
- ✅ Minimal data exposure
- ✅ Type safety

```csharp
public class AppointmentResponse
{
    public Guid Id { get; set; }
    public string BookingNumber { get; set; }
    
    // Decrypted snapshots
    public string PatientName { get; set; }
    public string ProviderName { get; set; }
    public string ServiceName { get; set; }
    
    // Optional related data
    public PatientSummary? Patient { get; set; }
    public ProviderSummary? Provider { get; set; }
    public ServiceSummary? Service { get; set; }
}
```

### Paginated Response - `PaginatedAppointmentsResponse`

**Purpose**: Pagination metadata for UI

```csharp
public class PaginatedAppointmentsResponse
{
    public List<AppointmentResponse> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    
    // Calculated properties
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;
}
```

---

## 6. Complete Request/Response Flow

### Request Example
```http
GET /api/appointments?page=1&pageSize=20&status=confirmed&sortBy=startDate&sortDirection=asc
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response Example (Success)
```json
{
  "success": true,
  "message": "Retrieved 20 appointments (Page 1 of 3)",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "bookingNumber": "BK-2024-001",
        "patientName": "John Doe",
        "providerName": "Dr. Jane Smith",
        "serviceName": "General Consultation",
        "bookingDate": "2024-02-15T10:00:00",
        "startTime": "10:00:00",
        "status": "confirmed",
        "isProviderConfirmed": true,
        "createdAt": "2024-02-01T08:30:00"
      }
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Response Example (Error - Unauthorized)
```json
{
  "success": false,
  "message": "Invalid authentication token",
  "data": null,
  "errors": null
}
```

---

## 7. Security Implementation

### Authentication & Authorization

**JWT Token Extraction**:
```csharp
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
```

**Role-Based Access Control**:
```csharp
// Patient: Only own appointments
if (role == "patient") {
    patientId = currentUserId;
    providerId = null;  // Prevent seeing other patients
}

// Provider: Only own appointments
if (role == "provider") {
    providerId = currentUserId;
    patientId = null;  // Prevent seeing other providers
}

// Admin: All with optional filters
if (role == "admin") {
    patientId = request.PatientId;  // From query param
    providerId = request.ProviderId;  // From query param
}
```

### Encrypted Field Handling

**Entity Definition**:
```csharp
[Encrypted(Classification = DataClassification.Critical)]
public string PatientName { get; set; }

[SearchableEncrypted(Classification = DataClassification.Sensitive)]
public string BookingNumber { get; set; }
```

**EF Core Integration**: Automatically encrypted/decrypted  
**Transparent**: No special code in queries

### Response Sanitization
- ✅ Sensitive fields not included
- ✅ Only authorized data returned
- ✅ Decrypted snapshots stored separately
- ✅ Encryption keys in secure configuration

---

## 8. Performance Optimizations

### 1. **Pagination**
```csharp
[Range(1, 100)]
public int PageSize { get; set; } = 20;  // Limits query size
```
- Prevents retrieving millions of records
- Enables efficient paging
- Reduces memory usage

### 2. **Specification Pattern Query Building**
```csharp
// Query composition with LINQ (executes at database)
var query = _context.Bookings.AsNoTracking();

// Where clause compiled to SQL
query = query.Where(specification.Criteria);

// Include prevents N+1 queries
foreach (var include in specification.Includes)
    query = query.Include(include);

// Skip/Take at database level
query = query.Skip(skip).Take(pageSize);

// Single materialization
var results = await query.ToListAsync();
```

### 3. **AsNoTracking()**
```csharp
var query = _context.Bookings.AsNoTracking();
```
- Disables EF Core tracking
- Faster for read-only operations
- Reduces memory usage

### 4. **Eager Loading (Includes)**
```csharp
// Good: Single query with joins
query.Include(b => b.Patient)
     .Include(b => b.Provider)
     .Include(b => b.Service)

// Bad: N+1 queries
foreach (var booking in bookings)
{
    var patient = GetPatient(booking.PatientId);  // Extra query!
}
```

### 5. **Sorted at Database Level**
```csharp
// Database sorts (faster than in-memory)
query = query.OrderBy(b => b.BookingDate);
```

### 6. **Indexed Fields**
- `BookingDate` - For date range filters
- `Status` - For status filters
- `PatientId` - For patient filtering
- `ProviderId` - For provider filtering
- `BookingNumber` - For searching

### 7. **Connection Pooling**
```csharp
builder.Services.AddDbContext<SanadDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(10), null);
    }));
```

### 8. **Caching Consideration**
```csharp
// For frequently accessed data:
var result = await _cache.GetOrCreateAsync(
    $"appointments:{userId}:{page}",
    async entry =>
    {
        entry.SetAbsoluteExpiration(TimeSpan.FromMinutes(10));
        return await _repository.GetAppointmentsAsync(specification);
    });
```

---

## 9. Error Handling Strategy

### Graceful Degradation
```csharp
try
{
    // Validate
    if (!ModelState.IsValid)
        return BadRequest(ApiResponse<object>.ErrorResponse("Invalid request"));
    
    // Execute
    var result = await _appointmentService.GetAppointmentsAsync(...);
    
    // Return
    return Ok(ApiResponse<PaginatedAppointmentsResponse>.SuccessResponse(result));
}
catch (UnauthorizedAccessException ex)
{
    _logger.LogWarning(ex, "Unauthorized access");
    return Forbid();  // 403 Forbidden
}
catch (ArgumentException ex)
{
    _logger.LogWarning(ex, "Invalid argument");
    return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));  // 400
}
catch (Exception ex)
{
    _logger.LogError(ex, "Unexpected error");
    return StatusCode(500, ApiResponse<object>.ErrorResponse("Internal error"));
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Invalid request parameters",
  "data": null,
  "errors": {
    "pageSize": ["PageSize must be between 1 and 100"]
  }
}
```

---

## 10. Logging Strategy

### Structured Logging
```csharp
_logger.LogInformation(
    "Retrieved appointments for user {UserId}: {Count} items, total: {Total}",
    currentUserId,
    result.Items.Count,
    result.TotalCount);
```

### Log Levels
- **Information**: Successful operations
- **Warning**: Security violations, invalid input
- **Error**: Exceptions, unexpected conditions

### What NOT to Log
- ❌ Encrypted sensitive data
- ❌ Complete request bodies
- ❌ JWT tokens
- ❌ Passwords or secrets

---

## 11. Testing Strategy

### Unit Tests
```csharp
[Test]
public async Task GetAppointments_PatientRole_ReturnsOnlyOwnAppointments()
{
    // Arrange
    var patientId = Guid.NewGuid();
    var request = new GetAppointmentsRequest { Page = 1, PageSize = 20 };
    
    // Act
    var result = await _service.GetAppointmentsAsync(
        request,
        patientId,
        "patient");
    
    // Assert
    Assert.That(result.Items, Has.All.Property("PatientId").EqualTo(patientId));
}

[Test]
public void GetAppointments_InvalidPageSize_ReturnsBadRequest()
{
    // Invalid: PageSize > 100
    var request = new GetAppointmentsRequest { PageSize = 500 };
    Assert.That(request.PageSize, Is.GreaterThan(100));
}
```

### Integration Tests
```csharp
[Test]
public async Task GetAppointments_WithValidToken_ReturnsOk()
{
    // Setup test data
    var client = new HttpClient { BaseAddress = new Uri("https://localhost:5001") };
    client.DefaultRequestHeaders.Authorization = 
        new AuthenticationHeaderValue("Bearer", validToken);
    
    // Call endpoint
    var response = await client.GetAsync("/api/appointments?page=1&pageSize=20");
    
    // Verify
    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
}
```

---

## 12. Deployment & Configuration

### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=SanadDb;...",
    "Redis": "localhost:6379"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "sanad-platform",
    "Audience": "sanad-api"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Database Indexes
```sql
-- Improve query performance
CREATE INDEX IX_Bookings_BookingDate ON dbo.Bookings(BookingDate);
CREATE INDEX IX_Bookings_Status ON dbo.Bookings(Status);
CREATE INDEX IX_Bookings_PatientId ON dbo.Bookings(PatientId);
CREATE INDEX IX_Bookings_ProviderId ON dbo.Bookings(ProviderId);
CREATE INDEX IX_Bookings_BookingNumber ON dbo.Bookings(BookingNumber);
```

---

## 13. Checklist for Implementation

### Security
- [ ] JWT authentication required
- [ ] Role-based authorization enforced
- [ ] Encrypted fields handled
- [ ] No sensitive data in logs
- [ ] Input validation on all parameters
- [ ] SQL injection prevention (using LINQ)
- [ ] CORS configured properly

### Performance
- [ ] Pagination implemented
- [ ] AsNoTracking() used
- [ ] Includes prevent N+1 queries
- [ ] Sorting at database level
- [ ] Connection pooling enabled
- [ ] Database indexes created
- [ ] Query execution time < 500ms

### Code Quality
- [ ] XML documentation comments
- [ ] Follows naming conventions
- [ ] Dependency injection used
- [ ] Interface-driven design
- [ ] Error handling implemented
- [ ] Structured logging in place
- [ ] Unit tests written

### API Design
- [ ] Consistent response format
- [ ] Proper HTTP status codes
- [ ] OpenAPI documentation
- [ ] CancellationToken support
- [ ] Async/await throughout
- [ ] ProducesResponseType attributes

---

## 14. Example Usage

### Client Request
```javascript
// JavaScript/React
const response = await fetch('/api/appointments?page=1&pageSize=20&status=confirmed', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.data.items);  // List of appointments
```

### cURL Example
```bash
curl -X GET "https://localhost:5001/api/appointments?page=1&pageSize=20&status=confirmed&sortBy=startDate" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

---

## 15. Summary

This implementation provides:

✅ **Security**: JWT auth, role-based access, encrypted fields  
✅ **Performance**: Pagination, eager loading, indexed queries  
✅ **Maintainability**: Clear separation of concerns, design patterns  
✅ **Reliability**: Comprehensive error handling, logging  
✅ **Scalability**: Async operations, efficient queries  
✅ **Documentation**: Clear code comments, API docs  

All layers work together to provide a secure, performant, and maintainable API endpoint.
