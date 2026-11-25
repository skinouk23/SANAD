import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { SectionCard } from '@/shared/ui/composites/section-card';
import { Field, FieldContent, FieldLabel } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { Label } from '@/shared/ui/primitives/label';
import { Switch } from '@/shared/ui/primitives/switch';
import { Textarea } from '@/shared/ui/primitives/textarea';

interface ProfilePanelProps extends React.HTMLAttributes<HTMLElement> {
  idBase: string;
  tabId: string;
}

interface ProfileFieldProps {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
  type?: React.HTMLInputTypeAttribute;
  rows?: number;
}

interface ProfileMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  tone: 'error' | 'success';
}

interface ProfileToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function toDomIdSegment(value: string): string {
  return value.trim().replace(/[^A-Za-z0-9_-]+/g, '-');
}

function getProfileTabButtonId(idBase: string, tabId: string): string {
  return `${idBase}-tab-${toDomIdSegment(tabId)}`;
}

function getProfilePanelId(idBase: string, tabId: string): string {
  return `${idBase}-panel-${toDomIdSegment(tabId)}`;
}

export function ProfilePanel({ children, className, idBase, tabId, ...props }: ProfilePanelProps) {
  return (
    <section
      id={getProfilePanelId(idBase, tabId)}
      role="tabpanel"
      aria-labelledby={getProfileTabButtonId(idBase, tabId)}
      className={cn('outline-none', className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function ProfileCard({ className, ...props }: React.ComponentProps<typeof SectionCard>) {
  return (
    <SectionCard
      className={cn(
        'rounded-2xl border border-slate-200 bg-white/80 text-slate-900 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white',
        className,
      )}
      {...props}
    />
  );
}

export function ProfileField({
  id,
  label,
  multiline = false,
  onChange,
  readOnly = false,
  rows = 4,
  type = 'text',
  value,
}: ProfileFieldProps) {
  const sharedClassName = cn(
    'rounded-xl border-border bg-input text-foreground',
    readOnly && 'bg-muted text-muted-foreground',
  );

  return (
    <div>
      <Label
        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
        htmlFor={id}
      >
        {label}
      </Label>

      {multiline ? (
        <Textarea
          id={id}
          readOnly={readOnly}
          rows={rows}
          value={value}
          onChange={
            onChange
              ? (event) => {
                  onChange(event.target.value);
                }
              : undefined
          }
          className={cn(sharedClassName, 'resize-none')}
        />
      ) : (
        <Input
          id={id}
          readOnly={readOnly}
          type={type}
          value={value}
          onChange={
            onChange
              ? (event) => {
                  onChange(event.target.value);
                }
              : undefined
          }
          className={sharedClassName}
        />
      )}
    </div>
  );
}

export function ProfileMessage({ children, className, tone, ...props }: ProfileMessageProps) {
  return (
    <div
      role={tone === 'success' ? 'status' : 'alert'}
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        tone === 'success'
          ? 'border-success/20 bg-success/10 text-success'
          : 'border-destructive/20 bg-destructive/10 text-destructive',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProfileToggle({
  checked,
  description,
  disabled = false,
  id,
  label,
  onChange,
}: ProfileToggleProps) {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <Field
      data-disabled={disabled ? true : undefined}
      orientation="horizontal"
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors dark:border-slate-700 dark:bg-slate-900/30',
        disabled
          ? 'cursor-not-allowed opacity-70'
          : 'hover:bg-slate-100 dark:hover:bg-slate-900/50',
      )}
    >
      <FieldContent className="gap-1">
        <FieldLabel className="text-sm font-medium text-slate-900 dark:text-white" htmlFor={id}>
          {label}
        </FieldLabel>
        {description ? (
          <p className="text-xs text-slate-500 dark:text-slate-400" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </FieldContent>

      <Switch
        id={id}
        aria-describedby={descriptionId}
        aria-label={description ? undefined : label}
        checked={checked}
        className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-600"
        disabled={disabled}
        onCheckedChange={onChange}
      />
    </Field>
  );
}
