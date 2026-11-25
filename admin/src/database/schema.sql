-- =====================================================
-- CARE@HOME TUNISIA - DATABASE SCHEMA
-- Healthcare Services Marketplace Platform
-- Version: 1.0
-- =====================================================

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Main users table (patients, providers, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'provider', 'admin')),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    profile_completed BOOLEAN DEFAULT FALSE,
    
    -- NEW: User preferences
    language_preference VARCHAR(10) DEFAULT 'fr',
    timezone VARCHAR(50) DEFAULT 'Africa/Tunis',
    country_code VARCHAR(2) DEFAULT 'TN'
);

-- Patient profiles
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    insurance_provider VARCHAR(200),
    insurance_number VARCHAR(100),
    profile_picture_url TEXT,
    
    -- NEW: Patient engagement tracking
    care_streak_days INTEGER DEFAULT 0,
    longest_care_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    total_points INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEW: Patient preferences table
CREATE TABLE patient_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    
    -- Validation preferences
    auto_validation_enabled BOOLEAN DEFAULT TRUE,
    validation_reminder_hours INTEGER DEFAULT 24,
    
    -- Privacy preferences
    share_with_family BOOLEAN DEFAULT TRUE,
    allow_provider_messages BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEW: Patient favorites (favorite providers)
CREATE TABLE patient_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, provider_id)
);

-- Provider profiles
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('nursing', 'night-care', 'elderly-care', 'physio', 'nutrition', 'ambulance', 'equipment', 'laboratory', 'radiology', 'gym')),
    business_name VARCHAR(200) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    license_number VARCHAR(100),
    specialization VARCHAR(200),
    years_of_experience INTEGER,
    bio TEXT,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    service_radius INTEGER, -- in kilometers
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date TIMESTAMP,
    subscription_tier VARCHAR(50) DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium', 'elite')),
    profile_picture_url TEXT,
    cover_image_url TEXT,
    
    -- NEW: Provider availability and performance
    is_online BOOLEAN DEFAULT FALSE,
    last_online_at TIMESTAMP,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    response_rate DECIMAL(5,2) DEFAULT 0.00,
    average_response_time_minutes INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEW: Provider availability status tracking
CREATE TABLE provider_availability_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    is_available BOOLEAN NOT NULL,
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider certifications
CREATE TABLE provider_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    certification_name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    document_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider documents (licenses, insurance, etc.)
CREATE TABLE provider_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('license', 'insurance', 'id_card', 'diploma', 'other')),
    document_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SERVICES
-- =====================================================

-- Services offered by providers
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER, -- in minutes
    location VARCHAR(50) CHECK (location IN ('home', 'clinic', 'both')),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Equipment rental specific fields
    equipment_image_url TEXT,
    equipment_condition VARCHAR(50) CHECK (equipment_condition IN ('new', 'good', 'fair')),
    deposit_amount DECIMAL(10,2),
    maintenance_schedule TEXT,
    
    -- Radiology specific fields
    exam_type VARCHAR(100),
    equipment_used VARCHAR(200),
    preparation_instructions TEXT,
    report_delivery_time VARCHAR(50),
    
    -- Laboratory specific fields
    test_type VARCHAR(100),
    fasting_required BOOLEAN,
    sample_collection VARCHAR(50),
    result_delivery_time VARCHAR(50),
    
    -- Gym specific fields
    membership_type VARCHAR(50),
    trainer_available BOOLEAN,
    
    -- Care specific fields
    specialization VARCHAR(200),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service facilities (for gyms)
CREATE TABLE service_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    facility_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service equipment needed (for care services)
CREATE TABLE service_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    equipment_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BOOKINGS & APPOINTMENTS
-- =====================================================

-- Bookings/Appointments
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration INTEGER, -- in minutes
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    
    -- Patient information
    patient_name VARCHAR(200),
    patient_phone VARCHAR(20),
    patient_address TEXT,
    patient_city VARCHAR(100),
    patient_notes TEXT,
    
    -- Location
    service_location VARCHAR(50) CHECK (service_location IN ('home', 'clinic')),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Pricing
    service_price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Validation
    validation_code VARCHAR(6),
    validation_required BOOLEAN DEFAULT TRUE,
    validated_at TIMESTAMP,
    
    -- Tracking
    provider_arrived_at TIMESTAMP,
    service_started_at TIMESTAMP,
    service_completed_at TIMESTAMP,
    
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking status history
CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PAYMENTS & TRANSACTIONS
-- =====================================================

