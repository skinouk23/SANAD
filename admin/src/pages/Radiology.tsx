import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Scan,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Search,
  Zap } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function Radiology() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const radiologyCenters = [
  {
    id: '1',
    name: 'Centre Radiologie Moderne',
    address: 'Avenue de la République, Tunis 1001',
    distance: '2.1 km',
    rating: 4.9,
    reviews: 178,
    phone: '+216 71 456 789',
    hours: 'Lun-Sam: 8h-18h',
    services: ['Radio standard', 'Échographie', 'Scanner', 'IRM'],
    priceRange: '50-300 TND',
    image:
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=300',
    fastAppointment: true
  },
  {
    id: '2',
    name: 'Imagerie Médicale Avancée',
    address: 'Rue du Lac Léman, Les Berges du Lac',
    distance: '4.3 km',
    rating: 4.7,
    reviews: 234,
    phone: '+216 71 567 890',
    hours: 'Lun-Ven: 7h30-19h, Sam: 8h-14h',
    services: [
    'IRM 3 Tesla',
    'Scanner multi-coupes',
    'Mammographie',
    'Doppler'],

    priceRange: '60-350 TND',
    image:
    'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?auto=format&fit=crop&q=80&w=400&h=300',
    fastAppointment: true
  },
  {
    id: '3',
    name: 'Radio Diagnostic Plus',
    address: 'Avenue Habib Thameur, Ariana 2080',
    distance: '6.2 km',
    rating: 4.6,
    reviews: 156,
    phone: '+216 71 678 901',
    hours: 'Lun-Sam: 8h-17h',
    services: ['Radiologie dentaire', 'Échographie 4D', 'Ostéodensitométrie'],
    priceRange: '45-280 TND',
    image:
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400&h=300',
    fastAppointment: false
  }];

  const examTypes = [
  {
    name: 'Radiographie standard',
    price: '50-80 TND',
    duration: '15 min'
  },
  {
    name: 'Échographie abdominale',
    price: '80-120 TND',
    duration: '30 min'
  },
  {
    name: 'Scanner thoracique',
    price: '180-250 TND',
    duration: '20 min'
  },
  {
    name: 'IRM cérébrale',
    price: '250-350 TND',
    duration: '45 min'
  },
  {
    name: 'Mammographie',
    price: '100-150 TND',
    duration: '20 min'
  },
  {
    name: 'Doppler vasculaire',
    price: '120-180 TND',
    duration: '30 min'
  }];

  const filteredCenters = radiologyCenters.filter(
    (center) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/services')}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
          
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux services
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Scan className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Centres de Radiologie
              </h1>
              <p className="text-gray-600">
                Imagerie médicale et diagnostics rapides
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un centre par nom ou adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Centers List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredCenters.length} centre
              {filteredCenters.length > 1 ? 's' : ''} disponible
              {filteredCenters.length > 1 ? 's' : ''}
            </h2>

            {filteredCenters.map((center) =>
            <Card
              key={center.id}
              className="hover:shadow-lg transition-shadow">
              
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                  src={center.image}
                  alt={center.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg" />
                
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {center.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold text-gray-900">
                              {center.rating}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({center.reviews} avis)
                            </span>
                          </div>
                          {center.fastAppointment &&
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              RDV rapide
                            </span>
                        }
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">
                        {center.priceRange}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {center.address} • {center.distance}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {center.hours}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {center.phone}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {center.services.map((service, index) =>
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      
                          {service}
                        </span>
                    )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                      window.location.href = `tel:${center.phone}`
                      }>
                      
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </Button>
                      <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                      navigate('/radiology/booking', {
                        state: {
                          center
                        }
                      })
                      }>
                      
                        <Calendar className="h-4 w-4 mr-2" />
                        Réserver
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exam Types */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Types d'examens
              </h3>
              <div className="space-y-3">
                {examTypes.map((exam, index) =>
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {exam.name}
                      </span>
                      <span className="text-xs text-purple-600 font-semibold">
                        {exam.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {exam.duration}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Info Card */}
            <Card className="bg-purple-50 border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                Rendez-vous rapides
              </h3>
              <p className="text-sm text-purple-800 mb-4">
                Certains centres proposent des créneaux en urgence pour les
                examens prioritaires.
              </p>
              <div className="flex items-start gap-2 text-xs text-purple-700">
                <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>Disponibilités sous 24-48h selon l'examen</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}