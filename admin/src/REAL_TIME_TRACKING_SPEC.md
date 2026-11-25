
# Spécification Technique - Suivi en Temps Réel

## 📍 Vue d'ensemble

Système de suivi géolocalisé en temps réel permettant aux patients de suivre la position de leur professionnel de santé ou ambulance pendant le trajet vers leur domicile.

---

## 🎯 Objectifs

### Objectifs Utilisateur
- **Transparence** : Savoir où se trouve le professionnel/ambulance en temps réel
- **Réassurance** : Estimation précise de l'heure d'arrivée
- **Communication** : Pouvoir contacter facilement le professionnel
- **Préparation** : Se préparer à l'arrivée du professionnel

### Objectifs Business
- **Réduction no-shows** : Moins d'annulations de dernière minute
- **Satisfaction client** : Expérience premium et moderne
- **Différenciation** : Fonctionnalité unique sur le marché tunisien
- **Efficacité** : Optimisation des trajets et temps d'attente

---

## 🗺️ Technologies Utilisées

### Cartographie
- **OpenStreetMap** (Leaflet.js 1.9.4)
  - Gratuit et open-source
  - Pas de limite d'API calls
  - Données cartographiques complètes pour la Tunisie
  - Alternative à Google Maps (payant)

### Géolocalisation
- **HTML5 Geolocation API**
  - Récupération position GPS du professionnel
  - Précision : 5-50m selon conditions
  - Mise à jour toutes les 3-5 secondes

### Routing (Optionnel)
- **OSRM (Open Source Routing Machine)**
  - Calcul d'itinéraire optimal
  - Estimation temps de trajet
  - Alternative gratuite à Google Directions API

---

## 🎨 Composants Créés

### 1. LiveTrackingMap.tsx

**Fonctionnalités :**
- Affichage carte OpenStreetMap interactive
- Marqueurs personnalisés (patient + professionnel/ambulance)
- Ligne de trajet (polyline) entre les deux positions
- Mise à jour position en temps réel (toutes les 3 secondes)
- Calcul distance et durée estimée
- Popups informatifs sur les marqueurs
- Légende explicative

**Props :**
```typescript
interface LiveTrackingMapProps {
  appointmentId: string
  providerType: 'professional' | 'ambulance'
  providerName: string
  providerPhone: string
  providerImage?: string
  patientLocation: {
    lat: number
    lng: number
    address: string
  }
  estimatedArrival: string
  onCallProvider: () => void
  onMessageProvider: () => void
}
```

**Marqueurs Personnalisés :**

**Patient (Maison) :**
- Forme : Teardrop (goutte) teal
- Icône : Maison blanche
- Taille : 40x40px
- Animation : Aucune

**Professionnel :**
- Forme : Teardrop (goutte) bleue
- Icône : Personne blanche
- Taille : 50x50px
- Animation : Pulse (pulsation)

**Ambulance :**
- Forme : Teardrop (goutte) rouge
- Icône : Ambulance blanche
- Taille : 50x50px
- Animation : Pulse (pulsation)

### 2. TrackingPage.tsx

**Fonctionnalités :**
- Page complète de suivi
- Layout responsive (carte + sidebar)
- Détails du rendez-vous
- Timeline de statut
- Boutons d'action (appel, message)
- Contact d'urgence (SAMU 190)
- Support client

**Sections :**
1. **Header** : Titre, statut "En route"
2. **Carte** : Composant LiveTrackingMap
3. **Sidebar** :
   - Détails rendez-vous
   - Timeline statut
   - Contact urgence
   - Aide

---

## 📱 Flow Utilisateur

### 1. Activation du Suivi

```
Patient Dashboard → Rendez-vous confirmé
↓
Bouton "Suivre" visible (bleu avec icône MapPinned)
↓
Clic → Navigation vers /tracking/:appointmentId
↓
Page de suivi s'ouvre
```

### 2. Pendant le Trajet

