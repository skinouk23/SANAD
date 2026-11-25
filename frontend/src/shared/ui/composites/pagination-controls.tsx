export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationControlsProps {
  pagination?: PaginationMetadata | null;
  itemCount: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function PaginationControls({
  pagination,
  itemCount,
  onPageChange,
  disabled = false,
  previousLabel = 'Precedent',
  nextLabel = 'Suivant',
  className = '',
}: PaginationControlsProps) {
  if (!pagination || !onPageChange || pagination.totalPages <= 1) {
    return null;
  }

  const { page, limit, total, totalPages } = pagination;
  const rangeStart = itemCount > 0 ? (page - 1) * limit + 1 : 0;
  const rangeEnd = itemCount > 0 ? Math.min(rangeStart + itemCount - 1, total) : 0;
  const previousDisabled = disabled || page <= 1;
  const nextDisabled = disabled || page >= totalPages;

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 p-3 text-xs shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">
          {rangeStart}-{rangeEnd}
        </span>{' '}
        / {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={previousDisabled}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {previousLabel}
        </button>

        <span className="min-w-16 text-center text-slate-500 dark:text-slate-400">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={nextDisabled}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
