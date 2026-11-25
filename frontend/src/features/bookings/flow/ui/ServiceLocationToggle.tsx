import { Building2, Home } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import type { ServiceLocation } from '@/features/bookings/hooks/useServiceLocationChoice';

interface ServiceLocationToggleProps {
  selectedLocation: ServiceLocation;
  onLocationChange: (location: ServiceLocation) => void;
}

export function ServiceLocationToggle({
  selectedLocation,
  onLocationChange,
}: ServiceLocationToggleProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t.bookingFlow.chooseServiceLocation}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          aria-pressed={selectedLocation === 'provider_site'}
          onClick={() => onLocationChange('provider_site')}
          className={`rounded-xl border-2 p-6 text-left transition-colors ${selectedLocation === 'provider_site' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-border/80 hover:bg-accent/40'}`}
        >
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${selectedLocation === 'provider_site' ? 'bg-primary' : 'bg-muted'}`}
          >
            <Building2
              className={`h-7 w-7 ${selectedLocation === 'provider_site' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
            />
          </div>
          <h3 className="mb-1 text-lg font-bold text-foreground">{t.bookingFlow.atProviderSite}</h3>
          <p className="text-sm text-muted-foreground">{t.bookingFlow.providerSiteDesc}</p>
        </button>

        <button
          type="button"
          aria-pressed={selectedLocation === 'home'}
          onClick={() => onLocationChange('home')}
          className={`rounded-xl border-2 p-6 text-left transition-colors ${selectedLocation === 'home' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-border/80 hover:bg-accent/40'}`}
        >
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${selectedLocation === 'home' ? 'bg-primary' : 'bg-muted'}`}
          >
            <Home
              className={`h-7 w-7 ${selectedLocation === 'home' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
            />
          </div>
          <h3 className="mb-1 text-lg font-bold text-foreground">{t.bookingFlow.atHome}</h3>
          <p className="text-sm text-muted-foreground">{t.bookingFlow.homeServiceDesc}</p>
        </button>
      </div>
    </div>
  );
}
