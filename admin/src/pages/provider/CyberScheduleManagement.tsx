import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Video,
  X,
  Check,
  Ban,
  Save } from
'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
interface Appointment {
  id: number;
  patientName: string;
  service: string;
  date: Date;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'rejected';
  type: 'home' | 'video';
  location: string;
}
interface BlockedSlot {
  id: number;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
}
interface Availability {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}
export function CyberScheduleManagement() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('10:00');
  const [blockReason, setBlockReason] = useState('');
  const getDayNames = () => [
  t.provider.monday,
  t.provider.tuesday,
  t.provider.wednesday,
  t.provider.thursday,
  t.provider.friday,
  t.provider.saturday,
  t.provider.sunday];

  const getShortDayNames = () => getDayNames().map((d) => d.substring(0, 3));
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([
  {
    id: 1,
    date: new Date(),
    startTime: '12:00',
    endTime: '13:00',
    reason: t.provider.lunchBreak
  }]
  );
  const [availabilities, setAvailabilities] = useState<Availability[]>([
  {
    day: t.provider.monday,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    day: t.provider.tuesday,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    day: t.provider.wednesday,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    day: t.provider.thursday,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    day: t.provider.friday,
    enabled: true,
    startTime: '08:00',
    endTime: '18:00'
  },
  {
    day: t.provider.saturday,
    enabled: false,
    startTime: '09:00',
    endTime: '13:00'
  },
  {
    day: t.provider.sunday,
    enabled: false,
    startTime: '09:00',
    endTime: '12:00'
  }]
  );
  const [appointments, setAppointments] = useState<Appointment[]>([
  {
    id: 1,
    patientName: 'Mohamed Ali',
    service: t.services.nursing,
    date: new Date(),
    time: '09:00',
    duration: 60,
    status: 'confirmed',
    type: 'home',
    location: 'Tunis Centre'
  },
  {
    id: 2,
    patientName: 'Fatma Ben Said',
    service: t.services.physio,
    date: new Date(),
    time: '11:00',
    duration: 45,
    status: 'pending',
    type: 'home',
    location: 'Ariana'
  },
  {
    id: 3,
    patientName: 'Ahmed Trabelsi',
    service: t.services.checkup,
    date: new Date(),
    time: '14:30',
    duration: 30,
    status: 'pending',
    type: 'video',
    location: t.provider.teleconsultation
  },
  {
    id: 4,
    patientName: 'Sonia Khelifi',
    service: 'Pansement',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    time: '10:00',
    duration: 30,
    status: 'pending',
    type: 'home',
    location: 'La Marsa'
  },
  {
    id: 5,
    patientName: 'Karim Bouazizi',
    service: 'Injection',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: '15:00',
    duration: 90,
    status: 'pending',
    type: 'home',
    location: 'Carthage'
  }]
  );
  const timeSlots = Array.from(
    {
      length: 13
    },
    (_, i) => i + 8
  );
  const getStatusConfig = (status: string) => {
    const configs = {
      confirmed: {
        color: 'border-green-500/50 bg-green-500/10',
        icon: CheckCircle2,
        textColor: 'text-green-500',
        label: t.provider.confirmed
      },
      pending: {
        color: 'border-amber-500/50 bg-amber-500/10',
        icon: AlertCircle,
        textColor: 'text-amber-500',
        label: t.provider.pending
      },
      cancelled: {
        color: 'border-red-500/50 bg-red-500/10',
        icon: XCircle,
        textColor: 'text-red-500',
        label: t.provider.cancelled
      },
      rejected: {
        color: 'border-rose-500/50 bg-rose-500/10',
        icon: Ban,
        textColor: 'text-rose-500',
        label: t.provider.rejected
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };
  const approveAppointment = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointments((prev) =>
    prev.map((apt) =>
    apt.id === id ?
    {
      ...apt,
      status: 'confirmed'
    } :
    apt
    )
    );
  };
  const rejectAppointment = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointments((prev) =>
    prev.map((apt) =>
    apt.id === id ?
    {
      ...apt,
      status: 'rejected'
    } :
    apt
    )
    );
  };
  const handleBlockSlot = () => {
    if (!blockDate || !blockStartTime || !blockEndTime) return;
    const newBlock: BlockedSlot = {
      id: Date.now(),
      date: new Date(blockDate),
      startTime: blockStartTime,
      endTime: blockEndTime,
      reason: blockReason || t.provider.slotBlocked
    };
    setBlockedSlots((prev) => [...prev, newBlock]);
    setShowBlockModal(false);
    setBlockDate('');
    setBlockStartTime('09:00');
    setBlockEndTime('10:00');
    setBlockReason('');
  };
  const removeBlockedSlot = (id: number) => {
    setBlockedSlots((prev) => prev.filter((slot) => slot.id !== id));
  };
  const updateAvailability = (
  index: number,
  field: keyof Availability,
  value: string | boolean) =>
  {
    setAvailabilities((prev) =>
    prev.map((avail, i) =>
    i === index ?
    {
      ...avail,
      [field]: value
    } :
    avail
    )
    );
  };
  const goToToday = () => setCurrentDate(new Date());
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() - 1);else
    if (viewMode === 'week') newDate.setDate(newDate.getDate() - 7);else
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + 1);else
    if (viewMode === 'week') newDate.setDate(newDate.getDate() + 7);else
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };
  const formatDateTitle = () => {
    const locale =
    currentLanguage.code === 'ar-TN' ? 'ar-TN' : currentLanguage.code;
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    if (viewMode === 'day')
    return currentDate.toLocaleDateString(locale, options);else
    if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString(
        locale,
        {
          month: 'long',
          year: 'numeric'
        }
      )}`;
    } else {
      return currentDate.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric'
      });
    }
  };
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startPadding = (firstDay.getDay() + 6) % 7;
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false
      });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  };
  const isSameDay = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();
  const getAppointmentsForDate = (date: Date) =>
  appointments.filter((apt) => isSameDay(apt.date, date));
  const getBlockedSlotsForDate = (date: Date) =>
  blockedSlots.filter((slot) => isSameDay(slot.date, date));
  const filteredAppointments = appointments.filter((apt) => {
    if (viewMode === 'day') return isSameDay(apt.date, currentDate);
    return true;
  });
  const weekDays = getShortDayNames();
  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-cyan-500' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500'} focus:outline-none`;
  const AppointmentCard = ({
    apt,
    compact = false



  }: {apt: Appointment;compact?: boolean;}) => {
    const config = getStatusConfig(apt.status);
    const StatusIcon = config.icon;
    const isPending = apt.status === 'pending';
    const isHomeVisit = apt.type === 'home';
    const canStartDelivery =
    (apt.status === 'confirmed' || apt.status === 'pending') && isHomeVisit;
    const handleCardClick = () => {
      if (canStartDelivery) {
        navigate(`/provider/active-delivery/${apt.id}`);
      }
    };
    if (compact) {
      return (
        <div
          onClick={handleCardClick}
          className={`p-1 rounded text-[9px] sm:text-[10px] mb-1 ${config.color} truncate ${canStartDelivery ? 'cursor-pointer hover:opacity-80' : ''}`}>
          
          <span
            className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            {apt.time}
          </span>
          <span
            className={`ml-1 hidden sm:inline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            
            {apt.patientName.split(' ')[0]}
          </span>
        </div>);

    }
    return (
      <div
        onClick={handleCardClick}
        className={`p-2 sm:p-2.5 rounded-lg border-2 mb-2 transition-all ${config.color} ${canStartDelivery ? 'cursor-pointer hover:scale-[1.01]' : ''}`}>
        
        <div className="flex items-start justify-between mb-1 sm:mb-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <StatusIcon
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 ${config.textColor}`} />
            
            <span
              className={`font-semibold text-xs sm:text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {apt.time} - {apt.patientName}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {isPending &&
            <>
                <button
                onClick={(e) => approveAppointment(apt.id, e)}
                className="p-1 sm:p-1 rounded-full bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 transition-all"
                title={t.provider.approve}>
                
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
                </button>
                <button
                onClick={(e) => rejectAppointment(apt.id, e)}
                className="p-1 sm:p-1 rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 transition-all"
                title={t.provider.reject}>
                
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-500" />
                </button>
              </>
            }
            {!isPending &&
            <span
              className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded ${config.color} ${config.textColor}`}>
              
                {config.label}
              </span>
            }
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 sm:gap-2 text-[10px] mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          
          {apt.type === 'home' ?
          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" /> :

          <Video className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
          }
          <span className="truncate">{apt.service}</span>
          <span>•</span>
          <span className="flex-shrink-0">{apt.duration} min</span>
        </div>
        <div
          className={`flex items-center justify-between text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          
          <span className="truncate">{apt.location}</span>
          {canStartDelivery &&
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-medium ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
            
              {t.provider.startDelivery || 'Démarrer →'}
            </span>
          }
        </div>
      </div>);

  };
  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.provider.planning.toUpperCase()}
              </p>
              <h1
                className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.scheduleManagement}
              </h1>
              <p
                className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {t.provider.organizeAppointments}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
          {
            label: t.provider.today,
            value: getAppointmentsForDate(new Date()).length.toString(),
            icon: Calendar,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            label: t.provider.confirmed,
            value: appointments.
            filter((a) => a.status === 'confirmed').
            length.toString(),
            icon: CheckCircle2,
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            label: t.provider.pending,
            value: appointments.
            filter((a) => a.status === 'pending').
            length.toString(),
            icon: Clock,
            gradient: 'from-amber-500 to-orange-500'
          },
          {
            label: t.provider.rejected,
            value: appointments.
            filter((a) => a.status === 'rejected').
            length.toString(),
            icon: Ban,
            gradient: 'from-red-500 to-rose-500'
          }].
          map((stat, index) =>
          <div
            key={index}
            className={`backdrop-blur-sm border rounded-xl p-3 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between mb-2">
                <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p
              className={`text-[10px] font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
                {stat.label}
              </p>
              <p
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {stat.value}
              </p>
            </div>
          )}
        </div>

        <div
          className={`backdrop-blur-sm border rounded-xl p-3 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevious}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                <ChevronLeft
                  className={`h-4 w-4 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} />
                
              </button>
              <h2
                className={`text-sm font-bold text-center capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {formatDateTitle()}
              </h2>
              <button
                onClick={goToNext}
                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                <ChevronRight
                  className={`h-4 w-4 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} />
                
              </button>
            </div>
            <div
              className={`flex items-center justify-center gap-1 p-1 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
              <button
                onClick={goToToday}
                className={`px-2 py-1 border rounded-md text-[10px] sm:text-xs font-medium transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                
                {t.provider.today}
              </button>
              {(['day', 'week', 'month'] as const).map((mode) =>
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium transition-all ${viewMode === mode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                
                  {mode === 'day' && t.provider.day}
                  {mode === 'week' && t.provider.week}
                  {mode === 'month' && t.provider.month}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div
              className={`backdrop-blur-sm border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              {viewMode === 'day' &&
              <>
                  <div
                  className={`border-b p-3 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <div
                    className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      <Clock
                      className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    
                      <span>{t.provider.hours} : 8h00 - 20h00</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <div className="min-w-[320px] w-full">
                      {timeSlots.map((hour) => {
                      const blockedForHour = getBlockedSlotsForDate(
                        currentDate
                      ).filter(
                        (slot) =>
                        parseInt(slot.startTime.split(':')[0]) <= hour &&
                        parseInt(slot.endTime.split(':')[0]) > hour
                      );
                      const isBlocked = blockedForHour.length > 0;
                      return (
                        <div
                          key={hour}
                          className={`flex border-b transition-colors ${isDark ? 'border-slate-700/50' : 'border-slate-200'} ${isBlocked ? isDark ? 'bg-slate-700/40' : 'bg-slate-100' : isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}>
                          
                            <div
                            className={`w-12 sm:w-16 p-2 text-[10px] sm:text-xs font-medium border-r flex-shrink-0 ${isDark ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-200'}`}>
                            
                              {hour}:00
                            </div>
                            <div className="flex-1 p-1.5 relative min-h-[60px] sm:min-h-[70px]">
                              {isBlocked &&
                            <div
                              className={`p-1.5 rounded-lg border-2 mb-1.5 ${isDark ? 'border-slate-600/50 bg-slate-700/30' : 'border-slate-300 bg-slate-100'}`}>
                              
                                  <div
                                className={`flex items-center gap-1.5 text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                
                                    <Ban className="h-3 w-3" />
                                    <span>{blockedForHour[0].reason}</span>
                                  </div>
                                </div>
                            }
                              {filteredAppointments.
                            filter(
                              (apt) =>
                              parseInt(apt.time.split(':')[0]) === hour
                            ).
                            map((apt) =>
                            <AppointmentCard key={apt.id} apt={apt} />
                            )}
                            </div>
                          </div>);

                    })}
                    </div>
                  </div>
                </>
              }

              {viewMode === 'week' &&
              <>
                  <div
                  className={`border-b p-2 sm:p-3 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <div className="grid grid-cols-8 gap-1">
                      <div className="w-10 sm:w-14"></div>
                      {getWeekDays().map((day, idx) =>
                    <div
                      key={idx}
                      className={`text-center p-1 rounded-lg ${isSameDay(day, new Date()) ? isDark ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-cyan-100 border border-cyan-300' : ''}`}>
                      
                          <div
                        className={`text-[9px] sm:text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                            {weekDays[idx]}
                          </div>
                          <div
                        className={`text-xs sm:text-sm font-bold ${isSameDay(day, new Date()) ? isDark ? 'text-cyan-400' : 'text-cyan-600' : isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                            {day.getDate()}
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <div className="min-w-[500px]">
                      {timeSlots.slice(0, 8).map((hour) =>
                    <div
                      key={hour}
                      className={`flex border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                      
                          <div
                        className={`w-10 sm:w-14 p-1.5 text-[9px] sm:text-[10px] font-medium border-r flex-shrink-0 ${isDark ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-200'}`}>
                        
                            {hour}:00
                          </div>
                          {getWeekDays().map((day, idx) => {
                        const dayAppointments = getAppointmentsForDate(
                          day
                        ).filter(
                          (apt) =>
                          parseInt(apt.time.split(':')[0]) === hour
                        );
                        return (
                          <div
                            key={idx}
                            className={`flex-1 p-0.5 border-r min-h-[40px] sm:min-h-[50px] ${isDark ? 'border-slate-700/30' : 'border-slate-200'}`}>
                            
                                {dayAppointments.map((apt) =>
                            <AppointmentCard
                              key={apt.id}
                              apt={apt}
                              compact />

                            )}
                              </div>);

                      })}
                        </div>
                    )}
                    </div>
                  </div>
                </>
              }

              {viewMode === 'month' &&
              <>
                  <div
                  className={`border-b p-2 sm:p-3 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  
                    <div className="grid grid-cols-7 gap-1">
                      {weekDays.map((day) =>
                    <div
                      key={day}
                      className={`text-center text-[9px] sm:text-[10px] font-medium p-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                          {day}
                        </div>
                    )}
                    </div>
                  </div>
                  <div className="p-1.5 sm:p-3">
                    <div className="grid grid-cols-7 gap-1">
                      {getMonthDays().map((dayInfo, idx) => {
                      const dayAppointments = getAppointmentsForDate(
                        dayInfo.date
                      );
                      const isToday = isSameDay(dayInfo.date, new Date());
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCurrentDate(dayInfo.date);
                            setViewMode('day');
                          }}
                          className={`min-h-[50px] sm:min-h-[60px] p-1 rounded-lg border cursor-pointer transition-all ${isDark ? 'hover:border-cyan-500/50' : 'hover:border-cyan-500'} ${isToday ? isDark ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-cyan-100 border-cyan-300' : dayInfo.isCurrentMonth ? isDark ? 'bg-slate-800/30 border-slate-700/30' : 'bg-white border-slate-200' : isDark ? 'bg-slate-900/30 border-slate-800/30' : 'bg-slate-50 border-slate-100'}`}>
                          
                            <div
                            className={`text-[10px] sm:text-xs font-medium mb-0.5 ${isToday ? isDark ? 'text-cyan-400' : 'text-cyan-600' : dayInfo.isCurrentMonth ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                            
                              {dayInfo.date.getDate()}
                            </div>
                            {dayAppointments.slice(0, 2).map((apt) => {
                            const config = getStatusConfig(apt.status);
                            return (
                              <div
                                key={apt.id}
                                className={`text-[7px] sm:text-[9px] p-0.5 rounded mb-0.5 truncate ${config.color}`}>
                                
                                  {apt.time}
                                </div>);

                          })}
                            {dayAppointments.length > 2 &&
                          <div
                            className={`text-[7px] sm:text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            
                                +{dayAppointments.length - 2}
                              </div>
                          }
                          </div>);

                    })}
                    </div>
                  </div>
                </>
              }
            </div>
          </div>

          <div className="space-y-3">
            <div
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.quickActions}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowBlockModal(true)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-medium transition-all text-left flex items-center gap-2 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                  
                  <Ban className="h-3.5 w-3.5 text-red-500" />
                  {t.provider.blockSlot}
                </button>
                <button
                  onClick={() => setShowAvailabilityModal(true)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-medium transition-all text-left flex items-center gap-2 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                  
                  <Calendar
                    className={`h-3.5 w-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  
                  {t.provider.setAvailability}
                </button>
              </div>
            </div>

            {blockedSlots.length > 0 &&
            <div
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                <h3
                className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.provider.blockedSlots}
                </h3>
                <div className="space-y-2">
                  {blockedSlots.map((slot) =>
                <div
                  key={slot.id}
                  className={`p-2 rounded-lg border flex items-center justify-between ${isDark ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50'}`}>
                  
                      <div>
                        <div
                      className={`text-[10px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {slot.date.toLocaleDateString(currentLanguage.code)}
                        </div>
                        <div
                      className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div
                      className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          {slot.reason}
                        </div>
                      </div>
                      <button
                    onClick={() => removeBlockedSlot(slot.id)}
                    className={`p-1 rounded ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}>
                    
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                )}
                </div>
              </div>
            }

            <div
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.legend}
              </h3>
              <div className="space-y-1.5 text-[10px] sm:text-xs">
                {['confirmed', 'pending', 'rejected', 'cancelled'].map(
                  (status) => {
                    const config = getStatusConfig(status);
                    return (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded border-2 ${config.color}`}>
                        </div>
                        <span
                          className={
                          isDark ? 'text-slate-300' : 'text-slate-600'
                          }>
                          
                          {config.label}
                        </span>
                      </div>);

                  }
                )}
              </div>
            </div>

            <div
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.upcomingAppointments}
              </h3>
              <div className="space-y-2">
                {appointments.
                filter(
                  (a) => a.status !== 'rejected' && a.status !== 'cancelled'
                ).
                slice(0, 3).
                map((apt) => {
                  const config = getStatusConfig(apt.status);
                  return (
                    <div
                      key={apt.id}
                      className={`p-2 rounded-lg border ${config.color}`}>
                      
                        <div className="flex items-center justify-between">
                          <span
                          className={`text-[10px] font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {apt.patientName}
                          </span>
                          <span
                          className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                            {apt.time}
                          </span>
                        </div>
                        <div
                        className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          {apt.service}
                        </div>
                      </div>);

                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBlockModal &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowBlockModal(false)}>
          
            <motion.div
            initial={{
              scale: 0.95,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.95,
              opacity: 0
            }}
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl p-4 w-full max-w-sm max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              <div className="flex items-center justify-between mb-4">
                <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.provider.blockThisSlot}
                </h3>
                <button
                onClick={() => setShowBlockModal(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                  <X
                  className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    {t.provider.date}
                  </label>
                  <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className={inputClass} />
                
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      {t.provider.startTime}
                    </label>
                    <input
                    type="time"
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className={inputClass} />
                  
                  </div>
                  <div>
                    <label
                    className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                      {t.provider.endTime}
                    </label>
                    <input
                    type="time"
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className={inputClass} />
                  
                  </div>
                </div>

                <div>
                  <label
                  className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    {t.provider.reasonOptional}
                  </label>
                  <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Pause déjeuner, Réunion..."
                  className={inputClass} />
                
                </div>

                <div className="flex gap-2 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                  onClick={() => setShowBlockModal(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  
                    {t.common.cancel}
                  </button>
                  <button
                  onClick={handleBlockSlot}
                  disabled={!blockDate || !blockStartTime || !blockEndTime}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  
                    {t.provider.blockSlot}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {showAvailabilityModal &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAvailabilityModal(false)}>
          
            <motion.div
            initial={{
              scale: 0.95,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.95,
              opacity: 0
            }}
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl p-4 w-full max-w-lg max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            
              <div className="flex items-center justify-between mb-4">
                <h3
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {t.provider.setAvailabilities}
                </h3>
                <button
                onClick={() => setShowAvailabilityModal(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                
                  <X
                  className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                
                </button>
              </div>

              <div className="space-y-3">
                {availabilities.map((avail, index) =>
              <div
                key={index}
                className={`flex items-center justify-between p-2.5 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                
                    <div className="flex items-center gap-2 w-24 sm:w-32">
                      <input
                    type="checkbox"
                    checked={avail.enabled}
                    onChange={(e) =>
                    updateAvailability(index, 'enabled', e.target.checked)
                    }
                    className="w-3.5 h-3.5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
                  
                      <span
                    className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    
                        {avail.day}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <input
                    type="time"
                    value={avail.startTime}
                    onChange={(e) =>
                    updateAvailability(index, 'startTime', e.target.value)
                    }
                    disabled={!avail.enabled}
                    className={`w-20 sm:w-24 px-2 py-1 text-xs border rounded-md transition-all ${isDark ? 'bg-slate-800 border-slate-600 text-white disabled:opacity-50' : 'bg-white border-slate-300 text-slate-900 disabled:opacity-50'}`} />
                  
                      <span
                    className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    
                        {t.provider.to}
                      </span>
                      <input
                    type="time"
                    value={avail.endTime}
                    onChange={(e) =>
                    updateAvailability(index, 'endTime', e.target.value)
                    }
                    disabled={!avail.enabled}
                    className={`w-20 sm:w-24 px-2 py-1 text-xs border rounded-md transition-all ${isDark ? 'bg-slate-800 border-slate-600 text-white disabled:opacity-50' : 'bg-white border-slate-300 text-slate-900 disabled:opacity-50'}`} />
                  
                    </div>
                  </div>
              )}

                <div className="flex gap-2 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  
                    {t.common.cancel}
                  </button>
                  <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                  
                    <Save className="h-4 w-4" />
                    {t.provider.saveAvailabilities}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}