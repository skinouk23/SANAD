import {
  PatientAppointmentDetailsDialog,
  PatientRatingDialog,
  PatientTrackingDialog,
} from '@/features/patient/appointments/components/PatientAppointmentsDialogs';
import { PatientAppointmentsHeader } from '@/features/patient/appointments/components/PatientAppointmentsHeader';
import { PatientAppointmentsSections } from '@/features/patient/appointments/components/PatientAppointmentsSections';
import { usePatientAppointmentsScreen } from '@/features/patient/appointments/usePatientAppointmentsScreen';

export function PatientAppointmentsScreen() {
  const screen = usePatientAppointmentsScreen();

  return (
    <>
      <div className="min-h-screen">
        <div className="relative z-10">
          <PatientAppointmentsHeader screen={screen} />

          <div className="mx-auto max-w-7xl px-6 py-4 pb-12">
            <PatientAppointmentsSections screen={screen} />
          </div>
        </div>
      </div>

      <PatientRatingDialog screen={screen} />
      <PatientTrackingDialog screen={screen} />
      <PatientAppointmentDetailsDialog screen={screen} />
    </>
  );
}
