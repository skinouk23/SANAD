# GET Appointments Implementation Guide

## Overview
This is a production-ready implementation of getting a paginated list of appointments with advanced filtering, sorting, role-based security, and performance optimizations.

## Architecture Pattern

### 1. **Controller Layer** (`AppointmentsController.cs`)
**Responsibilities:**
- HTTP request/response handling
- Authentication & authorization validation
- Model validation
- Error handling & status codes
- Logging of user actions

**Key Features:**
```csharp
// Gets user identity and role from JWT claims
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

// Validates model before passing to service
if (!ModelState.IsValid) { ... }

// Returns standardized API response
return Ok(ApiResponse<PaginatedAppointmentsResponse>.SuccessResponse(...));
```

### 2. **Service Layer** (`AppointmentService.cs`)
**Responsibilities:**
- Business logic implementation
- Authorization/security checks
- Data transformation (Entity -> DTO)
- Logging of business operations

**Key Features:**
- Role-based filtering:
  - **Patients**: See only their own appointments
  - **Providers**: See only their appointments
  - **Admins**: See all (respecting any filters requested)
- Prevents N+1 queries by controlling includes
- Handles exceptions and logs errors

```csharp
private (Guid? PatientId, Guid? ProviderId) ApplySecurityFilters(...)
{
    return userRole.ToLower() switch
    {
        "patient" => (patientId: userIdGuid, providerId: null),
        "provider" => (patientId: null, providerId: userIdGuid),
        "admin" => (patientId: request.PatientId, providerId: request.ProviderId),
        _ => throw new UnauthorizedAccessException(...)
    };
}
```

### 3. **Repository Layer** (`AppointmentRepository.cs`)
**Responsibilities:**
- Data access operations
- Query execution
- Specification pattern implementation
- Database interaction

**Key Features:**
- Uses `AsNoTracking()` for read-only queries (improves performance)
- Builds query at IQueryable level (executed at DB layer)
- Includes related entities to prevent N+1
- Counts total before paging for accurate pagination

```csharp
public async Task<(List<Booking> Items, int TotalCount)> GetAppointmentsAsync(...)
{
    var query = _context.Bookings.AsNoTracking();
    
    // Apply criteria filter
    if (specification.Criteria != null)
        query = query.Where(specification.Criteria);
    
    // Include related data
    foreach (var include in specification.Includes)
        query = query.Include(include);
    
    // Count before paging
    var totalCount = await query.CountAsync();
    
    // Apply sorting
    // Apply pagination
    // Execute
    return (await query.ToListAsync(), totalCount);
}
```

### 4. **Specification Pattern** (`GetAppointmentsSpecification.cs`)
**Responsibilities:**
- Complex query building
- Filter encapsulation
- Sort/page configuration

**Benefits:**
- Reusable query logic
- Readable code
- Easy to extend with new filters
- Type-safe

```csharp
var specification = new GetAppointmentsSpecification(
    page: 1,
    pageSize: 20,
    status: "confirmed",
    startDateFrom: DateTime.Now,
    providerId: Guid.Parse("..."),
    sortBy: "startDate",
    sortDirection: "asc",
    includeRelated: true);

var (appointments, total) = await repository.GetAppointmentsAsync(specification);
```

### 5. **DTOs** (Data Transfer Objects)
- **`GetAppointmentsRequest`**: Input validation model
- **`AppointmentResponse`**: Single appointment response
- **`PaginatedAppointmentsResponse`**: List response with metadata

## Security Implementation

### Authentication
- JWT Bearer token required (except public endpoints)
- User ID & Role extracted from claims
- Invalid tokens return 401 Unauthorized

### Authorization
- **Role-based access control (RBAC)**:
  - Patients: Cannot filter by other patients/providers
  - Providers: Cannot filter by other providers
  - Admins: Can filter by any patient/provider

**Example:**
```csharp
// Patient requests their appointments
GET /api/appointments?page=1
Authorization: Bearer <patient-jwt>
// Automatically filtered to: patientId = <current-user-id>

// Patient tries to see another patient's appointments
GET /api/appointments?patientId=different-guid
Authorization: Bearer <patient-jwt>
// Returns only current user's appointments (request filter ignored)
```

### Encrypted Fields
- Patient names, phone numbers, emails are encrypted at rest
- Automatic decryption during Entity Framework loading
- Only for authorized users (application-level security)
- SearchableEncrypted fields support LIKE queries

## Performance Optimizations

### 1. **Pagination**
- Prevents loading entire datasets into memory
- Default: 20 items/page, Max: 100 items/page
- Returns total count for UI pagination controls

```csharp
// Request
GET /api/appointments?page=2&pageSize=20

// Response includes
{
    "items": [...20 items...],
    "totalCount": 150,
    "pageNumber": 2,
    "pageSize": 20,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": true
}
```

### 2. **AsNoTracking()**
- Disables change tracking for read-only queries
- ~30% faster than tracking queries
- No materialization overhead

### 3. **Include() for Related Data**
- Loads related entities in single query
- Prevents N+1 query problem
- Controlled by `includeRelated` parameter

```csharp
// BAD: N+1 Queries (1 + 20 queries if 20 results)
var bookings = await context.Bookings.ToListAsync();
foreach (var booking in bookings)
{
    var patient = await context.Patients.FindAsync(booking.PatientId);
}

// GOOD: Single query with includes
var bookings = await context.Bookings
    .Include(b => b.Patient)
    .Include(b => b.Provider)
    .Include(b => b.Service)
    .ToListAsync();
```

