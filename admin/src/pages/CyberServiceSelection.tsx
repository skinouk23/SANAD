import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope,
  Baby,
  Heart,
  Activity,
  Thermometer,
  UserCheck,
  Grid3x3,
  HeartPulse,
  Users,
  Dumbbell,
  Ambulance,
  Calendar,
  HandHeart,
  UtensilsCrossed,
  Brain,
  FlaskConical,
  Scan,
  Trophy,
  Syringe,
  ArrowRight,
  Zap,
  Smile,
  Pill,
  Flower2,
  Loader2,
  PawPrint } from
'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useServices } from '../hooks/useServices';
// Map icon names to components
const iconMap: Record<string, any> = {
  Syringe,
  Heart,
  Activity,
  Baby,
  Thermometer,
  UserCheck,
  Ambulance,
  Stethoscope,
  Calendar,
  HandHeart,
  Smile,
  UtensilsCrossed,
  Brain,
  FlaskConical,
  Scan,
  Pill,
  Trophy,
  Flower2,
  PawPrint
};
export function CyberServiceSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all');
  const { data: services, loading } = useServices(
    activeFilter === 'all' ? undefined : activeFilter
  );
  const handleServiceSelect = (serviceId: string) => {
    if (!isAuthenticated) {
      navigate('/auth/login', {
        state: {
          returnTo: location.pathname,
          serviceId
        }
      });
      return;
    }
    const routes: Record<string, string> = {
      laboratory: '/laboratory',
      radiology: '/radiology',
      gym: '/gym',
      nutrition: '/nutrition-providers',
      ambulance: '/ambulance',
      pharmacy: '/pharmacy',
      funeral: '/funeral',
      veterinary: '/veterinary'
    };
    if (routes[serviceId]) {
      navigate(routes[serviceId]);
      return;
    }
    const careServices = [
    'nursing',
    'elderly',
    'physio',
    'maternity',
    'checkup',
    'night',
    'doctor-home',
    'chronic-care',
    'psychology',
    'medical-companion',
    'babysitting'];

    if (careServices.includes(serviceId)) {
      navigate(`/care/${serviceId}`);
      return;
    }
    navigate('/match');
  };
  const filters = [
  {
    id: 'all',
    label: t.services.all,
    icon: Grid3x3
  },
  {
    id: 'medical',
    label: t.services.medicalCare,
    icon: HeartPulse
  },
  {
    id: 'daily',
    label: t.services.dailyHelp,
    icon: Users
  },
  {
    id: 'rehabilitation',
    label: t.services.rehabilitation,
    icon: Dumbbell
  }];

  return (
    <div className="min-h-screen">
      <div className="relative z-10 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <p
              className={`text-xs font-medium tracking-wide uppercase mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              
              {t.services.title}
            </p>
            <h1
              className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {t.services.whatCareNeeded}
            </h1>
            <p
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              {t.services.subtitle}
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-6 gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {filters.map((filter) =>
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeFilter === filter.id ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' : isDark ? 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700' : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'}`}>
              
                <filter.icon className="h-3.5 w-3.5" />
                <span>{filter.label}</span>
              </button>
            )}
          </div>

          {/* Services Grid */}
          {loading ?
          <div className="flex justify-center items-center py-10">
              <Loader2
              className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            </div> :

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {services.map((service) => {
              const Icon = iconMap[service.icon] || Activity;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="group relative overflow-hidden text-left rounded-xl">
                  
                    <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                    <div
                    className={`relative backdrop-blur-sm border rounded-xl p-4 transition-all h-full ${isDark ? 'bg-slate-800/50 border-slate-700 group-hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 group-hover:border-cyan-500/50 shadow-sm'}`}>
                    
                      {service.badge &&
                    <div
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-600'}`}>
                      
                          {service.badge}
                        </div>
                    }

                      <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-3`}>
                      
                        <Icon className="h-4 w-4 text-white" />
                      </div>

                      <h3
                      className={`text-sm font-bold mb-1 transition-colors ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-cyan-600'}`}>
                      
                        {service.name}
                      </h3>

                      <p
                      className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <span
                        className={`text-[11px] font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        
                          {service.basePrice > 0 ?
                        `Dès ${service.basePrice} ${service.currency}` :
                        'Sur devis'}
                        </span>
                        <ArrowRight
                        className={`h-4 w-4 group-hover:translate-x-1 transition-all ${isDark ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-cyan-600'}`} />
                      
                      </div>
                    </div>
                  </button>);

            })}
            </div>
          }

          {/* Footer */}
          <div className="mt-8 text-center">
            <p
              className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
              {t.services.notFound}{' '}
              <a
                href="#"
                className={`font-semibold underline ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
                
                {t.services.contactUs}
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>);

}