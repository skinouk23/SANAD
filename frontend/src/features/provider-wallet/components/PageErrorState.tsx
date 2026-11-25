import { AlertTriangle } from 'lucide-react';

import { Button } from '@/shared/ui/primitives/button';

export function ProviderWalletPageErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-red-200 bg-red-50/80 p-6 shadow-xl backdrop-blur-sm dark:border-red-500/30 dark:bg-red-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-500" />
            <div className="space-y-3">
              <div>
                <h1 className="text-lg font-bold text-red-600 dark:text-red-300">
                  Portefeuille indisponible
                </h1>
                <p className="mt-1 text-sm text-red-600/90 dark:text-red-200/90">{message}</p>
              </div>
              <Button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] hover:from-cyan-400 hover:to-blue-500 hover:text-white"
                onClick={onRetry}
                variant="ghost"
              >
                Reessayer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
