
# Cahier des Charges - Plateforme de Santé à Domicile

## 📋 Informations Générales

**Nom du Projet :** Plateforme de Santé à Domicile Tunisie  
**Version :** 1.0  
**Date :** Janvier 2025  
**Client :** Startup HealthTech Tunisie  
**Chef de Projet :** [À définir]  
**Équipe Technique :** [À définir]

---

## 🎯 1. Contexte et Objectifs du Projet

### 1.1 Contexte

La Tunisie fait face à un vieillissement de sa population et à une demande croissante de services de santé à domicile. Les patients, notamment les personnes âgées et les personnes à mobilité réduite, rencontrent des difficultés pour accéder aux soins médicaux.

**Problématiques identifiées :**
- Difficulté d'accès aux soins pour les personnes âgées et à mobilité réduite
- Manque de coordination entre les différents prestataires de santé
- Absence de plateforme centralisée pour les services de santé à domicile
- Processus de réservation complexe et non digitalisé
- Manque de transparence sur les tarifs et la qualité des services

### 1.2 Objectifs du Projet

**Objectifs Business :**
- Créer une marketplace leader des services de santé à domicile en Tunisie
- Connecter 1000+ professionnels de santé dans les 12 premiers mois
- Atteindre 10 000 patients actifs la première année
- Générer un GMV (Gross Merchandise Value) de 5M TND/an
- Réduire les coûts d'accès aux soins de 30% par rapport aux circuits traditionnels

**Objectifs Utilisateurs :**
- Faciliter l'accès aux soins à domicile pour tous les Tunisiens
- Offrir une expérience de réservation simple et rapide (< 3 minutes)
- Garantir la qualité et la sécurité des prestations
- Permettre le suivi et la coordination des soins
- Proposer des tarifs transparents et compétitifs

**Objectifs Techniques :**
- Développer une plateforme web responsive (React + TypeScript)
- Assurer une disponibilité de 99.9%
- Garantir la sécurité des données médicales (conformité RGPD)
- Intégrer les systèmes de paiement locaux (D17, cartes bancaires)
- Mettre en place un système de détection de fraude

---

## 👥 2. Acteurs et Utilisateurs

### 2.1 Patients

**Profil :**
- Personnes âgées (60+ ans) : 40%
- Adultes avec maladies chroniques : 30%
- Jeunes parents : 15%
- Personnes à mobilité réduite : 10%
- Autres : 5%

**Besoins :**
- Réserver facilement des services de santé à domicile
- Consulter les profils et avis des professionnels
- Suivre l'historique de leurs soins
- Gérer les rendez-vous et les paiements
- Coordonner les soins avec la famille (cercle familial)

**Fonctionnalités clés :**
- Inscription et profil patient
- Recherche et réservation de services
- Gestion des rendez-vous
- Paiement sécurisé avec escrow
- Validation des prestations
- Messagerie avec les professionnels
- Tableau de bord santé
- Programme de fidélité

### 2.2 Professionnels de Santé

**Types de professionnels :**
- Infirmiers/Infirmières
- Kinésithérapeutes
- Aides-soignants
- Médecins à domicile
- Psychologues
- Nutritionnistes
- Sages-femmes

**Besoins :**
- Augmenter leur visibilité et clientèle
- Gérer leur planning et disponibilités
- Recevoir des paiements sécurisés
- Accéder à un support administratif
- Suivre leurs performances

**Fonctionnalités clés :**
- Inscription multi-étapes avec vérification
- Profil professionnel complet
- Gestion du calendrier et disponibilités
- Réception et gestion des réservations
- Système de validation de prestation (code PIN)
- Paiement automatique après validation
- Tableau de bord analytics
- Gestion des avis clients

### 2.3 Établissements de Santé

**Types d'établissements :**
- Laboratoires d'analyses médicales
- Centres de radiologie
- Salles de sport / Fitness
- Agences de location d'équipement médical
- Services d'ambulance

**Besoins :**
- Digitaliser leurs services
- Gérer les réservations en ligne
- Optimiser leur taux d'occupation
- Accéder à de nouveaux clients

**Fonctionnalités clés :**
- Inscription établissement
- Gestion multi-services
- Calendrier de disponibilités
- Gestion des équipes
- Facturation et paiements
- Statistiques et rapports

### 2.4 Administrateurs Plateforme

**Rôles :**
- Super Admin : Gestion complète
- Admin Opérationnel : Support et modération
- Admin Financier : Gestion paiements et facturation
- Admin Fraude : Détection et prévention

