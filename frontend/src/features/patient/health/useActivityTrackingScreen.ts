import { useEffect, useState } from 'react';

import { formatTime as formatLocalizedTime } from '@/shared/lib/i18n/formatting';

import type { WalkSession } from './activityTracking.types';

function getWalkingIntensity(speed: number) {
  if (speed < 3) {
    return {
      badgeClassName: 'bg-blue-500 text-white',
      description: 'Marche tranquille',
      level: 'Légère',
    };
  }

  if (speed < 5) {
    return {
      badgeClassName: 'bg-green-500 text-white',
      description: 'Marche active',
      level: 'Modérée',
    };
  }

  if (speed < 6.5) {
    return {
      badgeClassName: 'bg-orange-500 text-white',
      description: 'Marche rapide',
      level: 'Intense',
    };
  }

  return {
    badgeClassName: 'bg-red-500 text-white',
    description: 'Marche sportive',
    level: 'Très intense',
  };
}

function getCalorieBurnRate(weight: number, speed: number) {
  let met = 2.0;

  if (speed >= 3 && speed < 4) {
    met = 3.0;
  }

  if (speed >= 4 && speed < 5) {
    met = 3.5;
  }

  if (speed >= 5 && speed < 6) {
    met = 4.3;
  }

  if (speed >= 6) {
    met = 5.0;
  }

  return (met * weight * 3.5) / 200;
}

function getHydrationRecommendation(duration: number, intensity: string) {
  const hours = duration / 3600;
  let mlPerHour = 200;

  if (intensity === 'Modérée') {
    mlPerHour = 300;
  }

  if (intensity === 'Intense') {
    mlPerHour = 400;
  }

  if (intensity === 'Très intense') {
    mlPerHour = 500;
  }

  return Math.round(mlPerHour * hours);
}

function getRecoveryRecommendation(duration: number, age: number) {
  const minutes = duration / 60;

  if (minutes < 15) {
    return {
      suggestions: ['Hydratez-vous', 'Étirements légers (5 min)'],
      title: 'Récupération légère',
    };
  }

  if (minutes < 30) {
    return {
      suggestions: [
        "Buvez 250ml d'eau",
        'Étirements des jambes (10 min)',
        age > 50 ? 'Repos assis 5-10 min' : 'Marche lente 5 min',
      ],
      title: 'Récupération modérée',
    };
  }

  return {
    suggestions: [
      "Hydratation : 500ml d'eau",
      'Étirements complets (15 min)',
      'Repos 15-20 minutes',
      age > 50 ? 'Surveillez votre fréquence cardiaque' : 'Snack protéiné recommandé',
    ],
    title: 'Récupération complète',
  };
}

function getHeartRateZone(age: number, intensity: string) {
  const maxHeartRate = 220 - age;

  if (intensity === 'Légère') {
    return {
      benefit: 'Amélioration de la santé générale',
      range: `${Math.round(maxHeartRate * 0.5)}-${Math.round(maxHeartRate * 0.6)} bpm`,
      zone: 'Zone 1 - Récupération',
    };
  }

  if (intensity === 'Modérée') {
    return {
      benefit: 'Brûlage des graisses optimal',
      range: `${Math.round(maxHeartRate * 0.6)}-${Math.round(maxHeartRate * 0.7)} bpm`,
      zone: 'Zone 2 - Endurance',
    };
  }

  return {
    benefit: 'Amélioration cardiovasculaire',
    range: `${Math.round(maxHeartRate * 0.7)}-${Math.round(maxHeartRate * 0.8)} bpm`,
    zone: 'Zone 3 - Aérobie',
  };
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function formatTimeLabel(date: Date) {
  return formatLocalizedTime(date, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function useActivityTrackingScreen() {
  const userProfile = { age: 45, weight: 78 };

  const [goal, setGoal] = useState(8000);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(goal);
  const [sessions, setSessions] = useState<WalkSession[]>([]);
  const [activeSession, setActiveSession] = useState<WalkSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const activeSessionId = activeSession?.id;

  const totalSteps =
    sessions.reduce((sum, session) => sum + session.steps, 0) + (activeSession?.steps || 0);
  const totalDistance =
    sessions.reduce((sum, session) => sum + session.distance, 0) + (activeSession?.distance || 0);
  const totalDuration =
    sessions.reduce((sum, session) => sum + session.duration, 0) + (activeSession?.duration || 0);
  const totalCalories =
    sessions.reduce((sum, session) => sum + session.calories, 0) + (activeSession?.calories || 0);
  const percentage = (totalSteps / goal) * 100;
  const currentSpeed =
    activeSession && activeSession.duration > 0
      ? activeSession.distance / (activeSession.duration / 3600)
      : 0;
  const averageSpeed = totalDuration > 0 ? totalDistance / (totalDuration / 3600) : 0;

  const intensity = getWalkingIntensity(activeSession ? currentSpeed : averageSpeed);
  const calorieBurnRate = getCalorieBurnRate(
    userProfile.weight,
    activeSession ? currentSpeed : averageSpeed,
  );
  const hydrationNeeded = getHydrationRecommendation(totalDuration, intensity.level);
  const recovery = getRecoveryRecommendation(totalDuration, userProfile.age);
  const heartRate = getHeartRateZone(userProfile.age, intensity.level);

  useEffect(() => {
    if (!activeSessionId || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSession((currentSession) => {
        if (!currentSession || currentSession.id !== activeSessionId) {
          return currentSession;
        }

        const stepIncrement = Math.floor(Math.random() * 3) + 1;
        const newSteps = currentSession.steps + stepIncrement;
        const newDuration = currentSession.duration + 1;
        const newDistance = (newSteps / 1000) * 0.8;
        const newCalories = Math.floor(newSteps * 0.04);

        return {
          ...currentSession,
          calories: newCalories,
          distance: parseFloat(newDistance.toFixed(2)),
          duration: newDuration,
          steps: newSteps,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeSessionId, isPaused]);

  const startSession = () => {
    setActiveSession({
      calories: 0,
      distance: 0,
      duration: 0,
      id: Date.now().toString(),
      isActive: true,
      startTime: new Date(),
      steps: 0,
    });
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused((currentState) => !currentState);
  };

  const endSession = () => {
    if (!activeSession) {
      return;
    }

    const completedSession: WalkSession = {
      ...activeSession,
      endTime: new Date(),
      isActive: false,
    };

    setSessions((currentSessions) => [...currentSessions, completedSession]);
    setActiveSession(null);
    setIsPaused(false);
  };

  const updateGoal = () => {
    setGoal(newGoal);
    setShowGoalModal(false);
  };

  const weekData = [
    { day: 'Lun', steps: 7200, completed: true },
    { day: 'Mar', steps: 8500, completed: true },
    { day: 'Mer', steps: 6800, completed: false },
    { day: 'Jeu', steps: 9200, completed: true },
    { day: 'Ven', steps: totalSteps, completed: totalSteps >= goal },
    { day: 'Sam', steps: 0, completed: false },
    { day: 'Dim', steps: 0, completed: false },
  ];

  return {
    activeSession,
    calorieBurnRate,
    currentSpeed,
    endSession,
    formatDuration,
    formatTime: formatTimeLabel,
    goal,
    heartRate,
    hydrationNeeded,
    intensity,
    isPaused,
    newGoal,
    percentage,
    recovery,
    sessions,
    setNewGoal,
    setShowGoalModal,
    showGoalModal,
    startSession,
    togglePause,
    totalCalories,
    totalDistance,
    totalDuration,
    totalSteps,
    updateGoal,
    userProfile,
    weekData,
  };
}
