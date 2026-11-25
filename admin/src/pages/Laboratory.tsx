import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FlaskConical,
  MapPin,
  Clock,
  Star,
  Phone,
  Calendar,
  CheckCircle,
  Home,
  Search } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useLaboratoryList, usePopularTests } from '../hooks/useLaboratory';
export function Laboratory() {
  const navigate = useNavigate();
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Hook-based data fetching
  const { data: laboratories } = useLaboratoryList();
  const { data: popularTests } = usePopularTests();
  const filteredLabs = (laboratories ?? []).filter(
    (lab) =>
    lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lab.address.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <FlaskConical className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Laboratoires d'Analyses
              </h1>
              <p className="text-gray-600">
                Trouvez un laboratoire près de chez vous
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un laboratoire par nom ou adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Laboratories List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {filteredLabs.length} laboratoire
              {filteredLabs.length > 1 ? 's' : ''} disponible
              {filteredLabs.length > 1 ? 's' : ''}
            </h2>

            {filteredLabs.map((lab) =>
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                  src={lab.image}
                  alt={lab.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg" />
                
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {lab.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold text-gray-900">
                              {lab.rating}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({lab.reviews} avis)
                            </span>
                          </div>
                          {lab.homeService &&
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full flex items-center gap-1">
                              <Home className="h-3 w-3" />À domicile
                            </span>
                        }
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {lab.priceRange}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {lab.address} • {lab.distance}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {lab.hours}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {lab.phone}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {lab.services.map((service, index) =>
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
                      window.location.href = `tel:${lab.phone}`
                      }>
                      
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </Button>
                      <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                      navigate('/laboratory/booking', {
                        state: {
                          laboratory: lab
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
            {/* Popular Tests */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Analyses populaires
              </h3>
              <div className="space-y-3">
                {popularTests?.map((test, index) =>
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-900">{test.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {test.price}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Prélèvement à domicile
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Certains laboratoires proposent un service de prélèvement à
                domicile pour votre confort.
              </p>
              <div className="flex items-start gap-2 text-xs text-blue-700">
                <Home className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p>Supplément de 20-30 TND selon la distance</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}