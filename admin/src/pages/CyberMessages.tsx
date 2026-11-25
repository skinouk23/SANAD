import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Search,
  Plus,
  ArrowLeft,
  Check,
  CheckCheck,
  Loader2 } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useConversations, useUnreadCount } from '../hooks/useMessages';
import type { Conversation } from '../types/api.types';
function ConversationItem({
  conversation,
  onClick,
  isDark




}: {conversation: Conversation;onClick: () => void;isDark: boolean;}) {
  const otherParticipant = conversation.participants.find(
    (p) => p.role === 'provider'
  )?.user;
  const lastMessage = conversation.lastMessage;
  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };
  const getAvatarGradient = (name: string) => {
    const gradients = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500'];

    return gradients[name.charCodeAt(0) % gradients.length];
  };
  return (
    <div
      onClick={onClick}
      className={`p-3 border-b cursor-pointer transition-all ${isDark ? 'border-slate-700/50 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'}`}>
      
      <div className="flex items-start gap-2.5">
        <div className="relative">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(otherParticipant?.name || 'U')} flex items-center justify-center text-white text-sm font-bold`}>
            
            {otherParticipant?.name?.charAt(0) || 'U'}
          </div>
          {conversation.unreadCount > 0 &&
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
              {conversation.unreadCount}
            </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3
              className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {otherParticipant?.name || 'Professionnel'}
            </h3>
            <span
              className={`text-[10px] flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
              {lastMessage ? getTimeAgo(lastMessage.createdAt) : ''}
            </span>
          </div>
          {lastMessage &&
          <div className="flex items-center gap-1.5">
              <p
              className={`text-xs truncate flex-1 ${conversation.unreadCount > 0 ? isDark ? 'text-white font-medium' : 'text-slate-900 font-medium' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                {lastMessage.content}
              </p>
              {lastMessage.read ?
            <CheckCheck
              className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-500'}`} /> :


            <Check
              className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />

            }
            </div>
          }
        </div>
      </div>
    </div>);

}
function ConversationSkeleton({ isDark }: {isDark: boolean;}) {
  return (
    <div
      className={`p-3 border-b animate-pulse ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
      
      <div className="flex items-start gap-2.5">
        <div
          className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <div
              className={`w-28 h-3.5 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            
            <div
              className={`w-10 h-2.5 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            
          </div>
          <div
            className={`w-40 h-2.5 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          
        </div>
      </div>
    </div>);

}
export function CyberMessages() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const {
    data: conversations,
    loading,
    error,
    refetch
  } = useConversations({
    unreadOnly: filter === 'unread'
  });
  const { data: totalUnread } = useUnreadCount('current');
  const filteredConversations =
  conversations?.filter((conv) => {
    if (!searchQuery) return true;
    const otherParticipant = conv.participants.find(
      (p) => p.role === 'provider'
    )?.user;
    return otherParticipant?.name?.
    toLowerCase().
    includes(searchQuery.toLowerCase());
  }) || [];
  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
  };
  return (
    <div
      className={`min-h-screen pt-2 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      {/* WOW Header */}
      <div
        className={`sticky top-0 z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="relative rounded-[14px] p-[2px] overflow-hidden mb-2">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div
              className={`relative rounded-[12px] px-4 py-3 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                    
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h1
                      className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      {t.messages.title}
                    </h1>
                    {totalUnread !== undefined && totalUnread > 0 &&
                    <p
                      className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
                      </p>
                    }
                  </div>
                </div>
              </div>
              <div className="relative mb-2">
                <Search
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                <input
                  type="text"
                  placeholder={t.messages.searchPlaceholder || 'Rechercher...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-cyan-500 text-white' : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  
                  {t.common.all}
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filter === 'unread' ? 'bg-cyan-500 text-white' : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  
                  {t.common.unread}
                  {totalUnread !== undefined && totalUnread > 0 &&
                  <span
                    className={`px-1 py-0.5 rounded-full text-[9px] ${filter === 'unread' ? 'bg-white/20' : isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                    
                      {totalUnread}
                    </span>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ?
        <>
            {[1, 2, 3, 4].map((i) =>
          <ConversationSkeleton key={i} isDark={isDark} />
          )}
          </> :
        error ?
        <div className="p-4 text-center">
            <MessageCircle
            className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          
            <p
            className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            
              Erreur de chargement
            </p>
            <button
            onClick={() => refetch()}
            className="text-xs text-cyan-500 hover:text-cyan-400 font-medium">
            
              Réessayer
            </button>
          </div> :
        filteredConversations.length > 0 ?
        filteredConversations.map((conversation) =>
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isDark={isDark}
          onClick={() => handleConversationClick(conversation.id)} />

        ) :

        <div className="p-4 text-center">
            <MessageCircle
            className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          
            <p
            className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            
              {filter === 'unread' ?
            'Aucun message non lu' :
            'Aucune conversation'}
            </p>
            <p
            className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            
              {filter === 'unread' ?
            'Tous vos messages ont été lus' :
            'Commencez une nouvelle conversation avec un professionnel'}
            </p>
          </div>
        }
      </div>
    </div>);

}