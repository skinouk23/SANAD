
-- =====================================================
-- CAREATHOME - SEED DATA FOR DEVELOPMENT/TESTING
-- Comprehensive dummy data for all tables
-- Version: 2.0
-- Date: January 2025
-- 
-- USAGE: Run after complete_schema.sql
-- psql -d careathome -f seeddata.sql
-- =====================================================

-- =====================================================
-- SECTION 1: USERS & AUTHENTICATION
-- =====================================================

-- Admin Users
INSERT INTO users (id, email, email_verified, password_hash, role, is_active, phone, preferred_language, created_at) VALUES
('a0000001-0000-0000-0000-000000000001', 'admin@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'super_admin', TRUE, '+216 70 000 001', 'fr', NOW() - INTERVAL '365 days'),
('a0000001-0000-0000-0000-000000000002', 'support@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'admin', TRUE, '+216 70 000 002', 'fr', NOW() - INTERVAL '300 days'),
('a0000001-0000-0000-0000-000000000003', 'moderator@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'admin', TRUE, '+216 70 000 003', 'ar', NOW() - INTERVAL '200 days');

-- Patient Users
INSERT INTO users (id, email, email_verified, password_hash, role, is_active, phone, preferred_language, created_at) VALUES
('p0000001-0000-0000-0000-000000000001', 'ahmed.benali@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 20 123 456', 'fr', NOW() - INTERVAL '180 days'),
('p0000001-0000-0000-0000-000000000002', 'fatma.trabelsi@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 21 234 567', 'ar', NOW() - INTERVAL '150 days'),
('p0000001-0000-0000-0000-000000000003', 'mohamed.karray@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 22 345 678', 'fr', NOW() - INTERVAL '120 days'),
('p0000001-0000-0000-0000-000000000004', 'sarah.mansour@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 23 456 789', 'fr', NOW() - INTERVAL '90 days'),
('p0000001-0000-0000-0000-000000000005', 'youssef.hamdi@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 24 567 890', 'ar', NOW() - INTERVAL '60 days'),
('p0000001-0000-0000-0000-000000000006', 'leila.bouazizi@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 25 678 901', 'fr', NOW() - INTERVAL '45 days'),
('p0000001-0000-0000-0000-000000000007', 'karim.jebali@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 26 789 012', 'fr', NOW() - INTERVAL '30 days'),
('p0000001-0000-0000-0000-000000000008', 'nadia.cherif@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 27 890 123', 'ar', NOW() - INTERVAL '15 days'),
('p0000001-0000-0000-0000-000000000009', 'omar.sassi@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 28 901 234', 'fr', NOW() - INTERVAL '7 days'),
('p0000001-0000-0000-0000-000000000010', 'amira.gharbi@gmail.com', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'patient', TRUE, '+216 29 012 345', 'fr', NOW() - INTERVAL '3 days');

-- Provider Users
INSERT INTO users (id, email, email_verified, password_hash, role, is_active, phone, preferred_language, created_at) VALUES
-- Nursing
('pr000001-0000-0000-0000-000000000001', 'infirmiere.sousse@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 111 001', 'fr', NOW() - INTERVAL '200 days'),
('pr000001-0000-0000-0000-000000000002', 'infirmier.tunis@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 111 002', 'fr', NOW() - INTERVAL '180 days'),
-- Physiotherapy
('pr000001-0000-0000-0000-000000000003', 'kine.ariana@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 222 001', 'fr', NOW() - INTERVAL '160 days'),
-- Laboratory
('pr000001-0000-0000-0000-000000000004', 'labo.pasteur@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 333 001', 'fr', NOW() - INTERVAL '150 days'),
('pr000001-0000-0000-0000-000000000005', 'labo.central@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 333 002', 'fr', NOW() - INTERVAL '140 days'),
-- Radiology
('pr000001-0000-0000-0000-000000000006', 'radio.lac@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 444 001', 'fr', NOW() - INTERVAL '130 days'),
-- Equipment Rental
('pr000001-0000-0000-0000-000000000007', 'equipmed.tunis@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 555 001', 'fr', NOW() - INTERVAL '120 days'),
-- Ambulance
('pr000001-0000-0000-0000-000000000008', 'ambulance.express@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 666 001', 'fr', NOW() - INTERVAL '110 days'),
-- Nutrition
('pr000001-0000-0000-0000-000000000009', 'nutri.wellness@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 777 001', 'fr', NOW() - INTERVAL '100 days'),
-- Gym
('pr000001-0000-0000-0000-000000000010', 'gym.fitness@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 888 001', 'fr', NOW() - INTERVAL '90 days'),
-- Pharmacy
('pr000001-0000-0000-0000-000000000011', 'pharmacie.centrale@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 50 999 001', 'fr', NOW() - INTERVAL '80 days'),
-- Elderly Care
('pr000001-0000-0000-0000-000000000012', 'aide.seniors@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 51 111 001', 'ar', NOW() - INTERVAL '70 days'),
-- Doctor
('pr000001-0000-0000-0000-000000000013', 'dr.benali@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 51 222 001', 'fr', NOW() - INTERVAL '60 days'),
-- Night Care
('pr000001-0000-0000-0000-000000000014', 'garde.nuit@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 51 333 001', 'fr', NOW() - INTERVAL '50 days'),
-- Psychology
('pr000001-0000-0000-0000-000000000015', 'psy.support@sanad.tn', TRUE, '$2b$10$rQZ9QjPgXHJvJvJvJvJvJeOZQjPgXHJvJvJvJvJvJeOZQjPgXHJv', 'provider', TRUE, '+216 51 444 001', 'fr', NOW() - INTERVAL '40 days');

-- =====================================================
-- SECTION 2: PATIENT PROFILES
-- =====================================================

INSERT INTO patients (id, user_id, first_name, last_name, date_of_birth, gender, address_line1, city, postal_code, country_code, latitude, longitude, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, blood_type, profile_picture_url, total_bookings, completed_bookings, total_spent, profile_completed, created_at) VALUES
('pt000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'Ahmed', 'Ben Ali', '1985-03-15', 'male', '15 Rue de la Liberté', 'Tunis', '1000', 'TN', 36.8065, 10.1815, 'Fatma Ben Ali', '+216 20 111 222', 'spouse', 'A+', 'https://randomuser.me/api/portraits/men/1.jpg', 12, 10, 850.00, TRUE, NOW() - INTERVAL '180 days'),
('pt000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000002', 'Fatma', 'Trabelsi', '1990-07-22', 'female', '28 Avenue Habib Bourguiba', 'Sousse', '4000', 'TN', 35.8288, 10.6405, 'Mohamed Trabelsi', '+216 21 222 333', 'brother', 'B+', 'https://randomuser.me/api/portraits/women/2.jpg', 8, 7, 520.00, TRUE, NOW() - INTERVAL '150 days'),
('pt000001-0000-0000-0000-000000000003', 'p0000001-0000-0000-0000-000000000003', 'Mohamed', 'Karray', '1978-11-08', 'male', '42 Rue Ibn Khaldoun', 'Sfax', '3000', 'TN', 34.7406, 10.7603, 'Leila Karray', '+216 22 333 444', 'spouse', 'O+', 'https://randomuser.me/api/portraits/men/3.jpg', 15, 14, 1200.00, TRUE, NOW() - INTERVAL '120 days'),
('pt000001-0000-0000-0000-000000000004', 'p0000001-0000-0000-0000-000000000004', 'Sarah', 'Mansour', '1995-02-14', 'female', '7 Rue de Carthage', 'La Marsa', '2078', 'TN', 36.8783, 10.3247, 'Karim Mansour', '+216 23 444 555', 'father', 'AB+', 'https://randomuser.me/api/portraits/women/4.jpg', 5, 5, 380.00, TRUE, NOW() - INTERVAL '90 days'),
('pt000001-0000-0000-0000-000000000005', 'p0000001-0000-0000-0000-000000000005', 'Youssef', 'Hamdi', '1982-09-30', 'male', '19 Avenue de France', 'Ariana', '2080', 'TN', 36.8625, 10.1956, 'Nadia Hamdi', '+216 24 555 666', 'spouse', 'A-', 'https://randomuser.me/api/portraits/men/5.jpg', 20, 18, 1650.00, TRUE, NOW() - INTERVAL '60 days'),
('pt000001-0000-0000-0000-000000000006', 'p0000001-0000-0000-0000-000000000006', 'Leila', 'Bouazizi', '1988-05-19', 'female', '33 Rue de Palestine', 'Ben Arous', '2013', 'TN', 36.7533, 10.2311, 'Omar Bouazizi', '+216 25 666 777', 'husband', 'B-', 'https://randomuser.me/api/portraits/women/6.jpg', 3, 3, 180.00, TRUE, NOW() - INTERVAL '45 days'),
('pt000001-0000-0000-0000-000000000007', 'p0000001-0000-0000-0000-000000000007', 'Karim', 'Jebali', '1975-12-25', 'male', '56 Avenue Mohamed V', 'Monastir', '5000', 'TN', 35.7643, 10.8113, 'Amira Jebali', '+216 26 777 888', 'daughter', 'O-', 'https://randomuser.me/api/portraits/men/7.jpg', 25, 23, 2100.00, TRUE, NOW() - INTERVAL '30 days'),
('pt000001-0000-0000-0000-000000000008', 'p0000001-0000-0000-0000-000000000008', 'Nadia', 'Cherif', '1992-08-11', 'female', '11 Rue de Bizerte', 'Bizerte', '7000', 'TN', 37.2744, 9.8739, 'Sami Cherif', '+216 27 888 999', 'brother', 'AB-', 'https://randomuser.me/api/portraits/women/8.jpg', 6, 5, 420.00, TRUE, NOW() - INTERVAL '15 days'),
('pt000001-0000-0000-0000-000000000009', 'p0000001-0000-0000-0000-000000000009', 'Omar', 'Sassi', '1998-04-03', 'male', '24 Rue de Kairouan', 'Kairouan', '3100', 'TN', 35.6781, 10.0963, 'Fatma Sassi', '+216 28 999 000', 'mother', 'A+', 'https://randomuser.me/api/portraits/men/9.jpg', 2, 2, 95.00, TRUE, NOW() - INTERVAL '7 days'),
('pt000001-0000-0000-0000-000000000010', 'p0000001-0000-0000-0000-000000000010', 'Amira', 'Gharbi', '2000-01-28', 'female', '8 Avenue de la République', 'Nabeul', '8000', 'TN', 36.4513, 10.7357, 'Hedi Gharbi', '+216 29 000 111', 'father', 'B+', 'https://randomuser.me/api/portraits/women/10.jpg', 1, 1, 45.00, TRUE, NOW() - INTERVAL '3 days');

-- =====================================================
-- SECTION 3: PROVIDER PROFILES
-- =====================================================

INSERT INTO providers (id, user_id, service_category, is_individual, business_name, first_name, last_name, license_number, specializations, years_of_experience, bio, address_line1, city, postal_code, country_code, latitude, longitude, service_radius_km, serves_at_home, serves_at_clinic, profile_picture_url, rating_average, rating_count, total_bookings, completed_bookings, total_revenue, is_verified, is_approved, subscription_tier, commission_rate, instant_booking_enabled, created_at) VALUES
-- Nursing Providers
('pv000001-0000-0000-0000-000000000001', 'pr000001-0000-0000-0000-000000000001', 'nursing', TRUE, 'Soins Infirmiers Sousse', 'Amina', 'Belhadj', 'INF-2015-001', ARRAY['injections', 'pansements', 'perfusions'], 8, 'Infirmière diplômée avec 8 ans d''expérience en soins à domicile. Spécialisée dans les soins post-opératoires et les perfusions.', '45 Rue de la Santé', 'Sousse', '4000', 'TN', 35.8288, 10.6405, 25, TRUE, FALSE, 'https://randomuser.me/api/portraits/women/11.jpg', 4.85, 127, 156, 148, 12500.00, TRUE, TRUE, 'premium', 12.00, TRUE, NOW() - INTERVAL '200 days'),
('pv000001-0000-0000-0000-000000000002', 'pr000001-0000-0000-0000-000000000002', 'nursing', TRUE, 'Infirmier Mobile Tunis', 'Mehdi', 'Chaabane', 'INF-2018-042', ARRAY['injections', 'prélèvements', 'soins plaies'], 5, 'Infirmier certifié, disponible 7j/7 pour tous types de soins infirmiers à domicile dans le Grand Tunis.', '12 Avenue de la Liberté', 'Tunis', '1000', 'TN', 36.8065, 10.1815, 20, TRUE, FALSE, 'https://randomuser.me/api/portraits/men/12.jpg', 4.72, 89, 112, 105, 8900.00, TRUE, TRUE, 'basic', 15.00, TRUE, NOW() - INTERVAL '180 days'),

-- Physiotherapy
('pv000001-0000-0000-0000-000000000003', 'pr000001-0000-0000-0000-000000000003', 'physiotherapy', TRUE, 'Kiné Plus Ariana', 'Sonia', 'Mejri', 'KINE-2012-015', ARRAY['rééducation orthopédique', 'kinésithérapie respiratoire', 'massage thérapeutique'], 11, 'Kinésithérapeute expérimentée spécialisée dans la rééducation post-traumatique et la kinésithérapie respiratoire.', '78 Rue des Sports', 'Ariana', '2080', 'TN', 36.8625, 10.1956, 15, TRUE, TRUE, 'https://randomuser.me/api/portraits/women/13.jpg', 4.91, 203, 245, 238, 24500.00, TRUE, TRUE, 'elite', 10.00, TRUE, NOW() - INTERVAL '160 days'),

-- Laboratory
('pv000001-0000-0000-0000-000000000004', 'pr000001-0000-0000-0000-000000000004', 'laboratory', FALSE, 'Laboratoire Pasteur Tunis', NULL, NULL, 'LAB-2008-003', ARRAY['analyses sanguines', 'analyses urinaires', 'biochimie', 'hématologie'], 15, 'Laboratoire d''analyses médicales agréé, équipé des dernières technologies. Prélèvements à domicile disponibles.', '156 Avenue Habib Bourguiba', 'Tunis', '1000', 'TN', 36.7992, 10.1802, 30, TRUE, TRUE, 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400', 4.78, 456, 892, 885, 89200.00, TRUE, TRUE, 'enterprise', 8.00, TRUE, NOW() - INTERVAL '150 days'),
('pv000001-0000-0000-0000-000000000005', 'pr000001-0000-0000-0000-000000000005', 'laboratory', FALSE, 'Labo Central Sfax', NULL, NULL, 'LAB-2010-018', ARRAY['analyses sanguines', 'sérologie', 'microbiologie'], 13, 'Laboratoire moderne offrant une large gamme d''analyses avec résultats rapides.', '89 Rue de la République', 'Sfax', '3000', 'TN', 34.7406, 10.7603, 25, TRUE, TRUE, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400', 4.65, 312, 567, 558, 56700.00, TRUE, TRUE, 'premium', 10.00, TRUE, NOW() - INTERVAL '140 days'),

-- Radiology
('pv000001-0000-0000-0000-000000000006', 'pr000001-0000-0000-0000-000000000006', 'radiology', FALSE, 'Centre Radio Lac', NULL, NULL, 'RAD-2015-007', ARRAY['radiographie', 'échographie', 'scanner', 'IRM'], 8, 'Centre d''imagerie médicale équipé des technologies les plus récentes. Rendez-vous rapides et résultats sous 24h.', '34 Rue du Lac', 'Les Berges du Lac', '1053', 'TN', 36.8311, 10.2331, 20, FALSE, TRUE, 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400', 4.82, 278, 423, 418, 84600.00, TRUE, TRUE, 'elite', 10.00, TRUE, NOW() - INTERVAL '130 days'),

-- Equipment Rental
('pv000001-0000-0000-0000-000000000007', 'pr000001-0000-0000-0000-000000000007', 'equipment_rental', FALSE, 'EquipMed Location', NULL, NULL, 'EQP-2017-012', ARRAY['fauteuils roulants', 'lits médicalisés', 'concentrateurs oxygène', 'déambulateurs'], 6, 'Location de matériel médical de qualité. Livraison et installation à domicile. Maintenance incluse.', '67 Zone Industrielle', 'Ben Arous', '2013', 'TN', 36.7533, 10.2311, 40, TRUE, TRUE, 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400', 4.68, 156, 234, 228, 35100.00, TRUE, TRUE, 'premium', 12.00, TRUE, NOW() - INTERVAL '120 days'),

-- Ambulance
('pv000001-0000-0000-0000-000000000008', 'pr000001-0000-0000-0000-000000000008', 'ambulance', FALSE, 'Ambulance Express 24/7', NULL, NULL, 'AMB-2014-005', ARRAY['transport sanitaire', 'urgences', 'rapatriement', 'inter-hôpital'], 9, 'Service d''ambulance disponible 24h/24, 7j/7. Véhicules équipés et personnel qualifié.', '23 Avenue de l''Hôpital', 'Tunis', '1006', 'TN', 36.8089, 10.1657, 50, TRUE, FALSE, 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400', 4.75, 89, 345, 340, 69000.00, TRUE, TRUE, 'elite', 10.00, TRUE, NOW() - INTERVAL '110 days'),

-- Nutrition
('pv000001-0000-0000-0000-000000000009', 'pr000001-0000-0000-0000-000000000009', 'nutrition', TRUE, 'Nutri Wellness', 'Ines', 'Belhassen', 'NUT-2016-023', ARRAY['nutrition sportive', 'perte de poids', 'nutrition thérapeutique', 'diabète'], 7, 'Nutritionniste diplômée, spécialisée dans l''accompagnement personnalisé pour atteindre vos objectifs santé.', '45 Rue de la Santé', 'La Marsa', '2078', 'TN', 36.8783, 10.3247, 20, TRUE, TRUE, 'https://randomuser.me/api/portraits/women/14.jpg', 4.88, 134, 189, 185, 18900.00, TRUE, TRUE, 'premium', 12.00, TRUE, NOW() - INTERVAL '100 days'),

-- Gym
('pv000001-0000-0000-0000-000000000010', 'pr000001-0000-0000-0000-000000000010', 'gym', FALSE, 'Fitness Plus Tunis', NULL, NULL, 'GYM-2018-008', ARRAY['musculation', 'cardio', 'cours collectifs', 'coaching personnel'], 5, 'Salle de sport moderne avec équipements haut de gamme. Coachs certifiés disponibles.', '112 Avenue de la Liberté', 'Tunis', '1002', 'TN', 36.8002, 10.1867, 10, FALSE, TRUE, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 4.55, 78, 156, 145, 23400.00, TRUE, TRUE, 'basic', 15.00, TRUE, NOW() - INTERVAL '90 days'),

-- Pharmacy
('pv000001-0000-0000-0000-000000000011', 'pr000001-0000-0000-0000-000000000011', 'pharmacy', FALSE, 'Pharmacie Centrale Tunis', NULL, NULL, 'PHA-2005-001', ARRAY['médicaments', 'parapharmacie', 'livraison', 'conseil'], 18, 'Pharmacie de garde avec service de livraison à domicile. Large stock de médicaments et parapharmacie.', '1 Place de l''Indépendance', 'Tunis', '1000', 'TN', 36.7989, 10.1658, 15, TRUE, TRUE, 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400', 4.70, 234, 567, 560, 28350.00, TRUE, TRUE, 'premium', 8.00, TRUE, NOW() - INTERVAL '80 days'),

-- Elderly Care
('pv000001-0000-0000-0000-000000000012', 'pr000001-0000-0000-0000-000000000012', 'elderly_care', TRUE, 'Aide aux Seniors', 'Habiba', 'Mrad', 'AID-2013-019', ARRAY['aide toilette', 'compagnie', 'repas', 'courses'], 10, 'Aide-soignante expérimentée, dévouée au bien-être des personnes âgées. Patience et bienveillance garanties.', '34 Rue des Oliviers', 'Manouba', '2010', 'TN', 36.8081, 10.0972, 20, TRUE, FALSE, 'https://randomuser.me/api/portraits/women/15.jpg', 4.92, 167, 234, 230, 18720.00, TRUE, TRUE, 'basic', 12.00, TRUE, NOW() - INTERVAL '70 days'),

-- Doctor
('pv000001-0000-0000-0000-000000000013', 'pr000001-0000-0000-0000-000000000013', 'doctor', TRUE, 'Dr. Riadh Ben Ali', 'Riadh', 'Ben Ali', 'MED-2008-156', ARRAY['médecine générale', 'pédiatrie', 'urgences'], 15, 'Médecin généraliste expérimenté. Consultations à domicile pour toute la famille.', '56 Avenue Farhat Hached', 'Tunis', '1001', 'TN', 36.8012, 10.1789, 25, TRUE, TRUE, 'https://randomuser.me/api/portraits/men/16.jpg', 4.95, 312, 456, 450, 68400.00, TRUE, TRUE, 'elite', 10.00, TRUE, NOW() - INTERVAL '60 days'),

-- Night Care
('pv000001-0000-0000-0000-000000000014', 'pr000001-0000-0000-0000-000000000014', 'night_care', TRUE, 'Garde de Nuit Pro', 'Salma', 'Riahi', 'GDN-2015-034', ARRAY['surveillance nocturne', 'soins', 'accompagnement'], 8, 'Infirmière spécialisée dans la garde de nuit. Surveillance attentive et soins de qualité.', '89 Rue de Tunis', 'Ariana', '2080', 'TN', 36.8625, 10.1956, 20, TRUE, FALSE, 'https://randomuser.me/api/portraits/women/17.jpg', 4.80, 89, 123, 120, 14760.00, TRUE, TRUE, 'premium', 12.00, FALSE, NOW() - INTERVAL '50 days'),

-- Psychology
('pv000001-0000-0000-0000-000000000015', 'pr000001-0000-0000-0000-000000000015', 'psychology', TRUE, 'Cabinet Psy Support', 'Anis', 'Gharbi', 'PSY-2012-067', ARRAY['thérapie cognitive', 'gestion stress', 'dépression', 'anxiété'], 11, 'Psychologue clinicien, spécialisé dans la thérapie cognitive-comportementale. Consultations en cabinet et en ligne.', '23 Rue de la Paix', 'Tunis', '1002', 'TN', 36.8034, 10.1823, 30, TRUE, TRUE, 'https://randomuser.me/api/portraits/men/18.jpg', 4.87, 156, 234, 228, 34200.00, TRUE, TRUE, 'premium', 12.00, TRUE, NOW() - INTERVAL '40 days');

-- =====================================================
-- SECTION 4: SERVICES
-- =====================================================

-- Nursing Services
INSERT INTO services (id, provider_id, category, name, description, price, price_type, duration_minutes, service_location, is_active, created_at) VALUES
('sv000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 'nursing', 'Injection intramusculaire', 'Administration d''injections IM à domicile par infirmière diplômée', 35.00, 'fixed', 20, 'home', TRUE, NOW() - INTERVAL '200 days'),
('sv000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000001', 'nursing', 'Pansement complexe', 'Réfection de pansements post-opératoires ou plaies chroniques', 60.00, 'fixed', 45, 'home', TRUE, NOW() - INTERVAL '200 days'),
('sv000001-0000-0000-0000-000000000003', 'pv000001-0000-0000-0000-000000000001', 'nursing', 'Perfusion à domicile', 'Pose et surveillance de perfusion intraveineuse', 80.00, 'fixed', 60, 'home', TRUE, NOW() - INTERVAL '200 days'),
('sv000001-0000-0000-0000-000000000004', 'pv000001-0000-0000-0000-000000000002', 'nursing', 'Prélèvement sanguin', 'Prise de sang à domicile avec acheminement au laboratoire', 40.00, 'fixed', 15, 'home', TRUE, NOW() - INTERVAL '180 days'),
('sv000001-0000-0000-0000-000000000005', 'pv000001-0000-0000-0000-000000000002', 'nursing', 'Soins de plaie', 'Nettoyage et traitement de plaies diverses', 45.00, 'fixed', 30, 'home', TRUE, NOW() - INTERVAL '180 days'),

-- Physiotherapy Services
('sv000001-0000-0000-0000-000000000006', 'pv000001-0000-0000-0000-000000000003', 'physiotherapy', 'Rééducation orthopédique', 'Rééducation post-fracture, entorse ou prothèse', 50.00, 'fixed', 45, 'both', TRUE, NOW() - INTERVAL '160 days'),
('sv000001-0000-0000-0000-000000000007', 'pv000001-0000-0000-0000-000000000003', 'physiotherapy', 'Kinésithérapie respiratoire', 'Désencombrement bronchique et rééducation respiratoire', 45.00, 'fixed', 30, 'home', TRUE, NOW() - INTERVAL '160 days'),
('sv000001-0000-0000-0000-000000000008', 'pv000001-0000-0000-0000-000000000003', 'physiotherapy', 'Massage thérapeutique', 'Massage décontracturant et drainage lymphatique', 55.00, 'fixed', 45, 'both', TRUE, NOW() - INTERVAL '160 days'),

-- Laboratory Services
('sv000001-0000-0000-0000-000000000009', 'pv000001-0000-0000-0000-000000000004', 'laboratory', 'Bilan sanguin complet', 'NFS, VS, glycémie, créatinine, ionogramme', 85.00, 'fixed', 15, 'both', TRUE, NOW() - INTERVAL '150 days'),
('sv000001-0000-0000-0000-000000000010', 'pv000001-0000-0000-0000-000000000004', 'laboratory', 'Bilan lipidique', 'Cholestérol total, HDL, LDL, triglycérides', 45.00, 'fixed', 10, 'both', TRUE, NOW() - INTERVAL '150 days'),
('sv000001-0000-0000-0000-000000000011', 'pv000001-0000-0000-0000-000000000004', 'laboratory', 'Bilan thyroïdien', 'TSH, T3, T4', 65.00, 'fixed', 10, 'both', TRUE, NOW() - INTERVAL '150 days'),
('sv000001-0000-0000-0000-000000000012', 'pv000001-0000-0000-0000-000000000005', 'laboratory', 'Test COVID-19 PCR', 'Dépistage COVID-19 par PCR avec résultat sous 24h', 120.00, 'fixed', 15, 'both', TRUE, NOW() - INTERVAL '140 days'),

-- Radiology Services
('sv000001-0000-0000-0000-000000000013', 'pv000001-0000-0000-0000-000000000006', 'radiology', 'Radiographie thoracique', 'Radio des poumons face et profil', 45.00, 'fixed', 15, 'clinic', TRUE, NOW() - INTERVAL '130 days'),
('sv000001-0000-0000-0000-000000000014', 'pv000001-0000-0000-0000-000000000006', 'radiology', 'Échographie abdominale', 'Foie, vésicule, pancréas, rate, reins', 80.00, 'fixed', 30, 'clinic', TRUE, NOW() - INTERVAL '130 days'),
('sv000001-0000-0000-0000-000000000015', 'pv000001-0000-0000-0000-000000000006', 'radiology', 'Scanner cérébral', 'Scanner de la tête avec ou sans injection', 250.00, 'fixed', 30, 'clinic', TRUE, NOW() - INTERVAL '130 days'),
('sv000001-0000-0000-0000-000000000016', 'pv000001-0000-0000-0000-000000000006', 'radiology', 'IRM lombaire', 'IRM de la colonne lombaire', 350.00, 'fixed', 45, 'clinic', TRUE, NOW() - INTERVAL '130 days'),

-- Equipment Rental Services
('sv000001-0000-0000-0000-000000000017', 'pv000001-0000-0000-0000-000000000007', 'equipment_rental', 'Fauteuil roulant manuel', 'Location de fauteuil roulant pliable léger', 15.00, 'daily', NULL, 'home', TRUE, NOW() - INTERVAL '120 days'),
('sv000001-0000-0000-0000-000000000018', 'pv000001-0000-0000-0000-000000000007', 'equipment_rental', 'Lit médicalisé électrique', 'Lit 3 fonctions avec barrières et matelas', 35.00, 'daily', NULL, 'home', TRUE, NOW() - INTERVAL '120 days'),
('sv000001-0000-0000-0000-000000000019', 'pv000001-0000-0000-0000-000000000007', 'equipment_rental', 'Concentrateur d''oxygène', 'Concentrateur portable 5L/min', 45.00, 'daily', NULL, 'home', TRUE, NOW() - INTERVAL '120 days'),

-- Ambulance Services
('sv000001-0000-0000-0000-000000000020', 'pv000001-0000-0000-0000-000000000008', 'ambulance', 'Transport sanitaire simple', 'Transport en VSL pour rendez-vous médical', 50.00, 'fixed', 60, 'home', TRUE, NOW() - INTERVAL '110 days'),
('sv000001-0000-0000-0000-000000000021', 'pv000001-0000-0000-0000-000000000008', 'ambulance', 'Ambulance équipée', 'Transport médicalisé avec monitoring', 120.00, 'fixed', 60, 'home', TRUE, NOW() - INTERVAL '110 days'),
('sv000001-0000-0000-0000-000000000022', 'pv000001-0000-0000-0000-000000000008', 'ambulance', 'Urgence médicale', 'Intervention d''urgence avec équipe médicale', 200.00, 'fixed', 30, 'home', TRUE, NOW() - INTERVAL '110 days'),

-- Nutrition Services
('sv000001-0000-0000-0000-000000000023', 'pv000001-0000-0000-0000-000000000009', 'nutrition', 'Bilan nutritionnel complet', 'Évaluation complète + plan alimentaire personnalisé', 120.00, 'fixed', 90, 'both', TRUE, NOW() - INTERVAL '100 days'),
('sv000001-0000-0000-0000-000000000024', 'pv000001-0000-0000-0000-000000000009', 'nutrition', 'Consultation de suivi', 'Suivi et ajustement du programme nutritionnel', 60.00, 'fixed', 30, 'both', TRUE, NOW() - INTERVAL '100 days'),

-- Gym Services
('sv000001-0000-0000-0000-000000000025', 'pv000001-0000-0000-0000-000000000010', 'gym', 'Abonnement mensuel', 'Accès illimité à la salle + cours collectifs', 150.00, 'monthly', NULL, 'clinic', TRUE, NOW() - INTERVAL '90 days'),
('sv000001-0000-0000-0000-000000000026', 'pv000001-0000-0000-0000-000000000010', 'gym', 'Séance coaching personnel', 'Séance individuelle avec coach certifié', 80.00, 'fixed', 60, 'clinic', TRUE, NOW() - INTERVAL '90 days'),

-- Pharmacy Services
('sv000001-0000-0000-0000-000000000027', 'pv000001-0000-0000-0000-000000000011', 'pharmacy', 'Livraison médicaments', 'Livraison de médicaments à domicile', 5.00, 'fixed', 30, 'home', TRUE, NOW() - INTERVAL '80 days'),
('sv000001-0000-0000-0000-000000000028', 'pv000001-0000-0000-0000-000000000011', 'pharmacy', 'Conseil pharmaceutique', 'Consultation et conseil avec pharmacien', 0.00, 'fixed', 15, 'both', TRUE, NOW() - INTERVAL '80 days'),

-- Elderly Care Services
('sv000001-0000-0000-0000-000000000029', 'pv000001-0000-0000-0000-000000000012', 'elderly_care', 'Aide à la toilette', 'Assistance pour la toilette quotidienne', 30.00, 'fixed', 45, 'home', TRUE, NOW() - INTERVAL '70 days'),
('sv000001-0000-0000-0000-000000000030', 'pv000001-0000-0000-0000-000000000012', 'elderly_care', 'Compagnie et stimulation', 'Présence, discussion, activités de stimulation', 25.00, 'hourly', 120, 'home', TRUE, NOW() - INTERVAL '70 days'),
('sv000001-0000-0000-0000-000000000031', 'pv000001-0000-0000-0000-000000000012', 'elderly_care', 'Garde de jour', 'Présence et surveillance en journée complète', 80.00, 'fixed', 480, 'home', TRUE, NOW() - INTERVAL '70 days'),

-- Doctor Services
('sv000001-0000-0000-0000-000000000032', 'pv000001-0000-0000-0000-000000000013', 'doctor', 'Consultation générale', 'Consultation médicale à domicile', 80.00, 'fixed', 30, 'home', TRUE, NOW() - INTERVAL '60 days'),
('sv000001-0000-0000-0000-000000000033', 'pv000001-0000-0000-0000-000000000013', 'doctor', 'Visite pédiatrique', 'Consultation pédiatrique à domicile', 90.00, 'fixed', 30, 'home', TRUE, NOW() - INTERVAL '60 days'),

-- Night Care Services
('sv000001-0000-0000-0000-000000000034', 'pv000001-0000-0000-0000-000000000014', 'night_care', 'Garde de nuit', 'Surveillance nocturne avec soins si nécessaire', 120.00, 'fixed', 480, 'home', TRUE, NOW() - INTERVAL '50 days'),

-- Psychology Services
('sv000001-0000-0000-0000-000000000035', 'pv000001-0000-0000-0000-000000000015', 'psychology', 'Consultation individuelle', 'Séance de psychothérapie individuelle', 80.00, 'fixed', 60, 'both', TRUE, NOW() - INTERVAL '40 days'),
('sv000001-0000-0000-0000-000000000036', 'pv000001-0000-0000-0000-000000000015', 'psychology', 'Thérapie de couple', 'Séance de thérapie pour couples', 120.00, 'fixed', 90, 'both', TRUE, NOW() - INTERVAL '40 days');

-- =====================================================
-- SECTION 5: PROVIDER SCHEDULES
-- =====================================================

-- Provider 1 (Nursing) - Monday to Saturday
INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, is_available) VALUES
('pv000001-0000-0000-0000-000000000001', 1, '08:00', '12:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 1, '14:00', '18:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 2, '08:00', '12:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 2, '14:00', '18:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 3, '08:00', '12:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 3, '14:00', '18:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 4, '08:00', '12:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 4, '14:00', '18:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 5, '08:00', '12:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 5, '14:00', '18:00', TRUE),
('pv000001-0000-0000-0000-000000000001', 6, '09:00', '13:00', TRUE);

-- Provider 3 (Physiotherapy) - Monday to Friday
INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, is_available) VALUES
('pv000001-0000-0000-0000-000000000003', 1, '09:00', '13:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 1, '15:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 2, '09:00', '13:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 2, '15:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 3, '09:00', '13:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 3, '15:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 4, '09:00', '13:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 4, '15:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 5, '09:00', '13:00', TRUE),
('pv000001-0000-0000-0000-000000000003', 5, '15:00', '19:00', TRUE);

-- Provider 4 (Laboratory) - Monday to Saturday
INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, is_available) VALUES
('pv000001-0000-0000-0000-000000000004', 1, '07:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000004', 2, '07:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000004', 3, '07:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000004', 4, '07:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000004', 5, '07:00', '19:00', TRUE),
('pv000001-0000-0000-0000-000000000004', 6, '07:00', '13:00', TRUE);

-- Provider 8 (Ambulance) - 24/7
INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, is_available) VALUES
('pv000001-0000-0000-0000-000000000008', 0, '00:00', '23:59', TRUE),
('pv000001-0000-0000-0000-000000000008', 1, '00:00', '23:59', TRUE),
('pv000001-0000-0000-0000-000000000008', 2, '00:00', '23:59', TRUE),
('pv000001-0000-0000-0000-000000000008', 3, '00:00', '23:59', TRUE),
('pv000001-0000-0000-0000-000000000008', 4, '00:00', '23:59', TRUE),
('pv000001-0000-0000-0000-000000000008', 5, '00:00', '23:59', TRUE),
('pv000001-0000-0000-0000-000000000008', 6, '00:00', '23:59', TRUE);

-- =====================================================
-- SECTION 6: BOOKINGS
-- =====================================================

INSERT INTO bookings (id, booking_number, patient_id, provider_id, service_id, booking_date, start_time, duration_minutes, status, patient_name, patient_phone, service_location, address_line1, city, latitude, longitude, service_price, platform_fee, total_amount, commission_rate, commission_amount, provider_amount, validation_required, validation_code, validated_at, created_at) VALUES
-- Completed bookings
('bk000001-0000-0000-0000-000000000001', 'BK250101-00001', 'pt000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 'sv000001-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '30 days', '09:00', 20, 'validated', 'Ahmed Ben Ali', '+216 20 123 456', 'home', '15 Rue de la Liberté', 'Tunis', 36.8065, 10.1815, 35.00, 5.25, 40.25, 15.00, 5.25, 29.75, TRUE, '123456', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '31 days'),
('bk000001-0000-0000-0000-000000000002', 'BK250102-00002', 'pt000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000003', 'sv000001-0000-0000-0000-000000000006', CURRENT_DATE - INTERVAL '25 days', '10:00', 45, 'validated', 'Fatma Trabelsi', '+216 21 234 567', 'home', '28 Avenue Habib Bourguiba', 'Sousse', 35.8288, 10.6405, 50.00, 5.00, 55.00, 10.00, 5.00, 45.00, TRUE, '234567', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('bk000001-0000-0000-0000-000000000003', 'BK250103-00003', 'pt000001-0000-0000-0000-000000000003', 'pv000001-0000-0000-0000-000000000004', 'sv000001-0000-0000-0000-000000000009', CURRENT_DATE - INTERVAL '20 days', '08:00', 15, 'validated', 'Mohamed Karray', '+216 22 345 678', 'clinic', '156 Avenue Habib Bourguiba', 'Tunis', 36.7992, 10.1802, 85.00, 6.80, 91.80, 8.00, 6.80, 78.20, TRUE, '345678', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),
('bk000001-0000-0000-0000-000000000004', 'BK250104-00004', 'pt000001-0000-0000-0000-000000000004', 'pv000001-0000-0000-0000-000000000006', 'sv000001-0000-0000-0000-000000000014', CURRENT_DATE - INTERVAL '15 days', '14:00', 30, 'validated', 'Sarah Mansour', '+216 23 456 789', 'clinic', '34 Rue du Lac', 'Les Berges du Lac', 36.8311, 10.2331, 80.00, 8.00, 88.00, 10.00, 8.00, 72.00, TRUE, '456789', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '16 days'),
('bk000001-0000-0000-0000-000000000005', 'BK250105-00005', 'pt000001-0000-0000-0000-000000000005', 'pv000001-0000-0000-0000-000000000009', 'sv000001-0000-0000-0000-000000000023', CURRENT_DATE - INTERVAL '10 days', '11:00', 90, 'validated', 'Youssef Hamdi', '+216 24 567 890', 'clinic', '45 Rue de la Santé', 'La Marsa', 36.8783, 10.3247, 120.00, 14.40, 134.40, 12.00, 14.40, 105.60, TRUE, '567890', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '11 days'),

-- Confirmed bookings (upcoming)
('bk000001-0000-0000-0000-000000000006', 'BK250106-00006', 'pt000001-0000-0000-0000-000000000006', 'pv000001-0000-0000-0000-000000000001', 'sv000001-0000-0000-0000-000000000002', CURRENT_DATE + INTERVAL '1 day', '10:00', 45, 'confirmed', 'Leila Bouazizi', '+216 25 678 901', 'home', '33 Rue de Palestine', 'Ben Arous', 36.7533, 10.2311, 60.00, 7.20, 67.20, 12.00, 7.20, 52.80, TRUE, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('bk000001-0000-0000-0000-000000000007', 'BK250107-00007', 'pt000001-0000-0000-0000-000000000007', 'pv000001-0000-0000-0000-000000000013', 'sv000001-0000-0000-0000-000000000032', CURRENT_DATE + INTERVAL '2 days', '15:00', 30, 'confirmed', 'Karim Jebali', '+216 26 777 888', 'home', '56 Avenue Mohamed V', 'Monastir', 35.7643, 10.8113, 80.00, 8.00, 88.00, 10.00, 8.00, 72.00, TRUE, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('bk000001-0000-0000-0000-000000000008', 'BK250108-00008', 'pt000001-0000-0000-0000-000000000008', 'pv000001-0000-0000-0000-000000000003', 'sv000001-0000-0000-0000-000000000007', CURRENT_DATE + INTERVAL '3 days', '09:00', 30, 'confirmed', 'Nadia Cherif', '+216 27 888 999', 'home', '11 Rue de Bizerte', 'Bizerte', 37.2744, 9.8739, 45.00, 4.50, 49.50, 10.00, 4.50, 40.50, TRUE, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Pending bookings
('bk000001-0000-0000-0000-000000000009', 'BK250109-00009', 'pt000001-0000-0000-0000-000000000009', 'pv000001-0000-0000-0000-000000000015', 'sv000001-0000-0000-0000-000000000035', CURRENT_DATE + INTERVAL '5 days', '16:00', 60, 'pending', 'Omar Sassi', '+216 28 999 000', 'clinic', '23 Rue de la Paix', 'Tunis', 36.8034, 10.1823, 80.00, 9.60, 89.60, 12.00, 9.60, 70.40, TRUE, NULL, NULL, CURRENT_TIMESTAMP),
('bk000001-0000-0000-0000-000000000010', 'BK250110-00010', 'pt000001-0000-0000-0000-000000000010', 'pv000001-0000-0000-0000-000000000012', 'sv000001-0000-0000-0000-000000000029', CURRENT_DATE + INTERVAL '4 days', '08:00', 45, 'pending', 'Amira Gharbi', '+216 29 000 111', 'home', '8 Avenue de la République', 'Nabeul', 36.4513, 10.7357, 30.00, 3.60, 33.60, 12.00, 3.60, 26.40, TRUE, NULL, NULL, CURRENT_TIMESTAMP),

-- Cancelled booking
('bk000001-0000-0000-0000-000000000011', 'BK250111-00011', 'pt000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000002', 'sv000001-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '5 days', '11:00', 15, 'cancelled', 'Ahmed Ben Ali', '+216 20 123 456', 'home', '15 Rue de la Liberté', 'Tunis', 36.8065, 10.1815, 40.00, 6.00, 46.00, 15.00, 6.00, 34.00, TRUE, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '7 days'),

-- In progress booking
('bk000001-0000-0000-0000-000000000012', 'BK250112-00012', 'pt000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000014', 'sv000001-0000-0000-0000-000000000034', CURRENT_DATE, '22:00', 480, 'in_progress', 'Fatma Trabelsi', '+216 21 234 567', 'home', '28 Avenue Habib Bourguiba', 'Sousse', 35.8288, 10.6405, 120.00, 14.40, 134.40, 12.00, 14.40, 105.60, TRUE, '789012', NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- =====================================================
-- SECTION 7: TRANSACTIONS
-- =====================================================

INSERT INTO transactions (id, transaction_number, booking_id, patient_id, provider_id, amount, platform_fee, provider_amount, currency, payment_method, payment_status, authorized_at, held_at, captured_at, released_at, created_at) VALUES
('tx000001-0000-0000-0000-000000000001', 'TRX250101-000001', 'bk000001-0000-0000-0000-000000000001', 'pt000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 40.25, 5.25, 29.75, 'TND', 'card', 'released', CURRENT_TIMESTAMP - INTERVAL '31 days', CURRENT_TIMESTAMP - INTERVAL '31 days', CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '28 days', CURRENT_TIMESTAMP - INTERVAL '31 days'),
('tx000001-0000-0000-0000-000000000002', 'TRX250102-000002', 'bk000001-0000-0000-0000-000000000002', 'pt000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000003', 55.00, 5.00, 45.00, 'TND', 'd17', 'released', CURRENT_TIMESTAMP - INTERVAL '26 days', CURRENT_TIMESTAMP - INTERVAL '26 days', CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '23 days', CURRENT_TIMESTAMP - INTERVAL '26 days'),
('tx000001-0000-0000-0000-000000000003', 'TRX250103-000003', 'bk000001-0000-0000-0000-000000000003', 'pt000001-0000-0000-0000-000000000003', 'pv000001-0000-0000-0000-000000000004', 91.80, 6.80, 78.20, 'TND', 'card', 'released', CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '21 days'),
('tx000001-0000-0000-0000-000000000004', 'TRX250104-000004', 'bk000001-0000-0000-0000-000000000004', 'pt000001-0000-0000-0000-000000000004', 'pv000001-0000-0000-0000-000000000006', 88.00, 8.00, 72.00, 'TND', 'card', 'released', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '16 days'),
('tx000001-0000-0000-0000-000000000005', 'TRX250105-000005', 'bk000001-0000-0000-0000-000000000005', 'pt000001-0000-0000-0000-000000000005', 'pv000001-0000-0000-0000-000000000009', 134.40, 14.40, 105.60, 'TND', 'd17', 'released', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '11 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '11 days'),
('tx000001-0000-0000-0000-000000000006', 'TRX250106-000006', 'bk000001-0000-0000-0000-000000000006', 'pt000001-0000-0000-0000-000000000006', 'pv000001-0000-0000-0000-000000000001', 67.20, 7.20, 52.80, 'TND', 'card', 'held', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('tx000001-0000-0000-0000-000000000007', 'TRX250107-000007', 'bk000001-0000-0000-0000-000000000007', 'pt000001-0000-0000-0000-000000000007', 'pv000001-0000-0000-0000-000000000013', 88.00, 8.00, 72.00, 'TND', 'card', 'held', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('tx000001-0000-0000-0000-000000000008', 'TRX250108-000008', 'bk000001-0000-0000-0000-000000000008', 'pt000001-0000-0000-0000-000000000008', 'pv000001-0000-0000-0000-000000000003', 49.50, 4.50, 40.50, 'TND', 'd17', 'authorized', CURRENT_TIMESTAMP - INTERVAL '1 day', NULL, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('tx000001-0000-0000-0000-000000000009', 'TRX250109-000009', 'bk000001-0000-0000-0000-000000000009', 'pt000001-0000-0000-0000-000000000009', 'pv000001-0000-0000-0000-000000000015', 89.60, 9.60, 70.40, 'TND', 'card', 'pending', NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP),
('tx000001-0000-0000-0000-000000000010', 'TRX250110-000010', 'bk000001-0000-0000-0000-000000000010', 'pt000001-0000-0000-0000-000000000010', 'pv000001-0000-0000-0000-000000000012', 33.60, 3.60, 26.40, 'TND', 'cash', 'pending', NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP);

-- =====================================================
-- SECTION 8: REVIEWS
-- =====================================================

INSERT INTO reviews (id, booking_id, patient_id, provider_id, service_id, rating, rating_professionalism, rating_punctuality, rating_quality, title, comment, is_verified, is_visible, provider_response, provider_responded_at, created_at) VALUES
('rv000001-0000-0000-0000-000000000001', 'bk000001-0000-0000-0000-000000000001', 'pt000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 'sv000001-0000-0000-0000-000000000001', 5, 5, 5, 5, 'Excellente infirmière', 'Très professionnelle et douce. L''injection s''est très bien passée. Je recommande vivement!', TRUE, TRUE, 'Merci beaucoup pour votre confiance! Au plaisir de vous revoir.', CURRENT_TIMESTAMP - INTERVAL '29 days', CURRENT_TIMESTAMP - INTERVAL '30 days'),
('rv000001-0000-0000-0000-000000000002', 'bk000001-0000-0000-0000-000000000002', 'pt000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000003', 'sv000001-0000-0000-0000-000000000006', 5, 5, 5, 5, 'Kiné au top!', 'Sonia est une excellente kinésithérapeute. Ma rééducation avance très bien grâce à elle.', TRUE, TRUE, 'Merci Fatma! Continuez les exercices à la maison, vous êtes sur la bonne voie!', CURRENT_TIMESTAMP - INTERVAL '24 days', CURRENT_TIMESTAMP - INTERVAL '25 days'),
('rv000001-0000-0000-0000-000000000003', 'bk000001-0000-0000-0000-000000000003', 'pt000001-0000-0000-0000-000000000003', 'pv000001-0000-0000-0000-000000000004', 'sv000001-0000-0000-0000-000000000009', 4, 5, 4, 5, 'Laboratoire sérieux', 'Résultats rapides et fiables. Seul bémol: un peu d''attente à l''accueil.', TRUE, TRUE, 'Merci pour votre retour. Nous travaillons à améliorer nos temps d''attente.', CURRENT_TIMESTAMP - INTERVAL '19 days', CURRENT_TIMESTAMP - INTERVAL '20 days'),
('rv000001-0000-0000-0000-000000000004', 'bk000001-0000-0000-0000-000000000004', 'pt000001-0000-0000-0000-000000000004', 'pv000001-0000-0000-0000-000000000006', 'sv000001-0000-0000-0000-000000000014', 5, 5, 5, 5, 'Centre moderne et efficace', 'Équipement de dernière génération, personnel accueillant. Résultats reçus le jour même.', TRUE, TRUE, NULL, NULL, CURRENT_TIMESTAMP - INTERVAL '15 days'),
('rv000001-0000-0000-0000-000000000005', 'bk000001-0000-0000-0000-000000000005', 'pt000001-0000-0000-0000-000000000005', 'pv000001-0000-0000-0000-000000000009', 'sv000001-0000-0000-0000-000000000023', 5, 5, 5, 5, 'Nutritionniste exceptionnelle', 'Ines a su comprendre mes besoins et m''a proposé un plan alimentaire adapté. J''ai déjà perdu 3kg!', TRUE, TRUE, 'Bravo Youssef! Continuez comme ça, les résultats suivront!', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '10 days');

-- =====================================================
-- SECTION 9: CONVERSATIONS & MESSAGES
-- =====================================================

INSERT INTO conversations (id, patient_id, provider_id, booking_id, is_active, last_message_at, last_message_preview, patient_unread_count, provider_unread_count, created_at) VALUES
('cv000001-0000-0000-0000-000000000001', 'pt000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 'bk000001-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', 'Merci pour votre message!', 0, 1, CURRENT_TIMESTAMP - INTERVAL '31 days'),
('cv000001-0000-0000-0000-000000000002', 'pt000001-0000-0000-0000-000000000006', 'pv000001-0000-0000-0000-000000000001', 'bk000001-0000-0000-0000-000000000006', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 hours', 'Je serai là demain à 10h comme prévu.', 1, 0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('cv000001-0000-0000-0000-000000000003', 'pt000001-0000-0000-0000-000000000007', 'pv000001-0000-0000-0000-000000000013', 'bk000001-0000-0000-0000-000000000007', TRUE, CURRENT_TIMESTAMP - INTERVAL '5 hours', 'Avez-vous des symptômes particuliers?', 0, 1, CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO messages (id, conversation_id, sender_id, message_type, content, is_read, read_at, created_at) VALUES
-- Conversation 1
('ms000001-0000-0000-0000-000000000001', 'cv000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'text', 'Bonjour, j''ai une question concernant les soins post-injection.', TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '31 days'),
('ms000001-0000-0000-0000-000000000002', 'cv000001-0000-0000-0000-000000000001', 'pr000001-0000-0000-0000-000000000001', 'text', 'Bonjour Ahmed! Bien sûr, je vous écoute. Quels sont vos symptômes?', TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days' + INTERVAL '30 minutes'),
('ms000001-0000-0000-0000-000000000003', 'cv000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'text', 'J''ai une légère rougeur au point d''injection, est-ce normal?', TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days' + INTERVAL '1 hour'),
('ms000001-0000-0000-0000-000000000004', 'cv000001-0000-0000-0000-000000000001', 'pr000001-0000-0000-0000-000000000001', 'text', 'C''est tout à fait normal. Appliquez une compresse froide et ça devrait disparaître sous 24h. Si ça persiste, n''hésitez pas à me recontacter.', TRUE, CURRENT_TIMESTAMP - INTERVAL '29 days', CURRENT_TIMESTAMP - INTERVAL '30 days' + INTERVAL '2 hours'),
('ms000001-0000-0000-0000-000000000005', 'cv000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000001', 'text', 'Merci pour votre message!', FALSE, NULL, CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Conversation 2
('ms000001-0000-0000-0000-000000000006', 'cv000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000006', 'text', 'Bonjour, je voulais confirmer le rendez-vous de demain.', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('ms000001-0000-0000-0000-000000000007', 'cv000001-0000-0000-0000-000000000002', 'pr000001-0000-0000-0000-000000000001', 'text', 'Bonjour Leila! Oui, c''est bien confirmé pour demain à 10h. Avez-vous le matériel nécessaire pour le pansement?', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '1 hour'),
('ms000001-0000-0000-0000-000000000008', 'cv000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000006', 'text', 'Oui, j''ai tout ce qu''il faut. Merci!', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '2 hours'),
('ms000001-0000-0000-0000-000000000009', 'cv000001-0000-0000-0000-000000000002', 'pr000001-0000-0000-0000-000000000001', 'text', 'Je serai là demain à 10h comme prévu.', FALSE, NULL, CURRENT_TIMESTAMP - INTERVAL '2 hours'),

-- Conversation 3
('ms000001-0000-0000-0000-000000000010', 'cv000001-0000-0000-0000-000000000003', 'p0000001-0000-0000-0000-000000000007', 'text', 'Docteur, j''ai des maux de tête depuis quelques jours.', TRUE, CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('ms000001-0000-0000-0000-000000000011', 'cv000001-0000-0000-0000-000000000003', 'pr000001-0000-0000-0000-000000000013', 'text', 'Avez-vous des symptômes particuliers?', FALSE, NULL, CURRENT_TIMESTAMP - INTERVAL '5 hours');

-- =====================================================
-- SECTION 10: NOTIFICATIONS
-- =====================================================

INSERT INTO notifications (id, user_id, type, title, message, booking_id, is_read, created_at) VALUES
-- Patient notifications
('nt000001-0000-0000-0000-000000000001', 'p0000001-0000-0000-0000-000000000006', 'booking_confirmed', 'Rendez-vous confirmé', 'Votre rendez-vous avec Soins Infirmiers Sousse a été confirmé pour demain à 10h.', 'bk000001-0000-0000-0000-000000000006', FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('nt000001-0000-0000-0000-000000000002', 'p0000001-0000-0000-0000-000000000007', 'booking_confirmed', 'Rendez-vous confirmé', 'Votre rendez-vous avec Dr. Riadh Ben Ali a été confirmé pour après-demain à 15h.', 'bk000001-0000-0000-0000-000000000007', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('nt000001-0000-0000-0000-000000000003', 'p0000001-0000-0000-0000-000000000001', 'payment_received', 'Paiement reçu', 'Votre paiement de 40.25 TND a été reçu avec succès.', 'bk000001-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP - INTERVAL '31 days'),
('nt000001-0000-0000-0000-000000000004', 'p0000001-0000-0000-0000-000000000009', 'booking_new', 'Nouvelle réservation', 'Votre demande de rendez-vous a été envoyée. En attente de confirmation.', 'bk000001-0000-0000-0000-000000000009', FALSE, CURRENT_TIMESTAMP),

-- Provider notifications
('nt000001-0000-0000-0000-000000000005', 'pr000001-0000-0000-0000-000000000001', 'booking_new', 'Nouvelle demande', 'Vous avez reçu une nouvelle demande de rendez-vous de Leila Bouazizi.', 'bk000001-0000-0000-0000-000000000006', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('nt000001-0000-0000-0000-000000000006', 'pr000001-0000-0000-0000-000000000001', 'payment_released', 'Paiement libéré', 'Le paiement de 29.75 TND pour la prestation du 01/01 a été libéré sur votre compte.', 'bk000001-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP - INTERVAL '28 days'),
('nt000001-0000-0000-0000-000000000007', 'pr000001-0000-0000-0000-000000000013', 'booking_new', 'Nouvelle demande', 'Vous avez reçu une nouvelle demande de rendez-vous de Karim Jebali.', 'bk000001-0000-0000-0000-000000000007', TRUE, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('nt000001-0000-0000-0000-000000000008', 'pr000001-0000-0000-0000-000000000015', 'booking_new', 'Nouvelle demande', 'Vous avez reçu une nouvelle demande de rendez-vous de Omar Sassi.', 'bk000001-0000-0000-0000-000000000009', FALSE, CURRENT_TIMESTAMP),
('nt000001-0000-0000-0000-000000000009', 'pr000001-0000-0000-0000-000000000001', 'review_received', 'Nouvel avis', 'Ahmed Ben Ali vous a laissé un avis 5 étoiles!', 'bk000001-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP - INTERVAL '30 days');

-- =====================================================
-- SECTION 11: PATIENT REWARDS
-- =====================================================

INSERT INTO patient_rewards (id, patient_id, total_points, available_points, redeemed_points, current_streak, longest_streak, last_activity_date, level, level_name, total_bookings, total_reviews, created_at) VALUES
('rw000001-0000-0000-0000-000000000001', 'pt000001-0000-0000-0000-000000000001', 520, 420, 100, 5, 12, CURRENT_DATE - INTERVAL '1 day', 2, 'Silver', 12, 3, NOW() - INTERVAL '180 days'),
('rw000001-0000-0000-0000-000000000002', 'pt000001-0000-0000-0000-000000000002', 380, 380, 0, 3, 8, CURRENT_DATE - INTERVAL '3 days', 2, 'Silver', 8, 2, NOW() - INTERVAL '150 days'),
('rw000001-0000-0000-0000-000000000003', 'pt000001-0000-0000-0000-000000000003', 750, 550, 200, 8, 15, CURRENT_DATE, 3, 'Gold', 15, 5, NOW() - INTERVAL '120 days'),
('rw000001-0000-0000-0000-000000000004', 'pt000001-0000-0000-0000-000000000004', 180, 180, 0, 2, 5, CURRENT_DATE - INTERVAL '5 days', 1, 'Bronze', 5, 1, NOW() - INTERVAL '90 days'),
('rw000001-0000-0000-0000-000000000005', 'pt000001-0000-0000-0000-000000000005', 920, 720, 200, 12, 20, CURRENT_DATE, 3, 'Gold', 20, 8, NOW() - INTERVAL '60 days'),
('rw000001-0000-0000-0000-000000000006', 'pt000001-0000-0000-0000-000000000006', 80, 80, 0, 1, 2, CURRENT_DATE - INTERVAL '2 days', 1, 'Bronze', 3, 0, NOW() - INTERVAL '45 days'),
('rw000001-0000-0000-0000-000000000007', 'pt000001-0000-0000-0000-000000000007', 1250, 950, 300, 15, 25, CURRENT_DATE, 4, 'Platinum', 25, 12, NOW() - INTERVAL '30 days'),
('rw000001-0000-0000-0000-000000000008', 'pt000001-0000-0000-0000-000000000008', 220, 220, 0, 4, 6, CURRENT_DATE - INTERVAL '1 day', 1, 'Bronze', 6, 2, NOW() - INTERVAL '15 days'),
('rw000001-0000-0000-0000-000000000009', 'pt000001-0000-0000-0000-000000000009', 50, 50, 0, 1, 1, CURRENT_DATE, 1, 'Bronze', 2, 0, NOW() - INTERVAL '7 days'),
('rw000001-0000-0000-0000-000000000010', 'pt000001-0000-0000-0000-000000000010', 20, 20, 0, 1, 1, CURRENT_DATE, 1, 'Bronze', 1, 0, NOW() - INTERVAL '3 days');

-- =====================================================
-- SECTION 12: FAMILY MEMBERS
-- =====================================================

INSERT INTO family_members (id, patient_id, first_name, last_name, relationship, date_of_birth, gender, phone, medical_conditions, allergies, can_book_for, created_at) VALUES
('fm000001-0000-0000-0000-000000000001', 'pt000001-0000-0000-0000-000000000001', 'Fatma', 'Ben Ali', 'spouse', '1988-06-20', 'female', '+216 20 111 222', NULL, 'Pénicilline', TRUE, NOW() - INTERVAL '150 days'),
('fm000001-0000-0000-0000-000000000002', 'pt000001-0000-0000-0000-000000000001', 'Yassine', 'Ben Ali', 'child', '2015-03-10', 'male', NULL, NULL, NULL, TRUE, NOW() - INTERVAL '150 days'),
('fm000001-0000-0000-0000-000000000003', 'pt000001-0000-0000-0000-000000000003', 'Leila', 'Karray', 'spouse', '1980-09-15', 'female', '+216 22 333 444', 'Diabète type 2', NULL, TRUE, NOW() - INTERVAL '100 days'),
('fm000001-0000-0000-0000-000000000004', 'pt000001-0000-0000-0000-000000000003', 'Hamza', 'Karray', 'parent', '1950-01-25', 'male', '+216 22 444 555', 'Hypertension, Arthrose', 'Aspirine', TRUE, NOW() - INTERVAL '100 days'),
('fm000001-0000-0000-0000-000000000005', 'pt000001-0000-0000-0000-000000000005', 'Nadia', 'Hamdi', 'spouse', '1985-12-08', 'female', '+216 24 555 666', NULL, NULL, TRUE, NOW() - INTERVAL '50 days'),
('fm000001-0000-0000-0000-000000000006', 'pt000001-0000-0000-0000-000000000007', 'Amira', 'Jebali', 'child', '1998-07-22', 'female', '+216 26 888 999', NULL, 'Lactose', TRUE, NOW() - INTERVAL '20 days');

-- =====================================================
-- SECTION 13: HEALTH TRACKING DATA
-- =====================================================

-- Activity tracking for patient 5 (active user)
INSERT INTO activity_tracking (patient_id, date, steps, distance_km, calories_burned, active_minutes, source, created_at) VALUES
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '6 days', 8542, 6.12, 320, 45, 'manual', NOW() - INTERVAL '6 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '5 days', 10234, 7.35, 385, 52, 'manual', NOW() - INTERVAL '5 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '4 days', 7856, 5.64, 295, 38, 'manual', NOW() - INTERVAL '4 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '3 days', 12456, 8.95, 468, 65, 'manual', NOW() - INTERVAL '3 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '2 days', 9123, 6.55, 342, 48, 'manual', NOW() - INTERVAL '2 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '1 day', 11567, 8.31, 434, 58, 'manual', NOW() - INTERVAL '1 day'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE, 6234, 4.48, 234, 32, 'manual', NOW());

-- Hydration tracking
INSERT INTO hydration_tracking (patient_id, date, water_ml, goal_ml, created_at) VALUES
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '6 days', 1800, 2000, NOW() - INTERVAL '6 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '5 days', 2200, 2000, NOW() - INTERVAL '5 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '4 days', 1500, 2000, NOW() - INTERVAL '4 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '3 days', 2500, 2000, NOW() - INTERVAL '3 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '2 days', 2000, 2000, NOW() - INTERVAL '2 days'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '1 day', 1900, 2000, NOW() - INTERVAL '1 day'),
('pt000001-0000-0000-0000-000000000005', CURRENT_DATE, 1200, 2000, NOW());

-- Nutrition profile
INSERT INTO nutrition_profiles (patient_id, height_cm, weight_kg, target_weight_kg, activity_level, goal, daily_calories, daily_protein_g, daily_carbs_g, daily_fat_g, dietary_restrictions, created_at) VALUES
('pt000001-0000-0000-0000-000000000005', 175.00, 82.00, 75.00, 'moderate', 'lose_weight', 2000, 120.00, 200.00, 65.00, ARRAY['low_sodium'], NOW() - INTERVAL '30 days');

-- =====================================================
-- SECTION 14: SUBSCRIPTIONS
-- =====================================================

INSERT INTO subscriptions (id, provider_id, tier, status, start_date, end_date, next_billing_date, monthly_price, commission_rate, marketing_budget, priority_listing, advanced_analytics, auto_renew, created_at) VALUES
('sb000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 'premium', 'active', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days', CURRENT_DATE + INTERVAL '30 days', 99.00, 12.00, 50.00, TRUE, TRUE, TRUE, NOW() - INTERVAL '60 days'),
('sb000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000003', 'elite', 'active', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', CURRENT_DATE + INTERVAL '30 days', 199.00, 10.00, 150.00, TRUE, TRUE, TRUE, NOW() - INTERVAL '90 days'),
('sb000001-0000-0000-0000-000000000003', 'pv000001-0000-0000-0000-000000000004', 'enterprise', 'active', CURRENT_DATE - INTERVAL '120 days', CURRENT_DATE + INTERVAL '245 days', CURRENT_DATE + INTERVAL '30 days', 499.00, 8.00, 500.00, TRUE, TRUE, TRUE, NOW() - INTERVAL '120 days'),
('sb000001-0000-0000-0000-000000000004', 'pv000001-0000-0000-0000-000000000006', 'elite', 'active', CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE + INTERVAL '265 days', CURRENT_DATE + INTERVAL '30 days', 199.00, 10.00, 150.00, TRUE, TRUE, TRUE, NOW() - INTERVAL '100 days'),
('sb000001-0000-0000-0000-000000000005', 'pv000001-0000-0000-0000-000000000008', 'elite', 'active', CURRENT_DATE - INTERVAL '80 days', CURRENT_DATE + INTERVAL '285 days', CURRENT_DATE + INTERVAL '30 days', 199.00, 10.00, 150.00, TRUE, TRUE, TRUE, NOW() - INTERVAL '80 days'),
('sb000001-0000-0000-0000-000000000006', 'pv000001-0000-0000-0000-000000000013', 'elite', 'active', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days', CURRENT_DATE + INTERVAL '30 days', 199.00, 10.00, 150.00, TRUE, TRUE, TRUE, NOW() - INTERVAL '45 days');

-- =====================================================
-- SECTION 15: MARKETING CAMPAIGNS
-- =====================================================

INSERT INTO marketing_campaigns (id, provider_id, name, campaign_type, objective, status, start_date, end_date, budget, spent_amount, headline, description, impressions, clicks, conversions, created_at) VALUES
('mc000001-0000-0000-0000-000000000001', 'pv000001-0000-0000-0000-000000000001', 'Campagne Rentrée', 'social', 'awareness', 'completed', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', 200.00, 185.50, 'Soins infirmiers à domicile', 'Profitez de nos services de soins infirmiers professionnels à domicile. Réservez maintenant!', 15234, 456, 23, NOW() - INTERVAL '60 days'),
('mc000001-0000-0000-0000-000000000002', 'pv000001-0000-0000-0000-000000000003', 'Promo Kiné', 'social', 'conversions', 'active', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 300.00, 145.00, '-20% sur votre première séance', 'Découvrez nos services de kinésithérapie avec 20% de réduction sur votre première séance!', 8567, 312, 18, NOW() - INTERVAL '15 days'),
('mc000001-0000-0000-0000-000000000003', 'pv000001-0000-0000-0000-000000000004', 'Bilan Santé', 'email', 'engagement', 'active', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '23 days', 150.00, 45.00, 'Votre bilan sanguin complet', 'Laboratoire Pasteur: Bilan sanguin complet avec prélèvement à domicile disponible.', 3456, 234, 12, NOW() - INTERVAL '7 days'),
('mc000001-0000-0000-0000-000000000004', 'pv000001-0000-0000-0000-000000000009', 'Nutrition Été', 'social', 'awareness', 'scheduled', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '37 days', 250.00, 0.00, 'Préparez votre corps pour l''été', 'Consultation nutritionnelle personnalisée pour atteindre vos objectifs santé.', 0, 0, 0, NOW() - INTERVAL '2 days');

-- =====================================================
-- SECTION 16: SUPPORT TICKETS
-- =====================================================

INSERT INTO support_tickets (id, ticket_number, user_id, category, subject, description, priority, status, assigned_to, created_at) VALUES
('st000001-0000-0000-0000-000000000001', 'TKT-2025-00001', 'p0000001-0000-0000-0000-000000000003', 'billing', 'Problème de facturation', 'J''ai été facturé deux fois pour ma dernière consultation. Pouvez-vous vérifier?', 'high', 'in_progress', 'a0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days'),
('st000001-0000-0000-0000-000000000002', 'TKT-2025-00002', 'pr000001-0000-0000-0000-000000000002', 'technical', 'Application ne charge pas', 'L''application mobile ne charge plus depuis ce matin. Écran blanc.', 'urgent', 'resolved', 'a0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '5 days'),
('st000001-0000-0000-0000-000000000003', 'TKT-2025-00003', 'p0000001-0000-0000-0000-000000000007', 'account', 'Changement de numéro', 'Je souhaite changer mon numéro de téléphone associé à mon compte.', 'normal', 'open', NULL, NOW() - INTERVAL '1 day'),
('st000001-0000-0000-0000-000000000004', 'TKT-2025-00004', 'pr000001-0000-0000-0000-000000000005', 'billing', 'Retard de paiement', 'Mon paiement de la semaine dernière n''a toujours pas été versé sur mon compte.', 'high', 'waiting_response', 'a0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '2 days');

-- =====================================================
-- SECTION 17: FRAUD ALERTS
-- =====================================================

INSERT INTO fraud_events (id, event_type, user_id, booking_id, transaction_id, fraud_score, decision, risk_level, features, model_version, requires_review, created_at) VALUES
('fe000001-0000-0000-0000-000000000001', 'payment_attempted', 'p0000001-0000-0000-0000-000000000001', 'bk000001-0000-0000-0000-000000000001', 'tx000001-0000-0000-0000-000000000001', 12.50, 'approve', 'low', '{"amount": 40.25, "payment_method": "card", "device_known": true}', 'v1.2.0', FALSE, NOW() - INTERVAL '31 days'),
('fe000001-0000-0000-0000-000000000002', 'booking_created', 'p0000001-0000-0000-0000-000000000009', 'bk000001-0000-0000-0000-000000000009', NULL, 45.00, 'review', 'medium', '{"new_user": true, "high_value": false, "unusual_time": true}', 'v1.2.0', TRUE, NOW()),
('fe000001-0000-0000-0000-000000000003', 'payment_attempted', 'p0000001-0000-0000-0000-000000000005', 'bk000001-0000-0000-0000-000000000005', 'tx000001-0000-0000-0000-000000000005', 8.20, 'approve', 'low', '{"amount": 134.40, "payment_method": "d17", "device_known": true, "repeat_customer": true}', 'v1.2.0', FALSE, NOW() - INTERVAL '11 days');

-- =====================================================
-- SECTION 18: ADMIN ACTIONS LOG
-- =====================================================

INSERT INTO admin_actions (id, admin_id, action, entity_type, entity_id, description, created_at) VALUES
('aa000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'provider_approved', 'provider', 'pv000001-0000-0000-0000-000000000001', 'Approved provider: Soins Infirmiers Sousse', NOW() - INTERVAL '200 days'),
('aa000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'provider_approved', 'provider', 'pv000001-0000-0000-0000-000000000003', 'Approved provider: Kiné Plus Ariana', NOW() - INTERVAL '160 days'),
('aa000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002', 'document_verified', 'provider_document', 'pv000001-0000-0000-0000-000000000004', 'Verified laboratory license for Laboratoire Pasteur', NOW() - INTERVAL '150 days'),
('aa000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'refund_processed', 'transaction', 'tx000001-0000-0000-0000-000000000011', 'Processed refund for cancelled booking BK250111-00011', NOW() - INTERVAL '5 days'),
('aa000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'ticket_resolved', 'support_ticket', 'st000001-0000-0000-0000-000000000002', 'Resolved technical issue - app loading problem', NOW() - INTERVAL '4 days');

-- =====================================================
-- SECTION 19: SYSTEM SETTINGS
-- =====================================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'Sanad', 'string', 'Platform display name', TRUE),
('platform_commission_rate', '15', 'number', 'Default platform commission percentage', FALSE),
('escrow_hold_hours', '48', 'number', 'Hours to hold payment in escrow after service completion', FALSE),
('auto_validate_hours', '48', 'number', 'Hours after which booking auto-validates if no dispute', FALSE),
('min_booking_notice_hours', '2', 'number', 'Minimum hours notice required for booking', TRUE),
('max_booking_advance_days', '30', 'number', 'Maximum days in advance a booking can be made', TRUE),
('cancellation_fee_percentage', '10', 'number', 'Cancellation fee percentage if cancelled within 24h', TRUE),
('referral_points_referrer', '100', 'number', 'Points awarded to referrer', FALSE),
('referral_points_referred', '50', 'number', 'Points awarded to referred user', FALSE),
('points_per_booking', '10', 'number', 'Points earned per completed booking', FALSE),
('points_per_review', '5', 'number', 'Points earned per review submitted', FALSE),
('support_email', 'support@sanad.tn', 'string', 'Support email address', TRUE),
('support_phone', '+216 70 000 000', 'string', 'Support phone number', TRUE),
('country_code', 'TN', 'string', 'Country code for this database', TRUE),
('default_currency', 'TND', 'string', 'Default currency', TRUE),
('default_timezone', 'Africa/Tunis', 'string', 'Default timezone', TRUE),
('default_language', 'fr', 'string', 'Default language', TRUE),
('emergency_number', '190', 'string', 'Emergency services number', TRUE),
('vat_rate', '19', 'number', 'VAT rate percentage', TRUE);

-- =====================================================
-- SECTION 20: BADGES
-- =====================================================

INSERT INTO badges (id, code, name, description, icon_url, requirement_type, requirement_value, points_awarded, is_active) VALUES
('bg000001-0000-0000-0000-000000000001', 'first_booking', 'Premiers Pas', 'Effectuez votre première réservation', NULL, 'bookings', 1, 50, TRUE),
('bg000001-0000-0000-0000-000000000002', 'loyal_5', 'Client Régulier', 'Effectuez 5 réservations', NULL, 'bookings', 5, 100, TRUE),
('bg000001-0000-0000-0000-000000000003', 'loyal_10', 'Client Fidèle', 'Effectuez 10 réservations', NULL, 'bookings', 10, 200, TRUE),
('bg000001-0000-0000-0000-000000000004', 'loyal_25', 'Client VIP', 'Effectuez 25 réservations', NULL, 'bookings', 25, 500, TRUE),
('bg000001-0000-0000-0000-000000000005', 'reviewer', 'Critique', 'Laissez votre premier avis', NULL, 'reviews', 1, 25, TRUE),
('bg000001-0000-0000-0000-000000000006', 'super_reviewer', 'Super Critique', 'Laissez 10 avis', NULL, 'reviews', 10, 150, TRUE),
('bg000001-0000-0000-0000-000000000007', 'streak_7', 'Semaine Active', 'Maintenez une série de 7 jours', NULL, 'streak', 7, 100, TRUE),
('bg000001-0000-0000-0000-000000000008', 'streak_30', 'Champion Mensuel', 'Maintenez une série de 30 jours', NULL, 'streak', 30, 300, TRUE),
('bg000001-0000-0000-0000-000000000009', 'referrer', 'Ambassadeur', 'Parrainez votre premier ami', NULL, 'referrals', 1, 100, TRUE),
('bg000001-0000-0000-0000-000000000010', 'super_referrer', 'Super Ambassadeur', 'Parrainez 5 amis', NULL, 'referrals', 5, 500, TRUE),
('bg000001-0000-0000-0000-000000000011', 'health_tracker', 'Suivi Santé', 'Utilisez le suivi santé pendant 7 jours', NULL, 'health_tracking', 7, 75, TRUE),
('bg000001-0000-0000-0000-000000000012', 'early_adopter', 'Pionnier', 'Parmi les 1000 premiers utilisateurs', NULL, 'special', 1, 200, TRUE);

-- Patient badges earned
INSERT INTO patient_badges (patient_id, badge_id, earned_at) VALUES
('pt000001-0000-0000-0000-000000000001', 'bg000001-0000-0000-0000-000000000001', NOW() - INTERVAL '180 days'),
('pt000001-0000-0000-0000-000000000001', 'bg000001-0000-0000-0000-000000000002', NOW() - INTERVAL '120 days'),
('pt000001-0000-0000-0000-000000000001', 'bg000001-0000-0000-0000-000000000003', NOW() - INTERVAL '60 days'),
('pt000001-0000-0000-0000-000000000001', 'bg000001-0000-0000-0000-000000000005', NOW() - INTERVAL '150 days'),
('pt000001-0000-0000-0000-000000000003', 'bg000001-0000-0000-0000-000000000001', NOW() - INTERVAL '120 days'),
('pt000001-0000-0000-0000-000000000003', 'bg000001-0000-0000-0000-000000000002', NOW() - INTERVAL '90 days'),
('pt000001-0000-0000-0000-000000000003', 'bg000001-0000-0000-0000-000000000003', NOW() - INTERVAL '45 days'),
('pt000001-0000-0000-0000-000000000003', 'bg000001-0000-0000-0000-000000000004', NOW() - INTERVAL '15 days'),
('pt000001-0000-0000-0000-000000000005', 'bg000001-0000-0000-0000-000000000001', NOW() - INTERVAL '60 days'),
('pt000001-0000-0000-0000-000000000005', 'bg000001-0000-0000-0000-000000000002', NOW() - INTERVAL '45 days'),
('pt000001-0000-0000-0000-000000000005', 'bg000001-0000-0000-0000-000000000003', NOW() - INTERVAL '30 days'),
('pt000001-0000-0000-0000-000000000005', 'bg000001-0000-0000-0000-000000000007', NOW() - INTERVAL '20 days'),
('pt000001-0000-0000-0000-000000000005', 'bg000001-0000-0000-0000-000000000011', NOW() - INTERVAL '10 days'),
('pt000001-0000-0000-0000-000000000007', 'bg000001-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days'),
('pt000001-0000-0000-0000-000000000007', 'bg000001-0000-0000-0000-000000000002', NOW() - INTERVAL '25 days'),
('pt000001-0000-0000-0000-000000000007', 'bg000001-0000-0000-0000-000000000003', NOW() - INTERVAL '20 days'),
('pt000001-0000-0000-0000-000000000007', 'bg000001-0000-0000-0000-000000000004', NOW() - INTERVAL '10 days'),
('pt000001-0000-0000-0000-000000000007', 'bg000001-0000-0000-0000-000000000006', NOW() - INTERVAL '5 days'),
('pt000001-0000-0000-0000-000000000007', 'bg000001-0000-0000-0000-000000000008', NOW() - INTERVAL '3 days');

-- =====================================================
-- SECTION 21: DISCOUNT CODES
-- =====================================================

INSERT INTO discount_codes (id, code, description, discount_type, discount_value, max_discount_amount, valid_from, valid_until, max_uses, max_uses_per_user, current_uses, min_order_amount, first_booking_only, is_active) VALUES
('dc000001-0000-0000-0000-000000000001', 'BIENVENUE20', '20% de réduction pour les nouveaux utilisateurs', 'percentage', 20.00, 50.00, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', 1000, 1, 156, 30.00, TRUE, TRUE),
('dc000001-0000-0000-0000-000000000002', 'SANTE10', '10% de réduction sur tous les services', 'percentage', 10.00, 30.00, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', 500, 3, 89, 20.00, FALSE, TRUE),
('dc000001-0000-0000-0000-000000000003', 'LABO5', '5 TND de réduction sur les analyses', 'fixed', 5.00, NULL, NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days', 200, 2, 34, 40.00, FALSE, TRUE),
('dc000001-0000-0000-0000-000000000004', 'ETE2025', '15% de réduction été 2025', 'percentage', 15.00, 40.00, NOW() + INTERVAL '30 days', NOW() + INTERVAL '120 days', 2000, 5, 0, 25.00, FALSE, FALSE);

-- =====================================================
-- END OF SEED DATA
-- =====================================================

-- Verify data counts
DO $$
DECLARE
    user_count INTEGER;
    patient_count INTEGER;
    provider_count INTEGER;
    service_count INTEGER;
    booking_count INTEGER;
    transaction_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO patient_count FROM patients;
    SELECT COUNT(*) INTO provider_count FROM providers;
    SELECT COUNT(*) INTO service_count FROM services;
    SELECT COUNT(*) INTO booking_count FROM bookings;
    SELECT COUNT(*) INTO transaction_count FROM transactions;
    
    RAISE NOTICE '=== SEED DATA SUMMARY ===';
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Patients: %', patient_count;
    RAISE NOTICE 'Providers: %', provider_count;
    RAISE NOTICE 'Services: %', service_count;
    RAISE NOTICE 'Bookings: %', booking_count;
    RAISE NOTICE 'Transactions: %', transaction_count;
    RAISE NOTICE '========================';
END $$;
