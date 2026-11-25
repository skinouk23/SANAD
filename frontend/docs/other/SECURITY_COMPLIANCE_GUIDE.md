
# 🔒 Security & Compliance Guide
## Care@Home Tunisia — Sanad Platform

**Standards:** ISO 27001 | HIPAA | GDPR | INPDP (Tunisia) | ANCS (Tunisia)

---

## 📋 Compliance Matrix

| Control | ISO 27001 | HIPAA | GDPR | INPDP | ANCS | Implementation |
|---------|-----------|-------|------|-------|------|----------------|
| Input Sanitization (XSS) | A.14.2 | §164.312(c) | Art. 32 | Art. 7 | Directive 2019 | `utils/security.ts` |
| CSRF Protection | A.14.2 | §164.312(c) | Art. 32 | Art. 7 | Directive 2019 | `utils/security.ts` + `api/client.ts` |
| SQL Injection Prevention | A.14.2 | §164.312(c) | Art. 32 | Art. 7 | Directive 2019 | `utils/security.ts` |
| Encrypted Storage | A.10.1 | §164.312(a)(2)(iv) | Art. 32 | Art. 7 | Directive 2019 | `utils/secure-storage.ts` |
| Session Management | A.9.4 | §164.312(a)(2)(iii) | Art. 32 | Art. 7 | Directive 2019 | `contexts/AuthContext.tsx` |
| Rate Limiting | A.9.4.2 | §164.312(a)(1) | Art. 32 | Art. 7 | Directive 2019 | `utils/security.ts` |
| Audit Logging | A.12.4 | §164.312(b) | Art. 30 | Art. 7 | Directive 2019 | `utils/audit-logger.ts` |
| Data Masking (PHI/PII) | A.8.2 | Safe Harbor | Art. 25 | Art. 27 | Directive 2019 | `utils/security.ts` |
| Consent Management | - | §164.508 | Art. 6-7 | Art. 27-28 | - | `utils/consent-manager.ts` |
| Input Validation | A.14.2 | §164.312(c) | Art. 32 | Art. 7 | Directive 2019 | `utils/input-validation.ts` |
| Password Policy | A.9.4.3 | §164.312(d) | Art. 32 | Art. 7 | Directive 2019 | `utils/input-validation.ts` |
| Device Fingerprinting | A.9.4 | §164.312(d) | Art. 32 | Art. 7 | Directive 2019 | `utils/security.ts` |
| Sensitive Data Redaction | A.12.4 | §164.528 | Art. 25 | Art. 27 | Directive 2019 | `utils/security.ts` |
| File Upload Validation | A.14.2 | §164.312(c) | Art. 32 | Art. 7 | Directive 2019 | `utils/security.ts` |
| API Security Headers | A.14.1 | §164.312(e) | Art. 32 | Art. 7 | Directive 2019 | `api/client.ts` |
| Error Boundary (no data leak) | A.12.4 | §164.312(c) | Art. 32 | Art. 7 | Directive 2019 | `App.tsx` |

---

## 🏗️ Security Architecture

### Files Created/Modified

| File | Purpose | Standards |
|------|---------|-----------|
| `utils/security.ts` | XSS sanitization, CSRF, data masking, hashing, rate limiting, injection detection | All |
| `utils/secure-storage.ts` | AES-256-GCM encrypted browser storage, secure token management | ISO 27001, HIPAA, GDPR |
| `utils/input-validation.ts` | Email, password, phone, CIN, address, price validation | ISO 27001, OWASP |
| `utils/audit-logger.ts` | Client-side audit trail with buffered server sync | ISO 27001, HIPAA, GDPR |
| `utils/consent-manager.ts` | GDPR/INPDP consent tracking, health data authorization | GDPR, INPDP, HIPAA |
| `api/client.ts` | CSRF tokens, security headers, request sanitization, audit logging | All |
| `contexts/AuthContext.tsx` | Session timeout, rate limiting, activity monitoring, audit integration | All |

---

## 🔐 Security Controls Detail