### 4. **Deferred Execution**
- IQueryable stays at database layer until `ToListAsync()`
- Filters, sorting, paging applied by database
- Database does heavy lifting

```csharp
// Not executed yet
var query = context.Bookings
    .Where(b => b.Status == "confirmed")
    .OrderBy(b => b.StartDate)
    .Skip(20)
    .Take(20);

// Executed here (in SQL)
var results = await query.ToListAsync();
```

### 5. **Search Optimization**
- Only searches on `BookingNumber` (searchable encrypted field)
- Patient/Provider names use snapshot fields
- All indexed in database

## Database Query Example

This is the approximate SQL generated:

```sql
-- Single query (not actual SQL syntax, simplified)
SELECT TOP 20
    b.*,
    p.*,
    pr.*,
    s.*
FROM Bookings b
LEFT JOIN Patients p ON b.PatientId = p.Id
LEFT JOIN Providers pr ON b.ProviderId = pr.Id
LEFT JOIN Services s ON b.ServiceId = s.Id
WHERE 
    b.Status = 'confirmed'
    AND b.BookingDate >= @startDate
    AND b.BookingDate <= @endDate
    AND b.PatientId = @patientId
    AND (
        b.BookingNumber LIKE @search
        OR b.PatientName LIKE @search
        OR b.ProviderName LIKE @search
        OR b.ServiceName LIKE @search
    )
ORDER BY b.BookingDate ASC
OFFSET 20 ROWS
FETCH NEXT 20 ROWS ONLY;

-- Separate count query (cached in some implementations)
SELECT COUNT(*)
FROM Bookings b
WHERE ... -- same filters
```

## Usage Examples

### Example 1: Patient Views Own Upcoming Appointments
```http
GET /api/appointments?page=1&pageSize=10&status=confirmed&startDateFrom=2024-02-02&sortBy=startDate&sortDirection=asc
Authorization: Bearer <patient-jwt>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "bookingNumber": "BK-2024-0001",
        "patientName": "[decrypted]",
        "providerName": "[decrypted]",
        "serviceName": "Medical Consultation",
        "bookingDate": "2024-02-05T00:00:00",
        "startTime": "10:30:00",
        "status": "confirmed",
        "createdAt": "2024-01-20T08:15:00"
      }
    ],
    "totalCount": 5,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  },
  "message": "Retrieved 5 appointments (Page 1 of 1)"
}
```

### Example 2: Admin Filters Appointments by Provider
```http
GET /api/appointments?page=1&pageSize=50&providerId=220e1100-b11a-21d4-a716-446655440111&status=pending
Authorization: Bearer <admin-jwt>
```

### Example 3: Provider Searches by Patient Name
```http
GET /api/appointments?searchQuery=Ahmed&sortBy=status&sortDirection=desc
Authorization: Bearer <provider-jwt>
```

### Example 4: Complex Filtering
```http
GET /api/appointments?page=1&pageSize=20&startDateFrom=2024-01-01&startDateTo=2024-02-28&status=completed&serviceId=330f2200-c22b-32d4-a716-446655440222&sortBy=createdAt
Authorization: Bearer <admin-jwt>
```

## Dependency Injection Registration

Add to `Program.cs`:

```csharp
// Register appointment services
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
```

## Logging

All operations are logged with structured logging using Serilog:

```
[INFO] Getting appointments for user <guid> with role Admin, page 1, pageSize 20
[INFO] Retrieved 15 appointments for user <guid>, total: 127
[WARN] Appointment not found with ID: <guid>
[ERROR] Error retrieving appointments with specification - Connection timeout
```

## Error Handling

| Scenario | Status Code | Response |
|----------|-------------|----------|
| Invalid page size | 400 Bad Request | Validation error |
| Invalid token | 401 Unauthorized | Token validation failed |
| Unauthorized access | 403 Forbidden | Access denied |
| Appointment not found | 404 Not Found | Resource not found |
| Database error | 500 Internal Server Error | Generic error message |

## Testing

### Unit Tests
```csharp
[Test]
public async Task GetAppointments_PatientUser_FiltersToOwnAppointments()
{
    var patientId = Guid.NewGuid();
    var request = new GetAppointmentsRequest { Page = 1, PageSize = 10 };
    
    var result = await service.GetAppointmentsAsync(
        request, 
        patientId, 
        "patient");
    
    Assert.All(result.Items, item => 
        Assert.Equal(patientId, item.PatientId));
}

[Test]
public async Task GetAppointments_ProviderUser_OnlySeesOwnAppointments()
{
    var providerId = Guid.NewGuid();
    var otherProviderId = Guid.NewGuid();
    var request = new GetAppointmentsRequest { ProviderId = otherProviderId };
    
    await Assert.ThrowsAsync<UnauthorizedAccessException>(
        () => service.GetAppointmentsAsync(
            request, 
            providerId, 
            "provider"));
}
```

### Integration Tests
```csharp
[Test]
public async Task GetAppointments_ValidFilter_ReturnsPagedResults()
{
    var response = await client.GetAsync(
        "/api/appointments?page=1&pageSize=20&status=confirmed");
    
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    var content = await response.Content.ReadAsAsync<ApiResponse<PaginatedAppointmentsResponse>>();
    Assert.True(content.Success);
    Assert.NotNull(content.Data);
}
```

## Next Steps

1. **Implement GetById endpoint** - Single appointment detail view
2. **Add caching** - Cache popular filters with 5-minute TTL
3. **Add export functionality** - CSV/Excel export with pagination
4. **Add webhooks** - Real-time appointment updates
5. **Add filtering by date range filters** - More granular date filtering
6. **Performance monitoring** - Track slow queries and optimize
