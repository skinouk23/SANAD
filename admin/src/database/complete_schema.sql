
-- =====================================================
-- CAREATHOME - COMPLETE DATABASE SCHEMA
-- Multi-Country Healthcare Services Marketplace Platform
-- Version: 2.0
-- Date: January 2025
-- 
-- DEPLOYMENT ARCHITECTURE:
-- - One database per country (DE, FR, IT, ES, TN, etc.)
-- - Same schema across all countries
-- - Centralized admin app connects to all databases
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- SECTION 1: ENUMS (Type Definitions)
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('patient', 'provider', 'admin', 'super_admin');

-- Provider/Service types
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
    'pharmacy'           -- Pharmacie (future)
);

-- Booking statuses
CREATE TYPE booking_status AS ENUM (
    'pending',           -- En attente de confirmation
    'confirmed',         -- Confirmé par le professionnel
    'provider_on_way',   -- Professionnel en route
    'in_progress',       -- Service en cours
    'completed',         -- Service terminé (en attente validation)
    'validated',         -- Validé par le patient
    'cancelled',         -- Annulé
    'no_show',           -- Patient absent
    'disputed'           -- En litige
);

-- Payment statuses
CREATE TYPE payment_status AS ENUM (
    'pending',           -- En attente
    'authorized',        -- Autorisé (hold)
    'held',              -- Bloqué en escrow
    'captured',          -- Capturé
    'released',          -- Libéré au professionnel
    'refunded',          -- Remboursé
    'partially_refunded',-- Partiellement remboursé
    'failed',            -- Échoué
    'disputed'           -- En litige
);

-- Payment methods
CREATE TYPE payment_method AS ENUM (
    'card',              -- Carte bancaire
    'sepa',              -- Virement SEPA (Europe)
    'd17',               -- D17 (Tunisie)
    'flouci',            -- Flouci (Tunisie)
    'sobflous',          -- Sobflous (Tunisie)
    'mobile_money',      -- Mobile Money
    'bank_transfer',     -- Virement bancaire
    'cash'               -- Espèces (à éviter)
);

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'elite', 'enterprise');

-- Document types
CREATE TYPE document_type AS ENUM (
    'diploma',           -- Diplôme
    'license',           -- Licence professionnelle
    'insurance',         -- Assurance RC
    'id_card',           -- Carte d'identité
    'passport',          -- Passeport
    'registration',      -- Inscription ordre professionnel
    'certification',     -- Certification spécifique
    'equipment_cert',    -- Certification équipement
    'other'              -- Autre
);

-- Fraud decision
CREATE TYPE fraud_decision AS ENUM ('approve', 'review', 'block');

-- Fraud risk level
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Dispute status
CREATE TYPE dispute_status AS ENUM (
    'open',
    'investigating',
    'resolved_patient',
    'resolved_provider',
    'resolved_split',
    'closed'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'booking_new',
    'booking_confirmed',
    'booking_cancelled',
    'booking_reminder',
    'provider_arriving',
    'service_completed',
    'validation_required',
    'payment_received',
    'payment_released',
    'review_received',
    'message_new',
    'promotion',
    'system'
);

-- =====================================================
-- SECTION 2: CORE TABLES - USERS & AUTHENTICATION
-- =====================================================

-- Main users table (all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Authentication
    email VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Role & Status
    role user_role NOT NULL DEFAULT 'patient',
    is_active BOOLEAN DEFAULT TRUE,
    is_suspended BOOLEAN DEFAULT FALSE,
    suspended_at TIMESTAMP,
    suspended_reason TEXT,
    
    -- Contact
    phone VARCHAR(30),
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(100),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    password_changed_at TIMESTAMP,
    
    -- Profile
    preferred_language VARCHAR(10) DEFAULT 'fr',
    timezone VARCHAR(50) DEFAULT 'Europe/Paris',
    
    -- Metadata
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP, -- Soft delete
    
    CONSTRAINT users_email_unique UNIQUE (email) WHERE deleted_at IS NULL
);

-- User sessions (for security tracking)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session info
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    
    -- Device info
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    device_type VARCHAR(50), -- mobile, tablet, desktop
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 3: PATIENT PROFILES
-- =====================================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2) DEFAULT 'TN',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Emergency contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(30),
    emergency_contact_relationship VARCHAR(50),
    
    -- Medical info (encrypted in production)
    blood_type VARCHAR(10),
    medical_conditions TEXT,
    allergies TEXT,
    current_medications TEXT,
    medical_notes TEXT,
    
    -- Insurance
    insurance_provider VARCHAR(200),
    insurance_policy_number VARCHAR(100),
    insurance_expiry_date DATE,
    
    -- Profile
    profile_picture_url TEXT,
    bio TEXT,
    
    -- Preferences
    preferred_communication VARCHAR(20) DEFAULT 'app' CHECK (preferred_communication IN ('app', 'sms', 'email', 'phone')),
    marketing_consent BOOLEAN DEFAULT FALSE,
    data_sharing_consent BOOLEAN DEFAULT FALSE,
    
    -- Stats (denormalized for performance)
    total_bookings INTEGER DEFAULT 0,
    completed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    
    -- Metadata
    profile_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 4: PROVIDER PROFILES
