import { Fragment } from 'react';
import { CheckCircleIcon, InfoIcon, UploadIcon } from 'lucide-react';

import { donationInputClassName } from '@/features/patient/donations/medicationDonation.data';
import type { DonationCondition } from '@/features/patient/donations/medicationDonation.types';
import type { MedicationDonationScreenViewModel } from '@/features/patient/donations/useMedicationDonationScreen';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Field, FieldLabel } from '@/shared/ui/primitives/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

const EMPTY_DONATION_CATEGORY_VALUE = '__empty_donation_category__';
const donationSelectTriggerClassName =
  'h-10 w-full rounded-xl border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white';

export function MedicationDonationPostSection({
  screen,
}: {
  screen: MedicationDonationScreenViewModel;
}) {
  return (
    <div className="space-y-5">
      <div className="mb-6 flex items-center gap-2">
        {screen.postSteps.map((step) => (
          <Fragment key={step.id}>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${screen.postStep >= step.id ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}
            >
              {screen.postStep > step.id ? '✓' : step.id}
            </div>

            {step.id < 3 ? (
              <div
                className={`h-0.5 flex-1 rounded-full ${screen.postStep > step.id ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            ) : null}
          </Fragment>
        ))}
      </div>

      <div className="mb-6 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        {screen.postSteps.map((step) => (
          <span
            key={step.id}
            className={screen.postStep >= step.id ? 'text-emerald-600 dark:text-emerald-400' : ''}
          >
            {step.label}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
        {screen.postStep === 1 ? (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Que souhaitez-vous donner ?
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  screen.updatePostForm('type', 'medication');
                }}
                className={`rounded-2xl border-2 p-5 text-center transition-all ${screen.postForm.type === 'medication' ? 'border-rose-400 bg-rose-50 shadow-sm dark:bg-rose-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
              >
                <div className="mb-2 text-3xl">💊</div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Médicament</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Cancer, Alzheimer, Chronique...
                </p>
              </button>

              <button
                onClick={() => {
                  screen.updatePostForm('type', 'equipment');
                }}
                className={`rounded-2xl border-2 p-5 text-center transition-all ${screen.postForm.type === 'equipment' ? 'border-emerald-400 bg-emerald-50 shadow-sm dark:bg-emerald-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'}`}
              >
                <div className="mb-2 text-3xl">🦽</div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Matériel</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Fauteuil, béquilles, lit...
                </p>
              </button>
            </div>

            <Field>
              <FieldLabel
                htmlFor="donation-category"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Catégorie spécifique
              </FieldLabel>
              <Select
                value={screen.postForm.category || EMPTY_DONATION_CATEGORY_VALUE}
                onValueChange={(value) => {
                  screen.updatePostForm(
                    'category',
                    value === EMPTY_DONATION_CATEGORY_VALUE ? '' : value,
                  );
                }}
              >
                <SelectTrigger id="donation-category" className={donationSelectTriggerClassName}>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={EMPTY_DONATION_CATEGORY_VALUE}>Sélectionner...</SelectItem>
                    {screen.postCategoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <button
              onClick={() => {
                screen.onPostStepChange(2);
              }}
              disabled={!screen.canContinueToPostDetails}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuer →
            </button>
          </div>
        ) : null}

        {screen.postStep === 2 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Détails du don</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={screen.postForm.name}
                  onChange={(event) => {
                    screen.updatePostForm('name', event.target.value);
                  }}
                  placeholder="Ex: Imatinib 400mg"
                  className={donationInputClassName}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Marque
                </label>
                <input
                  type="text"
                  value={screen.postForm.brand}
                  onChange={(event) => {
                    screen.updatePostForm('brand', event.target.value);
                  }}
                  placeholder="Ex: Gleevec"
                  className={donationInputClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Quantité *
                </label>
                <input
                  type="number"
                  value={screen.postForm.quantity}
                  onChange={(event) => {
                    screen.updatePostForm('quantity', event.target.value);
                  }}
                  placeholder="Ex: 30"
                  className={donationInputClassName}
                />
              </div>

              <Field>
                <FieldLabel
                  htmlFor="donation-unit"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Unité
                </FieldLabel>
                <Select
                  value={screen.postForm.unit}
                  onValueChange={(value) => {
                    screen.updatePostForm('unit', value);
                  }}
                >
                  <SelectTrigger id="donation-unit" className={donationSelectTriggerClassName}>
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {screen.postUnitOptions.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  htmlFor="donation-condition"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  État
                </FieldLabel>
                <Select
                  value={screen.postForm.condition}
                  onValueChange={(value) => {
                    screen.updatePostForm('condition', value as DonationCondition);
                  }}
                >
                  <SelectTrigger id="donation-condition" className={donationSelectTriggerClassName}>
                    <SelectValue placeholder="État" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="new">Neuf (non ouvert)</SelectItem>
                      <SelectItem value="very-good">Très bon état</SelectItem>
                      <SelectItem value="good">Bon état</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ville *
                </label>
                <input
                  type="text"
                  value={screen.postForm.location}
                  onChange={(event) => {
                    screen.updatePostForm('location', event.target.value);
                  }}
                  placeholder="Ex: Tunis"
                  className={donationInputClassName}
                />
              </div>
            </div>

            {screen.postForm.type === 'medication' ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date d'expiration
                </label>
                <input
                  type="month"
                  value={screen.postForm.expiryDate}
                  onChange={(event) => {
                    screen.updatePostForm('expiryDate', event.target.value);
                  }}
                  className={donationInputClassName}
                />
              </div>
            ) : null}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                value={screen.postForm.description}
                onChange={(event) => {
                  screen.updatePostForm('description', event.target.value);
                }}
                rows={3}
                placeholder="Décrivez l'état du produit, la raison du don..."
                className={`${donationInputClassName} resize-none`}
              />
            </div>

            <Field orientation="horizontal" className="items-center gap-3">
              <Checkbox
                id="donation-requires-prescription"
                checked={screen.postForm.requiresPrescription}
                onCheckedChange={(checked) => {
                  screen.updatePostForm('requiresPrescription', checked === true);
                }}
                className="border-slate-300 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white dark:border-slate-600"
              />

              <FieldLabel
                htmlFor="donation-requires-prescription"
                className="text-sm text-slate-700 dark:text-slate-300"
              >
                Ordonnance requise pour ce don
              </FieldLabel>
            </Field>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Photo du produit
              </label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-all hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-emerald-500/50">
                <UploadIcon className="mx-auto mb-2 h-8 w-8 text-slate-400 dark:text-slate-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Cliquez pour ajouter une photo
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
                  PNG, JPG jusqu'à 5MB
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  screen.onPostStepChange(1);
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ← Retour
              </button>

              <button
                onClick={() => {
                  screen.onPostStepChange(3);
                }}
                disabled={!screen.canContinueToPostConfirmation}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuer →
              </button>
            </div>
          </div>
        ) : null}

        {screen.postStep === 3 ? (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Confirmation du don
            </h3>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Type</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {screen.postForm.type === 'medication' ? '💊 Médicament' : '🦽 Matériel'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Produit</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {screen.postForm.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Quantité</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {screen.postForm.quantity} {screen.postForm.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Ville</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {screen.postForm.location}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/30 dark:bg-amber-900/20">
              <div className="flex items-start gap-2">
                <InfoIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />

                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Votre annonce sera examinée par notre équipe sous 24-48h avant publication. Vous
                  recevrez une notification dès validation.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  screen.onPostStepChange(2);
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                ← Retour
              </button>

              <button
                onClick={screen.onSubmitDonation}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <CheckCircleIcon className="h-5 w-5" />
                Soumettre le don
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
