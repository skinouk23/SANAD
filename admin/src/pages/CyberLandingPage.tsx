import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Clock,
  Star,
  ArrowRight,
  Heart,
  Zap,
  Activity } from
'lucide-react';
import { Stethoscope, Baby } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { ComplianceBadges } from '../components/ComplianceBadges';
export function CyberLandingPage() {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-10 pb-14 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-8">
              {/* WOW EFFECT: Animated Gradient Border Wrapper for Hero */}
              <div className="relative rounded-[24px] p-[2px] overflow-hidden shadow-2xl mb-6">
                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

                <div
                  className={`relative rounded-[22px] p-8 md:p-12 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                  
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full backdrop-blur-sm border mb-6 animate-fade-in-up ${isDark ? 'bg-slate-800/50 border-cyan-500/30' : 'bg-slate-50/80 border-cyan-500/40 shadow-sm'}`}>
                    
                    <Star className="h-3.5 w-3.5 text-cyan-500 fill-cyan-500 mr-1.5" />
                    <span
                      className={`text-xs font-medium ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                      {t.home.trustBadge}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1
                    className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                    {t.home.heroTitle1}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                      {t.home.heroTitle2}
                    </span>
                  </h1>

                  <p
                    className={`text-sm mb-8 leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    
                    {t.home.heroSubtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/services" className="w-full sm:w-auto group">
                      <div className="relative overflow-hidden rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                        <div className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                          {t.home.findCaregiver}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                    <Link to="/how-it-works" className="w-full sm:w-auto">
                      <button
                        className={`w-full px-6 py-3 backdrop-blur-sm border rounded-lg font-bold text-sm transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500 text-white' : 'bg-slate-50/80 border-slate-200 hover:border-cyan-500 text-slate-900 shadow-sm'}`}>
                        
                        {t.home.howItWorksBtn}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="mb-6 scale-90 origin-top">
                <ComplianceBadges />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
              {[
              {
                icon: Shield,
                title: t.home.verified,
                desc: t.home.verifiedDesc,
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Clock,
                title: t.home.available247,
                desc: t.home.available247Desc,
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Users,
                title: t.home.personalizedCare,
                desc: t.home.personalizedCareDesc,
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
                      <h3
                      className={`text-sm font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      
                        {item.title}
                      </h3>
                      <p
                      className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.home.ourServices}
              </p>
              <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.home.careServices}
              </h2>
              <p
                className={`text-sm max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {t.home.careServicesDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
              {
                title: t.home.nursingCare,
                desc: t.home.nursingCareDesc,
                price: '40 TND',
                icon: Stethoscope,
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                title: t.home.seniorAssistance,
                desc: t.home.seniorAssistanceDesc,
                price: '30 TND',
                icon: Heart,
                gradient: 'from-rose-500 to-pink-500'
              },
              {
                title: t.home.maternity,
                desc: t.home.maternityDesc,
                price: '50 TND',
                icon: Baby,
                gradient: 'from-amber-500 to-orange-500'
              },
              {
                title: t.home.physiotherapy,
                desc: t.home.physiotherapyDesc,
                price: '60 TND',
                icon: Activity,
                gradient: 'from-blue-500 to-purple-500'
              }].
              map((service, i) =>
              <div
                key={i}
                className="group relative overflow-hidden cursor-pointer rounded-xl">
                
                  <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                  <div
                  className={`relative backdrop-blur-sm border rounded-xl p-4 transition-all h-full ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 group-hover:border-cyan-500/50 shadow-sm'}`}>
                  
                    <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-3`}>
                    
                      <service.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3
                    className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {service.title}
                    </h3>
                    <p
                    className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {service.desc}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span
                      className={`text-xs font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      
                        {service.price}
                      </span>
                      <ArrowRight
                      className={`h-4 w-4 group-hover:translate-x-1 transition-all ${isDark ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-cyan-600'}`} />
                    
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center mt-8">
              <Link to="/services">
                <button
                  className={`px-6 py-2.5 backdrop-blur-sm border rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500 text-white' : 'bg-white/80 border-slate-200 hover:border-cyan-500 text-slate-900 shadow-sm'}`}>
                  
                  {t.home.viewAllServices}
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.home.process}
              </p>
              <h2
                className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.home.howItWorksTitle}
              </h2>
              <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {t.home.howItWorksSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-6 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30" />

              {[
              {
                step: 1,
                title: t.home.step1Title,
                desc: t.home.step1Desc,
                gradient: 'from-cyan-500 to-blue-500'
              },
              {
                step: 2,
                title: t.home.step2Title,
                desc: t.home.step2Desc,
                gradient: 'from-blue-500 to-purple-500'
              },
              {
                step: 3,
                title: t.home.step3Title,
                desc: t.home.step3Desc,
                gradient: 'from-purple-500 to-pink-500'
              }].
              map((item) =>
              <div
                key={item.step}
                className="flex flex-col items-center text-center relative z-10">
                
                  <div className="relative mb-3">
                    <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-md opacity-50 animate-pulse`} />
                  
                    <div
                    className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center text-lg font-bold`}>
                    
                      {item.step}
                    </div>
                  </div>
                  <h3
                  className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
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

        {/* Stats Section */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div
              className={`backdrop-blur-sm border rounded-xl p-5 md:p-6 ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/60 border-slate-200 shadow-sm'}`}>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                {
                  value: '15k+',
                  label: t.home.careCompleted,
                  gradient: 'from-cyan-500 to-blue-500'
                },
                {
                  value: '98%',
                  label: t.home.satisfaction,
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  value: '500+',
                  label: t.home.caregivers,
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  value: '24/7',
                  label: t.home.support,
                  gradient: 'from-amber-500 to-orange-500'
                }].
                map((stat, i) =>
                <div key={i} className="text-center">
                    <div
                    className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1`}>
                    
                      {stat.value}
                    </div>
                    <div
                    className={`text-[10px] md:text-xs font-medium uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    
                      {stat.label}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative rounded-[20px] p-[2px] overflow-hidden shadow-xl">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />

              <div
                className={`relative rounded-[18px] p-8 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
                
                <h2
                  className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                  {t.home.readyToStart}
                </h2>
                <p
                  className={`text-sm mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                  {t.home.joinFamilies}
                </p>
                <Link to="/auth/onboarding">
                  <div className="inline-block relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                    <div className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white text-sm flex items-center gap-2 group-hover:scale-105 transition-transform">
                      {t.auth.createAccount}
                      <Zap className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>);

}