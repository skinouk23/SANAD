import { AlertCircle, Mail, Shield, Trash2, UserPlus, X, Zap } from 'lucide-react';

import { Skeleton, SkeletonCard } from '@/shared/ui/composites/loading';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';
import type { PatientDashboardScreenViewModel } from '@/features/patient/dashboard/usePatientDashboardScreen';

const EMPTY_RELATION_VALUE = '__empty_relation__';
const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500';

function FamilyMembersLoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonCard key={index} className="p-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-3.5 w-32 rounded" />
              <Skeleton className="mb-2 h-3 w-28 rounded" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

function FamilyMembersErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-slate-600 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:shadow-none">
      <p className="text-xs">Le cercle familial n'a pas pu etre charge pour le moment.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 text-xs font-semibold text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
      >
        Reessayer
      </button>
    </div>
  );
}

export function PatientFamilyManagementDialog({
  screen,
}: {
  screen: PatientDashboardScreenViewModel;
}) {
  const { text } = screen;

  if (!screen.showFamilyModal) {
    return null;
  }

  return (
    <Dialog
      open={screen.showFamilyModal}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          screen.onCloseFamilyModal();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="md" scroll="content">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {text.familyCircle.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Gestion des membres du cercle familial.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer la gestion du cercle familial"
              className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-500/30 dark:bg-cyan-500/10">
            <div className="flex items-start gap-2.5">
              <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
              <div>
                <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
                  {text.familyCircle.secureSharing}
                </p>
                <p className="mt-0.5 text-[10px] text-cyan-600 dark:text-cyan-400/70">
                  {text.familyCircle.secureDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {text.familyCircle.membersCount} ({screen.familyMembers.length})
            </h4>
            {screen.familyInitialLoading ? (
              <FamilyMembersLoadingState />
            ) : screen.familyError ? (
              <FamilyMembersErrorState onRetry={screen.onRetryFamilyMembers} />
            ) : (
              screen.familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-base font-bold text-white">
                      {member.initial}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </div>
                      {member.secondaryText ? (
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {member.secondaryText}
                        </div>
                      ) : null}
                      <span className="mt-0.5 inline-block rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400">
                        {member.relationshipLabel}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      screen.onRemoveMember(member.id);
                    }}
                    disabled={screen.removeMemberLoading}
                    className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </DialogBody>

        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={() => {
              screen.onCloseFamilyModal();
              screen.onOpenAddMemberModal();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-[0.96]"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter
          </button>
          <button
            type="button"
            onClick={screen.onCloseFamilyModal}
            className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            {text.common.close}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PatientAddFamilyMemberDialog({
  screen,
}: {
  screen: PatientDashboardScreenViewModel;
}) {
  const { text } = screen;

  if (!screen.showAddMemberModal) {
    return null;
  }

  return (
    <Dialog
      open={screen.showAddMemberModal}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          screen.onCloseAddMemberModal();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="sm">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            {text.familyCircle.addMemberBtn}
          </DialogTitle>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer l'ajout d'un membre"
              className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                {text.familyCircle.fullName}
              </label>
              <input
                type="text"
                value={screen.newMemberName}
                onChange={(event) => {
                  screen.onNewMemberNameChange(event.target.value);
                }}
                placeholder="Ex: Sarah Trabelsi"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                {text.auth.email}
              </label>
              <input
                type="email"
                value={screen.newMemberEmail}
                onChange={(event) => {
                  screen.onNewMemberEmailChange(event.target.value);
                }}
                placeholder="sarah@example.com"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                {text.familyCircle.relation}
              </label>
              <Select
                value={screen.newMemberRole || EMPTY_RELATION_VALUE}
                onValueChange={(value) => {
                  screen.onNewMemberRoleChange(value === EMPTY_RELATION_VALUE ? '' : value);
                }}
              >
                <SelectTrigger aria-label={text.familyCircle.relation} className="w-full">
                  <SelectValue placeholder={text.familyCircle.selectRelation} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={EMPTY_RELATION_VALUE}>
                      {text.familyCircle.selectRelation}
                    </SelectItem>
                    {screen.relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-2.5 dark:border-blue-500/30 dark:bg-blue-500/10">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="text-[10px] text-blue-700 dark:text-blue-300">
                L'email est enregistre comme contact facultatif pour ce proche.
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={screen.onSubmitNewMember}
              disabled={!screen.newMemberName || !screen.newMemberRole || screen.addMemberLoading}
              className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {screen.addMemberLoading ? 'Ajout...' : text.familyCircle.addMemberBtn}
            </button>
            <button
              type="button"
              onClick={screen.onCloseAddMemberModal}
              className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              {text.common.cancel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PatientEmergencyDialog({ screen }: { screen: PatientDashboardScreenViewModel }) {
  const { text } = screen;

  if (!screen.showEmergencyModal) {
    return null;
  }

  return (
    <Dialog
      open={screen.showEmergencyModal}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          screen.onCloseEmergencyModal();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="sm">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {text.emergency.title}
            </DialogTitle>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Fermer les contacts d'urgence"
              className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2.5">
            <a href="tel:190" className="block">
              <div className="rounded-xl bg-red-500 p-3 text-white transition-colors hover:bg-red-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="text-2xl">🚑</div>
                    <div>
                      <h4 className="text-sm font-bold">{text.emergency.samu}</h4>
                      <p className="text-xs text-red-100">{text.emergency.medicalEmergency}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">190</span>
                </div>
              </div>
            </a>

            <a href="tel:197" className="block">
              <div className="rounded-xl bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="text-2xl">👮</div>
                    <div>
                      <h4 className="text-sm font-bold">{text.emergency.police}</h4>
                      <p className="text-xs text-blue-100">{text.emergency.securityEmergency}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">197</span>
                </div>
              </div>
            </a>

            <a href="tel:198" className="block">
              <div className="rounded-xl bg-orange-500 p-3 text-white transition-colors hover:bg-orange-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="text-2xl">🚒</div>
                    <div>
                      <h4 className="text-sm font-bold">{text.emergency.firefighters}</h4>
                      <p className="text-xs text-orange-100">{text.emergency.fireRescue}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">198</span>
                </div>
              </div>
            </a>

            <a href="tel:193" className="block">
              <div className="rounded-xl bg-amber-600 p-3 text-white transition-colors hover:bg-amber-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="text-2xl">🆘</div>
                    <div>
                      <h4 className="text-sm font-bold">{text.emergency.civilProtection}</h4>
                      <p className="text-xs text-amber-100">{text.emergency.naturalDisasters}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">193</span>
                </div>
              </div>
            </a>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-500/30 dark:bg-amber-500/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-[10px] text-amber-700 dark:text-amber-300">
                {text.emergency.onlyCallIfReal}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
