# API Versioning - Quick Reference

## 🚀 How to Add Versioning to Your Controllers

### 1. Update Route (ONE LINE)

```csharp
// Before:
[Route("api/[controller]")]

// After:
[Route("api/v{version:apiVersion}/[controller]")]
```

### 2. Add Version Attributes (TWO LINES)

```csharp
[ApiVersion("1.0")]
[ApiVersion("2.0")]
```

### 3. Import (ONE LINE)

```csharp
using Asp.Versioning;
```

### Example: Complete Controller

```csharp
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using SanadPlatform.API.Infrastructure.Versioning;

namespace YourNamespace;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion(ApiVersions.V1_0)]
[ApiVersion(ApiVersions.V2_0)]
public class YourController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Works for both /api/v1/your and /api/v2/your
    }
}
```

## 📋 Endpoints with Versioning

```
GET /api/v1/appointments?page=1      → Routes to v1 endpoint
GET /api/v2/appointments?page=1      → Routes to v2 endpoint
GET /api/appointments?page=1         → Error 400 (version required)
```

## 📊 Testing Versions

### Swagger UI
1. Open: `http://localhost:5000/swagger`
2. Click dropdown: select "v1" or "v2"
3. Endpoints update based on selected version

### cURL
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/v1/appointments?page=1

curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/v2/appointments?page=1
```

## 🔄 Version-Specific Features

### Option 1: Same Endpoint, Both Versions
```csharp
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[HttpGet]
public IActionResult GetAll()
{
    // Shared implementation
}
```

### Option 2: Different Endpoints per Version
```csharp
[ApiVersion("1.0")]
[HttpGet("search")]
public IActionResult SearchV1([FromQuery] string query)
{
    // v1 implementation
}

[ApiVersion("2.0")]
[HttpGet("search")]
public IActionResult SearchV2([FromQuery] AdvancedFilter filter)
{
    // v2 implementation with more features
}
```

### Option 3: Version-Only Endpoints
```csharp
// Only exists in v2.0
[ApiVersion("2.0")]
[HttpGet("advanced")]
public IActionResult Advanced([FromQuery] AdvancedRequest req)
{
    // New feature in v2
}
```

## 🏷️ Mark as Deprecated

```csharp
[ApiVersion("1.0", Deprecated = true)]  // Show as deprecated
[ApiVersion("2.0")]
public class AppointmentsController : ControllerBase
{
    // v1 endpoints will show red "deprecated" badge in Swagger
}
```

## 📚 Response Headers

All responses include:
```
api-supported-versions: 1.0, 2.0
api-deprecated-versions: (none or list)
```

## ⚙️ Configuration

All setup is in **Program.cs**:
```csharp
// 1. Add versioning service
builder.Services.AddApiVersioningConfig();

// 2. Add Swagger versioning
builder.Services.AddSwaggerGen(c =>
{
    c.AddSwaggerGenVersioning();  // This handles everything
});

// 3. Update Swagger UI
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    options.SwaggerEndpoint("/swagger/v2/swagger.json", "API v2");
});
```

## 🎯 Constants (Use These!)

```csharp
using SanadPlatform.API.Infrastructure.Versioning;

// Instead of hardcoding "1.0", use constants:
[ApiVersion(ApiVersions.V1_0)]
[ApiVersion(ApiVersions.V2_0)]
```

## 🔧 Common Tasks

### Task: Add versioning to a new controller

**Time: 30 seconds**

1. Copy import line (add `using Asp.Versioning;`)
2. Update route: `[Route("api/v{version:apiVersion}/[controller]")]`
3. Add attributes: `[ApiVersion(ApiVersions.V1_0)] [ApiVersion(ApiVersions.V2_0)]`

Done! All endpoints now support v1 and v2.

### Task: Add v2-only endpoint

```csharp
[ApiVersion("2.0")]
[HttpGet("new-feature")]
public IActionResult NewFeature()
{
    // Only exists in /api/v2/appointments/new-feature
}
```

### Task: Version-specific response types

```csharp
[HttpGet]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
public IActionResult Get()
{
    var data = GetData();
    
    // Response can be different per version
    // Swagger shows correct type for each version
    return Ok(data);
}
```

## 🧪 Testing Checklist

- [ ] All v1 endpoints respond at `/api/v1/...`
- [ ] All v2 endpoints respond at `/api/v2/...`
- [ ] Swagger shows both v1 and v2 tabs
- [ ] Version headers present in responses
- [ ] Deprecated endpoints marked in Swagger
- [ ] Old clients still work with v1
- [ ] New clients can use v2

## 📖 Full Documentation

See **API_VERSIONING_GUIDE.md** for:
- Complete implementation patterns
- Best practices
- Deprecation strategy
- Migration checklist
- Troubleshooting guide

## 🚨 Gotchas

### ❌ Don't: Hardcode version in many places
```csharp
[ApiVersion("1.0")]  // ❌ Brittle
```

### ✅ Do: Use constants
```csharp
[ApiVersion(ApiVersions.V1_0)]  // ✅ Centralized, easy to update
```

### ❌ Don't: Forget to update the route
```csharp
[Route("api/[controller]")]  // ❌ Won't work with versioning
```

### ✅ Do: Include {version} placeholder
```csharp
[Route("api/v{version:apiVersion}/[controller]")]  // ✅ Required
```

---

**Status**: ✅ Ready to use
**Example**: AppointmentsController shows pattern
