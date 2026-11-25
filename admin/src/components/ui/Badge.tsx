import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'rose' | 'amber' | 'gray' | 'success';
  className?: string;
  icon?: React.ReactNode;
}
export function Badge({
  children,
  variant = 'gray',
  className = '',
  icon
}: BadgeProps) {
  const variants = {
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };
  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant]}
      ${className}
    `}>
      
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>);

}