
# Spécification Technique - Système de Détection de Fraude par IA

## Table des Matières
1. [Vue d'ensemble](#1-vue-densemble)
2. [Architecture Technique](#2-architecture-technique)
3. [Modèles ML & Algorithmes](#3-modèles-ml--algorithmes)
4. [API & Intégrations](#4-api--intégrations)
5. [Base de Données](#5-base-de-données)
6. [Sécurité & Conformité](#6-sécurité--conformité)
7. [Monitoring & Alertes](#7-monitoring--alertes)
8. [Plan d'Implémentation](#8-plan-dimplémentation)

---

## 1. Vue d'ensemble

### 1.1 Objectifs

**Objectif Principal:** Réduire la fraude de 4% GMV à 0.6% GMV (-85%) via détection automatisée par IA.

**Objectifs Secondaires:**
- Automatiser 90% des vérifications professionnels
- Réduire les chargebacks de 75%
- Détecter 85% des faux avis
- Diminuer les coûts d'investigation de 80%

### 1.2 Périmètre Fonctionnel

**Phase 1 (M6-M9) - MVP:**
- ✅ Vérification professionnels (onboarding)
- ✅ Détection fraude paiement (Stripe Radar)
- ✅ Règles de base (seuils manuels)
- ✅ Dashboard admin basique

**Phase 2 (M10-M15) - ML:**
- ✅ Modèle scoring réservations
- ✅ Device fingerprinting
- ✅ Dashboard avancé + alertes
- ✅ API fraud scoring

**Phase 3 (M16-M24) - Avancé:**
- ✅ Détection faux avis (NLP)
- ✅ Anomalies comportementales
- ✅ Auto-apprentissage continu
- ✅ Explainability (LIME/SHAP)

### 1.3 Métriques de Succès

| Métrique | Baseline | Target | Délai |
|----------|----------|--------|-------|
| Taux de fraude | 4.0% GMV | 0.6% GMV | M18 |
| Précision modèle | N/A | 92%+ | M12 |
| Faux positifs | N/A | <3% | M12 |
| Temps vérification pro | 2-3h | 20 min | M9 |
| Économies annuelles | 0 | 280K TND | Y3 |

---

## 2. Architecture Technique

### 2.1 Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ User Actions │  │ Admin Panel  │  │ Provider App │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Node.js)                      │
│                     Rate Limiting                            │
│                     Authentication                           │
└─────────┬───────────────────────────────────────────────────┘
          │
          ├──────────────────┬──────────────────┬──────────────┐
          ▼                  ▼                  ▼              ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Main Backend    │ │ Fraud Engine │ │  ML Service  │ │  Analytics   │
│   (Node.js)      │ │  (Python)    │ │  (Python)    │ │  (BigQuery)  │
│                  │ │              │ │              │ │              │
│ - Business Logic │ │ - Rules      │ │ - Models     │ │ - Reporting  │
│ - Transactions   │ │ - Scoring    │ │ - Training   │ │ - Dashboards │
│ - Users          │ │ - Decisions  │ │ - Inference  │ │ - Metrics    │
└────────┬─────────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
         │                  │                │                │
         └──────────────────┴────────────────┴────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────┐
         │         Data Layer                        │
         │  ┌──────────┐  ┌──────────┐  ┌─────────┐│
         │  │PostgreSQL│  │  Redis   │  │ S3/Blob ││
         │  │(Primary) │  │ (Cache)  │  │(Models) ││
         │  └──────────┘  └──────────┘  └─────────┘│
         └──────────────────────────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │      External Services               │
         │  ┌──────────┐  ┌──────────┐         │
         │  │  Stripe  │  │  Twilio  │         │
         │  │  Radar   │  │  Verify  │         │
         │  └──────────┘  └──────────┘         │
         └─────────────────────────────────────┘
```

### 2.2 Stack Technologique

**Frontend:**
- React 18 + TypeScript
- TailwindCSS
- React Query (data fetching)
- Recharts (visualisations)

**Backend Principal:**
- Node.js 20 + Express
- TypeScript
- PostgreSQL 15 (primary DB)
- Redis 7 (cache + queues)
- Prisma ORM

**Fraud Engine (Python):**
- Python 3.11
- FastAPI (API REST)
- Celery (async tasks)
- Redis (message broker)

**ML Service (Python):**
- Scikit-learn 1.3
- XGBoost 2.0
- TensorFlow 2.14 (NLP)
- MLflow (model registry)
- SHAP (explainability)

**Infrastructure:**
- Cloud: AWS / DigitalOcean
- Container: Docker + Kubernetes
- CI/CD: GitHub Actions
- Monitoring: Prometheus + Grafana
- Logs: ELK Stack (Elasticsearch, Logstash, Kibana)

### 2.3 Flux de Données

**Événement → Détection → Décision:**

```python
# Pseudo-code flux détection

# 1. Événement déclenché (réservation, inscription, etc.)
event = {
    'type': 'booking_created',
    'user_id': 12345,
    'provider_id': 678,
    'amount': 65.00,
    'timestamp': '2025-01-15T14:30:00Z',
    'metadata': {...}
}

# 2. Extraction features (temps réel)
features = extract_features(event)
# → 45+ variables (comportement, paiement, réseau, temporel)

# 3. Scoring ML (< 50ms)
fraud_score = ml_model.predict_proba(features)[0][1] * 100
# → Score 0-100%

# 4. Décision automatique
if fraud_score < 30:
    decision = 'APPROVE'
    action = 'allow_transaction'
elif fraud_score < 70:
    decision = 'REVIEW'
    action = 'flag_for_manual_review'
else:
    decision = 'BLOCK'
    action = 'block_transaction'

# 5. Logging + Analytics
log_fraud_event(event, features, fraud_score, decision)

# 6. Notification (si nécessaire)
if decision == 'REVIEW':
    notify_fraud_team(event, fraud_score)

# 7. Feedback loop (amélioration modèle)
if manual_review_completed:
    update_training_data(event, true_label)
```

---

## 3. Modèles ML & Algorithmes

### 3.1 Modèle 1: Scoring Réservations

**Type:** Classification binaire (Fraude / Légitime)

**Algorithme:** XGBoost (Gradient Boosting)

**Features (45 variables):**

**Comportementales (15):**
- `time_on_site` : Temps passé sur le site avant réservation
- `pages_viewed` : Nombre de pages visitées
- `booking_speed` : Vitesse de réservation (secondes)
- `navigation_pattern` : Pattern de navigation (score 0-1)
- `form_fill_speed` : Vitesse de remplissage formulaire
- `copy_paste_detected` : Détection copier-coller (booléen)
- `mouse_movement_score` : Score mouvement souris (0-1)
- `keyboard_dynamics` : Dynamique frappe clavier
- `session_count` : Nombre de sessions avant réservation
- `referrer_type` : Type de référent (direct, search, social)
- `browser_language` : Langue navigateur
- `timezone_offset` : Décalage horaire
- `screen_resolution` : Résolution écran
- `user_agent` : User agent (parsed)
- `incognito_mode` : Mode navigation privée détecté

**Historique Utilisateur (12):**
- `account_age_days` : Âge du compte (jours)
- `total_bookings` : Nombre total de réservations
- `completed_bookings` : Réservations complétées
- `cancelled_bookings` : Réservations annulées
- `no_show_rate` : Taux de no-show (%)
- `avg_booking_amount` : Montant moyen réservations
- `days_since_last_booking` : Jours depuis dernière réservation
- `provider_diversity` : Nombre de professionnels différents
- `service_diversity` : Nombre de services différents
- `review_count` : Nombre d'avis laissés
- `avg_rating_given` : Note moyenne donnée
- `complaint_count` : Nombre de plaintes

**Paiement (10):**
- `payment_method` : Méthode de paiement (card, mobile)
- `card_bin` : BIN carte (6 premiers chiffres)
- `card_country` : Pays de la carte
- `card_type` : Type de carte (credit, debit)
- `card_brand` : Marque (Visa, Mastercard)
- `payment_velocity` : Vélocité paiements (24h)
- `amount_deviation` : Écart montant vs historique (z-score)
- `payment_time_of_day` : Heure du paiement (0-23)
- `payment_day_of_week` : Jour de la semaine (0-6)
- `stripe_radar_score` : Score Stripe Radar (0-100)

**Réseau & Device (8):**
- `ip_address` : Adresse IP (hashée)
- `ip_country` : Pays IP
- `ip_vpn_detected` : VPN/Proxy détecté (booléen)
- `ip_blacklisted` : IP blacklistée (booléen)
- `device_fingerprint` : Empreinte device (hashée)
- `device_count_24h` : Nombre de devices utilisés (24h)
- `ip_count_24h` : Nombre d'IPs utilisées (24h)
- `email_domain` : Domaine email (free vs custom)

**Hyperparamètres XGBoost:**
```python
params = {
    'max_depth': 6,
    'learning_rate': 0.1,
    'n_estimators': 200,
    'objective': 'binary:logistic',
    'eval_metric': 'auc',
    'scale_pos_weight': 10,  # Imbalanced dataset
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'min_child_weight': 5,
    'gamma': 0.1,
    'reg_alpha': 0.1,
    'reg_lambda': 1.0
}
```

**Performance Attendue:**
- Précision: 92-95%
- Recall: 85-90%
- F1-Score: 88-92%
- AUC-ROC: 0.95+
- Faux positifs: <3%

### 3.2 Modèle 2: Vérification Professionnels

**Type:** Multi-class classification + OCR + NLP

**Pipeline:**

**Étape 1: OCR (Extraction Données):**
- Tesseract OCR + Google Vision API
- Extraction: Nom, Prénom, N° diplôme, Date, Institution

**Étape 2: NLP (Validation Cohérence):**
- BERT fine-tuned (détection anomalies textuelles)
- Vérification cohérence dates, noms, institutions

**Étape 3: Cross-Check Bases Officielles:**
- API CNOM (Conseil National Ordre Médecins)
- API Ordre National des Infirmiers
- Bases de données publiques

**Étape 4: Scoring Final:**
```python
confidence_score = (
    ocr_confidence * 0.3 +
    nlp_coherence * 0.2 +
    database_match * 0.4 +
    document_quality * 0.1
) * 100
```

**Décisions:**
- Score > 85% : ✅ Auto-approuvé
- Score 60-85% : ⚠️ Vérification manuelle
- Score < 60% : 🚫 Rejet + demande nouveaux documents

### 3.3 Modèle 3: Détection Faux Avis (NLP)

**Type:** Classification binaire (Faux / Authentique)

**Algorithme:** BERT fine-tuned + Features manuelles

**Features Textuelles (BERT):**
- Embeddings 768 dimensions
- Analyse sentiment
- Détection patterns génériques

**Features Manuelles (15):**
- `review_length` : Longueur avis (caractères)
- `word_count` : Nombre de mots
- `sentence_count` : Nombre de phrases
- `avg_word_length` : Longueur moyenne mots
- `punctuation_ratio` : Ratio ponctuation
- `capital_ratio` : Ratio majuscules
- `emoji_count` : Nombre d'emojis
- `exclamation_count` : Nombre de "!"
- `question_count` : Nombre de "?"
- `positive_words` : Nombre mots positifs
- `negative_words` : Nombre mots négatifs
- `generic_phrases` : Détection phrases génériques
- `copy_paste_similarity` : Similarité avec autres avis (cosine)
- `time_since_booking` : Temps depuis réservation (heures)
- `review_velocity` : Nombre d'avis utilisateur (24h)

**Signaux Comportementaux:**
- Compte créé récemment (<7 jours)
- Pas d'historique réservations
- Burst reviews (5+ avis en 1h)
- Liens entre comptes (IP, device)

**Performance Attendue:**
- Précision: 88-92%
- Recall: 80-85%
- F1-Score: 84-88%

### 3.4 Entraînement & Déploiement

**Données d'Entraînement:**
- Dataset initial: 10,000 transactions (80% légitimes, 20% fraude)
- Augmentation: SMOTE (Synthetic Minority Over-sampling)
- Validation: 70% train, 15% validation, 15% test
- Cross-validation: 5-fold stratified

**Pipeline MLOps:**

```yaml
# .github/workflows/ml-pipeline.yml

name: ML Pipeline

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly retraining (dimanche 2h)
  workflow_dispatch:

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch training data
        run: python scripts/fetch_training_data.py
      
      - name: Train model
        run: python scripts/train_model.py
      
      - name: Evaluate model
        run: python scripts/evaluate_model.py
      
      - name: Compare with production
        run: python scripts/compare_models.py
      
      - name: Deploy if better
        if: steps.compare.outputs.is_better == 'true'
        run: python scripts/deploy_model.py
      
      - name: Notify team
        run: python scripts/notify_slack.py
```

**Versioning Modèles:**
- MLflow Model Registry
- Versioning sémantique (v1.2.3)
- A/B testing (10% trafic nouveau modèle)
- Rollback automatique si dégradation

---

## 4. API & Intégrations

### 4.1 API Fraud Scoring

**Endpoint:** `POST /api/v1/fraud/score`

**Request:**
```json
{
  "event_type": "booking_created",
  "user_id": 12345,
  "provider_id": 678,
  "amount": 65.00,
  "payment_method": "card",
  "metadata": {
    "ip_address": "41.230.45.123",
    "device_fingerprint": "abc123...",
    "session_id": "sess_xyz",
    "user_agent": "Mozilla/5.0...",
    "referrer": "https://google.com"
  }
}
```

**Response:**
```json
{
  "fraud_score": 42.5,
  "decision": "REVIEW",
  "risk_level": "MEDIUM",
  "reasons": [
    "New account (<7 days)",
    "High booking speed (15 seconds)",
    "VPN detected"
  ],
  "recommended_actions": [
    "Manual review by fraud team",
    "Request additional verification"
  ],
  "model_version": "v1.3.2",
  "processing_time_ms": 38
}
```

**Rate Limits:**
- 1000 req/min (authenticated)
- 100 req/min (unauthenticated)

### 4.2 Intégration Stripe Radar

**Configuration:**
```javascript
// Backend: Stripe Radar integration

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Enable Radar on payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 6500, // 65.00 TND
  currency: 'tnd',
  payment_method_types: ['card'],
  metadata: {
    user_id: '12345',
    booking_id: 'book_abc123'
  },
  // Radar automatically evaluates
  radar_options: {
    session: sessionId // From Stripe.js
  }
});

// Check Radar outcome
const radarScore = paymentIntent.charges.data[0].outcome.risk_score;
const radarLevel = paymentIntent.charges.data[0].outcome.risk_level;

if (radarLevel === 'highest' || radarScore > 75) {
  // Block transaction
  await stripe.paymentIntents.cancel(paymentIntent.id);
  return { status: 'blocked', reason: 'High fraud risk' };
}
```

**Règles Stripe Radar:**
- Block if risk_score > 75
- Review if risk_score 50-75
- Allow if risk_score < 50

### 4.3 Device Fingerprinting

**Frontend (FingerprintJS):**
```typescript
// components/FraudDetection.tsx

import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function getDeviceFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  
  return {
    visitorId: result.visitorId,
    confidence: result.confidence.score,
    components: {
      canvas: result.components.canvas,
      webgl: result.components.webgl,
      audio: result.components.audio,
      fonts: result.components.fonts,
      plugins: result.components.plugins,
      timezone: result.components.timezone,
      languages: result.components.languages,
      screenResolution: result.components.screenResolution
    }
  };
}

// Usage lors de la réservation
const fingerprint = await getDeviceFingerprint();

await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...bookingData,
    device_fingerprint: fingerprint.visitorId
  })
});
```

### 4.4 Twilio Verify (2FA)

**Backend:**
```javascript
// services/twoFactorAuth.js

const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send verification code
async function sendVerificationCode(phoneNumber) {
  const verification = await twilio.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications
    .create({ to: phoneNumber, channel: 'sms' });
  
  return verification.status; // 'pending'
}

// Check verification code
async function checkVerificationCode(phoneNumber, code) {
  const verificationCheck = await twilio.verify.v2
    .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks
    .create({ to: phoneNumber, code: code });
  
  return verificationCheck.status === 'approved';
}

// Usage: Trigger 2FA si fraud_score > 50
if (fraudScore > 50) {
  await sendVerificationCode(user.phone);
  return { status: 'verification_required' };
}
```

---

## 5. Base de Données

### 5.1 Schéma PostgreSQL

```sql
-- Table: fraud_events
CREATE TABLE fraud_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL, -- booking_created, payment_processed, etc.
  user_id INTEGER REFERENCES users(id),
  provider_id INTEGER REFERENCES providers(id),
  booking_id INTEGER REFERENCES bookings(id),
  
  -- Fraud scoring
  fraud_score DECIMAL(5,2) NOT NULL, -- 0.00 - 100.00
  decision VARCHAR(20) NOT NULL, -- APPROVE, REVIEW, BLOCK
  risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  
  -- Features (JSONB for flexibility)
  features JSONB NOT NULL,
  
  -- Model info
  model_version VARCHAR(20) NOT NULL,
  processing_time_ms INTEGER,
  
  -- Manual review
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES admin_users(id),
  true_label VARCHAR(20), -- FRAUD, LEGITIMATE (after review)
  review_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_fraud_events_user (user_id),
  INDEX idx_fraud_events_decision (decision),
  INDEX idx_fraud_events_score (fraud_score),
  INDEX idx_fraud_events_created (created_at)
);

