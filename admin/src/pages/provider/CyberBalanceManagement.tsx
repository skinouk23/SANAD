import React, { useMemo, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Copy,
  Building2,
  CreditCard,
  History,
  Search,
  ArrowLeft,
  Coins,
  X,
  ChevronRight,
  ChevronLeft,
  Loader2 } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  useProviderBalance,
  useProviderTransactions,
  useRequestPayout,
  useTransactionStatus } from
'../../hooks/useTransactions';
import type { Transaction } from '../../types/api.types';
// Transaction Row Component
function TransactionRow({
  transaction,
  isDark



}: {transaction: Transaction;isDark: boolean;}) {
  const statusConfig = useTransactionStatus(transaction.status);
  const isDeposit =
  transaction.type === 'deposit' || transaction.type === 'payout';
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isDeposit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            
            {isDeposit ?
            <ArrowUpCircle className="h-4 w-4 text-green-500" /> :

            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            }
          </div>
          <div>
            <p
              className={`text-xs font-medium ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
              
              {isDeposit ? 'Dépôt' : 'Déduction'}
            </p>
            <p
              className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
              {transaction.paymentMethod || 'Automatique'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p
          className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          {transaction.description || 'Transaction'}
        </p>
        <p
          className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          
          Ref: {transaction.id.slice(0, 12)}
        </p>
      </td>
      <td
        className={`px-4 py-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        
        {new Date(transaction.createdAt).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
          
          {transaction.status === 'completed' ?
          <CheckCircle className="h-3 w-3" /> :

          <Clock className="h-3 w-3" />
          }
          {statusConfig.label}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={`text-sm font-bold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
          
          {isDeposit ? '+' : '-'}
          {transaction.amount.toFixed(2)} TND
        </span>
      </td>
    </tr>);

}
// Mobile Transaction Card
function TransactionCard({
  transaction,
  isDark



}: {transaction: Transaction;isDark: boolean;}) {
  const statusConfig = useTransactionStatus(transaction.status);
  const isDeposit =
  transaction.type === 'deposit' || transaction.type === 'payout';
  return (
    <div
      className={`rounded-lg p-3 border ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isDeposit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            
            {isDeposit ?
            <ArrowUpCircle className="h-4 w-4 text-green-500" /> :

            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            }
          </div>
          <div>
            <p
              className={`text-xs font-medium ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
              
              {isDeposit ? 'Dépôt' : 'Déduction'}
            </p>
            <p
              className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              
              {new Date(transaction.createdAt).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-bold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
          
          {isDeposit ? '+' : '-'}
          {transaction.amount.toFixed(2)} TND
        </span>
      </div>
      <div className="space-y-1 mb-2">
        <p
          className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
          
          {transaction.description || 'Transaction'}
        </p>
        <div
          className={`flex justify-between text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          
          <span>Ref: {transaction.id.slice(0, 12)}</span>
          <span>{transaction.paymentMethod || 'Automatique'}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}>
          
          {transaction.status === 'completed' ?
          <CheckCircle className="h-3 w-3" /> :

          <Clock className="h-3 w-3" />
          }
          {statusConfig.label}
        </span>
      </div>
    </div>);

}
// Loading Skeleton
function TransactionSkeleton({ isDark }: {isDark: boolean;}) {
  return (
    <div
      className={`rounded-lg p-3 border animate-pulse ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
          </div>
          <div>
            <div
              className={`w-12 h-3 rounded mb-1 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
            <div
              className={`w-20 h-2 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            </div>
          </div>
        </div>
        <div
          className={`w-16 h-4 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
        </div>
      </div>
    </div>);

}
export function CyberBalanceManagement() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'd17'>('bank');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth().toString()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // API Integration - Fetch provider balance
  const {
    data: balanceData,
    loading: balanceLoading,
    refetch: refetchBalance
  } = useProviderBalance('current-provider');
  // API Integration - Fetch provider transactions
  const { data: transactions, loading: transactionsLoading } =
  useProviderTransactions('current-provider');
  // API Integration - Request payout mutation
  const { mutate: requestPayout, loading: payoutLoading } = useRequestPayout();
  const balance = balanceData?.available || 0;
  const pendingAmount = balanceData?.pending || 0;
  const lowBalanceThreshold = 50.0;
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const date = new Date(t.createdAt);
      const isDeposit = t.type === 'deposit' || t.type === 'payout';
      const matchesType =
      filterType === 'all' ||
      filterType === 'deposit' && isDeposit ||
      filterType === 'deduction' && !isDeposit;
      const matchesSearch =
      searchQuery === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMonth =
      selectedMonth === 'all' || date.getMonth().toString() === selectedMonth;
      const matchesYear =
      selectedYear === 'all' || date.getFullYear().toString() === selectedYear;
      return matchesType && matchesSearch && matchesMonth && matchesYear;
    });
  }, [transactions, filterType, searchQuery, selectedMonth, selectedYear]);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Calculate monthly totals
  const monthlyTotals = useMemo(() => {
    if (!transactions)
    return {
      deposits: 0,
      deductions: 0
    };
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return transactions.reduce(
      (acc, t) => {
        const date = new Date(t.createdAt);
        if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear)
        {
          const isDeposit = t.type === 'deposit' || t.type === 'payout';
          if (isDeposit) {
            acc.deposits += t.amount;
          } else {
            acc.deductions += t.amount;
          }
        }
        return acc;
      },
      {
        deposits: 0,
        deductions: 0
      }
    );
  }, [transactions]);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  const handleRequestPayout = async () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      await requestPayout({
        providerId: 'current-provider',
        amount: parseFloat(depositAmount),
        method: selectedMethod === 'bank' ? 'bank_transfer' : 'd17'
      });
      setShowDepositModal(false);
      setDepositAmount('');
      refetchBalance();
    }
  };
  const months = [
  {
    value: '0',
    label: 'Janvier'
  },
  {
    value: '1',
    label: 'Février'
  },
  {
    value: '2',
    label: 'Mars'
  },
  {
    value: '3',
    label: 'Avril'
  },
  {
    value: '4',
    label: 'Mai'
  },
  {
    value: '5',
    label: 'Juin'
  },
  {
    value: '6',
    label: 'Juillet'
  },
  {
    value: '7',
    label: 'Août'
  },
  {
    value: '8',
    label: 'Septembre'
  },
  {
    value: '9',
    label: 'Octobre'
  },
  {
    value: '10',
    label: 'Novembre'
  },
  {
    value: '11',
    label: 'Décembre'
  }];

  const years = ['2023', '2024', '2025'];
  const inputClass = `w-full px-3 py-2 text-sm border rounded-lg transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'}`;
  const selectClass = `px-3 py-2 border rounded-lg text-sm transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500'}`;
  return (
    <div
      className={`min-h-screen pb-20 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      
      <div
        className={`absolute inset-0 bg-[linear-gradient(${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px),linear-gradient(90deg,${isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.05)'}_1px,transparent_1px)] bg-[size:50px_50px]`}>
      </div>

      <div
        className={`relative z-10 backdrop-blur-sm border-b sticky top-0 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200'}`}>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div>
            <h1
              className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
              <Wallet
                className={
                isDark ? 'h-4 w-4 text-cyan-400' : 'h-4 w-4 text-cyan-600'
                } />
              
              Mon Solde Sanad
            </h1>
            <p
              className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              
              Gérez votre solde virtuel pour les prestations en espèces
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Balance Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-cyan-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5" />
                    Solde Disponible
                  </p>
                  {balanceLoading ?
                  <div className="h-10 w-40 bg-white/20 rounded animate-pulse"></div> :

                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                      {balance.toFixed(2)}{' '}
                      <span className="text-xl sm:text-2xl font-normal opacity-80">
                        TND
                      </span>
                    </h2>
                  }
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-1.5">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <p className="text-cyan-100 text-[10px] uppercase tracking-wider mb-0.5">
                      Dépôts en attente
                    </p>
                    <p className="text-lg font-bold text-white flex items-center gap-1.5">
                      {balanceLoading ?
                      <span className="h-5 w-16 bg-white/20 rounded animate-pulse"></span> :

                      <>{pendingAmount.toFixed(2)} TND</>
                      }
                      <Clock className="h-3.5 w-3.5 text-amber-300" />
                    </p>
                  </div>
                  <div>
                    <p className="text-cyan-100 text-[10px] uppercase tracking-wider mb-0.5">
                      ID Portefeuille
                    </p>
                    <p className="text-base font-mono text-white flex items-center gap-1.5">
                      SND-8821-99
                      <button
                        onClick={() => handleCopy('SND-8821-99')}
                        className="hover:text-cyan-200 transition-colors">
                        
                        <Copy className="h-3 w-3" />
                      </button>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-1.5">
                  
                  <Plus className="h-4 w-4" />
                  Recharger
                </button>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-3">
            {balance < lowBalanceThreshold &&
            <div
              className={`rounded-xl p-3 flex items-start gap-2 ${isDark ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
              
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-500 text-xs">Solde bas</h3>
                  <p
                  className={`text-[10px] mt-0.5 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                  
                    Votre solde est inférieur à {lowBalanceThreshold} TND.
                    Rechargez maintenant pour continuer à accepter les paiements
                    en espèces.
                  </p>
                </div>
              </div>
            }

            <div
              className={`backdrop-blur-sm border rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`text-xs font-medium mb-3 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                
                Ce mois-ci
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <ArrowUpCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        Dépôts
                      </p>
                      <p
                        className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                        Total rechargé
                      </p>
                    </div>
                  </div>
                  <span className="text-green-500 text-sm font-bold">
                    +{monthlyTotals.deposits.toFixed(2)} TND
                  </span>
                </div>
                <div
                  className={`w-full h-px ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <ArrowDownCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        
                        Déductions
                      </p>
                      <p
                        className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                        Services cash
                      </p>
                    </div>
                  </div>
                  <span className="text-red-500 text-sm font-bold">
                    -{monthlyTotals.deductions.toFixed(2)} TND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div
          className={`backdrop-blur-sm border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-slate-200 shadow-sm'}`}>
          
          <div
            className={`p-4 border-b flex flex-col gap-3 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3
                className={`text-base font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                <History
                  className={
                  isDark ? 'h-4 w-4 text-cyan-400' : 'h-4 w-4 text-cyan-600'
                  } />
                
                Historique des mouvements
              </h3>
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={selectClass}>
                  
                  <option value="all">Tous les mois</option>
                  {months.map((m) =>
                  <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  )}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={selectClass}>
                  
                  <option value="all">Toutes les années</option>
                  {years.map((y) =>
                  <option key={y} value={y}>
                      {y}
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`pl-8 pr-3 py-1.5 text-sm w-full ${inputClass}`} />
                
              </div>
              <div
                className={`flex items-center gap-1 p-1 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                
                {[
                {
                  key: 'all',
                  label: 'Tout'
                },
                {
                  key: 'deposit',
                  label: 'Dépôts',
                  color: 'green'
                },
                {
                  key: 'deduction',
                  label: 'Déductions',
                  color: 'red'
                }].
                map((f) =>
                <button
                  key={f.key}
                  onClick={() => {
                    setFilterType(f.key);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all whitespace-nowrap ${filterType === f.key ? isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                  
                    {f.label}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead
                className={`text-[10px] uppercase tracking-wider ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium text-right">Montant</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-slate-200'}`}>
                
                {transactionsLoading ?
                <tr>
                    <td colSpan={5} className="px-4 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2
                        className={`h-4 w-4 animate-spin ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                      
                        <span
                        className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        
                          Chargement...
                        </span>
                      </div>
                    </td>
                  </tr> :

                paginatedTransactions.map((tx) =>
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  isDark={isDark} />

                )
                }
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 p-3">
            {transactionsLoading ?
            <>
                <TransactionSkeleton isDark={isDark} />
                <TransactionSkeleton isDark={isDark} />
                <TransactionSkeleton isDark={isDark} />
              </> :

            paginatedTransactions.map((tx) =>
            <TransactionCard key={tx.id} transaction={tx} isDark={isDark} />
            )
            }
          </div>

          {/* Empty State */}
          {!transactionsLoading && filteredTransactions.length === 0 &&
          <div className="p-8 text-center">
              <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              
                <Search
                className={`h-6 w-6 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              
              </div>
              <h3
              className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Aucune transaction trouvée
              </h3>
              <p
              className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          }

          {/* Pagination */}
          {filteredTransactions.length > 0 &&
          <div
            className={`border-t p-3 flex items-center justify-between ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            
              <div
              className={`text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                Affichage de{' '}
                <span
                className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                à{' '}
                <span
                className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length
                )}
                </span>{' '}
                sur{' '}
                <span
                className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  {filteredTransactions.length}
                </span>
              </div>
              <div
              className={`text-xs sm:hidden ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              
                Page {currentPage} / {totalPages}
              </div>
              <div className="flex gap-1">
                <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700/50 border-slate-600 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
                
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-slate-700/50 border-slate-600 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`}>
                
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
          className={`border rounded-2xl w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div
            className={`p-4 border-b flex justify-between items-center flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            
              <h3
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              
                Recharger mon solde
              </h3>
              <button
              onClick={() => setShowDepositModal(false)}
              className={`transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Montant à recharger (TND)
                </label>
                <div className="relative">
                  <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className={`w-full text-base font-bold ${inputClass}`} />
                
                  <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  
                    TND
                  </span>
                </div>
              </div>

              <div>
                <label
                className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                {
                  key: 'bank',
                  icon: Building2,
                  label: 'Virement Bancaire'
                },
                {
                  key: 'd17',
                  icon: CreditCard,
                  label: 'D17'
                }].
                map((m) =>
                <button
                  key={m.key}
                  onClick={() => setSelectedMethod(m.key as 'bank' | 'd17')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${selectedMethod === m.key ? isDark ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-cyan-50 border-cyan-500 text-cyan-600' : isDark ? 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  
                      <m.icon className="h-5 w-5" />
                      <span className="font-medium text-xs">{m.label}</span>
                    </button>
                )}
                </div>
              </div>

              <div
              className={`rounded-xl p-3 border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              
                <h4
                className={`font-medium mb-2 flex items-center gap-1.5 text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                
                  <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                  
                    i
                  </div>
                  Instructions
                </h4>

                {selectedMethod === 'bank' ?
              <div className="space-y-1.5 text-xs">
                    {[
                {
                  label: 'Banque',
                  value: 'BIAT'
                },
                {
                  label: 'RIB',
                  value: '08 005 00045 2008899 55',
                  copy: '0800500045200889955'
                },
                {
                  label: 'Bénéficiaire',
                  value: 'Sanad Health Tech'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className={`flex justify-between py-1 ${i < 2 ? isDark ? 'border-b border-slate-700/50' : 'border-b border-slate-200' : ''}`}>
                  
                        <span
                    className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                          {item.label}
                        </span>
                        <span
                    className={`font-medium flex items-center gap-1.5 text-[10px] ${item.copy ? 'font-mono' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                          {item.value}
                          {item.copy &&
                    <button
                      onClick={() => handleCopy(item.copy!)}
                      className={
                      isDark ?
                      'text-cyan-400 hover:text-cyan-300' :
                      'text-cyan-600 hover:text-cyan-500'
                      }>
                      
                              <Copy className="h-3 w-3" />
                            </button>
                    }
                        </span>
                      </div>
                )}
                  </div> :

              <div className="space-y-1.5 text-xs">
                    {[
                {
                  label: 'Numéro D17',
                  value: '55 123 456',
                  copy: '55123456'
                },
                {
                  label: 'Nom',
                  value: 'Sanad Health Tech'
                }].
                map((item, i) =>
                <div
                  key={i}
                  className={`flex justify-between py-1 ${i < 1 ? isDark ? 'border-b border-slate-700/50' : 'border-b border-slate-200' : ''}`}>
                  
                        <span
                    className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    
                          {item.label}
                        </span>
                        <span
                    className={`font-medium flex items-center gap-1.5 text-[10px] ${item.copy ? 'font-mono' : ''} ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    
                          {item.value}
                          {item.copy &&
                    <button
                      onClick={() => handleCopy(item.copy!)}
                      className={
                      isDark ?
                      'text-cyan-400 hover:text-cyan-300' :
                      'text-cyan-600 hover:text-cyan-500'
                      }>
                      
                              <Copy className="h-3 w-3" />
                            </button>
                    }
                        </span>
                      </div>
                )}
                  </div>
              }

                <div
                className={`mt-2 p-2 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                
                  <p
                  className={`text-[10px] flex items-start gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  
                    <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                    Important : Veuillez inclure votre ID Portefeuille{' '}
                    <span className="font-mono font-bold">
                      SND-8821-99
                    </span>{' '}
                    dans le libellé du virement.
                  </p>
                </div>
              </div>
            </div>

            <div
            className={`p-4 border-t flex-shrink-0 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
            
              <button
              onClick={handleRequestPayout}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100">
              
                Confirmer la recharge
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}