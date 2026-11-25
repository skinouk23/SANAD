import type { ProviderWalletPaymentChannel } from '@/features/provider-wallet/schema';

export interface ProviderWalletManualTopUpInstruction {
  label: string;
  value: string;
  copyValue?: string;
}

export interface ProviderWalletManualTopUpChannelConfig {
  label: string;
  description: string;
  instructions: readonly ProviderWalletManualTopUpInstruction[];
}

export const providerWalletManualTopUpConfig = {
  defaultCurrency: 'TND',
  lowBalanceThreshold: 50,
  channels: {
    bank_transfer: {
      label: 'Virement bancaire',
      description: 'Effectuez le virement vers le compte ci-dessous.',
      instructions: [
        { label: 'Banque', value: 'BIAT' },
        {
          label: 'RIB',
          value: '08 005 00045 2008899 55',
          copyValue: '0800500045200889955',
        },
        { label: 'Beneficiaire', value: 'Sanad Health Tech' },
      ],
    },
    d17: {
      label: 'D17',
      description: 'Envoyez le montant via D17 avec les coordonnees ci-dessous.',
      instructions: [
        { label: 'Numero D17', value: '55 123 456', copyValue: '55123456' },
        { label: 'Beneficiaire', value: 'Sanad Health Tech' },
      ],
    },
  } satisfies Record<ProviderWalletPaymentChannel, ProviderWalletManualTopUpChannelConfig>,
} as const;
