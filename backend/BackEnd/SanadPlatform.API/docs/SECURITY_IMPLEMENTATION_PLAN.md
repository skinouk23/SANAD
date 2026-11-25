# Security Implementation Plan

## Overview
The `Infrastructure/Security` folder is currently empty and needs comprehensive security implementations to protect the Sanad Platform healthcare marketplace. This document outlines all necessary security components.

## Current Security Status

### ✅ Already Implemented
- JWT Authentication (Bearer token scheme)
- JWT Token Validation (issuer, audience, lifetime, signing key)
- Authorization framework registered
- CORS policy for frontend communication
- Serilog for security event logging
- Global exception handling middleware
- Request logging middleware
- Health checks endpoint

### ❌ Need to Implement in Security Folder
1. **Encryption Service** - Data encryption/decryption
2. **Password Hashing Service** - Secure password handling
3. **Authorization Handlers** - Role-based access control (RBAC)
4. **Claims-based Authorization** - Granular permission management
5. **API Key Management** - Third-party API authentication
6. **Rate Limiting** - Prevent abuse and DDoS attacks
7. **HTTPS Enforcement** - SSL/TLS certificate handling
8. **CSRF Protection** - Cross-site request forgery prevention
9. **Data Sanitization** - XSS and injection attack prevention
10. **Audit Trail** - Security event tracking
11. **Two-Factor Authentication (2FA)** - Enhanced user security
12. **OAuth Integration** - Social login support
13. **JWT Refresh Token** - Token rotation strategy
14. **Password Policy** - Strong password requirements
15. **Session Management** - User session tracking

---

## Detailed Implementation Requirements

### 1. Encryption Service
**Purpose**: Encrypt sensitive data at rest (PII, health records, payment info)

**File**: `Infrastructure/Security/EncryptionService.cs`

```csharp
public interface IEncryptionService
{
    string Encrypt(string plainText);
    string Decrypt(string cipherText);
}

public class EncryptionService : IEncryptionService
{
    // Use AES-256-GCM for authenticated encryption
    // Methods: Encrypt(), Decrypt()
    // Key management from configuration
}
```

**Data to Encrypt**:
- Patient medical records (VitalSigns, NutritionProfiles)
- Payment information (Bank details, transaction data)
- Personal Identifiable Information (SSN, ID numbers)
- Sensitive communications

**Key Security Features**:
- Use AES-256-GCM (authenticated encryption)
- Unique IV (initialization vector) per encryption
- Secure key management from Azure Key Vault
- HMAC for authentication

---

### 2. Password Hashing Service
**Purpose**: Securely hash and verify user passwords

**File**: `Infrastructure/Security/PasswordHashingService.cs`

```csharp
public interface IPasswordHashingService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}

public class PasswordHashingService : IPasswordHashingService
{
    // Use bcrypt or Argon2 for password hashing
    // Methods: HashPassword(), VerifyPassword()
}
```

**Requirements**:
- Use bcrypt (currently standard) or Argon2 (next-gen)
- Configurable work factor (salt rounds)
- Constant-time comparison to prevent timing attacks
- Password strength validation

**Integration Points**:
- User registration
- Password change
- Password reset

---

### 3. Authorization Handlers
**Purpose**: Implement role-based access control (RBAC)

**File**: `Infrastructure/Security/AuthorizationHandlers.cs`

```csharp
public class RoleBasedAuthorizationHandler : AuthorizationHandler<RoleRequirement>
{
    // Handle [Authorize(Roles = "Admin,Provider")]
}

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    // Handle granular permissions
}
```

**Roles to Implement**:
- **Admin** - Platform administrators, full access
- **Provider** - Healthcare providers (nurses, doctors, ambulances)
- **Patient** - End users seeking healthcare
- **Support** - Customer support staff
- **SuperAdmin** - System administrators

**Permissions**:
- Create/Read/Update/Delete bookings
- Manage provider profile
- View payment history
- Access health records
- Manage subscriptions
- View analytics

---

### 4. Claims-based Authorization
**Purpose**: Fine-grained permission control

