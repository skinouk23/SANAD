# Patient Profile API

## Overview
Endpoints for managing patient profile, preferences, family circle, and favorites.

---

## GET /api/patients/me
**Description:** Get current patient profile

**Method:** `GET`

**Endpoint:** `/api/patients/me`

**Authentication:** Required (Patient role)

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
    "userId": "uuid",
    "firstName": "string",
    "lastName": "string",
    "dateOfBirth": "ISO 8601 date",
    "gender": "male | female | other",
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "emergencyContact": {
      "name": "string",
      "phone": "string",
      "relationship": "string"
    },
    "medicalInfo": {
      "allergies": ["string"],
      "conditions": ["string"],
      "medications": ["string"]
    },
    "insuranceProvider": "string",
    "insuranceNumber": "string",
    "profilePictureUrl": "string",
    "careStreakDays": "number",
    "longestCareStreak": "number",
    "totalPoints": "number",
    "lastActivityDate": "ISO 8601 date",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

## PUT /api/patients/me
**Description:** Update current patient profile

**Method:** `PUT`

**Endpoint:** `/api/patients/me`

**Authentication:** Required (Patient role)

### Request Body
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "dateOfBirth": "ISO 8601 date (optional)",
  "gender": "male | female | other (optional)",
  "address": "string (optional)",
  "city": "string (optional)",
  "postalCode": "string (optional)",
  "emergencyContactName": "string (optional)",
  "emergencyContactPhone": "string (optional)",
  "emergencyContactRelationship": "string (optional)",
  "allergies": "string (optional)",
  "currentMedications": "string (optional)",
  "insuranceProvider": "string (optional)",
  "insuranceNumber": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated patient profile object
  },
  "message": "Profile updated successfully"
}
```

---

## GET /api/patients/me/preferences
**Description:** Get patient notification and privacy preferences

**Method:** `GET`

**Endpoint:** `/api/patients/me/preferences`

**Authentication:** Required (Patient role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "emailNotifications": "boolean",
    "smsNotifications": "boolean",
    "pushNotifications": "boolean",
    "marketingEmails": "boolean",
    "autoValidationEnabled": "boolean",
    "validationReminderHours": "number",
    "shareWithFamily": "boolean",
    "allowProviderMessages": "boolean",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

## PUT /api/patients/me/preferences
**Description:** Update patient preferences

**Method:** `PUT`

**Endpoint:** `/api/patients/me/preferences`

**Authentication:** Required (Patient role)

### Request Body
```json
{
  "emailNotifications": "boolean (optional)",
  "smsNotifications": "boolean (optional)",
  "pushNotifications": "boolean (optional)",
  "marketingEmails": "boolean (optional)",
  "autoValidationEnabled": "boolean (optional)",
  "validationReminderHours": "number (optional)",
  "shareWithFamily": "boolean (optional)",
  "allowProviderMessages": "boolean (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated preferences object
  },
  "message": "Preferences updated successfully"
}
```

---

## GET /api/patients/me/favorites
**Description:** Get patient's favorite providers

**Method:** `GET`

**Endpoint:** `/api/patients/me/favorites`

**Authentication:** Required (Patient role)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "patientId": "uuid",
      "providerId": "uuid",
      "provider": {
        "id": "uuid",
        "name": "string",
        "serviceType": "string",
        "specialties": ["string"],
        "rating": "number",
        "reviewCount": "number",
        "profilePictureUrl": "string",
        "city": "string"
      },
      "addedAt": "ISO 8601 datetime"
    }
  ]
}
```

---

## POST /api/patients/me/favorites
**Description:** Add provider to favorites

**Method:** `POST`

**Endpoint:** `/api/patients/me/favorites`

**Authentication:** Required (Patient role)

### Request Body
```json
{
  "providerId": "uuid (required)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "providerId": "uuid",
    "addedAt": "ISO 8601 datetime"
  },
  "message": "Provider added to favorites"
}
```

---

## DELETE /api/patients/me/favorites/:providerId
**Description:** Remove provider from favorites

