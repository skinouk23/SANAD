# Get Appointments - Visual Quick Reference Guide

A visual reference guide for the complete implementation.

---

## 🏗️ ARCHITECTURE VISUALIZATION

### Complete Request Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ CLIENT REQUEST                                                   │
│ GET /api/appointments?page=1&pageSize=20&status=confirmed      │
│ Authorization: Bearer {JWT_TOKEN}                               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ CONTROLLER LAYER (AppointmentsController)                        │
├──────────────────────────────────────────────────────────────────┤
│ ✅ Extract JWT token                                            │
│ ✅ Get user ID from claims (NameIdentifier)                    │
│ ✅ Get role from claims (Role)                                 │
│ ✅ Validate user ID is GUID                                    │
│ ✅ Validate role exists                                        │
│ ✅ Validate ModelState                                         │
│ ✅ Call service                                                │
│ ✅ Handle errors (401, 403, 400, 500)                         │
│ ✅ Return ApiResponse wrapper                                  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ SERVICE LAYER (AppointmentService)                               │
├──────────────────────────────────────────────────────────────────┤
│ 1. Apply Security Filters:                                      │
│    • Patient: (patientId=userId, providerId=null)             │
│    • Provider: (patientId=null, providerId=userId)            │
│    • Admin: (patientId=request.PatientId,                     │
│             providerId=request.ProviderId)                     │
│                                                                │
│ 2. Build Specification:                                        │
│    • Filters, Sorting, Pagination, Includes                  │
│                                                                │
│ 3. Call Repository                                            │
│                                                                │
│ 4. Map Entities → DTOs (AutoMapper)                           │
│                                                                │
│ 5. Return PaginatedAppointmentsResponse                       │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ SPECIFICATION LAYER (GetAppointmentsSpecification)               │
├──────────────────────────────────────────────────────────────────┤
│ Build Query Criteria:                                           │
│ • WHERE: status, date range, patient, provider, service      │
│ • SEARCH: booking number, names                              │
│ • INCLUDE: Patient, Provider, Service (eager loading)        │
│ • ORDER BY: Sort field, direction                            │
│ • SKIP/TAKE: Pagination                                      │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ REPOSITORY LAYER (AppointmentRepository)                         │
├──────────────────────────────────────────────────────────────────┤
│ 1. Start Query: AsNoTracking()                                  │
│ 2. Apply Criteria (WHERE)                                     │
│ 3. Add Includes (eager loading)                               │
│ 4. Count Total (for pagination)                               │
│ 5. Apply Sorting                                              │
│ 6. Apply Pagination (SKIP/TAKE)                               │
│ 7. Execute: ToListAsync()                                     │
│ 8. Return (Items, TotalCount)                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ DATABASE                                                         │
│ ✅ Single optimized SQL query (no N+1)                         │
│ ✅ Uses indexes for fast filtering                             │
│ ✅ Database-level sorting and paging                           │
│ ✅ Returns only needed records                                 │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ RESPONSE FORMATTING                                              │
│ ✅ Map entities to DTOs                                        │
│ ✅ Wrap in ApiResponse<T>                                      │
│ ✅ Include pagination metadata                                 │
│ ✅ Return HTTP 200 OK                                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│ CLIENT RESPONSE                                                  │
│ {                                                               │
│   "success": true,                                             │
│   "message": "Retrieved 20 appointments (Page 1 of 3)",       │
│   "data": {                                                   │
│     "items": [...],                                           │
│     "totalCount": 50,                                         │
│     "pageNumber": 1,                                          │
│     "pageSize": 20,                                           │
│     "totalPages": 3,                                          │
│     "hasNextPage": true,                                      │
│     "hasPreviousPage": false                                  │
│   }                                                           │
│ }                                                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔒 SECURITY MATRIX

### Role-Based Access Control

```
┌────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
│ Role       │ Patient              │ Provider             │ Admin                │
├────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Can See    │ Own appointments     │ Own appointments     │ All appointments     │
├────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Filter     │ patientId=userId     │ providerId=userId    │ Custom filters       │
│ Applied    │ providerId=null      │ patientId=null       │ from request         │
├────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Can Access │ Via JWT Claims       │ Via JWT Claims       │ Via JWT Claims       │
├────────────┼──────────────────────┼──────────────────────┼──────────────────────┤
│ Response   │ 200 OK               │ 200 OK               │ 200 OK               │
│ if Denied  │ 403 Forbidden        │ 403 Forbidden        │ 403 Forbidden        │
└────────────┴──────────────────────┴──────────────────────┴──────────────────────┘
```

### Data Protection

