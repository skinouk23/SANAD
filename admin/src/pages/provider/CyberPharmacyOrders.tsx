import React, { useState } from 'react';
import {
  Filter,
  Eye,
  Truck,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  X,
  Pill } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/Button';
import { usePharmacyOrdersList } from '../../hooks/usePharmacyOrders';
export function CyberPharmacyOrders() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'pending' | 'processing' | 'delivery' | 'completed'>(
    'pending');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryAmount, setDeliveryAmount] = useState('');
  // Hook-based data fetching
  const { data: orders } = usePharmacyOrdersList();
  const filteredOrders = (orders ?? []).filter(
    (order) => order.status === activeTab
  );
  const handleViewPrescription = (order: any) => {
    setSelectedOrder(order);
    setShowPrescriptionModal(true);
  };
  const handleStartDelivery = (order: any) => {
    setSelectedOrder(order);
    setShowDeliveryModal(true);
  };
  const confirmDelivery = () => {
    // Logic to update order status and save amount/invoice
    setShowDeliveryModal(false);
    // Refresh orders...
  };
  return (
    <div className="min-h-screen pb-20">
      <div
        className={`sticky top-0 z-10 border-b backdrop-blur-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Commandes Médicaments
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
            {
              id: 'pending',
              label: 'En attente',
              icon: AlertCircle
            },
            {
              id: 'processing',
              label: 'En préparation',
              icon: Clock
            },
            {
              id: 'delivery',
              label: 'En livraison',
              icon: Truck
            },
            {
              id: 'completed',
              label: 'Livrées',
              icon: CheckCircle
            }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
              
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) =>
          <div
            key={order.id}
            className={`border rounded-xl p-6 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                  
                    <Pill className="h-5 w-5" />
                  </div>
                  <div>
                    <h3
                    className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                      {order.patientName}
                    </h3>
                    <p
                    className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                      {order.date}
                    </p>
                  </div>
                </div>
                <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : order.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : order.status === 'delivery' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                
                  {order.id}
                </span>
              </div>

              <div
              className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              
                <div className="flex items-center justify-between mb-2">
                  <span
                  className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  
                    Ordonnance
                  </span>
                  <button
                  onClick={() => handleViewPrescription(order)}
                  className="text-xs text-emerald-500 hover:underline flex items-center gap-1">
                  
                    <Eye className="h-3 w-3" />
                    Voir
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileText className="h-3 w-3" />
                  {order.items}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2 text-sm text-slate-500">
                  <Truck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{order.address}</span>
                </div>
                {order.amount &&
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-500">
                      Montant total
                    </span>
                    <span
                  className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  
                      {order.amount} TND
                    </span>
                  </div>
              }
              </div>

              <div className="flex gap-2">
                {order.status === 'pending' &&
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Accepter
                  </Button>
              }
                {order.status === 'processing' &&
              <Button
                onClick={() => handleStartDelivery(order)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                
                    <Truck className="h-4 w-4 mr-2" />
                    Lancer livraison
                  </Button>
              }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedOrder &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
          className={`relative w-full max-w-2xl rounded-2xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3
              className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Ordonnance - {selectedOrder.patientName}
              </h3>
              <button
              onClick={() => setShowPrescriptionModal(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
              
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-900 flex justify-center">
              <img
              src={selectedOrder.prescriptionUrl}
              alt="Ordonnance"
              className="max-h-[70vh] object-contain rounded shadow-lg" />
            
            </div>
          </div>
        </div>
      }

      {/* Delivery Modal */}
      {showDeliveryModal && selectedOrder &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
          className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          
            <h3
            className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
              Préparer la livraison
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Montant total des médicaments (TND)
                </label>
                <input
                type="number"
                value={deliveryAmount}
                onChange={(e) => setDeliveryAmount(e.target.value)}
                placeholder="0.000"
                className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Facture / Ticket de caisse
                </label>
                <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                
                  <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-500">
                    Cliquez pour ajouter une photo
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeliveryModal(false)}>
              
                Annuler
              </Button>
              <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={confirmDelivery}>
              
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}