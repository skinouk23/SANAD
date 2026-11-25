import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle2 } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function Messages() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<
    number | null>(
    1);
  const [messageText, setMessageText] = useState('');
  const conversations = [
  {
    id: 1,
    providerName: 'Dr. Amira Ben Ali',
    providerRole: 'Infirmière',
    lastMessage: 'Je serai là à 14h demain',
    timestamp: 'Il y a 5 min',
    unread: 2,
    avatar: '👩‍⚕️',
    status: 'online'
  },
  {
    id: 2,
    providerName: 'Mohamed Trabelsi',
    providerRole: 'Kinésithérapeute',
    lastMessage: 'Merci pour votre confiance',
    timestamp: 'Il y a 2h',
    unread: 0,
    avatar: '🧑‍⚕️',
    status: 'offline'
  },
  {
    id: 3,
    providerName: 'Fatma Gharbi',
    providerRole: 'Aide à domicile',
    lastMessage: 'À bientôt !',
    timestamp: 'Hier',
    unread: 0,
    avatar: '👩‍⚕️',
    status: 'offline'
  }];

  const messages = [
  {
    id: 1,
    sender: 'provider',
    text: 'Bonjour ! Je confirme notre rendez-vous pour demain.',
    timestamp: '14:30',
    read: true
  },
  {
    id: 2,
    sender: 'patient',
    text: 'Parfait ! À quelle heure exactement ?',
    timestamp: '14:32',
    read: true
  },
  {
    id: 3,
    sender: 'provider',
    text: 'Je serai là à 14h demain',
    timestamp: '14:35',
    read: false
  }];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Send message logic here
      setMessageText('');
    }
  };
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communication sécurisée avec vos professionnels
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-6 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-teal-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                🔒 Communication sécurisée
              </h3>
              <p className="text-sm text-gray-700">
                Vos échanges sont protégés et vos coordonnées restent privées.
                Les professionnels ne voient pas votre numéro de téléphone
                direct.
              </p>
            </div>
          </div>
        </Card>

        {/* Messages Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-white">
              <h2 className="font-bold text-gray-900">Conversations</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {conversations.map((conv) =>
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedConversation === conv.id ? 'bg-teal-50' : ''}`}>
                
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center text-2xl">
                        {conv.avatar}
                      </div>
                      {conv.status === 'online' &&
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conv.providerName}
                        </h3>
                        {conv.unread > 0 &&
                      <span className="w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {conv.unread}
                          </span>
                      }
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {conv.providerRole}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conv.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col h-[600px]">
            {selectedConv ?
            <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center text-xl">
                      {selectedConv.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {selectedConv.providerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedConv.providerRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Appel vocal">
                    
                      <Phone className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Appel vidéo">
                    
                      <Video className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg) =>
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  
                      <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.sender === 'patient' ? 'bg-teal-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                    
                        <p className="text-sm">{msg.text}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <p
                        className={`text-xs ${msg.sender === 'patient' ? 'text-teal-100' : 'text-gray-500'}`}>
                        
                            {msg.timestamp}
                          </p>
                          {msg.sender === 'patient' && msg.read &&
                      <CheckCircle2 className="h-3 w-3 text-teal-100" />
                      }
                        </div>
                      </div>
                    </div>
                )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-3">
                    <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) =>
                    e.key === 'Enter' && handleSendMessage()
                    }
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                  
                    <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    💡 Vos coordonnées personnelles restent privées
                  </p>
                </div>
              </> :

            <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-lg font-medium">
                    Sélectionnez une conversation
                  </p>
                </div>
              </div>
            }
          </Card>
        </div>
      </div>
    </div>);

}