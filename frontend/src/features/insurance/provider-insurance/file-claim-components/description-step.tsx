import { Info } from 'lucide-react';

import type { ProviderClaimFormData } from '@/features/insurance/provider-insurance/providerFileClaim.hooks';
import { Checkbox } from '@/shared/ui/primitives/checkbox';

export function ClaimDescriptionStep({
  formData,
  inputClass,
  isSubmitting,
  labelClass,
  onBack,
  onNext,
  onUpdate,
}: {
  formData: ProviderClaimFormData;
  inputClass: string;
  isSubmitting: boolean;
  labelClass: string;
  onBack: () => void;
  onNext: () => void;
  onUpdate: <Key extends keyof ProviderClaimFormData>(
    key: Key,
    value: ProviderClaimFormData[Key],
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 backdrop-blur-sm dark:border-blue-700/30 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Décrivez les circonstances exactes de l'incident. Soyez le plus précis possible sur le
            déroulement des faits.
          </p>
        </div>
      </div>
      <div>
        <label className={labelClass}>Description détaillée *</label>
        <textarea
          value={formData.description}
          onChange={(event) => onUpdate('description', event.target.value)}
          rows={4}
          placeholder="Que s'est-il passé exactement ?"
          className={`${inputClass} resize-none`}
        />
      </div>
      <div>
        <label className={labelClass}>Témoins éventuels</label>
        <textarea
          value={formData.witnesses}
          onChange={(event) => onUpdate('witnesses', event.target.value)}
          rows={2}
          placeholder="Noms et coordonnées des témoins (si applicable)"
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="claim-police-report"
          checked={formData.policeReport}
          onCheckedChange={(checked) => onUpdate('policeReport', checked === true)}
        />
        <label
          className="cursor-pointer text-sm text-slate-700 dark:text-slate-300"
          htmlFor="claim-police-report"
        >
          Un rapport de police a été établi
        </label>
      </div>
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!formData.description || formData.description.length < 20}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
