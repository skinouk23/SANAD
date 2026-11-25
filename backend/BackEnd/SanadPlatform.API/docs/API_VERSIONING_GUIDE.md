# API Versioning Guide

## Overview

API versioning is implemented using URL path versioning with the Asp.Versioning library. This allows maintaining multiple API versions simultaneously while supporting backward compatibility.

## Quick Start

### 1. Update Controller to Support Versioning

```csharp
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace SanadPlatform.API.Features.Bookings.Controllers;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]              // Supports v1.0
[ApiVersion("2.0")]              // Also supports v2.0
public class AppointmentsController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedAppointmentsResponse>>> GetAppointments(
        [FromQuery] GetAppointmentsRequest request,
        CancellationToken cancellationToken)
    {
        // Implementation
    }
}
```

### 2. Deprecate Old Versions

```csharp
[ApiVersion("1.0", Deprecated = true)]  // Mark v1 as deprecated
[ApiVersion("2.0")]                      // v2 is current
public class AppointmentsController : ControllerBase
{
    // v1 endpoints will show as deprecated in Swagger
}
```

### 3. Version-Specific Endpoints

```csharp
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[HttpGet]
public async Task<ActionResult<ApiResponse<PaginatedAppointmentsResponse>>> GetAppointments(
    [FromQuery] GetAppointmentsRequest request,
    CancellationToken cancellationToken)
{
    // This endpoint exists in both versions
}

// V2-only endpoint
[ApiVersion("2.0")]
[HttpGet("advanced-search")]
public async Task<ActionResult<ApiResponse<AdvancedSearchResponse>>> AdvancedSearch(
    [FromQuery] AdvancedSearchRequest request,
    CancellationToken cancellationToken)
{
    // This endpoint only exists in v2
}
```

## Usage Examples

### Request Format

All requests use URL path versioning:

```
GET /api/v1/appointments?page=1&pageSize=20
GET /api/v2/appointments?page=1&pageSize=20
```

**Query Parameters**: Same for all versions
**Request Body**: Adjust based on version compatibility
**Response Format**: Can differ between versions

### Example Responses

**v1 Response** (Simple format):
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 20
  },
  "message": "Success"
}
```

**v2 Response** (Enhanced format with metadata):
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "timestamp": "2024-02-03T10:30:00Z"
  },
  "message": "Success",
  "traceId": "0HN1GJ7IQ6QTL:00000001"
}
```

## Swagger/OpenAPI Support

### Multiple Version Tabs

Swagger UI automatically displays separate tabs for each version:
- `Sanad Platform API v1` - Shows all v1.0 endpoints
- `Sanad Platform API v2` - Shows all v2.0 endpoints

Deprecated endpoints are marked with a red "deprecated" label.

### Swagger Endpoints

```
http://localhost:5000/swagger/index.html          # Main Swagger UI
http://localhost:5000/swagger/v1/swagger.json     # OpenAPI spec for v1
http://localhost:5000/swagger/v2/swagger.json     # OpenAPI spec for v2
```

## Best Practices

### 1. Versioning Strategy

```csharp
// MAJOR.MINOR format
// v1.0 = Initial release
// v1.1 = Backward compatible additions
// v2.0 = Breaking changes

[ApiVersion("1.0")]
[ApiVersion("1.1")]  // Supports both
public class AppointmentsController : ControllerBase
{
    // Shared endpoints
}
```

### 2. Breaking Changes → New Major Version

```csharp
// v1 - Original endpoint
[ApiVersion("1.0")]
[HttpGet("{id}")]
public IActionResult GetAppointment(Guid id) { }

// v2 - Changed return type (breaking change)
[ApiVersion("2.0")]
[HttpGet("{id}")]
public IActionResult GetAppointmentV2(Guid id) { }
```

### 3. Deprecation Path

```csharp
// Step 1: Mark as deprecated (6 months notice)
[ApiVersion("1.0", Deprecated = true)]
[ApiVersion("2.0")]

// Step 2: Send deprecation headers (automatic)
// HTTP Response Headers:
// api-supported-versions: 1.0, 2.0
// api-deprecated-versions: 1.0

// Step 3: Remove after sunset date
// Remove [ApiVersion("1.0")] completely
```

