import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Video,
  X,
  MessageSquare,
  Navigation,
  FileText,
  AlertCircle,
  MapPinned } from
'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
interface AppointmentCardProps {
  providerName: string;
  providerImage: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
  isVirtual?: boolean;
  address?: string;
  phone?: string;
  notes?: string;
  duration?: string;
  appointmentId?: string;
  showTracking?: boolean;
}
export function AppointmentCard({
  providerName,
  providerImage,
  service,
  date,
  time,
  status,
  isVirtual = false,
  address = '123 Avenue Habib Bourguiba, Tunis 1000',
  phone = '+216 71 123 456',
  notes = 'Merci de préparer vos documents médicaux et ordonnances.',
  duration = '45 min',
  appointmentId = 'apt_123',
  showTracking = false
}: AppointmentCardProps) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const statusStyles = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-gray-100 text-gray-700'
  };
  const statusLabels = {
    confirmed: 'Confirmé',
    pending: 'En attente',
    completed: 'Terminé'
  };
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };
  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      '_blank'
    );
  };
  const handleTrackRealTime = () => {
    navigate(`/tracking/${appointmentId}`);
  };
  return (
    <>
      <Card className="flex flex-col gap-4 border-l-4 border-l-teal-500">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <img
              src={providerImage}
              alt={providerName}
              className="w-12 h-12 rounded-full object-cover border border-gray-200" />
            
            <div>
              <h4 className="font-bold text-gray-900">{providerName}</h4>
              <p className="text-sm text-gray-600">{service}</p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold ${statusStyles[status]}`}>
            
            {statusLabels[status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-teal-600" />
            {date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-teal-600" />
            {time}
          </div>
          <div className="flex items-center col-span-2">
            {isVirtual ?
            <>
                <Video className="h-4 w-4 mr-2 text-teal-600" />
                Consultation vidéo
              </> :

            <>
                <MapPin className="h-4 w-4 mr-2 text-teal-600" />À domicile
              </>
            }
          </div>
        </div>

        <div className="flex gap-3 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleCall}>
            
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
          {showTracking && status === 'confirmed' &&
          <Button
            variant="primary"
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleTrackRealTime}>
            
              <MapPinned className="h-4 w-4 mr-2" />
              Suivre
            </Button>
          }
          {status === 'confirmed' &&
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setShowDetails(true)}>
            
              Détails
            </Button>
          }
        </div>
      </Card>

      {/* Details Modal */}
      {showDetails &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Détails du rendez-vous
              </h3>
              <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Provider Info */}
            <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg mb-6">
              <img
              src={providerImage}
              alt={providerName}
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-200" />
            
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">
                  {providerName}
                </h4>
                <p className="text-sm text-gray-600">{service}</p>
                <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
                
                  {statusLabels[status]}
                </span>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <span className="font-semibold text-gray-900">Date</span>
                  </div>
                  <p className="text-gray-700">{date}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                    <span className="font-semibold text-gray-900">Heure</span>
                  </div>
                  <p className="text-gray-700">{time}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Durée: {duration}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {isVirtual ?
                <>
                      <Video className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">
                        Consultation vidéo
                      </span>
                    </> :

                <>
                      <MapPin className="h-5 w-5 text-teal-600" />
                      <span className="font-semibold text-gray-900">
                        Adresse
                      </span>
                    </>
                }
                </div>
                {isVirtual ?
              <div>
                    <p className="text-gray-700 mb-2">
                      Lien de consultation disponible 15 minutes avant le
                      rendez-vous
                    </p>
                    <Button variant="primary" size="sm" disabled>
                      <Video className="h-4 w-4 mr-2" />
                      Rejoindre la consultation
                    </Button>
                  </div> :

              <div>
                    <p className="text-gray-700 mb-2">{address}</p>
                    <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetDirections}>
                  
                      <Navigation className="h-4 w-4 mr-2" />
                      Obtenir l'itinéraire
                    </Button>
                  </div>
              }
              </div>

              {/* Contact */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-teal-600" />
                  <span className="font-semibold text-gray-900">Contact</span>
                </div>
                <p className="text-gray-700 mb-2">{phone}</p>
                <Button variant="outline" size="sm" onClick={handleCall}>
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler maintenant
                </Button>
              </div>

              {/* Notes */}
              {notes &&
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-blue-900">
                      Notes importantes
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">{notes}</p>
                </div>
            }
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              {showTracking && status === 'confirmed' &&
            <Button
              variant="primary"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleTrackRealTime}>
              
                  <MapPinned className="h-4 w-4 mr-2" />
                  Suivre en temps réel
                </Button>
            }
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Envoyer un message
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Voir les documents
              </Button>
              <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowDetails(false)}>
              
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      }
    </>);

}