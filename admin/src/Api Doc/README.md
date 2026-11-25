# CareAtHome API Documentation

## Overview
Complete API documentation for the CareAtHome Tunisia healthcare marketplace platform.

---

## Table of Contents

### 1. [Authentication API](./01-authentication.md)
User authentication, registration, and session management.

**Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

---

### 2. [Patient Profile API](./02-patient-profile.md)
Patient profile management, preferences, family circle, and favorites.

**Endpoints:**
- `GET /api/patients/me` - Get patient profile
- `PUT /api/patients/me` - Update patient profile
- `GET /api/patients/me/preferences` - Get preferences
- `PUT /api/patients/me/preferences` - Update preferences
- `GET /api/patients/me/favorites` - Get favorite providers
- `POST /api/patients/me/favorites` - Add favorite provider
- `DELETE /api/patients/me/favorites/:providerId` - Remove favorite
- `GET /api/patients/me/family-circle` - Get family members
- `POST /api/patients/me/family-circle` - Add family member
- `DELETE /api/patients/me/family-circle/:memberId` - Remove family member
- `GET /api/patients/me/stats` - Get patient statistics

---

### 3. [Appointments API](./03-appointments.md)
Appointment booking, management, and validation.

**Endpoints:**
- `GET /api/appointments` - List appointments
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/:id` - Update appointment
- `POST /api/appointments/:id/confirm` - Confirm appointment (Provider)
- `POST /api/appointments/:id/start` - Start service (Provider)
- `POST /api/appointments/:id/complete` - Complete with validation (Patient)
- `POST /api/appointments/:id/cancel` - Cancel appointment
- `POST /api/appointments/:id/rate` - Rate appointment (Patient)
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `GET /api/appointments/past` - Get past appointments
- `GET /api/appointments/today` - Get today's appointments (Provider)
- `GET /api/appointments/stats` - Get appointment statistics

---

### 4. [Provider Profile API](./04-provider-profile.md)
Provider profile, availability, services, and performance management.

**Endpoints:**
- `GET /api/providers/me` - Get provider profile
- `PUT /api/providers/me` - Update provider profile
- `POST /api/providers/me/availability/toggle` - Toggle online/offline
- `GET /api/providers/me/availability/history` - Get availability history
- `GET /api/providers/me/schedule` - Get weekly schedule
- `PUT /api/providers/me/schedule` - Update weekly schedule
- `GET /api/providers/me/unavailability` - Get unavailability periods
- `POST /api/providers/me/unavailability` - Add unavailability
- `DELETE /api/providers/me/unavailability/:id` - Remove unavailability
- `GET /api/providers/me/services` - Get services
- `POST /api/providers/me/services` - Add service
- `PUT /api/providers/me/services/:id` - Update service
- `DELETE /api/providers/me/services/:id` - Delete service
- `GET /api/providers/me/stats` - Get provider statistics
- `GET /api/providers/me/reviews` - Get reviews
- `POST /api/providers/me/reviews/:id/respond` - Respond to review

---

### 5. [Transactions API](./05-transactions.md)
Payment processing, provider balance, and payouts.

**Endpoints:**
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create transaction
- `POST /api/transactions/:id/process` - Process transaction
- `POST /api/transactions/:id/complete` - Complete transaction
- `POST /api/transactions/:id/refund` - Refund transaction
- `GET /api/transactions/stats` - Get transaction statistics
- `GET /api/providers/:providerId/balance` - Get provider balance
- `POST /api/providers/:providerId/payout` - Request payout
- `GET /api/providers/:providerId/payouts` - Get payout history

---

### 6. [Admin API](./06-admin.md)
Platform administration, user management, and system configuration.

**Endpoints:**
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/status` - Update user status
- `GET /api/admin/providers/pending` - Get pending provider approvals
- `POST /api/admin/providers/:id/approve` - Approve provider
- `POST /api/admin/providers/:id/reject` - Reject provider
- `GET /api/admin/transactions` - List all transactions
- `GET /api/admin/fraud-alerts` - Get fraud alerts
- `POST /api/admin/fraud-alerts/:id/resolve` - Resolve fraud alert
- `GET /api/admin/settings` - Get platform settings
- `PUT /api/admin/settings` - Update platform settings
- `GET /api/admin/countries` - Get country instances
- `PUT /api/admin/countries/:countryCode` - Update country settings
- `GET /api/admin/system-health` - Get system health status
- `GET /api/admin/audit-logs` - Get audit logs

---

## API Conventions

### Base URL
```
Production: https://api.carehome.tn/v1
Staging: https://api-staging.carehome.tn/v1
Development: http://localhost:3000/api/v1
```

### Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

### Request Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
X-Country-Code: TN (optional, for multi-country support)
```

### Response Format
All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional error details */ },
    "statusCode": 400
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Pagination
Paginated endpoints accept these query parameters:
```
page: number (default: 1)
limit: number (default: 10, max: 100)
sortBy: string (default: createdAt)
sortOrder: asc | desc (default: desc)
```

Paginated responses include:
```json
{
  "items": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Date/Time Format
All dates and times use ISO 8601 format:
```
Date: 2025-01-15
DateTime: 2025-01-15T14:30:00Z
Time: 14:30:00
```

### Currency
All monetary amounts are in the local currency (TND, MAD, DZD, etc.) as decimal numbers:
```json
{
  "amount": 45.50,
  "currency": "TND"
}
```

### Filtering
Many list endpoints support filtering via query parameters:
```
status=completed
startDate=2025-01-01
endDate=2025-01-31
search=john
```

### Rate Limiting
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Login attempts**: 5 attempts per 15 minutes

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642089600
```

### Webhooks
The platform supports webhooks for real-time event notifications:
- Appointment status changes
- Payment completions
- Provider approvals
- Fraud alerts

Webhook configuration available in admin settings.

---

## Error Codes

### Authentication Errors
- `INVALID_CREDENTIALS` - Email or password incorrect
- `TOKEN_EXPIRED` - JWT token has expired
- `TOKEN_INVALID` - JWT token is malformed or invalid
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions

### Validation Errors
- `VALIDATION_ERROR` - Request data validation failed
- `REQUIRED_FIELD` - Required field missing
- `INVALID_FORMAT` - Field format invalid
- `INVALID_VALUE` - Field value out of range

### Resource Errors
- `NOT_FOUND` - Resource not found
- `ALREADY_EXISTS` - Resource already exists
- `CONFLICT` - Resource state conflict

### Business Logic Errors
- `INSUFFICIENT_BALANCE` - Insufficient funds
- `INVALID_TIME_SLOT` - Time slot not available
- `PROVIDER_UNAVAILABLE` - Provider not available
- `MINIMUM_PAYOUT_NOT_MET` - Payout below minimum
- `INVALID_VALIDATION_CODE` - Validation code incorrect

### System Errors
- `INTERNAL_ERROR` - Unexpected server error
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable
- `RATE_LIMIT_EXCEEDED` - Too many requests

---

## Support

For API support and questions:
- **Email**: dev@carehome.tn
- **Documentation**: https://docs.carehome.tn
- **Status Page**: https://status.carehome.tn

---

## Changelog

### Version 1.0.0 (2025-01-15)
- Initial API release
- Authentication endpoints
- Patient profile management
- Provider profile management
- Appointment booking and management
- Transaction and payment processing
- Admin dashboard and management
- Multi-country support
- Fraud detection system

---

## License
© 2025 CareAtHome Tunisia. All rights reserved.
