# Patient Profile APIs: Complete Production Guide

## Overview

The Patient Profile APIs manage everything about a patient's identity, preferences, family members, favorite providers, and engagement statistics within the CareAtHome healthcare marketplace. Let me break this down comprehensively.

---

## 1. Entities & Database Tables Involved

The Patient Profile APIs touch these core database tables:

### Primary Entities

```
┌──────────────┐       ┌──────────────────┐
│    users      │──1:1──│     patients      │
│              │       │                  │
│ id (PK)      │       │ id (PK)          │
│ email        │       │ user_id (FK→users)│
│ password_hash│       │ first_name       │
│ role         │       │ last_name        │
│ phone        │       │ date_of_birth    │
│ is_active    │       │ gender           │
└──────────────┘       │ address, city    │
                       │ emergency_contact│
                       │ medical_info     │
                       │ insurance_info   │
                       │ total_bookings   │
                       │ total_spent      │
                       └──────────────────┘
```

### Related Entities

```
patients ──1:N──→ family_members
patients ──1:N──→ patient_favorites (join table to providers)
patients ──1:1──→ patient_rewards
patients ──1:N──→ patient_badges
patients ──1:N──→ bookings
patients ──1:N──→ reviews
patients ──1:N──→ transactions
```

---

## 2. Entity Relationship Diagram

```
                    ┌─────────────┐
                    │   users     │
                    │─────────────│
                    │ id (UUID)   │
                    │ email       │
                    │ role        │
                    │ phone       │
                    └──────┬──────┘
                           │ 1:1
                           ▼
                    ┌──────────────┐
                    │  patients    │
                    │──────────────│
                    │ id           │
                    │ user_id (FK) │
                    │ first_name   │
                    │ last_name    │
                    │ ...          │
                    └──┬───┬───┬──┘
                       │   │   │
            ┌──────────┘   │   └──────────┐
            │              │              │
            ▼              ▼              ▼
  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐
  │family_members│  │patient_favs  │  │patient_rewards │
  │─────────────│  │(conceptual)  │  │────────────────│
  │id           │  │──────────────│  │total_points    │
  │patient_id   │  │patient_id    │  │current_streak  │
  │first_name   │  │provider_id   │  │longest_streak  │
  │relationship │  │added_at      │  │level           │
  │medical_info │  └──────┬───────┘  └────────────────┘
  └─────────────┘         │
                          ▼
                  ┌──────────────┐
                  │  providers   │
                  │──────────────│
                  │ id           │
                  │ name         │
                  │ rating       │
                  │ specialties  │
                  └──────────────┘
```

---

## 3. How Each Endpoint Functions

### 3.1 `GET /api/patients/me` — Get Patient Profile

**What it does:** Returns the complete profile of the currently authenticated patient.

**Flow:**
```
Client Request (Bearer Token)
       │
       ▼
┌─────────────────────┐
│ Auth Middleware      │──── Validates JWT token
│ - Extract user_id   │──── Checks role = 'patient'
│ - Verify not expired│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Patient Controller  │
│ getProfile()        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     SQL Query:
│ Patient Service     │     SELECT p.*, u.email, u.phone
│ findByUserId()      │──── FROM patients p
└──────────┬──────────┘     JOIN users u ON u.id = p.user_id
           │                WHERE p.user_id = $1
           ▼
┌─────────────────────┐
│ Response Mapper     │──── Transforms DB row → API response
│ - Format dates      │     (groups emergency_contact fields
│ - Group nested objs │      into nested object, arrays
│ - Sanitize          │      for medicalInfo, etc.)
└─────────────────────┘
```

**Dependencies:**
- **Authentication Service** — to decode the JWT and extract `user_id`
- **`users` table** — to verify the user exists and is active
- **`patients` table** — the main data source

**SQL equivalent:**
```sql
SELECT 
    p.id,
    p.user_id AS "userId",
    p.first_name AS "firstName",
    p.last_name AS "lastName",
    p.date_of_birth AS "dateOfBirth",
    p.gender,
    p.address_line1 AS "address",
    p.city,
    p.postal_code AS "postalCode",
    p.emergency_contact_name,
    p.emergency_contact_phone,
    p.emergency_contact_relationship,
    p.allergies,
    p.medical_conditions,
    p.current_medications,
    p.insurance_provider AS "insuranceProvider",
    p.insurance_policy_number AS "insuranceNumber",
    p.profile_picture_url AS "profilePictureUrl",
    p.created_at,
    p.updated_at
FROM patients p
WHERE p.user_id = :authenticated_user_id;
```

---

### 3.2 `PUT /api/patients/me` — Update Patient Profile

**What it does:** Partially updates the patient's profile. All fields are optional.

**Flow:**
```
Client Request (Bearer Token + JSON Body)
       │
       ▼
┌──────────────────────┐
│ Auth Middleware       │
│ + Validation Middleware│
│   - Validate types   │
│   - Sanitize input   │
│   - Check enum values│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Patient Controller   │
│ updateProfile()      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐     
│ Patient Service      │     1. Find patient by user_id
│ update()             │     2. Merge incoming fields with existing
└──────────┬───────────┘     3. UPDATE patients SET ... WHERE user_id = $1
           │                 4. Check if profile is now "complete"
           ▼                 5. Return updated record
┌──────────────────────┐
│ Audit Logger         │──── Log change to audit_logs table
└──────────────────────┘
```

