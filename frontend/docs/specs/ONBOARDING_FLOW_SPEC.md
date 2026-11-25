
# Spécification - Flux d'Onboarding et Authentification

## 🎯 Vue d'ensemble

Documentation du flux complet d'onboarding et d'authentification pour les différents types d'utilisateurs (Patient, Professionnel, Agence, etc.).

---

## 🔄 Flux Utilisateur

### Flux 1 : Patient

```
1. LANDING PAGE
   Utilisateur arrive sur /
   ↓
   Clic "S'inscrire" ou "Commencer"

2. ONBOARDING
   Page /auth/onboarding
   ↓
   Sélectionne "Patient"
   ↓
   Redirigé vers /auth/signup?type=patient

3. INSCRIPTION
   Formulaire d'inscription patient
   ↓
   Remplit email, mot de passe, infos
   ↓
   Compte créé

4. LOGIN AUTOMATIQUE
   Connexion automatique après inscription
   ↓
   Redirigé vers /patient-dashboard

5. DASHBOARD PATIENT
   Accès aux fonctionnalités patient
   - Réserver des soins
   - Voir rendez-vous
   - Suivi santé
```

### Flux 2 : Professionnel de Santé

```
1. LANDING PAGE
   Utilisateur arrive sur /
   ↓
   Clic "S'inscrire" ou "Espace Pro"

2. ONBOARDING
   Page /auth/onboarding
   ↓
   Sélectionne "Professionnel de Santé"
   ↓
   Redirigé vers /auth/login?type=professional

3. LOGIN (avec sélection de service)
   Page /auth/login
   ↓
   Détecte type=professional dans URL
   ↓
   Affiche sélection de service automatiquement
   
4. SÉLECTION SERVICE
   Utilisateur choisit son service:
   - Soins Infirmiers
   - Kinésithérapie
   - Aide aux Seniors
   - etc.
   ↓
   Passe à l'étape de connexion

5. AUTHENTIFICATION
   Saisit email et mot de passe
   ↓
   Service type stocké: user.serviceType = 'nursing'
   ↓
   Login avec rôle 'provider'

6. REDIRECTION
   Redirigé vers /provider-dashboard
   ↓
   Navigation adaptée (Mes Transactions, Mes Services, etc.)

7. DASHBOARD PROFESSIONNEL
   Accès aux fonctionnalités pro
   - Gérer services et tarifs
   - Voir transactions
   - Gérer agenda
   - Statistiques
```

### Flux 3 : Laboratoire / Radiologie / Gym

```
1. LANDING PAGE
   Utilisateur arrive sur /
   ↓
   Clic "S'inscrire"

2. ONBOARDING
   Page /auth/onboarding
   ↓
   Sélectionne type (Laboratoire, Radiologie, Gym)
   ↓
   Redirigé vers /auth/signup?type=laboratory

3. INSCRIPTION SPÉCIALISÉE
   Formulaire adapté au type
   ↓
   Champs spécifiques (équipements, certifications, etc.)
   ↓
   Compte créé

4. LOGIN
   Connexion avec identifiants
   ↓
   Rôle 'provider' + serviceType spécifique

5. DASHBOARD
   Accès aux fonctionnalités spécialisées
```

---

## 🔧 Implémentation Technique

### Détection du Type dans Login

**Fichier :** `pages/auth/Login.tsx`

```typescript
export function Login() {
  const location = useLocation()
  
  // Get type from URL params
  const searchParams = new URLSearchParams(location.search)
  const urlType = searchParams.get('type')
  
  // Pre-select account type if specified in URL
  const [step, setStep] = useState<'select' | 'login'>(
    urlType === 'professional' ? 'login' : 'select'
  )
  const [accountType, setAccountType] = useState<AccountType>(
    urlType === 'professional' ? 'professional' : 'patient'
  )
  
  // Handle URL type parameter changes
  useEffect(() => {
    if (urlType === 'professional') {
      setAccountType('professional')
    }
  }, [urlType])
  
  // ... rest of component
}
```

### Redirection depuis Onboarding

**Fichier :** `pages/auth/Onboarding.tsx`

