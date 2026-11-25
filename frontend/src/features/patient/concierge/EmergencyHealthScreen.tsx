import {
  AlertCircle,
  Ambulance,
  ArrowLeft,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Video,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/primitives/button';

export function EmergencyHealthScreen() {
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      name: 'SAMU',
      number: '190',
      description: 'Urgences médicales vitales',
      icon: Ambulance,
      tone: 'critical',
      available: '24/7',
    },
    {
      name: 'Pompiers',
      number: '198',
      description: 'Secours et urgences',
      icon: AlertCircle,
      tone: 'urgent',
      available: '24/7',
    },
    {
      name: 'Police',
      number: '197',
      description: 'Urgences sécuritaires',
      icon: Shield,
      tone: 'support',
      available: '24/7',
    },
  ];

  const conciergeServices = [
    {
      title: 'Appel téléphonique immédiat',
      description: 'Parlez à un professionnel de santé maintenant',
      icon: Phone,
      action: 'Appeler',
      response: 'Réponse sous 30 secondes',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Consultation vidéo urgente',
      description: 'Consultation visuelle avec un médecin',
      icon: Video,
      action: 'Démarrer',
      response: 'Disponible immédiatement',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Chat médical urgent',
      description: 'Échangez par message avec notre équipe',
      icon: MessageCircle,
      action: 'Chatter',
      response: 'Réponse sous 1 minute',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const nearbyHospitals = [
    {
      name: 'Hôpital Charles Nicolle',
      address: 'Boulevard 9 Avril, Tunis',
      distance: '2.3 km',
      time: '8 min',
      emergency: true,
    },
    {
      name: 'Clinique La Marsa',
      address: 'Avenue Habib Bourguiba, La Marsa',
      distance: '3.5 km',
      time: '12 min',
      emergency: true,
    },
    {
      name: 'Hôpital Mongi Slim',
      address: 'La Marsa, Tunis',
      distance: '4.1 km',
      time: '15 min',
      emergency: true,
    },
  ];

  const symptoms = [
    { text: 'Douleur thoracique', severity: 'critical', icon: '🫀' },
    { text: 'Difficulté respiratoire', severity: 'critical', icon: '🫁' },
    { text: 'Perte de conscience', severity: 'critical', icon: '😵' },
    { text: 'Saignement important', severity: 'critical', icon: '🩸' },
    { text: 'Douleur abdominale sévère', severity: 'urgent', icon: '🤕' },
    { text: 'Fièvre élevée', severity: 'urgent', icon: '🌡️' },
  ];

  const emergencyContactClassName = (tone: string) => {
    switch (tone) {
      case 'critical':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'urgent':
        return 'bg-orange-600 text-white hover:bg-orange-700';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-96 w-96 rounded-full bg-red-300/20 blur-3xl dark:bg-red-500/20" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/health-concierge')}
              className="flex items-center font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au concierge
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Urgence Santé</h1>
            <p className="mt-2 text-gray-600 dark:text-slate-400">Assistance immédiate 24/7</p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border-2 border-red-300 bg-gradient-to-r from-red-50 to-orange-50 p-6 shadow-sm backdrop-blur-sm dark:border-red-500/50 dark:from-red-900/40 dark:to-orange-900/40">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 animate-pulse items-center justify-center rounded-full bg-red-600">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                🚨 En cas d'urgence vitale
              </h3>
              <p className="mb-4 text-gray-700 dark:text-slate-300">
                Si vous ou quelqu'un près de vous présente des symptômes graves (douleur thoracique,
                difficulté respiratoire, perte de conscience), appelez immédiatement le SAMU au{' '}
                <span className="text-xl font-bold text-red-600">190</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {emergencyContacts.map((contact) => (
                  <a
                    key={contact.number}
                    href={`tel:${contact.number}`}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 font-bold transition-colors ${emergencyContactClassName(contact.tone)}`}
                  >
                    <contact.icon className="h-5 w-5" />
                    {contact.name} - {contact.number}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Assistance concierge immédiate
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {conciergeServices.map((service) => (
                  <div
                    key={service.title}
                    className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-slate-300 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-slate-600"
                  >
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient}`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">
                      {service.description}
                    </p>
                    <div className="mb-4 flex items-center justify-center gap-1 text-xs font-semibold text-green-600">
                      <Zap className="h-3 w-3" />
                      {service.response}
                    </div>
                    <Button className="w-full">{service.action}</Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Symptômes nécessitant une attention immédiate
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {symptoms.map((symptom, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 p-3 ${symptom.severity === 'critical' ? 'border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10' : 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{symptom.icon}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {symptom.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>💡 Conseil :</strong> Si vous présentez un de ces symptômes, contactez
                  immédiatement les urgences ou notre concierge santé.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Hôpitaux à proximité
                </h3>
                <MapPin className="h-5 w-5 text-gray-400 dark:text-slate-400" />
              </div>
              <div className="space-y-3">
                {nearbyHospitals.map((hospital, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-blue-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-blue-500/50"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="mb-1 font-bold text-gray-900 dark:text-white">
                          {hospital.name}
                        </h4>
                        <p className="mb-2 text-sm text-gray-600 dark:text-slate-400">
                          {hospital.address}
                        </p>
                        {hospital.emergency ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                            <AlertCircle className="h-3 w-3" />
                            Urgences 24/7
                          </span>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {hospital.distance}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-slate-400">{hospital.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Appeler
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Itinéraire
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-sm backdrop-blur-sm dark:border-green-500/30 dark:from-green-900/40 dark:to-emerald-900/40">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-green-600">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                  Concierge Santé 24/7
                </h3>
                <p className="mb-4 text-sm text-gray-700 dark:text-green-300">
                  Assistance médicale immédiate
                </p>
                <Button size="lg" className="w-full border-0 bg-green-600 hover:bg-green-700">
                  <Phone className="mr-2 h-5 w-5" />
                  Appeler maintenant
                </Button>
                <p className="mt-3 text-xs text-gray-600 dark:text-slate-400">
                  Réponse garantie sous 30 secondes
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
              <h3 className="mb-4 font-bold text-gray-900 dark:text-white">
                Informations médicales
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="mb-1 text-gray-600 dark:text-slate-400">Groupe sanguin</p>
                  <p className="font-bold text-gray-900 dark:text-white">A+</p>
                </div>
                <div>
                  <p className="mb-1 text-gray-600 dark:text-slate-400">Allergies</p>
                  <p className="font-bold text-gray-900 dark:text-white">Pénicilline</p>
                </div>
                <div>
                  <p className="mb-1 text-gray-600 dark:text-slate-400">Conditions chroniques</p>
                  <p className="font-bold text-gray-900 dark:text-white">Hypertension, Diabète</p>
                </div>
                <div>
                  <p className="mb-1 text-gray-600 dark:text-slate-400">Contact d'urgence</p>
                  <p className="font-bold text-gray-900 dark:text-white">Leila (+216 XX XXX XXX)</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Modifier les informations
              </Button>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm backdrop-blur-sm dark:border-blue-500/30 dark:from-blue-900/40 dark:to-indigo-900/40">
              <h3 className="mb-3 font-bold text-gray-900 dark:text-white">💡 Conseils urgence</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>Restez calme et évaluez la situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>Appelez les secours si nécessaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>Ne déplacez pas une personne blessée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>Restez avec la personne jusqu'à l'arrivée des secours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
