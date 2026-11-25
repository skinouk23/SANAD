import { AlertCircle, Download, FileText, Mail, Phone, Shield } from 'lucide-react';

import type { InsuranceDocument } from '@/features/insurance/schema';

export function ProviderInsuranceSidebar({
  documents,
  onFileClaim,
  onShowConditions,
}: {
  documents: InsuranceDocument[];
  onFileClaim: () => void;
  onShowConditions: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="mb-3 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
          Actions rapides
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={onFileClaim}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Déclarer un sinistre
          </button>
          <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:border-cyan-500 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:border-cyan-500/30 dark:hover:bg-slate-700">
            <Download className="h-3.5 w-3.5" />
            Télécharger l'attestation
          </button>
          <button
            onClick={onShowConditions}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all hover:border-cyan-500 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:border-cyan-500/30 dark:hover:bg-slate-700"
          >
            <FileText className="h-3.5 w-3.5" />
            Voir les conditions
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="mb-3 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
          Documents
        </h3>
        <div className="space-y-1.5">
          {documents.map((document, index) => (
            <div
              key={`${document.name}-${index}`}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 transition-colors hover:border-cyan-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-cyan-500/30"
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-red-500/20">
                <FileText className="h-3 w-3 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-slate-900 dark:text-white">
                  {document.name}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500">
                  {document.size} • {document.date}
                </p>
              </div>
              <Download className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-3 shadow-sm sm:p-4 dark:border-blue-500/30 dark:from-blue-500/10 dark:to-cyan-500/10">
        <h3 className="mb-3 text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
          Besoin d'aide ?
        </h3>
        <div className="space-y-2">
          <a
            href="tel:+21671XXXXXX"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 p-2 transition-colors hover:border-cyan-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/30"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/20">
              <Phone className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-900 dark:text-white">
                Urgence 24/7
              </p>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400">+216 71 XXX XXX</p>
            </div>
          </a>
          <a
            href="mailto:assurance@carehome.tn"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 p-2 transition-colors hover:border-cyan-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-cyan-500/30"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/20">
              <Mail className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-900 dark:text-white">Email</p>
              <p className="text-[10px] text-cyan-600 dark:text-cyan-400">assurance@carehome.tn</p>
            </div>
          </a>
        </div>
      </div>
      <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 dark:border-green-500/30 dark:from-green-500/10 dark:to-emerald-500/10">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 flex-shrink-0 text-green-500" />
          <div>
            <h4 className="mb-0.5 text-xs font-semibold text-slate-900 dark:text-white">
              Protection automatique
            </h4>
            <p className="text-[10px] text-slate-600 dark:text-slate-300">
              Vous êtes automatiquement couvert dès votre première intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