**Fonctionnalités clés :**
- Dashboard de supervision
- Gestion des utilisateurs et professionnels
- Validation des inscriptions
- Modération des avis
- Gestion des litiges
- Détection de fraude
- Rapports et analytics
- Configuration de la plateforme

---

## 🎨 3. Architecture Fonctionnelle

### 3.1 Services Proposés

#### 3.1.1 Soins à Domicile (10 services)

**1. Soins Infirmiers**
- Injections (IM, SC, IV)
- Pansements et soins de plaies
- Prises de sang
- Perfusions
- Surveillance post-opératoire
- **Tarif moyen :** 30-50 TND/visite

**2. Aide aux Seniors**
- Toilette et hygiène
- Habillage
- Aide aux repas
- Aide aux déplacements
- Compagnie et stimulation
- Gestion des médicaments
- **Tarif moyen :** 40-80 TND/jour

**3. Kinésithérapie**
- Rééducation motrice
- Rééducation respiratoire
- Massage thérapeutique
- Rééducation sportive
- **Tarif moyen :** 50-80 TND/séance

**4. Soins Maternité**
- Suivi post-natal
- Aide à l'allaitement
- Soins du nouveau-né
- Suivi complet maman + bébé
- **Tarif moyen :** 60-100 TND/visite

**5. Bilan de Santé**
- Tension artérielle
- Glycémie
- Température
- Fréquence cardiaque
- Saturation en oxygène
- Poids et IMC
- **Tarif moyen :** 30-50 TND

**6. Garde de Nuit**
- Garde courte (8h) : 80 TND
- Garde standard (12h) : 120 TND
- Garde 24h : 200 TND

**7. Médecin à Domicile**
- Médecine générale
- Pédiatrie
- Gériatrie
- Consultation urgente
- **Tarif moyen :** 80-150 TND

**8. Soins Chroniques**
- Diabète
- Hypertension
- Cancer (soins palliatifs)
- Maladies cardiaques
- **Tarif moyen :** 150-400 TND/mois

**9. Soutien Psychologique**
- Dépression
- Anxiété/Stress
- Deuil
- Épuisement aidant
- **Tarif moyen :** 80-120 TND/séance

**10. Accompagnement Médical**
- Rendez-vous médicaux
- Hôpital/Clinique
- Pharmacie
- Démarches administratives
- **Tarif moyen :** 40-60 TND

#### 3.1.2 Laboratoires (5 services)

- Analyses sanguines (NFS, glycémie, cholestérol)
- Analyses urinaires (ECBU)
- Bilan hormonal
- Tests allergiques
- Tests génétiques
- **Tarif moyen :** 50-300 TND selon analyses

#### 3.1.3 Radiologie (5 services)

- Radiographie
- Échographie
- Scanner (CT)
- IRM
- Mammographie
- **Tarif moyen :** 80-500 TND selon examen

#### 3.1.4 Salles de Sport (6 services)

- Fitness
- Musculation
- CrossFit
- Yoga
- Pilates
- Boxe
- **Tarif moyen :** 100-300 TND/mois

#### 3.1.5 Ambulance (4 services)

- Urgence
- Transport programmé
- Inter-hospitalier
- Rapatriement
- **Tarif moyen :** 100-500 TND selon distance

#### 3.1.6 Nutrition (5 services)

- Perte de poids
- Nutrition sportive
- Diabète
- Grossesse
- Pédiatrique
- **Tarif moyen :** 80-150 TND/consultation

#### 3.1.7 Équipement Médical (5 services)

- Fauteuil roulant : 50-150 TND/mois
- Lit médicalisé : 100-200 TND/mois
- Concentrateur oxygène : 150-300 TND/mois
- Déambulateur : 30-80 TND/mois
- Béquilles : 20-50 TND/mois

### 3.2 Parcours Utilisateurs

#### 3.2.1 Parcours Patient

**1. Inscription (2 minutes)**
```
Landing Page → Inscription Patient
↓
Email + Mot de passe
↓
Informations personnelles (nom, téléphone, adresse)
↓
Validation email
↓
Onboarding (tutoriel)
↓
Dashboard Patient
```

**2. Réservation de Service (3 minutes)**
```
Dashboard → Sélection Service
↓
Choix du type de service (ex: Soins Infirmiers)
↓
Sélection du professionnel (profil, avis, tarifs)
↓
Détails de la prestation (date, heure, adresse)
↓
Informations patient (nom, âge, notes médicales)
↓
Paiement (Carte bancaire ou D17)
↓
Confirmation réservation
```