```typescript
const handleSelectType = (type: string) => {
  if (type === 'patient') {
    navigate('/auth/signup?type=patient')
  } else if (type === 'professional') {
    // Redirect to login with professional type
    navigate('/auth/login?type=professional')
  } else {
    navigate(`/auth/signup?type=${type}`)
  }
}
```

### Stockage du Service Type

**Fichier :** `contexts/AuthContext.tsx`

```typescript
const login = (email: string, password: string, serviceType?: string) => {
  let role: UserRole = 'patient'
  
  // Detect role from email or explicit selection
  if (email === 'admin@gmail.com' && password === 'admin') {
    role = 'admin'
  } else if (serviceType) {
    // If serviceType is provided, user is a provider
    role = 'provider'
  }
  
  const userData: User = {
    email,
    role,
    name: email.split('@')[0],
    serviceType, // Store selected service
  }
  
  setUser(userData)
  localStorage.setItem('user', JSON.stringify(userData))
}
```

---

## 📊 Matrice de Navigation

### Selon le Rôle

| Rôle | Login Redirect | Navigation Visible | Dashboard |
|------|----------------|-------------------|-----------|
| **Patient** | `/patient-dashboard` | Nos Services, Location Matériel, Comment ça marche | Patient Dashboard |
| **Provider** | `/provider-dashboard` | Mes Transactions, Mes Services, Mon Agenda, Statistiques | Provider Dashboard |
| **Admin** | `/admin/dashboard` | Admin Navigation (sidebar) | Admin Dashboard |

### Selon le Service Type (Providers)

| Service Type | Label | Icône | Spécialisation |
|--------------|-------|-------|----------------|
| `nursing` | Soins Infirmiers | 💉 | Injections, pansements, perfusions |
| `elderly` | Aide aux Seniors | 👴 | Accompagnement, aide quotidienne |
| `physio` | Kinésithérapie | 🏃 | Rééducation, massage |
| `maternity` | Soins Maternité | 👶 | Post-partum, allaitement |
| `night` | Garde de Nuit | 🌙 | Surveillance nocturne |
| `doctor` | Médecin à Domicile | 🩺 | Consultations, prescriptions |
| `psychology` | Soutien Psychologique | 🧠 | Thérapie, counseling |
| `nutrition` | Nutrition | 🥗 | Diététique, plans alimentaires |
| `laboratory` | Laboratoire | 🧪 | Analyses médicales |
| `radiology` | Centre Radiologie | 📡 | Imagerie médicale |
| `gym` | Salle de Sport | 🏋️ | Fitness, musculation |
| `ambulance` | Ambulance | 🚑 | Transport médical |

---

## 🎨 Expérience Utilisateur

### UX Principles

**1. Clarté du Parcours**
- Chaque étape est claire et explicite
- L'utilisateur sait toujours où il en est
- Pas de surprises ou de redirections inattendues

**2. Cohérence Visuelle**
- Chaque type d'utilisateur a sa couleur
- Patient : Teal/Blue
- Provider : Blue/Purple
- Admin : Dark/Teal

**3. Feedback Immédiat**
- Sélection de service visible dans le badge
- Possibilité de changer à tout moment
- Confirmation visuelle des choix

**4. Flexibilité**
- Bouton "Changer" pour modifier le type/service
- Retour possible à l'étape précédente
- Pas de blocage définitif

---

## 🔐 Sécurité et Validation

### Validation des Rôles

**Au Login :**
```typescript
// Vérifier que le serviceType correspond au rôle
if (accountType === 'professional' && !selectedService) {
  alert('Veuillez sélectionner votre type de service')
  return
}
```

**Dans les Routes :**
```typescript
// ProviderRoute protège les pages professionnelles
<Route
  path="/provider/dashboard"
  element={
    <ProviderRoute>
      <ProviderDashboard />
    </ProviderRoute>
  }
/>
```

**Dans la Navigation :**
```typescript
// Masquer les liens selon le rôle
{!isPatient && (
  <Link to="/provider-dashboard">Espace Pro</Link>
)}

{isProvider && (
  <>
    <Link to="/provider/transactions">Mes Transactions</Link>
    <Link to="/provider/services">Mes Services</Link>
  </>
)}
```

