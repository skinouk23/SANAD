import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  Calendar,
  CreditCard,
  DollarSign,
  Loader2,
  Percent,
  RefreshCcw,
  TrendingUp,
  Users
} from 'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { StatusBadge } from '../../components/admin/shared/StatusBadge';
import { getAdminTransactions } from '../../services/adminTransactions.service';
import type {
  AdminTransaction,
  CommissionTransaction,
  SubscriptionTransaction
} from '../../types/admin.types';

type TabKey = 'paiements' | 'abonnements' | 'commissions';

function formatDate(value?: string): string {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('fr-FR');
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })} TND`;
}

function normalizeCommissionRate(rate: number): number {
  return rate <= 1 ? rate * 100 : rate;
}

function getSubscriptionPeriod(transaction: SubscriptionTransaction): {
  start?: string;
  end?: string;
} {
  return {
    start: transaction.periodStart,
    end: transaction.periodEnd
  };
}

const statusFilterOptions = [
  { label: 'Complete', value: 'completed' },
  { label: 'En attente', value: 'pending' },
  { label: 'Echoue', value: 'failed' },
  { label: 'Rembourse', value: 'refunded' }
];

const simpleStatusFilterOptions = [
  { label: 'Complete', value: 'completed' },
  { label: 'En attente', value: 'pending' },
  { label: 'Echoue', value: 'failed' }
];

export function TransactionList() {
  const [activeTab, setActiveTab] = useState<TabKey>('paiements');
  const [payments, setPayments] = useState<AdminTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionTransaction[]>([]);
  const [commissions, setCommissions] = useState<CommissionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchPayments, setSearchPayments] = useState('');
  const [statusPayments, setStatusPayments] = useState('');

  const [searchSubscriptions, setSearchSubscriptions] = useState('');
  const [statusSubscriptions, setStatusSubscriptions] = useState('');

  const [searchCommissions, setSearchCommissions] = useState('');
  const [statusCommissions, setStatusCommissions] = useState('');

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getAdminTransactions();
      setPayments(response.payments || []);
      setSubscriptions(response.subscriptions || []);
      setCommissions(response.commissions || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Impossible de charger les transactions.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const tabs = useMemo(
    () => [
      {
        key: 'paiements' as const,
        label: 'Paiements Services',
        icon: <ArrowLeftRight className="w-4 h-4" />,
        count: payments.length
      },
      {
        key: 'abonnements' as const,
        label: 'Abonnements',
        icon: <CreditCard className="w-4 h-4" />,
        count: subscriptions.length
      },
      {
        key: 'commissions' as const,
        label: 'Commissions',
        icon: <Percent className="w-4 h-4" />,
        count: commissions.length
      }
    ],
    [payments.length, subscriptions.length, commissions.length]
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((transaction) => {
      const query = searchPayments.trim().toLowerCase();
      const matchesSearch = !query || [
        transaction.patientName,
        transaction.providerName,
        transaction.serviceName,
        transaction.id,
        transaction.bookingReference,
        transaction.paymentReference
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));

      const matchesStatus = statusPayments ? transaction.status === statusPayments : true;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchPayments, statusPayments]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((transaction) => {
      const query = searchSubscriptions.trim().toLowerCase();
      const matchesSearch = !query || [
        transaction.providerName,
        transaction.providerService,
        transaction.plan,
        transaction.id,
        transaction.period
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));

      const matchesStatus = statusSubscriptions ? transaction.status === statusSubscriptions : true;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchSubscriptions, statusSubscriptions]);

  const filteredCommissions = useMemo(() => {
    return commissions.filter((transaction) => {
      const query = searchCommissions.trim().toLowerCase();
      const matchesSearch = !query || [
        transaction.providerName,
        transaction.serviceName,
        transaction.bookingRef,
        transaction.id
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));

      const matchesStatus = statusCommissions ? transaction.status === statusCommissions : true;
      return matchesSearch && matchesStatus;
    });
  }, [commissions, searchCommissions, statusCommissions]);

  const paymentColumns = [
    {
      header: 'ID / Date',
      accessor: (row: AdminTransaction) => (
        <div>
          <div className="font-mono text-xs text-slate-500">{row.id}</div>
          <div className="text-xs text-slate-900 dark:text-white">
            {formatDate(row.date)}
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'date',
      filterable: true,
      filterKey: 'id'
    },
    {
      header: 'Parties',
      accessor: (row: AdminTransaction) => (
        <div>
          <div className="text-sm font-medium text-slate-900 dark:text-white">
            {row.patientName}
          </div>
          <div className="text-xs text-slate-500">vers {row.providerName}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'patientName',
      filterable: true,
      filterKey: 'patientName'
    },
    {
      header: 'Service',
      accessor: 'serviceName',
      sortable: true,
      filterable: true
    },
    {
      header: 'Montant',
      accessor: (row: AdminTransaction) => (
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
      sortable: true,
      sortKey: 'amount'
    },
    {
      header: 'Frais',
      accessor: (row: AdminTransaction) => (
        <span className="text-amber-600 dark:text-amber-400">
          {formatCurrency(row.commission)}
        </span>
      ),
      sortable: true,
      sortKey: 'commission'
    },
    {
      header: 'Statut',
      accessor: (row: AdminTransaction) => <StatusBadge status={row.status} />,
      sortable: true,
      sortKey: 'status',
      filterable: true,
      filterKey: 'status'
    }
  ];

  const subscriptionColumns = [
    {
      header: 'ID / Date',
      accessor: (row: SubscriptionTransaction) => (
        <div>
          <div className="font-mono text-xs text-slate-500">{row.id}</div>
          <div className="text-xs text-slate-900 dark:text-white">
            {formatDate(row.date)}
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'date',
      filterable: true,
      filterKey: 'id'
    },
    {
      header: 'Professionnel',
      accessor: (row: SubscriptionTransaction) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {row.providerName}
        </span>
      ),
      sortable: true,
      sortKey: 'providerName',
      filterable: true,
      filterKey: 'providerName'
    },
    {
      header: 'Plan',
      accessor: (row: SubscriptionTransaction) => (
        <span className="capitalize">{row.plan}</span>
      ),
      sortable: true,
      sortKey: 'plan',
      filterable: true,
      filterKey: 'plan'
    },
    {
      header: 'Periode',
      accessor: (row: SubscriptionTransaction) => {
        const period = getSubscriptionPeriod(row);
        return (
          <span className="text-xs text-slate-500">
            {period.start ? formatDate(period.start) : row.period || '-'}{' '}
            {period.end ? `- ${formatDate(period.end)}` : ''}
          </span>
        );
      }
    },
    {
      header: 'Montant',
      accessor: (row: SubscriptionTransaction) => (
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
      sortable: true,
      sortKey: 'amount'
    },
    {
      header: 'Statut',
      accessor: (row: SubscriptionTransaction) => (
        <StatusBadge status={row.status} />
      ),
      sortable: true,
      sortKey: 'status',
      filterable: true,
      filterKey: 'status'
    }
  ];

  const commissionColumns = [
    {
      header: 'ID / Date',
      accessor: (row: CommissionTransaction) => (
        <div>
          <div className="font-mono text-xs text-slate-500">{row.id}</div>
          <div className="text-xs text-slate-900 dark:text-white">
            {formatDate(row.date)}
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'date',
      filterable: true,
      filterKey: 'id'
    },
    {
      header: 'Professionnel',
      accessor: (row: CommissionTransaction) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {row.providerName}
        </span>
      ),
      sortable: true,
      sortKey: 'providerName',
      filterable: true,
      filterKey: 'providerName'
    },
    {
      header: 'Ref. Reservation',
      accessor: (row: CommissionTransaction) => (
        <span className="font-mono text-xs text-slate-500">{row.bookingRef}</span>
      ),
      filterable: true,
      filterKey: 'bookingRef'
    },
    {
      header: 'Taux',
      accessor: (row: CommissionTransaction) =>
        `${normalizeCommissionRate(row.commissionRate).toFixed(0)}%`,
      sortable: true,
      sortKey: 'commissionRate'
    },
    {
      header: 'Montant Commission',
      accessor: (row: CommissionTransaction) => (
        <span className="font-medium text-purple-600 dark:text-purple-400">
          {formatCurrency(row.commissionAmount)}
        </span>
      ),
      sortable: true,
      sortKey: 'commissionAmount'
    },
    {
      header: 'Statut',
      accessor: (row: CommissionTransaction) => (
        <StatusBadge status={row.status} />
      ),
      sortable: true,
      sortKey: 'status',
      filterable: true,
      filterKey: 'status'
    }
  ];

  const totalPayments = payments.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalFees = payments.reduce((sum, transaction) => sum + transaction.commission, 0);
  const todayPayments = payments.filter(
    (transaction) =>
      new Date(transaction.date).toDateString() === new Date().toDateString()
  ).length;

  const totalSubscriptions = subscriptions
    .filter((transaction) => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const activeSubscribers = new Set(
    subscriptions
      .filter((transaction) => transaction.status === 'completed')
      .map((transaction) => transaction.providerName)
  ).size;

  const totalCommissions = commissions
    .filter((transaction) => transaction.status === 'completed')
    .reduce((sum, transaction) => sum + transaction.commissionAmount, 0);

  const averageCommissionRate = commissions.length > 0
    ? commissions.reduce(
      (sum, transaction) => sum + normalizeCommissionRate(transaction.commissionRate),
      0
    ) / commissions.length
    : 0;

  const todayCommissions = commissions.filter(
    (transaction) =>
      new Date(transaction.date).toDateString() === new Date().toDateString()
  ).length;

  if (loading && payments.length === 0 && subscriptions.length === 0 && commissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tous les mouvements financiers de la plateforme
          </p>
        </div>
        <button
          onClick={() => void loadTransactions()}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
          Actualiser
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  activeTab === tab.key
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 'paiements' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Total Paiements
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalPayments)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Frais Plateforme
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalFees)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Transactions Aujourd hui
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {todayPayments}
                  </p>
                </div>
              </div>

              <FilterBar
                searchValue={searchPayments}
                onSearchChange={setSearchPayments}
                searchPlaceholder="Rechercher ID, patient, service ou professionnel..."
                filters={[
                  {
                    id: 'status',
                    label: 'Tous les statuts',
                    value: statusPayments,
                    onChange: setStatusPayments,
                    options: statusFilterOptions
                  }
                ]}
              />

              <DataTable
                columns={paymentColumns}
                data={filteredPayments}
                keyExtractor={(row) => row.id}
                exportConfig={{
                  fileName: 'paiements-services',
                  columns: [
                    { header: 'ID', key: 'id' },
                    {
                      header: 'Date',
                      key: 'date',
                      transform: (value: string) => formatDate(value)
                    },
                    { header: 'Patient', key: 'patientName' },
                    { header: 'Professionnel', key: 'providerName' },
                    { header: 'Service', key: 'serviceName' },
                    { header: 'Montant (TND)', key: 'amount' },
                    { header: 'Commission (TND)', key: 'commission' },
                    { header: 'Net (TND)', key: 'netAmount' },
                    { header: 'Statut', key: 'status' }
                  ]
                }}
              />
            </div>
          )}

          {activeTab === 'abonnements' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Revenus Abonnements
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalSubscriptions)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Abonnes Actifs
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeSubscribers}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Dernier Paiement
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {subscriptions.length > 0 ? formatDate(subscriptions[0].date) : '-'}
                  </p>
                </div>
              </div>

              <FilterBar
                searchValue={searchSubscriptions}
                onSearchChange={setSearchSubscriptions}
                searchPlaceholder="Rechercher professionnel, plan ou ID..."
                filters={[
                  {
                    id: 'status',
                    label: 'Tous les statuts',
                    value: statusSubscriptions,
                    onChange: setStatusSubscriptions,
                    options: simpleStatusFilterOptions
                  }
                ]}
              />

              <DataTable
                columns={subscriptionColumns}
                data={filteredSubscriptions}
                keyExtractor={(row) => row.id}
                exportConfig={{
                  fileName: 'abonnements',
                  columns: [
                    { header: 'ID', key: 'id' },
                    {
                      header: 'Date',
                      key: 'date',
                      transform: (value: string) => formatDate(value)
                    },
                    { header: 'Professionnel', key: 'providerName' },
                    { header: 'Service', key: 'providerService' },
                    { header: 'Plan', key: 'plan' },
                    {
                      header: 'Debut Periode',
                      key: 'periodStart',
                      transform: (value: string) => formatDate(value)
                    },
                    {
                      header: 'Fin Periode',
                      key: 'periodEnd',
                      transform: (value: string) => formatDate(value)
                    },
                    { header: 'Montant (TND)', key: 'amount' },
                    { header: 'Statut', key: 'status' }
                  ]
                }}
              />
            </div>
          )}

          {activeTab === 'commissions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Total Commissions
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(totalCommissions)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Taux Moyen
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {averageCommissionRate.toFixed(0)}%
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Commissions Aujourd hui
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {todayCommissions}
                  </p>
                </div>
              </div>

              <FilterBar
                searchValue={searchCommissions}
                onSearchChange={setSearchCommissions}
                searchPlaceholder="Rechercher professionnel, reservation ou ID..."
                filters={[
                  {
                    id: 'status',
                    label: 'Tous les statuts',
                    value: statusCommissions,
                    onChange: setStatusCommissions,
                    options: simpleStatusFilterOptions
                  }
                ]}
              />

              <DataTable
                columns={commissionColumns}
                data={filteredCommissions}
                keyExtractor={(row) => row.id}
                exportConfig={{
                  fileName: 'commissions',
                  columns: [
                    { header: 'ID', key: 'id' },
                    {
                      header: 'Date',
                      key: 'date',
                      transform: (value: string) => formatDate(value)
                    },
                    { header: 'Professionnel', key: 'providerName' },
                    { header: 'Service', key: 'serviceName' },
                    { header: 'Reservation', key: 'bookingRef' },
                    { header: 'Taux Commission (%)', key: 'commissionRate' },
                    { header: 'Montant Commission (TND)', key: 'commissionAmount' },
                    { header: 'Montant Net (TND)', key: 'netAmount' },
                    { header: 'Statut', key: 'status' }
                  ]
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
