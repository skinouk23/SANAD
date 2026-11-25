import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Shield,
  Truck,
  Calendar,
  CheckCircle,
  Phone,
  Loader2 } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useEquipmentDetailData } from '../hooks/useEquipmentDetail';
export function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState<
    'daily' | 'weekly' | 'monthly'>(
    'daily');
  const { data: equipment, loading } = useEquipmentDetailData(id);
  const handleBooking = () => {
    if (!equipment) return;
    navigate('/equipment-booking', {
      state: {
        equipment,
        duration: selectedDuration
      }
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>);

  }
  if (!equipment) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-gray-500">Équipement non trouvé</p>
      </div>);

  }
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/equipment')}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card padding="none" className="overflow-hidden">
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="w-full h-96 object-cover" />
              
            </Card>

            {/* Info */}
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="teal" className="mb-3">
                    {equipment.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {equipment.name}
                  </h1>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {equipment.description}
              </p>

              {/* Provider Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">
                      {equipment.provider.name}
                    </h3>
                    {equipment.provider.verified &&
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                    }
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {equipment.provider.location}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contacter
                </Button>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Caractéristiques techniques
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {equipment.specifications.map((spec, i) =>
                  <div
                    key={i}
                    className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    
                      <span className="text-gray-600 text-sm">
                        {spec.label}
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {spec.value}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Services inclus
                </h3>
                <ul className="space-y-3">
                  {equipment.features.map((feature, i) =>
                  <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  )}
                </ul>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-teal-100">
                <h3 className="font-bold text-gray-900 mb-4">
                  Tarifs de location
                </h3>

                {/* Duration Selection */}
                <div className="space-y-2 mb-6">
                  <button
                    onClick={() => setSelectedDuration('daily')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all relative ${selectedDuration === 'daily' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}>
                    
                    <div className="font-medium text-gray-900">Par jour</div>
                    <div className="text-2xl font-bold text-teal-600 mt-1">
                      {equipment.pricing.daily} TND
                      <span className="text-sm text-gray-500 font-normal">
                        /jour
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedDuration('weekly')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all relative ${selectedDuration === 'weekly' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}>
                    
                    <Badge
                      variant="success"
                      className="absolute top-2 right-2 text-xs">
                      
                      -10%
                    </Badge>
                    <div className="font-medium text-gray-900">Par semaine</div>
                    <div className="text-2xl font-bold text-teal-600 mt-1">
                      {equipment.pricing.weekly} TND
                      <span className="text-sm text-gray-500 font-normal">
                        /semaine
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedDuration('monthly')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all relative ${selectedDuration === 'monthly' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}>
                    
                    <Badge
                      variant="success"
                      className="absolute top-2 right-2 text-xs">
                      
                      -20%
                    </Badge>
                    <div className="font-medium text-gray-900">Par mois</div>
                    <div className="text-2xl font-bold text-teal-600 mt-1">
                      {equipment.pricing.monthly} TND
                      <span className="text-sm text-gray-500 font-normal">
                        /mois
                      </span>
                    </div>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Dépôt de garantie</span>
                    <span className="font-medium text-gray-900">
                      {equipment.deposit} TND
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Remboursé au retour du matériel
                  </p>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  onClick={handleBooking}
                  className="mb-4">
                  
                  <Calendar className="h-5 w-5 mr-2" />
                  Réserver maintenant
                </Button>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-2 text-teal-600" />
                    Livraison gratuite (Grand Tunis)
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-teal-600" />
                    Matériel certifié et entretenu
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-teal-600" />
                    Installation et formation incluses
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>);

}