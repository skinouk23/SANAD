# Transactions API

## Overview
Endpoints for managing transactions, payments, provider balance, and payouts.

---

## GET /api/transactions
**Description:** Get list of transactions with filters

**Method:** `GET`

**Endpoint:** `/api/transactions`

**Authentication:** Required

### Query Parameters
```
status: string (optional) - Filter by status (pending, processing, completed, failed, refunded)
type: string (optional) - Filter by type (payment, refund, payout, commission, subscription)
paymentMethod: string (optional) - Filter by payment method (card, d17, cash, bank_transfer, wallet)
patientId: uuid (optional) - Filter by patient
providerId: uuid (optional) - Filter by provider
appointmentId: uuid (optional) - Filter by appointment
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
minAmount: number (optional)
maxAmount: number (optional)
page: number (optional, default: 1)
limit: number (optional, default: 10)
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
        "type": "payment | refund | payout | commission | subscription",
        "status": "pending | processing | completed | failed | refunded",
        "amount": "number",
        "currency": "string (TND, MAD, DZD, etc.)",
        "commission": "number",
        "netAmount": "number",
        "paymentMethod": "card | d17 | cash | bank_transfer | wallet",
        "appointmentId": "uuid",
        "patientId": "uuid",
        "providerId": "uuid",
        "patient": {
          "id": "uuid",
          "name": "string"
        },
        "provider": {
          "id": "uuid",
          "name": "string"
        },
        "description": "string",
        "metadata": {},
        "createdAt": "ISO 8601 datetime",
        "processedAt": "ISO 8601 datetime",
        "failureReason": "string"
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

## GET /api/transactions/:id
**Description:** Get single transaction by ID

**Method:** `GET`

**Endpoint:** `/api/transactions/:id`

**Authentication:** Required

### URL Parameters
- `id` (uuid, required): Transaction ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    // Full transaction object
  }
}
```

---

## POST /api/transactions
**Description:** Create new transaction (payment)

**Method:** `POST`

**Endpoint:** `/api/transactions`

**Authentication:** Required

### Request Body
```json
{
  "type": "payment | subscription (required)",
  "amount": "number (required)",
  "paymentMethod": "card | d17 | cash | bank_transfer (required)",
  "appointmentId": "uuid (required for payment type)",
  "patientId": "uuid (optional, defaults to current user)",
  "providerId": "uuid (required)",
  "description": "string (optional)",
  "metadata": "object (optional)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "payment",
    "status": "pending",
    "amount": "number",
    "commission": "number",
    "netAmount": "number",
    "paymentMethod": "string",
    "paymentGatewayId": "string",
    "createdAt": "ISO 8601 datetime"
  },
  "message": "Transaction created successfully"
}
```

---

## POST /api/transactions/:id/process
**Description:** Process pending transaction (Admin/System action)

**Method:** `POST`

**Endpoint:** `/api/transactions/:id/process`

**Authentication:** Required (Admin role or System)

### URL Parameters
- `id` (uuid, required): Transaction ID

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "processing",
    "processedAt": "ISO 8601 datetime"
  },
  "message": "Transaction processing initiated"
}
```

---

## POST /api/transactions/:id/complete
**Description:** Mark transaction as completed (Payment gateway callback)

**Method:** `POST`

**Endpoint:** `/api/transactions/:id/complete`

**Authentication:** Required (System/Gateway webhook)

### URL Parameters
- `id` (uuid, required): Transaction ID

### Request Body
```json
{
  "paymentGatewayId": "string (required)",
  "paymentGatewayResponse": "string (optional)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "processedAt": "ISO 8601 datetime"
  },
  "message": "Transaction completed successfully"
}
```

---

## POST /api/transactions/:id/refund
**Description:** Refund a completed transaction

**Method:** `POST`

**Endpoint:** `/api/transactions/:id/refund`

**Authentication:** Required (Admin role)

### URL Parameters
- `id` (uuid, required): Transaction ID to refund

### Request Body
```json
{
  "reason": "string (required)",
  "amount": "number (optional, defaults to full amount)"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "originalTransaction": {
      "id": "uuid",
      "status": "refunded"
    },
    "refundTransaction": {
      "id": "uuid",
      "type": "refund",
      "status": "completed",
      "amount": "number",
      "createdAt": "ISO 8601 datetime"
    }
  },
  "message": "Refund processed successfully"
}
```

---

## GET /api/transactions/stats
**Description:** Get transaction statistics

**Method:** `GET`

**Endpoint:** `/api/transactions/stats`

**Authentication:** Required

### Query Parameters
```
providerId: uuid (optional) - Stats for specific provider
patientId: uuid (optional) - Stats for specific patient
startDate: ISO 8601 date (optional)
endDate: ISO 8601 date (optional)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "totalRevenue": "number",
    "totalCommissions": "number",
    "pendingAmount": "number",
    "completedCount": "number",
    "pendingCount": "number",
    "failedCount": "number",
    "refundedCount": "number",
    "averageTransaction": "number",
    "thisWeekRevenue": "number",
    "thisMonthRevenue": "number",
    "byPaymentMethod": {
      "card": {
        "count": "number",
        "amount": "number"
      },
      "d17": {
        "count": "number",
        "amount": "number"
      },
      "cash": {
        "count": "number",
        "amount": "number"
      }
    }
  }
}
```

---

## GET /api/providers/:providerId/balance
**Description:** Get provider balance and earnings

**Method:** `GET`

**Endpoint:** `/api/providers/:providerId/balance`

**Authentication:** Required (Provider role or Admin)

### URL Parameters
- `providerId` (uuid, required): Provider ID (use 'me' for current provider)

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "available": "number",
    "pending": "number",
    "totalEarned": "number",
    "totalWithdrawn": "number",
    "lastPayout": {
      "amount": "number",
      "date": "ISO 8601 datetime",
      "status": "completed | pending | failed"
    },
    "upcomingPayout": {
      "amount": "number",
      "scheduledDate": "ISO 8601 date"
    }
  }
}
```

