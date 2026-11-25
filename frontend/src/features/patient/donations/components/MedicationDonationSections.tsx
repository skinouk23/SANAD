import { MedicationDonationBrowseSection } from '@/features/patient/donations/components/MedicationDonationBrowseSection';
import {
  MedicationDonationMyDonationsSection,
  MedicationDonationMyRequestsSection,
} from '@/features/patient/donations/components/MedicationDonationAccountSections';
import { MedicationDonationPostSection } from '@/features/patient/donations/components/MedicationDonationPostSection';
import type { MedicationDonationScreenViewModel } from '@/features/patient/donations/useMedicationDonationScreen';

export function MedicationDonationSections({
  screen,
}: {
  screen: MedicationDonationScreenViewModel;
}) {
  if (screen.activeTab === 'browse') {
    return <MedicationDonationBrowseSection screen={screen} />;
  }

  if (screen.activeTab === 'post') {
    return <MedicationDonationPostSection screen={screen} />;
  }

  if (screen.activeTab === 'my-requests') {
    return <MedicationDonationMyRequestsSection screen={screen} />;
  }

  return <MedicationDonationMyDonationsSection screen={screen} />;
}
