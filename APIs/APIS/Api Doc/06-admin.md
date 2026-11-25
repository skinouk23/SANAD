# Admin API

## Overview
Endpoints for platform administration, user management, and system configuration.

---

## GET /api/admin/dashboard
**Description:** Get admin dashboard statistics

**Method:** `GET`

**Endpoint:** `/api/admin/dashboard`

**Authentication:** Required (Admin role)

### Query Parameters
```
countryCode: string (optional) - Filter by country (TN, MA, DZ, etc.)
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "users": {
      "total": "number",
      "active": "number",
      "newThisWeek": "number",
      "newThisMonth": "number",
      "byRole": {
        "patient": "number",
        "provider": "number",
        "admin": "number"
      },
      "bySegment": {
        "vip": "number",
        "active": "number",
        "occasional": "number",
        "inactive": "number",
        "at_risk": "number"
      }
    },
    "appointments": {
      "total": "number",
      "completed": "number",
      "pending": "number",
      "cancelled": "number",
      "todayCount": "number",
      "weekCount": "number"
    },
    "revenue": {
      "total": "number",
      "thisWeek": "number",
      "thisMonth": "number",
      "pending": "number",
      "commissions": "number"
    },
    "providers": {
      "total": "number",
      "active": "number",
      "pendingApproval": "number",
      "suspended": "number"
    }
  }
}
```

---

## GET /api/admin/users
**Description:** Get list of users with filters

**Method:** `GET`

**Endpoint:** `/api/admin/users`

**Authentication:** Required (Admin role)

### Query Parameters
```
role: string (optional) - Filter by role (patient, provider, admin)
status: string (optional) - Filter by status (active, inactive, suspended, pending)
countryCode: string (optional)
search: string (optional) - Search by name or email
page: number (optional, default: 1)
limit: number (optional, default: 20)
sortBy: string (optional, default: createdAt)
sortOrder: asc | desc (optional, default: desc)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "email": "string",
        "name": "string",
        "role": "patient | provider | admin",
        "status": "active | inactive | suspended | pending",
        "phone": "string",
        "countryCode": "string",
        "city": "string",
        "isVerified": "boolean",
        "profileCompleted": "boolean",
        "createdAt": "ISO 8601 datetime",
        "lastLogin": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

---

## GET /api/admin/users/:id
**Description:** Get detailed user information

**Method:** `GET`

**Endpoint:** `/api/admin/users/:id`

**Authentication:** Required (Admin role)

### URL Parameters
- `id` (uuid, required): User ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      // Full user object
    },
    "profile": {
      // Patient or Provider profile
    },
    "stats": {
      "totalAppointments": "number",
      "totalSpent": "number (if patient)",
      "totalEarned": "number (if provider)",
      "rating": "number (if provider)",
      "reviewCount": "number"
    },
    "recentActivity": [
      {
        "type": "string",
        "description": "string",
        "timestamp": "ISO 8601 datetime"
      }
    ]
  }
}
```

---

## PATCH /api/admin/users/:id/status
**Description:** Update user status (suspend, activate, etc.)

**Method:** `PATCH`

**Endpoint:** `/api/admin/users/:id/status`

**Authentication:** Required (Admin role)

### URL Parameters
- `id` (uuid, required): User ID

### Request Body
```json
{
  "status": "active | inactive | suspended (required)",
  "reason": "string (required if status=suspended)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "string",
    "updatedAt": "ISO 8601 datetime"
  },
  "message": "User status updated successfully"
}
```

---

## GET /api/admin/providers/pending
**Description:** Get providers pending approval

**Method:** `GET`

**Endpoint:** `/api/admin/providers/pending`

**Authentication:** Required (Admin role)

### Query Parameters
```
countryCode: string (optional)
serviceType: string (optional)
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "userId": "uuid",
        "businessName": "string",
        "serviceType": "string",
        "specialization": "string",
        "licenseNumber": "string",
        "city": "string",
        "countryCode": "string",
        "documents": [
          {
            "type": "license | insurance | id_card | diploma",
            "url": "string",
            "verified": "boolean"
          }
        ],
        "submittedAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

---

## POST /api/admin/providers/:id/approve
**Description:** Approve provider registration

**Method:** `POST`

**Endpoint:** `/api/admin/providers/:id/approve`

**Authentication:** Required (Admin role)

### URL Parameters
- `id` (uuid, required): Provider ID

### Request Body
```json
{
  "notes": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isApproved": true,
    "approvalDate": "ISO 8601 datetime"
  },
  "message": "Provider approved successfully"
}
```

---

## POST /api/admin/providers/:id/reject
**Description:** Reject provider registration

**Method:** `POST`

**Endpoint:** `/api/admin/providers/:id/reject`

**Authentication:** Required (Admin role)

### URL Parameters
- `id` (uuid, required): Provider ID

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
  "message": "Provider registration rejected"
}
```

