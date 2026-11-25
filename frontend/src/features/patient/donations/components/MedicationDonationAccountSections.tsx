import { BadgeCheckIcon, ClockIcon, PlusIcon, UsersIcon } from 'lucide-react';

import type { MedicationDonationScreenViewModel } from '@/features/patient/donations/useMedicationDonationScreen';

export function MedicationDonationMyRequestsSection({
  screen,
}: {
  screen: MedicationDonationScreenViewModel;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mes demandes de don</h3>

      {screen.myRequests.map((request) => (
        <div
          key={request.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{request.donationName}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Donateur : {request.donorName}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${request.status === 'accepted' ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400' : 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'}`}
            >
              {request.status === 'accepted' ? '✓ Acceptée' : '⏳ En attente'}
            </span>
          </div>

          <p className="mb-3 text-sm italic text-slate-500 dark:text-slate-400">
            "{request.message}"
          </p>

          <div className="flex items-center gap-2">
            <ClockIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Demandé le {request.requestDate}
            </span>
          </div>

          {request.status === 'accepted' ? (
            <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              Contacter le donateur
            </button>
          ) : null}
        </div>
      ))}

      {screen.myRequests.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/40">
          <div className="mb-3 text-4xl">📋</div>
          <p className="font-semibold text-slate-600 dark:text-slate-300">Aucune demande</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Parcourez les annonces pour faire une demande
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function MedicationDonationMyDonationsSection({
  screen,
}: {
  screen: MedicationDonationScreenViewModel;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mes dons publiés</h3>

        <button
          onClick={() => {
            screen.onActiveTabChange('post');
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/20"
        >
          <PlusIcon className="h-4 w-4" />
          Nouveau don
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/30 dark:bg-emerald-900/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <BadgeCheckIcon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            Donateur Solidaire Vérifié
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400/70">
            1 don réalisé • Score de confiance : 4.8/5
          </p>
        </div>
      </div>

      {screen.myDonations.map((donation) => (
        <div
          key={donation.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{donation.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Publié le {donation.postedDate}
              </p>
            </div>

            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
              Donné ✓
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <UsersIcon className="h-3.5 w-3.5" />
            <span>{donation.requests} demandes reçues</span>
          </div>
        </div>
      ))}

      {screen.myDonations.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center dark:border-slate-700 dark:bg-slate-800/40">
          <div className="mb-3 text-4xl">💚</div>
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            Vous n'avez pas encore publié de don
          </p>
          <button
            onClick={() => {
              screen.onActiveTabChange('post');
            }}
            className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Publier mon premier don
          </button>
        </div>
      ) : null}
    </div>
  );
}
