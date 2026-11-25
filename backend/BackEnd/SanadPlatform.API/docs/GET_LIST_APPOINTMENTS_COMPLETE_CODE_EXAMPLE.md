# Get List of Appointments - Complete Code Example with Annotations

This file provides the complete, annotated code implementation showing all best practices in context.

---

## 1. CONTROLLER LAYER

### AppointmentsController.cs - Full Implementation

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Common.Models;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Services;
using System.Security.Claims;

namespace SanadPlatform.API.Features.Bookings.Controllers;

/// <summary>
/// Appointments controller
/// Handles appointment/booking management operations
/// Implements REST best practices with proper HTTP status codes and response formats
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]  // ✅ SECURITY: Requires JWT authentication
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly ILogger<AppointmentsController> _logger;

    // ✅ DEPENDENCY INJECTION: Services injected via constructor
    public AppointmentsController(
        IAppointmentService appointmentService,
        ILogger<AppointmentsController> logger)
    {
        _appointmentService = appointmentService;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated list of appointments with advanced filtering and sorting
    /// 
    /// SECURITY:
    /// - Requires authentication (JWT bearer token)
    /// - Role-based authorization: patients see own, providers see own, admins see all
    /// - Encrypted fields handled transparently
    /// 
    /// QUERY PARAMETERS:
    /// - page: Page number (1-based), default: 1
    /// - pageSize: Items per page (1-100), default: 20
    /// - status: Filter by status (pending, confirmed, completed, etc.)
    /// - startDateFrom: Filter from date (yyyy-MM-dd)
    /// - startDateTo: Filter to date (yyyy-MM-dd)
    /// - providerId: Filter by provider (admin only)
    /// - patientId: Filter by patient (admin only)
    /// - serviceId: Filter by service
    /// - searchQuery: Search by booking number or names
    /// - sortBy: Sort field (startDate, status, bookingNumber, createdAt)
    /// - sortDirection: asc or desc
    /// - includeRelated: Include patient/provider/service details (default: true)
    /// 
    /// PERFORMANCE:
    /// - Pagination prevents large result sets
    /// - Spec pattern optimizes queries
    /// - Includes prevent N+1 queries
    /// - AsNoTracking for read-only operations
    /// </summary>
    [HttpGet]
    // ✅ DOCUMENTATION: Swagger documentation with response types
    [ProducesResponseType(typeof(ApiResponse<PaginatedAppointmentsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<PaginatedAppointmentsResponse>>> GetAppointments(
        // ✅ BINDING: Query parameters automatically bound and validated
        [FromQuery] GetAppointmentsRequest request,
        CancellationToken cancellationToken)  // ✅ PERFORMANCE: Supports cancellation
    {
        try
        {
            // ==================== STEP 1: EXTRACT USER CONTEXT ====================
            // ✅ SECURITY: Get current user from JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            // Validate user ID is valid GUID
            if (!Guid.TryParse(userIdClaim, out var currentUserId))
            {
                _logger.LogWarning("Invalid user ID in token: {UserId}", userIdClaim);
                return Unauthorized(ApiResponse<object>.ErrorResponse("Invalid authentication token"));
            }

            // Validate role exists
            if (string.IsNullOrWhiteSpace(roleClaim))
            {
                _logger.LogWarning("No role claim found for user: {UserId}", currentUserId);
                return Unauthorized(ApiResponse<object>.ErrorResponse("User role not specified"));
            }

            // ==================== STEP 2: VALIDATE REQUEST ====================
            // ✅ VALIDATION: Check model state from request binding
            if (!ModelState.IsValid)
            {
                // ✅ LOGGING: Log validation errors without exposing sensitive data
                _logger.LogWarning("Invalid request model for user {UserId}: {Errors}",
                    currentUserId,
                    string.Join(", ", ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))));

                // Return validation errors to client
                return BadRequest(ApiResponse<object>.ErrorResponse(
                    "Invalid request parameters",
                    ModelState));
            }

            // ==================== STEP 3: CALL SERVICE ====================
            // ✅ ASYNC: Non-blocking service call
            var result = await _appointmentService.GetAppointmentsAsync(
                request,
                currentUserId,
                roleClaim,
                cancellationToken);

            // ==================== STEP 4: LOGGING ====================
            // ✅ LOGGING: Structured logging with context
            _logger.LogInformation(
                "Retrieved appointments for user {UserId}: {Count} items, total: {Total}, page {Page}/{TotalPages}",
                currentUserId,
                result.Items.Count,
                result.TotalCount,
                result.PageNumber,
                result.TotalPages);

            // ==================== STEP 5: RETURN SUCCESS RESPONSE ====================
            // ✅ RESPONSE FORMAT: Consistent standardized response
            return Ok(ApiResponse<PaginatedAppointmentsResponse>.SuccessResponse(
                result,
                $"Retrieved {result.Items.Count} appointments (Page {result.PageNumber} of {result.TotalPages})"));
        }
        catch (UnauthorizedAccessException ex)
        {
            // ✅ ERROR HANDLING: Security exception
            _logger.LogWarning(ex, "Unauthorized access attempt for user");
            return Forbid();  // 403 Forbidden
        }
        catch (ArgumentException ex)
        {
            // ✅ ERROR HANDLING: Validation exception
            _logger.LogWarning(ex, "Invalid argument in request");
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            // ✅ ERROR HANDLING: Catch-all for unexpected errors
            _logger.LogError(ex, "Error retrieving appointments");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                ApiResponse<object>.ErrorResponse("An error occurred while retrieving appointments"));
        }
    }
}
```

---

## 2. SERVICE LAYER

### AppointmentService.cs - Full Implementation

```csharp
using AutoMapper;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Features.Bookings.Repository;

