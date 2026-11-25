# Provider Profile API

## Overview
Endpoints for managing provider profiles, availability, services, and performance metrics.

---

## GET /api/providers/me
**Description:** Get current provider profile

**Method:** `GET`

**Endpoint:** `/api/providers/me`

**Authentication:** Required (Provider role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "serviceType": "nursing | physio | nutrition | laboratory | radiology | pharmacy | ambulance | equipment | gym",
    "businessName": "string",
    "firstName": "string",
    "lastName": "string",
    "licenseNumber": "string",
    "specialization": "string",
    "yearsOfExperience": "number",
    "bio": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "serviceRadius": "number (km)",
    "rating": "number (0-5)",
    "totalReviews": "number",
    "totalBookings": "number",
    "isApproved": "boolean",
    "approvalDate": "ISO 8601 datetime",
    "subscriptionTier": "basic | premium | elite",
    "profilePictureUrl": "string",
    "coverImageUrl": "string",
    "isOnline": "boolean",
    "lastOnlineAt": "ISO 8601 datetime",
    "completionRate": "number (percentage)",
    "responseRate": "number (percentage)",
    "averageResponseTimeMinutes": "number",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

## PUT /api/providers/me
**Description:** Update current provider profile

**Method:** `PUT`

**Endpoint:** `/api/providers/me`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "businessName": "string (optional)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "specialization": "string (optional)",
  "bio": "string (optional)",
  "address": "string (optional)",
  "city": "string (optional)",
  "postalCode": "string (optional)",
  "serviceRadius": "number (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated provider profile
  },
  "message": "Profile updated successfully"
}
```

---

## POST /api/providers/me/availability/toggle
**Description:** Toggle provider online/offline status

**Method:** `POST`

**Endpoint:** `/api/providers/me/availability/toggle`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "isAvailable": "boolean (required)",
  "reason": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "isOnline": "boolean",
    "lastOnlineAt": "ISO 8601 datetime",
    "statusChangedAt": "ISO 8601 datetime"
  },
  "message": "Availability status updated"
}
```

---

## GET /api/providers/me/availability/history
**Description:** Get provider availability status history

**Method:** `GET`

**Endpoint:** `/api/providers/me/availability/history`

**Authentication:** Required (Provider role)

### Query Parameters
```
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "isAvailable": "boolean",
      "statusChangedAt": "ISO 8601 datetime",
      "reason": "string",
      "changedBy": "uuid"
    }
  ]
}
```

---

## GET /api/providers/me/schedule
**Description:** Get provider weekly schedule

**Method:** `GET`

**Endpoint:** `/api/providers/me/schedule`

**Authentication:** Required (Provider role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "monday": {
      "enabled": "boolean",
      "slots": [
        {
          "start": "HH:MM",
          "end": "HH:MM"
        }
      ]
    },
    "tuesday": { /* same structure */ },
    "wednesday": { /* same structure */ },
    "thursday": { /* same structure */ },
    "friday": { /* same structure */ },
    "saturday": { /* same structure */ },
    "sunday": { /* same structure */ }
  }
}
```

---

## PUT /api/providers/me/schedule
**Description:** Update provider weekly schedule

**Method:** `PUT`

**Endpoint:** `/api/providers/me/schedule`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "monday": {
    "enabled": "boolean",
    "slots": [
      {
        "start": "HH:MM",
        "end": "HH:MM"
      }
    ]
  },
  // ... other days
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated schedule
  },
  "message": "Schedule updated successfully"
}
```

---

## GET /api/providers/me/unavailability
**Description:** Get provider unavailability periods (vacations, breaks)

**Method:** `GET`

**Endpoint:** `/api/providers/me/unavailability`

**Authentication:** Required (Provider role)

### Query Parameters
```
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "startDate": "ISO 8601 date",
      "endDate": "ISO 8601 date",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "reason": "string",
      "isAllDay": "boolean",
      "createdAt": "ISO 8601 datetime"
    }
  ]
}
```

---

## POST /api/providers/me/unavailability
**Description:** Add unavailability period

**Method:** `POST`

**Endpoint:** `/api/providers/me/unavailability`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "startDate": "ISO 8601 date (required)",
  "endDate": "ISO 8601 date (required)",
  "startTime": "HH:MM (optional)",
  "endTime": "HH:MM (optional)",
  "reason": "string (optional)",
  "isAllDay": "boolean (optional, default: true)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    // Created unavailability period
  },
  "message": "Unavailability period added"
}
```

---

## DELETE /api/providers/me/unavailability/:id
**Description:** Remove unavailability period

**Method:** `DELETE`

**Endpoint:** `/api/providers/me/unavailability/:id`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Unavailability period ID

### Response (200 OK)
```json
{
  "success": true,
  "message": "Unavailability period removed"
}
```

---

## GET /api/providers/me/services
**Description:** Get provider's services

**Method:** `GET`

**Endpoint:** `/api/providers/me/services`

**Authentication:** Required (Provider role)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "name": "string",
      "description": "string",
      "category": "string",
      "price": "number",
      "duration": "number (minutes)",
      "location": "home | clinic | both",
      "isActive": "boolean",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```