### 1. XSS Prevention (OWASP A7)
```typescript
import { sanitizeHtml, sanitizeObject, stripHtmlTags, sanitizeUrl } from './utils/security'

// Sanitize user input before rendering
const safeName = sanitizeHtml(userInput)

// Sanitize entire objects (e.g., API responses)
const safeData = sanitizeObject(apiResponse)

// Validate URLs
const safeUrl = sanitizeUrl(userProvidedUrl)
```

### 2. CSRF Protection
```typescript
// Automatically added to POST/PUT/PATCH/DELETE requests via api/client.ts
// Token generated per session and stored in sessionStorage
import { getCsrfToken } from './utils/security'
```

### 3. Encrypted Storage (HIPAA PHI at rest)
```typescript
import { secureLocalStorage, secureSessionStorage } from './utils/secure-storage'

// Store sensitive data encrypted (AES-256-GCM)
await secureLocalStorage.setItem('patientData', { name: 'Fatma', diagnosis: '...' })

// Retrieve with automatic decryption
const data = await secureLocalStorage.getItem('patientData')

// Auto-expiration support
const token = await secureSessionStorage.getItem('auth_token', 30 * 60 * 1000) // 30 min max
```

### 4. Data Masking (HIPAA Safe Harbor / GDPR Pseudonymization)
```typescript
import { maskEmail, maskPhone, maskName, maskNationalId, redactSensitiveData } from './utils/security'

maskEmail('fatma@example.com')  // → "f***a@example.com"
maskPhone('+216 98 765 432')    // → "+216 ** *** *32"
maskName('Fatma Ben Ali')       // → "F*** B** A**"
maskNationalId('12345678')      // → "****5678"

// Redact sensitive fields before logging
const safeLog = redactSensitiveData(userData) // password, token, etc. → [REDACTED]
```

### 5. Session Security (HIPAA §164.312(a)(2)(iii))
- **30-minute inactivity timeout** (configurable)
- **24-hour absolute session limit**
- **Activity tracking** (mouse, keyboard, scroll, touch)
- **Session time remaining** exposed to UI for warning display
- **Automatic logout** with audit trail

### 6. Rate Limiting
```typescript
import { checkRateLimit } from './utils/security'

// Login: max 5 attempts per 15 minutes
if (!checkRateLimit('login_attempt', 5, 15 * 60 * 1000)) {
  // Show "too many attempts" message
}
```

### 7. Audit Logging (ISO 27001 A.12.4 / HIPAA §164.312(b))
```typescript
import { auditLogger } from './utils/audit-logger'

// Authentication events
auditLogger.logAuth('Login attempt', true, { method: 'email' })

// PHI access (HIPAA)
auditLogger.logPhiAccess('patient_record', 'PAT-001', 'Viewing appointment details')

// Data modifications
auditLogger.log('DATA_MODIFICATION', 'Updated patient address', {
  resource: 'patient',
  resourceId: 'PAT-001',
})

// Security events
auditLogger.logSecurityEvent('Suspicious login pattern detected', { ip: '...' })
```

### 8. Consent Management (GDPR Art. 6-7 / INPDP)
```typescript
import { consentManager } from './utils/consent-manager'

// Check consent before processing
if (consentManager.hasConsent('health_data')) {
  // Process health data
}

// Grant/revoke
consentManager.grantConsent('analytics', 'explicit')
consentManager.revokeConsent('marketing')

// HIPAA health data authorization
consentManager.grantHealthDataConsent('Treatment planning', ['diagnosis', 'medications'])

// GDPR data export
const exportData = consentManager.exportConsentData()

// GDPR right to erasure
consentManager.deleteConsentData()
```

### 9. Input Validation
```typescript
import { validateEmail, validatePassword, validatePhone, validateCIN } from './utils/input-validation'

const emailResult = validateEmail('user@example.com')
if (!emailResult.isValid) console.error(emailResult.error)

const pwdResult = validatePassword('MyP@ssw0rd')
// Enforces: 8+ chars, 3/4 complexity categories, no common passwords
```

---

## 🇹🇳 Tunisia-Specific Compliance

### INPDP (Instance Nationale de Protection des Données Personnelles)
- **Loi n°2004-63**: Personal data protection law
- Consent management implemented via `consent-manager.ts`
- Data subject rights (access, rectification, erasure) supported
- Cross-border transfer controls (consent required)
- Audit trail for all data processing activities