```
ENCRYPTED FIELDS (in database):
┌─────────────────────────────────────────────────────────────┐
│ Field Name              │ Encryption Type        │ Searchable│
├─────────────────────────────────────────────────────────────┤
│ BookingNumber           │ SearchableEncrypted    │ ✅ Yes   │
│ PatientId               │ Encrypted              │ ❌ No    │
│ ProviderId              │ Encrypted              │ ❌ No    │
│ ServiceId               │ Encrypted              │ ❌ No    │
│ PatientName (snapshot)  │ Encrypted              │ ❌ No    │
│ PatientPhone (snapshot) │ Encrypted              │ ❌ No    │
│ PatientEmail (snapshot) │ Encrypted              │ ❌ No    │
│ Address fields          │ Encrypted              │ ❌ No    │
│ Medical notes           │ Encrypted              │ ❌ No    │
│ Symptoms                │ Encrypted              │ ❌ No    │
└─────────────────────────────────────────────────────────────┘

KEY: ✅ = Searchable | ❌ = Not Searchable
HANDLED BY: Entity Framework Core encryption features
DECRYPTION: Automatic when querying/returning
```

### Input Validation Rules

```
REQUEST VALIDATION:
┌──────────────────┬───────────┬──────────────┬──────────────────────────────┐
│ Field            │ Type      │ Validation   │ Purpose                      │
├──────────────────┼───────────┼──────────────┼──────────────────────────────┤
│ page             │ int       │ Range: 1+    │ Prevents negative pages      │
│ pageSize         │ int       │ Range: 1-100 │ Prevents abuse/large queries │
│ status           │ string?   │ Nullable     │ Optional filter              │
│ startDateFrom    │ DateTime? │ Nullable     │ Optional filter              │
│ startDateTo      │ DateTime? │ Nullable     │ Optional filter              │
│ patientId        │ GUID?     │ Nullable     │ Admin only (enforced)        │
│ providerId       │ GUID?     │ Nullable     │ Admin only (enforced)        │
│ serviceId        │ GUID?     │ Nullable     │ Optional filter              │
│ searchQuery      │ string?   │ Max 100 chars│ Prevents abuse               │
│ sortBy           │ string    │ Max 50 chars │ Prevents injection           │
│ sortDirection    │ string    │ Max 4 chars  │ Prevents injection           │
│ includeRelated   │ bool      │ No limit     │ Optional related data        │
└──────────────────┴───────────┴──────────────┴──────────────────────────────┘
```

---

## ⚡ PERFORMANCE OPTIMIZATION SUMMARY

### Query Optimization Strategy

```
START POINT:
    ▼
┌─────────────────────────────────┐
│ Bookings.AsNoTracking()         │ ← Disable tracking for read-only
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ .Where(specification.Criteria)  │ ← Apply WHERE (compiled to SQL)
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ .Include(related entities)      │ ← Eager load (N+1 prevention)
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ CountAsync()                    │ ← Get total for pagination
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ .OrderBy(field)                 │ ← Sort at database (not memory)
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ .Skip(skip).Take(take)          │ ← Paginate at database level
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ .ToListAsync()                  │ ← SINGLE query execution
└────────────┬────────────────────┘
             ▼
        RESULT: 
        • 1 database query
        • Only needed records returned
        • Fast execution
        • Low memory usage
```

### Database Index Strategy

```
PRIMARY INDEXES (required):
┌──────────────────────────────────────────────────────┐
│ CREATE INDEX IX_Bookings_BookingDate                │
│ ON dbo.Bookings(BookingDate) ← For date filtering  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CREATE INDEX IX_Bookings_Status                     │
│ ON dbo.Bookings(Status) ← For status filtering     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CREATE INDEX IX_Bookings_PatientId                  │
│ ON dbo.Bookings(PatientId) ← For patient filtering │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CREATE INDEX IX_Bookings_ProviderId                 │
│ ON dbo.Bookings(ProviderId) ← For provider filter  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ CREATE INDEX IX_Bookings_BookingNumber              │
│ ON dbo.Bookings(BookingNumber) ← For searching     │
└──────────────────────────────────────────────────────┘
```

### Performance Metrics

```
EXPECTED PERFORMANCE (with proper indexing):

Query Time:
  • Simple query (no filters): ~50-100ms
  • Filtered query: ~100-200ms
  • Complex filters: ~200-500ms
  • ✅ Acceptable: < 500ms

Result Set:
  • Page size: 20 items (default)
  • Maximum: 100 items per page
  • Prevents memory bloat

Database Queries:
  • ✅ 1 query (not N+1)
  • Includes all needed data
  • Single materialization point

Memory Usage:
  • AsNoTracking: -50% memory vs tracking
  • Pagination: Limits result set size
  • DTOs: Only needed fields
```

