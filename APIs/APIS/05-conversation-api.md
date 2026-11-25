# Messages API

## Overview

Endpoints for patient–provider messaging, conversation management, and read-status tracking. Both patients and providers use the same endpoints — the server resolves the caller's role from the JWT and returns only the conversations they participate in.

---

## GET /api/conversations

**Description:** Get paginated list of conversations for the current user, ordered by most recent message

**Method:** `GET`

**Endpoint:** `/api/conversations`

**Authentication:** Required


### Query Parameters

```
unreadOnly: boolean (optional, default: false) - Return only conversations with unread messages
page: number (optional, default: 1)
limit: number (optional, default: 20)
sortBy: string (optional, default: lastMessageAt)
sortOrder: asc | desc (optional, default: desc)
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Conversations retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "patientId": "uuid",
        "providerId": "uuid",
        "bookingId": "uuid (optional — present when conversation is linked to a booking)",
        "isActive": "boolean",
        "patient": {
          "id": "uuid",
          "fullName": "string",
          "avatarUrl": "string (url, optional)"
        },
        "provider": {
          "id": "uuid",
          "fullName": "string",
          "specialty": "string",
          "avatarUrl": "string (url, optional)"
        },
        "lastMessageAt": "ISO 8601 datetime (optional)",
        "lastMessagePreview": "string (truncated to 200 characters, optional)",
        "lastMessageBy": "uuid (optional — user ID of the last sender)",
        "patientUnreadCount": "number",
        "providerUnreadCount": "number",
        "updatedAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  },
  "errors": {}
}
```

> **Note for callers:** The field to use for unread badge rendering depends on role:
> 
> - Patient: read `patientUnreadCount`
> - Provider: read `providerUnreadCount`

---

## GET /api/conversations/:id

**Description:** Get a single conversation by ID, including metadata and unread counts

**Method:** `GET`

**Endpoint:** `/api/conversations/:id`

**Authentication:** Required

### URL Parameters

- `id` (uuid, required): Conversation ID

### Response (200 OK)

```json
{
  "success": true,
  "message": "Conversation retrieved successfully",
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "providerId": "uuid",
    "bookingId": "uuid (optional)",
    "isActive": "boolean",
    "patient": {
      "id": "uuid",
      "fullName": "string",
      "avatarUrl": "string (url, optional)"
    },
    "provider": {
      "id": "uuid",
      "fullName": "string",
      "specialty": "string",
      "avatarUrl": "string (url, optional)"
    },
    "lastMessageAt": "ISO 8601 datetime (optional)",
    "lastMessagePreview": "string (optional)",
    "lastMessageBy": "uuid (optional)",
    "patientUnreadCount": "number",
    "providerUnreadCount": "number",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  },
  "errors": {}
}
```

### Error Responses

**404 Not Found**

```json
{
  "success": false,
  "message": "Conversation not found",
  "data": null,
  "errors": {
    "id": ["No conversation exists with this ID"]
  }
}
```

**403 Forbidden** — The current user is not a participant in this conversation

```json
{
  "success": false,
  "message": "You do not have access to this conversation",
  "data": null,
  "errors": {
    "id": ["Access denied to this conversation"]
  }
}
```

---

## GET /api/conversations/:id/messages

**Description:** Get paginated list of messages in a conversation, ordered by newest first

**Method:** `GET`

**Endpoint:** `/api/conversations/:id/messages`

**Authentication:** Required

### URL Parameters

- `id` (uuid, required): Conversation ID

### Query Parameters

```
page: number (optional, default: 1)
limit: number (optional, default: 30)
before: ISO 8601 datetime (optional) - Return messages sent before this timestamp (used for cursor-based infinite scroll)
```

### Response (200 OK)

