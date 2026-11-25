import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
export function Card({
  children,
  className = '',
  onClick,
  hover = false,
  padding = 'md'
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-100 shadow-sm
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}>
      
      {children}
    </div>);

}