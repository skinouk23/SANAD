import * as React from 'react';

import { cn } from '@/shared/lib/utils';

const containerSizeClassNames = {
  narrow: 'max-w-2xl',
  standard: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
} as const;

const containerPaddingClassNames = {
  none: '',
  default: 'px-4 sm:px-6 lg:px-8',
  comfortable: 'px-5 sm:px-8 lg:px-10',
} as const;

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof containerPaddingClassNames;
  size?: keyof typeof containerSizeClassNames;
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  function PageContainer({ className, padding = 'default', size = 'standard', ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          containerSizeClassNames[size],
          containerPaddingClassNames[padding],
          className,
        )}
        {...props}
      />
    );
  },
);

const stackSpacingClassNames = {
  sm: 'gap-3.5',
  md: 'gap-5',
  lg: 'gap-7',
} as const;

export interface PageStackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: keyof typeof stackSpacingClassNames;
}

export const PageStack = React.forwardRef<HTMLDivElement, PageStackProps>(function PageStack(
  { className, spacing = 'md', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col', stackSpacingClassNames[spacing], className)}
      {...props}
    />
  );
});

const sectionSpacingClassNames = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
} as const;

export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: keyof typeof sectionSpacingClassNames;
}

export const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(function PageSection(
  { className, spacing = 'md', ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn('flex flex-col', sectionSpacingClassNames[spacing], className)}
      {...props}
    />
  );
});

const gridColumnClassNames = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const;

const gridGapClassNames = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-5',
} as const;

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: keyof typeof gridColumnClassNames;
  gap?: keyof typeof gridGapClassNames;
}

export const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  function ResponsiveGrid({ className, columns = 3, gap = 'md', ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('grid', gridColumnClassNames[columns], gridGapClassNames[gap], className)}
        {...props}
      />
    );
  },
);