```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "conversationId": "uuid",
        "senderId": "uuid",
        "sender": {
          "id": "uuid",
          "fullName": "string",
          "role": "patient | provider",
          "avatarUrl": "string (url, optional)"
        },
        "messageType": "text | image | file | location | system",
        "content": "string",
        "attachmentUrl": "string (url, optional)",
        "attachmentName": "string (optional)",
        "attachmentSizeBytes": "number (optional)",
        "attachmentMimeType": "string (optional)",
        "latitude": "number (optional — present when messageType is location)",
        "longitude": "number (optional — present when messageType is location)",
        "isRead": "boolean",
        "readAt": "ISO 8601 datetime (optional)",
        "metadata": "object (optional — arbitrary key-value pairs set by the server)",
        "createdAt": "ISO 8601 datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  },
  "errors": {}
}
```

### Error Responses

**403 Forbidden** — Current user is not a participant

```json
{
  "success": false,
  "message": "You do not have access to this conversation",
  "data": null,
  "errors": {
    "id": ["Access denied to this conversation"]
  }
}
```

**404 Not Found**

```json
{
  "success": false,
  "message": "Conversation not found",
  "data": null,
  "errors": {
    "id": ["No conversation exists with this ID"]
  }
}
```

---

## POST /api/conversations/:id/messages

**Description:** Send a message in a conversation

**Method:** `POST`

**Endpoint:** `/api/conversations/:id/messages`

**Authentication:** Required

### URL Parameters

- `id` (uuid, required): Conversation ID

### Request Body

```json
{
  "messageType": "text | image | file | location (required, default: text)",
  "content": "string (required for text and system messages — max 5000 characters)",
  "attachmentUrl": "string (required when messageType is image or file)",
  "attachmentName": "string (optional — display name for the attachment)",
  "attachmentSizeBytes": "number (optional)",
  "attachmentMimeType": "string (optional — e.g. image/jpeg, application/pdf)",
  "latitude": "number (required when messageType is location)",
  "longitude": "number (required when messageType is location)"
}
```

### Response (201 Created)

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "uuid",
    "conversationId": "uuid",
    "senderId": "uuid",
    "sender": {
      "id": "uuid",
      "fullName": "string",
      "role": "patient | provider",
      "avatarUrl": "string (url, optional)"
    },
    "messageType": "text | image | file | location | system",
    "content": "string",
    "attachmentUrl": "string (url, optional)",
    "attachmentName": "string (optional)",
    "attachmentSizeBytes": "number (optional)",
    "attachmentMimeType": "string (optional)",
    "latitude": "number (optional)",
    "longitude": "number (optional)",
    "isRead": false,
    "readAt": null,
    "metadata": null,
    "createdAt": "ISO 8601 datetime"
  },
  "errors": {}
}
```

### Error Responses

**400 Bad Request** — Validation failure

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "content": ["Message content is required", "Message cannot exceed 5000 characters"],
    "attachmentUrl": ["Attachment URL is required when messageType is image or file"]
  }
}
```

**403 Forbidden** — Current user is not a participant

```json
{
  "success": false,
  "message": "You do not have access to this conversation",
  "data": null,
  "errors": {
    "id": ["Access denied to this conversation"]
  }
}
```

**409 Conflict** — Conversation is no longer active

```json
{
  "success": false,
  "message": "This conversation has been closed and no longer accepts new messages",
  "data": null,
  "errors": {
    "conversationId": ["Conversation is inactive"]
  }
}
```

---

## POST /api/conversations/:id/read

**Description:** Mark all unread messages in a conversation as read for the current user

**Method:** `POST`

**Endpoint:** `/api/conversations/:id/read`

**Authentication:** Required

### URL Parameters

- `id` (uuid, required): Conversation ID

### Response (200 OK)

```json
{
  "success": true,
  "message": "Conversation marked as read",
  "data": {
    "conversationId": "uuid",
    "markedCount": "number (number of messages updated)"
  },
  "errors": {}
}
```

### Error Responses

**404 Not Found**