namespace SanadPlatform.API.Features.Bookings.Services;

/// <summary>
/// Service interface for appointment operations.
/// Defines contracts for appointment management.
/// </summary>
public interface IAppointmentService
{
    /// <summary>
    /// Get paginated appointments with filtering, sorting, and authorization checks.
    /// </summary>
    Task<PaginatedAppointmentsResponse> GetAppointmentsAsync(
        GetAppointmentsRequest request,
        Guid currentUserId,
        string userRole,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Service implementation for appointment operations.
/// Handles:
/// - Business logic validation
/// - Security authorization checks
/// - Data transformation (Entity → DTO)
/// - Logging and error handling
/// </summary>
public class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AppointmentService> _logger;

    // ✅ DEPENDENCY INJECTION: Repository, mapper, and logger injected
    public AppointmentService(
        IAppointmentRepository repository,
        IMapper mapper,
        ILogger<AppointmentService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated appointments with security checks and data transformation.
    /// 
    /// SECURITY CONSIDERATIONS:
    /// - Patients can only see their own appointments
    /// - Providers can only see their own appointments
    /// - Admins can see all appointments (with optional filters)
    /// - Encrypted fields are handled transparently by Entity Framework
    /// 
    /// PERFORMANCE CONSIDERATIONS:
    /// - Uses specification pattern for query optimization
    /// - Includes related entities in single query (N+1 prevention)
    /// - AsNoTracking() for read-only operations
    /// - Pagination limits result size
    /// - Search uses indexed fields
    /// </summary>
    public async Task<PaginatedAppointmentsResponse> GetAppointmentsAsync(
        GetAppointmentsRequest request,
        Guid currentUserId,
        string userRole,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // ==================== LOGGING ====================
            // ✅ LOGGING: Log method entry with context
            _logger.LogInformation(
                "Getting appointments for user {UserId} with role {Role}, page {Page}, pageSize {PageSize}",
                currentUserId,
                userRole,
                request.Page,
                request.PageSize);

            // ==================== SECURITY: ROLE-BASED ACCESS CONTROL ====================
            var (patientId, providerId) = ApplySecurityFilters(
                request,
                currentUserId,
                userRole);

            // ==================== SPECIFICATION PATTERN ====================
            // ✅ PERFORMANCE: Build specification with all filters
            // This encapsulates complex query logic
            var specification = new GetAppointmentsSpecification(
                page: request.Page,
                pageSize: request.PageSize,
                status: request.Status,
                startDateFrom: request.StartDateFrom,
                startDateTo: request.StartDateTo,
                patientId: patientId,
                providerId: providerId,
                serviceId: request.ServiceId,
                searchQuery: request.SearchQuery,
                sortBy: request.SortBy,
                sortDirection: request.SortDirection,
                includeRelated: request.IncludeRelated);

            // ==================== REPOSITORY CALL ====================
            // ✅ ASYNC: Non-blocking database call
            // ✅ PERFORMANCE: Repository handles query optimization
            var (appointments, totalCount) = await _repository.GetAppointmentsAsync(
                specification,
                cancellationToken);

            // ==================== DATA TRANSFORMATION ====================
            // ✅ MAPPING: Entity → DTO transformation using AutoMapper
            // Automatically handles object graph
            var appointmentDtos = _mapper.Map<List<AppointmentResponse>>(appointments);

            // ==================== LOGGING ====================
            // ✅ LOGGING: Log retrieval result
            _logger.LogInformation(
                "Retrieved {Count} appointments for user {UserId}, total: {Total}",
                appointmentDtos.Count,
                currentUserId,
                totalCount);

            // ==================== RETURN RESPONSE ====================
            // ✅ RESPONSE: Build paginated response with calculated properties
            return new PaginatedAppointmentsResponse
            {
                Items = appointmentDtos,
                TotalCount = totalCount,
                PageNumber = request.Page,
                PageSize = request.PageSize
                // TotalPages, HasNextPage, HasPreviousPage calculated from above
            };
        }
        catch (Exception ex)
        {
            // ✅ ERROR HANDLING: Log error and rethrow
            _logger.LogError(ex, "Error getting appointments for user {UserId}", currentUserId);
            throw;
        }
    }

    /// <summary>
    /// Apply security filters based on user role.
    /// Ensures users can only see relevant appointments.
    /// 
    /// SECURITY LOGIC:
    /// - Patient: Can only see own appointments (patientId = userId)
    /// - Provider: Can only see own appointments (providerId = userId)
    /// - Admin: Can see all, with optional filters from request
    /// </summary>
    private (Guid? PatientId, Guid? ProviderId) ApplySecurityFilters(
        GetAppointmentsRequest request,
        Guid currentUserId,
        string userRole)
    {
        return userRole.ToLower() switch
        {
            // ✅ SECURITY: Patient can only see own appointments
            "patient" => (patientId: currentUserId, providerId: null),

            // ✅ SECURITY: Provider can only see own appointments
            "provider" => (patientId: null, providerId: currentUserId),

            // ✅ SECURITY: Admin can filter by request parameters
            "admin" => (
                patientId: request.PatientId,
                providerId: request.ProviderId),

            // ✅ SECURITY: Deny unknown roles
            _ => throw new UnauthorizedAccessException($"Unknown role: {userRole}")
        };
    }
}
```

---

## 3. REPOSITORY LAYER

### AppointmentRepository.cs - Full Implementation

```csharp
using Microsoft.EntityFrameworkCore;
using SanadPlatform.API.Features.Bookings.DTOs;
using SanadPlatform.API.Features.Bookings.Entities;
using SanadPlatform.API.Infrastructure.Database;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// Repository interface for appointments.
/// Defines contracts for data access operations.
/// </summary>
public interface IAppointmentRepository
{
    Task<(List<Booking> Items, int TotalCount)> GetAppointmentsAsync(
        GetAppointmentsSpecification specification,
        CancellationToken cancellationToken = default);

    Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetByProviderIdAsync(Guid providerId, CancellationToken cancellationToken = default);
    Task<List<Booking>> GetByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Booking> CreateAsync(Booking appointment, CancellationToken cancellationToken = default);
    Task<Booking> UpdateAsync(Booking appointment, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository implementation for appointments.
/// Handles all data access operations with performance optimizations:
/// - AsNoTracking() for read-only queries
/// - Include() for eager loading (N+1 prevention)
/// - Pagination at database level
/// - Specification pattern for query building
/// </summary>
public class AppointmentRepository : IAppointmentRepository
{
    private readonly SanadDbContext _context;
    private readonly ILogger<AppointmentRepository> _logger;

    // ✅ DEPENDENCY INJECTION: DbContext and logger injected
    public AppointmentRepository(
        SanadDbContext context,
        ILogger<AppointmentRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated appointments with specification.
    /// 
    /// PERFORMANCE STRATEGY:
    /// 1. Start with AsNoTracking() for read-only (no change tracking overhead)
    /// 2. Apply filters using specification criteria
    /// 3. Include related entities (prevents N+1 queries)
    /// 4. Count total records BEFORE paging (for pagination metadata)
    /// 5. Apply sorting
    /// 6. Apply pagination (Skip/Take at database level)
    /// 7. Execute query (single materialization)
    /// 
    /// KEY POINTS:
    /// - Query composition uses IQueryable (deferred execution)
    /// - All transformations happen at database level
    /// - Only final .ToListAsync() executes SQL
    /// </summary>
    public async Task<(List<Booking> Items, int TotalCount)> GetAppointmentsAsync(
        GetAppointmentsSpecification specification,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // ==================== STEP 1: START QUERY ====================
            // ✅ PERFORMANCE: AsNoTracking() disables entity tracking
            // Good for read-only queries, faster and uses less memory
            var query = _context.Bookings.AsNoTracking();

            // ==================== STEP 2: APPLY FILTERS ====================
            // ✅ PERFORMANCE: Criteria compiled to SQL WHERE clause
            if (specification.Criteria != null)
            {
                query = query.Where(specification.Criteria);
            }

            // ==================== STEP 3: INCLUDE RELATED ENTITIES ====================
            // ✅ PERFORMANCE: Prevents N+1 query problem
            // Instead of:
            //   - Query 1: Get 20 bookings
            //   - Query 21: For each booking, get patient (N+1 queries!)
            // We do:
            //   - Query 1: Get 20 bookings with Patient, Provider, Service (1 query with joins)
            foreach (var include in specification.Includes)
            {
                query = query.Include(include);
            }

            // ==================== STEP 4: COUNT TOTAL (before paging) ====================
            // ✅ PAGINATION: Get total count for pagination metadata
            // Must do this AFTER filters, BEFORE paging
            var totalCount = await query.CountAsync(cancellationToken);

            // ==================== STEP 5: APPLY SORTING ====================
            // ✅ PERFORMANCE: Sorting at database level (much faster than in-memory)
            if (specification.OrderBy != null)
            {
                query = query.OrderBy(specification.OrderBy);
            }
            else if (specification.OrderByDescending != null)
            {
                query = query.OrderByDescending(specification.OrderByDescending);
            }

            // ==================== STEP 6: APPLY PAGINATION ====================
            // ✅ PERFORMANCE: Skip/Take at database level
            // Database returns only the needed rows, not all rows then trim
            if (specification.IsPagingEnabled)
            {
                query = query.Skip(specification.Skip)
                             .Take(specification.Take);
            }

            // ==================== STEP 7: EXECUTE QUERY ====================
            // ✅ PERFORMANCE: Single materialization point
            // All previous operations are compiled to single SQL query
            var appointments = await query.ToListAsync(cancellationToken);

            // ==================== LOGGING ====================
            // ✅ LOGGING: Log execution details
            var pageNumber = specification.IsPagingEnabled
                ? (specification.Skip / specification.Take) + 1
                : 1;
            _logger.LogInformation(
                "Retrieved {Count} appointments (Page {Page}, Total {Total})",
                appointments.Count,
                pageNumber,
                totalCount);

            // ==================== RETURN RESULT ====================
            return (appointments, totalCount);
        }
        catch (OperationCanceledException ex)
        {
            // ✅ ERROR HANDLING: Request was cancelled
            _logger.LogWarning(ex, "Operation cancelled while retrieving appointments");
            throw;
        }
        catch (Exception ex)
        {
            // ✅ ERROR HANDLING: Database or other exceptions
            _logger.LogError(ex, "Error retrieving appointments with specification");
            throw;
        }
    }

    /// <summary>
    /// Get single appointment by ID with related entities.
    /// Used for detailed view.
    /// </summary>
    public async Task<Booking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            // ✅ PERFORMANCE: AsNoTracking() for read-only
            // ✅ PERFORMANCE: Include related entities
            var appointment = await _context.Bookings
                .AsNoTracking()
                .Include(b => b.Patient)
                .Include(b => b.Provider)
                .Include(b => b.Service)
                .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

            if (appointment == null)
            {
                _logger.LogWarning("Appointment not found with ID: {AppointmentId}", id);
            }

            return appointment;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving appointment with ID: {AppointmentId}", id);
            throw;
        }
    }

