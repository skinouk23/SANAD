
# Spécification - Contrôle d'Accès Basé sur les Rôles

## 🔐 Vue d'ensemble

Système de contrôle d'accès qui masque et protège les pages professionnelles pour les utilisateurs connectés en tant que patients. Cette fonctionnalité garantit que chaque utilisateur ne voit que les fonctionnalités pertinentes pour son rôle.

---

## 🎯 Objectifs

### Objectifs Utilisateurs
- **Clarté** : Interface adaptée au rôle de l'utilisateur
- **Simplicité** : Pas de confusion avec des options non pertinentes
- **Sécurité** : Protection des données et fonctionnalités professionnelles
- **Expérience** : Navigation intuitive selon le profil

### Objectifs Business
- **Segmentation** : Séparation claire patient/professionnel
- **Sécurité** : Protection des données professionnelles
- **Conformité** : Respect des règles de confidentialité
- **Qualité** : Expérience utilisateur optimale par rôle

---

## 👥 Rôles Utilisateurs

### Définition des Rôles

```typescript
type UserRole = 'patient' | 'provider' | 'admin'

interface User {
  email: string
  role: UserRole
  name?: string
  serviceType?: string
}
```

### Caractéristiques par Rôle

**Patient :**
- Accès : Pages publiques + Dashboard patient
- Restrictions : Aucun accès aux pages provider
- Navigation : Pas de lien "Espace Pro"
- Redirection : Vers `/patient-dashboard` si tentative d'accès provider

**Provider (Professionnel) :**
- Accès : Pages publiques + Dashboard provider + Outils pro
- Restrictions : Aucune
- Navigation : Lien "Espace Pro" visible
- Redirection : Vers `/provider-dashboard` après login

**Admin :**
- Accès : Toutes les pages + Admin dashboard
- Restrictions : Aucune
- Navigation : Accès complet
- Redirection : Vers `/admin/dashboard` après login

---

## 🚫 Restrictions d'Accès

### Pages Protégées (Provider Only)

**Dashboard & Gestion :**
- `/provider-dashboard` - Dashboard professionnel
- `/provider/schedule` - Gestion des horaires
- `/provider/analytics` - Statistiques et analytics
- `/provider/billing` - Facturation et paiements
- `/provider/insurance` - Gestion assurance
- `/provider/insurance/file-claim` - Déclaration sinistre
- `/provider/marketing` - Campagnes marketing

**Comportement pour Patients :**
- Tentative d'accès → Redirection automatique vers `/patient-dashboard`
- Message (optionnel) : "Cette page est réservée aux professionnels"

### Pages Publiques (Tous)

**Accessibles sans restriction :**
- `/` - Landing page
- `/services` - Sélection de services
- `/equipment` - Catalogue matériel
- `/how-it-works` - Comment ça marche
- `/laboratory` - Laboratoires
- `/radiology` - Radiologie
- `/gym` - Salles de sport
- `/auth/*` - Pages d'authentification

### Pages Patient (Patient & Provider)

**Accessibles aux patients et professionnels :**
- `/patient-dashboard` - Dashboard patient
- `/health` - Suivi santé
- `/health/activity` - Suivi activité
- `/health/nutrition` - Suivi nutrition
- `/messages` - Messagerie
- `/rewards` - Récompenses
- `/subscriptions` - Abonnements

---

## 🎨 Interface Utilisateur

### Navigation - Vue Patient

**Desktop :**
```
[Logo] Nos Services | Location Matériel | Comment ça marche | [Icônes] [Mon Espace]
```

**Mobile :**
```
[Logo]                                                    [Menu]

Menu ouvert:
- Nos Services
- Location Matériel
- Comment ça marche
- Suivi Santé
- Mon Espace
- Déconnexion
```

**Éléments Masqués :**
- ❌ "Espace Pro" (lien navigation)
- ❌ Toutes les pages `/provider/*`

### Navigation - Vue Provider

**Desktop :**
```
[Logo] Nos Services | Location Matériel | Comment ça marche | Espace Pro | [Icônes] [Mon Espace]
```

**Mobile :**
```
[Logo]                                                    [Menu]

Menu ouvert:
- Nos Services
- Location Matériel
- Comment ça marche
- Espace Pro ✅
- Suivi Santé
- Mon Espace
- Déconnexion
```

**Éléments Visibles :**
- ✅ "Espace Pro" (lien navigation)
- ✅ Accès complet aux pages `/provider/*`

---

## 🔧 Implémentation Technique

### Composant ProviderRoute

**Fichier :** `components/ProviderRoute.tsx`

```typescript
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProviderRouteProps {
  children: React.ReactNode
}

export function ProviderRoute({ children }: ProviderRouteProps) {
  const { isAuthenticated, user } = useAuth()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Redirect to patient dashboard if user is a patient
  if (user?.role === 'patient') {
    return <Navigate to="/patient-dashboard" replace />
  }

  // Allow access for providers and admins
  return <>{children}</>
}
```

### Utilisation dans App.tsx

