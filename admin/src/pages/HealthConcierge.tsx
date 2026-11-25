import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  FileText,
  Phone,
  Video,
  Clock,
  CheckCircle2,
  Star,
  Crown,
  Sparkles,
  Users,
  Heart,
  Zap,
  Send,
  Moon,
  Sun } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
export function HealthConcierge() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'chat' | 'requests' | 'history'>(
    'chat'
  );
  const [messageInput, setMessageInput] = useState('');
  const conciergeTeam = [
  {
    name: 'Amira Mansour',
    role: 'Coordinatrice Santé Senior',
    avatar: '👩‍⚕️',
    specialties: ['Coordination soins', 'Urgences', 'Suivi chronique'],
    available: true
  },
  {
    name: 'Karim Ben Ali',
    role: 'Conseiller Santé',
    avatar: '👨‍⚕️',
    specialties: ['Nutrition', 'Prévention', 'Bien-être'],
    available: true
  }];

  const recentRequests = [
  {
    id: 1,
    type: 'appointment',
    title: 'Coordination rendez-vous cardiologue',
    status: 'completed',
    date: 'Il y a 2 jours',
    description: 'Rendez-vous confirmé avec Dr. Trabelsi le 20 Jan à 10h'
  },
  {
    id: 2,
    type: 'document',
    title: 'Récupération analyses médicales',
    status: 'in-progress',
    date: 'Il y a 1 jour',
    description: 'En cours de récupération auprès du laboratoire'
  },
  {
    id: 3,
    type: 'advice',
    title: 'Conseil nutrition post-opératoire',
    status: 'completed',
    date: 'Il y a 3 jours',
    description: 'Plan nutritionnel personnalisé envoyé'
  }];

  const quickActions = [
  {
    icon: Calendar,
    title: 'Coordonner un RDV',
    description: 'Trouvez et réservez le meilleur spécialiste',
    gradient: 'from-blue-500 to-cyan-500',
    path: '/concierge/coordinate-appointment'
  },
  {
    icon: FileText,
    title: 'Gérer mes documents',
    description: 'Centraliser ordonnances et résultats',
    gradient: 'from-purple-500 to-pink-500',
    path: '/concierge/manage-documents'
  },
  {
    icon: Heart,
    title: 'Plan de soins',
    description: 'Organiser vos soins chroniques',
    gradient: 'from-rose-500 to-red-500',
    path: '/concierge/care-plan'
  },
  {
    icon: Phone,
    title: 'Urgence santé',
    description: 'Assistance immédiate 24/7',
    gradient: 'from-amber-500 to-orange-500',
    path: '/concierge/emergency'
  }];

  const [messages, setMessages] = useState([
  {
    id: 1,
    sender: 'concierge',
    name: 'Amira',
    text: "Bonjour Mohamed ! Comment puis-je vous aider aujourd'hui ?",
    time: '10:30',
    avatar: '👩‍⚕️'
  },
  {
    id: 2,
    sender: 'user',
    text: "J'ai besoin de prendre rendez-vous avec un cardiologue rapidement",
    time: '10:32'
  },
  {
    id: 3,
    sender: 'concierge',
    name: 'Amira',
    text: 'Parfait ! Je vais vous trouver les meilleurs cardiologues disponibles cette semaine. Avez-vous une préférence de zone géographique ?',
    time: '10:33',
    avatar: '👩‍⚕️'
  }]
  );
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: messageInput,
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages([...messages, newMessage]);
    setMessageInput('');
    // Simulate concierge response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'concierge',
        name: 'Amira',
        text: "Je m'occupe de votre demande immédiatement. Je reviens vers vous dans quelques instants.",
        time: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        avatar: '👩‍⚕️'
      };
      setMessages((prev) => [...prev, response]);
    }, 1500);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDark ?
        'bg-green-500/20 text-green-400 border-green-500/30' :
        'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return isDark ?
        'bg-blue-500/20 text-blue-400 border-blue-500/30' :
        'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return isDark ?
        'bg-slate-500/20 text-slate-400 border-slate-500/30' :
        'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      default:
        return 'En attente';
    }
  };
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-purple-500' : 'bg-purple-300'}`}>
        </div>
        <div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-cyan-500' : 'bg-cyan-300'}`}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/patient-dashboard')}
              className={`flex items-center font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
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

          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Concierge Santé
                </span>
              </h1>
              <p
                className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                
                Votre assistant santé personnel disponible 24/7
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className={
                isDark ?
                'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' :
                ''
                }>
                
                <Video className="h-5 w-5" />
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/30">
                
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
          {
            icon: CheckCircle2,
            label: 'Demandes traitées',
            value: '24',
            subtitle: 'Ce mois-ci',
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            icon: Clock,
            label: 'Temps de réponse',
            value: '12min',
            subtitle: 'Moyenne',
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            icon: Calendar,
            label: 'RDV coordonnés',
            value: '8',
            subtitle: 'Ce mois-ci',
            gradient: 'from-purple-500 to-pink-500'
          },
          {
            icon: Star,
            label: 'Satisfaction',
            value: '5.0',
            subtitle: 'Note moyenne',
            gradient: 'from-amber-500 to-orange-500'
          }].
          map((stat, index) =>
          <div
            key={index}
            className={`rounded-2xl p-6 border backdrop-blur-sm transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between mb-4">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p
              className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
                {stat.label}
              </p>
              <p
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                {stat.value}
              </p>
              <p
              className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
              
                {stat.subtitle}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div>
              <h2
                className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Actions rapides
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) =>
                <div
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600' : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'}`}>
                  
                    <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}>
                  </div>
                    <div className="relative flex items-start gap-4">
                      <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3
                        className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                          {action.title}
                        </h3>
                        <p
                        className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div
              className={`rounded-2xl overflow-hidden border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div
                className={`flex border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                
                {[
                {
                  id: 'chat',
                  icon: MessageCircle,
                  label: 'Chat'
                },
                {
                  id: 'requests',
                  icon: FileText,
                  label: 'Demandes'
                },
                {
                  id: 'history',
                  icon: Clock,
                  label: 'Historique'
                }].
                map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id ? isDark ? 'text-purple-400 bg-purple-500/10' : 'text-purple-600 bg-purple-50' : isDark ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  
                    <tab.icon className="h-5 w-5 inline-block mr-2" />
                    {tab.label}
                    {activeTab === tab.id &&
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  }
                  </button>
                )}
              </div>

              <div className="p-6">
                {/* Chat Tab */}
                {activeTab === 'chat' &&
                <div>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {messages.map((msg) =>
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                      
                          {msg.sender === 'concierge' &&
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg mr-3 flex-shrink-0 ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        
                              {msg.avatar}
                            </div>
                      }
                          <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'user' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' : isDark ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        
                            {msg.sender === 'concierge' &&
                        <p className="text-xs font-semibold mb-1 opacity-75">
                                {msg.name}
                              </p>
                        }
                            <p className="text-sm">{msg.text}</p>
                            <p
                          className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-purple-200' : isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          
                              {msg.time}
                            </p>
                          </div>
                        </div>
                    )}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) =>
                      e.key === 'Enter' && handleSendMessage()
                      }
                      placeholder="Écrivez votre message..."
                      className={`flex-1 px-4 py-3 rounded-full border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20' : 'bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent'}`} />
                    
                      <Button
                      onClick={handleSendMessage}
                      variant="primary"
                      className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/30">
                      
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                }

                {/* Requests Tab */}
                {activeTab === 'requests' &&
                <div className="space-y-4">
                    {recentRequests.map((request) =>
                  <div
                    key={request.id}
                    className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                    
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                          className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          
                              {request.title}
                            </h3>
                            <p
                          className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                          
                              {request.description}
                            </p>
                          </div>
                          <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                        
                            {getStatusLabel(request.status)}
                          </span>
                        </div>
                        <p
                      className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      
                          {request.date}
                        </p>
                      </div>
                  )}
                  </div>
                }

                {/* History Tab */}
                {activeTab === 'history' &&
                <div className="text-center py-8">
                    <Clock
                    className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
                  
                    <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                      Historique complet disponible prochainement
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Concierge Team */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Votre équipe dédiée
              </h3>
              <div className="space-y-4">
                {conciergeTeam.map((member) =>
                <div key={member.name} className="flex items-start gap-3">
                    <div className="relative">
                      <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isDark ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
                      
                        {member.avatar}
                      </div>
                      {member.available &&
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    }
                    </div>
                    <div className="flex-1">
                      <h4
                      className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                        {member.name}
                      </h4>
                      <p
                      className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                        {member.role}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((spec) =>
                      <span
                        key={spec}
                        className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        
                            {spec}
                          </span>
                      )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'}`}>
              
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-green-500/20' : 'bg-green-200'}`}>
                  
                  <Zap
                    className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  
                </div>
                <div>
                  <h3
                    className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                    Disponibilité 24/7
                  </h3>
                  <p
                    className={`text-sm mb-3 ${isDark ? 'text-green-300' : 'text-gray-700'}`}>
                    
                    Notre équipe est disponible à tout moment pour vous
                    assister.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span
                      className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                      
                      En ligne maintenant
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
              
              <h3
                className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                💡 Comment ça marche ?
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                'Posez votre question par chat, téléphone ou vidéo',
                'Réponse garantie sous 1h (souvent bien plus rapide)',
                'Nous gérons tout pour vous de A à Z'].
                map((item, index) =>
                <li key={index} className="flex items-start gap-2">
                    <CheckCircle2
                    className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  
                    <span
                    className={isDark ? 'text-blue-300' : 'text-gray-700'}>
                    
                      {item}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>);

}