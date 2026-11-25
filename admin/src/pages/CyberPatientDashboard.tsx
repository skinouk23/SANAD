import React, { useState, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Bell,
  X,
  Mail,
  UserPlus,
  Shield,
  Trash2,
  MessageCircle,
  Gift,
  Crown,
  Calendar,
  Activity,
  Zap,
  AlertCircle,
  Loader2,
  Heart } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { NotificationsPanel } from '../components/NotificationsPanel';
import {
  useUpcomingAppointments,
  useAppointmentStatus,
  useAppointmentDateTime } from
'../hooks/useAppointments';
import { useApi } from '../hooks/useApi';
import {
  usePendingValidations,
  usePatientFamilyMembers } from
'../hooks/usePatientDashboard';
import { usersService } from '../services/users.service';
import type { Patient, Appointment } from '../types/api.types';
// Appointment Card Component with API data
function AppointmentCard({ appointment }: {appointment: Appointment;}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const statusConfig = useAppointmentStatus(appointment.status);
  const dateTime = useAppointmentDateTime(appointment.scheduledAt);
  const gradients = [
  'from-green-500 to-emerald-500',
  'from-amber-500 to-orange-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500'];

  const gradient =
  gradients[Math.abs(appointment.id.charCodeAt(0)) % gradients.length];
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base`}>
            
            {appointment.provider?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h3
              className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {appointment.provider?.name || 'Professionnel'}
            </h3>
            <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {appointment.service?.name ||
              appointment.serviceName ||
              'Consultation'}
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
          
          {statusConfig.label}
        </span>
      </div>
      <div
        className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        
        <span>📅 {dateTime.dateLabel}</span>
        <span>🕐 {dateTime.timeLabel}</span>
      </div>
    </div>);

}
// Loading Skeleton
function AppointmentSkeleton() {
  const { isDark } = useTheme();
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-4 animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
          <div>
            <div
              className={`h-3.5 w-28 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'} mb-1.5`}>
            </div>
            <div
              className={`h-3 w-20 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
          </div>
        </div>
        <div
          className={`h-5 w-16 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`h-3 w-20 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
        <div
          className={`h-3 w-14 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
    </div>);

}
export function CyberPatientDashboard() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  // API Integration - Fetch current patient with error handling
  const {
    data: currentPatient,
    loading: patientLoading,
    error: patientError
  } = useApi<Patient | null>(() => usersService.getCurrentPatient(), []);
  // API Integration - Fetch upcoming appointments
  const {
    data: upcomingAppointments,
    loading: appointmentsLoading,
    error: appointmentsError
  } = useUpcomingAppointments(currentPatient?.id || 'current', 'patient');
  // Hook Integration - Family members (replaces inline state)
  const {
    members: familyMembers,
    addMember,
    removeMember,
    loading: familyLoading
  } = usePatientFamilyMembers();
  // Mock appointments fallback data
  const mockAppointments: Appointment[] = [
  {
    id: 'mock-1',
    status: 'confirmed',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    provider: {
      name: 'Dr. Amira Ben Ali'
    } as any,
    service: {
      name: 'Soins Infirmiers'
    } as any,
    serviceName: 'Soins Infirmiers'
  } as Appointment,
  {
    id: 'mock-2',
    status: 'pending',
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    provider: {
      name: 'Sami Trabelsi'
    } as any,
    service: {
      name: 'Kinésithérapie'
    } as any,
    serviceName: 'Kinésithérapie'
  } as Appointment,
  {
    id: 'mock-3',
    status: 'confirmed',
    scheduledAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    provider: {
      name: 'Fatma Khelifi'
    } as any,
    service: {
      name: 'Assistance Seniors'
    } as any,
    serviceName: 'Assistance Seniors'
  } as Appointment];

  // Use API data if available, otherwise use mock data
  const displayAppointments =
  upcomingAppointments && upcomingAppointments.length > 0 ?
  upcomingAppointments :
  mockAppointments;
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const handleAddMember = () => {
    if (newMemberEmail && newMemberName && newMemberRole) {
      addMember({
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
        color: ''
      });
      setNewMemberEmail('');
      setNewMemberName('');
      setNewMemberRole('');
      setShowAddMemberModal(false);
    }
  };
  const handleRemoveMember = (id: string) => {
    removeMember(id);
  };
  // Get patient stats from API data or use defaults
  const patientStats = currentPatient?.stats || {
    totalAppointments: 0,
    streakDays: 12,
    upcomingAppointments: displayAppointments.length
  };
  // Get patient name with fallback
  const patientName = currentPatient?.name?.split(' ')[0] || 'Mohamed';
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Header */}
        <div
          className={`backdrop-blur-sm border-b pt-4 pb-8 px-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
          
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <div>
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-1.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.dashboard.hello}
              </p>
              <h1
                className={`text-2xl font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {patientLoading ?
                <span
                  className={`inline-block w-36 h-7 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </span> :

                `${patientName} 👋`
                }
              </h1>
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {t.dashboard.healthTracking}
              </p>
            </div>
            <div className="flex gap-2.5 items-center">
              <button
                onClick={() => setShowNotifications(true)}
                className={`p-2 rounded-full border relative transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-sm'}`}>
                
                <Bell className="h-5 w-5" />
                <span
                  className={`absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}>
                </span>
              </button>
              <button
                onClick={() => navigate('/mon-espace')}
                className={`w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xl border-2 hover:scale-105 transition-transform ${isDark ? 'border-slate-700' : 'border-white shadow-lg'}`}>
                
                👤
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link to="/services" className="group">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div
                      className={`relative backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500/50' : 'bg-white border-slate-200 group-hover:border-cyan-500/50 shadow-sm'}`}>
                      
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <h3
                        className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {t.dashboard.book}
                      </h3>
                      <p
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                        {t.dashboard.findProfessional}
                      </p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => setShowEmergencyModal(true)}
                  className="group text-left">
                  
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div
                      className={`relative backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-rose-500/50' : 'bg-white border-slate-200 group-hover:border-rose-500/50 shadow-sm'}`}>
                      
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-3">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <h3
                        className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {t.dashboard.emergencyBtn}
                      </h3>
                      <p
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                        {t.dashboard.quickAssistance}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Upcoming Appointments - Now with API data */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2
                    className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    {t.dashboard.upcomingAppointments}
                  </h2>
                  <Link
                    to="/mon-espace"
                    className={`text-xs font-medium ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                    
                    {t.common.seeAll}
                  </Link>
                </div>
                <div className="space-y-3">
                  {appointmentsLoading ?
                  <>
                      <AppointmentSkeleton />
                      <AppointmentSkeleton />
                    </> :

                  displayAppointments.
                  slice(0, 3).
                  map((appointment) =>
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment} />

                  )
                  }
                </div>
              </div>

              {/* Health Stats */}
              <div>
                <h2
                  className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.dashboard.recentActivity}
                </h2>
                <div
                  className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                  
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p
                        className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                        {t.dashboard.lastConsultation}
                      </p>
                      <p
                        className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {t.dashboard.daysAgo.replace('{n}', '3')}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                    {(displayAppointments.length ||
                    patientStats.upcomingAppointments) > 0 ?
                    `${displayAppointments.length || patientStats.upcomingAppointments} rendez-vous à venir` :
                    'Aucun rendez-vous prévu'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Streak Card */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
                
                <h3
                  className={`font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.dashboard.yourTracking}
                </h3>
                <div className="text-4xl mb-1.5">🔥</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-1">
                  {patientStats.streakDays} {t.dashboard.daysStreak}
                </div>
                <p
                  className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                  {t.dashboard.continuousTracking}
                </p>
                <div className="flex justify-center gap-1.5">
                  {['🌱', '⭐', '🏆'].map((emoji, i) =>
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${i < 2 ? 'bg-gradient-to-br from-amber-500 to-orange-500' : isDark ? 'bg-slate-700 opacity-30' : 'bg-slate-200 opacity-50'}`}>
                    
                      {emoji}
                    </div>
                  )}
                </div>
              </div>

              {/* Family Circle */}
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
                <div
                  className={`relative backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-white/80 border-cyan-500/30 shadow-sm'}`}>
                  
                  <h3
                    className={`font-bold text-sm mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    {t.dashboard.familyCircle}
                  </h3>
                  <p
                    className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                    {t.dashboard.sharedWith} {familyMembers.length}{' '}
                    {t.dashboard.members}
                  </p>
                  <div className="flex -space-x-2 mb-4">
                    {familyMembers.map((member) =>
                    <div
                      key={member.id}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.color} border-2 flex items-center justify-center font-bold text-white text-xs ${isDark ? 'border-slate-800' : 'border-white'}`}
                      title={member.name}>
                      
                        {member.initial}
                      </div>
                    )}
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isDark ? 'bg-slate-700 border-slate-800 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 border-white text-slate-500 hover:bg-slate-200'}`}
                      title={t.dashboard.addMember}>
                      
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowFamilyModal(true)}
                    className="w-full px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm text-white hover:scale-105 transition-transform">
                    
                    {t.dashboard.manageAccess}
                  </button>
                </div>
              </div>

              {/* Quick Access */}
              <div className="space-y-2.5">
                {[
                {
                  to: '/messages',
                  icon: MessageCircle,
                  label: t.messages.title,
                  desc: `2 ${t.dashboard.newMessages}`,
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  to: '/rewards',
                  icon: Gift,
                  label: 'Récompenses',
                  desc: `450 ${t.dashboard.points}`,
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  to: '/donation-medicaments',
                  icon: Heart,
                  label: '💚 Dons solidaires',
                  desc: 'Médicaments & matériel',
                  gradient: 'from-emerald-500 to-teal-500'
                },
                {
                  to: '/health-concierge',
                  icon: Crown,
                  label: t.dashboard.healthConcierge,
                  desc: t.dashboard.assistance247,
                  gradient: 'from-amber-500 to-orange-500'
                }].
                map((item, i) =>
                <Link key={i} to={item.to} className="group block">
                    <div
                    className={`backdrop-blur-sm border rounded-xl p-3 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500/50' : 'bg-white border-slate-200 group-hover:border-cyan-500/50 shadow-sm'}`}>
                    
                      <div className="flex items-center gap-2.5">
                        <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                        
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3
                          className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {item.label}
                          </h3>
                          <p
                          className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)} />
      

      {/* Family Management Modal */}
      {showFamilyModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-lg w-full max-h-[70vh] flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.familyCircle.title}
                </h3>
                <button
                onClick={() => setShowFamilyModal(false)}
                className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
              className={`mb-4 p-3 rounded-lg border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
              
                <div className="flex items-start gap-2.5">
                  <Shield
                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                
                  <div>
                    <p
                    className={`text-xs font-medium ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    
                      {t.familyCircle.secureSharing}
                    </p>
                    <p
                    className={`text-[10px] mt-0.5 ${isDark ? 'text-cyan-400/70' : 'text-cyan-600'}`}>
                    
                      {t.familyCircle.secureDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <h4
                className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.familyCircle.membersCount} ({familyMembers.length})
                </h4>
                {familyMembers.map((member) =>
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                
                    <div className="flex items-center gap-2.5">
                      <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-white text-base`}>
                    
                        {member.initial}
                      </div>
                      <div>
                        <div
                      className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {member.name}
                        </div>
                        <div
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                          {member.email}
                        </div>
                        <span
                      className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] rounded-full ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                      
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
              )}
              </div>

              <div className="flex gap-2.5">
                <button
                onClick={() => {
                  setShowFamilyModal(false);
                  setShowAddMemberModal(true);
                }}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm text-white hover:scale-105 transition-transform flex items-center justify-center gap-2">
                
                  <UserPlus className="h-4 w-4" />
                  Ajouter
                </button>
                <button
                onClick={() => setShowFamilyModal(false)}
                className={`px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'}`}>
                
                  {t.common.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Add Member Modal */}
      {showAddMemberModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-md w-full ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.familyCircle.addMemberBtn}
                </h3>
                <button
                onClick={() => setShowAddMemberModal(false)}
                className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    {t.familyCircle.fullName}
                  </label>
                  <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Ex: Sarah Trabelsi"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    {t.auth.email}
                  </label>
                  <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    {t.familyCircle.relation}
                  </label>
                  <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-300 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
                  
                    <option value="">{t.familyCircle.selectRelation}</option>
                    <option value={t.familyCircle.spouse}>
                      {t.familyCircle.spouse}
                    </option>
                    <option value={t.familyCircle.son}>
                      {t.familyCircle.son}
                    </option>
                    <option value={t.familyCircle.daughter}>
                      {t.familyCircle.daughter}
                    </option>
                    <option value={t.familyCircle.brother}>
                      {t.familyCircle.brother}
                    </option>
                    <option value={t.familyCircle.sister}>
                      {t.familyCircle.sister}
                    </option>
                    <option value={t.familyCircle.parent}>
                      {t.familyCircle.parent}
                    </option>
                    <option value={t.familyCircle.other}>
                      {t.familyCircle.other}
                    </option>
                  </select>
                </div>

                <div
                className={`p-2.5 rounded-lg border ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                
                  <div className="flex items-start gap-2">
                    <Mail
                    className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  
                    <p
                    className={`text-[10px] ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    
                      {t.familyCircle.invitationEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                onClick={handleAddMember}
                disabled={!newMemberEmail || !newMemberName || !newMemberRole}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-sm text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                
                  {t.familyCircle.sendInvitation}
                </button>
                <button
                onClick={() => setShowAddMemberModal(false)}
                className={`px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'}`}>
                
                  {t.common.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Emergency Modal */}
      {showEmergencyModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`border rounded-xl max-w-md w-full ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h3
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {t.emergency.title}
                  </h3>
                </div>
                <button
                onClick={() => setShowEmergencyModal(false)}
                className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2.5 mb-4">
                <a href="tel:190" className="block">
                  <div className="bg-red-500 hover:bg-red-600 rounded-xl p-3 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="text-2xl">🚑</div>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {t.emergency.samu}
                          </h4>
                          <p className="text-xs text-red-100">
                            {t.emergency.medicalEmergency}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">190</span>
                    </div>
                  </div>
                </a>

                <a href="tel:197" className="block">
                  <div className="bg-blue-500 hover:bg-blue-600 rounded-xl p-3 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="text-2xl">👮</div>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {t.emergency.police}
                          </h4>
                          <p className="text-xs text-blue-100">
                            {t.emergency.securityEmergency}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">197</span>
                    </div>
                  </div>
                </a>

                <a href="tel:198" className="block">
                  <div className="bg-orange-500 hover:bg-orange-600 rounded-xl p-3 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="text-2xl">🚒</div>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {t.emergency.firefighters}
                          </h4>
                          <p className="text-xs text-orange-100">
                            {t.emergency.fireRescue}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">198</span>
                    </div>
                  </div>
                </a>

                <a href="tel:193" className="block">
                  <div className="bg-amber-600 hover:bg-amber-700 rounded-xl p-3 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="text-2xl">🆘</div>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {t.emergency.civilProtection}
                          </h4>
                          <p className="text-xs text-amber-100">
                            {t.emergency.naturalDisasters}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">193</span>
                    </div>
                  </div>
                </a>
              </div>

              <div
              className={`p-2.5 rounded-lg border ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
              
                <div className="flex items-start gap-2">
                  <AlertCircle
                  className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                
                  <p
                  className={`text-[10px] ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  
                    {t.emergency.onlyCallIfReal}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}