**3. Validation de Prestation (30 secondes)**
```
Service terminé → Notification patient
↓
OPTION A: Validation immédiate (Code PIN 4 chiffres)
  - Professionnel montre code
  - Patient entre code dans app/SMS
  - Validation instantanée ✅
↓
OPTION B: Validation différée (1 clic)
  - Notification T+30min, T+2h, T+24h
  - Patient clique lien
  - Validation en 1 clic ✅
↓
OPTION C: Validation automatique (48h)
  - Si pas de validation ni litige
  - Auto-validation ✅
↓
Transfert paiement au professionnel
```

#### 3.2.2 Parcours Professionnel

**1. Inscription (10 minutes)**
```
Landing Page → Inscription Professionnel
↓
ÉTAPE 1: Compte (email, mot de passe)
↓
ÉTAPE 2: Informations personnelles
  - Nom complet
  - Téléphone
  - Adresse
  - Ville
  - [Si établissement: Nom de l'organisation]
↓
ÉTAPE 3: Sélection Services (onglets par catégorie)
  - Soins à Domicile
  - Laboratoire
  - Radiologie
  - Salle de Sport
  - Ambulance
  - Nutrition
  - Équipement Médical
↓
ÉTAPE 4: Documents
  - Profession
  - Années d'expérience
  - Présentation
  - Upload diplôme *
  - Upload carte professionnelle
  - Upload assurance RC
↓
Validation par admin (24-48h)
↓
Dashboard Professionnel
```

**2. Gestion de Réservation**
```
Nouvelle réservation → Notification
↓
Accepter/Refuser
↓
Si accepté: Ajout au calendrier
↓
Jour J: Navigation vers patient
↓
Prestation effectuée
↓
Terminer le service → Génération code PIN
↓
Montrer code au patient
↓
Attente validation (immédiate ou différée)
↓
Paiement reçu (24-48h max)
```

### 3.3 Système de Paiement Escrow

**Principe :** Paiement séquestre pour protéger patient et professionnel

**Flow complet :**

```
1. RÉSERVATION
Patient réserve → Paiement carte/D17
↓
Montant BLOQUÉ (hold) sur compte plateforme
↓
Status: "paid_pending_validation"

2. PRESTATION
Professionnel effectue service
↓
Professionnel clique "Terminer"
↓
Code PIN 4 chiffres généré

3. VALIDATION PATIENT (3 méthodes)

A) Immédiate (60% cas)
   Patient entre code → Validation instantanée

B) Différée (30% cas)
   T+30min: Relance douce
   T+2h: Relance insistante
   T+24h: Relance urgente
   Patient clique lien → Validation 1-clic

C) Automatique (10% cas)
   T+48h: Si pas de litige
   → Auto-validation

4. TRANSFERT
Validation confirmée
↓
Capture paiement Stripe
↓
Déduction commission (15%)
↓
Transfert au professionnel (Stripe Connect)
↓
Status: "paid_transferred"
```

**Sécurité :**
- Code PIN expire après 24h
- Maximum 3 tentatives
- Géolocalisation optionnelle (500m tolérance)
- Détection patterns frauduleux
- Période contestation 7 jours

---

## 🔐 4. Sécurité et Conformité

### 4.1 Sécurité des Données

**Données sensibles :**
- Données médicales (notes, historique)
- Données personnelles (nom, adresse, téléphone)
- Données financières (cartes bancaires)
- Documents professionnels (diplômes, licences)

**Mesures de sécurité :**
- Chiffrement SSL/TLS (HTTPS)
- Chiffrement des données au repos (AES-256)
- Authentification sécurisée (JWT tokens)
- Hashage des mots de passe (bcrypt)
- 2FA optionnel pour professionnels
- Logs d'audit complets
- Backups quotidiens automatiques
- Plan de reprise d'activité (PRA)

### 4.2 Conformité RGPD

**Principes appliqués :**
- Consentement explicite
- Droit d'accès aux données
- Droit de rectification
- Droit à l'effacement
- Portabilité des données
- Limitation de la conservation (7 ans max)

**Mesures :**
- Politique de confidentialité claire
- CGU et CGV détaillées
- Formulaires de consentement
- Export de données en 1 clic
- Suppression de compte
- DPO (Data Protection Officer) désigné

### 4.3 Vérification des Professionnels

**Processus de validation :**

