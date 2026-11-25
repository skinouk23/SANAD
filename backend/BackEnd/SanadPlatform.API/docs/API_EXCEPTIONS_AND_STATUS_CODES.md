# API Error Handling: Exceptions & Status Codes

This document defines the standard for error handling in the Sanad Platform API. It explains how C# exceptions are mapped to HTTP Status Codes through our controllers and middleware.

---

## 🟢 Success Status Codes (2xx)

| Status Code | Meaning | Usage |
| :--- | :--- | :--- |
| **200 OK** | Success | Standard response for successful `GET`, `PUT`, or `PATCH` requests. |
| **201 Created** | Created | Returned after a successful `POST` (e.g., Register, Create Booking). Includes a `Location` header to the new resource. |
| **204 No Content** | Deleted | Successful `DELETE` request where no response body is needed. |

---

## 🟡 Client Error Status Codes (4xx)

These errors occur when the client sends an invalid request.

### 1. **400 Bad Request**
*   **Exception**: `ArgumentException`, `FluentValidation.ValidationException`
*   **Meaning**: The request format is correct, but the data is invalid (e.g., password too short, invalid email).
*   **Usage**: Use this for input validation.

### 2. **401 Unauthorized**
*   **Exception**: `UnauthorizedAccessException`
*   **Meaning**: The user is not logged in, or their JWT token has expired.
*   **Usage**: Thrown by the security middleware or when a login fails.

### 3. **403 Forbidden**
*   **Meaning**: The user is logged in but does not have the required **Role** (e.g., a Patient trying to access Admin settings).
*   **Usage**: Handled automatically by `[Authorize(Roles = "Admin")]`.

### 4. **404 Not Found**
*   **Exception**: `KeyNotFoundException`
*   **Meaning**: The requested resource (User, Provider, Booking) does not exist in the database.
*   **Usage**: Thrown by Handlers when a lookup by ID returns null.

### 5. **409 Conflict**
*   **Exception**: `InvalidOperationException` (in specific cases)
*   **Meaning**: The request cannot be completed because of a conflict in the current state of the resource.
*   **Usage**: When trying to register an email that already exists, or booking a slot that was just taken.

### 6. **429 Too Many Requests**
*   **Meaning**: The user has sent too many requests in a short period (Rate Limiting).
*   **Usage**: Protection against Brute Force attacks on the Login endpoint.

---

## 🔴 Server Error Status Codes (5xx)

### 1. **500 Internal Server Error**
*   **Exception**: `Exception` (Any unhandled)
*   **Meaning**: Something went wrong on our side (Database down, Null reference, Logic bug).
*   **Usage**: Caught by `GlobalExceptionHandlingMiddleware`. We never manually return a 500; it is a safety net.

---

## Summary Mapping Table

| Exception Type | HTTP Status | User Message Example |
| :--- | :--- | :--- |
| `ValidationException` | 400 | "Email is invalid." |
| `ArgumentException` | 400 | "Password must be at least 8 chars." |
| `UnauthorizedAccessException` | 401 | "Invalid email or password." |
| `KeyNotFoundException` | 404 | "Provider profile not found." |
| `InvalidOperationException` | 409 | "This email is already registered." |
| Any other Exception | 500 | "An unexpected error occurred." |

---

## Best Practices for Developers
1.  **Throw early**: Throw an exception as soon as you find a problem in the Handler.
2.  **Be specific**: Use `KeyNotFoundException("User 123 not found")` rather than a generic `Exception`.
3.  **No Try-Catch in Handlers**: Let the exception bubble up to the Middleware. This keeps your business logic clean.