-- =====================================================

CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Provider type
    service_category service_category NOT NULL,
    is_individual BOOLEAN DEFAULT TRUE, -- vs organization
    
    -- Business info
    business_name VARCHAR(200),
    legal_name VARCHAR(200),
    tax_id VARCHAR(50), -- SIRET (FR), Steuernummer (DE), etc.
    
    -- Personal info (for individuals)
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- Professional info
    license_number VARCHAR(100),
    license_issuing_authority VARCHAR(200),
    license_expiry_date DATE,
    specializations TEXT[], -- Array of specializations
    years_of_experience INTEGER,
    education TEXT,
    certifications TEXT[],
    languages_spoken TEXT[] DEFAULT ARRAY['fr'],
    
    -- Bio & Description
    bio TEXT,
    short_description VARCHAR(500),
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2) DEFAULT 'TN',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Service area
    service_radius_km INTEGER DEFAULT 20,
    serves_at_home BOOLEAN DEFAULT TRUE,
    serves_at_clinic BOOLEAN DEFAULT FALSE,
    clinic_address TEXT,
    
    -- Media
    profile_picture_url TEXT,
    cover_image_url TEXT,
    gallery_urls TEXT[],
    video_intro_url TEXT,
    
    -- Ratings (denormalized)
    rating_average DECIMAL(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    rating_professionalism DECIMAL(3, 2) DEFAULT 0.00,
    rating_punctuality DECIMAL(3, 2) DEFAULT 0.00,
    rating_quality DECIMAL(3, 2) DEFAULT 0.00,
    
    -- Stats (denormalized)
    total_bookings INTEGER DEFAULT 0,
    completed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    no_show_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0.00,
    response_rate DECIMAL(5, 2) DEFAULT 100.00,
    response_time_minutes INTEGER DEFAULT 60,
    
    -- Verification & Approval
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    
    -- Subscription
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    commission_rate DECIMAL(5, 2) DEFAULT 15.00, -- Platform commission %
    
    -- Payment info
    stripe_account_id VARCHAR(100),
    stripe_account_status VARCHAR(50),
    bank_name VARCHAR(200),
    bank_account_number VARCHAR(100), -- Encrypted
    bank_routing_number VARCHAR(50),
    
    -- Settings
    instant_booking_enabled BOOLEAN DEFAULT FALSE,
    auto_accept_bookings BOOLEAN DEFAULT FALSE,
    min_booking_notice_hours INTEGER DEFAULT 2,
    max_booking_advance_days INTEGER DEFAULT 30,
    cancellation_policy TEXT,
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    availability_status VARCHAR(50) DEFAULT 'available', -- available, busy, vacation
    vacation_start_date DATE,
    vacation_end_date DATE,
    
    -- Metadata
    profile_completed BOOLEAN DEFAULT FALSE,
    onboarding_step INTEGER DEFAULT 1,
    featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider documents
CREATE TABLE provider_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Document info
    document_type document_type NOT NULL,
    document_name VARCHAR(200),
    document_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    
    -- Extracted data (from OCR)
    extracted_data JSONB,
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    
    -- Validity
    issue_date DATE,
    expiry_date DATE,
    is_expired BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider certifications
CREATE TABLE provider_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    certification_name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200),
    certification_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    document_url TEXT,
    
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 5: SERVICES
-- =====================================================

-- Service categories (predefined)
CREATE TABLE service_categories_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    code service_category UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_fr VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    name_de VARCHAR(100),
    
    description_en TEXT,
    description_fr TEXT,
    
    icon VARCHAR(50),
    color VARCHAR(20),
    
    default_commission_rate DECIMAL(5, 2) DEFAULT 15.00,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services offered by providers
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Basic info
    category service_category NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    price_type VARCHAR(20) DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'daily', 'weekly', 'monthly', 'custom')),
    currency CHAR(3) DEFAULT 'EUR',
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    
    -- Duration
    duration_minutes INTEGER,
    min_duration_minutes INTEGER,
    max_duration_minutes INTEGER,
    
    -- Location
    service_location VARCHAR(20) DEFAULT 'home' CHECK (service_location IN ('home', 'clinic', 'both', 'remote')),
    
    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Requirements
    requires_prescription BOOLEAN DEFAULT FALSE,
    requires_medical_history BOOLEAN DEFAULT FALSE,
    age_restriction_min INTEGER,
    age_restriction_max INTEGER,
    
    -- Media
    image_url TEXT,
    gallery_urls TEXT[],
    
    -- Stats
    booking_count INTEGER DEFAULT 0,
    
    -- Category-specific fields (JSONB for flexibility)
    metadata JSONB DEFAULT '{}',
    -- Examples:
    -- Laboratory: {"test_type": "blood", "fasting_required": true, "result_time_hours": 24}
    -- Radiology: {"exam_type": "xray", "equipment": "digital", "preparation": "none"}
    -- Equipment: {"condition": "new", "deposit_required": true, "deposit_amount": 100}
    -- Gym: {"membership_type": "monthly", "trainer_included": false}
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service add-ons (optional extras)
CREATE TABLE service_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 6: SCHEDULING & AVAILABILITY
-- =====================================================

