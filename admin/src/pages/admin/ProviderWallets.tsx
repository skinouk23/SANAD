import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  ArrowRightLeft,
  Ban,
  History,
  TrendingDown,
  Send,
  Wallet,
  AlertTriangle,
  ShieldOff,
  ShieldCheck } from
'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { Modal } from '../../components/admin/shared/Modal';
import { mockProviders } from '../../data/mock/adminMockData';
import { AdminProvider } from '../../types/admin.types';
export function ProviderWallets() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] =
  useState<AdminProvider | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockProvider, setBlockProvider] = useState<AdminProvider | null>(null);
  const [blockedWallets, setBlockedWallets] = useState<Set<string>>(new Set());
  const [transferAmount, setTransferAmount] = useState('');
  const [transferReference, setTransferReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  // Only show providers on commission plan
  const commissionProviders = useMemo(() => {
    return mockProviders.filter((p) => p.subscriptionPlan === 'commission');
  }, []);
  const filteredData = useMemo(() => {
    return commissionProviders.filter(
      (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, commissionProviders]);
  const columns = [
  {
    header: 'Provider',
    accessor: (row: AdminProvider) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
            {row.name}
            {blockedWallets.has(row.id) &&
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                <ShieldOff className="w-3 h-3" />
                Bloqué
              </span>
        }
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
    header: 'Wallet Balance',
    accessor: (row: AdminProvider) =>
    <span className="font-bold text-slate-900 dark:text-white">
          {row.walletBalance} TND
        </span>,

    sortable: true,
    sortKey: 'walletBalance',
    filterable: true,
    filterKey: 'walletBalance'
  },
  {
    header: 'Pending Payouts',
    accessor: (row: AdminProvider) =>
    <span className="text-amber-600 dark:text-amber-500">
          {row.pendingPayouts} TND
        </span>,

    sortable: true,
    sortKey: 'pendingPayouts'
  },
  {
    header: 'Total Earned',
    accessor: (row: AdminProvider) => `${row.revenueGenerated} TND`,
    sortable: true,
    sortKey: 'revenueGenerated'
  },
  {
    header: 'Min Transfer',
    accessor: (row: AdminProvider) => `${row.minTransferAmount} TND`
  },
  {
    header: 'Actions',
    accessor: (row: AdminProvider) => {
      const isBlocked = blockedWallets.has(row.id);
      const canTransfer =
      !isBlocked && (row.walletBalance || 0) >= (row.minTransferAmount || 0);
      return (
        <div className="flex items-center gap-2">
            <button
            onClick={() => {
              setSelectedProvider(row);
              setIsTransferModalOpen(true);
            }}
            disabled={!canTransfer}
            className={`p-1.5 rounded transition-colors ${canTransfer ? 'text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30' : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'}`}
            title={
            isBlocked ?
            'Wallet bloqué — transfert impossible' :
            'Initiate Transfer'
            }>
            
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <button
            onClick={() => navigate(`/admin/professionals/${row.id}/history`)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
            title="Historique des Transactions">
            
              <History className="w-4 h-4" />
            </button>
            <button
            onClick={() => {
              setBlockProvider(row);
              setIsBlockModalOpen(true);
            }}
            className={`p-1.5 rounded transition-colors ${isBlocked ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30' : 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
            title={isBlocked ? 'Débloquer le Wallet' : 'Bloquer le Wallet'}>
            
              {isBlocked ?
            <ShieldCheck className="w-4 h-4" /> :

            <Ban className="w-4 h-4" />
            }
            </button>
          </div>);

    }
  }];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Provider Wallets
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage balances and payouts for commission-based providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-md">
              <CreditCard className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Wallet Balances
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {commissionProviders.
            reduce((sum, p) => sum + (p.walletBalance || 0), 0).
            toLocaleString()}{' '}
            TND
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-md">
              <ArrowRightLeft className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Payouts
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {commissionProviders.
            reduce((sum, p) => sum + (p.pendingPayouts || 0), 0).
            toLocaleString()}{' '}
            TND
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Paid Out (YTD)
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            98,450 TND
          </p>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search providers..." />
      

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(row) => row.id}
        exportConfig={{
          fileName: 'Portefeuilles_Professionnels',
          columns: [
          {
            header: 'Nom',
            key: 'name'
          },
          {
            header: 'Email',
            key: 'email'
          },
          {
            header: 'Service',
            key: 'serviceType'
          },
          {
            header: 'Solde Wallet (TND)',
            key: 'walletBalance'
          },
          {
            header: 'Paiements en Attente (TND)',
            key: 'pendingPayouts'
          },
          {
            header: 'Revenus Totaux (TND)',
            key: 'revenueGenerated'
          },
          {
            header: 'Montant Min. Transfert (TND)',
            key: 'minTransferAmount'
          }]

        }} />
      

      {/* Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setTransferAmount('');
          setTransferReference('');
          setPaymentMethod('bank_transfer');
        }}
        title="Transfert de Solde au Professionnel"
        maxWidth="lg"
        footer={
        <>
            <button
            onClick={() => {
              setIsTransferModalOpen(false);
              setTransferAmount('');
              setTransferReference('');
              setPaymentMethod('bank_transfer');
            }}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50"
            disabled={
            !transferAmount ||
            !transferReference ||
            Number(transferAmount) > (
            selectedProvider?.walletBalance || 0) ||
            Number(transferAmount) < (
            selectedProvider?.minTransferAmount || 0)
            }>
            
              Confirmer le Transfert
            </button>
          </>
        }>
        
        {selectedProvider &&
        <div className="space-y-4">
            {/* Provider Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <span className="text-sm font-bold text-teal-700 dark:text-teal-300">
                  {selectedProvider.name.
                split(' ').
                map((n) => n[0]).
                join('')}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedProvider.name}
                </div>
                <div className="text-xs text-slate-500 capitalize">
                  {selectedProvider.serviceType} · {selectedProvider.email}
                </div>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-medium text-red-600 dark:text-red-400">
                    Total Déduit
                  </span>
                </div>
                <p className="text-lg font-bold text-red-700 dark:text-red-300">
                  {Math.round(
                  (selectedProvider.revenueGenerated || 0) * 0.15
                ).toLocaleString()}{' '}
                  TND
                </p>
                <p className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">
                  Commissions prélevées
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Send className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Total Transféré
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {Math.round(
                  (selectedProvider.revenueGenerated || 0) * 0.7
                ).toLocaleString()}{' '}
                  TND
                </p>
                <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">
                  Virements effectués
                </p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wallet className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
                    Solde Actuel
                  </span>
                </div>
                <p className="text-lg font-bold text-teal-700 dark:text-teal-300">
                  {(selectedProvider.walletBalance || 0).toLocaleString()} TND
                </p>
                <p className="text-[10px] text-teal-500 dark:text-teal-400 mt-0.5">
                  Disponible au transfert
                </p>
              </div>
            </div>

            {/* Transfer Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Montant du Transfert (TND)
              </label>
              <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              max={selectedProvider.walletBalance}
              min={selectedProvider.minTransferAmount}
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder={`Min: ${selectedProvider.minTransferAmount} TND`} />
            
              {Number(transferAmount) > (
            selectedProvider.walletBalance || 0) &&
            <p className="text-xs text-red-500 mt-1">
                  Le montant dépasse le solde disponible.
                </p>
            }
              {transferAmount &&
            Number(transferAmount) < (
            selectedProvider.minTransferAmount || 0) &&
            <p className="text-xs text-red-500 mt-1">
                    Le montant est inférieur au minimum requis (
                    {selectedProvider.minTransferAmount} TND).
                  </p>
            }
            </div>

            {/* Transfer Reference */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Référence de Virement
              </label>
              <input
              type="text"
              value={transferReference}
              onChange={(e) => setTransferReference(e.target.value)}
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
              placeholder="VIR-2026-XXXX" />
            
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Méthode de Paiement
              </label>
              <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              
                <option value="bank_transfer">Virement Bancaire</option>
                <option value="d17">D17 Mobile Money</option>
                <option value="flouci">Flouci</option>
                <option value="postal_check">Chèque Postal (CCP)</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Notes Administratives (Optionnel)
              </label>
              <textarea
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={2}
              placeholder="Remarques ou instructions..." />
            
            </div>
          </div>
        }
      </Modal>

      {/* Block/Unblock Wallet Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title={
        blockProvider && blockedWallets.has(blockProvider.id) ?
        'Débloquer le Wallet' :
        'Bloquer le Wallet'
        }
        footer={
        <>
            <button
            onClick={() => setIsBlockModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            onClick={() => {
              if (blockProvider) {
                setBlockedWallets((prev) => {
                  const next = new Set(prev);
                  if (next.has(blockProvider.id)) {
                    next.delete(blockProvider.id);
                  } else {
                    next.add(blockProvider.id);
                  }
                  return next;
                });
              }
              setIsBlockModalOpen(false);
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${blockProvider && blockedWallets.has(blockProvider.id) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
            
              {blockProvider && blockedWallets.has(blockProvider.id) ?
            'Confirmer le Déblocage' :
            'Confirmer le Blocage'}
            </button>
          </>
        }>
        
        {blockProvider &&
        <div className="space-y-4">
            {blockedWallets.has(blockProvider.id) ?
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Débloquer le wallet
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                    Le wallet de{' '}
                    <span className="font-bold">{blockProvider.name}</span> sera
                    réactivé. Les transferts et paiements seront à nouveau
                    autorisés.
                  </p>
                </div>
              </div> :

          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                    Bloquer le wallet
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    Le wallet de{' '}
                    <span className="font-bold">{blockProvider.name}</span> sera
                    gelé. Aucun transfert ni paiement ne pourra être effectué
                    tant que le wallet est bloqué.
                  </p>
                </div>
              </div>
          }

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-teal-300">
                {blockProvider.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {blockProvider.name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {blockProvider.serviceType} · {blockProvider.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  {(blockProvider.walletBalance || 0).toLocaleString()} TND
                </p>
                <p className="text-[10px] text-slate-500">Solde actuel</p>
              </div>
            </div>

            {!blockedWallets.has(blockProvider.id) &&
          <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Raison du blocage
                </label>
                <select className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500">
                  <option>Activité suspecte</option>
                  <option>Fraude confirmée</option>
                  <option>Demande du professionnel</option>
                  <option>Vérification en cours</option>
                  <option>Autre</option>
                </select>
              </div>
          }
          </div>
        }
      </Modal>
    </div>);

}