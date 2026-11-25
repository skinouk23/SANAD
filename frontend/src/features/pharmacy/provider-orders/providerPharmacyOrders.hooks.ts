import { useMemo, useState } from 'react';

import { usePharmacyOrdersList, type ProviderPharmacyOrder } from '@/features/pharmacy';

export type ProviderPharmacyOrderTab = 'pending' | 'processing' | 'delivery' | 'completed';

export function useProviderPharmacyOrdersScreen() {
  const [activeTab, setActiveTab] = useState<ProviderPharmacyOrderTab>('pending');
  const [selectedOrder, setSelectedOrder] = useState<ProviderPharmacyOrder | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryAmount, setDeliveryAmount] = useState('');

  const ordersQuery = usePharmacyOrdersList();

  const filteredOrders = useMemo(
    () => (ordersQuery.data ?? []).filter((order) => order.status === activeTab),
    [activeTab, ordersQuery.data],
  );

  const openPrescription = (order: ProviderPharmacyOrder) => {
    setSelectedOrder(order);
    setShowPrescriptionModal(true);
  };

  const openDeliveryModal = (order: ProviderPharmacyOrder) => {
    setSelectedOrder(order);
    setDeliveryAmount(order.amount ?? '');
    setShowDeliveryModal(true);
  };

  const closePrescription = () => {
    setShowPrescriptionModal(false);
    setSelectedOrder(null);
  };

  const closeDelivery = () => {
    setShowDeliveryModal(false);
    setSelectedOrder(null);
    setDeliveryAmount('');
  };

  return {
    activeTab,
    closeDelivery,
    closePrescription,
    deliveryAmount,
    error: ordersQuery.error,
    filteredOrders,
    loading: ordersQuery.loading,
    openDeliveryModal,
    openPrescription,
    orders: ordersQuery.data ?? [],
    refetch: () => void ordersQuery.refetch(),
    selectedOrder,
    setActiveTab,
    setDeliveryAmount,
    showDeliveryModal,
    showPrescriptionModal,
  };
}