-- Provider weekly schedule (recurring)
CREATE TABLE provider_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    is_available BOOLEAN DEFAULT TRUE,
    
    -- For specific services only (null = all services)
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    CONSTRAINT unique_schedule UNIQUE (provider_id, day_of_week, start_time, service_id)
);

-- Provider unavailability (exceptions, vacations)
CREATE TABLE provider_unavailability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    
    is_all_day BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- iCal RRULE format
    
    reason VARCHAR(200),
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_datetime_range CHECK (start_datetime < end_datetime)
);

-- =====================================================
-- SECTION 7: BOOKINGS & APPOINTMENTS
-- =====================================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference number (human readable)
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Parties
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    service_id UUID NOT NULL REFERENCES services(id),
    
    -- Timing
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER,
    timezone VARCHAR(50) DEFAULT 'Europe/Paris',
    
    -- Status
    status booking_status DEFAULT 'pending',
    
    -- Patient info (snapshot at booking time)
    patient_name VARCHAR(200) NOT NULL,
    patient_phone VARCHAR(30),
    patient_email VARCHAR(255),
    
    -- Location
    service_location VARCHAR(20) CHECK (service_location IN ('home', 'clinic', 'remote')),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address_instructions TEXT,
    
    -- Medical notes
    patient_notes TEXT,
    symptoms TEXT,
    medical_history_shared BOOLEAN DEFAULT FALSE,
    
    -- For family member bookings
    is_for_family_member BOOLEAN DEFAULT FALSE,
    family_member_id UUID REFERENCES family_members(id),
    family_member_name VARCHAR(200),
    family_member_age INTEGER,
    
    -- Pricing
    service_price DECIMAL(10, 2) NOT NULL,
    addons_price DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_code VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'EUR',
    
    -- Commission
    commission_rate DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    provider_amount DECIMAL(10, 2) NOT NULL,
    
    -- Validation (escrow)
    validation_required BOOLEAN DEFAULT TRUE,
    validation_code VARCHAR(6),
    validation_code_expires_at TIMESTAMP,
    validated_at TIMESTAMP,
    validation_method VARCHAR(20), -- pin, link, auto
    auto_validate_at TIMESTAMP, -- Auto-validate after X hours
    
    -- Tracking
    provider_accepted_at TIMESTAMP,
    provider_departed_at TIMESTAMP,
    provider_arrived_at TIMESTAMP,
    service_started_at TIMESTAMP,
    service_completed_at TIMESTAMP,
    
    -- Cancellation
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    cancellation_fee DECIMAL(10, 2),
    
    -- Rescheduling
    rescheduled_from_id UUID REFERENCES bookings(id),
    reschedule_count INTEGER DEFAULT 0,
    
    -- Provider notes (private)
    provider_notes TEXT,
    
    -- Metadata
    source VARCHAR(50) DEFAULT 'web', -- web, mobile, api
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking add-ons selected
CREATE TABLE booking_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES service_addons(id),
    
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking status history
CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    
    previous_status booking_status,
    new_status booking_status NOT NULL,
    
    changed_by UUID REFERENCES users(id),
    change_reason TEXT,
    notes TEXT,
    
    -- Location at status change (for tracking)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 8: PAYMENTS & TRANSACTIONS
