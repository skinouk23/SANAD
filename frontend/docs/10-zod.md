# 10 — Zod Deep Dive

This guide teaches Zod schema validation from scratch, then shows how this project uses it to guarantee type safety between the API and the UI. By the end you will understand schemas, type inference, transforms, refinements, and the schema-per-feature architecture.

---

## Table of Contents

1. [What Problem Does Zod Solve?](#1-what-problem-does-zod-solve)
2. [Core Concepts](#2-core-concepts)
3. [Primitive Schemas](#3-primitive-schemas)
4. [Object Schemas & Composition](#4-object-schemas--composition)
5. [Enums, Unions & Literals](#5-enums-unions--literals)
6. [Transforms & Refinements](#6-transforms--refinements)
7. [Type Inference — The Single Source of Truth](#7-type-inference--the-single-source-of-truth)
8. [Shared Schemas](#8-shared-schemas)
9. [Feature Schemas](#9-feature-schemas)
10. [Generic Factory Functions](#10-generic-factory-functions)
11. [How Services Use Schemas](#11-how-services-use-schemas)
12. [Checklist: Adding a New Schema](#12-checklist-adding-a-new-schema)

---

## 1. What Problem Does Zod Solve?

TypeScript types disappear at runtime. When your API returns `{ amount: "50" }` instead of `{ amount: 50 }`, TypeScript won't catch it — your component silently renders `NaN` or crashes.

```typescript
// TypeScript says this is fine at compile time:
interface Booking {
  id: string;
  amount: number;
}

// But at runtime, the API might send:
const response = { id: 123, amount: "fifty" };
// TypeScript can't protect you here — it's already been compiled away.
```

Zod solves this by validating data **at runtime**:

```typescript
import { z } from 'zod';

const BookingSchema = z.object({
  id: z.string(),
  amount: z.number(),
});

// This THROWS with a clear error message:
BookingSchema.parse({ id: 123, amount: "fifty" });
// ZodError: id: Expected string, received number
//           amount: Expected number, received string
```

### The dual benefit

1. **Runtime safety** — bad data is caught before it reaches your components
2. **Type inference** — you derive TypeScript types FROM the schema, so they can never drift apart

```typescript
// ONE schema, TWO uses:
const BookingSchema = z.object({ id: z.string(), amount: z.number() });

// Use 1: runtime validation
const booking = BookingSchema.parse(apiResponse);

// Use 2: type inference (zero manual interface writing)
type Booking = z.infer<typeof BookingSchema>;
// → { id: string; amount: number }
```

---

## 2. Core Concepts

| Concept | What It Is | Example |
|---------|-----------|---------|
| **Schema** | A validator + type definition in one object | `z.string()`, `z.object({...})` |
| **parse** | Validates data and returns it, or throws `ZodError` | `schema.parse(input)` |
| **safeParse** | Like parse, but returns `{ success, data, error }` instead of throwing | `schema.safeParse(input)` |
| **infer** | Extracts the TypeScript type from a schema | `type T = z.infer<typeof schema>` |
| **transform** | Modifies the value during parsing | `.transform(val => val.trim())` |
| **refine** | Adds custom validation logic | `.refine(val => val.length > 2)` |

### parse vs safeParse

```typescript
// parse — throws on failure (use in service functions)
try {
  const booking = BookingSchema.parse(apiResponse);
} catch (e) {
  // e is a ZodError with detailed field-level messages
}

// safeParse — never throws (use for form validation, soft checks)
const result = BookingSchema.safeParse(formData);
if (result.success) {
  console.log(result.data);  // typed as Booking
} else {
  console.log(result.error.issues);  // array of validation errors
}
```

This project uses `.parse()` in service functions (fail hard if the API response is wrong) and provides a `safeParseResponse()` helper for gradual migration scenarios.

---

## 3. Primitive Schemas

Zod has a schema for every JavaScript primitive:

```typescript
z.string()    // validates string
z.number()    // validates number (not NaN)
z.boolean()   // validates boolean
z.date()      // validates Date object
z.bigint()    // validates bigint
z.undefined() // validates undefined
z.null()      // validates null
z.unknown()   // accepts anything (like TypeScript's unknown)
```

### Chainable validators

```typescript
// Strings
z.string().min(1, 'Required')        // at least 1 character
z.string().max(254, 'Too long')      // at most 254 characters
z.string().email()                    // built-in email regex
z.string().uuid()                     // UUID format
z.string().url()                      // URL format
z.string().regex(/^\d{8}$/)          // custom regex

// Numbers
z.number().int()                      // must be integer
z.number().min(0, 'Cannot be negative')
z.number().max(999999, 'Too high')

// Making things optional or nullable
z.string().optional()       // string | undefined
z.string().nullable()       // string | null
z.string().nullable().optional()  // string | null | undefined
```

### How this project uses them

From `src/shared/schemas/tunisia.ts`:

```typescript
export const PriceSchema = z
  .number()
  .min(0, 'Le montant ne peut pas etre negatif')
  .max(999999, 'Montant trop eleve');
```

Most object fields use `.nullable().optional()` to handle both `null` (SQL NULL) and `undefined` (field absent from JSON):

```typescript
bio: z.string().nullable().optional(),
city: z.string().nullable().optional(),
```

---

## 4. Object Schemas & Composition

### Defining objects

```typescript
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['patient', 'provider', 'admin']),
  phone: z.string().nullable().optional(),
  createdAt: z.string(),
});
```

### Nesting objects

Schemas can reference other schemas:

```typescript
const ProviderDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rating: z.number(),
});

const EquipmentDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  provider: ProviderDtoSchema,  // nested object schema
  images: z.array(z.string()),  // array of strings
});
```

### Arrays

```typescript
z.array(z.string())                      // string[]
z.array(ProviderDtoSchema)               // ProviderDto[]
z.array(z.string()).nullable().optional() // string[] | null | undefined
```

### Records (dictionaries)

```typescript
z.record(z.string(), z.number())           // { [key: string]: number }
z.record(z.string(), z.unknown())          // { [key: string]: unknown }
z.record(PaymentMethodSchema, StatsSchema) // typed key + typed value
```

Used in admin stats: `byRole: z.record(UserRoleSchema, z.number())`.

### `z.unknown()` for deeply nested objects

When a nested object is complex but you don't need to validate its shape:

```typescript
const AdminPatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  emergencyContact: z.unknown().optional(),  // don't validate internals
  medicalInfo: z.unknown().optional(),
});
```

This keeps the schema lean for fields that the current feature doesn't consume.

---

## 5. Enums, Unions & Literals

### `z.enum()` — string enums

```typescript
const StatusSchema = z.enum(['pending', 'confirmed', 'completed', 'cancelled']);
type Status = z.infer<typeof StatusSchema>;  // 'pending' | 'confirmed' | ...
```

Real examples from this project:

```typescript
// Transaction types
const TransactionTypeSchema = z.enum([
  'payment', 'refund', 'payout', 'commission', 'subscription', 'deposit', 'deduction',
]);

// Fraud severity
const FraudSeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);

// Payment methods
const PaymentMethodSchema = z.enum(['card', 'd17', 'cash', 'bank_transfer', 'wallet']);
```

### Restricting enums for different contexts

The auth schemas show a clever pattern — different enum subsets for different operations:

```typescript
// All roles that can appear in API responses
const userRoleResponseEnum = z.enum(['patient', 'provider', 'admin', 'super_admin']);

// Only roles allowed during self-registration
const registrationRoleEnum = z.enum(['patient', 'provider']);
```

This means a registration form can only submit `patient` or `provider`, but login responses can include `admin`.

---

## 6. Transforms & Refinements

### Transforms — modify data during parsing

A transform changes the **value** after basic validation passes:

```typescript
const EmailSchema = z
  .string()
  .min(1, 'Required')
  .transform((val) => val.trim().toLowerCase());
  // Input: "  Alice@Example.COM  "
  // Output: "alice@example.com"
```

The inferred type changes: input is `string`, output is also `string` but normalized.

### Refinements — add custom validation rules

A refinement adds validation logic that Zod's built-in methods can't express:

```typescript
const PasswordSchema = z
  .string()
  .min(8, 'Minimum 8 characters')
  .max(128, 'Maximum 128 characters')
  .refine(
    (val) => {
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      const hasSpecial = /[!@#$%^&*]/.test(val);
      const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
      return score >= 3;
    },
    { message: 'Must contain at least 3 of: uppercase, lowercase, number, special character' },
  )
  .refine(
    (val) => !['password', '12345678', 'qwerty123'].includes(val.toLowerCase()),
    { message: 'This password is too common' },
  );
```

You can chain multiple `.refine()` calls. Each one runs in order and stops at the first failure.

### Combining transforms and refinements

Transform first, then validate the transformed value:

```typescript
// Tunisia phone number: strip formatting, then validate
const TunisiaPhoneSchema = z
  .string()
  .min(1, 'Phone number required')
  .transform((val) => val.replace(/[\s\-.\(\)]/g, ''))  // strip spaces, dashes, dots
  .refine((val) => /^(\+?216)?[2-9]\d{7}$/.test(val), {
    message: 'Invalid Tunisian phone format',
  });
```

### Parameterized schema factories

When you need the same pattern with different labels:

```typescript
function nameSchema(fieldLabel = 'Name') {
  return z
    .string()
    .min(1, `${fieldLabel} required`)
    .transform((val) => val.trim())
    .refine((val) => val.length >= 2, {
      message: `${fieldLabel} too short (min 2 characters)`,
    })
    .refine((val) => /^[\p{L}\s\-'.]+$/u.test(val), {
      message: `${fieldLabel} contains invalid characters`,
    });
}

// Reuse with different labels:
const FirstNameSchema = nameSchema('First name');
const LastNameSchema = nameSchema('Last name');
```

The Unicode regex `\p{L}` supports Arabic, French, and Latin characters — important for a Tunisia-based app.

---

## 7. Type Inference — The Single Source of Truth

The most powerful Zod pattern: **define the schema once, derive the TypeScript type from it**.

```typescript
// Step 1: Define the schema
export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['payment', 'refund', 'payout']),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string(),
});

// Step 2: Infer the type
export type TransactionResponse = z.infer<typeof TransactionSchema>;
// Equivalent to:
// {
//   id: string;
//   type: 'payment' | 'refund' | 'payout';
//   amount: number;
//   currency: string;
//   createdAt: string;
// }
```

### Why this matters

Without Zod, you'd write the interface manually AND write validation logic separately. They can drift apart:

```typescript
// WITHOUT ZOD — two sources of truth that can diverge
interface Transaction {
  id: string;
  amount: number;  // you forgot to add 'currency' here
}
function validate(t: unknown) {
  // ...manual validation that checks 'currency'
}
```

With Zod, there's one source of truth. If you add a field to the schema, the type updates automatically.

### Convention in this project

Every `schema.ts` file follows this structure:

```typescript
// 1. Schema definitions (top of file)
export const FooSchema = z.object({ ... });
export const BarSchema = z.object({ ... });

// 2. Inferred types (bottom of file, in a dedicated section)
export type Foo = z.infer<typeof FooSchema>;
export type Bar = z.infer<typeof BarSchema>;
```

Components and hooks import the **types**. Services import the **schemas**. This keeps the dependency graph clean.

---

## 8. Shared Schemas

Shared schemas live in `src/shared/schemas/` and are used across multiple feature modules.

### File map

| File | Purpose |
|------|---------|
| `common.ts` | UUID, DateTime, .NET interop types, pagination, user enums, address |
| `api.schema.ts` | API response envelope, error schema, `safeParseResponse` helper |
| `tunisia.ts` | Tunisia-specific validations (phone, CIN, email, password, name, price) |
| `geo.ts` | Plain TypeScript interfaces (Location, Region, Country) — no Zod |
| `index.ts` | Barrel re-export of all shared schemas |

### Common reusable atoms (`common.ts`)

```typescript
// UUID validator — used in nearly every schema
export const uuidSchema = z.string().uuid();

// ISO datetime string
export const dateTimeSchema = z.string().datetime({ offset: true }).or(z.string().min(1));

// Nullable datetime (for optional timestamp fields)
export const nullableDateTime = dateTimeSchema.nullable().optional();
```

### .NET interop schemas

The backend is .NET, which uses different date/time formats. These schemas handle the conversion:

```typescript
// DateOnly: "2024-03-15" or Date object
export const DateOnlySchema = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  z.date(),
]).transform((val) => (val instanceof Date ? val.toISOString().split('T')[0] : val));

// TimeOnly: "14:30:00" or "14:30"
export const TimeOnlySchema = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/);

// TimeSpan: "02:30:00" (hours:minutes:seconds)
export const TimeSpanSchema = z.string().regex(/^-?\d+:\d{2}:\d{2}$/);
```

### Pagination metadata

Every paginated API response includes the same pagination shape:

```typescript
export const PaginationMetadataSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
});
```

### User enums

```typescript
export const UserRoleSchema = z.enum(['patient', 'provider', 'admin', 'super_admin']);
export const UserStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending']);
export const UserSegmentSchema = z.enum(['new', 'regular', 'vip', 'churned']);
```

### API response envelope (`api.schema.ts`)

The backend wraps all responses in a standard envelope:

```typescript
export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
  });
}

// Usage:
const BookingResponseEnvelope = apiResponseSchema(BookingSchema);
// Validates: { success: true, data: { id: "...", ... }, message: "OK" }
```

### The `safeParseResponse` helper

For gradual migration, this helper logs validation warnings without crashing:

```typescript
export function safeParseResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  label?: string,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(`[Zod] ${label ?? 'Response'} validation:`, result.error.issues);
    return data as z.infer<T>;  // pass through unvalidated
  }
  return result.data;
}
```

---

## 9. Feature Schemas

Each feature module has its own `schema.ts` in `src/features/<name>/schema.ts`. All 19 features follow the same structure.

### Anatomy of a feature schema file

```
// 1. File header comment (lists all DTOs covered)
// 2. Imports from shared schemas
// 3. Schema definitions, grouped by section comments
// 4. Inferred types at the bottom
```

### Example: Auth schemas (`src/features/auth/schema.ts`)

```typescript
import { z } from 'zod';
import { uuidSchema, dateTimeSchema } from '@/shared/schemas/common';

// Request schema (what the client SENDS)
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

// Response schema (what the server RETURNS)
export const LoginResponseSchema = z.object({
  user: LoginUserResponseSchema,  // nested schema
  token: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int(),
});

// Inferred types
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
```

### Schemas for different audiences

Some features define separate schemas for different consumers of the same data:

**Provider management view** (detailed, for the provider editing their own services):
```typescript
export const ServiceDetailResponseSchema = z.object({
  id: uuidSchema,
  providerId: uuidSchema,
  price: z.number(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  requiresPrescription: z.boolean(),
  subServices: z.array(SubServiceResponseSchema).nullable().optional(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
  // ... 20+ fields
});
```

**Patient catalog view** (lightweight, for browsing):
```typescript
export const PatientServiceItemResponseSchema = z.object({
  id: uuidSchema,
  name: z.string().nullable().optional(),
  price: z.number(),
  imageUrl: z.string().nullable().optional(),
  provider: ServiceCatalogProviderDtoSchema.optional(),
  // ... 8 fields
});
```

### Feature schema inventory

| Feature | Schemas | Notable patterns |
|---------|---------|-----------------|
| **auth** | 8 schemas | Separate `registrationRoleEnum` (subset of roles) |
| **bookings** | 12 schemas | Request + Response pairs, booking status enum |
| **providers** | 10 schemas | Dashboard sub-schemas, availability history |
| **services** | 14 schemas | Provider vs. Patient views of same data |
| **equipment** | 12 schemas | Legacy catalog schemas alongside API schemas |
| **transactions** | 8 schemas | `z.record(PaymentMethodSchema, StatsSchema)` for typed dictionaries |
| **messaging** | 8 schemas | Conversation + Message + sub-schemas for sender info |
| **admin** | 30+ schemas | Largest file (432 lines), covers dashboard, fraud, tickets, subscriptions |
| **care-plan** | 4 schemas | Simple flat objects (conditions, medications, tasks) |
| **users** | 3 schemas | `z.unknown()` for deeply nested medical info |

---

## 10. Generic Factory Functions

When multiple features share the same structural pattern, use a generic factory.

### Paginated response factory

Every paginated endpoint returns `{ items: T[], pagination: {...} }`. Instead of repeating this, we have a factory:

```typescript
// src/shared/schemas/common.ts
export function paginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema).nullable().optional(),
    pagination: PaginationMetadataSchema,
  });
}
```

Usage in feature schemas:

```typescript
// src/features/providers/schema.ts
export const PaginatedProvidersSchema = paginatedResponseSchema(ProviderResponseSchema);
type PaginatedProviders = z.infer<typeof PaginatedProvidersSchema>;
// → { items: ProviderResponse[] | null | undefined; pagination: PaginationMetadata }
```

### API response envelope factory

```typescript
// src/shared/schemas/api.schema.ts
export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
  });
}
```

These factories give you type-safe validation without writing the wrapper object for every endpoint.

### Inline array wrapping with `z.array()`

When the API returns a plain array (no pagination), services wrap the item schema inline:

```typescript
// Validate an array of equipment categories
const raw = await api.get('/equipment/categories');
return z.array(EquipmentCategoryResponseSchema).parse(raw);
```

---

## 11. How Services Use Schemas

Services are the **only** place where `.parse()` is called. This is the boundary where untyped API data becomes validated, typed data.

### The universal pattern

Every service function follows the same three steps:

```typescript
export async function getServiceCatalog(params?: CatalogParams) {
  // 1. Call the API
  const raw = await api.get<PatientServiceCatalogResponse>('/service-catalog', {
    params: { ... },
  });

  // 2. Validate with Zod (throws ZodError if invalid)
  return PatientServiceCatalogResponseSchema.parse(raw);

  // 3. The return type is automatically inferred from the schema
}
```

### What happens on validation failure?

`.parse()` throws a `ZodError` with detailed field-level messages:

```
ZodError: [
  { path: ['items', 0, 'price'], message: 'Expected number, received string' },
  { path: ['pagination', 'total'], message: 'Required' },
]
```

This error propagates up through React Query, which catches it and exposes it via `query.error`. The component can then display a generic error message.

### Validation at mutation boundaries

Mutations also validate responses:

```typescript
export async function sendMessage(conversationId: string, content: string) {
  const raw = await api.post(`/conversations/${conversationId}/messages`, {
    messageType: 'text',
    content,
  });
  return MessageResponseSchema.parse(raw);  // validate server's response
}
```

### Null handling pattern

Some services unwrap paginated responses:

```typescript
export async function getConversations(filters?) {
  const raw = await api.get('/conversations', { params: filters });
  const parsed = ConversationsResponseSchema.parse(raw);
  return parsed.items ?? [];  // null-coalesce after validation
}
```

The `?? []` handles the case where `items` is `null` (valid per schema: `.nullable().optional()`).

---

## 12. Checklist: Adding a New Schema

When a new API endpoint is added:

1. **Identify the DTO** — what does the endpoint send/receive?
2. **Check shared schemas** — does `common.ts` already have what you need (uuid, datetime, pagination)?
3. **Create or update `schema.ts`** in your feature folder
4. **Define the schema** with `z.object({...})`
   - Use `uuidSchema` for IDs, `dateTimeSchema` for timestamps
   - Use `.nullable().optional()` for fields that may be absent or null
   - Use `z.enum([...])` for string literals
   - Use `z.unknown()` for complex nested objects you don't need to validate
5. **Infer the type** at the bottom: `export type Foo = z.infer<typeof FooSchema>`
6. **Use `.parse()` in the service** function to validate API responses
7. **Import the type** (not the schema) in hooks and components

### File structure

```
src/features/yourFeature/
  ├── schema.ts    ← define schemas + export inferred types
  ├── service.ts   ← import schemas, call .parse() on API responses
  ├── hooks/       ← import types only
  └── index.ts     ← re-export types from schema.ts
```

### Common mistakes to avoid

- Writing `interface` by hand instead of using `z.infer` — the type and schema will drift apart
- Calling `.parse()` in components — validation belongs in the service layer
- Using `z.any()` instead of `z.unknown()` — `unknown` is type-safe, `any` defeats the purpose
- Forgetting `.nullable().optional()` on fields the API might omit — causes runtime crashes

---

**Next:** [11 — Axios Deep Dive](./11-axios.md) covers the HTTP client layer that sits beneath the services.