### ANCS (Agence Nationale de la Cybersécurité)
- **Directive 2019**: Cybersecurity requirements for digital platforms
- Input validation and sanitization (XSS, SQLi prevention)
- Encrypted data storage (AES-256-GCM)
- Session management with automatic timeout
- Security event logging and monitoring
- Rate limiting against brute force attacks
- CSRF protection on all state-changing operations

---

## 🏥 HIPAA Specific Controls

| HIPAA Rule | Requirement | Implementation |
|------------|-------------|----------------|
| §164.312(a)(1) | Access Control | Role-based routing (`ProviderRoute.tsx`), session management |
| §164.312(a)(2)(iii) | Automatic Logoff | 30-min inactivity timeout in `AuthContext.tsx` |
| §164.312(a)(2)(iv) | Encryption | AES-256-GCM in `secure-storage.ts` |
| §164.312(b) | Audit Controls | Full audit trail in `audit-logger.ts` |
| §164.312(c)(1) | Integrity | Input sanitization, CSRF protection |
| §164.312(d) | Authentication | MFA in login flow, device fingerprinting |
| §164.312(e)(1) | Transmission Security | HTTPS enforced, security headers |
| §164.508 | Authorization | Health data consent in `consent-manager.ts` |
| Safe Harbor | De-identification | Data masking utilities in `security.ts` |

---

## 🇪🇺 GDPR Specific Controls

| GDPR Article | Requirement | Implementation |
|--------------|-------------|----------------|
| Art. 5 | Data minimization | `redactSensitiveData()` for logging |
| Art. 6-7 | Lawful processing & consent | `consent-manager.ts` |
| Art. 17 | Right to erasure | `consentManager.deleteConsentData()` |
| Art. 20 | Data portability | `consentManager.exportConsentData()` |
| Art. 25 | Data protection by design | Encrypted storage, input validation |
| Art. 30 | Records of processing | Audit logger with event categorization |
| Art. 32 | Security of processing | Full security utility suite |
| Art. 33-34 | Breach notification | Audit events for security incidents |

---

## 🚀 Server-Side Requirements (Backend Team)

The frontend security layer must be complemented by server-side controls:

The frontend build currently injects a meta-delivered CSP for browser resource restrictions (`default-src`, `script-src`, `style-src`, `font-src`, `img-src`, `connect-src`, `base-uri`, and `form-action`). That improves resource loading constraints, but it does not enforce `frame-ancestors`.

Until this repository owns production hosting configuration, clickjacking protection is deployment-owned and must be delivered as an HTTP response header.

1. **HTTPS Only** — Enforce TLS 1.2+ with HSTS header
2. **CSP Headers** — Deployment must send the real `Content-Security-Policy` header. Include `frame-ancestors 'none'` or the approved framing allowlist there for clickjacking protection, and keep the header aligned with the repo's meta CSP resource restrictions.
3. **CORS** — Restrict to known origins only
4. **Rate Limiting** — Server-side rate limiting (complement client-side)
5. **JWT Validation** — Verify tokens on every request, short expiry
6. **Database Encryption** — Encrypt PHI at rest (AES-256)
7. **Audit Log Storage** — Receive and store client audit events
8. **VAPID Keys** — For push notification security
9. **Backup & Recovery** — ISO 27001 A.12.3
10. **Penetration Testing** — Annual OWASP-based testing

---

## 📊 Security Testing Checklist

- [ ] XSS: Test all input fields with `<script>alert(1)</script>`
- [ ] CSRF: Verify tokens on POST/PUT/DELETE requests
- [ ] SQLi: Test inputs with `' OR 1=1 --`
- [ ] Session: Verify 30-min timeout works
- [ ] Rate Limit: Verify login lockout after 5 attempts
- [ ] Storage: Verify localStorage is encrypted
- [ ] Audit: Verify events are logged for all auth actions
- [ ] Consent: Verify consent banner appears for new users
- [ ] Masking: Verify PHI is masked in UI where appropriate
- [ ] Headers: Verify security headers in API requests
- [ ] Passwords: Verify complexity requirements enforced
- [ ] File Upload: Verify type/size restrictions
