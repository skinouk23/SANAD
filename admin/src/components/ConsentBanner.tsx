import React, { useEffect, useState } from 'react';
import { Shield, X, ChevronDown, ChevronUp } from 'lucide-react';
import { consentManager } from '../utils/consent-manager';
import { useTheme } from '../contexts/ThemeContext';
export function ConsentBanner() {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    // Show banner if consent hasn't been given for current policy version
    if (!consentManager.hasConsentBeenGiven()) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  if (!visible) return null;
  const handleAcceptAll = () => {
    consentManager.acceptAll();
    setVisible(false);
  };
  const handleRejectAll = () => {
    consentManager.rejectAll();
    setVisible(false);
  };
  const handleAcceptEssential = () => {
    consentManager.grantConsent('essential', 'explicit');
    setVisible(false);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-safe">
      <div
        className={`max-w-2xl mx-auto backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
        
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3
                className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Protection de vos données 🔒
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                Sanad utilise des cookies et traite vos données conformément au
                RGPD, à la loi INPDP (Tunisie) et aux normes HIPAA pour les
                données de santé.
              </p>
            </div>
          </div>

          {showDetails &&
          <div
            className={`mb-4 p-3 rounded-lg text-xs space-y-2 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  🔧 Essentiels (requis)
                </span>
                <span className="text-green-500 font-medium">
                  Toujours actif
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  📊 Analytiques
                </span>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                  Optionnel
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  🏥 Données de santé (HIPAA)
                </span>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                  Consentement explicite
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  📍 Géolocalisation
                </span>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                  Optionnel
                </span>
              </div>
            </div>
          }

          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-xs font-medium flex items-center gap-1 mb-4 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-500'}`}>
            
            {showDetails ?
            <>
                Masquer les détails <ChevronUp className="h-3 w-3" />
              </> :

            <>
                Voir les détails <ChevronDown className="h-3 w-3" />
              </>
            }
          </button>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
              
              Tout accepter
            </button>
            <button
              onClick={handleAcceptEssential}
              className={`flex-1 py-2.5 px-4 border rounded-lg text-sm font-medium transition-colors ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
              
              Essentiels uniquement
            </button>
            <button
              onClick={handleRejectAll}
              className={`py-2.5 px-4 text-sm font-medium transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
              
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>);

}