
# Providers API Documentation

## Overview

The Providers API manages healthcare provider data including nurses, doctors, physiotherapists, and other healthcare professionals.

## Base URL

```
{API_BASE_URL}/providers
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

## Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token for authentication |
| `X-Country-Code` | Yes | ISO 2-letter country code (e.g., TN, FR) |
| `Content-Type` | Yes | `application/json` |
| `X-Request-ID` | No | Unique request identifier for tracing |

---

## Endpoints

### GET /providers

Retrieve a list of providers with optional filtering and pagination.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `countryCode` | string | Yes | - | Filter by country code |
| `serviceType` | string | No | - | Filter by service type (nursing, physio, etc.) |
| `city` | string | No | - | Filter by city name |
| `minRating` | number | No | - | Minimum rating (1-5) |
| `maxPrice` | number | No | - | Maximum price per session |
| `available` | boolean | No | - | Filter by availability status |
| `verified` | boolean | No | - | Filter by verification status |
| `sortBy` | string | No | rating | Sort field: rating, price, distance, reviews |
| `sortOrder` | string | No | desc | Sort order: asc, desc |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 10 | Items per page (max: 100) |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "prov-001",
      "userId": "user-001",
      "name": "Amel Ben Youssef",
      "email": "amel.benyoussef@example.com",
      "phone": "+216 98 123 456",
      "serviceType": "nursing",
      "specialties": ["Injections", "Pansements", "Perfusions"],
      "rating": 4.9,
      "reviewCount": 124,
      "verified": true,
      "available": true,
      "location": {
        "address": "15 Rue de la Liberté",
        "city": "Tunis",
        "region": "Tunis",
        "countryCode": "TN",
        "latitude": 36.8065,
        "longitude": 10.1815
      },
      "pricing": [
        {
          "serviceId": "injection_im",
          "serviceName": "Injection IM",
          "price": 25,
          "currency": "TND",
          "unit": "session"
        }
      ],
      "subscriptionPlan": "elite",
      "status": "active",
      "experience": 8,
      "bio": "Infirmière diplômée d'État...",
      "imageUrl": "https://...",
      "badges": ["verified", "experienced", "rated"],
      "countryCode": "TN",
      "createdAt": "2022-03-15T10:00:00Z",
      "updatedAt": "2024-01-20T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Example Request

```bash
curl -X GET "https://api.careathome.tn/v1/providers?countryCode=TN&serviceType=nursing&available=true&page=1&limit=10" \
  -H "Authorization: Bearer {token}" \
  -H "X-Country-Code: TN" \
  -H "Content-Type: application/json"
```

---

### GET /providers/:id

Retrieve a single provider by ID.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Provider ID |

#### Response

```json
{
  "status": "success",
  "data": {
    "id": "prov-001",
    "userId": "user-001",
    "name": "Amel Ben Youssef",
    // ... full provider object
  }
}
```

#### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 404 | PROVIDER_NOT_FOUND | Provider with given ID does not exist |

---

### GET /providers/search

Search providers by name, specialty, or location.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 characters) |
| `countryCode` | string | Yes | Filter by country code |
| `limit` | number | No | Max results (default: 20) |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "id": "prov-001",
      "name": "Amel Ben Youssef",
      "serviceType": "nursing",
      "rating": 4.9,
      "location": {
        "city": "Tunis"
      },
      "available": true
    }
  ]
}
```

---

### GET /providers/available

Get available providers for a specific service type.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `serviceType` | string | Yes | Service type to filter by |
| `countryCode` | string | Yes | Country code |

#### Response

Same as GET /providers but filtered to only available, verified providers.

---

### GET /providers/top-rated

Get top-rated providers.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Number of providers (default: 5, max: 20) |
| `countryCode` | string | Yes | Country code |

---

### GET /providers/nearby

Get providers near a geographic location.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | number | Yes | Latitude |
| `lng` | number | Yes | Longitude |
| `radius` | number | No | Search radius in km (default: 10) |
| `serviceType` | string | No | Filter by service type |
| `countryCode` | string | Yes | Country code |

---

### PATCH /providers/:id/availability

Update provider availability status.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Provider ID |

#### Request Body

```json
{
  "available": true
}
```

#### Response

```json
{
  "status": "success",
  "data": {
    "id": "prov-001",
    "available": true,
    "updatedAt": "2024-01-22T10:00:00Z"
  }
}
```

#### Authorization

Only the provider themselves or an admin can update availability.

---

### GET /providers/:id/schedule

Get provider's schedule and available time slots.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Provider ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | Yes | Start date (YYYY-MM-DD) |
| `endDate` | string | Yes | End date (YYYY-MM-DD) |

#### Response

```json
{
  "status": "success",
  "data": [
    {
      "date": "2024-01-22",
      "time": "09:00",
      "available": true
    },
    {
      "date": "2024-01-22",
      "time": "10:00",
      "available": false,
      "appointmentId": "apt-123"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `PROVIDER_NOT_FOUND` | 404 | Provider does not exist |
| `VALIDATION_ERROR` | 422 | Invalid request parameters |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **Standard users**: 100 requests per minute
- **Premium users**: 500 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705920000
```

---

## Webhooks

Providers can subscribe to webhooks for real-time updates:

### Events

| Event | Description |
|-------|-------------|
| `provider.updated` | Provider profile was updated |
| `provider.availability_changed` | Availability status changed |
| `provider.new_review` | New review received |
| `provider.appointment_created` | New appointment booked |

### Webhook Payload

```json
{
  "event": "provider.availability_changed",
  "timestamp": "2024-01-22T10:00:00Z",
  "data": {
    "providerId": "prov-001",
    "available": true,
    "previousValue": false
  }
}
```

---

## SDK Usage

### JavaScript/TypeScript

```typescript
import { providersService } from '@/services';

// Get all providers
const providers = await providersService.getAll({
  serviceType: 'nursing',
  available: true,
});

// Get single provider
const provider = await providersService.getById('prov-001');

// Search providers
const results = await providersService.search('infirmière Tunis');

// Update availability
await providersService.updateAvailability('prov-001', true);
```

### React Hooks

```tsx
import { useProviders, useProvider, useProviderSearch } from '@/hooks';

// List providers
function ProviderList() {
  const { data, loading, error } = useProviders({ serviceType: 'nursing' });
  // ...
}

// Single provider
function ProviderProfile({ id }) {
  const { data: provider, loading } = useProvider(id);
  // ...
}

// Search
function ProviderSearch() {
  const { data, query, setQuery, loading } = useProviderSearch();
  // ...
}
```
