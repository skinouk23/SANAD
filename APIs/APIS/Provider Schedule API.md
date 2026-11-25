
# Provider Schedule API

## Overview
Endpoints for managing provider daily schedules, weekly availability configurations, and specific blocked time slots.

---

## GET /api/v1/providers/me/schedule
**Description:** Retrieve the provider's daily schedule including statistics, appointments, and blocked slots

**Method:** `GET`

**Endpoint:** `/api/v1/providers/me/schedule`

**Authentication:** Required (Provider role)

### Query Parameters
```
date: ISO 8601 date (required) - The target date to fetch the schedule for (e.g., 2026-03-24)
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Daily schedule retrieved successfully",
  "data": {
    "stats": {
      "today": "number",
      "confirmed": "number",
      "pending": "number",
      "rejected": "number"
    },
    "appointments":[
      {
        "id": "uuid",
        "patientName": "string",
        "serviceName": "string",
        "startTime": "HH:MM",
        "durationMinutes": "number",
        "status": "pending | confirmed | provider_on_way | in_progress | completed | validated | cancelled | no_show | disputed",
        "location": "string",
        "isTeleconsultation": "boolean"
      }
    ],
    "blockedSlots":[
      {
        "id": "uuid",
        "date": "ISO 8601 date",
        "startTime": "HH:MM",
        "endTime": "HH:MM",
        "reason": "string (optional)"
      }
    ]
  },
  "errors": {}
}
```

---

## GET /api/v1/providers/me/schedule/availability
**Description:** Retrieve the provider's recurring weekly availability configuration

**Method:** `GET`

**Endpoint:** `/api/v1/providers/me/schedule/availability`

**Authentication:** Required (Provider role)

### Response (200 OK)
```json
{
  "success": true,
  "message": "Availability configuration retrieved successfully",
  "data":[
    {
      "dayOfWeek": "number (0-6)",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "isAvailable": "boolean"
    }
  ],
  "errors": {}
}
```

---

## POST /api/v1/providers/me/schedule/availability
**Description:** Update the provider's recurring weekly availability configuration

**Method:** `POST`

**Endpoint:** `/api/v1/providers/me/schedule/availability`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "availabilities":[
    {
      "dayOfWeek": "number (0-6, required)",
      "startTime": "HH:MM (required)",
      "endTime": "HH:MM (required)",
      "isAvailable": "boolean (required)"
    }
  ]
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Disponibilités hebdomadaires mises à jour.",
  "data": true,
  "errors": {}
}
```

---

## POST /api/v1/providers/me/schedule/block-slot
**Description:** Block a specific date and time slot to prevent new bookings

**Method:** `POST`

**Endpoint:** `/api/v1/providers/me/schedule/block-slot`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "date": "ISO 8601 date (required)",
  "startTime": "HH:MM (required)",
  "endTime": "HH:MM (required)",
  "reason": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Créneau bloqué avec succès.",
  "data": "uuid",
  "errors": {}
}
```

### Error Responses
**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "startTime": ["L'heure de début doit être antérieure à l'heure de fin."]
  }
}
```

**409 Conflict**
```json
{
  "success": false,
  "message": "Impossible de bloquer ce créneau, un rendez-vous confirmé existe déjà.",
  "data": null,
  "errors": {
    "schedule": ["Un rendez-vous confirmé chevauche cette plage horaire."]
  }
}
```

---

## DELETE /api/v1/providers/me/schedule/blocked-slots/:id
**Description:** Remove a blocked time slot to make it available for bookings again

**Method:** `DELETE`

**Endpoint:** `/api/v1/providers/me/schedule/blocked-slots/:id`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Blocked slot ID

### Response (200 OK)
```json
{
  "success": true,
  "message": "Créneau débloqué avec succès.",
  "data": true,
  "errors": {}
}
```

### Error Responses
**404 Not Found**
```json
{
  "success": false,
  "message": "Créneau introuvable ou vous n'avez pas les droits.",
  "data": null,
  "errors": {
    "id":["No blocked slot exists with this ID for the current provider"]
  }
}
```

---

## Functional Explanation

### Availability vs. Unavailability
The system uses a two-layered approach to calculate a provider's schedule:
1. **Recurring Availability (`provider_schedules` table)**: Acts as the base template. It defines the standard working hours for each day of the week (e.g., Monday 08:00 to 18:00).
2. **Exceptions / Blocked Slots (`provider_unavailability` table)**: Overrides the base template for specific dates. A provider can manually block time (e.g., a lunch break, a doctor's appointment, or a vacation day).

### Day of Week Mapping
The system maps days of the week using standard zero-based integer representation:
- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- `3` = Wednesday
- `4` = Thursday
- `5` = Friday
- `6` = Saturday

### Overlapping Prevention (Conflict Rule)
- When a provider attempts to block a slot (`POST /block-slot`), the system actively checks the `bookings` table for the target date.
- If any appointment with status `confirmed` exists and overlaps with the requested `startTime` and `endTime`, the system will reject the request with a `409 Conflict`.
- Pending or Cancelled appointments do not trigger a conflict and allow the slot to be blocked.

### Status Mapping for Statistics
The daily statistics return four counters based on the UI design:
- **today**: The total number of all appointments on the requested date regardless of their status.
- **confirmed**: Appointments with `status === 'confirmed'`.
- **pending**: Appointments with `status === 'pending'`.
- **rejected**: Appointments with `status === 'cancelled'`. (The UI displays "Rejected/Cancelled", mapped internally to the DB `cancelled` state).