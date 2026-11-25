# Data In Transit Encryption Implementation Guide

## Overview

Data in transit encryption ensures that all sensitive data transmitted between the client and server is protected using HTTPS/TLS. This document describes the implementation of comprehensive data in transit security for the Sanad Platform API.

**Status:** ✅ IMPLEMENTED  
**Implementation Date:** 2024  
**Compliance:** HIPAA, GDPR, ISO 27001

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Components Implemented](#components-implemented)
3. [Configuration Guide](#configuration-guide)
4. [Security Headers](#security-headers)
5. [TLS/SSL Configuration](#tlsssl-configuration)
6. [Certificate Management](#certificate-management)
7. [Best Practices](#best-practices)
8. [Testing and Verification](#testing-and-verification)
9. [Compliance](#compliance)

---

## Architecture Overview

### Security Layers

```
┌─────────────────────────────────────────┐
│      Client Application (React)          │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  HTTPS/TLS 1.2+ Encryption Layer        │
│  - AES-256 Cipher Suites                │
│  - Perfect Forward Secrecy (PFS)        │
│  - Certificate Validation               │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Data In Transit Security Middleware    │
│  - Security Headers                     │
│  - HSTS Enforcement                     │
│  - Secure Cookie Configuration          │
│  - Response Cache Prevention            │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      ASP.NET Core Application           │
│  - JWT Bearer Authentication             │
│  - Authorization & Validation           │
│  - Data Processing                      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Database Encryption at Rest            │
│  - SQL Server TDE                       │
│  - AES-256-GCM for Sensitive Fields     │
└─────────────────────────────────────────┘
```

---

## Components Implemented

### 1. DataInTransitSecurityMiddleware

**Purpose:** Enforces security headers and TLS configuration for all HTTP responses.

**Location:** `Infrastructure/Security/DataInTransitSecurityMiddleware.cs`

**Features:**
- Automatic security header injection
- HTTPS enforcement logging
- Server information disclosure prevention
- Response caching prevention
- Secure cookie configuration

**Key Headers Added:**

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforce HTTPS for 1 year |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking attacks |
| `Content-Security-Policy` | Restrictive policy | Prevent injection attacks |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer information |
| `Permissions-Policy` | Disable unnecessary APIs | Prevent feature abuse |

### 2. CertificateValidationService

**Purpose:** Manages HTTPS/TLS certificate validation and certificate pinning.

**Location:** `Infrastructure/Security/CertificateValidationService.cs`

**Features:**
- Certificate expiration validation
- SSL policy error checking
- Certificate pinning support
- Certificate thumbprint management
- Detailed logging for compliance

**Methods:**
- `ValidateCertificate()` - Validates server certificates
- `GetPinnedCertificateThumbprints()` - Retrieves pinned certificates
- `PinCertificateThumbprint()` - Adds certificate to pin list
- `IsCertificatePinned()` - Checks if certificate is pinned

### 3. Program.cs Integration

**HTTPS Redirection:**
```csharp
app.UseDataInTransitSecurity(enforceHstsInProduction: !app.Environment.IsDevelopment());
```

**When to enable:**
- Always enabled in Production
- Optional in Development

---

## Configuration Guide

### appsettings.json

Add the following configuration to your `appsettings.json`:

```json
{
  "Security": {
    "DataInTransit": {
      "EnforceHsts": true,
      "HstsMaxAge": 31536000,
      "HstsIncludeSubDomains": true,
      "HstsPreload": true,
      "MinimumTlsVersion": "1.2",
      "EnforceSecureCookies": true,
      "EnableCertificatePinning": false
    },
    "CertificatePinning": {
      "Thumbprints": [
        "YOUR_CERTIFICATE_THUMBPRINT_HERE",
        "YOUR_BACKUP_CERTIFICATE_THUMBPRINT_HERE"
      ]
    }
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "SanadPlatform",
    "Audience": "SanadPlatformAPI",
    "ExpiryMinutes": 60
  },
  "CorsSettings": {
    "AllowedOrigins": ["https://yourdomain.com"]
  }
}
```

### Getting Certificate Thumbprints

**For Self-Signed Certificates:**
```powershell
# List all certificates in Personal store
Get-ChildItem -Path Cert:\LocalMachine\My

# Get specific thumbprint
$cert = Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object {$_.Subject -like "*SanadPlatform*"}
$cert.Thumbprint
```

**For Let's Encrypt Certificates:**
```bash
# Using OpenSSL
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -noout -fingerprint -sha1
```

---

## Security Headers

### HSTS (HTTP Strict Transport Security)

**Header:** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

**What it does:**
- Forces browsers to use HTTPS for 1 year (31536000 seconds)
- Prevents downgrade attacks
- Includes all subdomains
- Allows HSTS preload (https://hstspreload.org)

**Testing:**
```bash
curl -i https://your-api.com/health
# Look for the Strict-Transport-Security header
```

### CSP (Content Security Policy)

**Header:** `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; ...`

**What it does:**
- Restricts resource loading to same-origin
- Prevents inline script execution
- Blocks third-party script injection
- Prevents clickjacking attacks

### X-Frame-Options

**Header:** `X-Frame-Options: DENY`

**What it does:**
- Prevents framing in other websites
- Blocks clickjacking attacks
- Value options: DENY, SAMEORIGIN, ALLOW-FROM

### X-Content-Type-Options

**Header:** `X-Content-Type-Options: nosniff`

**What it does:**
- Prevents MIME-type sniffing
- Forces browsers to respect declared Content-Type
- Prevents execution of scripts disguised as other file types

---

## TLS/SSL Configuration

### Minimum TLS Version

The Kestrel server is configured to require **TLS 1.2 or higher:**

```csharp
httpsOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | 
                           System.Security.Authentication.SslProtocols.Tls13;
```

### Cipher Suites

Recommended modern cipher suites (configured at OS level):
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305

### Certificate Configuration

**For Azure/Cloud Deployment:**
```csharp
// Certificate from Key Vault
var certificateIdentifier = configuration["AzureKeyVault:CertificateIdentifier"];
// Use with Kestrel configuration
```

**For Docker Deployment:**
```dockerfile
# Copy certificate to container
COPY certificates/server.pfx /etc/ssl/certs/
# Reference in Program.cs with environment variable
```

---

## Certificate Management

### Certificate Pinning

**When to enable:** High-security environments (healthcare, financial)

**Configuration:**
```json
{
  "Security": {
    "CertificatePinning": {
      "Enabled": true,
      "Thumbprints": [
        "3E16VJsaSeri1ITFUcJGeX9BsqUDA82kwqESGaNN5d0=",
        "2Ey3Xr5BoZI/uQFw9H0G8Wc0x7WrHE5Y9yJ2K1N5O2s="
      ]
    }
  }
}
```

### Certificate Rotation

**Process:**
1. Obtain new certificate
2. Add thumbprint to `Thumbprints` array in configuration
3. Update Kestrel configuration with new certificate
4. Restart application
5. Verify certificate in use with `curl -v`
6. Remove old certificate thumbprint from configuration

**Monitoring:**
```csharp
// Check certificate expiration
var certificateExpiration = certificate.NotAfter;
if ((certificateExpiration - DateTime.UtcNow).TotalDays < 30)
{
    _logger.LogWarning("Certificate expiring in 30 days");
}
```

---

## Best Practices

### 1. Always Use HTTPS in Production
```csharp
// In production, HTTPS is enforced
app.UseDataInTransitSecurity(enforceHstsInProduction: true);
```

### 2. Secure Cookie Configuration
```csharp
// All cookies are configured with:
// - HttpOnly: Cannot be accessed via JavaScript
// - Secure: Only transmitted over HTTPS
// - SameSite=Strict: Prevents CSRF attacks
```

### 3. Security Headers
- All responses include security headers
- Headers are set automatically by middleware
- No manual header configuration needed

### 4. CORS Configuration
```csharp
// Only allow HTTPS origins
.WithOrigins("https://yourdomain.com")
// Not "http://yourdomain.com"
```

### 5. Sensitive Data Protection
```csharp
// Never log sensitive data
_logger.LogInformation("Request to {Path}", context.Request.Path);
// NOT: _logger.LogInformation("Password: {Password}", password);
```

### 6. Certificate Rotation
- Rotate certificates every 12 months
- Monitor certificate expiration dates
- Use automated renewal (Let's Encrypt)
- Test certificate updates in staging first

### 7. API Rate Limiting
```csharp
// Prevent DoS attacks
builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddFixedWindowLimiter(
        policyName: "default",
        options => options.PermitLimit = 100 with a Window of 1 minute);
});
```

---

## Testing and Verification

### Test HTTPS Enforcement

```bash
# Should redirect to HTTPS
curl -i http://your-api.com/health
# Should return 307 Temporary Redirect with Location: https://...

# Should work over HTTPS
curl -i https://your-api.com/health
# Should return 200 OK
```

### Verify Security Headers

```bash
# Check all security headers
curl -i https://your-api.com/health

# Should include:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Content-Security-Policy: default-src 'self'; ...
# Referrer-Policy: strict-origin-when-cross-origin
# Cache-Control: no-store, no-cache, must-revalidate
```

### Check TLS Version

```bash
# Verify minimum TLS 1.2
openssl s_client -connect your-api.com:443 -tls1_1
# Should fail (TLS 1.1 not supported)

openssl s_client -connect your-api.com:443 -tls1_2
# Should succeed

openssl s_client -connect your-api.com:443 -tls1_3
# Should succeed
```

### Test with Online Tools

- **SSL Labs:** https://www.ssllabs.com/ssltest/
- **Security Headers:** https://securityheaders.com
- **Mozilla Observatory:** https://observatory.mozilla.org

### Unit Tests

```csharp
[Fact]
public void DataInTransitSecurityMiddleware_AddSecurityHeaders()
{
    // Arrange
    var context = new DefaultHttpContext();
    var middleware = new DataInTransitSecurityMiddleware(
        next: httpContext => Task.CompletedTask,
        logger: LoggerFactory.Create(builder => { }).CreateLogger<DataInTransitSecurityMiddleware>()
    );

    // Act
    middleware.InvokeAsync(context).Wait();

    // Assert
    Assert.True(context.Response.Headers.ContainsKey("Strict-Transport-Security"));
    Assert.True(context.Response.Headers.ContainsKey("X-Content-Type-Options"));
    Assert.True(context.Response.Headers.ContainsKey("X-Frame-Options"));
}
```

---

## Compliance

### HIPAA Compliance

**Requirements Met:**
- ✅ Encryption in transit (TLS 1.2+)
- ✅ HTTPS enforcement
- ✅ Certificate validation
- ✅ Secure authentication (JWT)
- ✅ Audit logging (Serilog)
- ✅ Cookie security (HttpOnly, Secure, SameSite)

**Reference:** [HIPAA Security Rule - Technical Safeguards](https://www.hhs.gov/hipaa/for-professionals/security/index.html)

### GDPR Compliance

**Requirements Met:**
- ✅ Data in transit encryption
- ✅ Transport layer security (TLS)
- ✅ Appropriate technical measures (Article 32)
- ✅ Privacy by design

**Reference:** [GDPR Article 32 - Security of Processing](https://gdpr-info.eu/art-32-gdpr/)

### ISO 27001 Compliance

**Requirements Met:**
- ✅ A.10.2.1 User registration and access rights management
- ✅ A.14.1.1 Information security requirements
- ✅ A.14.2.5 Secure development, acceptance and deployment

---

## Troubleshooting

### HTTPS Not Working

```bash
# Check if certificate is installed
Get-ChildItem Cert:\LocalMachine\My | Select Thumbprint, Subject

# Verify certificate binding
netsh http show sslcert
```

### Certificate Pinning Issues

```csharp
// Disable temporarily for debugging
"Security": {
  "CertificatePinning": {
    "Enabled": false
  }
}
```

### HSTS Preload Issues

If browsers aren't recognizing HSTS:
1. Verify header is set: `curl -i https://your-api.com/health`
2. Wait 24-48 hours for browser cache update
3. Clear browser HSTS cache in chrome://net-internals/#hsts
4. Re-add to HSTS preload list: https://hstspreload.org

---

## Integration Checklist

- [ ] DataInTransitSecurityMiddleware added to Program.cs
- [ ] CertificateValidationService registered in DI container
- [ ] appsettings.json configured with TLS settings
- [ ] Certificate installed and bound to HTTPS endpoint
- [ ] CORS configuration updated to HTTPS only
- [ ] Environment variables set for production
- [ ] SSL/TLS certificate obtained (self-signed or CA)
- [ ] HSTS preload list submission considered
- [ ] Security headers verified with curl/online tools
- [ ] Application tested with https://www.ssllabs.com
- [ ] Load balancer/reverse proxy configured for TLS pass-through
- [ ] Monitoring/alerting set for certificate expiration
- [ ] Documentation updated
- [ ] Team trained on certificate management

---

## Additional Resources

- **OWASP:** https://owasp.org/www-community/attacks/Manipulation_of_Action
- **Mozilla SSL Configuration Generator:** https://ssl-config.mozilla.org/
- **NIST Guidelines:** https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf
- **RFC 6797 (HSTS):** https://tools.ietf.org/html/rfc6797
- **RFC 7231 (HTTP/1.1):** https://tools.ietf.org/html/rfc7231

---

## Support and Updates

For questions or updates, contact the security team or create an issue in the repository.

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Production Ready
