import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Ban,
  ShieldAlert,
  Mail,
  Calendar,
  Clock,
  Activity,
  CheckCircle } from
'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { StatusBadge } from '../../components/admin/shared/StatusBadge';
import { DetailDrawer } from '../../components/admin/shared/DetailDrawer';
import { Modal } from '../../components/admin/shared/Modal';
import { mockProviders, mockSettings } from '../../data/mock/adminMockData';
import { AdminProvider } from '../../types/admin.types';
export function CancellationManagement() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  // State for actions
  const [providers, setProviders] = useState(mockProviders);
  const [selectedProvider, setSelectedProvider] =
  useState<AdminProvider | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Modals state
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [actionProvider, setActionProvider] = useState<AdminProvider | null>(
    null
  );
  // Get settings
  const { warningThreshold, blockThreshold, suspensionPeriodDays } =
  mockSettings.cancellations;
  // Sort providers by cancellation rate descending
  const sortedProviders = useMemo(() => {
    return [...providers].
    filter((p) => p.totalCancellations > 0).
    sort((a, b) => b.cancellationRate - a.cancellationRate).
    filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, providers]);
  const getCancellationStatus = (rate: number, currentStatus: string) => {
    if (currentStatus === 'suspended' || currentStatus === 'blocked')
    return currentStatus;
    if (rate > blockThreshold) return 'blocked';
    if (rate > warningThreshold) return 'warning';
    return 'normal';
  };
  const handleSendWarning = () => {
    if (actionProvider) {
      // In a real app, this would call an API to send an email/notification
      // For now, we just close the modal
      setIsWarningModalOpen(false);
      setActionProvider(null);
    }
  };
  const handleBlockProvider = () => {
    if (actionProvider) {
      setProviders((prev) =>
      prev.map((p) =>
      p.id === actionProvider.id ?
      {
        ...p,
        status: 'suspended'
      } :
      p
      )
      );
      setIsBlockModalOpen(false);
      setActionProvider(null);
      // If the blocked provider is currently open in the drawer, update it
      if (selectedProvider?.id === actionProvider.id) {
        setSelectedProvider({
          ...actionProvider,
          status: 'suspended'
        });
      }
    }
  };
  const columns = [
  {
    header: 'Professionnel',
    accessor: (row: AdminProvider) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {row.name}
          </div>
          <div className="text-xs text-slate-500 capitalize">
            {row.serviceType}
          </div>
        </div>,

    sortable: true,
    sortKey: 'name',
    filterable: true,
    filterKey: 'name'
  },
  {
    header: 'Taux Annulation',
    accessor: (row: AdminProvider) =>
    <div className="flex items-center gap-2">
          <span
        className={`font-bold ${row.cancellationRate > blockThreshold ? 'text-red-600 dark:text-red-400' : row.cancellationRate > warningThreshold ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
        
            {row.cancellationRate.toFixed(1)}%
          </span>
          {row.cancellationRate > blockThreshold &&
      <AlertTriangle className="w-4 h-4 text-red-500" />
      }
        </div>,

    sortable: true,
    sortKey: 'cancellationRate'
  },
  {
    header: 'Total Annulations',
    accessor: (row: AdminProvider) =>
    <span className="font-medium">{row.totalCancellations}</span>,

    sortable: true,
    sortKey: 'totalCancellations'
  },
  {
    header: 'Réservations',
    accessor: 'bookingsCount',
    sortable: true
  },
  {
    header: 'Statut Compte',
    accessor: (row: AdminProvider) => <StatusBadge status={row.status} />,
    sortable: true,
    sortKey: 'status',
    filterable: true,
    filterKey: 'status'
  },
  {
    header: 'Actions',
    accessor: (row: AdminProvider) => {
      const status = getCancellationStatus(row.cancellationRate, row.status);
      return (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}>
          
            <button
            onClick={() => {
              setActionProvider(row);
              setIsWarningModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded transition-colors"
            title="Envoyer un Avertissement">
            
              <AlertTriangle className="w-4 h-4" />
            </button>
            {status !== 'blocked' && status !== 'suspended' &&
          <button
            onClick={() => {
              setActionProvider(row);
              setIsBlockModalOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
            title="Suspendre le Professionnel">
            
                <Ban className="w-4 h-4" />
              </button>
          }
          </div>);

    }
  }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestion des Annulations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Surveiller et gérer les professionnels ayant des taux d'annulation
          excessifs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            Taux Moyen Plateforme
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            4.2%
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30 shadow-sm">
          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-500 mb-1">
            À Risque (&gt;{warningThreshold}%)
          </h3>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-400">
            {
            sortedProviders.filter(
              (p) =>
              p.cancellationRate > warningThreshold &&
              p.cancellationRate <= blockThreshold
            ).length
            }
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-900/30 shadow-sm">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-500 mb-1">
            À Suspendre (&gt;{blockThreshold}%)
          </h3>
          <p className="text-2xl font-bold text-red-900 dark:text-red-400">
            {
            sortedProviders.filter((p) => p.cancellationRate > blockThreshold).
            length
            }
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm mb-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Règles de la Politique d'Annulation
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Les professionnels dépassant un taux d'annulation de{' '}
              <span className="font-bold">{warningThreshold}%</span> reçoivent
              un avertissement. Ceux dépassant{' '}
              <span className="font-bold">{blockThreshold}%</span> peuvent être
              suspendus pour une durée de{' '}
              <span className="font-bold">{suspensionPeriodDays} jours</span>.
            </p>
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher un professionnel..." />
      

      <DataTable
        columns={columns}
        data={sortedProviders}
        keyExtractor={(row) => row.id}
        onRowClick={(row) => {
          setSelectedProvider(row);
          setIsDrawerOpen(true);
        }}
        exportConfig={{
          fileName: 'Annulations',
          columns: [
          {
            header: 'Nom',
            key: 'name'
          },
          {
            header: 'Service',
            key: 'serviceType'
          },
          {
            header: 'Taux Annulation (%)',
            key: 'cancellationRate'
          },
          {
            header: 'Total Annulations',
            key: 'totalCancellations'
          },
          {
            header: 'Réservations',
            key: 'bookingsCount'
          },
          {
            header: 'Statut',
            key: 'status'
          }]

        }} />
      

      {/* Warning Modal */}
      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        title="Envoyer un Avertissement"
        footer={
        <>
            <button
            onClick={() => setIsWarningModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            onClick={handleSendWarning}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md">
            
              Envoyer l'Avertissement
            </button>
          </>
        }>
        
        {actionProvider &&
        <div className="space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  Avertissement de Taux d'Annulation
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Vous êtes sur le point d'envoyer un avertissement officiel à{' '}
                  <span className="font-bold">{actionProvider.name}</span>. Son
                  taux d'annulation actuel est de{' '}
                  <span className="font-bold">
                    {actionProvider.cancellationRate.toFixed(1)}%
                  </span>
                  .
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message (Sera envoyé par email et notification)
              </label>
              <textarea
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={4}
              defaultValue={`Bonjour ${actionProvider.name},\n\nNous avons remarqué que votre taux d'annulation a atteint ${actionProvider.cancellationRate.toFixed(1)}%, ce qui dépasse notre seuil d'avertissement de ${warningThreshold}%.\n\nAfin de maintenir la qualité de service sur CareAtHome, nous vous prions de limiter vos annulations. Si ce taux dépasse ${blockThreshold}%, votre compte risque d'être suspendu temporairement.\n\nCordialement,\nL'équipe CareAtHome`} />
            
            </div>
          </div>
        }
      </Modal>

      {/* Block Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Suspendre le Professionnel"
        footer={
        <>
            <button
            onClick={() => setIsBlockModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            onClick={handleBlockProvider}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
            
              Confirmer la Suspension
            </button>
          </>
        }>
        
        {actionProvider &&
        <div className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg flex gap-3">
              <Ban className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                  Suspension de Compte
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Vous êtes sur le point de suspendre{' '}
                  <span className="font-bold">{actionProvider.name}</span> pour
                  une durée de{' '}
                  <span className="font-bold">
                    {suspensionPeriodDays} jours
                  </span>
                  . Son taux d'annulation actuel est de{' '}
                  <span className="font-bold">
                    {actionProvider.cancellationRate.toFixed(1)}%
                  </span>
                  .
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Raison de la suspension (Visible par le professionnel)
              </label>
              <textarea
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={3}
              defaultValue={`Suspension temporaire de ${suspensionPeriodDays} jours suite à un taux d'annulation excessif (${actionProvider.cancellationRate.toFixed(1)}% > ${blockThreshold}%).`} />
            
            </div>
          </div>
        }
      </Modal>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Détails des Annulations"
        footer={
        <div className="flex gap-2">
            <button
            onClick={() => {
              setActionProvider(selectedProvider);
              setIsWarningModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-md transition-colors">
            
              <Mail className="w-4 h-4" />
              Avertir
            </button>
            {selectedProvider?.status !== 'blocked' &&
          selectedProvider?.status !== 'suspended' &&
          <button
            onClick={() => {
              setActionProvider(selectedProvider);
              setIsBlockModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors">
            
                  <Ban className="w-4 h-4" />
                  Suspendre
                </button>
          }
          </div>
        }>
        
        {selectedProvider &&
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-lg font-bold text-teal-700 dark:text-teal-300">
                {selectedProvider.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProvider.name}
                </h3>
                <p className="text-sm text-slate-500 capitalize">
                  {selectedProvider.serviceType} · {selectedProvider.city}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Taux Actuel
                  </span>
                </div>
                <p
                className={`text-lg font-bold ${selectedProvider.cancellationRate > warningThreshold ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                
                  {selectedProvider.cancellationRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 mb-1">
                  <Ban className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Total Annulations
                  </span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProvider.totalCancellations}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Réservations
                  </span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProvider.bookingsCount}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    Statut
                  </span>
                </div>
                <div className="mt-1">
                  <StatusBadge
                  status={getCancellationStatus(
                    selectedProvider.cancellationRate,
                    selectedProvider.status
                  )} />
                
                </div>
              </div>
            </div>

            {/* Recent Cancellations Mock List */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Dernières Annulations
              </h4>
              <div className="space-y-3">
                {[1, 2, 3].map((i) =>
              <div
                key={i}
                className="flex gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                
                    <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                      <Ban className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          Patient {Math.floor(Math.random() * 100)}
                        </p>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          Il y a {i} jour{i > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Raison:{' '}
                        {
                    [
                    'Urgence personnelle',
                    'Problème de transport',
                    'Maladie'][
                    i - 1]
                    }
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{' '}
                          {new Date(
                        Date.now() - i * 86400000
                      ).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 14:30
                        </span>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          </div>
        }
      </DetailDrawer>
    </div>);

}