```
Professionnel démarre trajet
↓
Position GPS envoyée au backend (toutes les 5 secondes)
↓
Backend broadcast position via WebSocket
↓
Frontend reçoit position et met à jour carte
↓
Marqueur professionnel se déplace
↓
Distance et durée recalculées
↓
Ligne de trajet redessinée
```

### 3. À l'Arrivée

```
Professionnel arrive (distance < 50m)
↓
Notification push patient : "Votre professionnel est arrivé"
↓
Statut change : "En route" → "Arrivé"
↓
Bouton "Terminer le service" activé (professionnel)
```

---

## 🔧 Implémentation Backend

### Architecture

```
┌─────────────┐
│  Frontend   │ (React + Leaflet)
└──────┬──────┘
       │ WebSocket
       ↓
┌─────────────┐
│   Backend   │ (Node.js + Socket.io)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Redis     │ (Cache positions)
└─────────────┘
```

### API Endpoints

**1. Démarrer le suivi**
```typescript
POST /api/appointments/:id/start-tracking

Request:
{
  providerId: string
  initialLocation: {
    lat: number
    lng: number
  }
}

Response:
{
  trackingId: string
  status: 'active'
}
```

**2. Mettre à jour position (Professionnel)**
```typescript
PUT /api/tracking/:trackingId/location

Request:
{
  lat: number
  lng: number
  timestamp: Date
}

Response:
{
  success: boolean
  distance: number // en km
  estimatedArrival: string // ISO date
}
```

**3. Obtenir position actuelle (Patient)**
```typescript
GET /api/tracking/:trackingId

Response:
{
  providerLocation: {
    lat: number
    lng: number
    lastUpdate: Date
  }
  patientLocation: {
    lat: number
    lng: number
    address: string
  }
  distance: number
  duration: number // en minutes
  status: 'en_route' | 'arrived' | 'completed'
}
```

### WebSocket Events

**Côté Professionnel (Émission) :**
```typescript
// Émettre position
socket.emit('provider:location:update', {
  trackingId: 'track_123',
  lat: 36.8065,
  lng: 10.1815,
  timestamp: new Date()
})
```

**Côté Patient (Réception) :**
```typescript
// Recevoir position
socket.on('provider:location:updated', (data) => {
  const { lat, lng, distance, duration } = data
  updateMapMarker(lat, lng)
  updateDistanceDisplay(distance, duration)
})

// Recevoir arrivée
socket.on('provider:arrived', (data) => {
  showNotification('Votre professionnel est arrivé !')
  updateStatus('arrived')
})
```

### Stockage Redis

**Structure :**
```typescript
// Position actuelle
tracking:track_123:location
{
  lat: 36.8065,
  lng: 10.1815,
  timestamp: '2025-01-15T14:30:00Z',
  speed: 45 // km/h
}

// Historique positions (liste)
tracking:track_123:history
[
  { lat: 36.8065, lng: 10.1815, timestamp: '...' },
  { lat: 36.8070, lng: 10.1820, timestamp: '...' },
  ...
]

// TTL: 24 heures
```

---

## 📊 Calculs et Algorithmes

### 1. Distance (Formule Haversine)

```typescript
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * 
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance en km
}
```

### 2. Durée Estimée

**Méthode Simple :**
```typescript
// Vitesse moyenne en ville : 25 km/h
const estimatedDuration = (distance / 25) * 60 // en minutes
```

**Méthode Avancée (avec OSRM) :**
```typescript
async function getRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) {
  const url = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
  
  const response = await fetch(url)
  const data = await response.json()
  
  return {
    distance: data.routes[0].distance / 1000, // km
    duration: data.routes[0].duration / 60, // minutes
    geometry: data.routes[0].geometry // GeoJSON
  }
}
```

### 3. Détection Arrivée