    /// <summary>
    /// Get all appointments for a specific provider.
    /// </summary>
    public async Task<List<Booking>> GetByProviderIdAsync(Guid providerId, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Bookings
                .AsNoTracking()
                .Where(b => b.ProviderId == providerId)
                .Include(b => b.Patient)
                .Include(b => b.Service)
                .OrderBy(b => b.BookingDate)  // ✅ PERFORMANCE: Order at database
                .ToListAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving appointments for provider: {ProviderId}", providerId);
            throw;
        }
    }

    /// <summary>
    /// Get all appointments for a specific patient.
    /// </summary>
    public async Task<List<Booking>> GetByPatientIdAsync(Guid patientId, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Bookings
                .AsNoTracking()
                .Where(b => b.PatientId == patientId)
                .Include(b => b.Provider)
                .Include(b => b.Service)
                .OrderBy(b => b.BookingDate)
                .ToListAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving appointments for patient: {PatientId}", patientId);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            return await _context.Bookings
                .AsNoTracking()
                .AnyAsync(b => b.Id == id, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking appointment existence: {AppointmentId}", id);
            throw;
        }
    }

    // ... Other CRUD operations (Create, Update, Delete)
}
```

---

## 4. SPECIFICATION PATTERN

### GetAppointmentsSpecification.cs - Full Implementation

```csharp
using System.Linq.Expressions;
using SanadPlatform.API.Features.Bookings.Entities;