### 4. Version-Specific DTOs

```csharp
namespace SanadPlatform.API.Features.Bookings.DTOs.V1;
public class AppointmentResponse
{
    public Guid Id { get; set; }
    public string BookingNumber { get; set; }
    // Minimal fields for v1
}

namespace SanadPlatform.API.Features.Bookings.DTOs.V2;
public class AppointmentResponse
{
    public Guid Id { get; set; }
    public string BookingNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    // Additional fields in v2
}
```

### 5. Conditional Logic in Endpoints

```csharp
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[HttpGet]
public async Task<ActionResult> GetAppointments(
    [FromQuery] GetAppointmentsRequest request,
    [FromHeader] string apiVersion = "1.0")
{
    if (apiVersion.StartsWith("2"))
    {
        // V2-specific logic
        return Ok(new V2Response { /* ... */ });
    }
    
    // V1 default
    return Ok(new V1Response { /* ... */ });
}
```

## Configuration Reference

### Program.cs Setup

```csharp
// Enable versioning
builder.Services.AddApiVersioningConfig();

// Enable Swagger with versioning
builder.Services.AddSwaggerGen(c =>
{
    c.AddSwaggerGenVersioning();
    // ... other config
});

// Configure Swagger UI
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    options.SwaggerEndpoint("/swagger/v2/swagger.json", "API v2");
});
```

### API Versions Constants

```csharp
// Use predefined constants for consistency
using SanadPlatform.API.Infrastructure.Versioning;

public class AppointmentsController : ControllerBase
{
    [ApiVersion(ApiVersions.V1_0)]
    [ApiVersion(ApiVersions.V2_0)]
    public async Task<IActionResult> GetAppointments() { }
}
```

## Common Patterns

### Pattern 1: Simple Versioning (Most Common)

```csharp
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
public class AppointmentsController : ControllerBase
{
    // Single implementation works for both versions
    // Return types are compatible
    
    [HttpGet]
    public async Task<ActionResult<Response>> GetAppointments() { }
}
```

### Pattern 2: Version-Specific Methods

```csharp
[ApiVersion("1.0")]
[HttpGet("search")]
public async Task<ActionResult> SearchV1([FromQuery] SearchRequestV1 request) { }

[ApiVersion("2.0")]
[HttpGet("search")]
public async Task<ActionResult> SearchV2([FromQuery] SearchRequestV2 request) { }
```

### Pattern 3: Feature Flags

```csharp
[HttpGet]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
public async Task<ActionResult> GetAppointments(
    [FromQuery] GetAppointmentsRequest request,
    ApiVersion apiVersion)
{
    var includeNewFeatures = apiVersion.MajorVersion > 1;
    // ...
}
```

## Monitoring & Versioning Headers

All responses include version headers:

```
api-supported-versions: 1.0, 2.0
api-deprecated-versions: 1.0
```

Parse these to monitor client usage:

```csharp
var supportedVersions = response.Headers.GetValues("api-supported-versions");
var deprecatedVersions = response.Headers.GetValues("api-deprecated-versions");
```

## Migration Checklist

When introducing a new version:

- [ ] Create new version in `ApiVersions` constants
- [ ] Add `[ApiVersion("X.Y")]` to controllers
- [ ] Update route: `api/v{version:apiVersion}`
- [ ] Create version-specific DTOs if needed
- [ ] Add Swagger docs for new version
- [ ] Update documentation with examples
- [ ] Test with both versions
- [ ] Monitor deprecated version usage
- [ ] Set sunset date for old versions

## Troubleshooting

### Issue: "No route matches the version 2.0"

**Solution**: Ensure controller has `[ApiVersion("2.0")]` attribute

```csharp
[ApiVersion("2.0")]  // Add this
public class AppointmentsController : ControllerBase { }
```

### Issue: Version not showing in Swagger

**Solution**: Confirm `AddSwaggerGenVersioning()` is called in Program.cs

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.AddSwaggerGenVersioning();  // Add this line
});
```

### Issue: Version header not present

**Solution**: Ensure `ReportApiVersions = true` in configuration

This is already set in `VersioningExtensions.AddApiVersioningConfig()`