-- =====================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Reference
    transaction_number VARCHAR(30) UNIQUE NOT NULL,
    
    -- Related entities
    booking_id UUID NOT NULL REFERENCES bookings(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    -- Amounts
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    provider_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    currency CHAR(3) DEFAULT 'EUR',
    
    -- Payment details
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    
    -- Payment gateway
    gateway VARCHAR(50), -- stripe, d17, flouci
    gateway_payment_id VARCHAR(200),
    gateway_charge_id VARCHAR(200),
    gateway_transfer_id VARCHAR(200),
    gateway_response JSONB,
    
    -- Card details (masked)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    card_country CHAR(2),
    
    -- Escrow timeline
    authorized_at TIMESTAMP,
    held_at TIMESTAMP,
    captured_at TIMESTAMP,
    released_at TIMESTAMP,
    
    -- Fraud
    fraud_score DECIMAL(5, 2),
    fraud_decision fraud_decision,
    fraud_flags TEXT[],
    is_flagged BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    ip_address VARCHAR(45),
    device_fingerprint VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refunds
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    
    -- Amounts
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    
    -- Gateway
    gateway_refund_id VARCHAR(200),
    gateway_response JSONB,
    
    -- Processing
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider payouts
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    payout_number VARCHAR(30) UNIQUE NOT NULL,
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'EUR',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Method
    payout_method VARCHAR(50), -- bank_transfer, stripe, mobile_money
    bank_account_last_four VARCHAR(4),
    
    -- Gateway
    gateway VARCHAR(50),
    gateway_payout_id VARCHAR(200),
    gateway_response JSONB,
    
    -- Processing
    scheduled_for DATE,
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    failure_reason TEXT,
    
    -- Metadata
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payout line items (which transactions are included)
CREATE TABLE payout_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payout_id UUID NOT NULL REFERENCES payouts(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    
    amount DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 9: REVIEWS & RATINGS
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    service_id UUID NOT NULL REFERENCES services(id),
    
    -- Ratings
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    rating_professionalism INTEGER CHECK (rating_professionalism >= 1 AND rating_professionalism <= 5),
    rating_punctuality INTEGER CHECK (rating_punctuality >= 1 AND rating_punctuality <= 5),
    rating_quality INTEGER CHECK (rating_quality >= 1 AND rating_quality <= 5),
    rating_communication INTEGER CHECK (rating_communication >= 1 AND rating_communication <= 5),
    
    -- Content
    title VARCHAR(200),
    comment TEXT,
    
    -- Media
    photo_urls TEXT[],
    
    -- Verification
    is_verified BOOLEAN DEFAULT TRUE, -- Verified = from actual booking
    
    -- Moderation
    is_visible BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    moderated_at TIMESTAMP,
    moderated_by UUID REFERENCES users(id),
    
    -- Provider response
    provider_response TEXT,
    provider_responded_at TIMESTAMP,
    
    -- Fraud detection
    fraud_score DECIMAL(5, 2),
    is_suspicious BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Review reports (flagging inappropriate reviews)
CREATE TABLE review_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    
    reported_by UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 10: MESSAGING
-- =====================================================

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    -- Related booking (optional)
    booking_id UUID REFERENCES bookings(id),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Last message info (denormalized)
    last_message_at TIMESTAMP,
    last_message_preview VARCHAR(200),
    last_message_by UUID REFERENCES users(id),
    
    -- Unread counts
    patient_unread_count INTEGER DEFAULT 0,
    provider_unread_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_conversation UNIQUE (patient_id, provider_id, booking_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    sender_id UUID NOT NULL REFERENCES users(id),
    
    -- Content
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'location', 'system')),
    content TEXT NOT NULL,
    
    -- Attachments
    attachment_url TEXT,
    attachment_name VARCHAR(200),
    attachment_size_bytes INTEGER,
    attachment_mime_type VARCHAR(100),
    
    -- Location (for location messages)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 11: NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    booking_id UUID REFERENCES bookings(id),
    provider_id UUID REFERENCES providers(id),
    
    -- Action
    action_url TEXT,
    action_data JSONB,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Delivery
    sent_via_push BOOLEAN DEFAULT FALSE,
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Push notification tokens
CREATE TABLE push_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    token TEXT NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
    device_id VARCHAR(200),
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_push_token UNIQUE (user_id, token)
);

-- =====================================================
-- SECTION 12: FAMILY CIRCLE
-- =====================================================

CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Personal info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL, -- parent, child, spouse, sibling, other
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Contact
    phone VARCHAR(30),
    email VARCHAR(255),
    
    -- Medical info
    blood_type VARCHAR(10),
    medical_conditions TEXT,
    allergies TEXT,
    current_medications TEXT,
    
    -- Profile
    profile_picture_url TEXT,
    
    -- Permissions
    can_book_for BOOLEAN DEFAULT TRUE,
    can_view_history BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family member access (who can manage whom)
CREATE TABLE family_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- The patient granting access
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- The user receiving access (another patient account)
    granted_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Permissions
    can_book BOOLEAN DEFAULT TRUE,
    can_view_history BOOLEAN DEFAULT TRUE,
    can_view_medical BOOLEAN DEFAULT FALSE,
    can_manage_payments BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_family_access UNIQUE (patient_id, granted_to_user_id)
);

-- =====================================================
-- SECTION 13: HEALTH TRACKING
-- =====================================================

-- Activity tracking (daily)
CREATE TABLE activity_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    
    steps INTEGER DEFAULT 0,
    distance_km DECIMAL(10, 2) DEFAULT 0.00,
    calories_burned INTEGER DEFAULT 0,
    active_minutes INTEGER DEFAULT 0,
    floors_climbed INTEGER DEFAULT 0,
    
    -- Source
    source VARCHAR(50), -- manual, fitbit, apple_health, google_fit
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_activity_date UNIQUE (patient_id, date)
);

-- Hydration tracking (daily)
CREATE TABLE hydration_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    
    water_ml INTEGER DEFAULT 0,
    goal_ml INTEGER DEFAULT 2000,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_hydration_date UNIQUE (patient_id, date)
);

-- Nutrition tracking (per meal)
CREATE TABLE nutrition_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    
    food_name VARCHAR(200),
    calories INTEGER,
    protein_g DECIMAL(10, 2),
    carbs_g DECIMAL(10, 2),
    fat_g DECIMAL(10, 2),
    fiber_g DECIMAL(10, 2),
    sugar_g DECIMAL(10, 2),
    sodium_mg DECIMAL(10, 2),
    
    notes TEXT,
    photo_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nutrition profiles (goals)
