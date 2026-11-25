import React, { useState } from 'react';
import { Phone, CalendarPlus, AlertCircle, Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
export function QuickActions() {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const emergencyContacts = [
  {
    name: 'SAMU',
    number: '190',
    description: 'Urgences médicales',
    type: 'public'
  },
  {
    name: 'Pompiers',
    number: '198',
    description: 'Secours et urgences',
    type: 'public'
  },
  {
    name: 'Police',
    number: '197',
    description: 'Urgences sécurité',
    type: 'public'
  },
  {
    name: 'SOS Médecins',
    number: '+216 71 123 456',
    description: 'Médecin à domicile 24/7',
    type: 'public'
  },
  {
    name: 'Clinique Hannibal',
    number: '+216 71 860 000',
    description: 'Urgences clinique privée - Tunis',
    type: 'private'
  },
  {
    name: 'Clinique La Soukra',
    number: '+216 71 700 700',
    description: 'Urgences clinique privée - Ariana',
    type: 'private'
  },
  {
    name: 'Polyclinique Les Berges du Lac',
    number: '+216 71 861 000',
    description: 'Urgences clinique privée - Tunis',
    type: 'private'
  },
  {
    name: 'Ambulance Bourak',
    number: '+216 71 783 000',
    description: 'Ambulance privée 24/7',
    type: 'ambulance'
  },
  {
    name: 'Ambulance SAMU Privé',
    number: '+216 71 234 567',
    description: 'Transport médicalisé privé',
    type: 'ambulance'
  },
  {
    name: 'Ambulance Croissant Rouge',
    number: '+216 71 320 102',
    description: 'Ambulance humanitaire',
    type: 'ambulance'
  }];

  const favoriteProviders = [
  {
    id: 1,
    name: 'Dr. Amira Ben Ali',
    specialty: 'Médecin généraliste',
    image:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100',
    phone: '+216 71 234 567'
  },
  {
    id: 2,
    name: 'Infirmière Leila Trabelsi',
    specialty: 'Soins infirmiers',
    image:
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100',
    phone: '+216 71 345 678'
  },
  {
    id: 3,
    name: 'Karim Mansour',
    specialty: 'Kinésithérapeute',
    image:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100',
    phone: '+216 71 456 789'
  }];

  const handleReserve = () => {
    navigate('/services');
  };
  const handleCall = () => {
    window.location.href = 'tel:+21671123456';
  };
  const handleEmergency = () => {
    setShowEmergencyModal(true);
  };
  const handleFavorites = () => {
    setShowFavoritesModal(true);
  };
  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };
  const actions = [
  {
    icon: CalendarPlus,
    label: 'Réserver',
    color: 'bg-teal-100 text-teal-700',
    hover: 'hover:bg-teal-200',
    onClick: handleReserve
  },
  {
    icon: Phone,
    label: 'Appeler',
    color: 'bg-blue-100 text-blue-700',
    hover: 'hover:bg-blue-200',
    onClick: handleCall
  },
  {
    icon: Heart,
    label: 'Favoris',
    color: 'bg-rose-100 text-rose-700',
    hover: 'hover:bg-rose-200',
    onClick: handleFavorites
  },
  {
    icon: AlertCircle,
    label: 'Urgence',
    color: 'bg-amber-100 text-amber-700',
    hover: 'hover:bg-amber-200',
    onClick: handleEmergency
  }];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action) =>
        <button
          key={action.label}
          onClick={action.onClick}
          className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
              ${action.color} ${action.hover} active:scale-95
            `}>
          
            <action.icon className="h-8 w-8 mb-2" />
            <span className="font-semibold text-sm">{action.label}</span>
          </button>
        )}
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Numéros d'urgence
                </h3>
              </div>
              <button
              onClick={() => setShowEmergencyModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                ⚠️ En cas d'urgence vitale, composez immédiatement le{' '}
                <strong>190 (SAMU)</strong>
              </p>
            </div>

            {/* Public Emergency Numbers */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                Urgences Publiques
              </h4>
              <div className="space-y-3">
                {emergencyContacts.
              filter((c) => c.type === 'public').
              map((contact) =>
              <div
                key={contact.number}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900">
                            {contact.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {contact.description}
                          </p>
                        </div>
                        <Button
                    onClick={() => handleEmergencyCall(contact.number)}
                    variant="primary"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 ml-3 flex-shrink-0">
                    
                          <Phone className="h-4 w-4 mr-2" />
                          {contact.number}
                        </Button>
                      </div>
                    </div>
              )}
              </div>
            </div>

            {/* Private Clinics */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Cliniques Privées - Tunis
              </h4>
              <div className="space-y-3">
                {emergencyContacts.
              filter((c) => c.type === 'private').
              map((contact) =>
              <div
                key={contact.number}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-400 transition-colors">
                
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900">
                            {contact.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {contact.description}
                          </p>
                        </div>
                        <Button
                    onClick={() => handleEmergencyCall(contact.number)}
                    variant="primary"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 ml-3 flex-shrink-0">
                    
                          <Phone className="h-4 w-4 mr-2" />
                          Appeler
                        </Button>
                      </div>
                    </div>
              )}
              </div>
            </div>

            {/* Private Ambulances */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                Ambulances Privées
              </h4>
              <div className="space-y-3">
                {emergencyContacts.
              filter((c) => c.type === 'ambulance').
              map((contact) =>
              <div
                key={contact.number}
                className="p-4 bg-teal-50 rounded-lg border border-teal-200 hover:border-teal-400 transition-colors">
                
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900">
                            {contact.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {contact.description}
                          </p>
                        </div>
                        <Button
                    onClick={() => handleEmergencyCall(contact.number)}
                    variant="primary"
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 ml-3 flex-shrink-0">
                    
                          <Phone className="h-4 w-4 mr-2" />
                          Appeler
                        </Button>
                      </div>
                    </div>
              )}
              </div>
            </div>

            <div className="mt-6">
              <Button
              onClick={() => setShowEmergencyModal(false)}
              variant="outline"
              className="w-full">
              
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Favorites Modal */}
      {showFavoritesModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mes Favoris</h3>
              </div>
              <button
              onClick={() => setShowFavoritesModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Vos professionnels de santé préférés pour un accès rapide
            </p>

            <div className="space-y-4">
              {favoriteProviders.map((provider) =>
            <div
              key={provider.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-rose-300 transition-colors">
              
                  <div className="flex items-center gap-4">
                    <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-200" />
                
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {provider.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {provider.specialty}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {provider.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                  onClick={() =>
                  window.location.href = `tel:${provider.phone}`
                  }
                  variant="outline"
                  size="sm">
                  
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                    <Button
                  onClick={() => navigate('/services')}
                  variant="primary"
                  size="sm">
                  
                      Réserver
                    </Button>
                  </div>
                </div>
            )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
              onClick={() => {
                setShowFavoritesModal(false);
                navigate('/services');
              }}
              variant="primary"
              className="flex-1">
              
                <CalendarPlus className="h-4 w-4 mr-2" />
                Trouver un professionnel
              </Button>
              <Button
              onClick={() => setShowFavoritesModal(false)}
              variant="outline"
              className="px-6">
              
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      }
    </>);

}