-- Transactions (escrow system)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    provider_amount DECIMAL(10,2) NOT NULL,
    
    payment_method VARCHAR(50) CHECK (payment_method IN ('card', 'd17', 'sobflous', 'cash')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'released', 'refunded', 'failed')),
    
    -- Escrow
    held_at TIMESTAMP,
    released_at TIMESTAMP,
    refunded_at TIMESTAMP,
    
    -- Payment gateway details
    payment_gateway_id VARCHAR(200),
    payment_gateway_response TEXT,
    
    -- Fraud detection
    fraud_score DECIMAL(5,2),
    fraud_flags TEXT,
    is_flagged BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Provider payouts
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    
    payout_method VARCHAR(50) CHECK (payout_method IN ('bank_transfer', 'mobile_money')),
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(200),
    
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payout transactions (many-to-many)
CREATE TABLE payout_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payout_id UUID NOT NULL REFERENCES payouts(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REVIEWS & RATINGS
-- =====================================================

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_id UUID NOT NULL REFERENCES providers(id),
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Review categories
    professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    
    is_verified BOOLEAN DEFAULT TRUE,
    is_visible BOOLEAN DEFAULT TRUE,
    
    provider_response TEXT,
    provider_responded_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SCHEDULE & AVAILABILITY
-- =====================================================

-- Provider schedules (recurring availability)
CREATE TABLE provider_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    is_available BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(provider_id, day_of_week, start_time)
);

-- Provider unavailability (exceptions)
CREATE TABLE provider_unavailability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    
    reason TEXT,
    is_all_day BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MARKETING CAMPAIGNS
-- =====================================================

-- Marketing campaigns
CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('social', 'email', 'sms')),
    objective VARCHAR(50) CHECK (objective IN ('awareness', 'engagement', 'conversions')),
    
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    
    start_date DATE,
    end_date DATE,
    
    budget DECIMAL(10,2),
    spent_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Targeting
    target_age_min INTEGER,
    target_age_max INTEGER,
    target_location VARCHAR(200),
    
    -- Content
    headline VARCHAR(200),
    description TEXT,
    cta_text VARCHAR(100),
    image_url TEXT,
    
    -- Metrics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    ctr DECIMAL(5,2) DEFAULT 0.00,
    roi DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign interests (targeting)
CREATE TABLE campaign_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign performance (daily tracking)
CREATE TABLE campaign_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spent_amount DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(campaign_id, date)
);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

-- Provider subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('basic', 'premium', 'elite')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    
    start_date DATE NOT NULL,
    end_date DATE,
    next_billing_date DATE,
    
    monthly_price DECIMAL(10,2) NOT NULL,
    
    -- Features
    commission_rate DECIMAL(5,2), -- percentage
    marketing_budget DECIMAL(10,2), -- monthly budget for marketing
    priority_listing BOOLEAN DEFAULT FALSE,
    advanced_analytics BOOLEAN DEFAULT FALSE,
    
    auto_renew BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription payments
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    
    payment_gateway_id VARCHAR(200),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSURANCE
-- =====================================================

-- Insurance claims
CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id),
    booking_id UUID REFERENCES bookings(id),
    
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    patient_name VARCHAR(200) NOT NULL,
    patient_insurance_number VARCHAR(100),
    
    service_date DATE NOT NULL,
    service_description TEXT,
    
    claimed_amount DECIMAL(10,2) NOT NULL,
    approved_amount DECIMAL(10,2),
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'paid')),
    
    submission_date DATE,
    approval_date DATE,
    payment_date DATE,
    
    rejection_reason TEXT,
    notes TEXT,
    
    -- Documents
    invoice_url TEXT,
    medical_report_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- HEALTH TRACKING
-- =====================================================