CREATE TABLE nutrition_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Physical stats
    height_cm DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    target_weight_kg DECIMAL(5, 2),
    
    -- Activity level
    activity_level VARCHAR(20) CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    
    -- Goals
    goal VARCHAR(30) CHECK (goal IN ('lose_weight', 'maintain', 'gain_weight', 'build_muscle', 'improve_health')),
    
    -- Daily targets
    daily_calories INTEGER,
    daily_protein_g DECIMAL(10, 2),
    daily_carbs_g DECIMAL(10, 2),
    daily_fat_g DECIMAL(10, 2),
    daily_fiber_g DECIMAL(10, 2),
    daily_water_ml INTEGER DEFAULT 2000,
    
    -- Restrictions
    dietary_restrictions TEXT[], -- vegetarian, vegan, gluten_free, etc.
    food_allergies TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital signs tracking
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    measured_at TIMESTAMP NOT NULL,
    
    -- Vitals
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature_celsius DECIMAL(4, 2),
    oxygen_saturation INTEGER,
    blood_glucose DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    
    -- Context
    notes TEXT,
    measured_by VARCHAR(50), -- self, provider, device
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 14: REWARDS & GAMIFICATION
-- =====================================================

-- Patient rewards summary
CREATE TABLE patient_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Points
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    redeemed_points INTEGER DEFAULT 0,
    
    -- Streaks
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Level
    level INTEGER DEFAULT 1,
    level_name VARCHAR(50) DEFAULT 'Bronze',
    
    -- Stats
    total_bookings INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    icon_url TEXT,
    color VARCHAR(20),
    
    -- Requirements
    requirement_type VARCHAR(50), -- bookings, reviews, streak, referrals, etc.
    requirement_value INTEGER,
    
    -- Points awarded
    points_awarded INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient badges (earned)
CREATE TABLE patient_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_patient_badge UNIQUE (patient_id, badge_id)
);

-- Reward transactions
CREATE TABLE reward_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Transaction type
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    
    -- Points
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Reason
    reason VARCHAR(200) NOT NULL,
    
    -- Related entities
    booking_id UUID REFERENCES bookings(id),
    badge_id UUID REFERENCES badges(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrals
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    referrer_id UUID NOT NULL REFERENCES patients(id),
    referred_user_id UUID REFERENCES users(id),
    
    referral_code VARCHAR(20) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'completed', 'rewarded')),
    
    -- Rewards
    referrer_points INTEGER DEFAULT 0,
    referred_points INTEGER DEFAULT 0,
    referrer_rewarded_at TIMESTAMP,
    referred_rewarded_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 15: MARKETING & PROMOTIONS
-- =====================================================

-- Discount codes
CREATE TABLE discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Discount
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2),
    
    -- Validity
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    
    -- Usage limits
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    
    -- Restrictions
    min_order_amount DECIMAL(10, 2),
    applicable_services UUID[], -- null = all services
    applicable_categories service_category[],
    first_booking_only BOOLEAN DEFAULT FALSE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discount code usage
CREATE TABLE discount_code_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discount_code_id UUID NOT NULL REFERENCES discount_codes(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    
    discount_amount DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider marketing campaigns
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Campaign info
    name VARCHAR(200) NOT NULL,
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('social', 'email', 'sms', 'display', 'search')),
    objective VARCHAR(50) CHECK (objective IN ('awareness', 'engagement', 'conversions', 'retention')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    
    -- Schedule
    start_date DATE,
    end_date DATE,
    
    -- Budget
    budget DECIMAL(10, 2),
    spent_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Targeting
    target_age_min INTEGER,
    target_age_max INTEGER,
    target_gender VARCHAR(20),
    target_locations TEXT[],
    target_interests TEXT[],
    
    -- Content
    headline VARCHAR(200),
    description TEXT,
    cta_text VARCHAR(100),
    image_url TEXT,
    landing_url TEXT,
    
    -- Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign daily performance
CREATE TABLE campaign_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spent_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_campaign_date UNIQUE (campaign_id, date)
);

-- =====================================================
-- SECTION 16: SUBSCRIPTIONS
-- =====================================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    -- Plan
    tier subscription_tier NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired', 'suspended')),
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,
    trial_end_date DATE,
    next_billing_date DATE,
    cancelled_at TIMESTAMP,
    
    -- Pricing
    monthly_price DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'EUR',
    
    -- Features
    commission_rate DECIMAL(5, 2) NOT NULL,
    marketing_budget DECIMAL(10, 2) DEFAULT 0.00,
    priority_listing BOOLEAN DEFAULT FALSE,
    advanced_analytics BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    dedicated_support BOOLEAN DEFAULT FALSE,
    
    -- Auto-renewal
    auto_renew BOOLEAN DEFAULT TRUE,
    
    -- Gateway
    gateway_subscription_id VARCHAR(200),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription payments
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'EUR',
    
    -- Period
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Gateway
    gateway_payment_id VARCHAR(200),
    gateway_response JSONB,
    
    paid_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 17: INSURANCE CLAIMS
-- =====================================================

CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    
    provider_id UUID NOT NULL REFERENCES providers(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Patient info
    patient_name VARCHAR(200) NOT NULL,
    patient_insurance_provider VARCHAR(200),
    patient_insurance_number VARCHAR(100),
    
    -- Service info
    service_date DATE NOT NULL,
    service_description TEXT NOT NULL,
    diagnosis_codes TEXT[],
    procedure_codes TEXT[],
    
    -- Amounts
    claimed_amount DECIMAL(10, 2) NOT NULL,
    approved_amount DECIMAL(10, 2),
    paid_amount DECIMAL(10, 2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'partially_approved', 'rejected', 'paid', 'appealed')),
    
    -- Dates
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    
    -- Review
    rejection_reason TEXT,
    reviewer_notes TEXT,
    
    -- Documents
    invoice_url TEXT,
    medical_report_url TEXT,
    supporting_documents TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 18: DISPUTES & SUPPORT
