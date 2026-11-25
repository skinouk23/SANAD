# Appointments API

## Overview
Endpoints for managing appointments, bookings, and service validations.

---

## GET /api/appointments
**Description:** Get list of appointments with filters

**Method:** `GET`

**Endpoint:** `/api/appointments`

**Authentication:** Required

### Query Parameters
```
status: string (optional) - Filter by status (pending, confirmed, in_progress, completed, cancelled, no_show)
patientId: uuid (optional) - Filter by patient
providerId: uuid (optional) - Filter by provider
startDate: ISO 8601 date (optional) - Filter appointments from this date
endDate: ISO 8601 date (optional) - Filter appointments until this date
upcoming: boolean (optional) - Only future appointments
past: boolean (optional) - Only past appointments
page: number (optional, default: 1)
limit: number (optional, default: 10)
sortBy: string (optional, default: scheduledAt)
sortOrder: asc | desc (optional, default: asc)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "patientId": "uuid",
        "providerId": "uuid",
        "serviceId": "uuid",
        "patient": {
          "id": "uuid",
          "name": "string",
          "phone": "string",
          "avatar": "string"
        },
        "provider": {
          "id": "uuid",
          "name": "string",
          "specialty": "string",
          "rating": "number",
          "profilePictureUrl": "string"
        },
        "service": {
          "id": "uuid",
          "name": "string",
          "price": "number",
          "duration": "number"
        },
        "status": "pending | confirmed | in_progress | completed | cancelled | no_show",
        "type": "home | video | clinic",
        "scheduledAt": "ISO 8601 datetime",
        "duration": "number (minutes)",
        "price": "number",
        "totalPrice": "number",
        "address": "string",
        "notes": "string",
        "validationCode": "string",
        "validatedAt": "ISO 8601 datetime",
        "completedAt": "ISO 8601 datetime",
        "cancelledAt": "ISO 8601 datetime",
        "cancellationReason": "string",
        "rating": "number (1-5)",
        "review": "string",
        "createdAt": "ISO 8601 datetime",
        "updatedAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number",
      "hasNext": "boolean",
      "hasPrev": "boolean"
    }
  }
}
```

---

## GET /api/appointments/:id
**Description:** Get single appointment by ID

**Method:** `GET`

**Endpoint:** `/api/appointments/:id`

**Authentication:** Required

### URL Parameters
- `id` (uuid, required): Appointment ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Full appointment object (same structure as list item)
  }
}
```

---

## POST /api/appointments
**Description:** Create new appointment

**Method:** `POST`

**Endpoint:** `/api/appointments`

**Authentication:** Required (Patient role)

### Request Body
```json
{
  "providerId": "uuid (required)",
  "serviceId": "uuid (required)",
  "scheduledAt": "ISO 8601 datetime (required)",
  "type": "home | video | clinic (required)",
  "address": "string (required if type=home)",
  "notes": "string (optional)",
  "patientName": "string (optional, defaults to patient profile)",
  "patientPhone": "string (optional, defaults to patient profile)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    // Created appointment object
  },
  "message": "Appointment created successfully"
}
```

### Error Responses
**400 Bad Request**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TIME_SLOT",
    "message": "Selected time slot is not available",
    "statusCode": 400
  }
}
```

**409 Conflict**
```json
{
  "success": false,
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "Provider is not available at the selected time",
    "statusCode": 409
  }
}
```

---

## PATCH /api/appointments/:id
**Description:** Update appointment details

**Method:** `PATCH`

**Endpoint:** `/api/appointments/:id`

**Authentication:** Required

### URL Parameters
- `id` (uuid, required): Appointment ID

### Request Body
```json
{
  "scheduledAt": "ISO 8601 datetime (optional)",
  "address": "string (optional)",
  "notes": "string (optional)",
  "status": "string (optional, admin/provider only)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated appointment object
  },
  "message": "Appointment updated successfully"
}
```

---

## POST /api/appointments/:id/confirm
**Description:** Confirm appointment (Provider action)

**Method:** `POST`

**Endpoint:** `/api/appointments/:id/confirm`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Appointment ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "confirmed",
    "validationCode": "string (4-digit code)",
    "updatedAt": "ISO 8601 datetime"
  },
  "message": "Appointment confirmed. Validation code generated."
}
```

---

## POST /api/appointments/:id/start
**Description:** Start appointment service (Provider action)

**Method:** `POST`

**Endpoint:** `/api/appointments/:id/start`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Appointment ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "in_progress",
    "serviceStartedAt": "ISO 8601 datetime"
  },
  "message": "Service started"
}
```

---

## POST /api/appointments/:id/complete
**Description:** Complete appointment with validation code (Patient action)