---

## POST /api/providers/me/services
**Description:** Add new service

**Method:** `POST`

**Endpoint:** `/api/providers/me/services`

**Authentication:** Required (Provider role)

### Request Body
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "category": "string (required)",
  "price": "number (required)",
  "duration": "number (required, minutes)",
  "location": "home | clinic | both (required)",
  "isActive": "boolean (optional, default: true)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    // Created service
  },
  "message": "Service added successfully"
}
```

---

## PUT /api/providers/me/services/:id
**Description:** Update service

**Method:** `PUT`

**Endpoint:** `/api/providers/me/services/:id`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Service ID

### Request Body
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "duration": "number (optional)",
  "isActive": "boolean (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated service
  },
  "message": "Service updated successfully"
}
```

---

## DELETE /api/providers/me/services/:id
**Description:** Delete service

**Method:** `DELETE`

**Endpoint:** `/api/providers/me/services/:id`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Service ID

### Response (200 OK)
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## GET /api/providers/me/stats
**Description:** Get provider performance statistics

**Method:** `GET`

**Endpoint:** `/api/providers/me/stats`

**Authentication:** Required (Provider role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalAppointments": "number",
    "completedAppointments": "number",
    "cancelledAppointments": "number",
    "totalRevenue": "number",
    "pendingRevenue": "number",
    "thisWeekRevenue": "number",
    "thisMonthRevenue": "number",
    "averageRating": "number",
    "responseRate": "number (percentage)",
    "completionRate": "number (percentage)",
    "averageResponseTimeMinutes": "number",
    "todayAppointments": "number",
    "weekAppointments": "number"
  }
}
```

---

## GET /api/providers/me/reviews
**Description:** Get provider reviews

**Method:** `GET`

**Endpoint:** `/api/providers/me/reviews`

**Authentication:** Required (Provider role)

### Query Parameters
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
minRating: number (optional, 1-5)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "bookingId": "uuid",
        "patientId": "uuid",
        "patient": {
          "name": "string",
          "avatar": "string"
        },
        "rating": "number (1-5)",
        "comment": "string",
        "professionalismRating": "number (1-5)",
        "punctualityRating": "number (1-5)",
        "qualityRating": "number (1-5)",
        "providerResponse": "string",
        "providerRespondedAt": "ISO 8601 datetime",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    },
    "summary": {
      "averageRating": "number",
      "totalReviews": "number",
      "ratingDistribution": {
        "5": "number",
        "4": "number",
        "3": "number",
        "2": "number",
        "1": "number"
      }
    }
  }
}
```

---

## POST /api/providers/me/reviews/:id/respond
**Description:** Respond to a review

**Method:** `POST`

**Endpoint:** `/api/providers/me/reviews/:id/respond`

**Authentication:** Required (Provider role)

### URL Parameters
- `id` (uuid, required): Review ID

### Request Body
```json
{
  "response": "string (required)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "providerResponse": "string",
    "providerRespondedAt": "ISO 8601 datetime"
  },
  "message": "Response posted successfully"
}
```

---

## Functional Explanation

### Provider Profile Management
Providers maintain comprehensive profiles including:
1. **Business Information**: Name, license, specialization, experience
2. **Service Area**: Location and service radius for home visits
3. **Verification Status**: License verification and approval status
4. **Subscription Tier**: Basic, Premium, or Elite with different features

### Availability Management
**Online/Offline Status:**
- Real-time availability toggle
- Automatic offline after inactivity
- Status history tracking for analytics

**Weekly Schedule:**
- Define recurring availability by day
- Multiple time slots per day
- Easy schedule updates

**Unavailability Periods:**
- Block specific dates (vacations, training)
- Partial day blocks (appointments, breaks)
- Automatic booking prevention during unavailable periods

### Service Management
Providers can:
1. **Add Services**: Define offerings with pricing and duration
2. **Categorize**: Organize services by type
3. **Set Locations**: Home visit, clinic, or both
4. **Activate/Deactivate**: Control service visibility
5. **Update Pricing**: Adjust rates as needed

### Performance Metrics
System tracks:
1. **Completion Rate**: Percentage of appointments completed vs cancelled
2. **Response Rate**: How quickly provider responds to bookings
3. **Average Rating**: Overall customer satisfaction score
4. **Revenue Metrics**: Total, pending, and period-based earnings
5. **Appointment Volume**: Daily, weekly, monthly statistics

### Review Management
Providers can:
1. **View All Reviews**: See patient feedback with ratings
2. **Respond to Reviews**: Post public responses
3. **Track Rating Trends**: Monitor rating distribution
4. **Identify Improvements**: Analyze feedback patterns

### Subscription Tiers
**Basic (Free):**
- Profile listing
- Standard commission (15%)
- Basic analytics

**Premium:**
- Reduced commission (12%)
- Priority listing
- Advanced analytics
- Marketing tools

**Elite:**
- Lowest commission (10%)
- Top placement
- Dedicated support
- Premium marketing budget