-- Activity tracking
CREATE TABLE activity_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    steps INTEGER DEFAULT 0,
    distance DECIMAL(10,2) DEFAULT 0.00, -- in kilometers
    calories_burned INTEGER DEFAULT 0,
    active_minutes INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id, date)
);

-- Hydration tracking
CREATE TABLE hydration_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    water_intake INTEGER DEFAULT 0, -- in ml
    goal INTEGER DEFAULT 2000, -- in ml
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(patient_id, date)
);

-- Nutrition tracking
CREATE TABLE nutrition_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    meal_type VARCHAR(50) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    
    food_name VARCHAR(200),
    calories INTEGER,
    protein DECIMAL(10,2), -- in grams
    carbs DECIMAL(10,2), -- in grams
    fat DECIMAL(10,2), -- in grams
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nutrition profiles
CREATE TABLE nutrition_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID UNIQUE NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    age INTEGER,
    gender VARCHAR(20),
    activity_level VARCHAR(50) CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    
    goal VARCHAR(50) CHECK (goal IN ('lose_weight', 'maintain', 'gain_weight', 'build_muscle')),
    
    daily_calorie_goal INTEGER,
    daily_protein_goal DECIMAL(10,2),
    daily_carbs_goal DECIMAL(10,2),
    daily_fat_goal DECIMAL(10,2),
    
    dietary_restrictions TEXT,
    allergies TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FAMILY CIRCLE
-- =====================================================

-- Family members
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    
    medical_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REWARDS & GAMIFICATION
-- =====================================================

-- Patient rewards
CREATE TABLE patient_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    total_bookings INTEGER DEFAULT 0,
    total_reviews_given INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points_required INTEGER,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient badges (earned)
CREATE TABLE patient_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, badge_id)
);

-- Reward transactions
CREATE TABLE reward_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    points INTEGER NOT NULL,
    transaction_type VARCHAR(50) CHECK (transaction_type IN ('earned', 'redeemed', 'expired')),
    reason TEXT,
    
    booking_id UUID REFERENCES bookings(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MESSAGES & NOTIFICATIONS
-- =====================================================

-- Messages (chat between patients and providers)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    action_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FRAUD DETECTION
-- =====================================================

-- Fraud alerts
CREATE TABLE fraud_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    alert_type VARCHAR(50) CHECK (alert_type IN ('suspicious_booking', 'payment_fraud', 'fake_review', 'account_takeover', 'multiple_accounts')),
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    user_id UUID REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    transaction_id UUID REFERENCES transactions(id),
    
    description TEXT,
    fraud_score DECIMAL(5,2),
    
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'confirmed', 'false_positive', 'resolved')),
    
    investigated_by UUID REFERENCES users(id),
    investigated_at TIMESTAMP,
    resolution_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User behavior tracking (for fraud detection)
CREATE TABLE user_behavior (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_fingerprint VARCHAR(200),
    
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADMIN & SYSTEM CONFIGURATION
-- =====================================================

-- NEW: Admin settings table
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEW: Country instances for multi-country management
CREATE TABLE country_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    launch_date DATE,
    
    -- Instance-specific settings
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    min_transfer_amount DECIMAL(10,2) DEFAULT 50.00,
    auto_validation_hours INTEGER DEFAULT 48,
    
    -- Contact and support
    support_email VARCHAR(255),
    support_phone VARCHAR(20),
    admin_email VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NEW: System health monitoring
CREATE TABLE system_health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) REFERENCES country_instances(country_code),
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('operational', 'degraded', 'outage')),
    response_time_ms INTEGER,
    error_message TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- NEW: Admin activity tracking (enhanced)
CREATE TABLE admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    country_code VARCHAR(2),
    action_type VARCHAR(50) NOT NULL,
    action_description TEXT,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE (ENHANCED)
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_country_code ON users(country_code);

-- Patients
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_city ON patients(city);
CREATE INDEX idx_patients_care_streak ON patients(care_streak_days);

-- Patient favorites
CREATE INDEX idx_patient_favorites_patient_id ON patient_favorites(patient_id);
CREATE INDEX idx_patient_favorites_provider_id ON patient_favorites(provider_id);

