import {
  Car,
  Clock,
  DollarSign,
  Edit,
  FileText,
  Flower2,
  Globe,
  Heart,
  MapPin,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';

import { getServiceLocationLabel } from '@/features/providers/providerServiceForm';

import type { ServiceView } from '@/features/providers/services/serviceManagement.types';

interface ProviderServiceCardProps {
  configGradient?: string;
  service: ServiceView;
  isActive: boolean;
  userServiceType: string;
  formatDuration: (duration: number) => string;
  onEdit: (service: ServiceView) => void;
  onToggle: (id: string) => void;
  onDelete: (service: ServiceView) => void;
}

const DEFAULT_CONFIG_GRADIENT = 'from-cyan-500 to-blue-500';

export function ProviderServiceCard({
  configGradient,
  service,
  isActive,
  userServiceType,
  formatDuration,
  onEdit,
  onToggle,
  onDelete,
}: ProviderServiceCardProps) {
  const isFuneral = userServiceType === 'funeral';
  const cardGradient = configGradient ?? DEFAULT_CONFIG_GRADIENT;

  return (
    <div className={`group relative overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-r ${cardGradient} opacity-0 transition-all group-hover:opacity-5`}
      />
      <div
        className={`relative rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm transition-all dark:border-slate-700 dark:bg-slate-800/50 ${isActive ? 'group-hover:border-cyan-500/50 dark:group-hover:border-cyan-500/50' : ''}`}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3
            className={`text-sm font-bold text-slate-900 transition-colors dark:text-white ${isActive ? 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' : ''}`}
          >
            {service.name}
          </h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${isActive ? 'border-green-500/50 bg-green-500/20 text-green-500' : 'border-slate-300 bg-slate-200 text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}
          >
            {isActive ? 'Actif' : 'Désactivé'}
          </span>
          {isFuneral && service.available24h ? (
            <span className="rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
              24h/24
            </span>
          ) : null}
          {isFuneral && service.repatriation ? (
            <span className="flex items-center gap-1 rounded-full border border-blue-500/50 bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
              <Globe className="h-3 w-3" />
              Rapatriement
            </span>
          ) : null}
        </div>

        <p
          className={`mb-3 w-full text-xs ${isActive ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}
        >
          {service.description}
        </p>

        {isFuneral ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {service.ceremonyType ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {service.ceremonyType === 'religious'
                  ? '🕌 Religieuse'
                  : service.ceremonyType === 'civil'
                    ? '🏛️ Civile'
                    : '🕌🏛️ Les deux'}
              </span>
            ) : null}
            {service.burialType ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {service.burialType === 'burial'
                  ? 'Inhumation'
                  : service.burialType === 'cremation'
                    ? 'Crémation'
                    : 'Inh. & Crém.'}
              </span>
            ) : null}
            {service.floralService ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <Flower2 className="mr-1 inline h-3 w-3" />
                Fleurs
              </span>
            ) : null}
            {service.transportService ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <Car className="mr-1 inline h-3 w-3" />
                Transport
              </span>
            ) : null}
            {service.adminAssistance ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <FileText className="mr-1 inline h-3 w-3" />
                Admin
              </span>
            ) : null}
            {service.griefSupport ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <Heart className="mr-1 inline h-3 w-3" />
                Deuil
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          className={`mb-3 flex items-center justify-between text-[10px] ${isActive ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}
        >
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold">
              {isFuneral ? `À partir de ${service.price}` : service.price} TND
            </span>
          </div>
          {!isFuneral ? (
            <>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                <span>{formatDuration(service.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                <span>{getServiceLocationLabel(service.location)}</span>
              </div>
            </>
          ) : null}
        </div>

        {!isFuneral && (service.isUrgent || service.requiresPrescription) ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {service.isUrgent ? (
              <span className="rounded-full border border-amber-500/50 bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                ⚡ Urgence
              </span>
            ) : null}
            {service.requiresPrescription ? (
              <span className="rounded-full border border-blue-500/50 bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
                📋 Ordonnance
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            aria-label={`Modifier ${service.name}`}
            onClick={() => onEdit(service)}
            className="rounded-lg border border-slate-200 bg-slate-100 p-1.5 transition-all hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
          >
            <Edit className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
          </button>
          <button
            type="button"
            aria-label={`${isActive ? 'Désactiver' : 'Activer'} ${service.name}`}
            onClick={() => onToggle(service.id)}
            className={`rounded-lg border p-1.5 transition-all ${isActive ? 'border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30' : 'border-green-500/50 bg-green-500/20 hover:bg-green-500/30'}`}
          >
            {isActive ? (
              <ToggleLeft className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <ToggleRight className="h-3.5 w-3.5 text-green-500" />
            )}
          </button>
          <button
            type="button"
            aria-label={`Supprimer ${service.name}`}
            onClick={() => onDelete(service)}
            className="rounded-lg border border-red-500/50 bg-red-500/20 p-1.5 transition-all hover:bg-red-500/30"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