**Method:** `POST`

**Endpoint:** `/api/appointments/:id/complete`

**Authentication:** Required (Patient role)

### URL Parameters
- `id` (uuid, required): Appointment ID

### Request Body
```json
{
  "validationCode": "string (required, 4-digit code)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "validatedAt": "ISO 8601 datetime",
    "completedAt": "ISO 8601 datetime"
  },
  "message": "Service validated successfully. Payment released to provider."
}
```

### Error Responses
**400 Bad Request**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_VALIDATION_CODE",
    "message": "Validation code is incorrect",
    "statusCode": 400
  }
}
```

---

## POST /api/appointments/:id/cancel
**Description:** Cancel appointment

**Method:** `POST`

**Endpoint:** `/api/appointments/:id/cancel`

**Authentication:** Required

### URL Parameters
- `id` (uuid, required): Appointment ID

### Request Body
```json
{
  "reason": "string (required)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "cancelled",
    "cancelledAt": "ISO 8601 datetime",
    "cancellationReason": "string",
    "refundAmount": "number (if applicable)"
  },
  "message": "Appointment cancelled successfully"
}
```

---

## POST /api/appointments/:id/rate
**Description:** Rate completed appointment (Patient action)

**Method:** `POST`

**Endpoint:** `/api/appointments/:id/rate`

**Authentication:** Required (Patient role)

### URL Parameters
- `id` (uuid, required): Appointment ID

### Request Body
```json
{
  "rating": "number (required, 1-5)",
  "review": "string (optional)",
  "professionalismRating": "number (optional, 1-5)",
  "punctualityRating": "number (optional, 1-5)",
  "qualityRating": "number (optional, 1-5)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": "number",
    "review": "string",
    "updatedAt": "ISO 8601 datetime"
  },
  "message": "Review submitted successfully"
}
```

---

## GET /api/appointments/upcoming
**Description:** Get upcoming appointments for current user

**Method:** `GET`

**Endpoint:** `/api/appointments/upcoming`

**Authentication:** Required

### Query Parameters
```
limit: number (optional, default: 10)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    // Array of appointment objects with status: pending or confirmed
  ]
}
```

---

## GET /api/appointments/past
**Description:** Get past appointments for current user

**Method:** `GET`

**Endpoint:** `/api/appointments/past`

**Authentication:** Required

### Query Parameters
```
limit: number (optional, default: 10)
page: number (optional, default: 1)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    // Array of appointment objects with status: completed, cancelled, or no_show
  ]
}
```

---

## GET /api/appointments/today
**Description:** Get today's appointments for provider

**Method:** `GET`

**Endpoint:** `/api/appointments/today`

**Authentication:** Required (Provider role)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    // Array of today's appointments sorted by time
  ]
}
```

---

## GET /api/appointments/stats
**Description:** Get appointment statistics

**Method:** `GET`

**Endpoint:** `/api/appointments/stats`

**Authentication:** Required

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "total": "number",
    "completed": "number",
    "pending": "number",
    "confirmed": "number",
    "cancelled": "number",
    "noShow": "number",
    "todayCount": "number",
    "weekCount": "number",
    "completionRate": "number (percentage)"
  }
}
```

---

## Functional Explanation

### Appointment Lifecycle
1. **Creation (pending)**: Patient books appointment with provider
2. **Confirmation (confirmed)**: Provider accepts and generates validation code
3. **In Progress (in_progress)**: Provider marks service as started
4. **Completion (completed)**: Patient validates service with code, payment released
5. **Cancellation (cancelled)**: Either party cancels with reason

### Validation System
- **Purpose**: Ensures service was actually delivered before payment release
- **Flow**: 
  1. Provider confirms appointment → System generates 4-digit code
  2. Provider shares code with patient after service completion
  3. Patient enters code in app → Payment released from escrow
  4. If not validated within 48 hours → Auto-validation triggers

### Payment Escrow
- Patient payment held in escrow upon booking
- Released to provider only after:
  - Patient validation with code, OR
  - Auto-validation after 48 hours
- Refunded if cancelled before service start

### Cancellation Policy
- **Free cancellation**: More than 24 hours before appointment
- **Partial refund**: 12-24 hours before (50% fee)
- **No refund**: Less than 12 hours before
- **Provider cancellation**: Full refund to patient

### Status Transitions
```
pending → confirmed → in_progress → completed
pending → cancelled
confirmed → cancelled
```

### Notifications
System sends notifications for:
- Appointment confirmation
- Reminder (24 hours before)
- Provider on the way
- Service started
- Validation reminder
- Auto-validation warning
- Completion confirmation
