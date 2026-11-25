import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Megaphone,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Share2,
  Target,
  Zap,
  Crown,
  CheckCircle2,
  BarChart3,
  Calendar,
  Mail,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  Clock,
  Loader2 } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  useMarketingCampaigns,
  useMarketingStats,
  useCampaignIdeas } from
'../../hooks/useMarketing';
export function MarketingCampaigns() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'active' | 'scheduled' | 'completed'>(
    'active');
  const { data: activeCampaigns, loading: activeLoading } =
  useMarketingCampaigns('active');
  const { data: scheduledCampaigns, loading: scheduledLoading } =
  useMarketingCampaigns('scheduled');
  const { data: completedCampaigns, loading: completedLoading } =
  useMarketingCampaigns('completed');
  const { data: marketingStats, loading: statsLoading } = useMarketingStats();
  const { data: campaignIdeas, loading: ideasLoading } = useCampaignIdeas();
  const loading =
  activeLoading || scheduledLoading || completedLoading || statsLoading;
  const getCampaignsByTab = () => {
    switch (activeTab) {
      case 'active':
        return activeCampaigns || [];
      case 'scheduled':
        return scheduledCampaigns || [];
      case 'completed':
        return completedCampaigns || [];
      default:
        return [];
    }
  };
  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'social':
        return <Share2 className="h-3.5 w-3.5" />;
      case 'email':
        return <Mail className="h-3.5 w-3.5" />;
      default:
        return <Megaphone className="h-3.5 w-3.5" />;
    }
  };
  const getCampaignTypeConfig = (type: string) => {
    switch (type) {
      case 'social':
        return {
          label: 'Réseaux sociaux',
          gradient: 'from-blue-500 to-cyan-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-500'
        };
      case 'email':
        return {
          label: 'Email marketing',
          gradient: 'from-purple-500 to-pink-500',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-500'
        };
      default:
        return {
          label: 'Autre',
          gradient: 'from-slate-500 to-slate-600',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-500'
        };
    }
  };
  const stats = [
  {
    label: 'Impressions',
    value: marketingStats?.totalImpressions || '0',
    change: marketingStats?.impressionsChange || '+0%',
    icon: Eye,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Clics',
    value: marketingStats?.totalClicks || '0',
    change: marketingStats?.clicksChange || '+0%',
    icon: MousePointer,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Conversions',
    value: marketingStats?.totalConversions || '0',
    change: marketingStats?.conversionsChange || '+0%',
    icon: Users,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    label: 'ROI moyen',
    value: marketingStats?.averageRoi || '0%',
    change: marketingStats?.roiChange || '+0%',
    icon: Target,
    gradient: 'from-amber-500 to-orange-500'
  }];

  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none`}>
      </div>

      <div
        className={`fixed top-20 left-1/4 w-64 h-64 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-40 right-1/4 w-64 h-64 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl pointer-events-none`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/provider-dashboard')}
            className={`flex items-center mb-3 text-xs font-medium group ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Retour au dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p
                className={`text-[10px] sm:text-xs font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                MARKETING
              </p>
              <h1
                className={`text-lg sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Campagnes Marketing
              </h1>
              <p
                className={`mt-0.5 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                Développez votre visibilité
              </p>
            </div>
            <button
              onClick={() => navigate('/provider/marketing/new')}
              className="relative group/btn overflow-hidden self-start">
              
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity blur-xl"></div>
              <div className="relative px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-medium text-white flex items-center gap-1.5 group-hover/btn:scale-105 transition-transform text-xs">
                <Megaphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nouvelle campagne</span>
                <span className="sm:hidden">Créer</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className={`mb-4 p-3 sm:p-4 rounded-xl backdrop-blur-sm ${isDark ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'}`}>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm sm:text-base font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Campagnes Marketing Incluses
              </h3>
              <p
                className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                
                Budget marketing de 500 TND/mois offert
              </p>
            </div>
            <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full whitespace-nowrap">
              👑 Elite
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
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
            className={`backdrop-blur-sm border rounded-xl p-2.5 sm:p-3 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                
                  <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/30">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {stat.change}
                </span>
              </div>
              <p
              className={`text-[9px] sm:text-[10px] font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
                {stat.label}
              </p>
              <p
              className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                {stat.value}
              </p>
            </motion.div>
          )}
        </div>

        <div
          className={`backdrop-blur-sm border rounded-xl p-1 mb-3 sm:mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="flex">
            {[
            {
              key: 'active',
              label: 'Actives',
              count: (activeCampaigns || []).length,
              icon: Play
            },
            {
              key: 'scheduled',
              label: 'Programmées',
              count: (scheduledCampaigns || []).length,
              icon: Clock
            },
            {
              key: 'completed',
              label: 'Terminées',
              count: (completedCampaigns || []).length,
              icon: CheckCircle2
            }].
            map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-[10px] sm:text-xs ${activeTab === tab.key ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              
                <tab.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 3)}.</span>
                <span
                className={`px-1 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.key ? 'bg-white/20' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                
                  {tab.count}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <AnimatePresence mode="wait">
            {getCampaignsByTab().map((campaign, index) => {
              const typeConfig = getCampaignTypeConfig(campaign.type);
              return (
                <motion.div
                  key={campaign.id}
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: -20
                  }}
                  transition={{
                    delay: index * 0.1
                  }}
                  className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30' : 'bg-white/80 border-slate-200 hover:border-cyan-500 shadow-sm'}`}>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${typeConfig.gradient} flex items-center justify-center flex-shrink-0`}>
                        
                        {getCampaignTypeIcon(campaign.type)}
                      </div>
                      <div className="min-w-0">
                        <h3
                          className={`text-xs sm:text-sm font-bold mb-0.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                          {campaign.name}
                        </h3>
                        <div
                          className={`flex flex-wrap items-center gap-1.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                          <span className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" />
                            {campaign.startDate} - {campaign.endDate}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text} border text-[9px] font-medium`}>
                            
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                      navigate(`/provider/marketing/${campaign.id}`)
                      }
                      className={`flex items-center gap-1 px-2 py-1 border rounded-lg text-[10px] font-medium transition-all self-start ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                      
                      Détails
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {campaign.status !== 'scheduled' &&
                  <>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                          className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                            Budget utilisé
                          </span>
                          <span
                          className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                            {campaign.spent} TND / {campaign.budget} TND
                          </span>
                        </div>
                        <div
                        className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        
                          <motion.div
                          initial={{
                            width: 0
                          }}
                          animate={{
                            width: `${campaign.spent! / campaign.budget * 100}%`
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.3
                          }}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full">
                        </motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
                        {[
                      {
                        label: 'Impressions',
                        value: campaign.impressions?.toLocaleString()
                      },
                      {
                        label: 'Clics',
                        value: campaign.clicks
                      },
                      {
                        label: 'Conversions',
                        value: campaign.conversions
                      },
                      {
                        label: 'CTR',
                        value: `${campaign.ctr}%`,
                        hideOnMobile: true
                      },
                      {
                        label: 'ROI',
                        value: `${campaign.roi}%`,
                        highlight: true
                      }].
                      map((metric, idx) =>
                      <div
                        key={metric.label}
                        className={`text-center p-1.5 sm:p-2 rounded-lg ${metric.highlight ? 'bg-green-500/10 border border-green-500/30' : isDark ? 'bg-slate-700/30 border border-slate-700' : 'bg-slate-50 border border-slate-200'} ${metric.hideOnMobile ? 'hidden sm:block' : ''}`}>
                        
                            <p
                          className={`text-sm sm:text-base font-bold ${metric.highlight ? 'text-green-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                          
                              {metric.value}
                            </p>
                            <p
                          className={`text-[9px] sm:text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          
                              {metric.label}
                            </p>
                          </div>
                      )}
                      </div>
                    </>
                  }

                  {campaign.status === 'scheduled' &&
                  <div
                    className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                    
                      <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                        <Clock className="h-3 w-3 text-blue-500" />
                      </div>
                      <div>
                        <p
                        className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          Campagne programmée
                        </p>
                        <p className="text-[10px] text-blue-500">
                          Démarrage automatique le {campaign.startDate}
                        </p>
                      </div>
                    </div>
                  }
                </motion.div>);

            })}
          </AnimatePresence>

          {getCampaignsByTab().length === 0 &&
          <div className="text-center py-8">
              <div
              className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              
                <Megaphone
                className={`h-6 w-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              
              </div>
              <p
              className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                Aucune campagne dans cette catégorie
              </p>
            </div>
          }
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}
          className={`border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200'}`}>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3
                className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                💡 Idées de campagnes
              </h3>
              <p
                className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                Suggestions personnalisées pour vous
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(campaignIdeas || []).map((idea, index) =>
            <motion.div
              key={idea.template}
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                delay: 0.5 + index * 0.1
              }}
              className={`p-3 rounded-lg border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30' : 'bg-white/80 border-slate-200 hover:border-cyan-500 shadow-sm'}`}>
              
                <h4
                className={`font-semibold mb-1 text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {idea.title}
                </h4>
                <p
                className={`text-[10px] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                  {idea.desc}
                </p>
                <button
                onClick={() =>
                navigate('/provider/marketing/new', {
                  state: {
                    template: idea.template
                  }
                })
                }
                className={`w-full px-2 py-1.5 border rounded-md text-[10px] font-medium transition-all flex items-center justify-center gap-1 ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-cyan-400 hover:text-white' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-cyan-600 hover:text-slate-900'}`}>
                
                  Créer
                  <ChevronRight className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>);

}