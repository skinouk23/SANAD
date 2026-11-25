import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  Eye,
  CreditCard,
  Shield,
  Database,
  Lock,
  AlertTriangle,
  Server,
  ChevronLeft,
  ChevronRight,
  Download,
  X } from
'lucide-react';
import { mockAuditLogs } from '../../data/mock/adminMockData';
import { AuditLog } from '../../types/admin.types';
import { DetailDrawer } from '../../components/admin/shared/DetailDrawer';
import { exportToExcel } from '../../utils/exportExcel';
const categoryIcons: Record<
  string,
  {
    icon: React.ElementType;
    color: string;
  }> =
{
  Payment: {
    icon: CreditCard,
    color: 'text-blue-500'
  },
  GDPR: {
    icon: Shield,
    color: 'text-amber-500'
  },
  Data: {
    icon: Database,
    color: 'text-slate-500'
  },
  Auth: {
    icon: Lock,
    color: 'text-teal-500'
  },
  Security: {
    icon: AlertTriangle,
    color: 'text-red-500'
  },
  System: {
    icon: Server,
    color: 'text-purple-500'
  }
};
function SeverityBadge({ severity }: {severity: string;}) {
  const config: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      icon: string;
    }> =
  {
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: 'ℹ'
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: '⚠'
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: '✕'
    },
    critical: {
      bg: 'bg-white',
      text: 'text-red-600',
      border: 'border-red-400',
      icon: '◉'
    }
  };
  const c = config[severity] || config.info;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} uppercase tracking-wide`}>
      
      <span className="text-[9px]">{c.icon}</span>
      {severity}
    </span>);

}
function RoleBadge({ role }: {role: string;}) {
  const colors: Record<string, string> = {
    PATIENT: 'text-blue-600',
    PROVIDER: 'text-teal-600',
    ADMIN: 'text-purple-600',
    SYSTEM: 'text-slate-500'
  };
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider ${colors[role] || 'text-slate-500'}`}>
      
      {role}
    </span>);

}
function ResourceBadge({ resource }: {resource: string;}) {
  return (
    <span className="inline-block px-2 py-0.5 text-[11px] font-mono font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded">
      {resource}
    </span>);

}
export function AuditLogs() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const itemsPerPage = 15;
  const filteredData = useMemo(() => {
    return mockAuditLogs.
    filter((log) => {
      const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
      const matchesSeverity = severityFilter ?
      log.severity === severityFilter :
      true;
      const matchesCategory = categoryFilter ?
      log.category === categoryFilter :
      true;
      return matchesSearch && matchesSeverity && matchesCategory;
    }).
    sort(
      (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [search, severityFilter, categoryFilter]);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Journal d'audit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Suivi d'activité et piste de sécurité
          </p>
        </div>
        <button
          onClick={() =>
          exportToExcel(
            filteredData,
            [
            {
              header: 'ID',
              key: 'id'
            },
            {
              header: 'Horodatage',
              key: 'timestamp',
              transform: (v: string) => new Date(v).toLocaleString('fr-FR')
            },
            {
              header: 'Sévérité',
              key: 'severity'
            },
            {
              header: 'Catégorie',
              key: 'category'
            },
            {
              header: 'Utilisateur',
              key: 'user'
            },
            {
              header: 'Rôle',
              key: 'userRole'
            },
            {
              header: 'Portail',
              key: 'portal'
            },
            {
              header: 'Type Action',
              key: 'actionType'
            },
            {
              header: 'Entité',
              key: 'entity'
            },
            {
              header: 'Ressource',
              key: 'resource'
            },
            {
              header: 'Description',
              key: 'description'
            },
            {
              header: 'Adresse IP',
              key: 'ipAddress'
            }],

            'Journal_Audit',
            'Audit Logs'
          )
          }
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          
          <Download className="w-4 h-4" />
          Exporter Excel
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (utilisateur, action, IP)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
          
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer">
              
              <option value="">Toutes sévérités</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer">
              
              <option value="">Toutes catégories</option>
              <option value="Payment">Payment</option>
              <option value="GDPR">GDPR</option>
              <option value="Data">Data</option>
              <option value="Auth">Auth</option>
              <option value="Security">Security</option>
              <option value="System">System</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* Header */}
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Horodatage ↓
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Sévérité ↕
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Type ↕
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Utilisateur ↕
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ressource
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Détails
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {paginatedData.map((log) => {
                const ts = new Date(log.timestamp);
                const time = ts.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });
                const date = ts.
                toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short'
                }).
                replace('.', '');
                const catConfig =
                categoryIcons[log.category] || categoryIcons.System;
                const CatIcon = catConfig.icon;
                return (
                  <tr
                    key={log.id}
                    className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Timestamp */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                        {time}
                      </div>
                      <div className="text-[11px] text-slate-400">{date}</div>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3">
                      <SeverityBadge severity={log.severity} />
                    </td>

                    {/* Type / Category */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CatIcon className={`w-4 h-4 ${catConfig.color}`} />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {log.category}
                        </span>
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {log.user}
                      </div>
                      <RoleBadge role={log.userRole} />
                    </td>

                    {/* Action / Description */}
                    <td className="px-4 py-3 max-w-[260px]">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate block">
                        {log.description}
                      </span>
                    </td>

                    {/* Resource */}
                    <td className="px-4 py-3">
                      <ResourceBadge resource={log.resource} />
                    </td>

                    {/* IP */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                        {log.ipAddress}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                        
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>);

              })}

              {paginatedData.length === 0 &&
              <tr>
                  <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-slate-500">
                  
                    Aucun résultat trouvé
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 &&
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
            <span className="text-xs text-slate-500">
              {filteredData.length} entrées · Page {page} sur {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({
              length: Math.min(totalPages, 5)
            }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${page === pageNum ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                  
                    {pageNum}
                  </button>);

            })}
              <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      </div>

      <DetailDrawer
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Détails du Journal d'Audit">
        
        {selectedLog &&
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {(() => {
                  const catConfig =
                  categoryIcons[selectedLog.category] ||
                  categoryIcons.System;
                  const CatIcon = catConfig.icon;
                  return <CatIcon className={`w-5 h-5 ${catConfig.color}`} />;
                })()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedLog.actionType}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {new Date(selectedLog.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              <SeverityBadge severity={selectedLog.severity} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Utilisateur</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {selectedLog.user}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Rôle</p>
                <RoleBadge role={selectedLog.userRole} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Catégorie</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {selectedLog.category}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Portail</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                  {selectedLog.portal}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Adresse IP</p>
                <p className="text-sm font-mono text-slate-900 dark:text-white">
                  {selectedLog.ipAddress}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Entité</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {selectedLog.entity}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Ressource</p>
              <ResourceBadge resource={selectedLog.resource} />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Description</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {selectedLog.description}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Données brutes (JSON)</p>
              <pre className="p-3 bg-slate-950 text-slate-300 rounded-lg overflow-x-auto text-xs font-mono border border-slate-800">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>
          </div>
        }
      </DetailDrawer>
    </div>);

}