```
1. INSCRIPTION
Professionnel remplit formulaire
↓
Upload documents obligatoires

2. VÉRIFICATION AUTOMATIQUE
- Email valide
- Téléphone valide
- Documents uploadés

3. VÉRIFICATION MANUELLE (Admin)
- Diplôme authentique
- Carte professionnelle valide
- Assurance RC en cours
- Vérification antécédents (optionnel)
- Appel téléphonique de confirmation

4. DÉCISION
✅ Approuvé → Compte activé
❌ Refusé → Email avec raisons
⏸️ En attente → Demande documents supplémentaires

Délai: 24-48h
```

**Documents requis :**
- Diplôme (obligatoire)
- Carte professionnelle (recommandé)
- Assurance responsabilité civile (recommandé)
- Casier judiciaire (optionnel)

### 4.4 Détection de Fraude

**Système de scoring en temps réel**

**Signaux de fraude détectés :**

**Patient :**
- Nouveau compte (<7 jours) + montant élevé
- VPN/Proxy détecté
- Vitesse de réservation suspecte (<10 sec)
- Carte étrangère
- Device fingerprint suspect
- Taux d'annulation élevé (>30%)
- Validations systématiquement tardives

**Professionnel :**
- Validations immédiates répétées (collusion)
- Taux de litige élevé (>5%)
- Augmentation soudaine de prix
- Annulations fréquentes
- Avis suspects (pattern copier-coller)

**Actions automatiques :**
- Score <30 : ✅ Approuvé
- Score 30-70 : ⚠️ Review manuelle
- Score >70 : ❌ Bloqué

**Dashboard Fraude :**
- Métriques temps réel
- Événements récents avec détails
- Patterns détectés
- Transactions à réviser
- Alertes automatiques

---

## 💰 5. Modèle Économique

### 5.1 Sources de Revenus

**1. Commission sur Transactions (Principal)**
- Soins à domicile : 15% du montant
- Laboratoires : 10% du montant
- Radiologie : 10% du montant
- Salles de sport : 20% du montant (abonnements)
- Ambulance : 12% du montant
- Nutrition : 15% du montant
- Équipement médical : 15% du montant (location)

**Exemple :**
```
Service : Soins Infirmiers
Tarif patient : 50 TND
Commission plateforme : 7.5 TND (15%)
Professionnel reçoit : 42.5 TND
```

**2. Abonnements Professionnels (Optionnel)**

**Plan Gratuit (15% commission)**
- Profil basique
- 5 photos maximum
- Réponse sous 24h
- Analytics basiques

**Plan Premium (10% commission) - 50 TND/mois**
- Badge "Premium"
- Photos illimitées
- Réponse prioritaire
- Analytics avancées
- Boost visibilité
- Support prioritaire

**Plan Pro (8% commission) - 100 TND/mois**
- Tout Premium +
- Badge "Top Pro"
- Placement prioritaire
- Campagnes marketing
- API access
- Account manager dédié

**3. Services Additionnels**

- Assurance annulation : 5 TND/réservation
- Vérification identité renforcée : 20 TND/an
- Publicité ciblée : À partir de 100 TND/mois
- Formation professionnels : 200 TND/session
- Certification qualité : 500 TND/an

### 5.2 Projections Financières (Année 1)

**Hypothèses :**
- 10 000 patients actifs
- 1 000 professionnels actifs
- 2 réservations/patient/mois en moyenne
- Panier moyen : 60 TND

**Revenus mensuels (Mois 12) :**
```
Transactions : 10 000 patients × 2 réservations × 60 TND = 1 200 000 TND GMV
Commission 15% : 180 000 TND

Abonnements Premium : 200 pros × 50 TND = 10 000 TND
Abonnements Pro : 50 pros × 100 TND = 5 000 TND

Services additionnels : 20 000 TND

TOTAL REVENUS MENSUELS : 215 000 TND
TOTAL REVENUS ANNUELS : ~2 000 000 TND
```

**Coûts mensuels :**
```
Équipe (10 personnes) : 50 000 TND
Infrastructure (AWS, Stripe) : 15 000 TND
Marketing : 30 000 TND
Support client : 10 000 TND
Légal & Comptabilité : 5 000 TND
Divers : 10 000 TND

TOTAL COÛTS : 120 000 TND/mois
```

**Rentabilité :**
```
Marge brute : 215 000 - 120 000 = 95 000 TND/mois
Marge nette : ~44%
Break-even : Mois 8-10
```

---

## 🛠️ 6. Spécifications Techniques

### 6.1 Architecture Technique

**Stack Technologique :**

**Frontend :**
- React 18+ (TypeScript)
- React Router v6 (navigation)
- Tailwind CSS (styling)
- Lucide React (icônes)
- Framer Motion (animations)
- React Hook Form (formulaires)
- Axios (API calls)

