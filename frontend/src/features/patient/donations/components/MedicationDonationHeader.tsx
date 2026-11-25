import { AlertTriangleIcon, HeartHandshakeIcon, HeartIcon } from 'lucide-react';

export function MedicationDonationHeader({ onOpenLegalModal }: { onOpenLegalModal: () => void }) {
  return (
    <>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
        <HeartIcon className="absolute right-8 top-4 h-12 w-12 rotate-12 text-white/10" />
        <HeartHandshakeIcon className="absolute right-24 top-12 h-8 w-8 -rotate-6 text-white/10" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
              <HeartHandshakeIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                Plateforme solidaire
              </p>
              <h1 className="text-2xl font-bold leading-tight text-white">
                Don de Médicaments & Matériel
              </h1>
            </div>
          </div>

          <p className="mb-6 max-w-lg text-sm text-emerald-100">
            Donnez une seconde vie à vos médicaments et équipements médicaux. Aidez des familles
            dans le besoin gratuitement.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">247</div>
              <div className="text-xs text-emerald-200">Dons réalisés</div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">183</div>
              <div className="text-xs text-emerald-200">Bénéficiaires</div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/15 p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-xs text-emerald-200">Villes actives</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 dark:border-amber-700/30 dark:bg-amber-900/20">
        <div className="mx-auto flex max-w-4xl items-start gap-3 sm:items-center">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400 sm:mt-0" />

          <p className="flex-1 text-xs text-amber-700 dark:text-amber-300">
            <strong>Avertissement légal :</strong> Le don de médicaments est soumis à la
            réglementation tunisienne. Tous les dons sont vérifiés par notre équipe. Les médicaments
            lourds transitent via des pharmacies partenaires.
          </p>

          <button
            onClick={onOpenLegalModal}
            className="flex-shrink-0 text-xs font-semibold text-amber-700 underline transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
          >
            En savoir plus
          </button>
        </div>
      </div>
    </>
  );
}