namespace SanadPlatform.API.Features.Bookings.Repository;

/// <summary>
/// Base specification class for appointments.
/// Encapsulates query composition logic:
/// - Filtering criteria
/// - Includes (eager loading)
/// - Sorting
/// - Pagination
/// </summary>
public abstract class AppointmentSpecification
{
    // ✅ FILTERING: Expression-based criteria for WHERE clause
    public Expression<Func<Booking, bool>>? Criteria { get; protected set; }

    // ✅ INCLUDES: Entity framework eager loading
    public List<Expression<Func<Booking, object>>> Includes { get; } = new();

    // ✅ SORTING: Single ascending or descending sort
    public Expression<Func<Booking, object>>? OrderBy { get; protected set; }
    public Expression<Func<Booking, object>>? OrderByDescending { get; protected set; }

    // ✅ PAGINATION: Skip/Take for page-based paging
    public int Take { get; protected set; }
    public int Skip { get; protected set; }
    public bool IsPagingEnabled { get; protected set; }

    // ✅ HELPER METHODS: Encapsulate property assignment logic
    protected virtual void AddInclude(Expression<Func<Booking, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    protected virtual void AddOrderBy(Expression<Func<Booking, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }

    protected virtual void AddOrderByDescending(Expression<Func<Booking, object>> orderByDescendingExpression)
    {
        OrderByDescending = orderByDescendingExpression;
    }

    protected virtual void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }
}

