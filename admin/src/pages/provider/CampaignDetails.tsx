import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Eye,
  MousePointer,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Share2,
  Mail,
  Pause,
  Play,
  Edit,
  Copy,
  Trash2,
  Download,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet } from
'lucide-react';
import {
  useCampaignDetail,
  useCampaignPerformance,
  useCampaignAudience } from
'../../hooks/useCampaignDetails';
import { useTheme } from '../../contexts/ThemeContext';
export function CampaignDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'audience' | 'performance'>(
    'overview');
  // Hook-based data fetching
  const { data: campaign } = useCampaignDetail(id);
  const { data: performanceData } = useCampaignPerformance(id);
  const { data: audienceData } = useCampaignAudience(id);
  const safeCampaign = campaign ?? {
    id: 0,
    name: '',
    type: 'social',
    status: 'active',
    startDate: '',
    endDate: '',
    budget: 0,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    roi: 0,
    objective: '',
    content: {
      headline: '',
      description: '',
      cta: ''
    }
  };
  const safePerformanceData = performanceData ?? [];
  const safeAudienceData = audienceData ?? {
    ageGroups: [],
    topLocations: [],
    devices: []
  };
  const stats = [
  {
    label: 'Impressions',
    value: safeCampaign.impressions.toLocaleString(),
    change: '+12%',
    up: true,
    icon: Eye,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Clics',
    value: safeCampaign.clicks,
    change: '+8%',
    up: true,
    icon: MousePointer,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Conversions',
    value: safeCampaign.conversions,
    change: '+15%',
    up: true,
    icon: Users,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    label: 'CTR',
    value: `${safeCampaign.ctr}%`,
    change: '-0.3%',
    up: false,
    icon: Target,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    label: 'ROI',
    value: `${safeCampaign.roi}%`,
    change: '+22%',
    up: true,
    icon: DollarSign,
    gradient: 'from-cyan-500 to-blue-500'
  }];

  const tabs = [
  {
    key: 'overview',
    label: "Vue d'ensemble",
    icon: BarChart3
  },
  {
    key: 'audience',
    label: 'Audience',
    icon: Users
  },
  {
    key: 'performance',
    label: 'Performance',
    icon: TrendingUp
  }];

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none`}>
      </div>

      {/* Header */}
      <div
        className={`relative z-10 backdrop-blur-sm border-b transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => navigate('/provider/marketing')}
            className={`flex items-center font-medium group transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour aux campagnes
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${safeCampaign.type === 'social' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'} flex items-center justify-center flex-shrink-0`}>
                
                {safeCampaign.type === 'social' ?
                <Share2 className="h-6 w-6 text-white" /> :

                <Mail className="h-6 w-6 text-white" />
                }
              </div>
              <div>
                <h1
                  className={`text-xl sm:text-2xl font-bold mb-1 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {safeCampaign.name}
                </h1>
                <div
                  className={`flex flex-wrap items-center gap-2 text-xs sm:text-sm transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {safeCampaign.startDate} - {safeCampaign.endDate}
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}>
                
                <Pause className="h-3.5 w-3.5" /> Pause
              </button>
              <button
                className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}>
                
                <Edit className="h-3.5 w-3.5" /> Modifier
              </button>
              <button
                className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}>
                
                <Copy className="h-3.5 w-3.5" /> Dupliquer
              </button>
              <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-xs font-medium text-red-400 transition-all">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}
            className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between mb-2">
                <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${stat.up ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                
                  {stat.up ?
                <TrendingUp className="h-2.5 w-2.5" /> :

                <TrendingDown className="h-2.5 w-2.5" />
                }
                  {stat.change}
                </span>
              </div>
              <p
              className={`text-[10px] sm:text-xs font-medium uppercase mb-0.5 transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
                {stat.label}
              </p>
              <p
              className={`text-lg sm:text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {stat.value}
              </p>
            </motion.div>
          )}
        </div>

        {/* Budget Progress */}
        <div
          className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 mb-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-sm sm:text-base font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Budget utilisé
            </h3>
            <button
              className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}>
              
              <Download className="h-3.5 w-3.5" /> Exporter
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
              Dépensé
            </span>
            <span
              className={`text-sm font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {safeCampaign.spent} TND / {safeCampaign.budget} TND
            </span>
          </div>
          <div
            className={`w-full rounded-full h-2.5 overflow-hidden mb-2 transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            
            <motion.div
              initial={{
                width: 0
              }}
              animate={{
                width: `${safeCampaign.spent / safeCampaign.budget * 100}%`
              }}
              transition={{
                duration: 1
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full">
            </motion.div>
          </div>
          <div
            className={`flex items-center justify-between text-xs transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
            <span>
              {Math.round(safeCampaign.spent / safeCampaign.budget * 100)}%
              utilisé
            </span>
            <span>{safeCampaign.budget - safeCampaign.spent} TND restants</span>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`backdrop-blur-sm border rounded-xl p-1 mb-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="flex">
            {tabs.map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all text-xs sm:text-sm ${activeTab === tab.key ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
              
                <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' &&
        <div className="space-y-6">
            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Performance quotidienne
              </h3>
              <div className="space-y-2">
                {safePerformanceData.map((day, index) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: index * 0.05
                }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                
                    <div
                  className={`w-16 text-xs font-medium transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                      {day.date}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p
                      className={`transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          Impressions
                        </p>
                        <p
                      className={`font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {day.impressions}
                        </p>
                      </div>
                      <div>
                        <p
                      className={`transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          Clics
                        </p>
                        <p
                      className={`font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                          {day.clicks}
                        </p>
                      </div>
                      <div>
                        <p
                      className={`transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                          Conversions
                        </p>
                        <p
                      className={`font-bold transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                          {day.conversions}
                        </p>
                      </div>
                    </div>
                  </motion.div>
              )}
              </div>
            </div>

            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Contenu de la campagne
              </h3>
              <div className="space-y-3 text-sm">
                <div
                className={`p-3 rounded-lg border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                
                  <p
                  className={`text-xs mb-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Titre
                  </p>
                  <p
                  className={`transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {safeCampaign.content.headline}
                  </p>
                </div>
                <div
                className={`p-3 rounded-lg border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                
                  <p
                  className={`text-xs mb-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Description
                  </p>
                  <p
                  className={`transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {safeCampaign.content.description}
                  </p>
                </div>
                <div
                className={`p-3 rounded-lg border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                
                  <p
                  className={`text-xs mb-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    Appel à l'action
                  </p>
                  <p
                  className={`font-medium transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                    {safeCampaign.content.cta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Audience Tab */}
        {activeTab === 'audience' &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Répartition par âge
              </h3>
              <div className="space-y-3">
                {safeAudienceData.ageGroups.map((group) =>
              <div key={group.range}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                    className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                        {group.range} ans
                      </span>
                      <span
                    className={`text-xs font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {group.percentage}%
                      </span>
                    </div>
                    <div
                  className={`w-full rounded-full h-2 transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  
                      <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${group.percentage}%`
                    }}
                    transition={{
                      duration: 0.8
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full">
                  </motion.div>
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Principales villes
              </h3>
              <div className="space-y-2">
                {safeAudienceData.topLocations.map((location) =>
              <div
                key={location.city}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                
                    <div className="flex items-center gap-2">
                      <MapPin
                    className={`h-4 w-4 transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  
                      <span
                    className={`text-sm font-medium transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {location.city}
                      </span>
                    </div>
                    <span
                  className={`text-sm font-bold transition-colors ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  
                      {location.percentage}%
                    </span>
                  </div>
              )}
              </div>
            </div>

            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Appareils
              </h3>
              <div className="space-y-3">
                {safeAudienceData.devices.map((device) =>
              <div key={device.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                    className={`text-xs font-medium flex items-center gap-2 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                        <device.icon className="h-4 w-4 text-purple-400" />
                        {device.type}
                      </span>
                      <span
                    className={`text-xs font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                        {device.percentage}%
                      </span>
                    </div>
                    <div
                  className={`w-full rounded-full h-2 transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  
                      <motion.div
                    initial={{
                      width: 0
                    }}
                    animate={{
                      width: `${device.percentage}%`
                    }}
                    transition={{
                      duration: 0.8
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full">
                  </motion.div>
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Heures d'activité
              </h3>
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from(
                {
                  length: 24
                },
                (_, i) => {
                  const activity = Math.random();
                  return (
                    <div
                      key={i}
                      className="text-center p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: `rgba(6, 182, 212, ${activity * 0.5})`
                      }}>
                      
                        <p className="text-[10px] font-medium text-white">
                          {i}h
                        </p>
                      </div>);

                }
              )}
              </div>
            </div>
          </div>
        }

        {/* Performance Tab */}
        {activeTab === 'performance' &&
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
            {
              label: 'Meilleure performance',
              value: '1,420 impressions',
              sub: '16 Jan 2024',
              icon: Clock,
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              label: 'Taux de conversion',
              value: '5.3%',
              sub: '18 conversions / 340 clics',
              icon: Target,
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              label: 'Coût par conversion',
              value: '4.83 TND',
              sub: '87 TND / 18 conversions',
              icon: DollarSign,
              gradient: 'from-purple-500 to-pink-500'
            }].
            map((item, idx) =>
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: idx * 0.1
              }}
              className={`backdrop-blur-sm border rounded-xl p-4 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
                  <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3`}>
                
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <p
                className={`text-xs mb-1 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                    {item.label}
                  </p>
                  <p
                className={`text-xl font-bold mb-1 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                    {item.value}
                  </p>
                  <p
                className={`text-xs transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                
                    {item.sub}
                  </p>
                </motion.div>
            )}
            </div>

            <div
            className={`backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <h3
              className={`text-sm sm:text-base font-bold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Évolution des impressions
              </h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {safePerformanceData.map((day, index) => {
                const maxImpressions = Math.max(
                  ...safePerformanceData.map((d) => d.impressions)
                );
                const height = day.impressions / maxImpressions * 100;
                return (
                  <motion.div
                    key={index}
                    initial={{
                      height: 0
                    }}
                    animate={{
                      height: `${height}%`
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1
                    }}
                    className="flex-1 flex flex-col items-center gap-2">
                    
                      <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg hover:opacity-80 transition-opacity cursor-pointer"
                      style={{
                        height: '100%'
                      }}>
                    </div>
                      <span
                      className={`text-[10px] transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      
                        {day.date.split(' ')[0]}
                      </span>
                    </motion.div>);

              })}
              </div>
            </div>
          </div>
        }
      </div>
    </div>);

}