**Backend (Recommandé) :**
- Node.js + Express (API REST)
- PostgreSQL (base de données principale)
- Redis (cache, sessions)
- Stripe (paiements)
- Twilio (SMS)
- SendGrid (emails)
- AWS S3 (stockage fichiers)

**Infrastructure :**
- AWS EC2 / Vercel (hosting)
- AWS RDS (PostgreSQL managed)
- AWS ElastiCache (Redis)
- CloudFlare (CDN + DDoS protection)
- GitHub Actions (CI/CD)

### 6.2 Base de Données

**Schéma principal :**

```sql
-- Users (table principale)
users
  - id (UUID)
  - email (unique)
  - password_hash
  - role (patient | professional | admin)
  - created_at
  - updated_at

-- Patients
patients
  - id (UUID)
  - user_id (FK)
  - full_name
  - phone
  - address
  - city
  - date_of_birth
  - medical_notes (encrypted)

-- Professionals
professionals
  - id (UUID)
  - user_id (FK)
  - full_name
  - phone
  - address
  - city
  - profession
  - experience_years
  - bio
  - verified (boolean)
  - verification_date
  - stripe_account_id

-- Professional Services (many-to-many)
professional_services
  - id (UUID)
  - professional_id (FK)
  - service_id (FK)
  - price
  - description

-- Services
services
  - id (UUID)
  - category (care | laboratory | radiology | gym | ambulance | nutrition | equipment)
  - name
  - description
  - icon

-- Appointments
appointments
  - id (UUID)
  - patient_id (FK)
  - professional_id (FK)
  - service_id (FK)
  - date
  - time
  - address
  - status (pending | confirmed | completed | cancelled | validated)
  - amount
  - commission
  - payment_intent_id (Stripe)
  - validation_code_hash
  - completed_at
  - validated_at
  - validation_type (manual | auto)

-- Reviews
reviews
  - id (UUID)
  - appointment_id (FK)
  - patient_id (FK)
  - professional_id (FK)
  - rating (1-5)
  - comment
  - created_at

-- Transactions
transactions
  - id (UUID)
  - appointment_id (FK)
  - patient_id (FK)
  - professional_id (FK)
  - amount
  - platform_fee
  - professional_amount
  - stripe_payment_intent_id
  - stripe_transfer_id
  - status (pending | completed | refunded)
  - created_at

-- Fraud Events
fraud_events
  - id (UUID)
  - user_id (FK)
  - appointment_id (FK)
  - fraud_score (0-100)
  - decision (approve | review | block)
  - reasons (JSON array)
  - details (JSON)
  - created_at

-- Disputes
disputes
  - id (UUID)
  - appointment_id (FK)
  - reported_by (FK users)
  - reason
  - description
  - status (open | investigating | resolved_patient | resolved_professional | closed)
  - created_at
  - resolved_at
```

### 6.3 APIs Externes

**Paiements :**
- Stripe (cartes bancaires internationales)
- D17 API (paiement mobile Tunisie)

**Communications :**
- Twilio (SMS)
- SendGrid (emails transactionnels)
- OneSignal (push notifications)

**Géolocalisation :**
- Google Maps API (adresses, navigation)
- Mapbox (alternative)

**Stockage :**
- AWS S3 (documents, photos)
- Cloudinary (images optimisées)

**Analytics :**
- Google Analytics
- Mixpanel (product analytics)
- Sentry (error tracking)

### 6.4 Performance

**Objectifs :**
- Time to First Byte (TTFB) : <200ms
- First Contentful Paint (FCP) : <1s
- Largest Contentful Paint (LCP) : <2.5s
- Time to Interactive (TTI) : <3s
- Lighthouse Score : >90

**Optimisations :**
- Code splitting (React.lazy)
- Image optimization (WebP, lazy loading)
- CDN pour assets statiques
- Caching agressif (Redis)
- Compression Gzip/Brotli
- Minification JS/CSS

### 6.5 Disponibilité

**SLA (Service Level Agreement) :**
- Disponibilité : 99.9% (8h downtime/an max)
- Temps de réponse API : <300ms (p95)
- Support : 24/7 pour incidents critiques

**Monitoring :**
- Uptime monitoring (UptimeRobot)
- APM (Application Performance Monitoring)
- Logs centralisés (ELK Stack)
- Alertes automatiques (PagerDuty)

---

## 📱 7. Interfaces et Design

### 7.1 Design System

