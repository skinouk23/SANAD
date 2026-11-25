import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/primitives/card';

export interface SectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  contentClassName?: string;
}

export function SectionCard({
  actions,
  children,
  className,
  contentClassName,
  description,
  title,
  ...props
}: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden shadow-primary/5', className)} {...props}>
      {title || description || actions ? (
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 flex-col gap-1.5">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(title || description || actions ? undefined : 'pt-6', contentClassName)}
      >
        {children}
      </CardContent>
    </Card>
  );
}
