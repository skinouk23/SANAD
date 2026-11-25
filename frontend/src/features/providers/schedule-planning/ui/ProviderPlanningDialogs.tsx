import { Plus, Save, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { DatePickerField } from '@/shared/ui/composites/date-picker-field';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { FormField } from '@/shared/ui/composites/form-field';
import { Button } from '@/shared/ui/primitives/button';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Input } from '@/shared/ui/primitives/input';
import { Spinner } from '@/shared/ui/primitives/spinner';
import type { ScheduleEditorDay } from '@/features/providers/schedule-planning/types';
import type { DialogLabels } from './types';

const dialogSurfaceClassName =
  'border-slate-200 bg-white text-slate-900 shadow-2xl shadow-cyan-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white';
const dialogTitleClassName = 'text-lg font-bold text-slate-900 dark:text-white';
const dialogDescriptionClassName = 'text-sm text-slate-500 dark:text-slate-400';
const alertClassName =
  'rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:border-rose-500/30 dark:text-rose-400';
const labelClassName = 'text-xs font-medium text-slate-700 dark:text-slate-300';
const inputClassName =
  'h-9 border-slate-200 bg-white text-sm text-slate-900 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:h-10';
const compactInputClassName =
  'h-9 border-slate-200 bg-white text-sm text-slate-900 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white';
const cancelButtonClassName =
  'border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white';

interface ProviderPlanningDialogsProps {
  blockDate: string;
  blockEndTime: string;
  blockMutationError: string | null;
  blockReason: string;
  blockStartTime: string;
  creatingUnavailability: boolean;
  invalidScheduleIntervalIds: Set<string>;
  labels: DialogLabels;
  onAddInterval: (dayOfWeek: number) => void;
  onBlockDateChange: (value: string) => void;
  onBlockEndTimeChange: (value: string) => void;
  onBlockReasonChange: (value: string) => void;
  onBlockStartTimeChange: (value: string) => void;
  onCloseAvailabilityModal: () => void;
  onCloseBlockModal: () => void;
  onRefetchSchedules: () => void;
  onRemoveInterval: (dayOfWeek: number, localId: string) => void;
  onSaveAvailability: () => Promise<void>;
  onSubmitBlockSlot: () => Promise<void>;
  onToggleScheduleDay: (dayOfWeek: number, enabled: boolean) => void;
  onUpdateInterval: (
    dayOfWeek: number,
    localId: string,
    field: 'startTime' | 'endTime',
    value: string,
  ) => void;
  savingSchedules: boolean;
  scheduleEditorDays: ScheduleEditorDay[];
  scheduleMutationError: string | null;
  schedulesError: unknown;
  schedulesLoading: boolean;
  showAvailabilityModal: boolean;
  showBlockModal: boolean;
}

