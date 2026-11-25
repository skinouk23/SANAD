
# Spécification - Sélection de Service lors de la Connexion

## 📋 Vue d'ensemble

Fonctionnalité permettant aux professionnels de santé de sélectionner leur type de service lors de la connexion. Cette information est utilisée pour personnaliser leur expérience et filtrer les opportunités de prestations.

---

## 🎯 Objectifs

### Objectifs Utilisateurs
- **Personnalisation** : Expérience adaptée au type de service
- **Efficacité** : Voir uniquement les demandes pertinentes
- **Flexibilité** : Possibilité de proposer plusieurs services
- **Clarté** : Identification claire du profil professionnel

### Objectifs Business
- **Segmentation** : Meilleure catégorisation des professionnels
- **Matching** : Amélioration de l'algorithme de matching
- **Analytics** : Données précises sur la répartition des services
- **Qualité** : Meilleurs résultats pour les patients

---

## 🔍 Détection Automatique

### Logique de Détection

La sélection de service s'affiche automatiquement si l'email contient certains mots-clés :

```typescript
const isProfessionalEmail = (email: string) => {
  return (
    email.includes('professional') ||
    email.includes('provider') ||
    email.includes('infirmier') ||
    email.includes('kine') ||
    email.includes('medecin') ||
    email.includes('doctor') ||
    email.includes('dr.')
  )
}
```

### Exemples d'Emails Détectés

**✅ Déclenchent la sélection :**
- `amira.professional@gmail.com`
- `dr.karim@example.com`
- `infirmier.tunis@careathome.tn`
- `kine.sfax@provider.com`
- `medecin.domicile@email.tn`

**❌ Ne déclenchent PAS la sélection :**
- `patient@gmail.com`
- `mohamed.ali@example.com`
- `sarah.trabelsi@email.tn`

---

## 🏥 Services Disponibles

### Liste Complète

| ID | Nom | Icône | Catégorie |
|---|---|---|---|
| `nursing` | Soins Infirmiers | 💉 | Soins à domicile |
| `elderly` | Aide aux Seniors | 👴 | Soins à domicile |
| `physio` | Kinésithérapie | 🏃 | Soins à domicile |
| `maternity` | Soins Maternité | 👶 | Soins à domicile |
| `night` | Garde de Nuit | 🌙 | Soins à domicile |
| `doctor` | Médecin à Domicile | 🩺 | Soins à domicile |
| `psychology` | Soutien Psychologique | 🧠 | Soins à domicile |
| `nutrition` | Nutrition | 🥗 | Soins à domicile |
| `laboratory` | Laboratoire | 🧪 | Établissement |
| `radiology` | Centre Radiologie | 📡 | Établissement |
| `gym` | Salle de Sport | 🏋️ | Établissement |
| `ambulance` | Ambulance | 🚑 | Transport |

### Catégories

**Soins à Domicile :**
- Professionnels qui se déplacent chez le patient
- Prestations individuelles
- Horaires flexibles

**Établissement :**
- Services dans un lieu fixe
- Équipement spécialisé
- Rendez-vous planifiés

**Transport :**
- Services de transport médical
- Urgences et transferts
- Disponibilité 24/7

---

## 🎨 Design et UX

### Flow Utilisateur

```
1. SAISIE EMAIL
   Utilisateur tape son email
   ↓
   Perd le focus (onBlur)
   ↓
   Vérification automatique

2. DÉTECTION
   Email contient mot-clé professionnel ?
   ↓
   OUI → Afficher sélection service
   NON → Continuer normalement

3. SÉLECTION SERVICE
   Grille 2 colonnes avec 12 services
   ↓
   Clic sur un service
   ↓
   Bordure teal + fond teal-50

4. VALIDATION
   Clic "Se connecter"
   ↓
   Service sélectionné ? → OK
   Pas de service ? → Erreur

5. CONNEXION
   Service stocké dans user.serviceType
   ↓
   Redirection provider-dashboard
```

### Interface

**Apparence :**
```tsx
<div className="animate-in slide-in-from-top-4">
  <label>
    <Briefcase className="inline h-4 w-4 mr-1" />
    Type de Service *
  </label>
  
  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
    {services.map((service) => (
      <button
        className={`p-3 rounded-lg border-2 ${
          selected 
            ? 'border-teal-600 bg-teal-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <span className="text-2xl">{service.icon}</span>
        <span className="text-xs font-medium">{service.name}</span>
      </button>
    ))}
  </div>
  
  <p className="text-xs text-gray-500 mt-2">
    Sélectionnez votre domaine d'activité principal
  </p>
</div>
```

**Animation :**
- Apparition : `animate-in slide-in-from-top-4`
- Transition : `transition-all`
- Hover : `hover:border-gray-300`
- Sélection : `shadow-md` + couleur teal

---

## 💾 Stockage des Données

### Structure User

```typescript
interface User {
  email: string
  role: 'patient' | 'provider' | 'admin'
  name?: string
  serviceType?: string  // Nouveau champ
}
```

### Exemple de Données Stockées

```typescript
// Professionnel avec service
{
  email: 'amira.professional@gmail.com',
  role: 'provider',
  name: 'amira.professional',
  serviceType: 'nursing'
}

