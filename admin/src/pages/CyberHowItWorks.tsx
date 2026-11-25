import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  CreditCard,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  ArrowDown,
  Wallet,
  Zap,
  Crown,
  Star,
  Percent } from
'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
export function CyberHowItWorks() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero */}
        <section className="pt-10 pb-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p
              className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
              {t.nav.howItWorks}
            </p>
            <h1
              className={`text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {t.howItWorks.title}
            </h1>
            <p
              className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              
              {t.howItWorks.subtitle}
            </p>
          </div>
        </section>

        {/* Patient Flow */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.howItWorks.forPatients}
              </p>
              <h2
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.howItWorks.simpleSteps}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              <div className="hidden md:block absolute top-8 left-1/8 right-1/8 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30" />

              {[
              {
                step: 1,
                icon: Search,
                title: t.howItWorks.step1,
                desc: t.howItWorks.step1Desc,
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                step: 2,
                icon: Users,
                title: t.howItWorks.step2,
                desc: t.howItWorks.step2Desc,
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                step: 3,
                icon: CreditCard,
                title: t.howItWorks.step3,
                desc: t.howItWorks.step3Desc,
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                step: 4,
                icon: CheckCircle,
                title: t.howItWorks.step4,
                desc: t.howItWorks.step4Desc,
                gradient: 'from-pink-500 to-rose-500'
              }].
              map((item) =>
              <div key={item.step} className="relative z-10">
                  <div
                  className={`backdrop-blur-sm border rounded-xl p-4 text-center transition-all h-full ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
                  
                    <div className="relative mb-4">
                      <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-md opacity-50 animate-pulse`} />
                    
                      <div
                      className={`relative w-10 h-10 mx-auto rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                      {item.step}
                    </div>
                    <h3
                    className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {item.title}
                    </h3>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {item.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Payment Flow */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.howItWorks.securePayment}
              </p>
              <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.howItWorks.howPaymentWorks}
              </h2>
              <p
                className={`text-sm max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                Découvrez nos 3 formules d'abonnement adaptées à chaque
                professionnel
              </p>
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {/* Commission Plan */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all relative ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-500/50' : 'bg-white/80 border-slate-200 hover:border-slate-400/50 shadow-sm'}`}>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                    <Percent className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Plan Commission
                    </h3>
                    <p
                      className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                      Idéal pour débuter
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div
                    className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    15%
                    <span
                      className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                      par prestation
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                  "Aucun frais d'inscription",
                  'Paiement uniquement si prestation',
                  'Accès à tous les patients',
                  'Support standard'].
                  map((feature, i) =>
                  <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle
                      className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    
                      <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                        {feature}
                      </span>
                    </li>
                  )}
                </ul>

                <div
                  className={`p-3 rounded-lg mt-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                  
                  <div
                    className={`text-[10px] font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                    Exemple: Prestation de 100 TND
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                      Vous recevez:
                    </span>
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      
                      85 TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Standard Plan */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all relative ${isDark ? 'bg-slate-800/50 border-blue-500/50 hover:border-blue-400/70' : 'bg-white/80 border-blue-300 hover:border-blue-400 shadow-sm'}`}>
                
                <div
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isDark ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}>
                  
                  Populaire
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Plan Standard
                    </h3>
                    <p
                      className={`text-[10px] ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      
                      Pour les actifs
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div
                    className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    30 TND
                    <span
                      className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                      / mois
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                  '0% de commission',
                  'Gardez 100% de vos revenus',
                  'Visibilité prioritaire',
                  'Support prioritaire',
                  'Statistiques avancées'].
                  map((feature, i) =>
                  <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle
                      className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    
                      <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                        {feature}
                      </span>
                    </li>
                  )}
                </ul>

                <div
                  className={`p-3 rounded-lg mt-auto ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
                  
                  <div
                    className={`text-[10px] font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    
                    Exemple: Prestation de 100 TND
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                      Vous recevez:
                    </span>
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      
                      100 TND
                    </span>
                  </div>
                </div>
              </div>

              {/* Elite Plan */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-4 transition-all relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-amber-900/30 to-slate-800/50 border-amber-500/50 hover:border-amber-400/70' : 'bg-gradient-to-br from-amber-50 to-white border-amber-300 hover:border-amber-400 shadow-sm'}`}>
                
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center gap-2 mb-3 relative">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                      Plan Elite
                    </h3>
                    <p
                      className={`text-[10px] ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      
                      Premium VIP
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <div
                    className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    100 TND
                    <span
                      className={`text-xs font-normal ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      
                      / mois
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {[
                  '0% de commission',
                  'Badge VIP vérifié',
                  'En tête des résultats',
                  'Support dédié 24/7',
                  'Outils marketing inclus'].
                  map((feature, i) =>
                  <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle
                      className={`h-3.5 w-3.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                    
                      <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                        {feature}
                      </span>
                    </li>
                  )}
                </ul>

                <div
                  className={`p-3 rounded-lg mt-auto ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'}`}>
                  
                  <div
                    className={`text-[10px] font-medium mb-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    
                    Exemple: Prestation de 100 TND
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      
                      Vous recevez:
                    </span>
                    <span
                      className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      
                      100 TND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Payment Flow - Commission Example */}
              <div
                className={`backdrop-blur-sm border rounded-xl p-5 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
                
                <h3
                  className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  <Wallet
                    className={`h-4 w-4 flex-shrink-0 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  
                  <span>{t.howItWorks.paymentFlow}</span>
                  <span
                    className={`text-[9px] font-semibold ml-auto px-2 py-0.5 rounded-full ${isDark ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400' : 'bg-amber-100 border border-amber-300 text-amber-700'}`}>
                    
                    Flux commission
                  </span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      1
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {t.howItWorks.youPaySanad}
                      </div>
                      <div
                        className={`text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                        {t.howItWorks.securePaymentMethod}
                      </div>
                      <div
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-slate-700 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                        
                        100 TND
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowDown
                      className={`h-4 w-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      2
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {t.howItWorks.sanadCommission}
                      </div>
                      <div
                        className={`text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                        {t.howItWorks.qualityGuarantee}
                      </div>
                      <div
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        
                        15 TND (15%)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowDown
                      className={`h-4 w-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      3
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        {t.howItWorks.professionalReceives}
                      </div>
                      <div
                        className={`text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                        {t.howItWorks.autoTransfer}
                      </div>
                      <div
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-slate-700 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        
                        85 TND
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {[
                {
                  icon: Shield,
                  title: t.howItWorks.guaranteedProtection,
                  desc: t.howItWorks.refundIfProblem,
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  icon: CheckCircle,
                  title: t.howItWorks.verifiedQuality,
                  desc: t.howItWorks.verifiedProfessionals,
                  gradient: 'from-blue-500 to-purple-500'
                },
                {
                  icon: Clock,
                  title: t.howItWorks.support247,
                  desc: t.howItWorks.teamAvailable,
                  gradient: 'from-purple-500 to-pink-500'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className={`backdrop-blur-sm border rounded-xl p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
                  
                    <div className="flex items-center gap-3">
                      <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0`}>
                      
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4
                        className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                          {item.title}
                        </h4>
                        <p
                        className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Provider Flow */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.howItWorks.forProfessionals}
              </p>
              <h2
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.howItWorks.joinNetwork}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
              {
                icon: Users,
                title: t.howItWorks.signUp,
                desc: t.howItWorks.createProfile,
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                icon: Calendar,
                title: t.howItWorks.manageSchedule,
                desc: t.howItWorks.setAvailability,
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                icon: TrendingUp,
                title: t.howItWorks.receivePayments,
                desc: t.howItWorks.autoPayments,
                gradient: 'from-purple-500 to-pink-500'
              }].
              map((item, i) =>
              <div
                key={i}
                className={`backdrop-blur-sm border rounded-xl p-4 text-center transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'}`}>
                
                  <div
                  className={`w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3
                  className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {item.title}
                  </h3>
                  <p
                  className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  
                    {item.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-xl">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

              <div
                className={`relative rounded-[18px] p-8 text-center backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                
                <h2
                  className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.home.readyToStart}
                </h2>
                <p
                  className={`text-sm mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  {t.home.heroSubtitle}
                </p>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-block relative group">
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                  <div className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white text-sm flex items-center gap-2 group-hover:scale-105 transition-transform">
                    {t.howItWorks.findProfessional}
                    <Zap className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>);

}