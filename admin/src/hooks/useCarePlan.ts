/**
 * Care Plan Hooks
 * Custom React hooks for care plan data (conditions, medications, appointments, tasks)
 */

import { useState, useCallback } from 'react';
import { useApi } from './useApi';

// ============================================
// TYPES
// ============================================

export interface ChronicCondition {
  id: number;
  name: string;
  since: string;
  status: string;
  icon: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  nextRefill: string;
  stock: number;
  condition: string;
}

export interface CarePlanAppointment {
  id: number;
  type: string;
  date: string;
  time: string;
  doctor?: string;
  location?: string;
  status: string;
}

export interface DailyTask {
  id: number;
  title: string;
  frequency: string;
  completed: boolean;
  time: string;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_CONDITIONS: ChronicCondition[] = [
{
  id: 1,
  name: 'Hypertension artérielle',
  since: 'Depuis 2020',
  status: 'controlled',
  icon: '❤️'
},
{
  id: 2,
  name: 'Diabète type 2',
  since: 'Depuis 2018',
  status: 'monitored',
  icon: '🩺'
}];


const MOCK_MEDICATIONS: Medication[] = [
{
  id: 1,
  name: 'Amlodipine 5mg',
  dosage: '1 comprimé le matin',
  frequency: 'Quotidien',
  nextRefill: '25 Jan 2024',
  stock: 15,
  condition: 'Hypertension'
},
{
  id: 2,
  name: 'Metformine 850mg',
  dosage: '1 comprimé matin et soir',
  frequency: '2x par jour',
  nextRefill: '20 Jan 2024',
  stock: 8,
  condition: 'Diabète'
}];


const MOCK_APPOINTMENTS: CarePlanAppointment[] = [
{
  id: 1,
  type: 'Consultation cardiologie',
  date: '25 Jan 2024',
  time: '10:00',
  doctor: 'Dr. Trabelsi',
  status: 'upcoming'
},
{
  id: 2,
  type: 'Prise de sang',
  date: '30 Jan 2024',
  time: '08:00',
  location: 'Laboratoire Central',
  status: 'upcoming'
},
{
  id: 3,
  type: 'Suivi diabétologie',
  date: '5 Fév 2024',
  time: '14:30',
  doctor: 'Dr. Ben Ali',
  status: 'scheduled'
}];


const MOCK_TASKS: DailyTask[] = [
{
  id: 1,
  title: 'Mesurer la tension',
  frequency: 'Quotidien - Matin',
  completed: true,
  time: '08:00'
},
{
  id: 2,
  title: 'Glycémie à jeun',
  frequency: 'Quotidien - Matin',
  completed: true,
  time: '07:30'
},
{
  id: 3,
  title: 'Prendre Amlodipine',
  frequency: 'Quotidien - Matin',
  completed: false,
  time: '09:00'
},
{
  id: 4,
  title: 'Marche 30 minutes',
  frequency: 'Quotidien - Après-midi',
  completed: false,
  time: '17:00'
}];


// ============================================
// HOOKS
// ============================================

/**
 * Hook for fetching chronic conditions
 */
export function useChronicConditions() {
  return useApi<ChronicCondition[]>(() => Promise.resolve(MOCK_CONDITIONS), []);
}

/**
 * Hook for fetching medications
 */
export function useMedications() {
  return useApi<Medication[]>(() => Promise.resolve(MOCK_MEDICATIONS), []);
}

/**
 * Hook for fetching care plan appointments
 */
export function useCarePlanAppointments() {
  return useApi<CarePlanAppointment[]>(
    () => Promise.resolve(MOCK_APPOINTMENTS),
    []
  );
}

/**
 * Hook for managing daily tasks with toggle support
 */
export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>(MOCK_TASKS);

  const toggleTask = useCallback((taskId: number) => {
    setTasks((prev) =>
    prev.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    );
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;

  return {
    data: tasks,
    loading: false,
    error: null,
    toggleTask,
    completedCount,
    totalCount: tasks.length
  };
}