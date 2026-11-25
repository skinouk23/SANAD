import { getFileMetadata } from '@/features/files/api';

import type { FileMetadata, FileStatus } from '@/features/files/types';

const DEFAULT_FILE_READY_POLL_INTERVAL_MS = 1_000;
const DEFAULT_FILE_READY_TIMEOUT_MS = 60_000;

const PROCESSING_FILE_STATUSES = new Set<FileStatus>([
  'uploading',
  'staged',
  'pending_scan',
  'scanning',
]);

const TERMINAL_ERROR_FILE_STATUSES = new Set<FileStatus>([
  'scan_failed',
  'rejected',
  'quarantined',
  'deleting',
  'deleted',
]);

export interface WaitForFileReadyOptions {
  timeoutMs?: number;
  intervalMs?: number;
  signal?: AbortSignal;
  fetchMetadata?: (fileId: string, signal?: AbortSignal) => Promise<FileMetadata>;
}

export function isFileReadyProcessingStatus(status: FileStatus | undefined): boolean {
  return Boolean(status && PROCESSING_FILE_STATUSES.has(status));
}

export function isFileReadyTerminalErrorStatus(status: FileStatus | undefined): boolean {
  return Boolean(status && TERMINAL_ERROR_FILE_STATUSES.has(status));
}

function createAbortError(): Error {
  const error = new Error('Verification du fichier annulee.');
  error.name = 'AbortError';
  return error;
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw createAbortError();
  }
}

function delay(ms: number, signal: AbortSignal | undefined): Promise<void> {
  throwIfAborted(signal);

  return new Promise((resolve, reject) => {
    const timer = {
      id: window.setTimeout(() => {
        signal?.removeEventListener('abort', abortDelay);
        resolve();
      }, ms),
    };

    function abortDelay() {
      window.clearTimeout(timer.id);
      reject(createAbortError());
    }

    signal?.addEventListener('abort', abortDelay, { once: true });
  });
}

function createTerminalStatusError(metadata: FileMetadata): Error {
  return new Error(
    metadata.rejectionReason ||
      `Le fichier n'est pas disponible apres verification (statut: ${metadata.status}).`,
  );
}

export async function waitForFileReady(
  fileId: string,
  {
    timeoutMs = DEFAULT_FILE_READY_TIMEOUT_MS,
    intervalMs = DEFAULT_FILE_READY_POLL_INTERVAL_MS,
    signal,
    fetchMetadata = getFileMetadata,
  }: WaitForFileReadyOptions = {},
): Promise<FileMetadata> {
  const normalizedFileId = fileId.trim();

  if (!normalizedFileId) {
    throw new Error('File id is required.');
  }

  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    throwIfAborted(signal);

    const metadata = await fetchMetadata(normalizedFileId, signal);

    if (metadata.status === 'ready') {
      return metadata;
    }

    if (isFileReadyTerminalErrorStatus(metadata.status)) {
      throw createTerminalStatusError(metadata);
    }

    if (!isFileReadyProcessingStatus(metadata.status)) {
      throw new Error(`Le fichier est dans un statut inattendu: ${metadata.status}.`);
    }

    const remainingMs = timeoutMs - (Date.now() - startedAt);

    if (remainingMs <= 0) {
      break;
    }

    await delay(Math.min(intervalMs, remainingMs), signal);
  }

  throw new Error('Le fichier est encore en cours de verification. Veuillez reessayer.');
}