---

## POST /api/providers/:providerId/payout
**Description:** Request payout/withdrawal

**Method:** `POST`

**Endpoint:** `/api/providers/:providerId/payout`

**Authentication:** Required (Provider role)

### URL Parameters
- `providerId` (uuid, required): Provider ID (use 'me' for current provider)

### Request Body
```json
{
  "amount": "number (required)",
  "method": "bank_transfer | wallet (required)",
  "bankAccountNumber": "string (required if method=bank_transfer)",
  "bankName": "string (required if method=bank_transfer)"
}
```

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "payout",
    "status": "pending",
    "amount": "number",
    "paymentMethod": "bank_transfer | wallet",
    "createdAt": "ISO 8601 datetime",
    "estimatedProcessingTime": "string (e.g., '2-3 business days')"
  },
  "message": "Payout request submitted successfully"
}
```

### Error Responses
**400 Bad Request**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient available balance for payout",
    "details": {
      "available": "number",
      "requested": "number"
    },
    "statusCode": 400
  }
}
```

**400 Bad Request**
```json
{
  "success": false,
  "error": {
    "code": "MINIMUM_PAYOUT_NOT_MET",
    "message": "Minimum payout amount is 50 TND",
    "statusCode": 400
  }
}
```

---

## GET /api/providers/:providerId/payouts
**Description:** Get provider payout history

**Method:** `GET`

**Endpoint:** `/api/providers/:providerId/payouts`

**Authentication:** Required (Provider role or Admin)

### URL Parameters
- `providerId` (uuid, required): Provider ID (use 'me' for current provider)

### Query Parameters
```
status: string (optional) - Filter by status
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "amount": "number",
        "status": "pending | processing | completed | failed",
        "paymentMethod": "bank_transfer | wallet",
        "bankAccountNumber": "string (masked)",
        "bankName": "string",
        "processedAt": "ISO 8601 datetime",
        "completedAt": "ISO 8601 datetime",
        "notes": "string",
        "createdAt": "ISO 8601 datetime"
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

## Functional Explanation

### Transaction Lifecycle
1. **Creation**: Transaction created when patient books appointment
2. **Pending**: Payment held in escrow
3. **Processing**: Payment gateway processes transaction
4. **Completed**: Payment successful, funds held in escrow
5. **Released**: After service validation, funds released to provider balance

### Escrow System
**Purpose**: Protect both patients and providers
- **Patient Protection**: Only pay after service delivered
- **Provider Protection**: Guaranteed payment after service completion

**Flow:**
1. Patient books appointment → Payment captured
2. Funds held in escrow (not released to provider yet)
3. Service completed → Patient validates with code
4. Validation confirmed → Funds released to provider balance
5. Auto-validation after 48 hours if patient doesn't validate

### Commission Structure
- Platform takes commission from each transaction
- Commission rate varies by subscription tier:
  - Basic: 15%
  - Premium: 12%
  - Elite: 10%
- Net amount = Total amount - Commission

### Provider Balance
**Available Balance:**
- Funds from completed and validated appointments
- Ready for withdrawal
- Minimum withdrawal: 50 TND

**Pending Balance:**
- Funds from completed but not yet validated appointments
- Released after validation or auto-validation

**Total Earned:**
- Cumulative earnings (all time)
- Includes withdrawn and available amounts

### Payout Process
1. **Request**: Provider requests payout (minimum 50 TND)
2. **Verification**: System verifies available balance
3. **Processing**: Payout queued for processing
4. **Transfer**: Funds transferred to provider account
5. **Confirmation**: Provider notified of completion

**Processing Times:**
- Bank Transfer: 2-3 business days
- Wallet: Instant to 24 hours

### Payment Methods
**Card (Credit/Debit):**
- Instant processing
- 2.9% + 0.30 TND gateway fee

**D17 (Mobile Payment):**
- Popular in Tunisia
- Instant processing
- Lower fees

**Cash:**
- Collected by provider
- Marked as completed manually
- No gateway fees

**Bank Transfer:**
- For large amounts
- 1-2 business days
- Lower fees

### Refund Policy
**Automatic Refunds:**
- Provider cancels confirmed appointment
- Service not delivered
- Technical issues

**Manual Refunds (Admin):**
- Dispute resolution
- Service quality issues
- Special circumstances

**Refund Processing:**
- Same payment method as original
- 5-10 business days for card refunds
- Instant for wallet refunds
