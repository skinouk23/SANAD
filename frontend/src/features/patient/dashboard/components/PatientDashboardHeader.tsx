import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { PatientDashboardScreenViewModel } from '@/features/patient/dashboard/usePatientDashboardScreen';
import { Skeleton } from '@/shared/ui/composites/loading';

interface PatientDashboardHeaderProps {
  screen: PatientDashboardScreenViewModel;
  onOpenNotifications: () => void;
}

export function PatientDashboardHeader({
  screen,
  onOpenNotifications,
}: PatientDashboardHeaderProps) {
  const { notificationsLoading, notificationsUnreadCount, text } = screen;
  const navigate = useNavigate();

  return (
    <div className="border-b border-slate-200 bg-white/80 px-4 pb-8 pt-4 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-none">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
            {text.dashboard.hello}
          </p>
          <h1 className="mb-1.5 text-2xl font-bold text-slate-900 dark:text-white">
            {screen.patientLoading ? (
              <Skeleton className="inline-block h-7 w-36 rounded" />
            ) : (
              `${screen.patientName || text.auth.patient} 👋`
            )}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {text.dashboard.healthTracking}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={text.notifications.title}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300 dark:shadow-none dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Bell className="h-5 w-5" />
            {!notificationsLoading && notificationsUnreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                {notificationsUnreadCount > 9 ? '9+' : notificationsUnreadCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/mon-espace');
            }}
            aria-label="Ouvrir mon espace patient"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-cyan-500 to-blue-500 text-xl shadow-lg transition-transform hover:scale-105 active:scale-[0.96] dark:border-slate-700 dark:shadow-none"
          >
            👤
          </button>
        </div>
      </div>
    </div>
  );
}
