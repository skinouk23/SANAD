import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Download } from
'lucide-react';
import { exportToExcel, ExportColumn } from '../../../utils/exportExcel';
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: keyof T | string;
  filterable?: boolean;
  filterKey?: keyof T | string;
  className?: string;
}
interface ExportConfig {
  fileName: string;
  sheetName?: string;
  columns: ExportColumn[];
}
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  exportConfig?: ExportConfig;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
  };
}
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  exportConfig,
  pagination: externalPagination
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
    sortConfig &&
    sortConfig.key === key &&
    sortConfig.direction === 'asc')
    {
      direction = 'desc';
    }
    setSortConfig({
      key,
      direction
    });
  };
  const handleFilterChange = (key: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setInternalPage(1);
  };
  const processedData = useMemo(() => {
    let result = [...data];
    // Apply column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const itemValue = (item as any)[key];
          if (itemValue == null) return false;
          return String(itemValue).toLowerCase().includes(value.toLowerCase());
        });
      }
    });
    // Apply sorting
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === bValue) return 0;
        const comparison = aValue > bValue ? 1 : -1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    return result;
  }, [data, sortConfig, columnFilters]);
  // Use external pagination if provided AND data length matches (meaning parent already sliced it)
  // Actually, if parent sliced it, sorting/filtering here only applies to the current page.
  // To make it work globally, parent should pass full data. If parent passes sliced data,
  // internal sorting/filtering is limited. We'll assume if externalPagination is provided,
  // we still use internal slicing if data length > itemsPerPage, otherwise we just display it.
  const isExternallyPaginated =
  externalPagination &&
  data.length <= 100 &&
  data.length === processedData.length; // heuristic
  const totalItems = externalPagination?.totalItems ?? processedData.length;
  const totalPages = externalPagination ?
  externalPagination.totalPages :
  Math.ceil(totalItems / itemsPerPage);
  const currentPage = externalPagination ?
  externalPagination.page :
  internalPage;
  const displayData = externalPagination ?
  processedData :
  processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (newPage: number) => {
    if (externalPagination) {
      externalPagination.onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {totalItems} entries total
        </div>
        <div className="flex items-center gap-2">
          {exportConfig &&
          <button
            onClick={() =>
            void exportToExcel(
              processedData as any[],
              exportConfig.columns,
              exportConfig.fileName,
              exportConfig.sheetName
            )
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors">
            
              <Download className="w-3.5 h-3.5" />
              Export Excel
            </button>
          }
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${showFilters ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'}`}>
            
            <Filter className="w-3.5 h-3.5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {columns.map((col, i) => {
                const sortKey =
                col.sortKey || (
                typeof col.accessor === 'string' ? col.accessor : null);
                const filterKey =
                col.filterKey || (
                typeof col.accessor === 'string' ? col.accessor : null);
                const isSorted = sortConfig?.key === sortKey;
                return (
                  <th
                    key={i}
                    className={`px-4 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider ${col.className || ''}`}>
                    
                    <div className="flex flex-col gap-2">
                      <div
                        className={`flex items-center gap-1 ${col.sortable && sortKey ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200' : ''}`}
                        onClick={() =>
                        col.sortable &&
                        sortKey &&
                        handleSort(sortKey as string)
                        }>
                        
                        {col.header}
                        {col.sortable && sortKey &&
                        <span className="text-slate-400">
                            {isSorted ?
                          sortConfig.direction === 'asc' ?
                          <ArrowUp className="w-3 h-3" /> :

                          <ArrowDown className="w-3 h-3" /> :


                          <ArrowUpDown className="w-3 h-3 opacity-50" />
                          }
                          </span>
                        }
                      </div>
                      {showFilters && col.filterable && filterKey &&
                      <input
                        type="text"
                        placeholder={`Filter...`}
                        value={columnFilters[filterKey as string] || ''}
                        onChange={(e) =>
                        handleFilterChange(
                          filterKey as string,
                          e.target.value
                        )
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-2 py-1 text-xs font-normal normal-case bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-teal-500" />

                      }
                    </div>
                  </th>);

              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {displayData.length === 0 ?
            <tr>
                <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-500">
                
                  No data available
                </td>
              </tr> :

            displayData.map((row) =>
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>
              
                  {columns.map((col, i) =>
              <td
                key={i}
                className={`px-4 py-2 text-slate-700 dark:text-slate-300 ${col.className || ''}`}>
                
                      {typeof col.accessor === 'function' ?
                col.accessor(row) :
                row[col.accessor] as React.ReactNode}
                    </td>
              )}
                </tr>
            )
            }
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {!externalPagination &&
          <div className="flex items-center gap-2">
              <span>Show</span>
              <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setInternalPage(1);
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500">
              
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
          }
          <span>
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
        </div>

        {totalPages > 1 &&
        <div className="flex gap-1">
            <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
            
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">
            
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      </div>
    </div>);

}
