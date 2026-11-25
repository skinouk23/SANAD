
# CareAtHome Database

## 📁 Files Overview

| File | Description |
|------|-------------|
| `complete_schema.sql` | Complete PostgreSQL schema with all tables, indexes, triggers |
| `sanad_seed_data.sql` | Rerunnable development/runtime seed truth, including nutrition provider subtype cases |
| `verify_nutrition_subtype_truth.sh` | Focused runtime proof for nutrition provider subtype truth on list/detail/me APIs |
| `verify_nutrition_subtype_truth.ps1` | Windows-native shim for the focused nutrition subtype verification flow |
| `DATABASE_DOCUMENTATION.md` | Detailed documentation of all tables, fields, relationships |
| `schema.sql` | Legacy schema (deprecated, use complete_schema.sql) |

## 🚀 Quick Start

### 1. Create Database

```bash
# Create database for a country (e.g., Tunisia)
createdb careathome_tn

# Or for European countries
createdb careathome_de  # Germany
createdb careathome_fr  # France
createdb careathome_it  # Italy
```

### 2. Run Schema

```bash
# Apply schema to database
psql -d careathome_tn -f complete_schema.sql
```

### 3. Seed Runtime Data

```bash
# Apply the rerunnable development/runtime seed truth
psql -d careathome_tn -f sanad_seed_data.sql
```

### 4. Verify Installation

```bash
# Focused proof that nutrition providers expose Nutritionist/Restaurant/Chef truth
bash verify_nutrition_subtype_truth.sh http://localhost:5000
```

> On this Windows workspace, the repo-root `bash.cmd` shim routes that command to a PowerShell implementation when needed. You can also run `powershell -File verify_nutrition_subtype_truth.ps1 http://localhost:5000` directly.

```sql
-- Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return 50+ tables
```

## 📊 Schema Statistics

| Category | Count |
|----------|-------|
| **Tables** | 52 |
| **Enums** | 12 |
| **Indexes** | 35+ |
| **Triggers** | 12 |
| **Functions** | 5 |

## 🏗️ Architecture

### Multi-Country Deployment

```
┌─────────────────────────────────────────┐
│          CENTRAL ADMIN APP              │
│         (connects to all DBs)           │
└───────┬───────┬───────┬───────┬────────┘
        │       │       │       │
        ▼       ▼       ▼       ▼
    ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
    │DB:DE │ │DB:FR │ │DB:IT │ │DB:TN │
    │Germany│ │France│ │Italy │ │Tunisia│
    └──────┘ └──────┘ └──────┘ └──────┘
    
    Same schema, separate data
```

### Key Design Principles

1. **UUID Primary Keys** - Global uniqueness across databases
2. **Soft Deletes** - `deleted_at` column for data recovery
3. **Audit Trail** - Complete change logging
4. **JSONB Flexibility** - Extensible metadata fields
5. **Denormalization** - Performance-optimized counters/ratings

## 📋 Table Categories

### Core (8 tables)
- `users` - Authentication & roles
- `patients` - Patient profiles
- `providers` - Provider profiles
- `services` - Service offerings
- `bookings` - Appointments
- `transactions` - Payments
- `reviews` - Ratings & reviews
- `messages` - Chat messages

### Supporting (20+ tables)
- Provider documents & certifications
- Scheduling & availability
- Notifications & push tokens
- Family members
- Health tracking
- Rewards & badges
- Marketing campaigns
- Subscriptions
- Insurance claims
- Disputes & support tickets

### Security (5 tables)
- `fraud_events` - ML fraud detection results
- `fraud_rules` - Manual fraud rules
- `fraud_blacklist` - Blocked entities
- `user_behavior` - Behavior tracking
- `audit_logs` - Change audit trail

## 🔗 Key Relationships

```
users (1) ──── (1) patients
users (1) ──── (1) providers
providers (1) ──── (N) services
patients (1) ──── (N) bookings
providers (1) ──── (N) bookings
services (1) ──── (N) bookings
bookings (1) ──── (1) transactions
bookings (1) ──── (1) reviews
```

## 🔐 Security Features

- **Password Hashing**: bcrypt via pgcrypto
- **Soft Deletes**: Data recovery capability
- **Audit Logging**: Complete change history
- **Fraud Detection**: ML scoring integration
- **Session Tracking**: Device fingerprinting
- **GDPR Compliance**: Data export/deletion support

## 📈 Performance Optimizations

### Indexes
- B-tree for lookups (email, status, dates)
- GIN for full-text search (providers, services)
- GIST for geospatial queries (location-based)

### Denormalization
- Provider ratings cached on `providers` table
- Booking counts cached on `patients`/`providers`
- Last message cached on `conversations`

### Partitioning (Recommended for Scale)
```sql
-- Partition bookings by date for large datasets
CREATE TABLE bookings_2025 PARTITION OF bookings
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

## 🌍 Country-Specific Configuration

Each database should have country-specific settings:

```sql
-- Example for Germany
INSERT INTO system_settings (setting_key, setting_value) VALUES
('country_code', 'DE'),
('default_currency', 'EUR'),
('default_timezone', 'Europe/Berlin'),
('default_language', 'de'),
('emergency_number', '112'),
('vat_rate', '19');
```

## 🔧 Admin App Connection

```typescript
// Connection registry for admin app
const connections = {
  de: new Pool({ connectionString: process.env.DB_URL_DE }),
  fr: new Pool({ connectionString: process.env.DB_URL_FR }),
  it: new Pool({ connectionString: process.env.DB_URL_IT }),
  tn: new Pool({ connectionString: process.env.DB_URL_TN }),
};

// Query with country identifier
const result = await connections.de.query(`
  SELECT *, 'DE' as country FROM patients LIMIT 100
`);

// Aggregate across all countries
const allPatients = await Promise.all(
  Object.entries(connections).map(([country, pool]) =>
    pool.query(`SELECT *, '${country.toUpperCase()}' as country FROM patients`)
  )
).then(results => results.flatMap(r => r.rows));
```

## 📚 Documentation

For detailed documentation, see:
- **[DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)** - Complete reference
- **[sanad_seed_data.sql](./sanad_seed_data.sql)** - Rerunnable runtime seed truth
- **[verify_nutrition_subtype_truth.sh](./verify_nutrition_subtype_truth.sh)** - Focused nutrition subtype verification flow
- **[verify_nutrition_subtype_truth.ps1](./verify_nutrition_subtype_truth.ps1)** - Windows-native shim for the same verification flow

## 🛠️ Maintenance

### Backup
```bash
# Full backup
pg_dump -Fc careathome_tn > backup_tn_$(date +%Y%m%d).dump

# Restore
pg_restore -d careathome_tn backup_tn_20250131.dump
```

### Vacuum
```sql
-- Regular maintenance
VACUUM ANALYZE;

-- Full vacuum (requires downtime)
VACUUM FULL;
```

### Statistics
```sql
-- Update statistics for query planner
ANALYZE;
```

## 📞 Support

For database issues, contact:
- **Email**: db-admin@careathome.eu
- **Slack**: #database-support

---

**Version**: 2.0  
**Last Updated**: January 2025
