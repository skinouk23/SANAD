import React, { useEffect, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  AlertCircle,
  Heart,
  Edit,
  Loader2,
  X,
  Timer,
  Check,
  XCircle } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  useUpcomingAppointments,
  usePastAppointments,
  useCancelAppointment,
  useRateAppointment,
  useAppointmentStatus,
  useConfirmAppointment } from
'../hooks/useAppointments';
import type { Appointment } from '../types/api.types';
// Appointment Card Component
function AppointmentCard({
  appointment,
  onCall,
  onTrack,
  onDetails,
  isDark






}: {appointment: Appointment;onCall: () => void;onTrack: () => void;onDetails: () => void;isDark: boolean;}) {
  const { t } = useLanguage();
  const statusConfig = useAppointmentStatus(appointment.status);
  const gradients = [
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-purple-500 to-pink-500'];

  const gradient =
  gradients[appointment.provider?.name?.charCodeAt(0) % gradients.length || 0];
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 gap-3 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl text-white font-bold`}>
            
            {appointment.provider?.name?.charAt(0) || '👨‍⚕️'}
          </div>
          <div>
            <h3
              className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {appointment.service?.name || appointment.provider?.specialty}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
          
          {statusConfig.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div
          className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          
          <Calendar
            className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          
          <span>{formatDate(appointment.scheduledAt)}</span>
        </div>
        <div
          className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          
          <Clock
            className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          
          <span>{formatTime(appointment.scheduledAt)}</span>
        </div>
        <div
          className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          
          <MapPin
            className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          
          <span>
            {appointment.type === 'video' ?
            t.mySpace.videoConsultation :
            t.mySpace.atHome}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCall}
          className={`flex-1 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
          
          <Phone className="h-3 w-3" />
          {t.common.call}
        </button>
        <button
          onClick={onTrack}
          className="flex-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 rounded-lg text-xs font-medium text-white transition-all flex items-center justify-center gap-1">
          
          <MapPin className="h-3 w-3" />
          {t.common.follow}
        </button>
        <button
          onClick={onDetails}
          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-xs font-medium text-red-500 transition-all">
          
          {t.common.details}
        </button>
      </div>
    </div>);

}
// Validation Pending Card Component
function ValidationPendingCard({
  appointment,
  onValidate,
  onReject,
  isDark





}: {appointment: Appointment;onValidate: () => void;onReject: () => void;isDark: boolean;}) {
  const { t } = useLanguage();
  const [hoursLeft, setHoursLeft] = useState(24);
  // Calculate hours left for auto-validation (mock: based on createdAt)
  useEffect(() => {
    const createdAt = new Date(appointment.createdAt || Date.now());
    const autoValidationTime = new Date(
      createdAt.getTime() + 48 * 60 * 60 * 1000
    ); // 48 hours from creation
    const now = new Date();
    const diff = autoValidationTime.getTime() - now.getTime();
    const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    setHoursLeft(hours);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = autoValidationTime.getTime() - now.getTime();
      const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
      setHoursLeft(hours);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [appointment.createdAt]);
  const getUrgencyColor = () => {
    if (hoursLeft <= 6)
    return {
      bg: 'from-red-500 to-rose-500',
      text: 'text-red-500',
      border: 'border-red-500/50'
    };
    if (hoursLeft <= 12)
    return {
      bg: 'from-amber-500 to-orange-500',
      text: 'text-amber-500',
      border: 'border-amber-500/50'
    };
    return {
      bg: 'from-amber-500 to-orange-500',
      text: 'text-amber-500',
      border: 'border-amber-500/50'
    };
  };
  const urgency = getUrgencyColor();
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${urgency.border} ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm'}`}>
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${urgency.bg} flex items-center justify-center text-2xl text-white font-bold`}>
            
            {appointment.provider?.name?.charAt(0) || '👨‍⚕️'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className={`h-3.5 w-3.5 ${urgency.text}`} />
              <span className={`text-[10px] font-bold ${urgency.text}`}>
                {t.validation.pendingValidation}
              </span>
            </div>
            <h3
              className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {appointment.service?.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            {appointment.totalPrice || 0} TND
          </p>
        </div>
      </div>

      {/* Timer Section */}
      <div
        className={`mb-2 p-2 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className={`h-4 w-4 ${urgency.text}`} />
            <span
              className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              
              {t.mySpace.autoValidation}
            </span>
          </div>
          <div className={`text-sm font-bold ${urgency.text}`}>
            {hoursLeft} {t.mySpace.hours}
          </div>
        </div>
        <p
          className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          
          {hoursLeft <= 6 ?
          t.mySpace.urgentValidation :
          hoursLeft <= 12 ?
          t.mySpace.validateSoon :
          `La prestation sera validée automatiquement dans ${hoursLeft}h`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onValidate}
          className="flex-1 px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 rounded-lg text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5">
          
          <Check className="h-3.5 w-3.5" />
          {t.mySpace.validateNow}
        </button>
        <button
          onClick={onReject}
          className={`flex-1 px-3 py-2.5 border rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
          
          <XCircle className="h-3.5 w-3.5" />
          Refuser
        </button>
      </div>
    </div>);

}
// History Card Component
function HistoryCard({
  appointment,
  onRate,
  onToggleFavorite,
  isFavorite,
  isDark






}: {appointment: Appointment;onRate: () => void;onToggleFavorite: () => void;isFavorite: boolean;isDark: boolean;}) {
  const { t } = useLanguage();
  const statusConfig = useAppointmentStatus(appointment.status);
  const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-green-500 to-emerald-500'];

  const gradient =
  gradients[appointment.provider?.name?.charCodeAt(0) % gradients.length || 0];
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const isCompleted = appointment.status === 'completed';
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl text-white font-bold`}>
            
            {appointment.provider?.name?.charAt(0) || '👨‍⚕️'}
          </div>
          <div>
            <h3
              className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {appointment.service?.name || 'Consultation'}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
          
          {statusConfig.label}
        </span>
      </div>

      <div
        className={`flex items-center gap-4 text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(appointment.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatTime(appointment.scheduledAt)}</span>
        </div>
      </div>

      {appointment.rating && appointment.rating > 0 ?
      <div className="flex items-center gap-2 mb-2">
          <span
          className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          
            {t.mySpace.yourReview}:
          </span>
          <div className="flex gap-1">
            {Array.from({
            length: 5
          }).map((_, i) =>
          <Star
            key={i}
            className={`h-4 w-4 ${i < appointment.rating! ? 'text-amber-400 fill-amber-400' : isDark ? 'text-slate-600' : 'text-slate-300'}`} />

          )}
          </div>
        </div> :
      isCompleted ?
      <button
        onClick={onRate}
        className={`flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
        
          <Edit className="h-4 w-4" />
          {t.mySpace.giveReview}
        </button> :
      null}

      <button
        onClick={onToggleFavorite}
        className={`mt-2 text-sm transition-colors flex items-center gap-1 ${isFavorite ? 'text-pink-500 hover:text-pink-400' : isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-400 hover:text-cyan-600'}`}>
        
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-500' : ''}`} />
        {isFavorite ? t.mySpace.removeFromFavorites : t.mySpace.addToFavorites}
      </button>
    </div>);

}
// Skeleton Components
function AppointmentSkeleton({ isDark }: {isDark: boolean;}) {
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
          <div>
            <div
              className={`w-32 h-4 rounded mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
            <div
              className={`w-24 h-3 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
          </div>
        </div>
        <div
          className={`w-16 h-5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div
          className={`h-5 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
        <div
          className={`h-5 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
      <div className="flex gap-2">
        <div
          className={`flex-1 h-8 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
        <div
          className={`flex-1 h-8 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
        <div
          className={`w-16 h-8 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
    </div>);

}
export function CyberMonEspace() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'validation' | 'history'>(
    'appointments');
  const [ratingModalOpen, setRatingModalOpen] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trackingModalOpen, setTrackingModalOpen] = useState<string | null>(
    null
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  // API Integration - Fetch upcoming appointments
  const {
    data: upcomingAppointments,
    loading: upcomingLoading,
    refetch: refetchUpcoming
  } = useUpcomingAppointments();
  // API Integration - Fetch past appointments
  const {
    data: pastAppointments,
    loading: historyLoading,
    refetch: refetchHistory
  } = usePastAppointments();
  // API Integration - Cancel appointment mutation
  const { mutate: cancelAppointment, loading: cancelling } =
  useCancelAppointment();
  // API Integration - Rate appointment mutation
  const { mutate: rateAppointment, loading: rating } = useRateAppointment();
  // API Integration - Confirm appointment mutation
  const { mutate: confirmAppointment, loading: confirming } =
  useConfirmAppointment();
  // Filter pending validations (appointments that need validation)
  const validationPending =
  upcomingAppointments?.filter((apt) => apt.status === 'pending') || [];
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
    prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };
  const handleCall = (provider: string) => {
    alert(`Appel de ${provider}...`);
  };
  const handleCancelAppointment = async (appointmentId: string) => {
    await cancelAppointment({
      id: appointmentId,
      reason: 'Annulé par le patient'
    });
    refetchUpcoming();
    setDetailsModalOpen(null);
  };
  const handleValidateAppointment = async (appointmentId: string) => {
    await confirmAppointment(appointmentId);
    refetchUpcoming();
  };
  const handleRejectAppointment = async () => {
    if (rejectModalOpen && rejectReason.trim()) {
      await cancelAppointment({
        id: rejectModalOpen,
        reason: rejectReason
      });
      refetchUpcoming();
      setRejectModalOpen(null);
      setRejectReason('');
    }
  };
  const handleSubmitRating = async () => {
    if (ratingModalOpen && selectedRating > 0) {
      await rateAppointment({
        id: ratingModalOpen,
        rating: selectedRating
      });
      refetchHistory();
      setRatingModalOpen(null);
      setSelectedRating(0);
    }
  };
  const selectedAppointment = detailsModalOpen ?
  upcomingAppointments?.find((a) => a.id === detailsModalOpen) :
  null;
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Header */}
        <div
          className={`backdrop-blur-sm border-b pt-4 pb-3 px-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-[14px] p-[2px] overflow-hidden">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
              <div
                className={`relative rounded-[12px] px-4 py-2.5 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                
                <p
                  className={`text-xs font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                  {t.mySpace.title}
                </p>
                <h1
                  className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.mySpace.serviceHistory}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`backdrop-blur-sm border-b px-6 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
          
          <div className="max-w-7xl mx-auto flex gap-1">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-2 text-xs font-medium transition-all relative whitespace-nowrap ${activeTab === 'appointments' ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>
              
              Upcoming
              {upcomingAppointments &&
              upcomingAppointments.filter((apt) => apt.status !== 'pending').
              length > 0 &&
              <span
                className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                
                    {
                upcomingAppointments.filter(
                  (apt) => apt.status !== 'pending'
                ).length
                }
                  </span>
              }
              {activeTab === 'appointments' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3 py-2 text-xs font-medium transition-all relative whitespace-nowrap ${activeTab === 'validation' ? isDark ? 'text-amber-400' : 'text-amber-600' : isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>
              
              Validation
              {validationPending.length > 0 &&
              <span
                className={`ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                
                  {validationPending.length}
                </span>
              }
              {activeTab === 'validation' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 text-xs font-medium transition-all relative whitespace-nowrap ${activeTab === 'history' ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>
              
              History
              {activeTab === 'history' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              }
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 pb-12">
          {activeTab === 'appointments' ?
          <div className="space-y-3">
              {/* Upcoming Appointments (no validation pending here) */}
              <div>
                <h2
                className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.mySpace.upcomingAppointments}
                </h2>
                <div className="space-y-2">
                  {upcomingLoading ?
                <>
                      <AppointmentSkeleton isDark={isDark} />
                      <AppointmentSkeleton isDark={isDark} />
                    </> :
                upcomingAppointments &&
                upcomingAppointments.filter(
                  (apt) => apt.status !== 'pending'
                ).length > 0 ?
                upcomingAppointments.
                filter((apt) => apt.status !== 'pending').
                map((apt) =>
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  isDark={isDark}
                  onCall={() =>
                  handleCall(apt.provider?.name || 'Professionnel')
                  }
                  onTrack={() => setTrackingModalOpen(apt.id)}
                  onDetails={() => setDetailsModalOpen(apt.id)} />

                ) :

                <div
                  className={`p-4 text-center rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                  
                      <Calendar
                    className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  
                      <p
                    className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    
                        Aucun rendez-vous confirmé à venir
                      </p>
                    </div>
                }
                </div>
              </div>
            </div> :
          activeTab === 'validation' ?
          <div className="space-y-3">
              <h2
              className={`text-base font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                <AlertCircle className="h-5 w-5 text-amber-500" />
                {t.validation.pendingValidation}
                {validationPending.length > 0 &&
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-500">
                    {validationPending.length}
                  </span>
              }
              </h2>
              {upcomingLoading ?
            <>
                  <AppointmentSkeleton isDark={isDark} />
                  <AppointmentSkeleton isDark={isDark} />
                </> :
            validationPending.length > 0 ?
            <div className="space-y-2">
                  {validationPending.map((item) =>
              <ValidationPendingCard
                key={item.id}
                appointment={item}
                isDark={isDark}
                onValidate={() => handleValidateAppointment(item.id)}
                onReject={() => setRejectModalOpen(item.id)} />

              )}
                </div> :

            <div
              className={`p-4 text-center rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
                  <CheckCircle
                className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Aucune prestation en attente de validation
                  </p>
                </div>
            }
            </div> :

          <div className="space-y-3">
              {historyLoading ?
            <>
                  <AppointmentSkeleton isDark={isDark} />
                  <AppointmentSkeleton isDark={isDark} />
                  <AppointmentSkeleton isDark={isDark} />
                </> :
            pastAppointments && pastAppointments.length > 0 ?
            pastAppointments.map((service) =>
            <HistoryCard
              key={service.id}
              appointment={service}
              isDark={isDark}
              isFavorite={favorites.includes(service.id)}
              onRate={() => setRatingModalOpen(service.id)}
              onToggleFavorite={() => toggleFavorite(service.id)} />

            ) :

            <div
              className={`p-4 text-center rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
                  <Clock
                className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Aucun historique de service
                  </p>
                </div>
            }
            </div>
          }
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-md w-full p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-4">
              <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Refuser la validation
              </h3>
              <button
              onClick={() => {
                setRejectModalOpen(null);
                setRejectReason('');
              }}
              className={
              isDark ?
              'text-slate-400 hover:text-white' :
              'text-slate-500 hover:text-slate-900'
              }>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <p
            className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            
              Veuillez indiquer la raison du refus de validation :
            </p>

            <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Ex: Le service n'a pas été effectué comme prévu..."
            className={`w-full px-4 py-3 border rounded-lg transition-all mb-4 resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'}`}
            rows={4} />
          

            <div className="flex gap-3">
              <button
              onClick={() => {
                setRejectModalOpen(null);
                setRejectReason('');
              }}
              className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
              
                {t.common.cancel}
              </button>
              <button
              onClick={handleRejectAppointment}
              disabled={!rejectReason.trim() || cancelling}
              className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              
                {cancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      }

      {/* Rating Modal */}
      {ratingModalOpen &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-md w-full p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <h3
            className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              {t.rating.title}
            </h3>
            <p
            className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            
              {t.rating.howWasService}
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {Array.from({
              length: 5
            }).map((_, i) =>
            <button
              key={i}
              onClick={() => setSelectedRating(i + 1)}
              className="transition-transform hover:scale-110">
              
                  <Star
                className={`h-10 w-10 ${i < selectedRating ? 'text-amber-400 fill-amber-400' : isDark ? 'text-slate-600 hover:text-amber-400' : 'text-slate-300 hover:text-amber-400'}`} />
              
                </button>
            )}
            </div>

            <textarea
            placeholder={t.rating.shareExperience}
            className={`w-full px-4 py-3 border rounded-lg transition-all mb-4 resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}
            rows={4} />
          

            <div className="flex gap-3">
              <button
              onClick={() => {
                setRatingModalOpen(null);
                setSelectedRating(0);
              }}
              className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
              
                {t.common.cancel}
              </button>
              <button
              onClick={handleSubmitRating}
              disabled={selectedRating === 0 || rating}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2">
              
                {rating && <Loader2 className="h-4 w-4 animate-spin" />}
                {t.rating.sendReview}
              </button>
            </div>
          </div>
        </div>
      }

      {/* Tracking Modal */}
      {trackingModalOpen &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-md w-full p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <h3
            className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              {t.tracking.title}
            </h3>

            <div
            className={`rounded-lg p-4 mb-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p
                  className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {t.tracking.onTheWay}
                  </p>
                  <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {t.tracking.estimatedArrival}: 10 {t.tracking.min}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span
                  className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                    {t.tracking.professionalOnWay}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                  className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                </div>
                  <span
                  className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                    {t.tracking.arrivedDestination}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                  className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                </div>
                  <span
                  className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                    {t.tracking.serviceCompleted}
                  </span>
                </div>
              </div>
            </div>

            <button
            onClick={() => setTrackingModalOpen(null)}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 rounded-lg font-medium text-white transition-all">
            
              {t.common.close}
            </button>
          </div>
        </div>
      }

      {/* Details Modal */}
      {detailsModalOpen && selectedAppointment &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-md w-full p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <h3
            className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              {t.appointmentDetails.title}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl text-white font-bold">
                  {selectedAppointment.provider?.name?.charAt(0) || '👨‍⚕️'}
                </div>
                <div>
                  <h4
                  className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {selectedAppointment.provider?.name || 'Professionnel'}
                  </h4>
                  <p
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {selectedAppointment.service?.name ||
                  selectedAppointment.provider?.specialty}
                  </p>
                </div>
              </div>

              <div
              className={`rounded-lg p-4 space-y-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              
                <div className="flex justify-between text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.appointmentDetails.date}
                  </span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>
                    {new Date(
                    selectedAppointment.scheduledAt
                  ).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.appointmentDetails.time}
                  </span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>
                    {new Date(
                    selectedAppointment.scheduledAt
                  ).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    {t.appointmentDetails.type}
                  </span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>
                    {selectedAppointment.type === 'video' ?
                  t.mySpace.videoConsultation :
                  t.mySpace.atHome}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
              onClick={() => setDetailsModalOpen(null)}
              className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}>
              
                {t.common.close}
              </button>
              <button
              onClick={() => handleCancelAppointment(selectedAppointment.id)}
              disabled={cancelling}
              className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg font-medium text-red-500 transition-all flex items-center justify-center gap-2">
              
                {cancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                {t.mySpace.cancelAppointment}
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}