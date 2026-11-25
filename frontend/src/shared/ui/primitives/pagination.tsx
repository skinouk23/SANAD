import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/primitives/button';

const Pagination = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'nav'>>(
  function Pagination({ className, ...props }, ref) {
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
      />
    );
  },
);

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<'ul'>>(
  function PaginationContent({ className, ...props }, ref) {
    return (
      <ul
        ref={ref}
        data-slot="pagination-content"
        className={cn('flex items-center gap-0.5', className)}
        {...props}
      />
    );
  },
);

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function PaginationItem(props, ref) {
    return <li ref={ref} data-slot="pagination-item" {...props} />;
  },
);

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentPropsWithoutRef<typeof Button>, 'size'> &
  React.ComponentPropsWithoutRef<'a'>;

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationLink({ className, isActive, size = 'icon', ...props }, ref) {
    return (
      <Button
        asChild
        variant={isActive ? 'outline' : 'ghost'}
        size={size}
        className={cn(
          isActive &&
            'border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/10 hover:bg-primary/20 hover:text-primary',
          className,
        )}
      >
        <a
          ref={ref}
          aria-current={isActive ? 'page' : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      </Button>
    );
  },
);

type PaginationPreviousProps = React.ComponentPropsWithoutRef<typeof PaginationLink> & {
  text?: string;
};

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  function PaginationPrevious({ className, text = 'Previous', ...props }, ref) {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to previous page"
        size="default"
        className={cn('pl-1.5', className)}
        {...props}
      >
        <ChevronLeftIcon aria-hidden="true" data-icon="inline-start" />
        <span className="hidden sm:block">{text}</span>
      </PaginationLink>
    );
  },
);

type PaginationNextProps = React.ComponentPropsWithoutRef<typeof PaginationLink> & {
  text?: string;
};

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  function PaginationNext({ className, text = 'Next', ...props }, ref) {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to next page"
        size="default"
        className={cn('pr-1.5', className)}
        {...props}
      >
        <span className="hidden sm:block">{text}</span>
        <ChevronRightIcon aria-hidden="true" data-icon="inline-end" />
      </PaginationLink>
    );
  },
);

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(function PaginationEllipsis({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
});

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
