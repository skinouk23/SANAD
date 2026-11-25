import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import { getUploadAcceptAttribute, useUploadFile, waitForFileReady } from '@/features/files';
import { Button } from '@/shared/ui/primitives/button';

interface PrescriptionUploadGateProps {
  required: boolean;
  onFileReady: (fileId: string | null) => void;
}

const PRESCRIPTION_ACCEPT = getUploadAcceptAttribute('Prescription');

export function PrescriptionUploadGate({ required, onFileReady }: PrescriptionUploadGateProps) {
  const { t } = useLanguage();
  const { mutateAsync: upload, isPending: uploading, error, reset } = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const readinessAbortRef = useRef<AbortController | null>(null);
  const uploadSequenceRef = useRef(0);
  const [fileName, setFileName] = useState('');
  const [readyFileId, setReadyFileId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<Error | null>(null);
  const busy = uploading || processing;
  const fileReady = Boolean(readyFileId);

  const clearUpload = useCallback(() => {
    uploadSequenceRef.current += 1;
    readinessAbortRef.current?.abort();
    readinessAbortRef.current = null;
    reset();
    setFileName('');
    setReadyFileId(null);
    setProcessing(false);
    setProcessingError(null);
    onFileReady(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileReady, reset]);

  useEffect(() => {
    return () => {
      readinessAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!required) {
      clearUpload();
    }
  }, [clearUpload, required]);

  const openFilePicker = useCallback(() => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.value = '';
    fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = event.target.files?.[0];

      if (!file) {
        clearUpload();
        return;
      }

      const uploadSequence = uploadSequenceRef.current + 1;
      uploadSequenceRef.current = uploadSequence;
      readinessAbortRef.current?.abort();
      const readinessAbortController = new AbortController();
      readinessAbortRef.current = readinessAbortController;

      setFileName(file.name);
      setReadyFileId(null);
      setProcessing(false);
      setProcessingError(null);
      onFileReady(null);

      const uploadedFile = await upload({
        file,
        useCase: 'Prescription',
      }).catch(() => null);

      if (uploadSequenceRef.current !== uploadSequence) {
        return;
      }

      if (!uploadedFile?.fileId) {
        setFileName('');
        setReadyFileId(null);
        setProcessing(false);
        onFileReady(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        return;
      }

      setFileName(file.name);
      setProcessing(true);

      try {
        await waitForFileReady(uploadedFile.fileId, {
          signal: readinessAbortController.signal,
        });

        if (uploadSequenceRef.current !== uploadSequence) {
          return;
        }

        setReadyFileId(uploadedFile.fileId);
        setProcessingError(null);
        onFileReady(uploadedFile.fileId);
      } catch (waitError) {
        if (uploadSequenceRef.current !== uploadSequence) {
          return;
        }

        setReadyFileId(null);
        onFileReady(null);

        if (waitError instanceof Error && waitError.name === 'AbortError') {
          return;
        }

        setProcessingError(
          waitError instanceof Error
            ? waitError
            : new Error('La verification du fichier a echoue.'),
        );
      } finally {
        if (uploadSequenceRef.current === uploadSequence) {
          setProcessing(false);
        }
      }
    },
    [clearUpload, onFileReady, upload],
  );

  if (!required) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <div>
            <h3 className="mb-1 text-sm font-bold text-foreground">
              {t.bookingFlow.prescriptionRequiredTitle}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.bookingFlow.prescriptionUploadRequired}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-border/80">
        <input
          ref={fileInputRef}
          type="file"
          accept={PRESCRIPTION_ACCEPT}
          className="hidden"
          onChange={(event) => {
            void handleFileChange(event);
          }}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${fileReady ? 'bg-success text-success-foreground' : 'border border-border bg-background text-muted-foreground'}`}
          >
            {fileReady ? <CheckCircle2 className="h-7 w-7" /> : <Upload className="h-7 w-7" />}
          </div>

          <div>
            <p className="font-medium text-foreground">
              {fileReady ? t.bookingFlow.prescriptionUploaded : t.bookingFlow.uploadPrescription}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {fileName || t.bookingFlow.fileFormats}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFilePicker}
              disabled={busy}
            >
              {t.bookingFlow.browseFiles}
            </Button>

            {fileReady || error || fileName ? (
              <button
                type="button"
                onClick={clearUpload}
                disabled={busy}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:text-muted-foreground/60"
              >
                {t.common.cancel}
              </button>
            ) : null}
          </div>

          {busy ? (
            <div className="flex items-center gap-2 text-xs text-success">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{processing ? 'Verification du fichier en cours...' : t.common.loading}</span>
            </div>
          ) : null}

          {!busy && fileReady ? (
            <div className="w-full rounded-lg border border-success/30 bg-success/10 p-3 text-left">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {t.bookingFlow.prescriptionUploaded}
                  </p>
                  <p className="mt-1 break-all text-xs text-muted-foreground">{fileName}</p>
                </div>
              </div>
            </div>
          ) : null}

          {error || processingError ? (
            <div className="w-full rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-left">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-destructive">
                    {t.bookingFlow.prescriptionUploadFailed}
                  </p>
                  <p className="mt-1 text-xs text-destructive/90">
                    {(processingError ?? error)?.message}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
