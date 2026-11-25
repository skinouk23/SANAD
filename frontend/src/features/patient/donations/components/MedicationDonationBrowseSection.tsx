import {
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
  PillIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
} from 'lucide-react';

import {
  donationConditionLabels,
  donationInputClassName,
  donationStatusConfig,
} from '@/features/patient/donations/medicationDonation.data';
import type { Donation } from '@/features/patient/donations/medicationDonation.types';
import type { MedicationDonationScreenViewModel } from '@/features/patient/donations/useMedicationDonationScreen';

function DonationCard({
  donation,
  onRequest,
}: {
  donation: Donation;
  onRequest: (donation: Donation) => void;
}) {
  const status = donationStatusConfig[donation.status];
  const isMedication = donation.type === 'medication';

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-400/60 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-emerald-500/40">
      <div
        className={`h-1.5 w-full ${isMedication ? 'bg-gradient-to-r from-rose-400 to-pink-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
      />

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${isMedication ? 'bg-rose-50 dark:bg-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/20'}`}
            >
              {isMedication ? (
                <PillIcon className="h-5 w-5 text-rose-500 dark:text-rose-400" />
              ) : (
                <PackageIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
                {donation.name}
              </h3>
              {donation.brand ? (
                <p className="text-xs text-slate-400 dark:text-slate-500">{donation.brand}</p>
              ) : null}
            </div>
          </div>

          <span
            className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {donation.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {donationConditionLabels[donation.condition]}
          </span>
          {donation.requiresPrescription ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              📋 Ordonnance requise
            </span>
          ) : null}
        </div>

        <div className="mb-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{donation.location}</span>
            <span className="mx-1">•</span>
            <span>
              {donation.quantity} {donation.unit}
            </span>
          </div>

          {donation.expiryDate ? (
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Expire : {donation.expiryDate}</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {donation.donorName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {donation.donorName}
                </span>
                {donation.donorVerified ? (
                  <ShieldCheckIcon className="h-3 w-3 text-emerald-500" />
                ) : null}
              </div>

              <div className="flex items-center gap-0.5">
                <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {donation.donorRating}
                </span>
              </div>
            </div>
          </div>

          {donation.status === 'available' ? (
            <button
              onClick={() => {
                onRequest(donation);
              }}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/25"
            >
              Demander
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function MedicationDonationBrowseSection({
  screen,
}: {
  screen: MedicationDonationScreenViewModel;
}) {
  const resultCount = screen.filteredDonations.length;

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <input
            type="text"
            value={screen.searchQuery}
            onChange={(event) => {
              screen.onSearchQueryChange(event.target.value);
            }}
            placeholder="Rechercher médicament, équipement, ville..."
            className={`${donationInputClassName} pl-10`}
          />
        </div>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {screen.browseCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              screen.onCategoryFilterChange(category.id);
            }}
            className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${screen.categoryFilter === category.id ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/15' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500/50'}`}
          >
            {category.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${screen.categoryFilter === category.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>

      <div>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          {resultCount} annonce
          {resultCount > 1 ? 's' : ''} disponible
          {resultCount > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {screen.filteredDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onRequest={screen.onOpenRequestModal}
            />
          ))}
        </div>

        {resultCount === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/40">
            <div className="mb-3 text-4xl">🔍</div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              Aucun résultat trouvé
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Essayez d'autres mots-clés
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
