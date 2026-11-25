import React, { useState } from 'react';
import {
  Pill,
  Clock,
  Truck,
  CheckCircle,
  FileText,
  ChevronRight,
  Search,
  AlertCircle,
  Loader2 } from
'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { usePharmacyOrders, usePharmacyOrderStats } from '../hooks/usePharmacy';
export function CyberPatientMedicaments() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const { data: requests, loading: ordersLoading } = usePharmacyOrders();
  const { data: stats, loading: statsLoading } = usePharmacyOrderStats();
  const loading = ordersLoading || statsLoading;
  const requestsData = [
  {
    id: 'REQ-001',
    pharmacyName: 'Pharmacie Centrale',
    date: "Aujourd'hui, 10:30",
    status: 'delivery',
    amount: '45.500',
    items: 'Doliprane, Vitamine C, Antibiotique',
    prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx'
  },
  {
    id: 'REQ-002',
    pharmacyName: 'Pharmacie El Manar',
    date: 'Hier, 14:15',
    status: 'processing',
    items: 'Sirop toux, Pastilles',
    prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx'
  },
  {
    id: 'REQ-003',
    pharmacyName: 'Pharmacie Les Berges',
    date: '25 Jan, 09:00',
    status: 'completed',
    amount: '12.800',
    items: 'Bandes, Antiseptique',
    prescriptionPreview: 'https://placehold.co/100x100/png?text=Rx'
  }];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            En attente
          </span>);

      case 'processing':
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
            En préparation
          </span>);

      case 'delivery':
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
            En livraison
          </span>);

      case 'completed':
        return (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-500 border border-green-500/20">
            Livré
          </span>);

      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen pb-12">
      {/* WOW Header */}
      <div
        className={`sticky top-0 z-10 border-b backdrop-blur-sm ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative rounded-[14px] p-[2px] overflow-hidden">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div
              className={`relative rounded-[12px] px-4 py-3 backdrop-blur-xl ${isDark ? 'bg-slate-900/95' : 'bg-white/95'}`}>
              
              <h1
                className={`text-lg font-bold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                Mes Médicaments
              </h1>
              <p
                className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                Suivez vos commandes et ordonnances
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => navigate('/pharmacy')}
            className={`p-3 rounded-xl border text-left transition-all ${isDark ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}>
            
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-2">
              <Pill className="h-4 w-4" />
            </div>
            <h3
              className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              Nouvelle commande
            </h3>
            <p
              className={`text-[10px] mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              
              Envoyer une ordonnance
            </p>
          </button>
          <div
            className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mb-2">
              <Truck className="h-4 w-4" />
            </div>
            <h3
              className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              En cours
            </h3>
            <p
              className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
              {stats?.activeCount ?? 0} commandes actives
            </p>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-2">
          <h2
            className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            Historique des commandes
          </h2>
          {loading ?
          <div className="flex items-center justify-center py-6">
              <Loader2
              className={`h-8 w-8 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            
            </div> :

          (requests || []).map((request) =>
          <div
            key={request.id}
            className={`border rounded-xl p-3 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            
                <div className="flex justify-end mb-2">
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex gap-3">
                  <div
                className={`w-12 h-12 rounded-lg flex-shrink-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                  className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                      {request.pharmacyName}
                    </h3>
                    <p
                  className={`text-[10px] mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                      {request.date}
                    </p>
                    <p
                  className={`text-xs mb-2 line-clamp-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  
                      {request.items}
                    </p>
                    {request.status === 'delivery' &&
                <div
                  className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'}`}>
                  
                        <div className="flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5 text-emerald-500" />
                          <span
                      className={`text-[10px] font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      
                            Montant à payer
                          </span>
                        </div>
                        <span
                    className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                          {request.amount} TND
                        </span>
                      </div>
                }
                  </div>
                </div>
              </div>
          )
          }
        </div>
      </div>
    </div>);

}