---

## GET /api/admin/transactions
**Description:** Get all transactions (admin view)

**Method:** `GET`

**Endpoint:** `/api/admin/transactions`

**Authentication:** Required (Admin role)

### Query Parameters
```
status: string (optional)
type: string (optional)
countryCode: string (optional)
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
minAmount: number (optional)
flagged: boolean (optional) - Show only flagged transactions
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        // Transaction object with additional admin fields
        "fraudScore": "number",
        "isFlagged": "boolean",
        "fraudFlags": "string"
      }
    ],
    "pagination": {}
  }
}
```

---

## GET /api/admin/fraud-alerts
**Description:** Get fraud detection alerts

**Method:** `GET`

**Endpoint:** `/api/admin/fraud-alerts`

**Authentication:** Required (Admin role)

### Query Parameters
```
severity: string (optional) - low, medium, high, critical
status: string (optional) - open, investigating, resolved, false_positive
countryCode: string (optional)
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "suspicious_login | unusual_activity | payment_fraud | account_takeover",
        "severity": "low | medium | high | critical",
        "status": "open | investigating | resolved | false_positive",
        "userId": "uuid",
        "user": {
          "id": "uuid",
          "name": "string",
          "email": "string"
        },
        "description": "string",
        "details": {},
        "createdAt": "ISO 8601 datetime",
        "resolvedAt": "ISO 8601 datetime",
        "resolvedBy": "uuid"
      }
    ],
    "pagination": {}
  }
}
```

---

## POST /api/admin/fraud-alerts/:id/resolve
**Description:** Resolve fraud alert

**Method:** `POST`

**Endpoint:** `/api/admin/fraud-alerts/:id/resolve`

**Authentication:** Required (Admin role)

### URL Parameters
- `id` (uuid, required): Fraud alert ID

### Request Body
```json
{
  "status": "resolved | false_positive (required)",
  "resolutionNotes": "string (required)",
  "actionTaken": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "string",
    "resolvedAt": "ISO 8601 datetime",
    "resolvedBy": "uuid"
  },
  "message": "Fraud alert resolved"
}
```

---

## GET /api/admin/settings
**Description:** Get platform settings

**Method:** `GET`

**Endpoint:** `/api/admin/settings`

**Authentication:** Required (Admin role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "financial": {
      "platformCommissionRate": "number",
      "minTransferAmount": "number"
    },
    "validation": {
      "autoValidationHours": "number",
      "fraudDetectionEnabled": "boolean"
    },
    "notifications": {
      "emailNotificationsEnabled": "boolean",
      "smsNotificationsEnabled": "boolean"
    },
    "system": {
      "maintenanceMode": "boolean",
      "minBookingNoticeHours": "number",
      "maxCancellationHours": "number"
    }
  }
}
```

---

## PUT /api/admin/settings
**Description:** Update platform settings

**Method:** `PUT`

**Endpoint:** `/api/admin/settings`

**Authentication:** Required (Admin role)

### Request Body
```json
{
  "platformCommissionRate": "number (optional)",
  "autoValidationHours": "number (optional)",
  "minTransferAmount": "number (optional)",
  "fraudDetectionEnabled": "boolean (optional)",
  "emailNotificationsEnabled": "boolean (optional)",
  "smsNotificationsEnabled": "boolean (optional)",
  "maintenanceMode": "boolean (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated settings
  },
  "message": "Settings updated successfully"
}
```

---

## GET /api/admin/countries
**Description:** Get country instances configuration

**Method:** `GET`

**Endpoint:** `/api/admin/countries`

**Authentication:** Required (Admin role)

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "countryCode": "string",
      "countryName": "string",
      "currencyCode": "string",
      "isActive": "boolean",
      "maintenanceMode": "boolean",
      "launchDate": "ISO 8601 date",
      "commissionRate": "number",
      "minTransferAmount": "number",
      "autoValidationHours": "number",
      "supportEmail": "string",
      "supportPhone": "string"
    }
  ]
}
```

---

## PUT /api/admin/countries/:countryCode
**Description:** Update country instance settings

**Method:** `PUT`

**Endpoint:** `/api/admin/countries/:countryCode`

**Authentication:** Required (Admin role)