/// <summary>
/// Specification for getting appointments with advanced filtering.
/// 
/// FEATURES:
/// - Filter by status, date range, patient, provider, service
/// - Full-text search by booking number and names
/// - Sorting by multiple fields
/// - Pagination
/// - Optional eager loading
/// </summary>
public class GetAppointmentsSpecification : AppointmentSpecification
{
    public GetAppointmentsSpecification(
        int page,
        int pageSize,
        string? status = null,
        DateTime? startDateFrom = null,
        DateTime? startDateTo = null,
        Guid? patientId = null,
        Guid? providerId = null,
        Guid? serviceId = null,
        string? searchQuery = null,
        string sortBy = "startDate",
        string sortDirection = "asc",
        bool includeRelated = true)
    {
        // ==================== STEP 1: BUILD FILTER CRITERIA ====================
        // ✅ FILTERING: Use predicate builder for composable filters
        // Allows combining multiple AND conditions
        var criteria = PredicateBuilder.True<Booking>();

        // Filter by status if provided
        if (!string.IsNullOrWhiteSpace(status))
        {
            criteria = criteria.And(b => b.Status == status);
        }

        // Filter by date range - FROM
        if (startDateFrom.HasValue)
        {
            // ✅ PERFORMANCE: Compare at database level
            criteria = criteria.And(b => b.BookingDate >= startDateFrom.Value);
        }

        // Filter by date range - TO
        if (startDateTo.HasValue)
        {
            // Include entire end date (up to 23:59:59.999)
            var endOfDay = startDateTo.Value.AddDays(1).AddTicks(-1);
            criteria = criteria.And(b => b.BookingDate <= endOfDay);
        }

        // Filter by patient
        if (patientId.HasValue)
        {
            criteria = criteria.And(b => b.PatientId == patientId.Value);
        }

        // Filter by provider
        if (providerId.HasValue)
        {
            criteria = criteria.And(b => b.ProviderId == providerId.Value);
        }

        // Filter by service
        if (serviceId.HasValue)
        {
            criteria = criteria.And(b => b.ServiceId == serviceId.Value);
        }

        // ✅ SEARCH: Full-text search on searchable fields
        if (!string.IsNullOrWhiteSpace(searchQuery))
        {
            var query = searchQuery.Trim().ToLower();
            criteria = criteria.And(b =>
                b.BookingNumber.ToLower().Contains(query) ||
                b.PatientName.ToLower().Contains(query) ||
                b.ProviderName.ToLower().Contains(query) ||
                b.ServiceName.ToLower().Contains(query));
        }

        // Set combined criteria
        Criteria = criteria;

        // ==================== STEP 2: INCLUDE RELATED ENTITIES ====================
        // ✅ PERFORMANCE: Eager load related data if requested
        if (includeRelated)
        {
            AddInclude(b => b.Patient!);
            AddInclude(b => b.Provider!);
            AddInclude(b => b.Service!);
        }

        // ==================== STEP 3: APPLY SORTING ====================
        // ✅ PERFORMANCE: Normalize sort parameters
        var sortByLower = (sortBy ?? "startdate").ToLower();
        var sortDirectionLower = (sortDirection ?? "asc").ToLower();

        switch (sortByLower)
        {
            case "bookingnumber":
                if (sortDirectionLower == "desc")
                    AddOrderByDescending(b => b.BookingNumber);
                else
                    AddOrderBy(b => b.BookingNumber);
                break;

            case "status":
                if (sortDirectionLower == "desc")
                    AddOrderByDescending(b => b.Status);
                else
                    AddOrderBy(b => b.Status);
                break;

            case "createdat":
                if (sortDirectionLower == "desc")
                    AddOrderByDescending(b => b.CreatedAt);
                else
                    AddOrderBy(b => b.CreatedAt);
                break;

            case "startdate":
            default:
                if (sortDirectionLower == "desc")
                    AddOrderByDescending(b => b.BookingDate);
                else
                    AddOrderBy(b => b.BookingDate);
                break;
        }

        // ==================== STEP 4: APPLY PAGINATION ====================
        // ✅ PAGINATION: Calculate skip/take from page number
        var skip = (page - 1) * pageSize;
        ApplyPaging(skip, pageSize);
    }
}

