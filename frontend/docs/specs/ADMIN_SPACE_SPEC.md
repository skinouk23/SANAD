
# Spécification - Espace Administration CareAtHome

## 🔐 Accès et Authentification

### Identifiants Admin
```
Email: admin@gmail.com
Mot de passe: admin
```

### Sécurité
- **Protection des routes** : Toutes les pages admin sont protégées par le composant `AdminLayout`
- **Vérification du rôle** : Seuls les utilisateurs avec `role: 'admin'` peuvent accéder
- **Redirection automatique** : Les non-admins sont redirigés vers `/auth/login`
- **Session persistante** : L'authentification est sauvegardée dans `localStorage`

---

## 📊 Pages de l'Espace Admin

### 1. Dashboard Principal (`/admin/dashboard`)

**Fonctionnalités :**
- Vue d'ensemble des KPIs (revenus, transactions, litiges)
- Demandes d'inscription en attente
- Transactions récentes
- Actions rapides
- État du système
- Activité récente

**Statistiques Affichées :**
- Revenus du mois avec croissance
- Nombre de transactions
- Prestations en attente de validation
- Nombre de litiges actifs

**Sections :**
1. **Stats Grid** : 4 cartes avec métriques clés
2. **Demandes d'Inscription** : Liste des professionnels en attente d'approbation
3. **Transactions Récentes** : Tableau des dernières transactions
4. **Sidebar** : Actions rapides, état système, activité

---

### 2. Gestion des Transactions (`/admin/transactions`)

**Fonctionnalités :**
- Liste complète des transactions
- Filtres par statut et recherche
- Détails de chaque transaction
- Transfert vers professionnels
- Export CSV

**Statuts de Transaction :**
- ✅ **Complété** : Transaction finalisée et transférée
- ⏳ **En attente validation** : Patient n'a pas encore validé
- 📤 **En attente transfert** : Validé, prêt pour transfert
- ⚠️ **Litige** : Problème signalé
- 💰 **Remboursé** : Transaction annulée

**Actions Disponibles :**
- Voir détails complets
- Transférer au professionnel (si status = pending_transfer)
- Exporter les données

**Informations Affichées :**
```
Transaction:
- ID unique (TRX-YYYY-NNN)
- Date et heure
- Patient (nom, email)
- Professionnel (nom, email)
- Service
- Montant total
- Commission plateforme (15%)
- Montant professionnel
- Méthode de paiement
- Stripe Payment Intent ID
- Statut
```

---

### 3. Gestion des Inscriptions (`/admin/approvals`)

**Fonctionnalités :**
- Liste des demandes d'inscription
- Filtres par type (professionnel, laboratoire, radiologie, gym)
- Recherche par nom, email, ID
- Détails complets de chaque demande
- Approbation ou rejet avec raison

**Types de Demandes :**
1. **Professionnels** : Infirmiers, kinés, médecins, psychologues
2. **Laboratoires** : Centres d'analyses médicales
3. **Radiologie** : Centres d'imagerie médicale
4. **Salles de Sport** : Fitness, musculation, yoga

**Processus d'Approbation :**
```
1. RÉCEPTION
   Demande soumise par candidat
   ↓
   Apparaît dans liste "En attente"

2. VÉRIFICATION
   Admin clique "Détails"
   ↓
   Vérifie:
   - Informations personnelles
   - Documents (diplôme, licence, assurance)
   - Services proposés
   - Expérience

3. DÉCISION
   Option A: Approuver
   - Compte activé immédiatement
   - Email de confirmation envoyé
   - Professionnel peut commencer
   
   Option B: Rejeter
   - Raison obligatoire
   - Email avec explication envoyé
   - Possibilité de re-soumettre
```

**Documents Vérifiés :**
- ✅ Diplôme (obligatoire)
- ✅ Licence professionnelle (recommandé)
- ✅ Assurance RC (recommandé)
- ✅ Certification équipement (pour radiologie)

