import { Shield, Lock, FileCheck, Globe, Server } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export function ComplianceBadges() {
  const badges = [
    {
      label: 'ISO 27001',
      icon: Shield,
      color: 'dark:text-blue-500',
      bg: 'dark:bg-blue-500/10',
      border: 'dark:border-blue-500/20',
    },
    {
      label: 'HIPAA',
      icon: FileCheck,
      color: 'dark:text-green-500',
      bg: 'dark:bg-green-500/10',
      border: 'dark:border-green-500/20',
    },
    {
      label: 'GDPR',
      icon: Globe,
      color: 'dark:text-purple-500',
      bg: 'dark:bg-purple-500/10',
      border: 'dark:border-purple-500/20',
    },
    {
      label: 'INPDP',
      icon: Lock,
      color: 'dark:text-amber-500',
      bg: 'dark:bg-amber-500/10',
      border: 'dark:border-amber-500/20',
      title: 'Instance Nationale de Protection des Données Personnelles',
    },
    {
      label: 'ANCS',
      icon: Server,
      color: 'dark:text-cyan-500',
      bg: 'dark:bg-cyan-500/10',
      border: 'dark:border-cyan-500/20',
      title: 'Agence Nationale de la Cybersécurité',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={cn(
            'flex cursor-help items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 shadow-sm transition-all hover:scale-105 sm:text-xs',
            badge.bg,
            badge.border,
            badge.color,
          )}
          title={badge.title || `${badge.label} Compliant`}
        >
          <badge.icon className={cn('h-3 w-3 text-slate-400', badge.color)} />

          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