-- =====================================================

CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    dispute_number VARCHAR(30) UNIQUE NOT NULL,
    
    booking_id UUID NOT NULL REFERENCES bookings(id),
    transaction_id UUID REFERENCES transactions(id),
    
    -- Parties
    reported_by UUID NOT NULL REFERENCES users(id),
    reported_against UUID NOT NULL REFERENCES users(id),
    
    -- Details
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    
    -- Status
    status dispute_status DEFAULT 'open',
    
    -- Resolution
    resolution TEXT,
    resolution_amount DECIMAL(10, 2),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    
    -- Escalation
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_at TIMESTAMP,
    escalated_to UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dispute messages
CREATE TABLE dispute_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
    
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachment_urls TEXT[],
    
    is_internal BOOLEAN DEFAULT FALSE, -- Admin-only notes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    ticket_number VARCHAR(30) UNIQUE NOT NULL,
    
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Details
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    
    -- Resolution
    resolution TEXT,
    resolved_at TIMESTAMP,
    
    -- Related entities
    booking_id UUID REFERENCES bookings(id),
    
    -- Satisfaction
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    satisfaction_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support ticket messages
CREATE TABLE support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    attachment_urls TEXT[],
    
    is_internal BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 19: FRAUD DETECTION
-- =====================================================

-- Fraud events (ML scoring results)
CREATE TABLE fraud_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event type
    event_type VARCHAR(50) NOT NULL, -- booking_created, payment_attempted, review_submitted, etc.
    
    -- Related entities
    user_id UUID REFERENCES users(id),
    provider_id UUID REFERENCES providers(id),
    booking_id UUID REFERENCES bookings(id),
    transaction_id UUID REFERENCES transactions(id),
    review_id UUID REFERENCES reviews(id),
    
    -- Scoring
    fraud_score DECIMAL(5, 2) NOT NULL,
    decision fraud_decision NOT NULL,
    risk_level risk_level NOT NULL,
    
    -- Features used (for explainability)
    features JSONB NOT NULL,
    top_risk_factors JSONB,
    
    -- Model info
    model_version VARCHAR(20) NOT NULL,
    processing_time_ms INTEGER,
    
    -- Manual review
    requires_review BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    review_decision VARCHAR(20), -- confirmed_fraud, false_positive, legitimate
    review_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud rules (manual rules)
CREATE TABLE fraud_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Rule type
    rule_type VARCHAR(50) NOT NULL, -- threshold, velocity, blacklist, pattern
    
    -- Configuration
    config JSONB NOT NULL,
    -- Examples:
    -- {"field": "booking_speed_seconds", "operator": "<", "value": 10}
    -- {"field": "amount", "operator": ">", "value": 500, "time_window_hours": 24}
    
    -- Action
    action fraud_decision NOT NULL,
    
    -- Priority (higher = checked first)
    priority INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud blacklist
CREATE TABLE fraud_blacklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    entity_type VARCHAR(50) NOT NULL, -- ip, email, email_domain, device, card_bin, phone
    entity_value VARCHAR(255) NOT NULL,
    
    reason TEXT,
    severity risk_level DEFAULT 'high',
    
    -- Source
    source VARCHAR(50), -- manual, ml, external
    added_by UUID REFERENCES users(id),
    
    -- Expiration
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_blacklist_entry UNIQUE (entity_type, entity_value)
);

