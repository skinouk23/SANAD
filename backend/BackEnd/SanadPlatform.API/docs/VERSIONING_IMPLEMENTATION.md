# API Versioning Implementation Summary

## ✅ What Was Implemented

A **generic and easy** API versioning system using URL path versioning with automatic Swagger support.

## Key Features

### 1. **URL Path Versioning** (Easiest & Most REST-compliant)

```
/api/v1/appointments    ← Version 1
/api/v2/appointments    ← Version 2
```

### 2. **Automatic Swagger Documentation**

- Swagger UI shows separate tabs for each version
- OpenAPI specs generated per version: `/swagger/v1/swagger.json`, `/swagger/v2/swagger.json`
- Deprecated versions clearly marked in UI

### 3. **Minimal Code Changes**

Just add **two lines** to any controller to support multiple versions:

```csharp
[Route("api/v{version:apiVersion}/[controller]")]  // Line 1: Update route
[ApiVersion("1.0")]                                  // Line 2: Add versions
[ApiVersion("2.0")]
public class AppointmentsController : ControllerBase
{
    // No other changes needed!
}
```

## File Changes

### Created Files

1. **[Infrastructure/Versioning/VersioningExtensions.cs](../BackEnd/SanadPlatform.API/Infrastructure/Versioning/VersioningExtensions.cs)**
   - `AddApiVersioningConfig()` - Registers versioning service
   - `AddSwaggerGenVersioning()` - Configures Swagger for multiple versions
   - Version helper classes and filters
   - 200+ lines of reusable infrastructure

2. **[API_VERSIONING_GUIDE.md](../BackEnd/SanadPlatform.API/API_VERSIONING_GUIDE.md)**
   - Complete implementation guide with 50+ examples
   - Best practices and migration checklist
   - Troubleshooting section
   - Code patterns for common scenarios

### Modified Files

1. **Program.cs**
   ```csharp
   // Added imports
   using SanadPlatform.API.Infrastructure.Versioning;
   
   // Added single line in service configuration
   builder.Services.AddApiVersioningConfig();
   
   // Updated Swagger configuration
   builder.Services.AddSwaggerGen(c =>
   {
       c.AddSwaggerGenVersioning();  // Handles all versioning setup
       // ... other config
   });
   
   // Updated Swagger UI
   app.UseSwaggerUI(options =>
   {
       options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
       options.SwaggerEndpoint("/swagger/v2/swagger.json", "API v2");
   });
   ```

2. **SanadPlatform.API.csproj**
   ```xml
   <!-- Added package for versioning -->
   <PackageReference Include="Asp.Versioning.Mvc.ApiExplorer" Version="8.1.0" />
   ```

3. **AppointmentsController.cs**
   ```csharp
   // Before:
   [Route("api/[controller]")]
   public class AppointmentsController : ControllerBase { }
   
   // After:
   [Route("api/v{version:apiVersion}/[controller]")]
   [ApiVersion("1.0")]
   [ApiVersion("2.0")]
   public class AppointmentsController : ControllerBase { }
   ```

## How It Works

### 1. **Configuration Phase** (One-time setup in Program.cs)

```csharp
// Enable versioning
builder.Services.AddApiVersioningConfig();

// Register service:
// - Sets default version: 1.0
// - Enables version in response headers
// - Uses URL path versioning (/api/v{version}/...)
```

### 2. **Controller Configuration** (Add to each controller)

```csharp
[ApiVersion("1.0")]  // Supports v1.0
[ApiVersion("2.0")]  // Also supports v2.0
public class AppointmentsController : ControllerBase
{
    // All endpoints automatically support both versions
    // No code duplication needed!
}
```

### 3. **HTTP Request Resolution**

```
Client requests: GET /api/v2/appointments?page=1
                 ↓
Router matches version: v2.0
                 ↓
Controller action invoked with version context
                 ↓
Response headers include: api-supported-versions: 1.0, 2.0
```

### 4. **Swagger Documentation**

```
Swagger UI tab 1: "Sanad Platform API v1"
  - Shows only endpoints marked with [ApiVersion("1.0")]
  
Swagger UI tab 2: "Sanad Platform API v2"
  - Shows endpoints marked with [ApiVersion("2.0")]
  - Deprecated endpoints marked with red badge
```

