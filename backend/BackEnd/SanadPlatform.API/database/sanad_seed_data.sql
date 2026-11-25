-- ============================================================
-- SANAD PLATFORM - COMPREHENSIVE SEED DATA
-- Compatible with: PostgreSQL via pgAdmin
-- All passwords: SeedPassword123!
-- Hash: $2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi
-- Run AFTER: EF Core migrations (dotnet ef database update)
-- Strategy: ON CONFLICT DO NOTHING plus deterministic reconciliation updates
--           (safe to re-run; existing rows are skipped then aligned)
-- ============================================================

BEGIN;

-- ==============================================================
-- 1. USERS
-- ==============================================================
INSERT INTO users (id, email, email_verified, email_verified_at, password_hash, role, is_active, is_suspended, phone, phone_verified, phone_verified_at, preferred_language, timezone, last_login_at, created_at, updated_at, last_login_ip, two_factor_secret, failed_login_attempts, two_factor_enabled)
VALUES
  ('9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'admin@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'admin', true, false, '+21650000001', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'admin2@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'admin', true, false, '+21650000002', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('0f8a2873-b963-48ad-bdb0-140513b61e82', 'support@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'admin', true, false, '+21650000003', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000001', 'ahmed.benali@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100001', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000002', 'fatma.trabelsi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100002', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000003', 'mohamed.saidi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100003', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000004', 'salma.khelifi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100004', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000005', 'youssef.gharbi@sanad.tn', false, NULL, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100005', false, NULL, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000006', 'nour.benhassen@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100006', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000007', 'khalil.mansouri@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100007', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000008', 'ines.chaabane@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100008', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000009', 'bilel.hamrouni@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100009', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000010', 'mariem.laabidi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100010', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000011', 'tarek.bouzid@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100011', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000012', 'asma.riahi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100012', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000013', 'firas.dridi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100013', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000014', 'olfa.baccar@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100014', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000015', 'hatem.jeridi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100015', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000016', 'wafa.souissi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100016', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('11000000-0000-0000-0000-000000000017', 'nizar.ferchichi@sanad.tn', false, NULL, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'patient', true, false, '+21650100017', false, NULL, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000001', 'dr.amira@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200001', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000002', 'dr.faouzi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200002', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000003', 'karim.bouazizi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200003', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000004', 'samia.dhahri@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200004', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000005', 'leila.hamdi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200005', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000006', 'slim.nasr@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200006', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000007', 'mehdi.jebali@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200007', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000008', 'riadh.chebbi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200008', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000009', 'sonia.ayari@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200009', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000010', 'dr.zied@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200010', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000011', 'hana.turki@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200011', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000012', 'bassem.ghariani@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200012', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000013', 'manel.keskes@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200013', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000014', 'dr.rim@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200014', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000015', 'aymen.baccouche@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200015', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 2. PATIENTS
-- ==============================================================
INSERT INTO patients (id, user_id, first_name, last_name, date_of_birth, gender, address_line1, city, state_province, postal_code, country_code, latitude, longitude, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, blood_type, profile_completed, total_bookings, completed_bookings, cancelled_bookings, total_spent, created_at, updated_at, insurance_provider, insurance_policy_number, preferred_communication, marketing_consent, data_sharing_consent)
VALUES
  ('02000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'Ahmed', 'Ben Ali', '1985-03-15', 'Male', '10 Rue de la République', 'Tunis', 'Tunis', '1111', 'TN', 36.81, 10.18, 'Contact de Ahmed', '+21659000001', 'spouse', 'A+', true, 6, 5, 1, 491.38, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'Fatma', 'Trabelsi', '1990-07-22', 'Female', '20 Rue de la République', 'Sfax', 'Sfax', '1222', 'TN', 34.74, 10.76, 'Contact de Fatma', '+21659000002', 'spouse', 'B+', true, 4, 3, 1, 306.34, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'Mohamed', 'Saidi', '1978-11-30', 'Male', '30 Rue de la République', 'Sousse', 'Sousse', '1333', 'TN', 35.82, 10.63, 'Contact de Mohamed', '+21659000003', 'spouse', 'O+', true, 4, 3, 1, 322.65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 'Salma', 'Khelifi', '1995-01-10', 'Female', '40 Rue de la République', 'Monastir', 'Monastir', '1444', 'TN', 35.76, 10.81, 'Contact de Salma', '+21659000004', 'spouse', 'AB-', true, 2, 1, 0, 247.02, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', 'Youssef', 'Gharbi', '2000-05-20', 'Male', '50 Rue de la République', 'Bizerte', 'Bizerte', '1555', 'TN', 37.27, 9.87, 'Contact de Youssef', '+21659000005', 'spouse', 'A-', true, 1, 0, 0, 483.31, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006', 'Nour', 'Ben Hassen', '1992-08-14', 'Female', '60 Rue de la République', 'Nabeul', 'Nabeul', '1666', 'TN', 36.45, 10.74, 'Contact de Nour', '+21659000006', 'spouse', 'O-', true, 3, 2, 0, 194.94, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000007', 'Khalil', 'Mansouri', '1970-12-05', 'Male', '70 Rue de la République', 'Kairouan', 'Kairouan', '1777', 'TN', 35.67, 10.1, 'Contact de Khalil', '+21659000007', 'spouse', 'B-', true, 2, 1, 0, 120.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000008', 'Ines', 'Chaabane', '1988-04-30', 'Female', '80 Rue de la République', 'Gabes', 'Gabes', '1888', 'TN', 33.88, 10.1, 'Contact de Ines', '+21659000008', 'spouse', 'AB+', true, 5, 4, 1, 376.55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000009', 'Bilel', 'Hamrouni', '1975-09-17', 'Male', '90 Rue de la République', 'Ariana', 'Ariana', '1999', 'TN', 36.87, 10.16, 'Contact de Bilel', '+21659000009', 'spouse', 'A+', true, 3, 2, 0, 209.33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000010', 'Mariem', 'Laabidi', '1998-02-28', 'Female', '100 Rue de la République', 'Ben Arous', 'Ben Arous', '2110', 'TN', 36.75, 10.22, 'Contact de Mariem', '+21659000010', 'spouse', 'B+', true, 7, 6, 1, 521.89, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000011', 'Tarek', 'Bouzid', '1982-06-11', 'Male', '110 Rue de la République', 'Hammamet', 'Nabeul', '2221', 'TN', 36.4, 10.61, 'Contact de Tarek', '+21659000011', 'spouse', 'O+', true, 2, 1, 0, 90.73, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000012', '11000000-0000-0000-0000-000000000012', 'Asma', 'Riahi', '1993-10-03', 'Female', '120 Rue de la République', 'La Marsa', 'Tunis', '2332', 'TN', 36.89, 10.32, 'Contact de Asma', '+21659000012', 'spouse', 'A-', true, 4, 3, 1, 312.78, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000013', 'Firas', 'Dridi', '1967-01-25', 'Male', '130 Rue de la République', 'Mahdia', 'Mahdia', '2443', 'TN', 35.5, 11.04, 'Contact de Firas', '+21659000013', 'spouse', 'O-', true, 1, 0, 0, 55.38, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000014', '11000000-0000-0000-0000-000000000014', 'Olfa', 'Baccar', '2003-12-08', 'Female', '140 Rue de la République', 'Gafsa', 'Gafsa', '2554', 'TN', 34.43, 8.78, 'Contact de Olfa', '+21659000014', 'spouse', 'AB+', true, 2, 1, 0, 155.77, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000015', 'Hatem', 'Jeridi', '1960-07-04', 'Male', '150 Rue de la République', 'Djerba', 'Medenine', '2665', 'TN', 33.87, 10.86, 'Contact de Hatem', '+21659000015', 'spouse', 'A+', true, 8, 7, 1, 715.65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000016', '11000000-0000-0000-0000-000000000016', 'Wafa', 'Souissi', '1987-11-19', 'Female', '160 Rue de la République', 'Manouba', 'Manouba', '2776', 'TN', 36.82, 10.1, 'Contact de Wafa', '+21659000016', 'spouse', 'B+', true, 3, 2, 0, 179.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false),
  ('02000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000017', 'Nizar', 'Ferchichi', '2001-03-22', 'Male', '170 Rue de la République', 'Tabarka', 'Jendouba', '2887', 'TN', 36.95, 8.76, 'Contact de Nizar', '+21659000017', 'spouse', 'O+', true, 4, 3, 1, 247.73, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 'App', false, false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 3. SERVICE_CATEGORIES_CONFIG
-- ==============================================================
INSERT INTO service_categories_config (id, code, name_en, name_fr, name_ar, name_de, icon, color, default_commission_rate, is_active, display_order, created_at, display_group)
VALUES
  ('41000000-0000-0000-0000-000000000001', 'nursing', 'Nursing Care', 'Soins Infirmiers', 'التمريض', 'Krankenpflege', 'medical-bag', '#4CAF50', 15.0, true, 1, CURRENT_TIMESTAMP, 'Medical'),
  ('41000000-0000-0000-0000-000000000002', 'physiotherapy', 'Physiotherapy', 'Kinésithérapie', 'العلاج الطبيعي', 'Physiotherapie', 'human-male', '#2196F3', 12.0, true, 2, CURRENT_TIMESTAMP, 'Rehabilitation'),
  ('41000000-0000-0000-0000-000000000003', 'doctor', 'Doctor Visit', 'Visite Médicale', 'زيارة الطبيب', 'Arztbesuch', 'stethoscope', '#F44336', 18.0, true, 3, CURRENT_TIMESTAMP, 'Medical'),
  ('41000000-0000-0000-0000-000000000004', 'laboratory', 'Lab Tests', 'Analyses de Laboratoire', 'تحاليل مخبرية', 'Labortests', 'test-tube', '#FF9800', 10.0, true, 4, CURRENT_TIMESTAMP, 'Medical'),
  ('41000000-0000-0000-0000-000000000005', 'ambulance', 'Ambulance', 'Ambulance', 'سيارة إسعاف', 'Krankenwagen', 'ambulance', '#E91E63', 20.0, true, 5, CURRENT_TIMESTAMP, 'Medical'),
  ('41000000-0000-0000-0000-000000000006', 'equipment_rental', 'Equipment Rental', 'Location Équipement', 'تأجير المعدات', 'Geräteverleih', 'wheelchair', '#9C27B0', 8.0, true, 6, CURRENT_TIMESTAMP, 'Daily'),
  ('41000000-0000-0000-0000-000000000007', 'elderly_care', 'Elderly Care', 'Aide aux Seniors', 'رعاية المسنين', 'Seniorenpflege', 'account-heart', '#009688', 15.0, true, 7, CURRENT_TIMESTAMP, 'Daily'),
  ('41000000-0000-0000-0000-000000000008', 'psychology', 'Psychology', 'Psychologie', 'الدعم النفسي', 'Psychologie', 'brain', '#673AB7', 15.0, true, 8, CURRENT_TIMESTAMP, 'Wellness'),
  ('41000000-0000-0000-0000-000000000009', 'nutrition', 'Nutrition', 'Nutrition', 'التغذية', 'Ernährung', 'food-apple', '#8BC34A', 12.0, true, 9, CURRENT_TIMESTAMP, 'Wellness')
ON CONFLICT DO NOTHING;

INSERT INTO service_categories_config (id, code, name_en, name_fr, name_ar, name_de, icon, color, default_commission_rate, is_active, display_order, created_at, display_group)
VALUES
  ('41000000-0000-0000-0000-000000000010', 'maternity', 'Maternity Care', 'Soins Maternite', 'رعاية الامومة', 'Mutterschaftspflege', 'baby-face-outline', '#F48FB1', 15.0, true, 10, CURRENT_TIMESTAMP, 'Daily'),
  ('41000000-0000-0000-0000-000000000011', 'night_care', 'Night Care', 'Garde de Nuit', 'رعاية ليلية', 'Nachtdienst', 'weather-night', '#5C6BC0', 12.0, true, 11, CURRENT_TIMESTAMP, 'Daily'),
  ('41000000-0000-0000-0000-000000000012', 'chronic_care', 'Chronic Care', 'Soins Chroniques', 'رعاية الامراض المزمنة', 'Chronische Pflege', 'clipboard-pulse', '#26A69A', 15.0, true, 12, CURRENT_TIMESTAMP, 'Rehabilitation'),
  ('41000000-0000-0000-0000-000000000013', 'radiology', 'Radiology', 'Radiologie', 'الاشعة', 'Radiologie', 'radiology-box', '#7986CB', 10.0, true, 13, CURRENT_TIMESTAMP, 'Medical'),
  ('41000000-0000-0000-0000-000000000014', 'gym', 'Gym and Fitness', 'Salle de Sport', 'اللياقة البدنية', 'Fitnessstudio', 'dumbbell', '#FFB74D', 20.0, true, 14, CURRENT_TIMESTAMP, 'Wellness')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 5. PROVIDERS
-- ==============================================================
INSERT INTO providers (id, user_id, service_category, is_individual, first_name, last_name, license_number, license_issuing_authority, license_expiry_date, specializations, years_of_experience, education, certifications, bio, short_description, city, country_code, latitude, longitude, service_radius_km, serves_at_home, serves_at_clinic, rating_average, rating_count, rating_professionalism, rating_punctuality, rating_quality, total_bookings, completed_bookings, cancelled_bookings, total_revenue, response_rate, response_time_minutes, is_verified, verified_at, is_approved, approved_at, approved_by, commission_rate, is_available, availability_status, profile_completed, onboarding_step, featured, created_at, updated_at, business_name, legal_name, tax_id, state_province, postal_code, no_show_count, bank_account_number, bank_name, bank_routing_number, stripe_account_id, stripe_account_status, auto_accept_bookings, instant_booking_enabled, max_booking_advance_days, min_booking_notice_hours, gallery_urls)
VALUES
  ('12000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'doctor', true, 'Dr. Amira', 'Mansour', 'MED-TN-2016-001', 'Ministère de la Santé Tunisie', '2022-12-31', ARRAY[]::text[], 10, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 10 ans d''expérience en doctor.', 'Soins professionnels à domicile - Tunis', 'Tunis', 'TN', 36.863097, 10.181641, 22, true, false, 4.7, 82, 4.8, 4.6, 4.9, 82, 72, 4, 35177.7, 90.5, 22, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 18, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000002', 'doctor', true, 'Dr. Faouzi', 'Ayadi', 'MED-TN-2017-002', 'Ministère de la Santé Tunisie', '2023-12-31', ARRAY[]::text[], 9, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 9 ans d''expérience en doctor.', 'Soins professionnels à domicile - Tunis', 'Tunis', 'TN', 36.838288, 10.186965, 24, true, false, 4.5, 60, 4.6, 4.4, 4.7, 60, 52, 3, 27934.78, 91.0, 24, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 18, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000003', '21000000-0000-0000-0000-000000000003', 'nursing', true, 'Karim', 'Bouazizi', 'NUR-TN-2018-003', 'Ministère de la Santé Tunisie', '2024-12-31', ARRAY[]::text[], 8, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 8 ans d''expérience en nursing.', 'Soins professionnels à domicile - Sfax', 'Sfax', 'TN', 34.786884, 10.756572, 26, true, true, 4.3, 57, 4.4, 4.2, 4.5, 57, 50, 2, 36743.67, 91.5, 26, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000004', 'nursing', true, 'Samia', 'Dhahri', 'NUR-TN-2019-004', 'Ministère de la Santé Tunisie', '2025-12-31', ARRAY[]::text[], 7, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 7 ans d''expérience en nursing.', 'Soins professionnels à domicile - Sousse', 'Sousse', 'TN', 35.869723, 10.619825, 28, true, false, 4.8, 25, 4.9, 4.7, 5.0, 25, 22, 1, 17856.63, 92.0, 28, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000005', '21000000-0000-0000-0000-000000000005', 'physiotherapy', true, 'Leila', 'Hamdi', 'PHY-TN-2020-005', 'Ministère de la Santé Tunisie', '2026-12-31', ARRAY[]::text[], 6, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 6 ans d''expérience en physiotherapy.', 'Soins professionnels à domicile - Monastir', 'Monastir', 'TN', 35.840618, 10.735465, 30, true, false, 4.9, 32, 5.0, 4.8, 5.00, 32, 28, 1, 14529.58, 92.5, 30, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000006', '21000000-0000-0000-0000-000000000006', 'physiotherapy', true, 'Slim', 'Nasr', 'PHY-TN-2021-006', 'Ministère de la Santé Tunisie', '2027-12-31', ARRAY[]::text[], 5, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 5 ans d''expérience en physiotherapy.', 'Soins professionnels à domicile - Bizerte', 'Bizerte', 'TN', 37.235646, 9.841909, 32, true, true, 4.2, 45, 4.3, 4.1, 4.4, 45, 39, 2, 22411.45, 93.0, 32, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000007', '21000000-0000-0000-0000-000000000007', 'laboratory', true, 'Mehdi', 'Jebali', 'LAB-TN-2022-007', 'Ministère de la Santé Tunisie', '2021-12-31', ARRAY[]::text[], 4, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 4 ans d''expérience en laboratory.', 'Soins professionnels à domicile - Nabeul', 'Nabeul', 'TN', 36.35964, 10.80722, 34, true, false, 4.1, 91, 4.2, 4.0, 4.3, 91, 80, 4, 28007.28, 93.5, 34, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 10, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000008', '21000000-0000-0000-0000-000000000008', 'ambulance', false, 'Riadh', 'Chebbi', 'AMB-TN-2015-008', 'Ministère de la Santé Tunisie', '2022-12-31', ARRAY[]::text[], 11, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 11 ans d''expérience en ambulance.', 'Soins professionnels à domicile - Tunis', 'Tunis', 'TN', 36.982545, 10.131829, 36, true, false, 4.5, 45, 4.6, 4.4, 4.7, 45, 39, 2, 18059.11, 94.0, 36, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 20, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000009', '21000000-0000-0000-0000-000000000009', 'equipment_rental', true, 'Sonia', 'Ayari', 'EQP-TN-2016-009', 'Ministère de la Santé Tunisie', '2023-12-31', ARRAY[]::text[], 10, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 10 ans d''expérience en equipment_rental.', 'Soins professionnels à domicile - Tunis', 'Tunis', 'TN', 36.855838, 10.161495, 38, true, true, 4.6, 28, 4.7, 4.5, 4.8, 28, 24, 1, 14101.28, 94.5, 38, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 8, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000010', '21000000-0000-0000-0000-000000000010', 'psychology', true, 'Dr. Zied', 'Elloumi', 'PSY-TN-2017-010', 'Ministère de la Santé Tunisie', '2024-12-31', ARRAY[]::text[], 9, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 9 ans d''expérience en psychology.', 'Soins professionnels à domicile - La Marsa', 'La Marsa', 'TN', 36.83246, 10.269125, 40, true, false, 4.4, 38, 4.5, 4.3, 4.6, 38, 33, 1, 19577.69, 95.0, 40, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000011', '21000000-0000-0000-0000-000000000011', 'nutrition', true, 'Hana', 'Turki', 'NUT-TN-2018-011', 'Ministère de la Santé Tunisie', '2025-12-31', ARRAY[]::text[], 8, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 8 ans d''expérience en nutrition.', 'Soins professionnels à domicile - Hammamet', 'Hammamet', 'TN', 36.37641, 10.63852, 42, true, false, 4.7, 42, 4.8, 4.6, 4.9, 42, 36, 2, 21010.22, 95.5, 42, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000012', 'elderly_care', true, 'Bassem', 'Ghariani', 'ECA-TN-2019-012', 'Ministère de la Santé Tunisie', '2026-12-31', ARRAY[]::text[], 7, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 7 ans d''expérience en elderly_care.', 'Soins professionnels à domicile - Ariana', 'Ariana', 'TN', 36.932795, 10.105449, 44, true, true, 4.0, 30, 4.1, 3.9, 4.2, 30, 26, 1, 14925.79, 96.0, 44, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000013', '21000000-0000-0000-0000-000000000013', 'nursing', true, 'Manel', 'Keskes', 'NUR-TN-2020-013', 'Ministère de la Santé Tunisie', '2027-12-31', ARRAY[]::text[], 6, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 6 ans d''expérience en nursing.', 'Soins professionnels à domicile - Sfax', 'Sfax', 'TN', 34.703821, 10.779676, 46, true, false, 4.3, 65, 4.4, 4.2, 4.5, 65, 57, 3, 30905.35, 96.5, 46, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000014', 'doctor', true, 'Dr. Rim', 'Ben Ammar', 'MED-TN-2021-014', 'Ministère de la Santé Tunisie', '2021-12-31', ARRAY[]::text[], 5, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 5 ans d''expérience en doctor.', 'Soins professionnels à domicile - Sousse', 'Sousse', 'TN', 35.860909, 10.674949, 48, true, false, 4.6, 48, 4.7, 4.5, 4.8, 48, 42, 2, 24001.41, 97.0, 48, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 18, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000015', '21000000-0000-0000-0000-000000000015', 'physiotherapy', true, 'Aymen', 'Baccouche', 'PHY-TN-2022-015', 'Ministère de la Santé Tunisie', '2022-12-31', ARRAY[]::text[], 4, 'Université de Tunis - Faculté de Médecine', ARRAY[]::text[], 'Professionnel de santé expérimenté avec 4 ans d''expérience en physiotherapy.', 'Soins professionnels à domicile - Monastir', 'Monastir', 'TN', 35.785029, 10.800142, 50, true, true, 4.8, 20, 4.9, 4.7, 5.0, 20, 17, 1, 9501.21, 97.5, 50, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[])
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 6. SERVICES
-- ==============================================================
INSERT INTO services (id, provider_id, category, name, description, short_description, price, price_type, currency, duration_minutes, service_location, is_active, is_featured, booking_count, metadata, created_at, updated_at, min_price, max_price, requires_medical_history, requires_prescription)
VALUES
  ('22000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 'doctor', 'Consultation Générale', 'Consultation médicale complète à domicile', 'Consultation médicale complète à domicile.', 80.0, 'fixed', 'TND', 45, 'home', true, true, 61, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),
  ('22000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', 'doctor', 'Suivi Post-Opératoire', 'Visite de suivi après chirurgie', 'Visite de suivi après chirurgie.', 120.0, 'fixed', 'TND', 60, 'home', true, false, 17, '{"followUpType":"surgical","requiresRecentReport":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 120.0, 120.0, true, false),
  ('22000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000001', 'doctor', 'Téléconsultation', 'Consultation vidéo avec ordonnance électronique', 'Consultation vidéo avec ordonnance électronique.', 40.0, 'fixed', 'TND', 20, 'both', true, false, 26, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40.0, 40.0, false, false),
  ('22000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000001', 'doctor', 'ECG + Consultation', 'Consultation avec électrocardiogramme portable', 'Consultation avec électrocardiogramme portable.', 110.0, 'fixed', 'TND', 50, 'home', true, true, 59, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 110.0, 110.0, false, true),
  ('22000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000002', 'doctor', 'Consultation Pédiatrique', 'Consultation médicale pour enfants', 'Consultation médicale pour enfants.', 75.0, 'fixed', 'TND', 40, 'home', true, false, 77, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 75.0, 75.0, false, false),
  ('22000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000002', 'doctor', 'Consultation Gériatrique', 'Bilan santé pour seniors', 'Bilan santé pour seniors.', 90.0, 'fixed', 'TND', 60, 'home', true, true, 34, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 90.0, 90.0, false, false),
  ('22000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000002', 'doctor', 'Vaccination à Domicile', 'Administration vaccins + carnet', 'Administration vaccins + carnet.', 55.0, 'fixed', 'TND', 20, 'home', true, false, 48, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, false, false),
  ('22000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000003', 'nursing', 'Injection et Perfusion', 'Administration médicaments par voie IV', 'Administration médicaments par voie IV.', 35.0, 'fixed', 'TND', 30, 'home', true, false, 60, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35.0, 35.0, false, false),
  ('22000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000003', 'nursing', 'Soins de Plaie', 'Nettoyage et pansement de plaies', 'Nettoyage et pansement de plaies.', 40.0, 'fixed', 'TND', 30, 'home', true, false, 63, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40.0, 40.0, false, false),
  ('22000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000003', 'nursing', 'Garde de Nuit', 'Accompagnement infirmier nocturne', 'Accompagnement infirmier nocturne.', 200.0, 'fixed', 'TND', 480, 'home', true, false, 35, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 200.0, 200.0, false, false),
  ('22000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000003', 'nursing', 'Sondage Urinaire', 'Pose et surveillance de sonde', 'Pose et surveillance de sonde.', 60.0, 'fixed', 'TND', 45, 'home', true, false, 34, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),
  ('22000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000004', 'nursing', 'Soins Post-Partum', 'Suivi mère et nouveau-né à domicile', 'Suivi mère et nouveau-né à domicile.', 70.0, 'fixed', 'TND', 60, 'home', true, true, 30, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70.0, 70.0, false, false),
  ('22000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000004', 'nursing', 'Aspiration Bronchique', 'Désencombrement voies respiratoires', 'Désencombrement voies respiratoires.', 55.0, 'fixed', 'TND', 40, 'home', true, false, 76, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, false, false),
  ('22000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000004', 'nursing', 'Prise en charge chronique', 'Suivi quotidien maladies chroniques', 'Suivi quotidien maladies chroniques.', 45.0, 'fixed', 'TND', 30, 'home', true, false, 73, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45.0, 45.0, false, false),
  ('22000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000005', 'physiotherapy', 'Rééducation Motrice', 'Séance kinésithérapie à domicile', 'Séance kinésithérapie à domicile.', 60.0, 'fixed', 'TND', 60, 'home', true, true, 42, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),
  ('22000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000005', 'physiotherapy', 'Massage Thérapeutique', 'Massage détente et thérapeutique', 'Massage détente et thérapeutique.', 50.0, 'fixed', 'TND', 45, 'home', true, false, 38, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50.0, 50.0, false, false),
  ('22000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000005', 'physiotherapy', 'Rééducation Post-AVC', 'Programme spécialisé post-AVC', 'Programme spécialisé post-AVC.', 80.0, 'fixed', 'TND', 90, 'home', true, true, 80, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),
  ('22000000-0000-0000-0000-000000000018', '12000000-0000-0000-0000-000000000006', 'physiotherapy', 'Kinésithérapie Sportive', 'Récupération sportive et blessures', 'Récupération sportive et blessures.', 65.0, 'fixed', 'TND', 60, 'home', true, false, 7, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 65.0, 65.0, false, false),
  ('22000000-0000-0000-0000-000000000019', '12000000-0000-0000-0000-000000000006', 'physiotherapy', 'Drainage Lymphatique', 'Massage drainage lymphatique', 'Massage drainage lymphatique.', 55.0, 'fixed', 'TND', 60, 'home', true, false, 15, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, false, false),
  ('22000000-0000-0000-0000-000000000020', '12000000-0000-0000-0000-000000000007', 'laboratory', 'Bilan Sanguin Complet', 'Prise de sang domicile: NFS glycémie cholestérol.', 'Bilan sanguin domicile', 55.0, 'fixed', 'TND', 20, 'home', true, false, 26, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, false, false),
  ('22000000-0000-0000-0000-000000000021', '12000000-0000-0000-0000-000000000007', 'laboratory', 'Prélèvement Urinaire', 'ECBU et analyse urinaire à domicile', 'ECBU et analyse urinaire à domicile.', 30.0, 'fixed', 'TND', 15, 'home', true, false, 43, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 30.0, 30.0, false, false),
  ('22000000-0000-0000-0000-000000000022', '12000000-0000-0000-0000-000000000007', 'laboratory', 'Bilan Thyroïdien', 'Prélèvement domicile: TSH T3 T4.', 'Bilan thyroïdien domicile', 65.0, 'fixed', 'TND', 20, 'home', true, false, 19, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 65.0, 65.0, false, false),
  ('22000000-0000-0000-0000-000000000023', '12000000-0000-0000-0000-000000000007', 'laboratory', 'Sérologies Virales', 'Tests sérologiques VIH hépatite.', 'Sérologies virales domicile', 80.0, 'fixed', 'TND', 25, 'home', true, false, 48, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),
  ('22000000-0000-0000-0000-000000000024', '12000000-0000-0000-0000-000000000008', 'ambulance', 'Transport Médicalisé Standard', 'Ambulance non urgente équipée', 'Ambulance non urgente équipée.', 150.0, 'fixed', 'TND', 60, 'home', true, false, 45, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 150.0, 150.0, false, false),
  ('22000000-0000-0000-0000-000000000025', '12000000-0000-0000-0000-000000000008', 'ambulance', 'Transport Urgence ALS', 'Ambulance soins avancés + infirmier', 'Ambulance soins avancés + infirmier.', 300.0, 'fixed', 'TND', 60, 'home', true, false, 17, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 300.0, 300.0, false, false),
  ('22000000-0000-0000-0000-000000000026', '12000000-0000-0000-0000-000000000009', 'equipment_rental', 'Location Fauteuil Roulant', 'Fauteuil roulant standard - livraison incluse', 'Fauteuil roulant standard - livraison incluse.', 60.0, 'fixed', 'TND', 0, 'home', true, true, 61, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),
  ('22000000-0000-0000-0000-000000000027', '12000000-0000-0000-0000-000000000009', 'equipment_rental', 'Location Lit Médicalisé', 'Lit médicalisé électrique anti-escarre', 'Lit médicalisé électrique anti-escarre.', 120.0, 'fixed', 'TND', 0, 'home', true, false, 20, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 120.0, 120.0, false, false),
  ('22000000-0000-0000-0000-000000000028', '12000000-0000-0000-0000-000000000009', 'equipment_rental', 'Location Concentrateur O2', 'Concentrateur oxygène portable', 'Concentrateur oxygène portable.', 90.0, 'fixed', 'TND', 0, 'home', true, false, 34, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 90.0, 90.0, false, false),
  ('22000000-0000-0000-0000-000000000029', '12000000-0000-0000-0000-000000000010', 'psychology', 'Consultation Psychologique', 'Séance individuelle thérapie cognitive', 'Séance individuelle thérapie cognitive.', 70.0, 'fixed', 'TND', 50, 'home', true, false, 19, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70.0, 70.0, false, false),
  ('22000000-0000-0000-0000-000000000030', '12000000-0000-0000-0000-000000000010', 'psychology', 'Thérapie de Couple', 'Séance couple - conflits et communication', 'Séance couple - conflits et communication.', 100.0, 'fixed', 'TND', 60, 'home', true, true, 19, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 100.0, 100.0, false, false),
  ('22000000-0000-0000-0000-000000000031', '12000000-0000-0000-0000-000000000010', 'psychology', 'Soutien Anxiété / Dépression', 'Programme suivi anxiété et dépression', 'Programme suivi anxiété et dépression.', 70.0, 'fixed', 'TND', 50, 'home', true, false, 52, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70.0, 70.0, false, false),
  ('22000000-0000-0000-0000-000000000032', '12000000-0000-0000-0000-000000000011', 'nutrition', 'Bilan Nutritionnel', 'Évaluation complète habitudes alimentaires', 'Évaluation complète habitudes alimentaires.', 60.0, 'fixed', 'TND', 45, 'home', true, false, 55, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),
  ('22000000-0000-0000-0000-000000000033', '12000000-0000-0000-0000-000000000011', 'nutrition', 'Plan Alimentaire Diabète', 'Programme nutrition pour diabétiques', 'Programme nutrition pour diabétiques.', 75.0, 'fixed', 'TND', 50, 'home', true, true, 56, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 75.0, 75.0, false, false),
  ('22000000-0000-0000-0000-000000000034', '12000000-0000-0000-0000-000000000012', 'elderly_care', 'Accompagnement Senior', 'Aide quotidienne personnes dépendantes', 'Aide quotidienne personnes dépendantes.', 80.0, 'fixed', 'TND', 240, 'home', true, true, 53, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),
  ('22000000-0000-0000-0000-000000000035', '12000000-0000-0000-0000-000000000012', 'elderly_care', 'Stimulation Cognitive', 'Activités maintien cognitif seniors', 'Activités maintien cognitif seniors.', 50.0, 'fixed', 'TND', 60, 'home', true, false, 56, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50.0, 50.0, false, false),
  ('22000000-0000-0000-0000-000000000036', '12000000-0000-0000-0000-000000000013', 'nursing', 'Soins Stomie', 'Entretien et changement poche stomie', 'Entretien et changement poche stomie.', 55.0, 'fixed', 'TND', 40, 'home', true, false, 26, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, false, false),
  ('22000000-0000-0000-0000-000000000037', '12000000-0000-0000-0000-000000000013', 'nursing', 'Contrôle Glycémique', 'Surveillance glycémie + carnet', 'Surveillance glycémie + carnet.', 25.0, 'fixed', 'TND', 15, 'home', true, false, 32, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25.0, 25.0, false, false),
  ('22000000-0000-0000-0000-000000000038', '12000000-0000-0000-0000-000000000014', 'doctor', 'Consultation Dermatologique', 'Examen peau et prescriptions', 'Examen peau et prescriptions.', 85.0, 'fixed', 'TND', 40, 'home', true, false, 7, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 85.0, 85.0, false, false),
  ('22000000-0000-0000-0000-000000000039', '12000000-0000-0000-0000-000000000014', 'doctor', 'Suivi Grossesse à Domicile', 'Consultation prénatale à domicile', 'Consultation prénatale à domicile.', 95.0, 'fixed', 'TND', 50, 'home', true, true, 64, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 95.0, 95.0, false, false),
  ('22000000-0000-0000-0000-000000000040', '12000000-0000-0000-0000-000000000015', 'physiotherapy', 'Rééducation Dos', 'Programme lombalgie chronique', 'Programme lombalgie chronique.', 60.0, 'fixed', 'TND', 60, 'home', true, false, 26, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),
  ('22000000-0000-0000-0000-000000000041', '12000000-0000-0000-0000-000000000015', 'physiotherapy', 'Électrostimulation', 'Traitement douleurs par électrostimulation', 'Traitement douleurs par électrostimulation.', 45.0, 'fixed', 'TND', 30, 'home', true, false, 74, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45.0, 45.0, false, false),
  ('22000000-0000-0000-0000-000000000042', '12000000-0000-0000-0000-000000000001', 'doctor', 'Garde Médicale Jour', 'Garde médicale de jour à domicile - surveillance continue du patient avec prise de constantes régulière', 'Garde médicale de jour à domicile.', 50.0, 'hourly', 'TND', 60, 'home', true, false, 5, '{"shiftType":"day","includesVitals":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50.0, 200.0, false, false),
  ('22000000-0000-0000-0000-000000000043', '12000000-0000-0000-0000-000000000001', 'doctor', 'Bilan de Santé Complet', 'Bilan de santé complet incluant examen clinique, ECG, bilan sanguin et compte-rendu détaillé', 'Bilan de santé complet à domicile ou en cabinet.', 150.0, 'range', 'TND', 90, 'clinic', true, false, 3, '{"includesECG":true,"includesBloodwork":true,"reportDelivery":"48h"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 120.0, 250.0, true, false)
ON CONFLICT DO NOTHING;

-- Update columns not in the INSERT list for Dr. Amira's services
UPDATE services SET age_restriction_min = 18
  WHERE id = '22000000-0000-0000-0000-000000000004' AND age_restriction_min IS NULL;

UPDATE services SET min_duration_minutes = 60, max_duration_minutes = 480
  WHERE id = '22000000-0000-0000-0000-000000000042' AND min_duration_minutes IS NULL;

UPDATE services SET age_restriction_min = 18, age_restriction_max = 99
  WHERE id = '22000000-0000-0000-0000-000000000043' AND age_restriction_min IS NULL;

UPDATE services
SET metadata = '{
  "equipment_type_code": "mobilite",
  "brand": "Invacare",
  "model": "Action 2 NG",
  "deposit_amount": 100,
  "pricing": { "weekly": 55, "monthly": 180 },
  "specifications": {
    "weight_capacity_kg": 125,
    "seat_width_cm": 46,
    "foldable": true
  },
  "features": ["foldable frame", "swing-away footrests", "delivery included"]
}'::jsonb,
    short_description = 'Fauteuil roulant pliable avec livraison et reprise a domicile.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '22000000-0000-0000-0000-000000000026';

UPDATE services
SET metadata = '{
  "equipment_type_code": "lit_medicalise",
  "brand": "Linet",
  "model": "Eleganza 1",
  "deposit_amount": 200,
  "pricing": { "weekly": 120, "monthly": 420 },
  "specifications": {
    "electric_adjustment": true,
    "side_rails": true,
    "max_user_weight_kg": 180
  },
  "features": ["anti-bedsore mattress", "home setup", "remote control"]
}'::jsonb,
    short_description = 'Lit medicalise electrique installe a domicile avec matelas anti-escarres.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '22000000-0000-0000-0000-000000000027';

UPDATE services
SET metadata = '{
  "equipment_type_code": "respiratoire",
  "brand": "Philips Respironics",
  "model": "EverFlo",
  "deposit_amount": 150,
  "pricing": { "weekly": 90, "monthly": 280 },
  "specifications": {
    "flow_rate_lpm": 5,
    "noise_level_db": 45,
    "portable": true
  },
  "features": ["humidifier bottle", "nasal cannula kit", "24/7 support"]
}'::jsonb,
    short_description = 'Concentrateur a oxygene portable avec accessoires et assistance.',
    updated_at = CURRENT_TIMESTAMP
WHERE id = '22000000-0000-0000-0000-000000000028';

INSERT INTO services (id, provider_id, category, name, description, short_description, price, price_type, currency, duration_minutes, service_location, is_active, is_featured, booking_count, metadata, created_at, updated_at, min_price, max_price, requires_medical_history, requires_prescription)
VALUES
  ('22000000-0000-0000-0000-000000000044', '12000000-0000-0000-0000-000000000004', 'maternity', 'Visite Sage-Femme Post-Partum', 'Suivi post-partum a domicile avec controle maman-bebe, allaitement et conseils de recuperation.', 'Visite post-partum avec evaluation maman-bebe.', 85.0, 'fixed', 'TND', 75, 'home', true, true, 12, '{"visitType":"postpartum","includesBreastfeedingSupport":true,"recommendedWindowDays":21}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 85.0, 85.0, true, false),
  ('22000000-0000-0000-0000-000000000045', '12000000-0000-0000-0000-000000000003', 'night_care', 'Surveillance Infirmiere de Nuit', 'Presence infirmiere de nuit pour surveillance continue, administration de traitement et releve des constantes.', 'Surveillance infirmiere de nuit a domicile.', 220.0, 'fixed', 'TND', 480, 'home', true, false, 9, '{"shiftType":"night","includesMedicationAdministration":true,"handoverReport":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 220.0, 220.0, true, false),
  ('22000000-0000-0000-0000-000000000046', '12000000-0000-0000-0000-000000000013', 'chronic_care', 'Suivi Diabete et Hypertension', 'Plan de suivi chronique avec education therapeutique, controle glycemique, tension arterielle et coordination medecin traitant.', 'Suivi chronique avec education therapeutique.', 65.0, 'fixed', 'TND', 50, 'home', true, false, 14, '{"carePlan":"chronic","conditions":["diabetes","hypertension"],"includesCareReport":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 65.0, 65.0, true, false),
  ('22000000-0000-0000-0000-000000000047', '12000000-0000-0000-0000-000000000007', 'radiology', 'Radiographie Mobile Thorax', 'Radiographie mobile realisee a domicile avec transfert securise des images et compte rendu sous 24 heures.', 'Radiographie mobile avec compte rendu rapide.', 140.0, 'fixed', 'TND', 35, 'home', true, false, 6, '{"modality":"xray","delivery":"24h","requiresPrescription":true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 140.0, 140.0, true, true),
  ('22000000-0000-0000-0000-000000000048', '12000000-0000-0000-0000-000000000015', 'gym', 'Coaching Reprise Mobilite Senior', 'Seance de remise en mouvement douce a domicile orientee mobilite, equilibre et prevention des chutes.', 'Coaching doux pour mobilite et equilibre.', 70.0, 'fixed', 'TND', 60, 'home', true, false, 8, '{"programType":"senior_mobility","includesAssessment":true,"equipmentNeeded":["elastic band","chair"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70.0, 70.0, false, false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 7. SERVICE_ADDONS
-- ==============================================================
INSERT INTO service_addons (id, service_id, name, description, price, duration_minutes, is_active, created_at, updated_at, icon, is_supplement)
VALUES
  ('32000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', 'ECG à domicile', 'Électrocardiogramme portable', 30.0, 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'heart-pulse', false),
  ('32000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000001', 'Certificat médical', 'Certificat médical officiel', 15.0, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000001', 'Glycémie capillaire', 'Mesure rapide glycémie', 10.0, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'pill', false),
  ('32000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000004', 'Holter ECG 24h', 'Enregistrement ECG 24 heures', 50.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'heart-pulse', false),
  ('32000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000008', 'Kit stérile premium', 'Kit soins stérile haut de gamme', 8.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'bandage', true),
  ('32000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000009', 'Bandes de compression', 'Bandages de compression veineuse', 12.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'bandage', true),
  ('32000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000015', 'Bandes élastiques', 'Kit bandes de résistance', 10.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000008', '22000000-0000-0000-0000-000000000015', 'Ultrasons thérapeutiques', 'Traitement douleurs par ultrasons', 20.0, 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'stethoscope', false),
  ('32000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000015', 'Cryothérapie', 'Application glace thérapeutique', 8.0, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'thermometer', false),
  ('32000000-0000-0000-0000-000000000010', '22000000-0000-0000-0000-000000000020', 'Bilan lipidique complet', 'HDL, LDL, triglycérides', 15.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'syringe', false),
  ('32000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000020', 'HbA1c', 'Hémoglobine glyquée - diabète', 18.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'syringe', false),
  ('32000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000030', 'Séance relaxation guidée', 'Méditation et relaxation post-séance', 15.0, 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000013', '22000000-0000-0000-0000-000000000033', 'Plan repas personnalisé', 'Programme alimentaire 4 semaines', 25.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000014', '22000000-0000-0000-0000-000000000026', 'Livraison et installation', 'Livraison, installation et formation', 20.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, true),
  ('32000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000018', 'Électrostimulation', 'Appareil électrostimulation portable', 15.0, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'stethoscope', false),
  ('32000000-0000-0000-0000-000000000016', '22000000-0000-0000-0000-000000000042', 'Matériel de surveillance', 'Tensiomètre, oxymètre et thermomètre', 15.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'heart-pulse', true),
  ('32000000-0000-0000-0000-000000000017', '22000000-0000-0000-0000-000000000043', 'Rapport détaillé', 'Compte-rendu médical complet avec recommandations', 30.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'clipboard-text', false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 8. BADGES
-- ==============================================================
INSERT INTO badges (id, code, name, description, requirement_type, requirement_value, points_awarded, color, is_active, created_at)
VALUES
  ('17000000-0000-0000-0000-000000000001', 'FIRST_BOOKING', 'First Booking', 'Completed first booking', 'booking_count', 1, 10, '#FFD700', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000002', 'LOYAL_5', 'Loyal Patient', '5 completed bookings', 'booking_count', 5, 50, '#C0C0C0', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000003', 'LOYAL_10', 'Gold Member', '10 completed bookings', 'booking_count', 10, 150, '#FFC107', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000004', 'LOYAL_20', 'Platinum Member', '20 completed bookings', 'booking_count', 20, 400, '#00BCD4', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000005', 'REVIEWER', 'Review Master', 'Left 3 reviews', 'review_count', 3, 25, '#CD7F32', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000006', 'REFERRER', 'Super Referrer', 'Referred 2 friends', 'referral_count', 2, 100, '#4CAF50', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000007', 'HEALTH_TRACKER', 'Health Tracker', '7-day vitals streak', 'tracking_streak', 7, 30, '#2196F3', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000008', 'EARLY_BIRD', 'Early Bird', 'Booked before 8 AM', 'custom', 1, 20, '#FF9800', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000009', 'NIGHT_OWL', 'Night Owl', 'Booked after 8 PM', 'custom', 1, 20, '#3F51B5', true, CURRENT_TIMESTAMP),
  ('17000000-0000-0000-0000-000000000010', 'MULTI_CARE', 'Multi-Care', 'Used 3 different service types', 'custom', 3, 60, '#9C27B0', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 9. DISCOUNT_CODES
-- ==============================================================
INSERT INTO discount_codes (id, code, description, discount_type, discount_value, max_discount_amount, valid_from, valid_until, max_uses, max_uses_per_user, current_uses, min_order_amount, first_booking_only, is_active, created_at, updated_at)
VALUES
  ('27000000-0000-0000-0000-000000000001', 'WELCOME10', 'Welcome 10% off first booking', 'percentage', 10.0, NULL, '2025-01-01 00:00+00', '2026-12-31 23:59+00', 1000, 1, 15, 20.0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000002', 'SUMMER25', 'Summer 25 TND off', 'fixed', 25.0, 25.0, '2025-06-01 00:00+00', '2025-08-31 23:59+00', 500, 1, 8, 50.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000003', 'FIRST50', '50% off first booking', 'percentage', 50.0, 50.0, '2025-01-01 00:00+00', '2026-12-31 23:59+00', 1000, 1, 3, 20.0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000004', 'RAMADAN15', 'Ramadan 15% off', 'percentage', 15.0, 30.0, '2025-03-01 00:00+00', '2025-04-30 23:59+00', 2000, 2, 42, 30.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000005', 'REFER20', 'Referral 20 TND credit', 'fixed', 20.0, 20.0, '2025-01-01 00:00+00', '2026-12-31 23:59+00', 5000, 1, 7, 20.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000006', 'ELDERLCARE', 'Elderly care 20% off', 'percentage', 20.0, 40.0, '2025-01-01 00:00+00', '2026-12-31 23:59+00', 300, 1, 12, 30.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000007', 'PHYSIO5', '5 physio sessions bundle -15%', 'percentage', 15.0, 45.0, '2025-01-01 00:00+00', '2025-12-31 23:59+00', 200, 1, 5, 50.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000008', 'LAB30', 'Lab tests 30 TND off', 'fixed', 30.0, 30.0, '2025-04-01 00:00+00', '2025-06-30 23:59+00', 400, 1, 19, 30.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000009', 'NEWPROV', 'New provider promo 10% off', 'percentage', 10.0, 20.0, '2025-01-01 00:00+00', '2025-06-30 23:59+00', 150, 1, 3, 20.0, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000010', 'VIP25', 'VIP patient 25% off', 'percentage', 25.0, 60.0, '2025-01-01 00:00+00', '2026-12-31 23:59+00', 50, 3, 2, 40.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO discount_codes (id, code, description, discount_type, discount_value, max_discount_amount, valid_from, valid_until, max_uses, max_uses_per_user, current_uses, min_order_amount, first_booking_only, is_active, created_at, updated_at)
VALUES
  ('27000000-0000-0000-0000-000000000011', 'LOYAL25', 'Loyal patient 25 TND credit', 'fixed', 25.0, 25.0, '2025-01-01 00:00+00', '2026-12-31 23:59+00', 250, 2, 0, 50.0, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 10. SYSTEM_SETTINGS
-- ==============================================================
INSERT INTO system_settings (id, setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
  ('43000000-0000-0000-0000-000000000001', 'platform_name', 'Sanad Platform', 'string', 'Platform display name', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000002', 'default_currency', 'TND', 'string', 'Default currency code', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000003', 'max_booking_advance_days', '365', 'integer', 'Max days in advance for booking', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000004', 'auto_validate_hours', '24', 'integer', 'Hours before auto-validation', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000005', 'support_email', 'support@sanad.tn', 'string', 'Support email address', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000006', 'min_booking_amount', '20', 'decimal', 'Minimum booking amount TND', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000007', 'platform_commission', '15', 'decimal', 'Default platform commission %', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000008', 'max_cancellation_hours', '4', 'integer', 'Hours before cancellation allowed', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000009', 'app_version_ios', '2.3.1', 'string', 'Latest required iOS app version', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000010', 'app_version_android', '2.3.1', 'string', 'Latest required Android app version', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000011', 'maintenance_mode', 'false', 'boolean', 'Platform maintenance mode', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000012', 'max_providers_per_page', '20', 'integer', 'Max providers per search page', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000013', 'review_window_days', '14', 'integer', 'Days after booking to leave review', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000014', 'referral_points', '100', 'integer', 'Points awarded per successful referral', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('43000000-0000-0000-0000-000000000015', 'whatsapp_support', '+21650000099', 'string', 'WhatsApp support number', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 11. FRAUD_RULES
-- ==============================================================
INSERT INTO fraud_rules (id, name, description, rule_type, config, action, priority, is_active, created_at, updated_at)
VALUES
  ('0d000000-0000-0000-0000-000000000001', 'Velocity Check', 'Block rapid successive bookings', 'velocity', '{"max_bookings_per_hour":5,"window_minutes":60}'::jsonb, 'block', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000002', 'Amount Threshold', 'Flag high-value transactions', 'threshold', '{"max_amount":800,"currency":"TND"}'::jsonb, 'review', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000003', 'New Device Payment', 'Review payments from new device', 'device', '{"new_device_threshold_hours":24}'::jsonb, 'review', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000004', 'Multiple Card Fail', 'Block after 3 payment failures', 'payment', '{"max_failed_attempts":3,"window_minutes":60}'::jsonb, 'block', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000005', 'Geo Mismatch', 'Flag booking when IP far from city', 'geo', '{"max_distance_km":500}'::jsonb, 'review', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000006', 'Promo Abuse', 'Detect multiple discount code usage', 'promo', '{"max_codes_per_day":3}'::jsonb, 'review', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000007', 'Account Age', 'Review payments from new accounts', 'account', '{"min_account_age_hours":48}'::jsonb, 'review', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0d000000-0000-0000-0000-000000000008', 'Night Payment', 'Flag unusual night-time payments', 'time', '{"suspicious_hours":[1,2,3,4,5]}'::jsonb, 'review', 8, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 12. FAMILY_MEMBERS
-- ==============================================================
INSERT INTO family_members (id, patient_id, first_name, last_name, relationship, date_of_birth, gender, can_book_for, can_view_history, created_at, updated_at, blood_type, email, phone)
VALUES
  ('19000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', 'Yasmine', 'Ben Ali', 'Spouse', '1987-06-20', 'Female', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', 'Omar', 'Ben Ali', 'Child', '2015-09-10', 'Male', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000002', 'Hamza', 'Trabelsi', 'Child', '2018-03-15', 'Male', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000003', 'Kaouthar', 'Saidi', 'Parent', '1952-04-11', 'Female', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000004', 'Sana', 'Khelifi', 'Sibling', '1997-11-02', 'Female', false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000006', 'Sami', 'Ben Hassen', 'Spouse', '1990-03-15', 'Male', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000008', 'Lina', 'Chaabane', 'Child', '2019-07-20', 'Female', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000009', 'Nadia', 'Hamrouni', 'Spouse', '1978-01-11', 'Female', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000011', 'Rim', 'Bouzid', 'Spouse', '1984-09-25', 'Female', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000013', 'Zeineb', 'Dridi', 'Spouse', '1970-05-30', 'Female', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000015', 'Adel', 'Jeridi', 'Child', '1990-12-01', 'Male', false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', ''),
  ('19000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000001', 'Lamine', 'Ben Ali', 'Parent', '1958-11-05', 'Male', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', '')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 15. FAMILY_ACCESS
-- ==============================================================
INSERT INTO family_access (id, patient_id, granted_to_user_id, can_book, can_view_history, can_view_medical, can_manage_payments, is_active, created_at, updated_at)
VALUES
  ('29000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000002', true, true, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('29000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000001', true, false, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('29000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000009', false, true, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('29000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000013', true, true, true, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 15b. PATIENT_PREFERENCES
-- ==============================================================
INSERT INTO patient_preferences (id, patient_id, email_notifications, sms_notifications, push_notifications, marketing_emails, auto_validation_enabled, validation_reminder_hours, share_with_family, allow_provider_messages, created_at, updated_at)
VALUES
  ('28000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', true, true, true, false, false, 24, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002', true, true, true, false, false, 24, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000003', true, false, true, true, false, 12, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 15c. PATIENT_FAVORITES
-- ==============================================================
INSERT INTO patient_favorites (id, patient_id, provider_id, notes, created_at, updated_at)
VALUES
  ('27000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('27000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- ==============================================================
-- 17. PROVIDER_UNAVAILABILITY
-- ==============================================================
INSERT INTO provider_unavailability (id, provider_id, start_datetime, end_datetime, is_all_day, reason, created_at, is_recurring)
VALUES
  ('1e000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '2025-02-10 00:00:00+00', '2025-02-14 23:59:59+00', true, 'Vacation', CURRENT_TIMESTAMP, false),
  ('1e000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', '2025-03-28 00:00:00+00', '2025-04-02 23:59:59+00', true, 'Ramadan break', CURRENT_TIMESTAMP, false),
  ('1e000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000005', '2025-05-01 09:00:00+00', '2025-05-01 17:00:00+00', false, 'Conference kinésithérapie', CURRENT_TIMESTAMP, false),
  ('1e000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000007', '2025-06-15 00:00:00+00', '2025-06-20 23:59:59+00', true, 'Congé annuel', CURRENT_TIMESTAMP, false),
  ('1e000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000002', '2025-08-01 00:00:00+00', '2025-08-15 23:59:59+00', true, 'Congé estival', CURRENT_TIMESTAMP, false),
  ('1e000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000010', '2025-09-10 14:00:00+00', '2025-09-10 18:00:00+00', false, 'Formation continue', CURRENT_TIMESTAMP, false),
  ('1e000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000012', '2025-10-25 00:00:00+00', '2025-10-28 23:59:59+00', true, 'Congrès gériatrie', CURRENT_TIMESTAMP, false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 18. BOOKINGS
-- ==============================================================
INSERT INTO bookings (
  id, booking_number, patient_id, provider_id, service_id,
  start_date, end_date, daily_start_time, daily_end_time, daily_duration_minutes, timezone, status,
  patient_name, patient_phone, patient_email, service_location, address_line1, city, postal_code,
  latitude, longitude, medical_history_shared, is_for_family_member, family_member_name, service_price, addons_price, discount_amount,
  discount_code, subtotal, platform_fee, tax_amount, total_amount, currency, commission_rate,
  commission_amount, provider_amount, validation_required, validation_code, validation_method,
  validation_attempts, cancellation_fee, reschedule_count, source, utm_source, utm_medium,
  utm_campaign, created_at, updated_at, cancelled_at, cancelled_by, cancellation_reason, service_completed_at
 )
SELECT
  seed.id,
  seed.booking_number,
  seed.patient_id,
  seed.provider_id,
  seed.service_id,
  seed.start_date,
  seed.start_date AS end_date,
  seed.daily_start_time,
  seed.daily_end_time,
  seed.daily_duration_minutes,
  seed.timezone,
  seed.status,
  seed.patient_name,
  seed.patient_phone,
  seed.patient_email,
  seed.service_location,
  seed.address_line1,
  seed.city,
  seed.postal_code,
  seed.latitude,
  seed.longitude,
  seed.medical_history_shared,
  seed.is_for_family_member,
  seed.family_member_name,
  seed.service_price,
  seed.addons_price,
  seed.discount_amount,
  seed.discount_code,
  seed.subtotal,
  seed.platform_fee,
  seed.tax_amount,
  seed.legacy_total_amount,
  seed.currency,
  seed.commission_rate,
  seed.commission_amount,
  seed.legacy_provider_amount,
  seed.validation_required,
  seed.validation_code,
  seed.validation_method,
  seed.validation_attempts,
  seed.cancellation_fee,
  seed.reschedule_count,
  seed.source,
  seed.utm_source,
  seed.utm_medium,
  seed.utm_campaign,
  seed.created_at,
  seed.updated_at,
  seed.cancelled_at,
  seed.cancelled_by,
  seed.cancellation_reason,
  seed.service_completed_at
FROM (
  VALUES
  ('03000000-0000-0000-0000-000000000001'::uuid, 'BK-2025-0001', '02000000-0000-0000-0000-000000000001'::uuid, '12000000-0000-0000-0000-000000000001'::uuid, '22000000-0000-0000-0000-000000000001'::uuid, '2025-01-20'::date, '09:00'::time, '09:45'::time, 45, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.810000, 10.178150, true, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 14.40, 0.00, 80.00, 'TND', 18.00, 14.40, 65.60, true, '000001', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-01-15 06:00:00+01'::timestamp with time zone, '2025-01-20 10:00:00+01'::timestamp with time zone, NULL::timestamp with time zone, NULL::uuid, NULL, '2025-01-20 09:45:00+01'::timestamp with time zone),
  ('03000000-0000-0000-0000-000000000002', 'BK-2025-0002', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000008', '2025-01-21', '10:00', '10:30', 30, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.744100, 10.761850, true, false, NULL, 35.00, 0.00, 0.00, NULL, 35.00, 5.25, 0.00, 35.00, 'TND', 15.00, 5.25, 29.75, true, '000002', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-01-15 06:00:00+01', '2025-01-21 10:45:00+01', NULL, NULL, NULL, '2025-01-21 10:30:00+01'),
  ('03000000-0000-0000-0000-000000000003', 'BK-2025-0003', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000015', '2025-01-22', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.815900, 10.635550, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000003', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-01-15 09:00:00+01', '2025-01-22 15:15:00+01', NULL, NULL, NULL, '2025-01-22 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000004', 'BK-2025-0004', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000009', '2025-01-23', '11:00', '11:30', 30, 'Africa/Tunis', 'Pending', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.810000, 10.174450, true, false, NULL, 40.00, 0.00, 0.00, NULL, 40.00, 6.00, 0.00, 40.00, 'TND', 15.00, 6.00, 34.00, false, NULL, NULL, 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-01-15 09:00:00+01', '2025-01-15 10:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000005', 'BK-2025-0005', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000020', '2025-01-24', '08:30', '08:50', 20, 'Africa/Tunis', 'Completed', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la République', 'Monastir', '1444', 35.764100, 10.808150, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 5.50, 0.00, 55.00, 'TND', 10.00, 5.50, 49.50, true, '000005', 'qr', 0, 0.00, 0, 'call_center', 'instagram', 'paid-social', 'campaign-005', '2025-01-15 05:30:00+01', '2025-01-24 09:05:00+01', NULL, NULL, NULL, '2025-01-24 08:50:00+01'),
  ('03000000-0000-0000-0000-000000000006', 'BK-2025-0006', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000002', '2025-01-25', '16:00', '17:00', 60, 'Africa/Tunis', 'Cancelled', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.735900, 10.761850, true, false, NULL, 120.00, 0.00, 0.00, NULL, 120.00, 21.60, 0.00, 120.00, 'TND', 18.00, 21.60, 98.40, false, NULL, NULL, 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-01-21 12:00:00+01', '2025-01-25 12:00:00+01', '2025-01-25 12:00:00+01', '21000000-0000-0000-0000-000000000001', 'Provider reported an operational issue before departure.', NULL),
  ('03000000-0000-0000-0000-000000000007', 'BK-2025-0007', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', '2025-02-05', '10:00', '10:45', 45, 'Africa/Tunis', 'Validated', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la République', 'Bizerte', '1555', 37.270000, 9.875550, true, false, NULL, 80.00, 0.00, 8.00, 'WELCOME10', 72.00, 12.96, 0.00, 72.00, 'TND', 18.00, 12.96, 59.04, true, '000007', 'qr', 1, 0.00, 0, 'web', 'crm-retention', 'push', 'campaign-007', '2025-01-31 05:00:00+01', '2025-02-06 11:45:00+01', NULL, NULL, NULL, '2025-02-05 10:45:00+01'),
  ('03000000-0000-0000-0000-000000000008', 'BK-2025-0008', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000009', '2025-02-10', '09:00', '09:30', 30, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.454100, 10.734450, true, false, NULL, 40.00, 0.00, 0.00, NULL, 40.00, 6.00, 0.00, 40.00, 'TND', 15.00, 6.00, 34.00, true, '000008', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-02-04 07:00:00+01', '2025-02-10 09:45:00+01', NULL, NULL, NULL, '2025-02-10 09:30:00+01'),
  ('03000000-0000-0000-0000-000000000009', 'BK-2025-0009', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000015', '2025-02-15', '15:00', '16:00', 60, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.445900, 10.738150, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000009', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-02-08 12:00:00+01', '2025-02-15 16:15:00+01', NULL, NULL, NULL, '2025-02-15 16:00:00+01'),
  ('03000000-0000-0000-0000-000000000010', 'BK-2025-0010', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000020', '2025-02-20', '07:30', '07:50', 20, 'Africa/Tunis', 'Disputed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la République', 'Kairouan', '1777', 35.670000, 10.101850, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 5.50, 0.00, 55.00, 'TND', 10.00, 5.50, 49.50, true, '000010', 'sms', 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-010', '2025-02-12 03:30:00+01', '2025-02-21 19:50:00+01', NULL, NULL, NULL, '2025-02-20 07:50:00+01'),
  ('03000000-0000-0000-0000-000000000011', 'BK-2025-0011', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000004', '2025-03-01', '09:30', '10:20', 50, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.814100, 10.185550, true, false, NULL, 110.00, 0.00, 16.50, 'RAMADAN15', 93.50, 16.83, 0.00, 93.50, 'TND', 18.00, 16.83, 76.67, true, '000011', 'qr', 0, 0.00, 0, 'call_center', 'crm-retention', 'push', 'campaign-011', '2025-02-20 04:30:00+01', '2025-03-01 10:35:00+01', NULL, NULL, NULL, '2025-03-01 10:20:00+01'),
  ('03000000-0000-0000-0000-000000000012', 'BK-2025-0012', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000018', '2025-03-05', '11:00', '12:00', 60, 'Africa/Tunis', 'Completed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.815900, 10.624450, false, false, NULL, 65.00, 0.00, 0.00, NULL, 65.00, 7.80, 0.00, 65.00, 'TND', 12.00, 7.80, 57.20, true, '000012', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-03-01 09:00:00+01', '2025-03-05 12:15:00+01', NULL, NULL, NULL, '2025-03-05 12:00:00+01'),
  ('03000000-0000-0000-0000-000000000013', 'BK-2025-0013', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000044', '2025-03-08', '10:00', '11:15', 75, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la République', 'Gabes', '1888', 33.880000, 10.098150, true, false, NULL, 85.00, 0.00, 0.00, NULL, 85.00, 12.75, 0.00, 85.00, 'TND', 15.00, 12.75, 72.25, true, '000013', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-03-03 07:00:00+01', '2025-03-08 11:30:00+01', NULL, NULL, NULL, '2025-03-08 11:15:00+01'),
  ('03000000-0000-0000-0000-000000000014', 'BK-2025-0014', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000008', '22000000-0000-0000-0000-000000000024', '2025-03-10', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la République', 'Ariana', '1999', 36.874100, 10.161850, false, false, NULL, 150.00, 0.00, 0.00, NULL, 150.00, 30.00, 0.00, 150.00, 'TND', 20.00, 30.00, 120.00, true, '000014', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-03-04 10:00:00+01', '2025-03-10 15:15:00+01', NULL, NULL, NULL, '2025-03-10 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000015', 'BK-2025-0015', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000005', '2025-03-12', '09:00', '09:40', 40, 'Africa/Tunis', 'Completed', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la République', 'Ben Arous', '2110', 36.745900, 10.225550, true, false, NULL, 75.00, 0.00, 0.00, NULL, 75.00, 13.50, 0.00, 75.00, 'TND', 18.00, 13.50, 61.50, true, '000015', 'qr', 0, 0.00, 0, 'mobile', 'instagram', 'paid-social', 'campaign-015', '2025-03-05 04:00:00+01', '2025-03-12 09:55:00+01', NULL, NULL, NULL, '2025-03-12 09:40:00+01'),
  ('03000000-0000-0000-0000-000000000016', 'BK-2025-0016', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000017', '2025-03-15', '16:00', '17:30', 90, 'Africa/Tunis', 'Validated', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la République', 'Hammamet', '2221', 36.400000, 10.604450, false, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 9.60, 0.00, 80.00, 'TND', 12.00, 9.60, 70.40, true, '000016', 'sms', 1, 0.00, 0, 'web', NULL, NULL, NULL, '2025-03-07 14:00:00+01', '2025-03-16 11:30:00+01', NULL, NULL, NULL, '2025-03-15 17:30:00+01'),
  ('03000000-0000-0000-0000-000000000017', 'BK-2025-0017', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000021', '2025-03-18', '08:00', '08:15', 15, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.744100, 10.758150, false, false, NULL, 30.00, 0.00, 0.00, NULL, 30.00, 3.00, 0.00, 30.00, 'TND', 10.00, 3.00, 27.00, true, '000017', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-03-09 05:00:00+01', '2025-03-18 08:30:00+01', NULL, NULL, NULL, '2025-03-18 08:15:00+01'),
  ('03000000-0000-0000-0000-000000000018', 'BK-2025-0018', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000010', '22000000-0000-0000-0000-000000000030', '2025-03-20', '15:00', '16:00', 60, 'Africa/Tunis', 'Completed', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la République', 'Monastir', '1444', 35.755900, 10.811850, true, false, NULL, 100.00, 0.00, 0.00, NULL, 100.00, 15.00, 0.00, 100.00, 'TND', 15.00, 15.00, 85.00, true, '000018', 'sms', 0, 0.00, 1, 'mobile', NULL, NULL, NULL, '2025-03-16 11:00:00+01', '2025-03-20 16:15:00+01', NULL, NULL, NULL, '2025-03-20 16:00:00+01'),
  ('03000000-0000-0000-0000-000000000019', 'BK-2025-0019', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000033', '2025-03-22', '10:30', '11:20', 50, 'Africa/Tunis', 'Completed', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la République', 'Bizerte', '1555', 37.270000, 9.875550, false, false, NULL, 75.00, 0.00, 0.00, NULL, 75.00, 9.00, 0.00, 75.00, 'TND', 12.00, 9.00, 66.00, true, '000019', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-03-17 05:30:00+01', '2025-03-22 11:35:00+01', NULL, NULL, NULL, '2025-03-22 11:20:00+01'),
  ('03000000-0000-0000-0000-000000000020', 'BK-2025-0020', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000003', '2025-03-25', '09:00', '09:20', 20, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'both', '120 Rue de la République', 'La Marsa', '2332', 36.894100, 10.314450, true, false, NULL, 40.00, 0.00, 20.00, 'REFER20', 20.00, 3.60, 0.00, 20.00, 'TND', 18.00, 3.60, 16.40, true, '000020', 'sms', 0, 0.00, 0, 'call_center', 'crm-retention', 'push', 'campaign-020', '2025-03-19 07:00:00+01', '2025-03-25 09:35:00+01', NULL, NULL, NULL, '2025-03-25 09:20:00+01'),
  ('03000000-0000-0000-0000-000000000021', 'BK-2025-0021', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000035', '2025-03-28', '11:00', '12:00', 60, 'Africa/Tunis', 'Completed', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la République', 'Mahdia', '2443', 35.495900, 11.038150, false, false, NULL, 50.00, 0.00, 10.00, 'ELDERLCARE', 40.00, 6.00, 0.00, 40.00, 'TND', 15.00, 6.00, 34.00, true, '000021', 'qr', 0, 0.00, 0, 'mobile', 'crm-retention', 'push', 'campaign-021', '2025-03-21 08:00:00+01', '2025-03-28 12:15:00+01', NULL, NULL, NULL, '2025-03-28 12:00:00+01'),
  ('03000000-0000-0000-0000-000000000022', 'BK-2025-0022', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000014', '22000000-0000-0000-0000-000000000039', '2025-04-01', '14:30', '15:20', 50, 'Africa/Tunis', 'Pending', 'Olfa Baccar', '+21650100014', 'olfa.baccar@sanad.tn', 'home', '140 Rue de la République', 'Gafsa', '2554', 34.430000, 8.781850, true, false, NULL, 95.00, 0.00, 0.00, NULL, 95.00, 17.10, 0.00, 95.00, 'TND', 18.00, 17.10, 77.90, false, NULL, NULL, 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-03-24 10:30:00+01', '2025-03-24 11:30:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000023', 'BK-2025-0023', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000045', '2025-04-03', '22:00', '06:00', 480, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.814100, 10.185550, true, false, NULL, 220.00, 0.00, 0.00, NULL, 220.00, 33.00, 0.00, 220.00, 'TND', 15.00, 33.00, 187.00, true, '000023', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-03-25 17:00:00+01', '2025-04-04 06:15:00+01', NULL, NULL, NULL, '2025-04-04 06:00:00+01'),
  ('03000000-0000-0000-0000-000000000024', 'BK-2025-0024', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000026', '2025-04-05', '09:00', '10:00', 60, 'Africa/Tunis', 'Completed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.815900, 10.624450, false, false, NULL, 110.00, 0.00, 0.00, NULL, 110.00, 8.80, 0.00, 110.00, 'TND', 8.00, 8.80, 101.20, true, '000024', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-04-01 07:00:00+01', '2025-04-05 10:15:00+01', NULL, NULL, NULL, '2025-04-05 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000025', 'BK-2025-0025', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', '2025-04-08', '08:30', '09:15', 45, 'Africa/Tunis', 'Completed', 'Hatem Jeridi', '+21650100015', 'hatem.jeridi@sanad.tn', 'home', '150 Rue de la République', 'Djerba', '2665', 33.870000, 10.858150, true, false, NULL, 80.00, 0.00, 25.00, 'LOYAL25', 55.00, 9.90, 0.00, 55.00, 'TND', 18.00, 9.90, 45.10, true, '000025', 'qr', 0, 0.00, 0, 'web', 'crm-retention', 'push', 'campaign-025', '2025-04-03 05:30:00+01', '2025-04-08 09:30:00+01', NULL, NULL, NULL, '2025-04-08 09:15:00+01'),
  ('03000000-0000-0000-0000-000000000026', 'BK-2025-0026', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000022', '2025-04-10', '08:00', '08:20', 20, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.454100, 10.741850, false, false, NULL, 65.00, 0.00, 30.00, 'LAB30', 35.00, 3.50, 0.00, 35.00, 'TND', 10.00, 3.50, 31.50, true, '000026', 'sms', 0, 0.00, 0, 'call_center', 'crm-retention', 'push', 'campaign-026', '2025-04-04 04:00:00+01', '2025-04-10 08:35:00+01', NULL, NULL, NULL, '2025-04-10 08:20:00+01'),
  ('03000000-0000-0000-0000-000000000027', 'BK-2025-0027', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000006', '2025-04-12', '10:00', '11:00', 60, 'Africa/Tunis', 'Cancelled', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la République', 'Kairouan', '1777', 35.665900, 10.105550, true, false, NULL, 90.00, 0.00, 0.00, NULL, 90.00, 16.20, 0.00, 90.00, 'TND', 18.00, 16.20, 73.80, false, NULL, NULL, 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-04-05 05:00:00+01', '2025-04-12 05:00:00+01', '2025-04-12 05:00:00+01', '21000000-0000-0000-0000-000000000002', 'Provider reported an operational issue before departure.', NULL),
  ('03000000-0000-0000-0000-000000000028', 'BK-2025-0028', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000016', '2025-04-15', '14:00', '14:45', 45, 'Africa/Tunis', 'Validated', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la République', 'Gabes', '1888', 33.880000, 10.094450, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 6.00, 0.00, 50.00, 'TND', 12.00, 6.00, 44.00, true, '000028', 'sms', 1, 0.00, 0, 'web', NULL, NULL, NULL, '2025-04-07 12:00:00+01', '2025-04-16 12:45:00+01', NULL, NULL, NULL, '2025-04-15 14:45:00+01'),
  ('03000000-0000-0000-0000-000000000029', 'BK-2025-0029', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000013', '2025-04-18', '09:30', '10:10', 40, 'Africa/Tunis', 'Completed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la République', 'Ariana', '1999', 36.874100, 10.158150, true, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 8.25, 0.00, 55.00, 'TND', 15.00, 8.25, 46.75, true, '000029', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-04-09 06:30:00+01', '2025-04-18 10:25:00+01', NULL, NULL, NULL, '2025-04-18 10:10:00+01'),
  ('03000000-0000-0000-0000-000000000030', 'BK-2025-0030', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000019', '2025-04-20', '11:00', '12:00', 60, 'Africa/Tunis', 'Confirmed', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la République', 'Ben Arous', '2110', 36.745900, 10.221850, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 6.60, 0.00, 55.00, 'TND', 12.00, 6.60, 48.40, true, '000030', 'sms', 0, 0.00, 0, 'mobile', 'instagram', 'paid-social', 'campaign-030', '2025-04-16 07:00:00+01', '2025-04-16 21:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000031', 'BK-2025-0031', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000010', '22000000-0000-0000-0000-000000000031', '2025-04-22', '15:30', '16:20', 50, 'Africa/Tunis', 'Completed', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la République', 'Hammamet', '2221', 36.400000, 10.615550, true, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 10.50, 0.00, 70.00, 'TND', 15.00, 10.50, 59.50, true, '000031', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-04-17 10:30:00+01', '2025-04-22 16:35:00+01', NULL, NULL, NULL, '2025-04-22 16:20:00+01'),
  ('03000000-0000-0000-0000-000000000032', 'BK-2025-0032', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000034', '2025-04-25', '10:00', '14:00', 240, 'Africa/Tunis', 'Completed', 'Hamza Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.744100, 10.754450, false, true, 'Hamza Trabelsi', 80.00, 0.00, 0.00, NULL, 80.00, 12.00, 0.00, 80.00, 'TND', 15.00, 12.00, 68.00, true, '000032', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-04-19 08:00:00+01', '2025-04-25 14:15:00+01', NULL, NULL, NULL, '2025-04-25 14:00:00+01'),
  ('03000000-0000-0000-0000-000000000033', 'BK-2025-0033', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000008', '2025-04-28', '09:00', '09:30', 30, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la République', 'La Marsa', '2332', 36.885900, 10.318150, true, false, NULL, 35.00, 0.00, 0.00, NULL, 35.00, 5.25, 0.00, 35.00, 'TND', 15.00, 5.25, 29.75, true, '000033', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-04-21 06:00:00+01', '2025-04-28 09:45:00+01', NULL, NULL, NULL, '2025-04-28 09:30:00+01'),
  ('03000000-0000-0000-0000-000000000034', 'BK-2025-0034', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000008', '22000000-0000-0000-0000-000000000025', '2025-05-02', '13:00', '14:00', 60, 'Africa/Tunis', 'Completed', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la République', 'Mahdia', '2443', 35.500000, 11.041850, false, false, NULL, 300.00, 0.00, 0.00, NULL, 300.00, 60.00, 0.00, 300.00, 'TND', 20.00, 60.00, 240.00, true, '000034', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-04-24 09:00:00+01', '2025-05-02 14:15:00+01', NULL, NULL, NULL, '2025-05-02 14:00:00+01'),
  ('03000000-0000-0000-0000-000000000035', 'BK-2025-0035', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000041', '2025-05-05', '10:00', '10:30', 30, 'Africa/Tunis', 'Confirmed', 'Olfa Baccar', '+21650100014', 'olfa.baccar@sanad.tn', 'home', '140 Rue de la République', 'Gafsa', '2554', 34.434100, 8.785550, false, false, NULL, 45.00, 0.00, 0.00, NULL, 45.00, 5.40, 0.00, 45.00, 'TND', 12.00, 5.40, 39.60, true, '000035', 'qr', 0, 0.00, 0, 'call_center', 'instagram', 'paid-social', 'campaign-035', '2025-04-26 05:00:00+01', '2025-04-27 00:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000036', 'BK-2025-0036', '02000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000013', '22000000-0000-0000-0000-000000000046', '2025-05-07', '09:30', '10:20', 50, 'Africa/Tunis', 'Completed', 'Wafa Souissi', '+21650100016', 'wafa.souissi@sanad.tn', 'home', '160 Rue de la République', 'Manouba', '2776', 36.815900, 10.094450, true, false, NULL, 65.00, 0.00, 0.00, NULL, 65.00, 9.75, 0.00, 65.00, 'TND', 15.00, 9.75, 55.25, true, '000036', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-05-03 07:30:00+01', '2025-05-07 10:35:00+01', NULL, NULL, NULL, '2025-05-07 10:20:00+01'),
  ('03000000-0000-0000-0000-000000000037', 'BK-2025-0037', '02000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000015', '2025-05-10', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Nizar Ferchichi', '+21650100017', 'nizar.ferchichi@sanad.tn', 'home', '170 Rue de la République', 'Tabarka', '2887', 36.950000, 8.758150, false, false, NULL, 60.00, 0.00, 9.00, 'PHYSIO5', 51.00, 6.12, 0.00, 51.00, 'TND', 12.00, 6.12, 44.88, true, '000037', 'qr', 0, 0.00, 0, 'web', 'crm-retention', 'push', 'campaign-037', '2025-05-05 11:00:00+01', '2025-05-10 15:15:00+01', NULL, NULL, NULL, '2025-05-10 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000038', 'BK-2025-0038', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000023', '2025-05-12', '08:30', '08:55', 25, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.814100, 10.181850, false, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 8.00, 0.00, 80.00, 'TND', 10.00, 8.00, 72.00, true, '000038', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-05-06 04:30:00+01', '2025-05-12 09:10:00+01', NULL, NULL, NULL, '2025-05-12 08:55:00+01'),
  ('03000000-0000-0000-0000-000000000039', 'BK-2025-0039', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000032', '2025-05-15', '16:00', '16:45', 45, 'Africa/Tunis', 'Completed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.815900, 10.635550, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000039', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-05-08 11:00:00+01', '2025-05-15 17:00:00+01', NULL, NULL, NULL, '2025-05-15 16:45:00+01'),
  ('03000000-0000-0000-0000-000000000040', 'BK-2025-0040', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000035', '2025-05-18', '10:00', '11:00', 60, 'Africa/Tunis', 'NoShow', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la République', 'Monastir', '1444', 35.760000, 10.804450, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 7.50, 0.00, 50.00, 'TND', 15.00, 7.50, 42.50, false, NULL, NULL, 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-040', '2025-05-10 08:00:00+01', '2025-05-18 10:20:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000041', 'BK-2025-0041', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000040', '2025-05-20', '09:00', '10:00', 60, 'Africa/Tunis', 'Completed', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la République', 'Bizerte', '1555', 37.274100, 9.868150, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000041', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-05-11 06:00:00+01', '2025-05-20 10:15:00+01', NULL, NULL, NULL, '2025-05-20 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000042', 'BK-2025-0042', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000007', '2025-05-22', '11:30', '11:50', 20, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.445900, 10.741850, true, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 9.90, 0.00, 55.00, 'TND', 18.00, 9.90, 45.10, true, '000042', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-05-18 07:30:00+01', '2025-05-22 12:05:00+01', NULL, NULL, NULL, '2025-05-22 11:50:00+01'),
  ('03000000-0000-0000-0000-000000000043', 'BK-2025-0043', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000018', '2025-05-25', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la République', 'Kairouan', '1777', 35.670000, 10.105550, false, false, NULL, 65.00, 0.00, 0.00, NULL, 65.00, 7.80, 0.00, 65.00, 'TND', 12.00, 7.80, 57.20, true, '000043', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-05-20 09:00:00+01', '2025-05-25 15:15:00+01', NULL, NULL, NULL, '2025-05-25 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000044', 'BK-2025-0044', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000013', '22000000-0000-0000-0000-000000000036', '2025-05-28', '09:30', '10:10', 40, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la République', 'Gabes', '1888', 33.884100, 10.094450, true, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 8.25, 0.00, 55.00, 'TND', 15.00, 8.25, 46.75, true, '000044', 'sms', 0, 0.00, 1, 'call_center', NULL, NULL, NULL, '2025-05-22 07:30:00+01', '2025-05-28 10:25:00+01', NULL, NULL, NULL, '2025-05-28 10:10:00+01'),
  ('03000000-0000-0000-0000-000000000045', 'BK-2025-0045', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000028', '2025-06-02', '10:00', '11:00', 60, 'Africa/Tunis', 'Confirmed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la République', 'Ariana', '1999', 36.865900, 10.158150, false, false, NULL, 90.00, 0.00, 0.00, NULL, 90.00, 7.20, 0.00, 90.00, 'TND', 8.00, 7.20, 82.80, true, '000045', 'qr', 0, 0.00, 0, 'mobile', 'instagram', 'paid-social', 'campaign-045', '2025-05-26 07:00:00+01', '2025-05-27 00:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000046', 'BK-2025-0046', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000011', '2025-06-05', '09:00', '09:45', 45, 'Africa/Tunis', 'Pending', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la République', 'Ben Arous', '2110', 36.750000, 10.221850, true, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 9.00, 0.00, 60.00, 'TND', 15.00, 9.00, 51.00, false, NULL, NULL, 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-05-28 05:00:00+01', '2025-05-28 06:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000047', 'BK-2025-0047', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000047', '2025-06-08', '08:00', '08:35', 35, 'Africa/Tunis', 'Completed', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la République', 'Hammamet', '2221', 36.404100, 10.615550, true, false, NULL, 140.00, 0.00, 0.00, NULL, 140.00, 14.00, 0.00, 140.00, 'TND', 10.00, 14.00, 126.00, true, '000047', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-05-30 03:00:00+01', '2025-06-08 08:50:00+01', NULL, NULL, NULL, '2025-06-08 08:35:00+01'),
  ('03000000-0000-0000-0000-000000000048', 'BK-2025-0048', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000027', '2025-06-10', '09:00', '10:00', 60, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la République', 'La Marsa', '2332', 36.885900, 10.314450, false, false, NULL, 420.00, 0.00, 0.00, NULL, 420.00, 33.60, 0.00, 420.00, 'TND', 8.00, 33.60, 386.40, true, '000048', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-06-06 07:00:00+01', '2025-06-10 10:15:00+01', NULL, NULL, NULL, '2025-06-10 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000049', 'BK-2025-0049', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000014', '2025-06-12', '11:00', '11:30', 30, 'Africa/Tunis', 'Cancelled', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la République', 'Mahdia', '2443', 35.500000, 11.038150, true, false, NULL, 45.00, 0.00, 0.00, NULL, 45.00, 6.75, 0.00, 45.00, 'TND', 15.00, 6.75, 38.25, false, NULL, NULL, 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-06-07 08:00:00+01', '2025-06-12 04:00:00+01', '2025-06-12 04:00:00+01', '21000000-0000-0000-0000-000000000004', 'Provider reported an operational issue before departure.', NULL),
  ('03000000-0000-0000-0000-000000000050', 'BK-2025-0050', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000020', '2025-06-15', '08:30', '08:50', 20, 'Africa/Tunis', 'Completed', 'Olfa Baccar', '+21650100014', 'olfa.baccar@sanad.tn', 'home', '140 Rue de la République', 'Gafsa', '2554', 34.434100, 8.781850, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 5.50, 0.00, 55.00, 'TND', 10.00, 5.50, 49.50, true, '000050', 'sms', 0, 0.00, 0, 'call_center', 'instagram', 'paid-social', 'campaign-050', '2025-06-09 04:30:00+01', '2025-06-15 09:05:00+01', NULL, NULL, NULL, '2025-06-15 08:50:00+01'),
  ('03000000-0000-0000-0000-000000000051', 'BK-2025-0051', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000015', '2025-06-18', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Hatem Jeridi', '+21650100015', 'hatem.jeridi@sanad.tn', 'home', '150 Rue de la République', 'Djerba', '2665', 33.865900, 10.865550, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000051', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-06-11 09:00:00+01', '2025-06-18 15:15:00+01', NULL, NULL, NULL, '2025-06-18 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000052', 'BK-2025-0052', '02000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000005', '2025-06-20', '10:30', '11:10', 40, 'Africa/Tunis', 'Validated', 'Wafa Souissi', '+21650100016', 'wafa.souissi@sanad.tn', 'home', '160 Rue de la République', 'Manouba', '2776', 36.820000, 10.094450, true, false, NULL, 75.00, 0.00, 0.00, NULL, 75.00, 13.50, 0.00, 75.00, 'TND', 18.00, 13.50, 61.50, true, '000052', 'sms', 1, 0.00, 0, 'web', NULL, NULL, NULL, '2025-06-12 08:30:00+01', '2025-06-21 09:10:00+01', NULL, NULL, NULL, '2025-06-20 11:10:00+01'),
  ('03000000-0000-0000-0000-000000000053', 'BK-2025-0053', '02000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000010', '22000000-0000-0000-0000-000000000030', '2025-06-23', '16:00', '17:00', 60, 'Africa/Tunis', 'Completed', 'Nizar Ferchichi', '+21650100017', 'nizar.ferchichi@sanad.tn', 'home', '170 Rue de la République', 'Tabarka', '2887', 36.954100, 8.758150, true, false, NULL, 100.00, 0.00, 0.00, NULL, 100.00, 15.00, 0.00, 100.00, 'TND', 15.00, 15.00, 85.00, true, '000053', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-06-14 13:00:00+01', '2025-06-23 17:15:00+01', NULL, NULL, NULL, '2025-06-23 17:00:00+01'),
  ('03000000-0000-0000-0000-000000000054', 'BK-2025-0054', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000033', '2025-06-25', '09:00', '09:50', 50, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.805900, 10.181850, false, false, NULL, 75.00, 0.00, 0.00, NULL, 75.00, 9.00, 0.00, 75.00, 'TND', 12.00, 9.00, 66.00, true, '000054', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-06-21 05:00:00+01', '2025-06-25 10:05:00+01', NULL, NULL, NULL, '2025-06-25 09:50:00+01'),
  ('03000000-0000-0000-0000-000000000055', 'BK-2025-0055', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000035', '2025-06-28', '11:30', '12:30', 60, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.740000, 10.765550, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 7.50, 0.00, 50.00, 'TND', 15.00, 7.50, 42.50, true, '000055', 'qr', 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-055', '2025-06-23 06:30:00+01', '2025-06-28 12:45:00+01', NULL, NULL, NULL, '2025-06-28 12:30:00+01'),
  ('03000000-0000-0000-0000-000000000056', 'BK-2025-0056', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000014', '22000000-0000-0000-0000-000000000039', '2025-07-02', '09:00', '09:50', 50, 'Africa/Tunis', 'Pending', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.824100, 10.624450, true, false, NULL, 95.00, 0.00, 0.00, NULL, 95.00, 17.10, 0.00, 95.00, 'TND', 18.00, 17.10, 77.90, false, NULL, NULL, 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-06-26 07:00:00+01', '2025-06-26 08:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000057', 'BK-2025-0057', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000019', '2025-07-05', '10:00', '11:00', 60, 'Africa/Tunis', 'NoShow', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la République', 'Monastir', '1444', 35.755900, 10.808150, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 6.60, 0.00, 55.00, 'TND', 12.00, 6.60, 48.40, false, NULL, NULL, 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-06-28 07:00:00+01', '2025-07-05 10:20:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000058', 'BK-2025-0058', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000008', '2025-07-08', '09:30', '10:00', 30, 'Africa/Tunis', 'Completed', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la République', 'Bizerte', '1555', 37.270000, 9.871850, true, false, NULL, 35.00, 0.00, 0.00, NULL, 35.00, 5.25, 0.00, 35.00, 'TND', 15.00, 5.25, 29.75, true, '000058', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-06-30 05:30:00+01', '2025-07-08 10:15:00+01', NULL, NULL, NULL, '2025-07-08 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000059', 'BK-2025-0059', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000008', '22000000-0000-0000-0000-000000000024', '2025-07-10', '14:00', '15:00', 60, 'Africa/Tunis', 'ProviderOnWay', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.454100, 10.745550, false, false, NULL, 150.00, 0.00, 0.00, NULL, 150.00, 30.00, 0.00, 150.00, 'TND', 20.00, 30.00, 120.00, true, '000059', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-07-01 09:00:00+01', '2025-07-10 13:28:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000060', 'BK-2025-0060', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', '2025-07-12', '08:00', '08:45', 45, 'Africa/Tunis', 'Completed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la République', 'Kairouan', '1777', 35.665900, 10.094450, true, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 14.40, 0.00, 80.00, 'TND', 18.00, 14.40, 65.60, true, '000060', 'sms', 0, 0.00, 0, 'mobile', 'instagram', 'paid-social', 'campaign-060', '2025-07-08 06:00:00+01', '2025-07-12 09:00:00+01', NULL, NULL, NULL, '2025-07-12 08:45:00+01'),
  ('03000000-0000-0000-0000-000000000061', 'BK-2025-0061', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000021', '2025-07-15', '08:00', '08:15', 15, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la République', 'Gabes', '1888', 33.880000, 10.098150, false, false, NULL, 30.00, 0.00, 0.00, NULL, 30.00, 3.00, 0.00, 30.00, 'TND', 10.00, 3.00, 27.00, true, '000061', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-07-10 05:00:00+01', '2025-07-15 08:30:00+01', NULL, NULL, NULL, '2025-07-15 08:15:00+01'),
  ('03000000-0000-0000-0000-000000000062', 'BK-2025-0062', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000016', '2025-07-18', '15:00', '15:45', 45, 'Africa/Tunis', 'Completed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la République', 'Ariana', '1999', 36.874100, 10.161850, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 6.00, 0.00, 50.00, 'TND', 12.00, 6.00, 44.00, true, '000062', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-07-12 11:00:00+01', '2025-07-18 16:00:00+01', NULL, NULL, NULL, '2025-07-18 15:45:00+01'),
  ('03000000-0000-0000-0000-000000000063', 'BK-2025-0063', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000013', '22000000-0000-0000-0000-000000000037', '2025-07-20', '10:00', '10:15', 15, 'Africa/Tunis', 'Validated', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la République', 'Ben Arous', '2110', 36.745900, 10.225550, true, false, NULL, 25.00, 0.00, 0.00, NULL, 25.00, 3.75, 0.00, 25.00, 'TND', 15.00, 3.75, 21.25, true, '000063', 'qr', 1, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-07-13 05:00:00+01', '2025-07-21 11:15:00+01', NULL, NULL, NULL, '2025-07-20 10:15:00+01'),
  ('03000000-0000-0000-0000-000000000064', 'BK-2025-0064', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000028', '2025-07-22', '09:00', '10:00', 60, 'Africa/Tunis', 'Completed', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la République', 'Hammamet', '2221', 36.400000, 10.604450, false, false, NULL, 280.00, 0.00, 0.00, NULL, 280.00, 22.40, 0.00, 280.00, 'TND', 8.00, 22.40, 257.60, true, '000064', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-07-14 07:00:00+01', '2025-07-22 10:15:00+01', NULL, NULL, NULL, '2025-07-22 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000065', 'BK-2025-0065', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000041', '2025-07-25', '14:30', '15:00', 30, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la République', 'La Marsa', '2332', 36.894100, 10.318150, false, false, NULL, 45.00, 0.00, 0.00, NULL, 45.00, 5.40, 0.00, 45.00, 'TND', 12.00, 5.40, 39.60, true, '000065', 'qr', 0, 0.00, 0, 'call_center', 'instagram', 'paid-social', 'campaign-065', '2025-07-16 11:30:00+01', '2025-07-25 15:15:00+01', NULL, NULL, NULL, '2025-07-25 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000066', 'BK-2025-0066', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000006', '2025-07-28', '11:00', '12:00', 60, 'Africa/Tunis', 'Cancelled', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la République', 'Mahdia', '2443', 35.495900, 11.041850, true, false, NULL, 90.00, 0.00, 0.00, NULL, 90.00, 16.20, 0.00, 90.00, 'TND', 18.00, 16.20, 73.80, false, NULL, NULL, 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-07-24 07:00:00+01', '2025-07-28 07:00:00+01', '2025-07-28 07:00:00+01', '11000000-0000-0000-0000-000000000013', 'Patient requested a schedule change before service start.', NULL),
  ('03000000-0000-0000-0000-000000000067', 'BK-2025-0067', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000012', '2025-08-01', '10:00', '11:00', 60, 'Africa/Tunis', 'Completed', 'Olfa Baccar', '+21650100014', 'olfa.baccar@sanad.tn', 'home', '140 Rue de la République', 'Gafsa', '2554', 34.430000, 8.785550, true, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 10.50, 0.00, 70.00, 'TND', 15.00, 10.50, 59.50, true, '000067', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-07-27 05:00:00+01', '2025-08-01 11:15:00+01', NULL, NULL, NULL, '2025-08-01 11:00:00+01'),
  ('03000000-0000-0000-0000-000000000068', 'BK-2025-0068', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000010', '22000000-0000-0000-0000-000000000031', '2025-08-04', '15:00', '15:50', 50, 'Africa/Tunis', 'Completed', 'Hatem Jeridi', '+21650100015', 'hatem.jeridi@sanad.tn', 'home', '150 Rue de la République', 'Djerba', '2665', 33.874100, 10.854450, true, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 10.50, 0.00, 70.00, 'TND', 15.00, 10.50, 59.50, true, '000068', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-07-29 13:00:00+01', '2025-08-04 16:05:00+01', NULL, NULL, NULL, '2025-08-04 15:50:00+01'),
  ('03000000-0000-0000-0000-000000000069', 'BK-2025-0069', '02000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000009', '2025-08-07', '09:00', '09:30', 30, 'Africa/Tunis', 'InProgress', 'Wafa Souissi', '+21650100016', 'wafa.souissi@sanad.tn', 'home', '160 Rue de la République', 'Manouba', '2776', 36.815900, 10.098150, true, false, NULL, 40.00, 0.00, 0.00, NULL, 40.00, 6.00, 0.00, 40.00, 'TND', 15.00, 6.00, 34.00, true, '000069', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-07-31 06:00:00+01', '2025-08-07 09:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000070', 'BK-2025-0070', '02000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000020', '2025-08-10', '08:00', '08:20', 20, 'Africa/Tunis', 'Completed', 'Nizar Ferchichi', '+21650100017', 'nizar.ferchichi@sanad.tn', 'home', '170 Rue de la République', 'Tabarka', '2887', 36.950000, 8.761850, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 5.50, 0.00, 55.00, 'TND', 10.00, 5.50, 49.50, true, '000070', 'sms', 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-070', '2025-08-02 04:00:00+01', '2025-08-10 08:35:00+01', NULL, NULL, NULL, '2025-08-10 08:20:00+01'),
  ('03000000-0000-0000-0000-000000000071', 'BK-2025-0071', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000048', '2025-08-12', '17:00', '18:00', 60, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.814100, 10.185550, false, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 8.40, 0.00, 70.00, 'TND', 12.00, 8.40, 61.60, true, '000071', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-08-03 12:00:00+01', '2025-08-12 18:15:00+01', NULL, NULL, NULL, '2025-08-12 18:00:00+01'),
  ('03000000-0000-0000-0000-000000000072', 'BK-2025-0072', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000018', '2025-08-15', '10:30', '11:30', 60, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.735900, 10.754450, false, false, NULL, 65.00, 0.00, 0.00, NULL, 65.00, 7.80, 0.00, 65.00, 'TND', 12.00, 7.80, 57.20, true, '000072', 'sms', 0, 0.00, 1, 'mobile', NULL, NULL, NULL, '2025-08-11 08:30:00+01', '2025-08-15 11:45:00+01', NULL, NULL, NULL, '2025-08-15 11:30:00+01'),
  ('03000000-0000-0000-0000-000000000073', 'BK-2025-0073', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000033', '2025-08-18', '09:00', '09:50', 50, 'Africa/Tunis', 'Disputed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.820000, 10.628150, false, false, NULL, 75.00, 0.00, 0.00, NULL, 75.00, 9.00, 0.00, 75.00, 'TND', 12.00, 9.00, 66.00, true, '000073', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-08-13 06:00:00+01', '2025-08-19 21:50:00+01', NULL, NULL, NULL, '2025-08-18 09:50:00+01'),
  ('03000000-0000-0000-0000-000000000074', 'BK-2025-0074', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000003', '2025-08-20', '16:00', '16:20', 20, 'Africa/Tunis', 'Completed', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'both', '40 Rue de la République', 'Monastir', '1444', 35.764100, 10.811850, true, false, NULL, 40.00, 0.00, 0.00, NULL, 40.00, 7.20, 0.00, 40.00, 'TND', 18.00, 7.20, 32.80, true, '000074', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-08-14 12:00:00+01', '2025-08-20 16:35:00+01', NULL, NULL, NULL, '2025-08-20 16:20:00+01'),
  ('03000000-0000-0000-0000-000000000075', 'BK-2025-0075', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000040', '2025-08-22', '10:00', '11:00', 60, 'Africa/Tunis', 'Validated', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la République', 'Bizerte', '1555', 37.265900, 9.875550, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000075', 'qr', 1, 0.00, 0, 'mobile', 'instagram', 'paid-social', 'campaign-075', '2025-08-15 05:00:00+01', '2025-08-23 08:00:00+01', NULL, NULL, NULL, '2025-08-22 11:00:00+01'),
  ('03000000-0000-0000-0000-000000000076', 'BK-2025-0076', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000035', '2025-08-25', '11:00', '12:00', 60, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.450000, 10.734450, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 7.50, 0.00, 50.00, 'TND', 15.00, 7.50, 42.50, true, '000076', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-08-17 09:00:00+01', '2025-08-25 12:15:00+01', NULL, NULL, NULL, '2025-08-25 12:00:00+01'),
  ('03000000-0000-0000-0000-000000000077', 'BK-2025-0077', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000026', '2025-08-28', '10:00', '11:00', 60, 'Africa/Tunis', 'Completed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la République', 'Kairouan', '1777', 35.674100, 10.098150, false, false, NULL, 300.00, 0.00, 0.00, NULL, 300.00, 24.00, 0.00, 300.00, 'TND', 8.00, 24.00, 276.00, true, '000077', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-08-19 07:00:00+01', '2025-08-28 11:15:00+01', NULL, NULL, NULL, '2025-08-28 11:00:00+01'),
  ('03000000-0000-0000-0000-000000000078', 'BK-2025-0078', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000007', '2025-09-02', '10:00', '10:20', 20, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la République', 'Gabes', '1888', 33.875900, 10.101850, true, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 9.90, 0.00, 55.00, 'TND', 18.00, 9.90, 45.10, true, '000078', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-08-29 06:00:00+01', '2025-09-02 10:35:00+01', NULL, NULL, NULL, '2025-09-02 10:20:00+01'),
  ('03000000-0000-0000-0000-000000000079', 'BK-2025-0079', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000013', '22000000-0000-0000-0000-000000000036', '2025-09-05', '14:00', '14:40', 40, 'Africa/Tunis', 'Completed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la République', 'Ariana', '1999', 36.870000, 10.165550, true, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 8.25, 0.00, 55.00, 'TND', 15.00, 8.25, 46.75, true, '000079', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-08-31 09:00:00+01', '2025-09-05 14:55:00+01', NULL, NULL, NULL, '2025-09-05 14:40:00+01'),
  ('03000000-0000-0000-0000-000000000080', 'BK-2025-0080', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000015', '2025-09-08', '09:00', '10:00', 60, 'Africa/Tunis', 'Completed', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la République', 'Ben Arous', '2110', 36.754100, 10.214450, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000080', 'sms', 0, 0.00, 0, 'call_center', 'instagram', 'paid-social', 'campaign-080', '2025-09-02 07:00:00+01', '2025-09-08 10:15:00+01', NULL, NULL, NULL, '2025-09-08 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000081', 'BK-2025-0081', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000028', '2025-09-10', '10:00', '11:00', 60, 'Africa/Tunis', 'Completed', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la République', 'Hammamet', '2221', 36.395900, 10.608150, false, false, NULL, 90.00, 0.00, 0.00, NULL, 90.00, 7.20, 0.00, 90.00, 'TND', 8.00, 7.20, 82.80, true, '000081', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-09-03 07:00:00+01', '2025-09-10 11:15:00+01', NULL, NULL, NULL, '2025-09-10 11:00:00+01'),
  ('03000000-0000-0000-0000-000000000082', 'BK-2025-0082', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000004', '2025-09-12', '08:30', '09:20', 50, 'Africa/Tunis', 'Confirmed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la République', 'La Marsa', '2332', 36.890000, 10.321850, true, false, NULL, 110.00, 0.00, 0.00, NULL, 110.00, 19.80, 0.00, 110.00, 'TND', 18.00, 19.80, 90.20, true, '000082', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-09-04 04:30:00+01', '2025-09-04 22:30:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000083', 'BK-2025-0083', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000023', '2025-09-15', '08:00', '08:25', 25, 'Africa/Tunis', 'Completed', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la République', 'Mahdia', '2443', 35.504100, 11.045550, false, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 8.00, 0.00, 80.00, 'TND', 10.00, 8.00, 72.00, true, '000083', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-09-06 03:00:00+01', '2025-09-15 08:40:00+01', NULL, NULL, NULL, '2025-09-15 08:25:00+01'),
  ('03000000-0000-0000-0000-000000000084', 'BK-2025-0084', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000010', '2025-09-18', '10:00', '18:00', 480, 'Africa/Tunis', 'Completed', 'Olfa Baccar', '+21650100014', 'olfa.baccar@sanad.tn', 'home', '140 Rue de la République', 'Gafsa', '2554', 34.425900, 8.774450, true, false, NULL, 200.00, 0.00, 0.00, NULL, 200.00, 30.00, 0.00, 200.00, 'TND', 15.00, 30.00, 170.00, true, '000084', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-09-14 08:00:00+01', '2025-09-18 18:15:00+01', NULL, NULL, NULL, '2025-09-18 18:00:00+01'),
  ('03000000-0000-0000-0000-000000000085', 'BK-2025-0085', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000019', '2025-09-20', '14:30', '15:30', 60, 'Africa/Tunis', 'Cancelled', 'Hatem Jeridi', '+21650100015', 'hatem.jeridi@sanad.tn', 'home', '150 Rue de la République', 'Djerba', '2665', 33.870000, 10.858150, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 6.60, 0.00, 55.00, 'TND', 12.00, 6.60, 48.40, false, NULL, NULL, 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-085', '2025-09-15 11:30:00+01', '2025-09-20 11:30:00+01', '2025-09-20 11:30:00+01', '21000000-0000-0000-0000-000000000006', 'Provider reported an operational issue before departure.', NULL),
  ('03000000-0000-0000-0000-000000000086', 'BK-2025-0086', '02000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000032', '2025-09-22', '15:00', '15:45', 45, 'Africa/Tunis', 'Completed', 'Wafa Souissi', '+21650100016', 'wafa.souissi@sanad.tn', 'home', '160 Rue de la République', 'Manouba', '2776', 36.824100, 10.101850, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000086', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-09-16 11:00:00+01', '2025-09-22 16:00:00+01', NULL, NULL, NULL, '2025-09-22 15:45:00+01'),
  ('03000000-0000-0000-0000-000000000087', 'BK-2025-0087', '02000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000013', '2025-09-25', '09:00', '09:40', 40, 'Africa/Tunis', 'Completed', 'Nizar Ferchichi', '+21650100017', 'nizar.ferchichi@sanad.tn', 'home', '170 Rue de la République', 'Tabarka', '2887', 36.945900, 8.765550, true, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 8.25, 0.00, 55.00, 'TND', 15.00, 8.25, 46.75, true, '000087', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-09-18 04:00:00+01', '2025-09-25 09:55:00+01', NULL, NULL, NULL, '2025-09-25 09:40:00+01'),
  ('03000000-0000-0000-0000-000000000088', 'BK-2025-0088', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000008', '22000000-0000-0000-0000-000000000025', '2025-09-28', '13:00', '14:00', 60, 'Africa/Tunis', 'Completed', 'Lamine Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la République', 'Tunis', '1111', 36.810000, 10.174450, false, true, 'Lamine Ben Ali', 300.00, 0.00, 0.00, NULL, 300.00, 60.00, 0.00, 300.00, 'TND', 20.00, 60.00, 240.00, true, '000088', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-09-20 11:00:00+01', '2025-09-28 14:15:00+01', NULL, NULL, NULL, '2025-09-28 14:00:00+01'),
  ('03000000-0000-0000-0000-000000000089', 'BK-2025-0089', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000012', '22000000-0000-0000-0000-000000000034', '2025-10-02', '10:00', '14:00', 240, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la République', 'Sfax', '1222', 34.744100, 10.758150, false, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 12.00, 0.00, 80.00, 'TND', 15.00, 12.00, 68.00, true, '000089', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-09-23 07:00:00+01', '2025-10-02 14:15:00+01', NULL, NULL, NULL, '2025-10-02 14:00:00+01'),
  ('03000000-0000-0000-0000-000000000090', 'BK-2025-0090', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000014', '22000000-0000-0000-0000-000000000039', '2025-10-05', '09:00', '09:50', 50, 'Africa/Tunis', 'Pending', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la République', 'Sousse', '1333', 35.815900, 10.631850, true, false, NULL, 95.00, 0.00, 0.00, NULL, 95.00, 17.10, 0.00, 95.00, 'TND', 18.00, 17.10, 77.90, false, NULL, NULL, 0, 0.00, 0, 'mobile', 'instagram', 'paid-social', 'campaign-090', '2025-10-01 05:00:00+01', '2025-10-01 06:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000091', 'BK-2025-0091', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000016', '2025-10-08', '14:00', '14:45', 45, 'Africa/Tunis', 'InProgress', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la République', 'Monastir', '1444', 35.760000, 10.815550, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 6.00, 0.00, 50.00, 'TND', 12.00, 6.00, 44.00, true, '000091', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-10-03 09:00:00+01', '2025-10-08 14:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000092', 'BK-2025-0092', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000005', '2025-10-10', '10:30', '11:10', 40, 'Africa/Tunis', 'Completed', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la République', 'Bizerte', '1555', 37.274100, 9.864450, true, false, NULL, 75.00, 0.00, 0.00, NULL, 75.00, 13.50, 0.00, 75.00, 'TND', 18.00, 13.50, 61.50, true, '000092', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-10-04 08:30:00+01', '2025-10-10 11:25:00+01', NULL, NULL, NULL, '2025-10-10 11:10:00+01'),
  ('03000000-0000-0000-0000-000000000093', 'BK-2025-0093', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000013', '22000000-0000-0000-0000-000000000037', '2025-10-12', '09:00', '09:15', 15, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la République', 'Nabeul', '1666', 36.445900, 10.738150, true, false, NULL, 25.00, 0.00, 0.00, NULL, 25.00, 3.75, 0.00, 25.00, 'TND', 15.00, 3.75, 21.25, true, '000093', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-10-05 06:00:00+01', '2025-10-12 09:30:00+01', NULL, NULL, NULL, '2025-10-12 09:15:00+01'),
  ('03000000-0000-0000-0000-000000000094', 'BK-2025-0094', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000001', '2025-10-15', '08:00', '08:45', 45, 'Africa/Tunis', 'Completed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la République', 'Kairouan', '1777', 35.670000, 10.101850, true, false, NULL, 80.00, 0.00, 20.00, 'VIP25', 60.00, 10.80, 0.00, 60.00, 'TND', 18.00, 10.80, 49.20, true, '000094', 'sms', 0, 0.00, 0, 'web', 'crm-retention', 'push', 'campaign-094', '2025-10-07 04:00:00+01', '2025-10-15 09:00:00+01', NULL, NULL, NULL, '2025-10-15 08:45:00+01'),
  ('03000000-0000-0000-0000-000000000095', 'BK-2025-0095', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000009', '22000000-0000-0000-0000-000000000027', '2025-10-18', '10:00', '11:00', 60, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la République', 'Gabes', '1888', 33.884100, 10.105550, false, false, NULL, 360.00, 0.00, 0.00, NULL, 360.00, 28.80, 0.00, 360.00, 'TND', 8.00, 28.80, 331.20, true, '000095', 'qr', 0, 0.00, 0, 'call_center', 'instagram', 'paid-social', 'campaign-095', '2025-10-09 05:00:00+01', '2025-10-18 11:15:00+01', NULL, NULL, NULL, '2025-10-18 11:00:00+01'),
  ('03000000-0000-0000-0000-000000000096', 'BK-2025-0096', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000015', '22000000-0000-0000-0000-000000000041', '2025-10-20', '11:00', '11:30', 30, 'Africa/Tunis', 'Completed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la République', 'Ariana', '1999', 36.865900, 10.154450, false, false, NULL, 45.00, 0.00, 0.00, NULL, 45.00, 5.40, 0.00, 45.00, 'TND', 12.00, 5.40, 39.60, true, '000096', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-10-16 09:00:00+01', '2025-10-20 11:45:00+01', NULL, NULL, NULL, '2025-10-20 11:30:00+01'),
  ('03000000-0000-0000-0000-000000000097', 'BK-2025-0097', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000007', '22000000-0000-0000-0000-000000000021', '2025-10-22', '08:00', '08:15', 15, 'Africa/Tunis', 'Validated', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la République', 'Ben Arous', '2110', 36.750000, 10.218150, false, false, NULL, 30.00, 0.00, 0.00, NULL, 30.00, 3.00, 0.00, 30.00, 'TND', 10.00, 3.00, 27.00, true, '000097', 'qr', 1, 0.00, 0, 'web', NULL, NULL, NULL, '2025-10-17 05:00:00+01', '2025-10-23 03:15:00+01', NULL, NULL, NULL, '2025-10-22 08:15:00+01'),
  ('03000000-0000-0000-0000-000000000098', 'BK-2025-0098', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000044', '2025-10-25', '10:00', '11:15', 75, 'Africa/Tunis', 'Completed', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la République', 'Hammamet', '2221', 36.404100, 10.611850, true, false, NULL, 85.00, 0.00, 0.00, NULL, 85.00, 12.75, 0.00, 85.00, 'TND', 15.00, 12.75, 72.25, true, '000098', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-10-19 06:00:00+01', '2025-10-25 11:30:00+01', NULL, NULL, NULL, '2025-10-25 11:15:00+01'),
  ('03000000-0000-0000-0000-000000000099', 'BK-2025-0099', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000018', '2025-10-28', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la République', 'La Marsa', '2332', 36.885900, 10.325550, false, false, NULL, 65.00, 0.00, 0.00, NULL, 65.00, 7.80, 0.00, 65.00, 'TND', 12.00, 7.80, 57.20, true, '000099', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-10-21 09:00:00+01', '2025-10-28 15:15:00+01', NULL, NULL, NULL, '2025-10-28 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000100', 'BK-2025-0100', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000015', '2025-11-01', '09:00', '10:00', 60, 'Africa/Tunis', 'Confirmed', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la République', 'Mahdia', '2443', 35.500000, 11.034450, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 7.20, 0.00, 60.00, 'TND', 12.00, 7.20, 52.80, true, '000100', 'sms', 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-100', '2025-10-24 07:00:00+01', '2025-10-24 19:00:00+01', NULL, NULL, NULL, NULL)
 ) AS seed(
  id, booking_number, patient_id, provider_id, service_id,
  start_date, daily_start_time, daily_end_time, daily_duration_minutes, timezone, status,
  patient_name, patient_phone, patient_email, service_location, address_line1, city, postal_code,
  latitude, longitude, medical_history_shared, is_for_family_member, family_member_name,
  service_price, addons_price, discount_amount, discount_code, subtotal, platform_fee, tax_amount,
  legacy_total_amount, currency, commission_rate, commission_amount, legacy_provider_amount,
  validation_required, validation_code, validation_method, validation_attempts,
  cancellation_fee, reschedule_count, source, utm_source, utm_medium, utm_campaign,
  created_at, updated_at, cancelled_at, cancelled_by, cancellation_reason, service_completed_at
 )
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 19. BOOKING_STATUS_HISTORY
-- ==============================================================
INSERT INTO booking_status_history (id, booking_id, previous_status, new_status, changed_by, created_at, latitude, longitude, change_reason, notes)
VALUES
  ('23000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000001', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-01-15 15:00:00+01', 36.810000, 10.178150, 'Provider accepted the request.', 'Consultation Générale prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000001', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-01-20 08:26:00+01', 36.797000, 10.168150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000001', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-01-20 09:00:00+01', 36.810000, 10.178150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000001', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-01-20 09:45:00+01', 36.810000, 10.178150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000002', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-01-15 16:00:00+01', 34.744100, 10.761850, 'Provider accepted the request.', 'Injection et Perfusion prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000002', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-01-21 09:27:00+01', 34.733100, 10.753850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000007', '03000000-0000-0000-0000-000000000002', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-01-21 10:00:00+01', 34.744100, 10.761850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000008', '03000000-0000-0000-0000-000000000002', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000003', '2025-01-21 10:30:00+01', 34.744100, 10.761850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000009', '03000000-0000-0000-0000-000000000003', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-01-15 20:00:00+01', 35.815900, 10.635550, 'Provider accepted the request.', 'Rééducation Motrice prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000010', '03000000-0000-0000-0000-000000000003', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-01-22 13:28:00+01', 35.800900, 10.629550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000011', '03000000-0000-0000-0000-000000000003', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-01-22 14:00:00+01', 35.815900, 10.635550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000012', '03000000-0000-0000-0000-000000000003', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-01-22 15:00:00+01', 35.815900, 10.635550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000013', '03000000-0000-0000-0000-000000000005', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-01-15 18:30:00+01', 35.764100, 10.808150, 'Provider accepted the request.', 'Bilan Sanguin Complet prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000014', '03000000-0000-0000-0000-000000000005', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-01-24 08:00:00+01', 35.753100, 10.798150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000015', '03000000-0000-0000-0000-000000000005', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-01-24 08:30:00+01', 35.764100, 10.808150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000016', '03000000-0000-0000-0000-000000000005', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-01-24 08:50:00+01', 35.764100, 10.808150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000017', '03000000-0000-0000-0000-000000000006', 'Pending', 'Cancelled', '21000000-0000-0000-0000-000000000001', '2025-01-25 12:00:00+01', 34.735900, 10.761850, 'Provider reported an operational issue before departure.', 'Refund workflow initiated before the visit started.'),
  ('23000000-0000-0000-0000-000000000018', '03000000-0000-0000-0000-000000000007', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-01-31 20:00:00+01', 37.270000, 9.875550, 'Provider accepted the request.', 'Consultation Générale prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000019', '03000000-0000-0000-0000-000000000007', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-02-05 09:32:00+01', 37.257000, 9.869550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000020', '03000000-0000-0000-0000-000000000007', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-02-05 10:00:00+01', 37.270000, 9.875550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000021', '03000000-0000-0000-0000-000000000007', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-02-05 10:45:00+01', 37.270000, 9.875550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000022', '03000000-0000-0000-0000-000000000007', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-02-06 11:45:00+01', 37.270000, 9.875550, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000023', '03000000-0000-0000-0000-000000000008', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-02-04 23:00:00+01', 36.454100, 10.734450, 'Provider accepted the request.', 'Soins de Plaie prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000024', '03000000-0000-0000-0000-000000000008', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-02-10 08:25:00+01', 36.443100, 10.722450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000025', '03000000-0000-0000-0000-000000000008', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-02-10 09:00:00+01', 36.454100, 10.734450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000026', '03000000-0000-0000-0000-000000000008', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000003', '2025-02-10 09:30:00+01', 36.454100, 10.734450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000027', '03000000-0000-0000-0000-000000000009', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-02-09 05:00:00+01', 36.445900, 10.738150, 'Provider accepted the request.', 'Rééducation Motrice prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000028', '03000000-0000-0000-0000-000000000009', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-02-15 14:26:00+01', 36.430900, 10.728150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000029', '03000000-0000-0000-0000-000000000009', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-02-15 15:00:00+01', 36.445900, 10.738150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000030', '03000000-0000-0000-0000-000000000009', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-02-15 16:00:00+01', 36.445900, 10.738150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000031', '03000000-0000-0000-0000-000000000010', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-02-12 21:30:00+01', 35.670000, 10.101850, 'Provider accepted the request.', 'Bilan Sanguin Complet prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000032', '03000000-0000-0000-0000-000000000010', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-02-20 06:57:00+01', 35.657000, 10.093850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000033', '03000000-0000-0000-0000-000000000010', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-02-20 07:30:00+01', 35.670000, 10.101850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000034', '03000000-0000-0000-0000-000000000010', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-02-20 07:50:00+01', 35.670000, 10.101850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000035', '03000000-0000-0000-0000-000000000010', 'Completed', 'Disputed', '11000000-0000-0000-0000-000000000007', '2025-02-21 07:50:00+01', 35.670000, 10.101850, 'Patient opened a post-service dispute.', 'Case routed to support.'),
  ('23000000-0000-0000-0000-000000000036', '03000000-0000-0000-0000-000000000011', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-02-20 23:30:00+01', 36.814100, 10.185550, 'Provider accepted the request.', 'ECG + Consultation prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000037', '03000000-0000-0000-0000-000000000011', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-03-01 08:58:00+01', 36.803100, 10.179550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000038', '03000000-0000-0000-0000-000000000011', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-03-01 09:30:00+01', 36.814100, 10.185550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000039', '03000000-0000-0000-0000-000000000011', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-03-01 10:20:00+01', 36.814100, 10.185550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000040', '03000000-0000-0000-0000-000000000012', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-03-01 17:00:00+01', 35.815900, 10.624450, 'Provider accepted the request.', 'Kinésithérapie Sportive prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000041', '03000000-0000-0000-0000-000000000012', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000006', '2025-03-05 10:29:00+01', 35.800900, 10.612450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000042', '03000000-0000-0000-0000-000000000012', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000006', '2025-03-05 11:00:00+01', 35.815900, 10.624450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000043', '03000000-0000-0000-0000-000000000012', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000006', '2025-03-05 12:00:00+01', 35.815900, 10.624450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000044', '03000000-0000-0000-0000-000000000013', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000004', '2025-03-03 16:00:00+01', 33.880000, 10.098150, 'Provider accepted the request.', 'Visite Sage-Femme Post-Partum prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000045', '03000000-0000-0000-0000-000000000013', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000004', '2025-03-08 09:30:00+01', 33.867000, 10.088150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000046', '03000000-0000-0000-0000-000000000013', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000004', '2025-03-08 10:00:00+01', 33.880000, 10.098150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000047', '03000000-0000-0000-0000-000000000013', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000004', '2025-03-08 11:15:00+01', 33.880000, 10.098150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000048', '03000000-0000-0000-0000-000000000014', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000008', '2025-03-04 20:00:00+01', 36.874100, 10.161850, 'Provider accepted the request.', 'Transport Médicalisé Standard prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000049', '03000000-0000-0000-0000-000000000014', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000008', '2025-03-10 13:31:00+01', 36.863100, 10.153850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000050', '03000000-0000-0000-0000-000000000014', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000008', '2025-03-10 14:00:00+01', 36.874100, 10.161850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000051', '03000000-0000-0000-0000-000000000014', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000008', '2025-03-10 15:00:00+01', 36.874100, 10.161850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000052', '03000000-0000-0000-0000-000000000015', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000002', '2025-03-05 15:00:00+01', 36.745900, 10.225550, 'Provider accepted the request.', 'Consultation Pédiatrique prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000053', '03000000-0000-0000-0000-000000000015', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000002', '2025-03-12 08:32:00+01', 36.730900, 10.219550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000054', '03000000-0000-0000-0000-000000000015', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000002', '2025-03-12 09:00:00+01', 36.745900, 10.225550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000055', '03000000-0000-0000-0000-000000000015', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000002', '2025-03-12 09:40:00+01', 36.745900, 10.225550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000056', '03000000-0000-0000-0000-000000000016', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-03-08 02:00:00+01', 36.400000, 10.604450, 'Provider accepted the request.', 'Rééducation Post-AVC prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000057', '03000000-0000-0000-0000-000000000016', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-03-15 15:25:00+01', 36.387000, 10.592450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000058', '03000000-0000-0000-0000-000000000016', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-03-15 16:00:00+01', 36.400000, 10.604450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000059', '03000000-0000-0000-0000-000000000016', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-03-15 17:30:00+01', 36.400000, 10.604450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000060', '03000000-0000-0000-0000-000000000016', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-03-16 11:30:00+01', 36.400000, 10.604450, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000061', '03000000-0000-0000-0000-000000000017', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-03-09 18:00:00+01', 34.744100, 10.758150, 'Provider accepted the request.', 'Prélèvement Urinaire prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000062', '03000000-0000-0000-0000-000000000017', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-03-18 07:26:00+01', 34.733100, 10.748150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000063', '03000000-0000-0000-0000-000000000017', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-03-18 08:00:00+01', 34.744100, 10.758150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000064', '03000000-0000-0000-0000-000000000017', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-03-18 08:15:00+01', 34.744100, 10.758150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000065', '03000000-0000-0000-0000-000000000018', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000010', '2025-03-17 01:00:00+01', 35.755900, 10.811850, 'Provider accepted the request.', 'Thérapie de Couple prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000066', '03000000-0000-0000-0000-000000000018', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000010', '2025-03-20 14:27:00+01', 35.740900, 10.803850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000067', '03000000-0000-0000-0000-000000000018', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000010', '2025-03-20 15:00:00+01', 35.755900, 10.811850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000068', '03000000-0000-0000-0000-000000000018', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000010', '2025-03-20 16:00:00+01', 35.755900, 10.811850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000069', '03000000-0000-0000-0000-000000000019', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000011', '2025-03-17 20:30:00+01', 37.270000, 9.875550, 'Provider accepted the request.', 'Plan Alimentaire Diabète prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000070', '03000000-0000-0000-0000-000000000019', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000011', '2025-03-22 09:58:00+01', 37.257000, 9.869550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000071', '03000000-0000-0000-0000-000000000019', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000011', '2025-03-22 10:30:00+01', 37.270000, 9.875550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000072', '03000000-0000-0000-0000-000000000019', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000011', '2025-03-22 11:20:00+01', 37.270000, 9.875550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000073', '03000000-0000-0000-0000-000000000020', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-03-19 23:00:00+01', 36.894100, 10.314450, 'Provider accepted the request.', 'Téléconsultation prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000074', '03000000-0000-0000-0000-000000000020', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-03-25 08:29:00+01', 36.883100, 10.302450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000075', '03000000-0000-0000-0000-000000000020', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-03-25 09:00:00+01', 36.894100, 10.314450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000076', '03000000-0000-0000-0000-000000000020', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-03-25 09:20:00+01', 36.894100, 10.314450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000077', '03000000-0000-0000-0000-000000000021', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000012', '2025-03-22 01:00:00+01', 35.495900, 11.038150, 'Provider accepted the request.', 'Stimulation Cognitive prepared for Firas Dridi.'),
  ('23000000-0000-0000-0000-000000000078', '03000000-0000-0000-0000-000000000021', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000012', '2025-03-28 10:30:00+01', 35.480900, 11.028150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000079', '03000000-0000-0000-0000-000000000021', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000012', '2025-03-28 11:00:00+01', 35.495900, 11.038150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000080', '03000000-0000-0000-0000-000000000021', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000012', '2025-03-28 12:00:00+01', 35.495900, 11.038150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000081', '03000000-0000-0000-0000-000000000023', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-04-01 16:00:00+01', 36.814100, 10.185550, 'Provider accepted the request.', 'Surveillance Infirmiere de Nuit prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000082', '03000000-0000-0000-0000-000000000023', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-04-03 21:15:00+01', 36.803100, 10.179550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000083', '03000000-0000-0000-0000-000000000023', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-04-03 22:00:00+01', 36.814100, 10.185550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000084', '03000000-0000-0000-0000-000000000023', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000003', '2025-04-04 06:00:00+01', 36.814100, 10.185550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000085', '03000000-0000-0000-0000-000000000024', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-04-01 15:00:00+01', 35.815900, 10.624450, 'Provider accepted the request.', 'Location Fauteuil Roulant prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000086', '03000000-0000-0000-0000-000000000024', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000009', '2025-04-05 08:25:00+01', 35.800900, 10.612450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000087', '03000000-0000-0000-0000-000000000024', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000009', '2025-04-05 09:00:00+01', 35.815900, 10.624450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000088', '03000000-0000-0000-0000-000000000024', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000009', '2025-04-05 10:00:00+01', 35.815900, 10.624450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000089', '03000000-0000-0000-0000-000000000025', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-04-03 14:30:00+01', 33.870000, 10.858150, 'Provider accepted the request.', 'Consultation Générale prepared for Hatem Jeridi.'),
  ('23000000-0000-0000-0000-000000000090', '03000000-0000-0000-0000-000000000025', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-04-08 07:56:00+01', 33.857000, 10.848150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000091', '03000000-0000-0000-0000-000000000025', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-04-08 08:30:00+01', 33.870000, 10.858150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000092', '03000000-0000-0000-0000-000000000025', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-04-08 09:15:00+01', 33.870000, 10.858150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000093', '03000000-0000-0000-0000-000000000026', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-04-04 14:00:00+01', 36.454100, 10.741850, 'Provider accepted the request.', 'Bilan Thyroïdien prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000094', '03000000-0000-0000-0000-000000000026', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-04-10 07:27:00+01', 36.443100, 10.733850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000095', '03000000-0000-0000-0000-000000000026', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-04-10 08:00:00+01', 36.454100, 10.741850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000096', '03000000-0000-0000-0000-000000000026', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-04-10 08:20:00+01', 36.454100, 10.741850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000097', '03000000-0000-0000-0000-000000000027', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000002', '2025-04-05 16:00:00+01', 35.665900, 10.105550, 'Provider accepted the request.', 'Late operational issue reported before service.'),
  ('23000000-0000-0000-0000-000000000098', '03000000-0000-0000-0000-000000000027', 'Confirmed', 'Cancelled', '21000000-0000-0000-0000-000000000002', '2025-04-12 05:00:00+01', 35.665900, 10.105550, 'Provider reported an operational issue before departure.', 'Refund workflow initiated.'),
  ('23000000-0000-0000-0000-000000000099', '03000000-0000-0000-0000-000000000028', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-04-08 00:00:00+01', 33.880000, 10.094450, 'Provider accepted the request.', 'Massage Thérapeutique prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000100', '03000000-0000-0000-0000-000000000028', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-04-15 13:29:00+01', 33.867000, 10.082450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000101', '03000000-0000-0000-0000-000000000028', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-04-15 14:00:00+01', 33.880000, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000102', '03000000-0000-0000-0000-000000000028', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-04-15 14:45:00+01', 33.880000, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000103', '03000000-0000-0000-0000-000000000028', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-04-16 12:45:00+01', 33.880000, 10.094450, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000104', '03000000-0000-0000-0000-000000000029', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000004', '2025-04-09 19:30:00+01', 36.874100, 10.158150, 'Provider accepted the request.', 'Aspiration Bronchique prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000105', '03000000-0000-0000-0000-000000000029', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000004', '2025-04-18 09:00:00+01', 36.863100, 10.148150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000106', '03000000-0000-0000-0000-000000000029', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000004', '2025-04-18 09:30:00+01', 36.874100, 10.158150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000107', '03000000-0000-0000-0000-000000000029', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000004', '2025-04-18 10:10:00+01', 36.874100, 10.158150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000108', '03000000-0000-0000-0000-000000000030', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-04-16 21:00:00+01', 36.745900, 10.221850, 'Provider accepted the request.', 'Drainage Lymphatique prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000109', '03000000-0000-0000-0000-000000000031', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000010', '2025-04-18 01:30:00+01', 36.400000, 10.615550, 'Provider accepted the request.', 'Soutien Anxiété / Dépression prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000110', '03000000-0000-0000-0000-000000000031', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000010', '2025-04-22 15:02:00+01', 36.387000, 10.609550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000111', '03000000-0000-0000-0000-000000000031', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000010', '2025-04-22 15:30:00+01', 36.400000, 10.615550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000112', '03000000-0000-0000-0000-000000000031', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000010', '2025-04-22 16:20:00+01', 36.400000, 10.615550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000113', '03000000-0000-0000-0000-000000000032', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000012', '2025-04-20 00:00:00+01', 34.744100, 10.754450, 'Provider accepted the request.', 'Accompagnement Senior prepared for Hamza Trabelsi.'),
  ('23000000-0000-0000-0000-000000000114', '03000000-0000-0000-0000-000000000032', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000012', '2025-04-25 09:25:00+01', 34.733100, 10.742450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000115', '03000000-0000-0000-0000-000000000032', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000012', '2025-04-25 10:00:00+01', 34.744100, 10.754450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000116', '03000000-0000-0000-0000-000000000032', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000012', '2025-04-25 14:00:00+01', 34.744100, 10.754450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000117', '03000000-0000-0000-0000-000000000033', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-04-21 23:00:00+01', 36.885900, 10.318150, 'Provider accepted the request.', 'Injection et Perfusion prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000118', '03000000-0000-0000-0000-000000000033', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-04-28 08:26:00+01', 36.870900, 10.308150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000119', '03000000-0000-0000-0000-000000000033', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-04-28 09:00:00+01', 36.885900, 10.318150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000120', '03000000-0000-0000-0000-000000000033', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000003', '2025-04-28 09:30:00+01', 36.885900, 10.318150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000121', '03000000-0000-0000-0000-000000000034', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000008', '2025-04-25 03:00:00+01', 35.500000, 11.041850, 'Provider accepted the request.', 'Transport Urgence ALS prepared for Firas Dridi.'),
  ('23000000-0000-0000-0000-000000000122', '03000000-0000-0000-0000-000000000034', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000008', '2025-05-02 12:27:00+01', 35.487000, 11.033850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000123', '03000000-0000-0000-0000-000000000034', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000008', '2025-05-02 13:00:00+01', 35.500000, 11.041850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000124', '03000000-0000-0000-0000-000000000034', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000008', '2025-05-02 14:00:00+01', 35.500000, 11.041850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000125', '03000000-0000-0000-0000-000000000035', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000015', '2025-04-27 00:00:00+01', 34.434100, 8.785550, 'Provider accepted the request.', 'Électrostimulation prepared for Olfa Baccar.'),
  ('23000000-0000-0000-0000-000000000126', '03000000-0000-0000-0000-000000000036', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000013', '2025-05-03 15:30:00+01', 36.815900, 10.094450, 'Provider accepted the request.', 'Suivi Diabete et Hypertension prepared for Wafa Souissi.'),
  ('23000000-0000-0000-0000-000000000127', '03000000-0000-0000-0000-000000000036', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000013', '2025-05-07 08:59:00+01', 36.800900, 10.082450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000128', '03000000-0000-0000-0000-000000000036', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000013', '2025-05-07 09:30:00+01', 36.815900, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000129', '03000000-0000-0000-0000-000000000036', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000013', '2025-05-07 10:20:00+01', 36.815900, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000130', '03000000-0000-0000-0000-000000000037', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-05-05 20:00:00+01', 36.950000, 8.758150, 'Provider accepted the request.', 'Rééducation Motrice prepared for Nizar Ferchichi.'),
  ('23000000-0000-0000-0000-000000000131', '03000000-0000-0000-0000-000000000037', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-05-10 13:30:00+01', 36.937000, 8.748150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000132', '03000000-0000-0000-0000-000000000037', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-05-10 14:00:00+01', 36.950000, 8.758150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000133', '03000000-0000-0000-0000-000000000037', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-05-10 15:00:00+01', 36.950000, 8.758150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000134', '03000000-0000-0000-0000-000000000038', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-05-06 14:30:00+01', 36.814100, 10.181850, 'Provider accepted the request.', 'Sérologies Virales prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000135', '03000000-0000-0000-0000-000000000038', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-05-12 08:01:00+01', 36.803100, 10.173850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000136', '03000000-0000-0000-0000-000000000038', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-05-12 08:30:00+01', 36.814100, 10.181850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000137', '03000000-0000-0000-0000-000000000038', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-05-12 08:55:00+01', 36.814100, 10.181850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000138', '03000000-0000-0000-0000-000000000039', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000011', '2025-05-08 22:00:00+01', 35.815900, 10.635550, 'Provider accepted the request.', 'Bilan Nutritionnel prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000139', '03000000-0000-0000-0000-000000000039', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000011', '2025-05-15 15:32:00+01', 35.800900, 10.629550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000140', '03000000-0000-0000-0000-000000000039', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000011', '2025-05-15 16:00:00+01', 35.815900, 10.635550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000141', '03000000-0000-0000-0000-000000000039', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000011', '2025-05-15 16:45:00+01', 35.815900, 10.635550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000142', '03000000-0000-0000-0000-000000000040', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000012', '2025-05-10 20:00:00+01', 35.760000, 10.804450, 'Provider accepted the request.', 'Stimulation Cognitive prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000143', '03000000-0000-0000-0000-000000000040', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000012', '2025-05-18 09:25:00+01', 35.747000, 10.792450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000144', '03000000-0000-0000-0000-000000000040', 'ProviderOnWay', 'NoShow', '21000000-0000-0000-0000-000000000012', '2025-05-18 10:20:00+01', 35.760000, 10.804450, 'Recipient unavailable at the service address.', 'Support follow-up requested.'),
  ('23000000-0000-0000-0000-000000000145', '03000000-0000-0000-0000-000000000041', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000015', '2025-05-11 19:00:00+01', 37.274100, 9.868150, 'Provider accepted the request.', 'Rééducation Dos prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000146', '03000000-0000-0000-0000-000000000041', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000015', '2025-05-20 08:26:00+01', 37.263100, 9.858150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000147', '03000000-0000-0000-0000-000000000041', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000015', '2025-05-20 09:00:00+01', 37.274100, 9.868150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000148', '03000000-0000-0000-0000-000000000041', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000015', '2025-05-20 10:00:00+01', 37.274100, 9.868150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000149', '03000000-0000-0000-0000-000000000042', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000002', '2025-05-18 21:30:00+01', 36.445900, 10.741850, 'Provider accepted the request.', 'Vaccination à Domicile prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000150', '03000000-0000-0000-0000-000000000042', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000002', '2025-05-22 10:57:00+01', 36.430900, 10.733850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000151', '03000000-0000-0000-0000-000000000042', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000002', '2025-05-22 11:30:00+01', 36.445900, 10.741850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000152', '03000000-0000-0000-0000-000000000042', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000002', '2025-05-22 11:50:00+01', 36.445900, 10.741850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000153', '03000000-0000-0000-0000-000000000043', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-05-21 00:00:00+01', 35.670000, 10.105550, 'Provider accepted the request.', 'Kinésithérapie Sportive prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000154', '03000000-0000-0000-0000-000000000043', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000006', '2025-05-25 13:28:00+01', 35.657000, 10.099550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000155', '03000000-0000-0000-0000-000000000043', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000006', '2025-05-25 14:00:00+01', 35.670000, 10.105550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000156', '03000000-0000-0000-0000-000000000043', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000006', '2025-05-25 15:00:00+01', 35.670000, 10.105550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000157', '03000000-0000-0000-0000-000000000044', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000013', '2025-05-22 23:30:00+01', 33.884100, 10.094450, 'Provider accepted the request.', 'Soins Stomie prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000158', '03000000-0000-0000-0000-000000000044', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000013', '2025-05-28 08:59:00+01', 33.873100, 10.082450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000159', '03000000-0000-0000-0000-000000000044', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000013', '2025-05-28 09:30:00+01', 33.884100, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000160', '03000000-0000-0000-0000-000000000044', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000013', '2025-05-28 10:10:00+01', 33.884100, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000161', '03000000-0000-0000-0000-000000000045', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-05-27 00:00:00+01', 36.865900, 10.158150, 'Provider accepted the request.', 'Location Concentrateur O2 prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000162', '03000000-0000-0000-0000-000000000047', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-05-30 22:00:00+01', 36.404100, 10.615550, 'Provider accepted the request.', 'Radiographie Mobile Thorax prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000163', '03000000-0000-0000-0000-000000000047', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-06-08 07:32:00+01', 36.393100, 10.609550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000164', '03000000-0000-0000-0000-000000000047', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-06-08 08:00:00+01', 36.404100, 10.615550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000165', '03000000-0000-0000-0000-000000000047', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-06-08 08:35:00+01', 36.404100, 10.615550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000166', '03000000-0000-0000-0000-000000000048', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-06-06 15:00:00+01', 36.885900, 10.314450, 'Provider accepted the request.', 'Location Lit Médicalisé prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000167', '03000000-0000-0000-0000-000000000048', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000009', '2025-06-10 08:25:00+01', 36.870900, 10.302450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000168', '03000000-0000-0000-0000-000000000048', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000009', '2025-06-10 09:00:00+01', 36.885900, 10.314450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000169', '03000000-0000-0000-0000-000000000048', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000009', '2025-06-10 10:00:00+01', 36.885900, 10.314450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000170', '03000000-0000-0000-0000-000000000049', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000004', '2025-06-07 17:00:00+01', 35.500000, 11.038150, 'Provider accepted the request.', 'Late operational issue reported before service.'),
  ('23000000-0000-0000-0000-000000000171', '03000000-0000-0000-0000-000000000049', 'Confirmed', 'Cancelled', '21000000-0000-0000-0000-000000000004', '2025-06-12 04:00:00+01', 35.500000, 11.038150, 'Provider reported an operational issue before departure.', 'Refund workflow initiated.'),
  ('23000000-0000-0000-0000-000000000172', '03000000-0000-0000-0000-000000000050', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-06-09 14:30:00+01', 34.434100, 8.781850, 'Provider accepted the request.', 'Bilan Sanguin Complet prepared for Olfa Baccar.'),
  ('23000000-0000-0000-0000-000000000173', '03000000-0000-0000-0000-000000000050', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-06-15 07:57:00+01', 34.423100, 8.773850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000174', '03000000-0000-0000-0000-000000000050', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-06-15 08:30:00+01', 34.434100, 8.781850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000175', '03000000-0000-0000-0000-000000000050', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-06-15 08:50:00+01', 34.434100, 8.781850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000176', '03000000-0000-0000-0000-000000000051', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-06-11 20:00:00+01', 33.865900, 10.865550, 'Provider accepted the request.', 'Rééducation Motrice prepared for Hatem Jeridi.'),
  ('23000000-0000-0000-0000-000000000177', '03000000-0000-0000-0000-000000000051', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-06-18 13:28:00+01', 33.850900, 10.859550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000178', '03000000-0000-0000-0000-000000000051', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-06-18 14:00:00+01', 33.865900, 10.865550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000179', '03000000-0000-0000-0000-000000000051', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-06-18 15:00:00+01', 33.865900, 10.865550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000180', '03000000-0000-0000-0000-000000000052', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000002', '2025-06-12 20:30:00+01', 36.820000, 10.094450, 'Provider accepted the request.', 'Consultation Pédiatrique prepared for Wafa Souissi.'),
  ('23000000-0000-0000-0000-000000000181', '03000000-0000-0000-0000-000000000052', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000002', '2025-06-20 09:59:00+01', 36.807000, 10.082450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000182', '03000000-0000-0000-0000-000000000052', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000002', '2025-06-20 10:30:00+01', 36.820000, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000183', '03000000-0000-0000-0000-000000000052', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000002', '2025-06-20 11:10:00+01', 36.820000, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000184', '03000000-0000-0000-0000-000000000052', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-06-21 09:10:00+01', 36.820000, 10.094450, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000185', '03000000-0000-0000-0000-000000000053', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000010', '2025-06-15 02:00:00+01', 36.954100, 8.758150, 'Provider accepted the request.', 'Thérapie de Couple prepared for Nizar Ferchichi.'),
  ('23000000-0000-0000-0000-000000000186', '03000000-0000-0000-0000-000000000053', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000010', '2025-06-23 15:30:00+01', 36.943100, 8.748150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000187', '03000000-0000-0000-0000-000000000053', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000010', '2025-06-23 16:00:00+01', 36.954100, 8.758150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000188', '03000000-0000-0000-0000-000000000053', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000010', '2025-06-23 17:00:00+01', 36.954100, 8.758150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000189', '03000000-0000-0000-0000-000000000054', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000011', '2025-06-21 19:00:00+01', 36.805900, 10.181850, 'Provider accepted the request.', 'Plan Alimentaire Diabète prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000190', '03000000-0000-0000-0000-000000000054', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000011', '2025-06-25 08:31:00+01', 36.790900, 10.173850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000191', '03000000-0000-0000-0000-000000000054', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000011', '2025-06-25 09:00:00+01', 36.805900, 10.181850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000192', '03000000-0000-0000-0000-000000000054', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000011', '2025-06-25 09:50:00+01', 36.805900, 10.181850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000193', '03000000-0000-0000-0000-000000000055', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000012', '2025-06-23 21:30:00+01', 34.740000, 10.765550, 'Provider accepted the request.', 'Stimulation Cognitive prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000194', '03000000-0000-0000-0000-000000000055', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000012', '2025-06-28 11:02:00+01', 34.727000, 10.759550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000195', '03000000-0000-0000-0000-000000000055', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000012', '2025-06-28 11:30:00+01', 34.740000, 10.765550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000196', '03000000-0000-0000-0000-000000000055', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000012', '2025-06-28 12:30:00+01', 34.740000, 10.765550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000197', '03000000-0000-0000-0000-000000000057', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-06-29 00:00:00+01', 35.755900, 10.808150, 'Provider accepted the request.', 'Drainage Lymphatique prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000198', '03000000-0000-0000-0000-000000000057', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000006', '2025-07-05 09:26:00+01', 35.740900, 10.798150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000199', '03000000-0000-0000-0000-000000000057', 'ProviderOnWay', 'NoShow', '21000000-0000-0000-0000-000000000006', '2025-07-05 10:20:00+01', 35.755900, 10.808150, 'Recipient unavailable at the service address.', 'Support follow-up requested.'),
  ('23000000-0000-0000-0000-000000000200', '03000000-0000-0000-0000-000000000058', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-06-30 23:30:00+01', 37.270000, 9.871850, 'Provider accepted the request.', 'Injection et Perfusion prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000201', '03000000-0000-0000-0000-000000000058', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-07-08 08:57:00+01', 37.257000, 9.863850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000202', '03000000-0000-0000-0000-000000000058', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-07-08 09:30:00+01', 37.270000, 9.871850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000203', '03000000-0000-0000-0000-000000000058', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000003', '2025-07-08 10:00:00+01', 37.270000, 9.871850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000204', '03000000-0000-0000-0000-000000000059', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000008', '2025-07-02 04:00:00+01', 36.454100, 10.745550, 'Provider accepted the request.', 'Transport Médicalisé Standard prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000205', '03000000-0000-0000-0000-000000000059', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000008', '2025-07-10 13:28:00+01', 36.443100, 10.739550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000206', '03000000-0000-0000-0000-000000000060', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-07-08 14:00:00+01', 35.665900, 10.094450, 'Provider accepted the request.', 'Consultation Générale prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000207', '03000000-0000-0000-0000-000000000060', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-07-12 07:29:00+01', 35.650900, 10.082450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000208', '03000000-0000-0000-0000-000000000060', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-07-12 08:00:00+01', 35.665900, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000209', '03000000-0000-0000-0000-000000000060', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-07-12 08:45:00+01', 35.665900, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000210', '03000000-0000-0000-0000-000000000061', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-07-10 14:00:00+01', 33.880000, 10.098150, 'Provider accepted the request.', 'Prélèvement Urinaire prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000211', '03000000-0000-0000-0000-000000000061', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-07-15 07:30:00+01', 33.867000, 10.088150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000212', '03000000-0000-0000-0000-000000000061', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-07-15 08:00:00+01', 33.880000, 10.098150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000213', '03000000-0000-0000-0000-000000000061', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-07-15 08:15:00+01', 33.880000, 10.098150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000214', '03000000-0000-0000-0000-000000000062', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-07-12 21:00:00+01', 36.874100, 10.161850, 'Provider accepted the request.', 'Massage Thérapeutique prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000215', '03000000-0000-0000-0000-000000000062', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-07-18 14:31:00+01', 36.863100, 10.153850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000216', '03000000-0000-0000-0000-000000000062', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-07-18 15:00:00+01', 36.874100, 10.161850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000217', '03000000-0000-0000-0000-000000000062', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-07-18 15:45:00+01', 36.874100, 10.161850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000218', '03000000-0000-0000-0000-000000000063', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000013', '2025-07-13 16:00:00+01', 36.745900, 10.225550, 'Provider accepted the request.', 'Contrôle Glycémique prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000219', '03000000-0000-0000-0000-000000000063', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000013', '2025-07-20 09:32:00+01', 36.730900, 10.219550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000220', '03000000-0000-0000-0000-000000000063', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000013', '2025-07-20 10:00:00+01', 36.745900, 10.225550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000221', '03000000-0000-0000-0000-000000000063', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000013', '2025-07-20 10:15:00+01', 36.745900, 10.225550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000222', '03000000-0000-0000-0000-000000000063', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-07-21 11:15:00+01', 36.745900, 10.225550, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000223', '03000000-0000-0000-0000-000000000064', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-07-14 19:00:00+01', 36.400000, 10.604450, 'Provider accepted the request.', 'Location Concentrateur O2 prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000224', '03000000-0000-0000-0000-000000000064', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000009', '2025-07-22 08:25:00+01', 36.387000, 10.592450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000225', '03000000-0000-0000-0000-000000000064', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000009', '2025-07-22 09:00:00+01', 36.400000, 10.604450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000226', '03000000-0000-0000-0000-000000000064', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000009', '2025-07-22 10:00:00+01', 36.400000, 10.604450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000227', '03000000-0000-0000-0000-000000000065', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000015', '2025-07-17 00:30:00+01', 36.894100, 10.318150, 'Provider accepted the request.', 'Électrostimulation prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000228', '03000000-0000-0000-0000-000000000065', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000015', '2025-07-25 13:56:00+01', 36.883100, 10.308150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000229', '03000000-0000-0000-0000-000000000065', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000015', '2025-07-25 14:30:00+01', 36.894100, 10.318150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000230', '03000000-0000-0000-0000-000000000065', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000015', '2025-07-25 15:00:00+01', 36.894100, 10.318150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000231', '03000000-0000-0000-0000-000000000066', 'Pending', 'Cancelled', '11000000-0000-0000-0000-000000000013', '2025-07-28 07:00:00+01', 35.495900, 11.041850, 'Patient requested a schedule change before service start.', 'Slot released for rebooking.'),
  ('23000000-0000-0000-0000-000000000232', '03000000-0000-0000-0000-000000000067', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000004', '2025-07-27 20:00:00+01', 34.430000, 8.785550, 'Provider accepted the request.', 'Soins Post-Partum prepared for Olfa Baccar.'),
  ('23000000-0000-0000-0000-000000000233', '03000000-0000-0000-0000-000000000067', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000004', '2025-08-01 09:28:00+01', 34.417000, 8.779550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000234', '03000000-0000-0000-0000-000000000067', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000004', '2025-08-01 10:00:00+01', 34.430000, 8.785550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000235', '03000000-0000-0000-0000-000000000067', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000004', '2025-08-01 11:00:00+01', 34.430000, 8.785550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000236', '03000000-0000-0000-0000-000000000068', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000010', '2025-07-30 05:00:00+01', 33.874100, 10.854450, 'Provider accepted the request.', 'Soutien Anxiété / Dépression prepared for Hatem Jeridi.'),
  ('23000000-0000-0000-0000-000000000237', '03000000-0000-0000-0000-000000000068', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000010', '2025-08-04 14:29:00+01', 33.863100, 10.842450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000238', '03000000-0000-0000-0000-000000000068', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000010', '2025-08-04 15:00:00+01', 33.874100, 10.854450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000239', '03000000-0000-0000-0000-000000000068', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000010', '2025-08-04 15:50:00+01', 33.874100, 10.854450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000240', '03000000-0000-0000-0000-000000000069', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-07-31 23:00:00+01', 36.815900, 10.098150, 'Provider accepted the request.', 'Soins de Plaie prepared for Wafa Souissi.'),
  ('23000000-0000-0000-0000-000000000241', '03000000-0000-0000-0000-000000000069', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-08-07 08:30:00+01', 36.800900, 10.088150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000242', '03000000-0000-0000-0000-000000000069', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-08-07 09:00:00+01', 36.815900, 10.098150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000243', '03000000-0000-0000-0000-000000000070', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-08-02 22:00:00+01', 36.950000, 8.761850, 'Provider accepted the request.', 'Bilan Sanguin Complet prepared for Nizar Ferchichi.'),
  ('23000000-0000-0000-0000-000000000244', '03000000-0000-0000-0000-000000000070', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-08-10 07:31:00+01', 36.937000, 8.753850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000245', '03000000-0000-0000-0000-000000000070', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-08-10 08:00:00+01', 36.950000, 8.761850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000246', '03000000-0000-0000-0000-000000000070', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-08-10 08:20:00+01', 36.950000, 8.761850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000247', '03000000-0000-0000-0000-000000000071', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000015', '2025-08-04 07:00:00+01', 36.814100, 10.185550, 'Provider accepted the request.', 'Coaching Reprise Mobilite Senior prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000248', '03000000-0000-0000-0000-000000000071', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000015', '2025-08-12 16:32:00+01', 36.803100, 10.179550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000249', '03000000-0000-0000-0000-000000000071', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000015', '2025-08-12 17:00:00+01', 36.814100, 10.185550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000250', '03000000-0000-0000-0000-000000000071', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000015', '2025-08-12 18:00:00+01', 36.814100, 10.185550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000251', '03000000-0000-0000-0000-000000000072', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-08-11 16:30:00+01', 34.735900, 10.754450, 'Provider accepted the request.', 'Kinésithérapie Sportive prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000252', '03000000-0000-0000-0000-000000000072', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000006', '2025-08-15 09:55:00+01', 34.720900, 10.742450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000253', '03000000-0000-0000-0000-000000000072', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000006', '2025-08-15 10:30:00+01', 34.735900, 10.754450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000254', '03000000-0000-0000-0000-000000000072', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000006', '2025-08-15 11:30:00+01', 34.735900, 10.754450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000255', '03000000-0000-0000-0000-000000000073', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000011', '2025-08-13 15:00:00+01', 35.820000, 10.628150, 'Provider accepted the request.', 'Plan Alimentaire Diabète prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000256', '03000000-0000-0000-0000-000000000073', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000011', '2025-08-18 08:26:00+01', 35.807000, 10.618150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000257', '03000000-0000-0000-0000-000000000073', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000011', '2025-08-18 09:00:00+01', 35.820000, 10.628150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000258', '03000000-0000-0000-0000-000000000073', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000011', '2025-08-18 09:50:00+01', 35.820000, 10.628150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000259', '03000000-0000-0000-0000-000000000073', 'Completed', 'Disputed', '11000000-0000-0000-0000-000000000003', '2025-08-19 09:50:00+01', 35.820000, 10.628150, 'Patient opened a post-service dispute.', 'Case routed to support.'),
  ('23000000-0000-0000-0000-000000000260', '03000000-0000-0000-0000-000000000074', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-08-14 22:00:00+01', 35.764100, 10.811850, 'Provider accepted the request.', 'Téléconsultation prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000261', '03000000-0000-0000-0000-000000000074', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-08-20 15:27:00+01', 35.753100, 10.803850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000262', '03000000-0000-0000-0000-000000000074', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-08-20 16:00:00+01', 35.764100, 10.811850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000263', '03000000-0000-0000-0000-000000000074', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-08-20 16:20:00+01', 35.764100, 10.811850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000264', '03000000-0000-0000-0000-000000000075', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000015', '2025-08-15 16:00:00+01', 37.265900, 9.875550, 'Provider accepted the request.', 'Rééducation Dos prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000265', '03000000-0000-0000-0000-000000000075', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000015', '2025-08-22 09:28:00+01', 37.250900, 9.869550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000266', '03000000-0000-0000-0000-000000000075', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000015', '2025-08-22 10:00:00+01', 37.265900, 9.875550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000267', '03000000-0000-0000-0000-000000000075', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000015', '2025-08-22 11:00:00+01', 37.265900, 9.875550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000268', '03000000-0000-0000-0000-000000000075', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-08-23 08:00:00+01', 37.265900, 9.875550, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000269', '03000000-0000-0000-0000-000000000076', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000012', '2025-08-17 21:00:00+01', 36.450000, 10.734450, 'Provider accepted the request.', 'Stimulation Cognitive prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000270', '03000000-0000-0000-0000-000000000076', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000012', '2025-08-25 10:29:00+01', 36.437000, 10.722450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000271', '03000000-0000-0000-0000-000000000076', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000012', '2025-08-25 11:00:00+01', 36.450000, 10.734450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000272', '03000000-0000-0000-0000-000000000076', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000012', '2025-08-25 12:00:00+01', 36.450000, 10.734450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000273', '03000000-0000-0000-0000-000000000077', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-08-19 20:00:00+01', 35.674100, 10.098150, 'Provider accepted the request.', 'Location Fauteuil Roulant prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000274', '03000000-0000-0000-0000-000000000077', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000009', '2025-08-28 09:30:00+01', 35.663100, 10.088150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000275', '03000000-0000-0000-0000-000000000077', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000009', '2025-08-28 10:00:00+01', 35.674100, 10.098150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000276', '03000000-0000-0000-0000-000000000077', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000009', '2025-08-28 11:00:00+01', 35.674100, 10.098150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000277', '03000000-0000-0000-0000-000000000078', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000002', '2025-08-29 20:00:00+01', 33.875900, 10.101850, 'Provider accepted the request.', 'Vaccination à Domicile prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000278', '03000000-0000-0000-0000-000000000078', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000002', '2025-09-02 09:31:00+01', 33.860900, 10.093850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000279', '03000000-0000-0000-0000-000000000078', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000002', '2025-09-02 10:00:00+01', 33.875900, 10.101850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000280', '03000000-0000-0000-0000-000000000078', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000002', '2025-09-02 10:20:00+01', 33.875900, 10.101850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000281', '03000000-0000-0000-0000-000000000079', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000013', '2025-09-01 00:00:00+01', 36.870000, 10.165550, 'Provider accepted the request.', 'Soins Stomie prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000282', '03000000-0000-0000-0000-000000000079', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000013', '2025-09-05 13:32:00+01', 36.857000, 10.159550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000283', '03000000-0000-0000-0000-000000000079', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000013', '2025-09-05 14:00:00+01', 36.870000, 10.165550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000284', '03000000-0000-0000-0000-000000000079', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000013', '2025-09-05 14:40:00+01', 36.870000, 10.165550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000285', '03000000-0000-0000-0000-000000000080', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-09-02 23:00:00+01', 36.754100, 10.214450, 'Provider accepted the request.', 'Rééducation Motrice prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000286', '03000000-0000-0000-0000-000000000080', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-09-08 08:25:00+01', 36.743100, 10.202450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000287', '03000000-0000-0000-0000-000000000080', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-09-08 09:00:00+01', 36.754100, 10.214450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000288', '03000000-0000-0000-0000-000000000080', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000005', '2025-09-08 10:00:00+01', 36.754100, 10.214450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000289', '03000000-0000-0000-0000-000000000081', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-09-04 00:00:00+01', 36.395900, 10.608150, 'Provider accepted the request.', 'Location Concentrateur O2 prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000290', '03000000-0000-0000-0000-000000000081', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000009', '2025-09-10 09:26:00+01', 36.380900, 10.598150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000291', '03000000-0000-0000-0000-000000000081', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000009', '2025-09-10 10:00:00+01', 36.395900, 10.608150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000292', '03000000-0000-0000-0000-000000000081', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000009', '2025-09-10 11:00:00+01', 36.395900, 10.608150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000293', '03000000-0000-0000-0000-000000000082', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-09-04 22:30:00+01', 36.890000, 10.321850, 'Provider accepted the request.', 'ECG + Consultation prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000294', '03000000-0000-0000-0000-000000000083', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-09-06 22:00:00+01', 35.504100, 11.045550, 'Provider accepted the request.', 'Sérologies Virales prepared for Firas Dridi.'),
  ('23000000-0000-0000-0000-000000000295', '03000000-0000-0000-0000-000000000083', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-09-15 07:28:00+01', 35.493100, 11.039550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000296', '03000000-0000-0000-0000-000000000083', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-09-15 08:00:00+01', 35.504100, 11.045550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000297', '03000000-0000-0000-0000-000000000083', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-09-15 08:25:00+01', 35.504100, 11.045550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000298', '03000000-0000-0000-0000-000000000084', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000003', '2025-09-14 16:00:00+01', 34.425900, 8.774450, 'Provider accepted the request.', 'Garde de Nuit prepared for Olfa Baccar.'),
  ('23000000-0000-0000-0000-000000000299', '03000000-0000-0000-0000-000000000084', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000003', '2025-09-18 09:29:00+01', 34.410900, 8.762450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000300', '03000000-0000-0000-0000-000000000084', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000003', '2025-09-18 10:00:00+01', 34.425900, 8.774450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000301', '03000000-0000-0000-0000-000000000084', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000003', '2025-09-18 18:00:00+01', 34.425900, 8.774450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000302', '03000000-0000-0000-0000-000000000085', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-09-15 20:30:00+01', 33.870000, 10.858150, 'Provider accepted the request.', 'Late operational issue reported before service.'),
  ('23000000-0000-0000-0000-000000000303', '03000000-0000-0000-0000-000000000085', 'Confirmed', 'Cancelled', '21000000-0000-0000-0000-000000000006', '2025-09-20 11:30:00+01', 33.870000, 10.858150, 'Provider reported an operational issue before departure.', 'Refund workflow initiated.'),
  ('23000000-0000-0000-0000-000000000304', '03000000-0000-0000-0000-000000000086', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000011', '2025-09-16 21:00:00+01', 36.824100, 10.101850, 'Provider accepted the request.', 'Bilan Nutritionnel prepared for Wafa Souissi.'),
  ('23000000-0000-0000-0000-000000000305', '03000000-0000-0000-0000-000000000086', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000011', '2025-09-22 14:31:00+01', 36.813100, 10.093850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000306', '03000000-0000-0000-0000-000000000086', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000011', '2025-09-22 15:00:00+01', 36.824100, 10.101850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000307', '03000000-0000-0000-0000-000000000086', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000011', '2025-09-22 15:45:00+01', 36.824100, 10.101850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000308', '03000000-0000-0000-0000-000000000087', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000004', '2025-09-18 15:00:00+01', 36.945900, 8.765550, 'Provider accepted the request.', 'Aspiration Bronchique prepared for Nizar Ferchichi.'),
  ('23000000-0000-0000-0000-000000000309', '03000000-0000-0000-0000-000000000087', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000004', '2025-09-25 08:32:00+01', 36.930900, 8.759550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000310', '03000000-0000-0000-0000-000000000087', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000004', '2025-09-25 09:00:00+01', 36.945900, 8.765550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000311', '03000000-0000-0000-0000-000000000087', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000004', '2025-09-25 09:40:00+01', 36.945900, 8.765550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000312', '03000000-0000-0000-0000-000000000088', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000008', '2025-09-20 23:00:00+01', 36.810000, 10.174450, 'Provider accepted the request.', 'Transport Urgence ALS prepared for Lamine Ben Ali.'),
  ('23000000-0000-0000-0000-000000000313', '03000000-0000-0000-0000-000000000088', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000008', '2025-09-28 12:25:00+01', 36.797000, 10.162450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000314', '03000000-0000-0000-0000-000000000088', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000008', '2025-09-28 13:00:00+01', 36.810000, 10.174450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000315', '03000000-0000-0000-0000-000000000088', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000008', '2025-09-28 14:00:00+01', 36.810000, 10.174450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000316', '03000000-0000-0000-0000-000000000089', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000012', '2025-09-23 20:00:00+01', 34.744100, 10.758150, 'Provider accepted the request.', 'Accompagnement Senior prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000317', '03000000-0000-0000-0000-000000000089', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000012', '2025-10-02 09:26:00+01', 34.733100, 10.748150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000318', '03000000-0000-0000-0000-000000000089', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000012', '2025-10-02 10:00:00+01', 34.744100, 10.758150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000319', '03000000-0000-0000-0000-000000000089', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000012', '2025-10-02 14:00:00+01', 34.744100, 10.758150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000320', '03000000-0000-0000-0000-000000000091', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-10-04 00:00:00+01', 35.760000, 10.815550, 'Provider accepted the request.', 'Massage Thérapeutique prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000321', '03000000-0000-0000-0000-000000000091', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000005', '2025-10-08 13:28:00+01', 35.747000, 10.809550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000322', '03000000-0000-0000-0000-000000000091', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000005', '2025-10-08 14:00:00+01', 35.760000, 10.815550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000323', '03000000-0000-0000-0000-000000000092', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000002', '2025-10-05 00:30:00+01', 37.274100, 9.864450, 'Provider accepted the request.', 'Consultation Pédiatrique prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000324', '03000000-0000-0000-0000-000000000092', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000002', '2025-10-10 09:59:00+01', 37.263100, 9.852450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000325', '03000000-0000-0000-0000-000000000092', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000002', '2025-10-10 10:30:00+01', 37.274100, 9.864450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000326', '03000000-0000-0000-0000-000000000092', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000002', '2025-10-10 11:10:00+01', 37.274100, 9.864450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000327', '03000000-0000-0000-0000-000000000093', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000013', '2025-10-05 23:00:00+01', 36.445900, 10.738150, 'Provider accepted the request.', 'Contrôle Glycémique prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000328', '03000000-0000-0000-0000-000000000093', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000013', '2025-10-12 08:30:00+01', 36.430900, 10.728150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000329', '03000000-0000-0000-0000-000000000093', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000013', '2025-10-12 09:00:00+01', 36.445900, 10.738150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000330', '03000000-0000-0000-0000-000000000093', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000013', '2025-10-12 09:15:00+01', 36.445900, 10.738150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000331', '03000000-0000-0000-0000-000000000094', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000001', '2025-10-07 22:00:00+01', 35.670000, 10.101850, 'Provider accepted the request.', 'Consultation Générale prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000332', '03000000-0000-0000-0000-000000000094', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000001', '2025-10-15 07:31:00+01', 35.657000, 10.093850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000333', '03000000-0000-0000-0000-000000000094', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000001', '2025-10-15 08:00:00+01', 35.670000, 10.101850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000334', '03000000-0000-0000-0000-000000000094', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000001', '2025-10-15 08:45:00+01', 35.670000, 10.101850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000335', '03000000-0000-0000-0000-000000000095', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000009', '2025-10-10 00:00:00+01', 33.884100, 10.105550, 'Provider accepted the request.', 'Location Lit Médicalisé prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000336', '03000000-0000-0000-0000-000000000095', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000009', '2025-10-18 09:32:00+01', 33.873100, 10.099550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000337', '03000000-0000-0000-0000-000000000095', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000009', '2025-10-18 10:00:00+01', 33.884100, 10.105550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000338', '03000000-0000-0000-0000-000000000095', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000009', '2025-10-18 11:00:00+01', 33.884100, 10.105550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000339', '03000000-0000-0000-0000-000000000096', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000015', '2025-10-16 17:00:00+01', 36.865900, 10.154450, 'Provider accepted the request.', 'Électrostimulation prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000340', '03000000-0000-0000-0000-000000000096', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000015', '2025-10-20 10:25:00+01', 36.850900, 10.142450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000341', '03000000-0000-0000-0000-000000000096', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000015', '2025-10-20 11:00:00+01', 36.865900, 10.154450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000342', '03000000-0000-0000-0000-000000000096', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000015', '2025-10-20 11:30:00+01', 36.865900, 10.154450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000343', '03000000-0000-0000-0000-000000000097', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000007', '2025-10-17 14:00:00+01', 36.750000, 10.218150, 'Provider accepted the request.', 'Prélèvement Urinaire prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000344', '03000000-0000-0000-0000-000000000097', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000007', '2025-10-22 07:26:00+01', 36.737000, 10.208150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000345', '03000000-0000-0000-0000-000000000097', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000007', '2025-10-22 08:00:00+01', 36.750000, 10.218150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000346', '03000000-0000-0000-0000-000000000097', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000007', '2025-10-22 08:15:00+01', 36.750000, 10.218150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000347', '03000000-0000-0000-0000-000000000097', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-10-23 03:15:00+01', 36.750000, 10.218150, 'Validation completed by patient workflow.', 'Funds eligible for payout release.'),
  ('23000000-0000-0000-0000-000000000348', '03000000-0000-0000-0000-000000000098', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000004', '2025-10-19 16:00:00+01', 36.404100, 10.611850, 'Provider accepted the request.', 'Visite Sage-Femme Post-Partum prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000349', '03000000-0000-0000-0000-000000000098', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000004', '2025-10-25 09:27:00+01', 36.393100, 10.603850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000350', '03000000-0000-0000-0000-000000000098', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000004', '2025-10-25 10:00:00+01', 36.404100, 10.611850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000351', '03000000-0000-0000-0000-000000000098', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000004', '2025-10-25 11:15:00+01', 36.404100, 10.611850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000352', '03000000-0000-0000-0000-000000000099', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000006', '2025-10-21 20:00:00+01', 36.885900, 10.325550, 'Provider accepted the request.', 'Kinésithérapie Sportive prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000353', '03000000-0000-0000-0000-000000000099', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000006', '2025-10-28 13:28:00+01', 36.870900, 10.319550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000354', '03000000-0000-0000-0000-000000000099', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000006', '2025-10-28 14:00:00+01', 36.885900, 10.325550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000355', '03000000-0000-0000-0000-000000000099', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000006', '2025-10-28 15:00:00+01', 36.885900, 10.325550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000356', '03000000-0000-0000-0000-000000000100', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000005', '2025-10-24 19:00:00+01', 35.500000, 11.034450, 'Provider accepted the request.', 'Rééducation Motrice prepared for Firas Dridi.')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 20. CANONICAL FINANCE
-- Replaces legacy transactions, payouts, refunds, and disputes seed data.
-- ==============================================================
-- The booking bulk inserts omit payment_method and cash-wallet columns, so
-- seed the canonical cash finance state explicitly for the finance scenarios.
UPDATE bookings
SET payment_method = 'cash',
    wallet_reserved_amount = 13.50,
    wallet_reserved_at = '2025-06-12 08:45:00+01',
    wallet_reservation_released_at = NULL,
    wallet_settled_at = '2025-06-21 09:10:00+01',
    validated_at = '2025-06-21 09:10:00+01',
    validation_method = 'session_code',
    settlement_completed_at = '2025-06-21 09:10:00+01',
    settlement_completed_by = '9a3f934b-f14d-4c9a-b198-13d2c366cfa1'
WHERE id = '03000000-0000-0000-0000-000000000052';

UPDATE bookings
SET payment_method = 'cash',
    wallet_reserved_amount = 6.60,
    wallet_reserved_at = '2025-09-15 12:45:00+01',
    wallet_reservation_released_at = '2025-09-20 11:30:00+01',
    wallet_settled_at = NULL
WHERE id = '03000000-0000-0000-0000-000000000085';

UPDATE bookings
SET payment_method = 'cash',
    wallet_reserved_amount = 7.20,
    wallet_reserved_at = '2025-10-24 08:15:00+01',
    wallet_reservation_released_at = NULL,
    wallet_settled_at = NULL
WHERE id = '03000000-0000-0000-0000-000000000100';

INSERT INTO provider_wallet_top_ups (id, reference_number, provider_id, initiated_amount, credited_amount, currency, method_type, provider_submitted_reference, evidence_url, status, initiated_at, submitted_at, credited_at, failed_at, cancelled_at, expires_at, expired_at, created_at, updated_at)
VALUES
  ('33300000-0000-0000-0000-000000000001', 'TUP-2025-CREDIT-0001', '12000000-0000-0000-0000-000000000005', 40.00, 40.00, 'TND', 'manual_bank_transfer', 'BT-2025-005-1021', 'https://storage.sanad.tn/topups/tup-0001-proof.jpg', 'credited', '2025-10-20 12:00:00+01', '2025-10-21 14:10:00+01', '2025-10-22 09:30:00+01', NULL, NULL, '2025-10-22 12:00:00+01', NULL, '2025-10-20 12:00:00+01', '2025-10-22 09:30:00+01'),
  ('33300000-0000-0000-0000-000000000002', 'TUP-2026-INIT-0002', '12000000-0000-0000-0000-000000000007', 55.00, NULL, 'TND', 'manual_d17', NULL, NULL, 'expired', '2026-04-27 09:00:00+01', NULL, NULL, NULL, NULL, '2026-04-29 09:00:00+01', '2026-04-29 09:00:00+01', '2026-04-27 09:00:00+01', '2026-04-29 09:00:00+01'),
  ('33300000-0000-0000-0000-000000000003', 'TUP-2026-SUB-0003', '12000000-0000-0000-0000-000000000008', 80.00, NULL, 'TND', 'manual_bank_transfer', 'BT-2026-008-001', 'https://storage.sanad.tn/topups/tup-0003-proof.jpg', 'expired', '2026-04-27 10:00:00+01', '2026-04-28 08:30:00+01', NULL, NULL, NULL, '2026-04-29 10:00:00+01', '2026-04-29 10:00:00+01', '2026-04-27 10:00:00+01', '2026-04-29 10:00:00+01'),
  ('33300000-0000-0000-0000-000000000004', 'TUP-2026-FAIL-0004', '12000000-0000-0000-0000-000000000009', 35.00, NULL, 'TND', 'manual_d17', 'D17-2026-009-FAILED', 'https://storage.sanad.tn/topups/tup-0004-proof.jpg', 'failed', '2026-04-20 09:00:00+01', '2026-04-20 10:30:00+01', NULL, '2026-04-20 16:45:00+01', NULL, '2026-04-22 09:00:00+01', NULL, '2026-04-20 09:00:00+01', '2026-04-20 16:45:00+01'),
  ('33300000-0000-0000-0000-000000000005', 'TUP-2026-CANCEL-0005', '12000000-0000-0000-0000-000000000010', 25.00, NULL, 'TND', 'manual_bank_transfer', NULL, NULL, 'cancelled', '2026-04-24 11:00:00+01', NULL, NULL, NULL, '2026-04-24 18:00:00+01', '2026-04-26 11:00:00+01', NULL, '2026-04-24 11:00:00+01', '2026-04-24 18:00:00+01'),
  ('33300000-0000-0000-0000-000000000006', 'TUP-2026-EXP-0006', '12000000-0000-0000-0000-000000000011', 45.00, NULL, 'TND', 'manual_d17', NULL, NULL, 'expired', '2026-04-23 08:00:00+01', NULL, NULL, NULL, NULL, '2026-04-25 08:00:00+01', '2026-04-25 08:00:00+01', '2026-04-23 08:00:00+01', '2026-04-25 08:00:00+01')
ON CONFLICT DO NOTHING;

INSERT INTO payments (id, reference_number, purpose, method_type, status, amount, currency, booking_id, provider_wallet_top_up_id, created_at, updated_at, settled_at, failed_at, cancelled_at, expired_at)
VALUES
  ('33100000-0000-0000-0000-000000000001', 'PAY-BKG-0100-CASH', 'booking_payment', 'cash', 'reserved', 60.00, 'TND', '03000000-0000-0000-0000-000000000100', NULL, '2025-10-24 08:00:00+01', '2025-10-24 08:15:00+01', NULL, NULL, NULL, NULL),
  ('33100000-0000-0000-0000-000000000002', 'PAY-BKG-0052-CASH', 'booking_payment', 'cash', 'settled', 75.00, 'TND', '03000000-0000-0000-0000-000000000052', NULL, '2025-06-12 08:30:00+01', '2025-06-21 09:10:00+01', '2025-06-21 09:10:00+01', NULL, NULL, NULL),
  ('33100000-0000-0000-0000-000000000003', 'PAY-BKG-0085-CASH', 'booking_payment', 'cash', 'cancelled', 55.00, 'TND', '03000000-0000-0000-0000-000000000085', NULL, '2025-09-15 12:30:00+01', '2025-09-20 11:30:00+01', NULL, NULL, '2025-09-20 11:30:00+01', NULL),
  ('33100000-0000-0000-0000-000000000004', 'PAY-TUP-0001', 'wallet_top_up', 'manual_bank_transfer', 'settled', 40.00, 'TND', NULL, '33300000-0000-0000-0000-000000000001', '2025-10-20 12:00:00+01', '2025-10-22 09:30:00+01', '2025-10-22 09:30:00+01', NULL, NULL, NULL),
  ('33100000-0000-0000-0000-000000000005', 'PAY-TUP-0002', 'wallet_top_up', 'manual_d17', 'expired', 55.00, 'TND', NULL, '33300000-0000-0000-0000-000000000002', '2026-04-27 09:00:00+01', '2026-04-29 09:00:00+01', NULL, NULL, NULL, '2026-04-29 09:00:00+01'),
  ('33100000-0000-0000-0000-000000000006', 'PAY-TUP-0003', 'wallet_top_up', 'manual_bank_transfer', 'expired', 80.00, 'TND', NULL, '33300000-0000-0000-0000-000000000003', '2026-04-27 10:00:00+01', '2026-04-29 10:00:00+01', NULL, NULL, NULL, '2026-04-29 10:00:00+01'),
  ('33100000-0000-0000-0000-000000000007', 'PAY-TUP-0004', 'wallet_top_up', 'manual_d17', 'failed', 35.00, 'TND', NULL, '33300000-0000-0000-0000-000000000004', '2026-04-20 09:00:00+01', '2026-04-20 16:45:00+01', NULL, '2026-04-20 16:45:00+01', NULL, NULL),
  ('33100000-0000-0000-0000-000000000008', 'PAY-TUP-0005', 'wallet_top_up', 'manual_bank_transfer', 'cancelled', 25.00, 'TND', NULL, '33300000-0000-0000-0000-000000000005', '2026-04-24 11:00:00+01', '2026-04-24 18:00:00+01', NULL, NULL, '2026-04-24 18:00:00+01', NULL),
  ('33100000-0000-0000-0000-000000000009', 'PAY-TUP-0006', 'wallet_top_up', 'manual_d17', 'expired', 45.00, 'TND', NULL, '33300000-0000-0000-0000-000000000006', '2026-04-23 08:00:00+01', '2026-04-25 08:00:00+01', NULL, NULL, NULL, '2026-04-25 08:00:00+01')
ON CONFLICT DO NOTHING;

INSERT INTO payment_attempts (id, payment_id, attempt_number, method_type, status, amount, currency, provider_code, external_reference, manual_reference, safe_metadata_json, gateway_response, fraud_flags, is_flagged, held_at, captured_at, released_at, idempotency_key, created_at, updated_at)
VALUES
  ('33200000-0000-0000-0000-000000000001', '33100000-0000-0000-0000-000000000001', 1, 'cash', 'succeeded', 60.00, 'TND', 'provider_wallet', 'BK-2025-0100', 'cash-wallet-reserve', '{"bookingNumber":"BK-2025-0100","scenario":"cash_reserved"}'::jsonb, NULL, ARRAY[]::text[], false, '2025-10-24 08:15:00+01', NULL, NULL, 'booking-payment:03000000-0000-0000-0000-000000000100', '2025-10-24 08:00:00+01', '2025-10-24 08:15:00+01'),
  ('33200000-0000-0000-0000-000000000002', '33100000-0000-0000-0000-000000000002', 1, 'cash', 'succeeded', 75.00, 'TND', 'provider_wallet', 'BK-2025-0052', 'cash-wallet-settle', '{"bookingNumber":"BK-2025-0052","scenario":"cash_settled"}'::jsonb, NULL, ARRAY[]::text[], false, '2025-06-12 08:45:00+01', '2025-06-21 09:10:00+01', NULL, 'booking-payment:03000000-0000-0000-0000-000000000052', '2025-06-12 08:30:00+01', '2025-06-21 09:10:00+01'),
  ('33200000-0000-0000-0000-000000000003', '33100000-0000-0000-0000-000000000003', 1, 'cash', 'cancelled', 55.00, 'TND', 'provider_wallet', 'BK-2025-0085', 'cash-wallet-release', '{"bookingNumber":"BK-2025-0085","scenario":"cash_cancelled_release"}'::jsonb, NULL, ARRAY[]::text[], false, '2025-09-15 12:45:00+01', NULL, '2025-09-20 11:30:00+01', 'booking-payment:03000000-0000-0000-0000-000000000085', '2025-09-15 12:30:00+01', '2025-09-20 11:30:00+01'),
  ('33200000-0000-0000-0000-000000000004', '33100000-0000-0000-0000-000000000004', 1, 'manual_bank_transfer', 'succeeded', 40.00, 'TND', 'provider_wallet_top_up', 'TUP-2025-CREDIT-0001', 'BT-2025-005-1021', '{"evidenceUrl":"https://storage.sanad.tn/topups/tup-0001-proof.jpg"}'::jsonb, '{"status":"credited","channel":"manual_bank_transfer"}'::jsonb, ARRAY[]::text[], false, NULL, NULL, NULL, 'topup-payment:33300000-0000-0000-0000-000000000001', '2025-10-20 12:00:00+01', '2025-10-22 09:30:00+01'),
  ('33200000-0000-0000-0000-000000000005', '33100000-0000-0000-0000-000000000005', 1, 'manual_d17', 'expired', 55.00, 'TND', 'provider_wallet_top_up', 'TUP-2026-INIT-0002', NULL, '{"channel":"d17"}'::jsonb, '{"status":"expired","reason":"transfer_not_submitted"}'::jsonb, ARRAY[]::text[], false, NULL, NULL, NULL, 'topup-payment:33300000-0000-0000-0000-000000000002', '2026-04-27 09:00:00+01', '2026-04-29 09:00:00+01'),
  ('33200000-0000-0000-0000-000000000006', '33100000-0000-0000-0000-000000000006', 1, 'manual_bank_transfer', 'expired', 80.00, 'TND', 'provider_wallet_top_up', 'TUP-2026-SUB-0003', 'BT-2026-008-001', '{"evidenceUrl":"https://storage.sanad.tn/topups/tup-0003-proof.jpg"}'::jsonb, '{"status":"expired","channel":"manual_bank_transfer","reason":"not_credited_before_expiry"}'::jsonb, ARRAY[]::text[], false, NULL, NULL, NULL, 'topup-payment:33300000-0000-0000-0000-000000000003', '2026-04-27 10:00:00+01', '2026-04-29 10:00:00+01'),
  ('33200000-0000-0000-0000-000000000007', '33100000-0000-0000-0000-000000000007', 1, 'manual_d17', 'failed', 35.00, 'TND', 'provider_wallet_top_up', 'TUP-2026-FAIL-0004', 'D17-2026-009-FAILED', '{"evidenceUrl":"https://storage.sanad.tn/topups/tup-0004-proof.jpg"}'::jsonb, '{"status":"failed","reason":"proof_rejected"}'::jsonb, ARRAY[]::text[], false, NULL, NULL, NULL, 'topup-payment:33300000-0000-0000-0000-000000000004', '2026-04-20 09:00:00+01', '2026-04-20 16:45:00+01'),
  ('33200000-0000-0000-0000-000000000008', '33100000-0000-0000-0000-000000000008', 1, 'manual_bank_transfer', 'cancelled', 25.00, 'TND', 'provider_wallet_top_up', 'TUP-2026-CANCEL-0005', NULL, '{"channel":"bank_transfer"}'::jsonb, '{"status":"cancelled"}'::jsonb, ARRAY[]::text[], false, NULL, NULL, NULL, 'topup-payment:33300000-0000-0000-0000-000000000005', '2026-04-24 11:00:00+01', '2026-04-24 18:00:00+01'),
  ('33200000-0000-0000-0000-000000000009', '33100000-0000-0000-0000-000000000009', 1, 'manual_d17', 'expired', 45.00, 'TND', 'provider_wallet_top_up', 'TUP-2026-EXP-0006', NULL, '{"channel":"d17"}'::jsonb, '{"status":"expired"}'::jsonb, ARRAY[]::text[], false, NULL, NULL, NULL, 'topup-payment:33300000-0000-0000-0000-000000000006', '2026-04-23 08:00:00+01', '2026-04-25 08:00:00+01')
ON CONFLICT DO NOTHING;

INSERT INTO ledger_transactions (id, reference_number, type, status, description, source_type, source_id, currency, occurred_at, created_at, created_by_user_id, idempotency_key)
VALUES
  ('33400000-0000-0000-0000-000000000001', 'LED-ADJ-0001', 'wallet_adjustment', 'posted', 'Manual wallet adjustment credited before cash booking validation seed.', 'manual_adjustment', '33700000-0000-0000-0000-000000000001', 'TND', '2025-06-11 12:00:00+01', '2025-06-11 12:00:00+01', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'manual_adjustment:33700000-0000-0000-0000-000000000001:wallet_adjustment'),
  ('33400000-0000-0000-0000-000000000002', 'LED-BK-0052-RESERVE', 'cash_booking_fee_reserved', 'posted', 'Reserved platform-fee wallet exposure for cash booking BK-2025-0052.', 'booking', '03000000-0000-0000-0000-000000000052', 'TND', '2025-06-12 08:45:00+01', '2025-06-12 08:45:00+01', NULL, 'booking:03000000-0000-0000-0000-000000000052:cash_booking_fee_reserved'),
  ('33400000-0000-0000-0000-000000000003', 'LED-BK-0052-SETTLE', 'cash_booking_fee_settled', 'posted', 'Settled platform-fee wallet exposure for validated cash booking BK-2025-0052.', 'booking', '03000000-0000-0000-0000-000000000052', 'TND', '2025-06-21 09:10:00+01', '2025-06-21 09:10:00+01', NULL, 'booking:03000000-0000-0000-0000-000000000052:cash_booking_fee_settled'),
  ('33400000-0000-0000-0000-000000000004', 'LED-ADJ-0002', 'wallet_adjustment', 'posted', 'Manual wallet adjustment credited before cash booking cancellation seed.', 'manual_adjustment', '33700000-0000-0000-0000-000000000002', 'TND', '2025-09-14 09:00:00+01', '2025-09-14 09:00:00+01', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'manual_adjustment:33700000-0000-0000-0000-000000000002:wallet_adjustment'),
  ('33400000-0000-0000-0000-000000000005', 'LED-BK-0085-RESERVE', 'cash_booking_fee_reserved', 'posted', 'Reserved platform-fee wallet exposure for cash booking BK-2025-0085.', 'booking', '03000000-0000-0000-0000-000000000085', 'TND', '2025-09-15 12:45:00+01', '2025-09-15 12:45:00+01', NULL, 'booking:03000000-0000-0000-0000-000000000085:cash_booking_fee_reserved'),
  ('33400000-0000-0000-0000-000000000006', 'LED-BK-0085-RELEASE', 'cash_booking_fee_released', 'posted', 'Released platform-fee wallet reservation for cancelled cash booking BK-2025-0085.', 'booking', '03000000-0000-0000-0000-000000000085', 'TND', '2025-09-20 11:30:00+01', '2025-09-20 11:30:00+01', NULL, 'booking:03000000-0000-0000-0000-000000000085:cash_booking_fee_released'),
  ('33400000-0000-0000-0000-000000000007', 'LED-TUP-0001-CREDIT', 'wallet_top_up_credited', 'posted', 'Credited provider wallet top-up TUP-2025-CREDIT-0001.', 'provider_wallet_top_up', '33300000-0000-0000-0000-000000000001', 'TND', '2025-10-22 09:30:00+01', '2025-10-22 09:30:00+01', '21000000-0000-0000-0000-000000000005', 'provider_wallet_top_up:33300000-0000-0000-0000-000000000001:wallet_top_up_credited'),
  ('33400000-0000-0000-0000-000000000008', 'LED-BK-0100-RESERVE', 'cash_booking_fee_reserved', 'posted', 'Reserved platform-fee wallet exposure for cash booking BK-2025-0100.', 'booking', '03000000-0000-0000-0000-000000000100', 'TND', '2025-10-24 08:15:00+01', '2025-10-24 08:15:00+01', NULL, 'booking:03000000-0000-0000-0000-000000000100:cash_booking_fee_reserved')
ON CONFLICT DO NOTHING;

INSERT INTO ledger_entries (id, ledger_transaction_id, account_code, provider_id, booking_id, payment_id, provider_wallet_top_up_id, amount, signed_amount, currency, created_at)
VALUES
  ('33500000-0000-0000-0000-000000000001', '33400000-0000-0000-0000-000000000001', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000002', NULL, NULL, NULL, 50.00, 50.00, 'TND', '2025-06-11 12:00:00+01'),
  ('33500000-0000-0000-0000-000000000002', '33400000-0000-0000-0000-000000000001', 'AdjustmentSuspense', NULL, NULL, NULL, NULL, 50.00, -50.00, 'TND', '2025-06-11 12:00:00+01'),
  ('33500000-0000-0000-0000-000000000003', '33400000-0000-0000-0000-000000000002', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000052', '33100000-0000-0000-0000-000000000002', NULL, 13.50, -13.50, 'TND', '2025-06-12 08:45:00+01'),
  ('33500000-0000-0000-0000-000000000004', '33400000-0000-0000-0000-000000000002', 'ProviderWalletReserved', '12000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000052', '33100000-0000-0000-0000-000000000002', NULL, 13.50, 13.50, 'TND', '2025-06-12 08:45:00+01'),
  ('33500000-0000-0000-0000-000000000005', '33400000-0000-0000-0000-000000000003', 'ProviderWalletReserved', '12000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000052', '33100000-0000-0000-0000-000000000002', NULL, 13.50, -13.50, 'TND', '2025-06-21 09:10:00+01'),
  ('33500000-0000-0000-0000-000000000006', '33400000-0000-0000-0000-000000000003', 'PlatformRevenue', '12000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000052', '33100000-0000-0000-0000-000000000002', NULL, 13.50, 13.50, 'TND', '2025-06-21 09:10:00+01'),
  ('33500000-0000-0000-0000-000000000007', '33400000-0000-0000-0000-000000000004', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000006', NULL, NULL, NULL, 30.00, 30.00, 'TND', '2025-09-14 09:00:00+01'),
  ('33500000-0000-0000-0000-000000000008', '33400000-0000-0000-0000-000000000004', 'AdjustmentSuspense', NULL, NULL, NULL, NULL, 30.00, -30.00, 'TND', '2025-09-14 09:00:00+01'),
  ('33500000-0000-0000-0000-000000000009', '33400000-0000-0000-0000-000000000005', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000085', '33100000-0000-0000-0000-000000000003', NULL, 6.60, -6.60, 'TND', '2025-09-15 12:45:00+01'),
  ('33500000-0000-0000-0000-000000000010', '33400000-0000-0000-0000-000000000005', 'ProviderWalletReserved', '12000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000085', '33100000-0000-0000-0000-000000000003', NULL, 6.60, 6.60, 'TND', '2025-09-15 12:45:00+01'),
  ('33500000-0000-0000-0000-000000000011', '33400000-0000-0000-0000-000000000006', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000085', '33100000-0000-0000-0000-000000000003', NULL, 6.60, 6.60, 'TND', '2025-09-20 11:30:00+01'),
  ('33500000-0000-0000-0000-000000000012', '33400000-0000-0000-0000-000000000006', 'ProviderWalletReserved', '12000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000085', '33100000-0000-0000-0000-000000000003', NULL, 6.60, -6.60, 'TND', '2025-09-20 11:30:00+01'),
  ('33500000-0000-0000-0000-000000000013', '33400000-0000-0000-0000-000000000007', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000005', NULL, '33100000-0000-0000-0000-000000000004', '33300000-0000-0000-0000-000000000001', 40.00, 40.00, 'TND', '2025-10-22 09:30:00+01'),
  ('33500000-0000-0000-0000-000000000014', '33400000-0000-0000-0000-000000000008', 'ProviderWalletAvailable', '12000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000100', '33100000-0000-0000-0000-000000000001', NULL, 7.20, -7.20, 'TND', '2025-10-24 08:15:00+01'),
  ('33500000-0000-0000-0000-000000000015', '33400000-0000-0000-0000-000000000008', 'ProviderWalletReserved', '12000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000100', '33100000-0000-0000-0000-000000000001', NULL, 7.20, 7.20, 'TND', '2025-10-24 08:15:00+01')
ON CONFLICT DO NOTHING;

INSERT INTO wallets (id, provider_id, available_balance, reserved_balance, usable_balance, currency, last_rebuilt_at, created_at, updated_at)
VALUES
  ('33600000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000002', 36.50, 0.00, 36.50, 'TND', '2025-06-21 09:15:00+01', '2025-06-11 12:00:00+01', '2025-06-21 09:15:00+01'),
  ('33600000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000005', 32.80, 7.20, 32.80, 'TND', '2025-10-24 08:20:00+01', '2025-10-20 12:00:00+01', '2025-10-24 08:20:00+01'),
  ('33600000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000006', 30.00, 0.00, 30.00, 'TND', '2025-09-20 11:35:00+01', '2025-09-14 09:00:00+01', '2025-09-20 11:35:00+01'),
  ('33600000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000007', 0.00, 0.00, 0.00, 'TND', NULL, '2026-04-27 09:00:00+01', '2026-04-27 09:00:00+01'),
  ('33600000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000008', 0.00, 0.00, 0.00, 'TND', NULL, '2026-04-27 10:00:00+01', '2026-04-28 08:30:00+01'),
  ('33600000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000009', 0.00, 0.00, 0.00, 'TND', NULL, '2026-04-20 09:00:00+01', '2026-04-20 16:45:00+01'),
  ('33600000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000010', 0.00, 0.00, 0.00, 'TND', NULL, '2026-04-24 11:00:00+01', '2026-04-24 18:00:00+01'),
  ('33600000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000011', 0.00, 0.00, 0.00, 'TND', NULL, '2026-04-23 08:00:00+01', '2026-04-25 08:00:00+01')
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 22. CONVERSATIONS
-- ==============================================================
INSERT INTO conversations (id, patient_id, provider_id, is_active, last_message_at, patient_unread_count, provider_unread_count, created_at, updated_at, last_message_preview, last_message_by)
VALUES
  ('14000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', '21000000-0000-0000-0000-000000000001'),
  ('14000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', true, CURRENT_TIMESTAMP, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour, le service était excellent. Merci beaucoup.', '11000000-0000-0000-0000-000000000002'),
  ('14000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000005', true, CURRENT_TIMESTAMP, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Parfait, merci. Faut-il préparer quelque chose ?', '11000000-0000-0000-0000-000000000003'),
  ('14000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000003', true, CURRENT_TIMESTAMP, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Noté, je passerai à 8h. Bonne soirée.', '21000000-0000-0000-0000-000000000003'),
  ('14000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000007', true, CURRENT_TIMESTAMP, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Merci pour l''information. À quelle heure arriverez-vous ?', '11000000-0000-0000-0000-000000000004'),
  ('14000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', '21000000-0000-0000-0000-000000000001'),
  ('14000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour, le service était excellent. Merci beaucoup.', '11000000-0000-0000-0000-000000000005'),
  ('14000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000003', true, CURRENT_TIMESTAMP, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Merci pour l''information. À quelle heure arriverez-vous ?', '11000000-0000-0000-0000-000000000006'),
  ('14000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000005', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', '21000000-0000-0000-0000-000000000005'),
  ('14000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000007', true, CURRENT_TIMESTAMP, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', '21000000-0000-0000-0000-000000000007'),
  ('14000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000002', true, CURRENT_TIMESTAMP, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Est-ce que vous êtes disponible plus tôt le matin ?', '11000000-0000-0000-0000-000000000001'),
  ('14000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000006', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Noté, je passerai à 8h. Bonne soirée.', '21000000-0000-0000-0000-000000000006'),
  ('14000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000004', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Comment se préparer pour l''analyse de sang ?', '11000000-0000-0000-0000-000000000008'),
  ('14000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000008', true, CURRENT_TIMESTAMP, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', '21000000-0000-0000-0000-000000000008'),
  ('14000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000002', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Est-ce que vous êtes disponible plus tôt le matin ?', '11000000-0000-0000-0000-000000000010'),
  ('14000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000005', true, CURRENT_TIMESTAMP, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Noté, je passerai à 8h. Bonne soirée.', '21000000-0000-0000-0000-000000000005'),
  ('14000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000007', true, CURRENT_TIMESTAMP, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Parfait, merci. Faut-il préparer quelque chose ?', '11000000-0000-0000-0000-000000000002'),
  ('14000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000010', true, CURRENT_TIMESTAMP, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Est-ce que vous êtes disponible plus tôt le matin ?', '11000000-0000-0000-0000-000000000004'),
  ('14000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000011', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Super, 8h ce serait parfait. Merci !', '11000000-0000-0000-0000-000000000005'),
  ('14000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', '21000000-0000-0000-0000-000000000001'),
  ('14000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000012', true, CURRENT_TIMESTAMP, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Noté, je passerai à 8h. Bonne soirée.', '21000000-0000-0000-0000-000000000012'),
  ('14000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000014', true, CURRENT_TIMESTAMP, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', '21000000-0000-0000-0000-000000000014'),
  ('14000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000004', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Merci pour l''information. À quelle heure arriverez-vous ?', '11000000-0000-0000-0000-000000000001'),
  ('14000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000009', true, CURRENT_TIMESTAMP, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', '21000000-0000-0000-0000-000000000009'),
  ('14000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000001', true, CURRENT_TIMESTAMP, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Oui, je peux venir dès 8h si vous préférez.', '21000000-0000-0000-0000-000000000001'),
  ('14000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000007', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Comment se préparer pour l''analyse de sang ?', '11000000-0000-0000-0000-000000000006'),
  ('14000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000002', true, CURRENT_TIMESTAMP, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Est-ce que vous êtes disponible plus tôt le matin ?', '11000000-0000-0000-0000-000000000007'),
  ('14000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000005', true, CURRENT_TIMESTAMP, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Super, 8h ce serait parfait. Merci !', '11000000-0000-0000-0000-000000000008'),
  ('14000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000004', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Super, 8h ce serait parfait. Merci !', '11000000-0000-0000-0000-000000000009'),
  ('14000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000006', true, CURRENT_TIMESTAMP, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', '11000000-0000-0000-0000-000000000010'),
  ('14000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000010', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', '21000000-0000-0000-0000-000000000010'),
  ('14000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000011', true, CURRENT_TIMESTAMP, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', '21000000-0000-0000-0000-000000000011'),
  ('14000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000003', true, CURRENT_TIMESTAMP, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour, le service était excellent. Merci beaucoup.', '11000000-0000-0000-0000-000000000012'),
  ('14000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000008', true, CURRENT_TIMESTAMP, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Est-ce que vous êtes disponible plus tôt le matin ?', '11000000-0000-0000-0000-000000000013'),
  ('14000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000015', true, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Bonjour, le service était excellent. Merci beaucoup.', '11000000-0000-0000-0000-000000000014')
ON CONFLICT DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_id, message_type, content, is_read, created_at, attachment_mime_type, attachment_name, latitude, longitude)
VALUES
  ('24000000-0000-0000-0000-000000000001', '14000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000002', '14000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000003', '14000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000004', '14000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'text', 'Noté, je passerai à 8h. Bonne soirée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000005', '14000000-0000-0000-0000-000000000001', '21000000-0000-0000-0000-000000000001', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000006', '14000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000007', '14000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000008', '14000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000009', '14000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000010', '14000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000011', '14000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000012', '14000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000013', '14000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000003', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000014', '14000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000003', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000015', '14000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000003', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000016', '14000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000003', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000017', '14000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000003', 'text', 'Noté, je passerai à 8h. Bonne soirée.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000018', '14000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000004', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000019', '14000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000004', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000020', '14000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000004', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000021', '14000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000004', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000022', '14000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000004', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000023', '14000000-0000-0000-0000-000000000006', '21000000-0000-0000-0000-000000000001', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000024', '14000000-0000-0000-0000-000000000006', '21000000-0000-0000-0000-000000000001', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000025', '14000000-0000-0000-0000-000000000006', '21000000-0000-0000-0000-000000000001', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000026', '14000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000005', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000027', '14000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000005', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000028', '14000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000005', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000029', '14000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000005', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000030', '14000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000005', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000031', '14000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000005', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000032', '14000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000006', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000033', '14000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000006', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000034', '14000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000006', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000035', '14000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000006', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000036', '14000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000006', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000037', '14000000-0000-0000-0000-000000000009', '21000000-0000-0000-0000-000000000005', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000038', '14000000-0000-0000-0000-000000000009', '21000000-0000-0000-0000-000000000005', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000039', '14000000-0000-0000-0000-000000000010', '21000000-0000-0000-0000-000000000007', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000040', '14000000-0000-0000-0000-000000000010', '21000000-0000-0000-0000-000000000007', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000041', '14000000-0000-0000-0000-000000000010', '21000000-0000-0000-0000-000000000007', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000042', '14000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000001', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000043', '14000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000001', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000044', '14000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000001', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000045', '14000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000006', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000046', '14000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000006', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000047', '14000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000006', 'text', 'Noté, je passerai à 8h. Bonne soirée.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000048', '14000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000008', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000049', '14000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000008', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000050', '14000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000008', 'text', 'Comment se préparer pour l''analyse de sang ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000051', '14000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000008', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000052', '14000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000008', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000053', '14000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000008', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000054', '14000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000008', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000055', '14000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000008', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000056', '14000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000010', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000057', '14000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000010', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000058', '14000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000010', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000059', '14000000-0000-0000-0000-000000000016', '21000000-0000-0000-0000-000000000005', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000060', '14000000-0000-0000-0000-000000000016', '21000000-0000-0000-0000-000000000005', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000061', '14000000-0000-0000-0000-000000000016', '21000000-0000-0000-0000-000000000005', 'text', 'Noté, je passerai à 8h. Bonne soirée.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000062', '14000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000002', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000063', '14000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000002', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000064', '14000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000002', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000065', '14000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000002', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000066', '14000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000002', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000067', '14000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000002', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000068', '14000000-0000-0000-0000-000000000018', '11000000-0000-0000-0000-000000000004', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000069', '14000000-0000-0000-0000-000000000018', '11000000-0000-0000-0000-000000000004', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000070', '14000000-0000-0000-0000-000000000018', '11000000-0000-0000-0000-000000000004', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000071', '14000000-0000-0000-0000-000000000018', '11000000-0000-0000-0000-000000000004', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000072', '14000000-0000-0000-0000-000000000019', '11000000-0000-0000-0000-000000000005', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000073', '14000000-0000-0000-0000-000000000019', '11000000-0000-0000-0000-000000000005', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000074', '14000000-0000-0000-0000-000000000019', '11000000-0000-0000-0000-000000000005', 'text', 'Super, 8h ce serait parfait. Merci !', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000075', '14000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000076', '14000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'text', 'Noté, je passerai à 8h. Bonne soirée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000077', '14000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000078', '14000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000079', '14000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000080', '14000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000081', '14000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000012', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000082', '14000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000012', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000083', '14000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000012', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000084', '14000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000012', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000085', '14000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000012', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000086', '14000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000012', 'text', 'Noté, je passerai à 8h. Bonne soirée.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000087', '14000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000014', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000088', '14000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000014', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000089', '14000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000014', 'text', 'Noté, je passerai à 8h. Bonne soirée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000090', '14000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000014', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000091', '14000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000014', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000092', '14000000-0000-0000-0000-000000000023', '11000000-0000-0000-0000-000000000001', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000093', '14000000-0000-0000-0000-000000000023', '11000000-0000-0000-0000-000000000001', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000094', '14000000-0000-0000-0000-000000000023', '11000000-0000-0000-0000-000000000001', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000095', '14000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000009', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000096', '14000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000009', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000097', '14000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000009', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000098', '14000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000009', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000099', '14000000-0000-0000-0000-000000000025', '21000000-0000-0000-0000-000000000001', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000100', '14000000-0000-0000-0000-000000000025', '21000000-0000-0000-0000-000000000001', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000101', '14000000-0000-0000-0000-000000000025', '21000000-0000-0000-0000-000000000001', 'text', 'Oui, je peux venir dès 8h si vous préférez.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000102', '14000000-0000-0000-0000-000000000026', '11000000-0000-0000-0000-000000000006', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000103', '14000000-0000-0000-0000-000000000026', '11000000-0000-0000-0000-000000000006', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000104', '14000000-0000-0000-0000-000000000026', '11000000-0000-0000-0000-000000000006', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000105', '14000000-0000-0000-0000-000000000026', '11000000-0000-0000-0000-000000000006', 'text', 'Comment se préparer pour l''analyse de sang ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000106', '14000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000007', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000107', '14000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000007', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000108', '14000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000007', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000109', '14000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000007', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000110', '14000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000007', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000111', '14000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000007', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000112', '14000000-0000-0000-0000-000000000028', '11000000-0000-0000-0000-000000000008', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000113', '14000000-0000-0000-0000-000000000028', '11000000-0000-0000-0000-000000000008', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000114', '14000000-0000-0000-0000-000000000028', '11000000-0000-0000-0000-000000000008', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000115', '14000000-0000-0000-0000-000000000028', '11000000-0000-0000-0000-000000000008', 'text', 'Super, 8h ce serait parfait. Merci !', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000116', '14000000-0000-0000-0000-000000000029', '11000000-0000-0000-0000-000000000009', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000117', '14000000-0000-0000-0000-000000000029', '11000000-0000-0000-0000-000000000009', 'text', 'Super, 8h ce serait parfait. Merci !', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000118', '14000000-0000-0000-0000-000000000030', '11000000-0000-0000-0000-000000000010', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000119', '14000000-0000-0000-0000-000000000030', '11000000-0000-0000-0000-000000000010', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000120', '14000000-0000-0000-0000-000000000030', '11000000-0000-0000-0000-000000000010', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000121', '14000000-0000-0000-0000-000000000030', '11000000-0000-0000-0000-000000000010', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000122', '14000000-0000-0000-0000-000000000030', '11000000-0000-0000-0000-000000000010', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000123', '14000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000010', 'text', 'Restez à jeun 8 heures avant le prélèvement. Eau autorisée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000124', '14000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000010', 'text', 'Je serai chez vous vers 7h30. Avez-vous un historique médical à partager ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000125', '14000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000010', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000126', '14000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000010', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000127', '14000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000011', 'text', 'Bonjour ! Oui, je serai là à l''heure prévue. À demain !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000128', '14000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000011', 'text', 'Non, tout est prêt de mon côté. Préparez juste vos documents médicaux.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000129', '14000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000011', 'text', 'Oui, je peux venir dès 8h si vous préférez.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000130', '14000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000011', 'text', 'Noté, je passerai à 8h. Bonne soirée.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000131', '14000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000011', 'text', 'Merci à vous pour votre confiance. N''hésitez pas à rappeler si besoin.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000132', '14000000-0000-0000-0000-000000000033', '11000000-0000-0000-0000-000000000012', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000133', '14000000-0000-0000-0000-000000000033', '11000000-0000-0000-0000-000000000012', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000134', '14000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000013', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000135', '14000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000013', 'text', 'Comment se préparer pour l''analyse de sang ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000136', '14000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000013', 'text', 'Merci pour l''information. À quelle heure arriverez-vous ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000137', '14000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000013', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000138', '14000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000013', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000139', '14000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000013', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', false, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000140', '14000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000014', 'text', 'Bonjour, je voudrais confirmer mon rendez-vous pour demain.', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000141', '14000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000014', 'text', 'Parfait, merci. Faut-il préparer quelque chose ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000142', '14000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000014', 'text', 'Est-ce que vous êtes disponible plus tôt le matin ?', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000143', '14000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000014', 'text', 'Super, 8h ce serait parfait. Merci !', true, CURRENT_TIMESTAMP, '', '', NULL, NULL),
  ('24000000-0000-0000-0000-000000000144', '14000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000014', 'text', 'Bonjour, le service était excellent. Merci beaucoup.', false, CURRENT_TIMESTAMP, '', '', NULL, NULL)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 23. NOTIFICATIONS
-- ==============================================================
INSERT INTO notifications (id, user_id, type, title, message, booking_id, is_read, sent_via_push, sent_via_email, created_at, sent_via_sms)
VALUES
  ('34000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0001.', '03000000-0000-0000-0000-000000000001', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0001 reçue.', '03000000-0000-0000-0000-000000000001', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000002', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0002 est terminée.', '03000000-0000-0000-0000-000000000002', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000004', '21000000-0000-0000-0000-000000000003', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0002 reçue.', '03000000-0000-0000-0000-000000000002', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000003', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0003 a été traité.', '03000000-0000-0000-0000-000000000003', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000006', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0003 reçue.', '03000000-0000-0000-0000-000000000003', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000004', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0005.', '03000000-0000-0000-0000-000000000005', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000008', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0005 reçue.', '03000000-0000-0000-0000-000000000005', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000002', 'booking_cancelled', 'Reservation annulee', 'Votre reservation BK-2025-0006 a ete annulee suite a un probleme operationnel du prestataire.', '03000000-0000-0000-0000-000000000006', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000010', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0006 reçue.', '03000000-0000-0000-0000-000000000006', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000005', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0007 a été confirmée.', '03000000-0000-0000-0000-000000000007', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0007 reçue.', '03000000-0000-0000-0000-000000000007', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000006', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0008.', '03000000-0000-0000-0000-000000000008', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000014', '21000000-0000-0000-0000-000000000003', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0008 reçue.', '03000000-0000-0000-0000-000000000008', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000006', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0009 est terminée.', '03000000-0000-0000-0000-000000000009', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000016', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0009 reçue.', '03000000-0000-0000-0000-000000000009', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000007', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0010 a été traité.', '03000000-0000-0000-0000-000000000010', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000018', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0010 reçue.', '03000000-0000-0000-0000-000000000010', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000019', '11000000-0000-0000-0000-000000000001', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0011 est terminée.', '03000000-0000-0000-0000-000000000011', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0011 reçue.', '03000000-0000-0000-0000-000000000011', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000021', '11000000-0000-0000-0000-000000000003', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0012.', '03000000-0000-0000-0000-000000000012', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000006', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0012 reçue.', '03000000-0000-0000-0000-000000000012', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000023', '11000000-0000-0000-0000-000000000008', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000013', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000004', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0013 reçue.', '03000000-0000-0000-0000-000000000013', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000025', '11000000-0000-0000-0000-000000000009', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0014 a été confirmée.', '03000000-0000-0000-0000-000000000014', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000026', '21000000-0000-0000-0000-000000000008', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0014 reçue.', '03000000-0000-0000-0000-000000000014', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000010', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0015.', '03000000-0000-0000-0000-000000000015', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000028', '21000000-0000-0000-0000-000000000002', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0015 reçue.', '03000000-0000-0000-0000-000000000015', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000029', '11000000-0000-0000-0000-000000000011', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0016 est terminée.', '03000000-0000-0000-0000-000000000016', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000030', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0016 reçue.', '03000000-0000-0000-0000-000000000016', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000031', '11000000-0000-0000-0000-000000000002', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0017 a été traité.', '03000000-0000-0000-0000-000000000017', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0017 reçue.', '03000000-0000-0000-0000-000000000017', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000033', '11000000-0000-0000-0000-000000000004', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0018 est terminée.', '03000000-0000-0000-0000-000000000018', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000034', '21000000-0000-0000-0000-000000000010', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0018 reçue.', '03000000-0000-0000-0000-000000000018', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000005', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0019.', '03000000-0000-0000-0000-000000000019', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000036', '21000000-0000-0000-0000-000000000011', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0019 reçue.', '03000000-0000-0000-0000-000000000019', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000037', '11000000-0000-0000-0000-000000000012', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000020', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000038', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0020 reçue.', '03000000-0000-0000-0000-000000000020', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000039', '11000000-0000-0000-0000-000000000013', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0021 a été confirmée.', '03000000-0000-0000-0000-000000000021', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000040', '21000000-0000-0000-0000-000000000012', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0021 reçue.', '03000000-0000-0000-0000-000000000021', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000041', '11000000-0000-0000-0000-000000000001', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0023 est terminée.', '03000000-0000-0000-0000-000000000023', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000042', '21000000-0000-0000-0000-000000000003', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0023 reçue.', '03000000-0000-0000-0000-000000000023', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000043', '11000000-0000-0000-0000-000000000003', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0024 a été traité.', '03000000-0000-0000-0000-000000000024', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000044', '21000000-0000-0000-0000-000000000009', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0024 reçue.', '03000000-0000-0000-0000-000000000024', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000045', '11000000-0000-0000-0000-000000000015', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0025 est terminée.', '03000000-0000-0000-0000-000000000025', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000046', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0025 reçue.', '03000000-0000-0000-0000-000000000025', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000047', '11000000-0000-0000-0000-000000000006', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0026.', '03000000-0000-0000-0000-000000000026', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000048', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0026 reçue.', '03000000-0000-0000-0000-000000000026', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000049', '11000000-0000-0000-0000-000000000007', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000027', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000050', '21000000-0000-0000-0000-000000000002', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0027 reçue.', '03000000-0000-0000-0000-000000000027', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000051', '11000000-0000-0000-0000-000000000008', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0028 a été confirmée.', '03000000-0000-0000-0000-000000000028', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000052', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0028 reçue.', '03000000-0000-0000-0000-000000000028', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000053', '11000000-0000-0000-0000-000000000009', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0029.', '03000000-0000-0000-0000-000000000029', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000054', '21000000-0000-0000-0000-000000000004', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0029 reçue.', '03000000-0000-0000-0000-000000000029', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000055', '11000000-0000-0000-0000-000000000010', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0030 est terminée.', '03000000-0000-0000-0000-000000000030', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000056', '21000000-0000-0000-0000-000000000006', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0030 reçue.', '03000000-0000-0000-0000-000000000030', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000057', '11000000-0000-0000-0000-000000000011', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0031 a été traité.', '03000000-0000-0000-0000-000000000031', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000058', '21000000-0000-0000-0000-000000000010', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0031 reçue.', '03000000-0000-0000-0000-000000000031', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000059', '11000000-0000-0000-0000-000000000002', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0032 est terminée.', '03000000-0000-0000-0000-000000000032', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000060', '21000000-0000-0000-0000-000000000012', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0032 reçue.', '03000000-0000-0000-0000-000000000032', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000061', '11000000-0000-0000-0000-000000000012', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0033.', '03000000-0000-0000-0000-000000000033', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000062', '21000000-0000-0000-0000-000000000003', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0033 reçue.', '03000000-0000-0000-0000-000000000033', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000063', '11000000-0000-0000-0000-000000000013', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000034', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000064', '21000000-0000-0000-0000-000000000008', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0034 reçue.', '03000000-0000-0000-0000-000000000034', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000065', '11000000-0000-0000-0000-000000000014', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0035 a été confirmée.', '03000000-0000-0000-0000-000000000035', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000066', '21000000-0000-0000-0000-000000000015', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0035 reçue.', '03000000-0000-0000-0000-000000000035', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000067', '11000000-0000-0000-0000-000000000016', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0036.', '03000000-0000-0000-0000-000000000036', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000068', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0036 reçue.', '03000000-0000-0000-0000-000000000036', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000069', '11000000-0000-0000-0000-000000000017', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0037 est terminée.', '03000000-0000-0000-0000-000000000037', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000070', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0037 reçue.', '03000000-0000-0000-0000-000000000037', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000071', '11000000-0000-0000-0000-000000000001', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0038 a été traité.', '03000000-0000-0000-0000-000000000038', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000072', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0038 reçue.', '03000000-0000-0000-0000-000000000038', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000073', '11000000-0000-0000-0000-000000000003', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0039 est terminée.', '03000000-0000-0000-0000-000000000039', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000074', '21000000-0000-0000-0000-000000000010', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0039 reçue.', '03000000-0000-0000-0000-000000000039', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000075', '11000000-0000-0000-0000-000000000004', 'system', 'Incident signale', 'Nous suivons l''absence signalee sur BK-2025-0040.', '03000000-0000-0000-0000-000000000040', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000076', '21000000-0000-0000-0000-000000000012', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0040 reçue.', '03000000-0000-0000-0000-000000000040', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000077', '11000000-0000-0000-0000-000000000005', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000041', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000078', '21000000-0000-0000-0000-000000000014', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0041 reçue.', '03000000-0000-0000-0000-000000000041', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000079', '11000000-0000-0000-0000-000000000006', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0042 a été confirmée.', '03000000-0000-0000-0000-000000000042', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000080', '21000000-0000-0000-0000-000000000002', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0042 reçue.', '03000000-0000-0000-0000-000000000042', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000081', '11000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0043.', '03000000-0000-0000-0000-000000000043', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000082', '21000000-0000-0000-0000-000000000006', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0043 reçue.', '03000000-0000-0000-0000-000000000043', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000083', '11000000-0000-0000-0000-000000000008', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0044 est terminée.', '03000000-0000-0000-0000-000000000044', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000084', '21000000-0000-0000-0000-000000000013', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0044 reçue.', '03000000-0000-0000-0000-000000000044', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000085', '11000000-0000-0000-0000-000000000009', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0045 a été traité.', '03000000-0000-0000-0000-000000000045', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000086', '21000000-0000-0000-0000-000000000015', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0045 reçue.', '03000000-0000-0000-0000-000000000045', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000087', '11000000-0000-0000-0000-000000000011', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0047.', '03000000-0000-0000-0000-000000000047', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000088', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0047 reçue.', '03000000-0000-0000-0000-000000000047', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000089', '11000000-0000-0000-0000-000000000012', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000048', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000090', '21000000-0000-0000-0000-000000000009', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0048 reçue.', '03000000-0000-0000-0000-000000000048', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000091', '11000000-0000-0000-0000-000000000013', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0049 a été confirmée.', '03000000-0000-0000-0000-000000000049', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000092', '21000000-0000-0000-0000-000000000004', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0049 reçue.', '03000000-0000-0000-0000-000000000049', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000093', '11000000-0000-0000-0000-000000000014', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0050.', '03000000-0000-0000-0000-000000000050', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000094', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0050 reçue.', '03000000-0000-0000-0000-000000000050', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000095', '11000000-0000-0000-0000-000000000015', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0051 est terminée.', '03000000-0000-0000-0000-000000000051', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000096', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0051 reçue.', '03000000-0000-0000-0000-000000000051', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000097', '11000000-0000-0000-0000-000000000016', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0052 a été traité.', '03000000-0000-0000-0000-000000000052', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000098', '21000000-0000-0000-0000-000000000002', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0052 reçue.', '03000000-0000-0000-0000-000000000052', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000099', '11000000-0000-0000-0000-000000000017', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0053 est terminée.', '03000000-0000-0000-0000-000000000053', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000100', '21000000-0000-0000-0000-000000000010', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0053 reçue.', '03000000-0000-0000-0000-000000000053', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000101', '21000000-0000-0000-0000-000000000011', 'review_received', 'Nouvel Avis', 'Vous avez reçu un avis 4 étoiles.', '03000000-0000-0000-0000-000000000054', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000102', '21000000-0000-0000-0000-000000000011', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0054 reçue.', '03000000-0000-0000-0000-000000000054', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000103', '11000000-0000-0000-0000-000000000002', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000055', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000104', '21000000-0000-0000-0000-000000000012', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0055 reçue.', '03000000-0000-0000-0000-000000000055', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000105', '11000000-0000-0000-0000-000000000004', 'booking_new', 'Nouvelle Réservation', 'Vous avez une nouvelle demande BK-2025-0057.', '03000000-0000-0000-0000-000000000057', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000106', '21000000-0000-0000-0000-000000000006', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0057 reçue.', '03000000-0000-0000-0000-000000000057', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000107', '11000000-0000-0000-0000-000000000005', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0058 est terminée.', '03000000-0000-0000-0000-000000000058', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000108', '21000000-0000-0000-0000-000000000003', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0058 reçue.', '03000000-0000-0000-0000-000000000058', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000109', '11000000-0000-0000-0000-000000000006', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0059 a été traité.', '03000000-0000-0000-0000-000000000059', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000110', '21000000-0000-0000-0000-000000000008', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0059 reçue.', '03000000-0000-0000-0000-000000000059', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000111', '11000000-0000-0000-0000-000000000007', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0060 est terminée.', '03000000-0000-0000-0000-000000000060', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000112', '21000000-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0060 reçue.', '03000000-0000-0000-0000-000000000060', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000113', '11000000-0000-0000-0000-000000000008', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0061.', '03000000-0000-0000-0000-000000000061', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000114', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0061 reçue.', '03000000-0000-0000-0000-000000000061', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000115', '11000000-0000-0000-0000-000000000009', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000062', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000116', '21000000-0000-0000-0000-000000000005', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0062 reçue.', '03000000-0000-0000-0000-000000000062', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000117', '11000000-0000-0000-0000-000000000010', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0063 a été confirmée.', '03000000-0000-0000-0000-000000000063', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000118', '21000000-0000-0000-0000-000000000013', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0063 reçue.', '03000000-0000-0000-0000-000000000063', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000119', '11000000-0000-0000-0000-000000000011', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0064 est terminée.', '03000000-0000-0000-0000-000000000064', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000120', '21000000-0000-0000-0000-000000000009', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0064 reçue.', '03000000-0000-0000-0000-000000000064', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000121', '11000000-0000-0000-0000-000000000012', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0065 est terminée.', '03000000-0000-0000-0000-000000000065', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000122', '21000000-0000-0000-0000-000000000015', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0065 reçue.', '03000000-0000-0000-0000-000000000065', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000123', '11000000-0000-0000-0000-000000000013', 'payment_received', 'Paiement Reçu', 'Votre paiement pour BK-2025-0066 a été traité.', '03000000-0000-0000-0000-000000000066', true, false, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000124', '21000000-0000-0000-0000-000000000002', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0066 reçue.', '03000000-0000-0000-0000-000000000066', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000125', '11000000-0000-0000-0000-000000000014', 'service_completed', 'Service Terminé', 'Votre réservation BK-2025-0067 est terminée.', '03000000-0000-0000-0000-000000000067', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000126', '21000000-0000-0000-0000-000000000004', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0067 reçue.', '03000000-0000-0000-0000-000000000067', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000127', '11000000-0000-0000-0000-000000000015', 'system', 'Laissez un avis', 'Partagez votre retour sur BK-2025-0068.', '03000000-0000-0000-0000-000000000068', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000128', '21000000-0000-0000-0000-000000000010', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0068 reçue.', '03000000-0000-0000-0000-000000000068', false, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000129', '11000000-0000-0000-0000-000000000016', 'booking_reminder', 'Rappel Rendez-vous', 'Rappel: vous avez un rendez-vous demain.', '03000000-0000-0000-0000-000000000069', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000130', '21000000-0000-0000-0000-000000000003', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0069 reçue.', '03000000-0000-0000-0000-000000000069', true, true, false, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000131', '11000000-0000-0000-0000-000000000017', 'booking_confirmed', 'Réservation Confirmée', 'Votre réservation BK-2025-0070 a été confirmée.', '03000000-0000-0000-0000-000000000070', false, true, true, CURRENT_TIMESTAMP, false),
  ('34000000-0000-0000-0000-000000000132', '21000000-0000-0000-0000-000000000007', 'booking_new', 'Nouvelle demande', 'Réservation BK-2025-0070 reçue.', '03000000-0000-0000-0000-000000000070', false, true, false, CURRENT_TIMESTAMP, false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 24. SUBSCRIPTIONS
-- ==============================================================
INSERT INTO subscriptions (id, provider_id, tier, status, start_date, end_date, monthly_price, currency, commission_rate, priority_listing, advanced_analytics, auto_renew, created_at, updated_at, marketing_budget, api_access, dedicated_support, gateway_subscription_id)
VALUES
  ('36000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 'premium', 'active', '2025-01-01', '2025-12-31', 49.99, 'TND', 10.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000002', 'premium', 'active', '2025-01-01', '2025-12-31', 49.99, 'TND', 15.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000003', 'basic', 'active', '2025-01-01', '2025-12-31', 19.99, 'TND', 13.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000004', 'basic', 'active', '2025-01-01', '2025-12-31', 19.99, 'TND', 12.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000005', 'premium', 'active', '2025-01-01', '2025-12-31', 49.99, 'TND', 10.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000006', 'basic', 'active', '2025-01-01', '2025-12-31', 19.99, 'TND', 11.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000007', 'free', 'active', '2025-01-01', '2025-12-31', 0.0, 'TND', 10.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000008', 'premium', 'active', '2025-01-01', '2025-12-31', 49.99, 'TND', 18.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000009', 'basic', 'active', '2025-01-01', '2025-12-31', 19.99, 'TND', 8.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000010', 'elite', 'active', '2025-01-01', '2025-12-31', 99.99, 'TND', 8.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000011', 'basic', 'active', '2025-01-01', '2025-12-31', 19.99, 'TND', 11.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000012', 'premium', 'active', '2025-01-01', '2025-12-31', 49.99, 'TND', 13.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000013', 'free', 'active', '2025-01-01', '2025-12-31', 0.0, 'TND', 15.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000014', 'basic', 'active', '2025-01-01', '2025-12-31', 19.99, 'TND', 16.0, false, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, ''),
  ('36000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000015', 'elite', 'active', '2025-01-01', '2025-12-31', 99.99, 'TND', 10.0, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, false, false, '')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 25. SUBSCRIPTION_PAYMENTS
INSERT INTO subscription_payments (id, subscription_id, amount, currency, billing_period_start, billing_period_end, status, paid_at, created_at, gateway_payment_id)
VALUES
  ('07000000-0000-0000-0000-000000000001', '36000000-0000-0000-0000-000000000001', 49.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000002', '36000000-0000-0000-0000-000000000001', 49.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000003', '36000000-0000-0000-0000-000000000001', 49.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000004', '36000000-0000-0000-0000-000000000001', 49.99, 'TND', '2025-04-01', '2025-04-30', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000005', '36000000-0000-0000-0000-000000000001', 49.99, 'TND', '2025-05-01', '2025-05-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000006', '36000000-0000-0000-0000-000000000002', 49.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000007', '36000000-0000-0000-0000-000000000002', 49.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000008', '36000000-0000-0000-0000-000000000003', 19.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000009', '36000000-0000-0000-0000-000000000003', 19.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000010', '36000000-0000-0000-0000-000000000003', 19.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000011', '36000000-0000-0000-0000-000000000003', 19.99, 'TND', '2025-04-01', '2025-04-30', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000012', '36000000-0000-0000-0000-000000000003', 19.99, 'TND', '2025-05-01', '2025-05-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000013', '36000000-0000-0000-0000-000000000004', 19.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000014', '36000000-0000-0000-0000-000000000004', 19.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000015', '36000000-0000-0000-0000-000000000005', 49.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000016', '36000000-0000-0000-0000-000000000005', 49.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000017', '36000000-0000-0000-0000-000000000005', 49.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000018', '36000000-0000-0000-0000-000000000005', 49.99, 'TND', '2025-04-01', '2025-04-30', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000019', '36000000-0000-0000-0000-000000000005', 49.99, 'TND', '2025-05-01', '2025-05-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000020', '36000000-0000-0000-0000-000000000006', 19.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000021', '36000000-0000-0000-0000-000000000006', 19.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000022', '36000000-0000-0000-0000-000000000006', 19.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000023', '36000000-0000-0000-0000-000000000008', 49.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000024', '36000000-0000-0000-0000-000000000008', 49.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000025', '36000000-0000-0000-0000-000000000009', 19.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000026', '36000000-0000-0000-0000-000000000009', 19.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000027', '36000000-0000-0000-0000-000000000009', 19.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000028', '36000000-0000-0000-0000-000000000009', 19.99, 'TND', '2025-04-01', '2025-04-30', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000029', '36000000-0000-0000-0000-000000000009', 19.99, 'TND', '2025-05-01', '2025-05-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000030', '36000000-0000-0000-0000-000000000010', 99.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000031', '36000000-0000-0000-0000-000000000010', 99.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000032', '36000000-0000-0000-0000-000000000010', 99.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000033', '36000000-0000-0000-0000-000000000011', 19.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000034', '36000000-0000-0000-0000-000000000011', 19.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000035', '36000000-0000-0000-0000-000000000011', 19.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000036', '36000000-0000-0000-0000-000000000011', 19.99, 'TND', '2025-04-01', '2025-04-30', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000037', '36000000-0000-0000-0000-000000000011', 19.99, 'TND', '2025-05-01', '2025-05-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000038', '36000000-0000-0000-0000-000000000012', 49.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000039', '36000000-0000-0000-0000-000000000012', 49.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000040', '36000000-0000-0000-0000-000000000012', 49.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000041', '36000000-0000-0000-0000-000000000014', 19.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000042', '36000000-0000-0000-0000-000000000014', 19.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000043', '36000000-0000-0000-0000-000000000014', 19.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000044', '36000000-0000-0000-0000-000000000015', 99.99, 'TND', '2025-01-01', '2025-01-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000045', '36000000-0000-0000-0000-000000000015', 99.99, 'TND', '2025-02-01', '2025-02-28', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('07000000-0000-0000-0000-000000000046', '36000000-0000-0000-0000-000000000015', 99.99, 'TND', '2025-03-01', '2025-03-31', 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 29. SUPPORT_TICKETS
-- ==============================================================
INSERT INTO support_tickets (id, ticket_number, user_id, category, subject, description, priority, status, assigned_to, created_at, updated_at)
VALUES
  ('16000000-0000-0000-0000-000000000001', 'TK-2025-0001', '11000000-0000-0000-0000-000000000001', 'billing', 'Surfacturé pour le service', 'J''ai été facturé plus que le tarif affiché.', 'high', 'open', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000002', 'TK-2025-0002', '21000000-0000-0000-0000-000000000003', 'technical', 'L''app plante sur la page agenda', 'L''application se bloque quand je modifie mes disponibilités.', 'normal', 'in_progress', '0f8a2873-b963-48ad-bdb0-140513b61e82', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000003', 'TK-2025-0003', '11000000-0000-0000-0000-000000000003', 'general', 'Comment ajouter un membre de famille', 'Je veux réserver pour ma mère.', 'low', 'resolved', '0f8a2873-b963-48ad-bdb0-140513b61e82', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000004', 'TK-2025-0004', '11000000-0000-0000-0000-000000000007', 'billing', 'Litige remboursement en attente', 'Dispute ouverte mais pas de remboursement.', 'high', 'open', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000005', 'TK-2025-0005', '21000000-0000-0000-0000-000000000005', 'account', 'Changement de zone de service', 'J''ai déménagé et dois mettre à jour ma zone.', 'low', 'resolved', '0f8a2873-b963-48ad-bdb0-140513b61e82', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000006', 'TK-2025-0006', '11000000-0000-0000-0000-000000000004', 'technical', 'Impossible de laisser un avis', 'Le bouton avis ne fonctionne pas.', 'normal', 'in_progress', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000007', 'TK-2025-0007', '21000000-0000-0000-0000-000000000007', 'billing', 'Paiement non reçu pour BK-2025-0047', 'Prestation terminée mais fonds toujours non libérés.', 'high', 'open', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000008', 'TK-2025-0008', '11000000-0000-0000-0000-000000000010', 'general', 'Demande de prestataire recommandé', 'Cherche kiné spécialisé dos à Tunis.', 'low', 'resolved', '0f8a2873-b963-48ad-bdb0-140513b61e82', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000009', 'TK-2025-0009', '21000000-0000-0000-0000-000000000002', 'account', 'Demande de vérification de documents', 'Envoyé documents mais pas de retour.', 'normal', 'in_progress', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000010', 'TK-2025-0010', '11000000-0000-0000-0000-000000000013', 'billing', 'Remboursement BK-2025-0049 en attente', 'Aucune nouvelle depuis 2 semaines.', 'high', 'open', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000011', 'TK-2025-0011', '11000000-0000-0000-0000-000000000008', 'technical', 'Notifications push non reçues', 'Je ne reçois plus les notifications.', 'normal', 'in_progress', '0f8a2873-b963-48ad-bdb0-140513b61e82', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('16000000-0000-0000-0000-000000000012', 'TK-2025-0012', '21000000-0000-0000-0000-000000000010', 'account', 'Mise à jour des tarifs', 'Comment modifier le prix de mes séances ?', 'low', 'resolved', '0f8a2873-b963-48ad-bdb0-140513b61e82', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO support_ticket_messages (id, ticket_id, sender_id, message, is_internal, created_at)
VALUES
  ('26000000-0000-0000-0000-000000000001', '16000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'J''ai été facturé plus que le tarif affiché.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000002', '16000000-0000-0000-0000-000000000002', '21000000-0000-0000-0000-000000000003', 'L''application se bloque quand je modifie mes disponibilités.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000003', '16000000-0000-0000-0000-000000000002', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000004', '16000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'Je veux réserver pour ma mère.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000005', '16000000-0000-0000-0000-000000000003', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000006', '16000000-0000-0000-0000-000000000003', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Votre demande a été traitée. Ticket résolu, bonne journée.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000007', '16000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000007', 'Dispute ouverte mais pas de remboursement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000008', '16000000-0000-0000-0000-000000000005', '21000000-0000-0000-0000-000000000005', 'J''ai déménagé et dois mettre à jour ma zone.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000009', '16000000-0000-0000-0000-000000000005', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000010', '16000000-0000-0000-0000-000000000005', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Votre demande a été traitée. Ticket résolu, bonne journée.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000011', '16000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000004', 'Le bouton avis ne fonctionne pas.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000012', '16000000-0000-0000-0000-000000000006', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000013', '16000000-0000-0000-0000-000000000007', '21000000-0000-0000-0000-000000000007', 'Booking validé mais fonds non libérés.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000014', '16000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000010', 'Cherche kiné spécialisé dos à Tunis.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000015', '16000000-0000-0000-0000-000000000008', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000016', '16000000-0000-0000-0000-000000000008', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Votre demande a été traitée. Ticket résolu, bonne journée.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000017', '16000000-0000-0000-0000-000000000009', '21000000-0000-0000-0000-000000000002', 'Envoyé documents mais pas de retour.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000018', '16000000-0000-0000-0000-000000000009', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000019', '16000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000013', 'Aucune nouvelle depuis 2 semaines.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000020', '16000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000008', 'Je ne reçois plus les notifications.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000021', '16000000-0000-0000-0000-000000000011', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000022', '16000000-0000-0000-0000-000000000012', '21000000-0000-0000-0000-000000000010', 'Comment modifier le prix de mes séances ?', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000023', '16000000-0000-0000-0000-000000000012', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Nous examinons votre demande, nous revenons vers vous rapidement.', false, CURRENT_TIMESTAMP),
  ('26000000-0000-0000-0000-000000000024', '16000000-0000-0000-0000-000000000012', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'Votre demande a été traitée. Ticket résolu, bonne journée.', false, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 30. PROVIDER_CERTIFICATIONS
-- ==============================================================
INSERT INTO provider_certifications (id, provider_id, certification_name, issuing_organization, certification_number, issue_date, expiry_date, is_verified, verified_at, created_at)
VALUES
  ('1d000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 'Diplôme de Médecine Générale', 'Université de Tunis', 'DIP-MED-2015', '2015-06-15', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', 'BLS Certification', 'Croissant Rouge', 'BLS-2023-001', '2023-01-10', '2026-01-10', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000001', 'ACLS Certification', 'Croissant Rouge', 'ACLS-2023-001', '2023-01-10', '2026-01-10', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000002', 'Diplôme de Médecine Générale', 'Université de Sfax', 'DIP-MED-2012', '2012-06-20', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000002', 'Diplôme de Gériatrie', 'Université de Tunis', 'DIP-GER-2018', '2018-09-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000003', 'Diplôme Infirmier d''État', 'ISSIT Tunis', 'DIP-INF-2018', '2018-06-20', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000003', 'BLS Certification', 'Croissant Rouge', 'BLS-2022-042', '2022-03-15', '2025-03-15', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000004', 'Diplôme Infirmier d''État', 'ISSIT Sfax', 'DIP-INF-2016', '2016-07-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000005', 'Diplôme de Kinésithérapie', 'Université de Sousse', 'DIP-KIN-2012', '2012-06-18', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000005', 'Certification Pilates', 'Institut Pilates Tunis', 'PIL-2020-005', '2020-04-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000006', 'Diplôme de Kinésithérapie', 'Université de Monastir', 'DIP-KIN-2015', '2015-06-25', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000007', 'Technicien de Laboratoire', 'ISTMT Tunis', 'TL-2021-008', '2021-07-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000008', 'Certificat PHTLS', 'Croissant Rouge', 'PHTLS-2022', '2022-09-01', '2025-09-01', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000009', 'Agrément Équipement Médical', 'Ministère Santé', 'AGR-EQP-2020', '2020-01-15', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000010', 'Diplôme Psychologie Clinique', 'Université de Tunis', 'DIP-PSY-2013', '2013-06-20', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000011', 'Diplôme Diététique-Nutrition', 'Institut Nutrition Tunis', 'DIP-NUT-2017', '2017-09-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000012', 'Certificat Aide Soignant', 'ATSS Tunis', 'CERT-AS-2014', '2014-06-01', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000018', '12000000-0000-0000-0000-000000000013', 'Diplôme Infirmier d''État', 'ISSIT Sfax', 'DIP-INF-2019', '2019-06-22', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000019', '12000000-0000-0000-0000-000000000014', 'Diplôme de Médecine + Dermatologie', 'Université de Tunis', 'DIP-DER-2016', '2016-06-18', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1d000000-0000-0000-0000-000000000020', '12000000-0000-0000-0000-000000000015', 'Diplôme de Kinésithérapie', 'Université de Monastir', 'DIP-KIN-2018', '2018-06-20', NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 31. PROVIDER_DOCUMENTS
-- ==============================================================
DROP TABLE IF EXISTS seed_provider_document_files;
CREATE TEMP TABLE seed_provider_document_files (
    provider_document_id uuid PRIMARY KEY,
    file_id uuid NOT NULL,
    provider_id uuid NOT NULL,
    document_type text NOT NULL,
    document_name text NOT NULL,
    original_file_name text NOT NULL,
    mime_type text NOT NULL,
    file_size_bytes integer NOT NULL,
    is_verified boolean NOT NULL
) ON COMMIT DROP;

INSERT INTO seed_provider_document_files (provider_document_id, file_id, provider_id, document_type, document_name, original_file_name, mime_type, file_size_bytes, is_verified)
VALUES
  ('2d000000-0000-0000-0000-000000000001', '2e000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 'license', 'Licence Médicale', 'licence_dr_amira.pdf', 'application/pdf', 245000, true),
  ('2d000000-0000-0000-0000-000000000002', '2e000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', 'id_card', 'Carte d''Identité', 'id_dr_amira.pdf', 'application/pdf', 168000, true),
  ('2d000000-0000-0000-0000-000000000003', '2e000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000002', 'license', 'Licence Médicale', 'licence_dr_faouzi.pdf', 'application/pdf', 238000, true),
  ('2d000000-0000-0000-0000-000000000004', '2e000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000002', 'diploma', 'Diplôme Gériatrie', 'diploma_dr_faouzi.pdf', 'application/pdf', 512000, true),
  ('2d000000-0000-0000-0000-000000000005', '2e000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000003', 'license', 'Licence Infirmier', 'licence_karim.pdf', 'application/pdf', 221000, true),
  ('2d000000-0000-0000-0000-000000000006', '2e000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000004', 'license', 'Licence Infirmier', 'licence_samia.pdf', 'application/pdf', 219000, true),
  ('2d000000-0000-0000-0000-000000000007', '2e000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000005', 'diploma', 'Diplôme Kiné', 'diploma_leila.pdf', 'application/pdf', 486000, true),
  ('2d000000-0000-0000-0000-000000000008', '2e000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000006', 'diploma', 'Diplôme Kiné', 'diploma_slim.pdf', 'application/pdf', 472000, true),
  ('2d000000-0000-0000-0000-000000000009', '2e000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000007', 'license', 'Agrément Laboratoire', 'agrement_mehdi.pdf', 'application/pdf', 320000, true),
  ('2d000000-0000-0000-0000-000000000010', '2e000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000008', 'license', 'Licence Ambulancier', 'licence_riadh.pdf', 'application/pdf', 198000, true),
  ('2d000000-0000-0000-0000-000000000011', '2e000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000009', 'license', 'Agrément Équipement', 'agrement_sonia.pdf', 'application/pdf', 305000, true),
  ('2d000000-0000-0000-0000-000000000012', '2e000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000010', 'diploma', 'Diplôme Psychologie', 'diploma_dr_zied.pdf', 'application/pdf', 510000, true),
  ('2d000000-0000-0000-0000-000000000013', '2e000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000011', 'diploma', 'Diplôme Nutrition', 'diploma_hana.pdf', 'application/pdf', 458000, true),
  ('2d000000-0000-0000-0000-000000000014', '2e000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000012', 'certification', 'Certificat Aide-Soignant', 'cert_bassem.pdf', 'application/pdf', 176000, true),
  ('2d000000-0000-0000-0000-000000000015', '2e000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000013', 'license', 'Licence Infirmier', 'licence_manel.pdf', 'application/pdf', 225000, true),
  ('2d000000-0000-0000-0000-000000000016', '2e000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000014', 'license', 'Licence Médicale', 'licence_dr_rim.pdf', 'application/pdf', 241000, true),
  ('2d000000-0000-0000-0000-000000000017', '2e000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000015', 'diploma', 'Diplôme Kiné', 'diploma_aymen.pdf', 'application/pdf', 467000, true)
ON CONFLICT DO NOTHING;

INSERT INTO stored_files (id, use_case, category, visibility, status, scan_status, scan_verdict, scan_engine, scan_engine_version, bucket, object_key, staging_bucket, staging_object_key, original_file_name, declared_content_type, detected_content_type, size_bytes, sha256, owner_user_id, owner_role, related_provider_id, retention_policy, retention_expires_at, created_at, updated_at, ready_at)
SELECT
    seed.file_id,
    'ProviderCredential',
    'Document',
    'Private',
    'Ready',
    'Clean',
    'Clean',
    'seed',
    'seed',
    'files-private',
    'providers/' || seed.provider_id::text || '/credentials/' || seed.file_id::text || '-' || seed.original_file_name,
    'files-staging',
    'seed/provider-documents/' || seed.file_id::text || '-' || seed.original_file_name,
    seed.original_file_name,
    seed.mime_type,
    seed.mime_type,
    seed.file_size_bytes,
    lpad(replace(seed.file_id::text, '-', ''), 64, '0'),
    providers.user_id,
    'provider',
    seed.provider_id,
    'Medical7Years',
    CURRENT_TIMESTAMP + INTERVAL '7 years',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM seed_provider_document_files AS seed
INNER JOIN providers
    ON providers.id = seed.provider_id
ON CONFLICT DO NOTHING;

INSERT INTO provider_documents (id, provider_id, document_type, document_name, file_id, file_size_bytes, mime_type, is_verified, verified_at, created_at, updated_at, is_expired)
SELECT
    seed.provider_document_id,
    seed.provider_id,
    seed.document_type,
    seed.document_name,
    seed.file_id,
    seed.file_size_bytes,
    seed.mime_type,
    seed.is_verified,
    CASE WHEN seed.is_verified THEN CURRENT_TIMESTAMP ELSE NULL END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    false
FROM seed_provider_document_files AS seed
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 32. PROVIDER_LOCATIONS
-- ==============================================================
INSERT INTO provider_locations (id, provider_id, latitude, longitude, accuracy_meters, recorded_at, heading, speed_kmh)
VALUES
  ('3d000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000002', 36.811218, 10.146555, 12.69, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000003', 34.768839, 10.743795, 3.26, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000004', 35.826854, 10.605032, 11.43, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000005', 35.738641, 10.781686, 11.94, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000006', 37.251758, 9.910797, 10.72, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000007', 36.484458, 10.718908, 14.75, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000008', 36.865762, 10.166921, 6.74, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000009', 36.84345, 10.198504, 11.14, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000010', 36.924073, 10.335985, 5.11, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000011', 36.384835, 10.639959, 9.15, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000012', 36.883031, 10.149786, 12.24, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000013', 34.766116, 10.800689, 14.8, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000014', 35.811531, 10.624249, 10.63, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000015', 35.795646, 10.78692, 9.16, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000001', 36.8034, 10.135297, 10.49, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000002', 36.804441, 10.161757, 4.7, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000003', 34.728638, 10.778223, 5.43, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000018', '12000000-0000-0000-0000-000000000004', 35.827211, 10.597562, 7.2, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000019', '12000000-0000-0000-0000-000000000005', 35.778208, 10.763346, 7.74, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000020', '12000000-0000-0000-0000-000000000006', 37.245854, 9.86728, 13.05, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000021', '12000000-0000-0000-0000-000000000007', 36.470416, 10.706733, 13.13, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000022', '12000000-0000-0000-0000-000000000008', 36.878604, 10.131652, 5.14, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000023', '12000000-0000-0000-0000-000000000009', 36.849659, 10.1472, 4.56, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000024', '12000000-0000-0000-0000-000000000010', 36.869682, 10.281077, 5.91, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000025', '12000000-0000-0000-0000-000000000011', 36.352082, 10.639338, 7.72, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000026', '12000000-0000-0000-0000-000000000012', 36.886765, 10.136669, 3.83, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000027', '12000000-0000-0000-0000-000000000013', 34.729342, 10.746264, 6.09, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000028', '12000000-0000-0000-0000-000000000014', 35.803982, 10.589755, 3.7, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000029', '12000000-0000-0000-0000-000000000015', 35.727037, 10.835277, 6.94, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000030', '12000000-0000-0000-0000-000000000001', 36.780446, 10.158768, 11.29, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000031', '12000000-0000-0000-0000-000000000002', 36.821421, 10.20975, 7.8, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000032', '12000000-0000-0000-0000-000000000003', 34.767411, 10.805269, 5.56, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000033', '12000000-0000-0000-0000-000000000004', 35.830001, 10.677236, 10.9, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000034', '12000000-0000-0000-0000-000000000005', 35.721989, 10.799684, 13.64, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000035', '12000000-0000-0000-0000-000000000006', 37.292939, 9.884194, 14.35, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000036', '12000000-0000-0000-0000-000000000007', 36.457562, 10.701679, 11.75, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000037', '12000000-0000-0000-0000-000000000008', 36.857887, 10.146444, 13.23, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000038', '12000000-0000-0000-0000-000000000009', 36.888566, 10.223706, 10.99, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000039', '12000000-0000-0000-0000-000000000010', 36.901647, 10.296202, 3.03, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000040', '12000000-0000-0000-0000-000000000011', 36.397674, 10.631601, 14.79, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000041', '12000000-0000-0000-0000-000000000012', 36.839581, 10.112599, 14.51, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000042', '12000000-0000-0000-0000-000000000013', 34.726006, 10.74604, 7.87, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000043', '12000000-0000-0000-0000-000000000014', 35.828053, 10.610367, 3.4, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000044', '12000000-0000-0000-0000-000000000015', 35.784238, 10.815655, 5.45, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000045', '12000000-0000-0000-0000-000000000001', 36.845509, 10.136286, 8.58, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000046', '12000000-0000-0000-0000-000000000002', 36.750283, 10.198557, 9.35, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000047', '12000000-0000-0000-0000-000000000003', 34.711798, 10.778364, 12.5, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000048', '12000000-0000-0000-0000-000000000004', 35.816511, 10.642897, 9.67, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000049', '12000000-0000-0000-0000-000000000005', 35.7957, 10.859384, 9.74, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000050', '12000000-0000-0000-0000-000000000006', 37.241956, 9.839223, 9.06, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000051', '12000000-0000-0000-0000-000000000007', 36.467028, 10.71176, 11.46, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000052', '12000000-0000-0000-0000-000000000008', 36.933675, 10.132533, 10.04, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000053', '12000000-0000-0000-0000-000000000009', 36.889583, 10.225667, 10.63, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000054', '12000000-0000-0000-0000-000000000010', 36.868027, 10.289778, 11.78, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000055', '12000000-0000-0000-0000-000000000011', 36.389021, 10.60564, 6.0, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000056', '12000000-0000-0000-0000-000000000012', 36.870629, 10.130603, 10.36, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000057', '12000000-0000-0000-0000-000000000013', 34.730136, 10.746048, 14.67, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000058', '12000000-0000-0000-0000-000000000014', 35.819848, 10.660677, 8.86, CURRENT_TIMESTAMP, NULL, NULL),
  ('3d000000-0000-0000-0000-000000000059', '12000000-0000-0000-0000-000000000015', 35.736696, 10.81458, 10.9, CURRENT_TIMESTAMP, NULL, NULL)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 33. PROVIDER_AVAILABILITY_HISTORY
-- ==============================================================
INSERT INTO provider_availability_history (id, provider_id, is_available, status, status_changed_at, reason, changed_by)
VALUES
  ('2e000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000001'),
  ('2e000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000001'),
  ('2e000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000001', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000001'),
  ('2e000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000002', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000002'),
  ('2e000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000002', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000002'),
  ('2e000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000002', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000002'),
  ('2e000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000003', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000003'),
  ('2e000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000003', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000003'),
  ('2e000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000003', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000003'),
  ('2e000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000004', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000004'),
  ('2e000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000004', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000004'),
  ('2e000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000004', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000004'),
  ('2e000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000005', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000005'),
  ('2e000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000005', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000005'),
  ('2e000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000005', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000005'),
  ('2e000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000006', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000006'),
  ('2e000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000006', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000006'),
  ('2e000000-0000-0000-0000-000000000018', '12000000-0000-0000-0000-000000000006', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000006'),
  ('2e000000-0000-0000-0000-000000000019', '12000000-0000-0000-0000-000000000007', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000007'),
  ('2e000000-0000-0000-0000-000000000020', '12000000-0000-0000-0000-000000000007', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000007'),
  ('2e000000-0000-0000-0000-000000000021', '12000000-0000-0000-0000-000000000007', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000007'),
  ('2e000000-0000-0000-0000-000000000022', '12000000-0000-0000-0000-000000000008', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000008'),
  ('2e000000-0000-0000-0000-000000000023', '12000000-0000-0000-0000-000000000008', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000008'),
  ('2e000000-0000-0000-0000-000000000024', '12000000-0000-0000-0000-000000000008', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000008'),
  ('2e000000-0000-0000-0000-000000000025', '12000000-0000-0000-0000-000000000009', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000009'),
  ('2e000000-0000-0000-0000-000000000026', '12000000-0000-0000-0000-000000000009', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000009'),
  ('2e000000-0000-0000-0000-000000000027', '12000000-0000-0000-0000-000000000009', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000009'),
  ('2e000000-0000-0000-0000-000000000028', '12000000-0000-0000-0000-000000000010', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000010'),
  ('2e000000-0000-0000-0000-000000000029', '12000000-0000-0000-0000-000000000010', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000010'),
  ('2e000000-0000-0000-0000-000000000030', '12000000-0000-0000-0000-000000000010', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000010'),
  ('2e000000-0000-0000-0000-000000000031', '12000000-0000-0000-0000-000000000011', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000011'),
  ('2e000000-0000-0000-0000-000000000032', '12000000-0000-0000-0000-000000000011', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000011'),
  ('2e000000-0000-0000-0000-000000000033', '12000000-0000-0000-0000-000000000011', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000011'),
  ('2e000000-0000-0000-0000-000000000034', '12000000-0000-0000-0000-000000000012', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000012'),
  ('2e000000-0000-0000-0000-000000000035', '12000000-0000-0000-0000-000000000012', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000012'),
  ('2e000000-0000-0000-0000-000000000036', '12000000-0000-0000-0000-000000000012', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000012'),
  ('2e000000-0000-0000-0000-000000000037', '12000000-0000-0000-0000-000000000013', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000013'),
  ('2e000000-0000-0000-0000-000000000038', '12000000-0000-0000-0000-000000000013', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000013'),
  ('2e000000-0000-0000-0000-000000000039', '12000000-0000-0000-0000-000000000013', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000013'),
  ('2e000000-0000-0000-0000-000000000040', '12000000-0000-0000-0000-000000000014', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000014'),
  ('2e000000-0000-0000-0000-000000000041', '12000000-0000-0000-0000-000000000014', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000014'),
  ('2e000000-0000-0000-0000-000000000042', '12000000-0000-0000-0000-000000000014', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000014'),
  ('2e000000-0000-0000-0000-000000000043', '12000000-0000-0000-0000-000000000015', true, 'available', CURRENT_TIMESTAMP, 'Début de service', '21000000-0000-0000-0000-000000000015'),
  ('2e000000-0000-0000-0000-000000000044', '12000000-0000-0000-0000-000000000015', false, 'busy', CURRENT_TIMESTAMP, 'Rendez-vous en cours', '21000000-0000-0000-0000-000000000015'),
  ('2e000000-0000-0000-0000-000000000045', '12000000-0000-0000-0000-000000000015', true, 'available', CURRENT_TIMESTAMP, 'Rendez-vous terminé', '21000000-0000-0000-0000-000000000015')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 34. TRACKING_SESSIONS
-- ==============================================================
INSERT INTO tracking_sessions (id, booking_id, is_active, share_token, share_expires_at, estimated_arrival_at, last_eta_update_at, total_distance_km, started_at, ended_at)
VALUES
  ('3e000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000001', false, 'trk-0001-0001', '2025-01-20 16:26:00+01', '2025-01-20 08:55:00+01', '2025-01-20 08:36:00+01', 5.00, '2025-01-20 08:26:00+01', '2025-01-20 09:45:00+01'),
  ('3e000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000007', false, 'trk-0007-0001', '2025-02-05 17:32:00+01', '2025-02-05 09:55:00+01', '2025-02-05 09:42:00+01', 3.40, '2025-02-05 09:32:00+01', '2025-02-05 10:45:00+01'),
  ('3e000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000014', false, 'trk-0014-0008', '2025-03-10 21:31:00+01', '2025-03-10 13:55:00+01', '2025-03-10 13:41:00+01', 3.40, '2025-03-10 13:31:00+01', '2025-03-10 15:00:00+01'),
  ('3e000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000023', false, 'trk-0023-0003', '2025-04-04 05:15:00+01', '2025-04-03 21:55:00+01', '2025-04-03 21:30:00+01', 6.60, '2025-04-03 21:15:00+01', '2025-04-04 06:00:00+01'),
  ('3e000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000024', false, 'trk-0024-0009', '2025-04-05 16:25:00+01', '2025-04-05 08:55:00+01', '2025-04-05 08:35:00+01', 8.20, '2025-04-05 08:25:00+01', '2025-04-05 10:00:00+01'),
  ('3e000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000034', false, 'trk-0034-0008', '2025-05-02 20:27:00+01', '2025-05-02 12:55:00+01', '2025-05-02 12:37:00+01', 13.00, '2025-05-02 12:27:00+01', '2025-05-02 14:00:00+01'),
  ('3e000000-0000-0000-0000-000000000007', '03000000-0000-0000-0000-000000000040', false, 'trk-0040-0012', '2025-05-18 17:25:00+01', '2025-05-18 09:55:00+01', '2025-05-18 09:35:00+01', 11.40, '2025-05-18 09:25:00+01', '2025-05-18 10:20:00+01'),
  ('3e000000-0000-0000-0000-000000000008', '03000000-0000-0000-0000-000000000048', false, 'trk-0048-0009', '2025-06-10 16:25:00+01', '2025-06-10 08:55:00+01', '2025-06-10 08:35:00+01', 13.00, '2025-06-10 08:25:00+01', '2025-06-10 10:00:00+01'),
  ('3e000000-0000-0000-0000-000000000009', '03000000-0000-0000-0000-000000000059', true, 'trk-0059-0008', '2025-07-10 21:28:00+01', '2025-07-10 13:55:00+01', '2025-07-10 13:38:00+01', 8.20, '2025-07-10 13:28:00+01', NULL),
  ('3e000000-0000-0000-0000-000000000010', '03000000-0000-0000-0000-000000000063', false, 'trk-0063-0013', '2025-07-20 17:32:00+01', '2025-07-20 09:55:00+01', '2025-07-20 09:42:00+01', 3.40, '2025-07-20 09:32:00+01', '2025-07-20 10:15:00+01'),
  ('3e000000-0000-0000-0000-000000000011', '03000000-0000-0000-0000-000000000069', true, 'trk-0069-0003', '2025-08-07 16:30:00+01', '2025-08-07 08:55:00+01', '2025-08-07 08:40:00+01', 13.00, '2025-08-07 08:30:00+01', NULL),
  ('3e000000-0000-0000-0000-000000000012', '03000000-0000-0000-0000-000000000071', false, 'trk-0071-0015', '2025-08-13 00:32:00+01', '2025-08-12 16:55:00+01', '2025-08-12 16:42:00+01', 5.00, '2025-08-12 16:32:00+01', '2025-08-12 18:00:00+01'),
  ('3e000000-0000-0000-0000-000000000013', '03000000-0000-0000-0000-000000000073', false, 'trk-0073-0011', '2025-08-18 16:26:00+01', '2025-08-18 08:55:00+01', '2025-08-18 08:36:00+01', 8.20, '2025-08-18 08:26:00+01', '2025-08-18 09:50:00+01'),
  ('3e000000-0000-0000-0000-000000000014', '03000000-0000-0000-0000-000000000075', false, 'trk-0075-0015', '2025-08-22 17:28:00+01', '2025-08-22 09:55:00+01', '2025-08-22 09:38:00+01', 11.40, '2025-08-22 09:28:00+01', '2025-08-22 11:00:00+01'),
  ('3e000000-0000-0000-0000-000000000015', '03000000-0000-0000-0000-000000000077', false, 'trk-0077-0009', '2025-08-28 17:30:00+01', '2025-08-28 09:55:00+01', '2025-08-28 09:40:00+01', 3.40, '2025-08-28 09:30:00+01', '2025-08-28 11:00:00+01'),
  ('3e000000-0000-0000-0000-000000000016', '03000000-0000-0000-0000-000000000088', false, 'trk-0088-0008', '2025-09-28 20:25:00+01', '2025-09-28 12:55:00+01', '2025-09-28 12:35:00+01', 9.80, '2025-09-28 12:25:00+01', '2025-09-28 14:00:00+01'),
  ('3e000000-0000-0000-0000-000000000017', '03000000-0000-0000-0000-000000000091', true, 'trk-0091-0005', '2025-10-08 21:28:00+01', '2025-10-08 13:55:00+01', '2025-10-08 13:38:00+01', 3.40, '2025-10-08 13:28:00+01', NULL),
  ('3e000000-0000-0000-0000-000000000018', '03000000-0000-0000-0000-000000000095', false, 'trk-0095-0009', '2025-10-18 17:32:00+01', '2025-10-18 09:55:00+01', '2025-10-18 09:42:00+01', 9.80, '2025-10-18 09:32:00+01', '2025-10-18 11:00:00+01')
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 35. PATIENT_REWARDS
-- ==============================================================
INSERT INTO patient_rewards (id, patient_id, total_points, available_points, redeemed_points, current_streak, longest_streak, level, level_name, total_bookings, total_reviews, total_referrals, created_at, updated_at)
VALUES
  ('08000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', 250, 250, 0, 3, 5, 2, 'Silver', 6, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000002', 80, 80, 0, 0, 3, 1, 'Bronze', 4, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000003', 30, 30, 0, 1, 7, 1, 'Bronze', 4, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000004', 85, 85, 0, 2, 6, 1, 'Bronze', 2, 3, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000005', 60, 60, 0, 0, 1, 1, 'Bronze', 1, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000006', 100, 100, 0, 2, 2, 1, 'Bronze', 3, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000007', 10, 10, 0, 0, 1, 1, 'Bronze', 2, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000008', 320, 270, 50, 4, 8, 3, 'Gold', 8, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000009', 150, 150, 0, 1, 4, 2, 'Silver', 5, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000010', 500, 450, 50, 7, 12, 3, 'Gold', 10, 7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000011', 75, 75, 0, 2, 5, 1, 'Bronze', 4, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000012', 200, 200, 0, 3, 6, 2, 'Silver', 6, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000013', 25, 25, 0, 0, 2, 1, 'Bronze', 2, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000014', 45, 45, 0, 1, 3, 1, 'Bronze', 3, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000015', 900, 800, 100, 10, 15, 4, 'Platinum', 18, 10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000016', 60, 60, 0, 1, 2, 1, 'Bronze', 2, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('08000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000017', 35, 35, 0, 0, 1, 1, 'Bronze', 2, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 36. REWARD_TRANSACTIONS
-- ==============================================================
INSERT INTO reward_transactions (id, patient_id, transaction_type, points, balance_after, reason, booking_id, created_at)
VALUES
  ('18000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000001', '2025-01-20 10:00:00+01'),
  ('18000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000011', '2025-03-01 10:35:00+01'),
  ('18000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000001', 'earn', 25, 85, 'Review posted', '03000000-0000-0000-0000-000000000054', '2025-06-26 10:20:00+01'),
  ('18000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000002', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000002', '2025-01-21 10:45:00+01'),
  ('18000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000002', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000017', '2025-03-18 08:30:00+01'),
  ('18000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000002', 'earn', 25, 85, 'Review posted', '03000000-0000-0000-0000-000000000017', '2025-03-21 08:45:00+01'),
  ('18000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000003', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000003', '2025-01-22 15:15:00+01'),
  ('18000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000003', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000024', '2025-04-05 10:15:00+01'),
  ('18000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000004', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000005', '2025-01-24 09:05:00+01'),
  ('18000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000004', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000018', '2025-03-20 16:15:00+01'),
  ('18000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000005', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000007', '2025-02-06 11:45:00+01'),
  ('18000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000005', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000019', '2025-03-22 11:35:00+01'),
  ('18000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000005', 'earn', 25, 85, 'Review posted', '03000000-0000-0000-0000-000000000041', '2025-05-23 10:30:00+01'),
  ('18000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000006', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000008', '2025-02-10 09:45:00+01'),
  ('18000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000006', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000026', '2025-04-10 08:35:00+01'),
  ('18000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000007', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000043', '2025-05-25 15:15:00+01'),
  ('18000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000007', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000060', '2025-07-12 09:00:00+01'),
  ('18000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000008', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000013', '2025-03-08 11:30:00+01'),
  ('18000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000008', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000078', '2025-09-02 10:35:00+01'),
  ('18000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000009', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000014', '2025-03-10 15:15:00+01'),
  ('18000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000009', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000029', '2025-04-18 10:25:00+01'),
  ('18000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000010', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000015', '2025-03-12 09:55:00+01'),
  ('18000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000010', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000063', '2025-07-21 11:15:00+01'),
  ('18000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000010', 'earn', 25, 85, 'Review posted', '03000000-0000-0000-0000-000000000063', '2025-07-22 11:45:00+01'),
  ('18000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000011', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000016', '2025-03-16 11:30:00+01'),
  ('18000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000011', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000031', '2025-04-22 16:35:00+01'),
  ('18000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000011', 'earn', 25, 85, 'Review posted', '03000000-0000-0000-0000-000000000081', '2025-09-11 11:30:00+01'),
  ('18000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000012', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000020', '2025-03-25 09:35:00+01'),
  ('18000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000012', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000033', '2025-04-28 09:45:00+01'),
  ('18000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000012', 'earn', 25, 85, 'Review posted', '03000000-0000-0000-0000-000000000048', '2025-06-11 10:30:00+01'),
  ('18000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000013', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000021', '2025-03-28 12:15:00+01'),
  ('18000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000013', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000034', '2025-05-02 14:15:00+01'),
  ('18000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000014', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000050', '2025-06-15 09:05:00+01'),
  ('18000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000014', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000067', '2025-08-01 11:15:00+01'),
  ('18000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000015', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000025', '2025-04-08 09:30:00+01'),
  ('18000000-0000-0000-0000-000000000036', '02000000-0000-0000-0000-000000000015', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000051', '2025-06-18 15:15:00+01'),
  ('18000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000016', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000036', '2025-05-07 10:35:00+01'),
  ('18000000-0000-0000-0000-000000000038', '02000000-0000-0000-0000-000000000016', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000052', '2025-06-21 09:10:00+01'),
  ('18000000-0000-0000-0000-000000000039', '02000000-0000-0000-0000-000000000017', 'earn', 10, 10, 'First booking completed', '03000000-0000-0000-0000-000000000037', '2025-05-10 15:15:00+01'),
  ('18000000-0000-0000-0000-000000000040', '02000000-0000-0000-0000-000000000017', 'earn', 50, 60, 'Booking completed', '03000000-0000-0000-0000-000000000053', '2025-06-23 17:15:00+01')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 37. PATIENT_BADGES
-- ==============================================================
INSERT INTO patient_badges (id, patient_id, badge_id, earned_at)
VALUES
  ('28000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000001', '17000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000001', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000001', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000001', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000002', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000002', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000002', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000003', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000004', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000004', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000004', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000004', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000005', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000005', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000005', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000006', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000006', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000006', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000006', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000006', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000007', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000008', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000008', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000008', '17000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000008', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000008', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000008', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000009', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000009', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000009', '17000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000009', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000009', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000009', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000036', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000038', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000039', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000004', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000040', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000041', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000042', '02000000-0000-0000-0000-000000000010', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000043', '02000000-0000-0000-0000-000000000011', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000044', '02000000-0000-0000-0000-000000000011', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000045', '02000000-0000-0000-0000-000000000011', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000046', '02000000-0000-0000-0000-000000000012', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000047', '02000000-0000-0000-0000-000000000012', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000048', '02000000-0000-0000-0000-000000000012', '17000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000049', '02000000-0000-0000-0000-000000000012', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000050', '02000000-0000-0000-0000-000000000012', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000051', '02000000-0000-0000-0000-000000000012', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000052', '02000000-0000-0000-0000-000000000013', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000053', '02000000-0000-0000-0000-000000000014', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000054', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000055', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000056', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000003', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000057', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000004', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000058', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000005', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000059', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000006', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000060', '02000000-0000-0000-0000-000000000015', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000061', '02000000-0000-0000-0000-000000000016', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000062', '02000000-0000-0000-0000-000000000016', '17000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000063', '02000000-0000-0000-0000-000000000016', '17000000-0000-0000-0000-000000000007', CURRENT_TIMESTAMP),
  ('28000000-0000-0000-0000-000000000064', '02000000-0000-0000-0000-000000000017', '17000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 38. REFERRALS
-- ==============================================================
INSERT INTO referrals (id, referrer_id, referred_user_id, referral_code, status, referrer_points, referred_points, created_at)
VALUES
  ('0b000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000004', 'REF-001', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000006', 'REF-002', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000012', 'REF-003', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000015', 'REF-004', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000017', 'REF-005', 'pending', 0, 0, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000002', 'REF-006', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000009', 'REF-007', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000011', 'REF-008', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000013', 'REF-009', 'completed', 100, 50, CURRENT_TIMESTAMP),
  ('0b000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000016', 'REF-010', 'pending', 0, 0, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 39. VITAL_SIGNS
-- ==============================================================
INSERT INTO vital_signs (id, patient_id, measured_at, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature_celsius, oxygen_saturation, weight_kg, measured_by, created_at, updated_at, blood_glucose)
VALUES
  ('39000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '2025-01-01T10:00:00', 124, 75, 80, 36.42, 97, 80.84, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', '2025-01-02T10:00:00', 123, 83, 69, 37.33, 97, 66.02, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000001', '2025-01-03T10:00:00', 125, 86, 84, 36.76, 98, 72.05, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000001', '2025-01-04T10:00:00', 134, 76, 79, 37.1, 99, 68.73, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000001', '2025-01-05T10:00:00', 123, 71, 66, 36.5, 100, 85.12, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000001', '2025-01-06T10:00:00', 114, 86, 73, 37.23, 97, 88.51, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000001', '2025-01-07T10:00:00', 129, 76, 74, 36.78, 97, 66.72, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000001', '2025-01-08T10:00:00', 127, 87, 75, 37.08, 99, 68.16, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000001', '2025-01-09T10:00:00', 124, 90, 74, 36.25, 100, 87.73, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000001', '2025-01-10T10:00:00', 126, 76, 91, 37.37, 99, 89.09, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000002', '2025-01-01T10:00:00', 111, 70, 79, 36.6, 96, 79.75, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000002', '2025-01-02T10:00:00', 123, 81, 86, 36.39, 99, 59.24, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000002', '2025-01-03T10:00:00', 122, 84, 85, 36.43, 99, 80.88, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000002', '2025-01-04T10:00:00', 114, 70, 78, 36.26, 96, 76.99, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000002', '2025-01-05T10:00:00', 110, 85, 66, 36.5, 97, 69.92, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000002', '2025-01-06T10:00:00', 125, 83, 73, 37.28, 99, 60.59, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000002', '2025-01-07T10:00:00', 127, 74, 81, 36.24, 98, 68.9, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000002', '2025-01-08T10:00:00', 116, 87, 86, 36.26, 97, 55.74, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000002', '2025-01-09T10:00:00', 121, 75, 76, 37.4, 100, 59.05, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000002', '2025-01-10T10:00:00', 113, 84, 81, 36.48, 98, 78.95, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000006', '2025-01-01T10:00:00', 121, 88, 70, 36.34, 97, 56.82, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000006', '2025-01-02T10:00:00', 114, 87, 84, 36.71, 99, 76.47, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000006', '2025-01-03T10:00:00', 111, 83, 76, 36.57, 96, 86.66, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000006', '2025-01-04T10:00:00', 117, 84, 92, 37.37, 98, 74.26, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000006', '2025-01-05T10:00:00', 114, 74, 83, 36.64, 99, 82.37, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000006', '2025-01-06T10:00:00', 111, 82, 88, 37.3, 99, 86.05, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000006', '2025-01-07T10:00:00', 114, 83, 67, 36.81, 96, 83.57, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000006', '2025-01-08T10:00:00', 134, 77, 65, 37.14, 96, 74.05, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000006', '2025-01-09T10:00:00', 116, 70, 78, 37.12, 100, 79.0, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000006', '2025-01-10T10:00:00', 118, 86, 73, 37.24, 97, 88.42, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000008', '2025-01-01T10:00:00', 133, 89, 70, 36.32, 98, 57.44, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000008', '2025-01-02T10:00:00', 134, 78, 84, 36.76, 97, 85.57, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000008', '2025-01-03T10:00:00', 128, 74, 66, 36.37, 98, 87.78, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000008', '2025-01-04T10:00:00', 130, 84, 75, 36.52, 97, 81.06, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000008', '2025-01-05T10:00:00', 121, 90, 80, 37.32, 96, 59.52, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000036', '02000000-0000-0000-0000-000000000008', '2025-01-06T10:00:00', 126, 81, 75, 36.39, 100, 80.81, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000008', '2025-01-07T10:00:00', 116, 84, 66, 36.29, 99, 89.27, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000038', '02000000-0000-0000-0000-000000000008', '2025-01-08T10:00:00', 123, 84, 86, 37.29, 100, 86.8, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000039', '02000000-0000-0000-0000-000000000008', '2025-01-09T10:00:00', 128, 86, 88, 37.4, 97, 77.3, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000040', '02000000-0000-0000-0000-000000000008', '2025-01-10T10:00:00', 110, 84, 90, 36.98, 96, 71.37, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000041', '02000000-0000-0000-0000-000000000010', '2025-01-01T10:00:00', 121, 74, 76, 36.96, 100, 81.04, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000042', '02000000-0000-0000-0000-000000000010', '2025-01-02T10:00:00', 126, 83, 83, 36.53, 100, 85.1, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000043', '02000000-0000-0000-0000-000000000010', '2025-01-03T10:00:00', 125, 73, 81, 37.06, 96, 82.07, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000044', '02000000-0000-0000-0000-000000000010', '2025-01-04T10:00:00', 133, 90, 82, 37.15, 97, 61.15, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000045', '02000000-0000-0000-0000-000000000010', '2025-01-05T10:00:00', 124, 75, 74, 36.93, 100, 76.95, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000046', '02000000-0000-0000-0000-000000000010', '2025-01-06T10:00:00', 132, 87, 91, 36.99, 96, 72.29, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000047', '02000000-0000-0000-0000-000000000010', '2025-01-07T10:00:00', 132, 77, 71, 36.7, 96, 79.19, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000048', '02000000-0000-0000-0000-000000000010', '2025-01-08T10:00:00', 116, 70, 80, 36.52, 97, 88.2, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000049', '02000000-0000-0000-0000-000000000010', '2025-01-09T10:00:00', 119, 90, 78, 37.03, 99, 82.85, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000050', '02000000-0000-0000-0000-000000000010', '2025-01-10T10:00:00', 122, 78, 83, 37.16, 98, 81.8, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000051', '02000000-0000-0000-0000-000000000015', '2025-01-01T10:00:00', 110, 90, 79, 36.93, 98, 74.86, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000052', '02000000-0000-0000-0000-000000000015', '2025-01-02T10:00:00', 121, 81, 75, 36.42, 100, 73.84, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000053', '02000000-0000-0000-0000-000000000015', '2025-01-03T10:00:00', 111, 84, 86, 37.04, 99, 68.37, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000054', '02000000-0000-0000-0000-000000000015', '2025-01-04T10:00:00', 113, 83, 82, 37.29, 97, 57.05, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000055', '02000000-0000-0000-0000-000000000015', '2025-01-05T10:00:00', 130, 79, 65, 36.51, 96, 86.06, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000056', '02000000-0000-0000-0000-000000000015', '2025-01-06T10:00:00', 122, 86, 76, 37.4, 97, 73.56, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000057', '02000000-0000-0000-0000-000000000015', '2025-01-07T10:00:00', 110, 79, 89, 37.39, 97, 69.05, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000058', '02000000-0000-0000-0000-000000000015', '2025-01-08T10:00:00', 111, 89, 76, 37.04, 97, 85.61, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000059', '02000000-0000-0000-0000-000000000015', '2025-01-09T10:00:00', 111, 76, 65, 37.34, 96, 75.33, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('39000000-0000-0000-0000-000000000060', '02000000-0000-0000-0000-000000000015', '2025-01-10T10:00:00', 132, 84, 81, 36.82, 98, 81.46, 'self', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 40. ACTIVITY_TRACKING
-- ==============================================================
INSERT INTO activity_tracking (id, patient_id, date, steps, distance_km, calories_burned, active_minutes, floors_climbed, source, created_at, updated_at)
VALUES
  ('0a000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '2025-01-01', 12584, 3.05, 443, 39, 5, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', '2025-01-02', 12495, 4.82, 279, 34, 6, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000001', '2025-01-03', 8810, 5.96, 295, 55, 8, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000001', '2025-01-04', 4839, 2.74, 307, 33, 2, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000001', '2025-01-05', 8358, 5.02, 456, 61, 2, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000001', '2025-01-06', 6950, 7.97, 513, 23, 5, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000001', '2025-01-07', 6566, 6.75, 536, 44, 9, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000001', '2025-01-08', 14140, 2.79, 269, 33, 14, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000001', '2025-01-09', 12966, 8.48, 267, 22, 2, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000001', '2025-01-10', 8327, 4.31, 479, 63, 8, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000001', '2025-01-11', 4796, 5.81, 255, 25, 9, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000001', '2025-01-12', 13634, 7.2, 275, 89, 9, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000001', '2025-01-13', 4678, 9.73, 391, 75, 3, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000001', '2025-01-14', 9901, 4.48, 192, 90, 8, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000006', '2025-01-01', 12945, 8.8, 366, 78, 12, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000006', '2025-01-02', 13743, 3.31, 285, 38, 9, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000006', '2025-01-03', 14438, 8.77, 197, 46, 9, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000006', '2025-01-04', 4957, 7.47, 538, 75, 2, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000006', '2025-01-05', 13173, 6.37, 375, 65, 13, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000006', '2025-01-06', 7292, 2.35, 487, 51, 5, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000006', '2025-01-07', 12352, 3.29, 525, 70, 2, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000006', '2025-01-08', 14924, 2.42, 497, 58, 12, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000006', '2025-01-09', 7879, 7.76, 493, 23, 2, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000006', '2025-01-10', 5571, 2.42, 236, 53, 12, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000006', '2025-01-11', 5062, 3.57, 168, 58, 15, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000006', '2025-01-12', 4510, 5.14, 434, 20, 14, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000006', '2025-01-13', 3352, 6.72, 402, 26, 12, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000006', '2025-01-14', 9101, 7.25, 173, 87, 8, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000008', '2025-01-01', 11311, 7.28, 127, 66, 8, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000008', '2025-01-02', 8959, 6.41, 516, 45, 11, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000008', '2025-01-03', 14254, 9.59, 169, 77, 1, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000008', '2025-01-04', 11910, 5.65, 505, 38, 5, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000008', '2025-01-05', 13277, 9.32, 345, 77, 13, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000008', '2025-01-06', 6052, 6.57, 290, 40, 6, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000008', '2025-01-07', 4291, 4.75, 321, 79, 6, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000036', '02000000-0000-0000-0000-000000000008', '2025-01-08', 10981, 3.89, 595, 38, 7, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000008', '2025-01-09', 8107, 5.74, 237, 64, 8, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000038', '02000000-0000-0000-0000-000000000008', '2025-01-10', 12258, 5.68, 333, 66, 6, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000039', '02000000-0000-0000-0000-000000000008', '2025-01-11', 9672, 3.65, 579, 48, 9, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000040', '02000000-0000-0000-0000-000000000008', '2025-01-12', 5030, 9.57, 326, 70, 11, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000041', '02000000-0000-0000-0000-000000000008', '2025-01-13', 11319, 8.11, 442, 58, 10, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000042', '02000000-0000-0000-0000-000000000008', '2025-01-14', 7415, 7.41, 232, 86, 11, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000043', '02000000-0000-0000-0000-000000000010', '2025-01-01', 3292, 7.57, 582, 82, 14, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000044', '02000000-0000-0000-0000-000000000010', '2025-01-02', 8445, 7.27, 251, 39, 13, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000045', '02000000-0000-0000-0000-000000000010', '2025-01-03', 6946, 2.78, 183, 26, 3, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000046', '02000000-0000-0000-0000-000000000010', '2025-01-04', 9881, 6.66, 473, 81, 2, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000047', '02000000-0000-0000-0000-000000000010', '2025-01-05', 11449, 8.05, 362, 39, 11, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000048', '02000000-0000-0000-0000-000000000010', '2025-01-06', 8338, 7.77, 395, 70, 12, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000049', '02000000-0000-0000-0000-000000000010', '2025-01-07', 11403, 8.05, 223, 67, 14, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000050', '02000000-0000-0000-0000-000000000010', '2025-01-08', 4936, 2.3, 261, 89, 4, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000051', '02000000-0000-0000-0000-000000000010', '2025-01-09', 8772, 4.67, 291, 79, 11, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000052', '02000000-0000-0000-0000-000000000010', '2025-01-10', 11933, 5.69, 177, 85, 2, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000053', '02000000-0000-0000-0000-000000000010', '2025-01-11', 9945, 2.0, 452, 27, 0, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000054', '02000000-0000-0000-0000-000000000010', '2025-01-12', 14959, 4.51, 160, 66, 14, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000055', '02000000-0000-0000-0000-000000000010', '2025-01-13', 8822, 8.45, 247, 31, 7, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000056', '02000000-0000-0000-0000-000000000010', '2025-01-14', 10315, 6.48, 275, 73, 0, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000057', '02000000-0000-0000-0000-000000000015', '2025-01-01', 11141, 2.95, 265, 65, 11, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000058', '02000000-0000-0000-0000-000000000015', '2025-01-02', 6020, 7.03, 372, 24, 2, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000059', '02000000-0000-0000-0000-000000000015', '2025-01-03', 9517, 9.15, 331, 49, 3, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000060', '02000000-0000-0000-0000-000000000015', '2025-01-04', 13925, 9.07, 522, 32, 13, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000061', '02000000-0000-0000-0000-000000000015', '2025-01-05', 11596, 6.11, 575, 80, 1, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000062', '02000000-0000-0000-0000-000000000015', '2025-01-06', 8411, 4.24, 136, 57, 3, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000063', '02000000-0000-0000-0000-000000000015', '2025-01-07', 4746, 4.25, 201, 69, 6, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000064', '02000000-0000-0000-0000-000000000015', '2025-01-08', 3745, 8.72, 386, 80, 14, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000065', '02000000-0000-0000-0000-000000000015', '2025-01-09', 14360, 6.18, 433, 87, 14, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000066', '02000000-0000-0000-0000-000000000015', '2025-01-10', 7031, 3.25, 561, 73, 9, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000067', '02000000-0000-0000-0000-000000000015', '2025-01-11', 7742, 5.48, 522, 80, 7, 'google_fit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000068', '02000000-0000-0000-0000-000000000015', '2025-01-12', 6714, 5.48, 255, 57, 13, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000069', '02000000-0000-0000-0000-000000000015', '2025-01-13', 4403, 3.32, 435, 48, 4, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0a000000-0000-0000-0000-000000000070', '02000000-0000-0000-0000-000000000015', '2025-01-14', 12612, 8.91, 256, 48, 3, 'healthkit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 41. HYDRATION_TRACKING
-- ==============================================================
INSERT INTO hydration_tracking (id, patient_id, date, water_ml, goal_ml, created_at, updated_at)
VALUES
  ('1a000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '2025-01-01', 1165, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', '2025-01-02', 2552, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000001', '2025-01-03', 1683, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000001', '2025-01-04', 842, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000001', '2025-01-05', 1496, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000001', '2025-01-06', 1787, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000001', '2025-01-07', 1567, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000001', '2025-01-08', 2069, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000001', '2025-01-09', 2299, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000001', '2025-01-10', 991, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000002', '2025-01-01', 861, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000002', '2025-01-02', 1532, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000002', '2025-01-03', 1548, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000002', '2025-01-04', 2302, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000002', '2025-01-05', 1768, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000002', '2025-01-06', 1663, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000002', '2025-01-07', 1892, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000002', '2025-01-08', 2067, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000002', '2025-01-09', 957, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000002', '2025-01-10', 2353, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000006', '2025-01-01', 2430, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000006', '2025-01-02', 1369, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000006', '2025-01-03', 1147, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000006', '2025-01-04', 1503, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000006', '2025-01-05', 895, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000006', '2025-01-06', 812, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000006', '2025-01-07', 1180, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000006', '2025-01-08', 1296, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000006', '2025-01-09', 2141, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000006', '2025-01-10', 1045, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000008', '2025-01-01', 1715, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000008', '2025-01-02', 869, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000008', '2025-01-03', 1986, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000008', '2025-01-04', 1637, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000008', '2025-01-05', 1127, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000036', '02000000-0000-0000-0000-000000000008', '2025-01-06', 1268, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000008', '2025-01-07', 2280, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000038', '02000000-0000-0000-0000-000000000008', '2025-01-08', 948, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000039', '02000000-0000-0000-0000-000000000008', '2025-01-09', 1068, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000040', '02000000-0000-0000-0000-000000000008', '2025-01-10', 1618, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000041', '02000000-0000-0000-0000-000000000015', '2025-01-01', 2538, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000042', '02000000-0000-0000-0000-000000000015', '2025-01-02', 2148, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000043', '02000000-0000-0000-0000-000000000015', '2025-01-03', 1870, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000044', '02000000-0000-0000-0000-000000000015', '2025-01-04', 1645, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000045', '02000000-0000-0000-0000-000000000015', '2025-01-05', 1966, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000046', '02000000-0000-0000-0000-000000000015', '2025-01-06', 1597, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000047', '02000000-0000-0000-0000-000000000015', '2025-01-07', 853, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000048', '02000000-0000-0000-0000-000000000015', '2025-01-08', 1425, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000049', '02000000-0000-0000-0000-000000000015', '2025-01-09', 2147, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('1a000000-0000-0000-0000-000000000050', '02000000-0000-0000-0000-000000000015', '2025-01-10', 2188, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 42. NUTRITION_PROFILES
-- ==============================================================
INSERT INTO nutrition_profiles (id, patient_id, height_cm, weight_kg, target_weight_kg, activity_level, goal, daily_calories, daily_protein_g, daily_carbs_g, daily_fat_g, daily_water_ml, created_at, updated_at, daily_fiber_g, dietary_restrictions, food_allergies)
VALUES
  ('2a000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', 175, 82, 78, 'moderate', 'weight_loss', 2200, 120, 250, 70, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, ARRAY[]::text[], ARRAY[]::text[]),
  ('2a000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000006', 162, 58, 57, 'light', 'maintain_weight', 1800, 100, 200, 55, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, ARRAY[]::text[], ARRAY[]::text[]),
  ('2a000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000008', 168, 72, 68, 'active', 'weight_loss', 1900, 130, 220, 60, 2200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, ARRAY[]::text[], ARRAY[]::text[]),
  ('2a000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000010', 155, 50, 52, 'very_active', 'muscle_gain', 2000, 140, 240, 65, 2200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, ARRAY[]::text[], ARRAY[]::text[]),
  ('2a000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000015', 178, 95, 85, 'sedentary', 'weight_loss', 1800, 100, 200, 50, 2500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, ARRAY[]::text[], ARRAY[]::text[])
ON CONFLICT DO NOTHING;

INSERT INTO nutrition_tracking (id, patient_id, date, meal_type, food_name, calories, protein_g, carbs_g, fat_g, created_at, updated_at, fiber_g, sodium_mg, sugar_g)
VALUES
  ('3a000000-0000-0000-0000-000000000001', '02000000-0000-0000-0000-000000000001', '2025-01-01', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000002', '02000000-0000-0000-0000-000000000001', '2025-01-01', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000003', '02000000-0000-0000-0000-000000000001', '2025-01-01', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000004', '02000000-0000-0000-0000-000000000001', '2025-01-01', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000005', '02000000-0000-0000-0000-000000000001', '2025-01-02', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000006', '02000000-0000-0000-0000-000000000001', '2025-01-02', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000001', '2025-01-02', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000008', '02000000-0000-0000-0000-000000000001', '2025-01-02', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000009', '02000000-0000-0000-0000-000000000001', '2025-01-03', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000010', '02000000-0000-0000-0000-000000000001', '2025-01-03', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000001', '2025-01-03', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000012', '02000000-0000-0000-0000-000000000001', '2025-01-03', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000013', '02000000-0000-0000-0000-000000000001', '2025-01-04', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000014', '02000000-0000-0000-0000-000000000001', '2025-01-04', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000015', '02000000-0000-0000-0000-000000000001', '2025-01-04', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000016', '02000000-0000-0000-0000-000000000001', '2025-01-04', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000017', '02000000-0000-0000-0000-000000000001', '2025-01-05', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000018', '02000000-0000-0000-0000-000000000001', '2025-01-05', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000019', '02000000-0000-0000-0000-000000000001', '2025-01-05', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000001', '2025-01-05', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000006', '2025-01-01', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000022', '02000000-0000-0000-0000-000000000006', '2025-01-01', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000023', '02000000-0000-0000-0000-000000000006', '2025-01-01', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000024', '02000000-0000-0000-0000-000000000006', '2025-01-01', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000006', '2025-01-02', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000006', '2025-01-02', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000027', '02000000-0000-0000-0000-000000000006', '2025-01-02', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000028', '02000000-0000-0000-0000-000000000006', '2025-01-02', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000029', '02000000-0000-0000-0000-000000000006', '2025-01-03', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000030', '02000000-0000-0000-0000-000000000006', '2025-01-03', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000031', '02000000-0000-0000-0000-000000000006', '2025-01-03', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000032', '02000000-0000-0000-0000-000000000006', '2025-01-03', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000033', '02000000-0000-0000-0000-000000000006', '2025-01-04', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000034', '02000000-0000-0000-0000-000000000006', '2025-01-04', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000035', '02000000-0000-0000-0000-000000000006', '2025-01-04', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000036', '02000000-0000-0000-0000-000000000006', '2025-01-04', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000006', '2025-01-05', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000038', '02000000-0000-0000-0000-000000000006', '2025-01-05', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000039', '02000000-0000-0000-0000-000000000006', '2025-01-05', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000040', '02000000-0000-0000-0000-000000000006', '2025-01-05', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000041', '02000000-0000-0000-0000-000000000008', '2025-01-01', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000042', '02000000-0000-0000-0000-000000000008', '2025-01-01', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000043', '02000000-0000-0000-0000-000000000008', '2025-01-01', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000044', '02000000-0000-0000-0000-000000000008', '2025-01-01', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000045', '02000000-0000-0000-0000-000000000008', '2025-01-02', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000046', '02000000-0000-0000-0000-000000000008', '2025-01-02', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000047', '02000000-0000-0000-0000-000000000008', '2025-01-02', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000048', '02000000-0000-0000-0000-000000000008', '2025-01-02', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000049', '02000000-0000-0000-0000-000000000008', '2025-01-03', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000050', '02000000-0000-0000-0000-000000000008', '2025-01-03', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000051', '02000000-0000-0000-0000-000000000008', '2025-01-03', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000052', '02000000-0000-0000-0000-000000000008', '2025-01-03', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000053', '02000000-0000-0000-0000-000000000008', '2025-01-04', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000054', '02000000-0000-0000-0000-000000000008', '2025-01-04', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000055', '02000000-0000-0000-0000-000000000008', '2025-01-04', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000056', '02000000-0000-0000-0000-000000000008', '2025-01-04', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000057', '02000000-0000-0000-0000-000000000008', '2025-01-05', 'breakfast', 'Oeufs et pain complet', 350, 20, 30, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000058', '02000000-0000-0000-0000-000000000008', '2025-01-05', 'lunch', 'Couscous au poulet', 650, 35, 80, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000059', '02000000-0000-0000-0000-000000000008', '2025-01-05', 'dinner', 'Salade tunisienne avec thon', 400, 25, 20, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00),
  ('3a000000-0000-0000-0000-000000000060', '02000000-0000-0000-0000-000000000008', '2025-01-05', 'snack', 'Yaourt nature et fruits', 180, 10, 25, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0.00, 0, 0.00)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 43. MARKETING_CAMPAIGNS
-- ==============================================================
INSERT INTO marketing_campaigns (id, provider_id, name, campaign_type, objective, status, start_date, end_date, budget, headline, description, created_at, updated_at, clicks, conversions, cta_text, impressions, spent_amount, target_gender)
VALUES
  ('0f000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 'Campagne Santé Hiver', 'promotion', 'awareness', 'active', '2025-01-01', '2025-03-31', 500.0, 'Bilan santé hivernal', 'Profitez de notre bilan santé complet avant le printemps !', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000005', 'Offre Kiné Spéciale', 'promotion', 'bookings', 'draft', '2025-04-01', '2025-05-31', 200.0, 'Rééducation 1ère séance -20%', 'Réservez votre première séance à -20% !', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000003', 'Ramadan Soins à domicile', 'promotion', 'awareness', 'active', '2025-03-10', '2025-04-15', 150.0, 'Soins infirmiers Ramadan', 'Disponible tous les jours pendant Ramadan.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000002', 'Consultation Seniors -15%', 'promotion', 'bookings', 'active', '2025-05-01', '2025-06-30', 300.0, 'Spécial Seniors', '15% de réduction pour les patients de plus de 65 ans.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000007', 'Lancement Labo Domicile', 'promotion', 'awareness', 'completed', '2025-01-15', '2025-02-15', 100.0, 'Nouveau service lab', 'Prélèvements à domicile disponibles maintenant !', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000010', 'Consultation Psy Gratuite', 'promotion', 'bookings', 'active', '2025-06-01', '2025-07-31', 250.0, 'Première séance offerte', 'Réservez votre première consultation psychologique gratuitement.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000012', 'Aide à domicile senior', 'promotion', 'awareness', 'active', '2025-04-01', '2025-12-31', 400.0, 'Accompagnement senior', 'Services d''aide à la personne pour seniors dépendants.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, ''),
  ('0f000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000001', 'Journée Cardiologie', 'event', 'awareness', 'completed', '2025-02-14', '2025-02-14', 50.0, 'Bilan cardio gratuit', '14 février : consultation cardio offerte pour tous.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, 0, '', 0, 0.00, '')
ON CONFLICT DO NOTHING;

INSERT INTO campaign_performance (id, campaign_id, date, impressions, clicks, conversions, spent_amount, created_at)
VALUES
  ('1f000000-0000-0000-0000-000000000001', '0f000000-0000-0000-0000-000000000001', '2025-01-01', 376, 93, 13, 26.01, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000002', '0f000000-0000-0000-0000-000000000001', '2025-01-02', 576, 36, 9, 25.95, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000003', '0f000000-0000-0000-0000-000000000001', '2025-01-03', 690, 44, 4, 21.75, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000004', '0f000000-0000-0000-0000-000000000001', '2025-01-04', 662, 75, 7, 15.28, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000005', '0f000000-0000-0000-0000-000000000001', '2025-01-05', 164, 15, 9, 25.8, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000006', '0f000000-0000-0000-0000-000000000001', '2025-01-06', 384, 43, 15, 13.52, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000007', '0f000000-0000-0000-0000-000000000001', '2025-01-07', 275, 29, 12, 29.37, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000008', '0f000000-0000-0000-0000-000000000002', '2025-01-01', 462, 87, 1, 29.37, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000009', '0f000000-0000-0000-0000-000000000002', '2025-01-02', 347, 43, 10, 19.7, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000010', '0f000000-0000-0000-0000-000000000002', '2025-01-03', 432, 89, 11, 18.05, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000011', '0f000000-0000-0000-0000-000000000002', '2025-01-04', 153, 89, 7, 25.37, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000012', '0f000000-0000-0000-0000-000000000002', '2025-01-05', 442, 29, 10, 19.45, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000013', '0f000000-0000-0000-0000-000000000002', '2025-01-06', 633, 25, 14, 21.25, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000014', '0f000000-0000-0000-0000-000000000002', '2025-01-07', 245, 38, 1, 21.09, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000015', '0f000000-0000-0000-0000-000000000003', '2025-01-01', 448, 57, 5, 26.9, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000016', '0f000000-0000-0000-0000-000000000003', '2025-01-02', 344, 67, 1, 25.54, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000017', '0f000000-0000-0000-0000-000000000003', '2025-01-03', 220, 10, 13, 23.8, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000018', '0f000000-0000-0000-0000-000000000003', '2025-01-04', 731, 88, 8, 22.84, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000019', '0f000000-0000-0000-0000-000000000003', '2025-01-05', 587, 36, 12, 10.85, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000020', '0f000000-0000-0000-0000-000000000003', '2025-01-06', 163, 63, 7, 15.97, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000021', '0f000000-0000-0000-0000-000000000003', '2025-01-07', 700, 76, 2, 23.6, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000022', '0f000000-0000-0000-0000-000000000004', '2025-01-01', 574, 74, 1, 15.2, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000023', '0f000000-0000-0000-0000-000000000004', '2025-01-02', 447, 61, 8, 21.88, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000024', '0f000000-0000-0000-0000-000000000004', '2025-01-03', 165, 37, 4, 21.56, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000025', '0f000000-0000-0000-0000-000000000004', '2025-01-04', 347, 35, 11, 19.42, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000026', '0f000000-0000-0000-0000-000000000004', '2025-01-05', 544, 54, 5, 27.87, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000027', '0f000000-0000-0000-0000-000000000004', '2025-01-06', 747, 38, 9, 17.12, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000028', '0f000000-0000-0000-0000-000000000004', '2025-01-07', 169, 31, 6, 19.43, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000029', '0f000000-0000-0000-0000-000000000005', '2025-01-01', 236, 76, 15, 16.69, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000030', '0f000000-0000-0000-0000-000000000005', '2025-01-02', 637, 38, 13, 15.9, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000031', '0f000000-0000-0000-0000-000000000005', '2025-01-03', 282, 98, 8, 25.57, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000032', '0f000000-0000-0000-0000-000000000005', '2025-01-04', 707, 27, 10, 27.25, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000033', '0f000000-0000-0000-0000-000000000005', '2025-01-05', 224, 31, 10, 21.81, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000034', '0f000000-0000-0000-0000-000000000005', '2025-01-06', 478, 28, 6, 23.49, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000035', '0f000000-0000-0000-0000-000000000005', '2025-01-07', 707, 45, 15, 28.32, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000036', '0f000000-0000-0000-0000-000000000006', '2025-01-01', 280, 77, 5, 13.97, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000037', '0f000000-0000-0000-0000-000000000006', '2025-01-02', 620, 49, 3, 24.64, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000038', '0f000000-0000-0000-0000-000000000006', '2025-01-03', 382, 50, 10, 15.25, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000039', '0f000000-0000-0000-0000-000000000006', '2025-01-04', 705, 64, 14, 26.52, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000040', '0f000000-0000-0000-0000-000000000006', '2025-01-05', 726, 50, 15, 13.78, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000041', '0f000000-0000-0000-0000-000000000006', '2025-01-06', 254, 58, 12, 20.48, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000042', '0f000000-0000-0000-0000-000000000006', '2025-01-07', 516, 66, 4, 28.05, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000043', '0f000000-0000-0000-0000-000000000007', '2025-01-01', 722, 84, 10, 11.81, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000044', '0f000000-0000-0000-0000-000000000007', '2025-01-02', 305, 50, 2, 14.74, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000045', '0f000000-0000-0000-0000-000000000007', '2025-01-03', 150, 94, 1, 13.29, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000046', '0f000000-0000-0000-0000-000000000007', '2025-01-04', 462, 95, 14, 21.98, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000047', '0f000000-0000-0000-0000-000000000007', '2025-01-05', 535, 58, 8, 29.78, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000048', '0f000000-0000-0000-0000-000000000007', '2025-01-06', 529, 24, 5, 12.75, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000049', '0f000000-0000-0000-0000-000000000007', '2025-01-07', 254, 66, 1, 14.82, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000050', '0f000000-0000-0000-0000-000000000008', '2025-01-01', 330, 43, 11, 13.44, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000051', '0f000000-0000-0000-0000-000000000008', '2025-01-02', 528, 79, 3, 21.1, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000052', '0f000000-0000-0000-0000-000000000008', '2025-01-03', 385, 46, 3, 14.64, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000053', '0f000000-0000-0000-0000-000000000008', '2025-01-04', 575, 34, 10, 26.34, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000054', '0f000000-0000-0000-0000-000000000008', '2025-01-05', 410, 82, 2, 15.4, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000055', '0f000000-0000-0000-0000-000000000008', '2025-01-06', 222, 56, 1, 22.51, CURRENT_TIMESTAMP),
  ('1f000000-0000-0000-0000-000000000056', '0f000000-0000-0000-0000-000000000008', '2025-01-07', 744, 38, 7, 20.34, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 44. INSURANCE_CLAIMS
-- ==============================================================
INSERT INTO insurance_claims (id, claim_number, provider_id, booking_id, patient_name, patient_insurance_provider, patient_insurance_number, service_date, service_description, diagnosis_codes, procedure_codes, claimed_amount, status, created_at, updated_at, approved_amount, paid_amount, submitted_at, reviewed_at, approved_at, paid_at, rejection_reason, reviewer_notes, invoice_url, medical_report_url, supporting_documents)
VALUES
  ('2f000000-0000-0000-0000-000000000001', 'CLM-2025-0001', '12000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000001', 'Ahmed Ben Ali', 'CNAM', 'CNAM-10001', '2025-01-20', 'Consultation Générale', ARRAY['D001.9', 'R001.0']::text[], ARRAY['P001A']::text[], 80.00, 'paid', '2025-01-22 09:45:00+01', '2025-01-29 11:45:00+01', 80.00, 80.00, '2025-01-22 11:45:00+01', '2025-01-24 11:45:00+01', '2025-01-25 11:45:00+01', '2025-01-29 11:45:00+01', NULL, 'Documents complete and coding verified.', 'https://storage.sanad.tn/claims/0001/invoice.pdf', 'https://storage.sanad.tn/claims/0001/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0001/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000002', 'CLM-2025-0002', '12000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000002', 'Fatma Trabelsi', 'CNSS', 'CNSS-10002', '2025-01-21', 'Injection et Perfusion', ARRAY['D002.9', 'R002.0']::text[], ARRAY['P002A']::text[], 35.00, 'submitted', '2025-01-23 10:30:00+01', '2025-01-23 12:30:00+01', 0.00, 0.00, '2025-01-23 12:30:00+01', NULL, NULL, NULL, NULL, 'Initial submission queued for processing.', 'https://storage.sanad.tn/claims/0002/invoice.pdf', 'https://storage.sanad.tn/claims/0002/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0002/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000003', 'CLM-2025-0003', '12000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000009', 'Nour Ben Hassen', 'CNAM', 'CNAM-10003', '2025-02-15', 'Rééducation Motrice', ARRAY['D003.9', 'R003.0']::text[], ARRAY['P003A']::text[], 60.00, 'under_review', '2025-02-17 16:00:00+01', '2025-02-19 18:00:00+01', 42.00, 0.00, '2025-02-17 18:00:00+01', '2025-02-19 18:00:00+01', NULL, NULL, NULL, 'Waiting for insurer confirmation on tariff coverage.', 'https://storage.sanad.tn/claims/0003/invoice.pdf', 'https://storage.sanad.tn/claims/0003/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0003/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000004', 'CLM-2025-0004', '12000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000011', 'Ahmed Ben Ali', 'CNSS', 'CNSS-10004', '2025-03-01', 'ECG + Consultation', ARRAY['D004.9', 'R004.0']::text[], ARRAY['P004A']::text[], 93.50, 'approved', '2025-03-03 10:20:00+01', '2025-03-06 12:20:00+01', 93.50, 0.00, '2025-03-03 12:20:00+01', '2025-03-05 12:20:00+01', '2025-03-06 12:20:00+01', NULL, NULL, 'Documents complete and coding verified.', 'https://storage.sanad.tn/claims/0004/invoice.pdf', 'https://storage.sanad.tn/claims/0004/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0004/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000005', 'CLM-2025-0005', '12000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000013', 'Ines Chaabane', 'CNAM', 'CNAM-10005', '2025-03-08', 'Visite Sage-Femme Post-Partum', ARRAY['D005.9', 'R005.0']::text[], ARRAY['P005A']::text[], 85.00, 'paid', '2025-03-10 11:15:00+01', '2025-03-17 13:15:00+01', 85.00, 85.00, '2025-03-10 13:15:00+01', '2025-03-12 13:15:00+01', '2025-03-13 13:15:00+01', '2025-03-17 13:15:00+01', NULL, 'Documents complete and coding verified.', 'https://storage.sanad.tn/claims/0005/invoice.pdf', 'https://storage.sanad.tn/claims/0005/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0005/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000006', 'CLM-2025-0006', '12000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000015', 'Mariem Laabidi', 'CNSS', 'CNSS-10006', '2025-03-12', 'Consultation Pédiatrique', ARRAY['D006.9', 'R006.0']::text[], ARRAY['P006A']::text[], 75.00, 'approved', '2025-03-14 09:40:00+01', '2025-03-17 11:40:00+01', 75.00, 0.00, '2025-03-14 11:40:00+01', '2025-03-16 11:40:00+01', '2025-03-17 11:40:00+01', NULL, NULL, 'Documents complete and coding verified.', 'https://storage.sanad.tn/claims/0006/invoice.pdf', 'https://storage.sanad.tn/claims/0006/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0006/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000007', 'CLM-2025-0007', '12000000-0000-0000-0000-000000000007', '03000000-0000-0000-0000-000000000017', 'Fatma Trabelsi', 'CNAM', 'CNAM-10007', '2025-03-18', 'Prélèvement Urinaire', ARRAY['D007.9', 'R007.0']::text[], ARRAY['P007A']::text[], 30.00, 'submitted', '2025-03-20 08:15:00+01', '2025-03-20 10:15:00+01', 0.00, 0.00, '2025-03-20 10:15:00+01', NULL, NULL, NULL, NULL, 'Initial submission queued for processing.', 'https://storage.sanad.tn/claims/0007/invoice.pdf', 'https://storage.sanad.tn/claims/0007/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0007/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000008', 'CLM-2025-0008', '12000000-0000-0000-0000-000000000010', '03000000-0000-0000-0000-000000000018', 'Salma Khelifi', 'CNSS', 'CNSS-10008', '2025-03-20', 'Thérapie de Couple', ARRAY['D008.9', 'R008.0']::text[], ARRAY['P008A']::text[], 100.00, 'rejected', '2025-03-22 16:00:00+01', '2025-03-24 18:00:00+01', 0.00, 0.00, '2025-03-22 18:00:00+01', '2025-03-24 18:00:00+01', NULL, NULL, 'Coverage excludes psychological counseling without prior authorization.', 'Initial submission queued for processing.', 'https://storage.sanad.tn/claims/0008/invoice.pdf', 'https://storage.sanad.tn/claims/0008/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0008/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000009', 'CLM-2025-0009', '12000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000033', 'Asma Riahi', 'CNAM', 'CNAM-10009', '2025-04-28', 'Injection et Perfusion', ARRAY['D009.9', 'R009.0']::text[], ARRAY['P009A']::text[], 35.00, 'submitted', '2025-04-30 09:30:00+01', '2025-04-30 11:30:00+01', 0.00, 0.00, '2025-04-30 11:30:00+01', NULL, NULL, NULL, NULL, 'Initial submission queued for processing.', 'https://storage.sanad.tn/claims/0009/invoice.pdf', 'https://storage.sanad.tn/claims/0009/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0009/supporting-1.pdf']::text[]),
  ('2f000000-0000-0000-0000-000000000010', 'CLM-2025-0010', '12000000-0000-0000-0000-000000000013', '03000000-0000-0000-0000-000000000036', 'Wafa Souissi', 'CNSS', 'CNSS-10010', '2025-05-07', 'Suivi Diabete et Hypertension', ARRAY['D010.9', 'R010.0']::text[], ARRAY['P010A']::text[], 65.00, 'paid', '2025-05-09 10:20:00+01', '2025-05-16 12:20:00+01', 65.00, 65.00, '2025-05-09 12:20:00+01', '2025-05-11 12:20:00+01', '2025-05-12 12:20:00+01', '2025-05-16 12:20:00+01', NULL, 'Documents complete and coding verified.', 'https://storage.sanad.tn/claims/0010/invoice.pdf', 'https://storage.sanad.tn/claims/0010/medical-report.pdf', ARRAY['https://storage.sanad.tn/claims/0010/supporting-1.pdf']::text[])
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 45. AMBULANCE_BOOKINGS
-- ==============================================================
INSERT INTO ambulance_bookings (id, booking_id, service_type, pickup_address, pickup_latitude, pickup_longitude, pickup_contact_name, pickup_contact_phone, destination_address, destination_latitude, destination_longitude, destination_facility_name, patient_condition, requires_stretcher, requires_oxygen, requires_medical_staff, vehicle_type, created_at, updated_at, driver_name, medic_name, vehicle_registration, requested_pickup_time, actual_pickup_time, actual_arrival_time, estimated_distance_km, actual_distance_km)
VALUES
  ('40000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000014', 'scheduled_transfer', '90 Rue de la République, Ariana', 36.874100, 10.161850, 'Bilel Hamrouni', '+21650100009', 'Clinique El Manar, Tunis', 36.896100, 10.180850, 'Clinique El Manar', 'Post-operative follow-up', false, false, false, 'BLS', '2025-03-04 10:00:00+01', '2025-03-10 15:15:00+01', 'Nabil Cherif', 'Houssem Tlatli', 'TU-214587', '2025-03-10 13:15:00+01', '2025-03-10 13:55:00+01', '2025-03-10 15:00:00+01', 9.40, 9.10),
  ('40000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000034', 'emergency_transfer', '130 Rue de la République, Mahdia', 35.500000, 11.041850, 'Firas Dridi', '+21650100013', 'Hopital Hedi Chaker, Sfax', 35.522000, 11.060850, 'Hopital Hedi Chaker', 'Acute chest pain', true, true, true, 'ALS', '2025-04-24 09:00:00+01', '2025-05-02 14:15:00+01', 'Walid Ayari', 'Sonia Ghribi', 'SF-998421', '2025-05-02 12:15:00+01', '2025-05-02 12:55:00+01', '2025-05-02 14:00:00+01', 6.80, 7.20),
  ('40000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000059', 'scheduled_transfer', '60 Rue de la République, Nabeul', 36.454100, 10.745550, 'Nour Ben Hassen', '+21650100006', 'Centre Dialyse Nabeul', 36.476100, 10.764550, 'Centre Dialyse Nabeul', 'Dialysis session transfer', false, true, false, 'BLS', '2025-07-01 09:00:00+01', '2025-07-10 13:28:00+01', 'Hatem Siala', 'Mohamed Khlifi', 'NB-440127', '2025-07-10 13:15:00+01', NULL, NULL, 12.30, 0.00),
  ('40000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000088', 'emergency_transfer', '10 Rue de la République, Tunis', 36.810000, 10.174450, 'Lamine Ben Ali', '+21650100001', 'Clinique Taoufik, Tunis', 36.832000, 10.193450, 'Clinique Taoufik', 'Respiratory distress transfer', true, true, true, 'ALS', '2025-09-20 11:00:00+01', '2025-09-28 14:15:00+01', 'Seif Messaoud', 'Rania Ben Salem', 'TU-556812', '2025-09-28 12:15:00+01', '2025-09-28 12:55:00+01', '2025-09-28 14:00:00+01', 8.70, 8.90)
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 46. EQUIPMENT_RENTALS
-- ==============================================================
INSERT INTO equipment_rentals (id, booking_id, equipment_name, equipment_serial_number, rental_start_date, rental_end_date, actual_return_date, rental_duration_type, period_rate, period_count, deposit_amount, deposit_paid, condition_at_pickup, created_at, updated_at, condition_at_return, damage_notes, damage_fee, deposit_returned, pickup_photos, return_photos)
VALUES
  ('3f000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000024', 'Wheelchair - Standard', 'WC-2024-0042', '2025-04-05', '2025-04-19', '2025-04-19', 'weekly', 55.00, 2, 100.00, true, 'excellent', '2025-04-01 07:00:00+01', '2025-04-05 10:15:00+01', 'good', NULL, 0.00, true, ARRAY['https://storage.sanad.tn/rentals/0001/pickup-1.jpg']::text[], ARRAY['https://storage.sanad.tn/rentals/0001/return-1.jpg']::text[]),
  ('3f000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000048', 'Hospital Bed Electric', 'HB-2023-0017', '2025-06-10', '2025-07-10', '2025-07-11', 'monthly', 420.00, 1, 200.00, true, 'good', '2025-06-06 07:00:00+01', '2025-06-10 10:15:00+01', 'good', NULL, 0.00, true, ARRAY['https://storage.sanad.tn/rentals/0002/pickup-1.jpg']::text[], ARRAY['https://storage.sanad.tn/rentals/0002/return-1.jpg']::text[]),
  ('3f000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000064', 'Oxygen Concentrator Portable', 'OC-2024-0088', '2025-07-22', '2025-08-22', '2025-08-22', 'monthly', 280.00, 1, 150.00, true, 'excellent', '2025-07-14 07:00:00+01', '2025-07-22 10:15:00+01', 'excellent', NULL, 0.00, true, ARRAY['https://storage.sanad.tn/rentals/0003/pickup-1.jpg']::text[], ARRAY['https://storage.sanad.tn/rentals/0003/return-1.jpg']::text[]),
  ('3f000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000077', 'Wheelchair - Standard', 'WC-2024-0066', '2025-08-28', '2025-09-02', '2025-09-02', 'daily', 60.00, 5, 100.00, true, 'good', '2025-08-19 07:00:00+01', '2025-08-28 11:15:00+01', 'fair', 'Minor scratches on left wheel guard.', 15.00, false, ARRAY['https://storage.sanad.tn/rentals/0004/pickup-1.jpg']::text[], ARRAY['https://storage.sanad.tn/rentals/0004/return-1.jpg']::text[]),
  ('3f000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000095', 'Hospital Bed Electric', 'HB-2024-0021', '2025-10-18', '2025-11-08', '2025-11-07', 'weekly', 120.00, 3, 200.00, true, 'excellent', '2025-10-09 05:00:00+01', '2025-10-18 11:15:00+01', 'good', NULL, 0.00, true, ARRAY['https://storage.sanad.tn/rentals/0005/pickup-1.jpg']::text[], ARRAY['https://storage.sanad.tn/rentals/0005/return-1.jpg']::text[])
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 47. DISCOUNT_CODE_USAGE
-- ==============================================================
INSERT INTO discount_code_usage (id, discount_code_id, booking_id, patient_id, discount_amount, created_at)
VALUES
  ('37000000-0000-0000-0000-000000000001', '27000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000007', '02000000-0000-0000-0000-000000000005', 8.00, '2025-01-31 06:00:00+01'),
  ('37000000-0000-0000-0000-000000000002', '27000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000011', '02000000-0000-0000-0000-000000000001', 16.50, '2025-02-20 05:30:00+01'),
  ('37000000-0000-0000-0000-000000000003', '27000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000020', '02000000-0000-0000-0000-000000000012', 20.00, '2025-03-19 08:00:00+01'),
  ('37000000-0000-0000-0000-000000000004', '27000000-0000-0000-0000-000000000006', '03000000-0000-0000-0000-000000000021', '02000000-0000-0000-0000-000000000013', 10.00, '2025-03-21 09:00:00+01'),
  ('37000000-0000-0000-0000-000000000005', '27000000-0000-0000-0000-000000000011', '03000000-0000-0000-0000-000000000025', '02000000-0000-0000-0000-000000000015', 25.00, '2025-04-03 06:30:00+01'),
  ('37000000-0000-0000-0000-000000000006', '27000000-0000-0000-0000-000000000008', '03000000-0000-0000-0000-000000000026', '02000000-0000-0000-0000-000000000006', 30.00, '2025-04-04 05:00:00+01'),
  ('37000000-0000-0000-0000-000000000007', '27000000-0000-0000-0000-000000000007', '03000000-0000-0000-0000-000000000037', '02000000-0000-0000-0000-000000000017', 9.00, '2025-05-05 12:00:00+01'),
  ('37000000-0000-0000-0000-000000000008', '27000000-0000-0000-0000-000000000010', '03000000-0000-0000-0000-000000000094', '02000000-0000-0000-0000-000000000007', 20.00, '2025-10-07 05:00:00+01')
ON CONFLICT DO NOTHING;

UPDATE discount_codes
SET current_uses = CASE
  WHEN id = '27000000-0000-0000-0000-000000000001' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000002' THEN 0
  WHEN id = '27000000-0000-0000-0000-000000000003' THEN 0
  WHEN id = '27000000-0000-0000-0000-000000000004' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000005' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000006' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000007' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000008' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000009' THEN 0
  WHEN id = '27000000-0000-0000-0000-000000000010' THEN 1
  WHEN id = '27000000-0000-0000-0000-000000000011' THEN 1
  ELSE current_uses
END
WHERE id IN (
  '27000000-0000-0000-0000-000000000001',
  '27000000-0000-0000-0000-000000000002',
  '27000000-0000-0000-0000-000000000003',
  '27000000-0000-0000-0000-000000000004',
  '27000000-0000-0000-0000-000000000005',
  '27000000-0000-0000-0000-000000000006',
  '27000000-0000-0000-0000-000000000007',
  '27000000-0000-0000-0000-000000000008',
  '27000000-0000-0000-0000-000000000009',
  '27000000-0000-0000-0000-000000000010',
  '27000000-0000-0000-0000-000000000011'
);

-- ==============================================================
-- 49. FRAUD_EVENTS
-- ==============================================================
INSERT INTO fraud_events (id, event_type, user_id, booking_id, fraud_score, decision, risk_level, features, model_version, requires_review, created_at, review_decision)
VALUES
  ('2c000000-0000-0000-0000-000000000001', 'payment', '11000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000001', 12.5, 'allow', 'low', '{"amount":80,"is_new_card":false}'::jsonb, 'v1.2', false, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000002', 'payment', '11000000-0000-0000-0000-000000000007', '03000000-0000-0000-0000-000000000010', 45.0, 'review', 'medium', '{"amount":55,"is_new_card":true}'::jsonb, 'v1.2', true, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000003', 'login', '11000000-0000-0000-0000-000000000005', NULL, 25.0, 'allow', 'low', '{"new_device":true,"geo_ok":true}'::jsonb, 'v1.2', false, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000004', 'payment', '11000000-0000-0000-0000-000000000007', '03000000-0000-0000-0000-000000000010', 72.0, 'review', 'high', '{"failed_attempts":2,"velocity_flag":true}'::jsonb, 'v1.2', true, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000005', 'payment', '11000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000040', 30.0, 'allow', 'low', '{"amount":60,"is_new_card":false}'::jsonb, 'v1.2', false, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000006', 'payment', '11000000-0000-0000-0000-000000000013', '03000000-0000-0000-0000-000000000049', 55.0, 'review', 'medium', '{"geo_mismatch":true}'::jsonb, 'v1.2', true, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000007', 'signup', '11000000-0000-0000-0000-000000000017', NULL, 18.0, 'allow', 'low', '{"email_domain":"common"}'::jsonb, 'v1.2', false, CURRENT_TIMESTAMP, ''),
  ('2c000000-0000-0000-0000-000000000008', 'payment', '11000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000073', 88.0, 'block', 'high', '{"vpn_detected":true,"amount":110}'::jsonb, 'v1.2', true, CURRENT_TIMESTAMP, '')
ON CONFLICT DO NOTHING;

INSERT INTO fraud_blacklist (id, entity_type, entity_value, reason, severity, source, created_at)
VALUES
  ('3c000000-0000-0000-0000-000000000001', 'email', 'scammer@fake.com', 'Known fraudulent email', 'high', 'manual', CURRENT_TIMESTAMP),
  ('3c000000-0000-0000-0000-000000000002', 'ip_address', '185.220.101.15', 'Tor exit node repeated fraud', 'high', 'automated', CURRENT_TIMESTAMP),
  ('3c000000-0000-0000-0000-000000000003', 'email', 'fraud@disposable.net', 'Disposable email chargebacks', 'medium', 'automated', CURRENT_TIMESTAMP),
  ('3c000000-0000-0000-0000-000000000004', 'phone', '+21600000000', 'Multiple fraud accounts', 'medium', 'manual', CURRENT_TIMESTAMP),
  ('3c000000-0000-0000-0000-000000000005', 'ip_address', '91.108.4.0', 'VPN abuse multiple accounts', 'high', 'automated', CURRENT_TIMESTAMP),
  ('3c000000-0000-0000-0000-000000000006', 'email', 'test+abuse@gmail.com', 'Promo code abuse', 'low', 'automated', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 50. PUSH_TOKENS
-- ==============================================================
INSERT INTO push_tokens (id, user_id, token, platform, is_active, created_at, updated_at, device_id)
VALUES
  ('1b000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'ExponentPushToken[patient-0001-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'ExponentPushToken[patient-0002-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'ExponentPushToken[patient-0003-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 'ExponentPushToken[patient-0004-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', 'ExponentPushToken[patient-0005-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006', 'ExponentPushToken[patient-0006-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000007', 'ExponentPushToken[patient-0007-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000008', 'ExponentPushToken[patient-0008-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000009', 'ExponentPushToken[patient-0009-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000010', 'ExponentPushToken[patient-0010-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000011', 'ExponentPushToken[patient-0011-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000012', '11000000-0000-0000-0000-000000000012', 'ExponentPushToken[patient-0012-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000013', 'ExponentPushToken[patient-0013-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000014', '11000000-0000-0000-0000-000000000014', 'ExponentPushToken[patient-0014-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000015', 'ExponentPushToken[patient-0015-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000016', '11000000-0000-0000-0000-000000000016', 'ExponentPushToken[patient-0016-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000017', 'ExponentPushToken[patient-0017-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000018', '21000000-0000-0000-0000-000000000001', 'ExponentPushToken[provider-0001-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000019', '21000000-0000-0000-0000-000000000002', 'ExponentPushToken[provider-0002-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000003', 'ExponentPushToken[provider-0003-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000004', 'ExponentPushToken[provider-0004-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000005', 'ExponentPushToken[provider-0005-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000023', '21000000-0000-0000-0000-000000000006', 'ExponentPushToken[provider-0006-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000007', 'ExponentPushToken[provider-0007-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000025', '21000000-0000-0000-0000-000000000008', 'ExponentPushToken[provider-0008-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000026', '21000000-0000-0000-0000-000000000009', 'ExponentPushToken[provider-0009-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000027', '21000000-0000-0000-0000-000000000010', 'ExponentPushToken[provider-0010-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000028', '21000000-0000-0000-0000-000000000011', 'ExponentPushToken[provider-0011-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000029', '21000000-0000-0000-0000-000000000012', 'ExponentPushToken[provider-0012-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000030', '21000000-0000-0000-0000-000000000013', 'ExponentPushToken[provider-0013-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000014', 'ExponentPushToken[provider-0014-tok]', 'android', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000015', 'ExponentPushToken[provider-0015-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ''),
  ('1b000000-0000-0000-0000-000000000033', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'ExponentPushToken[admin-001-tok]', 'ios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 51. USER_SESSIONS
-- ==============================================================
INSERT INTO user_sessions (id, user_id, token_hash, refresh_token_hash, ip_address, device_type, is_active, expires_at, created_at, device_fingerprint)
VALUES
  ('2b000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'access_hash_patient_0001_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0001_abcdef1234567890abcdef1234567', '192.168.1.11', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000002', 'access_hash_patient_0002_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0002_abcdef1234567890abcdef1234567', '192.168.1.12', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', 'access_hash_patient_0003_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0003_abcdef1234567890abcdef1234567', '192.168.1.13', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 'access_hash_patient_0004_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0004_abcdef1234567890abcdef1234567', '192.168.1.14', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000005', 'access_hash_patient_0005_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0005_abcdef1234567890abcdef1234567', '192.168.1.15', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000006', 'access_hash_patient_0006_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0006_abcdef1234567890abcdef1234567', '192.168.1.16', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000007', 'access_hash_patient_0007_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0007_abcdef1234567890abcdef1234567', '192.168.1.17', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000008', 'access_hash_patient_0008_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0008_abcdef1234567890abcdef1234567', '192.168.1.18', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000009', 'access_hash_patient_0009_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0009_abcdef1234567890abcdef1234567', '192.168.1.19', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000010', 'access_hash_patient_0010_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0010_abcdef1234567890abcdef1234567', '192.168.1.20', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000011', 'access_hash_patient_0011_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0011_abcdef1234567890abcdef1234567', '192.168.1.21', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000012', '11000000-0000-0000-0000-000000000012', 'access_hash_patient_0012_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0012_abcdef1234567890abcdef1234567', '192.168.1.22', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000013', 'access_hash_patient_0013_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0013_abcdef1234567890abcdef1234567', '192.168.1.23', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000014', '11000000-0000-0000-0000-000000000014', 'access_hash_patient_0014_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0014_abcdef1234567890abcdef1234567', '192.168.1.24', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000015', 'access_hash_patient_0015_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0015_abcdef1234567890abcdef1234567', '192.168.1.25', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000016', '11000000-0000-0000-0000-000000000016', 'access_hash_patient_0016_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0016_abcdef1234567890abcdef1234567', '192.168.1.26', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000017', 'access_hash_patient_0017_abcdef1234567890abcdef12345678', 'refresh_hash_patient_0017_abcdef1234567890abcdef1234567', '192.168.1.27', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000018', '21000000-0000-0000-0000-000000000001', 'access_hash_provider_0001_abcdef1234567890abcdef123456', 'refresh_hash_provider_0001_abcdef1234567890abcdef12345', '10.0.0.11', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000019', '21000000-0000-0000-0000-000000000002', 'access_hash_provider_0002_abcdef1234567890abcdef123456', 'refresh_hash_provider_0002_abcdef1234567890abcdef12345', '10.0.0.12', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000003', 'access_hash_provider_0003_abcdef1234567890abcdef123456', 'refresh_hash_provider_0003_abcdef1234567890abcdef12345', '10.0.0.13', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000004', 'access_hash_provider_0004_abcdef1234567890abcdef123456', 'refresh_hash_provider_0004_abcdef1234567890abcdef12345', '10.0.0.14', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000005', 'access_hash_provider_0005_abcdef1234567890abcdef123456', 'refresh_hash_provider_0005_abcdef1234567890abcdef12345', '10.0.0.15', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000023', '21000000-0000-0000-0000-000000000006', 'access_hash_provider_0006_abcdef1234567890abcdef123456', 'refresh_hash_provider_0006_abcdef1234567890abcdef12345', '10.0.0.16', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000007', 'access_hash_provider_0007_abcdef1234567890abcdef123456', 'refresh_hash_provider_0007_abcdef1234567890abcdef12345', '10.0.0.17', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000025', '21000000-0000-0000-0000-000000000008', 'access_hash_provider_0008_abcdef1234567890abcdef123456', 'refresh_hash_provider_0008_abcdef1234567890abcdef12345', '10.0.0.18', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000026', '21000000-0000-0000-0000-000000000009', 'access_hash_provider_0009_abcdef1234567890abcdef123456', 'refresh_hash_provider_0009_abcdef1234567890abcdef12345', '10.0.0.19', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000027', '21000000-0000-0000-0000-000000000010', 'access_hash_provider_0010_abcdef1234567890abcdef123456', 'refresh_hash_provider_0010_abcdef1234567890abcdef12345', '10.0.0.20', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000028', '21000000-0000-0000-0000-000000000011', 'access_hash_provider_0011_abcdef1234567890abcdef123456', 'refresh_hash_provider_0011_abcdef1234567890abcdef12345', '10.0.0.21', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000029', '21000000-0000-0000-0000-000000000012', 'access_hash_provider_0012_abcdef1234567890abcdef123456', 'refresh_hash_provider_0012_abcdef1234567890abcdef12345', '10.0.0.22', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000030', '21000000-0000-0000-0000-000000000013', 'access_hash_provider_0013_abcdef1234567890abcdef123456', 'refresh_hash_provider_0013_abcdef1234567890abcdef12345', '10.0.0.23', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000014', 'access_hash_provider_0014_abcdef1234567890abcdef123456', 'refresh_hash_provider_0014_abcdef1234567890abcdef12345', '10.0.0.24', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000015', 'access_hash_provider_0015_abcdef1234567890abcdef123456', 'refresh_hash_provider_0015_abcdef1234567890abcdef12345', '10.0.0.25', 'mobile', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, ''),
  ('2b000000-0000-0000-0000-000000000033', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'access_hash_admin_001_abcdef1234567890abcdef1234567890abcde', 'refresh_hash_admin_001_abcdef1234567890abcdef1234567890abcd', '10.0.0.1', 'desktop', true, CURRENT_TIMESTAMP + INTERVAL '30 days', CURRENT_TIMESTAMP, '')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 52. USER_BEHAVIOR
-- ==============================================================
INSERT INTO user_behavior (id, user_id, action, ip_address, metadata, created_at, city, country_code, device_fingerprint, session_id)
VALUES
  ('3b000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000002', 'search', '192.168.1.1', '{"url":"/page/search/1","duration":3}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000003', 'booking_start', '192.168.2.2', '{"url":"/page/booking_start/2","duration":6}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000004', 'booking_complete', '192.168.3.3', '{"url":"/page/booking_complete/3","duration":9}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000005', 'review_submit', '192.168.4.4', '{"url":"/page/review_submit/4","duration":12}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000006', 'provider_view', '192.168.0.5', '{"url":"/page/provider_view/5","duration":15}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000007', 'filter_apply', '192.168.1.6', '{"url":"/page/filter_apply/6","duration":18}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000008', 'profile_update', '192.168.2.7', '{"url":"/page/profile_update/7","duration":21}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000009', 'page_view', '192.168.3.8', '{"url":"/page/page_view/8","duration":24}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000010', 'search', '192.168.4.9', '{"url":"/page/search/9","duration":27}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000011', 'booking_start', '192.168.0.10', '{"url":"/page/booking_start/10","duration":30}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000011', '11000000-0000-0000-0000-000000000012', 'booking_complete', '192.168.1.11', '{"url":"/page/booking_complete/11","duration":33}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000012', '11000000-0000-0000-0000-000000000013', 'review_submit', '192.168.2.12', '{"url":"/page/review_submit/12","duration":36}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000013', '11000000-0000-0000-0000-000000000014', 'provider_view', '192.168.3.13', '{"url":"/page/provider_view/13","duration":39}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000014', '11000000-0000-0000-0000-000000000015', 'filter_apply', '192.168.4.14', '{"url":"/page/filter_apply/14","duration":42}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000015', '11000000-0000-0000-0000-000000000016', 'profile_update', '192.168.0.15', '{"url":"/page/profile_update/15","duration":45}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000016', '11000000-0000-0000-0000-000000000017', 'page_view', '192.168.1.16', '{"url":"/page/page_view/16","duration":48}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000017', '11000000-0000-0000-0000-000000000001', 'search', '192.168.2.17', '{"url":"/page/search/17","duration":51}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000018', '11000000-0000-0000-0000-000000000002', 'booking_start', '192.168.3.18', '{"url":"/page/booking_start/18","duration":54}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000019', '11000000-0000-0000-0000-000000000003', 'booking_complete', '192.168.4.19', '{"url":"/page/booking_complete/19","duration":57}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000020', '11000000-0000-0000-0000-000000000004', 'review_submit', '192.168.0.20', '{"url":"/page/review_submit/20","duration":60}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000021', '11000000-0000-0000-0000-000000000005', 'provider_view', '192.168.1.21', '{"url":"/page/provider_view/21","duration":63}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000022', '11000000-0000-0000-0000-000000000006', 'filter_apply', '192.168.2.22', '{"url":"/page/filter_apply/22","duration":66}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000023', '11000000-0000-0000-0000-000000000007', 'profile_update', '192.168.3.23', '{"url":"/page/profile_update/23","duration":69}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000024', '11000000-0000-0000-0000-000000000008', 'page_view', '192.168.4.24', '{"url":"/page/page_view/24","duration":72}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000025', '11000000-0000-0000-0000-000000000009', 'search', '192.168.0.25', '{"url":"/page/search/25","duration":75}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000026', '11000000-0000-0000-0000-000000000010', 'booking_start', '192.168.1.26', '{"url":"/page/booking_start/26","duration":78}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000027', '11000000-0000-0000-0000-000000000011', 'booking_complete', '192.168.2.27', '{"url":"/page/booking_complete/27","duration":81}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000028', '11000000-0000-0000-0000-000000000012', 'review_submit', '192.168.3.28', '{"url":"/page/review_submit/28","duration":84}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000029', '11000000-0000-0000-0000-000000000013', 'provider_view', '192.168.4.29', '{"url":"/page/provider_view/29","duration":87}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000030', '11000000-0000-0000-0000-000000000014', 'filter_apply', '192.168.0.30', '{"url":"/page/filter_apply/30","duration":90}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000031', '11000000-0000-0000-0000-000000000015', 'profile_update', '192.168.1.31', '{"url":"/page/profile_update/31","duration":93}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000032', '11000000-0000-0000-0000-000000000016', 'page_view', '192.168.2.32', '{"url":"/page/page_view/32","duration":96}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000033', '11000000-0000-0000-0000-000000000017', 'search', '192.168.3.33', '{"url":"/page/search/33","duration":99}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000034', '11000000-0000-0000-0000-000000000001', 'booking_start', '192.168.4.34', '{"url":"/page/booking_start/34","duration":102}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000035', '11000000-0000-0000-0000-000000000002', 'booking_complete', '192.168.0.35', '{"url":"/page/booking_complete/35","duration":105}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000036', '11000000-0000-0000-0000-000000000003', 'review_submit', '192.168.1.36', '{"url":"/page/review_submit/36","duration":108}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000037', '11000000-0000-0000-0000-000000000004', 'provider_view', '192.168.2.37', '{"url":"/page/provider_view/37","duration":111}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000038', '11000000-0000-0000-0000-000000000005', 'filter_apply', '192.168.3.38', '{"url":"/page/filter_apply/38","duration":114}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000039', '11000000-0000-0000-0000-000000000006', 'profile_update', '192.168.4.39', '{"url":"/page/profile_update/39","duration":117}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000040', '11000000-0000-0000-0000-000000000007', 'page_view', '192.168.0.40', '{"url":"/page/page_view/40","duration":120}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000041', '11000000-0000-0000-0000-000000000008', 'search', '192.168.1.41', '{"url":"/page/search/41","duration":123}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000042', '11000000-0000-0000-0000-000000000009', 'booking_start', '192.168.2.42', '{"url":"/page/booking_start/42","duration":126}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000043', '11000000-0000-0000-0000-000000000010', 'booking_complete', '192.168.3.43', '{"url":"/page/booking_complete/43","duration":129}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000044', '11000000-0000-0000-0000-000000000011', 'review_submit', '192.168.4.44', '{"url":"/page/review_submit/44","duration":132}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000045', '11000000-0000-0000-0000-000000000012', 'provider_view', '192.168.0.45', '{"url":"/page/provider_view/45","duration":135}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000046', '11000000-0000-0000-0000-000000000013', 'filter_apply', '192.168.1.46', '{"url":"/page/filter_apply/46","duration":138}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000047', '11000000-0000-0000-0000-000000000014', 'profile_update', '192.168.2.47', '{"url":"/page/profile_update/47","duration":141}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000048', '11000000-0000-0000-0000-000000000015', 'page_view', '192.168.3.48', '{"url":"/page/page_view/48","duration":144}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000049', '11000000-0000-0000-0000-000000000016', 'search', '192.168.4.49', '{"url":"/page/search/49","duration":147}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000050', '11000000-0000-0000-0000-000000000017', 'booking_start', '192.168.0.50', '{"url":"/page/booking_start/50","duration":150}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000051', '11000000-0000-0000-0000-000000000001', 'booking_complete', '192.168.1.51', '{"url":"/page/booking_complete/51","duration":153}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000052', '11000000-0000-0000-0000-000000000002', 'review_submit', '192.168.2.52', '{"url":"/page/review_submit/52","duration":156}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000053', '11000000-0000-0000-0000-000000000003', 'provider_view', '192.168.3.53', '{"url":"/page/provider_view/53","duration":159}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000054', '11000000-0000-0000-0000-000000000004', 'filter_apply', '192.168.4.54', '{"url":"/page/filter_apply/54","duration":162}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000055', '11000000-0000-0000-0000-000000000005', 'profile_update', '192.168.0.55', '{"url":"/page/profile_update/55","duration":165}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000056', '11000000-0000-0000-0000-000000000006', 'page_view', '192.168.1.56', '{"url":"/page/page_view/56","duration":168}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000057', '11000000-0000-0000-0000-000000000007', 'search', '192.168.2.57', '{"url":"/page/search/57","duration":171}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000058', '11000000-0000-0000-0000-000000000008', 'booking_start', '192.168.3.58', '{"url":"/page/booking_start/58","duration":174}'::jsonb, CURRENT_TIMESTAMP, '', '', '', ''),
  ('3b000000-0000-0000-0000-000000000059', '11000000-0000-0000-0000-000000000009', 'booking_complete', '192.168.4.59', '{"url":"/page/booking_complete/59","duration":177}'::jsonb, CURRENT_TIMESTAMP, '', '', '', '')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 53. ADMIN_ACTIONS
-- ==============================================================
INSERT INTO admin_actions (id, admin_id, action, entity_type, entity_id, description, ip_address, created_at)
VALUES
  ('0c000000-0000-0000-0000-000000000001', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000001', 'Approved Dr. Amira Mansour', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000002', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000002', 'Approved Dr. Faouzi Ayadi', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000003', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000003', 'Approved Karim Bouazizi', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000004', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000005', 'Approved Leila Hamdi', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000005', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000007', 'Approved Mehdi Jebali', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000006', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000008', 'Approved Riadh Chebbi', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000007', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000010', 'Approved Dr. Zied Elloumi', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000008', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'verify_document', 'provider_document', '2d000000-0000-0000-0000-000000000001', 'Verified medical license Dr. Amira', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000009', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'verify_document', 'provider_document', '2d000000-0000-0000-0000-000000000003', 'Verified nursing license Karim', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000010', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'resolve_dispute', 'dispute', '35000000-0000-0000-0000-000000000001', 'Reviewed late cancellation DSP-2025-0001', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000011', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_refund', 'refund', '25000000-0000-0000-0000-000000000001', 'Approved partial refund booking BK-0006', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000012', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'close_ticket', 'support_ticket', '16000000-0000-0000-0000-000000000003', 'Closed resolved ticket TK-2025-0003', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000013', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'send_notification', 'user', '11000000-0000-0000-0000-000000000001', 'System maintenance notification sent', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000014', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'suspend_user', 'user', NULL, 'Temporary suspension for suspicious activity', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000015', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'update_setting', 'system_setting', '43000000-0000-0000-0000-000000000011', 'Updated maintenance mode to false', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000016', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_refund', 'refund', '25000000-0000-0000-0000-000000000002', 'Approved full refund dispute DSP-2025-0002', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000017', '0f8a2873-b963-48ad-bdb0-140513b61e82', 'verify_document', 'provider_document', '2d000000-0000-0000-0000-000000000009', 'Verified lab accreditation', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000018', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000011', 'Approved Hana Turki nutritionist', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000019', '24cf5497-1f18-49d3-8ca2-5c7b739001ee', 'approve_provider', 'provider', '12000000-0000-0000-0000-000000000012', 'Approved Bassem Ghariani elderly care', '10.0.0.1', CURRENT_TIMESTAMP),
  ('0c000000-0000-0000-0000-000000000020', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 'update_setting', 'system_setting', '43000000-0000-0000-0000-000000000009', 'Updated iOS app version to 2.3.1', '10.0.0.1', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 54. AUDIT_LOGS
-- ==============================================================
INSERT INTO audit_logs (id, table_name, record_id, action, user_id, ip_address, created_at)
VALUES
  ('1c000000-0000-0000-0000-000000000001', 'bookings', '03000000-0000-0000-0000-000000000001', 'UPDATE', '11000000-0000-0000-0000-000000000002', '192.168.1.1', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000002', 'providers', '12000000-0000-0000-0000-000000000003', 'UPDATE', '11000000-0000-0000-0000-000000000003', '192.168.2.2', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000003', 'users', '03000000-0000-0000-0000-000000000003', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.3.3', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000004', 'reviews', '03000000-0000-0000-0000-000000000004', 'INSERT', '11000000-0000-0000-0000-000000000005', '192.168.4.4', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000005', 'disputes', '03000000-0000-0000-0000-000000000005', 'INSERT', '11000000-0000-0000-0000-000000000006', '192.168.5.5', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000006', 'payments', '33100000-0000-0000-0000-000000000001', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.6.6', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000007', 'bookings', '03000000-0000-0000-0000-000000000007', 'UPDATE', '11000000-0000-0000-0000-000000000008', '192.168.7.7', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000008', 'refunds', '12000000-0000-0000-0000-000000000009', 'INSERT', '11000000-0000-0000-0000-000000000009', '192.168.8.8', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000009', 'system_settings', '12000000-0000-0000-0000-000000000010', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.9.9', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000010', 'bookings', '03000000-0000-0000-0000-000000000010', 'INSERT', '11000000-0000-0000-0000-000000000011', '192.168.0.10', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000011', 'bookings', '03000000-0000-0000-0000-000000000011', 'UPDATE', '11000000-0000-0000-0000-000000000012', '192.168.1.11', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000012', 'providers', '12000000-0000-0000-0000-000000000013', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.2.12', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000013', 'users', '03000000-0000-0000-0000-000000000013', 'INSERT', '11000000-0000-0000-0000-000000000014', '192.168.3.13', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000014', 'reviews', '03000000-0000-0000-0000-000000000014', 'INSERT', '11000000-0000-0000-0000-000000000015', '192.168.4.14', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000015', 'disputes', '03000000-0000-0000-0000-000000000015', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.5.15', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000016', 'payments', '33100000-0000-0000-0000-000000000002', 'INSERT', '11000000-0000-0000-0000-000000000017', '192.168.6.16', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000017', 'bookings', '03000000-0000-0000-0000-000000000017', 'UPDATE', '11000000-0000-0000-0000-000000000001', '192.168.7.17', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000018', 'refunds', '12000000-0000-0000-0000-000000000004', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.8.18', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000019', 'system_settings', '12000000-0000-0000-0000-000000000005', 'UPDATE', '11000000-0000-0000-0000-000000000003', '192.168.9.19', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000020', 'bookings', '03000000-0000-0000-0000-000000000020', 'INSERT', '11000000-0000-0000-0000-000000000004', '192.168.0.20', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000021', 'bookings', '03000000-0000-0000-0000-000000000021', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.1.21', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000022', 'providers', '12000000-0000-0000-0000-000000000008', 'UPDATE', '11000000-0000-0000-0000-000000000006', '192.168.2.22', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000023', 'users', '03000000-0000-0000-0000-000000000023', 'INSERT', '11000000-0000-0000-0000-000000000007', '192.168.3.23', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000024', 'reviews', '03000000-0000-0000-0000-000000000024', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.4.24', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000025', 'disputes', '03000000-0000-0000-0000-000000000025', 'INSERT', '11000000-0000-0000-0000-000000000009', '192.168.5.25', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000026', 'payments', '33100000-0000-0000-0000-000000000003', 'INSERT', '11000000-0000-0000-0000-000000000010', '192.168.6.26', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000027', 'bookings', '03000000-0000-0000-0000-000000000027', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.7.27', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000028', 'refunds', '12000000-0000-0000-0000-000000000014', 'INSERT', '11000000-0000-0000-0000-000000000012', '192.168.8.28', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000029', 'system_settings', '12000000-0000-0000-0000-000000000015', 'UPDATE', '11000000-0000-0000-0000-000000000013', '192.168.9.29', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000030', 'bookings', '03000000-0000-0000-0000-000000000030', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.0.30', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000031', 'bookings', '03000000-0000-0000-0000-000000000031', 'UPDATE', '11000000-0000-0000-0000-000000000015', '192.168.1.31', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000032', 'providers', '12000000-0000-0000-0000-000000000003', 'UPDATE', '11000000-0000-0000-0000-000000000016', '192.168.2.32', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000033', 'users', '03000000-0000-0000-0000-000000000033', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.3.33', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000034', 'reviews', '03000000-0000-0000-0000-000000000034', 'INSERT', '11000000-0000-0000-0000-000000000001', '192.168.4.34', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000035', 'disputes', '03000000-0000-0000-0000-000000000035', 'INSERT', '11000000-0000-0000-0000-000000000002', '192.168.5.35', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000036', 'provider_wallet_top_ups', '33300000-0000-0000-0000-000000000001', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.6.36', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000037', 'bookings', '03000000-0000-0000-0000-000000000037', 'UPDATE', '11000000-0000-0000-0000-000000000004', '192.168.7.37', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000038', 'refunds', '12000000-0000-0000-0000-000000000009', 'INSERT', '11000000-0000-0000-0000-000000000005', '192.168.8.38', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000039', 'system_settings', '12000000-0000-0000-0000-000000000010', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.9.39', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000040', 'bookings', '03000000-0000-0000-0000-000000000040', 'INSERT', '11000000-0000-0000-0000-000000000007', '192.168.0.40', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000041', 'bookings', '03000000-0000-0000-0000-000000000041', 'UPDATE', '11000000-0000-0000-0000-000000000008', '192.168.1.41', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000042', 'providers', '12000000-0000-0000-0000-000000000013', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.2.42', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000043', 'users', '03000000-0000-0000-0000-000000000043', 'INSERT', '11000000-0000-0000-0000-000000000010', '192.168.3.43', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000044', 'reviews', '03000000-0000-0000-0000-000000000044', 'INSERT', '11000000-0000-0000-0000-000000000011', '192.168.4.44', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000045', 'disputes', '03000000-0000-0000-0000-000000000045', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.5.45', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000046', 'provider_wallet_top_ups', '33300000-0000-0000-0000-000000000003', 'INSERT', '11000000-0000-0000-0000-000000000013', '192.168.6.46', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000047', 'bookings', '03000000-0000-0000-0000-000000000047', 'UPDATE', '11000000-0000-0000-0000-000000000014', '192.168.7.47', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000048', 'refunds', '12000000-0000-0000-0000-000000000004', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.8.48', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000049', 'system_settings', '12000000-0000-0000-0000-000000000005', 'UPDATE', '11000000-0000-0000-0000-000000000016', '192.168.9.49', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000050', 'bookings', '03000000-0000-0000-0000-000000000050', 'INSERT', '11000000-0000-0000-0000-000000000017', '192.168.0.50', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000051', 'bookings', '03000000-0000-0000-0000-000000000051', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.1.51', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000052', 'providers', '12000000-0000-0000-0000-000000000008', 'UPDATE', '11000000-0000-0000-0000-000000000002', '192.168.2.52', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000053', 'users', '03000000-0000-0000-0000-000000000053', 'INSERT', '11000000-0000-0000-0000-000000000003', '192.168.3.53', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000054', 'reviews', '03000000-0000-0000-0000-000000000054', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.4.54', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000055', 'disputes', '03000000-0000-0000-0000-000000000055', 'INSERT', '11000000-0000-0000-0000-000000000005', '192.168.5.55', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000056', 'ledger_transactions', '33400000-0000-0000-0000-000000000001', 'INSERT', '11000000-0000-0000-0000-000000000006', '192.168.6.56', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000057', 'bookings', '03000000-0000-0000-0000-000000000057', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.7.57', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000058', 'refunds', '12000000-0000-0000-0000-000000000014', 'INSERT', '11000000-0000-0000-0000-000000000008', '192.168.8.58', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000059', 'system_settings', '12000000-0000-0000-0000-000000000015', 'UPDATE', '11000000-0000-0000-0000-000000000009', '192.168.9.59', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000060', 'bookings', '03000000-0000-0000-0000-000000000060', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.0.60', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000061', 'bookings', '03000000-0000-0000-0000-000000000061', 'UPDATE', '11000000-0000-0000-0000-000000000011', '192.168.1.61', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000062', 'providers', '12000000-0000-0000-0000-000000000003', 'UPDATE', '11000000-0000-0000-0000-000000000012', '192.168.2.62', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000063', 'users', '03000000-0000-0000-0000-000000000063', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.3.63', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000064', 'reviews', '03000000-0000-0000-0000-000000000064', 'INSERT', '11000000-0000-0000-0000-000000000014', '192.168.4.64', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000065', 'disputes', '03000000-0000-0000-0000-000000000065', 'INSERT', '11000000-0000-0000-0000-000000000015', '192.168.5.65', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000066', 'ledger_transactions', '33400000-0000-0000-0000-000000000007', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.6.66', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000067', 'bookings', '03000000-0000-0000-0000-000000000067', 'UPDATE', '11000000-0000-0000-0000-000000000017', '192.168.7.67', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000068', 'refunds', '12000000-0000-0000-0000-000000000009', 'INSERT', '11000000-0000-0000-0000-000000000001', '192.168.8.68', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000069', 'system_settings', '12000000-0000-0000-0000-000000000010', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.9.69', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000070', 'bookings', '03000000-0000-0000-0000-000000000070', 'INSERT', '11000000-0000-0000-0000-000000000003', '192.168.0.70', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000071', 'bookings', '03000000-0000-0000-0000-000000000071', 'UPDATE', '11000000-0000-0000-0000-000000000004', '192.168.1.71', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000072', 'providers', '12000000-0000-0000-0000-000000000013', 'UPDATE', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.2.72', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000073', 'users', '03000000-0000-0000-0000-000000000073', 'INSERT', '11000000-0000-0000-0000-000000000006', '192.168.3.73', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000074', 'reviews', '03000000-0000-0000-0000-000000000074', 'INSERT', '11000000-0000-0000-0000-000000000007', '192.168.4.74', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000075', 'disputes', '03000000-0000-0000-0000-000000000075', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.5.75', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000076', 'wallets', '33600000-0000-0000-0000-000000000002', 'INSERT', '11000000-0000-0000-0000-000000000009', '192.168.6.76', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000077', 'bookings', '03000000-0000-0000-0000-000000000077', 'UPDATE', '11000000-0000-0000-0000-000000000010', '192.168.7.77', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000078', 'refunds', '12000000-0000-0000-0000-000000000004', 'INSERT', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '192.168.8.78', CURRENT_TIMESTAMP),
  ('1c000000-0000-0000-0000-000000000079', 'system_settings', '12000000-0000-0000-0000-000000000005', 'UPDATE', '11000000-0000-0000-0000-000000000012', '192.168.9.79', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 55. EMAIL_VERIFICATION_TOKENS
-- ==============================================================
INSERT INTO email_verification_tokens (id, user_id, email, token_hash, expires_at, verified_at, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000005', 'youssef.gharbi@sanad.tn', 'c538a8c8c5be3501e95455f76d9c8e1b7bc0ab127535e1c10a08ecd77cb27023', CURRENT_TIMESTAMP + INTERVAL '1 day', NULL, CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000017', 'nizar.ferchichi@sanad.tn', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', CURRENT_TIMESTAMP + INTERVAL '1 day', NULL, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 56. PASSWORD_RESET_TOKENS
-- ==============================================================
INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000003', '23ef1a553dca269e1318822d12ee88ff68b195a6897ad09290c3ce41979fe66d', CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000011', '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e', CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;



-- ==============================================================
-- NEW DATA: FOUNDATION
-- ==============================================================

-- 1A. NEW PROVIDER USERS (providers 16-35)
-- ==============================================================
INSERT INTO users (id, email, email_verified, email_verified_at, password_hash, role, is_active, is_suspended, phone, phone_verified, phone_verified_at, preferred_language, timezone, last_login_at, created_at, updated_at, last_login_ip, two_factor_secret, failed_login_attempts, two_factor_enabled)
VALUES
  ('21000000-0000-0000-0000-000000000016', 'pharmacie.centrale@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200016', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000017', 'pharmacie.dulac@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200017', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000018', 'pharmacie.pasteur@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200018', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000019', 'elfirdaws@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200019', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000020', 'essalem.funeraire@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200020', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000021', 'dr.sami.vet@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200021', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000022', 'clinique.animalia@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200022', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000023', 'sos.animaux.sfax@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200023', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000024', 'imagerie.tunis@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200024', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000025', 'irm.plus.sousse@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200025', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000026', 'fitness.club.tunis@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200026', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000027', 'remise.forme.ariana@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200027', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000028', 'sagefemme.amina@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200028', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000029', 'garde.nuit.specialisee@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200029', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000030', 'infirmier.chronique@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200030', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000031', 'nounou.plus@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200031', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000032', 'babycare.sfax@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200032', true, CURRENT_TIMESTAMP, 'ar', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000033', 'accompagnement.medical@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200033', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000034', 'dr.bilan.sante@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200034', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000035', 'dr.nadia.cardio@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200035', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 1B. PATIENT PROFILE DIVERSIFICATION (17 updates)
-- ==============================================================
UPDATE patients SET emergency_contact_relationship = 'spouse', address_line1 = '15 Avenue Habib Bourguiba', insurance_provider = 'CNAM', insurance_policy_number = 'CNAM-TN-2024-00145', preferred_communication = 'App' WHERE id = '02000000-0000-0000-0000-000000000001';
UPDATE patients SET emergency_contact_relationship = 'parent', address_line1 = '8 Rue Ibn Khaldoun', insurance_provider = 'CNSS', insurance_policy_number = 'CNSS-SF-2023-00278', preferred_communication = 'SMS' WHERE id = '02000000-0000-0000-0000-000000000002';
UPDATE patients SET emergency_contact_relationship = 'child', address_line1 = '22 Avenue de la Liberté', insurance_provider = 'Star', insurance_policy_number = 'STAR-SS-2024-00312', preferred_communication = 'Phone' WHERE id = '02000000-0000-0000-0000-000000000003';
UPDATE patients SET emergency_contact_relationship = 'sibling', address_line1 = '5 Rue de Marseille', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'Email' WHERE id = '02000000-0000-0000-0000-000000000004';
UPDATE patients SET emergency_contact_relationship = 'friend', address_line1 = '47 Avenue Mohamed V', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'App' WHERE id = '02000000-0000-0000-0000-000000000005';
UPDATE patients SET emergency_contact_relationship = 'parent', address_line1 = '3 Rue du Lac Léman', insurance_provider = 'CNAM', insurance_policy_number = 'CNAM-NB-2023-00089', preferred_communication = 'SMS' WHERE id = '02000000-0000-0000-0000-000000000006';
UPDATE patients SET emergency_contact_relationship = 'neighbor', address_line1 = '12 Rue Farhat Hached', insurance_provider = 'Maghrebia', insurance_policy_number = 'MAG-KR-2024-00156', preferred_communication = 'Phone' WHERE id = '02000000-0000-0000-0000-000000000007';
UPDATE patients SET emergency_contact_relationship = 'spouse', address_line1 = '91 Avenue Taieb Mehiri', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'App' WHERE id = '02000000-0000-0000-0000-000000000008';
UPDATE patients SET emergency_contact_relationship = 'child', address_line1 = '6 Rue Kheireddine Pacha', insurance_provider = 'CNSS', insurance_policy_number = 'CNSS-AR-2024-00423', preferred_communication = 'Email' WHERE id = '02000000-0000-0000-0000-000000000009';
UPDATE patients SET emergency_contact_relationship = 'sibling', address_line1 = '28 Avenue de Paris', insurance_provider = 'Star', insurance_policy_number = 'STAR-BA-2023-00567', preferred_communication = 'SMS' WHERE id = '02000000-0000-0000-0000-000000000010';
UPDATE patients SET emergency_contact_relationship = 'friend', address_line1 = '33 Rue Ali Belhouane', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'App' WHERE id = '02000000-0000-0000-0000-000000000011';
UPDATE patients SET emergency_contact_relationship = 'parent', address_line1 = '17 Rue du Pacha', insurance_provider = 'CNAM', insurance_policy_number = 'CNAM-TN-2024-00612', preferred_communication = 'Phone' WHERE id = '02000000-0000-0000-0000-000000000012';
UPDATE patients SET emergency_contact_relationship = 'neighbor', address_line1 = '44 Avenue Farhat Hached', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'Email' WHERE id = '02000000-0000-0000-0000-000000000013';
UPDATE patients SET emergency_contact_relationship = 'spouse', address_line1 = '9 Rue de l''Industrie', insurance_provider = 'Maghrebia', insurance_policy_number = 'MAG-GF-2023-00078', preferred_communication = 'SMS' WHERE id = '02000000-0000-0000-0000-000000000014';
UPDATE patients SET emergency_contact_relationship = 'child', address_line1 = '56 Avenue Habib Thameur', insurance_provider = 'CNSS', insurance_policy_number = 'CNSS-DJ-2024-00345', preferred_communication = 'App' WHERE id = '02000000-0000-0000-0000-000000000015';
UPDATE patients SET emergency_contact_relationship = 'sibling', address_line1 = '71 Rue de Palestine', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'Phone' WHERE id = '02000000-0000-0000-0000-000000000016';
UPDATE patients SET emergency_contact_relationship = 'friend', address_line1 = '14 Avenue de la République', insurance_provider = NULL, insurance_policy_number = NULL, preferred_communication = 'Email' WHERE id = '02000000-0000-0000-0000-000000000017';


-- ==============================================================
-- 1C. NEW SERVICE CATEGORIES (6 rows)
-- ==============================================================
INSERT INTO service_categories_config (id, code, name_en, name_fr, name_ar, name_de, icon, color, default_commission_rate, is_active, display_order, created_at, display_group, description_en, description_fr, badge, min_price, max_price)
VALUES
  ('41000000-0000-0000-0000-000000000015', 'checkup', 'Health Checkup', 'Bilan de Santé', 'فحص صحي', 'Gesundheitscheck', 'clipboard-check', '#00897B', 15.0, true, 15, CURRENT_TIMESTAMP, 'Medical', 'Comprehensive health checkup services performed at home. Includes clinical examination, basic blood work review, and a detailed health report. Ideal for annual preventive screenings.', 'Services de bilan de santé complet réalisés à domicile. Comprend un examen clinique, une revue des analyses sanguines de base et un rapport de santé détaillé. Idéal pour les dépistages préventifs annuels.', 'new', 80.0, 250.0),
  ('41000000-0000-0000-0000-000000000016', 'medical_companion', 'Medical Companion', 'Accompagnement Médical', 'مرافقة طبية', 'Medizinische Begleitung', 'human-greeting', '#5C6BC0', 12.0, true, 16, CURRENT_TIMESTAMP, 'Daily', 'Professional medical companion services for hospital visits, appointments, and procedures. Trained aides provide support, take notes, and ensure clear communication with healthcare providers.', 'Services d''accompagnement médical professionnels pour les visites hospitalières, les rendez-vous et les procédures. Des aides formés apportent un soutien, prennent des notes et assurent une communication claire avec les prestataires de soins.', 'new', 50.0, 150.0),
  ('41000000-0000-0000-0000-000000000017', 'babysitting', 'Babysitting', 'Baby Sitting', 'رعاية الأطفال', 'Kinderbetreuung', 'baby-face', '#EC407A', 10.0, true, 17, CURRENT_TIMESTAMP, 'Daily', 'Certified babysitting and childcare services at home. Our caregivers are trained in pediatric first aid and child development. Available for short-term or full-day sessions.', 'Services de baby-sitting et de garde d''enfants certifiés à domicile. Nos auxiliaires sont formés aux premiers secours pédiatriques et au développement de l''enfant. Disponibles pour des séances courtes ou à la journée.', 'new', 30.0, 120.0),
  ('41000000-0000-0000-0000-000000000018', 'pharmacy', 'Pharmacy', 'Pharmacie', 'صيدلية', 'Apotheke', 'pill', '#66BB6A', 8.0, true, 18, CURRENT_TIMESTAMP, 'Medical', 'Home pharmacy delivery and medication management services. Includes prescription fulfillment, medication counseling, and adherence monitoring. Available 7 days a week in partner areas.', 'Services de livraison de pharmacie à domicile et de gestion des médicaments. Comprend l''exécution des ordonnances, les conseils médicamenteux et le suivi de l''observance. Disponible 7 jours sur 7 dans les zones partenaires.', 'new', 10.0, 200.0),
  ('41000000-0000-0000-0000-000000000019', 'funeral', 'Funeral Services', 'Services Funéraires', 'خدمات الجنازة', 'Bestattungsdienste', 'candle', '#78909C', 5.0, true, 19, CURRENT_TIMESTAMP, 'Daily', 'Comprehensive funeral and bereavement services. Includes body preparation according to Islamic tradition, administrative paperwork, transport, and ceremony coordination. Compassionate support during difficult times.', 'Services funéraires et d''accompagnement complets. Comprend la préparation du corps selon la tradition islamique, les démarches administratives, le transport et la coordination des cérémonies. Un accompagnement bienveillant dans les moments difficiles.', 'new', 500.0, 5000.0),
  ('41000000-0000-0000-0000-000000000020', 'veterinary', 'Veterinary', 'Vétérinaire', 'بيطري', 'Tierarzt', 'paw', '#8D6E63', 12.0, true, 20, CURRENT_TIMESTAMP, 'Wellness', 'At-home veterinary care for pets and domestic animals. Services include general consultations, vaccinations, minor procedures, and follow-up visits. Stress-free care in your pet''s familiar environment.', 'Soins vétérinaires à domicile pour animaux de compagnie et animaux domestiques. Les services comprennent les consultations générales, les vaccinations, les actes mineurs et les visites de suivi. Des soins sans stress dans l''environnement familier de votre animal.', 'new', 40.0, 300.0)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 1D. UPDATE EXISTING 14 CATEGORIES (descriptions, prices, badges)
-- ==============================================================
UPDATE service_categories_config SET description_en = 'Professional nursing care delivered at home by licensed nurses. Services include injections, wound care, IV therapy, catheter management, and post-operative monitoring. Available for one-time visits or ongoing care plans.', description_fr = 'Soins infirmiers professionnels dispensés à domicile par des infirmiers diplômés. Les services comprennent les injections, les soins de plaies, la thérapie intraveineuse, la gestion des cathéters et le suivi post-opératoire. Disponible pour des visites ponctuelles ou des plans de soins continus.', min_price = 25, max_price = 250, badge = 'popular' WHERE id = '41000000-0000-0000-0000-000000000001';
UPDATE service_categories_config SET description_en = 'Home-based physiotherapy and rehabilitation services. Includes post-surgical recovery, sports injury treatment, stroke rehabilitation, and chronic pain management. Personalized programs designed by certified physiotherapists.', description_fr = 'Services de kinésithérapie et de rééducation à domicile. Comprend la récupération post-chirurgicale, le traitement des blessures sportives, la rééducation post-AVC et la gestion de la douleur chronique. Programmes personnalisés conçus par des kinésithérapeutes certifiés.', min_price = 40, max_price = 120, badge = 'popular' WHERE id = '41000000-0000-0000-0000-000000000002';
UPDATE service_categories_config SET description_en = 'Home medical consultations with qualified physicians. General practice, pediatrics, geriatrics, and specialist visits available. Includes physical examination, prescription, and referral services when needed.', description_fr = 'Consultations médicales à domicile avec des médecins qualifiés. Médecine générale, pédiatrie, gériatrie et visites spécialisées disponibles. Comprend l''examen physique, les prescriptions et les services d''orientation si nécessaire.', min_price = 40, max_price = 250, badge = 'popular' WHERE id = '41000000-0000-0000-0000-000000000003';
UPDATE service_categories_config SET description_en = 'At-home laboratory sample collection and testing services. Blood draws, urine samples, and specialized tests performed by certified technicians. Results delivered securely within 24-48 hours.', description_fr = 'Services de prélèvement et d''analyses de laboratoire à domicile. Prises de sang, échantillons urinaires et tests spécialisés réalisés par des techniciens certifiés. Résultats transmis de manière sécurisée sous 24 à 48 heures.', min_price = 25, max_price = 150, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000004';
UPDATE service_categories_config SET description_en = 'Non-emergency medical transport and ambulance services. Equipped vehicles with trained paramedics for hospital transfers, dialysis appointments, and inter-facility transport. Available for scheduled and same-day bookings.', description_fr = 'Services de transport médical non urgentiel et ambulance. Véhicules équipés avec ambulanciers formés pour les transferts hospitaliers, les rendez-vous de dialyse et le transport inter-établissements. Disponible sur réservation et le jour même.', min_price = 100, max_price = 500, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000005';
UPDATE service_categories_config SET description_en = 'Medical equipment rental with home delivery and setup. Wheelchairs, hospital beds, oxygen concentrators, and monitoring devices available for short or long-term use. Includes installation, training, and maintenance support.', description_fr = 'Location d''équipement médical avec livraison et installation à domicile. Fauteuils roulants, lits médicalisés, concentrateurs d''oxygène et appareils de surveillance disponibles pour une utilisation courte ou longue durée. Comprend l''installation, la formation et le support de maintenance.', min_price = 40, max_price = 500, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000006';
UPDATE service_categories_config SET description_en = 'Dedicated elderly care and daily living assistance. Trained caregivers provide companionship, personal hygiene support, meal preparation, medication reminders, and cognitive stimulation activities for seniors.', description_fr = 'Aide aux personnes âgées et assistance au quotidien dédiée. Des aidants formés assurent la compagnie, l''aide à l''hygiène personnelle, la préparation des repas, les rappels de médicaments et les activités de stimulation cognitive pour les seniors.', min_price = 50, max_price = 300, badge = 'recommended' WHERE id = '41000000-0000-0000-0000-000000000007';
UPDATE service_categories_config SET description_en = 'Professional psychological support at home or via teleconsultation. Individual therapy, couples counseling, anxiety and depression management, and grief support. All sessions conducted by licensed psychologists.', description_fr = 'Accompagnement psychologique professionnel à domicile ou en téléconsultation. Thérapie individuelle, conseil de couple, gestion de l''anxiété et de la dépression, et soutien au deuil. Toutes les séances sont menées par des psychologues diplômés.', min_price = 60, max_price = 150, badge = 'recommended' WHERE id = '41000000-0000-0000-0000-000000000008';
UPDATE service_categories_config SET description_en = 'Personalized nutrition counseling and dietary planning. Certified nutritionists create tailored meal plans for diabetes management, weight control, post-surgical recovery, and general wellness. Includes follow-up consultations.', description_fr = 'Conseils nutritionnels personnalisés et planification alimentaire. Des nutritionnistes certifiés créent des plans de repas adaptés pour la gestion du diabète, le contrôle du poids, la récupération post-chirurgicale et le bien-être général. Comprend des consultations de suivi.', min_price = 50, max_price = 120, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000009';
UPDATE service_categories_config SET description_en = 'Comprehensive maternity and postnatal care at home. Midwife visits, breastfeeding support, newborn care guidance, and postpartum recovery monitoring. Supporting mothers and babies through the critical first weeks.', description_fr = 'Soins maternels et postnataux complets à domicile. Visites de sage-femme, soutien à l''allaitement, conseils pour les soins du nouveau-né et suivi de la récupération post-partum. Accompagnement des mères et des bébés pendant les premières semaines critiques.', min_price = 60, max_price = 200, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000010';
UPDATE service_categories_config SET description_en = 'Overnight nursing and monitoring services for patients requiring continuous supervision. Qualified night nurses provide medication administration, vital sign monitoring, and immediate response to patient needs throughout the night.', description_fr = 'Services de soins infirmiers et de surveillance nocturnes pour les patients nécessitant une supervision continue. Des infirmiers de nuit qualifiés assurent l''administration des médicaments, la surveillance des constantes vitales et une réponse immédiate aux besoins du patient tout au long de la nuit.', min_price = 150, max_price = 350, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000011';
UPDATE service_categories_config SET description_en = 'Long-term chronic disease management and follow-up. Regular home visits for patients with diabetes, hypertension, COPD, and other chronic conditions. Includes therapeutic education, medication adherence monitoring, and physician coordination.', description_fr = 'Gestion et suivi des maladies chroniques à long terme. Visites régulières à domicile pour les patients atteints de diabète, d''hypertension, de BPCO et d''autres affections chroniques. Comprend l''éducation thérapeutique, le suivi de l''observance médicamenteuse et la coordination avec le médecin traitant.', min_price = 40, max_price = 150, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000012';
UPDATE service_categories_config SET description_en = 'Mobile radiology and medical imaging services. Portable X-ray and ultrasound examinations performed at home by certified radiographers. Results reviewed by radiologists with reports delivered within 24 hours.', description_fr = 'Services de radiologie et d''imagerie médicale mobiles. Examens de radiographie et d''échographie portables réalisés à domicile par des manipulateurs certifiés. Résultats examinés par des radiologues avec un compte rendu livré sous 24 heures.', min_price = 80, max_price = 350, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000013';
UPDATE service_categories_config SET description_en = 'At-home fitness coaching and rehabilitation exercise programs. Certified trainers design personalized routines for senior mobility, post-injury recovery, weight management, and general physical conditioning. Equipment provided when needed.', description_fr = 'Coaching fitness et programmes d''exercices de rééducation à domicile. Des entraîneurs certifiés conçoivent des routines personnalisées pour la mobilité des seniors, la récupération après blessure, la gestion du poids et le conditionnement physique général. Équipement fourni si nécessaire.', min_price = 50, max_price = 200, badge = NULL WHERE id = '41000000-0000-0000-0000-000000000014';


-- ==============================================================
-- 1E. EQUIPMENT CATEGORIES CONFIG (6 rows)
-- ==============================================================
INSERT INTO equipment_categories_config (id, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, icon, color, default_commission_rate, is_active, display_order, created_at)
VALUES
  ('42000000-0000-0000-0000-000000000001', 'mobilite', 'Mobility Equipment', 'Équipement de Mobilité', 'معدات التنقل', 'Mobilitätshilfen', 'Wheelchairs, walkers, crutches, and mobility scooters for patients with reduced mobility. Available in standard and electric models with home delivery and fitting.', 'Fauteuils roulants, déambulateurs, béquilles et scooters de mobilité pour les patients à mobilité réduite. Disponibles en modèles standard et électriques avec livraison et ajustement à domicile.', 'wheelchair', '#4CAF50', 10.0, true, 1, CURRENT_TIMESTAMP),
  ('42000000-0000-0000-0000-000000000002', 'respiratoire', 'Respiratory Equipment', 'Équipement Respiratoire', 'معدات التنفس', 'Atemgeräte', 'Oxygen concentrators, CPAP/BiPAP machines, nebulizers, and pulse oximeters for respiratory care. Includes setup, training, and ongoing technical support.', 'Concentrateurs d''oxygène, appareils CPAP/BiPAP, nébuliseurs et oxymètres de pouls pour les soins respiratoires. Comprend l''installation, la formation et le support technique continu.', 'lungs', '#2196F3', 12.0, true, 2, CURRENT_TIMESTAMP),
  ('42000000-0000-0000-0000-000000000003', 'lit_medicalise', 'Hospital Beds', 'Lits Médicalisés', 'أسرة طبية', 'Krankenhausbetten', 'Electric hospital beds with anti-bedsore mattresses, adjustable head and foot sections, and safety rails. Professional delivery, installation, and removal included.', 'Lits médicalisés électriques avec matelas anti-escarres, sections tête et pieds réglables et barrières de sécurité. Livraison professionnelle, installation et enlèvement inclus.', 'bed', '#FF9800', 15.0, true, 3, CURRENT_TIMESTAMP),
  ('42000000-0000-0000-0000-000000000004', 'monitoring', 'Monitoring Devices', 'Appareils de Surveillance', 'أجهزة المراقبة', 'Überwachungsgeräte', 'Blood pressure monitors, glucose meters, ECG devices, and patient monitoring systems for home use. Connected devices with remote data sharing capabilities.', 'Tensiomètres, glucomètres, appareils ECG et systèmes de surveillance des patients pour une utilisation à domicile. Appareils connectés avec capacités de partage de données à distance.', 'heart-pulse', '#E91E63', 10.0, true, 4, CURRENT_TIMESTAMP),
  ('42000000-0000-0000-0000-000000000005', 'reeducation', 'Rehabilitation Equipment', 'Matériel de Rééducation', 'معدات التأهيل', 'Rehabilitationsgeräte', 'Resistance bands, pedal exercisers, balance boards, and therapy balls for home rehabilitation. Selected by physiotherapists to support recovery programs.', 'Bandes de résistance, pédaliers, planches d''équilibre et ballons de thérapie pour la rééducation à domicile. Sélectionnés par des kinésithérapeutes pour accompagner les programmes de récupération.', 'dumbbell', '#9C27B0', 8.0, true, 5, CURRENT_TIMESTAMP),
  ('42000000-0000-0000-0000-000000000006', 'aide_quotidienne', 'Daily Living Aids', 'Aides à la Vie Quotidienne', 'مساعدات الحياة اليومية', 'Alltagshilfen', 'Shower chairs, grab bars, raised toilet seats, and reaching aids for safer daily living. Designed for seniors and patients recovering from surgery or injury.', 'Chaises de douche, barres d''appui, rehausseurs de toilettes et pinces de préhension pour un quotidien plus sûr. Conçus pour les seniors et les patients en convalescence après une chirurgie ou une blessure.', 'human-cane', '#009688', 8.0, true, 6, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 1F. NEW PROVIDERS (20 rows, providers 16-35)
-- ==============================================================
INSERT INTO providers (id, user_id, service_category, is_individual, first_name, last_name, license_number, license_issuing_authority, license_expiry_date, specializations, years_of_experience, education, certifications, bio, short_description, city, country_code, latitude, longitude, service_radius_km, serves_at_home, serves_at_clinic, rating_average, rating_count, rating_professionalism, rating_punctuality, rating_quality, total_bookings, completed_bookings, cancelled_bookings, total_revenue, response_rate, response_time_minutes, is_verified, verified_at, is_approved, approved_at, approved_by, commission_rate, is_available, availability_status, profile_completed, onboarding_step, featured, created_at, updated_at, business_name, legal_name, tax_id, state_province, postal_code, no_show_count, bank_account_number, bank_name, bank_routing_number, stripe_account_id, stripe_account_status, auto_accept_bookings, instant_booking_enabled, max_booking_advance_days, min_booking_notice_hours, gallery_urls)
VALUES
  ('12000000-0000-0000-0000-000000000016', '21000000-0000-0000-0000-000000000016', 'pharmacy', false, 'Souad', 'Meddeb', 'PHA-TN-2019-016', 'Ministère de la Santé Tunisie', '2028-01-30', ARRAY['Pharmacie clinique', 'Conseils médicamenteux', 'Phytothérapie']::text[], 12, 'Faculté de Pharmacie de Monastir', ARRAY['Diplôme de Docteur en Pharmacie', 'DU Pharmacie Clinique']::text[], 'Pharmacie Centrale, située au cœur de Tunis, offre un service complet de livraison de médicaments à domicile. Notre équipe de pharmaciens diplômés assure le conseil médicamenteux et le suivi de l''observance thérapeutique.', 'Pharmacie avec livraison à domicile - Tunis', 'Tunis', 'TN', 36.7992, 10.1802, 20, true, true, 4.6, 35, 4.7, 4.5, 4.8, 35, 33, 1, 12500.0, 95.0, 15, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 8, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Pharmacie Centrale Tunis', 'Pharmacie Centrale SARL', 'PHA-TN-2019-016', 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000017', '21000000-0000-0000-0000-000000000017', 'pharmacy', false, 'Rania', 'Bouslama', 'PHA-TN-2020-017', 'Ministère de la Santé Tunisie', '2029-04-30', ARRAY['Pharmacie officinale', 'Dermocosmétique', 'Orthopédie']::text[], 8, 'Faculté de Pharmacie de Monastir', ARRAY['Diplôme de Docteur en Pharmacie']::text[], 'Pharmacie du Lac dessert le quartier de La Marsa avec un service rapide de livraison et de conseil pharmaceutique. Spécialisée en dermocosmétique et produits naturels.', 'Pharmacie avec livraison rapide - La Marsa', 'La Marsa', 'TN', 36.8786, 10.3247, 15, true, true, 4.4, 22, 4.5, 4.3, 4.6, 22, 20, 1, 8900.0, 92.0, 18, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 8, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Pharmacie du Lac', 'Pharmacie du Lac SARL', 'PHA-TN-2020-017', 'Tunis', '2078', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000018', '21000000-0000-0000-0000-000000000018', 'pharmacy', false, 'Amine', 'Fakhfakh', 'PHA-TN-2018-018', 'Ministère de la Santé Tunisie', '2027-07-30', ARRAY['Pharmacie hospitalière', 'Préparations magistrales', 'Conseil nutritionnel']::text[], 14, 'Faculté de Pharmacie de Monastir', ARRAY['Diplôme de Docteur en Pharmacie', 'Attestation Préparations Magistrales']::text[], 'Pharmacie Pasteur à Sfax propose un service complet de livraison pharmaceutique. Forte de 14 ans d''expérience, notre officine est reconnue pour ses préparations magistrales et son accompagnement personnalisé.', 'Pharmacie avec préparations magistrales - Sfax', 'Sfax', 'TN', 34.7406, 10.7603, 25, true, true, 4.7, 40, 4.8, 4.6, 4.9, 40, 38, 1, 15200.0, 93.0, 20, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 8, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Pharmacie Pasteur Sfax', 'Pharmacie Pasteur SARL', 'PHA-TN-2018-018', 'Sfax', '3000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000019', '21000000-0000-0000-0000-000000000019', 'funeral', false, 'Habib', 'Chahed', 'FUN-TN-2015-019', 'Ministère de la Santé Tunisie', '2028-10-30', ARRAY['Toilette mortuaire islamique', 'Rapatriement de corps', 'Organisation de cérémonies']::text[], 18, 'Formation professionnelle en services funéraires', ARRAY['Agrément Ministère de l''Intérieur', 'Certificat Transport Funéraire']::text[], 'El Firdaws Funéraire accompagne les familles dans les moments difficiles avec dignité et respect des traditions islamiques. Service disponible 24h/24 pour la prise en charge complète des obsèques.', 'Services funéraires islamiques 24h/24 - Tunis', 'Tunis', 'TN', 36.8065, 10.1815, 40, true, false, 4.8, 28, 4.9, 4.8, 4.9, 28, 28, 0, 65000.0, 99.0, 10, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 5, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'El Firdaws Funéraire', 'El Firdaws Services Funéraires SARL', 'FUN-TN-2015-019', 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000020', '21000000-0000-0000-0000-000000000020', 'funeral', false, 'Nabil', 'Souissi', 'FUN-TN-2017-020', 'Ministère de la Santé Tunisie', '2029-01-30', ARRAY['Services funéraires complets', 'Transport national', 'Formalités administratives']::text[], 10, 'Formation services funéraires - Chambre de Commerce de Sousse', ARRAY['Agrément Préfectoral', 'Certificat Transport Funéraire']::text[], 'Essalem Pompes Funèbres offre des services funéraires complets dans la région de Sousse. Accompagnement respectueux des familles avec prise en charge administrative et logistique intégrale.', 'Pompes funèbres complètes - Sousse', 'Sousse', 'TN', 35.8288, 10.6405, 35, true, false, 4.5, 18, 4.6, 4.5, 4.6, 18, 18, 0, 42000.0, 97.0, 12, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 5, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Essalem Pompes Funèbres', 'Essalem PF SARL', 'FUN-TN-2017-020', 'Sousse', '4000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000021', '21000000-0000-0000-0000-000000000021', 'veterinary', true, 'Dr. Sami', 'Ghorbel', 'VET-TN-2016-021', 'Ministère de la Santé Tunisie', '2027-04-30', ARRAY['Médecine des carnivores', 'Chirurgie vétérinaire', 'Vaccination']::text[], 11, 'École Nationale de Médecine Vétérinaire de Sidi Thabet', ARRAY['Diplôme de Docteur Vétérinaire', 'Certificat Chirurgie Animale']::text[], 'Dr. Sami Ghorbel, vétérinaire diplômé de l''ENMV de Sidi Thabet, se déplace à domicile pour les soins courants et les urgences animales. Spécialisé dans les carnivores domestiques avec 11 ans de pratique.', 'Vétérinaire à domicile - Tunis', 'Tunis', 'TN', 36.819, 10.1657, 20, true, false, 4.7, 32, 4.8, 4.6, 4.9, 32, 30, 1, 9800.0, 91.0, 25, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1002', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000022', '21000000-0000-0000-0000-000000000022', 'veterinary', false, 'Imen', 'Bouaziz', 'VET-TN-2018-022', 'Ministère de la Santé Tunisie', '2028-07-30', ARRAY['Médecine interne animale', 'Dermatologie vétérinaire', 'Échographie animale']::text[], 8, 'École Nationale de Médecine Vétérinaire de Sidi Thabet', ARRAY['Diplôme de Docteur Vétérinaire', 'CES Dermatologie Vétérinaire']::text[], 'Clinique Animalia propose des consultations vétérinaires à domicile dans la région de Sousse. Équipe de vétérinaires spécialisés en médecine interne et dermatologie des animaux de compagnie.', 'Clinique vétérinaire mobile - Sousse', 'Sousse', 'TN', 35.84, 10.61, 25, true, true, 4.3, 15, 4.4, 4.2, 4.5, 15, 14, 0, 5200.0, 88.0, 30, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Clinique Animalia', 'Animalia Vétérinaire SARL', 'VET-TN-2018-022', 'Sousse', '4000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000023', '21000000-0000-0000-0000-000000000023', 'veterinary', false, 'Walid', 'Kammoun', 'VET-TN-2019-023', 'Ministère de la Santé Tunisie', '2029-10-30', ARRAY['Urgences vétérinaires', 'Chirurgie', 'Vaccination et prophylaxie']::text[], 7, 'École Nationale de Médecine Vétérinaire de Sidi Thabet', ARRAY['Diplôme de Docteur Vétérinaire']::text[], 'SOS Animaux Sfax assure les urgences vétérinaires et les soins à domicile dans le Grand Sfax. Disponible en dehors des heures ouvrables pour les situations critiques.', 'Urgences vétérinaires à domicile - Sfax', 'Sfax', 'TN', 34.75, 10.77, 30, true, false, 4.1, 10, 4.2, 4.0, 4.3, 10, 9, 0, 3800.0, 85.0, 35, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SOS Animaux Sfax', 'SOS Animaux SARL', 'VET-TN-2019-023', 'Sfax', '3000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000024', '21000000-0000-0000-0000-000000000024', 'radiology', false, 'Lassaad', 'Toumi', 'RAD-TN-2016-024', 'Ministère de la Santé Tunisie', '2027-01-30', ARRAY['Radiographie mobile', 'Échographie à domicile', 'Imagerie numérique']::text[], 15, 'Faculté de Médecine de Tunis - Spécialité Radiologie', ARRAY['Diplôme de Docteur en Médecine', 'DES Radiologie et Imagerie Médicale']::text[], 'Centre Imagerie Tunis déploie des équipements de radiologie portable pour des examens à domicile. Résultats interprétés par des radiologues expérimentés et transmis sous 24 heures.', 'Imagerie médicale mobile - Tunis', 'Tunis', 'TN', 36.81, 10.17, 25, true, false, 4.5, 20, 4.6, 4.4, 4.7, 20, 19, 0, 11200.0, 90.0, 20, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 10, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Centre Imagerie Tunis', 'CIT Radiologie SARL', 'RAD-TN-2016-024', 'Tunis', '1002', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000025', '21000000-0000-0000-0000-000000000025', 'radiology', false, 'Kamel', 'Sahnoun', 'RAD-TN-2017-025', 'Ministère de la Santé Tunisie', '2028-04-30', ARRAY['IRM', 'Scanner', 'Radiographie conventionnelle']::text[], 12, 'Faculté de Médecine de Sousse - Spécialité Radiologie', ARRAY['Diplôme de Docteur en Médecine', 'DES Radiologie']::text[], 'IRM Plus Sousse propose des services d''imagerie médicale à domicile et en centre. Équipements de dernière génération pour un diagnostic précis et rapide dans la région de Sousse.', 'Imagerie et IRM mobile - Sousse', 'Sousse', 'TN', 35.835, 10.63, 30, true, true, 4.4, 16, 4.5, 4.3, 4.6, 16, 15, 0, 8500.0, 88.0, 25, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 10, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'IRM Plus Sousse', 'IRM Plus SARL', 'RAD-TN-2017-025', 'Sousse', '4000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000026', '21000000-0000-0000-0000-000000000026', 'gym', false, 'Yassine', 'Chiboub', 'GYM-TN-2020-026', 'Ministère de la Santé Tunisie', '2029-07-30', ARRAY['Coaching sportif à domicile', 'Remise en forme senior', 'Préparation physique']::text[], 6, 'Institut Supérieur du Sport et de l''Éducation Physique de Tunis', ARRAY['Licence STAPS', 'Certificat Coach Sportif Professionnel']::text[], 'Fitness Club Tunis envoie des coachs sportifs certifiés à domicile. Programmes personnalisés de remise en forme, renforcement musculaire et prévention des chutes pour seniors.', 'Coaching sportif à domicile - Tunis', 'Tunis', 'TN', 36.8, 10.185, 20, true, false, 4.6, 25, 4.7, 4.5, 4.8, 25, 23, 1, 6200.0, 92.0, 15, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 20, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Fitness Club Tunis', 'Fitness Club SARL', 'GYM-TN-2020-026', 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000027', '21000000-0000-0000-0000-000000000027', 'gym', false, 'Sara', 'Bouzgarrou', 'GYM-TN-2021-027', 'Ministère de la Santé Tunisie', '2027-10-30', ARRAY['Pilates', 'Yoga thérapeutique', 'Rééducation sportive']::text[], 5, 'Institut Supérieur du Sport et de l''Éducation Physique de Tunis', ARRAY['Licence STAPS', 'Certificat Pilates et Yoga']::text[], 'Remise en Forme Ariana propose des séances de coaching doux à domicile dans la banlieue nord de Tunis. Spécialisée en pilates, yoga thérapeutique et programmes de mobilité douce.', 'Coaching doux et pilates - Ariana', 'Ariana', 'TN', 36.8622, 10.1928, 15, true, false, 4.8, 18, 4.9, 4.7, 5.0, 18, 17, 0, 4300.0, 94.0, 12, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 20, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Remise en Forme Ariana', 'Remise en Forme SARL', 'GYM-TN-2021-027', 'Ariana', '2080', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000028', '21000000-0000-0000-0000-000000000028', 'maternity', true, 'Amina', 'Rezgui', 'SAG-TN-2017-028', 'Ministère de la Santé Tunisie', '2028-01-30', ARRAY['Suivi de grossesse', 'Préparation à l''accouchement', 'Soins post-partum', 'Allaitement']::text[], 10, 'École Supérieure des Sciences et Techniques de la Santé de Tunis', ARRAY['Diplôme de Sage-Femme', 'DU Lactation et Allaitement']::text[], 'Amina Rezgui, sage-femme diplômée avec 10 ans d''expérience, propose un suivi personnalisé de la grossesse et du post-partum à domicile. Spécialisée en accompagnement de l''allaitement et rééducation périnéale.', 'Sage-femme à domicile - Tunis', 'Tunis', 'TN', 36.812, 10.175, 20, true, false, 4.9, 30, 5.0, 4.8, 5.0, 30, 29, 0, 7500.0, 96.0, 15, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000029', '21000000-0000-0000-0000-000000000029', 'night_care', true, 'Samir', 'Belkhodja', 'NUR-TN-2015-029', 'Ministère de la Santé Tunisie', '2029-04-30', ARRAY['Surveillance nocturne', 'Soins palliatifs', 'Administration médicamenteuse']::text[], 13, 'Institut Supérieur des Sciences Infirmières de Tunis', ARRAY['Diplôme d''Infirmier', 'DU Soins Palliatifs']::text[], 'Samir Belkhodja, infirmier spécialisé en garde de nuit, assure une surveillance continue et la prise en charge médicamenteuse nocturne. 13 ans d''expérience en soins palliatifs et accompagnement de fin de vie.', 'Infirmier de nuit spécialisé - Tunis', 'Tunis', 'TN', 36.805, 10.19, 25, true, false, 4.6, 22, 4.7, 4.6, 4.7, 22, 21, 0, 14300.0, 93.0, 20, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000030', '21000000-0000-0000-0000-000000000030', 'chronic_care', true, 'Hichem', 'Bouzaiene', 'NUR-TN-2016-030', 'Ministère de la Santé Tunisie', '2027-07-30', ARRAY['Diabétologie', 'Cardiologie', 'Éducation thérapeutique']::text[], 11, 'Institut Supérieur des Sciences Infirmières de Tunis', ARRAY['Diplôme d''Infirmier', 'DU Éducation Thérapeutique du Patient']::text[], 'Hichem Bouzaiene est infirmier spécialisé dans le suivi des maladies chroniques à domicile. Il accompagne les patients diabétiques et hypertendus avec des programmes d''éducation thérapeutique personnalisés.', 'Suivi maladies chroniques - Ariana', 'Ariana', 'TN', 36.86, 10.165, 20, true, false, 4.5, 27, 4.6, 4.4, 4.7, 27, 25, 1, 8100.0, 91.0, 22, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Ariana', '2080', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000031', '21000000-0000-0000-0000-000000000031', 'babysitting', true, 'Najla', 'Maatoug', 'BAB-TN-2020-031', 'Ministère de la Santé Tunisie', '2028-10-30', ARRAY['Garde d''enfants', 'Premiers secours pédiatriques', 'Éveil et activités ludiques']::text[], 6, 'Formation Petite Enfance - Croissant-Rouge Tunisien', ARRAY['Certificat Auxiliaire de Puériculture', 'PSC1 Pédiatrique']::text[], 'Najla Maatoug propose des services de baby-sitting qualifiés à domicile sur Tunis. Formée aux premiers secours pédiatriques et à l''éveil de l''enfant, elle prend en charge les enfants de 3 mois à 10 ans.', 'Baby-sitting qualifié - Tunis', 'Tunis', 'TN', 36.808, 10.178, 15, true, false, 4.7, 20, 4.8, 4.6, 4.9, 20, 19, 0, 3200.0, 94.0, 10, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 10, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000032', '21000000-0000-0000-0000-000000000032', 'babysitting', true, 'Dorra', 'Zouari', 'BAB-TN-2021-032', 'Ministère de la Santé Tunisie', '2029-01-30', ARRAY['Garde de nourrissons', 'Aide aux devoirs', 'Activités créatives']::text[], 4, 'Formation Petite Enfance - Institut de Formation Sfax', ARRAY['Certificat Auxiliaire de Puériculture']::text[], 'Dorra Zouari offre des services de garde d''enfants à Sfax. Expérimentée dans la prise en charge des nourrissons et des jeunes enfants, elle propose également l''aide aux devoirs et des activités créatives.', 'Garde d''enfants à domicile - Sfax', 'Sfax', 'TN', 34.745, 10.765, 20, true, false, 4.4, 12, 4.5, 4.3, 4.6, 12, 11, 0, 1800.0, 90.0, 15, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 10, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Sfax', '3000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000033', '21000000-0000-0000-0000-000000000033', 'medical_companion', true, 'Nadia', 'Triki', 'MCA-TN-2019-033', 'Ministère de la Santé Tunisie', '2027-04-30', ARRAY['Accompagnement hospitalier', 'Coordination médicale', 'Aide administrative santé']::text[], 8, 'Institut Supérieur des Sciences Infirmières de Tunis', ARRAY['Diplôme d''Infirmier', 'Formation Accompagnement Patient']::text[], 'Nadia Triki accompagne les patients lors de leurs rendez-vous médicaux, hospitalisations et examens. Elle assure la coordination avec les professionnels de santé et la transmission fidèle des informations.', 'Accompagnement rendez-vous médicaux - Tunis', 'Tunis', 'TN', 36.815, 10.168, 20, true, false, 4.6, 15, 4.7, 4.5, 4.8, 15, 14, 0, 4500.0, 93.0, 18, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1002', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000034', '21000000-0000-0000-0000-000000000034', 'checkup', true, 'Dr. Khaled', 'Ennouri', 'MED-TN-2014-034', 'Ministère de la Santé Tunisie', '2028-07-30', ARRAY['Bilan de santé complet', 'Médecine préventive', 'Check-up annuel']::text[], 13, 'Faculté de Médecine de Tunis', ARRAY['Diplôme de Docteur en Médecine', 'DES Médecine Générale', 'DU Médecine Préventive']::text[], 'Dr. Khaled Ennouri réalise des bilans de santé complets à domicile : examen clinique, ECG portable, prélèvements sanguins et rapport médical détaillé. 13 ans d''expérience en médecine préventive.', 'Bilan de santé complet à domicile - Tunis', 'Tunis', 'TN', 36.82, 10.166, 25, true, false, 4.8, 24, 4.9, 4.7, 5.0, 24, 23, 0, 10200.0, 95.0, 15, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 15, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1002', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000035', '21000000-0000-0000-0000-000000000035', 'doctor', true, 'Dr. Nadia', 'Sellami', 'MED-TN-2015-035', 'Ministère de la Santé Tunisie', '2029-10-30', ARRAY['Cardiologie', 'ECG', 'Échocardiographie', 'Suivi post-infarctus']::text[], 12, 'Faculté de Médecine de Tunis - Spécialité Cardiologie', ARRAY['Diplôme de Docteur en Médecine', 'DES Cardiologie', 'Certificat Échocardiographie']::text[], 'Dr. Nadia Sellami, cardiologue diplômée, propose des consultations cardiologiques à domicile dans la région d''Ariana. ECG portable, auscultation et suivi des pathologies cardiovasculaires.', 'Cardiologue à domicile - Ariana', 'Ariana', 'TN', 36.865, 10.195, 20, true, true, 4.9, 35, 5.0, 4.8, 5.0, 35, 33, 1, 12800.0, 94.0, 18, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 18, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Ariana', '2080', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[])
ON CONFLICT DO NOTHING;


-- ==============================================================
-- 1G. UPDATE EXISTING 15 PROVIDERS (specializations, certifications, bios, education, license dates)
-- ==============================================================
UPDATE providers SET specializations = ARRAY['Médecine générale', 'Cardiologie', 'Médecine interne']::text[], certifications = ARRAY['Diplôme de Docteur en Médecine', 'DES Médecine Générale']::text[], bio = 'Dr. Amira Mansour est médecin généraliste avec une formation complémentaire en cardiologie. Elle assure des consultations complètes à domicile incluant ECG portable et suivi des pathologies chroniques sur le Grand Tunis.', education = 'Faculté de Médecine de Tunis', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000001';
UPDATE providers SET specializations = ARRAY['Pédiatrie', 'Gériatrie', 'Médecine préventive']::text[], certifications = ARRAY['Diplôme de Docteur en Médecine', 'DES Pédiatrie']::text[], bio = 'Dr. Faouzi Ayadi, pédiatre et gériatre, se déplace à domicile pour les consultations des enfants et des personnes âgées. Approche bienveillante et suivi personnalisé des vaccinations et des bilans de santé.', education = 'Faculté de Médecine de Sousse', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000002';
UPDATE providers SET specializations = ARRAY['Soins intensifs', 'Perfusions et injections', 'Soins de plaies']::text[], certifications = ARRAY['Diplôme d''Infirmier', 'DU Soins Intensifs']::text[], bio = 'Karim Bouazizi, infirmier spécialisé en soins intensifs, réalise des perfusions, injections et soins de plaies complexes à domicile. Expérience de 8 ans en milieu hospitalier et à domicile dans la région de Sfax.', education = 'Institut Supérieur des Sciences Infirmières de Sfax', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000003';
UPDATE providers SET specializations = ARRAY['Soins post-partum', 'Soins respiratoires', 'Éducation thérapeutique']::text[], certifications = ARRAY['Diplôme d''Infirmière', 'DU Périnatalité']::text[], bio = 'Samia Dhahri est infirmière spécialisée en soins post-partum et accompagnement périnatal. Elle assure le suivi des jeunes mères et nouveau-nés ainsi que les soins respiratoires à domicile à Sousse.', education = 'Institut Supérieur des Sciences Infirmières de Sousse', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000004';
UPDATE providers SET specializations = ARRAY['Rééducation motrice', 'Rééducation post-AVC', 'Massage thérapeutique']::text[], certifications = ARRAY['Diplôme de Kinésithérapeute', 'Master Rééducation Neurologique']::text[], bio = 'Leila Hamdi, kinésithérapeute diplômée, est spécialisée en rééducation neurologique et post-AVC. Programmes personnalisés de rééducation à domicile dans la région de Monastir.', education = 'Institut Supérieur de Biotechnologie de Monastir', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000005';
UPDATE providers SET specializations = ARRAY['Kinésithérapie sportive', 'Drainage lymphatique', 'Rééducation fonctionnelle']::text[], certifications = ARRAY['Diplôme de Kinésithérapeute', 'Certificat Kinésithérapie Sportive']::text[], bio = 'Slim Nasr, kinésithérapeute du sport, prend en charge les blessures sportives et la récupération fonctionnelle. Techniques de drainage lymphatique et de rééducation active à domicile dans la région de Bizerte.', education = 'Institut Supérieur de Biotechnologie de Monastir', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000006';
UPDATE providers SET specializations = ARRAY['Biochimie', 'Hématologie', 'Sérologie', 'Bactériologie']::text[], certifications = ARRAY['Diplôme de Technicien de Laboratoire', 'DU Biologie Médicale']::text[], bio = 'Mehdi Jebali, technicien de laboratoire expérimenté, effectue les prélèvements sanguins et urinaires à domicile. Bilans complets avec résultats sous 24h livrés de manière sécurisée dans la région de Nabeul.', education = 'ISBM - Institut Supérieur de Biotechnologie de Monastir', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000007';
UPDATE providers SET specializations = ARRAY['Transport médicalisé', 'Soins avancés', 'Transferts inter-hospitaliers']::text[], certifications = ARRAY['Diplôme d''Ambulancier', 'AFGSU Niveau 2']::text[], bio = 'Riadh Chebbi dirige un service d''ambulance médicalisée à Tunis. Véhicules équipés et personnel formé aux soins d''urgence pour les transferts hospitaliers et les transports non urgents.', education = 'Centre de Formation Ambulancière de Tunis', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000008';
UPDATE providers SET specializations = ARRAY['Fauteuils roulants', 'Lits médicalisés', 'Concentrateurs oxygène', 'Matériel de monitoring']::text[], certifications = ARRAY['Formation Technicien Matériel Médical']::text[], bio = 'Sonia Ayari gère un parc d''équipements médicaux en location à Tunis. Livraison, installation et formation à l''utilisation incluses. Support technique disponible 7j/7 pour les patients et familles.', education = 'Formation continue - Fournisseurs Matériel Médical', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000009';
UPDATE providers SET specializations = ARRAY['Thérapie cognitive-comportementale', 'Anxiété et dépression', 'Thérapie de couple']::text[], certifications = ARRAY['Diplôme de Psychologue Clinicien', 'Master Psychologie Clinique']::text[], bio = 'Dr. Zied Elloumi, psychologue clinicien, propose des séances de thérapie individuelle et de couple à domicile. Spécialisé en thérapie cognitive-comportementale pour l''anxiété, la dépression et le stress post-traumatique.', education = 'Faculté des Sciences Humaines et Sociales de Tunis', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000010';
UPDATE providers SET specializations = ARRAY['Nutrition clinique', 'Diabétologie nutritionnelle', 'Alimentation sportive']::text[], certifications = ARRAY['Diplôme de Nutritionniste', 'DU Nutrition et Maladies Métaboliques']::text[], bio = 'Hana Turki, nutritionniste diplômée, élabore des programmes alimentaires personnalisés pour diabétiques, patients en surpoids et sportifs. Consultations à domicile avec suivi régulier à Hammamet.', education = 'Institut National de Nutrition de Tunis', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000011';
UPDATE providers SET specializations = ARRAY['Accompagnement quotidien', 'Stimulation cognitive', 'Aide à la mobilité']::text[], certifications = ARRAY['Certificat Aide-Soignant', 'Formation Maladie d''Alzheimer']::text[], bio = 'Bassem Ghariani, aide-soignant spécialisé, accompagne les personnes âgées dépendantes à leur domicile. Activités de stimulation cognitive, aide à la toilette et préparation des repas dans la banlieue d''Ariana.', education = 'Centre de Formation des Aides-Soignants de Tunis', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000012';
UPDATE providers SET specializations = ARRAY['Soins de stomie', 'Contrôle glycémique', 'Soins palliatifs']::text[], certifications = ARRAY['Diplôme d''Infirmière', 'DU Soins Palliatifs']::text[], bio = 'Manel Keskes est infirmière spécialisée dans les soins de stomie et le suivi glycémique à domicile. Elle intervient également en soins palliatifs avec une approche humaine et bienveillante dans la région de Sfax.', education = 'Institut Supérieur des Sciences Infirmières de Sfax', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000013';
UPDATE providers SET specializations = ARRAY['Dermatologie', 'Gynécologie-Obstétrique', 'Médecine générale']::text[], certifications = ARRAY['Diplôme de Docteur en Médecine', 'DES Gynécologie-Obstétrique']::text[], bio = 'Dr. Rim Ben Ammar, gynécologue-obstétricienne, assure le suivi de grossesse et les consultations dermatologiques à domicile. Disponible pour les urgences obstétricales dans la région de Sousse.', education = 'Faculté de Médecine de Sousse', license_expiry_date = '2028-06-30' WHERE id = '12000000-0000-0000-0000-000000000014';
UPDATE providers SET specializations = ARRAY['Rééducation du dos', 'Électrostimulation', 'Rééducation posturale']::text[], certifications = ARRAY['Diplôme de Kinésithérapeute', 'DU Thérapie Manuelle']::text[], bio = 'Aymen Baccouche, kinésithérapeute spécialisé en rééducation vertébrale, traite les lombalgies chroniques et les troubles posturaux. Techniques d''électrostimulation et de thérapie manuelle à domicile à Monastir.', education = 'Institut Supérieur de Biotechnologie de Monastir', license_expiry_date = '2028-12-31' WHERE id = '12000000-0000-0000-0000-000000000015';

-- ==============================================================
-- 1H. NUTRITION SUBTYPE TRUTH (users/providers 36-37 + Hana upgrade)
-- ==============================================================
INSERT INTO users (id, email, email_verified, email_verified_at, password_hash, role, is_active, is_suspended, phone, phone_verified, phone_verified_at, preferred_language, timezone, last_login_at, created_at, updated_at, last_login_ip, two_factor_secret, failed_login_attempts, two_factor_enabled)
VALUES
  ('21000000-0000-0000-0000-000000000036', 'maison.nutrition.sfax@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200036', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false),
  ('21000000-0000-0000-0000-000000000037', 'chef.ines.ayedi@sanad.tn', true, CURRENT_TIMESTAMP, '$2b$12$dnZMJgRsJhgCkB7EYlJhc.YxuzHNh8DP1QmdFozShlF/..gard2oi', 'provider', true, false, '+21650200037', true, CURRENT_TIMESTAMP, 'fr', 'Africa/Tunis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '', 0, false)
ON CONFLICT DO NOTHING;

INSERT INTO providers (id, user_id, service_category, nutrition_provider_subtype, is_individual, first_name, last_name, license_number, license_issuing_authority, license_expiry_date, specializations, years_of_experience, education, certifications, bio, short_description, city, country_code, latitude, longitude, service_radius_km, serves_at_home, serves_at_clinic, rating_average, rating_count, rating_professionalism, rating_punctuality, rating_quality, total_bookings, completed_bookings, cancelled_bookings, total_revenue, response_rate, response_time_minutes, is_verified, verified_at, is_approved, approved_at, approved_by, commission_rate, is_available, availability_status, profile_completed, onboarding_step, featured, created_at, updated_at, business_name, legal_name, tax_id, state_province, postal_code, no_show_count, bank_account_number, bank_name, bank_routing_number, stripe_account_id, stripe_account_status, auto_accept_bookings, instant_booking_enabled, max_booking_advance_days, min_booking_notice_hours, gallery_urls)
VALUES
  ('12000000-0000-0000-0000-000000000036', '21000000-0000-0000-0000-000000000036', 'nutrition', 'Restaurant', false, 'Maison', 'Nutrition', 'NUT-REST-TN-2021-036', 'Ministère de la Santé Tunisie', '2029-06-30', ARRAY['Repas thérapeutiques', 'Livraison équilibrée', 'Menus diabétiques']::text[], 9, 'Institut Supérieur des Études Technologiques de Sfax', ARRAY['Certification HACCP', 'Formation Cuisine Santé']::text[], 'Maison Nutrition Sfax prépare et livre des menus équilibrés pensés pour les patients diabétiques, cardiaques et en rééducation. Les repas sont conçus avec une approche nutritionnelle structurée, sans heuristique côté front.', 'Restaurant nutrition santé - Sfax', 'Sfax', 'TN', 34.7406, 10.7603, 18, true, true, 4.8, 18, 4.8, 4.7, 4.9, 18, 17, 0, 9800.0, 94.0, 25, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Maison Nutrition Sfax', 'Maison Nutrition Sfax SARL', 'REST-TN-2021-036', 'Sfax', '3000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[]),
  ('12000000-0000-0000-0000-000000000037', '21000000-0000-0000-0000-000000000037', 'nutrition', 'Chef', true, 'Ines', 'Ayedi', 'NUT-CHEF-TN-2022-037', 'Ministère de la Santé Tunisie', '2029-09-30', ARRAY['Cuisine santé à domicile', 'Préparation de repas', 'Menus végétariens']::text[], 7, 'Institut National de Nutrition de Tunis', ARRAY['Certification HACCP', 'Formation Cuisine Thérapeutique']::text[], 'Ines Ayedi, cheffe spécialisée en nutrition santé, prépare des repas personnalisés à domicile et construit des routines culinaires adaptées aux objectifs médicaux et de bien-être de ses patients.', 'Cheffe nutrition santé à domicile - Tunis', 'Tunis', 'TN', 36.8065, 10.1815, 25, true, false, 4.9, 14, 5.0, 4.8, 5.0, 14, 13, 0, 6400.0, 96.0, 18, false, NULL, true, CURRENT_TIMESTAMP, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', 12, true, 'available', true, 5, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL, NULL, 'Tunis', '1000', 0, NULL, NULL, NULL, NULL, 'unverified', false, false, 365, 2, ARRAY[]::text[])
ON CONFLICT DO NOTHING;

UPDATE providers SET nutrition_provider_subtype = 'Nutritionist' WHERE id = '12000000-0000-0000-0000-000000000011';
UPDATE providers SET nutrition_provider_subtype = 'Restaurant' WHERE id = '12000000-0000-0000-0000-000000000036';
UPDATE providers SET nutrition_provider_subtype = 'Chef' WHERE id = '12000000-0000-0000-0000-000000000037';

UPDATE providers
SET is_verified = true,
    verified_at = COALESCE(verified_at, approved_at, CURRENT_TIMESTAMP),
    verification_consent_given = true,
    verification_status = 'approved',
    verification_requested_at = COALESCE(verification_requested_at, approved_at, CURRENT_TIMESTAMP),
    verification_reviewed_at = COALESCE(verification_reviewed_at, approved_at, CURRENT_TIMESTAMP)
WHERE is_approved = true;

-- ==============================================================
-- FRAGMENT 2: Services, Service Addons, and Provider Schedules
-- ==============================================================

-- ==============================================================
-- 2A. NEW SERVICES (IDs 049-085)
-- ==============================================================
INSERT INTO services (id, provider_id, category, name, description, short_description, price, price_type, currency, duration_minutes, service_location, is_active, is_featured, booking_count, metadata, created_at, updated_at, min_price, max_price, requires_medical_history, requires_prescription)
VALUES
  -- Pharmacy - provider 16 (Pharmacie Centrale, Tunis)
  ('22000000-0000-0000-0000-000000000049', '12000000-0000-0000-0000-000000000016', 'pharmacy', 'Livraison Médicaments', 'Livraison de médicaments à domicile avec vérification de l''ordonnance par le pharmacien. Service disponible dans le Grand Tunis.', 'Livraison de médicaments à domicile.', 15.0, 'fixed', 'TND', 60, 'home', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15.0, 15.0, false, true),
  ('22000000-0000-0000-0000-000000000050', '12000000-0000-0000-0000-000000000016', 'pharmacy', 'Consultation Pharmaceutique', 'Entretien personnalisé avec le pharmacien pour optimiser votre traitement et vérifier les interactions médicamenteuses.', 'Conseil pharmaceutique personnalisé.', 25.0, 'fixed', 'TND', 20, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25.0, 25.0, false, false),
  -- Pharmacy - provider 17 (Pharmacie du Lac, La Marsa)
  ('22000000-0000-0000-0000-000000000051', '12000000-0000-0000-0000-000000000017', 'pharmacy', 'Vaccination en Pharmacie', 'Administration de vaccins saisonniers (grippe, COVID) par un pharmacien habilité, avec suivi post-vaccination.', 'Vaccination en officine.', 35.0, 'fixed', 'TND', 15, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35.0, 35.0, false, false),
  ('22000000-0000-0000-0000-000000000052', '12000000-0000-0000-0000-000000000017', 'pharmacy', 'Dépistage Rapide', 'Test de dépistage rapide (glycémie, cholestérol, tension) avec résultats immédiats et conseils du pharmacien.', 'Dépistage rapide en pharmacie.', 20.0, 'fixed', 'TND', 15, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 20.0, 20.0, false, false),
  -- Pharmacy - provider 18 (Pharmacie Pasteur, Sfax)
  ('22000000-0000-0000-0000-000000000053', '12000000-0000-0000-0000-000000000018', 'pharmacy', 'Préparation Magistrale', 'Fabrication de préparations pharmaceutiques sur mesure selon ordonnance médicale, avec contrôle qualité.', 'Préparation magistrale sur ordonnance.', 40.0, 'fixed', 'TND', 30, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40.0, 40.0, false, true),

  -- Funeral - provider 19 (El Firdaws Funéraire, Tunis)
  ('22000000-0000-0000-0000-000000000054', '12000000-0000-0000-0000-000000000019', 'funeral', 'Service Funéraire Standard', 'Prise en charge complète des formalités funéraires : transport, toilette mortuaire, linceul et accompagnement familial.', 'Service funéraire complet standard.', 2000.0, 'fixed', 'TND', 480, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2000.0, 2000.0, false, false),
  ('22000000-0000-0000-0000-000000000055', '12000000-0000-0000-0000-000000000019', 'funeral', 'Service Funéraire Premium', 'Service funéraire haut de gamme avec prise en charge intégrale, coordination des cérémonies et soutien psychologique pour la famille.', 'Service funéraire premium tout inclus.', 4500.0, 'fixed', 'TND', 480, 'home', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4500.0, 4500.0, false, false),
  -- Funeral - provider 20 (Essalem Pompes Funèbres, Sousse)
  ('22000000-0000-0000-0000-000000000056', '12000000-0000-0000-0000-000000000020', 'funeral', 'Rapatriement Dépouille', 'Organisation du rapatriement de la dépouille vers une autre ville ou pays, avec toutes les démarches administratives.', 'Rapatriement de dépouille.', 3500.0, 'fixed', 'TND', 0, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3500.0, 3500.0, false, false),

  -- Veterinary - provider 21 (Dr. Sami, Tunis)
  ('22000000-0000-0000-0000-000000000057', '12000000-0000-0000-0000-000000000021', 'veterinary', 'Consultation Vétérinaire', 'Examen clinique complet de votre animal de compagnie avec diagnostic et prescription de traitement adapté.', 'Consultation vétérinaire générale.', 50.0, 'fixed', 'TND', 30, 'both', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50.0, 50.0, false, false),
  ('22000000-0000-0000-0000-000000000058', '12000000-0000-0000-0000-000000000021', 'veterinary', 'Vaccination Animale', 'Administration des vaccins obligatoires et recommandés pour chiens, chats et autres animaux domestiques.', 'Vaccination pour animaux de compagnie.', 35.0, 'fixed', 'TND', 20, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 35.0, 35.0, false, false),
  -- Veterinary - provider 22 (Clinique Animalia, Sousse)
  ('22000000-0000-0000-0000-000000000059', '12000000-0000-0000-0000-000000000022', 'veterinary', 'Chirurgie Vétérinaire', 'Interventions chirurgicales vétérinaires : stérilisation, détartrage sous anesthésie, chirurgie orthopédique et des tissus mous.', 'Chirurgie vétérinaire diverse.', 200.0, 'range', 'TND', 120, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 200.0, 800.0, false, false),
  ('22000000-0000-0000-0000-000000000060', '12000000-0000-0000-0000-000000000022', 'veterinary', 'Toilettage', 'Toilettage professionnel incluant bain, coupe, brossage et soins des ongles pour chiens et chats.', 'Toilettage complet pour animaux.', 40.0, 'fixed', 'TND', 60, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40.0, 40.0, false, false),
  -- Veterinary - provider 23 (SOS Animaux Sfax)
  ('22000000-0000-0000-0000-000000000061', '12000000-0000-0000-0000-000000000023', 'veterinary', 'Urgence Vétérinaire', 'Prise en charge vétérinaire d''urgence disponible en clinique ou à domicile pour les situations critiques.', 'Urgence vétérinaire 7j/7.', 120.0, 'fixed', 'TND', 60, 'both', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 120.0, 120.0, false, false),
  ('22000000-0000-0000-0000-000000000062', '12000000-0000-0000-0000-000000000023', 'veterinary', 'Pension Animale', 'Hébergement sécurisé pour votre animal avec alimentation, promenades et surveillance vétérinaire quotidienne.', 'Pension pour animaux (tarif journalier).', 25.0, 'daily', 'TND', 0, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 25.0, 25.0, false, false),

  -- Radiology - provider 24 (Centre Imagerie Tunis)
  ('22000000-0000-0000-0000-000000000063', '12000000-0000-0000-0000-000000000024', 'radiology', 'Radiographie Standard', 'Radiographie numérique haute résolution avec interprétation par un radiologue qualifié. Résultats sous 24h.', 'Radiographie numérique standard.', 80.0, 'fixed', 'TND', 20, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, true),
  ('22000000-0000-0000-0000-000000000064', '12000000-0000-0000-0000-000000000024', 'radiology', 'Échographie', 'Échographie diagnostique réalisée par un radiologue expérimenté avec compte-rendu détaillé.', 'Échographie diagnostique.', 120.0, 'fixed', 'TND', 30, 'clinic', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 120.0, 120.0, false, false),
  -- Radiology - provider 25 (IRM Plus Sousse)
  ('22000000-0000-0000-0000-000000000065', '12000000-0000-0000-0000-000000000025', 'radiology', 'Scanner (CT)', 'Tomodensitométrie avec ou sans injection de produit de contraste. Interprétation et remise des images sur CD.', 'Scanner CT haute résolution.', 250.0, 'fixed', 'TND', 45, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 250.0, 250.0, false, true),
  ('22000000-0000-0000-0000-000000000066', '12000000-0000-0000-0000-000000000025', 'radiology', 'IRM', 'Imagerie par résonance magnétique pour un diagnostic précis. Examen sans radiation avec résultats détaillés.', 'IRM diagnostique.', 450.0, 'fixed', 'TND', 60, 'clinic', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 450.0, 450.0, false, true),

  -- Gym - provider 26 (Fitness Club Tunis)
  ('22000000-0000-0000-0000-000000000067', '12000000-0000-0000-0000-000000000026', 'gym', 'Abonnement Mensuel', 'Accès illimité à la salle de sport pendant un mois, avec vestiaires et douches.', 'Abonnement mensuel salle de sport.', 80.0, 'fixed', 'TND', 0, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),
  ('22000000-0000-0000-0000-000000000068', '12000000-0000-0000-0000-000000000026', 'gym', 'Coaching Personnel', 'Séance individuelle avec un coach sportif certifié. Programme adapté à vos objectifs et votre condition physique.', 'Coaching sportif personnalisé.', 50.0, 'fixed', 'TND', 60, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 50.0, 50.0, false, false),
  -- Gym - provider 27 (Remise en Forme Ariana)
  ('22000000-0000-0000-0000-000000000069', '12000000-0000-0000-0000-000000000027', 'gym', 'Cours Collectifs', 'Cours de fitness en groupe : yoga, pilates, cardio, renforcement musculaire. Ambiance motivante.', 'Cours collectifs de fitness.', 15.0, 'fixed', 'TND', 60, 'clinic', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 15.0, 15.0, false, false),
  ('22000000-0000-0000-0000-000000000070', '12000000-0000-0000-0000-000000000027', 'gym', 'Programme Réhabilitation', 'Programme de remise en forme post-blessure ou post-opératoire, encadré par un kinésithérapeute du sport.', 'Réhabilitation sportive encadrée.', 70.0, 'fixed', 'TND', 90, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70.0, 70.0, true, false),

  -- Babysitting - provider 31 (Nounou Plus Tunis)
  ('22000000-0000-0000-0000-000000000071', '12000000-0000-0000-0000-000000000031', 'babysitting', 'Garde Demi-Journée', 'Garde d''enfant à domicile pour une demi-journée par une professionnelle qualifiée et expérimentée.', 'Garde d''enfant demi-journée.', 40.0, 'fixed', 'TND', 240, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 40.0, 40.0, false, false),
  ('22000000-0000-0000-0000-000000000072', '12000000-0000-0000-0000-000000000031', 'babysitting', 'Garde Journée Complète', 'Garde d''enfant à domicile pour une journée complète, incluant repas, activités ludiques et éducatives.', 'Garde d''enfant journée complète.', 70.0, 'fixed', 'TND', 480, 'home', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 70.0, 70.0, false, false),
  -- Babysitting - provider 32 (Baby Care Sfax)
  ('22000000-0000-0000-0000-000000000073', '12000000-0000-0000-0000-000000000032', 'babysitting', 'Garde de Nuit Enfant', 'Garde d''enfant en soirée et nuit par une nounou professionnelle, pour les parents qui travaillent de nuit.', 'Garde de nuit pour enfant.', 80.0, 'fixed', 'TND', 600, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),

  -- Medical Companion - provider 33 (Accompagnement Médical, Tunis)
  ('22000000-0000-0000-0000-000000000074', '12000000-0000-0000-0000-000000000033', 'medical_companion', 'Accompagnement Hospitalier', 'Accompagnement professionnel lors de rendez-vous médicaux ou hospitalisations. Soutien moral et aide aux démarches.', 'Accompagnement lors de visites médicales.', 60.0, 'fixed', 'TND', 180, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),
  ('22000000-0000-0000-0000-000000000075', '12000000-0000-0000-0000-000000000033', 'medical_companion', 'Accompagnement Administratif', 'Aide aux démarches administratives médicales : assurance maladie, remboursements, dossiers médicaux.', 'Aide administrative médicale.', 45.0, 'fixed', 'TND', 120, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 45.0, 45.0, false, false),

  -- Checkup - provider 34 (Dr. Bilan Santé, Tunis)
  ('22000000-0000-0000-0000-000000000076', '12000000-0000-0000-0000-000000000034', 'checkup', 'Bilan de Santé Basique', 'Bilan de santé de base comprenant examen clinique, prise de tension, auscultation et bilan sanguin standard.', 'Bilan de santé basique.', 120.0, 'fixed', 'TND', 60, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 120.0, 120.0, true, false),
  ('22000000-0000-0000-0000-000000000077', '12000000-0000-0000-0000-000000000034', 'checkup', 'Bilan de Santé Complet', 'Bilan de santé approfondi incluant ECG, bilan biologique complet, échographie et compte-rendu détaillé.', 'Bilan de santé complet et détaillé.', 200.0, 'range', 'TND', 120, 'clinic', true, true, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 200.0, 350.0, true, false),

  -- Maternity - provider 28 (Sage-femme Amina, Tunis)
  ('22000000-0000-0000-0000-000000000078', '12000000-0000-0000-0000-000000000028', 'maternity', 'Suivi Postnatal', 'Visite à domicile de la sage-femme pour le suivi de la mère et du nouveau-né après l''accouchement.', 'Suivi postnatal à domicile.', 80.0, 'fixed', 'TND', 60, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false),
  ('22000000-0000-0000-0000-000000000079', '12000000-0000-0000-0000-000000000028', 'maternity', 'Soutien Allaitement', 'Accompagnement personnalisé par une sage-femme pour l''allaitement maternel, avec conseils et techniques.', 'Soutien à l''allaitement maternel.', 60.0, 'fixed', 'TND', 45, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 60.0, 60.0, false, false),

  -- Night Care - provider 29 (Garde Nuit Spécialisée, Tunis)
  ('22000000-0000-0000-0000-000000000080', '12000000-0000-0000-0000-000000000029', 'night_care', 'Garde de Nuit Standard', 'Garde de nuit par un infirmier qualifié pour patients nécessitant une surveillance nocturne continue.', 'Garde de nuit infirmière.', 200.0, 'fixed', 'TND', 480, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 200.0, 200.0, false, false),
  ('22000000-0000-0000-0000-000000000081', '12000000-0000-0000-0000-000000000029', 'night_care', 'Garde de Nuit Intensive', 'Garde de nuit spécialisée pour patients en soins intensifs ou post-opératoires avec monitoring des constantes.', 'Garde de nuit soins intensifs.', 280.0, 'fixed', 'TND', 480, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 280.0, 280.0, true, false),

  -- Chronic Care - provider 30 (Infirmier Maladies Chroniques, Ariana)
  ('22000000-0000-0000-0000-000000000082', '12000000-0000-0000-0000-000000000030', 'chronic_care', 'Gestion Diabète', 'Suivi régulier du diabète à domicile : contrôle glycémique, éducation thérapeutique et ajustement du traitement.', 'Suivi diabète à domicile.', 55.0, 'fixed', 'TND', 45, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, true, false),
  ('22000000-0000-0000-0000-000000000083', '12000000-0000-0000-0000-000000000030', 'chronic_care', 'Suivi Hypertension', 'Surveillance régulière de la tension artérielle et accompagnement dans la gestion de l''hypertension.', 'Suivi hypertension à domicile.', 55.0, 'fixed', 'TND', 45, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 55.0, 55.0, true, false),

  -- Extra Doctor - provider 35 (Dr. Nadia Cardio, Ariana)
  ('22000000-0000-0000-0000-000000000084', '12000000-0000-0000-0000-000000000035', 'doctor', 'Consultation Cardiologique', 'Consultation spécialisée en cardiologie avec examen clinique, auscultation et interprétation d''ECG.', 'Consultation cardiologie.', 100.0, 'fixed', 'TND', 45, 'both', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 100.0, 100.0, false, false),
  ('22000000-0000-0000-0000-000000000085', '12000000-0000-0000-0000-000000000035', 'doctor', 'ECG à Domicile', 'Réalisation d''un électrocardiogramme à domicile avec interprétation immédiate par une cardiologue.', 'ECG à domicile par cardiologue.', 80.0, 'fixed', 'TND', 30, 'home', true, false, 0, '{}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 80.0, 80.0, false, false)
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 2A1. NUTRITION TRUTH SERVICES (IDs 086-089 + metadata upgrades)
-- ==============================================================
INSERT INTO services (id, provider_id, category, name, description, short_description, price, price_type, currency, duration_minutes, service_location, is_active, is_featured, booking_count, metadata, created_at, updated_at, min_price, max_price, requires_medical_history, requires_prescription)
VALUES
  ('22000000-0000-0000-0000-000000000086', '12000000-0000-0000-0000-000000000036', 'nutrition', 'Menu Diabétique Hebdomadaire', 'Livraison hebdomadaire de repas équilibrés conçus pour les patients diabétiques avec portions contrôlées et fiches nutritionnelles.', 'Menu diabétique livré sur 7 jours.', 95.0, 'fixed', 'TND', 45, 'home', true, true, 0, '{"subcategoryCode":"meal_delivery","dietTypes":["diabetic","low_salt"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 95.0, 95.0, false, false),
  ('22000000-0000-0000-0000-000000000087', '12000000-0000-0000-0000-000000000036', 'nutrition', 'Plateaux Cardio-Friendly', 'Plateaux repas à faible teneur en sel et riches en légumes pour les patients suivant une recommandation cardiovasculaire.', 'Plateaux cardio-friendly livrés à domicile.', 110.0, 'fixed', 'TND', 30, 'home', true, false, 0, '{"subcategoryCode":"meal_delivery","dietTypes":["cardiac","low_salt"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 110.0, 110.0, false, false),
  ('22000000-0000-0000-0000-000000000088', '12000000-0000-0000-0000-000000000037', 'nutrition', 'Atelier Chef Santé à Domicile', 'Séance à domicile avec une cheffe spécialisée qui construit un plan de repas réalisable et montre les gestes clés pour cuisiner plus sainement.', 'Atelier cuisine santé personnalisé.', 130.0, 'fixed', 'TND', 90, 'home', true, true, 0, '{"subcategoryCode":"meal_plan","dietTypes":["vegetarian","gluten_free"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 130.0, 130.0, true, false),
  ('22000000-0000-0000-0000-000000000089', '12000000-0000-0000-0000-000000000037', 'nutrition', 'Préparation Repas Vegan de la Semaine', 'Préparation à domicile de repas vegan prêts à conserver avec adaptation gluten-free pour simplifier la semaine du patient.', 'Repas vegan préparés à domicile.', 160.0, 'fixed', 'TND', 120, 'home', true, false, 0, '{"subcategoryCode":"meal_delivery","dietTypes":["vegan","gluten_free"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 160.0, 160.0, false, false)
ON CONFLICT DO NOTHING;

UPDATE services SET metadata = '{"subcategoryCode":"consultation","dietTypes":["diabetic","low_salt"]}'::jsonb WHERE id = '22000000-0000-0000-0000-000000000032';
UPDATE services SET metadata = '{"subcategoryCode":"meal_plan","dietTypes":["diabetic","cardiac","low_salt"]}'::jsonb WHERE id = '22000000-0000-0000-0000-000000000033';
UPDATE services SET metadata = '{"subcategoryCode":"meal_delivery","dietTypes":["diabetic","low_salt"]}'::jsonb WHERE id = '22000000-0000-0000-0000-000000000086';
UPDATE services SET metadata = '{"subcategoryCode":"meal_delivery","dietTypes":["cardiac","low_salt"]}'::jsonb WHERE id = '22000000-0000-0000-0000-000000000087';
UPDATE services SET metadata = '{"subcategoryCode":"meal_plan","dietTypes":["vegetarian","gluten_free"]}'::jsonb WHERE id = '22000000-0000-0000-0000-000000000088';
UPDATE services SET metadata = '{"subcategoryCode":"meal_delivery","dietTypes":["vegan","gluten_free"]}'::jsonb WHERE id = '22000000-0000-0000-0000-000000000089';

-- ==============================================================
-- 2B. NEW SERVICE ADDONS (IDs 018–027)
-- ============================================================== 
INSERT INTO service_addons (id, service_id, name, description, price, duration_minutes, is_active, created_at, updated_at, icon, is_supplement)
VALUES
  ('32000000-0000-0000-0000-000000000018', '22000000-0000-0000-0000-000000000057', 'Analyse Sanguine', 'Prélèvement et analyse sanguine de base pour votre animal', 25.0, 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'syringe', false),
  ('32000000-0000-0000-0000-000000000019', '22000000-0000-0000-0000-000000000057', 'Détartrage', 'Détartrage dentaire pour chien ou chat', 30.0, 20, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000020', '22000000-0000-0000-0000-000000000063', 'CD avec Images', 'Remise des images radiologiques sur CD', 10.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000021', '22000000-0000-0000-0000-000000000065', 'Injection Produit de Contraste', 'Injection de produit de contraste iodé pour scanner', 40.0, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'syringe', false),
  ('32000000-0000-0000-0000-000000000022', '22000000-0000-0000-0000-000000000067', 'Accès Piscine', 'Accès à la piscine du centre sportif', 20.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000023', '22000000-0000-0000-0000-000000000068', 'Programme Nutrition', 'Programme nutritionnel personnalisé accompagnant le coaching', 25.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, false),
  ('32000000-0000-0000-0000-000000000024', '22000000-0000-0000-0000-000000000076', 'Bilan Lipidique', 'Analyse du cholestérol HDL, LDL et triglycérides', 20.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'syringe', false),
  ('32000000-0000-0000-0000-000000000025', '22000000-0000-0000-0000-000000000078', 'Kit Nouveau-né', 'Kit de soins essentiels pour le nouveau-né', 15.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, true),
  ('32000000-0000-0000-0000-000000000026', '22000000-0000-0000-0000-000000000080', 'Monitoring Continu', 'Surveillance continue des constantes vitales durant la nuit', 30.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'heart-pulse', true),
  ('32000000-0000-0000-0000-000000000027', '22000000-0000-0000-0000-000000000049', 'Livraison Express', 'Livraison express en moins de 2 heures', 5.0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, true)
ON CONFLICT DO NOTHING;

-- ==============================================================
-- 2C. PROVIDER SCHEDULES - DELETE old + re-INSERT diverse
-- ==============================================================
DELETE FROM provider_schedules WHERE id::text LIKE '0e000000%';

INSERT INTO provider_schedules (id, provider_id, day_of_week, start_time, end_time, is_available, created_at, updated_at)
VALUES
  -- ── Doctors: prov 1, 2, 14 - Mon-Fri 08:00-12:00 + 14:00-18:00, Sat 09:00-13:00 ──
  -- Provider 1
  ('0e000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', 1, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000001', 1, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000001', 2, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000001', 2, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000001', 3, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000001', 3, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000001', 4, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000001', 4, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000001', 5, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000001', 5, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000001', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 2
  ('0e000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000002', 1, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000002', 1, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000002', 2, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000002', 2, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000002', 3, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000002', 3, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000018', '12000000-0000-0000-0000-000000000002', 4, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000019', '12000000-0000-0000-0000-000000000002', 4, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000020', '12000000-0000-0000-0000-000000000002', 5, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000021', '12000000-0000-0000-0000-000000000002', 5, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000022', '12000000-0000-0000-0000-000000000002', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 14
  ('0e000000-0000-0000-0000-000000000023', '12000000-0000-0000-0000-000000000014', 1, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000024', '12000000-0000-0000-0000-000000000014', 1, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000025', '12000000-0000-0000-0000-000000000014', 2, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000026', '12000000-0000-0000-0000-000000000014', 2, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000027', '12000000-0000-0000-0000-000000000014', 3, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000028', '12000000-0000-0000-0000-000000000014', 3, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000029', '12000000-0000-0000-0000-000000000014', 4, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000030', '12000000-0000-0000-0000-000000000014', 4, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000031', '12000000-0000-0000-0000-000000000014', 5, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000032', '12000000-0000-0000-0000-000000000014', 5, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000033', '12000000-0000-0000-0000-000000000014', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Nursing: prov 3, 4, 13 - Mon-Sat 07:00-15:00 ──
  -- Provider 3
  ('0e000000-0000-0000-0000-000000000034', '12000000-0000-0000-0000-000000000003', 1, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000035', '12000000-0000-0000-0000-000000000003', 2, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000036', '12000000-0000-0000-0000-000000000003', 3, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000037', '12000000-0000-0000-0000-000000000003', 4, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000038', '12000000-0000-0000-0000-000000000003', 5, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000039', '12000000-0000-0000-0000-000000000003', 6, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 4
  ('0e000000-0000-0000-0000-000000000040', '12000000-0000-0000-0000-000000000004', 1, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000041', '12000000-0000-0000-0000-000000000004', 2, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000042', '12000000-0000-0000-0000-000000000004', 3, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000043', '12000000-0000-0000-0000-000000000004', 4, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000044', '12000000-0000-0000-0000-000000000004', 5, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000045', '12000000-0000-0000-0000-000000000004', 6, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 13
  ('0e000000-0000-0000-0000-000000000046', '12000000-0000-0000-0000-000000000013', 1, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000047', '12000000-0000-0000-0000-000000000013', 2, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000048', '12000000-0000-0000-0000-000000000013', 3, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000049', '12000000-0000-0000-0000-000000000013', 4, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000050', '12000000-0000-0000-0000-000000000013', 5, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000051', '12000000-0000-0000-0000-000000000013', 6, '07:00:00', '15:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Physiotherapy: prov 5, 6, 15 - Mon-Fri 09:00-13:00 + 15:00-19:00, Sat 09:00-13:00 ──
  -- Provider 5
  ('0e000000-0000-0000-0000-000000000052', '12000000-0000-0000-0000-000000000005', 1, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000053', '12000000-0000-0000-0000-000000000005', 1, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000054', '12000000-0000-0000-0000-000000000005', 2, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000055', '12000000-0000-0000-0000-000000000005', 2, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000056', '12000000-0000-0000-0000-000000000005', 3, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000057', '12000000-0000-0000-0000-000000000005', 3, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000058', '12000000-0000-0000-0000-000000000005', 4, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000059', '12000000-0000-0000-0000-000000000005', 4, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000060', '12000000-0000-0000-0000-000000000005', 5, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000061', '12000000-0000-0000-0000-000000000005', 5, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000062', '12000000-0000-0000-0000-000000000005', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 6
  ('0e000000-0000-0000-0000-000000000063', '12000000-0000-0000-0000-000000000006', 1, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000064', '12000000-0000-0000-0000-000000000006', 1, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000065', '12000000-0000-0000-0000-000000000006', 2, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000066', '12000000-0000-0000-0000-000000000006', 2, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000067', '12000000-0000-0000-0000-000000000006', 3, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000068', '12000000-0000-0000-0000-000000000006', 3, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000069', '12000000-0000-0000-0000-000000000006', 4, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000070', '12000000-0000-0000-0000-000000000006', 4, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000071', '12000000-0000-0000-0000-000000000006', 5, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000072', '12000000-0000-0000-0000-000000000006', 5, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000073', '12000000-0000-0000-0000-000000000006', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 15
  ('0e000000-0000-0000-0000-000000000074', '12000000-0000-0000-0000-000000000015', 1, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000075', '12000000-0000-0000-0000-000000000015', 1, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000076', '12000000-0000-0000-0000-000000000015', 2, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000077', '12000000-0000-0000-0000-000000000015', 2, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000078', '12000000-0000-0000-0000-000000000015', 3, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000079', '12000000-0000-0000-0000-000000000015', 3, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000080', '12000000-0000-0000-0000-000000000015', 4, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000081', '12000000-0000-0000-0000-000000000015', 4, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000082', '12000000-0000-0000-0000-000000000015', 5, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000083', '12000000-0000-0000-0000-000000000015', 5, '15:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000084', '12000000-0000-0000-0000-000000000015', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Laboratory: prov 7 - Mon-Fri 06:30-14:00, Sat 07:00-12:00 ──
  ('0e000000-0000-0000-0000-000000000085', '12000000-0000-0000-0000-000000000007', 1, '06:30:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000086', '12000000-0000-0000-0000-000000000007', 2, '06:30:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000087', '12000000-0000-0000-0000-000000000007', 3, '06:30:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000088', '12000000-0000-0000-0000-000000000007', 4, '06:30:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000089', '12000000-0000-0000-0000-000000000007', 5, '06:30:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000090', '12000000-0000-0000-0000-000000000007', 6, '07:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Ambulance: prov 8 - All 7 days 00:01-23:59 ──
  ('0e000000-0000-0000-0000-000000000091', '12000000-0000-0000-0000-000000000008', 0, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000092', '12000000-0000-0000-0000-000000000008', 1, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000093', '12000000-0000-0000-0000-000000000008', 2, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000094', '12000000-0000-0000-0000-000000000008', 3, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000095', '12000000-0000-0000-0000-000000000008', 4, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000096', '12000000-0000-0000-0000-000000000008', 5, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000097', '12000000-0000-0000-0000-000000000008', 6, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Equipment Rental: prov 9 - Mon-Fri 08:30-17:30, Sat 09:00-13:00 ──
  ('0e000000-0000-0000-0000-000000000098', '12000000-0000-0000-0000-000000000009', 1, '08:30:00', '17:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000099', '12000000-0000-0000-0000-000000000009', 2, '08:30:00', '17:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000100', '12000000-0000-0000-0000-000000000009', 3, '08:30:00', '17:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000101', '12000000-0000-0000-0000-000000000009', 4, '08:30:00', '17:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000102', '12000000-0000-0000-0000-000000000009', 5, '08:30:00', '17:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000103', '12000000-0000-0000-0000-000000000009', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Psychology: prov 10 - Mon-Fri 10:00-13:00 + 15:00-20:00 ──
  ('0e000000-0000-0000-0000-000000000104', '12000000-0000-0000-0000-000000000010', 1, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000105', '12000000-0000-0000-0000-000000000010', 1, '15:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000106', '12000000-0000-0000-0000-000000000010', 2, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000107', '12000000-0000-0000-0000-000000000010', 2, '15:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000108', '12000000-0000-0000-0000-000000000010', 3, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000109', '12000000-0000-0000-0000-000000000010', 3, '15:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000110', '12000000-0000-0000-0000-000000000010', 4, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000111', '12000000-0000-0000-0000-000000000010', 4, '15:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000112', '12000000-0000-0000-0000-000000000010', 5, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000113', '12000000-0000-0000-0000-000000000010', 5, '15:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Nutrition: prov 11 - Mon-Thu 09:00-17:00, Fri 09:00-13:00 ──
  ('0e000000-0000-0000-0000-000000000114', '12000000-0000-0000-0000-000000000011', 1, '09:00:00', '17:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000115', '12000000-0000-0000-0000-000000000011', 2, '09:00:00', '17:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000116', '12000000-0000-0000-0000-000000000011', 3, '09:00:00', '17:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000117', '12000000-0000-0000-0000-000000000011', 4, '09:00:00', '17:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000118', '12000000-0000-0000-0000-000000000011', 5, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Elderly Care: prov 12 - Mon-Sun 07:00-19:00 ──
  ('0e000000-0000-0000-0000-000000000119', '12000000-0000-0000-0000-000000000012', 0, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000120', '12000000-0000-0000-0000-000000000012', 1, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000121', '12000000-0000-0000-0000-000000000012', 2, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000122', '12000000-0000-0000-0000-000000000012', 3, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000123', '12000000-0000-0000-0000-000000000012', 4, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000124', '12000000-0000-0000-0000-000000000012', 5, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000125', '12000000-0000-0000-0000-000000000012', 6, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Pharmacy: prov 16, 17, 18 - Mon-Sat 08:00-20:00, Sun 09:00-13:00 ──
  -- Provider 16
  ('0e000000-0000-0000-0000-000000000126', '12000000-0000-0000-0000-000000000016', 0, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000127', '12000000-0000-0000-0000-000000000016', 1, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000128', '12000000-0000-0000-0000-000000000016', 2, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000129', '12000000-0000-0000-0000-000000000016', 3, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000130', '12000000-0000-0000-0000-000000000016', 4, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000131', '12000000-0000-0000-0000-000000000016', 5, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000132', '12000000-0000-0000-0000-000000000016', 6, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 17
  ('0e000000-0000-0000-0000-000000000133', '12000000-0000-0000-0000-000000000017', 0, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000134', '12000000-0000-0000-0000-000000000017', 1, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000135', '12000000-0000-0000-0000-000000000017', 2, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000136', '12000000-0000-0000-0000-000000000017', 3, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000137', '12000000-0000-0000-0000-000000000017', 4, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000138', '12000000-0000-0000-0000-000000000017', 5, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000139', '12000000-0000-0000-0000-000000000017', 6, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 18
  ('0e000000-0000-0000-0000-000000000140', '12000000-0000-0000-0000-000000000018', 0, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000141', '12000000-0000-0000-0000-000000000018', 1, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000142', '12000000-0000-0000-0000-000000000018', 2, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000143', '12000000-0000-0000-0000-000000000018', 3, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000144', '12000000-0000-0000-0000-000000000018', 4, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000145', '12000000-0000-0000-0000-000000000018', 5, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000146', '12000000-0000-0000-0000-000000000018', 6, '08:00:00', '20:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Funeral: prov 19, 20 - All 7 days 00:01-23:59 ──
  -- Provider 19
  ('0e000000-0000-0000-0000-000000000147', '12000000-0000-0000-0000-000000000019', 0, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000148', '12000000-0000-0000-0000-000000000019', 1, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000149', '12000000-0000-0000-0000-000000000019', 2, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000150', '12000000-0000-0000-0000-000000000019', 3, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000151', '12000000-0000-0000-0000-000000000019', 4, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000152', '12000000-0000-0000-0000-000000000019', 5, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000153', '12000000-0000-0000-0000-000000000019', 6, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 20
  ('0e000000-0000-0000-0000-000000000154', '12000000-0000-0000-0000-000000000020', 0, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000155', '12000000-0000-0000-0000-000000000020', 1, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000156', '12000000-0000-0000-0000-000000000020', 2, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000157', '12000000-0000-0000-0000-000000000020', 3, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000158', '12000000-0000-0000-0000-000000000020', 4, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000159', '12000000-0000-0000-0000-000000000020', 5, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000160', '12000000-0000-0000-0000-000000000020', 6, '00:01:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Veterinary: prov 21, 22, 23 - Mon-Fri 09:00-12:30 + 14:30-19:00, Sat 09:00-14:00, Sun 10:00-13:00 ──
  -- Provider 21
  ('0e000000-0000-0000-0000-000000000161', '12000000-0000-0000-0000-000000000021', 0, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000162', '12000000-0000-0000-0000-000000000021', 1, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000163', '12000000-0000-0000-0000-000000000021', 1, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000164', '12000000-0000-0000-0000-000000000021', 2, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000165', '12000000-0000-0000-0000-000000000021', 2, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000166', '12000000-0000-0000-0000-000000000021', 3, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000167', '12000000-0000-0000-0000-000000000021', 3, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000168', '12000000-0000-0000-0000-000000000021', 4, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000169', '12000000-0000-0000-0000-000000000021', 4, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000170', '12000000-0000-0000-0000-000000000021', 5, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000171', '12000000-0000-0000-0000-000000000021', 5, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000172', '12000000-0000-0000-0000-000000000021', 6, '09:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 22
  ('0e000000-0000-0000-0000-000000000173', '12000000-0000-0000-0000-000000000022', 0, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000174', '12000000-0000-0000-0000-000000000022', 1, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000175', '12000000-0000-0000-0000-000000000022', 1, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000176', '12000000-0000-0000-0000-000000000022', 2, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000177', '12000000-0000-0000-0000-000000000022', 2, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000178', '12000000-0000-0000-0000-000000000022', 3, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000179', '12000000-0000-0000-0000-000000000022', 3, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000180', '12000000-0000-0000-0000-000000000022', 4, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000181', '12000000-0000-0000-0000-000000000022', 4, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000182', '12000000-0000-0000-0000-000000000022', 5, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000183', '12000000-0000-0000-0000-000000000022', 5, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000184', '12000000-0000-0000-0000-000000000022', 6, '09:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 23
  ('0e000000-0000-0000-0000-000000000185', '12000000-0000-0000-0000-000000000023', 0, '10:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000186', '12000000-0000-0000-0000-000000000023', 1, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000187', '12000000-0000-0000-0000-000000000023', 1, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000188', '12000000-0000-0000-0000-000000000023', 2, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000189', '12000000-0000-0000-0000-000000000023', 2, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000190', '12000000-0000-0000-0000-000000000023', 3, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000191', '12000000-0000-0000-0000-000000000023', 3, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000192', '12000000-0000-0000-0000-000000000023', 4, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000193', '12000000-0000-0000-0000-000000000023', 4, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000194', '12000000-0000-0000-0000-000000000023', 5, '09:00:00', '12:30:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000195', '12000000-0000-0000-0000-000000000023', 5, '14:30:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000196', '12000000-0000-0000-0000-000000000023', 6, '09:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Radiology: prov 24, 25 - Mon-Fri 07:00-19:00, Sat 08:00-14:00 ──
  -- Provider 24
  ('0e000000-0000-0000-0000-000000000197', '12000000-0000-0000-0000-000000000024', 1, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000198', '12000000-0000-0000-0000-000000000024', 2, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000199', '12000000-0000-0000-0000-000000000024', 3, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000200', '12000000-0000-0000-0000-000000000024', 4, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000201', '12000000-0000-0000-0000-000000000024', 5, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000202', '12000000-0000-0000-0000-000000000024', 6, '08:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 25
  ('0e000000-0000-0000-0000-000000000203', '12000000-0000-0000-0000-000000000025', 1, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000204', '12000000-0000-0000-0000-000000000025', 2, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000205', '12000000-0000-0000-0000-000000000025', 3, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000206', '12000000-0000-0000-0000-000000000025', 4, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000207', '12000000-0000-0000-0000-000000000025', 5, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000208', '12000000-0000-0000-0000-000000000025', 6, '08:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Gym: prov 26, 27 - Mon-Sat 06:00-22:00, Sun 08:00-18:00 ──
  -- Provider 26
  ('0e000000-0000-0000-0000-000000000209', '12000000-0000-0000-0000-000000000026', 0, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000210', '12000000-0000-0000-0000-000000000026', 1, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000211', '12000000-0000-0000-0000-000000000026', 2, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000212', '12000000-0000-0000-0000-000000000026', 3, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000213', '12000000-0000-0000-0000-000000000026', 4, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000214', '12000000-0000-0000-0000-000000000026', 5, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000215', '12000000-0000-0000-0000-000000000026', 6, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 27
  ('0e000000-0000-0000-0000-000000000216', '12000000-0000-0000-0000-000000000027', 0, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000217', '12000000-0000-0000-0000-000000000027', 1, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000218', '12000000-0000-0000-0000-000000000027', 2, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000219', '12000000-0000-0000-0000-000000000027', 3, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000220', '12000000-0000-0000-0000-000000000027', 4, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000221', '12000000-0000-0000-0000-000000000027', 5, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000222', '12000000-0000-0000-0000-000000000027', 6, '06:00:00', '22:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Maternity: prov 28 - Mon-Fri 08:00-18:00, Sat 09:00-14:00 ──
  ('0e000000-0000-0000-0000-000000000223', '12000000-0000-0000-0000-000000000028', 1, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000224', '12000000-0000-0000-0000-000000000028', 2, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000225', '12000000-0000-0000-0000-000000000028', 3, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000226', '12000000-0000-0000-0000-000000000028', 4, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000227', '12000000-0000-0000-0000-000000000028', 5, '08:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000228', '12000000-0000-0000-0000-000000000028', 6, '09:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Night Care: prov 29 - Mon-Sun 20:00-23:59 ──
  ('0e000000-0000-0000-0000-000000000229', '12000000-0000-0000-0000-000000000029', 0, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000230', '12000000-0000-0000-0000-000000000029', 1, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000231', '12000000-0000-0000-0000-000000000029', 2, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000232', '12000000-0000-0000-0000-000000000029', 3, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000233', '12000000-0000-0000-0000-000000000029', 4, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000234', '12000000-0000-0000-0000-000000000029', 5, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000235', '12000000-0000-0000-0000-000000000029', 6, '20:00:00', '23:59:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Chronic Care: prov 30 - Mon-Fri 08:00-16:00 ──
  ('0e000000-0000-0000-0000-000000000236', '12000000-0000-0000-0000-000000000030', 1, '08:00:00', '16:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000237', '12000000-0000-0000-0000-000000000030', 2, '08:00:00', '16:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000238', '12000000-0000-0000-0000-000000000030', 3, '08:00:00', '16:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000239', '12000000-0000-0000-0000-000000000030', 4, '08:00:00', '16:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000240', '12000000-0000-0000-0000-000000000030', 5, '08:00:00', '16:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Babysitting: prov 31, 32 - Mon-Sun 07:00-21:00 ──
  -- Provider 31
  ('0e000000-0000-0000-0000-000000000241', '12000000-0000-0000-0000-000000000031', 0, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000242', '12000000-0000-0000-0000-000000000031', 1, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000243', '12000000-0000-0000-0000-000000000031', 2, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000244', '12000000-0000-0000-0000-000000000031', 3, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000245', '12000000-0000-0000-0000-000000000031', 4, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000246', '12000000-0000-0000-0000-000000000031', 5, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000247', '12000000-0000-0000-0000-000000000031', 6, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Provider 32
  ('0e000000-0000-0000-0000-000000000248', '12000000-0000-0000-0000-000000000032', 0, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000249', '12000000-0000-0000-0000-000000000032', 1, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000250', '12000000-0000-0000-0000-000000000032', 2, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000251', '12000000-0000-0000-0000-000000000032', 3, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000252', '12000000-0000-0000-0000-000000000032', 4, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000253', '12000000-0000-0000-0000-000000000032', 5, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000254', '12000000-0000-0000-0000-000000000032', 6, '07:00:00', '21:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Medical Companion: prov 33 - Mon-Fri 07:00-19:00, Sat 08:00-14:00 ──
  ('0e000000-0000-0000-0000-000000000255', '12000000-0000-0000-0000-000000000033', 1, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000256', '12000000-0000-0000-0000-000000000033', 2, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000257', '12000000-0000-0000-0000-000000000033', 3, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000258', '12000000-0000-0000-0000-000000000033', 4, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000259', '12000000-0000-0000-0000-000000000033', 5, '07:00:00', '19:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000260', '12000000-0000-0000-0000-000000000033', 6, '08:00:00', '14:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Checkup (Doctor pattern): prov 34 - Mon-Fri 08:00-12:00 + 14:00-18:00, Sat 09:00-13:00 ──
  ('0e000000-0000-0000-0000-000000000261', '12000000-0000-0000-0000-000000000034', 1, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000262', '12000000-0000-0000-0000-000000000034', 1, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000263', '12000000-0000-0000-0000-000000000034', 2, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000264', '12000000-0000-0000-0000-000000000034', 2, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000265', '12000000-0000-0000-0000-000000000034', 3, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000266', '12000000-0000-0000-0000-000000000034', 3, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000267', '12000000-0000-0000-0000-000000000034', 4, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000268', '12000000-0000-0000-0000-000000000034', 4, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000269', '12000000-0000-0000-0000-000000000034', 5, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000270', '12000000-0000-0000-0000-000000000034', 5, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000271', '12000000-0000-0000-0000-000000000034', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  -- ── Extra Doctor: prov 35 - Mon-Fri 08:00-12:00 + 14:00-18:00, Sat 09:00-13:00 ──
  ('0e000000-0000-0000-0000-000000000272', '12000000-0000-0000-0000-000000000035', 1, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000273', '12000000-0000-0000-0000-000000000035', 1, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000274', '12000000-0000-0000-0000-000000000035', 2, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000275', '12000000-0000-0000-0000-000000000035', 2, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000276', '12000000-0000-0000-0000-000000000035', 3, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000277', '12000000-0000-0000-0000-000000000035', 3, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000278', '12000000-0000-0000-0000-000000000035', 4, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000279', '12000000-0000-0000-0000-000000000035', 4, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000280', '12000000-0000-0000-0000-000000000035', 5, '08:00:00', '12:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000281', '12000000-0000-0000-0000-000000000035', 5, '14:00:00', '18:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('0e000000-0000-0000-0000-000000000282', '12000000-0000-0000-0000-000000000035', 6, '09:00:00', '13:00:00', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- ==============================================================
-- BLOCK 1: NEW BOOKINGS (30 rows) - new category coverage
-- ==============================================================
INSERT INTO bookings (
  id, booking_number, patient_id, provider_id, service_id,
  start_date, end_date, daily_start_time, daily_end_time, daily_duration_minutes, timezone, status,
  patient_name, patient_phone, patient_email, service_location, address_line1, city, postal_code,
  latitude, longitude, medical_history_shared, is_for_family_member, family_member_name, service_price, addons_price, discount_amount,
  discount_code, subtotal, platform_fee, tax_amount, total_amount, currency, commission_rate,
  commission_amount, provider_amount, validation_required, validation_code, validation_method,
  validation_attempts, cancellation_fee, reschedule_count, source, utm_source, utm_medium,
  utm_campaign, created_at, updated_at, cancelled_at, cancelled_by, cancellation_reason, service_completed_at
 )
SELECT
  seed.id,
  seed.booking_number,
  seed.patient_id,
  seed.provider_id,
  seed.service_id,
  seed.start_date,
  seed.start_date AS end_date,
  seed.daily_start_time,
  seed.daily_end_time,
  seed.daily_duration_minutes,
  seed.timezone,
  seed.status,
  seed.patient_name,
  seed.patient_phone,
  seed.patient_email,
  seed.service_location,
  seed.address_line1,
  seed.city,
  seed.postal_code,
  seed.latitude,
  seed.longitude,
  seed.medical_history_shared,
  seed.is_for_family_member,
  seed.family_member_name,
  seed.service_price,
  seed.addons_price,
  seed.discount_amount,
  seed.discount_code,
  seed.subtotal,
  seed.platform_fee,
  seed.tax_amount,
  seed.legacy_total_amount,
  seed.currency,
  seed.commission_rate,
  seed.commission_amount,
  seed.legacy_provider_amount,
  seed.validation_required,
  seed.validation_code,
  seed.validation_method,
  seed.validation_attempts,
  seed.cancellation_fee,
  seed.reschedule_count,
  seed.source,
  seed.utm_source,
  seed.utm_medium,
  seed.utm_campaign,
  seed.created_at,
  seed.updated_at,
  seed.cancelled_at,
  seed.cancelled_by,
  seed.cancellation_reason,
  seed.service_completed_at
FROM (
  VALUES
  ('03000000-0000-0000-0000-000000000101'::uuid, 'BK-2025-0101', '02000000-0000-0000-0000-000000000001'::uuid, '12000000-0000-0000-0000-000000000016'::uuid, '22000000-0000-0000-0000-000000000049'::uuid, '2025-03-10'::date, '10:00'::time, '10:30'::time, 30, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la Republique', 'Tunis', '1111', 36.810000, 10.178150, false, false, NULL, 45.00, 0.00, 0.00, NULL, 45.00, 5.40, 0.00, 45.00, 'TND', 12.00, 5.40, 39.60, true, '000101', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-03-05 06:00:00+01'::timestamp with time zone, '2025-03-10 10:45:00+01'::timestamp with time zone, NULL::timestamp with time zone, NULL::uuid, NULL, '2025-03-10 10:30:00+01'::timestamp with time zone),
  ('03000000-0000-0000-0000-000000000102', 'BK-2025-0102', '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000017', '22000000-0000-0000-0000-000000000050', '2025-04-15', '14:00', '14:20', 20, 'Africa/Tunis', 'Completed', 'Youssef Gharbi', '+21650100005', 'youssef.gharbi@sanad.tn', 'home', '50 Rue de la Republique', 'Bizerte', '1555', 37.270000, 9.871850, true, false, NULL, 35.00, 0.00, 0.00, NULL, 35.00, 4.20, 0.00, 35.00, 'TND', 12.00, 4.20, 30.80, true, '000102', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-04-09 07:00:00+01', '2025-04-15 14:35:00+01', NULL, NULL, NULL, '2025-04-15 14:20:00+01'),
  ('03000000-0000-0000-0000-000000000103', 'BK-2025-0103', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000018', '22000000-0000-0000-0000-000000000051', '2025-05-20', '09:00', '09:25', 25, 'Africa/Tunis', 'Confirmed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la Republique', 'Ariana', '1999', 36.874100, 10.161850, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 6.60, 0.00, 55.00, 'TND', 12.00, 6.60, 48.40, true, '000103', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-05-13 08:00:00+01', '2025-05-13 18:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000104', 'BK-2025-0104', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000016', '22000000-0000-0000-0000-000000000052', '2025-06-05', '11:00', '11:30', 30, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la Republique', 'La Marsa', '2332', 36.885900, 10.314450, false, false, NULL, 40.00, 0.00, 0.00, NULL, 40.00, 4.80, 0.00, 40.00, 'TND', 12.00, 4.80, 35.20, true, '000104', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-05-31 09:00:00+01', '2025-06-05 11:45:00+01', NULL, NULL, NULL, '2025-06-05 11:30:00+01'),
  ('03000000-0000-0000-0000-000000000105', 'BK-2025-0105', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000019', '22000000-0000-0000-0000-000000000054', '2025-04-02', '08:00', '12:00', 240, 'Africa/Tunis', 'Completed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la Republique', 'Sousse', '1333', 35.824100, 10.624450, true, false, NULL, 350.00, 0.00, 0.00, NULL, 350.00, 35.00, 0.00, 350.00, 'TND', 10.00, 35.00, 315.00, true, '000105', 'qr', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-03-27 10:00:00+01', '2025-04-02 12:15:00+01', NULL, NULL, NULL, '2025-04-02 12:00:00+01'),
  ('03000000-0000-0000-0000-000000000106', 'BK-2025-0106', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000020', '22000000-0000-0000-0000-000000000055', '2025-07-18', '07:00', '13:00', 360, 'Africa/Tunis', 'Completed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la Republique', 'Kairouan', '1777', 35.665900, 10.094450, false, false, NULL, 500.00, 0.00, 0.00, NULL, 500.00, 50.00, 0.00, 500.00, 'TND', 10.00, 50.00, 450.00, true, '000106', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-07-11 11:00:00+01', '2025-07-18 13:15:00+01', NULL, NULL, NULL, '2025-07-18 13:00:00+01'),
  ('03000000-0000-0000-0000-000000000107', 'BK-2025-0107', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000021', '22000000-0000-0000-0000-000000000057', '2025-03-25', '15:00', '15:40', 40, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la Republique', 'Sfax', '1222', 34.740000, 10.765550, true, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 10.50, 0.00, 70.00, 'TND', 15.00, 10.50, 59.50, true, '000107', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-03-20 12:00:00+01', '2025-03-25 15:55:00+01', NULL, NULL, NULL, '2025-03-25 15:40:00+01'),
  ('03000000-0000-0000-0000-000000000108', 'BK-2025-0108', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000022', '22000000-0000-0000-0000-000000000058', '2025-05-12', '10:00', '10:45', 45, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la Republique', 'Nabeul', '1666', 36.454100, 10.745550, false, false, NULL, 60.00, 0.00, 0.00, NULL, 60.00, 9.00, 0.00, 60.00, 'TND', 15.00, 9.00, 51.00, true, '000108', 'sms', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-05-06 06:00:00+01', '2025-05-12 11:00:00+01', NULL, NULL, NULL, '2025-05-12 10:45:00+01'),
  ('03000000-0000-0000-0000-000000000109', 'BK-2025-0109', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000023', '22000000-0000-0000-0000-000000000059', '2025-06-20', '09:00', '09:30', 30, 'Africa/Tunis', 'Cancelled', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la Republique', 'Ben Arous', '2110', 36.745900, 10.225550, false, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 7.50, 0.00, 50.00, 'TND', 15.00, 7.50, 42.50, false, NULL, NULL, 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-06-13 07:00:00+01', '2025-06-19 08:00:00+01', '2025-06-19 08:00:00+01', '11000000-0000-0000-0000-000000000010', 'Animal feeling better, no longer needed.', NULL),
  ('03000000-0000-0000-0000-000000000110', 'BK-2025-0110', '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000021', '22000000-0000-0000-0000-000000000060', '2025-08-05', '16:00', '16:50', 50, 'Africa/Tunis', 'Completed', 'Olfa Baccar', '+21650100014', 'olfa.baccar@sanad.tn', 'home', '140 Rue de la Republique', 'Gafsa', '2554', 34.434100, 8.781850, true, false, NULL, 85.00, 0.00, 0.00, NULL, 85.00, 12.75, 0.00, 85.00, 'TND', 15.00, 12.75, 72.25, true, '000110', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-07-31 08:00:00+01', '2025-08-05 17:05:00+01', NULL, NULL, NULL, '2025-08-05 16:50:00+01'),
  ('03000000-0000-0000-0000-000000000111', 'BK-2025-0111', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000024', '22000000-0000-0000-0000-000000000063', '2025-04-22', '08:30', '09:00', 30, 'Africa/Tunis', 'Completed', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la Republique', 'Monastir', '1444', 35.755900, 10.808150, true, false, NULL, 120.00, 0.00, 0.00, NULL, 120.00, 14.40, 0.00, 120.00, 'TND', 12.00, 14.40, 105.60, true, '000111', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-04-16 09:00:00+01', '2025-04-22 09:15:00+01', NULL, NULL, NULL, '2025-04-22 09:00:00+01'),
  ('03000000-0000-0000-0000-000000000112', 'BK-2025-0112', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000025', '22000000-0000-0000-0000-000000000064', '2025-06-10', '11:00', '11:45', 45, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la Republique', 'Gabes', '1888', 33.880000, 10.098150, false, false, NULL, 180.00, 0.00, 0.00, NULL, 180.00, 21.60, 0.00, 180.00, 'TND', 12.00, 21.60, 158.40, true, '000112', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-06-03 10:00:00+01', '2025-06-10 12:00:00+01', NULL, NULL, NULL, '2025-06-10 11:45:00+01'),
  ('03000000-0000-0000-0000-000000000113', 'BK-2025-0113', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000024', '22000000-0000-0000-0000-000000000065', '2025-08-18', '14:00', '14:30', 30, 'Africa/Tunis', 'Pending', 'Hatem Jeridi', '+21650100015', 'hatem.jeridi@sanad.tn', 'home', '150 Rue de la Republique', 'Djerba', '2665', 33.865900, 10.865550, false, false, NULL, 150.00, 0.00, 0.00, NULL, 150.00, 18.00, 0.00, 150.00, 'TND', 12.00, 18.00, 132.00, false, NULL, NULL, 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-08-13 11:00:00+01', '2025-08-13 12:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000114', 'BK-2025-0114', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000026', '22000000-0000-0000-0000-000000000067', '2025-05-05', '17:00', '18:00', 60, 'Africa/Tunis', 'Completed', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la Republique', 'Hammamet', '2221', 36.404100, 10.615550, true, false, NULL, 50.00, 0.00, 0.00, NULL, 50.00, 5.00, 0.00, 50.00, 'TND', 10.00, 5.00, 45.00, true, '000114', 'sms', 0, 0.00, 0, 'web', 'instagram', 'paid-social', 'campaign-114', '2025-04-29 12:00:00+01', '2025-05-05 18:15:00+01', NULL, NULL, NULL, '2025-05-05 18:00:00+01'),
  ('03000000-0000-0000-0000-000000000115', 'BK-2025-0115', '02000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000027', '22000000-0000-0000-0000-000000000068', '2025-06-25', '08:00', '09:00', 60, 'Africa/Tunis', 'Completed', 'Wafa Souissi', '+21650100016', 'wafa.souissi@sanad.tn', 'home', '160 Rue de la Republique', 'Manouba', '2776', 36.820000, 10.094450, false, false, NULL, 45.00, 0.00, 0.00, NULL, 45.00, 4.50, 0.00, 45.00, 'TND', 10.00, 4.50, 40.50, true, '000115', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-06-18 06:00:00+01', '2025-06-25 09:15:00+01', NULL, NULL, NULL, '2025-06-25 09:00:00+01'),
  ('03000000-0000-0000-0000-000000000116', 'BK-2025-0116', '02000000-0000-0000-0000-000000000013', '12000000-0000-0000-0000-000000000026', '22000000-0000-0000-0000-000000000069', '2025-09-08', '18:00', '19:00', 60, 'Africa/Tunis', 'Cancelled', 'Firas Dridi', '+21650100013', 'firas.dridi@sanad.tn', 'home', '130 Rue de la Republique', 'Mahdia', '2443', 35.500000, 11.038150, false, false, NULL, 55.00, 0.00, 0.00, NULL, 55.00, 5.50, 0.00, 55.00, 'TND', 10.00, 5.50, 49.50, false, NULL, NULL, 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-09-03 07:00:00+01', '2025-09-07 08:00:00+01', '2025-09-07 08:00:00+01', '11000000-0000-0000-0000-000000000013', 'Blessure au genou, seance reportee.', NULL),
  ('03000000-0000-0000-0000-000000000117', 'BK-2025-0117', '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000031', '22000000-0000-0000-0000-000000000071', '2025-03-15', '18:00', '22:00', 240, 'Africa/Tunis', 'Completed', 'Salma Khelifi', '+21650100004', 'salma.khelifi@sanad.tn', 'home', '40 Rue de la Republique', 'Monastir', '1444', 35.755900, 10.808150, false, false, NULL, 80.00, 0.00, 0.00, NULL, 80.00, 9.60, 0.00, 80.00, 'TND', 12.00, 9.60, 70.40, true, '000117', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-03-09 08:00:00+01', '2025-03-15 22:15:00+01', NULL, NULL, NULL, '2025-03-15 22:00:00+01'),
  ('03000000-0000-0000-0000-000000000118', 'BK-2025-0118', '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000032', '22000000-0000-0000-0000-000000000072', '2025-05-28', '14:00', '18:00', 240, 'Africa/Tunis', 'Completed', 'Fatma Trabelsi', '+21650100002', 'fatma.trabelsi@sanad.tn', 'home', '20 Rue de la Republique', 'Sfax', '1222', 34.740000, 10.765550, false, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 8.40, 0.00, 70.00, 'TND', 12.00, 8.40, 61.60, true, '000118', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-05-21 09:00:00+01', '2025-05-28 18:15:00+01', NULL, NULL, NULL, '2025-05-28 18:00:00+01'),
  ('03000000-0000-0000-0000-000000000119', 'BK-2025-0119', '02000000-0000-0000-0000-000000000017', '12000000-0000-0000-0000-000000000031', '22000000-0000-0000-0000-000000000073', '2025-08-10', '19:00', '23:00', 240, 'Africa/Tunis', 'Validated', 'Nizar Ferchichi', '+21650100017', 'nizar.ferchichi@sanad.tn', 'home', '170 Rue de la Republique', 'Tabarka', '2887', 36.954100, 8.758150, false, false, NULL, 90.00, 0.00, 0.00, NULL, 90.00, 10.80, 0.00, 90.00, 'TND', 12.00, 10.80, 79.20, true, '000119', 'qr', 1, 0.00, 0, 'web', NULL, NULL, NULL, '2025-08-05 10:00:00+01', '2025-08-10 23:15:00+01', NULL, NULL, NULL, '2025-08-10 23:00:00+01'),
  ('03000000-0000-0000-0000-000000000120', 'BK-2025-0120', '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000033', '22000000-0000-0000-0000-000000000074', '2025-04-10', '08:00', '12:00', 240, 'Africa/Tunis', 'Completed', 'Ines Chaabane', '+21650100008', 'ines.chaabane@sanad.tn', 'home', '80 Rue de la Republique', 'Gabes', '1888', 33.880000, 10.098150, true, false, NULL, 120.00, 0.00, 0.00, NULL, 120.00, 18.00, 0.00, 120.00, 'TND', 15.00, 18.00, 102.00, true, '000120', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-04-04 11:00:00+01', '2025-04-10 12:15:00+01', NULL, NULL, NULL, '2025-04-10 12:00:00+01'),
  ('03000000-0000-0000-0000-000000000121', 'BK-2025-0121', '02000000-0000-0000-0000-000000000016', '12000000-0000-0000-0000-000000000033', '22000000-0000-0000-0000-000000000075', '2025-07-05', '09:00', '13:00', 240, 'Africa/Tunis', 'Completed', 'Wafa Souissi', '+21650100016', 'wafa.souissi@sanad.tn', 'home', '160 Rue de la Republique', 'Manouba', '2776', 36.820000, 10.094450, false, false, NULL, 100.00, 0.00, 0.00, NULL, 100.00, 15.00, 0.00, 100.00, 'TND', 15.00, 15.00, 85.00, true, '000121', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-06-28 12:00:00+01', '2025-07-05 13:15:00+01', NULL, NULL, NULL, '2025-07-05 13:00:00+01'),
  ('03000000-0000-0000-0000-000000000122', 'BK-2025-0122', '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000034', '22000000-0000-0000-0000-000000000076', '2025-05-08', '08:00', '09:30', 90, 'Africa/Tunis', 'Completed', 'Mohamed Saidi', '+21650100003', 'mohamed.saidi@sanad.tn', 'home', '30 Rue de la Republique', 'Sousse', '1333', 35.824100, 10.624450, true, false, NULL, 150.00, 0.00, 0.00, NULL, 150.00, 22.50, 0.00, 150.00, 'TND', 15.00, 22.50, 127.50, true, '000122', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-05-03 06:00:00+01', '2025-05-08 09:45:00+01', NULL, NULL, NULL, '2025-05-08 09:30:00+01'),
  ('03000000-0000-0000-0000-000000000123', 'BK-2025-0123', '02000000-0000-0000-0000-000000000011', '12000000-0000-0000-0000-000000000034', '22000000-0000-0000-0000-000000000077', '2025-09-15', '10:00', '11:00', 60, 'Africa/Tunis', 'Pending', 'Tarek Bouzid', '+21650100011', 'tarek.bouzid@sanad.tn', 'home', '110 Rue de la Republique', 'Hammamet', '2221', 36.404100, 10.615550, false, false, NULL, 200.00, 0.00, 0.00, NULL, 200.00, 30.00, 0.00, 200.00, 'TND', 15.00, 30.00, 170.00, false, NULL, NULL, 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-09-09 07:00:00+01', '2025-09-09 08:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000124', 'BK-2025-0124', '02000000-0000-0000-0000-000000000006', '12000000-0000-0000-0000-000000000028', '22000000-0000-0000-0000-000000000078', '2025-04-18', '10:00', '11:00', 60, 'Africa/Tunis', 'Completed', 'Nour Ben Hassen', '+21650100006', 'nour.benhassen@sanad.tn', 'home', '60 Rue de la Republique', 'Nabeul', '1666', 36.454100, 10.745550, true, false, NULL, 90.00, 0.00, 0.00, NULL, 90.00, 13.50, 0.00, 90.00, 'TND', 15.00, 13.50, 76.50, true, '000124', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-04-11 08:00:00+01', '2025-04-18 11:15:00+01', NULL, NULL, NULL, '2025-04-18 11:00:00+01'),
  ('03000000-0000-0000-0000-000000000125', 'BK-2025-0125', '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000028', '22000000-0000-0000-0000-000000000079', '2025-07-22', '14:00', '15:00', 60, 'Africa/Tunis', 'Completed', 'Asma Riahi', '+21650100012', 'asma.riahi@sanad.tn', 'home', '120 Rue de la Republique', 'La Marsa', '2332', 36.885900, 10.314450, false, false, NULL, 85.00, 0.00, 0.00, NULL, 85.00, 12.75, 0.00, 85.00, 'TND', 15.00, 12.75, 72.25, true, '000125', 'qr', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-07-17 09:00:00+01', '2025-07-22 15:15:00+01', NULL, NULL, NULL, '2025-07-22 15:00:00+01'),
  ('03000000-0000-0000-0000-000000000126', 'BK-2025-0126', '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000029', '22000000-0000-0000-0000-000000000080', '2025-06-15', '21:00', '06:00', 540, 'Africa/Tunis', 'Completed', 'Ahmed Ben Ali', '+21650100001', 'ahmed.benali@sanad.tn', 'home', '10 Rue de la Republique', 'Tunis', '1111', 36.810000, 10.178150, true, true, 'Lamine Ben Ali', 180.00, 0.00, 0.00, NULL, 180.00, 27.00, 0.00, 180.00, 'TND', 15.00, 27.00, 153.00, true, '000126', 'sms', 0, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-06-09 10:00:00+01', '2025-06-15 06:15:00+01', NULL, NULL, NULL, '2025-06-15 06:00:00+01'),
  ('03000000-0000-0000-0000-000000000127', 'BK-2025-0127', '02000000-0000-0000-0000-000000000010', '12000000-0000-0000-0000-000000000029', '22000000-0000-0000-0000-000000000081', '2025-09-02', '22:00', '06:00', 480, 'Africa/Tunis', 'Confirmed', 'Mariem Laabidi', '+21650100010', 'mariem.laabidi@sanad.tn', 'home', '100 Rue de la Republique', 'Ben Arous', '2110', 36.745900, 10.225550, false, false, NULL, 160.00, 0.00, 0.00, NULL, 160.00, 24.00, 0.00, 160.00, 'TND', 15.00, 24.00, 136.00, true, '000127', 'qr', 0, 0.00, 0, 'web', NULL, NULL, NULL, '2025-08-26 11:00:00+01', '2025-08-26 21:00:00+01', NULL, NULL, NULL, NULL),
  ('03000000-0000-0000-0000-000000000128', 'BK-2025-0128', '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000030', '22000000-0000-0000-0000-000000000082', '2025-05-15', '09:00', '10:00', 60, 'Africa/Tunis', 'Completed', 'Khalil Mansouri', '+21650100007', 'khalil.mansouri@sanad.tn', 'home', '70 Rue de la Republique', 'Kairouan', '1777', 35.665900, 10.094450, true, false, NULL, 65.00, 0.00, 0.00, NULL, 65.00, 9.75, 0.00, 65.00, 'TND', 15.00, 9.75, 55.25, true, '000128', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-05-10 12:00:00+01', '2025-05-15 10:15:00+01', NULL, NULL, NULL, '2025-05-15 10:00:00+01'),
  ('03000000-0000-0000-0000-000000000129', 'BK-2025-0129', '02000000-0000-0000-0000-000000000015', '12000000-0000-0000-0000-000000000030', '22000000-0000-0000-0000-000000000083', '2025-08-25', '11:00', '12:00', 60, 'Africa/Tunis', 'Validated', 'Hatem Jeridi', '+21650100015', 'hatem.jeridi@sanad.tn', 'home', '150 Rue de la Republique', 'Djerba', '2665', 33.865900, 10.865550, true, false, NULL, 70.00, 0.00, 0.00, NULL, 70.00, 10.50, 0.00, 70.00, 'TND', 15.00, 10.50, 59.50, true, '000129', 'qr', 1, 0.00, 0, 'call_center', NULL, NULL, NULL, '2025-08-19 06:00:00+01', '2025-08-25 12:15:00+01', NULL, NULL, NULL, '2025-08-25 12:00:00+01'),
  ('03000000-0000-0000-0000-000000000130', 'BK-2025-0130', '02000000-0000-0000-0000-000000000009', '12000000-0000-0000-0000-000000000035', '22000000-0000-0000-0000-000000000084', '2025-09-20', '10:00', '10:45', 45, 'Africa/Tunis', 'Completed', 'Bilel Hamrouni', '+21650100009', 'bilel.hamrouni@sanad.tn', 'home', '90 Rue de la Republique', 'Ariana', '1999', 36.874100, 10.161850, true, false, NULL, 100.00, 0.00, 0.00, NULL, 100.00, 18.00, 0.00, 100.00, 'TND', 18.00, 18.00, 82.00, true, '000130', 'sms', 0, 0.00, 0, 'mobile', NULL, NULL, NULL, '2025-09-13 07:00:00+01', '2025-09-20 11:00:00+01', NULL, NULL, NULL, '2025-09-20 10:45:00+01')
 ) AS seed(
  id, booking_number, patient_id, provider_id, service_id,
  start_date, daily_start_time, daily_end_time, daily_duration_minutes, timezone, status,
  patient_name, patient_phone, patient_email, service_location, address_line1, city, postal_code,
  latitude, longitude, medical_history_shared, is_for_family_member, family_member_name,
  service_price, addons_price, discount_amount, discount_code, subtotal, platform_fee, tax_amount,
  legacy_total_amount, currency, commission_rate, commission_amount, legacy_provider_amount,
  validation_required, validation_code, validation_method, validation_attempts,
  cancellation_fee, reschedule_count, source, utm_source, utm_medium, utm_campaign,
  created_at, updated_at, cancelled_at, cancelled_by, cancellation_reason, service_completed_at
 )
ON CONFLICT DO NOTHING;


-- ==============================================================
-- BLOCK 2: BOOKING STATUS HISTORY for new bookings
-- ==============================================================
INSERT INTO booking_status_history (id, booking_id, previous_status, new_status, changed_by, created_at, latitude, longitude, change_reason, notes)
VALUES
  ('23000000-0000-0000-0000-000000000150', '03000000-0000-0000-0000-000000000101', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000016', '2025-03-05 08:00:00+01', 36.810000, 10.178150, 'Provider accepted the request.', 'Livraison Pharmacie prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000151', '03000000-0000-0000-0000-000000000101', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000016', '2025-03-10 09:26:00+01', 36.800000, 10.168150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000152', '03000000-0000-0000-0000-000000000101', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000016', '2025-03-10 10:00:00+01', 36.810000, 10.178150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000153', '03000000-0000-0000-0000-000000000101', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000016', '2025-03-10 10:30:00+01', 36.810000, 10.178150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000154', '03000000-0000-0000-0000-000000000102', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000017', '2025-04-10 12:00:00+01', 37.270000, 9.871850, 'Provider accepted the request.', 'Livraison Pharmacie prepared for Youssef Gharbi.'),
  ('23000000-0000-0000-0000-000000000155', '03000000-0000-0000-0000-000000000102', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000017', '2025-04-15 13:30:00+01', 37.260000, 9.861850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000156', '03000000-0000-0000-0000-000000000102', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000017', '2025-04-15 14:00:00+01', 37.270000, 9.871850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000157', '03000000-0000-0000-0000-000000000102', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000017', '2025-04-15 14:20:00+01', 37.270000, 9.871850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000158', '03000000-0000-0000-0000-000000000103', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000018', '2025-05-15 10:00:00+01', 36.874100, 10.161850, 'Provider accepted the request.', 'Preparation Pharmacie prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000159', '03000000-0000-0000-0000-000000000104', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000016', '2025-05-31 11:00:00+01', 36.885900, 10.314450, 'Provider accepted the request.', 'Livraison Pharmacie prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000160', '03000000-0000-0000-0000-000000000104', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000016', '2025-06-05 10:25:00+01', 36.875900, 10.304450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000161', '03000000-0000-0000-0000-000000000104', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000016', '2025-06-05 11:00:00+01', 36.885900, 10.314450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000162', '03000000-0000-0000-0000-000000000104', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000016', '2025-06-05 11:30:00+01', 36.885900, 10.314450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000163', '03000000-0000-0000-0000-000000000105', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000019', '2025-03-28 09:00:00+01', 35.824100, 10.624450, 'Provider accepted the request.', 'Service Funeraire prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000164', '03000000-0000-0000-0000-000000000105', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000019', '2025-04-02 07:29:00+01', 35.814100, 10.614450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000165', '03000000-0000-0000-0000-000000000105', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000019', '2025-04-02 08:00:00+01', 35.824100, 10.624450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000166', '03000000-0000-0000-0000-000000000105', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000019', '2025-04-02 12:00:00+01', 35.824100, 10.624450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000167', '03000000-0000-0000-0000-000000000106', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000020', '2025-07-13 13:00:00+01', 35.665900, 10.094450, 'Provider accepted the request.', 'Pompes Funebres prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000168', '03000000-0000-0000-0000-000000000106', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000020', '2025-07-18 06:33:00+01', 35.655900, 10.084450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000169', '03000000-0000-0000-0000-000000000106', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000020', '2025-07-18 07:00:00+01', 35.665900, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000170', '03000000-0000-0000-0000-000000000106', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000020', '2025-07-18 13:00:00+01', 35.665900, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000171', '03000000-0000-0000-0000-000000000107', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000021', '2025-03-20 11:00:00+01', 34.740000, 10.765550, 'Provider accepted the request.', 'Consultation Veterinaire prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000172', '03000000-0000-0000-0000-000000000107', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000021', '2025-03-25 14:27:00+01', 34.730000, 10.755550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000173', '03000000-0000-0000-0000-000000000107', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000021', '2025-03-25 15:00:00+01', 34.740000, 10.765550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000174', '03000000-0000-0000-0000-000000000107', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000021', '2025-03-25 15:40:00+01', 34.740000, 10.765550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000175', '03000000-0000-0000-0000-000000000108', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000022', '2025-05-07 09:00:00+01', 36.454100, 10.745550, 'Provider accepted the request.', 'Soins Veterinaires prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000176', '03000000-0000-0000-0000-000000000108', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000022', '2025-05-12 09:31:00+01', 36.444100, 10.735550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000177', '03000000-0000-0000-0000-000000000108', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000022', '2025-05-12 10:00:00+01', 36.454100, 10.745550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000178', '03000000-0000-0000-0000-000000000108', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000022', '2025-05-12 10:45:00+01', 36.454100, 10.745550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000179', '03000000-0000-0000-0000-000000000109', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000023', '2025-06-15 13:00:00+01', 36.745900, 10.225550, 'Provider accepted the request.', 'Consultation Veterinaire prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000180', '03000000-0000-0000-0000-000000000109', 'Confirmed', 'Cancelled', '11000000-0000-0000-0000-000000000010', '2025-06-19 08:00:00+01', 36.745900, 10.225550, 'Animal feeling better, no longer needed.', 'Refund workflow initiated.'),
  ('23000000-0000-0000-0000-000000000181', '03000000-0000-0000-0000-000000000110', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000021', '2025-07-31 09:00:00+01', 34.434100, 8.781850, 'Provider accepted the request.', 'Vaccination Animale prepared for Olfa Baccar.'),
  ('23000000-0000-0000-0000-000000000182', '03000000-0000-0000-0000-000000000110', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000021', '2025-08-05 15:27:00+01', 34.424100, 8.771850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000183', '03000000-0000-0000-0000-000000000110', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000021', '2025-08-05 16:00:00+01', 34.434100, 8.781850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000184', '03000000-0000-0000-0000-000000000110', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000021', '2025-08-05 16:50:00+01', 34.434100, 8.781850, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000185', '03000000-0000-0000-0000-000000000111', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000024', '2025-04-17 13:00:00+01', 35.755900, 10.808150, 'Provider accepted the request.', 'Radiographie prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000186', '03000000-0000-0000-0000-000000000111', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000024', '2025-04-22 07:31:00+01', 35.745900, 10.798150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000187', '03000000-0000-0000-0000-000000000111', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000024', '2025-04-22 08:30:00+01', 35.755900, 10.808150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000188', '03000000-0000-0000-0000-000000000111', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000024', '2025-04-22 09:00:00+01', 35.755900, 10.808150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000189', '03000000-0000-0000-0000-000000000112', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000025', '2025-06-05 11:00:00+01', 33.880000, 10.098150, 'Provider accepted the request.', 'IRM prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000190', '03000000-0000-0000-0000-000000000112', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000025', '2025-06-10 10:25:00+01', 33.870000, 10.088150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000191', '03000000-0000-0000-0000-000000000112', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000025', '2025-06-10 11:00:00+01', 33.880000, 10.098150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000192', '03000000-0000-0000-0000-000000000112', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000025', '2025-06-10 11:45:00+01', 33.880000, 10.098150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000193', '03000000-0000-0000-0000-000000000114', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000026', '2025-04-30 09:00:00+01', 36.404100, 10.615550, 'Provider accepted the request.', 'Seance Fitness prepared for Tarek Bouzid.'),
  ('23000000-0000-0000-0000-000000000194', '03000000-0000-0000-0000-000000000114', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000026', '2025-05-05 16:29:00+01', 36.394100, 10.605550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000195', '03000000-0000-0000-0000-000000000114', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000026', '2025-05-05 17:00:00+01', 36.404100, 10.615550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000196', '03000000-0000-0000-0000-000000000114', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000026', '2025-05-05 18:00:00+01', 36.404100, 10.615550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000197', '03000000-0000-0000-0000-000000000115', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000027', '2025-06-20 13:00:00+01', 36.820000, 10.094450, 'Provider accepted the request.', 'Remise en Forme prepared for Wafa Souissi.'),
  ('23000000-0000-0000-0000-000000000198', '03000000-0000-0000-0000-000000000115', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000027', '2025-06-25 07:33:00+01', 36.810000, 10.084450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000199', '03000000-0000-0000-0000-000000000115', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000027', '2025-06-25 08:00:00+01', 36.820000, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000200', '03000000-0000-0000-0000-000000000115', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000027', '2025-06-25 09:00:00+01', 36.820000, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000201', '03000000-0000-0000-0000-000000000116', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000026', '2025-09-03 11:00:00+01', 35.500000, 11.038150, 'Provider accepted the request.', 'Seance Fitness prepared for Firas Dridi.'),
  ('23000000-0000-0000-0000-000000000202', '03000000-0000-0000-0000-000000000116', 'Confirmed', 'Cancelled', '11000000-0000-0000-0000-000000000013', '2025-09-07 08:00:00+01', 35.500000, 11.038150, 'Blessure au genou, seance reportee.', 'Refund workflow initiated.'),
  ('23000000-0000-0000-0000-000000000203', '03000000-0000-0000-0000-000000000117', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000031', '2025-03-10 13:00:00+01', 35.755900, 10.808150, 'Provider accepted the request.', 'Garde d''''Enfant prepared for Salma Khelifi.'),
  ('23000000-0000-0000-0000-000000000204', '03000000-0000-0000-0000-000000000117', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000031', '2025-03-15 17:29:00+01', 35.745900, 10.798150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000205', '03000000-0000-0000-0000-000000000117', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000031', '2025-03-15 18:00:00+01', 35.755900, 10.808150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000206', '03000000-0000-0000-0000-000000000117', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000031', '2025-03-15 22:00:00+01', 35.755900, 10.808150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000207', '03000000-0000-0000-0000-000000000118', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000032', '2025-05-23 11:00:00+01', 34.740000, 10.765550, 'Provider accepted the request.', 'Garde d''''Enfant prepared for Fatma Trabelsi.'),
  ('23000000-0000-0000-0000-000000000208', '03000000-0000-0000-0000-000000000118', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000032', '2025-05-28 13:33:00+01', 34.730000, 10.755550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000209', '03000000-0000-0000-0000-000000000118', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000032', '2025-05-28 14:00:00+01', 34.740000, 10.765550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000210', '03000000-0000-0000-0000-000000000118', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000032', '2025-05-28 18:00:00+01', 34.740000, 10.765550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000211', '03000000-0000-0000-0000-000000000119', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000031', '2025-08-05 09:00:00+01', 36.954100, 8.758150, 'Provider accepted the request.', 'Garde d''''Enfant prepared for Nizar Ferchichi.'),
  ('23000000-0000-0000-0000-000000000212', '03000000-0000-0000-0000-000000000119', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000031', '2025-08-10 18:27:00+01', 36.944100, 8.748150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000213', '03000000-0000-0000-0000-000000000119', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000031', '2025-08-10 19:00:00+01', 36.954100, 8.758150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000214', '03000000-0000-0000-0000-000000000119', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000031', '2025-08-10 23:00:00+01', 36.954100, 8.758150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000215', '03000000-0000-0000-0000-000000000119', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-08-11 08:00:00+01', 36.954100, 8.758150, 'Admin validated after review.', 'Quality confirmed.'),
  ('23000000-0000-0000-0000-000000000216', '03000000-0000-0000-0000-000000000120', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000033', '2025-04-05 08:00:00+01', 33.880000, 10.098150, 'Provider accepted the request.', 'Accompagnement Medical prepared for Ines Chaabane.'),
  ('23000000-0000-0000-0000-000000000217', '03000000-0000-0000-0000-000000000120', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000033', '2025-04-10 07:32:00+01', 33.870000, 10.088150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000218', '03000000-0000-0000-0000-000000000120', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000033', '2025-04-10 08:00:00+01', 33.880000, 10.098150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000219', '03000000-0000-0000-0000-000000000120', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000033', '2025-04-10 12:00:00+01', 33.880000, 10.098150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000220', '03000000-0000-0000-0000-000000000121', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000033', '2025-06-30 12:00:00+01', 36.820000, 10.094450, 'Provider accepted the request.', 'Accompagnement Medical prepared for Wafa Souissi.'),
  ('23000000-0000-0000-0000-000000000221', '03000000-0000-0000-0000-000000000121', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000033', '2025-07-05 08:26:00+01', 36.810000, 10.084450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000222', '03000000-0000-0000-0000-000000000121', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000033', '2025-07-05 09:00:00+01', 36.820000, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000223', '03000000-0000-0000-0000-000000000121', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000033', '2025-07-05 13:00:00+01', 36.820000, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000224', '03000000-0000-0000-0000-000000000122', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000034', '2025-05-03 10:00:00+01', 35.824100, 10.624450, 'Provider accepted the request.', 'Bilan Sante prepared for Mohamed Saidi.'),
  ('23000000-0000-0000-0000-000000000225', '03000000-0000-0000-0000-000000000122', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000034', '2025-05-08 07:30:00+01', 35.814100, 10.614450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000226', '03000000-0000-0000-0000-000000000122', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000034', '2025-05-08 08:00:00+01', 35.824100, 10.624450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000227', '03000000-0000-0000-0000-000000000122', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000034', '2025-05-08 09:30:00+01', 35.824100, 10.624450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000228', '03000000-0000-0000-0000-000000000124', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000028', '2025-04-13 08:00:00+01', 36.454100, 10.745550, 'Provider accepted the request.', 'Suivi Maternite prepared for Nour Ben Hassen.'),
  ('23000000-0000-0000-0000-000000000229', '03000000-0000-0000-0000-000000000124', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000028', '2025-04-18 09:34:00+01', 36.444100, 10.735550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000230', '03000000-0000-0000-0000-000000000124', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000028', '2025-04-18 10:00:00+01', 36.454100, 10.745550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000231', '03000000-0000-0000-0000-000000000124', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000028', '2025-04-18 11:00:00+01', 36.454100, 10.745550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000232', '03000000-0000-0000-0000-000000000125', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000028', '2025-07-17 12:00:00+01', 36.885900, 10.314450, 'Provider accepted the request.', 'Suivi Maternite prepared for Asma Riahi.'),
  ('23000000-0000-0000-0000-000000000233', '03000000-0000-0000-0000-000000000125', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000028', '2025-07-22 13:28:00+01', 36.875900, 10.304450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000234', '03000000-0000-0000-0000-000000000125', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000028', '2025-07-22 14:00:00+01', 36.885900, 10.314450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000235', '03000000-0000-0000-0000-000000000125', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000028', '2025-07-22 15:00:00+01', 36.885900, 10.314450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000236', '03000000-0000-0000-0000-000000000126', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000029', '2025-06-10 10:00:00+01', 36.810000, 10.178150, 'Provider accepted the request.', 'Garde de Nuit prepared for Ahmed Ben Ali.'),
  ('23000000-0000-0000-0000-000000000237', '03000000-0000-0000-0000-000000000126', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000029', '2025-06-15 20:32:00+01', 36.800000, 10.168150, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000238', '03000000-0000-0000-0000-000000000126', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000029', '2025-06-15 21:00:00+01', 36.810000, 10.178150, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000239', '03000000-0000-0000-0000-000000000126', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000029', '2025-06-15 06:00:00+01', 36.810000, 10.178150, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000240', '03000000-0000-0000-0000-000000000127', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000029', '2025-08-28 08:00:00+01', 36.745900, 10.225550, 'Provider accepted the request.', 'Garde de Nuit prepared for Mariem Laabidi.'),
  ('23000000-0000-0000-0000-000000000241', '03000000-0000-0000-0000-000000000128', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000030', '2025-05-10 09:00:00+01', 35.665900, 10.094450, 'Provider accepted the request.', 'Soins Chroniques prepared for Khalil Mansouri.'),
  ('23000000-0000-0000-0000-000000000242', '03000000-0000-0000-0000-000000000128', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000030', '2025-05-15 08:27:00+01', 35.655900, 10.084450, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000243', '03000000-0000-0000-0000-000000000128', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000030', '2025-05-15 09:00:00+01', 35.665900, 10.094450, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000244', '03000000-0000-0000-0000-000000000128', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000030', '2025-05-15 10:00:00+01', 35.665900, 10.094450, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000245', '03000000-0000-0000-0000-000000000129', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000030', '2025-08-20 13:00:00+01', 33.865900, 10.865550, 'Provider accepted the request.', 'Soins Chroniques prepared for Hatem Jeridi.'),
  ('23000000-0000-0000-0000-000000000246', '03000000-0000-0000-0000-000000000129', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000030', '2025-08-25 10:31:00+01', 33.855900, 10.855550, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000247', '03000000-0000-0000-0000-000000000129', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000030', '2025-08-25 11:00:00+01', 33.865900, 10.865550, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000248', '03000000-0000-0000-0000-000000000129', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000030', '2025-08-25 12:00:00+01', 33.865900, 10.865550, 'Service delivered successfully.', 'Provider submitted completion notes.'),
  ('23000000-0000-0000-0000-000000000249', '03000000-0000-0000-0000-000000000129', 'Completed', 'Validated', '9a3f934b-f14d-4c9a-b198-13d2c366cfa1', '2025-08-26 08:00:00+01', 33.865900, 10.865550, 'Admin validated after review.', 'Quality confirmed.'),
  ('23000000-0000-0000-0000-000000000250', '03000000-0000-0000-0000-000000000130', 'Pending', 'Confirmed', '21000000-0000-0000-0000-000000000035', '2025-09-15 12:00:00+01', 36.874100, 10.161850, 'Provider accepted the request.', 'Consultation Cardiologie prepared for Bilel Hamrouni.'),
  ('23000000-0000-0000-0000-000000000251', '03000000-0000-0000-0000-000000000130', 'Confirmed', 'ProviderOnWay', '21000000-0000-0000-0000-000000000035', '2025-09-20 09:26:00+01', 36.864100, 10.151850, 'Provider left for the visit.', 'Live tracking started.'),
  ('23000000-0000-0000-0000-000000000252', '03000000-0000-0000-0000-000000000130', 'ProviderOnWay', 'InProgress', '21000000-0000-0000-0000-000000000035', '2025-09-20 10:00:00+01', 36.874100, 10.161850, 'Provider arrived on site.', 'Care delivery started.'),
  ('23000000-0000-0000-0000-000000000253', '03000000-0000-0000-0000-000000000130', 'InProgress', 'Completed', '21000000-0000-0000-0000-000000000035', '2025-09-20 10:45:00+01', 36.874100, 10.161850, 'Service delivered successfully.', 'Provider submitted completion notes.')
ON CONFLICT DO NOTHING;


-- ==============================================================
-- BLOCK 3: FINAL BOOKING SESSION RECONCILIATION
-- Covers the later appended booking block too.
-- ==============================================================
WITH booking_session_source AS (
    SELECT
        booking.id,
        booking.provider_id,
        booking.patient_id,
        booking.start_date,
        booking.end_date,
        booking.daily_start_time,
        booking.daily_end_time,
        booking.daily_duration_minutes,
        booking.timezone,
        booking.status,
        booking.created_at,
        booking.updated_at,
        booking.cancelled_at,
        booking.cancelled_by,
        booking.cancellation_reason,
        booking.service_completed_at,
        booking.validated_at,
        service.category,
        generated.session_date
    FROM bookings AS booking
    INNER JOIN services AS service
        ON service.id = booking.service_id
    CROSS JOIN LATERAL (
        SELECT generate_series(booking.start_date, booking.end_date, INTERVAL '1 day')::date AS session_date
        WHERE booking.end_date > booking.start_date
          AND service.category IN (
              'nursing',
              'elderly_care',
              'night_care',
              'chronic_care',
              'medical_companion',
              'babysitting'
          )

        UNION ALL

        SELECT booking.start_date AS session_date
        WHERE booking.end_date <= booking.start_date
           OR service.category NOT IN (
              'nursing',
              'elderly_care',
              'night_care',
              'chronic_care',
              'medical_companion',
              'babysitting'
          )
    ) AS generated
),
booking_session_numbered AS (
    SELECT
        source.*,
        ROW_NUMBER() OVER (PARTITION BY source.id ORDER BY source.session_date) AS session_index,
        COUNT(*) OVER (PARTITION BY source.id) AS session_count
    FROM booking_session_source AS source
)
INSERT INTO booking_sessions (
    id,
    booking_id,
    provider_id,
    patient_id,
    scheduled_date,
    scheduled_start_time,
    scheduled_end_time,
    scheduled_duration_minutes,
    timezone,
    status,
    provider_departed_at,
    provider_arrived_at,
    service_started_at,
    service_completed_at,
    verification_code,
    verification_code_generated_at,
    verification_code_expires_at,
    verification_attempts,
    verified_at,
    verification_method,
    cancelled_at,
    cancelled_by,
    cancellation_reason,
    no_show_at,
    no_show_reason,
    disputed_at,
    dispute_reason,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v5(
        '6ba7b812-9dad-11d1-80b4-00c04fd430c8'::uuid,
        source.id::text || ':' || source.session_date::text
    ) AS id,
    source.id AS booking_id,
    source.provider_id,
    source.patient_id,
    source.session_date AS scheduled_date,
    source.daily_start_time AS scheduled_start_time,
    source.daily_end_time AS scheduled_end_time,
    source.daily_duration_minutes AS scheduled_duration_minutes,
    COALESCE(source.timezone, 'Africa/Tunis') AS timezone,
    CASE
        WHEN source.status = 'Validated'
            THEN 'Validated'
        WHEN source.status IN ('Completed', 'Disputed')
            THEN CASE WHEN source.session_index < source.session_count THEN 'Validated' ELSE source.status END
        WHEN source.status IN ('Pending', 'Confirmed', 'ProviderOnWay', 'InProgress', 'Cancelled', 'NoShow')
            THEN CASE WHEN source.session_index < source.session_count THEN 'Validated' ELSE source.status END
        ELSE 'Pending'
    END AS status,
    CASE
        WHEN source.status IN ('ProviderOnWay', 'InProgress', 'Completed', 'Validated', 'Disputed')
            THEN (source.session_date + source.daily_start_time - INTERVAL '30 minutes') AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        WHEN source.status IN ('Cancelled', 'NoShow') AND source.session_index < source.session_count
            THEN (source.session_date + source.daily_start_time - INTERVAL '30 minutes') AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        ELSE NULL
    END AS provider_departed_at,
    CASE
        WHEN source.status IN ('InProgress', 'Completed', 'Validated', 'NoShow', 'Disputed')
            THEN (source.session_date + source.daily_start_time) AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        WHEN source.status IN ('Cancelled', 'ProviderOnWay') AND source.session_index < source.session_count
            THEN (source.session_date + source.daily_start_time) AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        ELSE NULL
    END AS provider_arrived_at,
    CASE
        WHEN source.status IN ('InProgress', 'Completed', 'Validated', 'Disputed')
            THEN (source.session_date + source.daily_start_time) AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        WHEN source.status IN ('Cancelled', 'NoShow', 'ProviderOnWay') AND source.session_index < source.session_count
            THEN (source.session_date + source.daily_start_time) AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        ELSE NULL
    END AS service_started_at,
    CASE
        WHEN source.status IN ('Completed', 'Validated', 'Disputed')
            THEN COALESCE(
                source.service_completed_at,
                (source.session_date + COALESCE(source.daily_end_time, source.daily_start_time)) AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
            )
        WHEN source.status IN ('Pending', 'Confirmed', 'ProviderOnWay', 'InProgress', 'Cancelled', 'NoShow')
             AND source.session_index < source.session_count
            THEN (source.session_date + COALESCE(source.daily_end_time, source.daily_start_time)) AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        ELSE NULL
    END AS service_completed_at,
    NULL AS verification_code,
    NULL AS verification_code_generated_at,
    NULL AS verification_code_expires_at,
    0 AS verification_attempts,
    CASE
        WHEN source.status = 'Validated'
            THEN COALESCE(source.validated_at, source.updated_at)
        WHEN source.status <> 'Validated' AND source.session_index < source.session_count
            THEN (source.session_date + COALESCE(source.daily_end_time, source.daily_start_time) + INTERVAL '1 hour') AT TIME ZONE COALESCE(source.timezone, 'Africa/Tunis')
        ELSE NULL
    END AS verified_at,
    CASE
        WHEN source.status = 'Validated' OR source.session_index < source.session_count
            THEN 'seeded_session_validation'
        ELSE NULL
    END AS verification_method,
    CASE
        WHEN source.status = 'Cancelled' AND source.session_index = source.session_count
            THEN source.cancelled_at
        ELSE NULL
    END AS cancelled_at,
    CASE
        WHEN source.status = 'Cancelled' AND source.session_index = source.session_count
            THEN source.cancelled_by
        ELSE NULL
    END AS cancelled_by,
    CASE
        WHEN source.status = 'Cancelled' AND source.session_index = source.session_count
            THEN source.cancellation_reason
        ELSE NULL
    END AS cancellation_reason,
    CASE
        WHEN source.status = 'NoShow' AND source.session_index = source.session_count
            THEN source.updated_at
        ELSE NULL
    END AS no_show_at,
    CASE
        WHEN source.status = 'NoShow' AND source.session_index = source.session_count
            THEN 'Seeded no-show scenario'
        ELSE NULL
    END AS no_show_reason,
    CASE
        WHEN source.status = 'Disputed' AND source.session_index = source.session_count
            THEN source.updated_at
        ELSE NULL
    END AS disputed_at,
    CASE
        WHEN source.status = 'Disputed' AND source.session_index = source.session_count
            THEN 'Seeded dispute scenario'
        ELSE NULL
    END AS dispute_reason,
    source.created_at,
    source.updated_at
FROM booking_session_numbered AS source
ON CONFLICT DO NOTHING;

UPDATE bookings
SET validation_code = NULL,
    validation_code_expires_at = NULL,
    validation_attempts = 0;

UPDATE bookings AS booking
SET
    provider_departed_at = aggregate.provider_departed_at,
    provider_arrived_at = aggregate.provider_arrived_at,
    service_started_at = aggregate.service_started_at,
    service_completed_at = aggregate.service_completed_at
FROM (
    SELECT
        booking_id,
        MIN(provider_departed_at) AS provider_departed_at,
        MIN(provider_arrived_at) AS provider_arrived_at,
        MIN(service_started_at) AS service_started_at,
        MAX(service_completed_at) AS service_completed_at
    FROM booking_sessions
    GROUP BY booking_id
) AS aggregate
WHERE booking.id = aggregate.booking_id;

UPDATE bookings
SET validation_method = NULL,
    validated_at = NULL,
    settlement_completed_at = NULL,
    settlement_completed_by = NULL
WHERE status <> 'Validated';

UPDATE bookings
SET validation_method = 'session_code',
    validated_at = COALESCE(validated_at, updated_at),
    settlement_completed_at = COALESCE(settlement_completed_at, validated_at, updated_at),
    settlement_completed_by = COALESCE(settlement_completed_by, '9a3f934b-f14d-4c9a-b198-13d2c366cfa1'::uuid)
WHERE status = 'Validated';

WITH provider_review_stats AS (
    SELECT
        provider.id AS provider_id,
        ROUND(AVG(review.rating)::numeric, 2) AS rating_average,
        COUNT(review.id)::integer AS rating_count,
        ROUND(AVG(review.rating_professionalism)::numeric, 2) AS rating_professionalism,
        ROUND(AVG(review.rating_punctuality)::numeric, 2) AS rating_punctuality,
        ROUND(AVG(review.rating_quality)::numeric, 2) AS rating_quality
    FROM providers AS provider
    LEFT JOIN reviews AS review
        ON review.provider_id = provider.id
       AND review.is_visible = true
    GROUP BY provider.id
)
UPDATE providers AS provider
SET rating_average = COALESCE(stats.rating_average, 0.00),
    rating_count = stats.rating_count,
    rating_professionalism = COALESCE(stats.rating_professionalism, 0.00),
    rating_punctuality = COALESCE(stats.rating_punctuality, 0.00),
    rating_quality = COALESCE(stats.rating_quality, 0.00)
FROM provider_review_stats AS stats
WHERE provider.id = stats.provider_id;


-- ==============================================================
-- BLOCK 5: BOOKING LINE ITEMS (canonical selected services)
-- Every booking gets a line item for its primary service anchor.
-- Legacy selected-service rows are merged in as additional care selections and deduplicated by booking + service.
WITH legacy_selected_items (booking_id, service_id, service_name, unit_price, quantity, created_at, selection_order, source_priority) AS (
    VALUES
      ('03000000-0000-0000-0000-000000000001'::uuid, '22000000-0000-0000-0000-000000000001'::uuid, 'Consultation Générale', 80.00, 1, '2025-02-11 08:00:00+01'::timestamp with time zone, 1, 1),
      ('03000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000002', 'Suivi Post-Opératoire', 120.00, 1, '2025-03-12 08:00:00+01', 2, 1),
      ('03000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000003', 'Téléconsultation', 40.00, 1, '2025-04-13 08:00:00+01', 3, 1),
      ('03000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000015', 'Rééducation Motrice', 60.00, 1, '2025-05-14 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000016', 'Massage Thérapeutique', 50.00, 1, '2025-06-15 08:00:00+01', 2, 1),
      ('03000000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000017', 'Rééducation Post-AVC', 80.00, 1, '2025-07-26 08:00:00+01', 3, 1),
      ('03000000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000008', 'Injection et Perfusion', 35.00, 1, '2025-07-16 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000020', 'Bilan Sanguin Complet', 55.00, 1, '2025-08-17 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000021', 'Prélèvement Urinaire', 30.00, 1, '2025-09-18 08:00:00+01', 2, 1),
      ('03000000-0000-0000-0000-000000000008', '22000000-0000-0000-0000-000000000009', 'Soins de Plaie', 40.00, 1, '2025-10-19 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000011', '22000000-0000-0000-0000-000000000004', 'ECG + Consultation', 110.00, 1, '2025-01-20 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000018', '22000000-0000-0000-0000-000000000029', 'Consultation Psychologique', 70.00, 1, '2025-02-21 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000024', '22000000-0000-0000-0000-000000000027', 'Location Lit Médicalisé', 120.00, 1, '2025-03-22 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000037', '22000000-0000-0000-0000-000000000016', 'Massage Thérapeutique', 50.00, 1, '2025-04-23 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000037', '22000000-0000-0000-0000-000000000017', 'Rééducation Post-AVC', 80.00, 1, '2025-01-01 08:00:00+01', 2, 1),
      ('03000000-0000-0000-0000-000000000072', '22000000-0000-0000-0000-000000000019', 'Drainage Lymphatique', 55.00, 1, '2025-05-24 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000054', '22000000-0000-0000-0000-000000000032', 'Bilan Nutritionnel', 60.00, 1, '2025-06-25 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000050', '22000000-0000-0000-0000-000000000020', 'Bilan Sanguin Complet', 55.00, 1, '2025-08-27 08:00:00+01', 1, 1),
      ('03000000-0000-0000-0000-000000000050', '22000000-0000-0000-0000-000000000022', 'Bilan Thyroïdien', 65.00, 1, '2025-09-28 08:00:00+01', 2, 1),
      ('03000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000010', 'Garde de Nuit', 200.00, 1, '2025-10-20 08:00:00+01', 1, 1)
),
canonical_booking_items AS (
    SELECT
        booking.id AS booking_id,
        booking.service_id,
        service.name AS service_name,
        booking.service_price AS unit_price,
        1 AS quantity,
        booking.created_at,
        0 AS selection_order,
        0 AS source_priority
    FROM bookings AS booking
    INNER JOIN services AS service
        ON service.id = booking.service_id
),
selected_items AS (
    SELECT * FROM canonical_booking_items
    UNION ALL
    SELECT * FROM legacy_selected_items
),
deduped_selected_items AS (
    SELECT DISTINCT ON (selected.booking_id, selected.service_id)
        selected.booking_id,
        selected.service_id,
        selected.service_name,
        selected.unit_price,
        selected.quantity,
        selected.created_at,
        selected.selection_order
    FROM selected_items AS selected
    ORDER BY selected.booking_id, selected.service_id, selected.source_priority, selected.selection_order, selected.created_at
),
line_item_source AS (
    SELECT
        selected.booking_id,
        selected.service_id,
        selected.service_name,
        selected.unit_price,
        selected.quantity,
        selected.created_at,
        selected.selection_order,
        service.category AS service_category,
        COALESCE(service.currency, 'TND') AS currency
    FROM deduped_selected_items AS selected
    INNER JOIN services AS service
        ON service.id = selected.service_id
 )
INSERT INTO booking_line_items (
    id, booking_id, service_id, service_name, service_category, currency, unit_price, quantity, subtotal, created_at
 )
SELECT
    uuid_generate_v5('6ba7b811-9dad-11d1-80b4-00c04fd430c8'::uuid, source.booking_id::text || ':' || source.service_id::text),
    source.booking_id,
    source.service_id,
    source.service_name,
    source.service_category,
    source.currency,
    source.unit_price,
    source.quantity,
    ROUND(source.unit_price * source.quantity, 2),
    source.created_at
FROM line_item_source AS source
ON CONFLICT DO NOTHING;


-- ==============================================================
-- BLOCK 6: PHARMACY ORDERS (5 rows)
-- ==============================================================
INSERT INTO pharmacy_orders (id, booking_id, items, amount, prescription_file_id, delivery_address, patient_phone, notes, order_date, completed_at, created_at, updated_at, deleted_at)
VALUES
  ('36000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000101', 'Doliprane 1000mg x2, Augmentin 1g x1', 45.00, NULL, '10 Rue de la Republique, Tunis 1111', '+21650100001', 'Livraison avant midi SVP', '2025-03-10 10:00:00+01', '2025-03-10 10:30:00+01', '2025-03-10 10:00:00+01', '2025-03-10 10:30:00+01', NULL),
  ('36000000-0000-0000-0000-000000000002', '03000000-0000-0000-0000-000000000102', 'Voltarene 75mg x1, Maalox x2', 35.00, NULL, '50 Rue de la Republique, Bizerte 1555', '+21650100005', 'Appeler avant livraison', '2025-04-15 14:00:00+01', '2025-04-15 14:20:00+01', '2025-04-15 14:00:00+01', '2025-04-15 14:20:00+01', NULL),
  ('36000000-0000-0000-0000-000000000003', '03000000-0000-0000-0000-000000000104', 'Amoxicilline 500mg x2, Paracetamol 500mg x3', 40.00, NULL, '120 Rue de la Republique, La Marsa 2332', '+21650100012', 'Livraison avant midi SVP', '2025-06-05 11:00:00+01', '2025-06-05 11:30:00+01', '2025-06-05 11:00:00+01', '2025-06-05 11:30:00+01', NULL),
  ('36000000-0000-0000-0000-000000000004', '03000000-0000-0000-0000-000000000103', 'Metformine 850mg x1, Glucophage 1000mg x1', 55.00, NULL, '90 Rue de la Republique, Ariana 1999', '+21650100009', 'Appeler avant livraison', '2025-05-20 09:00:00+01', NULL, '2025-05-20 09:00:00+01', '2025-05-20 09:00:00+01', NULL),
  ('36000000-0000-0000-0000-000000000005', '03000000-0000-0000-0000-000000000101', 'Ventoline spray x1, Celestene 0.05% x1', 32.00, NULL, '10 Rue de la Republique, Tunis 1111', '+21650100001', 'Livraison avant midi SVP', '2025-03-15 08:00:00+01', NULL, '2025-03-15 08:00:00+01', '2025-03-15 08:00:00+01', NULL)
ON CONFLICT DO NOTHING;


-- ==============================================================
-- BLOCK 7: PATIENT STORED FILES (10 rows)
-- ==============================================================
DROP TABLE IF EXISTS seed_booking_files;
CREATE TEMP TABLE seed_booking_files (
    file_id uuid PRIMARY KEY,
    access_audit_id uuid NOT NULL,
    owner_user_id uuid NOT NULL,
    owner_role text NOT NULL,
    use_case text NOT NULL,
    file_category text NOT NULL,
    file_visibility text NOT NULL,
    document_type text NOT NULL,
    original_file_name text NOT NULL,
    mime_type text NOT NULL,
    file_size_bytes integer NOT NULL,
    related_patient_id uuid NOT NULL,
    related_provider_id uuid,
    related_booking_id uuid,
    retention_policy text NOT NULL,
    retention_expires_at timestamp with time zone NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone NOT NULL
) ON COMMIT DROP;

INSERT INTO seed_booking_files (file_id, access_audit_id, owner_user_id, owner_role, use_case, file_category, file_visibility, document_type, original_file_name, mime_type, file_size_bytes, related_patient_id, related_provider_id, related_booking_id, retention_policy, retention_expires_at, ip_address, user_agent, created_at)
VALUES
  ('38000000-0000-0000-0000-000000000001', '38100000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'patient', 'Prescription', 'Document', 'Private', 'Prescription', 'rx-2025-001.pdf', 'application/pdf', 245000, '02000000-0000-0000-0000-000000000001', '12000000-0000-0000-0000-000000000001', '03000000-0000-0000-0000-000000000101', 'Medical7Years', '2032-02-10 00:00:00+01', '102.16.51.101', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-02-10 09:00:00+01'),
  ('38000000-0000-0000-0000-000000000002', '38100000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000003', 'patient', 'Prescription', 'Document', 'Private', 'Prescription', 'rx-2025-002.pdf', 'application/pdf', 180000, '02000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000019', '03000000-0000-0000-0000-000000000105', 'Medical7Years', '2032-03-15 00:00:00+01', '102.16.52.102', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-03-15 10:00:00+01'),
  ('38000000-0000-0000-0000-000000000003', '38100000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000005', 'patient', 'Prescription', 'Document', 'Private', 'Prescription', 'rx-2025-003.pdf', 'application/pdf', 320000, '02000000-0000-0000-0000-000000000005', '12000000-0000-0000-0000-000000000017', '03000000-0000-0000-0000-000000000102', 'Medical7Years', '2032-04-20 00:00:00+01', '102.16.53.103', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-04-20 11:00:00+01'),
  ('38000000-0000-0000-0000-000000000004', '38100000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000008', 'patient', 'Prescription', 'Document', 'Private', 'Prescription', 'rx-2025-004.pdf', 'application/pdf', 150000, '02000000-0000-0000-0000-000000000008', '12000000-0000-0000-0000-000000000025', '03000000-0000-0000-0000-000000000112', 'Medical7Years', '2032-05-25 00:00:00+01', '102.16.54.104', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-05-25 08:00:00+01'),
  ('38000000-0000-0000-0000-000000000005', '38100000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000002', 'patient', 'MedicalDocument', 'Document', 'Private', 'LabResult', 'lab-2025-001.pdf', 'application/pdf', 890000, '02000000-0000-0000-0000-000000000002', '12000000-0000-0000-0000-000000000021', '03000000-0000-0000-0000-000000000107', 'Medical7Years', '2032-03-28 00:00:00+01', '102.16.55.105', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-03-28 14:00:00+01'),
  ('38000000-0000-0000-0000-000000000006', '38100000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000007', 'patient', 'MedicalDocument', 'Document', 'Private', 'LabResult', 'lab-2025-002.pdf', 'application/pdf', 1200000, '02000000-0000-0000-0000-000000000007', '12000000-0000-0000-0000-000000000030', '03000000-0000-0000-0000-000000000128', 'Medical7Years', '2032-05-18 00:00:00+01', '102.16.56.106', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-05-18 15:00:00+01'),
  ('38000000-0000-0000-0000-000000000007', '38100000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000012', 'patient', 'MedicalDocument', 'Document', 'Private', 'LabResult', 'lab-2025-003.pdf', 'application/pdf', 750000, '02000000-0000-0000-0000-000000000012', '12000000-0000-0000-0000-000000000028', '03000000-0000-0000-0000-000000000125', 'Medical7Years', '2032-07-25 00:00:00+01', '102.16.57.107', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-07-25 09:00:00+01'),
  ('38000000-0000-0000-0000-000000000008', '38100000-0000-0000-0000-000000000008', '11000000-0000-0000-0000-000000000004', 'patient', 'MedicalDocument', 'Document', 'Private', 'MedicalRecord', 'report-2025-001.pdf', 'application/pdf', 2100000, '02000000-0000-0000-0000-000000000004', '12000000-0000-0000-0000-000000000024', '03000000-0000-0000-0000-000000000111', 'Medical7Years', '2032-04-25 00:00:00+01', '102.16.58.108', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-04-25 10:00:00+01'),
  ('38000000-0000-0000-0000-000000000009', '38100000-0000-0000-0000-000000000009', '11000000-0000-0000-0000-000000000014', 'patient', 'MedicalDocument', 'Document', 'Private', 'MedicalRecord', 'report-2025-002.pdf', 'application/pdf', 1800000, '02000000-0000-0000-0000-000000000014', '12000000-0000-0000-0000-000000000021', '03000000-0000-0000-0000-000000000110', 'Medical7Years', '2032-08-08 00:00:00+01', '102.16.59.109', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-08-08 11:00:00+01'),
  ('38000000-0000-0000-0000-000000000010', '38100000-0000-0000-0000-000000000010', '11000000-0000-0000-0000-000000000009', 'patient', 'MedicalDocument', 'Document', 'Private', 'Insurance', 'insurance-2025-001.pdf', 'application/pdf', 540000, '02000000-0000-0000-0000-000000000009', NULL, NULL, 'Standard1Year', '2026-01-15 00:00:00+01', '102.16.60.110', 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) SanadApp/2.1', '2025-01-15 08:00:00+01')
ON CONFLICT DO NOTHING;

INSERT INTO stored_files (id, use_case, category, visibility, status, scan_status, scan_verdict, scan_engine, scan_engine_version, bucket, object_key, staging_bucket, staging_object_key, original_file_name, declared_content_type, detected_content_type, size_bytes, sha256, owner_user_id, owner_role, related_patient_id, related_provider_id, related_booking_id, retention_policy, retention_expires_at, created_at, updated_at, ready_at)
SELECT
    seed.file_id,
    seed.use_case,
    seed.file_category,
    seed.file_visibility,
    'Ready',
    'Clean',
    'Clean',
    'seed',
    'seed',
    'files-private',
    'patients/' || seed.related_patient_id::text || '/' || lower(seed.use_case) || '/' || seed.file_id::text || '-' || seed.original_file_name,
    'files-staging',
    'seed/patient-documents/' || seed.file_id::text || '-' || seed.original_file_name,
    seed.original_file_name,
    seed.mime_type,
    seed.mime_type,
    seed.file_size_bytes,
    lpad(replace(seed.file_id::text, '-', ''), 64, '0'),
    seed.owner_user_id,
    seed.owner_role,
    seed.related_patient_id,
    seed.related_provider_id,
    seed.related_booking_id,
    seed.retention_policy,
    seed.retention_expires_at,
    seed.created_at,
    seed.created_at,
    seed.created_at
FROM seed_booking_files AS seed
ON CONFLICT DO NOTHING;

UPDATE bookings AS booking
SET prescription_file_id = seed.file_id
FROM seed_booking_files AS seed
WHERE seed.use_case = 'Prescription'
  AND booking.id = seed.related_booking_id
  AND booking.prescription_file_id IS NULL;


-- ==============================================================
-- BLOCK 8: FILE ACCESS AUDIT (10 rows)
-- ==============================================================
INSERT INTO file_access_audit (id, file_id, actor_user_id, actor_role, action, outcome, ip_address, user_agent, details_json, created_at)
SELECT
    seed.access_audit_id,
    seed.file_id,
    seed.owner_user_id,
    seed.owner_role,
    'seeded_upload',
    'success',
    seed.ip_address,
    seed.user_agent,
    jsonb_build_object(
        'source', 'seed',
        'mode', 'metadata_only',
        'documentType', seed.document_type,
        'useCase', seed.use_case,
        'originalFileName', seed.original_file_name,
        'relatedPatientId', seed.related_patient_id,
        'relatedProviderId', seed.related_provider_id,
        'relatedBookingId', seed.related_booking_id
    ),
    seed.created_at
FROM seed_booking_files AS seed
ON CONFLICT DO NOTHING;


-- ==============================================================
-- PROVIDER SERVICE PRESETS (ON CONFLICT DO NOTHING — never overwrites existing rows)
-- ==============================================================
INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000001', 'nursing', 'wound_care_visit', 'Wound Care Visit', 'Visite de soin des plaies', 'زيارة علاج الجروح', NULL, 'Complete wound cleaning and dressing change at home.', 'Nettoyage complet des plaies et changement de pansement a domicile.', 'تنظيف كامل للجروح وتغيير الضمادات في المنزل.', NULL, 45.0, 'fixed', 'TND', 40, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000002', 'nursing', 'injection_infusion', 'Injection and Infusion Care', 'Injection et perfusion', 'حقن وتركيب محلول', NULL, 'Medication injection and infusion monitoring at home.', 'Injection de medicaments et surveillance de perfusion a domicile.', 'حقن الادوية ومراقبة المحاليل في المنزل.', NULL, 38.0, 'fixed', 'TND', 30, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000003', 'physiotherapy', 'mobility_rehabilitation', 'Mobility Rehabilitation Session', 'Seance de reeducation motrice', 'جلسة اعادة تاهيل حركي', NULL, 'Home session focused on mobility recovery and pain reduction.', 'Seance a domicile axee sur la recuperation motrice et la reduction de la douleur.', 'جلسة منزلية لتحسين الحركة وتقليل الالم.', NULL, 65.0, 'fixed', 'TND', 60, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000004', 'physiotherapy', 'post_stroke_session', 'Post Stroke Recovery Session', 'Seance post AVC', 'جلسة ما بعد الجلطة', NULL, 'Structured physiotherapy session for post stroke recovery at home.', 'Seance structuree de kinesitherapie a domicile apres AVC.', 'جلسة علاج طبيعي منظمة في المنزل بعد الجلطة.', NULL, 78.0, 'fixed', 'TND', 75, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000005', 'doctor', 'general_home_consultation', 'General Consultation', 'Consultation generale', 'استشارة طبية عامة', NULL, 'General medical consultation available at home or in clinic.', 'Consultation medicale generale disponible a domicile ou en cabinet.', 'استشارة طبية عامة متاحة في المنزل او في العيادة.', NULL, 85.0, 'fixed', 'TND', 45, 'both', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000006', 'doctor', 'chronic_follow_up', 'Chronic Condition Follow Up', 'Suivi de pathologie chronique', 'متابعة مرض مزمن', NULL, 'Follow up visit for chronic conditions with medication review.', 'Visite de suivi pour pathologies chroniques avec revue du traitement.', 'زيارة متابعة للامراض المزمنة مع مراجعة العلاج.', NULL, 95.0, 'fixed', 'TND', 50, 'both', true, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000007', 'laboratory', 'home_blood_panel', 'Home Blood Panel', 'Bilan sanguin a domicile', 'تحليل دم منزلي', NULL, 'Sample collection for common blood analyses at home or clinic.', 'Prelevement pour analyses sanguines courantes a domicile ou en laboratoire.', 'سحب عينات لتحاليل الدم الشائعة في المنزل او في المخبر.', NULL, 55.0, 'fixed', 'TND', 20, 'both', true, false, false, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000008', 'laboratory', 'home_urine_analysis', 'Urine Analysis Collection', 'Prelevement analyse urinaire', 'جمع تحليل البول', NULL, 'Urine sample collection and logistics for laboratory processing.', 'Collecte des echantillons urinaires et acheminement vers le laboratoire.', 'جمع عينات البول وارسالها الى المختبر.', NULL, 32.0, 'fixed', 'TND', 15, 'both', false, false, false, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000009', 'ambulance', 'non_emergency_transfer', 'Non Emergency Transfer', 'Transport non urgent', 'نقل غير استعجالي', NULL, 'Scheduled medical transport with trained staff and monitoring.', 'Transport medicalise planifie avec equipe formee et suivi du patient.', 'نقل طبي مبرمج مع فريق مدرب ومتابعة للمريض.', NULL, 180.0, 'fixed', 'TND', 60, 'home', false, false, false, '{"serviceTypes":["inter_hospital"],"standardKilometers":15,"pricePerExtraKm":2.5}'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000010', 'ambulance', 'urgent_stretcher_transfer', 'Urgent Stretcher Transfer', 'Transfert urgent avec brancard', 'نقل استعجالي مع نقالة', NULL, 'Urgent transfer with stretcher support and rapid dispatch.', 'Transfert urgent avec prise en charge sur brancard et intervention rapide.', 'نقل استعجالي مع نقالة واستجابة سريعة.', NULL, 260.0, 'fixed', 'TND', 75, 'home', false, true, false, '{"serviceTypes":["emergency"],"standardKilometers":20,"pricePerExtraKm":3.2}'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000011', 'equipment_rental', 'wheelchair_rental', 'Wheelchair Rental', 'Location fauteuil roulant', 'تاجير كرسي متحرك', NULL, 'Delivery and setup of a wheelchair for short or medium term use.', 'Livraison et installation dun fauteuil roulant pour une utilisation courte ou moyenne duree.', 'توصيل وتجهيز كرسي متحرك للاستعمال القصير او المتوسط.', NULL, 18.0, 'fixed', 'TND', NULL, 'home', false, false, false, '{"equipment_type_code":"mobilite","pricing":{"daily":18,"weekly":105,"monthly":360},"deposit_amount":80}'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000012', 'equipment_rental', 'hospital_bed_rental', 'Hospital Bed Rental', 'Location lit medicalise', 'تاجير سرير طبي', NULL, 'Home delivery and setup of an adjustable medical bed.', 'Livraison a domicile et installation dun lit medicalise reglable.', 'توصيل وتركيب سرير طبي قابل للتعديل في المنزل.', NULL, 75.0, 'fixed', 'TND', NULL, 'home', false, false, false, '{"equipment_type_code":"lit_medicalise","pricing":{"daily":75,"weekly":420,"monthly":1350},"deposit_amount":250}'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000013', 'elderly_care', 'daily_living_support', 'Daily Living Support', 'Aide a la vie quotidienne', 'مساعدة في الحياة اليومية', NULL, 'Support with hygiene, meals, mobility, and home routines.', 'Aide pour lhygiene, les repas, la mobilite et les routines quotidiennes.', 'مساعدة في النظافة والوجبات والحركة والروتين اليومي.', NULL, 70.0, 'fixed', 'TND', 180, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000014', 'elderly_care', 'cognitive_stimulation_visit', 'Cognitive Stimulation Visit', 'Visite de stimulation cognitive', 'زيارة تنشيط ذهني', NULL, 'Guided activities that support memory, orientation, and engagement.', 'Activites guidees pour soutenir la memoire, lorientation et lengagement.', 'انشطة موجهة لدعم الذاكرة والتركيز والتفاعل.', NULL, 55.0, 'fixed', 'TND', 60, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000015', 'psychology', 'stress_support_session', 'Stress Support Session', 'Seance de soutien contre le stress', 'جلسة دعم للضغط النفسي', NULL, 'Psychological support session focused on stress and emotional balance.', 'Seance de soutien psychologique axee sur le stress et lequilibre emotionnel.', 'جلسة دعم نفسي تركز على التوتر والتوازن العاطفي.', NULL, 75.0, 'fixed', 'TND', 50, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000016', 'psychology', 'caregiver_counselling', 'Caregiver Counselling', 'Conseil pour aidants', 'استشارة لمرافقي المرضى', NULL, 'Counselling session for family caregivers and daily care planning.', 'Seance de conseil pour les aidants familiaux et lorganisation des soins.', 'جلسة استشارة للمرافقين العائليين وتنظيم الرعاية اليومية.', NULL, 80.0, 'fixed', 'TND', 55, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000017', 'nutrition', 'nutritional_assessment', 'Nutritional Assessment', 'Bilan nutritionnel', 'تقييم غذائي', NULL, 'Assessment of nutritional needs with an actionable care plan.', 'Evaluation des besoins nutritionnels avec plan de prise en charge.', 'تقييم الاحتياجات الغذائية مع خطة عملية.', NULL, 68.0, 'fixed', 'TND', 45, 'home', false, false, true, '{"subcategoryCode":"consultation","dietTypes":["diabetic","low_salt"]}'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000018', 'nutrition', 'diabetic_meal_plan', 'Diabetic Meal Plan', 'Programme repas diabetique', 'برنامج وجبات لمرضى السكري', NULL, 'Personalized meal plan for diabetic and low salt needs.', 'Programme alimentaire personnalise pour besoins diabetiques et pauvres en sel.', 'برنامج غذائي مخصص لمرضى السكري والحمية قليلة الملح.', NULL, 82.0, 'fixed', 'TND', 60, 'home', false, false, true, '{"subcategoryCode":"meal_plan","dietTypes":["diabetic","low_salt"]}'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000019', 'maternity', 'prenatal_home_followup', 'Prenatal Home Follow Up', 'Suivi prenatal a domicile', 'متابعة حمل منزلية', NULL, 'Home follow up for pregnancy comfort, questions, and monitoring.', 'Suivi a domicile pour la grossesse, le confort et la surveillance.', 'متابعة منزلية للحمل من اجل الراحة والمراقبة.', NULL, 88.0, 'fixed', 'TND', 60, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000020', 'maternity', 'lactation_support', 'Lactation Support Visit', 'Visite de soutien a lallaitement', 'زيارة دعم الرضاعة', NULL, 'Home support for breastfeeding positioning and feeding routines.', 'Soutien a domicile pour la mise au sein et les routines dalimentation.', 'دعم منزلي للرضاعة ووضعيات الارضاع وتنظيم التغذية.', NULL, 72.0, 'fixed', 'TND', 45, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000021', 'night_care', 'overnight_nursing_watch', 'Overnight Nursing Watch', 'Garde infirmiere de nuit', 'مرافقة تمريضية ليلية', NULL, 'Continuous overnight nursing support and patient observation.', 'Presence infirmiere continue durant la nuit avec observation du patient.', 'دعم تمريضي مستمر طوال الليل مع مراقبة المريض.', NULL, 210.0, 'fixed', 'TND', 480, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000022', 'night_care', 'night_medication_round', 'Night Medication Round', 'Passage nocturne pour medicaments', 'زيارة ليلية للادوية', NULL, 'Night visit for medication administration and comfort checks.', 'Passage nocturne pour administration des medicaments et controle du confort.', 'زيارة ليلية لاعطاء الادوية ومتابعة راحة المريض.', NULL, 95.0, 'fixed', 'TND', 90, 'home', true, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000023', 'chronic_care', 'diabetes_monitoring_program', 'Diabetes Monitoring Program', 'Programme suivi diabete', 'برنامج متابعة السكري', NULL, 'Routine monitoring for blood sugar, treatment adherence, and prevention.', 'Suivi regulier de la glycemie, de lobservance et de la prevention.', 'متابعة دورية للسكر والالتزام بالعلاج والوقاية.', NULL, 58.0, 'fixed', 'TND', 40, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000024', 'chronic_care', 'hypertension_followup', 'Hypertension Follow Up', 'Suivi hypertension', 'متابعة ارتفاع الضغط', NULL, 'Blood pressure follow up with care recommendations and escalation guidance.', 'Suivi de la tension arterielle avec recommandations et orientation.', 'متابعة ضغط الدم مع توصيات وارشادات للتصعيد عند الحاجة.', NULL, 52.0, 'fixed', 'TND', 35, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000025', 'radiology', 'mobile_xray_visit', 'Mobile X Ray Visit', 'Visite radiographie mobile', 'زيارة اشعة متنقلة', NULL, 'Portable x ray exam at home with secure report delivery.', 'Examen de radiographie portable a domicile avec compte rendu securise.', 'فحص اشعة متنقل في المنزل مع تقرير امن.', NULL, 145.0, 'fixed', 'TND', 35, 'home', true, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000026', 'radiology', 'home_ultrasound_screening', 'Home Ultrasound Screening', 'Echographie a domicile', 'فحص بالموجات فوق الصوتية في المنزل', NULL, 'Home ultrasound screening for follow up and diagnostic review.', 'Echographie a domicile pour suivi clinique et revue diagnostique.', 'فحص بالموجات فوق الصوتية في المنزل للمتابعة والتقييم.', NULL, 165.0, 'fixed', 'TND', 40, 'home', true, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000027', 'gym', 'senior_mobility_coaching', 'Senior Mobility Coaching', 'Coaching mobilite senior', 'تدريب حركة لكبار السن', NULL, 'Low impact coaching session to improve balance and safe movement.', 'Seance de coaching a faible impact pour ameliorer lequilibre et les mouvements.', 'جلسة تدريب خفيفة لتحسين التوازن والحركة الامنة.', NULL, 48.0, 'fixed', 'TND', 50, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000028', 'gym', 'post_rehab_strength', 'Post Rehab Strength Session', 'Seance renforcement post reeducation', 'جلسة تقوية بعد التاهيل', NULL, 'Strength building session after rehabilitation or inactivity.', 'Seance de renforcement apres reeducation ou periode dinactivite.', 'جلسة تقوية بعد التاهيل او فترة خمول.', NULL, 54.0, 'fixed', 'TND', 55, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000029', 'checkup', 'annual_health_screening', 'Annual Health Screening', 'Bilan de sante annuel', 'فحص صحي سنوي', NULL, 'Preventive screening with vitals, questionnaire, and risk review.', 'Bilan preventif avec constantes, questionnaire et revue des risques.', 'فحص وقائي مع قياسات واستبيان ومراجعة عوامل الخطر.', NULL, 92.0, 'fixed', 'TND', 60, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000030', 'checkup', 'vitals_monitoring_check', 'Vitals Monitoring Check', 'Controle des constantes', 'فحص المؤشرات الحيوية', NULL, 'Check of blood pressure, heart rate, oxygen, and temperature.', 'Controle de la tension, du rythme cardiaque, de loxygene et de la temperature.', 'فحص ضغط الدم والنبض والاكسجين ودرجة الحرارة.', NULL, 40.0, 'fixed', 'TND', 25, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000031', 'medical_companion', 'hospital_appointment_companion', 'Hospital Appointment Companion', 'Accompagnement rendez vous hopital', 'مرافقة موعد بالمستشفى', NULL, 'Companion support for hospital visits, check in, and note taking.', 'Accompagnement pour les visites hospitalieres, laccueil et la prise de notes.', 'مرافقة للزيارات الاستشفائية والاستقبال وتدوين الملاحظات.', NULL, 60.0, 'fixed', 'TND', 120, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000032', 'medical_companion', 'discharge_support_visit', 'Discharge Support Visit', 'Visite accompagnement sortie', 'زيارة دعم بعد الخروج', NULL, 'Post discharge support for instructions, logistics, and family coordination.', 'Soutien apres sortie pour les consignes, la logistique et la coordination familiale.', 'دعم بعد الخروج لفهم التعليمات وتنظيم التنسيق العائلي.', NULL, 65.0, 'fixed', 'TND', 90, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000033', 'babysitting', 'infant_daytime_care', 'Infant Daytime Care', 'Garde de jour nourrisson', 'رعاية نهارية للرضيع', NULL, 'Qualified daytime childcare for infants with feeding and comfort routines.', 'Garde de jour qualifiee pour nourrissons avec routines dalimentation et de confort.', 'رعاية نهارية مؤهلة للرضع مع تنظيم التغذية والراحة.', NULL, 42.0, 'fixed', 'TND', 180, 'home', false, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000034', 'babysitting', 'after_school_supervision', 'After School Supervision', 'Surveillance apres ecole', 'مراقبة بعد المدرسة', NULL, 'After school childcare with snacks, homework support, and play.', 'Garde apres lecole avec collation, aide aux devoirs et activites.', 'رعاية بعد المدرسة مع وجبة خفيفة ومساعدة في الواجبات واللعب.', NULL, 35.0, 'fixed', 'TND', 150, 'home', false, false, true, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000035', 'pharmacy', 'medication_review_delivery', 'Medication Review and Delivery', 'Revue traitement et livraison', 'مراجعة العلاج والتوصيل', NULL, 'Medication review with home delivery coordination and usage guidance.', 'Revue du traitement avec coordination de livraison et conseils dutilisation.', 'مراجعة العلاج مع تنسيق التوصيل وارشادات الاستعمال.', NULL, 28.0, 'fixed', 'TND', 20, 'home', true, false, true, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000036', 'pharmacy', 'prescription_refill_dropoff', 'Prescription Refill Dropoff', 'Depot renouvellement ordonnance', 'توصيل تجديد الوصفة', NULL, 'Home dropoff of refill medications after prescription verification.', 'Depot a domicile des renouvellements apres verification de lordonnance.', 'توصيل ادوية التجديد الى المنزل بعد التحقق من الوصفة.', NULL, 18.0, 'fixed', 'TND', 15, 'home', true, false, false, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000037', 'funeral', 'bereavement_support_coordination', 'Bereavement Support Coordination', 'Coordination soutien funeraire', 'تنسيق الدعم الجنائزي', NULL, 'Coordination of family support, paperwork, and ceremony planning.', 'Coordination du soutien familial, des demarches et de la ceremonie.', 'تنسيق دعم العائلة والاجراءات والتنظيم الجنائزي.', NULL, 350.0, 'fixed', 'TND', 120, 'home', false, true, false, NULL, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000038', 'funeral', 'funeral_transfer_arrangement', 'Funeral Transfer Arrangement', 'Organisation transport funeraire', 'تنظيم نقل جنائزي', NULL, 'Arrangement of dignified transport and transfer logistics.', 'Organisation du transport digne et de la logistique de transfert.', 'تنظيم نقل لائق ولوجستيات التحويل.', NULL, 420.0, 'fixed', 'TND', 150, 'home', false, true, false, NULL, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

INSERT INTO provider_service_presets (id, provider_category, code, name_en, name_fr, name_ar, name_de, description_en, description_fr, description_ar, description_de, price, price_type, currency, duration_minutes, service_location, requires_prescription, is_urgent, requires_medical_history, type_config, is_active, display_order, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0001-000000000039', 'veterinary', 'pet_wellness_check', 'Pet Wellness Check', 'Bilan sante animal', 'فحص صحة الحيوان', NULL, 'Home wellness visit for routine evaluation and care advice.', 'Visite a domicile pour evaluation de routine et conseils de soin.', 'زيارة منزلية للتقييم الدوري وتقديم نصائح الرعاية.', NULL, 62.0, 'fixed', 'TND', 35, 'home', false, false, true, '{"animalTypes":["dog","cat"]}'::jsonb, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('40000000-0000-0000-0001-000000000040', 'veterinary', 'home_vaccination_visit', 'Home Vaccination Visit', 'Visite vaccination a domicile', 'زيارة تلقيح منزلية', NULL, 'Vaccination visit for household pets with record update.', 'Visite de vaccination pour animaux de compagnie avec mise a jour du carnet.', 'زيارة تلقيح للحيوانات المنزلية مع تحديث السجل.', NULL, 58.0, 'fixed', 'TND', 30, 'home', false, false, true, '{"animalTypes":["dog","cat","horse"]}'::jsonb, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (provider_category, code) DO NOTHING;

COMMIT;

-- ============================================================
-- SEED COMPLETE (OVERHAULED)
-- 55 users (3 admin + 17 patients + 35 providers)
-- 17 patients, 35 providers, ~85 services, ~27 addons
-- 130 bookings, ~60 reviews
-- canonical finance seeds: 9 payments, 9 payment_attempts, 6 provider_wallet_top_ups
-- 8 ledger_transactions, 15 ledger_entries, 8 wallets
-- 20 service_categories_config, 6 equipment_categories_config
-- canonical booking_line_items for seeded bookings, 5 pharmacy_orders, 10 documents
-- ~282 diversified provider_schedules
-- 56+ tables populated
-- ============================================================
