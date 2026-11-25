import { Crown, Gift, Heart, MessageCircle, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLanguage } from '@/shared/lib/i18n/language-context';
import { useNotificationsUnreadCount } from '@/shared/lib/notifications/unread-count';
import { APP_FEATURE_CODES, useAppFeatures } from '@/features/app-features';
import { useAppointmentStats, useUpcomingAppointments } from '@/features/bookings';
import type { BookingListItemResponse } from '@/features/bookings/schema';
import { usePatientFamilyMembers } from '@/features/family-circle';
import {
  getRelationshipLabel,
  getRelativeAppointmentLabel,
} from '@/features/patient/dashboard/patientDashboard.utils';
import { useCurrentPatient } from '@/features/users';

interface PatientDashboardFamilyMember {
  id: string;
  name: string;
  initial: string;
  role: string;
  relationshipLabel: string;
  secondaryText: string;
}

interface PatientDashboardQuickAccessItem {
  to: string;
  icon: LucideIcon;
  label: string;
  desc: string;
}

interface PatientDashboardRelationshipOption {
  value: string;
  label: string;
}

export interface PatientDashboardScreenViewModel {
  appointmentStatsError: unknown;
  appointmentStatsLoading: boolean;
  appointments: BookingListItemResponse[];
  appointmentsError: unknown;
  appointmentsLoading: boolean;
  familyError: unknown;
  familyInitialLoading: boolean;
  familyMembers: PatientDashboardFamilyMember[];
  familyRefreshing: boolean;
  newMemberEmail: string;
  newMemberName: string;
  newMemberRole: string;
  notificationsLoading: boolean;
  notificationsUnreadCount: number;
  patientLoading: boolean;
  patientName: string;
  patientStats: {
    streakDays: number;
    upcomingAppointments: number;
  };
  quickAccessItems: PatientDashboardQuickAccessItem[];
  relationshipOptions: PatientDashboardRelationshipOption[];
  removeMemberLoading: boolean;
  addMemberLoading: boolean;
  showAddMemberModal: boolean;
  showEmergencyModal: boolean;
  showFamilyModal: boolean;
  lastAppointmentLabel: string | null;
  isFamilyCircleFeatureActive: boolean;
  isHealthTrackingFeatureActive: boolean;
  text: ReturnType<typeof useLanguage>['t'];
  onCloseAddMemberModal: () => void;
  onCloseEmergencyModal: () => void;
  onCloseFamilyModal: () => void;
  onNewMemberEmailChange: (value: string) => void;
  onNewMemberNameChange: (value: string) => void;
  onNewMemberRoleChange: (value: string) => void;
  onOpenAddMemberModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenFamilyModal: () => void;
  onRetryAppointmentStats: () => void;
  onRemoveMember: (id: string) => void;
  onRetryAppointments: () => void;
  onRetryFamilyMembers: () => void;
  onSubmitNewMember: () => void;
}

