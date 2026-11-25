import React, { useState, Component } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Download,
  Search,
  Calendar,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  usePaginatedTransactions,
  useTransactionStats,
  useTransactionStatus } from
'../../hooks/useTransactions';
import { useApi } from '../../hooks/useApi';
import { usersService } from '../../services/users.service';
import type { Transaction, Provider } from '../../types/api.types';
// Transaction Card Component
function TransactionCard({ transaction }: {transaction: Transaction;}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const statusConfig = useTransactionStatus(transaction.status);
  const date = new Date(transaction.createdAt);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const paymentMethodLabels: Record<string, string> = {
    card: t.provider.bankCard,
    d17: 'D17',
    cash: 'Espèces',
    bank_transfer: 'Virement',
    wallet: 'Portefeuille'
  };
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-3 lg:p-4 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50' : 'bg-white/80 border-slate-200 hover:border-cyan-500 shadow-sm'}`}>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] sm:text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
              {transaction.id}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}>
              
              {statusConfig.label}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
              <User className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-xs sm:text-sm">
              {transaction.patient?.name || 'Patient'}
            </span>
          </div>

          <div
            className={`flex items-center justify-between text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              {transaction.description || 'Service'}
            </span>
          </div>
        </div>

        <div className="lg:text-right space-y-0.5 lg:min-w-[180px]">
          <div className="flex lg:justify-end items-baseline gap-1">
            <span
              className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
              {t.provider.amount}:
            </span>
            <span
              className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              {transaction.amount}
            </span>
            <span
              className={`text-[9px] sm:text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
              TND
            </span>
          </div>

          <div className="flex lg:justify-end items-baseline gap-1">
            <span
              className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
              {t.provider.commission}:
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-red-500">
              -{transaction.commission || 0}
            </span>
            <span className="text-[9px] text-red-400">TND</span>
          </div>

          <div
            className={`flex lg:justify-end items-baseline gap-1 pt-0.5 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            
            <span
              className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
              {t.provider.net}:
            </span>
            <span className="text-sm sm:text-base font-bold text-green-500">
              {transaction.netAmount || transaction.amount}
            </span>
            <span className="text-[9px] text-green-400">TND</span>
          </div>

          <div
            className={`text-[10px] sm:text-xs lg:text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            
            {paymentMethodLabels[transaction.paymentMethod] ||
            transaction.paymentMethod}
          </div>
        </div>
      </div>
    </div>);

}
// Loading skeleton
function TransactionSkeleton() {
  const { isDark } = useTheme();
  return (
    <div
      className={`backdrop-blur-sm border rounded-xl p-3 lg:p-4 animate-pulse ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-20 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
            <div
              className={`h-4 w-12 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-md ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
            <div
              className={`h-3 w-24 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
          </div>
          <div
            className={`h-2.5 w-40 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
        </div>
        <div className="space-y-1.5 lg:min-w-[180px]">
          <div
            className={`h-3 w-20 rounded ml-auto ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
          <div
            className={`h-2.5 w-16 rounded ml-auto ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
          <div
            className={`h-4 w-24 rounded ml-auto ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
        </div>
      </div>
    </div>);

}
export function CyberTransactionHistory() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  // API Integration - Fetch current provider
  const { data: currentProvider } = useApi<Provider | null>(
    () => usersService.getCurrentProvider(),
    []
  );
  // API Integration - Fetch paginated transactions
  const {
    data: transactions,
    loading: transactionsLoading,
    pagination,
    filters,
    setFilters,
    nextPage,
    prevPage
  } = usePaginatedTransactions({
    providerId: currentProvider?.id,
    page: 1,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter as any : undefined
  });
  // API Integration - Fetch transaction stats
  const { data: stats, loading: statsLoading } = useTransactionStats(
    currentProvider?.id
  );
  // Filter transactions by search query (client-side for now)
  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(query) ||
      t.patient?.name?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query));

  });
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setFilters({
      status: status !== 'all' ? status as any : undefined
    });
  };
  // Format stat values with small TND unit
  const formatStatValue = (value: number | string, showTND: boolean = true) => {
    if (!showTND) return value.toString();
    return (
      <>
        {value}{' '}
        <span className="text-[10px] sm:text-xs font-normal opacity-60">
          TND
        </span>
      </>);

  };
  const statCards = [
  {
    label: t.provider.totalRevenue,
    value: stats?.totalRevenue || 0,
    showTND: true,
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    label: t.provider.pendingAmount,
    value: stats?.pendingAmount || 0,
    showTND: true,
    icon: Clock,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    label: t.provider.completedCount,
    value: stats?.completedCount || 0,
    showTND: false,
    icon: CheckCircle,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    label: t.provider.average,
    value: stats?.averageTransaction || 0,
    showTND: true,
    icon: TrendingUp,
    gradient: 'from-purple-500 to-pink-500'
  }];

  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-xs font-medium tracking-wide uppercase mb-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                
                {t.provider.finances}
              </p>
              <h1
                className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                {t.provider.myTransactions}
              </h1>
              <p
                className={`mt-0.5 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                
                {t.provider.paymentHistory}
              </p>
            </div>
            <button
              className={`p-2 border rounded-lg transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'}`}
              title={t.provider.export}>
              
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {statCards.map((stat, i) =>
          <div
            key={i}
            className={`backdrop-blur-sm border rounded-xl p-3 sm:p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center gap-2">
                <div
                className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p
                  className={`text-[9px] sm:text-[10px] uppercase tracking-wide truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  
                    {stat.label}
                  </p>
                  <p
                  className={`text-base sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  
                    {statsLoading ?
                  <span className="inline-block w-10 sm:w-14 h-4 sm:h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></span> :

                  formatStatValue(stat.value, stat.showTND)
                  }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div
          className={`backdrop-blur-sm border rounded-xl p-3 mb-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                <input
                  type="text"
                  placeholder={t.provider.searchByIdPatient}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`} />
                
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className={`px-3 py-1.5 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`}>
              
              <option value="all">{t.provider.allStatuses}</option>
              <option value="completed">{t.provider.completed}</option>
              <option value="pending">{t.provider.pending}</option>
              <option value="processing">{t.provider.processing}</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactionsLoading ?
          <>
              <TransactionSkeleton />
              <TransactionSkeleton />
              <TransactionSkeleton />
            </> :
          filteredTransactions.length > 0 ?
          filteredTransactions.map((transaction) =>
          <TransactionCard key={transaction.id} transaction={transaction} />
          ) :

          <div
            className={`backdrop-blur-sm border rounded-xl p-8 text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
            
              <DollarSign
              className={`h-10 w-10 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            
              <p
              className={`text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              
                Aucune transaction trouvée
              </p>
              <p
              className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
                {searchQuery || statusFilter !== 'all' ?
              'Essayez de modifier vos filtres' :
              'Vos transactions apparaîtront ici'}
              </p>
            </div>
          }
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 &&
        <div className="flex items-center justify-between mt-4">
            <p
            className={`text-[10px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            
              <span className="hidden sm:inline">
                Page {pagination.page} sur {pagination.totalPages} (
                {pagination.total} transactions)
              </span>
              <span className="sm:hidden">
                {pagination.page}/{pagination.totalPages}
              </span>
            </p>
            <div className="flex gap-1.5">
              <button
              onClick={prevPage}
              disabled={!pagination.hasPrev}
              className={`p-1.5 sm:px-3 sm:py-1.5 border rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
              
                <ChevronLeft className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Précédent</span>
              </button>
              <button
              onClick={nextPage}
              disabled={!pagination.hasNext}
              className={`p-1.5 sm:px-3 sm:py-1.5 border rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
              
                <ChevronRight className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Suivant</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>);

}