**Palette de Couleurs :**
```css
/* Primary */
--teal-50: #f0fdfa
--teal-100: #ccfbf1
--teal-500: #14b8a6
--teal-600: #0d9488  /* Principal */
--teal-700: #0f766e

/* Secondary */
--blue-500: #3b82f6
--blue-600: #2563eb

/* Accent */
--purple-500: #a855f7
--orange-500: #f97316
--red-500: #ef4444
--green-500: #22c55e

/* Neutrals */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-600: #4b5563
--gray-900: #111827
```

**Typographie :**
- Font principale : System fonts (Inter, SF Pro)
- Headings : font-bold
- Body : font-normal
- Tailles : text-xs à text-4xl

**Composants UI :**
- Button (primary, secondary, outline)
- Card (avec hover, padding variants)
- Badge (status colors)
- Input (avec icônes, validation)
- Modal (overlay, animations)
- Toast (notifications)
- Tabs (navigation)
- Dropdown
- Calendar
- Avatar

### 7.2 Pages Principales

**1. Landing Page**
- Hero avec CTA
- Services proposés (grid)
- Comment ça marche (steps)
- Témoignages patients
- Statistiques (professionnels, patients, villes)
- FAQ
- Footer

**2. Dashboard Patient**
- Vue d'ensemble (prochains RDV, santé)
- Actions rapides (réserver, messages)
- En attente de validation (cards)
- Rendez-vous à venir
- Objectifs santé
- Cercle familial
- Accès rapide (messages, récompenses, concierge)

**3. Dashboard Professionnel**
- Statistiques (revenus, réservations, avis)
- Calendrier
- Réservations du jour
- Messages patients
- Performances
- Paiements en attente

**4. Réservation (Multi-étapes)**
- Étape 1 : Sélection service
- Étape 2 : Choix professionnel
- Étape 3 : Détails prestation
- Étape 4 : Informations patient
- Étape 5 : Paiement (Carte ou D17)
- Étape 6 : Confirmation

**5. Profil Professionnel (Public)**
- Photo + nom + profession
- Note moyenne + nombre d'avis
- Services proposés + tarifs
- Présentation
- Expérience
- Disponibilités
- Avis patients
- Bouton "Réserver"

**6. Admin Dashboard**
- Vue d'ensemble (KPIs)
- Gestion utilisateurs
- Validation professionnels
- Détection fraude
- Litiges
- Rapports financiers

### 7.3 Responsive Design

**Breakpoints :**
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 640px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

**Approche :**
- Mobile-first design
- Grids responsive (1 col mobile, 2-3 cols desktop)
- Navigation adaptative (hamburger mobile, navbar desktop)
- Touch-friendly (boutons min 44x44px)
- Images optimisées par device

---

## 🚀 8. Plan de Développement

### 8.1 Phases du Projet

**Phase 1 : MVP (3 mois) - Q1 2025**

**Objectifs :**
- Lancer avec services de soins à domicile uniquement
- 100 professionnels validés
- 1000 patients inscrits
- Tunis et Ariana uniquement

**Fonctionnalités :**
- ✅ Inscription patient/professionnel
- ✅ Profils et recherche
- ✅ Réservation de services
- ✅ Paiement carte bancaire (Stripe)
- ✅ Système de validation escrow
- ✅ Messagerie basique
- ✅ Avis et notes
- ✅ Dashboard patient/professionnel
- ✅ Admin basique

**Livrables :**
- Application web responsive
- Backend API
- Base de données
- Paiements fonctionnels
- Documentation technique

**Phase 2 : Expansion Services (2 mois) - Q2 2025**

**Objectifs :**
- Ajouter laboratoires, radiologie, ambulance
- 500 professionnels
- 5000 patients
- Extension à Sfax, Sousse

**Fonctionnalités :**
- ✅ Inscription établissements
- ✅ Gestion multi-services
- ✅ Paiement D17 (Sobflous)
- ✅ Détection de fraude
- ✅ Programme de fidélité
- ✅ Cercle familial
- ✅ Notifications push

**Phase 3 : Optimisation (2 mois) - Q3 2025**

**Objectifs :**
- Ajouter salles de sport, nutrition, équipement
- 1000 professionnels
- 10 000 patients
- Couverture nationale (8 villes)

**Fonctionnalités :**
- ✅ Abonnements professionnels
- ✅ Analytics avancées
- ✅ Campagnes marketing
- ✅ Assurance annulation
- ✅ API publique
- ✅ App mobile (iOS/Android)

**Phase 4 : Scale (Continu) - Q4 2025+**

**Objectifs :**
- 5000+ professionnels
- 50 000+ patients
- Expansion régionale (Maghreb)