export function usePatientDashboardScreen(): PatientDashboardScreenViewModel {
  const { t } = useLanguage();
  const { isFeatureActive } = useAppFeatures();
  const { data: currentPatient, loading: patientLoading } = useCurrentPatient();
  const {
    data: upcomingAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useUpcomingAppointments();
  const {
    data: appointmentStats,
    loading: appointmentStatsLoading,
    error: appointmentStatsError,
    refetch: refetchAppointmentStats,
  } = useAppointmentStats();
  const {
    members,
    addMember,
    addMemberLoading,
    removeMember,
    removeMemberLoading,
    isInitialLoading: familyInitialLoading,
    isRefreshing: familyRefreshing,
    error: familyError,
    refetch: refetchFamilyMembers,
  } = usePatientFamilyMembers();
  const { data: unreadCountResponse, loading: notificationsLoading } =
    useNotificationsUnreadCount();
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const isFamilyCircleFeatureActive = isFeatureActive(APP_FEATURE_CODES.familyCircle);
  const isHealthTrackingFeatureActive = isFeatureActive(APP_FEATURE_CODES.healthTracking);

  const appointments = useMemo(() => upcomingAppointments ?? [], [upcomingAppointments]);
  const relationshipLabels = useMemo(
    () => ({
      spouse: t.familyCircle.spouse,
      child: `${t.familyCircle.son}/${t.familyCircle.daughter}`,
      parent: t.familyCircle.parent,
      sibling: `${t.familyCircle.brother}/${t.familyCircle.sister}`,
      grandparent: t.familyCircle.grandparent ?? 'Grand-parent',
      grandchild: t.familyCircle.grandchild ?? 'Petit-enfant',
      other: t.familyCircle.other,
    }),
    [t],
  );

  const familyMembers = useMemo(
    () =>
      members.map((member) => {
        const relationshipLabel = getRelationshipLabel(member.role, relationshipLabels);

        return {
          ...member,
          relationshipLabel,
          secondaryText: member.email ?? '',
        };
      }),
    [members, relationshipLabels],
  );

  const patientStats = useMemo(
    () => ({
      streakDays: appointmentStats?.careStreakDays ?? 0,
      upcomingAppointments: appointments.length,
    }),
    [appointmentStats?.careStreakDays, appointments.length],
  );
  const patientName = useMemo(
    () => [currentPatient?.firstName, currentPatient?.lastName].filter(Boolean).join(' '),
    [currentPatient?.firstName, currentPatient?.lastName],
  );
  const lastAppointmentLabel = useMemo(
    () =>
      getRelativeAppointmentLabel(appointmentStats?.lastAppointmentDate, {
        daysAgoTemplate: t.dashboard.daysAgo,
        today: t.dashboard.today,
        yesterday: t.dashboard.yesterday,
      }),
    [appointmentStats?.lastAppointmentDate, t],
  );

  const quickAccessItems = useMemo<PatientDashboardQuickAccessItem[]>(
    () =>
      [
        {
          to: '/messages',
          icon: MessageCircle,
          label: t.messages.title,
          desc: `2 ${t.dashboard.newMessages}`,
        },
        {
          to: '/rewards',
          icon: Gift,
          label: 'Récompenses',
          desc: `450 ${t.dashboard.points}`,
        },
        {
          to: '/donation-medicaments',
          icon: Heart,
          label: '💚 Dons solidaires',
          desc: 'Médicaments & matériel',
        },
        {
          to: '/health-concierge',
          icon: Crown,
          label: t.dashboard.healthConcierge,
          desc: t.dashboard.assistance247,
        },
      ].filter((item) => {
        if (item.to === '/donation-medicaments') {
          return isFeatureActive(APP_FEATURE_CODES.medicineDonation);
        }

        if (item.to === '/health-concierge') {
          return isFeatureActive(APP_FEATURE_CODES.healthConcierge);
        }

        return true;
      }),
    [isFeatureActive, t],
  );
  const relationshipOptions = useMemo<PatientDashboardRelationshipOption[]>(
    () => [
      { value: 'Spouse', label: relationshipLabels.spouse },
      { value: 'Child', label: `${t.familyCircle.son} / ${t.familyCircle.daughter}` },
      { value: 'Sibling', label: `${t.familyCircle.brother} / ${t.familyCircle.sister}` },
      { value: 'Parent', label: relationshipLabels.parent },
      { value: 'Grandparent', label: relationshipLabels.grandparent },
      { value: 'Grandchild', label: relationshipLabels.grandchild },
      { value: 'Other', label: relationshipLabels.other },
    ],
    [relationshipLabels, t],
  );

  const handleSubmitNewMember = useCallback(() => {
    if (!newMemberName || !newMemberRole) {
      return;
    }

    addMember({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    });
    setNewMemberEmail('');
    setNewMemberName('');
    setNewMemberRole('');
    setShowAddMemberModal(false);
  }, [addMember, newMemberEmail, newMemberName, newMemberRole]);

  const handleRemoveMember = useCallback(
    (id: string) => {
      void removeMember(id);
    },
    [removeMember],
  );

  const handleOpenAddMemberModal = useCallback(() => {
    if (!isFamilyCircleFeatureActive) {
      return;
    }

    setShowAddMemberModal(true);
  }, [isFamilyCircleFeatureActive]);

  const handleOpenFamilyModal = useCallback(() => {
    if (!isFamilyCircleFeatureActive) {
      return;
    }

    setShowFamilyModal(true);
  }, [isFamilyCircleFeatureActive]);

  useEffect(() => {
    if (isFamilyCircleFeatureActive) {
      return;
    }

    setShowFamilyModal(false);
    setShowAddMemberModal(false);
  }, [isFamilyCircleFeatureActive]);

  return {
    addMemberLoading,
    appointmentStatsError,
    appointmentStatsLoading,
    appointments,
    appointmentsError,
    appointmentsLoading,
    familyError,
    familyInitialLoading,
    familyMembers,
    familyRefreshing,
    isFamilyCircleFeatureActive,
    isHealthTrackingFeatureActive,
    lastAppointmentLabel,
    newMemberEmail,
    newMemberName,
    newMemberRole,
    notificationsLoading,
    notificationsUnreadCount: unreadCountResponse?.count ?? 0,
    patientLoading,
    patientName,
    patientStats,
    quickAccessItems,
    relationshipOptions,
    removeMemberLoading,
    showAddMemberModal,
    showEmergencyModal,
    showFamilyModal,
    text: t,
    onCloseAddMemberModal: () => {
      setShowAddMemberModal(false);
    },
    onCloseEmergencyModal: () => {
      setShowEmergencyModal(false);
    },
    onCloseFamilyModal: () => {
      setShowFamilyModal(false);
    },
    onNewMemberEmailChange: setNewMemberEmail,
    onNewMemberNameChange: setNewMemberName,
    onNewMemberRoleChange: setNewMemberRole,
    onOpenAddMemberModal: handleOpenAddMemberModal,
    onOpenEmergencyModal: () => {
      setShowEmergencyModal(true);
    },
    onOpenFamilyModal: handleOpenFamilyModal,
    onRetryAppointmentStats: () => {
      void refetchAppointmentStats();
    },
    onRemoveMember: handleRemoveMember,
    onRetryAppointments: () => {
      void refetchAppointments();
    },
    onRetryFamilyMembers: () => {
      void refetchFamilyMembers();
    },
    onSubmitNewMember: handleSubmitNewMember,
  };
}
