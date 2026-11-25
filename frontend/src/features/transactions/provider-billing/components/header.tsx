import { Crown, Download, Plus } from 'lucide-react';

import { Button } from '@/shared/ui/primitives/button';

export function BillingPageHeader({
  exportBusy,
  onCreateOperation,
  onExport,
  onExportPreload,
}: {
  exportBusy: boolean;
  onCreateOperation: () => void;
  onExport: () => void;
  onExportPreload: () => void;
}) {
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Facturation & Comptabilité
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Gérez vos finances professionnelles
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              aria-busy={exportBusy || undefined}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={exportBusy}
              onClick={onExport}
              onFocus={onExportPreload}
              onMouseEnter={onExportPreload}
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{exportBusy ? 'Export...' : 'Exporter'}</span>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" onClick={onCreateOperation}>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Nouvelle</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-warning/20 bg-warning/10 p-4 sm:mb-8 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning sm:h-16 sm:w-16 sm:rounded-2xl">
            <Crown className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-base font-bold text-foreground sm:text-xl">
              Facturation et Comptabilité Incluses
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Fonctionnalité exclusive • Conforme aux normes tunisiennes
            </p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-warning px-3 py-1.5 text-xs font-bold text-warning-foreground sm:px-4 sm:py-2 sm:text-sm">
            👑 Elite
          </span>
        </div>
      </div>
    </>
  );
}

export function BillingPeriodSelector({
  period,
  periodLabel,
  onChange,
}: {
  period: 'month' | 'quarter' | 'year';
  periodLabel: string;
  onChange: (period: 'month' | 'quarter' | 'year') => void;
}) {
  const periods: Array<{ key: 'month' | 'quarter' | 'year'; label: string }> = [
    { key: 'month', label: 'Ce mois' },
    { key: 'quarter', label: 'Trimestre' },
    { key: 'year', label: 'Année' },
  ];

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
      <div className="flex w-full items-center gap-2 overflow-x-auto sm:w-auto">
        {periods.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${period === item.key ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">{periodLabel}</div>
    </div>
  );
}