---

### 4. Gestion des Professionnels (`/admin/providers`)

**Fonctionnalités :**
- Liste de tous les professionnels actifs
- Statistiques par professionnel
- Gestion des disponibilités
- Suspension/Activation de comptes
- Historique des prestations

**Informations Affichées :**
- Profil complet
- Services proposés
- Nombre de prestations
- Revenus générés
- Note moyenne
- Statut (actif/suspendu)

---

### 5. Détection de Fraude (`/admin/fraud`)

**Fonctionnalités :**
- Dashboard de détection en temps réel
- Score de fraude par transaction
- Patterns suspects détectés
- Événements récents
- Actions de blocage/déblocage

**Signaux de Fraude :**

**Patient :**
- Nouveau compte + montant élevé
- VPN/Proxy détecté
- Vitesse de réservation suspecte
- Carte étrangère
- Taux d'annulation élevé

**Professionnel :**
- Validations immédiates répétées
- Taux de litige élevé
- Augmentation soudaine de prix
- Avis suspects

**Niveaux de Risque :**
- 🟢 **Faible** (0-30) : Approuvé automatiquement
- 🟡 **Moyen** (30-70) : Review manuelle requise
- 🔴 **Élevé** (70-100) : Bloqué automatiquement

---

### 6. Rapports (`/admin/reports`)

**Fonctionnalités :**
- Vue financière complète
- Statistiques utilisateurs
- Top professionnels
- Répartition par service
- Export PDF/Excel

**Périodes Disponibles :**
- Cette semaine
- Ce mois
- Ce trimestre
- Cette année
- Personnalisé

**Types de Rapports :**
1. **Financier** : Revenus, commissions, transferts
2. **Utilisateurs** : Patients, professionnels, rétention
3. **Services** : Répartition, popularité, revenus
4. **Professionnels** : Top performers, statistiques

**Métriques Clés :**
```
Financier:
- Revenus total
- Commission plateforme
- Montant transféré
- Nombre de transactions
- Panier moyen
- Croissance

Utilisateurs:
- Total patients
- Nouveaux patients
- Total professionnels
- Nouveaux professionnels
- Utilisateurs actifs
- Taux de rétention

Services:
- Revenus par service
- Pourcentage du total
- Nombre de prestations
- Professionnel moyen
```

---

### 7. Paramètres (`/admin/settings`)

**Sections :**

**1. Paramètres Financiers**
- Commission plateforme (%)
- Montant minimum de transfert (TND)

**2. Paramètres de Validation**
- Délai auto-validation (heures)
- Détection de fraude (ON/OFF)

**3. Notifications**
- Notifications email (ON/OFF)
- Notifications SMS (ON/OFF)

**4. Système**
- Mode maintenance (ON/OFF)

**Valeurs par Défaut :**
```typescript
{
  platformCommission: 15,        // 15%
  autoValidationDelay: 48,       // 48 heures
  minTransferAmount: 50,         // 50 TND
  emailNotifications: true,
  smsNotifications: false,
  fraudDetectionEnabled: true,
  maintenanceMode: false
}
```

---

## 🎨 Design et Navigation

### Navigation Sidebar

**Structure :**
```
CareAtHome Admin
Administrateur

├── Dashboard
├── Transactions
├── Inscriptions
├── Professionnels
├── Détection Fraude
├── Rapports
├── Paramètres
└── Déconnexion
```

**Couleurs :**
- Background : `bg-gray-900`
- Texte : `text-white`
- Item actif : `bg-teal-600`
- Hover : `bg-gray-800`

### Layout

**Structure :**
```
┌─────────────────────────────────────┐
│  Sidebar (fixed, 256px)             │
│  - Logo                             │
│  - Navigation                       │
│  - Logout                           │
├─────────────────────────────────────┤
│  Main Content (ml-64)               │
│  - Header (white, border-bottom)    │
│  - Content (bg-gray-50, padding)    │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Workflows Administrateur

### Workflow 1 : Approuver un Professionnel

```
1. LOGIN
   admin@gmail.com / admin
   ↓
   Redirection → /admin/dashboard