// Patient (pas de serviceType)
{
  email: 'patient@gmail.com',
  role: 'patient',
  name: 'patient',
  serviceType: undefined
}

// Admin (pas de serviceType)
{
  email: 'admin@gmail.com',
  role: 'admin',
  name: 'Administrateur',
  serviceType: undefined
}
```

### Persistance

**localStorage :**
```typescript
localStorage.setItem('user', JSON.stringify({
  email: 'amira.professional@gmail.com',
  role: 'provider',
  name: 'amira.professional',
  serviceType: 'nursing'
}))
```

**Récupération :**
```typescript
const storedUser = localStorage.getItem('user')
if (storedUser) {
  const user = JSON.parse(storedUser)
  console.log(user.serviceType) // 'nursing'
}
```

---

## 🔄 Utilisation du Service Type

### Dans le Provider Dashboard

**Affichage du Service :**
```tsx
import { useAuth } from '../contexts/AuthContext'

export function ProviderDashboard() {
  const { user } = useAuth()
  
  return (
    <div>
      <h1>Bienvenue, {user?.name}</h1>
      {user?.serviceType && (
        <p>Service: {getServiceName(user.serviceType)}</p>
      )}
    </div>
  )
}
```

**Filtrage des Demandes :**
```tsx
const filteredRequests = allRequests.filter(request => 
  request.serviceType === user?.serviceType
)
```

### Dans le Matching Algorithm

**Priorité aux Professionnels du Bon Service :**
```typescript
const matchProviders = (request: Request) => {
  return providers
    .filter(p => p.serviceType === request.serviceType)
    .sort((a, b) => b.rating - a.rating)
}
```

### Dans les Analytics

**Statistiques par Service :**
```typescript
const serviceStats = providers.reduce((acc, provider) => {
  const service = provider.serviceType || 'unknown'
  acc[service] = (acc[service] || 0) + 1
  return acc
}, {})

// Résultat:
// {
//   nursing: 45,
//   physio: 32,
//   doctor: 28,
//   ...
// }
```

---

## ✅ Validation et Erreurs

### Validation Côté Client

**Vérification avant soumission :**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  // Si professionnel et pas de service sélectionné
  if (showServiceSelection && !selectedService) {
    alert('Veuillez sélectionner votre type de service')
    return
  }

  // Continuer la connexion...
}
```

### Messages d'Erreur

**Pas de service sélectionné :**
```
⚠️ Veuillez sélectionner votre type de service
```

**Service invalide :**
```
❌ Le service sélectionné n'est pas valide
```

**Email non professionnel :**
```
ℹ️ La sélection de service est réservée aux professionnels
```

---

## 🎯 Cas d'Usage

### Cas 1 : Infirmière se Connecte

```
1. Email: amira.infirmier@gmail.com
   → Détection automatique ✅
   
2. Sélection apparaît
   → Choisit "Soins Infirmiers" 💉
   
3. Connexion
   → serviceType: 'nursing'
   
4. Dashboard
   → Voit uniquement demandes de soins infirmiers
   → Profil indique "Soins Infirmiers"
```

### Cas 2 : Patient se Connecte

```
1. Email: mohamed@gmail.com
   → Pas de détection ❌
   
2. Pas de sélection
   → Continue normalement
   
3. Connexion
   → serviceType: undefined
   
4. Dashboard
   → Dashboard patient normal
```

### Cas 3 : Kinésithérapeute Multi-Services

```
1. Email: dr.kine@provider.com
   → Détection automatique ✅
   
2. Sélection apparaît
   → Choisit "Kinésithérapie" 🏃
   → (Note: peut proposer plusieurs services dans son profil)
   
3. Connexion
   → serviceType: 'physio' (service principal)
   
4. Dashboard
   → Priorité aux demandes de kiné
   → Peut voir autres services si configuré
```

### Cas 4 : Laboratoire se Connecte

```
1. Email: contact@labocentral.tn
   → Pas de détection automatique ❌
   → (Mot-clé "labo" pas dans la liste)
   
2. Pas de sélection
   → Continue comme patient
   
3. Solution
   → Utiliser email avec "professional"
   → Ou ajouter "labo" aux mots-clés
```

---

## 🔧 Configuration et Personnalisation

### Ajouter un Nouveau Service

**1. Ajouter dans la liste :**
```typescript
const services = [
  // ... services existants
  {
    id: 'podiatry',
    name: 'Podologie',
    icon: '🦶'
  }
]
```

**2. Mettre à jour les types :**
```typescript
type ServiceType = 
  | 'nursing'
  | 'elderly'
  // ...
  | 'podiatry'  // Nouveau
```

### Ajouter un Mot-Clé de Détection

```typescript
const isProfessionalEmail = (email: string) => {
  return (
    email.includes('professional') ||
    // ... mots-clés existants
    email.includes('podo') ||  // Nouveau
    email.includes('podologue')  // Nouveau
  )
}
```

### Personnaliser l'Affichage

**Changer le nombre de colonnes :**
```tsx
// 3 colonnes au lieu de 2
<div className="grid grid-cols-3 gap-2">
```