### URL Parameters
- `countryCode` (string, required): Country code (e.g., TN, MA)

### Request Body
```json
{
  "isActive": "boolean (optional)",
  "maintenanceMode": "boolean (optional)",
  "commissionRate": "number (optional)",
  "minTransferAmount": "number (optional)",
  "supportEmail": "string (optional)",
  "supportPhone": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Updated country instance
  },
  "message": "Country settings updated"
}
```

---

## GET /api/admin/system-health
**Description:** Get system health status

**Method:** `GET`

**Endpoint:** `/api/admin/system-health`

**Authentication:** Required (Admin role)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "operational | degraded | outage",
    "uptime": "number (percentage)",
    "responseTime": "number (ms)",
    "activeUsers": "number",
    "services": [
      {
        "name": "API | Payments | Notifications | Database",
        "status": "operational | degraded | outage",
        "responseTime": "number (ms)",
        "lastError": "string",
        "lastChecked": "ISO 8601 datetime"
      }
    ],
    "lastChecked": "ISO 8601 datetime"
  }
}
```

---

## GET /api/admin/audit-logs
**Description:** Get audit logs of admin actions

**Method:** `GET`

**Endpoint:** `/api/admin/audit-logs`

**Authentication:** Required (Admin role)

### Query Parameters
```
adminId: uuid (optional) - Filter by admin user
actionType: string (optional)
entityType: string (optional)
countryCode: string (optional)
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
page: number (optional, default: 1)
limit: number (optional, default: 50)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "adminId": "uuid",
        "admin": {
          "name": "string",
          "email": "string"
        },
        "countryCode": "string",
        "actionType": "string",
        "actionDescription": "string",
        "entityType": "string",
        "entityId": "uuid",
        "oldValue": "string",
        "newValue": "string",
        "ipAddress": "string",
        "userAgent": "string",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {}
  }
}
```

---

## Functional Explanation

### Admin Dashboard
Provides comprehensive overview of:
1. **User Metrics**: Total users, growth, segmentation
2. **Appointment Metrics**: Volume, completion rates, trends
3. **Revenue Metrics**: Total revenue, commissions, pending amounts
4. **Provider Metrics**: Active providers, pending approvals

### User Management
Admins can:
1. **View All Users**: Search, filter, and sort users
2. **User Details**: View complete user profile and activity
3. **Status Management**: Activate, suspend, or ban users
4. **Activity Monitoring**: Track user behavior and engagement

### Provider Approval
**Approval Process:**
1. Provider submits registration with documents
2. Admin reviews documents (license, insurance, ID)
3. Admin verifies credentials
4. Admin approves or rejects with reason
5. Provider notified of decision

**Document Verification:**
- License validation
- Insurance verification
- Identity confirmation
- Professional credentials check

### Transaction Management
Admins can:
1. **Monitor All Transactions**: View complete transaction history
2. **Fraud Detection**: Review flagged transactions
3. **Dispute Resolution**: Handle payment disputes
4. **Refund Processing**: Issue refunds when necessary

### Fraud Detection
**Automated Alerts for:**
- Suspicious login patterns
- Unusual transaction amounts
- Multiple failed payment attempts
- Account takeover attempts
- Fake reviews or ratings

**Alert Management:**
- Review alert details
- Investigate suspicious activity
- Mark as resolved or false positive
- Take action (suspend user, block transaction)

### Platform Settings
**Financial Settings:**
- Commission rates
- Minimum payout amounts
- Payment gateway configuration

**Validation Settings:**
- Auto-validation delay
- Fraud detection thresholds
- Escrow hold periods

**Notification Settings:**
- Email notification toggles
- SMS notification toggles
- Push notification configuration

**System Settings:**
- Maintenance mode
- Booking notice requirements
- Cancellation policies

### Multi-Country Management
Admins can:
1. **Configure Countries**: Set up new country instances
2. **Country-Specific Settings**: Customize per country
3. **Maintenance Mode**: Enable/disable per country
4. **Monitor Performance**: Track metrics by country

### System Health Monitoring
**Real-time Monitoring:**
- API response times
- Database performance
- Payment gateway status
- Notification service status
- Overall system uptime

**Alerts:**
- Service degradation
- System outages
- Performance issues
- Error rate spikes

### Audit Logging
**Tracked Actions:**
- User status changes
- Provider approvals/rejections
- Setting modifications
- Transaction interventions
- Fraud alert resolutions

**Log Details:**
- Who performed action
- What was changed
- When it occurred
- IP address and user agent
- Before/after values