```typescript
import { ProviderRoute } from './components/ProviderRoute'

// Route protégée
<Route
  path="/provider-dashboard"
  element={
    <ProviderRoute>
      <ProviderDashboard />
    </ProviderRoute>
  }
/>
```

### Navigation Conditionnelle

**Fichier :** `components/Navigation.tsx`

```typescript
export function Navigation() {
  const { isAuthenticated, user } = useAuth()
  const isPatient = user?.role === 'patient'
  
  return (
    <nav>
      {/* ... autres liens ... */}
      
      {/* Hide Espace Pro for patients */}
      {!isPatient && (
        <Link to="/provider-dashboard">
          Espace Pro
        </Link>
      )}
    </nav>
  )
}
```

---

## 🔄 Flux Utilisateur

### Scénario 1 : Patient Tente d'Accéder à Espace Pro

```
1. CONNEXION PATIENT
   Email: patient@example.com
   Type: Patient
   ↓
   Login réussi

2. NAVIGATION
   Patient clique sur URL directe: /provider-dashboard
   ↓
   ProviderRoute vérifie le rôle

3. VÉRIFICATION
   user.role === 'patient' ✅
   ↓
   Condition de redirection activée

4. REDIRECTION
   Navigate to="/patient-dashboard"
   ↓
   Patient arrive sur son dashboard

5. RÉSULTAT
   ✅ Patient ne peut pas accéder aux pages pro
   ✅ Redirection transparente
   ✅ Pas de message d'erreur (UX fluide)
```

### Scénario 2 : Professionnel Accède à Espace Pro

```
1. CONNEXION PROFESSIONNEL
   Email: dr.amira@provider.com
   Type: Provider (Soins Infirmiers)
   ↓
   Login réussi

2. NAVIGATION
   Professionnel voit "Espace Pro" dans menu
   ↓
   Clic sur "Espace Pro"

3. VÉRIFICATION
   user.role === 'provider' ✅
   ↓
   Accès autorisé

4. AFFICHAGE
   Page /provider-dashboard s'affiche
   ↓
   Toutes les fonctionnalités pro disponibles

5. RÉSULTAT
   ✅ Accès complet aux pages pro
   ✅ Navigation fluide
   ✅ Toutes les fonctionnalités visibles
```

### Scénario 3 : Utilisateur Non Connecté

```
1. ACCÈS DIRECT
   URL: /provider-dashboard
   ↓
   Pas de session active

2. VÉRIFICATION
   isAuthenticated === false
   ↓
   Condition de redirection activée

3. REDIRECTION
   Navigate to="/auth/login"
   ↓
   Page de connexion s'affiche

4. APRÈS CONNEXION
   Selon le rôle:
   - Patient → /patient-dashboard
   - Provider → /provider-dashboard
   - Admin → /admin/dashboard

5. RÉSULTAT
   ✅ Protection des routes
   ✅ Redirection vers login
   ✅ Retour à la page demandée (si autorisé)
```

---

## 📊 Matrice de Permissions

### Tableau des Accès

| Page/Fonctionnalité | Patient | Provider | Admin |
|---------------------|---------|----------|-------|
| **Pages Publiques** |
| Landing Page | ✅ | ✅ | ✅ |
| Services | ✅ | ✅ | ✅ |
| Équipement | ✅ | ✅ | ✅ |
| Comment ça marche | ✅ | ✅ | ✅ |
| **Pages Patient** |
| Patient Dashboard | ✅ | ✅ | ✅ |
| Suivi Santé | ✅ | ✅ | ✅ |
| Messages | ✅ | ✅ | ✅ |
| Récompenses | ✅ | ✅ | ✅ |
| **Pages Provider** |
| Provider Dashboard | ❌ | ✅ | ✅ |
| Gestion Horaires | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Facturation | ❌ | ✅ | ✅ |
| Marketing | ❌ | ✅ | ✅ |
| **Pages Admin** |
| Admin Dashboard | ❌ | ❌ | ✅ |
| Transactions | ❌ | ❌ | ✅ |
| Approbations | ❌ | ❌ | ✅ |
| Fraude | ❌ | ❌ | ✅ |
| Paramètres | ❌ | ❌ | ✅ |

**Légende :**
- ✅ Accès autorisé
- ❌ Accès refusé (redirection)

---

## 🎯 Cas d'Usage Avancés

### Multi-Rôle (Futur)

**Scénario :** Un utilisateur peut être à la fois patient et professionnel

```typescript
interface User {
  email: string
  roles: UserRole[]  // Plusieurs rôles
  activeRole: UserRole  // Rôle actif
  name?: string
  serviceType?: string
}

// Exemple
{
  email: 'dr.amira@example.com',
  roles: ['patient', 'provider'],
  activeRole: 'provider',
  name: 'Dr. Amira',
  serviceType: 'nursing'
}
```

**Interface :**
```
[Switcher de Rôle]
┌─────────────────────┐
│ 👤 Mode Patient     │
│ 💼 Mode Provider ✓  │
└─────────────────────┘
```

### Permissions Granulaires (Futur)

**Scénario :** Permissions spécifiques par fonctionnalité