---

## 📊 DATA FLOW DIAGRAM

### GetAppointments Data Transformation

```
DATABASE:
┌──────────────────────────────┐
│ Booking Entity               │
│ • Id                         │
│ • BookingNumber (encrypted)  │
│ • PatientId (encrypted)      │
│ • ProviderId (encrypted)     │
│ • ServiceId (encrypted)      │
│ • BookingDate                │
│ • StartTime                  │
│ • Status                     │
│ • PatientName (encrypted)    │
│ • ProviderName (encrypted)   │
│ • ServiceName (encrypted)    │
│ • + Relations                │
└────────────┬─────────────────┘
             │
             ▼ Repository.GetAppointmentsAsync()
             │ • Decrypt fields automatically (EF Core)
             │ • Include related entities
             │ • Apply filters/sort/pagination
             │
┌──────────────────────────────┐
│ Decrypted Booking Object     │
│ (with Patient, Provider,     │
│  Service relations)          │
└────────────┬─────────────────┘
             │
             ▼ AutoMapper.Map<AppointmentResponse>()
             │ • Transform entity to DTO
             │ • Map nested objects
             │ • Select only needed fields
             │
┌──────────────────────────────┐
│ AppointmentResponse DTO      │
│ • Id                         │
│ • BookingNumber              │
│ • PatientId                  │
│ • ProviderId                 │
│ • ServiceId                  │
│ • BookingDate                │
│ • StartTime                  │
│ • Status                     │
│ • PatientName                │
│ • ProviderName               │
│ • ServiceName                │
│ • Patient (nested)           │
│ • Provider (nested)          │
│ • Service (nested)           │
└────────────┬─────────────────┘
             │
             ▼ ApiResponse<PaginatedAppointmentsResponse>
             │ • Wrap in standardized response
             │ • Add pagination metadata
             │ • Add success/message fields
             │
┌──────────────────────────────┐
│ API Response JSON            │
│ {                            │
│   "success": true,           │
│   "message": "...",          │
│   "data": {                  │
│     "items": [...],          │
│     "totalCount": 50,        │
│     "pageNumber": 1,         │
│     "pageSize": 20,          │
│     "totalPages": 3,         │
│     "hasNextPage": true,     │
│     "hasPreviousPage": false │
│   }                          │
│ }                            │
└──────────────────────────────┘
             │
             ▼ HTTP Response (200 OK)
             │
        CLIENT RECEIVES JSON
```

---

## 🎯 ERROR HANDLING MATRIX

### HTTP Status Codes & Scenarios

```
┌─────────┬──────────────────────────────────────────────────────────────┐
│ Code    │ Scenario                                                     │
├─────────┼──────────────────────────────────────────────────────────────┤
│ 200 OK  │ Success! Retrieved appointments with pagination data         │
│         │ Response includes items and metadata                         │
├─────────┼──────────────────────────────────────────────────────────────┤
│ 400     │ Bad Request - Validation failed                              │
│ Bad     │ • PageSize > 100                                            │
│ Request │ • Invalid date format                                       │
│         │ • Search query > 100 chars                                  │
│         │ Response includes field-specific errors                     │
├─────────┼──────────────────────────────────────────────────────────────┤
│ 401     │ Unauthorized - Authentication failed                         │
│ Unauth  │ • Missing JWT token                                         │
│         │ • Invalid/expired token                                     │
│         │ • Token claims missing (user ID or role)                    │
│         │ Response: "Invalid authentication token"                    │
├─────────┼──────────────────────────────────────────────────────────────┤
│ 403     │ Forbidden - Authorization failed                             │
│ Forbid  │ • Patient trying to see another patient's appointments      │
│         │ • Provider trying to see another provider's appointments    │
│         │ • Insufficient role permissions                             │
│         │ Response: "Forbidden"                                       │
├─────────┼──────────────────────────────────────────────────────────────┤
│ 500     │ Internal Server Error - Unexpected exception                │
│ Error   │ • Database connection error                                 │
│         │ • Unmapped exception                                        │
│         │ • Processing error                                          │
│         │ Response: "An error occurred while retrieving appointments" │
└─────────┴──────────────────────────────────────────────────────────────┘
```

---

## 📝 LOGGING STRATEGY

### Log Levels & Content

