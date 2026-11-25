# Authentication API

## Overview
Authentication endpoints for user login, registration, and session management.

---

## POST /api/auth/login
**Description:** Authenticate user and obtain access token

**Method:** `POST`

**Endpoint:** `/api/auth/login`

**Authentication:** None (public)

### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional, default: false)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "role": "patient | provider | admin",
      "phone": "string",
      "avatar": "string (url)",
      "countryCode": "string (2-letter code)",
      "createdAt": "ISO 8601 datetime"
    },
    "token": "string (JWT token)",
    "refreshToken": "string",
    "expiresIn": "number (seconds)"
  },
  "message": "Login successful"
}
```

### Error Responses
**401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect",
    "statusCode": 401
  }
}
```

**429 Too Many Requests**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many login attempts. Please try again later.",
    "statusCode": 429
  }
}
```

---

## POST /api/auth/register
**Description:** Register a new user account

**Method:** `POST`

**Endpoint:** `/api/auth/register`

**Authentication:** None (public)

### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "phone": "string (required)",
  "city": "string (required)",
  "role": "patient | provider (required)",
  "serviceType": "string (required if role=provider)",
  "countryCode": "string (optional, default: TN)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "role": "patient | provider",
      "phone": "string",
      "countryCode": "string"
    },
    "token": "string (JWT token)",
    "message": "Registration successful. Please verify your email."
  }
}
```

### Error Responses
**400 Bad Request**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is already registered",
      "password": "Password must be at least 8 characters"
    },
    "statusCode": 400
  }
}
```

---

## POST /api/auth/logout
**Description:** Logout user and invalidate token

**Method:** `POST`

**Endpoint:** `/api/auth/logout`

**Authentication:** Required (Bearer token)

### Request Headers
```
Authorization: Bearer {token}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## POST /api/auth/refresh-token
**Description:** Refresh access token using refresh token

**Method:** `POST`

**Endpoint:** `/api/auth/refresh-token`

**Authentication:** None (uses refresh token)

### Request Body
```json
{
  "refreshToken": "string (required)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "token": "string (new JWT token)",
    "refreshToken": "string (new refresh token)",
    "expiresIn": "number (seconds)"
  }
}
```

---

## POST /api/auth/forgot-password
**Description:** Request password reset email

**Method:** `POST`

**Endpoint:** `/api/auth/forgot-password`

**Authentication:** None (public)

### Request Body
```json
{
  "email": "string (required)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## POST /api/auth/reset-password
**Description:** Reset password using reset token

**Method:** `POST`

**Endpoint:** `/api/auth/reset-password`

**Authentication:** None (uses reset token)

### Request Body
```json
{
  "token": "string (required, from email)",
  "newPassword": "string (required, min 8 chars)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## GET /api/auth/me
**Description:** Get current authenticated user information

**Method:** `GET`

**Endpoint:** `/api/auth/me`

**Authentication:** Required (Bearer token)

### Request Headers
```
Authorization: Bearer {token}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "role": "patient | provider | admin",
    "phone": "string",
    "avatar": "string",
    "countryCode": "string",
    "city": "string",
    "profileCompleted": "boolean",
    "isVerified": "boolean",
    "createdAt": "ISO 8601 datetime",
    "lastLogin": "ISO 8601 datetime"
  }
}
```

---

## Functional Explanation

### Authentication Flow
1. **Registration**: User provides credentials and profile information. System creates account and sends verification email.
2. **Login**: User provides email/password. System validates credentials and returns JWT token.
3. **Token Usage**: Client includes token in Authorization header for all authenticated requests.
4. **Token Refresh**: When token expires, client uses refresh token to obtain new access token.
5. **Logout**: Client calls logout endpoint to invalidate tokens.

### Security Features
- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Tokens**: Access tokens expire after 1 hour, refresh tokens after 7 days
- **Rate Limiting**: Login attempts limited to prevent brute force attacks
- **Email Verification**: New accounts require email verification before full access
- **Password Reset**: Secure token-based password reset flow

### Token Structure
JWT tokens contain:
- User ID
- Role (patient/provider/admin)
- Country code
- Issued at timestamp
- Expiration timestamp
