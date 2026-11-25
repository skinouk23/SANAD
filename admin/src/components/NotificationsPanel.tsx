import React, { useState } from 'react';
import {
  X,
  Bell,
  Check,
  Trash2,
  Calendar,
  MessageCircle,
  Gift,
  AlertCircle,
  CheckCircle2 } from
'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useTheme } from '../contexts/ThemeContext';
interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'reward' | 'reminder' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}
interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
export function NotificationsPanel({
  isOpen,
  onClose
}: NotificationsPanelProps) {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
  {
    id: '1',
    type: 'appointment',
    title: 'Rendez-vous confirmé',
    message:
    'Votre rendez-vous avec Amira Mansour est confirmé pour demain à 14h00',
    time: 'Il y a 2 heures',
    read: false,
    actionUrl: '/appointments/1'
  },
  {
    id: '2',
    type: 'reward',
    title: 'Points gagnés !',
    message:
    'Vous avez gagné 50 points pour votre dernier rendez-vous complété',
    time: 'Il y a 5 heures',
    read: false,
    actionUrl: '/rewards'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Rappel de rendez-vous',
    message: "N'oubliez pas votre rendez-vous demain à 14h00",
    time: 'Il y a 1 jour',
    read: true
  },
  {
    id: '4',
    type: 'message',
    title: 'Nouveau message',
    message: 'Amira Mansour vous a envoyé un message',
    time: 'Il y a 2 jours',
    read: true,
    actionUrl: '/messages'
  },
  {
    id: '5',
    type: 'system',
    title: 'Validation en attente',
    message: "N'oubliez pas de valider votre service avec le code reçu",
    time: 'Il y a 3 jours',
    read: true
  }]
  );
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
    prev.map((n) =>
    n.id === id ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  };
  const markAllAsRead = () => {
    setNotifications((prev) =>
    prev.map((n) => ({
      ...n,
      read: true
    }))
    );
  };
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const getIcon = (type: string) => {
    const iconClass = 'h-5 w-5';
    switch (type) {
      case 'appointment':
        return (
          <Calendar
            className={`${iconClass} ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />);


      case 'message':
        return (
          <MessageCircle
            className={`${iconClass} ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />);


      case 'reward':
        return (
          <Gift
            className={`${iconClass} ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />);


      case 'reminder':
        return (
          <AlertCircle
            className={`${iconClass} ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />);


      case 'system':
        return (
          <CheckCircle2
            className={`${iconClass} ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />);


      default:
        return (
          <Bell
            className={`${iconClass} ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />);


    }
  };
  const getTypeColor = (type: string) => {
    if (isDark) {
      switch (type) {
        case 'appointment':
          return 'bg-blue-500/20';
        case 'message':
          return 'bg-purple-500/20';
        case 'reward':
          return 'bg-amber-500/20';
        case 'reminder':
          return 'bg-orange-500/20';
        case 'system':
          return 'bg-teal-500/20';
        default:
          return 'bg-slate-700';
      }
    } else {
      switch (type) {
        case 'appointment':
          return 'bg-blue-100';
        case 'message':
          return 'bg-purple-100';
        case 'reward':
          return 'bg-amber-100';
        case 'reminder':
          return 'bg-orange-100';
        case 'system':
          return 'bg-teal-100';
        default:
          return 'bg-gray-100';
      }
    }
  };
  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in"
        onClick={onClose}>
      </div>

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 shadow-2xl z-[70] animate-in slide-in-from-right ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={`flex items-center justify-between p-4 border-b bg-gradient-to-r from-teal-500 to-blue-600 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Notifications</h2>
                {unreadCount > 0 &&
                <p className="text-xs text-teal-100">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                }
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors">
              
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 &&
          <div
            className={`p-3 border-b ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            
              <button
              onClick={markAllAsRead}
              className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'}`}>
              
                <Check className="h-4 w-4" />
                Tout marquer comme lu
              </button>
            </div>
          }

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ?
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                
                  <Bell
                  className={`h-8 w-8 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                
                </div>
                <h3
                className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Aucune notification
                </h3>
                <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                
                  Vous êtes à jour ! Toutes vos notifications apparaîtront ici.
                </p>
              </div> :

            <div
              className={
              isDark ?
              'divide-y divide-slate-700' :
              'divide-y divide-gray-100'
              }>
              
                {notifications.map((notification) =>
              <div
                key={notification.id}
                className={`p-4 transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} ${!notification.read ? isDark ? 'bg-blue-500/10' : 'bg-blue-50/50' : ''}`}>
                
                    <div className="flex gap-3">
                      <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                        className={`font-semibold text-sm ${!notification.read ? isDark ? 'text-white' : 'text-gray-900' : isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        
                            {notification.title}
                          </h3>
                          {!notification.read &&
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}>
                      </div>
                      }
                        </div>
                        <p
                      className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                        className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                        
                            {notification.time}
                          </span>
                          <div className="flex items-center gap-1">
                            {!notification.read &&
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200'}`}
                          title="Marquer comme lu">
                          
                                <Check
                            className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                          
                              </button>
                        }
                            <button
                          onClick={() =>
                          deleteNotification(notification.id)
                          }
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Supprimer">
                          
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            }
          </div>

          {/* Footer */}
          <div
            className={`p-4 border-t ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            
            <Button
              variant="outline"
              fullWidth
              size="sm"
              onClick={onClose}
              className={
              isDark ?
              'text-white border-slate-600 hover:bg-slate-700' :
              'text-gray-700'
              }>
              
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </>);

}