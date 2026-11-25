import React from 'react';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </h3>
        <div className="p-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-md">
          <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-white">
          {value}
        </span>
        {trend &&
        <span
          className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
        }
      </div>
      {description &&
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      }
    </div>);

}