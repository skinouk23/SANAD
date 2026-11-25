import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Video,
  MessageCircle,
  AlertCircle,
  MapPin,
  Clock,
  Shield,
  Zap,
  Ambulance,
  Heart,
  Activity,
  Moon,
  Sun } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
export function EmergencyHealth() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const emergencyContacts = [
  {
    name: 'SAMU',
    number: '190',
    description: 'Urgences médicales vitales',
    icon: Ambulance,
    color: 'red',
    available: '24/7'
  },
  {
    name: 'Pompiers',
    number: '198',
    description: 'Secours et urgences',
    icon: AlertCircle,
    color: 'orange',
    available: '24/7'
  },
  {
    name: 'Police',
    number: '197',
    description: 'Urgences sécuritaires',
    icon: Shield,
    color: 'blue',
    available: '24/7'
  }];

  const conciergeServices = [
  {
    title: 'Appel téléphonique immédiat',
    description: 'Parlez à un professionnel de santé maintenant',
    icon: Phone,
    action: 'Appeler',
    color: 'green',
    response: 'Réponse sous 30 secondes'
  },
  {
    title: 'Consultation vidéo urgente',
    description: 'Consultation visuelle avec un médecin',
    icon: Video,
    action: 'Démarrer',
    color: 'blue',
    response: 'Disponible immédiatement'
  },
  {
    title: 'Chat médical urgent',
    description: 'Échangez par message avec notre équipe',
    icon: MessageCircle,
    action: 'Chatter',
    color: 'purple',
    response: 'Réponse sous 1 minute'
  }];

  const nearbyHospitals = [
  {
    name: 'Hôpital Charles Nicolle',
    address: 'Boulevard 9 Avril, Tunis',
    distance: '2.3 km',
    time: '8 min',
    emergency: true
  },
  {
    name: 'Clinique La Marsa',
    address: 'Avenue Habib Bourguiba, La Marsa',
    distance: '3.5 km',
    time: '12 min',
    emergency: true
  },
  {
    name: 'Hôpital Mongi Slim',
    address: 'La Marsa, Tunis',
    distance: '4.1 km',
    time: '15 min',
    emergency: true
  }];

  const symptoms = [
  {
    text: 'Douleur thoracique',
    severity: 'critical',
    icon: '🫀'
  },
  {
    text: 'Difficulté respiratoire',
    severity: 'critical',
    icon: '🫁'
  },
  {
    text: 'Perte de conscience',
    severity: 'critical',
    icon: '😵'
  },
  {
    text: 'Saignement important',
    severity: 'critical',
    icon: '🩸'
  },
  {
    text: 'Douleur abdominale sévère',
    severity: 'urgent',
    icon: '🤕'
  },
  {
    text: 'Fièvre élevée',
    severity: 'urgent',
    icon: '🌡️'
  }];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-red-500' : 'bg-red-300'}`}>
        </div>
        <div
          className={`absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-orange-500' : 'bg-orange-300'}`}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/health-concierge')}
              className={`flex items-center font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au concierge
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-slate-700 shadow-sm'}`}>
              
              {isDark ?
              <Sun className="h-5 w-5" /> :

              <Moon className="h-5 w-5" />
              }
            </button>
          </div>
          <div>
            <h1
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
              Urgence Santé
            </h1>
            <p
              className={`mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
              Assistance immédiate 24/7
            </p>
          </div>
        </div>

        {/* Critical Alert */}
        <div
          className={`mb-8 rounded-2xl p-6 border-2 backdrop-blur-sm ${isDark ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border-red-500/50' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'}`}>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                🚨 En cas d'urgence vitale
              </h3>
              <p
                className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                
                Si vous ou quelqu'un près de vous présente des symptômes graves
                (douleur thoracique, difficulté respiratoire, perte de
                conscience), appelez immédiatement le SAMU au{' '}
                <span className="font-bold text-red-600 text-xl">190</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {emergencyContacts.map((contact) =>
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className={`flex items-center gap-2 px-4 py-2 bg-${contact.color}-600 text-white rounded-lg font-bold hover:bg-${contact.color}-700 transition-colors`}>
                  
                    <contact.icon className="h-5 w-5" />
                    {contact.name} - {contact.number}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Concierge Emergency Services */}
            <div>
              <h2
                className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Assistance concierge immédiate
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {conciergeServices.map((service) =>
                <div
                  key={service.title}
                  className={`rounded-2xl p-6 border backdrop-blur-sm cursor-pointer text-center transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'}`}>
                  
                    <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${service.color === 'green' ? 'from-green-500 to-emerald-500' : service.color === 'blue' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}>
                    
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3
                    className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {service.title}
                    </h3>
                    <p
                    className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      {service.description}
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-green-600 font-semibold mb-4">
                      <Zap className="h-3 w-3" />
                      {service.response}
                    </div>
                    <Button variant="primary" fullWidth>
                      {service.action}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Symptom Checker */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Symptômes nécessitant une attention immédiate
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {symptoms.map((symptom, index) =>
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${symptom.severity === 'critical' ? isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200' : isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                  
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{symptom.icon}</span>
                      <span
                      className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                        {symptom.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div
                className={`mt-4 p-3 rounded-lg border ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                
                <p
                  className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                  
                  <strong>💡 Conseil :</strong> Si vous présentez un de ces
                  symptômes, contactez immédiatement les urgences ou notre
                  concierge santé.
                </p>
              </div>
            </div>

            {/* Nearby Hospitals */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                  Hôpitaux à proximité
                </h3>
                <MapPin
                  className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                
              </div>
              <div className="space-y-3">
                {nearbyHospitals.map((hospital, index) =>
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-colors ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}>
                  
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4
                        className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                          {hospital.name}
                        </h4>
                        <p
                        className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
                          {hospital.address}
                        </p>
                        {hospital.emergency &&
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">
                            <AlertCircle className="h-3 w-3" />
                            Urgences 24/7
                          </span>
                      }
                      </div>
                      <div className="text-right">
                        <p
                        className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                          {hospital.distance}
                        </p>
                        <p
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
                          {hospital.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                      
                        <Phone className="h-4 w-4 mr-2" />
                        Appeler
                      </Button>
                      <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                      
                        <MapPin className="h-4 w-4 mr-2" />
                        Itinéraire
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3
                  className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                  Concierge Santé 24/7
                </h3>
                <p
                  className={`text-sm mb-4 ${isDark ? 'text-green-300' : 'text-gray-700'}`}>
                  
                  Assistance médicale immédiate
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="bg-green-600 hover:bg-green-700">
                  
                  <Phone className="h-5 w-5 mr-2" />
                  Appeler maintenant
                </Button>
                <p
                  className={`text-xs mt-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                  Réponse garantie sous 30 secondes
                </p>
              </div>
            </div>

            {/* Medical Info */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Informations médicales
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p
                    className={`mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                    Groupe sanguin
                  </p>
                  <p
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                    A+
                  </p>
                </div>
                <div>
                  <p
                    className={`mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                    Allergies
                  </p>
                  <p
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                    Pénicilline
                  </p>
                </div>
                <div>
                  <p
                    className={`mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                    Conditions chroniques
                  </p>
                  <p
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                    Hypertension, Diabète
                  </p>
                </div>
                <div>
                  <p
                    className={`mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                    Contact d'urgence
                  </p>
                  <p
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                    Leila (+216 XX XXX XXX)
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                fullWidth
                size="sm"
                className={`mt-4 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                
                Modifier les informations
              </Button>
            </div>

            {/* Tips */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              
              <h3
                className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                💡 Conseils urgence
              </h3>
              <ul
                className={`space-y-2 text-sm ${isDark ? 'text-blue-300' : 'text-gray-700'}`}>
                
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Restez calme et évaluez la situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Appelez les secours si nécessaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Ne déplacez pas une personne blessée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Restez avec la personne jusqu'à l'arrivée des secours
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>);

}