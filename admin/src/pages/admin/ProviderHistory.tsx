import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Star,
  CreditCard,
  Banknote,
  Smartphone,
  Activity,
  User,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Timer,
  Wallet,
  MessageSquare } from
'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { DetailDrawer } from '../../components/admin/shared/DetailDrawer';
import {
  mockProviders,
  mockProviderBookings } from
'../../data/mock/adminMockData';
import { ProviderBooking } from '../../types/admin.types';
export function ProviderHistory() {
  const { providerId } = useParams<{
    providerId: string;
  }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedBooking, setSelectedBooking] =
  useState<ProviderBooking | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const provider = useMemo(
    () => mockProviders.find((p) => p.id === providerId),
    [providerId]
  );
  const filteredData = useMemo(() => {
    return mockProviderBookings.
    filter((b) => {
      if (b.providerId !== providerId) return false;
      const matchesSearch =
      b.patientName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? b.status === statusFilter : true;
      const matchesPayment = paymentFilter ?
      b.paymentMethod === paymentFilter :
      true;
      return matchesSearch && matchesStatus && matchesPayment;
    }).
    sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [providerId, search, statusFilter, paymentFilter]);
  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Professionnel introuvable
        </p>
        <button
          onClick={() => navigate('/admin/professionals')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
          
          <ArrowLeft className="w-4 h-4" /> Retour aux professionnels
        </button>
      </div>);

  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            <CheckCircle2 className="w-3 h-3" /> Confirmé
          </span>);

      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" /> Terminé
          </span>);

      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
            <XCircle className="w-3 h-3" /> Annulé
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <Timer className="w-3 h-3" /> En attente
          </span>);

      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
            <Activity className="w-3 h-3" /> En cours
          </span>);

      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <AlertCircle className="w-3 h-3" /> Absent
          </span>);

      default:
        return null;
    }
  };
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-3 h-3" />;
      case 'cash':
        return <Banknote className="w-3 h-3" />;
      case 'd17':
      case 'flouci':
        return <Smartphone className="w-3 h-3" />;
      default:
        return <CreditCard className="w-3 h-3" />;
    }
  };
  const columns = [
  {
    header: 'Date & Heure',
    accessor: (row: ProviderBooking) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {new Date(row.date).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-xs text-slate-500">{row.time}</div>
        </div>,

    sortable: true,
    sortKey: 'date'
  },
  {
    header: 'Patient',
    accessor: (row: ProviderBooking) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {row.patientName}
          </div>
          <div className="text-xs text-slate-500">{row.patientPhone}</div>
        </div>,

    sortable: true,
    sortKey: 'patientName',
    filterable: true,
    filterKey: 'patientName'
  },
  {
    header: 'Service',
    accessor: (row: ProviderBooking) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {row.serviceName}
          </div>
          <div className="text-xs text-slate-500">{row.duration} min</div>
        </div>,

    sortable: true,
    sortKey: 'serviceName',
    filterable: true,
    filterKey: 'serviceName'
  },
  {
    header: 'Montant',
    accessor: (row: ProviderBooking) =>
    <span className="font-medium">{row.amount} TND</span>,

    sortable: true,
    sortKey: 'amount'
  },
  {
    header: 'Paiement',
    accessor: (row: ProviderBooking) =>
    <div className="flex items-center gap-1.5">
          {row.paymentMethod === 'card' ?
      <CreditCard className="w-4 h-4 text-slate-400" /> :
      row.paymentMethod === 'cash' ?
      <Banknote className="w-4 h-4 text-slate-400" /> :

      <Smartphone className="w-4 h-4 text-slate-400" />
      }
          <span className="text-sm capitalize">
            {row.paymentMethod === 'card' ?
        'Carte' :
        row.paymentMethod === 'cash' ?
        'Espèces' :
        'Mobile'}
          </span>
        </div>,

    sortable: true,
    sortKey: 'paymentMethod',
    filterable: true,
    filterKey: 'paymentMethod'
  },
  {
    header: 'Statut',
    accessor: (row: ProviderBooking) => getStatusBadge(row.status),
    sortable: true,
    sortKey: 'status',
    filterable: true,
    filterKey: 'status'
  }];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/professionals')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Retour">
              
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-lg font-bold text-teal-700 dark:text-teal-300">
              {provider.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Historique: {provider.name}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {provider.email}
                </span>
                <span className="flex items-center gap-1 capitalize">
                  <Activity className="w-3 h-3" /> {provider.serviceType}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {provider.city}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${provider.subscriptionPlan === 'commission' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' : provider.subscriptionPlan === 'elite' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'}`}>
            
            {provider.subscriptionPlan === 'commission' ?
            'Commission' :
            provider.subscriptionPlan === 'elite' ?
            'Élite' :
            'Abonnement'}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Total Réservations
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {provider.bookingsCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Revenus Générés
            </p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {provider.revenueGenerated.toLocaleString()} TND
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Commission Totale
            </p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {provider.subscriptionPlan === 'commission' ?
              Math.round(provider.revenueGenerated * 0.15).toLocaleString() :
              '0'}{' '}
              TND
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Taux d'Annulation
            </p>
            <p
              className={`text-lg font-bold ${provider.cancellationRate < 5 ? 'text-emerald-600 dark:text-emerald-400' : provider.cancellationRate < 15 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              
              {provider.cancellationRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Note Moyenne
            </p>
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {provider.rating.toFixed(1)}
              </p>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher par patient ou service..."
        filters={[
        {
          id: 'status',
          label: 'Tous les statuts',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
          {
            label: 'Confirmé',
            value: 'confirmed'
          },
          {
            label: 'Terminé',
            value: 'completed'
          },
          {
            label: 'Annulé',
            value: 'cancelled'
          },
          {
            label: 'En attente',
            value: 'pending'
          },
          {
            label: 'En cours',
            value: 'in_progress'
          },
          {
            label: 'Non présenté',
            value: 'no_show'
          }]

        },
        {
          id: 'payment',
          label: 'Tous paiements',
          value: paymentFilter,
          onChange: setPaymentFilter,
          options: [
          {
            label: 'Carte Bancaire',
            value: 'card'
          },
          {
            label: 'Espèces',
            value: 'cash'
          },
          {
            label: 'D17',
            value: 'd17'
          },
          {
            label: 'Flouci',
            value: 'flouci'
          }]

        }]
        } />
      

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(row) => row.id}
        onRowClick={setSelectedBooking}
        exportConfig={{
          fileName: `Historique_${provider?.name?.replace(/\s+/g, '_') || 'Provider'}`,
          columns: [
          {
            header: 'Date',
            key: 'date',
            transform: (v: string) => new Date(v).toLocaleDateString('fr-FR')
          },
          {
            header: 'Heure',
            key: 'time'
          },
          {
            header: 'Patient',
            key: 'patientName'
          },
          {
            header: 'Téléphone Patient',
            key: 'patientPhone'
          },
          {
            header: 'Service',
            key: 'serviceName'
          },
          {
            header: 'Durée (min)',
            key: 'duration'
          },
          {
            header: 'Montant (TND)',
            key: 'amount'
          },
          {
            header: 'Paiement',
            key: 'paymentMethod'
          },
          {
            header: 'Statut',
            key: 'status'
          }]

        }} />
      

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Détails de la Réservation">
        
        {selectedBooking &&
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedBooking.serviceName}
                </h3>
                <p className="text-sm text-slate-500 uppercase tracking-wider mt-1">
                  {selectedBooking.serviceType}
                </p>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            {/* Date & Time */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {new Date(selectedBooking.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" /> {selectedBooking.time} -{' '}
                  {selectedBooking.endTime}
                </p>
              </div>
            </div>

            {/* Patient Info */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Informations Patient
              </h4>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Nom Complet</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedBooking.patientName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Téléphone</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedBooking.patientPhone}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">
                    Adresse d'intervention
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    {selectedBooking.address}, {selectedBooking.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Financials */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-slate-400" />
                Détails Financiers
              </h4>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Montant Total</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedBooking.amount} TND
                  </span>
                </div>
                {selectedBooking.commission > 0 &&
              <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                      Commission (15%)
                    </span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      -{selectedBooking.commission} TND
                    </span>
                  </div>
              }
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Montant Net Professionnel
                  </span>
                  <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                    {selectedBooking.netAmount} TND
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-500">
                    Méthode de Paiement
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    {getPaymentIcon(selectedBooking.paymentMethod)}
                    {selectedBooking.paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            {/* Review & Notes */}
            {(selectedBooking.patientRating ||
          selectedBooking.cancellationReason ||
          selectedBooking.notes) &&
          <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  Retours & Notes
                </h4>
                <div className="space-y-3">
                  {selectedBooking.patientRating &&
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({
                    length: 5
                  }).map((_, i) =>
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < selectedBooking.patientRating! ? 'text-amber-400 fill-amber-400' : 'text-amber-200 dark:text-amber-900'}`} />

                  )}
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 ml-2">
                          {selectedBooking.patientRating}/5
                        </span>
                      </div>
                      {selectedBooking.patientReview &&
                <p className="text-sm text-amber-800 dark:text-amber-300 italic">
                          "{selectedBooking.patientReview}"
                        </p>
                }
                    </div>
              }

                  {selectedBooking.cancellationReason &&
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/40">
                      <p className="text-xs font-semibold text-red-800 dark:text-red-400 mb-1">
                        Raison d'annulation
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {selectedBooking.cancellationReason}
                      </p>
                    </div>
              }

                  {selectedBooking.notes &&
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Notes Administratives
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedBooking.notes}
                      </p>
                    </div>
              }
                </div>
              </div>
          }
          </div>
        }
      </DetailDrawer>
    </div>);

}