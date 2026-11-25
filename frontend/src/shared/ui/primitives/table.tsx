import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.ComponentPropsWithoutRef<'table'>>(
  function Table({ className, ...props }, ref) {
    return (
      <div
        data-slot="table-container"
        className="relative w-full overflow-x-auto rounded-xl border border-border/70 bg-card/60 shadow-sm shadow-primary/5 backdrop-blur-xl"
      >
        <table
          ref={ref}
          data-slot="table"
          className={cn('w-full caption-bottom bg-transparent text-sm', className)}
          {...props}
        />
      </div>
    );
  },
);

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<'thead'>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn(
        '[&_tr]:border-b [&_tr]:border-border/70 [&_tr]:bg-muted/40 [&_tr]:shadow-[inset_0_-1px_0_rgb(34_211_238_/_0.08)]',
        className,
      )}
      {...props}
    />
  );
});

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<'tbody'>
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
});

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentPropsWithoutRef<'tfoot'>
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn(
        'border-t border-border/70 bg-muted/40 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
});

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        ref={ref}
        data-slot="table-row"
        className={cn(
          'border-b border-border/60 transition-colors hover:border-primary/30 hover:bg-accent/70 has-aria-expanded:bg-accent/70 data-[state=selected]:border-primary/30 data-[state=selected]:bg-primary/10',
          className,
        )}
        {...props}
      />
    );
  },
);

const TableHead = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<'th'>>(
  function TableHead({ className, ...props }, ref) {
    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          'h-10 px-2 text-left align-middle text-xs font-semibold tracking-wide whitespace-nowrap text-muted-foreground uppercase [&:has([role=checkbox])]:pr-0',
          className,
        )}
        {...props}
      />
    );
  },
);

const TableCell = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<'td'>>(
  function TableCell({ className, ...props }, ref) {
    return (
      <td
        ref={ref}
        data-slot="table-cell"
        className={cn(
          'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
          className,
        )}
        {...props}
      />
    );
  },
);

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentPropsWithoutRef<'caption'>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
