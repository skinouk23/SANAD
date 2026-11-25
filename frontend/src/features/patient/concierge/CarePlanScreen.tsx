import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate, type LoaderFunctionArgs } from 'react-router-dom';

import {
  carePlanAppointmentsOptions,
  conditionsOptions,
  dailyTasksOptions,
  medicationsOptions,
} from '@/features/care-plan';
import { queryClient } from '@/shared/lib/query/client';
import { ConfirmDialog } from '@/shared/ui/composites/confirm-dialog';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

import {
  AddAppointmentModal,
  AddConditionModal,
  AddMedicationModal,
  EditMedicationModal,
} from './CarePlanModals';
import { CarePlanMainContent, CarePlanSidebar } from './CarePlanSections';
import { useCarePlanScreen } from './useCarePlanScreen';

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async (_args: LoaderFunctionArgs) => {
  await Promise.all([
    queryClient.prefetchQuery(conditionsOptions()),
    queryClient.prefetchQuery(medicationsOptions()),
    queryClient.prefetchQuery(carePlanAppointmentsOptions()),
    queryClient.prefetchQuery(dailyTasksOptions()),
  ]);

  return null;
};

export function CarePlanScreen() {
  const navigate = useNavigate();
  const screen = useCarePlanScreen();

  const deletionDialogCopy =
    screen.pendingDeletion?.kind === 'condition'
      ? {
          title: 'Supprimer cette condition ?',
          description: 'Cette condition sera retirée de votre plan de soins.',
        }
      : screen.pendingDeletion?.kind === 'medication'
        ? {
            title: 'Supprimer ce médicament ?',
            description: 'Ce traitement sera retiré de votre suivi.',
          }
        : screen.pendingDeletion?.kind === 'appointment'
          ? {
              title: 'Supprimer ce rendez-vous ?',
              description: 'Ce rendez-vous sera retiré de votre planification.',
            }
          : null;

  if (screen.loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-500/20" />
          <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/20" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
            </div>
            <div>
              <Skeleton className="mb-2 h-10 w-56" />
              <Skeleton className="h-6 w-64" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <SkeletonCard className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
                <div className="mb-6 flex items-center justify-between">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border-2 border-gray-200 p-4 dark:border-slate-600"
                    >
                      <div className="flex items-start gap-4">
                        <Skeleton className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-52" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>

              <SkeletonCard className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
                <div className="mb-6 flex items-center justify-between">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-4 w-44" />
                        </div>
                        <Skeleton className="h-6 w-28 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>

              <SkeletonCard className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
                <div className="mb-6 flex items-center justify-between">
                  <Skeleton className="h-8 w-56" />
                  <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-44" />
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-9 w-20 rounded-lg" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SkeletonCard>
            </div>

            <div className="space-y-6">
              <SkeletonCard className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
                <Skeleton className="mb-4 h-5 w-44" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-xl bg-gray-50 p-3 dark:bg-slate-700/50">
                      <div className="mb-2 flex items-start gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-5 w-5 rounded" />
                      </div>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  ))}
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </SkeletonCard>

              <SkeletonCard className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:from-rose-900/40 dark:to-pink-900/40">
                <Skeleton className="mb-4 h-5 w-40" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-7 w-12" />
                    </div>
                  ))}
                </div>
              </SkeletonCard>

              <SkeletonCard className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:from-purple-900/40 dark:to-indigo-900/40">
                <div className="text-center">
                  <Skeleton className="mx-auto mb-3 h-12 w-12 rounded-xl" />
                  <Skeleton className="mx-auto mb-2 h-5 w-28" />
                  <Skeleton className="mx-auto mb-2 h-4 w-48" />
                  <Skeleton className="mx-auto mb-4 h-4 w-40" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </SkeletonCard>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    screen.error &&
    screen.conditions.length === 0 &&
    screen.medications.length === 0 &&
    screen.appointments.length === 0 &&
    screen.tasks.length === 0
  ) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-500/20" />
          <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/20" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="Impossible de charger votre plan de soins"
            description={getApiErrorMessage(
              screen.error,
              'Réessayez dans quelques instants pour retrouver vos informations de suivi.',
            )}
            icon={<Heart className="h-5 w-5" />}
            action={
              <button
                onClick={screen.refetchAll}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Réessayer
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-rose-300/20 blur-3xl dark:bg-rose-500/20" />
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/health-concierge')}
              className="flex items-center font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au concierge
            </button>
          </div>
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Plan de soins
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Organisez vos soins chroniques
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <CarePlanMainContent
            appointments={screen.appointments}
            completedCount={screen.completedCount}
            medications={screen.medications}
            onAddAppointment={() => screen.setShowAddAppointmentModal(true)}
            onAddMedication={() => screen.setShowAddMedicationModal(true)}
            onDeleteAppointment={screen.handleDeleteAppointment}
            onDeleteMedication={screen.handleDeleteMedication}
            onEditMedication={screen.handleEditMedication}
            onToggleTask={screen.toggleTask}
            tasks={screen.tasks}
            totalCount={screen.totalCount}
          />

          <CarePlanSidebar
            conditions={screen.conditions}
            getStatusColor={screen.getStatusColor}
            getStatusLabel={screen.getStatusLabel}
            onAddCondition={() => screen.setShowAddConditionModal(true)}
            onDeleteCondition={screen.handleDeleteCondition}
          />
        </div>
      </div>

      <AddConditionModal
        form={screen.newCondition}
        onChange={screen.setNewCondition}
        onClose={() => screen.setShowAddConditionModal(false)}
        onSubmit={screen.handleAddCondition}
        open={screen.showAddConditionModal}
      />

      <AddMedicationModal
        form={screen.newMedication}
        onChange={screen.setNewMedication}
        onClose={() => screen.setShowAddMedicationModal(false)}
        onSubmit={screen.handleAddMedication}
        open={screen.showAddMedicationModal}
      />

      <EditMedicationModal
        medication={screen.selectedMedication}
        onChange={screen.setSelectedMedication}
        onClose={() => screen.setShowEditMedicationModal(false)}
        onSave={screen.handleSaveEditMedication}
        open={screen.showEditMedicationModal}
      />

      <AddAppointmentModal
        form={screen.newAppointment}
        onChange={screen.setNewAppointment}
        onClose={() => screen.setShowAddAppointmentModal(false)}
        onSubmit={screen.handleAddAppointment}
        open={screen.showAddAppointmentModal}
      />

      <ConfirmDialog
        open={screen.pendingDeletion !== null}
        onOpenChange={(open) => {
          if (!open) {
            screen.clearPendingDeletion();
          }
        }}
        title={deletionDialogCopy?.title ?? 'Supprimer cet élément ?'}
        description={deletionDialogCopy?.description}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        destructive
        onConfirm={screen.handleConfirmDeletion}
      />
    </div>
  );
}