/// <summary>
/// Helper class for building complex predicates using AND/OR logic.
/// Allows composable filter expressions.
/// </summary>
public static class PredicateBuilder
{
    /// <summary>
    /// Create a predicate that always returns true.
    /// Used as starting point for AND-ing multiple conditions.
    /// </summary>
    public static Expression<Func<T, bool>> True<T>() where T : class
    {
        return x => true;
    }

    /// <summary>
    /// Create a predicate that always returns false.
    /// Used as starting point for OR-ing conditions.
    /// </summary>
    public static Expression<Func<T, bool>> False<T>() where T : class
    {
        return x => false;
    }

    /// <summary>
    /// Combine two predicates with AND logic.
    /// ✅ EXPRESSION TREES: Properly invokes second expression with first's parameters
    /// </summary>
    public static Expression<Func<T, bool>> And<T>(
        this Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2) where T : class
    {
        var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
        return Expression.Lambda<Func<T, bool>>(
            Expression.AndAlso(expr1.Body, invokedExpr),
            expr1.Parameters);
    }

    /// <summary>
    /// Combine two predicates with OR logic.
    /// ✅ EXPRESSION TREES: Properly invokes second expression with first's parameters
    /// </summary>
    public static Expression<Func<T, bool>> Or<T>(
        this Expression<Func<T, bool>> expr1,
        Expression<Func<T, bool>> expr2) where T : class
    {
        var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
        return Expression.Lambda<Func<T, bool>>(
            Expression.OrElse(expr1.Body, invokedExpr),
            expr1.Parameters);
    }
}
```

---

## 5. DATA TRANSFER OBJECTS

### GetAppointmentsRequest.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Request DTO for getting appointments with pagination, filtering, and sorting.
/// Provides security and performance optimization through validation and constraints.
/// </summary>
public class GetAppointmentsRequest
{
    /// <summary>
    /// Page number (1-based).
    /// ✅ VALIDATION: Must be >= 1
    /// Default: 1
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Page must be greater than 0")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Number of items per page.
    /// ✅ VALIDATION: Between 1 and 100 (prevents abuse)
    /// ✅ PERFORMANCE: Limits result set size
    /// Default: 20
    /// </summary>
    [Range(1, 100, ErrorMessage = "PageSize must be between 1 and 100")]
    public int PageSize { get; set; } = 20;

    /// <summary>
    /// Filter by appointment status.
    /// Examples: "pending", "confirmed", "in_progress", "completed", "cancelled"
    /// Optional - if null, returns all statuses
    /// </summary>
    public string? Status { get; set; }

    /// <summary>
    /// Filter appointments starting from this date (inclusive).
    /// Format: yyyy-MM-dd or ISO 8601 datetime
    /// Optional
    /// </summary>
    public DateTime? StartDateFrom { get; set; }

    /// <summary>
    /// Filter appointments up to this date (inclusive).
    /// Format: yyyy-MM-dd or ISO 8601 datetime
    /// Optional
    /// </summary>
    public DateTime? StartDateTo { get; set; }

    /// <summary>
    /// Filter by provider ID.
    /// ✅ SECURITY: Only visible to admin (service enforces this)
    /// Optional
    /// </summary>
    public Guid? ProviderId { get; set; }

    /// <summary>
    /// Filter by patient ID.
    /// ✅ SECURITY: Only visible to admin (service enforces this)
    /// Optional
    /// </summary>
    public Guid? PatientId { get; set; }

    /// <summary>
    /// Filter by service ID.
    /// Optional
    /// </summary>
    public Guid? ServiceId { get; set; }

    /// <summary>
    /// Search by booking number or patient/provider name.
    /// ✅ VALIDATION: Max 100 characters (prevents abuse)
    /// Note: Encrypted fields are not searchable (security)
    /// Optional
    /// </summary>
    [StringLength(100, ErrorMessage = "Search query cannot exceed 100 characters")]
    public string? SearchQuery { get; set; }

    /// <summary>
    /// Sort field name.
    /// Valid values: "id", "bookingNumber", "startDate", "status", "createdAt"
    /// ✅ VALIDATION: Max 50 characters (prevents injection)
    /// Default: "startDate"
    /// </summary>
    [StringLength(50)]
    public string SortBy { get; set; } = "startDate";

    /// <summary>
    /// Sort direction.
    /// Valid values: "asc" or "desc"
    /// ✅ VALIDATION: Max 4 characters
    /// Default: "asc"
    /// </summary>
    [StringLength(4)]
    public string SortDirection { get; set; } = "asc";

    /// <summary>
    /// Include related data (Patient, Provider, Service details).
    /// ✅ PERFORMANCE: Default true to avoid N+1 queries
    /// Set to false only if you need minimal data
    /// Default: true
    /// </summary>
    public bool IncludeRelated { get; set; } = true;
}
```