**Method:** `DELETE`

**Endpoint:** `/api/patients/me/favorites/:providerId`

**Authentication:** Required (Patient role)

### URL Parameters
- `providerId` (uuid, required): Provider ID to remove

### Response (200 OK)
```json
{
  "success": true,
  "message": "Provider removed from favorites"
}
```

---

## GET /api/patients/me/family-circle
**Description:** Get patient's family circle members

**Method:** `GET`

**Endpoint:** `/api/patients/me/family-circle`

**Authentication:** Required (Patient role)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "patientId": "uuid",
      "firstName": "string",
      "lastName": "string",
      "relationship": "string",
      "dateOfBirth": "ISO 8601 date",
      "gender": "male | female | other",
      "medicalHistory": "string",
      "allergies": "string",
      "currentMedications": "string",
      "createdAt": "ISO 8601 datetime"
    }
  ]
}
```

---

## POST /api/patients/me/family-circle
**Description:** Add family member to circle

**Method:** `POST`

**Endpoint:** `/api/patients/me/family-circle`

**Authentication:** Required (Patient role)

### Request Body
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "relationship": "string (required)",
  "dateOfBirth": "ISO 8601 date (optional)",
  "gender": "male | female | other (optional)",
  "medicalHistory": "string (optional)",
  "allergies": "string (optional)",
  "currentMedications": "string (optional)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    // Created family member object
  },
  "message": "Family member added successfully"
}
```

---

## DELETE /api/patients/me/family-circle/:memberId
**Description:** Remove family member from circle

**Method:** `DELETE`

**Endpoint:** `/api/patients/me/family-circle/:memberId`

**Authentication:** Required (Patient role)

### URL Parameters
- `memberId` (uuid, required): Family member ID to remove

### Response (200 OK)
```json
{
  "success": true,
  "message": "Family member removed successfully"
}
```

---

## GET /api/patients/me/stats
**Description:** Get patient engagement statistics

**Method:** `GET`

**Endpoint:** `/api/patients/me/stats`

**Authentication:** Required (Patient role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalAppointments": "number",
    "completedAppointments": "number",
    "upcomingAppointments": "number",
    "totalSpent": "number",
    "careStreakDays": "number",
    "longestStreak": "number",
    "totalPoints": "number",
    "badgesEarned": "number",
    "lastAppointmentDate": "ISO 8601 datetime",
    "favoriteProviders": "number"
  }
}
```

---

## Functional Explanation

### Patient Profile Management
The patient profile system allows users to:
1. **Maintain Personal Information**: Store and update demographic and contact details
2. **Medical History**: Track allergies, conditions, and current medications for provider reference
3. **Emergency Contacts**: Designate emergency contacts for urgent situations
4. **Insurance Information**: Store insurance details for claims processing

### Preferences System
Patients can customize their experience through:
1. **Notification Settings**: Control email, SMS, and push notifications
2. **Auto-Validation**: Configure automatic service validation after completion
3. **Privacy Controls**: Manage data sharing with family members and provider messaging
4. **Marketing Preferences**: Opt in/out of promotional communications

### Family Circle
The family circle feature enables:
1. **Dependent Management**: Add family members (children, elderly parents) to coordinate care
2. **Medical History Tracking**: Store medical information for each family member
3. **Shared Access**: Allow family members to view and manage appointments
4. **Emergency Information**: Quick access to family member health data in emergencies

### Favorites System
Patients can:
1. **Save Preferred Providers**: Mark frequently used providers as favorites
2. **Quick Booking**: Faster appointment scheduling with favorite providers
3. **Provider Tracking**: Monitor favorite providers' availability and ratings
4. **Personalized Recommendations**: System suggests services from favorite providers

### Engagement Tracking
The system tracks:
1. **Care Streak**: Consecutive days of health activity engagement
2. **Points System**: Rewards for completed appointments and health activities
3. **Badges**: Achievement badges for milestones (10 appointments, 30-day streak, etc.)
4. **Activity History**: Complete log of patient engagement with the platform