**Fonctionnalités :**
- ✅ IA pour matching patient-professionnel
- ✅ Téléconsultation vidéo
- ✅ Dossier médical partagé
- ✅ Intégration assurances
- ✅ Marketplace équipements
- ✅ Partenariats hôpitaux

### 8.2 Équipe Requise

**Phase MVP (3 mois) :**
- 1 Product Manager
- 2 Développeurs Full-Stack (React + Node.js)
- 1 Designer UI/UX
- 1 QA Tester
- 1 DevOps

**Phase Expansion (après MVP) :**
- +1 Développeur Backend
- +1 Développeur Mobile (React Native)
- +1 Data Analyst
- +2 Support Client
- +1 Community Manager

**Phase Scale :**
- +2 Développeurs
- +1 Product Manager
- +5 Support Client
- +2 Sales/BD
- +1 Legal/Compliance

### 8.3 Budget Estimé

**Phase MVP (3 mois) :**
```
Développement : 60 000 TND
Design : 15 000 TND
Infrastructure : 5 000 TND
Marketing : 20 000 TND
Légal : 10 000 TND

TOTAL MVP : 110 000 TND
```

**Année 1 (Opérationnel) :**
```
Équipe (10 personnes) : 600 000 TND
Infrastructure : 180 000 TND
Marketing : 360 000 TND
Support : 120 000 TND
Légal & Compta : 60 000 TND
Divers : 120 000 TND

TOTAL ANNÉE 1 : 1 440 000 TND
```

---

## 📊 9. KPIs et Métriques

### 9.1 Métriques Business

**Acquisition :**
- Nouveaux patients/mois
- Nouveaux professionnels/mois
- Coût d'acquisition client (CAC)
- Taux de conversion landing page

**Engagement :**
- Réservations/patient/mois
- Taux de réservation complétée
- Taux de validation immédiate (>60%)
- Taux de validation <24h (>85%)
- Taux d'annulation (<10%)

**Rétention :**
- Taux de rétention patients (M1, M3, M6)
- Taux de rétention professionnels
- Churn rate (<5%/mois)
- NPS (Net Promoter Score) >50

**Revenus :**
- GMV (Gross Merchandise Value)
- Revenus commission
- Revenus abonnements
- Panier moyen
- LTV (Lifetime Value) / CAC >3

### 9.2 Métriques Produit

**Performance :**
- Temps de chargement pages (<2s)
- Taux d'erreur API (<0.1%)
- Disponibilité (>99.9%)
- Temps de réponse support (<2h)

**Qualité :**
- Note moyenne professionnels (>4.5/5)
- Taux de litige (<2%)
- Taux de fraude détectée
- Taux de faux positifs fraude (<3%)

**Utilisation :**
- DAU/MAU (Daily/Monthly Active Users)
- Sessions/utilisateur/mois
- Durée moyenne session
- Pages vues/session
- Taux de rebond (<40%)

### 9.3 Objectifs Année 1

**Mois 3 (Fin MVP) :**
- 100 professionnels actifs
- 1 000 patients inscrits
- 500 réservations/mois
- 30 000 TND GMV/mois

**Mois 6 :**
- 300 professionnels
- 3 000 patients
- 3 000 réservations/mois
- 180 000 TND GMV/mois

**Mois 12 :**
- 1 000 professionnels
- 10 000 patients
- 20 000 réservations/mois
- 1 200 000 TND GMV/mois
- Break-even atteint

---

## ⚠️ 10. Risques et Mitigation

### 10.1 Risques Identifiés

**Risques Business :**

**1. Adoption lente par les professionnels**
- **Impact :** Élevé
- **Probabilité :** Moyenne
- **Mitigation :**
  - Programme d'incitation (0% commission 3 premiers mois)
  - Support onboarding dédié
  - Campagne de communication ciblée
  - Partenariats avec ordres professionnels

**2. Concurrence agressive**
- **Impact :** Élevé
- **Probabilité :** Élevée
- **Mitigation :**
  - Différenciation par la qualité
  - Programme de fidélité fort
  - Innovation continue
  - Barrières à l'entrée (réseau, données)

**3. Réglementation changeante**
- **Impact :** Moyen
- **Probabilité :** Moyenne
- **Mitigation :**
  - Veille réglementaire active
  - Conseil juridique permanent
  - Flexibilité architecture
  - Relations institutionnelles

**Risques Techniques :**

**1. Problèmes de scalabilité**
- **Impact :** Élevé
- **Probabilité :** Moyenne
- **Mitigation :**
  - Architecture cloud scalable (AWS)
  - Load testing réguliers
  - Monitoring proactif
  - Plan de scaling documenté

