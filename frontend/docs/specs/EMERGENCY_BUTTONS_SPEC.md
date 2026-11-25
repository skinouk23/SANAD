
# Spécification - Boutons d'Urgence

## 📞 Vue d'ensemble

Système de boutons d'urgence visible et accessible pour permettre aux patients, notamment les personnes âgées, d'appeler rapidement les services d'urgence en Tunisie.

---

## 🎯 Objectifs

### Objectifs Utilisateurs
- **Accessibilité** : Boutons visibles et faciles à utiliser pour les personnes âgées
- **Rapidité** : Accès en 2 clics maximum aux numéros d'urgence
- **Sécurité** : Confirmation avant l'appel pour éviter les appels accidentels
- **Visibilité** : Présent sur toutes les pages importantes (login, accueil, dashboard)

### Objectifs Business
- **Conformité** : Respecter les obligations légales de sécurité
- **Confiance** : Rassurer les utilisateurs et leurs familles
- **Différenciation** : Fonctionnalité unique qui montre l'engagement envers la sécurité
- **Responsabilité sociale** : Contribuer à la sécurité publique

---

## 📱 Numéros d'Urgence en Tunisie

### Liste Complète

| Service | Numéro | Icône | Couleur | Description |
|---------|--------|-------|---------|-------------|
| **SAMU** | 190 | 🚑 | Rouge | Urgence médicale, ambulance |
| **Police** | 197 | 👮 | Bleu | Urgence sécuritaire, agression |
| **Pompiers** | 198 | 🚒 | Orange | Incendie, secours |
| **Protection Civile** | 193 | 🆘 | Jaune | Catastrophes naturelles |

### Caractéristiques
- **Gratuits** : Tous les numéros sont gratuits depuis n'importe quel téléphone
- **24/7** : Disponibles 24 heures sur 24, 7 jours sur 7
- **Multilingues** : Opérateurs parlant arabe et français
- **Géolocalisés** : Les services peuvent localiser l'appelant

---

## 🎨 Design et UX

### Variantes du Composant

#### 1. Floating Button (Bouton Flottant)

**Utilisation :** Pages publiques (Login, Landing Page)

**Caractéristiques :**
- Position fixe en bas à droite de l'écran
- Bouton rouge pulsant (animate-pulse) pour attirer l'attention
- Taille : 64x64px (w-16 h-16)
- Icône : Téléphone blanc
- Z-index : 50 (au-dessus de tout)

**États :**
```
État Fermé (par défaut):
- Bouton circulaire rouge pulsant
- Icône téléphone
- Hover: Scale 1.1

État Ouvert (après clic):
- Card avec liste des 4 numéros d'urgence
- Animation: slide-in-from-bottom
- Bouton fermer (X) en haut à droite
- Largeur: 320px (w-80)
```

**Exemple d'implémentation :**
```tsx
<EmergencyButtons variant="floating" />
```

#### 2. Inline Card (Carte Intégrée)

**Utilisation :** Dashboard patient (zone visible)

**Caractéristiques :**
- Intégré dans la grille du dashboard
- Fond dégradé rouge-orange (from-red-50 to-orange-50)
- Bordure rouge (border-red-200)
- Grille 2x2 pour les 4 numéros

**Tailles :**
- **Normal** : Boutons compacts (p-3, text-sm)
- **Large** : Boutons grands (p-4, text-lg) - Recommandé pour personnes âgées

**Exemple d'implémentation :**
```tsx
<EmergencyButtons variant="inline" size="large" />
```

### Design Tokens

**Couleurs par Service :**
```css
SAMU:
  - Background: bg-red-600
  - Hover: hover:bg-red-700
  - Light: bg-red-50, border-red-200

Police:
  - Background: bg-blue-600
  - Hover: hover:bg-blue-700
  - Light: bg-blue-50, border-blue-200

Pompiers:
  - Background: bg-orange-600
  - Hover: hover:bg-orange-700
  - Light: bg-orange-50, border-orange-200

Protection Civile:
  - Background: bg-yellow-600
  - Hover: hover:bg-yellow-700
  - Light: bg-yellow-50, border-yellow-200
```

**Typographie :**
```css
Nom du service: text-lg font-bold
Numéro: text-2xl font-bold (normal), text-4xl (modal)
Description: text-sm opacity-90
```

**Animations :**
```css
Bouton flottant: animate-pulse (pulsation continue)
Boutons service: hover:scale-105 (agrandissement au survol)
Card ouverture: animate-in slide-in-from-bottom-4
```

---

## 🔄 Flow Utilisateur

### Scénario 1 : Appel d'Urgence depuis Page Login