2. NAVIGATION
   Clic "Inscriptions" ou "Gérer les Inscriptions"
   ↓
   Page /admin/approvals

3. SÉLECTION
   Clic "Détails" sur une demande
   ↓
   Modal avec informations complètes

4. VÉRIFICATION
   - Vérifier identité
   - Télécharger et vérifier documents
   - Vérifier services proposés
   - Vérifier expérience

5. DÉCISION
   Option A: Approuver
   - Clic "Approuver la Demande"
   - Confirmation
   - Email envoyé au professionnel
   - Compte activé
   
   Option B: Rejeter
   - Clic "Rejeter"
   - Saisir raison (obligatoire)
   - Confirmation
   - Email avec raison envoyé

6. RÉSULTAT
   Demande disparaît de la liste
   ↓
   Professionnel notifié
```

### Workflow 2 : Transférer des Fonds

```
1. ACCÈS TRANSACTIONS
   Dashboard → "Voir Transactions"
   ↓
   Page /admin/transactions

2. FILTRAGE
   Filtre: "En attente transfert"
   ↓
   Liste des transactions validées

3. SÉLECTION
   Clic "Détails" sur transaction
   ↓
   Modal avec informations complètes

4. VÉRIFICATION
   - Vérifier montant
   - Vérifier professionnel
   - Vérifier validation patient
   - Vérifier Stripe Payment Intent

5. TRANSFERT
   Clic "Transférer au Professionnel"
   ↓
   API call → Stripe Transfer
   ↓
   Status change: pending_transfer → completed

6. CONFIRMATION
   - Transaction marquée "Complété"
   - Professionnel reçoit notification
   - Fonds disponibles sous 24-48h
```

### Workflow 3 : Gérer un Litige

```
1. DÉTECTION
   Dashboard → Alerte "5 Litiges"
   ↓
   Clic sur alerte

2. ACCÈS TRANSACTION
   Page /admin/transactions
   ↓
   Filtre: "Litige"

3. ANALYSE
   Clic "Détails" sur transaction
   ↓
   Voir:
   - Raison du litige
   - Historique
   - Messages patient/professionnel

4. INVESTIGATION
   - Contacter patient
   - Contacter professionnel
   - Vérifier preuves
   - Analyser situation

5. RÉSOLUTION
   Option A: En faveur du patient
   - Remboursement
   - Status → refunded
   
   Option B: En faveur du professionnel
   - Transfert des fonds
   - Status → completed
   
   Option C: Compromis
   - Remboursement partiel
   - Transfert partiel

6. CLÔTURE
   - Litige résolu
   - Parties notifiées
   - Documentation archivée
