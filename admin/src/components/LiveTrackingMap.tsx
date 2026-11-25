import React, { useEffect, useState, useRef, createElement } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  User } from
'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
interface LiveTrackingMapProps {
  appointmentId: string;
  providerType: 'professional' | 'ambulance';
  providerName: string;
  providerPhone: string;
  providerImage?: string;
  patientLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedArrival: string;
  onCallProvider: () => void;
  onMessageProvider: () => void;
}
export function LiveTrackingMap({
  appointmentId,
  providerType,
  providerName,
  providerPhone,
  providerImage,
  patientLocation,
  estimatedArrival,
  onCallProvider,
  onMessageProvider
}: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const providerMarkerRef = useRef<any>(null);
  const patientMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const [providerLocation, setProviderLocation] = useState({
    lat: patientLocation.lat + 0.01,
    lng: patientLocation.lng + 0.01
  });
  const [distance, setDistance] = useState('2.5 km');
  const [duration, setDuration] = useState('8 min');
  const [isLoading, setIsLoading] = useState(true);
  // Add keyframes animation to document
  useEffect(() => {
    const styleId = 'marker-pulse-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes markerPulse {
          0%, 100% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.1); }
        }
        .marker-pulse {
          animation: markerPulse 2s infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const loadLeaflet = async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        initializeMap();
      };
      document.body.appendChild(script);
    };
    const initializeMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([patientLocation.lat, patientLocation.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);
      const patientIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg style="
                width: 20px;
                height: 20px;
                transform: rotate(45deg);
                fill: white;
              " viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid #0d9488;
            "></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
      const providerColor = providerType === 'ambulance' ? '#ef4444' : '#3b82f6';
      const providerColorDark =
      providerType === 'ambulance' ? '#dc2626' : '#2563eb';
      const providerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
            <div class="marker-pulse" style="
              width: 50px;
              height: 50px;
              background: linear-gradient(135deg, ${providerColor} 0%, ${providerColorDark} 100%);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 4px solid white;
              box-shadow: 0 6px 16px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              ${
        providerType === 'ambulance' ?
        `<svg style="width: 28px; height: 28px; transform: rotate(45deg); fill: white;" viewBox="0 0 24 24">
                      <path d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17 1.5 1.5 0 0 1 6 15.5 1.5 1.5 0 0 1 7.5 17 1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3 3 3 0 0 0 3-3h6a3 3 0 0 0 3 3 3 3 0 0 0 3-3h2v-5l-3-4Z"/>
                    </svg>` :
        `<svg style="width: 28px; height: 28px; transform: rotate(45deg); fill: white;" viewBox="0 0 24 24">
                      <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"/>
                    </svg>`}
            </div>
            <div style="
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 10px solid ${
        providerColor};
            "></div>
          </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 50]
      });
      const patientMarker = L.marker(
        [patientLocation.lat, patientLocation.lng],
        {
          icon: patientIcon
        }
      ).addTo(map);
      patientMarker.bindPopup(`
        <div style="padding: 8px; min-width: 200px;">
          <p style="font-weight: bold; margin-bottom: 4px;">📍 Votre position</p>
          <p style="font-size: 12px; color: #666;">${patientLocation.address}</p>
        </div>
      `);
      const providerMarker = L.marker(
        [providerLocation.lat, providerLocation.lng],
        {
          icon: providerIcon
        }
      ).addTo(map);
      providerMarker.bindPopup(`
        <div style="padding: 8px; min-width: 200px;">
          <p style="font-weight: bold; margin-bottom: 4px;">
            ${providerType === 'ambulance' ? '🚑' : '👨‍⚕️'} ${providerName}
          </p>
          <p style="font-size: 12px; color: #666;">En route vers vous</p>
          <p style="font-size: 12px; color: #0d9488; font-weight: bold; margin-top: 4px;">
            Arrivée estimée: ${estimatedArrival}
          </p>
        </div>
      `);
      const bounds = L.latLngBounds([
      [patientLocation.lat, patientLocation.lng],
      [providerLocation.lat, providerLocation.lng]]
      );
      map.fitBounds(bounds, {
        padding: [50, 50]
      });
      mapInstanceRef.current = map;
      providerMarkerRef.current = providerMarker;
      patientMarkerRef.current = patientMarker;
      drawRoute(map);
      setIsLoading(false);
    };
    loadLeaflet();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  const drawRoute = async (map: any) => {
    const L = (window as any).L;
    const routeCoordinates = [
    [providerLocation.lat, providerLocation.lng],
    [patientLocation.lat, patientLocation.lng]];

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
    }
    const routeLayer = L.polyline(routeCoordinates, {
      color: providerType === 'ambulance' ? '#ef4444' : '#3b82f6',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10',
      lineCap: 'round'
    }).addTo(map);
    routeLayerRef.current = routeLayer;
    const dist = calculateDistance(
      providerLocation.lat,
      providerLocation.lng,
      patientLocation.lat,
      patientLocation.lng
    );
    setDistance(`${dist.toFixed(1)} km`);
    setDuration(`${Math.ceil(dist * 4)} min`);
  };
  const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number) =>
  {
    const R = 6371;
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
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setProviderLocation((prev) => {
        const newLat = prev.lat + (patientLocation.lat - prev.lat) * 0.05;
        const newLng = prev.lng + (patientLocation.lng - prev.lng) * 0.05;
        if (providerMarkerRef.current && mapInstanceRef.current) {
          const L = (window as any).L;
          providerMarkerRef.current.setLatLng([newLat, newLng]);
          if (routeLayerRef.current) {
            mapInstanceRef.current.removeLayer(routeLayerRef.current);
          }
          const routeCoordinates = [
          [newLat, newLng],
          [patientLocation.lat, patientLocation.lng]];

          const routeLayer = L.polyline(routeCoordinates, {
            color: providerType === 'ambulance' ? '#ef4444' : '#3b82f6',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10',
            lineCap: 'round'
          }).addTo(mapInstanceRef.current);
          routeLayerRef.current = routeLayer;
          const dist = calculateDistance(
            newLat,
            newLng,
            patientLocation.lat,
            patientLocation.lng
          );
          setDistance(`${dist.toFixed(1)} km`);
          setDuration(`${Math.ceil(dist * 4)} min`);
        }
        return {
          lat: newLat,
          lng: newLng
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [patientLocation]);
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${providerType === 'ambulance' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
            
            {providerType === 'ambulance' ? '🚑' : '👨‍⚕️'}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{providerName}</h3>
            <p className="text-sm text-gray-600">
              {providerType === 'ambulance' ?
              'Ambulance' :
              'Professionnel de santé'}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm">
                <Navigation className="h-4 w-4 text-teal-600" />
                <span className="font-semibold text-teal-700">{distance}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-700">{duration}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onCallProvider}
              className="bg-green-600 hover:bg-green-700">
              
              <Phone className="h-4 w-4 mr-1" />
              Appeler
            </Button>
            <Button variant="outline" size="sm" onClick={onMessageProvider}>
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="relative">
          {isLoading &&
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">
                  Chargement de la carte...
                </p>
              </div>
            </div>
          }
          <div ref={mapRef} className="w-full h-[500px] rounded-lg"></div>
        </div>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">
              Suivi en temps réel
            </h4>
            <p className="text-sm text-blue-800">
              La position de{' '}
              {providerType === 'ambulance' ?
              "l'ambulance" :
              'votre professionnel'}{' '}
              est mise à jour automatiquement. Vous recevrez une notification à
              son arrivée.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-blue-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">
                  En route
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-blue-200">
                <Clock className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">
                  Arrivée prévue: {estimatedArrival}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Légende</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-xs text-gray-700">Votre position</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 ${providerType === 'ambulance' ? 'bg-red-600' : 'bg-blue-600'} rounded-full flex items-center justify-center`}>
              
              {providerType === 'ambulance' ?
              <span className="text-xs">🚑</span> :

              <User className="w-3 h-3 text-white" />
              }
            </div>
            <span className="text-xs text-gray-700">
              {providerType === 'ambulance' ? 'Ambulance' : 'Professionnel'}
            </span>
          </div>
        </div>
      </Card>
    </div>);

}