import React from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
interface TimeSlot {
  time: string;
  available: boolean;
}
interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}
interface ProviderAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  requestedDate?: string;
  requestedTime?: string;
  availabilities: DayAvailability[];
  onSelectSlot: (date: Date, time: string) => void;
}
export function ProviderAvailabilityModal({
  isOpen,
  onClose,
  providerName,
  requestedDate,
  requestedTime,
  availabilities,
  onSelectSlot
}: ProviderAvailabilityModalProps) {
  if (!isOpen) return null;
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };
  const hasAvailableSlots = availabilities.some((day) =>
  day.slots.some((slot) => slot.available)
  );
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
        onClick={onClose}>
        
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Créneau non disponible</h2>
                </div>
                <p className="text-amber-100">
                  {providerName} n'est pas disponible le{' '}
                  {requestedDate &&
                  new Date(requestedDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long'
                  })}{' '}
                  à {requestedTime}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors">
                
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
            {hasAvailableSlots ?
            <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    Créneaux disponibles
                  </h3>
                  <p className="text-sm text-gray-600">
                    Voici les prochains créneaux disponibles pour {providerName}
                  </p>
                </div>

                <div className="space-y-6">
                  {availabilities.map((day, dayIndex) => {
                  const availableSlots = day.slots.filter(
                    (slot) => slot.available
                  );
                  if (availableSlots.length === 0) return null;
                  return (
                    <div key={dayIndex}>
                        <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                          {formatDate(day.date)}
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {day.slots.map((slot, slotIndex) =>
                        <button
                          key={slotIndex}
                          onClick={() =>
                          slot.available &&
                          onSelectSlot(day.date, slot.time)
                          }
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${slot.available ? 'border-teal-200 bg-teal-50 text-teal-700 hover:border-teal-500 hover:bg-teal-100 cursor-pointer' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
                          
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3" />
                                {slot.time}
                              </div>
                            </button>
                        )}
                        </div>
                      </div>);

                })}
                </div>
              </> :

            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Aucun créneau disponible
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {providerName} n'a pas de créneaux disponibles dans les
                  prochains jours. Veuillez essayer une autre date ou contacter
                  le professionnel directement.
                </p>
                <Button variant="primary" onClick={onClose}>
                  Choisir un autre professionnel
                </Button>
              </div>
            }
          </div>

          {/* Footer */}
          {hasAvailableSlots &&
          <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    Sélectionnez un créneau pour continuer votre réservation
                  </p>
                </div>
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
    </>);

}