```typescript
function hasArrived(
  providerLat: number,
  providerLng: number,
  patientLat: number,
  patientLng: number
): boolean {
  const distance = calculateDistance(
    providerLat, 
    providerLng, 
    patientLat, 
    patientLng
  )
  
  // Considéré arrivé si distance < 50m
  return distance < 0.05 // 0.05 km = 50m
}
```

---

## 🔒 Sécurité et Vie Privée

### Protection des Données

**1. Anonymisation Position**
- Position précise visible uniquement pendant le trajet actif
- Historique supprimé après 24h
- Pas de stockage permanent des trajets

**2. Contrôle d'Accès**
```typescript
// Vérifier que le patient peut accéder au tracking
async function canAccessTracking(
  userId: string, 
  trackingId: string
): Promise<boolean> {
  const tracking = await db.tracking.findUnique({
    where: { id: trackingId },
    include: { appointment: true }
  })
  
  return tracking.appointment.patientId === userId
}
```

**3. Rate Limiting**
```typescript
// Limiter les mises à jour position
const rateLimiter = rateLimit({
  windowMs: 1000, // 1 seconde
  max: 1, // 1 update max par seconde
  message: 'Too many location updates'
})

app.put('/api/tracking/:id/location', rateLimiter, updateLocation)
```

### Gestion Erreurs

**1. GPS Indisponible**
```typescript
if (!navigator.geolocation) {
  showError('Géolocalisation non supportée par votre navigateur')
  return
}

navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success
    updateLocation(position.coords)
  },
  (error) => {
    // Error
    switch(error.code) {
      case error.PERMISSION_DENIED:
        showError('Veuillez autoriser la géolocalisation')
        break
      case error.POSITION_UNAVAILABLE:
        showError('Position GPS indisponible')
        break
      case error.TIMEOUT:
        showError('Délai de géolocalisation dépassé')
        break
    }
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
)
```

**2. Connexion Perdue**
```typescript
socket.on('disconnect', () => {
  showWarning('Connexion perdue. Reconnexion...')
  // Tentative de reconnexion automatique
})

socket.on('reconnect', () => {
  showSuccess('Connexion rétablie')
  // Récupérer dernière position connue
  fetchLastKnownLocation()
})
```

---

## 📱 Optimisations Mobile

### 1. Économie Batterie

**Ajustement Fréquence GPS :**
```typescript
// Distance > 5km : update toutes les 10 secondes
// Distance 1-5km : update toutes les 5 secondes
// Distance < 1km : update toutes les 3 secondes

function getUpdateInterval(distance: number): number {
  if (distance > 5) return 10000 // 10s
  if (distance > 1) return 5000  // 5s
  return 3000 // 3s
}
```

**Mode Économie d'Énergie :**
```typescript
// Détecter batterie faible
navigator.getBattery().then((battery) => {
  if (battery.level < 0.2) {
    // Passer en mode économie
    setUpdateInterval(15000) // 15s au lieu de 3s
    disableHighAccuracy()
  }
})
```

### 2. Optimisation Réseau

**Compression Données :**
```typescript
// Envoyer seulement si position a changé significativement
function shouldSendUpdate(
  oldLat: number, 
  oldLng: number, 
  newLat: number, 
  newLng: number
): boolean {
  const distance = calculateDistance(oldLat, oldLng, newLat, newLng)
  return distance > 0.01 // > 10m
}
```

**Batch Updates :**
```typescript
// Grouper plusieurs positions en un seul envoi
const positionBuffer: Position[] = []

setInterval(() => {
  if (positionBuffer.length > 0) {
    socket.emit('provider:location:batch', positionBuffer)
    positionBuffer.length = 0
  }
}, 5000) // Envoi toutes les 5 secondes
```

---

## 🎨 Personnalisation UI

### Thèmes par Type de Service