```

---

## 📊 KPIs et Métriques Admin

### Métriques Temps Réel

**Dashboard Principal :**
- Revenus du mois
- Nombre de transactions
- Prestations en attente
- Nombre de litiges

**Objectifs :**
- Revenus : 50 000 TND/mois
- Transactions : 1500/mois
- En attente : < 30
- Litiges : < 10

### Métriques Hebdomadaires

**À Surveiller :**
- Croissance revenus (> 10%)
- Nouveaux patients (> 50/semaine)
- Nouveaux professionnels (> 5/semaine)
- Taux de validation (> 85% < 24h)
- Taux de litige (< 2%)

### Alertes Automatiques

**Critiques (Email + SMS) :**
- Litige > 10
- Fraude score > 80
- Revenus jour < 1000 TND
- Système down

**Importantes (Email) :**
- Demandes inscription > 20
- Transactions en attente > 50
- Taux de litige > 5%

**Informatives (Dashboard) :**
- Nouveaux utilisateurs
- Transactions complétées
- Approbations effectuées

---

## 🔒 Sécurité et Permissions

### Niveaux d'Accès

**Super Admin (admin@gmail.com) :**
- ✅ Tous les accès
- ✅ Modifier paramètres
- ✅ Approuver/Rejeter
- ✅ Transférer fonds
- ✅ Gérer litiges
- ✅ Voir rapports
- ✅ Exporter données

**Admin Opérationnel (futur) :**
- ✅ Approuver/Rejeter
- ✅ Voir transactions
- ✅ Gérer litiges
- ❌ Modifier paramètres
- ❌ Transférer fonds

**Admin Support (futur) :**
- ✅ Voir utilisateurs
- ✅ Voir transactions
- ❌ Approuver/Rejeter
- ❌ Transférer fonds
- ❌ Modifier paramètres

### Logs d'Audit

**Actions Loggées :**
- Connexion/Déconnexion admin
- Approbation/Rejet professionnel
- Transfert de fonds
- Modification paramètres
- Résolution litige
- Export de données

**Format Log :**
```typescript
{
  timestamp: Date,
  adminEmail: string,
  action: string,
  target: string,
  details: object,
  ipAddress: string
}
```

---

## 🚀 Roadmap Améliorations

### Phase 1 : Actuel ✅
- Dashboard principal
- Gestion transactions
- Gestion inscriptions
- Détection fraude
- Rapports
- Paramètres

### Phase 2 : Court Terme (1-2 mois)
- **Multi-admin** : Plusieurs comptes admin avec permissions
- **Notifications push** : Alertes temps réel
- **Chat support** : Communication directe avec utilisateurs
- **Logs d'audit** : Traçabilité complète
- **Backup automatique** : Sauvegarde quotidienne

### Phase 3 : Moyen Terme (3-6 mois)
- **Analytics avancés** : Graphiques interactifs (Chart.js)
- **Prédictions ML** : Prévision revenus, détection fraude
- **API publique** : Pour intégrations tierces
- **Webhooks** : Notifications événements
- **Mobile app admin** : iOS/Android

### Phase 4 : Long Terme (6-12 mois)
- **BI Dashboard** : Business Intelligence avancé
- **A/B Testing** : Tests de fonctionnalités
- **Segmentation** : Ciblage utilisateurs
- **Automation** : Workflows automatisés
- **White label** : Multi-tenant

---

## 📞 Support et Documentation

### Ressources Admin

**Documentation :**
- Guide d'utilisation admin
- FAQ administrateur
- Procédures de sécurité
- Workflows détaillés

**Support Technique :**
- Email : admin-support@careathome.tn
- Téléphone : +216 XX XXX XXX
- Slack : #admin-support
- Horaires : 24/7

### Formation

**Onboarding Nouvel Admin :**
1. Présentation plateforme (1h)
2. Formation dashboard (30min)
3. Formation transactions (45min)
4. Formation approbations (30min)
5. Formation fraude (45min)
6. Cas pratiques (2h)

**Durée totale :** 5h30

---

## ✅ Checklist Déploiement

### Avant Production

- [ ] Tests complets de toutes les pages
- [ ] Vérification sécurité routes
- [ ] Tests authentification admin
- [ ] Validation workflows
- [ ] Tests export données
- [ ] Documentation complète
- [ ] Formation équipe admin

### Après Production

- [ ] Monitoring actif
- [ ] Alertes configurées
- [ ] Backup automatique
- [ ] Support 24/7 prêt
- [ ] Logs d'audit activés
- [ ] Métriques suivies

---

**Document préparé par :** Équipe Technique  
**Date :** Janvier 2025  
**Version :** 1.0  
**Statut :** Production Ready ✅

---

**Fin de la Spécification**

*L'espace admin est le cœur opérationnel de CareAtHome. Traitons-le avec le professionnalisme qu'il mérite.* 🎯
