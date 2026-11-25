import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Home,
  Calendar,
  MessageCircle,
  User,
  Zap,
  BarChart3,
  Settings,
  Package,
  HelpCircle,
  LogOut,
  Wallet,
  Pill } from
'lucide-react';
interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  path: string;
  gradient: string;
}
export function CyberBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const isProvider = user?.role === 'provider' || user?.role === 'professional';
  const isPatient = user?.role === 'patient';
  const isProviderRoute =
  location.pathname.includes('/provider') ||
  location.pathname === '/provider-dashboard';
  const providerNavItems: NavItem[] = [
  {
    id: 'dashboard',
    labelKey: 'dashboard',
    icon: Home,
    path: '/provider-dashboard',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'services',
    labelKey: 'services',
    icon: Package,
    path: '/provider/services',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'schedule',
    labelKey: 'schedule',
    icon: Calendar,
    path: '/provider/schedule',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 'wallet',
    labelKey: 'wallet',
    icon: Wallet,
    path: '/provider/balance',
    gradient: 'from-cyan-500 to-teal-500'
  },
  {
    id: 'analytics',
    labelKey: 'analytics',
    icon: BarChart3,
    path: '/provider/analytics',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'transactions',
    labelKey: 'finances',
    icon: Zap,
    path: '/provider/transactions',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'messages',
    labelKey: 'messages',
    icon: MessageCircle,
    path: '/messages',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'aide',
    labelKey: 'help',
    icon: HelpCircle,
    path: '/aide',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'logout',
    labelKey: 'logout',
    icon: LogOut,
    path: '/auth/login',
    gradient: 'from-red-500 to-rose-500'
  }];

  const patientNavItems: NavItem[] = [
  {
    id: 'dashboard',
    labelKey: 'home',
    icon: Home,
    path: '/patient-dashboard',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'services',
    labelKey: 'services',
    icon: Zap,
    path: '/services',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 'equipment',
    labelKey: 'equipment',
    icon: Package,
    path: '/equipment',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'mon-espace',
    labelKey: 'mySpace',
    icon: Calendar,
    path: '/mon-espace',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'medicaments',
    labelKey: 'medications',
    icon: Pill,
    path: '/medicaments',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'messages',
    labelKey: 'messages',
    icon: MessageCircle,
    path: '/messages',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'aide',
    labelKey: 'help',
    icon: HelpCircle,
    path: '/aide',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'logout',
    labelKey: 'logout',
    icon: LogOut,
    path: '/auth/login',
    gradient: 'from-red-500 to-rose-500'
  }];

  const defaultNavItems: NavItem[] = [
  {
    id: 'home',
    labelKey: 'home',
    icon: Home,
    path: '/',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'services',
    labelKey: 'services',
    icon: Zap,
    path: '/services',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 'how',
    labelKey: 'howItWorks',
    icon: Settings,
    path: '/how-it-works',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'login',
    labelKey: 'login',
    icon: User,
    path: '/auth/login',
    gradient: 'from-amber-500 to-orange-500'
  }];

  const getLabel = (labelKey: string): string => {
    return (t.nav as Record<string, string>)[labelKey] || labelKey;
  };
  let navItems: NavItem[];
  if (isAuthenticated && user) {
    if (isProvider) {
      navItems = providerNavItems;
    } else if (isPatient) {
      navItems = patientNavItems;
    } else {
      navItems = patientNavItems;
    }
  } else {
    if (isProviderRoute) {
      navItems = providerNavItems;
    } else {
      navItems = defaultNavItems;
    }
  }
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/messages')
    return (
      location.pathname === '/messages' ||
      location.pathname.startsWith('/messages/'));

    return location.pathname.startsWith(path);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-900 via-slate-900/95' : 'from-white via-white/95'} to-transparent h-32 -z-10 pointer-events-none`}>
      </div>

      {/* Main nav bar */}
      <div
        className={`relative backdrop-blur-xl border-t ${isDark ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

        {/* Scrollable container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center min-w-max px-4 py-2 md:justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'logout') logout();
                    navigate(item.path);
                  }}
                  className="relative group flex flex-col items-center gap-1 py-2 px-3 md:px-4 min-w-[60px] md:min-w-[70px]">
                  
                  {/* Active indicator */}
                  {active &&
                  <>
                      <div
                      className={`absolute -top-[2px] left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r ${item.gradient}`}>
                    </div>
                      <div
                      className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-10 rounded-lg`}>
                    </div>
                    </>
                  }

                  {/* Icon container */}
                  <div className="relative">
                    {active &&
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-lg opacity-50 animate-pulse`}>
                    </div>
                    }
                    <div
                      className={`relative w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${active ? `bg-gradient-to-br ${item.gradient}` : isDark ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                      
                      <Icon
                        className={`h-4 w-4 md:h-5 md:w-5 transition-colors ${active ? 'text-white' : isDark ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-500 group-hover:text-cyan-600'}`} />
                      
                    </div>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] md:text-xs font-medium transition-colors whitespace-nowrap ${active ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-700'}`}>
                    
                    {getLabel(item.labelKey)}
                  </span>

                  {/* Notification badge */}
                  {item.id === 'messages' &&
                  <div
                    className={`absolute top-1 right-1 md:right-2 w-2 h-2 bg-red-500 rounded-full border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}>
                  </div>
                  }
                </button>);

            })}
          </div>
        </div>

        {/* Bottom safe area */}
        <div
          className={`h-safe-area-inset-bottom ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>);

}