**Key logic:**
- Only updates fields that are provided (partial update)
- Emergency contact fields arrive flat (`emergencyContactName`) but map to separate DB columns
- `allergies` and `currentMedications` arrive as strings in the API but store as TEXT in DB
- After update, the service checks if all required fields are filled → sets `profile_completed = true`

**SQL equivalent:**
```sql
UPDATE patients SET
    first_name = COALESCE(:firstName, first_name),
    last_name = COALESCE(:lastName, last_name),
    date_of_birth = COALESCE(:dateOfBirth, date_of_birth),
    gender = COALESCE(:gender, gender),
    address_line1 = COALESCE(:address, address_line1),
    city = COALESCE(:city, city),
    postal_code = COALESCE(:postalCode, postal_code),
    emergency_contact_name = COALESCE(:emergencyContactName, emergency_contact_name),
    emergency_contact_phone = COALESCE(:emergencyContactPhone, emergency_contact_phone),
    emergency_contact_relationship = COALESCE(:emergencyContactRelationship, emergency_contact_relationship),
    allergies = COALESCE(:allergies, allergies),
    current_medications = COALESCE(:currentMedications, current_medications),
    insurance_provider = COALESCE(:insuranceProvider, insurance_provider),
    insurance_policy_number = COALESCE(:insuranceNumber, insurance_policy_number),
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = :authenticated_user_id
RETURNING *;
```

---

### 3.3 `GET /api/patients/me/preferences` — Get Preferences

**What it does:** Returns the patient's notification and privacy preferences.

**Note:** The database schema doesn't have a separate `patient_preferences` table. This means you need to **create one**, or these preferences live as columns on the `patients` table. Based on the API spec, I recommend a dedicated table:

```sql
-- You need to CREATE this table (not in the original schema)
CREATE TABLE patient_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Notification settings
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Validation settings
    auto_validation_enabled BOOLEAN DEFAULT FALSE,
    validation_reminder_hours INTEGER DEFAULT 24,
    
    -- Privacy settings
    share_with_family BOOLEAN DEFAULT TRUE,
    allow_provider_messages BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Flow:**
```
Auth → Find patient_id from user_id → SELECT from patient_preferences
If no record exists → Return defaults (create on first access)
```

---

### 3.4 `PUT /api/patients/me/preferences` — Update Preferences

**Flow:**
```
Auth → Validate booleans/numbers → UPSERT into patient_preferences
```

**SQL:**
```sql
INSERT INTO patient_preferences (patient_id, email_notifications, sms_notifications, ...)
VALUES (:patient_id, :emailNotifications, :smsNotifications, ...)
ON CONFLICT (patient_id) 
DO UPDATE SET
    email_notifications = COALESCE(:emailNotifications, patient_preferences.email_notifications),
    sms_notifications = COALESCE(:smsNotifications, patient_preferences.sms_notifications),
    -- ... other fields
    updated_at = CURRENT_TIMESTAMP
RETURNING *;
```

---

### 3.5 `GET /api/patients/me/favorites` — Get Favorite Providers

**What it does:** Returns a list of providers the patient has bookmarked.

**Note:** You need a **join table** (not in the original schema):

```sql
-- You need to CREATE this table
CREATE TABLE patient_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_patient_favorite UNIQUE (patient_id, provider_id)
);
```

**Flow:**
```
Auth → Get patient_id → JOIN patient_favorites with providers
```

**SQL:**
```sql
SELECT 
    pf.id,
    pf.patient_id,
    pf.provider_id,
    pf.added_at,
    p.id AS "provider.id",
    COALESCE(p.business_name, p.first_name || ' ' || p.last_name) AS "provider.name",
    p.service_category AS "provider.serviceType",
    p.specializations AS "provider.specialties",
    p.rating_average AS "provider.rating",
    p.rating_count AS "provider.reviewCount",
    p.profile_picture_url AS "provider.profilePictureUrl",
    p.city AS "provider.city"
FROM patient_favorites pf
JOIN providers p ON p.id = pf.provider_id
WHERE pf.patient_id = :patient_id
ORDER BY pf.added_at DESC;
```

---

### 3.6 `POST /api/patients/me/favorites` — Add Favorite

**Flow:**
```
Auth → Validate providerId exists → Check not already favorited → INSERT
```

```sql
-- Check provider exists
SELECT id FROM providers WHERE id = :providerId AND is_approved = TRUE;

