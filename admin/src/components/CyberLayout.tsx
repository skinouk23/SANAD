import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { CyberBottomNav } from './CyberBottomNav';
import { ChatbotAssistant } from './ChatbotAssistant';
import { VoiceAssistant } from './VoiceAssistant';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
interface CyberLayoutProps {
  children: React.ReactNode;
}
export function CyberLayout({ children }: CyberLayoutProps) {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Define dashboard paths (pages that should NOT show back button)
  const dashboardPaths = [
  '/',
  '/provider-dashboard',
  '/patient-dashboard',
  '/services',
  '/auth/login',
  '/auth/signup',
  '/auth/onboarding'];

  // Define provider sub-pages (pages that navigate back to provider dashboard)
  const isProviderSubPage =
  location.pathname.startsWith('/provider/') ||
  location.pathname.startsWith('/provider') &&
  location.pathname !== '/provider-dashboard';
  // Define patient sub-pages (pages that navigate back to patient dashboard or services)
  const patientSubPagePrefixes = [
  '/equipment/',
  '/laboratory',
  '/radiology',
  '/pharmacy',
  '/ambulance',
  '/care',
  '/nutrition',
  '/gym',
  '/funeral',
  '/messages/',
  '/mon-espace',
  '/medicaments',
  '/aide',
  '/how-it-works',
  '/subscriptions',
  '/booking',
  '/tracking',
  '/health',
  '/concierge',
  '/profile'];

  const isPatientSubPage = patientSubPagePrefixes.some(
    (prefix) =>
    location.pathname.startsWith(prefix) ||
    location.pathname === prefix.replace('/', '')
  );
  // Determine if we should show back button
  const showBackButton =
  !dashboardPaths.includes(location.pathname) && (
  isProviderSubPage || isPatientSubPage);
  const handleBack = () => {
    if (isProviderSubPage) {
      navigate('/provider-dashboard');
    } else if (isPatientSubPage) {
      // For patient pages, go back in history or to patient dashboard
      navigate(-1);
    } else {
      navigate(-1);
    }
  };
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.
    split(' ').
    map((n) => n[0]).
    join('').
    substring(0, 2).
    toUpperCase();
  };
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      {/* Animated Background Grid */}
      <div
        className={`fixed inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none`}>
      </div>

      {/* Glowing Orbs */}
      <div
        className={`fixed top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/5'} rounded-full blur-3xl animate-pulse pointer-events-none`}>
      </div>
      <div
        className={`fixed bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none`}>
      </div>

      {/* Top Header Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center">
            {
            showBackButton ?
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
              
                  <ArrowLeft className="h-5 w-5" />
                </button> :

            <div className="w-9" />
            // Spacer to maintain layout
            }
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LanguageSelector />

            {/* User Avatar / Profile Link */}
            {isAuthenticated ?
            <button
              onClick={() => navigate('/profile')}
              className="ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              title="Mon Profil">
              
                {getInitials(user?.name || '')}
              </button> :

            <button
              onClick={() => navigate('/auth/login')}
              className={`ml-1 p-1.5 rounded-full transition-colors ${isDark ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'}`}
              title="Se connecter">
              
                <User className="h-4 w-4" />
              </button>
            }
          </div>
        </div>
      </div>

      {/* Main Content - Added pt-16 to account for fixed header */}
      <main className="relative z-10 pb-24 pt-16">{children}</main>

      {/* Chatbot Assistant */}
      <ChatbotAssistant />

      {/* Voice Assistant for elderly patients */}
      <VoiceAssistant />

      {/* Bottom Navigation */}
      <CyberBottomNav />
    </div>);

}