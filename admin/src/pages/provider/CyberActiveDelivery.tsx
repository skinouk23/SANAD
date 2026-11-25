import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  createElement } from
'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  Check,
  Play,
  Flag,
  User,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle2 } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useServiceRequest } from '../../hooks/useDelivery';
import type { ServiceRequest } from '../../hooks/useDelivery';
type DeliveryStatus =
'pending' |
'en_route' |
'arrived' |
'in_progress' |
'completed';
// Mock service request data
const mockServiceRequest: ServiceRequest = {
  id: 'apt-001',
  patientName: 'Mme. Fatma Ben Ali',
  patientPhone: '+216 98 765 432',
  serviceName: 'Soins Infirmiers - Injection',
  serviceType: 'nursing',
  price: 45,
  currency: 'TND',
  patientLocation: {
    lat: 36.8065,
    lng: 10.1815,
    address: '15 Rue de la Liberté, Tunis 1000'
  },
  scheduledTime: '14:30',
  notes: 'Injection intramusculaire. Patiente diabétique.'
};
export function CyberActiveDelivery() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { isDark } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const providerMarkerRef = useRef<any>(null);
  const patientMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const [status, setStatus] = useState<DeliveryStatus>('pending');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Use hook instead of inline mock data
  const { data: serviceRequestData } = useServiceRequest(appointmentId);
  const serviceRequest = serviceRequestData || {
    id: 'apt-001',
    patientName: 'Chargement...',
    patientPhone: '',
    serviceName: '',
    serviceType: '',
    price: 0,
    currency: 'TND',
    patientLocation: {
      lat: 36.8065,
      lng: 10.1815,
      address: ''
    },
    scheduledTime: '--:--'
  };
  const [providerLocation, setProviderLocation] = useState({
    lat: 36.8165,
    lng: 10.1715
  });
  const [distance, setDistance] = useState<string>('--');
  const [duration, setDuration] = useState<string>('--');
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  // Calculate distance between two points
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );
  // Fetch route from OSRM
  const fetchRoute = useCallback(
    async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number) =>
    {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] as [number, number]
          );
          setRouteCoordinates(coords);
          // Update distance and duration
          const distKm = route.distance / 1000;
          const durMin = Math.ceil(route.duration / 60);
          setDistance(`${distKm.toFixed(1)} km`);
          setDuration(`${durMin} min`);
          return coords;
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback to straight line
        const dist = calculateDistance(startLat, startLng, endLat, endLng);
        setDistance(`${dist.toFixed(1)} km`);
        setDuration(`${Math.ceil(dist * 2)} min`);
      }
      return null;
    },
    [calculateDistance]
  );
  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      if ((window as any).L) {
        setMapLoaded(true);
        return;
      }
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(cssLink);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };
    loadLeaflet();
    // Add pulse animation styles
    const styleId = 'provider-marker-pulse';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes providerPulse {
          0%, 100% { transform: rotate(-45deg) scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { transform: rotate(-45deg) scale(1.05); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        .provider-marker-pulse {
          animation: providerPulse 2s infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([providerLocation.lat, providerLocation.lng], 14);
    // Add zoom control to top-right
    L.control.
    zoom({
      position: 'topright'
    }).
    addTo(map);
    // Dark/light tile layer
    const tileUrl = isDark ?
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map);
    // Provider marker (blue, pulsing)
    const providerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <div class="provider-marker-pulse" style="
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg style="width: 22px; height: 22px; transform: rotate(45deg); fill: white;" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 44]
    });
    // Patient marker (teal)
    const patientIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative;">
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg style="width: 20px; height: 20px; transform: rotate(45deg); fill: white;" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    providerMarkerRef.current = L.marker(
      [providerLocation.lat, providerLocation.lng],
      {
        icon: providerIcon
      }
    ).addTo(map);
    patientMarkerRef.current = L.marker(
      [serviceRequest.patientLocation.lat, serviceRequest.patientLocation.lng],
      {
        icon: patientIcon
      }
    ).addTo(map);
    // Fit bounds to show both markers
    const bounds = L.latLngBounds([
    [providerLocation.lat, providerLocation.lng],
    [serviceRequest.patientLocation.lat, serviceRequest.patientLocation.lng]]
    );
    map.fitBounds(bounds, {
      padding: [60, 60]
    });
    mapInstanceRef.current = map;
    // Fetch initial route
    fetchRoute(
      providerLocation.lat,
      providerLocation.lng,
      serviceRequest.patientLocation.lat,
      serviceRequest.patientLocation.lng
    ).then((coords) => {
      if (coords && mapInstanceRef.current) {
        const routeLine = L.polyline(coords, {
          color: '#3b82f6',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 10',
          lineCap: 'round'
        }).addTo(mapInstanceRef.current);
        routeLayerRef.current = routeLine;
      }
      setIsLoading(false);
    });
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, isDark]);
  // Simulate provider movement along route
  useEffect(() => {
    if (status !== 'en_route' || routeCoordinates.length === 0) return;
    const interval = setInterval(() => {
      setCurrentRouteIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= routeCoordinates.length) {
          clearInterval(interval);
          return prev;
        }
        const newPos = routeCoordinates[nextIndex];
        setProviderLocation({
          lat: newPos[0],
          lng: newPos[1]
        });
        // Update marker position
        if (providerMarkerRef.current) {
          providerMarkerRef.current.setLatLng(newPos);
        }
        // Update route line (remaining route)
        if (routeLayerRef.current && mapInstanceRef.current) {
          const L = (window as any).L;
          mapInstanceRef.current.removeLayer(routeLayerRef.current);
          const remainingRoute = routeCoordinates.slice(nextIndex);
          routeLayerRef.current = L.polyline(remainingRoute, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.8,
            dashArray: '10, 10',
            lineCap: 'round'
          }).addTo(mapInstanceRef.current);
        }
        // Update distance and ETA
        const remainingCoords = routeCoordinates.slice(nextIndex);
        let totalDist = 0;
        for (let i = 0; i < remainingCoords.length - 1; i++) {
          totalDist += calculateDistance(
            remainingCoords[i][0],
            remainingCoords[i][1],
            remainingCoords[i + 1][0],
            remainingCoords[i + 1][1]
          );
        }
        setDistance(`${totalDist.toFixed(1)} km`);
        setDuration(`${Math.ceil(totalDist * 2)} min`);
        return nextIndex;
      });
    }, 1000); // Move every second for demo
    return () => clearInterval(interval);
  }, [status, routeCoordinates, calculateDistance]);
  // Start real GPS tracking when en_route
  useEffect(() => {
    if (status !== 'en_route') return;
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProviderLocation({
            lat: latitude,
            lng: longitude
          });
          if (providerMarkerRef.current) {
            providerMarkerRef.current.setLatLng([latitude, longitude]);
          }
          // Recalculate route
          fetchRoute(
            latitude,
            longitude,
            serviceRequest.patientLocation.lat,
            serviceRequest.patientLocation.lng
          );
        },
        (error) => {
          console.log('GPS not available, using simulation:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [status, fetchRoute, serviceRequest.patientLocation]);
  const handleStartJourney = () => {
    setStatus('en_route');
    setCurrentRouteIndex(0);
  };
  const handleArrived = () => {
    setStatus('arrived');
    setDistance('0 m');
    setDuration('Arrivé');
  };
  const handleStartService = () => {
    setStatus('in_progress');
  };
  const handleCompleteService = () => {
    setStatus('completed');
  };
  const handleCall = () => {
    window.location.href = `tel:${serviceRequest.patientPhone}`;
  };
  const handleMessage = () => {
    navigate('/messages');
  };
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'from-slate-500 to-slate-600';
      case 'en_route':
        return 'from-blue-500 to-blue-600';
      case 'arrived':
        return 'from-amber-500 to-orange-500';
      case 'in_progress':
        return 'from-purple-500 to-pink-500';
      case 'completed':
        return 'from-green-500 to-emerald-500';
    }
  };
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'en_route':
        return 'En route';
      case 'arrived':
        return 'Arrivé';
      case 'in_progress':
        return 'Service en cours';
      case 'completed':
        return 'Terminé';
    }
  };
  if (status === 'completed') {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        
        <div
          className={`max-w-md w-full backdrop-blur-sm border rounded-2xl p-8 text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
          
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Service terminé !
          </h2>
          <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Le service pour {serviceRequest.patientName} a été complété avec
            succès.
          </p>
          <div
            className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            
            <div className="flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Montant
              </span>
              <span
                className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {serviceRequest.price} {serviceRequest.currency}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/provider-dashboard')}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            
            Retour au tableau de bord
          </button>
        </div>
      </div>);

  }
  return (
    <div
      className={`h-screen w-screen overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* Fixed Map - Full screen background */}
      <div className="fixed inset-0 z-0">
        {isLoading &&
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
          
            <div className="text-center">
              <Loader2
              className={`h-10 w-10 animate-spin mx-auto mb-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Chargement de la carte...
              </p>
            </div>
          </div>
        }
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Fixed Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-md border-b ${isDark ? 'bg-slate-900/90 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}>
        
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/provider-dashboard')}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div
              className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getStatusColor()} text-white text-sm font-medium flex items-center gap-2`}>
              
              {status === 'en_route' &&
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              }
              {getStatusText()}
            </div>

            <div
              className={`text-right ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              <p className="text-xs text-slate-500">Prévu</p>
              <p className="font-bold">{serviceRequest.scheduledTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distance/ETA overlay - Fixed position */}
      {status === 'en_route' &&
      <div
        className={`fixed top-20 left-4 z-20 backdrop-blur-md rounded-xl p-3 ${isDark ? 'bg-slate-800/90 border border-slate-700' : 'bg-white/90 border border-slate-200 shadow-lg'}`}>
        
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Navigation
              className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
              <span
              className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {distance}
              </span>
            </div>
            <div
            className={`w-px h-6 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          
            <div className="flex items-center gap-2">
              <Clock
              className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            
              <span
              className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {duration}
              </span>
            </div>
          </div>
        </div>
      }

      {/* Fixed Bottom panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md border-t rounded-t-3xl ${isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200 shadow-2xl'}`}
        style={{
          paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))'
        }}>
        
        <div className="p-4 space-y-4">
          {/* Patient info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-2xl">
              👩
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {serviceRequest.patientName}
              </h3>
              <p
                className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                {serviceRequest.serviceName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin
                  className={`h-3 w-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                <p
                  className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                  {serviceRequest.patientLocation.address}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {serviceRequest.price}
              </p>
              <p
                className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                {serviceRequest.currency}
              </p>
            </div>
          </div>

          {/* Contact buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCall}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}>
              
              <Phone className="h-5 w-5" />
              Appeler
            </button>
            <button
              onClick={handleMessage}
              className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}>
              
              <MessageCircle className="h-5 w-5" />
              Message
            </button>
          </div>

          {/* Notes */}
          {serviceRequest.notes &&
          <div
            className={`p-3 rounded-xl flex items-start gap-2 ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            
              <AlertCircle
              className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            
              <p
              className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>
              
                {serviceRequest.notes}
              </p>
            </div>
          }

          {/* Action button */}
          {status === 'pending' &&
          <button
            onClick={handleStartJourney}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            
              <Play className="h-5 w-5" />
              Démarrer le trajet
            </button>
          }

          {status === 'en_route' &&
          <button
            onClick={handleArrived}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            
              <Flag className="h-5 w-5" />
              Je suis arrivé
            </button>
          }

          {status === 'arrived' &&
          <button
            onClick={handleStartService}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            
              <Play className="h-5 w-5" />
              Commencer le service
            </button>
          }

          {status === 'in_progress' &&
          <button
            onClick={handleCompleteService}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            
              <Check className="h-5 w-5" />
              Service terminé
            </button>
          }
        </div>
      </div>
    </div>);

}