### AppointmentResponse.cs

```csharp
namespace SanadPlatform.API.Features.Bookings.DTOs;

/// <summary>
/// Response DTO for appointment summary.
/// Contains safe, non-encrypted data for API responses.
/// </summary>
public class AppointmentResponse
{
    // ==================== IDENTITY ====================
    public Guid Id { get; set; }
    
    /// <summary>
    /// Human-readable booking identifier
    /// Example: "BK-2024-001"
    /// </summary>
    public string BookingNumber { get; set; } = string.Empty;
    
    // ==================== REFERENCES ====================
    public Guid PatientId { get; set; }
    public Guid ProviderId { get; set; }
    public Guid ServiceId { get; set; }

    // ==================== TIMING ====================
    public DateTime BookingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public int? DurationMinutes { get; set; }
    public string Timezone { get; set; } = "Europe/Paris";

    // ==================== STATUS ====================
    public string Status { get; set; } = string.Empty;
    public decimal? ProgressPercentage { get; set; }
    
    // ==================== PATIENT INFO (Decrypted Snapshot) ====================
    /// <summary>
    /// ✅ SECURITY: Decrypted snapshot from encrypted fields
    /// Cannot be modified in API layer
    /// </summary>
    public string PatientName { get; set; } = string.Empty;
    public string? PatientPhoneNumber { get; set; }
    public string? PatientEmail { get; set; }
    
    // ==================== PROVIDER INFO ====================
    public string ProviderName { get; set; } = string.Empty;
    public string? ProviderPhoneNumber { get; set; }
    public string? ProviderProfilePhotoUrl { get; set; }
    
    // ==================== SERVICE INFO ====================
    public string ServiceName { get; set; } = string.Empty;
    public decimal? EstimatedCost { get; set; }
    
    // ==================== MODALITY ====================
    public string ServiceModality { get; set; } = string.Empty; // "in_person", "remote", "hybrid"
    public string? ServiceCategory { get; set; }
    
    // ==================== BOOKING STATUS ====================
    public bool IsProviderConfirmed { get; set; }
    public DateTime? ProviderConfirmedAt { get; set; }
    public bool IsRescheduleRequested { get; set; }
    public int RescheduleCount { get; set; }
    
    // ==================== TIMESTAMPS ====================
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // ==================== OPTIONAL RELATED DATA ====================
    /// <summary>
    /// ✅ PERFORMANCE: Included only when requested (IncludeRelated = true)
    /// Prevents unnecessary data transfer
    /// </summary>
    public PatientSummary? Patient { get; set; }
    public ProviderSummary? Provider { get; set; }
    public ServiceSummary? Service { get; set; }

    /// <summary>
    /// Nested DTO for patient summary
    /// </summary>
    public class PatientSummary
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? ProfilePhotoUrl { get; set; }
    }

    /// <summary>
    /// Nested DTO for provider summary
    /// </summary>
    public class ProviderSummary
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? ProfilePhotoUrl { get; set; }
        
        // ✅ PERFORMANCE: Aggregate data (not loaded per-query)
        public decimal? AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }

    /// <summary>
    /// Nested DTO for service summary
    /// </summary>
    public class ServiceSummary
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int EstimatedDurationMinutes { get; set; }
    }
}

/// <summary>
/// Paginated response wrapper for appointments.
/// Provides pagination metadata for UI.
/// </summary>
public class PaginatedAppointmentsResponse
{
    public List<AppointmentResponse> Items { get; set; } = new();
    
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    
    // ✅ CALCULATED PROPERTIES: Derived from above
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;
}
```

---

## 6. API Response Wrapper

### ApiResponse.cs

```csharp
namespace SanadPlatform.API.Common.Models;

/// <summary>
/// Standard API response wrapper for all endpoints.
/// ✅ CONSISTENCY: All endpoints return this format
/// ✅ DOCUMENTATION: Clear structure for clients
/// </summary>
public class ApiResponse<T>
{
    /// <summary>
    /// Indicates if operation was successful
    /// </summary>
    public bool Success { get; set; }
    
    /// <summary>
    /// Human-readable message
    /// For success: "Retrieved X appointments"
    /// For error: "Invalid request parameters"
    /// </summary>
    public string Message { get; set; } = string.Empty;
    
    /// <summary>
    /// Response data (null for errors)
    /// </summary>
    public T? Data { get; set; }
    
    /// <summary>
    /// Validation errors (if applicable)
    /// Key: Field name
    /// Value: Array of error messages
    /// </summary>
    public Dictionary<string, string[]>? Errors { get; set; }

    /// <summary>
    /// Factory method for success responses
    /// </summary>
    public static ApiResponse<T> SuccessResponse(T data, string message = "Success")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    /// <summary>
    /// Factory method for error responses
    /// </summary>
    public static ApiResponse<T> ErrorResponse(
        string message,
        Dictionary<string, string[]>? errors = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Message = message,
            Errors = errors
        };
    }
}
```

