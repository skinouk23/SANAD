import { AlertCircle, CheckCircle, Clock, Truck } from 'lucide-react';

import type { ProviderPharmacyOrderTab } from '@/features/pharmacy/provider-orders/providerPharmacyOrders.hooks';

export const ORDER_TABS: Array<{
  id: ProviderPharmacyOrderTab;
  label: string;
  icon: typeof AlertCircle;
}> = [
  { id: 'pending', label: 'En attente', icon: AlertCircle },
  { id: 'processing', label: 'En preparation', icon: Clock },
  { id: 'delivery', label: 'En livraison', icon: Truck },
  { id: 'completed', label: 'Livrees', icon: CheckCircle },
];

export function getStatusBadge(status: string) {
  if (status === 'pending') {
    return 'border border-warning/20 bg-warning/10 text-warning';
  }
  if (status === 'processing') {
    return 'border border-primary/20 bg-primary/10 text-primary';
  }
  if (status === 'delivery') {
    return 'border border-primary/20 bg-primary/10 text-primary';
  }
  return 'border border-success/20 bg-success/10 text-success';
}