```
INFO LEVEL (Successful operations):
┌────────────────────────────────────────────────┐
│ • Method entry: parameters with context       │
│ • Successful operations: counts and results   │
│ Example: "Retrieved 20 appointments for user  │
│          {UserId}: {Count} items, total: {X}" │
└────────────────────────────────────────────────┘

WARNING LEVEL (Validation/Security issues):
┌────────────────────────────────────────────────┐
│ • Invalid input: validation failures           │
│ • Authorization issues: denied access          │
│ • Unexpected but handled conditions            │
│ Example: "Invalid request model for user      │
│          {UserId}: {Errors}"                  │
└────────────────────────────────────────────────┘

ERROR LEVEL (Exceptions):
┌────────────────────────────────────────────────┐
│ • Unhandled exceptions: full stack trace       │
│ • Database errors: connection/query issues     │
│ • Critical business logic failures             │
│ Example: "Error retrieving appointments"      │
└────────────────────────────────────────────────┘

NEVER LOG:
┌────────────────────────────────────────────────┐
│ ❌ JWT tokens                                 │
│ ❌ Encrypted sensitive data                   │
│ ❌ Complete request bodies                    │
│ ❌ Passwords or secrets                       │
│ ❌ Personal identification numbers             │
└────────────────────────────────────────────────┘
```

---

## 🔄 DEPENDENCY INJECTION MAP

### Object Relationships

```
             ┌──────────────────────┐
             │ AppointmentsController
             │ • IAppointmentService
             │ • ILogger             │
             └───────┬────────────────┘
                     │
                     ▼
       ┌─────────────────────────────┐
       │ IAppointmentService         │
       │ (interface)                 │
       └─────────┬───────────────────┘
                 │
                 ▼
       ┌─────────────────────────────┐
       │ AppointmentService          │
       │ • IAppointmentRepository    │
       │ • IMapper                   │
       │ • ILogger                   │
       └─────────┬───────────────────┘
                 │
                 ▼
       ┌─────────────────────────────┐
       │ IAppointmentRepository      │
       │ (interface)                 │
       └─────────┬───────────────────┘
                 │
                 ▼
       ┌─────────────────────────────┐
       │ AppointmentRepository       │
       │ • SanadDbContext            │
       │ • ILogger                   │
       └─────────┬───────────────────┘
                 │
                 ▼
       ┌─────────────────────────────┐
       │ SanadDbContext              │
       │ (Entity Framework DbContext)│
       │                             │
       │ .Bookings (DbSet<Booking>)  │
       └─────────────────────────────┘

Registration in Program.cs:
───────────────────────────────────
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddDbContext<SanadDbContext>(options => ...);
builder.Services.AddAutoMapper(typeof(Program).Assembly);
```

---

## ✅ IMPLEMENTATION SUMMARY

### What's Included

```
✅ CONTROLLER LAYER
   • HTTP routing and binding
   • JWT claim extraction
   • Request validation
   • Response wrapping
   • Error handling (401, 403, 400, 500)

✅ SERVICE LAYER
   • Business logic
   • Role-based security
   • Specification building
   • DTO mapping
   • Transaction boundaries

✅ REPOSITORY LAYER
   • Data access abstraction
   • Query optimization
   • Specification integration
   • Performance considerations

✅ SPECIFICATION PATTERN
   • Filter composition
   • Eager loading
   • Sorting and pagination
   • Predicate builder helper

✅ DATA TRANSFER OBJECTS
   • Request validation
   • Response formatting
   • Nested objects
   • Pagination metadata

✅ SECURITY
   • JWT authentication
   • Role-based authorization
   • Encrypted fields
   • Input validation
   • Audit logging

✅ PERFORMANCE
   • Pagination (20-100 items)
   • Single query optimization
   • Eager loading
   • Database indexing
   • Async operations

✅ DOCUMENTATION
   • XML code comments
   • Swagger/OpenAPI specs
   • Implementation guides
   • Architecture diagrams
   • Code examples
```

---

## 🚀 Quick Start Checklist

```
Phase 1: Setup
  □ Create folder structure
  □ Create entity and DTOs
  □ Configure DbContext
  □ Run migrations

Phase 2: Implement Repository
  □ Create IAppointmentRepository
  □ Implement AppointmentRepository
  □ Create GetAppointmentsSpecification
  □ Test with sample data

Phase 3: Implement Service
  □ Create IAppointmentService
  □ Implement AppointmentService
  □ Add security filters
  □ Add AutoMapper profiles

Phase 4: Implement Controller
  □ Create AppointmentsController
  □ Add GetAppointments endpoint
  □ Add error handling
  □ Add documentation

Phase 5: Configure DI
  □ Register repository
  □ Register service
  □ Register AutoMapper
  □ Configure authentication

Phase 6: Test & Deploy
  □ Unit tests
  □ Integration tests
  □ Load testing
  □ Deploy to production
```

---

**Visual Quick Reference - Use this for at-a-glance understanding of the implementation!**
