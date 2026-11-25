import { MedicationDonationDialogs } from '@/features/patient/donations/components/MedicationDonationDialogs';
import { MedicationDonationHeader } from '@/features/patient/donations/components/MedicationDonationHeader';
import { MedicationDonationSections } from '@/features/patient/donations/components/MedicationDonationSections';
import { MedicationDonationTabs } from '@/features/patient/donations/components/MedicationDonationTabs';
import { useMedicationDonationScreen } from '@/features/patient/donations/useMedicationDonationScreen';

export function MedicationDonationScreen() {
  const screen = useMedicationDonationScreen();

  return (
    <>
      <div className="min-h-screen pb-24">
        <MedicationDonationHeader onOpenLegalModal={screen.onOpenLegalModal} />

        <div className="mx-auto max-w-4xl px-4 py-6">
          <MedicationDonationTabs screen={screen} />
          <MedicationDonationSections screen={screen} />
        </div>
      </div>

      <MedicationDonationDialogs screen={screen} />
    </>
  );
}
