import { CheckCircle2 } from 'lucide-react';

export function ClaimSuccessStep({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
      </div>
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
        Déclaration envoyée avec succès
      </h2>
      <p className="mx-auto mb-8 max-w-md text-slate-600 dark:text-slate-300">
        Votre numéro de dossier est le <span className="font-bold">SIN-2024-089</span>. Notre équipe
        va traiter votre demande dans les plus brefs délais. Vous recevrez un email de confirmation
        avec les prochaines étapes.
      </p>
      <button
        onClick={onReturn}
        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
      >
        Retour à l'assurance
      </button>
    </div>
  );
}