**File**: `Infrastructure/Security/ClaimsService.cs`

```csharp
public interface IClaimsService
{
    IEnumerable<Claim> GenerateClaims(User user);
    bool HasPermission(ClaimsPrincipal user, string permission);
}

public class ClaimsService : IClaimsService
{
    // Generate JWT claims based on user roles, permissions
    // Verify claims in requests
}
```

**Claims to Include in JWT**:
- `sub` (subject - UserId)
- `email` (user email)
- `role` (user role)
- `permissions` (array of permission codes)
- `country` (for localization)
- `subscription_tier` (subscription level)
- `provider_id` (if provider)
- `patient_id` (if patient)

**Examples**:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "doctor@sanad.tn",
  "role": "Provider",
  "permissions": ["booking:create", "booking:read", "profile:update"],
  "country": "TN",
  "subscription_tier": "premium"
}
```

---

### 5. API Key Management
**Purpose**: Authenticate third-party integrations and external services

**File**: `Infrastructure/Security/ApiKeyService.cs`

```csharp
public interface IApiKeyService
{
    Task<string> GenerateApiKeyAsync(Guid userId, string name);
    Task<bool> ValidateApiKeyAsync(string apiKey);
    Task<Guid?> GetUserIdFromApiKeyAsync(string apiKey);
    Task RevokeApiKeyAsync(string apiKey);
}

public class ApiKeyService : IApiKeyService
{
    // Generate secure API keys
    // Validate incoming API keys
    // Manage API key lifecycle
}
```

**Use Cases**:
- Mobile app authentication
- Third-party integrations (payment gateways, SMS providers)
- Partner APIs (insurance companies, health systems)
- IoT device communication

**API Key Storage**:
- Hash keys before storing
- Associate with permissions/scopes
- Track usage and expiration

---

### 6. Rate Limiting
**Purpose**: Prevent abuse, brute force attacks, and DDoS

**File**: `Infrastructure/Security/RateLimitingMiddleware.cs`

```csharp
public class RateLimitingMiddleware
{
    // Limit requests per IP/UserId
    // Different limits for different endpoints
    // Implement sliding window or token bucket algorithm
}
```

**Rate Limits to Implement**:
- **Authentication endpoints**: 5 attempts per minute per IP
- **Booking endpoints**: 10 requests per minute per user
- **General API endpoints**: 100 requests per minute per IP
- **Password reset**: 3 attempts per hour per email
- **OTP verification**: 5 attempts per 15 minutes

**Storage**:
- Use Redis for distributed rate limiting
- Fall back to in-memory cache if Redis unavailable

---

### 7. HTTPS Enforcement
**Purpose**: Ensure all communications are encrypted

**File**: `Infrastructure/Security/HttpsEnforcementMiddleware.cs`

```csharp
public class HttpsEnforcementMiddleware
{
    // Redirect HTTP to HTTPS
    // Set HSTS headers
    // Enforce certificate pinning
}
```

**Implementation Details**:
- HTTPS Redirection Middleware
- HSTS (HTTP Strict Transport Security) headers
- Minimum TLS 1.2
- Certificate pinning for sensitive endpoints

---

### 8. CSRF Protection
**Purpose**: Prevent Cross-Site Request Forgery attacks

**File**: `Infrastructure/Security/CsrfProtectionMiddleware.cs`

```csharp
public class CsrfProtectionMiddleware
{
    // Validate CSRF tokens on state-changing requests
    // Generate CSRF tokens for forms
}
```

**Implementation**:
- CSRF tokens in session/cookies
- Validate on POST/PUT/DELETE requests
- SameSite cookie attribute
- Custom header validation

---

### 9. Data Sanitization Service
**Purpose**: Prevent XSS and injection attacks

**File**: `Infrastructure/Security/DataSanitizationService.cs`

```csharp
public interface IDataSanitizationService
{
    string SanitizeHtml(string input);
    string SanitizeInput(string input);
    bool IsValidEmail(string email);
    bool IsValidPhoneNumber(string phone);
}

