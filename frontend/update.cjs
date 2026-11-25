const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/pages/bookings/CyberPharmacyBooking.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. imports
content = content.replace(
  /import \{ useCreateAppointment, useBookingProvider \} from '@\/features\/bookings';/,
  `import { useCreateAppointment, useBookingProvider } from '@/features/bookings';
import { useServiceCatalog } from '@/features/services';`,
);

// 2. remove services array
content = content.replace(
  /\/\/ Services with location availability[\s\S]*?const timeSlots = \[/,
  `const timeSlots = [`,
);

// 3. inside component
content = content.replace(
  /  const \{ t \} = useLanguage\(\);/,
  `  const { t } = useLanguage();
  const { items: providerServices, loading: servicesLoading } = useServiceCatalog({
    providerId: providerId,
    limit: 50,
  });`,
);

// 4. getSelectedService
content = content.replace(
  /  const getSelectedService = useCallback\(\s*\(\) => services\.find\(\(s\) => s\.id === selectedService\),\s*\[selectedService\],\s*\);/,
  `  const getSelectedService = useCallback(
    () => providerServices.find((s) => s.id === selectedService),
    [selectedService, providerServices],
  );`,
);

// 5. getLocationBadge
content = content.replace(
  /  const getLocationBadge = \(locationType: 'domicile' \| 'pharmacie' \| 'both'\) => \{/,
  `  const getServiceLocation = (service: any) => {
    return service.serviceLocation || service.locationType || 'both';
  };

  const getLocationBadge = (locationType: string) => {`,
);

// 6. needsLocationSelection
content = content.replace(
  /  const needsLocationSelection = \(\) => \{\s*const service = getSelectedService\(\);\s*return service && service\.locationType === 'both';\s*\};/,
  `  const needsLocationSelection = () => {
    const service = getSelectedService();
    return service ? getServiceLocation(service) === 'both' : false;
  };`,
);

// 7. handleNext
content = content.replace(
  /    if \(step === 1 && service\) \{\s*if \(service\.locationType === 'domicile'\) \{\s*setSelectedLocation\('domicile'\);\s*\} else if \(service\.locationType === 'pharmacie'\) \{\s*setSelectedLocation\('pharmacie'\);\s*\}\s*\}/,
  `    if (step === 1 && service) {
      const loc = getServiceLocation(service);
      if (loc === 'domicile') {
        setSelectedLocation('domicile');
      } else if (loc === 'pharmacie') {
        setSelectedLocation('pharmacie');
      }
    }`,
);

// 8. getServicePrice
content = content.replace(
  /  const getServicePrice = \(\) => \{\s*const service = getSelectedService\(\);\s*if \(\!service\) return 0;\s*const price = parseInt\(service\.price\.replace\(\/\\D\/g, ''\)\);\s*return isNaN\(price\) \? 0 : price;\s*\};/,
  `  const getServicePrice = () => {
    const service = getSelectedService();
    if (!service) return 0;
    if (typeof service.price === 'number') return service.price;
    const price = parseInt(String(service.price).replace(/\\D/g, ''));
    return isNaN(price) ? 0 : price;
  };`,
);

// 9. loading check
content = content.replace(
  /  if \(providerLoading\) \{/,
  `  if (providerLoading || servicesLoading) {`,
);

// 10. mapping services
content = content.replace(
  /              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">[\s\S]*?<\/div>\s*<\/div>\s*\)\}/,
  `              {providerServices.length === 0 ? (
                <div className={\`col-span-full p-6 rounded-xl border text-center \${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}\`}>
                  <p className={\`text-sm \${isDark ? 'text-slate-400' : 'text-slate-600'}\`}>
                    {t.bookingFlow.noServicesAvailable || "Aucun service n'est disponible pour le moment."}
                  </p>
                </div>
              ) : (
              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
                {providerServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={\`text-left p-4 rounded-xl border transition-all \${selectedService === service.id ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' : isDark ? 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50' : 'border-slate-200 hover:border-emerald-500/50 hover:bg-slate-50'}\`}
                  >
                    <div className=\"flex justify-between items-start mb-2\">
                      <span className={\`font-bold \${isDark ? 'text-white' : 'text-slate-900'}\`}>
                        {service.name}
                      </span>
                      <span
                        className={\`text-sm font-semibold whitespace-nowrap \${isDark ? 'text-emerald-400' : 'text-emerald-600'}\`}
                      >
                        {service.price} {service.currency ?? 'TND'}
                      </span>
                    </div>
                    <p className={\`text-xs mb-2 \${isDark ? 'text-slate-400' : 'text-slate-500'}\`}>
                      {service.shortDescription || (service as any).description}
                    </p>
                    <div className=\"flex items-center justify-between\">
                      <div className=\"flex items-center gap-1 text-xs text-slate-500\">
                        <Clock className=\"h-3 w-3\" />
                        <span>{(service as any).durationMinutes ? \`\${(service as any).durationMinutes} min\` : 'N/A'}</span>
                      </div>
                      {getLocationBadge(getServiceLocation(service))}
                    </div>
                  </button>
                ))}
              </div>
              )}
            </div>
          )}`,
);

// 11. requiresPrescription
content = content.replace(
  /\{getSelectedService\(\)\?\.requiresPrescription && \(/,
  `{((getSelectedService() as any)?.requiresPrescription) && (`,
);

fs.writeFileSync(file, content, 'utf8');
console.log('Update complete');
