import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';

import { getUploadAcceptAttribute } from '@/features/files';
import { Button } from '@/shared/ui/primitives/button';

const EQUIPMENT_IMAGE_ACCEPT = getUploadAcceptAttribute('ServicePhoto');

export interface ProviderEquipmentMainImageFieldProps {
  currentImageUrl?: string | null;
  disabled?: boolean;
  file: File | null;
  inputId: string;
  previewUrl: string | null;
  retryAvailable?: boolean;
  onChange: (file: File | null) => void;
  onRetry?: () => void;
}

export function ProviderEquipmentMainImageField({
  currentImageUrl,
  disabled,
  file,
  inputId,
  previewUrl,
  retryAvailable,
  onChange,
  onRetry,
}: ProviderEquipmentMainImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [file]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files?.[0] ?? null);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    onChange(null);
  };

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    inputRef.current?.click();
  };

  return (
    <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/40">
      <label
        className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
        htmlFor={inputId}
      >
        Image principale
      </label>
      <input
        ref={inputRef}
        accept={EQUIPMENT_IMAGE_ACCEPT}
        className="sr-only"
        disabled={disabled}
        id={inputId}
        onChange={handleChange}
        type="file"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 sm:w-32">
          {previewUrl ? (
            <img
              alt="Apercu de l image principale"
              className="h-full w-full object-cover"
              src={previewUrl}
            />
          ) : currentImageUrl ? (
            <img
              alt="Image principale actuelle"
              className="h-full w-full object-cover"
              src={currentImageUrl}
            />
          ) : (
            <ImagePlus className="h-7 w-7 text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {file?.name ?? 'Ajoutez une photo de l equipement.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              JPG, PNG ou WebP jusqu a 10 MB. L image est envoyee apres les details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={disabled}
              onClick={openFilePicker}
              size="sm"
              type="button"
              variant="outline"
            >
              Choisir une image
            </Button>
            {file ? (
              <Button
                disabled={disabled}
                onClick={handleClear}
                size="sm"
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" />
                Retirer
              </Button>
            ) : null}
            {file && retryAvailable && onRetry ? (
              <Button
                disabled={disabled}
                onClick={onRetry}
                size="sm"
                type="button"
                variant="outline"
              >
                Reessayer l image
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