```
1. DÉCOUVERTE
   Utilisateur sur page login
   ↓
   Voit bouton rouge pulsant en bas à droite
   ↓
   Bouton attire l'attention (animation pulse)

2. OUVERTURE
   Clic sur bouton flottant
   ↓
   Card s'ouvre avec animation slide-in
   ↓
   Affiche 4 boutons d'urgence colorés

3. SÉLECTION
   Utilisateur choisit un service (ex: SAMU)
   ↓
   Clic sur bouton SAMU rouge

4. CONFIRMATION
   Modal de confirmation s'ouvre
   ↓
   Affiche:
   - Icône du service (🚑)
   - Nom du service (SAMU)
   - Description (Urgence médicale)
   - Numéro en grand (190)
   - 2 boutons: Annuler | Appeler

5. APPEL
   Utilisateur clique "Appeler"
   ↓
   window.location.href = 'tel:190'
   ↓
   Téléphone lance l'appel
   ↓
   Modal se ferme
   ↓
   Card se ferme
```

### Scénario 2 : Appel d'Urgence depuis Dashboard

```
1. VISIBILITÉ
   Patient sur dashboard
   ↓
   Voit card "Urgence" dans section "Actions rapides"
   ↓
   Card avec fond rouge-orange attire l'œil

2. ACCÈS DIRECT
   Clic direct sur un des 4 boutons
   ↓
   Pas besoin d'ouvrir/fermer de menu

3. CONFIRMATION
   Modal de confirmation (même que scénario 1)
   ↓
   Utilisateur confirme

4. APPEL
   Téléphone lance l'appel
```

---

## 🎯 Placement Stratégique

### Pages avec Bouton Flottant

**1. Page Login (/auth/login)**
- **Raison** : Accessible avant connexion
- **Utilisateurs** : Visiteurs, personnes en détresse
- **Variante** : Floating
- **Priorité** : Haute

**2. Landing Page (/)**
- **Raison** : Page d'entrée principale
- **Utilisateurs** : Nouveaux visiteurs
- **Variante** : Floating
- **Priorité** : Haute

**3. Page Inscription (/auth/signup)**
- **Raison** : Processus long, utilisateur peut avoir besoin d'aide
- **Utilisateurs** : Nouveaux utilisateurs
- **Variante** : Floating
- **Priorité** : Moyenne

### Pages avec Card Intégrée

**1. Patient Dashboard (/patient-dashboard)**
- **Raison** : Page principale des patients
- **Utilisateurs** : Patients (souvent âgés)
- **Variante** : Inline, size="large"
- **Position** : Section "Actions rapides" (visible sans scroll)
- **Priorité** : Critique

**2. Provider Dashboard (/provider-dashboard)**
- **Raison** : Professionnels peuvent avoir besoin d'appeler urgence pour patient
- **Utilisateurs** : Professionnels de santé
- **Variante** : Inline, size="normal"
- **Position** : Sidebar ou footer
- **Priorité** : Moyenne

---

## 🧓 Optimisation pour Personnes Âgées

### Principes de Design

**1. Taille et Contraste**
```tsx
// Boutons GRANDS
size="large"
- Boutons: min 80x80px
- Texte numéro: text-4xl (36px)
- Icônes: text-5xl (48px)
- Espacement généreux: p-4, gap-3
```

**2. Couleurs Vives**
```css
/* Contraste élevé pour visibilité */
background: bg-red-600 (couleur vive)
text: text-white (contraste maximum)
border: border-2 (bordures épaisses)
```

**3. Feedback Visuel**
```css
/* Retour visuel immédiat */
hover:scale-105 (agrandissement au survol)
active:scale-95 (enfoncement au clic)
transition-all (animations fluides)
```

**4. Texte Lisible**
```css
/* Typographie claire */
font-bold (gras pour lisibilité)
text-lg, text-xl (tailles généreuses)
leading-relaxed (interligne confortable)
```

**5. Simplicité**
```
- Maximum 2 clics pour appeler
- Pas de menu caché
- Instructions claires
- Confirmation simple (Annuler | Appeler)
```

### Accessibilité (A11y)

**ARIA Labels :**
```tsx
<button aria-label="Urgence - Appeler les services d'urgence">
  <Phone className="h-8 w-8" />
</button>
```

**Keyboard Navigation :**
```tsx
// Tous les boutons accessibles au clavier
tabIndex={0}
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleCall()
  }
}}
```

**Screen Reader :**
```tsx
<span className="sr-only">
  Appeler le SAMU au 190 pour urgence médicale
</span>
```

---

## 🔒 Sécurité et Prévention

### Confirmation Obligatoire

**Pourquoi ?**
- Éviter les appels accidentels (touch screens sensibles)
- Prévenir les fausses alertes
- Responsabiliser l'utilisateur

