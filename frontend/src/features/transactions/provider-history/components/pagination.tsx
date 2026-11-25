import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/primitives/button';
import { Pagination, PaginationContent, PaginationItem } from '@/shared/ui/primitives/pagination';

export function ProviderTransactionsPagination({
  currentPage,
  hasNext,
  hasPrev,
  total,
  totalPages,
  onNext,
  onPrevious,
}: {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-[10px] text-slate-600 dark:text-slate-400 sm:text-xs">
        <span className="hidden sm:inline">
          Page {currentPage} sur {totalPages} ({total} transactions)
        </span>
        <span className="sm:hidden">
          {currentPage}/{totalPages}
        </span>
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-1.5">
          <PaginationItem>
            <Button
              onClick={onPrevious}
              disabled={!hasPrev}
              size="sm"
              variant="outline"
              className="border-slate-200 bg-white text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:border-cyan-500/50 dark:hover:bg-slate-700 dark:hover:text-cyan-300"
            >
              <ChevronLeft className="h-4 w-4 sm:hidden" />
              <span className="hidden text-xs font-medium sm:inline">Precedent</span>
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              onClick={onNext}
              disabled={!hasNext}
              size="sm"
              variant="outline"
              className="border-slate-200 bg-white text-slate-700 transition-all hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:hover:border-cyan-500/50 dark:hover:bg-slate-700 dark:hover:text-cyan-300"
            >
              <ChevronRight className="h-4 w-4 sm:hidden" />
              <span className="hidden text-xs font-medium sm:inline">Suivant</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
