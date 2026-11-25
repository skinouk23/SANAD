import { useState } from 'react';

import {
  PatientAddFamilyMemberDialog,
  PatientEmergencyDialog,
  PatientFamilyManagementDialog,
} from '@/features/patient/dashboard/components/PatientDashboardDialogs';
import { PatientDashboardHeader } from '@/features/patient/dashboard/components/PatientDashboardHeader';
import { PatientDashboardSections } from '@/features/patient/dashboard/components/PatientDashboardSections';
import { NotificationsPanel } from '@/features/patient/dashboard/components/NotificationsPanel';
import { usePatientDashboardScreen } from '@/features/patient/dashboard/usePatientDashboardScreen';

export function PatientDashboardScreen() {
  const screen = usePatientDashboardScreen();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <div className="min-h-screen">
        <div className="relative z-10">
          <PatientDashboardHeader
            screen={screen}
            onOpenNotifications={() => {
              setShowNotifications(true);
            }}
          />

          <div className="mx-auto -mt-6 max-w-7xl px-4 pb-20">
            <PatientDashboardSections screen={screen} />
          </div>
        </div>
      </div>

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => {
          setShowNotifications(false);
        }}
      />
      {screen.isFamilyCircleFeatureActive ? (
        <>
          <PatientFamilyManagementDialog screen={screen} />
          <PatientAddFamilyMemberDialog screen={screen} />
        </>
      ) : null}
      <PatientEmergencyDialog screen={screen} />
    </>
  );
}