-- Table: fraud_rules
CREATE TABLE fraud_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  rule_type VARCHAR(50) NOT NULL, -- threshold, velocity, blacklist
  
  -- Rule configuration (JSONB)
  config JSONB NOT NULL,
  -- Example: {"field": "booking_speed", "operator": "<", "value": 10}
  
  -- Actions
  action VARCHAR(20) NOT NULL, -- BLOCK, REVIEW, FLAG
  priority INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: fraud_blacklist
CREATE TABLE fraud_blacklist (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL, -- ip, email, device, card_bin
  entity_value VARCHAR(255) NOT NULL,
  reason TEXT,
  severity VARCHAR(20) DEFAULT 'HIGH', -- LOW, MEDIUM, HIGH, CRITICAL
  
  -- Expiration
  expires_at TIMESTAMP,
  
  -- Metadata
  added_by INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(entity_type, entity_value)
);

-- Table: fraud_alerts
CREATE TABLE fraud_alerts (
  id SERIAL PRIMARY KEY,
  alert_type VARCHAR(50) NOT NULL, -- spike_detected, new_pattern, model_drift
  severity VARCHAR(20) NOT NULL, -- INFO, WARNING, CRITICAL
  message TEXT NOT NULL,
  
  -- Related entities
  fraud_event_id UUID REFERENCES fraud_events(id),
  
  -- Status
  status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, ACKNOWLEDGED, RESOLVED
  acknowledged_by INTEGER REFERENCES admin_users(id),
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: model_versions
CREATE TABLE model_versions (
  id SERIAL PRIMARY KEY,
  version VARCHAR(20) NOT NULL UNIQUE,
  model_type VARCHAR(50) NOT NULL, -- booking_fraud, review_fraud, etc.
  
  -- Performance metrics
  accuracy DECIMAL(5,4),
  precision DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  auc_roc DECIMAL(5,4),
  
  -- Deployment
  status VARCHAR(20) DEFAULT 'TRAINING', -- TRAINING, TESTING, PRODUCTION, DEPRECATED
  deployed_at TIMESTAMP,
  deprecated_at TIMESTAMP,
  
  -- Metadata
  training_data_size INTEGER,
  training_duration_seconds INTEGER,
  model_file_path VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Redis Cache Structure

```redis
# Fraud scores cache (TTL: 1 hour)
fraud:score:user:{user_id} → {fraud_score, timestamp}

# Device fingerprints (TTL: 30 days)
fraud:device:{fingerprint} → {user_ids[], first_seen, last_seen}

# IP tracking (TTL: 24 hours)
fraud:ip:{ip_address} → {user_ids[], request_count, first_seen}

# Velocity tracking (TTL: 24 hours)
fraud:velocity:user:{user_id}:bookings → {count, timestamps[]}
fraud:velocity:card:{card_bin}:payments → {count, amounts[], timestamps[]}

# Blacklists (TTL: 7 days, refreshed daily)
fraud:blacklist:ip → Set{ip_addresses}
fraud:blacklist:email → Set{email_domains}
fraud:blacklist:device → Set{device_fingerprints}

# Model cache (TTL: 1 hour)
fraud:model:current_version → "v1.3.2"
fraud:model:features:{event_id} → {features_json}
```

---

## 6. Sécurité & Conformité

### 6.1 Protection Données (RGPD)

**Principes:**
- ✅ Minimisation données (collecter uniquement nécessaire)
- ✅ Pseudonymisation (hash IPs, devices)
- ✅ Chiffrement au repos (AES-256)
- ✅ Chiffrement en transit (TLS 1.3)
- ✅ Droit à l'oubli (suppression données sur demande)
- ✅ Droit d'accès (export données utilisateur)
- ✅ Consentement explicite (CGU)

**Implémentation:**

```javascript
// services/dataProtection.js

const crypto = require('crypto');

// Pseudonymisation IP
function pseudonymizeIP(ipAddress) {
  const hash = crypto.createHash('sha256');
  hash.update(ipAddress + process.env.IP_SALT);
  return hash.digest('hex').substring(0, 16);
}

// Pseudonymisation device fingerprint
function pseudonymizeDevice(fingerprint) {
  const hash = crypto.createHash('sha256');
  hash.update(fingerprint + process.env.DEVICE_SALT);
  return hash.digest('hex').substring(0, 16);
}

// Anonymisation données après 90 jours
async function anonymizeOldFraudEvents() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  await db.fraudEvents.updateMany(
    { created_at: { $lt: ninetyDaysAgo } },
    {
      $set: {
        'features.ip_address': 'ANONYMIZED',
        'features.device_fingerprint': 'ANONYMIZED',
        'features.email': 'ANONYMIZED'
      }
    }
  );
}
```

### 6.2 Explainability (LIME/SHAP)

**Obligation légale:** Droit à l'explication (RGPD Article 22)

**Implémentation SHAP:**

```python
# services/ml/explainability.py

import shap
import pickle

# Load model
with open('models/fraud_model_v1.3.2.pkl', 'rb') as f:
    model = pickle.load(f)

# Initialize SHAP explainer
explainer = shap.TreeExplainer(model)

def explain_prediction(features):
    """
    Explique pourquoi une prédiction a été faite
    
    Returns:
        {
            'fraud_score': 72.5,
            'top_reasons': [
                {'feature': 'booking_speed', 'impact': +25.3, 'value': '8 seconds'},
                {'feature': 'account_age_days', 'impact': +18.7, 'value': '2 days'},
                {'feature': 'vpn_detected', 'impact': +12.1, 'value': 'true'}
            ]
        }
    """
    # Calculate SHAP values
    shap_values = explainer.shap_values(features)
    
    # Get top contributing features
    feature_importance = list(zip(
        features.columns,
        shap_values[0],
        features.iloc[0].values
    ))
    
    # Sort by absolute impact
    feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)
    
    # Format top 5 reasons
    top_reasons = []
    for feature_name, impact, value in feature_importance[:5]:
        top_reasons.append({
            'feature': feature_name,
            'impact': round(impact, 1),
            'value': str(value),
            'description': FEATURE_DESCRIPTIONS.get(feature_name, '')
        })
    
    return {
        'fraud_score': model.predict_proba(features)[0][1] * 100,
        'top_reasons': top_reasons
    }
```

**Affichage utilisateur:**

```typescript
// components/FraudExplanation.tsx

interface FraudExplanationProps {
  fraudScore: number;
  reasons: Array<{
    feature: string;
    impact: number;
    value: string;
    description: string;
  }>;
}

export function FraudExplanation({ fraudScore, reasons }: FraudExplanationProps) {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <h3 className="font-bold text-gray-900 mb-4">
        Pourquoi cette vérification ?
      </h3>
      <p className="text-sm text-gray-700 mb-4">
        Pour votre sécurité, nous avons détecté des éléments inhabituels :
      </p>
      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-amber-600">•</span>
            <span className="text-gray-700">{reason.description}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-600 mt-4">
        Vous pouvez contacter notre support pour plus d'informations.
      </p>
    </Card>
  );
}
```

### 6.3 Audit Trail

**Logging complet:**

```javascript
// services/auditLog.js

async function logFraudDecision(fraudEvent) {
  await db.auditLogs.create({
    event_type: 'FRAUD_DECISION',
    user_id: fraudEvent.user_id,
    admin_id: fraudEvent.reviewed_by,
    action: fraudEvent.decision,
    details: {
      fraud_score: fraudEvent.fraud_score,
      model_version: fraudEvent.model_version,
      reasons: fraudEvent.features.top_reasons,
      ip_address: fraudEvent.features.ip_address,
      timestamp: new Date().toISOString()
    },
    created_at: new Date()
  });
}
```

---

## 7. Monitoring & Alertes

### 7.1 Métriques Temps Réel

**Dashboard Grafana:**

**Panel 1: Fraud Overview**
- Tentatives fraude détectées (aujourd'hui/semaine/mois)
- Taux de fraude (% GMV)
- Économies réalisées (TND)
- Transactions bloquées vs approuvées

**Panel 2: Model Performance**
- Précision modèle (%)
- Faux positifs (%)
- Faux négatifs (%)
- Temps d'inférence (ms)
- Drift score

**Panel 3: Operational**
- Temps moyen review manuelle (min)
- Backlog reviews en attente
- Taux de résolution 1er contact (%)
- Alertes ouvertes

**Panel 4: Top Patterns**
- Top 10 raisons de blocage
- Top 10 IPs suspectes
- Top 10 devices suspects
- Tendances fraude (graphique temporel)

### 7.2 Alertes Automatiques

**Prometheus Alerting Rules:**

```yaml
# prometheus/alerts.yml

groups:
  - name: fraud_detection
    interval: 1m
    rules:
      # Spike tentatives fraude
      - alert: FraudSpikeDetected
        expr: rate(fraud_events_total{decision="BLOCK"}[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Spike de tentatives de fraude détecté"
          description: "{{ $value }} tentatives de fraude/min (seuil: 10)"
      
      # Faux positifs élevés
      - alert: HighFalsePositiveRate
        expr: (fraud_false_positives_total / fraud_reviews_total) > 0.05
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Taux de faux positifs élevé"
          description: "{{ $value }}% de faux positifs (seuil: 5%)"
      
      # Model drift
      - alert: ModelDriftDetected
        expr: fraud_model_drift_score > 0.15
        for: 30m
        labels:
          severity: critical
        annotations:
          summary: "Drift du modèle ML détecté"
          description: "Score de drift: {{ $value }} (seuil: 0.15)"
      
      # Temps inférence élevé
      - alert: SlowModelInference
        expr: fraud_inference_duration_seconds > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Temps d'inférence ML élevé"
          description: "{{ $value }}s (seuil: 100ms)"
```

**Notifications:**
- Slack: Alertes temps réel équipe fraude
- Email: Alertes critiques (model drift, spike)
- SMS: Alertes urgentes (système down)

### 7.3 Drift Detection

**Monitoring distribution features:**

```python
# services/ml/drift_detection.py

from scipy.stats import ks_2samp
import numpy as np

def detect_feature_drift(production_data, training_data, threshold=0.05):
    """
    Détecte le drift des features via test Kolmogorov-Smirnov
    
    Returns:
        {
            'drift_detected': bool,
            'drift_score': float,
            'drifted_features': list
        }
    """
    drifted_features = []
    drift_scores = []
    
    for feature in production_data.columns:
        # Test KS
        statistic, p_value = ks_2samp(
            production_data[feature],
            training_data[feature]
        )
        
        drift_scores.append(statistic)
        
        if p_value < threshold:
            drifted_features.append({
                'feature': feature,
                'ks_statistic': statistic,
                'p_value': p_value
            })
    
    drift_score = np.mean(drift_scores)
    
    return {
        'drift_detected': len(drifted_features) > 0,
        'drift_score': drift_score,
        'drifted_features': drifted_features
    }

# Exécution hebdomadaire
if __name__ == '__main__':
    production_data = fetch_last_week_data()
    training_data = load_training_data()
    
    result = detect_feature_drift(production_data, training_data)
    
    if result['drift_detected']:
        send_alert('Model drift detected', result)
        trigger_retraining()
```

---

## 8. Plan d'Implémentation

### 8.1 Phase 1: MVP (M6-M9) - 3 mois

**Objectif:** Système de base opérationnel

**Sprints:**

**Sprint 1-2 (M6):**
- ✅ Setup infrastructure (DB, Redis, Python service)
- ✅ Intégration Stripe Radar
- ✅ Règles de base (seuils manuels)
- ✅ Logging fraud events

**Sprint 3-4 (M7):**
- ✅ Vérification professionnels (OCR + NLP)
- ✅ Dashboard admin basique
- ✅ API fraud scoring (v1)

**Sprint 5-6 (M8-M9):**
- ✅ Device fingerprinting (FingerprintJS)
- ✅ Twilio Verify (2FA)
- ✅ Tests & optimisation
- ✅ Documentation

**Livrables Phase 1:**
- ✅ Système détection basique opérationnel
- ✅ 80% fraude paiement détectée (Stripe Radar)
- ✅ 90% vérifications professionnels automatisées
- ✅ Dashboard admin fonctionnel

**Budget Phase 1:** 25,000 TND

### 8.2 Phase 2: ML (M10-M15) - 6 mois

**Objectif:** Modèles ML en production

**Sprints:**

**Sprint 7-9 (M10-M11):**
- ✅ Collecte données training (10,000+ transactions)
- ✅ Feature engineering (45 variables)
- ✅ Entraînement modèle XGBoost
- ✅ Évaluation & tuning

**Sprint 10-12 (M12-M13):**
- ✅ Déploiement modèle production
- ✅ A/B testing (10% trafic)
- ✅ Monitoring performance
- ✅ Ajustements seuils

**Sprint 13-15 (M14-M15):**
- ✅ Dashboard avancé (Grafana)
- ✅ Alertes automatiques (Prometheus)
- ✅ Explainability (SHAP)
- ✅ Documentation technique

**Livrables Phase 2:**
- ✅ Modèle ML 92%+ précision
- ✅ Faux positifs <3%
- ✅ Temps inférence <50ms
- ✅ Dashboard temps réel opérationnel

**Budget Phase 2:** 18,000 TND

### 8.3 Phase 3: Avancé (M16-M24) - 9 mois

**Objectif:** Système mature & auto-apprenant

**Sprints:**

**Sprint 16-18 (M16-M17):**
- ✅ Détection faux avis (NLP/BERT)
- ✅ Anomalies comportementales
- ✅ Clustering patterns frauduleux

**Sprint 19-21 (M18-M20):**
- ✅ Auto-apprentissage continu
- ✅ Drift detection automatique
- ✅ Ré-entraînement hebdomadaire

**Sprint 22-24 (M21-M24):**
- ✅ Optimisation performance
- ✅ Réduction faux positifs (<2%)
- ✅ Expansion features (60+ variables)

**Livrables Phase 3:**
- ✅ Système mature & autonome
- ✅ Détection 90%+ fraude
- ✅ Faux positifs <2%
- ✅ ROI 890% atteint

**Budget Phase 3:** 12,000 TND/an (maintenance)

### 8.4 Roadmap Visuelle

```
M6  M7  M8  M9  M10 M11 M12 M13 M14 M15 M16 M17 M18 M19 M20 M21 M22 M23 M24
│───────────│───────────────────│─────────────────────────────────────────│
│  Phase 1  │      Phase 2      │              Phase 3                    │
│    MVP    │        ML         │            Avancé                       │
│           │                   │                                         │
├─ Stripe   ├─ Data Collection  ├─ Faux Avis (NLP)                       │
├─ Règles   ├─ Feature Eng.     ├─ Auto-learning                         │
├─ OCR/NLP  ├─ Model Training   ├─ Drift Detection                       │
├─ Dashboard├─ A/B Testing      ├─ Optimisation                          │
└─ 2FA      └─ Monitoring       └─ Expansion                             │
```

### 8.5 Équipe Requise

**Phase 1 (M6-M9):**
- 1 ML Engineer (0.5 ETP)
- 1 Backend Developer (0.8 ETP)
- 1 DevOps (0.3 ETP)
- **Total:** 1.6 ETP

**Phase 2 (M10-M15):**
- 1 ML Engineer (1.0 ETP)
- 1 Backend Developer (0.5 ETP)
- 1 Data Analyst (0.5 ETP)
- 1 DevOps (0.3 ETP)
- **Total:** 2.3 ETP

**Phase 3 (M16-M24):**
- 1 ML Engineer (0.8 ETP)
- 1 Data Analyst (0.5 ETP)
- 1 DevOps (0.2 ETP)
- **Total:** 1.5 ETP

---

## 9. Annexes

### 9.1 Glossaire

- **AUC-ROC:** Area Under the Curve - Receiver Operating Characteristic
- **BERT:** Bidirectional Encoder Representations from Transformers
- **BIN:** Bank Identification Number (6 premiers chiffres carte)
- **Chargeback:** Rétrofacturation (annulation paiement par banque)
- **Device Fingerprinting:** Empreinte unique appareil
- **Drift:** Dérive modèle (changement distribution données)
- **F1-Score:** Moyenne harmonique précision/recall
- **False Positive:** Faux positif (légitime classé fraude)
- **False Negative:** Faux négatif (fraude classée légitime)
- **GMV:** Gross Merchandise Value (volume transactions)
- **KYC:** Know Your Customer (vérification identité)
- **LIME:** Local Interpretable Model-agnostic Explanations
- **MLOps:** Machine Learning Operations
- **NLP:** Natural Language Processing
- **OCR:** Optical Character Recognition
- **Precision:** Précision (TP / (TP + FP))
- **Recall:** Rappel (TP / (TP + FN))
- **SHAP:** SHapley Additive exPlanations
- **SMOTE:** Synthetic Minority Over-sampling Technique
- **XGBoost:** Extreme Gradient Boosting

### 9.2 Références

1. Stripe Radar Documentation: https://stripe.com/docs/radar
2. FingerprintJS: https://fingerprintjs.com/
3. Twilio Verify: https://www.twilio.com/verify
4. XGBoost: https://xgboost.readthedocs.io/
5. SHAP: https://github.com/slundberg/shap
6. MLflow: https://mlflow.org/

### 9.3 Contact

**Équipe Fraud Detection:**
- Email: fraud@plateforme-soins.tn
- Slack: #fraud-detection
- On-call: +216 XX XXX XXX

---

**Document préparé par:** Équipe Technique
**Date:** Janvier 2025
**Version:** 1.0
**Statut:** Approuvé pour implémentation
