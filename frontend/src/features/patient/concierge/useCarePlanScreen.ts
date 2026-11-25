import { useEffect, useState } from 'react';

import {
  useCarePlanAppointments,
  useChronicConditions,
  useDailyTasks,
  useMedications,
} from '@/features/care-plan';

import type { CarePlanAppointment, CarePlanCondition, CarePlanMedication } from './carePlan.types';

type PendingCarePlanDeletion = {
  kind: 'condition' | 'medication' | 'appointment';
  id: number;
} | null;

function getStatusColor(status: CarePlanCondition['status']) {
  switch (status) {
    case 'controlled':
      return 'border-green-200 bg-green-100 text-green-700 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400';
    case 'monitored':
      return 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400';
    case 'attention':
      return 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700 dark:border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400';
  }
}

function getStatusLabel(status: CarePlanCondition['status']) {
  switch (status) {
    case 'controlled':
      return 'Contrôlé';
    case 'monitored':
      return 'Surveillé';
    case 'attention':
      return 'Attention';
    default:
      return 'Inconnu';
  }
}

function normalizeConditionStatus(status: string): CarePlanCondition['status'] {
  switch (status) {
    case 'controlled':
    case 'monitored':
    case 'attention':
      return status;
    default:
      return 'monitored';
  }
}

function toCarePlanCondition(condition: {
  id: number;
  icon: string;
  name: string;
  since: string;
  status: string;
}): CarePlanCondition {
  return {
    ...condition,
    status: normalizeConditionStatus(condition.status),
  };
}

