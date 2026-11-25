import { Eye, FileText, Pill, Truck } from 'lucide-react';

import type { ProviderPharmacyOrder } from '@/features/pharmacy';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Button } from '@/shared/ui/primitives/button';

import { getStatusBadge, ORDER_TABS } from './constants';
import type { ProviderPharmacyOrderTab } from '@/features/pharmacy/provider-orders/providerPharmacyOrders.hooks';

export function ProviderPharmacyOrdersGrid({
  activeTab,
  orders,
  onStartDelivery,
  onViewPrescription,
}: {
  activeTab: ProviderPharmacyOrderTab;
  orders: ProviderPharmacyOrder[];
  onStartDelivery: (order: ProviderPharmacyOrder) => void;
  onViewPrescription: (order: ProviderPharmacyOrder) => void;
}) {
  if (!orders.length) {
    return (
      <EmptyState
        className="rounded-2xl border-border bg-card/80 shadow-sm"
        icon={<Pill className="h-8 w-8 text-primary" />}
        title="Aucune commande active"
        description={`Aucune commande dans l'onglet ${ORDER_TABS.find((tab) => tab.id === activeTab)?.label.toLowerCase()}.`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{order.patientName}</h3>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(order.status)}`}
            >
              {order.id}
            </span>
          </div>

          <div className="mb-4 rounded-lg bg-muted p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Ordonnance</span>
              <button
                type="button"
                onClick={() => onViewPrescription(order)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Eye className="h-3 w-3" />
                Voir
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              {order.items}
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Truck className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{order.address}</span>
            </div>
            {order.amount ? (
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-sm text-muted-foreground">Montant total</span>
                <span className="font-bold text-success">{order.amount} TND</span>
              </div>
            ) : null}
          </div>

          <div className="flex gap-2">
            {order.status === 'pending' ? (
              <Button className="w-full bg-success text-success-foreground hover:bg-success/90">
                Accepter
              </Button>
            ) : null}
            {order.status === 'processing' ? (
              <Button
                onClick={() => onStartDelivery(order)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Truck className="mr-2 h-4 w-4" />
                Lancer livraison
              </Button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
