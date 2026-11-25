# Entity Definition & Database Configuration Guide

## Sanad CareAtHome Platform — CODE‑FIRST Architecture

**Last updated:** February 2026
**Architecture:** CODE‑FIRST (entity‑first) with EF Core
**Database:** PostgreSQL
**ORM:** Entity Framework Core 8

---

## Table of Contents

1. [Core Principle: SQL Is the Single Source of Truth](#1-core-principle-sql-is-the-single-source-of-truth)
2. [What Goes WHERE — The Responsibility Split](#2-what-goes-where--the-responsibility-split)
3. [Entity Class Rules](#3-entity-class-rules)
4. [DbContext Rules (OnModelCreating)](#4-dbcontext-rules-onmodelcreating)
5. [Type Mapping Reference (SQL → C#)](#5-type-mapping-reference-sql--c)
6. [Encryption Rules](#6-encryption-rules)
7. [Navigation Properties](#7-navigation-properties)
8. [What We Removed and Why](#8-what-we-removed-and-why)
9. [Complete Entity Example](#9-complete-entity-example)
10. [Checklist for Adding a New Entity](#10-checklist-for-adding-a-new-entity)

---

## 1. Core Principle: SQL Is the Single Source of Truth

```
database/complete_schema_fixed.sql  →  THE TRUTH
C# Entity Classes                   →  A MIRROR of the SQL
SanadDbContext.OnModelCreating()     →  ONLY what annotations can't express
```

**The SQL schema defines:**
- Table names, column names, column types
- Default values (`DEFAULT CURRENT_TIMESTAMP`, `DEFAULT true`, etc.)
- Constraints (`NOT NULL`, `UNIQUE`, `CHECK`)
- Foreign keys and `ON DELETE` behavior
- Indexes

**The C# entity mirrors the SQL via annotations.** It does NOT redefine schema — it maps to it.

**The DbContext handles ONLY** what data annotations cannot express (see Section 4).

### Why this matters

If someone changes a column default from `true` to `false`, they change it in the SQL file. The C# property initializer (e.g., `= true`) is a convenience for in-memory object creation — it is NOT what the database uses. The SQL file is what gets deployed to PostgreSQL.

---

## 2. What Goes WHERE — The Responsibility Split

### On the Entity Class (via annotations + property initializers)

| Concern | How | Example |
|---------|-----|---------|
| Table name | `[Table("snake_case")]` | `[Table("bookings")]` |
| Column name | `[Column("snake_case")]` | `[Column("booking_date")]` |
| Special column types | `[Column("col", TypeName = "...")]` | `[Column("tags", TypeName = "text[]")]` |
| Primary key | `[Column("id")]` on `Guid Id` | EF Core convention picks up `Id` |
| Foreign key value | `[Column("patient_id")]` on `Guid PatientId` | |
| Encryption | `[Encrypted]` or `[SearchableEncrypted]` | On sensitive string fields |
| C# defaults | Property initializers | `= DateTime.UtcNow` |
| Nullability | C# nullable types | `string?`, `DateTime?` |

### On the DbContext (OnModelCreating) — ONLY these things

| Concern | Why it can't be an annotation | Example |
|---------|-------------------------------|---------|
| Composite unique indexes | No annotation for multi-column unique | `.HasIndex(p => new { p.UserId, p.Token }).IsUnique()` |
| Relationship `OnDelete` behavior | No annotation for delete behavior | `.OnDelete(DeleteBehavior.Restrict)` |
| One-to-one FK specification | EF can't infer which side has the FK | `.HasForeignKey<Patient>(p => p.UserId)` |
| Encryption wiring | Requires runtime service injection | `_encryptedFieldService.ConfigureEncryptedFields(...)` |

### NOT on the DbContext — removed and why

| Removed | Why |
|---------|-----|
| `SetDefaultValueSql("...")` | SQL schema owns defaults. `GETUTCDATE()` was also SQL Server syntax, not PostgreSQL. |
| `SetMaxLength(256)` blanket rule | SQL schema defines `VARCHAR(n)` per column. A blanket rule could silently contradict it. |
| `HasColumnType(...)` | Use `[Column(TypeName = "...")]` on the entity instead. |
| `HasColumnName(...)` | Use `[Column("...")]` on the entity instead. |
| `HasDefaultValue(...)` | SQL schema owns defaults. C# initializer is for in-memory convenience only. |
| Duplicate relationship configs | Each relationship configured once, not twice. |

---

## 3. Entity Class Rules

### Rule 1: Every entity MUST have `[Table("snake_case")]`

```csharp
[Table("bookings")]          // ✅ matches SQL: CREATE TABLE bookings (...)
public class Booking { }

public class Booking { }     // ❌ EF will infer table name "Bookings" (PascalCase, wrong)
```

### Rule 2: Every property MUST have `[Column("snake_case")]`

```csharp
[Column("booking_date")]     // ✅ matches SQL column name exactly
public DateOnly BookingDate { get; set; }

public DateOnly BookingDate { get; set; }  // ❌ EF infers "BookingDate" (PascalCase, wrong)
```

### Rule 3: Use correct C# types matching SQL types

See the full [Type Mapping Reference](#5-type-mapping-reference-sql--c) below.

```csharp
[Column("booking_date")]
public DateOnly BookingDate { get; set; }      // ✅ SQL DATE → C# DateOnly

[Column("start_time")]
public TimeOnly StartTime { get; set; }        // ✅ SQL TIME → C# TimeOnly

[Column("total_amount")]
public decimal TotalAmount { get; set; }       // ✅ SQL DECIMAL(10,2) → C# decimal

[Column("tags", TypeName = "text[]")]
public List<string> Tags { get; set; } = new();// ✅ SQL TEXT[] → C# List<string> + TypeName
```

### Rule 4: Nullable columns → nullable C# types

```csharp
// SQL: cancelled_at TIMESTAMP NULL
[Column("cancelled_at")]
public DateTime? CancelledAt { get; set; }     // ✅ nullable

// SQL: email VARCHAR(255) NOT NULL
[Column("email")]
public string Email { get; set; } = string.Empty;  // ✅ non-nullable with initializer
```

### Rule 5: C# property initializers are for in-memory convenience, NOT schema defaults

```csharp
[Column("is_active")]
public bool IsActive { get; set; } = true;     // ✅ C# default for new objects
// The actual DB default (DEFAULT TRUE) is defined in the SQL schema.
// If you create a Booking in C# code, IsActive starts as true.
// If a raw SQL INSERT omits is_active, PostgreSQL uses its own DEFAULT TRUE.
// They should match, but the SQL schema is authoritative.

[Column("created_at")]
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // ✅ in-memory convenience
// The actual DB default (DEFAULT CURRENT_TIMESTAMP) is in the SQL schema.
```

### Rule 6: One entity class per SQL table (no artificial sub-entities)

If the SQL schema has all columns on one table, the C# entity should have all those properties too. Don't split a single SQL table into multiple C# classes.

```csharp
// ✅ CORRECT: providers table has verification columns inline
[Table("providers")]
public class Provider
{
    // ... provider fields ...
    [Column("is_verified")]
    public bool IsVerified { get; set; }
    [Column("verified_at")]
    public DateTime? VerifiedAt { get; set; }
    // ... subscription fields inline too ...
}

// ❌ WRONG: creating ProviderVerification as separate class when SQL has it inline
[Table("provider_verification")]   // this table doesn't exist in SQL!
public class ProviderVerification { }
```

### Rule 7: Use `Guid` for all primary keys and foreign keys

The SQL schema uses `UUID` for all PKs and FKs. In C#, that's `Guid`.

```csharp
[Column("id")]
public Guid Id { get; set; } = Guid.NewGuid();

[Column("patient_id")]
public Guid PatientId { get; set; }
```

### Rule 8: Group related properties with section comments

Keep entities organized and readable:

```csharp
// ==================== Pricing ====================

[Column("service_price")]
public decimal ServicePrice { get; set; }

[Column("total_amount")]
public decimal TotalAmount { get; set; }

// ==================== Timestamps ====================

[Column("created_at")]
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
```

---

## 4. DbContext Rules (OnModelCreating)

### What IS configured in OnModelCreating

The `SanadDbContext.OnModelCreating()` method should contain **only** these categories:

#### 4.1 Composite Unique Indexes

Data annotations can express `[Key]` and single-column indexes, but NOT multi-column unique constraints:

```csharp
// SQL: UNIQUE(user_id, token) on push_tokens
modelBuilder.Entity<PushToken>()
    .HasIndex(p => new { p.UserId, p.Token })
    .IsUnique();
```

#### 4.2 Relationship OnDelete Behavior

EF Core defaults all required FKs to `CASCADE`. When the SQL schema uses `ON DELETE RESTRICT` or `ON DELETE SET NULL`, you must override:

```csharp
// SQL: booking → patient FK with ON DELETE RESTRICT
modelBuilder.Entity<Booking>()
    .HasOne<Patient>()
    .WithMany()
    .HasForeignKey(b => b.PatientId)
    .OnDelete(DeleteBehavior.Restrict);
```

#### 4.3 One-to-One FK Disambiguation

EF Core can't automatically determine which entity holds the FK in a one-to-one relationship:

```csharp
// User ↔ Patient: Patient holds user_id FK
modelBuilder.Entity<Patient>()
    .HasOne(p => p.User)
    .WithOne(u => u.Patient)
    .HasForeignKey<Patient>(p => p.UserId)
    .OnDelete(DeleteBehavior.Cascade);
```

#### 4.4 Encryption Wiring

The `[Encrypted]` / `[SearchableEncrypted]` attributes are scanned at startup and value converters are registered:

```csharp
if (_encryptedFieldService != null)
{
    var entityTypes = _encryptedFieldService.GetEntitiesWithEncryptedFields(
        typeof(SanadDbContext).Assembly);
    foreach (var entityType in entityTypes)
    {
        _encryptedFieldService.ConfigureEncryptedFields(modelBuilder, entityType);
    }
}
```

### What is NOT configured in OnModelCreating

| Do NOT configure | Reason |
|------------------|--------|
| Column names | Use `[Column("...")]` on the entity |
| Column types | Use `[Column(TypeName = "...")]` on the entity |
| Table names | Use `[Table("...")]` on the entity |
| Default values (`SetDefaultValueSql`) | SQL schema owns defaults; dual ownership causes conflicts |
| Max lengths (`SetMaxLength`) | SQL schema defines `VARCHAR(n)`; blanket rules conflict |
| Required/optional (`IsRequired`) | C# nullability (`string` vs `string?`) handles this |
| Simple one-to-many relationships | EF convention handles these automatically when FK property exists |

---

## 5. Type Mapping Reference (SQL → C#)

| SQL Type | C# Type | `[Column]` TypeName needed? | Example |
|----------|---------|----------------------------|---------|
| `UUID` | `Guid` | No | `public Guid Id { get; set; }` |
| `VARCHAR(n)` / `TEXT` | `string` | No | `public string Email { get; set; }` |
| `BOOLEAN` | `bool` | No | `public bool IsActive { get; set; }` |
| `INTEGER` | `int` | No | `public int Count { get; set; }` |
| `DECIMAL(x,y)` | `decimal` | No | `public decimal Amount { get; set; }` |
| `TIMESTAMP` / `TIMESTAMP WITH TIME ZONE` | `DateTime` | No | `public DateTime CreatedAt { get; set; }` |
| `DATE` | `DateOnly` | No | `public DateOnly BookingDate { get; set; }` |
| `TIME` | `TimeOnly` | No | `public TimeOnly StartTime { get; set; }` |
| `TEXT[]` | `List<string>` | **Yes** — `TypeName = "text[]"` | See below |
| `JSONB` | `string` | **Yes** — `TypeName = "jsonb"` | See below |

### Special types that REQUIRE `TypeName`

```csharp
// SQL: specializations TEXT[] DEFAULT '{}'
[Column("specializations", TypeName = "text[]")]
public List<string> Specializations { get; set; } = new();

// SQL: gateway_response JSONB
[Column("gateway_response", TypeName = "jsonb")]
public string? GatewayResponse { get; set; }
```

Without `TypeName`, EF Core won't know how to map `List<string>` or JSONB columns, and will throw at runtime.

### Nullable vs Non-Nullable

| SQL | C# |
|-----|-----|
| `email VARCHAR(255) NOT NULL` | `string Email` (non-nullable) |
| `phone VARCHAR(20)` (nullable by default) | `string? Phone` (nullable) |
| `cancelled_at TIMESTAMP` (nullable) | `DateTime? CancelledAt` |
| `is_active BOOLEAN NOT NULL DEFAULT TRUE` | `bool IsActive = true` (non-nullable) |

---

## 6. Encryption Rules

### NEVER encrypt PKs or FKs

Encrypting `Guid` primary keys or foreign keys breaks referential integrity — PostgreSQL can't enforce FK constraints on ciphertext.

```csharp
// ❌ NEVER do this
[Column("id")]
[Encrypted]                                    // BREAKS FK relationships
public Guid Id { get; set; }

[Column("patient_id")]
[SearchableEncrypted]                          // BREAKS JOIN/FK operations
public Guid PatientId { get; set; }

// ✅ CORRECT — no encryption on PKs/FKs
[Column("id")]
public Guid Id { get; set; }

[Column("patient_id")]
public Guid PatientId { get; set; }
```

### DO encrypt sensitive data fields

Use `[Encrypted]` for fields that don't need to be searched, `[SearchableEncrypted]` for fields that do:

```csharp
// Searchable — used in WHERE clauses (e.g., "find user by email")
[Column("email")]
[SearchableEncrypted(Classification = DataClassification.Critical)]
public string Email { get; set; } = string.Empty;

// Not searchable — only read after fetching the record
[Column("medical_history")]
[Encrypted(Classification = DataClassification.Confidential)]
public string? MedicalHistory { get; set; }
```

### Classification Guide

| Classification | When to use | Examples |
|---------------|-------------|----------|
| `Critical` | PII that identifies a person | Email, phone, SSN, full name, password hash |
| `Confidential` | PHI / sensitive personal data | Medical history, diagnoses, addresses, bank details |
| `Sensitive` | Less sensitive but still private | Bio, specializations, notes, booking references |

### Don't encrypt non-sensitive data

```csharp
// ❌ Pointless — status values are not sensitive
[Column("status")]
[Encrypted]
public string Status { get; set; }

// ✅ Correct — no encryption needed
[Column("status")]
public string Status { get; set; } = "pending";
```

---

## 7. Navigation Properties

### What they are

Navigation properties let EF Core resolve relationships (JOINs) in LINQ queries. They don't map to SQL columns — they map to FK relationships.

```csharp
// This IS a SQL column (FK):
[Column("patient_id")]
public Guid PatientId { get; set; }

// This is NOT a SQL column — it's a navigation property:
public virtual Patient Patient { get; set; } = null!;
```

### When to add them

Add navigation properties when:
- You need to `.Include()` related data in queries
- You need to traverse relationships in LINQ (e.g., `booking.Patient.User.Email`)
- EF Core needs to understand the relationship shape (one-to-one, one-to-many)

### Parent → Child (collection)

```csharp
// On User entity (parent side):
public virtual ICollection<UserSession> UserSessions { get; set; } = new HashSet<UserSession>();

// On UserSession entity (child side):
[Column("user_id")]
public Guid UserId { get; set; }                    // FK column
public virtual User User { get; set; } = null!;     // Navigation back to parent
```

### One-to-One

```csharp
// On User (parent):
public virtual Patient? Patient { get; set; }

// On Patient (child that holds the FK):
[Column("user_id")]
public Guid UserId { get; set; }
public virtual User? User { get; set; }
```

### When to SKIP navigation properties

Skip them when:
- The relationship is rarely traversed in queries
- The FK is just a reference ID and you never need the full object
- Adding the navigation would create circular dependency issues

```csharp
// cancelled_by is just a reference to who cancelled — rarely need the full User object
[Column("cancelled_by")]
public Guid? CancelledBy { get; set; }
// No navigation property needed — just use the Guid if you need to look up the user
```

### Use `virtual` keyword

Always mark navigation properties as `virtual` to enable EF Core lazy loading (if configured):

```csharp
public virtual Patient Patient { get; set; } = null!;           // ✅
public virtual ICollection<Booking> Bookings { get; set; }      // ✅
```

---

## 8. What We Removed and Why

### 8.1 `SetDefaultValueSql("GETUTCDATE()")` — removed

**Problem 1:** `GETUTCDATE()` is SQL Server syntax. Our database is PostgreSQL. It would fail at runtime.

**Problem 2:** Even with corrected syntax (`CURRENT_TIMESTAMP`), this creates dual ownership. The SQL schema already defines `DEFAULT CURRENT_TIMESTAMP` on timestamp columns. If someone changes the default in one place but not the other, they silently conflict.

**Decision:** SQL schema is the single source of truth for defaults. C# property initializers (`= DateTime.UtcNow`) are only for in-memory object convenience.

### 8.2 `SetMaxLength(256)` blanket rule — removed

**Problem:** This applied `MaxLength(256)` to EVERY non-nullable string without an explicit max length. But the SQL schema already defines `VARCHAR(n)` per column — some columns are `VARCHAR(50)`, some are `TEXT` (unlimited). A blanket 256 could silently truncate data or conflict with the schema.

**Decision:** Column constraints come from the SQL schema. Don't impose constraints from the C# side.

### 8.3 Duplicate relationship configurations — removed

**Problem:** `Patient ↔ User` and `Provider ↔ User` relationships were each configured twice in OnModelCreating (once from the User side, once from the Patient/Provider side). EF Core treats these as separate relationships and creates phantom FK columns.

**Decision:** Configure each relationship exactly once.

### 8.4 Sub-entity classes for single SQL tables — deleted

**Problem:** `ProviderVerification`, `ProviderSubscription`, `ProviderPayment` were separate C# classes, but the SQL `providers` table has all those columns inline. EF Core would try to find tables that don't exist.

**Decision:** One C# class per SQL table. All columns on `providers` → all properties on `Provider`.

### 8.5 EF Migrations folder — deleted

**Problem:** In a code-first architecture, the SQL file is deployed directly (via migration tool, CI/CD, or manual execution). EF Core migrations would fight with the SQL schema for control of the database structure.

**Decision:** No EF migrations. Schema changes go through the SQL file.

---

## 9. Complete Entity Example

Here's a model entity showing all the conventions. Suppose the SQL is:

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    comment TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The C# entity:

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using SanadPlatform.API.Infrastructure.Security;

namespace SanadPlatform.API.Features.Reviews.Entities;

/// <summary>
/// Patient review for a completed booking.
/// Aligned with the 'reviews' table in PostgreSQL schema.
/// </summary>
[Table("reviews")]
public class Review
{
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    // ==================== References ====================

    [Column("booking_id")]
    public Guid BookingId { get; set; }

    [Column("patient_id")]
    public Guid PatientId { get; set; }

    [Column("provider_id")]
    public Guid ProviderId { get; set; }

    // ==================== Review Content ====================

    [Column("overall_rating")]
    public int OverallRating { get; set; }

    [Column("comment")]
    [Encrypted(Classification = DataClassification.Sensitive)]
    public string? Comment { get; set; }

    [Column("is_anonymous")]
    public bool IsAnonymous { get; set; } = false;

    [Column("tags", TypeName = "text[]")]
    public List<string> Tags { get; set; } = new();

    [Column("metadata", TypeName = "jsonb")]
    public string? Metadata { get; set; }

    // ==================== Timestamps ====================

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ==================== Navigation Properties ====================

    public virtual Booking Booking { get; set; } = null!;
}
```

And in DbContext (only if `ON DELETE RESTRICT` is needed):

```csharp
modelBuilder.Entity<Review>()
    .HasOne<Booking>()
    .WithOne()
    .HasForeignKey<Review>(r => r.BookingId)
    .OnDelete(DeleteBehavior.Restrict);
```

**That's it.** No column names in DbContext. No default values in DbContext. No max lengths in DbContext.

---

## 10. Checklist for Adding a New Entity

Use this checklist every time you add or modify an entity:

- [ ] **code‑first:** Column exists in `database/complete_schema_fixed.sql`
- [ ] **`[Table("snake_case")]`** on the class, matching SQL table name exactly
- [ ] **`[Column("snake_case")]`** on every property, matching SQL column name exactly
- [ ] **Correct C# type** matching SQL type (see [Section 5](#5-type-mapping-reference-sql--c))
- [ ] **`TypeName`** specified for `TEXT[]` and `JSONB` columns
- [ ] **Nullable** matches SQL: `NOT NULL` → non-nullable C#, otherwise → nullable C#
- [ ] **C# initializer** matches SQL default value (for in-memory convenience)
- [ ] **No `[Encrypted]`/`[SearchableEncrypted]`** on `Guid` PKs or FKs
- [ ] **`[Encrypted]` or `[SearchableEncrypted]`** on sensitive string fields (PII/PHI)
- [ ] **`DbSet<T>`** added to `SanadDbContext`
- [ ] **Navigation properties** added only where `.Include()` is needed in queries
- [ ] **DbContext config** added only for: composite indexes, OnDelete override, one-to-one FK, or encryption
- [ ] **No EF migration generated** — schema changes go through SQL file only
- [ ] **Build passes** with 0 errors

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                  WHERE THINGS GO                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SQL Schema File         → Table/column definitions         │
│  (source of truth)         Default values                   │
│                            Constraints (NOT NULL, CHECK)    │
│                            Indexes                          │
│                            Foreign keys                     │
│                                                             │
│  Entity Class            → [Table("...")] annotation        │
│  (mirror of SQL)           [Column("...")] on every prop    │
│                            [Column(TypeName=...)] for       │
│                              TEXT[] and JSONB                │
│                            [Encrypted] on sensitive fields   │
│                            Navigation properties             │
│                            C# property initializers          │
│                                                             │
│  DbContext               → Composite unique indexes          │
│  (minimal config)          OnDelete behavior overrides       │
│                            One-to-one FK disambiguation      │
│                            Encryption wiring                 │
│                                                             │
│  NOT in DbContext         → Column names (use annotations)   │
│  (removed)                  Column types (use annotations)   │
│                            Default values (SQL owns these)  │
│                            Max lengths (SQL owns these)     │
│                            Simple relationships (convention) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