export function useCarePlanScreen() {
  const {
    data: initialConditions,
    loading: conditionsLoading,
    error: conditionsError,
    refetch: refetchConditions,
  } = useChronicConditions();
  const {
    data: initialMedications,
    loading: medsLoading,
    error: medsError,
    refetch: refetchMedications,
  } = useMedications();
  const {
    data: initialAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useCarePlanAppointments();
  const {
    data: taskData,
    toggleTask,
    completedCount,
    totalCount,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useDailyTasks();

  const [conditions, setConditions] = useState<CarePlanCondition[]>([]);
  const [medications, setMedications] = useState<CarePlanMedication[]>([]);
  const [appointments, setAppointments] = useState<CarePlanAppointment[]>([]);
  const [hasHydratedConditions, setHasHydratedConditions] = useState(false);
  const [hasHydratedMedications, setHasHydratedMedications] = useState(false);
  const [hasHydratedAppointments, setHasHydratedAppointments] = useState(false);
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showEditMedicationModal, setShowEditMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<CarePlanMedication | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<PendingCarePlanDeletion>(null);
  const [newCondition, setNewCondition] = useState<{
    name: string;
    icon: string;
    since: string;
    status: CarePlanCondition['status'];
  }>({
    name: '',
    icon: '❤️',
    since: '',
    status: 'monitored',
  });
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    condition: '',
    stock: 30,
    nextRefill: '',
  });
  const [newAppointment, setNewAppointment] = useState({
    type: '',
    date: '',
    time: '',
    doctor: '',
    location: '',
  });

  useEffect(() => {
    if (hasHydratedConditions || initialConditions === null) {
      return;
    }

    setConditions(initialConditions.map(toCarePlanCondition));
    setHasHydratedConditions(true);
  }, [hasHydratedConditions, initialConditions]);

  useEffect(() => {
    if (hasHydratedMedications || initialMedications === null) {
      return;
    }

    setMedications(initialMedications);
    setHasHydratedMedications(true);
  }, [hasHydratedMedications, initialMedications]);

  useEffect(() => {
    if (hasHydratedAppointments || initialAppointments === null) {
      return;
    }

    setAppointments(initialAppointments);
    setHasHydratedAppointments(true);
  }, [hasHydratedAppointments, initialAppointments]);

  const handleAddCondition = () => {
    if (!newCondition.name || !newCondition.since) {
      return;
    }

    const condition: CarePlanCondition = {
      id: Date.now(),
      ...newCondition,
    };

    setConditions((currentConditions) => [...currentConditions, condition]);
    setNewCondition({
      name: '',
      icon: '❤️',
      since: '',
      status: 'monitored',
    });
    setShowAddConditionModal(false);
  };

  const handleDeleteCondition = (id: number) => {
    setPendingDeletion({ kind: 'condition', id });
  };

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      return;
    }

    const medication: CarePlanMedication = {
      id: Date.now(),
      ...newMedication,
    };

    setMedications((currentMedications) => [...currentMedications, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      condition: '',
      stock: 30,
      nextRefill: '',
    });
    setShowAddMedicationModal(false);
  };

  const handleEditMedication = (medication: CarePlanMedication) => {
    setSelectedMedication(medication);
    setShowEditMedicationModal(true);
  };

  const handleSaveEditMedication = () => {
    if (!selectedMedication) {
      return;
    }

    setMedications((currentMedications) =>
      currentMedications.map((medication) =>
        medication.id === selectedMedication.id ? selectedMedication : medication,
      ),
    );
    setShowEditMedicationModal(false);
    setSelectedMedication(null);
  };

  const handleDeleteMedication = (id: number) => {
    setPendingDeletion({ kind: 'medication', id });
  };

  const handleAddAppointment = () => {
    if (!newAppointment.type || !newAppointment.date || !newAppointment.time) {
      return;
    }

    const appointment: CarePlanAppointment = {
      id: Date.now(),
      ...newAppointment,
    };

    setAppointments((currentAppointments) => [...currentAppointments, appointment]);
    setNewAppointment({
      type: '',
      date: '',
      time: '',
      doctor: '',
      location: '',
    });
    setShowAddAppointmentModal(false);
  };

  const handleDeleteAppointment = (id: number) => {
    setPendingDeletion({ kind: 'appointment', id });
  };

  const handleConfirmDeletion = () => {
    if (!pendingDeletion) {
      return;
    }

    switch (pendingDeletion.kind) {
      case 'condition':
        setConditions((currentConditions) =>
          currentConditions.filter((condition) => condition.id !== pendingDeletion.id),
        );
        break;
      case 'medication':
        setMedications((currentMedications) =>
          currentMedications.filter((medication) => medication.id !== pendingDeletion.id),
        );
        break;
      case 'appointment':
        setAppointments((currentAppointments) =>
          currentAppointments.filter((appointment) => appointment.id !== pendingDeletion.id),
        );
        break;
    }

    setPendingDeletion(null);
  };

  const clearPendingDeletion = () => {
    setPendingDeletion(null);
  };

  const refetchAll = () => {
    void Promise.all([
      refetchConditions(),
      refetchMedications(),
      refetchAppointments(),
      refetchTasks(),
    ]);
  };

  return {
    appointments,
    completedCount,
    conditions,
    clearPendingDeletion,
    handleConfirmDeletion,
    error: conditionsError ?? medsError ?? appointmentsError ?? tasksError,
    getStatusColor,
    getStatusLabel,
    handleAddAppointment,
    handleAddCondition,
    handleAddMedication,
    handleDeleteAppointment,
    handleDeleteCondition,
    handleDeleteMedication,
    handleEditMedication,
    handleSaveEditMedication,
    loading: conditionsLoading || medsLoading || appointmentsLoading || tasksLoading,
    medications,
    newAppointment,
    newCondition,
    newMedication,
    pendingDeletion,
    refetchAll,
    selectedMedication,
    setNewAppointment,
    setNewCondition,
    setNewMedication,
    setSelectedMedication,
    setShowAddAppointmentModal,
    setShowAddConditionModal,
    setShowAddMedicationModal,
    setShowEditMedicationModal,
    showAddAppointmentModal,
    showAddConditionModal,
    showAddMedicationModal,
    showEditMedicationModal,
    tasks: taskData ?? [],
    toggleTask,
    totalCount,
  };
}
