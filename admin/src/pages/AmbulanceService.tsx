import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ambulance,
  MapPin,
  Star,
  Clock,
  Phone,
  Shield,
  Heart,
  Activity,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function AmbulanceService() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const transportTypes = [
  {
    id: 'emergency',
    label: 'Urgence médicale',
    icon: '🚨',
    color: 'red'
  },
  {
    id: 'hospital-home',
    label: 'Hôpital → Domicile',
    icon: '🏥',
    color: 'blue'
  },
  {
    id: 'home-hospital',
    label: 'Domicile → Hôpital',
    icon: '🏠',
    color: 'green'
  },
  {
    id: 'inter-clinic',
    label: 'Inter-cliniques',
    icon: '🏥',
    color: 'purple'
  },
  {
    id: 'medical-appointment',
    label: 'Rendez-vous médical',
    icon: '📅',
    color: 'amber'
  },
  {
    id: 'dialysis',
    label: 'Dialyse régulière',
    icon: '💉',
    color: 'teal'
  }];

  const zones = [
  'Tunis Centre',
  'Ariana',
  'La Marsa',
  'Carthage',
  'Manouba',
  'Ben Arous',
  'Toute la Tunisie'];

  const ambulanceProviders = [
  {
    id: 1,
    name: 'Ambulance Rapide Tunis',
    rating: 4.9,
    reviews: 234,
    responseTime: '8-12 min',
    zone: 'Tunis Centre',
    price: '80-150',
    image: '🚑',
    features: [
    'Équipement médical complet',
    'Personnel qualifié',
    'Oxygène disponible',
    'Défibrillateur'],

    available24: true,
    types: ['emergency', 'hospital-home', 'home-hospital', 'inter-clinic']
  },
  {
    id: 2,
    name: 'Secours Médical Express',
    rating: 5.0,
    reviews: 189,
    responseTime: '10-15 min',
    zone: 'Ariana',
    price: '90-180',
    image: '🚑',
    features: [
    'Ambulance médicalisée',
    'Infirmier à bord',
    'Monitoring cardiaque',
    'Brancard électrique'],

    available24: true,
    types: [
    'emergency',
    'hospital-home',
    'home-hospital',
    'medical-appointment']

  },
  {
    id: 3,
    name: 'Ambulance Premium Care',
    rating: 4.8,
    reviews: 156,
    responseTime: '12-18 min',
    zone: 'La Marsa',
    price: '100-200',
    image: '🚑',
    features: [
    'Service premium',
    'Médecin à bord',
    'Équipement de réanimation',
    'Confort maximal'],

    available24: true,
    types: [
    'emergency',
    'hospital-home',
    'home-hospital',
    'inter-clinic',
    'medical-appointment']

  },
  {
    id: 4,
    name: 'Transport Médical Solidaire',
    rating: 4.7,
    reviews: 203,
    responseTime: '15-20 min',
    zone: 'Toute la Tunisie',
    price: '80-120',
    image: '🚑',
    features: [
    'Tarifs solidaires',
    'Dialyse régulière',
    'Chimiothérapie',
    'Longue distance'],

    available24: false,
    types: [
    'hospital-home',
    'home-hospital',
    'dialysis',
    'medical-appointment']

  }];

  const filteredProviders = ambulanceProviders.filter((provider) => {
    if (selectedType && !provider.types.includes(selectedType)) return false;
    if (
    selectedZone &&
    selectedZone !== 'Toute la Tunisie' &&
    provider.zone !== selectedZone &&
    provider.zone !== 'Toute la Tunisie')

    return false;
    return true;
  });
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux services
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center">
                <Ambulance className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Assistance Ambulance Privée
                  </h1>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    ⭐ Populaire
                  </span>
                </div>
                <p className="text-gray-600">
                  Transport médicalisé, hôpital ↔ domicile, inter-cliniques
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <Card className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 border-red-300 border-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🚨 Urgence vitale ?
              </h3>
              <p className="text-gray-700 mb-4">
                En cas d'urgence vitale immédiate, appelez le{' '}
                <span className="font-bold text-red-600 text-xl">SAMU 190</span>{' '}
                ou les{' '}
                <span className="font-bold text-red-600 text-xl">
                  Pompiers 198
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:190"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                  
                  <Phone className="h-5 w-5" />
                  SAMU - 190
                </a>
                <a
                  href="tel:198"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">
                  
                  <Phone className="h-5 w-5" />
                  Pompiers - 198
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transport Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Type de transport
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                
                <option value="">Tous les types</option>
                {transportTypes.map((type) =>
                <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                )}
              </select>
            </div>

            {/* Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Zone géographique
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                
                <option value="">Toutes les zones</option>
                {zones.map((zone) =>
                <option key={zone} value={zone}>
                    {zone}
                  </option>
                )}
              </select>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Sécurité garantie
                </h3>
                <p className="text-sm text-gray-700">
                  Personnel qualifié et équipement médical complet
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Disponible 24/7
                </h3>
                <p className="text-sm text-gray-700">
                  Service d'urgence disponible jour et nuit
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Prise en charge complète
                </h3>
                <p className="text-sm text-gray-700">
                  De la prise en charge au transfert sécurisé
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">
              {filteredProviders.length}
            </span>{' '}
            service{filteredProviders.length > 1 ? 's' : ''} d'ambulance
            disponible{filteredProviders.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Providers List */}
        <div className="space-y-6">
          {filteredProviders.map((provider) =>
          <Card
            key={provider.id}
            className="hover:shadow-lg transition-shadow">
            
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center text-4xl">
                    {provider.image}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {provider.name}
                        </h3>
                        {provider.available24 &&
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                            <Clock className="h-3 w-3" />
                            24/7
                          </span>
                      }
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-semibold">
                            {provider.rating}
                          </span>
                          <span>({provider.reviews} avis)</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Arrivée : {provider.responseTime}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.zone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {provider.price} TND
                      </p>
                      <p className="text-xs text-gray-500">par transport</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.features.map((feature, index) =>
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                    
                        <CheckCircle2 className="h-3 w-3" />
                        {feature}
                      </span>
                  )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() =>
                    navigate('/ambulance-booking', {
                      state: {
                        provider
                      }
                    })
                    }>
                    
                      <Calendar className="h-4 w-4 mr-2" />
                      Réserver maintenant
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                    <Button variant="outline">Voir détails</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Info Banner */}
        <Card className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">
                💡 Comment choisir le bon service ?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Urgence vitale :</strong> Appelez le SAMU 190
                    immédiatement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Transport programmé :</strong> Réservez à l'avance
                    pour un meilleur tarif
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Équipement spécifique :</strong> Vérifiez les
                    équipements disponibles (oxygène, défibrillateur, etc.)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Dialyse régulière :</strong> Optez pour un service
                    avec tarifs solidaires
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}