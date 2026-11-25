# Optimistic Concurrency Implementation Guide

This guide details how to implement Optimistic Concurrency Control (OCC) in the Sanad Platform using PostgreSQL's native features and Entity Framework Core.

## 1. Concept Overview
Optimistic Concurrency prevents "Lost Updates" by ensuring that a record has not been modified by another process between the time it was fetched and the time it is saved. Instead of locking rows (Pessimistic Concurrency), we check a version token at the moment of the update.

## 2. The PostgreSQL Approach: `xmin`
PostgreSQL provides a system column called `xmin` for every row. It acts as a transaction ID that changes automatically whenever the row is updated. We leverage this as our concurrency token.

### Why `xmin`?
- **Zero Overhead**: No manual increment logic in C# or triggers needed.
- **Atomic**: Managed by the database engine itself.
- **Invisible**: Does not clutter your domain model with manual version integers unless mapped.

---

## 3. Implementation Steps

### Step 1: Define the Interface
Create a marker interface to identify entities that require concurrency protection.

```csharp
// Common/Interfaces/IVersionedEntity.cs
public interface IVersionedEntity
{
    // This property maps to the hidden PostgreSQL 'xmin' column
    uint Version { get; set; }
}
```

### Step 2: Update Domain Entities
Implement the interface on critical entities (e.g., `PatientRewards`, `Wallet`, `Booking`).

```csharp
public class PatientRewards : IVersionedEntity
{
    // ... other properties ...
    public uint Version { get; set; }
}
```

### Step 3: Configure EF Core
Tell Entity Framework to treat this property as a Concurrency Token and map it to `xmin`.

```csharp
// Features/Rewards/Configurations/PatientRewardsConfiguration.cs
public void Configure(EntityTypeBuilder<PatientRewards> builder)
{
    // ... existing config ...

    builder.Property(e => e.Version)
        .IsRowVersion(); // This automatically maps to xmin in Npgsql
}
```

### Step 4: Handle Concurrency Exceptions
When a conflict occurs, EF Core throws `DbUpdateConcurrencyException`. This should be handled globally.

**In `GlobalExceptionHandlingMiddleware.cs`:**
```csharp
case DbUpdateConcurrencyException:
    statusCode = HttpStatusCode.Conflict; // 409
    message = "The record was modified by another user. Please refresh and try again.";
    break;
```

---

## 4. How to Test
1.  **Fetch**: Retrieve the same entity in two separate browser tabs (or Swagger instances). Note the `Version`.
2.  **Update A**: Modify and save the entity in Tab A. (Success).
3.  **Update B**: Try to modify and save the *original* entity in Tab B.
4.  **Result**: Tab B should receive a `409 Conflict` error because the version token in the database has changed.

## 5. Best Practices
*   **Don't apply to everything**: Only apply to entities where concurrent updates are dangerous (e.g., financial balances, inventory counts, status workflows).
*   **Client Responsibility**: The client (Frontend) must handle the 409 error by reloading the data and asking the user to re-apply their changes.
*   **Stateless Updates**: If using `ExecuteUpdateAsync`, concurrency checks are manual (`Where(x => x.Version == expectedVersion)`). The automated EF Core behavior only applies to `SaveChanges()`.
