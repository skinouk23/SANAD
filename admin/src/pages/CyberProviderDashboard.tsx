import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Clock,
  Star,
  BarChart3,
  CalendarCheck,
  Megaphone,
  Shield,
  FileText,
  TrendingUp,
  Activity,
  Zap,
  Users,
  Wallet,
  Loader2,
  X } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useApi } from '../hooks/useApi';
import {
  useTodayAppointments,
  useAppointmentStats } from
'../hooks/useAppointments';
import {
  useProviderBalance,
  useTransactionStats } from
'../hooks/useTransactions';
import { usersService } from '../services/users.service';
import type { Provider, Appointment } from '../types/api.types';
// Loading skeleton for stats
function StatSkeleton() {
  const { isDark } = useTheme();
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
      
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
        <div
          className={`w-10 h-3 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
      <div
        className={`w-16 h-2.5 rounded mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
      </div>
      <div
        className={`w-20 h-6 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
      </div>
    </div>);

}
// Appointment timeline item
function AppointmentTimelineItem({
  appointment,
  isLast



}: {appointment: Appointment;isLast: boolean;}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const time = new Date(appointment.scheduledAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const isCompleted = appointment.status === 'completed';
  const isUpcoming = ['pending', 'confirmed', 'in_progress'].includes(
    appointment.status
  );
  return (
    <div className="flex gap-3 relative">
      {!isLast &&
      <div
        className={`absolute left-[2.25rem] top-10 bottom-[-0.75rem] w-0.5 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
      </div>
      }

      <div
        className={`w-16 flex-shrink-0 flex flex-col items-center pt-1 ${isCompleted ? 'opacity-50' : ''}`}>
        
        <span
          className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          {time}
        </span>
        <div
          className={`w-2.5 h-2.5 rounded-full mt-1.5 border-2 ${isCompleted ? isDark ? 'bg-slate-600 border-slate-800' : 'bg-slate-300 border-white' : 'bg-cyan-500 border-slate-800'}`}>
        </div>
      </div>

      <div
        className={`flex-grow backdrop-blur-sm border rounded-xl p-3 ${isCompleted ? isDark ? 'bg-slate-800/50 border-slate-700/50 opacity-60' : 'bg-slate-50 border-slate-200 opacity-60' : isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-white border-cyan-500/30 shadow-sm'}`}>
        
        <div className="flex justify-between items-start">
          <div>
            <h3
              className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {appointment.patient?.name || 'Patient'}
            </h3>
            <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {appointment.serviceName}
            </p>
            <p
              className={`text-[10px] mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
              <div
                className={`w-1 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-400'}`}>
              </div>
              {appointment.address || 'Adresse non spécifiée'}
            </p>
          </div>
          {isUpcoming &&
          <button
            className={`px-2.5 py-1 border rounded-lg text-[10px] font-medium transition-all ${isDark ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 text-cyan-400' : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-700'}`}>
            
              {t.common.details}
            </button>
          }
          {isCompleted &&
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
            
              {t.provider.completed}
            </span>
          }
        </div>
      </div>
    </div>);

}
export function CyberProviderDashboard() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [isAvailable, setIsAvailable] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  // Use a stable provider ID - always use 'current' for mock data
  const providerId = 'current';
  // API Integration - Fetch current provider
  const { data: currentProvider, loading: providerLoading } =
  useApi<Provider | null>(() => usersService.getCurrentProvider(), []);
  // API Integration - Fetch today's appointments with stable ID
  const {
    data: todayAppointments,
    loading: appointmentsLoading,
    grouped
  } = useTodayAppointments(providerId);
  // API Integration - Fetch provider balance with stable ID
  const { data: balance, loading: balanceLoading } =
  useProviderBalance(providerId);
  // API Integration - Fetch transaction stats with stable ID
  const { data: transactionStats, loading: statsLoading } =
  useTransactionStats(providerId);
  // API Integration - Fetch appointment stats with stable ID
  const { data: appointmentStats } = useAppointmentStats(providerId, 'provider');
  // Only show loading for the initial provider fetch, not for all data
  const isLoading = providerLoading;
  // Build stats from API data - use useMemo to prevent unnecessary recalculations
  const stats = useMemo(
    () => [
    {
      icon: DollarSign,
      label: t.provider.revenue,
      value: transactionStats?.thisWeekRevenue?.toString() || '0',
      unit: 'TND',
      subtitle: t.provider.thisWeek,
      gradient: 'from-green-500 to-emerald-500',
      change: '+12%'
    },
    {
      icon: Calendar,
      label: t.provider.appointments,
      value: appointmentStats?.weekCount?.toString() || '0',
      unit: '',
      subtitle: t.provider.thisWeek,
      gradient: 'from-blue-500 to-cyan-500',
      change: `+${appointmentStats?.todayCount || 0}`
    },
    {
      icon: Star,
      label: t.provider.rating,
      value: currentProvider?.rating?.toFixed(1) || '4.9',
      unit: '/5',
      subtitle: `${currentProvider?.reviewCount || 0} ${t.provider.reviews}`,
      gradient: 'from-amber-500 to-orange-500',
      change: '+0.2'
    },
    {
      icon: TrendingUp,
      label: t.provider.growth,
      value: appointmentStats?.completionRate?.toString() || '98',
      unit: '%',
      subtitle: t.provider.successRate,
      gradient: 'from-purple-500 to-pink-500',
      change: '+5%'
    }],

    [t, transactionStats, appointmentStats, currentProvider]
  );
  const quickActions = useMemo(
    () => [
    {
      title: t.provider.planning,
      description: t.provider.manageAppointments,
      icon: CalendarCheck,
      gradient: 'from-blue-500 to-cyan-500',
      link: '/provider/schedule'
    },
    {
      title: 'Mon Solde',
      description: `${balance?.available || 0} TND disponible`,
      icon: Wallet,
      gradient: 'from-cyan-500 to-blue-600',
      link: '/provider/balance'
    },
    {
      title: t.provider.statistics,
      description: `${transactionStats?.thisMonthRevenue || 0} TND ${t.provider.thisMonth}`,
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-500',
      link: '/provider/analytics'
    },
    {
      title: t.provider.marketing,
      description: `2 ${t.provider.activeCampaigns}`,
      icon: Megaphone,
      gradient: 'from-amber-500 to-orange-500',
      link: '/provider/marketing'
    },
    {
      title: t.provider.insurance,
      description: `${t.provider.coverage} 500K TND`,
      icon: Shield,
      gradient: 'from-purple-500 to-pink-500',
      link: '/provider/insurance'
    },
    {
      title: t.provider.billing,
      description: `${transactionStats?.thisMonthRevenue || 0} TND ${t.provider.thisMonth}`,
      icon: FileText,
      gradient: 'from-teal-500 to-cyan-500',
      link: '/provider/billing'
    }],

    [t, balance, transactionStats]
  );
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.provider.greeting}
              </p>
              <h1
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {providerLoading ?
                <span className="inline-block w-40 h-7 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></span> :

                currentProvider?.name || 'Professionnel'
                }
              </h1>
              <p
                className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {currentProvider?.specialties?.[0] || t.provider.nurseTitle} •
                Sanad Pro
              </p>
            </div>

            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <span
                className={`text-xs font-medium ${isAvailable ? 'text-green-500' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                {isAvailable ? t.provider.online : t.provider.offline}
              </span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isAvailable ? 'bg-green-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
                
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 pb-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {isLoading ?
          <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </> :

          stats.map((stat, index) =>
          <div
            key={index}
            className={`backdrop-blur-sm border rounded-xl p-4 transition-all group ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-sm'}`}>
            
                <div className="flex items-start justify-between mb-3">
                  <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-green-500">
                    {stat.change}
                  </span>
                </div>

                <p
              className={`text-[10px] font-medium tracking-wide uppercase mb-1.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
                  {stat.label}
                </p>

                <div className="flex items-baseline gap-1">
                  <span
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    {stat.value}
                  </span>
                  <span
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                    {stat.unit}
                  </span>
                </div>

                <p
              className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
                  {stat.subtitle}
                </p>
              </div>
          )
          }
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.todaySchedule}
              </h2>
              <Link to="/provider/schedule">
                <button
                  className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'}`}>
                  
                  <CalendarCheck className="h-3.5 w-3.5" />
                  {t.common.seeAll}
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {appointmentsLoading ?
              <div className="flex items-center justify-center py-8">
                  <Loader2
                  className={`h-6 w-6 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                </div> :
              todayAppointments && todayAppointments.length > 0 ?
              todayAppointments.map((appointment, i) =>
              <AppointmentTimelineItem
                key={appointment.id}
                appointment={appointment}
                isLast={i === todayAppointments.length - 1} />

              ) :

              <div
                className={`backdrop-blur-sm border rounded-xl p-6 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                  <Calendar
                  className={`h-10 w-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                
                  <p
                  className={`text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                    Aucun rendez-vous aujourd'hui
                  </p>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  
                    Profitez de votre journée libre !
                  </p>
                </div>
              }
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) =>
              <Link key={index} to={action.link}>
                  <div className="group relative overflow-hidden cursor-pointer h-full">
                    <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}>
                  </div>
                    <div
                    className={`relative backdrop-blur-sm border rounded-xl p-3 transition-all h-full ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-slate-600' : 'bg-white/80 border-slate-200 group-hover:border-slate-300 shadow-sm'}`}>
                    
                      <div className="flex flex-col items-center text-center gap-2">
                        <div
                        className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3
                          className={`text-xs font-bold transition-colors ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-cyan-600'}`}>
                          
                            {action.title}
                          </h3>
                          <p
                          className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Support Card */}
            <div className="relative overflow-hidden">
              <div
                className={`relative backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                    
                    <Zap
                      className={`h-4 w-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    
                  </div>
                  <h3
                    className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    {t.provider.proSupport}
                  </h3>
                </div>
                <p
                  className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  {t.provider.needHelpIntervention}
                </p>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full px-3 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-xs font-medium text-white transition-all">
                  
                  {t.provider.contactSupport}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupportModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
          className={`relative w-full max-w-lg max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
          
            <button
            onClick={() => setShowSupportModal(false)}
            className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors z-10 ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            
              <X className="h-4 w-4" />
            </button>

            <div className="p-4 overflow-y-auto max-h-[80vh]">
              <div className="text-center mb-5">
                <div
                className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                
                  <Zap
                  className={`h-6 w-6 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                </div>
                <h2
                className={`text-xl font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  Contacter le Support
                </h2>
                <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                  Notre équipe est disponible 24/7 pour vous aider
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Sujet
                  </label>
                  <select
                  className={`w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                  
                    <option>Problème technique</option>
                    <option>Question sur un rendez-vous</option>
                    <option>Problème de paiement</option>
                    <option>Modification de profil</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Message
                  </label>
                  <textarea
                  rows={4}
                  placeholder="Décrivez votre problème..."
                  className={`w-full px-3 py-2 text-sm border rounded-lg resize-none transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
                </div>

                <div
                className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                
                  <p
                  className={`text-[10px] font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Autres moyens de contact :
                  </p>
                  <div className="space-y-1 text-[10px]">
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      📞 +216 71 123 456
                    </p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      📧 support@sanad.tn
                    </p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      💬 Chat en direct disponible
                    </p>
                  </div>
                </div>

                <button
                onClick={() => {
                  // In real app, send support request
                  setShowSupportModal(false);
                  // Show success notification
                }}
                className="w-full py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:scale-[1.02] transition-transform">
                
                  Envoyer le message
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}