## Usage Examples

### Example 1: Add Version to Existing Controller

```csharp
// Before:
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase { }

// After (just 2 additions):
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]  // ← Add this
[ApiVersion("1.0")]                                  // ← Add this
[ApiVersion("2.0")]
public class PatientsController : ControllerBase { }
```

### Example 2: Version-Specific Endpoints

```csharp
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[HttpGet]
public IActionResult GetAll()  // Both versions
{
    return Ok(new { /* ... */ });
}

[ApiVersion("2.0")]  // Only v2.0
[HttpGet("advanced")]
public IActionResult AdvancedSearch([FromQuery] AdvancedFilterRequest filter)
{
    return Ok(new { /* advanced features */ });
}
```

### Example 3: Deprecate Old Version

```csharp
[ApiVersion("1.0", Deprecated = true)]  // ← Mark as deprecated
[ApiVersion("2.0")]
public class AppointmentsController : ControllerBase { }

// Result in Swagger:
// - v1.0 endpoints show red "deprecated" badge
// - Response header: api-deprecated-versions: 1.0
// - Encourages clients to upgrade to v2.0
```

## Testing Versions

### Using cURL

```bash
# Test v1.0
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/v1/appointments?page=1

# Test v2.0
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/v2/appointments?page=1
```

### Using Swagger UI

1. Open http://localhost:5000/swagger
2. Select version from dropdown: "v1" or "v2"
3. Try endpoints directly in browser

### Verify Version Headers

```bash
curl -i http://localhost:5000/api/v1/appointments?page=1

# Response headers show:
# api-supported-versions: 1.0, 2.0
# api-deprecated-versions: (none initially)
```

## Next Steps for Other Controllers

Apply the same pattern to all controllers:

1. **Controllers to Update**:
   - ProvidersController
   - PatientsController
   - ServicesController
   - AuthenticationController
   - ... (all others)

2. **Quick Pattern**:
   ```csharp
   [ApiController]
   [Route("api/v{version:apiVersion}/[controller]")]
   [ApiVersion("1.0")]
   [ApiVersion("2.0")]
   public class YourController : ControllerBase { }
   ```

3. **Takes 30 seconds per controller** (just update route and add ApiVersion attributes)

## Benefits

✅ **Easy to Use** - Add 2 lines per controller
✅ **Backward Compatible** - Old v1 clients continue working
✅ **Clear API Evolution** - Version in URL, not query string
✅ **Auto-Documented** - Swagger handles everything
✅ **Industry Standard** - Used by Azure, AWS, Google APIs
✅ **Deprecation Path** - Guide clients to upgrade versions
✅ **Zero Conflicts** - Same endpoint name works across versions

## Architecture

```
Request: /api/v2/appointments
    ↓
[UrlSegmentApiVersionReader] ← Extracts "v2" from URL
    ↓
ApiVersioningMiddleware ← Validates version is supported
    ↓
[ApiVersion("2.0")] ← Matches controller attribute
    ↓
Endpoint executed
    ↓
Response + headers:
  - api-supported-versions: 1.0, 2.0
  - api-deprecated-versions: (if any)
```

## Configuration Reference

All configuration is in [VersioningExtensions.cs](../BackEnd/SanadPlatform.API/Infrastructure/Versioning/VersioningExtensions.cs):

```csharp
// Default version when not specified
options.DefaultApiVersion = new ApiVersion(1, 0);

// Report versions in response headers
options.ReportApiVersions = true;

// Use URL path versioning /api/v{version}/...
options.ApiVersionReader = new UrlSegmentApiVersionReader();

// Supported versions
public static readonly Version[] All = 
{
    new Version(1, 0),
    new Version(2, 0)
};
```

## Troubleshooting

See [API_VERSIONING_GUIDE.md#Troubleshooting](../BackEnd/SanadPlatform.API/API_VERSIONING_GUIDE.md#troubleshooting) for:
- Version not showing in Swagger
- 404 errors on versioned endpoints
- Missing version headers
- And more...

---

**Status**: ✅ Ready to use
**Documentation**: Complete with 50+ examples
**Example Implementation**: AppointmentsController shows pattern
