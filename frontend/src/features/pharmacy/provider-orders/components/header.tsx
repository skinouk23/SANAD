import { Filter } from 'lucide-react';

import { Button } from '@/shared/ui/primitives/button';

import { ORDER_TABS } from './constants';
import type { ProviderPharmacyOrderTab } from '@/features/pharmacy/provider-orders/providerPharmacyOrders.hooks';

export function ProviderPharmacyOrdersHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: ProviderPharmacyOrderTab;
  onTabChange: (tab: ProviderPharmacyOrderTab) => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Commandes medicaments</h1>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
