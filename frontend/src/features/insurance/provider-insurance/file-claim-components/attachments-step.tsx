import type { ChangeEvent } from 'react';
import { AlertCircle, Camera, FileText, Loader2, Upload, X } from 'lucide-react';

export function ClaimAttachmentsStep({
  fileError,
  files,
  handleFileChange,
  isSubmitting,
  onBack,
  onRemoveFile,
  onSubmit,
  submitError,
}: {
  fileError: string;
  files: File[];
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  submitError: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 backdrop-blur-sm dark:border-amber-700/30 dark:bg-amber-900/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Ajoutez toute pièce justificative utile : photos des dommages, rapport médical,
            témoignages écrits, rapport de police, etc.
          </p>
        </div>
      </div>
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors hover:border-cyan-500 dark:border-slate-600 dark:bg-slate-900/30">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isSubmitting}
          id="file-upload"
          accept="image/*,.pdf,.doc,.docx"
        />
        <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
            <Upload className="h-6 w-6 text-cyan-500" />
          </div>
          <p className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
            Cliquez pour ajouter des fichiers
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">PNG, JPG, PDF jusqu'à 10MB</p>
        </label>
      </div>
      {fileError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-400">
          {fileError}
        </div>
      ) : null}
      {files.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 dark:text-white">
            Fichiers ajoutés ({files.length})
          </h4>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/50"
            >
              <div className="flex items-center gap-3">
                {file.type.startsWith('image/') ? (
                  <Camera className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                ) : (
                  <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                )}
                <div>
                  <p className="max-w-[200px] truncate text-sm font-medium text-slate-900 dark:text-white sm:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                type="button"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          type="button"
          disabled={isSubmitting}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
        >
          Précédent
        </button>
        {submitError ? (
          <div className="mx-4 flex-1 self-center rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600 backdrop-blur-sm dark:border-red-700/30 dark:bg-red-900/20 dark:text-red-400">
            {submitError}
          </div>
        ) : null}
        <button
          onClick={onSubmit}
          aria-busy={isSubmitting}
          disabled={isSubmitting}
          type="button"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Soumettre la déclaration'
          )}
        </button>
      </div>
    </div>
  );
}
