import { Calendar } from 'lucide-react';

import { ProviderRouteHeader } from '@/features/providers/shared/ui/ProviderRouteHeader';

import {
  ProviderPlanningCalendar,
  ProviderPlanningDialogs,
  ProviderPlanningSelectedDay,
  ProviderPlanningSidebar,
  ProviderPlanningStats,
  ProviderPlanningStatsSkeleton,
  ProviderPlanningToolbar,
} from './components';
import { useProviderScheduleManagementScreen } from './useProviderScheduleManagementScreen';

export function ProviderScheduleManagementScreen() {
  const screen = useProviderScheduleManagementScreen();
  const showOverview = !screen.planning.planningInitialLoadError;

  return (
    <div className="min-h-screen pb-20">
      <ProviderRouteHeader containerClassName="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 sm:flex">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-400">
              {screen.titleLabels.eyebrow}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {screen.titleLabels.title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {screen.titleLabels.description}
            </p>
          </div>
        </div>
      </ProviderRouteHeader>

      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {showOverview ? (
          screen.planning.planningLoading ? (
            <ProviderPlanningStatsSkeleton />
          ) : (
            <ProviderPlanningStats stats={screen.planning.stats} />
          )
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.75fr)_22rem] xl:grid-cols-[minmax(0,1.85fr)_24rem]">
          <div className="space-y-4">
            <ProviderPlanningToolbar
              labels={screen.toolbarLabels}
              onNext={screen.planning.goToNext}
              onPrevious={screen.planning.goToPrevious}
              onToday={screen.planning.goToToday}
              onViewModeChange={screen.planning.setViewMode}
              title={screen.planning.title}
              viewMode={screen.planning.viewMode}
            />

            {screen.planning.viewMode === 'day' && screen.planning.appointmentActionError ? (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                {screen.planning.appointmentActionError}
              </div>
            ) : null}

            <ProviderPlanningCalendar
              activeBookingActionId={screen.planning.activeBookingActionId}
              activeBookingActionType={screen.planning.activeBookingActionType}
              appointmentsByDate={screen.planning.appointmentsByDate}
              blockedByDate={screen.planning.blockedByDate}
              confirmLoading={screen.planning.confirmLoading}
              dayAppointments={screen.planning.dayAppointments}
              dayBlockedSlots={screen.planning.dayBlockedSlots}
              dayLabels={screen.dayLabels}
              declineLoading={screen.planning.declineLoading}
              hasVisibleEntries={screen.planning.hasVisibleEntries}
              labels={screen.calendarLabels}
              locale={screen.locale}
              monthGrid={screen.planning.monthGrid}
              onApproveAppointment={screen.planning.approveAppointment}
              onOpenDelivery={screen.onOpenDelivery}
              onRejectAppointment={screen.planning.rejectAppointment}
              onRetry={() => void screen.planning.refetchPlanning()}
              onSelectMonthDay={(date) => {
                screen.planning.setCurrentDate(date);
                screen.planning.setViewMode('day');
              }}
              onSelectWeekDay={screen.planning.setCurrentDate}
              planningError={screen.planning.planningInitialLoadError}
              planningLoading={screen.planning.planningLoading}
              selectedDate={screen.planning.currentDate}
              statusLabels={screen.statusLabels}
              timeSlots={screen.planning.timeSlots}
              viewMode={screen.planning.viewMode}
              weekDays={screen.planning.weekDays}
            />

            {screen.planning.viewMode !== 'day' ? (
              <ProviderPlanningSelectedDay
                activeBookingActionId={screen.planning.activeBookingActionId}
                activeBookingActionType={screen.planning.activeBookingActionType}
                appointmentActionError={screen.planning.appointmentActionError}
                appointments={screen.planning.dayAppointments}
                blockedSlots={screen.planning.dayBlockedSlots}
                confirmLoading={screen.planning.confirmLoading}
                declineLoading={screen.planning.declineLoading}
                labels={screen.selectedDayLabels}
                locale={screen.locale}
                onApproveAppointment={screen.planning.approveAppointment}
                onOpenDelivery={screen.onOpenDelivery}
                onRejectAppointment={screen.planning.rejectAppointment}
                selectedDateTitle={screen.planning.selectedDateTitle}
                statusLabels={screen.statusLabels}
              />
            ) : null}
          </div>

          <ProviderPlanningSidebar
            activeBlockedSlotId={screen.planning.activeBlockedSlotId}
            blockedList={screen.planning.blockedList}
            blockMutationError={screen.planning.blockMutationError}
            deletingUnavailability={screen.planning.deletingUnavailability}
            labels={screen.sidebarLabels}
            locale={screen.locale}
            onOpenAvailabilityModal={() => screen.planning.setShowAvailabilityModal(true)}
            onOpenBlockModal={() => screen.planning.setShowBlockModal(true)}
            onRemoveBlockedSlot={screen.planning.removeBlockedSlot}
            statusLabels={screen.statusLabels}
            upcomingAppointments={screen.planning.upcomingAppointments}
          />
        </div>
      </div>

      <ProviderPlanningDialogs
        blockDate={screen.planning.blockDate}
        blockEndTime={screen.planning.blockEndTime}
        blockMutationError={screen.planning.blockMutationError}
        blockReason={screen.planning.blockReason}
        blockStartTime={screen.planning.blockStartTime}
        creatingUnavailability={screen.planning.creatingUnavailability}
        invalidScheduleIntervalIds={screen.planning.invalidScheduleIntervalIds}
        labels={screen.dialogLabels}
        onAddInterval={screen.planning.addInterval}
        onBlockDateChange={screen.planning.setBlockDate}
        onBlockEndTimeChange={screen.planning.setBlockEndTime}
        onBlockReasonChange={screen.planning.setBlockReason}
        onBlockStartTimeChange={screen.planning.setBlockStartTime}
        onCloseAvailabilityModal={() => screen.planning.setShowAvailabilityModal(false)}
        onCloseBlockModal={() => screen.planning.setShowBlockModal(false)}
        onRefetchSchedules={() => void screen.planning.refetchSchedules()}
        onRemoveInterval={screen.planning.removeInterval}
        onSaveAvailability={screen.planning.handleSaveAvailability}
        onSubmitBlockSlot={screen.planning.handleBlockSlot}
        onToggleScheduleDay={screen.planning.toggleScheduleDay}
        onUpdateInterval={screen.planning.updateInterval}
        savingSchedules={screen.planning.savingSchedules}
        scheduleEditorDays={screen.planning.scheduleEditorDays}
        scheduleMutationError={screen.planning.scheduleMutationError}
        schedulesError={screen.planning.schedulesError}
        schedulesLoading={screen.planning.schedulesLoading}
        showAvailabilityModal={screen.planning.showAvailabilityModal}
        showBlockModal={screen.planning.showBlockModal}
      />
    </div>
  );
}