**2. Faille de sécurité**
- **Impact :** Critique
- **Probabilité :** Faible
- **Mitigation :**
  - Audits sécurité trimestriels
  - Bug bounty program
  - Chiffrement end-to-end
  - Plan de réponse incident

**3. Panne système**
- **Impact :** Élevé
- **Probabilité :** Faible
- **Mitigation :**
  - Redondance infrastructure
  - Backups automatiques
  - Plan de reprise d'activité (PRA)
  - Monitoring 24/7

**Risques Opérationnels :**

**1. Fraude massive**
- **Impact :** Élevé
- **Probabilité :** Moyenne
- **Mitigation :**
  - Système de détection temps réel
  - Validation manuelle cas suspects
  - Limites par utilisateur
  - Blacklist partagée

**2. Litiges patients-professionnels**
- **Impact :** Moyen
- **Probabilité :** Élevée
- **Mitigation :**
  - Processus de médiation clair
  - Assurance responsabilité
  - Documentation complète
  - Support client réactif

**3. Qualité de service insuffisante**
- **Impact :** Élevé
- **Probabilité :** Moyenne
- **Mitigation :**
  - Vérification stricte professionnels
  - Système d'avis transparent
  - Déréférencement si <4/5
  - Formation continue

### 10.2 Plan de Contingence

**Scénario 1 : Croissance trop rapide**
- Levée de fonds accélérée
- Recrutement express
- Limitation géographique temporaire
- Partenariats stratégiques

**Scénario 2 : Croissance trop lente**
- Pivot business model
- Focus niche rentable
- Réduction coûts
- Extension services

**Scénario 3 : Incident sécurité majeur**
- Activation cellule de crise
- Communication transparente
- Compensation clients
- Audit complet + correctifs

---

## 📞 11. Support et Maintenance

### 11.1 Support Client

**Canaux :**
- Chat en ligne (9h-18h, 7j/7)
- Email (support@plateforme.tn)
- Téléphone (+216 XX XXX XXX)
- FAQ / Centre d'aide
- Chatbot IA (24/7)

**SLA Support :**
- Critique : <1h
- Urgent : <4h
- Normal : <24h
- Bas : <48h

**Équipe Support :**
- 2 agents (Phase MVP)
- 5 agents (Mois 6)
- 10 agents (Mois 12)

### 11.2 Maintenance

**Maintenance Préventive :**
- Mises à jour sécurité : Hebdomadaire
- Mises à jour fonctionnelles : Bi-mensuel
- Optimisations performance : Mensuel
- Audits sécurité : Trimestriel

**Maintenance Corrective :**
- Bugs critiques : <4h
- Bugs majeurs : <24h
- Bugs mineurs : <1 semaine

**Fenêtres de Maintenance :**
- Dimanche 2h-6h (heure creuse)
- Notification 48h à l'avance
- Durée max : 2h

---

## 📄 12. Annexes

### 12.1 Glossaire

**GMV (Gross Merchandise Value) :** Valeur brute des transactions  
**CAC (Customer Acquisition Cost) :** Coût d'acquisition client  
**LTV (Lifetime Value) :** Valeur vie client  
**NPS (Net Promoter Score) :** Score de recommandation  
**Escrow :** Paiement séquestre  
**Churn :** Taux d'attrition  
**SLA (Service Level Agreement) :** Accord niveau de service  
**PRA (Plan de Reprise d'Activité) :** Disaster recovery plan  

### 12.2 Références

- RGPD : Règlement Général sur la Protection des Données
- Loi tunisienne sur la santé numérique
- Stripe Documentation : https://stripe.com/docs
- React Documentation : https://react.dev
- Tailwind CSS : https://tailwindcss.com

### 12.3 Contacts

**Équipe Projet :**
- Product Manager : [Nom] - [Email]
- Tech Lead : [Nom] - [Email]
- Designer : [Nom] - [Email]

**Parties Prenantes :**
- CEO : [Nom] - [Email]
- CTO : [Nom] - [Email]
- Investisseurs : [Nom] - [Email]

---

## ✅ 13. Validation et Signatures

**Document préparé par :** [Nom]  
**Date :** Janvier 2025  
**Version :** 1.0

**Validations requises :**

| Rôle | Nom | Signature | Date |
|------|-----|-----------|------|
| Product Manager | | | |
| Tech Lead | | | |
| CEO | | | |
| Investisseur | | | |

---

**Fin du Cahier des Charges**

*Ce document est confidentiel et propriétaire. Toute reproduction ou distribution non autorisée est interdite.*