export function ProviderPlanningDialogs({
  blockDate,
  blockEndTime,
  blockMutationError,
  blockReason,
  blockStartTime,
  creatingUnavailability,
  invalidScheduleIntervalIds,
  labels,
  onAddInterval,
  onBlockDateChange,
  onBlockEndTimeChange,
  onBlockReasonChange,
  onBlockStartTimeChange,
  onCloseAvailabilityModal,
  onCloseBlockModal,
  onRefetchSchedules,
  onRemoveInterval,
  onSaveAvailability,
  onSubmitBlockSlot,
  onToggleScheduleDay,
  onUpdateInterval,
  savingSchedules,
  scheduleEditorDays,
  scheduleMutationError,
  schedulesError,
  schedulesLoading,
  showAvailabilityModal,
  showBlockModal,
}: ProviderPlanningDialogsProps) {
  return (
    <>
      <Dialog
        open={showBlockModal}
        onOpenChange={(open) => {
          if (!open) {
            onCloseBlockModal();
          }
        }}
      >
        <DialogContent size="md" className={dialogSurfaceClassName}>
          <DialogHeader>
            <DialogTitle className={dialogTitleClassName}>{labels.blockThisSlot}</DialogTitle>
            <DialogDescription className={dialogDescriptionClassName}>
              {labels.blockSlot}
            </DialogDescription>
          </DialogHeader>

          {blockMutationError ? (
            <div role="alert" className={alertClassName}>
              {blockMutationError}
            </div>
          ) : null}

          <div className="space-y-4">
            <DatePickerField
              id="provider-block-date"
              label={labels.date}
              value={blockDate}
              onChange={onBlockDateChange}
              labelClassName={labelClassName}
              triggerClassName={inputClassName}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label={labels.startTime}
                htmlFor="provider-block-start-time"
                labelClassName={labelClassName}
              >
                <Input
                  id="provider-block-start-time"
                  type="time"
                  value={blockStartTime}
                  onChange={(event) => onBlockStartTimeChange(event.target.value)}
                  className={inputClassName}
                />
              </FormField>
              <FormField
                label={labels.endTime}
                htmlFor="provider-block-end-time"
                labelClassName={labelClassName}
              >
                <Input
                  id="provider-block-end-time"
                  type="time"
                  value={blockEndTime}
                  onChange={(event) => onBlockEndTimeChange(event.target.value)}
                  className={inputClassName}
                />
              </FormField>
            </div>

            <FormField
              label={labels.reasonOptional}
              htmlFor="provider-block-reason"
              labelClassName={labelClassName}
            >
              <Input
                id="provider-block-reason"
                value={blockReason}
                onChange={(event) => onBlockReasonChange(event.target.value)}
                placeholder={labels.blockReasonPlaceholder}
                className={inputClassName}
              />
            </FormField>
          </div>

          <DialogFooter className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <Button variant="outline" onClick={onCloseBlockModal} className={cancelButtonClassName}>
              {labels.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => void onSubmitBlockSlot()}
              disabled={!blockDate || !blockStartTime || !blockEndTime || creatingUnavailability}
              aria-busy={creatingUnavailability || undefined}
              className="border-red-500/40 bg-red-500 text-white hover:bg-red-600 dark:border-rose-500/40 dark:bg-rose-500 dark:hover:bg-rose-600"
            >
              {creatingUnavailability ? <Spinner data-icon="inline-start" /> : null}
              {labels.blockSlot}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAvailabilityModal}
        onOpenChange={(open) => {
          if (!open) {
            onCloseAvailabilityModal();
          }
        }}
      >
        <DialogContent
          size="lg"
          scroll="content"
          className={cn(dialogSurfaceClassName, 'max-h-[calc(100dvh-1rem)] gap-3 p-4')}
        >
          <DialogHeader className="gap-1">
            <DialogTitle className={cn(dialogTitleClassName, 'text-base')}>
              {labels.setAvailabilities}
            </DialogTitle>
            <DialogDescription className={cn(dialogDescriptionClassName, 'text-xs')}>
              {labels.setAvailability}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="mt-3 space-y-3">
            {scheduleMutationError ? (
              <div role="alert" className={alertClassName}>
                {scheduleMutationError}
              </div>
            ) : null}

            {schedulesLoading ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {labels.loading}
              </div>
            ) : null}

            {!schedulesLoading && schedulesError ? (
              <div className="py-6">
                <EmptyState
                  title={labels.loadingError}
                  action={
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={onRefetchSchedules}
                      className="border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-rose-400"
                    >
                      {labels.retry}
                    </Button>
                  }
                />
              </div>
            ) : null}

            {!schedulesLoading && !schedulesError ? (
              <div className="space-y-3">
                {scheduleEditorDays.map((day) => (
                  <div
                    key={day.dayOfWeek}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50"
                  >
                    <div className="mb-3 flex flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Checkbox
                          checked={day.enabled}
                          id={`provider-schedule-day-${day.dayOfWeek}`}
                          onCheckedChange={(value) =>
                            onToggleScheduleDay(day.dayOfWeek, value === true)
                          }
                        />
                        <label
                          className="cursor-pointer"
                          htmlFor={`provider-schedule-day-${day.dayOfWeek}`}
                        >
                          {labels.dayLabels[day.dayOfWeek] ?? String(day.dayOfWeek)}
                        </label>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddInterval(day.dayOfWeek)}
                        disabled={!day.enabled}
                        className="h-8 rounded-lg border-slate-200 bg-white px-2 text-[11px] text-slate-700 hover:border-cyan-500/40 hover:text-cyan-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:text-cyan-400"
                      >
                        <Plus className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        {labels.addInterval}
                      </Button>
                    </div>

                    {day.enabled && day.intervals.length > 0 ? (
                      <div className="space-y-2">
                        {day.intervals.map((interval) => {
                          const isInvalid = invalidScheduleIntervalIds.has(interval.localId);

                          return (
                            <div
                              key={interval.localId}
                              className={cn(
                                'grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-1.5 rounded-xl border p-2',
                                isInvalid
                                  ? 'border-red-500/30 bg-red-500/10 dark:border-rose-500/30'
                                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/80',
                              )}
                            >
                              <Input
                                type="time"
                                value={interval.startTime}
                                className={compactInputClassName}
                                onChange={(event) =>
                                  onUpdateInterval(
                                    day.dayOfWeek,
                                    interval.localId,
                                    'startTime',
                                    event.target.value,
                                  )
                                }
                              />

                              <span className="text-center text-xs text-slate-500 dark:text-slate-400">
                                {labels.to}
                              </span>

                              <Input
                                type="time"
                                value={interval.endTime}
                                className={compactInputClassName}
                                onChange={(event) =>
                                  onUpdateInterval(
                                    day.dayOfWeek,
                                    interval.localId,
                                    'endTime',
                                    event.target.value,
                                  )
                                }
                              />

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveInterval(day.dayOfWeek, interval.localId)}
                                aria-label={labels.removeInterval}
                                title={labels.removeInterval}
                                className="size-8 justify-self-end rounded-full text-red-500 hover:bg-red-500/10 dark:text-rose-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>

                              {isInvalid ? (
                                <p className="text-xs text-red-600 dark:text-rose-400 sm:col-span-4">
                                  {labels.invalidTimeRange}
                                </p>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {labels.availabilityDayOff}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </DialogBody>

          <DialogFooter className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={onCloseAvailabilityModal}
              className={cancelButtonClassName}
            >
              {labels.cancel}
            </Button>
            <Button
              onClick={() => void onSaveAvailability()}
              disabled={schedulesLoading || Boolean(schedulesError) || savingSchedules}
              aria-busy={savingSchedules || undefined}
              className="border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110"
            >
              {savingSchedules ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {labels.saveAvailabilities}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
