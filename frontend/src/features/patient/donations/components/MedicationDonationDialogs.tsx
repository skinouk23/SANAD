import { AlertTriangleIcon, UploadIcon, XIcon } from 'lucide-react';

import { donationInputClassName } from '@/features/patient/donations/medicationDonation.data';
import type { MedicationDonationScreenViewModel } from '@/features/patient/donations/useMedicationDonationScreen';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

export function MedicationDonationDialogs({
  screen,
}: {
  screen: MedicationDonationScreenViewModel;
}) {
  return (
    <>
      {screen.showRequestModal && screen.selectedDonation ? (
        <Dialog
          open={screen.showRequestModal}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              screen.onCloseRequestModal();
            }
          }}
        >
          <DialogContent showCloseButton={false} size="md">
            <DialogHeader className="flex-row items-center justify-between gap-4">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Demander ce don
              </DialogTitle>

              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Fermer la demande de don"
                  className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </DialogClose>
            </DialogHeader>

            <DialogBody className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {screen.selectedDonation.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {screen.selectedDonation.category} • {screen.selectedDonation.location}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Expliquez votre besoin *
                  </label>
                  <textarea
                    value={screen.requestMessage}
                    onChange={(event) => {
                      screen.onRequestMessageChange(event.target.value);
                    }}
                    rows={3}
                    placeholder="Décrivez brièvement pourquoi vous avez besoin de ce don..."
                    className={`${donationInputClassName} resize-none`}
                  />
                </div>

                {screen.selectedDonation.requiresPrescription ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-700/30 dark:bg-amber-900/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />

                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Ce médicament nécessite une ordonnance. Vous devrez fournir une ordonnance
                        médicale valide.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {screen.selectedDonation.requiresPrescription
                      ? 'Ordonnance médicale *'
                      : 'Justificatif médical (optionnel)'}
                  </label>
                  <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 p-4 text-center transition-all hover:border-emerald-400 dark:border-slate-700 dark:hover:border-emerald-500/50">
                    <UploadIcon className="mx-auto mb-1 h-6 w-6 text-slate-400 dark:text-slate-500" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Télécharger le document
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={screen.onCloseRequestModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>

                <button
                  onClick={screen.onSubmitRequest}
                  disabled={!screen.requestMessage}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Envoyer la demande
                </button>
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : null}

      {screen.showLegalModal ? (
        <Dialog
          open={screen.showLegalModal}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              screen.onCloseLegalModal();
            }
          }}
        >
          <DialogContent showCloseButton={false} size="md" scroll="content">
            <DialogHeader className="flex-row items-center justify-between gap-4">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Informations légales
              </DialogTitle>

              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Fermer les informations légales"
                  className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </DialogClose>
            </DialogHeader>

            <DialogBody className="space-y-5">
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/30 dark:bg-amber-900/20">
                  <p className="mb-2 font-bold text-amber-700 dark:text-amber-300">
                    ⚠️ Réglementation tunisienne
                  </p>
                  <p className="text-amber-700 dark:text-amber-300">
                    Le don de médicaments est soumis à la réglementation du Ministère de la Santé
                    tunisien. Toute transaction doit respecter les lois en vigueur.
                  </p>
                </div>

                <div>
                  <p className="mb-1 font-semibold">Médicaments acceptés :</p>
                  <ul className="list-inside list-disc space-y-1 text-xs">
                    <li>Non ouverts et non périmés (expiry &gt; 3 mois)</li>
                    <li>Conservés dans des conditions appropriées</li>
                    <li>Accompagnés de leur emballage d'origine</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1 font-semibold">Médicaments exclus :</p>
                  <ul className="list-inside list-disc space-y-1 text-xs">
                    <li>Médicaments entamés ou périmés</li>
                    <li>Stupéfiants et psychotropes réglementés</li>
                    <li>Médicaments sans emballage d'origine</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-1 font-semibold">Médicaments lourds (cancer, Alzheimer) :</p>
                  <p className="text-xs">
                    Ces médicaments transitent obligatoirement via nos pharmacies partenaires ou ONG
                    médicales agréées. Aucune transaction directe particulier à particulier n'est
                    autorisée.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800">
                  <p>
                    En utilisant cette plateforme, vous acceptez notre clause de non-responsabilité.
                    Sanad ne peut être tenu responsable de l'utilisation des médicaments donnés.
                  </p>
                </div>
              </div>

              <button
                onClick={screen.onCloseLegalModal}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                J'ai compris
              </button>
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