public class DataSanitizationService : IDataSanitizationService
{
    // Remove dangerous HTML/JavaScript
    // Validate input formats
    // SQL injection prevention
}
```

**Sanitization Rules**:
- Remove script tags
- Escape special characters
- Validate email/phone formats
- Parameterized SQL queries
- HTML entity encoding

---

### 10. Audit Trail Service
**Purpose**: Track security-relevant events

**File**: `Infrastructure/Security/AuditTrailService.cs`

```csharp
public interface IAuditTrailService
{
    Task LogSecurityEventAsync(SecurityEvent @event);
    Task<IEnumerable<SecurityEvent>> GetAuditTrailAsync(Guid userId, DateTime from, DateTime to);
}

public class AuditTrailService : IAuditTrailService
{
    // Log failed login attempts
    // Log permission changes
    // Log sensitive data access
    // Log suspicious activities
}
```

**Events to Track**:
- User login/logout
- Failed authentication attempts
- Permission changes
- Role changes
- Sensitive data access
- API key generation/revocation
- Password changes
- Two-factor authentication changes
- Provider verification status changes
- Suspicious activities (multiple failed logins, unusual access patterns)

---

### 11. Two-Factor Authentication (2FA)
**Purpose**: Add additional layer of security for user accounts

**File**: `Infrastructure/Security/TwoFactorAuthenticationService.cs`

**Methods**:
- TOTP (Time-based One-Time Password) - Google Authenticator
- SMS OTP - Text message codes
- Email OTP - Email verification codes

```csharp
public interface ITwoFactorAuthenticationService
{
    Task<string> GenerateTotpSecretAsync(Guid userId);
    Task<bool> VerifyTotpAsync(Guid userId, string code);
    Task SendSmsOtpAsync(Guid userId, string phoneNumber);
    Task SendEmailOtpAsync(Guid userId, string email);
    Task<bool> VerifyOtpAsync(Guid userId, string code);
}
```

**2FA Implementation**:
- Provider registration/update requires 2FA
- High-risk operations trigger 2FA
- Backup codes for recovery
- Session persistence after 2FA

---

### 12. OAuth Integration
**Purpose**: Support social login (Google, Facebook, Apple)

**File**: `Infrastructure/Security/OAuthService.cs`

```csharp
public interface IOAuthService
{
    Task<OAuthToken> AuthenticateWithGoogleAsync(string code);
    Task<OAuthToken> AuthenticateWithFacebookAsync(string code);
    Task<OAuthToken> AuthenticateWithAppleAsync(string code);
}
```

**Supported Providers**:
- Google OAuth 2.0
- Facebook Login
- Apple Sign In

**Integration**:
- Link OAuth accounts to existing profiles
- Create accounts via OAuth
- Secure token exchange
- State parameter validation

---

### 13. JWT Refresh Token Service
**Purpose**: Implement secure token rotation

**File**: `Infrastructure/Security/JwtRefreshTokenService.cs`

```csharp
public interface IJwtRefreshTokenService
{
    Task<(string accessToken, string refreshToken)> RefreshTokenAsync(string refreshToken);
    Task RevokeTokenAsync(Guid userId);
}

public class JwtRefreshTokenService : IJwtRefreshTokenService
{
    // Issue short-lived access tokens (15 min)
    // Issue longer-lived refresh tokens (7 days)
    // Rotate refresh tokens on use
    // Revoke tokens on logout
}
```

**Token Strategy**:
- **Access Token**: 15 minutes validity, includes permissions
- **Refresh Token**: 7 days validity, single-use
- **Token Rotation**: New refresh token on each refresh
- **Token Revocation**: Blacklist after logout or compromise

---

### 14. Password Policy Service
**Purpose**: Enforce strong password requirements

**File**: `Infrastructure/Security/PasswordPolicyService.cs`

```csharp
public interface IPasswordPolicyService
{
    PasswordPolicyResult ValidatePassword(string password);
    Task<bool> CheckPasswordHistoryAsync(Guid userId, string password);
}