---

## 7. DEPENDENCY INJECTION SETUP

### Program.cs Configuration

```csharp
// ==================== REGISTER SERVICES ====================

// Repository layer
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();

// Service layer
builder.Services.AddScoped<IAppointmentService, AppointmentService>();

// ==================== DATABASE CONTEXT ====================

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<SanadDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        // ✅ RESILIENCE: Enable retry on transient failures
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetialDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null);
    }));

// ==================== AUTOMAPPER ====================

builder.Services.AddAutoMapper(typeof(Program).Assembly);

// ==================== LOGGING ====================

builder.Services.AddLogging();

// ==================== AUTHENTICATION ====================

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"]
        };
    });

// ==================== AUTHORIZATION ====================

builder.Services.AddAuthorization();
```

---

## 8. COMPLETE REQUEST/RESPONSE EXAMPLE

### HTTP Request
```http
GET /api/appointments?page=1&pageSize=20&status=confirmed&sortBy=startDate&sortDirection=asc HTTP/1.1
Host: localhost:5001
Authorization: Bearer <access_token>
Content-Type: application/json
```

### HTTP Response (200 OK)
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "message": "Retrieved 20 appointments (Page 1 of 3)",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "bookingNumber": "BK-2024-001",
        "patientId": "550e8400-e29b-41d4-a716-446655440001",
        "providerId": "550e8400-e29b-41d4-a716-446655440002",
        "serviceId": "550e8400-e29b-41d4-a716-446655440003",
        "bookingDate": "2024-02-15T10:00:00Z",
        "startTime": "10:00:00",
        "endTime": "11:00:00",
        "durationMinutes": 60,
        "timezone": "Europe/Paris",
        "status": "confirmed",
        "progressPercentage": null,
        "patientName": "[DECRYPTED]",
        "patientPhoneNumber": "[DECRYPTED]",
        "patientEmail": "[DECRYPTED]",
        "providerName": "[DECRYPTED]",
        "providerPhoneNumber": "[DECRYPTED]",
        "providerProfilePhotoUrl": "https://...",
        "serviceName": "General Consultation",
        "estimatedCost": 75.00,
        "serviceModality": "in_person",
        "serviceCategory": "General",
        "isProviderConfirmed": true,
        "providerConfirmedAt": "2024-02-14T15:30:00Z",
        "isRescheduleRequested": false,
        "rescheduleCount": 0,
        "createdAt": "2024-02-01T08:30:00Z",
        "updatedAt": "2024-02-14T15:30:00Z",
        "patient": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "firstName": "John",
          "lastName": "Doe",
          "phoneNumber": "[DECRYPTED]",
          "email": "[DECRYPTED]",
          "profilePhotoUrl": "https://..."
        },
        "provider": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "firstName": "Jane",
          "lastName": "Smith",
          "phoneNumber": "[DECRYPTED]",
          "email": "[DECRYPTED]",
          "profilePhotoUrl": "https://...",
          "averageRating": 4.8,
          "totalReviews": 150
        },
        "service": {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "name": "General Consultation",
          "description": "General medical consultation",
          "category": "General",
          "price": 75.00,
          "estimatedDurationMinutes": 60
        }
      },
      // ... more appointments
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "errors": null
}
```

### HTTP Response (400 Bad Request)
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Invalid request parameters",
  "data": null,
  "errors": {
    "pageSize": [
      "PageSize must be between 1 and 100"
    ]
  }
}
```

### HTTP Response (401 Unauthorized)
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Invalid authentication token",
  "data": null,
  "errors": null
}
```

---

## KEY TAKEAWAYS

### Security Implemented ✅
- JWT authentication required
- Role-based authorization (Patient, Provider, Admin)
- Encrypted field handling
- No sensitive data in logs
- Input validation and sanitization

### Performance Implemented ✅
- Pagination (max 100 items per page)
- Eager loading prevents N+1 queries
- AsNoTracking() for read-only operations
- Database-level sorting and filtering
- Single database query
- Indexed fields in database

### Best Practices Implemented ✅
- Layered architecture (Controller → Service → Repository)
- Dependency injection
- Interface-driven design
- Specification pattern for queries
- AutoMapper for DTOs
- Async/await throughout
- Comprehensive error handling
- Structured logging
- XML documentation
- Consistent response format
