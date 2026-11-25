import { Clock, MapPin, User } from 'lucide-react';

import type { ProviderClaimFormData } from '@/features/insurance/provider-insurance/providerFileClaim.hooks';
import { DatePickerField } from '@/shared/ui/composites/date-picker-field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

const EMPTY_CLAIM_TYPE_VALUE = '__empty_claim_type__';

export function ClaimDetailsStep({
  formData,
  inputClass,
  labelClass,
  onNext,
  onUpdate,
}: {
  formData: ProviderClaimFormData;
  inputClass: string;
  labelClass: string;
  onNext: () => void;
  onUpdate: <Key extends keyof ProviderClaimFormData>(
    key: Key,
    value: ProviderClaimFormData[Key],
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Type de sinistre *</label>
        <Select
          value={formData.type || EMPTY_CLAIM_TYPE_VALUE}
          onValueChange={(value) => onUpdate('type', value === EMPTY_CLAIM_TYPE_VALUE ? '' : value)}
        >
          <SelectTrigger
            aria-label="Type de sinistre"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
          >
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={EMPTY_CLAIM_TYPE_VALUE}>Sélectionnez un type</SelectItem>
              <SelectItem value="medical_error">Erreur médicale</SelectItem>
              <SelectItem value="material_damage">Dommage matériel</SelectItem>
              <SelectItem value="bodily_injury">Dommage corporel</SelectItem>
              <SelectItem value="theft">Vol / Perte de matériel</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <DatePickerField
          id="claim-incident-date"
          label="Date de l'incident *"
          value={formData.date}
          onChange={(value) => onUpdate('date', value)}
          labelClassName={labelClass}
          triggerClassName={inputClass}
          required
        />
        <div>
          <label className={labelClass}>Heure approximative *</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="time"
              value={formData.time}
              onChange={(event) => onUpdate('time', event.target.value)}
              className={`${inputClass} pl-12`}
            />
          </div>
        </div>
      </div>
      <div>
        <label className={labelClass}>Lieu de l'incident *</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={formData.location}
            onChange={(event) => onUpdate('location', event.target.value)}
            placeholder="Adresse complète"
            className={`${inputClass} pl-12`}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Patient concerné (si applicable)</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={formData.patientName}
            onChange={(event) => onUpdate('patientName', event.target.value)}
            placeholder="Nom du patient"
            className={`${inputClass} pl-12`}
          />
        </div>
      </div>
      <div className="flex justify-end pt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.type || !formData.date || !formData.time || !formData.location}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
