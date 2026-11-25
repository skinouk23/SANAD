const SANAD_LOGO_URL = '/logosanad.png';

interface SanadBrandBadgeProps {
  label?: string;
}

export function SanadBrandBadge({ label = 'Sanad' }: SanadBrandBadgeProps) {
  return (
    <div className="relative mx-auto mb-3 h-12 w-24">
      <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 opacity-40 blur-md" />
      <div className="relative flex h-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 px-3 py-1.5 text-white">
        <img src={SANAD_LOGO_URL} alt="" aria-hidden="true" className="h-8 w-auto object-contain" />

        <span className="text-base font-bold">{label}</span>
      </div>
    </div>
  );
}