**Modal de Confirmation :**
```tsx
<div className="text-center">
  <div className="w-20 h-20 bg-red-100 rounded-full">
    <span className="text-5xl">🚑</span>
  </div>
  <h3 className="text-2xl font-bold">
    Appeler le SAMU ?
  </h3>
  <p className="text-gray-600">Urgence médicale</p>
  <p className="text-4xl font-bold text-red-600">190</p>
  
  <div className="flex gap-3">
    <Button variant="outline">Annuler</Button>
    <Button variant="destructive">
      <Phone className="mr-2" />
      Appeler
    </Button>
  </div>
</div>
```

### Message de Responsabilité

**Texte affiché :**
```
⚠️ N'appelez qu'en cas de réelle urgence
```

**Position :**
- En bas de la card d'urgence (floating)
- En petit texte (text-xs)
- Couleur grise (text-gray-600)

---

## 📊 Analytics et Monitoring

### Événements à Tracker

**1. Ouverture Menu Urgence**
```typescript
analytics.track('emergency_menu_opened', {
  page: window.location.pathname,
  timestamp: new Date(),
  userType: 'patient' | 'visitor'
})
```

**2. Sélection Service**
```typescript
analytics.track('emergency_service_selected', {
  service: 'samu' | 'police' | 'pompiers' | 'protection-civile',
  page: window.location.pathname
})
```

**3. Confirmation Appel**
```typescript
analytics.track('emergency_call_confirmed', {
  service: 'samu',
  number: '190',
  timestamp: new Date()
})
```

**4. Annulation**
```typescript
analytics.track('emergency_call_cancelled', {
  service: 'samu',
  reason: 'user_cancelled'
})
```

### KPIs à Suivre

**Utilisation :**
- Nombre d'ouvertures du menu urgence / jour
- Nombre d'appels confirmés / jour
- Taux de conversion (ouverture → appel)
- Service le plus utilisé

**Performance :**
- Temps moyen pour ouvrir le menu
- Temps moyen pour confirmer l'appel
- Taux d'annulation

**Qualité :**
- Feedback utilisateurs sur la fonctionnalité
- Nombre de fausses alertes signalées
- Satisfaction des utilisateurs âgés

---

## 🧪 Tests et Validation

### Tests Utilisateurs

**Groupe Cible : Personnes Âgées (60+ ans)**

**Scénarios de Test :**

1. **Test de Découverte**
   - L'utilisateur trouve-t-il le bouton facilement ?
   - Comprend-il que c'est pour les urgences ?
   - Temps de découverte : < 5 secondes

2. **Test d'Utilisation**
   - L'utilisateur peut-il ouvrir le menu ?
   - Peut-il sélectionner un service ?
   - Peut-il confirmer l'appel ?
   - Temps total : < 10 secondes

3. **Test de Lisibilité**
   - Les numéros sont-ils lisibles ?
   - Les icônes sont-elles compréhensibles ?
   - Les couleurs sont-elles distinguables ?

4. **Test d'Accessibilité**
   - Utilisable avec lunettes ?
   - Utilisable avec tremblements (Parkinson) ?
   - Utilisable au clavier ?

**Critères de Succès :**
- ✅ 90% des utilisateurs trouvent le bouton en < 5s
- ✅ 95% des utilisateurs peuvent appeler en < 10s
- ✅ 100% des utilisateurs lisent les numéros sans erreur
- ✅ 0 faux appels pendant les tests

### Tests Techniques

**1. Tests de Compatibilité**
```typescript
// Tester sur différents navigateurs
- Chrome (Desktop & Mobile)
- Safari (iOS)
- Firefox
- Edge

// Tester sur différents devices
- iPhone (iOS 14+)
- Android (Android 10+)
- Tablettes
- Desktop
```

**2. Tests de Performance**
```typescript
// Temps de chargement
- Bouton flottant visible en < 100ms
- Card s'ouvre en < 200ms
- Modal s'affiche en < 150ms

// Animations fluides
- 60 FPS sur toutes les animations
- Pas de lag au scroll
```

**3. Tests de Sécurité**
```typescript
// Prévention des appels accidentels
- Confirmation obligatoire
- Pas d'auto-dial
- Bouton annuler toujours visible

// Protection des données
- Pas de tracking des appels réels
- Anonymisation des analytics
```

---

## 🚀 Roadmap Améliorations

### Phase 1 : MVP (Actuel) ✅
- Bouton flottant sur login et landing page
- Card intégrée sur dashboard
- 4 numéros d'urgence tunisiens
- Modal de confirmation
- Design optimisé personnes âgées

### Phase 2 : Court Terme (1-2 mois)
- **Géolocalisation** : Envoyer position GPS lors de l'appel
- **Historique** : Log des appels d'urgence (anonymisé)
- **Langues** : Support arabe pour les numéros
- **Raccourci clavier** : Ctrl+E pour ouvrir menu urgence
- **Widget mobile** : Bouton encore plus grand sur mobile