-- User behavior tracking (for fraud detection)
CREATE TABLE user_behavior (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    
    -- Action
    action VARCHAR(100) NOT NULL,
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_fingerprint VARCHAR(255),
    
    -- Location
    country_code CHAR(2),
    city VARCHAR(100),
    
    -- Metadata
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 20: REAL-TIME TRACKING
-- =====================================================

-- Provider location updates (for tracking)
CREATE TABLE provider_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy_meters DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    speed_kmh DECIMAL(6, 2),
    
    -- Related booking (if on the way)
    booking_id UUID REFERENCES bookings(id),
    
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracking sessions
CREATE TABLE tracking_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Sharing
    share_token VARCHAR(100) UNIQUE,
    share_expires_at TIMESTAMP,
    
    -- ETA
    estimated_arrival_at TIMESTAMP,
    last_eta_update_at TIMESTAMP,
    
    -- Stats
    total_distance_km DECIMAL(10, 2),
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

-- =====================================================
-- SECTION 21: ADMIN & AUDIT
-- =====================================================

-- Admin action logs
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    
    -- Action
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Details
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs (all data changes)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What changed
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    
    -- Who changed
    user_id UUID REFERENCES users(id),
    
    -- Changes
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 22: EQUIPMENT RENTAL (Specific)
-- =====================================================

CREATE TABLE equipment_rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    
    -- Equipment details
    equipment_name VARCHAR(200) NOT NULL,
    equipment_serial_number VARCHAR(100),
    
    -- Rental period
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    actual_return_date DATE,
    
    -- Pricing
    daily_rate DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_returned BOOLEAN DEFAULT FALSE,
    
    -- Condition
    condition_at_pickup VARCHAR(50),
    condition_at_return VARCHAR(50),
    damage_notes TEXT,
    damage_fee DECIMAL(10, 2),
    
    -- Photos
    pickup_photos TEXT[],
    return_photos TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECTION 23: AMBULANCE SERVICES (Specific)
-- =====================================================

CREATE TABLE ambulance_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    
    -- Type
    service_type VARCHAR(50) NOT NULL, -- emergency, scheduled, inter_hospital, repatriation
    
    -- Pickup
    pickup_address TEXT NOT NULL,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    pickup_contact_name VARCHAR(200),
    pickup_contact_phone VARCHAR(30),
    
    -- Destination
    destination_address TEXT NOT NULL,
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    destination_facility_name VARCHAR(200),
    
    -- Patient condition
    patient_condition TEXT,
    requires_stretcher BOOLEAN DEFAULT FALSE,
    requires_oxygen BOOLEAN DEFAULT FALSE,
    requires_medical_staff BOOLEAN DEFAULT FALSE,
    
    -- Vehicle
    vehicle_type VARCHAR(50), -- basic, advanced, icu
    vehicle_registration VARCHAR(50),
    
    -- Crew
    driver_name VARCHAR(200),
    medic_name VARCHAR(200),
    
    -- Timing
    requested_pickup_time TIMESTAMP,
    actual_pickup_time TIMESTAMP,
    actual_arrival_time TIMESTAMP,
    
    -- Distance
    estimated_distance_km DECIMAL(10, 2),
    actual_distance_km DECIMAL(10, 2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_phone ON users(phone);

-- Patients
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_city ON patients(city);
CREATE INDEX idx_patients_location ON patients USING GIST (
    ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Providers
CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_category ON providers(service_category);
CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_approved ON providers(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_providers_rating ON providers(rating_average DESC);
CREATE INDEX idx_providers_location ON providers USING GIST (
    ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Services
CREATE INDEX idx_services_provider ON services(provider_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_services_price ON services(price);

-- Bookings
CREATE INDEX idx_bookings_patient ON bookings(patient_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- Transactions
CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_patient ON transactions(patient_id);
CREATE INDEX idx_transactions_provider ON transactions(provider_id);
CREATE INDEX idx_transactions_status ON transactions(payment_status);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_patient ON reviews(patient_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_visible ON reviews(is_visible) WHERE is_visible = TRUE;

-- Messages
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Fraud
CREATE INDEX idx_fraud_events_user ON fraud_events(user_id);
CREATE INDEX idx_fraud_events_decision ON fraud_events(decision);
CREATE INDEX idx_fraud_events_score ON fraud_events(fraud_score);
CREATE INDEX idx_fraud_events_created ON fraud_events(created_at DESC);
CREATE INDEX idx_fraud_blacklist_type_value ON fraud_blacklist(entity_type, entity_value);

-- User behavior
CREATE INDEX idx_user_behavior_user ON user_behavior(user_id);
CREATE INDEX idx_user_behavior_ip ON user_behavior(ip_address);
CREATE INDEX idx_user_behavior_device ON user_behavior(device_fingerprint);
CREATE INDEX idx_user_behavior_created ON user_behavior(created_at DESC);

-- Provider locations
CREATE INDEX idx_provider_locations_provider ON provider_locations(provider_id);
CREATE INDEX idx_provider_locations_booking ON provider_locations(booking_id);
CREATE INDEX idx_provider_locations_time ON provider_locations(recorded_at DESC);

-- Full-text search
CREATE INDEX idx_providers_search ON providers USING GIN (
    to_tsvector('french', coalesce(business_name, '') || ' ' || coalesce(bio, '') || ' ' || coalesce(first_name, '') || ' ' || coalesce(last_name, ''))
);
CREATE INDEX idx_services_search ON services USING GIN (
    to_tsvector('french', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_number = 'BK' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || LPAD(nextval('booking_number_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS booking_number_seq START 1;
CREATE TRIGGER generate_booking_number_trigger BEFORE INSERT ON bookings FOR EACH ROW EXECUTE FUNCTION generate_booking_number();

-- Generate transaction number
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.transaction_number = 'TRX' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || LPAD(nextval('transaction_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS transaction_number_seq START 1;
CREATE TRIGGER generate_transaction_number_trigger BEFORE INSERT ON transactions FOR EACH ROW EXECUTE FUNCTION generate_transaction_number();

-- Update provider rating on new review
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE providers SET
        rating_average = (SELECT AVG(rating) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE),
        rating_professionalism = (SELECT AVG(rating_professionalism) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE AND rating_professionalism IS NOT NULL),
        rating_punctuality = (SELECT AVG(rating_punctuality) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE AND rating_punctuality IS NOT NULL),
        rating_quality = (SELECT AVG(rating_quality) FROM reviews WHERE provider_id = NEW.provider_id AND is_visible = TRUE AND rating_quality IS NOT NULL)
    WHERE id = NEW.provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_provider_rating_trigger AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Update conversation last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations SET
        last_message_at = NEW.created_at,
        last_message_preview = LEFT(NEW.content, 200),
        last_message_by = NEW.sender_id
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_last_message_trigger AFTER INSERT ON messages FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert service categories
INSERT INTO service_categories_config (code, name_en, name_fr, icon, color, default_commission_rate, display_order) VALUES
('nursing', 'Nursing Care', 'Soins Infirmiers', 'heart-pulse', '#ef4444', 15.00, 1),
('elderly_care', 'Elderly Care', 'Aide aux Seniors', 'users', '#f97316', 12.00, 2),
('physiotherapy', 'Physiotherapy', 'Kinésithérapie', 'activity', '#22c55e', 18.00, 3),
('doctor', 'Doctor at Home', 'Médecin à Domicile', 'stethoscope', '#3b82f6', 20.00, 4),
('maternity', 'Maternity Care', 'Soins Maternité', 'baby', '#ec4899', 15.00, 5),
('night_care', 'Night Care', 'Garde de Nuit', 'moon', '#8b5cf6', 12.00, 6),
('psychology', 'Psychology', 'Soutien Psychologique', 'brain', '#06b6d4', 15.00, 7),
('chronic_care', 'Chronic Care', 'Soins Chroniques', 'clipboard-list', '#14b8a6', 15.00, 8),
('laboratory', 'Laboratory', 'Laboratoire', 'flask-conical', '#6366f1', 10.00, 9),
('radiology', 'Radiology', 'Radiologie', 'scan', '#a855f7', 10.00, 10),
('ambulance', 'Ambulance', 'Ambulance', 'ambulance', '#dc2626', 12.00, 11),
('nutrition', 'Nutrition', 'Nutrition', 'apple', '#84cc16', 15.00, 12),
('equipment_rental', 'Equipment Rental', 'Location Équipement', 'wheelchair', '#64748b', 15.00, 13),
('gym', 'Gym & Fitness', 'Salle de Sport', 'dumbbell', '#f59e0b', 20.00, 14);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_commission_rate', '15', 'number', 'Default platform commission percentage', FALSE),
('escrow_hold_hours', '48', 'number', 'Hours to hold payment in escrow after service completion', FALSE),
('auto_validate_hours', '48', 'number', 'Hours after which booking auto-validates if no dispute', FALSE),
('min_booking_notice_hours', '2', 'number', 'Minimum hours notice required for booking', TRUE),
('max_booking_advance_days', '30', 'number', 'Maximum days in advance a booking can be made', TRUE),
('cancellation_fee_percentage', '10', 'number', 'Cancellation fee percentage if cancelled within 24h', TRUE),
('referral_points_referrer', '100', 'number', 'Points awarded to referrer', FALSE),
('referral_points_referred', '50', 'number', 'Points awarded to referred user', FALSE),
('points_per_booking', '10', 'number', 'Points earned per completed booking', FALSE),
('points_per_review', '5', 'number', 'Points earned per review submitted', FALSE);

-- Insert default badges
INSERT INTO badges (code, name, description, requirement_type, requirement_value, points_awarded) VALUES
('first_booking', 'First Steps', 'Complete your first booking', 'bookings', 1, 50),
('loyal_5', 'Regular', 'Complete 5 bookings', 'bookings', 5, 100),
('loyal_10', 'Loyal Customer', 'Complete 10 bookings', 'bookings', 10, 200),
('loyal_25', 'VIP', 'Complete 25 bookings', 'bookings', 25, 500),
('reviewer', 'Reviewer', 'Leave your first review', 'reviews', 1, 25),
('super_reviewer', 'Super Reviewer', 'Leave 10 reviews', 'reviews', 10, 150),
('streak_7', 'Week Warrior', 'Maintain a 7-day streak', 'streak', 7, 100),
('streak_30', 'Monthly Champion', 'Maintain a 30-day streak', 'streak', 30, 300),
('referrer', 'Ambassador', 'Refer your first friend', 'referrals', 1, 100),
('super_referrer', 'Super Ambassador', 'Refer 5 friends', 'referrals', 5, 500);

-- =====================================================
-- FUNCTIONS FOR ADMIN CROSS-DATABASE QUERIES
-- =====================================================

-- Function to get country code (useful for admin queries)
CREATE OR REPLACE FUNCTION get_country_code()
RETURNS CHAR(2) AS $$
BEGIN
    RETURN current_setting('app.country_code', TRUE);
END;
$$ LANGUAGE plpgsql;

-- Set country code for session (called by admin app)
-- Usage: SELECT set_config('app.country_code', 'DE', FALSE);

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Main users table for all user types (patients, providers, admins)';
COMMENT ON TABLE patients IS 'Patient profiles with personal and medical information';
COMMENT ON TABLE providers IS 'Healthcare provider profiles including verification status';
COMMENT ON TABLE services IS 'Services offered by providers with pricing and details';
COMMENT ON TABLE bookings IS 'Appointments/bookings between patients and providers';
COMMENT ON TABLE transactions IS 'Payment transactions with escrow support';
COMMENT ON TABLE reviews IS 'Patient reviews of providers after completed bookings';
COMMENT ON TABLE fraud_events IS 'ML fraud detection results for monitoring and review';
COMMENT ON TABLE tracking_sessions IS 'Real-time GPS tracking sessions for home visits';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
