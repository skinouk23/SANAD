import React, { useState } from 'react';
import { Phone, AlertCircle, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  icon: string;
  color: string;
  description: string;
}
interface EmergencyButtonsProps {
  variant?: 'floating' | 'inline';
  size?: 'normal' | 'large';
}
export function EmergencyButtons({
  variant = 'floating',
  size = 'normal'
}: EmergencyButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const emergencyContacts: EmergencyContact[] = [
  {
    id: 'samu',
    name: 'SAMU',
    number: '190',
    icon: '🚑',
    color: 'bg-red-600 hover:bg-red-700',
    description: 'Urgence médicale'
  },
  {
    id: 'police',
    name: 'Police',
    number: '197',
    icon: '👮',
    color: 'bg-blue-600 hover:bg-blue-700',
    description: 'Urgence sécuritaire'
  },
  {
    id: 'pompiers',
    name: 'Pompiers',
    number: '198',
    icon: '🚒',
    color: 'bg-orange-600 hover:bg-orange-700',
    description: 'Incendie & secours'
  },
  {
    id: 'protection-civile',
    name: 'Protection Civile',
    number: '193',
    icon: '🆘',
    color: 'bg-yellow-600 hover:bg-yellow-700',
    description: 'Catastrophes naturelles'
  }];

  const handleCall = (contact: EmergencyContact) => {
    setShowConfirmation(contact.id);
  };
  const confirmCall = (number: string) => {
    window.location.href = `tel:${number}`;
    setShowConfirmation(null);
    setIsExpanded(false);
  };
  if (variant === 'floating') {
    return (
      <>
        {/* Floating Emergency Button */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isExpanded ?
          <button
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse"
            aria-label="Urgence">
            
              <Phone className="h-8 w-8" />
            </button> :

          <Card className="w-80 shadow-2xl border-2 border-red-500 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Numéros d'Urgence
                  </h3>
                </div>
                <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {emergencyContacts.map((contact) =>
              <button
                key={contact.id}
                onClick={() => handleCall(contact)}
                className={`w-full ${contact.color} text-white rounded-lg p-4 transition-all hover:scale-105 shadow-lg`}>
                
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{contact.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-lg">{contact.name}</p>
                        <p className="text-sm opacity-90">
                          {contact.description}
                        </p>
                      </div>
                      <span className="text-2xl font-bold">
                        {contact.number}
                      </span>
                    </div>
                  </button>
              )}
              </div>

              <p className="text-xs text-gray-600 mt-4 text-center">
                ⚠️ N'appelez qu'en cas de réelle urgence
              </p>
            </Card>
          }
        </div>

        {/* Confirmation Modal */}
        {showConfirmation &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full border-2 border-red-500">
              {(() => {
              const contact = emergencyContacts.find(
                (c) => c.id === showConfirmation
              );
              if (!contact) return null;
              return (
                <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl">{contact.icon}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Appeler le {contact.name} ?
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {contact.description}
                      </p>
                      <p className="text-4xl font-bold text-red-600">
                        {contact.number}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setShowConfirmation(null)}>
                      
                        Annuler
                      </Button>
                      <Button
                      variant="primary"
                      fullWidth
                      onClick={() => confirmCall(contact.number)}
                      className="bg-red-600 hover:bg-red-700">
                      
                        <Phone className="h-5 w-5 mr-2" />
                        Appeler
                      </Button>
                    </div>
                  </>);

            })()}
            </Card>
          </div>
        }
      </>);

  }
  // Inline variant for dashboard
  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <Phone className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Urgence</h3>
          <p className="text-sm text-gray-600">Numéros d'urgence rapides</p>
        </div>
      </div>

      {size === 'large' ?
      <div className="grid grid-cols-2 gap-3">
          {emergencyContacts.map((contact) =>
        <button
          key={contact.id}
          onClick={() => handleCall(contact)}
          className={`${contact.color} text-white rounded-lg p-4 transition-all hover:scale-105 shadow-lg`}>
          
              <span className="text-4xl mb-2 block">{contact.icon}</span>
              <p className="font-bold text-lg">{contact.name}</p>
              <p className="text-2xl font-bold mt-1">{contact.number}</p>
            </button>
        )}
        </div> :

      <div className="grid grid-cols-2 gap-2">
          {emergencyContacts.map((contact) =>
        <button
          key={contact.id}
          onClick={() => handleCall(contact)}
          className={`${contact.color} text-white rounded-lg p-3 transition-all hover:scale-105`}>
          
              <span className="text-2xl mb-1 block">{contact.icon}</span>
              <p className="font-bold text-sm">{contact.name}</p>
              <p className="text-lg font-bold">{contact.number}</p>
            </button>
        )}
        </div>
      }

      {/* Confirmation Modal */}
      {showConfirmation &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full border-2 border-red-500">
            {(() => {
            const contact = emergencyContacts.find(
              (c) => c.id === showConfirmation
            );
            if (!contact) return null;
            return (
              <>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl">{contact.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Appeler le {contact.name} ?
                    </h3>
                    <p className="text-gray-600 mb-2">{contact.description}</p>
                    <p className="text-4xl font-bold text-red-600">
                      {contact.number}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowConfirmation(null)}>
                    
                      Annuler
                    </Button>
                    <Button
                    variant="primary"
                    fullWidth
                    onClick={() => confirmCall(contact.number)}
                    className="bg-red-600 hover:bg-red-700">
                    
                      <Phone className="h-5 w-5 mr-2" />
                      Appeler
                    </Button>
                  </div>
                </>);

          })()}
          </Card>
        </div>
      }
    </Card>);

}