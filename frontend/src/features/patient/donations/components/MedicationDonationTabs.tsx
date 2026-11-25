import type { MedicationDonationScreenViewModel } from '@/features/patient/donations/useMedicationDonationScreen';

export function MedicationDonationTabs({ screen }: { screen: MedicationDonationScreenViewModel }) {
  return (
    <div className="scrollbar-hide mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/60">
      {screen.donationTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            screen.onActiveTabChange(tab.id);
          }}
          className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${screen.activeTab === tab.id ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
