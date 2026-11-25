# Optimistic Concurrency Implementation Guide

This guide explains how to implement Optimistic Concurrency in the Sanad Platform using PostgreSQL's native features and Entity Framework Core.

## 1. Overview
Optimistic concurrency ensures that a record has not been modified by another process between the time it was fetched and the time it is saved. In a healthcare platform, this prevents "lost updates" when a user modifies settings from multiple devices simultaneously.

## 2. The PostgreSQL Approach: `xmin`
While SQL Server uses `rowversion`, PostgreSQL provides a system column called `xmin`. This is a hidden column that automatically increments every time a row is updated.

### Why `xmin`?
- **Automatic**: Managed by the database; no C# logic needed to increment versions.
- **Zero Overhead**: No extra columns visible in standard `SELECT *` queries.
- **Reliable**: Guarantees protection against race conditions at the engine level.

---

## 3. Implementation Steps

### Step 1: Update the Entity
Add a property to represent the version token in your domain model.

```csharp
// Features/Patients/Entities/PatientPreferences.cs
public class PatientPreferences
{
    // ... existing properties ...

    /// <summary>
    /// Version token for optimistic concurrency.
    /// Managed automatically by PostgreSQL (xmin).
    /// </summary>
    public uint Version { get; set; }
}
```

### Step 2: Configure EF Core
Tell Entity Framework that this property is a concurrency token.

```csharp
// Features/Patients/Configurations/PatientPreferencesConfiguration.cs
public void Configure(EntityTypeBuilder<PatientPreferences> builder)
{
    // ... existing config ...

    // Configure xmin as the concurrency token
    builder.Property(x => x.Version)
        .IsRowVersion(); 
}
```

### Step 3: Handle the Conflict in the Handler
When a conflict occurs, EF Core throws a `DbUpdateConcurrencyException`. You must catch this in your MediatR handler.

```csharp
// Features/Patients/Commands/UpdatePatientPreferences.cs
public async Task<PatientPreferencesResponse> Handle(...)
{
    try 
    {
        var preferences = await _repository.GetPreferencesEntityAsync(command.UserId);
        // ... apply changes ...
        await _repository.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        _logger.LogError("Concurrency conflict detected for Patient {UserId}", command.UserId);
        throw new InvalidOperationException("The settings were updated by another device. Please refresh and try again.");
    }
}
```

### Step 4: Map to API Response
Update the `GlobalExceptionHandlingMiddleware` to return a `409 Conflict` status code when a concurrency error occurs.

---

## 4. Testing the Implementation
To verify the implementation:
1. Open two API clients (e.g., Swagger and Postman).
2. Fetch the preferences in both (they will have the same `Version`).
3. Update and save in Client A. (Success, `xmin` increments in DB).
4. Try to update and save in Client B using the old data.
5. **Result**: The server should return an error because Client B's version no longer matches the database.

## 5. When to Use
| Priority | Feature | Reason |
| :--- | :--- | :--- |
| **Critical** | Bookings / Slots | Prevents double-booking same time slot. |
| **High** | Wallet / Payments | Prevents balance race conditions. |
| **Medium** | Patient Profiles | Ensures PII consistency. |
| **Low** | Preferences | Low conflict rate, but good for data integrity. |

---
**Note**: For PostgreSQL specifically, ensure you are using the `Npgsql.EntityFrameworkCore.PostgreSQL` provider, as it handles the `xmin` mapping automatically when `.IsRowVersion()` is called.
