import { useEffect, useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { consentManager } from '@/utils/consent-manager';
export function ConsentBanner() {
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
    <div className="fixed bottom-[var(--bottom-nav-offset)] left-0 right-0 z-[100] p-4 pb-safe">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground">Protection de vos données 🔒</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Sanad utilise des cookies et traite vos données conformément au RGPD, à la loi INPDP
                (Tunisie) et aux normes HIPAA pour les données de santé.
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="mb-4 space-y-2 rounded-lg bg-muted/40 p-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-foreground">🔧 Essentiels (requis)</span>
                <span className="text-green-500 font-medium">Toujours actif</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">📊 Analytiques</span>
                <span className="text-muted-foreground">Optionnel</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">🏥 Données de santé (HIPAA)</span>
                <span className="text-muted-foreground">Consentement explicite</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">📍 Géolocalisation</span>
                <span className="text-muted-foreground">Optionnel</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mb-4 flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            {showDetails ? (
              <>
                Masquer les détails <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Voir les détails <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAcceptAll}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Tout accepter
            </button>
            <button
              onClick={handleAcceptEssential}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Essentiels uniquement
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