**Changer la hauteur max :**
```tsx
// Plus de services visibles
<div className="max-h-96 overflow-y-auto">
```

**Changer les couleurs de sélection :**
```tsx
// Bleu au lieu de teal
className={`${
  selected 
    ? 'border-blue-600 bg-blue-50'
    : 'border-gray-200'
}`}
```

---

## 📊 Analytics et Suivi

### Événements à Tracker

**1. Affichage de la Sélection :**
```typescript
analytics.track('service_selection_shown', {
  email: email,
  timestamp: new Date()
})
```

**2. Service Sélectionné :**
```typescript
analytics.track('service_selected', {
  serviceType: selectedService,
  email: email,
  timestamp: new Date()
})
```

**3. Connexion avec Service :**
```typescript
analytics.track('login_with_service', {
  serviceType: user.serviceType,
  email: user.email,
  timestamp: new Date()
})
```

### Métriques à Suivre

**Adoption :**
- % de professionnels qui sélectionnent un service
- Services les plus sélectionnés
- Temps moyen de sélection

**Qualité :**
- Taux de matching réussi par service
- Satisfaction patient par type de service
- Taux de complétion par service

**Business :**
- Revenus par type de service
- Croissance par service
- Demande vs offre par service

---

## 🚀 Améliorations Futures

### Phase 1 : Actuel ✅
- Détection automatique email professionnel
- Sélection service unique
- Stockage dans user.serviceType
- Affichage dans dashboard

### Phase 2 : Court Terme (1-2 mois)
- **Multi-sélection** : Plusieurs services par professionnel
- **Profil détaillé** : Services secondaires, spécialités
- **Badges** : Certifications par service
- **Disponibilité** : Horaires par service

### Phase 3 : Moyen Terme (3-6 mois)
- **Recommandations** : Suggestions de services complémentaires
- **Formation** : Cours pour nouveaux services
- **Réseau** : Collaboration entre services
- **Packages** : Offres multi-services

### Phase 4 : Long Terme (6-12 mois)
- **IA Matching** : Algorithme avancé par service
- **Spécialisation** : Sous-catégories de services
- **Marketplace** : Plateforme par service
- **Certification** : Validation officielle par service

---

## 🧪 Tests

### Tests Unitaires

**Test détection email :**
```typescript
describe('isProfessionalEmail', () => {
  it('should detect professional emails', () => {
    expect(isProfessionalEmail('dr.smith@example.com')).toBe(true)
    expect(isProfessionalEmail('infirmier@test.com')).toBe(true)
    expect(isProfessionalEmail('patient@test.com')).toBe(false)
  })
})
```

**Test sélection service :**
```typescript
describe('Service Selection', () => {
  it('should show selection for professional email', () => {
    const { getByText } = render(<Login />)
    fireEvent.change(emailInput, { target: { value: 'dr.test@example.com' } })
    fireEvent.blur(emailInput)
    expect(getByText('Type de Service')).toBeInTheDocument()
  })
})
```

### Tests d'Intégration

**Test flow complet :**
```typescript
it('should complete professional login with service', async () => {
  // 1. Entrer email professionnel
  fireEvent.change(emailInput, { target: { value: 'dr.test@example.com' } })
  fireEvent.blur(emailInput)
  
  // 2. Sélectionner service
  const nursingButton = getByText('Soins Infirmiers')
  fireEvent.click(nursingButton)
  
  // 3. Entrer mot de passe
  fireEvent.change(passwordInput, { target: { value: 'password' } })
  
  // 4. Se connecter
  fireEvent.click(submitButton)
  
  // 5. Vérifier redirection
  await waitFor(() => {
    expect(window.location.pathname).toBe('/provider-dashboard')
  })
  
  // 6. Vérifier service stocké
  const user = JSON.parse(localStorage.getItem('user'))
  expect(user.serviceType).toBe('nursing')
})
```

### Tests Manuels

**Checklist :**
- [ ] Email professionnel affiche sélection
- [ ] Email patient n'affiche pas sélection
- [ ] Tous les services sont cliquables
- [ ] Service sélectionné est visuellement distinct
- [ ] Erreur si pas de service sélectionné
- [ ] Service stocké après connexion
- [ ] Service affiché dans dashboard
- [ ] Responsive sur mobile
- [ ] Animation fluide

---

## 📞 Support

### FAQ

**Q: Pourquoi la sélection n'apparaît pas ?**
R: Votre email doit contenir un mot-clé professionnel (professional, provider, infirmier, kine, medecin, doctor, dr.)

**Q: Puis-je sélectionner plusieurs services ?**
R: Actuellement non, mais cette fonctionnalité arrive bientôt. Sélectionnez votre service principal.

**Q: Puis-je changer mon service après connexion ?**
R: Oui, dans les paramètres de votre profil professionnel.

**Q: Que se passe-t-il si je ne sélectionne pas de service ?**
R: Vous ne pourrez pas vous connecter. La sélection est obligatoire pour les professionnels.

---

**Document préparé par :** Équipe Produit  
**Date :** Janvier 2025  
**Version :** 1.0  
**Statut :** Déployé en Production ✅
