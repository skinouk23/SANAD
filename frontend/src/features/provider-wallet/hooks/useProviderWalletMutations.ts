import { useMutation, useQueryClient } from '@tanstack/react-query';

import { providerWalletKeys } from '@/features/provider-wallet/keys';
import { createAndSubmitProviderWalletTopUp } from '@/features/provider-wallet/service';

import type { CreateAndSubmitProviderWalletTopUpInput } from '@/features/provider-wallet/schema';

interface CreateAndSubmitProviderWalletTopUpMutationInput {
  idempotencyKey: string;
  input: CreateAndSubmitProviderWalletTopUpInput;
}

export function useCreateAndSubmitProviderWalletTopUp() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ idempotencyKey, input }: CreateAndSubmitProviderWalletTopUpMutationInput) =>
      createAndSubmitProviderWalletTopUp(input, idempotencyKey),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerWalletKeys.all });
    },
  });

  return {
    data: mutation.data ?? null,
    error: mutation.error,
    loading: mutation.isPending,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    reset: mutation.reset,
  };
}