-- Insert (will fail on unique constraint if duplicate)
INSERT INTO patient_favorites (patient_id, provider_id)
VALUES (:patient_id, :providerId)
RETURNING *;
```

**Error cases:**
- `404` if provider doesn't exist
- `409 CONFLICT` if already favorited

---

### 3.7 `DELETE /api/patients/me/favorites/:providerId` — Remove Favorite

```sql
DELETE FROM patient_favorites 
WHERE patient_id = :patient_id AND provider_id = :providerId;
```

Returns `404` if the favorite didn't exist.

---

### 3.8 `GET /api/patients/me/family-circle` — Get Family Members

**Maps to:** `family_members` table (Section 12 in schema)

```sql
SELECT 
    id, patient_id, first_name, last_name, relationship,
    date_of_birth, gender, medical_conditions AS "medicalHistory",
    allergies, current_medications, created_at
FROM family_members
WHERE patient_id = :patient_id
ORDER BY created_at DESC;
```

---

### 3.9 `POST /api/patients/me/family-circle` — Add Family Member

```sql
INSERT INTO family_members (
    patient_id, first_name, last_name, relationship,
    date_of_birth, gender, medical_conditions, allergies, current_medications
) VALUES (
    :patient_id, :firstName, :lastName, :relationship,
    :dateOfBirth, :gender, :medicalHistory, :allergies, :currentMedications
) RETURNING *;
```

---

### 3.10 `DELETE /api/patients/me/family-circle/:memberId` — Remove Family Member

```sql
-- Verify ownership first!
DELETE FROM family_members 
WHERE id = :memberId AND patient_id = :patient_id;
```

**Important:** Must verify `patient_id` matches to prevent patients from deleting other patients' family members.

---

### 3.11 `GET /api/patients/me/stats` — Get Engagement Statistics

**What it does:** Aggregates data from multiple tables to return a dashboard of the patient's activity.

**Flow:**
```
Auth → Get patient_id → Run multiple queries (or single aggregated query)
```

**SQL:**
```sql
-- Option 1: Use denormalized fields on patients table + patient_rewards + count queries
SELECT 
    p.total_bookings AS "totalAppointments",
    p.completed_bookings AS "completedAppointments",
    
    -- Upcoming appointments (requires live query)
    (SELECT COUNT(*) FROM bookings b 
     WHERE b.patient_id = p.id 
     AND b.booking_date >= CURRENT_DATE 
     AND b.status IN ('pending', 'confirmed')) AS "upcomingAppointments",
    
    p.total_spent AS "totalSpent",
    
    -- From patient_rewards table
    pr.current_streak AS "careStreakDays",
    pr.longest_streak AS "longestStreak",
    pr.total_points AS "totalPoints",
    
    -- Badges count
    (SELECT COUNT(*) FROM patient_badges pb 
     WHERE pb.patient_id = p.id) AS "badgesEarned",
    
    -- Last appointment
    (SELECT MAX(b.booking_date) FROM bookings b 
     WHERE b.patient_id = p.id 
     AND b.status = 'validated') AS "lastAppointmentDate",
    
    -- Favorite providers count
    (SELECT COUNT(*) FROM patient_favorites pf 
     WHERE pf.patient_id = p.id) AS "favoriteProviders"

FROM patients p
LEFT JOIN patient_rewards pr ON pr.patient_id = p.id
WHERE p.user_id = :authenticated_user_id;
```

## 6. Tables You Need to Create (Missing from Schema)

The database schema doesn't include two tables the API requires:

```sql
-- 1. Patient Preferences (separate from patient profile)
CREATE TABLE patient_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    auto_validation_enabled BOOLEAN DEFAULT FALSE,
    validation_reminder_hours INTEGER DEFAULT 24,
    share_with_family BOOLEAN DEFAULT TRUE,
    allow_provider_messages BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_patient_preferences_updated_at 
    BEFORE UPDATE ON patient_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Patient Favorites (many-to-many between patients and providers)
CREATE TABLE patient_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_patient_favorite UNIQUE (patient_id, provider_id)
);

CREATE INDEX idx_patient_favorites_patient ON patient_favorites(patient_id);
CREATE INDEX idx_patient_favorites_provider ON patient_favorites(provider_id);
```

---

## 8. Summary: What Each Endpoint Depends On

| Endpoint | Tables Read | Tables Written | External Dependencies |
|----------|------------|---------------|----------------------|
| `GET /me` | `users`, `patients` | — | Auth service |
| `PUT /me` | `users`, `patients` | `patients`, `audit_logs` | Auth, Validator |
| `GET /me/preferences` | `patient_preferences` | — | Auth |
| `PUT /me/preferences` | `patient_preferences` | `patient_preferences` | Auth, Validator |
| `GET /me/favorites` | `patient_favorites`, `providers` | — | Auth |
| `POST /me/favorites` | `providers`, `patient_favorites` | `patient_favorites` | Auth, Validator |
| `DELETE /me/favorites/:id` | `patient_favorites` | `patient_favorites` | Auth |
| `GET /me/family-circle` | `family_members` | — | Auth |
| `POST /me/family-circle` | `family_members` | `family_members` | Auth, Validator |
| `DELETE /me/family-circle/:id` | `family_members` | `family_members` | Auth |
| `GET /me/stats` | `patients`, `bookings`, `patient_rewards`, `patient_badges`, `patient_favorites` | — | Auth |