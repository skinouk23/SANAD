import React from 'react';
import { Shield, Lock, FileCheck, Globe, Server } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
export function ComplianceBadges() {
  const { isDark } = useTheme();
  const badges = [
  {
    label: 'ISO 27001',
    icon: Shield,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    label: 'HIPAA',
    icon: FileCheck,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  {
    label: 'GDPR',
    icon: Globe,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    label: 'INPDP',
    icon: Lock,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: 'Instance Nationale de Protection des Données Personnelles'
  },
  {
    label: 'ANCS',
    icon: Server,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: 'Agence Nationale de la Cybersécurité'
  }];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      {badges.map((badge) =>
      <div
        key={badge.label}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-medium transition-all hover:scale-105 cursor-help ${isDark ? `${badge.bg} ${badge.border} ${badge.color}` : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
        title={badge.title || `${badge.label} Compliant`}>
        
          <badge.icon
          className={`h-3 w-3 ${isDark ? badge.color : 'text-slate-400'}`} />
        
          <span>{badge.label}</span>
        </div>
      )}
    </div>);

}