import React from 'react';
import { Search, Filter } from 'lucide-react';
interface FilterOption {
  label: string;
  value: string;
}
interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}
interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterGroup[];
  actions?: React.ReactNode;
}
export function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters,
  actions
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mb-4 shadow-sm">
      <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" />
          
        </div>

        {filters && filters.length > 0 &&
        <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {filters.map((filter) =>
          <select
            key={filter.id}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="py-1.5 pl-2 pr-6 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none">
            
                <option value="">{filter.label}</option>
                {filter.options.map((opt) =>
            <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
            )}
              </select>
          )}
          </div>
        }
      </div>

      {actions &&
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {actions}
        </div>
      }
    </div>);

}