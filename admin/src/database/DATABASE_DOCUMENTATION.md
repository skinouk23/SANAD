
# Sanad (CareAtHome) Database Documentation
## Complete Schema Reference Guide - Tunisia Edition

---

## 📋 Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Application Pages & Database Mapping](#3-application-pages--database-mapping)
4. [Entity Relationship Diagram](#4-entity-relationship-diagram)
5. [Tables Reference](#5-tables-reference)
6. [Enums Reference](#6-enums-reference)
7. [Indexes & Performance](#7-indexes--performance)
8. [Triggers & Functions](#8-triggers--functions)
9. [Seed Data](#9-seed-data)
10. [API Integration](#10-api-integration)
11. [Multi-Country Deployment](#11-multi-country-deployment)

---

## 1. Overview

### Purpose
Sanad (سند) is a comprehensive healthcare marketplace platform for Tunisia, enabling:
- **Patients**: Book healthcare services, track health, manage family members
- **Providers**: Manage services, schedules, bookings, and payments
- **Admins**: Monitor platform, verify providers, handle disputes

### Key Features
- **UUID Primary Keys**: Global uniqueness across databases
- **Soft Deletes**: Critical tables support `deleted_at`
- **Audit Trail**: Comprehensive logging of all changes
- **JSONB Fields**: Flexible metadata storage
- **Full-Text Search**: Optimized search for providers/services
- **Geospatial Support**: Location-based queries
- **Escrow Payments**: Secure payment holding until service completion

### Database Engine
- **PostgreSQL 15+** (required)
- Extensions: `uuid-ossp`, `pgcrypto`, `pg_trgm`

### Currency & Locale
- **Currency**: TND (Tunisian Dinar)
- **Timezone**: Africa/Tunis
- **Languages**: French (primary), Arabic, English

---

## 2. Architecture

### Database Schema Files

| File | Purpose |
|------|---------|
| `complete_schema.sql` | Full production schema with all tables, indexes, triggers |
| `schema.sql` | Simplified schema for quick setup |
| `seeddata.sql` | Comprehensive dummy data for development/testing |

### Connection Configuration

```javascript
// Environment variables
DATABASE_URL=postgres://user:password@localhost:5432/sanad_tn
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sanad_tn
DB_USER=sanad_user
DB_PASSWORD=secure_password
```

---

## 3. Application Pages & Database Mapping

### Authentication Pages

| Page | Route | Database Tables |
|------|-------|-----------------|
| Login | `/auth/login` | `users`, `user_sessions` |
| Sign Up (Patient) | `/auth/signup` | `users`, `patients` |
| Sign Up (Professional) | `/auth/signup/professional` | `users`, `providers` |
| Sign Up (Equipment) | `/auth/signup/equipment` | `users`, `providers` (equipment_rental) |
| Sign Up (Laboratory) | `/auth/signup/laboratory` | `users`, `providers` (laboratory) |
| Sign Up (Radiology) | `/auth/signup/radiology` | `users`, `providers` (radiology) |
| Sign Up (Pharmacy) | `/auth/signup/pharmacy` | `users`, `providers` (pharmacy) |
| Sign Up (Gym) | `/auth/signup/gym` | `users`, `providers` (gym) |
| Sign Up (Funeral) | `/auth/signup/funeral` | `users`, `providers` (funeral) |
| Onboarding | `/auth/onboarding` | `users`, `patients`/`providers` |

### Patient Pages

| Page | Route | Database Tables |
|------|-------|-----------------|
| Landing Page | `/` | - |
| Service Selection | `/services` | `service_categories_config`, `providers` |
| Patient Dashboard | `/patient-dashboard` | `patients`, `bookings`, `patient_rewards` |
| Equipment Catalog | `/equipment` | `services` (equipment), `providers` |
| Equipment Detail | `/equipment/:id` | `services`, `providers`, `reviews` |
| Equipment Booking | `/equipment-booking` | `bookings`, `transactions` |
| Laboratory | `/laboratory` | `providers` (laboratory), `services` |
| Laboratory Booking | `/laboratory/booking` | `bookings`, `transactions` |
| Radiology | `/radiology` | `providers` (radiology), `services` |
| Radiology Booking | `/radiology/booking` | `bookings`, `transactions` |
| Pharmacy | `/pharmacy` | `providers` (pharmacy), `services` |
| Pharmacy Booking | `/pharmacy/booking` | `bookings`, `transactions` |
| Ambulance | `/ambulance` | `providers` (ambulance), `services` |
| Ambulance Booking | `/ambulance-booking` | `bookings`, `ambulance_bookings` |
| Care Services | `/care/:serviceId` | `providers`, `services` |
| Care Booking | `/care-booking/:serviceId` | `bookings`, `transactions` |
| Nutrition Providers | `/nutrition-providers` | `providers` (nutrition), `services` |
| Nutrition Booking | `/nutrition-booking` | `bookings`, `transactions` |
| Funeral Services | `/funeral` | `providers` (funeral), `services` |
| Funeral Booking | `/funeral/booking` | `bookings`, `transactions` |
| Gym | `/gym` | `providers` (gym), `services` |
| Gym Booking | `/gym/booking` | `bookings`, `subscriptions` |
| Messages | `/messages` | `conversations`, `messages` |
| Message Chat | `/messages/:conversationId` | `messages` |
| Mon Espace | `/mon-espace` | `patients`, `bookings`, `family_members` |
| Medicaments | `/medicaments` | `bookings` (pharmacy orders) |
| Aide | `/aide` | `support_tickets` |
| How It Works | `/how-it-works` | - |
| Subscriptions | `/subscriptions` | `subscriptions` |
| Health Tracking | `/health` | `activity_tracking`, `hydration_tracking` |
| Activity Tracking | `/health/activity` | `activity_tracking` |
| Hydration Tracking | `/health/hydration` | `hydration_tracking` |
| Nutrition Tracking | `/health/nutrition` | `nutrition_tracking` |
| Nutrition Profile | `/health/nutrition/profile` | `nutrition_profiles` |
| Health Concierge | `/health-concierge` | `patients`, `bookings` |
| Tracking Page | `/tracking/:appointmentId` | `tracking_sessions`, `provider_locations` |

### Provider Pages

| Page | Route | Database Tables |
|------|-------|-----------------|
| Provider Dashboard | `/provider-dashboard` | `providers`, `bookings`, `transactions` |
| Transaction History | `/provider/transactions` | `transactions`, `payouts` |
| Balance Management | `/provider/balance` | `transactions`, `payouts` |
| Service Management | `/provider/services` | `services`, `service_addons` |
| New Service | `/provider/services/new` | `services` |
| Schedule Management | `/provider/schedule` | `provider_schedules`, `provider_unavailability` |
| Analytics | `/provider/analytics` | `bookings`, `transactions`, `reviews` |
| Marketing Campaigns | `/provider/marketing` | `marketing_campaigns` |
| New Campaign | `/provider/marketing/new` | `marketing_campaigns` |
| Campaign Details | `/provider/marketing/:id` | `marketing_campaigns`, `campaign_performance` |
| Insurance | `/provider/insurance` | `insurance_claims` |
| File Claim | `/provider/insurance/file-claim` | `insurance_claims` |
| Billing | `/provider/billing` | `subscriptions`, `subscription_payments` |
| Pharmacy Orders | `/provider/pharmacy-orders` | `bookings` (pharmacy) |
| Active Delivery | `/provider/active-delivery/:appointmentId` | `bookings`, `tracking_sessions` |

### Admin Pages

| Page | Route | Database Tables |
|------|-------|-----------------|
| Analytics Dashboard | `/admin/dashboard` | All tables (aggregated) |
| Provider Lifecycle | `/admin/provider-lifecycle` | `providers`, `provider_documents` |
| Commission Management | `/admin/commission-cancellations` | `transactions`, `refunds` |
| Provider History | `/admin/history` | `providers`, `admin_actions` |
| Transaction Hub | `/admin/transaction-hub` | `transactions`, `payouts` |
| Reports | `/admin/reports` | All tables (reports) |
| Settings | `/admin/settings` | `system_settings` |
| Document Verification | `/admin/document-verification` | `provider_documents` |
| Support Tickets | `/admin/support-tickets` | `support_tickets` |
| User Management | `/admin/user-management` | `users`, `patients`, `providers` |
| Subscriptions | `/admin/subscriptions` | `subscriptions` |
| Audit Logs | `/admin/audit-logs` | `audit_logs`, `admin_actions` |
| System Health | `/admin/system-health` | System metrics |
| Transactions | `/admin/transactions` | `transactions` |
| Approvals | `/admin/approvals` | `providers`, `provider_documents` |
| Providers | `/admin/providers` | `providers` |
| Fraud Dashboard | `/admin/fraud` | `fraud_events`, `fraud_blacklist` |
| Provider Balances | `/admin/provider-balances` | `providers`, `transactions`, `payouts` |

---

## 4. Entity Relationship Diagram

### Core Relationships

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │  patients   │       │  providers  │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │◄──────│ user_id(FK) │       │ user_id(FK) │──────►│
│ email       │       │ first_name  │       │ business_   │       │
│ role        │       │ last_name   │       │   name      │       │
│ ...         │       │ ...         │       │ ...         │       │
└─────────────┘       └──────┬──────┘       └──────┬──────┘
                             │                     │
                             │                     │
                             ▼                     ▼
                      ┌─────────────┐       ┌─────────────┐
                      │  bookings   │◄──────│  services   │
                      │─────────────│       │─────────────│
                      │ patient_id  │       │ provider_id │
                      │ provider_id │       │ name        │
                      │ service_id  │       │ price       │
                      │ status      │       │ ...         │
                      │ ...         │       └─────────────┘
                      └──────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │transactions│  │  reviews  │  │ messages  │
       │───────────│  │───────────│  │───────────│
       │booking_id │  │booking_id │  │booking_id │
       │amount     │  │rating     │  │content    │
       │status     │  │comment    │  │...        │
       └───────────┘  └───────────┘  └───────────┘
```

### Complete Relationship Map

| Parent Table | Child Table | Relationship | Foreign Key |
|-------------|-------------|--------------|-------------|
| users | patients | 1:1 | user_id |
| users | providers | 1:1 | user_id |
| users | user_sessions | 1:N | user_id |
| users | notifications | 1:N | user_id |
| patients | bookings | 1:N | patient_id |
| patients | family_members | 1:N | patient_id |
| patients | patient_rewards | 1:1 | patient_id |
| patients | conversations | 1:N | patient_id |
| patients | activity_tracking | 1:N | patient_id |
| patients | hydration_tracking | 1:N | patient_id |
| patients | nutrition_tracking | 1:N | patient_id |
| patients | nutrition_profiles | 1:1 | patient_id |
| providers | services | 1:N | provider_id |
| providers | provider_documents | 1:N | provider_id |
| providers | provider_schedules | 1:N | provider_id |
| providers | provider_unavailability | 1:N | provider_id |
| providers | subscriptions | 1:N | provider_id |
| providers | marketing_campaigns | 1:N | provider_id |
| providers | insurance_claims | 1:N | provider_id |
| providers | conversations | 1:N | provider_id |
| providers | payouts | 1:N | provider_id |
| services | bookings | 1:N | service_id |
| services | service_addons | 1:N | service_id |
| services | reviews | 1:N | service_id |
| bookings | transactions | 1:1 | booking_id |
| bookings | reviews | 1:1 | booking_id |
| bookings | booking_status_history | 1:N | booking_id |
| bookings | disputes | 1:N | booking_id |
| bookings | ambulance_bookings | 1:1 | booking_id |
| bookings | equipment_rentals | 1:1 | booking_id |
| bookings | tracking_sessions | 1:1 | booking_id |
| transactions | refunds | 1:N | transaction_id |
| transactions | payout_items | 1:N | transaction_id |
| conversations | messages | 1:N | conversation_id |
| marketing_campaigns | campaign_performance | 1:N | campaign_id |
| support_tickets | support_ticket_messages | 1:N | ticket_id |
| disputes | dispute_messages | 1:N | dispute_id |
| badges | patient_badges | 1:N | badge_id |

---

## 5. Tables Reference

### 5.1 Users & Authentication

#### `users`
Central authentication table for all user types.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email address |
| email_verified | BOOLEAN | Email verification status |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| role | user_role | patient/provider/admin/super_admin |
| is_active | BOOLEAN | Account active status |
| is_suspended | BOOLEAN | Suspension status |
| phone | VARCHAR(30) | Phone number |
| phone_verified | BOOLEAN | Phone verification status |
| two_factor_enabled | BOOLEAN | 2FA enabled |
| preferred_language | VARCHAR(10) | UI language (fr/ar/en) |
| timezone | VARCHAR(50) | User timezone |
| last_login_at | TIMESTAMP | Last successful login |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |
| deleted_at | TIMESTAMP | Soft delete timestamp |

### 5.2 Patient Profiles

#### `patients`
Patient profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users (unique) |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| date_of_birth | DATE | Birth date |
| gender | VARCHAR(20) | male/female/other |
| address_line1 | TEXT | Street address |
| city | VARCHAR(100) | City |
| postal_code | VARCHAR(20) | Postal code |
| country_code | CHAR(2) | ISO country code (TN) |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| emergency_contact_name | VARCHAR(200) | Emergency contact |
| emergency_contact_phone | VARCHAR(30) | Emergency phone |
| blood_type | VARCHAR(10) | Blood type |
| medical_conditions | TEXT | Known conditions |
| allergies | TEXT | Known allergies |
| insurance_provider | VARCHAR(200) | Insurance company |
| insurance_policy_number | VARCHAR(100) | Policy number |
| profile_picture_url | TEXT | Avatar URL |
| total_bookings | INTEGER | Total bookings (denorm) |
| completed_bookings | INTEGER | Completed (denorm) |
| total_spent | DECIMAL(12,2) | Total spent (denorm) |
| profile_completed | BOOLEAN | Profile complete flag |

### 5.3 Provider Profiles

#### `providers`
Healthcare provider profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users (unique) |
| service_category | service_category | Provider type |
| is_individual | BOOLEAN | Individual vs organization |
| business_name | VARCHAR(200) | Business name |
| first_name | VARCHAR(100) | First name (individuals) |
| last_name | VARCHAR(100) | Last name (individuals) |
| license_number | VARCHAR(100) | Professional license |
| specializations | TEXT[] | Specializations array |
| years_of_experience | INTEGER | Experience years |
| bio | TEXT | Full bio |
| address_line1 | TEXT | Address |
| city | VARCHAR(100) | City |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| service_radius_km | INTEGER | Service radius |
| serves_at_home | BOOLEAN | Home visits |
| serves_at_clinic | BOOLEAN | Clinic visits |
| profile_picture_url | TEXT | Avatar URL |
| rating_average | DECIMAL(3,2) | Avg rating (denorm) |
| rating_count | INTEGER | Review count (denorm) |
| total_bookings | INTEGER | Total bookings |
| total_revenue | DECIMAL(12,2) | Total revenue |
| is_verified | BOOLEAN | Verified status |
| is_approved | BOOLEAN | Approval status |
| subscription_tier | subscription_tier | Subscription level |
| commission_rate | DECIMAL(5,2) | Commission % |
| instant_booking_enabled | BOOLEAN | Instant booking |
| is_available | BOOLEAN | Available status |

#### `provider_documents`
Provider verification documents.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to providers |
| document_type | document_type | Type of document |
| document_name | VARCHAR(200) | File name |
| document_url | TEXT | Storage URL |
| is_verified | BOOLEAN | Verification status |
| verified_at | TIMESTAMP | When verified |
| verified_by | UUID | Verifier admin |
| expiry_date | DATE | Document expiry |

### 5.4 Services

#### `services`
Services offered by providers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider_id | UUID | FK to providers |
| category | service_category | Service category |
| name | VARCHAR(200) | Service name |
| description | TEXT | Full description |
| price | DECIMAL(10,2) | Base price |
| price_type | VARCHAR(20) | fixed/hourly/daily/monthly |
| currency | CHAR(3) | Currency code (TND) |
| duration_minutes | INTEGER | Service duration |
| service_location | VARCHAR(20) | home/clinic/both/remote |
| is_active | BOOLEAN | Active status |
| requires_prescription | BOOLEAN | Prescription needed |
| metadata | JSONB | Category-specific data |
| booking_count | INTEGER | Booking count |

**Metadata Examples by Category:**

```json
// Laboratory
{
  "test_type": "blood",
  "fasting_required": true,
  "result_time_hours": 24
}

// Radiology
{
  "exam_type": "xray",
  "equipment": "digital",
  "preparation": "none"
}

// Equipment Rental
{
  "condition": "new",
  "deposit_required": true,
  "deposit_amount": 100
}

// Gym
{
  "membership_type": "monthly",
  "trainer_included": false
}
```

### 5.5 Bookings

#### `bookings`
Core booking/appointment records.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| booking_number | VARCHAR(20) | Human-readable ID (auto) |
| patient_id | UUID | FK to patients |
| provider_id | UUID | FK to providers |
| service_id | UUID | FK to services |
| booking_date | DATE | Appointment date |
| start_time | TIME | Start time |
| duration_minutes | INTEGER | Duration |
| status | booking_status | Current status |
| patient_name | VARCHAR(200) | Patient name (snapshot) |
| patient_phone | VARCHAR(30) | Patient phone |
| service_location | VARCHAR(20) | home/clinic/remote |
| address_line1 | TEXT | Service address |
| city | VARCHAR(100) | City |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| service_price | DECIMAL(10,2) | Service price |
| platform_fee | DECIMAL(10,2) | Platform fee |
| total_amount | DECIMAL(10,2) | Total amount |
| commission_rate | DECIMAL(5,2) | Commission % |
| commission_amount | DECIMAL(10,2) | Commission amount |
| provider_amount | DECIMAL(10,2) | Provider receives |
| validation_required | BOOLEAN | Validation needed |
| validation_code | VARCHAR(6) | 4-6 digit PIN |
| validated_at | TIMESTAMP | When validated |
| provider_arrived_at | TIMESTAMP | Arrival time |
| service_started_at | TIMESTAMP | Service start |
| service_completed_at | TIMESTAMP | Service end |
| cancelled_at | TIMESTAMP | Cancellation time |
| cancellation_reason | TEXT | Cancel reason |

### 5.6 Transactions

#### `transactions`
Payment transactions with escrow support.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| transaction_number | VARCHAR(30) | Human-readable ID |
| booking_id | UUID | FK to bookings |
| patient_id | UUID | FK to patients |
| provider_id | UUID | FK to providers |
| amount | DECIMAL(10,2) | Total amount |
| platform_fee | DECIMAL(10,2) | Platform fee |
| provider_amount | DECIMAL(10,2) | Provider receives |
| currency | CHAR(3) | Currency (TND) |
| payment_method | payment_method | Payment method |
| payment_status | payment_status | Payment status |
| gateway | VARCHAR(50) | Payment gateway |
| authorized_at | TIMESTAMP | Authorization time |
| held_at | TIMESTAMP | Escrow hold time |
| captured_at | TIMESTAMP | Capture time |
| released_at | TIMESTAMP | Release time |
| fraud_score | DECIMAL(5,2) | Fraud score |
| fraud_decision | fraud_decision | Fraud decision |

**Payment Status Flow:**
```
pending → authorized → held → captured → released
                ↓           ↓
              failed     refunded
```

### 5.7 Reviews

#### `reviews`
Patient reviews of providers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| booking_id | UUID | FK to bookings (unique) |
| patient_id | UUID | FK to patients |
| provider_id | UUID | FK to providers |
| service_id | UUID | FK to services |
| rating | INTEGER | Overall rating (1-5) |
| rating_professionalism | INTEGER | Professionalism (1-5) |
| rating_punctuality | INTEGER | Punctuality (1-5) |
| rating_quality | INTEGER | Quality (1-5) |
| title | VARCHAR(200) | Review title |
| comment | TEXT | Review text |
| is_verified | BOOLEAN | From real booking |
| is_visible | BOOLEAN | Visible to public |
| provider_response | TEXT | Provider response |

### 5.8 Messaging

#### `conversations`
Chat threads between patients and providers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients |
| provider_id | UUID | FK to providers |
| booking_id | UUID | Related booking |
| is_active | BOOLEAN | Active flag |
| last_message_at | TIMESTAMP | Last message time |
| last_message_preview | VARCHAR(200) | Message preview |
| patient_unread_count | INTEGER | Patient unread |
| provider_unread_count | INTEGER | Provider unread |

#### `messages`
Individual messages in conversations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | FK to conversations |
| sender_id | UUID | FK to users |
| message_type | VARCHAR(20) | text/image/file/location |
| content | TEXT | Message content |
| attachment_url | TEXT | Attachment URL |
| is_read | BOOLEAN | Read status |
| read_at | TIMESTAMP | Read time |

### 5.9 Health Tracking

#### `activity_tracking`
Daily activity metrics.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients |
| date | DATE | Tracking date |
| steps | INTEGER | Step count |
| distance_km | DECIMAL(10,2) | Distance |
| calories_burned | INTEGER | Calories |
| active_minutes | INTEGER | Active minutes |
| source | VARCHAR(50) | Data source |

#### `hydration_tracking`
Daily hydration metrics.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients |
| date | DATE | Tracking date |
| water_ml | INTEGER | Water intake (ml) |
| goal_ml | INTEGER | Daily goal (ml) |

#### `nutrition_profiles`
Patient nutrition goals.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients (unique) |
| height_cm | DECIMAL(5,2) | Height |
| weight_kg | DECIMAL(5,2) | Current weight |
| target_weight_kg | DECIMAL(5,2) | Target weight |
| activity_level | VARCHAR(20) | Activity level |
| goal | VARCHAR(30) | Nutrition goal |
| daily_calories | INTEGER | Daily calorie target |
| daily_protein_g | DECIMAL(10,2) | Protein target |
| dietary_restrictions | TEXT[] | Restrictions array |

### 5.10 Rewards & Gamification

#### `patient_rewards`
Patient rewards summary.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | FK to patients (unique) |
| total_points | INTEGER | Total earned |
| available_points | INTEGER | Available to redeem |
| redeemed_points | INTEGER | Total redeemed |
| current_streak | INTEGER | Current streak |
| longest_streak | INTEGER | Longest streak |
| level | INTEGER | Current level |
| level_name | VARCHAR(50) | Level name |

#### `badges`
Achievement badges definition.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| code | VARCHAR(50) | Unique code |
| name | VARCHAR(100) | Badge name |
| description | TEXT | Description |
| requirement_type | VARCHAR(50) | Requirement type |
| requirement_value | INTEGER | Requirement value |
| points_awarded | INTEGER | Points awarded |

---

## 6. Enums Reference

### User Role
```sql
CREATE TYPE user_role AS ENUM (
    'patient',      -- Regular patient user
    'provider',     -- Healthcare provider
    'admin',        -- Platform administrator
    'super_admin'   -- Super administrator
);
```

### Service Category
```sql
CREATE TYPE service_category AS ENUM (
    'nursing',           -- Soins infirmiers
    'elderly_care',      -- Aide aux seniors
    'physiotherapy',     -- Kinésithérapie
    'doctor',            -- Médecin à domicile
    'maternity',         -- Soins maternité
    'night_care',        -- Garde de nuit
    'psychology',        -- Soutien psychologique
    'chronic_care',      -- Soins chroniques
    'laboratory',        -- Laboratoire
    'radiology',         -- Radiologie
    'ambulance',         -- Ambulance
    'nutrition',         -- Nutrition
    'equipment_rental',  -- Location équipement
    'gym',               -- Salle de sport
    'pharmacy',          -- Pharmacie
    'funeral'            -- Services funéraires
);
```

### Booking Status
```sql
CREATE TYPE booking_status AS ENUM (
    'pending',           -- En attente de confirmation
    'confirmed',         -- Confirmé par le professionnel
    'provider_on_way',   -- Professionnel en route
    'in_progress',       -- Service en cours
    'completed',         -- Service terminé
    'validated',         -- Validé par le patient
    'cancelled',         -- Annulé
    'no_show',           -- Patient absent
    'disputed'           -- En litige
);
```

### Payment Status
```sql
CREATE TYPE payment_status AS ENUM (
    'pending',           -- En attente
    'authorized',        -- Autorisé
    'held',              -- Bloqué en escrow
    'captured',          -- Capturé
    'released',          -- Libéré au professionnel
    'refunded',          -- Remboursé
    'partially_refunded',-- Partiellement remboursé
    'failed',            -- Échoué
    'disputed'           -- En litige
);
```

### Payment Method
```sql
CREATE TYPE payment_method AS ENUM (
    'card',              -- Carte bancaire
    'd17',               -- D17 (Tunisie)
    'flouci',            -- Flouci (Tunisie)
    'sobflous',          -- Sobflous (Tunisie)
    'mobile_money',      -- Mobile Money
    'bank_transfer',     -- Virement bancaire
    'cash'               -- Espèces
);
```

### Subscription Tier
```sql
CREATE TYPE subscription_tier AS ENUM (
    'free',
    'basic',
    'premium',
    'elite',
    'enterprise'
);
```

---

## 7. Indexes & Performance

### Key Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| users | idx_users_email | email | Email lookup |
| users | idx_users_role | role | Role filter |
| patients | idx_patients_location | (lat, lng) GIST | Geospatial |
| providers | idx_providers_search | (name, bio) GIN | Full-text |
| providers | idx_providers_location | (lat, lng) GIST | Geospatial |
| providers | idx_providers_approved | is_approved | Approved filter |
| providers | idx_providers_category | service_category | Category filter |
| bookings | idx_bookings_date | booking_date | Date filter |
| bookings | idx_bookings_status | status | Status filter |
| bookings | idx_bookings_patient | patient_id | Patient lookup |
| bookings | idx_bookings_provider | provider_id | Provider lookup |
| transactions | idx_transactions_status | payment_status | Status filter |
| messages | idx_messages_created | created_at DESC | Recent messages |

### Query Optimization Tips

1. **Provider Search**: Use the GIN index for full-text search
```sql
SELECT * FROM providers 
WHERE to_tsvector('french', business_name || ' ' || bio) @@ plainto_tsquery('french', 'infirmier tunis');
```

2. **Nearby Providers**: Use the GIST index for geospatial queries
```sql
SELECT * FROM providers 
WHERE ST_DWithin(
  ST_MakePoint(longitude, latitude)::geography,
  ST_MakePoint(10.1815, 36.8065)::geography,
  20000  -- 20km radius
);
```

3. **Recent Bookings**: Use date index with status filter
```sql
SELECT * FROM bookings 
WHERE provider_id = $1 
  AND booking_date >= CURRENT_DATE 
  AND status IN ('pending', 'confirmed')
ORDER BY booking_date, start_time;
```

---

## 8. Triggers & Functions

### Automatic Triggers

| Trigger | Table | Event | Purpose |
|---------|-------|-------|---------|
| update_*_updated_at | All | UPDATE | Auto-update timestamp |
| generate_booking_number | bookings | INSERT | Auto-generate booking # |
| generate_transaction_number | transactions | INSERT | Auto-generate txn # |
| update_provider_rating | reviews | INSERT/UPDATE | Update provider ratings |
| update_conversation_last_message | messages | INSERT | Update conversation |

### Key Functions

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_number = 'BK' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || 
                         LPAD(nextval('booking_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update provider rating on new review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE providers SET
        rating_average = (SELECT AVG(rating) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE)
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## 9. Seed Data

### Running Seed Data

```bash
# After creating the database and running schema
psql -d sanad_tn -f database/complete_schema.sql
psql -d sanad_tn -f database/seeddata.sql
```

### Seed Data Summary

| Entity | Count | Description |
|--------|-------|-------------|
| Users | 28 | 3 admins, 10 patients, 15 providers |
| Patients | 10 | Various cities in Tunisia |
| Providers | 15 | All service categories |
| Services | 36 | Multiple services per provider |
| Bookings | 12 | Various statuses |
| Transactions | 10 | Various payment statuses |
| Reviews | 5 | With ratings and comments |
| Conversations | 3 | With messages |
| Messages | 11 | Chat history |
| Notifications | 9 | Various types |
| Badges | 12 | Achievement badges |
| Discount Codes | 4 | Active promotions |

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@sanad.tn | Test123! |
| Admin | support@sanad.tn | Test123! |
| Patient | ahmed.benali@gmail.com | Test123! |
| Provider (Nursing) | infirmiere.sousse@sanad.tn | Test123! |
| Provider (Lab) | labo.pasteur@sanad.tn | Test123! |

---

## 10. API Integration

### TypeScript Types Mapping

```typescript
// User types
export type UserRole = 'patient' | 'provider' | 'admin' | 'super_admin';

// Service categories
export type ServiceCategory = 
  | 'nursing' | 'elderly_care' | 'physiotherapy' | 'doctor'
  | 'maternity' | 'night_care' | 'psychology' | 'chronic_care'
  | 'laboratory' | 'radiology' | 'ambulance' | 'nutrition'
  | 'equipment_rental' | 'gym' | 'pharmacy' | 'funeral';

// Booking status
export type BookingStatus = 
  | 'pending' | 'confirmed' | 'provider_on_way' | 'in_progress'
  | 'completed' | 'validated' | 'cancelled' | 'no_show' | 'disputed';

// Payment status
export type PaymentStatus = 
  | 'pending' | 'authorized' | 'held' | 'captured'
  | 'released' | 'refunded' | 'partially_refunded' | 'failed' | 'disputed';

// Payment methods
export type PaymentMethod = 
  | 'card' | 'd17' | 'flouci' | 'sobflous'
  | 'mobile_money' | 'bank_transfer' | 'cash';
```

### API Endpoints Mapping

| Endpoint | Method | Database Operation |
|----------|--------|-------------------|
| `/api/auth/login` | POST | SELECT from users |
| `/api/auth/register` | POST | INSERT into users, patients/providers |
| `/api/patients/:id` | GET | SELECT from patients JOIN users |
| `/api/providers` | GET | SELECT from providers with filters |
| `/api/providers/:id` | GET | SELECT from providers JOIN services |
| `/api/services` | GET | SELECT from services with filters |
| `/api/bookings` | POST | INSERT into bookings, transactions |
| `/api/bookings/:id` | PATCH | UPDATE bookings |
| `/api/transactions` | GET | SELECT from transactions |
| `/api/reviews` | POST | INSERT into reviews |
| `/api/messages` | POST | INSERT into messages |

---

## 11. Multi-Country Deployment

### Database Per Country

Each country has its own PostgreSQL database with identical schema:

| Country | Database | Currency | Timezone |
|---------|----------|----------|----------|
| Tunisia | sanad_tn | TND | Africa/Tunis |
| Germany | sanad_de | EUR | Europe/Berlin |
| France | sanad_fr | EUR | Europe/Paris |
| Italy | sanad_it | EUR | Europe/Rome |

### Country-Specific Settings

```sql
-- Tunisia
INSERT INTO system_settings (setting_key, setting_value) VALUES
('country_code', 'TN'),
('default_currency', 'TND'),
('default_timezone', 'Africa/Tunis'),
('default_language', 'fr'),
('emergency_number', '190'),
('vat_rate', '19');
```

### Admin App Connection

```typescript
// Admin app connects to all country databases
const connections = {
  tn: createPool(process.env.DB_URL_TN),
  de: createPool(process.env.DB_URL_DE),
  fr: createPool(process.env.DB_URL_FR),
};

// Query with country context
async function getProvidersByCountry(country: string) {
  const pool = connections[country];
  return pool.query('SELECT * FROM providers WHERE is_approved = TRUE');
}

// Aggregate across countries
async function getGlobalStats() {
  const results = await Promise.all(
    Object.entries(connections).map(async ([country, pool]) => {
      const result = await pool.query(`
        SELECT 
          '${country.toUpperCase()}' as country,
          COUNT(*) as total_providers
        FROM providers WHERE is_approved = TRUE
      `);
      return result.rows[0];
    })
  );
  return results;
}
```

---

## 📎 Appendix

### A. Quick Setup Commands

```bash
# Create database
createdb sanad_tn

# Run schema
psql -d sanad_tn -f database/complete_schema.sql

# Run seed data
psql -d sanad_tn -f database/seeddata.sql

# Verify setup
psql -d sanad_tn -c "SELECT COUNT(*) FROM users;"
```

### B. Backup & Restore

```bash
# Backup
pg_dump -Fc sanad_tn > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d sanad_tn backup_20250101.dump
```

### C. Performance Monitoring

```sql
-- Check slow queries
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Platform**: Sanad (سند) - Tunisia Healthcare Marketplace

---

*This documentation is for internal development use.*