-- Providers
CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_service_type ON providers(service_type);
CREATE INDEX idx_providers_city ON providers(city);
CREATE INDEX idx_providers_is_approved ON providers(is_approved);
CREATE INDEX idx_providers_rating ON providers(rating);
CREATE INDEX idx_providers_is_online ON providers(is_online);

-- Provider availability status
CREATE INDEX idx_provider_availability_provider_id ON provider_availability_status(provider_id);
CREATE INDEX idx_provider_availability_status_changed ON provider_availability_status(status_changed_at);

-- Services
CREATE INDEX idx_services_provider_id ON services(provider_id);
CREATE INDEX idx_services_is_active ON services(is_active);

-- Bookings
CREATE INDEX idx_bookings_patient_id ON bookings(patient_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);

-- Transactions
CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_patient_id ON transactions(patient_id);
CREATE INDEX idx_transactions_provider_id ON transactions(provider_id);
CREATE INDEX idx_transactions_payment_status ON transactions(payment_status);

-- Reviews
CREATE INDEX idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX idx_reviews_patient_id ON reviews(patient_id);

-- Messages
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Marketing Campaigns
CREATE INDEX idx_campaigns_provider_id ON marketing_campaigns(provider_id);
CREATE INDEX idx_campaigns_status ON marketing_campaigns(status);

-- Admin settings
CREATE INDEX idx_admin_settings_category ON admin_settings(setting_category);
CREATE INDEX idx_admin_settings_key ON admin_settings(setting_key);

-- Country instances
CREATE INDEX idx_country_instances_code ON country_instances(country_code);
CREATE INDEX idx_country_instances_active ON country_instances(is_active);

-- System health logs
CREATE INDEX idx_system_health_country ON system_health_logs(country_code);
CREATE INDEX idx_system_health_service ON system_health_logs(service_name);
CREATE INDEX idx_system_health_checked_at ON system_health_logs(checked_at);

-- Admin activity log
CREATE INDEX idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX idx_admin_activity_country ON admin_activity_log(country_code);
CREATE INDEX idx_admin_activity_created_at ON admin_activity_log(created_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA (ENHANCED)
-- =====================================================

-- Insert sample admin user
INSERT INTO users (email, password_hash, role, is_verified, is_active, country_code) 
VALUES ('admin@carehome.tn', '$2b$10$sample_hash', 'admin', TRUE, TRUE, 'TN');

-- Insert country instances
INSERT INTO country_instances (country_code, country_name, currency_code, is_active, commission_rate, support_email) VALUES
('TN', 'Tunisia', 'TND', TRUE, 15.00, 'support@carehome.tn'),
('MA', 'Morocco', 'MAD', TRUE, 15.00, 'support@carehome.ma'),
('DZ', 'Algeria', 'DZD', TRUE, 15.00, 'support@carehome.dz'),
('EG', 'Egypt', 'EGP', TRUE, 15.00, 'support@carehome.eg'),
('SA', 'Saudi Arabia', 'SAR', TRUE, 12.00, 'support@carehome.sa'),
('AE', 'UAE', 'AED', TRUE, 12.00, 'support@carehome.ae'),
('FR', 'France', 'EUR', FALSE, 18.00, 'support@carehome.fr');

-- Insert admin settings
INSERT INTO admin_settings (setting_category, setting_key, setting_value, setting_type, description) VALUES
('financial', 'platform_commission_rate', '15', 'number', 'Platform commission percentage'),
('financial', 'min_transfer_amount', '50', 'number', 'Minimum transfer amount in local currency'),
('validation', 'auto_validation_hours', '48', 'number', 'Hours before automatic validation'),
('validation', 'fraud_detection_enabled', 'true', 'boolean', 'Enable fraud detection system'),
('notifications', 'email_notifications_enabled', 'true', 'boolean', 'Enable email notifications'),
('notifications', 'sms_notifications_enabled', 'true', 'boolean', 'Enable SMS notifications'),
('system', 'maintenance_mode', 'false', 'boolean', 'System maintenance mode'),
('system', 'min_booking_notice_hours', '2', 'number', 'Minimum hours notice required for booking'),
('system', 'max_cancellation_hours', '24', 'number', 'Maximum hours before appointment to cancel without penalty');