```json
{
  "success": false,
  "message": "Conversation not found",
  "data": null,
  "errors": {
    "id": ["No conversation exists with this ID"]
  }
}
```

---

## GET /api/conversations/unread-count

**Description:** Get the total number of unread messages across all conversations for the current user

**Method:** `GET`

**Endpoint:** `/api/conversations/unread-count`

**Authentication:** Required

### Response (200 OK)

```json
{
  "success": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "count": "number"
  },
  "errors": {}
}
```

---

## Functional Explanation

### Conversation Lifecycle

Conversations follow this lifecycle:

```
[Booking Confirmed]
       │
       │  System automatically creates conversation
       │  linked to the booking (bookingId set)
       ▼
    [Active] ─────────────────────────────────────────────────────────┐
       │  Patient and provider exchange messages freely                │
       │  (POST /api/conversations/:id/messages)                       │
       │                                                               │
       │  Admin or system deactivates the thread                       │
       ▼                                                               │
   [Inactive] ── No new messages accepted (409 on send)               │
                                                                       │
              ──────── Admin restores thread (isActive = true) ───────┘
```

### Who Can Do What

| Action                       | Patient                         | Provider                         |
| ---------------------------- | ------------------------------- | -------------------------------- |
| View their own conversations | ✅                               | ✅                                |
| Send a message               | ✅                               | ✅                                |
| Mark messages as read        | ✅ (clears `patientUnreadCount`) | ✅ (clears `providerUnreadCount`) |
| Get unread count             | ✅                               | ✅                                |

Both roles share the same endpoints. The server identifies the caller's role from the JWT and applies the correct unread counter (`patientUnreadCount` vs `providerUnreadCount`) automatically.

### Unread Count Behaviour

- Every time a **patient** sends a message, `providerUnreadCount` increments by 1 on that conversation.
- Every time a **provider** sends a message, `patientUnreadCount` increments by 1 on that conversation.
- `POST /api/conversations/:id/read` resets the appropriate counter to `0` and sets `isRead = true` and `readAt` on all previously unread messages in that conversation for the calling user.
- `GET /api/conversations/unread-count` returns the sum of all unread counters applicable to the current user across all their active conversations. Use this value to drive the notification badge in the navigation bar.

### Booking-Linked Conversations

A conversation can be optionally linked to a booking via `bookingId`. This allows both parties to access the associated booking context directly from the message thread. The combination `(patientId, providerId, bookingId)` is unique — only one conversation can exist per patient–provider–booking triplet. A patient and provider can have a separate unlinked conversation (`bookingId = null`) alongside one or more booking-linked threads.

### Message Types

|`messageType`|Required fields|Use case|
|---|---|---|
|`text`|`content`|Standard chat message|
|`image`|`attachmentUrl`, `attachmentMimeType`|Photo (e.g. wound, prescription)|
|`file`|`attachmentUrl`, `attachmentName`, `attachmentMimeType`|PDF, document upload|
|`location`|`latitude`, `longitude`|Provider sharing their live position|
|`system`|`content`|Automated event messages (generated server-side, not sendable by users)|

### Message Content Encryption

Message `content` is encrypted at rest using AES-256. The API always returns the decrypted plaintext — callers do not need to handle decryption. This applies to all `messageType` values that carry a `content` field.

### Side Effects

Sending a message triggers the following side effects automatically:

1. **Unread counter** — The recipient's unread count on the conversation is incremented.
2. **Conversation `lastMessageAt` and `lastMessagePreview`** — Updated to reflect the new message. The preview is truncated to 200 characters.
3. **Push notification** — A push notification is delivered to the recipient's registered device(s) if the app is in the background.
4. **In-app notification** — An entry is created in the notifications table for the recipient.

### Access Control

A user may only access a conversation they participate in. Any attempt to read, write, or mark-as-read a conversation where the current user is neither the `patientId` nor the `providerId` returns **403 Forbidden**. This check applies to every endpoint in this file that accepts a `:id` URL parameter.