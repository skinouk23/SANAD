import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  BarChart3,
  MapPin,
  Loader2 } from
'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  useTransactionStats,
  useProviderBalance } from
'../../hooks/useTransactions';
import { useAppointmentStats } from '../../hooks/useAppointments';
import { useTopZones, useRevenueData } from '../../hooks/useAnalytics';
// Stat Card Component
function StatCard({
  label,
  value,
  unit,
  change,
  icon: Icon,
  gradient,
  loading,
  isDark









}: {label: string;value: string;unit: string;change: string;icon: React.ElementType;gradient: string;loading?: boolean;isDark: boolean;}) {
  const isPositive = change.startsWith('+');
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
      
      <div className="flex items-center justify-between mb-2">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <span
          className={`text-[10px] sm:text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          
          {isPositive ?
          <TrendingUp className="h-3 w-3" /> :

          <TrendingDown className="h-3 w-3" />
          }
          {change}
        </span>
      </div>
      <p
        className={`text-[10px] sm:text-xs font-medium tracking-wide uppercase mb-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
        
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        {loading ?
        <div
          className={`h-6 sm:h-7 w-16 sm:w-20 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div> :

        <>
            <span
            className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              {value}
            </span>
            <span
            className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
              {unit}
            </span>
          </>
        }
      </div>
    </div>);

}
// Chart Bar Component
function ChartBar({
  label,
  value,
  maxValue,
  isDark





}: {label: string;value: number;maxValue: number;isDark: boolean;}) {
  const percentage = maxValue > 0 ? value / maxValue * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          
          {label}
        </span>
        <span
          className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          {value.toLocaleString()} TND
        </span>
      </div>
      <div
        className={`w-full rounded-full h-2 sm:h-2.5 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`
          }}>
        </div>
      </div>
    </div>);

}
// Loading Skeleton
function StatsSkeleton({ isDark }: {isDark: boolean;}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {[1, 2, 3, 4].map((i) =>
      <div
        key={i}
        className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
          <div className="flex items-center justify-between mb-2">
            <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
            <div
            className={`w-10 sm:w-12 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
          </div>
          <div
          className={`w-16 sm:w-20 h-2.5 sm:h-3 rounded mb-1.5 sm:mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
          <div
          className={`w-20 sm:w-24 h-6 sm:h-7 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
        </div>
      )}
    </div>);

}
export function CyberAnalytics() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  // API Integration - Fetch transaction stats
  const { data: transactionStats, loading: transactionLoading } =
  useTransactionStats();
  // API Integration - Fetch provider balance
  const { data: balanceData, loading: balanceLoading } =
  useProviderBalance('current-provider');
  // API Integration - Fetch appointment stats
  const { data: appointmentStats, loading: appointmentLoading } =
  useAppointmentStats();
  // Hook-based data for top zones and revenue
  const { data: topZones, loading: zonesLoading } =
  useTopZones('current-provider');
  const { data: revenueDataFromHook, loading: revenueLoading } = useRevenueData(
    'current-provider',
    period
  );
  const loading = transactionLoading || balanceLoading || appointmentLoading;
  // Build stats from API data
  const stats = [
  {
    label: t.provider.revenue,
    value: transactionStats?.totalRevenue?.toLocaleString() || '0',
    unit: 'TND',
    change: '+11.8%',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    label: t.provider.appointments,
    value: appointmentStats?.total?.toString() || '0',
    unit: '',
    change: '+10.5%',
    icon: Calendar,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    label: t.provider.patients,
    value: appointmentStats?.uniquePatients?.toString() || '0',
    unit: '',
    change: '+12.0%',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    label: t.provider.rating,
    value: appointmentStats?.averageRating?.toFixed(1) || '0.0',
    unit: '/5',
    change: '+4.3%',
    icon: Star,
    gradient: 'from-amber-500 to-orange-500'
  }];

  // Build revenue data from API or hook data
  const revenueData =
  transactionStats?.revenueByMonth || revenueDataFromHook || [];
  const maxRevenue = Math.max(...revenueData.map((d) => d.value), 1);
  // Use hook data for top zones instead of inline
  const displayTopZones = topZones || [];
  return (
    <div className="min-h-screen pb-20">
      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.provider.analytics}
              </p>
              <h1
                className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.statisticsAnalytics}
              </h1>
              <p
                className={`mt-0.5 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {t.provider.analyzePerformance}
              </p>
            </div>
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              {(['week', 'month', 'year'] as const).map((p) =>
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-medium transition-all ${period === p ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                
                  {p === 'week' && t.provider.weekShort}
                  {p === 'month' && t.provider.monthShort}
                  {p === 'year' && t.provider.yearShort}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        {loading ?
        <StatsSkeleton isDark={isDark} /> :

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, index) =>
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            change={stat.change}
            icon={stat.icon}
            gradient={stat.gradient}
            isDark={isDark} />

          )}
          </div>
        }

        {/* Revenue Chart & Top Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3
                className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.revenueEvolution}
              </h3>
              <BarChart3
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              
            </div>
            {transactionLoading ?
            <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4, 5].map((i) =>
              <div key={i} className="animate-pulse">
                    <div className="flex justify-between mb-1.5 sm:mb-2">
                      <div
                    className={`w-12 sm:w-16 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  </div>
                      <div
                    className={`w-16 sm:w-20 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  </div>
                    </div>
                    <div
                  className={`w-full h-2 sm:h-2.5 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                  </div>
              )}
              </div> :

            <div className="space-y-3 sm:space-y-4">
                {revenueData.map((data) =>
              <ChartBar
                key={data.month}
                label={data.month}
                value={data.value}
                maxValue={maxRevenue}
                isDark={isDark} />

              )}
              </div>
            }
          </div>

          <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3
                className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.topZones}
              </h3>
              <MapPin
                className={`h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              
            </div>
            <div className="space-y-3 sm:space-y-4">
              {displayTopZones.map((location) =>
              <div key={location.city}>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span
                    className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                      {location.city}
                    </span>
                    <span
                    className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {location.count} RDV
                    </span>
                  </div>
                  <div
                  className={`w-full rounded-full h-1.5 sm:h-2 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  
                    <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${location.percentage}%`
                    }}>
                  </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Balance Summary */}
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <h3
              className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Solde actuel
            </h3>
            {balanceLoading ?
            <div className="animate-pulse">
                <div
                className={`w-24 sm:w-32 h-8 sm:h-10 rounded mb-1.5 sm:mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              </div>
                <div
                className={`w-20 sm:w-24 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              </div>
              </div> :

            <>
                <p
                className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                  {balanceData?.available?.toLocaleString() || '0'} TND
                </p>
                <p
                className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                  {balanceData?.pending?.toLocaleString() || '0'} TND en attente
                </p>
              </>
            }
          </div>

          {/* Appointment Summary */}
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <h3
              className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Rendez-vous
            </h3>
            {appointmentLoading ?
            <div className="space-y-2 sm:space-y-3 animate-pulse">
                {[1, 2, 3].map((i) =>
              <div key={i} className="flex justify-between">
                    <div
                  className={`w-16 sm:w-20 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                    <div
                  className={`w-10 sm:w-12 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                  </div>
              )}
              </div> :

            <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    Confirmés
                  </span>
                  <span
                  className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  
                    {appointmentStats?.byStatus?.confirmed || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    En attente
                  </span>
                  <span
                  className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  
                    {appointmentStats?.byStatus?.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    Terminés
                  </span>
                  <span
                  className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  
                    {appointmentStats?.byStatus?.completed || 0}
                  </span>
                </div>
              </div>
            }
          </div>

          {/* Transaction Summary */}
          <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
            <h3
              className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Transactions
            </h3>
            {transactionLoading ?
            <div className="space-y-2 sm:space-y-3 animate-pulse">
                {[1, 2, 3].map((i) =>
              <div key={i} className="flex justify-between">
                    <div
                  className={`w-16 sm:w-20 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                    <div
                  className={`w-12 sm:w-16 h-3 sm:h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                </div>
                  </div>
              )}
              </div> :

            <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    Total
                  </span>
                  <span
                  className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {transactionStats?.totalCount || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    Complétées
                  </span>
                  <span
                  className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  
                    {transactionStats?.completedCount || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span
                  className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  
                    Moyenne
                  </span>
                  <span
                  className={`font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    {transactionStats?.averageAmount?.toFixed(0) || 0} TND
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}