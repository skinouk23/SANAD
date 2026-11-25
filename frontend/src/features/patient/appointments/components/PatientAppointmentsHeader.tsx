import type {
  PatientAppointmentsScreenViewModel,
  PatientAppointmentsTab,
} from '@/features/patient/appointments/usePatientAppointmentsScreen';

interface AppointmentTabButtonProps {
  tab: PatientAppointmentsTab;
  label: string;
  count?: number;
  activeTab: PatientAppointmentsTab;
  accent: 'cyan' | 'amber';
  onSelect: (tab: PatientAppointmentsTab) => void;
}

function AppointmentTabButton({
  tab,
  label,
  count,
  activeTab,
  accent,
  onSelect,
}: AppointmentTabButtonProps) {
  const isActive = activeTab === tab;
  const activeTextClassName =
    accent === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400';
  const activeBarClassName =
    accent === 'amber'
      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
      : 'bg-gradient-to-r from-cyan-500 to-blue-500';
  const activeBadgeClassName =
    accent === 'amber'
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
      : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400';

  return (
    <button
      type="button"
      onClick={() => {
        onSelect(tab);
      }}
      className={`relative whitespace-nowrap px-3 py-2 text-xs font-medium transition-all ${isActive ? activeTextClassName : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
    >
      {label}
      {typeof count === 'number' && count > 0 ? (
        <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${activeBadgeClassName}`}>
          {count}
        </span>
      ) : null}
      {isActive ? (
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeBarClassName}`}></div>
      ) : null}
    </button>
  );
}

export function PatientAppointmentsHeader({
  screen,
}: {
  screen: PatientAppointmentsScreenViewModel;
}) {
  const { text } = screen;

  return (
    <>
      <div className="border-b border-slate-200 bg-white/80 px-6 pb-3 pt-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[14px] p-[2px]">
            <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#06b6d4_100%)]" />
            <div className="relative rounded-[12px] bg-white/95 px-4 py-2.5 backdrop-blur-xl dark:bg-slate-900/95">
              <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                {text.mySpace.title}
              </p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {text.mySpace.serviceHistory}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white/60 px-6 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/30">
        <div className="mx-auto flex max-w-7xl gap-1">
          <AppointmentTabButton
            tab="appointments"
            label={text.mySpace.upcomingAppointments}
            count={screen.actionableUpcomingAppointments.length}
            activeTab={screen.activeTab}
            accent="cyan"
            onSelect={screen.onSetActiveTab}
          />
          <AppointmentTabButton
            tab="history"
            label={text.mySpace.historyTab}
            activeTab={screen.activeTab}
            accent="cyan"
            onSelect={screen.onSetActiveTab}
          />
        </div>
      </div>
    </>
  );
}
