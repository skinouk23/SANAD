import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  AlertCircle,
  CheckCircle } from
'lucide-react';
import { LiveTrackingMap } from '../components/LiveTrackingMap';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function TrackingPage() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  // Mock data - in production, fetch from API
  const appointment = {
    id: appointmentId || 'apt_123',
    providerType: 'professional' as 'professional' | 'ambulance',
    providerName: 'Amira Mansour',
    providerPhone: '+216 XX XXX XXX',
    providerImage: '👩‍⚕️',
    serviceName: 'Soins Infirmiers',
    date: "Aujourd'hui",
    time: '14:00',
    estimatedArrival: '13:55',
    patientLocation: {
      lat: 36.8065,
      lng: 10.1815,
      address: '15 Avenue Habib Bourguiba, Tunis 1000'
    },
    status: 'en_route'
  };
  const handleCall = () => {
    setShowCallModal(true);
  };
  const handleMessage = () => {
    setShowMessageModal(true);
  };
  const handleConfirmCall = () => {
    window.location.href = `tel:${appointment.providerPhone}`;
    setShowCallModal(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Suivi en temps réel
              </h1>
              <p className="text-gray-600">
                {appointment.serviceName} • {appointment.date} à{' '}
                {appointment.time}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-800">
                En route
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <LiveTrackingMap
              appointmentId={appointment.id}
              providerType={appointment.providerType}
              providerName={appointment.providerName}
              providerPhone={appointment.providerPhone}
              providerImage={appointment.providerImage}
              patientLocation={appointment.patientLocation}
              estimatedArrival={appointment.estimatedArrival}
              onCallProvider={handleCall}
              onMessageProvider={handleMessage} />
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Appointment Details */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">
                Détails du rendez-vous
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Service</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.serviceName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date et heure</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.date} à {appointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.patientLocation.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrivée estimée</p>
                  <p className="font-semibold text-teal-700 text-lg">
                    {appointment.estimatedArrival}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Statut</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      Réservation confirmée
                    </p>
                    <p className="text-xs text-gray-600">13:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      En route
                    </p>
                    <p className="text-xs text-gray-600">Maintenant</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      Arrivée
                    </p>
                    <p className="text-xs text-gray-600">
                      {appointment.estimatedArrival}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 opacity-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      Service terminé
                    </p>
                    <p className="text-xs text-gray-600">À venir</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Urgence</h4>
                  <p className="text-sm text-red-800 mb-3">
                    En cas d'urgence médicale, contactez immédiatement le SAMU.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => window.location.href = 'tel:190'}>
                    
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler le 190
                  </Button>
                </div>
              </div>
            </Card>

            {/* Help */}
            <Card className="bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                Besoin d'aide ?
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Notre équipe support est disponible 24/7 pour vous assister.
              </p>
              <Button variant="outline" size="sm" fullWidth>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter le support
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Call Confirmation Modal */}
      {showCallModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Appeler {appointment.providerName} ?
              </h3>
              <p className="text-gray-600">{appointment.providerPhone}</p>
            </div>
            <div className="flex gap-3">
              <Button
              variant="outline"
              fullWidth
              onClick={() => setShowCallModal(false)}>
              
                Annuler
              </Button>
              <Button variant="primary" fullWidth onClick={handleConfirmCall}>
                Appeler
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Message Modal */}
      {showMessageModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Envoyer un message
              </h3>
              <p className="text-gray-600 text-sm">
                À {appointment.providerName}
              </p>
            </div>
            <textarea
            placeholder="Votre message..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none mb-4">
          </textarea>
            <div className="flex gap-3">
              <Button
              variant="outline"
              fullWidth
              onClick={() => setShowMessageModal(false)}>
              
                Annuler
              </Button>
              <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setShowMessageModal(false);
                alert('Message envoyé !');
              }}>
              
                Envoyer
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}