```typescript
interface Permission {
  resource: string
  actions: ('read' | 'write' | 'delete')[]
}

interface User {
  email: string
  role: UserRole
  permissions: Permission[]
}

// Exemple
{
  email: 'assistant@provider.com',
  role: 'provider',
  permissions: [
    { resource: 'schedule', actions: ['read', 'write'] },
    { resource: 'billing', actions: ['read'] },  // Lecture seule
    { resource: 'analytics', actions: [] }  // Pas d'accès
  ]
}
```

---

## 🧪 Tests

### Tests Unitaires

**Test Navigation Patient :**
```typescript
describe('Navigation for Patient', () => {
  it('should hide Espace Pro link', () => {
    const user = { role: 'patient', email: 'patient@test.com' }
    const { queryByText } = render(<Navigation />, { user })
    
    expect(queryByText('Espace Pro')).not.toBeInTheDocument()
  })
})
```

**Test Navigation Provider :**
```typescript
describe('Navigation for Provider', () => {
  it('should show Espace Pro link', () => {
    const user = { role: 'provider', email: 'provider@test.com' }
    const { getByText } = render(<Navigation />, { user })
    
    expect(getByText('Espace Pro')).toBeInTheDocument()
  })
})
```

**Test ProviderRoute :**
```typescript
describe('ProviderRoute', () => {
  it('should redirect patient to patient dashboard', () => {
    const user = { role: 'patient', email: 'patient@test.com' }
    render(
      <ProviderRoute>
        <ProviderDashboard />
      </ProviderRoute>,
      { user }
    )
    
    expect(window.location.pathname).toBe('/patient-dashboard')
  })
  
  it('should allow provider access', () => {
    const user = { role: 'provider', email: 'provider@test.com' }
    const { getByText } = render(
      <ProviderRoute>
        <ProviderDashboard />
      </ProviderRoute>,
      { user }
    )
    
    expect(getByText('Provider Dashboard')).toBeInTheDocument()
  })
})
```

### Tests d'Intégration

**Test Flow Complet Patient :**
```typescript
it('should prevent patient from accessing provider pages', async () => {
  // 1. Login as patient
  await login('patient@test.com', 'password')
  
  // 2. Try to access provider dashboard
  navigate('/provider-dashboard')
  
  // 3. Should be redirected
  await waitFor(() => {
    expect(window.location.pathname).toBe('/patient-dashboard')
  })
  
  // 4. Espace Pro link should not exist
  expect(queryByText('Espace Pro')).not.toBeInTheDocument()
})
```

### Tests Manuels

**Checklist :**
- [ ] Patient ne voit pas "Espace Pro" dans navigation
- [ ] Patient redirigé si accès direct URL provider
- [ ] Provider voit "Espace Pro" dans navigation
- [ ] Provider peut accéder à toutes les pages pro
- [ ] Admin peut accéder à tout
- [ ] Redirection après login selon rôle
- [ ] Pas de message d'erreur lors des redirections
- [ ] Navigation fluide et intuitive

---

## 🚀 Améliorations Futures

### Phase 1 : Actuel ✅
- Masquage "Espace Pro" pour patients
- Protection routes provider
- Redirection automatique
- Vérification rôle dans navigation

### Phase 2 : Court Terme (1-2 mois)
- **Messages informatifs** : Notification lors de redirection
- **Historique navigation** : Retour à la page demandée après login
- **Multi-rôle** : Switcher entre patient/provider
- **Permissions granulaires** : Contrôle par fonctionnalité

### Phase 3 : Moyen Terme (3-6 mois)
- **Rôles personnalisés** : Admin peut créer des rôles
- **Délégation** : Provider peut déléguer des permissions
- **Audit trail** : Log des tentatives d'accès
- **2FA** : Authentification à deux facteurs pour providers

### Phase 4 : Long Terme (6-12 mois)
- **SSO** : Single Sign-On pour entreprises
- **RBAC avancé** : Role-Based Access Control complet
- **Groupes** : Gestion par groupes d'utilisateurs
- **API permissions** : Contrôle d'accès API

---

## 📞 Support

### FAQ

**Q: Pourquoi je ne vois pas "Espace Pro" ?**
R: Vous êtes connecté en tant que patient. "Espace Pro" est réservé aux professionnels de santé.

**Q: Comment devenir professionnel ?**
R: Créez un compte professionnel lors de l'inscription ou contactez le support pour convertir votre compte.

**Q: Puis-je avoir un compte patient ET professionnel ?**
R: Actuellement, un compte = un rôle. La fonctionnalité multi-rôle arrive bientôt.

**Q: Que se passe-t-il si j'accède directement à une URL provider ?**
R: Vous serez automatiquement redirigé vers votre dashboard patient.

---

**Document préparé par :** Équipe Sécurité & Produit  
**Date :** Janvier 2025  
**Version :** 1.0  
**Statut :** Déployé en Production ✅

---

**Fin de la Spécification**

*La sécurité et la clarté de l'expérience utilisateur sont nos priorités.* 🔐