public class PasswordPolicyService : IPasswordPolicyService
{
    // Minimum length: 12 characters
    // Require uppercase, lowercase, digits, special chars
    // Prevent common passwords
    // Check password history (last 5)
    // Expiration: 90 days
}
```

**Requirements**:
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character (!@#$%^&*)
- Not common/leaked passwords
- Cannot reuse last 5 passwords
- Password expires every 90 days

---

### 15. Session Management Service
**Purpose**: Track and manage user sessions

**File**: `Infrastructure/Security/SessionManagementService.cs`

```csharp
public interface ISessionManagementService
{
    Task CreateSessionAsync(Guid userId, string deviceInfo);
    Task InvalidateSessionAsync(Guid sessionId);
    Task InvalidateAllSessionsAsync(Guid userId);
    Task<IEnumerable<UserSession>> GetActiveSessions(Guid userId);
    Task<bool> IsSessionValidAsync(Guid sessionId);
}
```

**Session Features**:
- Track device information
- Track login location/IP
- Limit concurrent sessions (e.g., 5 per user)
- Detect suspicious sessions
- Force logout on other devices
- Track last activity time
- Auto-logout on inactivity (30 minutes)

---

## Implementation Priority

### Phase 1 (Critical - Week 1)
1. ✅ JWT/Authentication (already configured)
2. Password Hashing Service
3. Authorization Handlers
4. Data Sanitization Service
5. HTTPS Enforcement

### Phase 2 (High - Week 2)
6. Encryption Service (for PII and health data)
7. Rate Limiting Middleware
8. Audit Trail Service
9. Session Management Service
10. API Key Management

### Phase 3 (Medium - Week 3)
11. JWT Refresh Token Service
12. Password Policy Service
13. CSRF Protection
14. Claims-based Authorization

### Phase 4 (Nice-to-have - Week 4)
15. Two-Factor Authentication
16. OAuth Integration

---

## Security Headers to Implement

Add to response headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Security Configuration (appsettings.json)

```json
{
  "SecuritySettings": {
    "EncryptionKey": "LOAD_FROM_AZURE_KEY_VAULT",
    "PasswordPolicy": {
      "MinLength": 12,
      "MaxLength": 128,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireDigits": true,
      "RequireSpecialCharacters": true,
      "ExpiryDays": 90
    },
    "RateLimit": {
      "AuthenticationAttempts": 5,
      "AuthenticationWindow": "00:01:00",
      "GeneralLimit": 100,
      "GeneralWindow": "00:01:00"
    },
    "SessionManagement": {
      "InactivityTimeout": "00:30:00",
      "MaxConcurrentSessions": 5,
      "SessionExpiryDays": 7
    },
    "TwoFactorAuthentication": {
      "Enabled": true,
      "TimeStep": 30,
      "Window": 1
    }
  }
}
```

---

## Testing Requirements

### Security Unit Tests
- Password hashing (hash/verify)
- Encryption/decryption
- Authorization handlers
- Claims validation
- Data sanitization

### Integration Tests
- JWT authentication flow
- Refresh token rotation
- Rate limiting
- CSRF protection
- Session management

### Security Tests
- SQL injection attempts
- XSS payload testing
- CORS policy validation
- HTTPS enforcement
- Password policy validation

---

## Dependencies to Add

```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Google.Authenticator" Version="2.1.1" />
<PackageReference Include="HtmlSanitizer" Version="8.0.746" />
<PackageReference Include="AspNetCore.HealthChecks.Redis" Version="6.0.0" />
```

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ASP.NET Core Security Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [GDPR Compliance](https://gdpr-info.eu/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)

---

## Compliance Requirements

### GDPR (European users)
- Right to be forgotten
- Data portability
- Consent management
- Privacy by design

### HIPAA (Health data in US)
- Patient privacy (PHI)
- Audit trails
- Access controls
- Encryption at rest/transit

### Tunisia-specific
- Personal Data Protection Law
- Encryption requirements
- Local data residency
- Consumer protection

---

## Conclusion

The Security folder requires 15 core security implementations covering authentication, authorization, encryption, rate limiting, and compliance. Priority should be given to password hashing, encryption, and authorization handlers before production deployment.