### Phase 3 : Moyen Terme (3-6 mois)
- **Contacts d'urgence personnels** : Ajouter famille/médecin
- **Appel automatique** : Bouton SOS qui appelle directement
- **Message pré-enregistré** : Envoyer SMS automatique à la famille
- **Intégration wearables** : Apple Watch, smartwatch
- **Bouton physique** : Partenariat pour bouton d'urgence physique

### Phase 4 : Long Terme (6-12 mois)
- **IA de détection** : Détection chute/malaise automatique
- **Vidéo urgence** : Appel vidéo avec médecin d'urgence
- **Dossier médical** : Partage automatique avec SAMU
- **Réseau d'aidants** : Alerte voisins/aidants proches
- **Certification** : Certification officielle par autorités tunisiennes

---

## 📄 Documentation Technique

### Props du Composant

```typescript
interface EmergencyButtonsProps {
  variant?: 'floating' | 'inline'
  size?: 'normal' | 'large'
}
```

### Utilisation

**Bouton Flottant :**
```tsx
import { EmergencyButtons } from '../components/EmergencyButtons'

export function LoginPage() {
  return (
    <div>
      <EmergencyButtons variant="floating" />
      {/* Reste de la page */}
    </div>
  )
}
```

**Card Intégrée :**
```tsx
import { EmergencyButtons } from '../components/EmergencyButtons'

export function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <QuickActions />
      <EmergencyButtons variant="inline" size="large" />
    </div>
  )
}
```

### Personnalisation

**Modifier les Numéros :**
```typescript
// Dans EmergencyButtons.tsx
const emergencyContacts: EmergencyContact[] = [
  {
    id: 'samu',
    name: 'SAMU',
    number: '190', // Modifier ici
    icon: '🚑',
    color: 'bg-red-600 hover:bg-red-700',
    description: 'Urgence médicale'
  },
  // ...
]
```

**Ajouter un Nouveau Service :**
```typescript
{
  id: 'garde-nationale',
  name: 'Garde Nationale',
  number: '193',
  icon: '🛡️',
  color: 'bg-green-600 hover:bg-green-700',
  description: 'Sécurité routière'
}
```

---

## 🎓 Formation et Support

### Guide Utilisateur

**Pour les Patients :**
1. Cherchez le bouton rouge en bas à droite de l'écran
2. Cliquez dessus pour voir les numéros d'urgence
3. Choisissez le service dont vous avez besoin
4. Confirmez l'appel
5. Votre téléphone composera automatiquement le numéro

**Pour les Familles :**
- Montrez à votre proche où se trouve le bouton
- Expliquez quand l'utiliser (vraie urgence uniquement)
- Testez ensemble (sans confirmer l'appel)
- Rassurez-les : c'est simple et rapide

### FAQ

**Q: Le bouton fonctionne-t-il sans connexion internet ?**
R: Oui, une fois la page chargée, le bouton fonctionne même hors ligne. L'appel téléphonique ne nécessite pas internet.

**Q: Les appels sont-ils gratuits ?**
R: Oui, tous les numéros d'urgence (190, 197, 198, 193) sont gratuits en Tunisie.

**Q: Puis-je annuler après avoir cliqué ?**
R: Oui, une confirmation est toujours demandée. Vous pouvez annuler à tout moment.

**Q: Le bouton est-il disponible sur mobile ?**
R: Oui, le bouton est optimisé pour mobile et tablette.

**Q: Mes appels sont-ils enregistrés ?**
R: Non, nous ne suivons pas les appels réels. Seules des statistiques anonymes sont collectées.

---

## ✅ Checklist de Déploiement

### Avant le Déploiement

- [ ] Tests utilisateurs avec personnes âgées (5+ personnes)
- [ ] Tests sur tous les navigateurs majeurs
- [ ] Tests sur iOS et Android
- [ ] Vérification accessibilité (WCAG 2.1 AA)
- [ ] Validation numéros d'urgence avec autorités
- [ ] Documentation utilisateur rédigée
- [ ] Formation équipe support

### Après le Déploiement

- [ ] Monitoring analytics activé
- [ ] Alertes configurées (erreurs, usage anormal)
- [ ] Feedback utilisateurs collecté
- [ ] Ajustements basés sur données réelles
- [ ] Communication aux utilisateurs (email, notification)

---

## 📞 Contact et Support

**Équipe Responsable :**
- Product Manager : [Nom]
- Designer UX : [Nom]
- Développeur : [Nom]

**Support Technique :**
- Email : support@careathome.tn
- Téléphone : +216 XX XXX XXX
- Horaires : 24/7

---

**Document préparé par :** Équipe Produit  
**Date :** Janvier 2025  
**Version :** 1.0  
**Statut :** Déployé en Production ✅

---

**Fin de la Spécification**

*Cette fonctionnalité peut sauver des vies. Traitons-la avec le sérieux qu'elle mérite.* 🚑
