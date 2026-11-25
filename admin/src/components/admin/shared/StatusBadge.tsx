import React from 'react';
import { clsx } from 'clsx';
interface StatusBadgeProps {
  status: string;
  className?: string;
}
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
  if (['active', 'completed', 'approve', 'success'].includes(normalized)) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['pending', 'review', 'warning'].includes(normalized)) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (
  [
  'suspended',
  'blocked',
  'rejected',
  'failed',
  'error',
  'high',
  'critical'].
  includes(normalized))
  {
    colorClass = 'bg-red-50 text-red-700 border-red-200';
  } else if (['info', 'low'].includes(normalized)) {
    colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
  }
  return (
    <span
      className={clsx(
        'px-2 py-0.5 text-xs font-medium rounded-full border',
        colorClass,
        className
      )}>
      
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>);

}