**Professionnel de Santé :**
- Couleur : Bleu (#3b82f6)
- Icône : Personne avec stéthoscope
- Message : "Votre professionnel arrive"

**Ambulance :**
- Couleur : Rouge (#ef4444)
- Icône : Ambulance
- Message : "L'ambulance arrive"
- Son : Sirène (optionnel)

### Animations

**Marqueur en Mouvement :**
```css
@keyframes pulse {
  0%, 100% { 
    transform: rotate(-45deg) scale(1); 
  }
  50% { 
    transform: rotate(-45deg) scale(1.1); 
  }
}

.provider-marker {
  animation: pulse 2s infinite;
}
```

**Ligne de Trajet :**
```typescript
// Ligne pointillée animée
const routeLayer = L.polyline(coordinates, {
  color: '#3b82f6',
  weight: 4,
  opacity: 0.7,
  dashArray: '10, 10', // Pointillés
  lineCap: 'round'
})
```

---

## 📊 Métriques et Analytics

### KPIs à Suivre

**Utilisation :**
- % patients qui utilisent le suivi
- Durée moyenne de suivi
- Nombre de rafraîchissements carte

**Performance :**
- Précision GPS moyenne
- Latence mise à jour position
- Taux d'erreur géolocalisation

**Satisfaction :**
- Réduction no-shows avec suivi vs sans
- Note satisfaction fonctionnalité
- Feedback utilisateurs

### Événements à Logger

```typescript
// Démarrage suivi
analytics.track('tracking_started', {
  appointmentId: 'apt_123',
  providerType: 'professional',
  distance: 2.5 // km
})

// Arrivée
analytics.track('provider_arrived', {
  appointmentId: 'apt_123',
  actualDuration: 8, // minutes
  estimatedDuration: 10 // minutes
})

// Erreur GPS
analytics.track('tracking_error', {
  errorType: 'gps_unavailable',
  appointmentId: 'apt_123'
})
```

---

## 🚀 Roadmap Améliorations

### Phase 1 (MVP) ✅
- Carte OpenStreetMap basique
- Marqueurs personnalisés
- Ligne de trajet simple
- Mise à jour position simulée

### Phase 2 (Court Terme)
- Intégration GPS réel (HTML5 Geolocation)
- WebSocket temps réel
- Calcul itinéraire OSRM
- Notifications push arrivée

### Phase 3 (Moyen Terme)
- Historique trajets
- Partage position avec famille
- Mode hors ligne (cache carte)
- Optimisation batterie avancée

### Phase 4 (Long Terme)
- Prédiction temps d'arrivée ML
- Détection trafic en temps réel
- Itinéraire alternatif automatique
- Intégration Waze/Google Maps

---

## 📞 Support et Maintenance

### Monitoring

**Alertes Automatiques :**
- Position non mise à jour depuis >2 min
- Taux d'erreur GPS >10%
- Latence WebSocket >1s
- Professionnel hors zone (>50km)

**Dashboard Admin :**
- Suivis actifs en temps réel
- Carte avec tous les professionnels
- Statistiques journalières
- Logs erreurs

### Troubleshooting

**Problème : Position ne se met pas à jour**
```
1. Vérifier autorisation GPS (navigateur)
2. Vérifier connexion WebSocket
3. Vérifier batterie appareil
4. Redémarrer suivi
```

**Problème : Carte ne charge pas**
```
1. Vérifier connexion internet
2. Vérifier CDN Leaflet accessible
3. Vérifier console erreurs JS
4. Rafraîchir page
```

---

## 📄 Conclusion

Le système de suivi en temps réel offre une expérience premium et rassurante pour les patients, tout en optimisant l'efficacité opérationnelle de la plateforme. L'utilisation d'OpenStreetMap garantit une solution gratuite, scalable et performante adaptée au marché tunisien.

**Prochaines étapes :**
1. Implémenter backend WebSocket
2. Intégrer GPS réel côté professionnel
3. Tests utilisateurs beta
4. Déploiement progressif

---

**Document préparé par :** Équipe Technique  
**Date :** Janvier 2025  
**Version :** 1.0  
**Statut :** Prêt pour implémentation
