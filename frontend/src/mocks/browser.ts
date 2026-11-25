import { setupWorker } from 'msw/browser';
import { analyticsHandlers } from './handlers/analytics';
import { authHandlers } from './handlers/auth';
import { bookingHandlers } from './handlers/bookings';
import { carePlanHandlers } from './handlers/care-plan';
import { equipmentHandlers } from './handlers/equipment';
import { familyCircleHandlers } from './handlers/family-circle';
import { fileHandlers } from './handlers/files';
import { insuranceHandlers } from './handlers/insurance';
import { laboratoryHandlers } from './handlers/laboratory';
import { marketingHandlers } from './handlers/marketing';
import { messagingHandlers } from './handlers/messaging';
import { notificationHandlers } from './handlers/notifications';
import { nutritionHandlers } from './handlers/nutrition';
import { pharmacyHandlers } from './handlers/pharmacy';
import { providerFinanceHandlers } from './handlers/provider-finance';
import { providerWalletHandlers } from './handlers/provider-wallet';
import { providerHandlers } from './handlers/providers';
import { rewardsHandlers } from './handlers/rewards';
import { serviceHandlers } from './handlers/services';
import { usersHandlers } from './handlers/users';

/**
 * MSW browser worker.
 *
 * Handler arrays are spread in so each domain can be developed
 * independently and aggregated here.
 */
export const worker = setupWorker(
  ...authHandlers,
  ...usersHandlers,
  ...bookingHandlers,
  ...providerHandlers,
  ...providerFinanceHandlers,
  ...providerWalletHandlers,
  ...serviceHandlers,
  ...equipmentHandlers,
  ...messagingHandlers,
  ...notificationHandlers,
  ...analyticsHandlers,
  ...carePlanHandlers,
  ...familyCircleHandlers,
  ...insuranceHandlers,
  ...laboratoryHandlers,
  ...marketingHandlers,
  ...nutritionHandlers,
  ...pharmacyHandlers,
  ...rewardsHandlers,
  ...fileHandlers,
);