---

## 🐛 Résolution de Problèmes

### Problème 1 : "Je choisis Professionnel mais je vois les pages Patient"

**Cause :** Le type n'est pas transmis correctement entre Onboarding et Login

**Solution :**
1. Vérifier que l'URL contient `?type=professional`
2. Vérifier que `urlType` est bien détecté dans Login
3. Vérifier que `accountType` est bien défini à 'professional'
4. Vérifier que le service est sélectionné avant login

**Debug :**
```typescript
console.log('URL Type:', urlType)
console.log('Account Type:', accountType)
console.log('Selected Service:', selectedService)
console.log('User after login:', user)
```

### Problème 2 : "Le service n'est pas sauvegardé après login"

**Cause :** Le serviceType n'est pas passé à la fonction login

**Solution :**
```typescript
// Dans handleSubmit de Login.tsx
login(email, password, selectedService) // ✅ Correct
// PAS: login(email, password) // ❌ Incorrect
```

### Problème 3 : "La navigation ne change pas après login professionnel"

**Cause :** Le rôle n'est pas correctement détecté dans Navigation

**Solution :**
```typescript
// Dans Navigation.tsx
const { user } = useAuth()
const isProvider = user?.role === 'provider' // ✅ Correct
// PAS: const isProvider = false // ❌ Incorrect
```

---

## ✅ Checklist de Test

### Test Patient
- [ ] Sélectionner "Patient" dans Onboarding
- [ ] Arriver sur page d'inscription patient
- [ ] S'inscrire avec succès
- [ ] Être redirigé vers patient-dashboard
- [ ] Voir navigation patient (Nos Services, etc.)
- [ ] Ne PAS voir "Espace Pro"

### Test Professionnel
- [ ] Sélectionner "Professionnel" dans Onboarding
- [ ] Arriver sur page de login avec type=professional
- [ ] Voir sélection de service automatiquement
- [ ] Sélectionner un service (ex: Soins Infirmiers)
- [ ] Se connecter avec succès
- [ ] Être redirigé vers provider-dashboard
- [ ] Voir navigation provider (Mes Transactions, Mes Services, etc.)
- [ ] Ne PAS voir "Nos Services", "Location Matériel"
- [ ] Vérifier que serviceType est sauvegardé

### Test Laboratoire/Radiologie/Gym
- [ ] Sélectionner type dans Onboarding
- [ ] Arriver sur page d'inscription spécialisée
- [ ] S'inscrire avec succès
- [ ] Se connecter
- [ ] Accéder au dashboard approprié

### Test Admin
- [ ] Se connecter avec admin@gmail.com / admin
- [ ] Être redirigé vers admin-dashboard
- [ ] Voir navigation admin (sidebar)
- [ ] Pas de header/footer

---

## 🚀 Améliorations Futures

### Phase 1 : Actuel ✅
- Détection du type dans URL
- Sélection de service pour professionnels
- Navigation adaptée par rôle
- Protection des routes

### Phase 2 : Court Terme
- **Inscription professionnelle complète** : Formulaire dédié avec validation
- **Vérification documents** : Upload diplôme, licence, assurance
- **Onboarding guidé** : Tutoriel interactif pour nouveaux professionnels
- **Profil détaillé** : Bio, expérience, certifications

### Phase 3 : Moyen Terme
- **Multi-services** : Professionnel peut proposer plusieurs services
- **Sous-catégories** : Spécialisations par service
- **Badges professionnels** : Certifications visibles
- **Portfolio** : Photos, témoignages, cas pratiques

### Phase 4 : Long Terme
- **Vérification identité** : KYC automatisé
- **Formation continue** : Cours et certifications
- **Réseau professionnel** : Collaboration entre providers
- **API publique** : Intégration avec systèmes tiers

---

**Document préparé par :** Équipe Produit & Technique  
**Date :** Janvier 2025  
**Version :** 1.0  
**Statut :** Déployé en Production ✅

---

**Fin de la Spécification**

*Un onboarding fluide est la clé d'une adoption réussie.* 🚀
