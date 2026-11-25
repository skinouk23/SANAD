import React, { useEffect, useState, useRef, Component } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  CheckCircle2,
  Check,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  useChat,
  useConversation,
  useGroupedMessages } from
'../hooks/useMessages';
import type { Message } from '../types/api.types';
// Message Bubble Component
function MessageBubble({
  message,
  isOwn,
  isDark




}: {message: Message;isOwn: boolean;isDark: boolean;}) {
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2.5`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${isOwn ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'}`}>
        
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <p
            className={`text-xs ${isOwn ? 'text-cyan-100' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            
            {formatTime(message.createdAt)}
          </p>
          {isOwn && (
          message.read ?
          <CheckCircle2 className="h-3 w-3 text-cyan-100" /> :

          <Check className="h-3 w-3 text-cyan-200" />)
          }
        </div>
      </div>
    </div>);

}
// Date Separator Component
function DateSeparator({ date, isDark }: {date: string;isDark: boolean;}) {
  return (
    <div className="flex items-center justify-center my-3">
      <div
        className={`px-2 py-0.5 rounded-full text-[10px] ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
        
        {date}
      </div>
    </div>);

}
// Message Skeleton
function MessageSkeleton({
  isOwn,
  isDark



}: {isOwn: boolean;isDark: boolean;}) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2.5`}>
      <div
        className={`rounded-2xl px-3 py-2 animate-pulse ${isOwn ? 'bg-cyan-500/50' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        
        <div
          className={`h-3.5 rounded ${isOwn ? 'w-28' : 'w-40'} ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}>
        </div>
        <div
          className={`h-2.5 w-10 rounded mt-1.5 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}>
        </div>
      </div>
    </div>);

}
export function CyberMessageChat() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { conversationId } = useParams();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user'; // In real app, get from auth context
  // API Integration - Fetch conversation details
  const { data: conversation, loading: conversationLoading } =
  useConversation(conversationId);
  // API Integration - Chat functionality (messages + send)
  const {
    messages,
    loading: messagesLoading,
    sending,
    send
  } = useChat(conversationId, currentUserId);
  // Group messages by date
  const groupedMessages = useGroupedMessages(messages || []);
  // Get the other participant (provider)
  const otherParticipant = conversation?.participants.find(
    (p) => p.role === 'provider'
  )?.user;
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  const handleSendMessage = async () => {
    if (messageText.trim() && !sending) {
      const text = messageText;
      setMessageText('');
      await send(text);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // Generate avatar gradient based on name
  const getAvatarGradient = (name?: string) => {
    const gradients = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500'];

    const index = (name?.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
  };
  if (conversationLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        
        <Loader2
          className={`h-6 w-6 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        
      </div>);

  }
  if (!conversation && !conversationLoading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        
        <p
          className={`mb-3 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          Conversation non trouvée
        </p>
        <button
          onClick={() => navigate('/messages')}
          className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700' : 'bg-white text-cyan-600 hover:bg-slate-100'}`}>
          
          Retour aux messages
        </button>
      </div>);

  }
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - Fixed at top, below app header (pt-16 accounts for CyberLayout header) */}
      <div
        className={`fixed top-16 left-0 right-0 z-30 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/messages')}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                <ArrowLeft
                  className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
              </button>
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarGradient(otherParticipant?.name)} flex items-center justify-center text-base relative`}>
                
                {otherParticipant?.name?.charAt(0) || '👨‍⚕️'}
                <div
                  className={`absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 ${isDark ? 'border-slate-800' : 'border-white'}`}>
                </div>
              </div>
              <div>
                <h3
                  className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {otherParticipant?.name || 'Professionnel'}
                </h3>
                <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  {otherParticipant?.specialty || 'Professionnel de santé'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                title="Appel vocal">
                
                <Phone
                  className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                title="Appel vidéo">
                
                <Video
                  className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                <MoreVertical
                  className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable area with padding for fixed header */}
      <div className="flex-1 overflow-y-auto pt-[128px] pb-36 px-4">
        <div className="max-w-4xl mx-auto">
          {messagesLoading ?
          <>
              <MessageSkeleton isOwn={false} isDark={isDark} />
              <MessageSkeleton isOwn={true} isDark={isDark} />
              <MessageSkeleton isOwn={false} isDark={isDark} />
            </> :
          messages && messages.length > 0 ?
          groupedMessages.map((group, groupIndex) =>
          <div key={groupIndex}>
                <DateSeparator date={group.date} isDark={isDark} />
                {group.messages.map((msg) =>
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === currentUserId}
              isDark={isDark} />

            )}
              </div>
          ) :

          <div className="text-center py-10">
              <p
              className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
                Commencez la conversation
              </p>
            </div>
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Message Input - Fixed above bottom nav */}
      <div
        className={`fixed bottom-16 left-0 right-0 z-20 backdrop-blur-sm border-t p-3 ${isDark ? 'bg-slate-800/90 border-slate-700/50' : 'bg-white/90 border-slate-200'}`}>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              disabled={sending}
              className={`flex-1 px-3 py-2 border rounded-full text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm'} disabled:opacity-50`} />
            
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sending}
              className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              
              {sending ?
              <Loader2 className="h-4 w-4 animate-spin" /> :

              <Send className="h-4 w-4" />
              }
            </button>
          </div>
          <p
            className={`text-[10px] text-center mt-1.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            
            💡 Vos coordonnées personnelles restent privées
          </p>
        </div>
      </div>
    </div>);

}