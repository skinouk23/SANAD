import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Footprints,
  Award,
  Target,
  Play,
  Pause,
  Square,
  Clock,
  Edit,
  Zap,
  Droplets,
  Heart,
  TrendingUp,
  AlertCircle,
  Sparkles } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
interface WalkSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  steps: number;
  duration: number; // in seconds
  distance: number; // in km
  calories: number;
  isActive: boolean;
}
interface UserProfile {
  age: number;
  weight: number;
}
export function ActivityTracking() {
  const navigate = useNavigate();
  // User profile (in real app, this would come from context/API)
  const userProfile: UserProfile = {
    age: 45,
    weight: 78
  };
  // State
  const [goal, setGoal] = useState(8000);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(goal);
  const [sessions, setSessions] = useState<WalkSession[]>([]);
  const [activeSession, setActiveSession] = useState<WalkSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  // Calculate total steps from all sessions
  const totalSteps =
  sessions.reduce((sum, session) => sum + session.steps, 0) + (
  activeSession?.steps || 0);
  const totalDistance =
  sessions.reduce((sum, session) => sum + session.distance, 0) + (
  activeSession?.distance || 0);
  const totalDuration =
  sessions.reduce((sum, session) => sum + session.duration, 0) + (
  activeSession?.duration || 0);
  const totalCalories =
  sessions.reduce((sum, session) => sum + session.calories, 0) + (
  activeSession?.calories || 0);
  const percentage = totalSteps / goal * 100;
  // Calculate speed (km/h)
  const currentSpeed =
  activeSession && activeSession.duration > 0 ?
  activeSession.distance / (activeSession.duration / 3600) :
  0;
  // Calculate average speed for the day
  const averageSpeed =
  totalDuration > 0 ? totalDistance / (totalDuration / 3600) : 0;
  // Smart Insights Calculations
  const getWalkingIntensity = (speed: number) => {
    if (speed < 3)
    return {
      level: 'Légère',
      color: 'blue',
      description: 'Marche tranquille'
    };
    if (speed < 5)
    return {
      level: 'Modérée',
      color: 'green',
      description: 'Marche active'
    };
    if (speed < 6.5)
    return {
      level: 'Intense',
      color: 'orange',
      description: 'Marche rapide'
    };
    return {
      level: 'Très intense',
      color: 'red',
      description: 'Marche sportive'
    };
  };
  const getCalorieBurnRate = (weight: number, speed: number) => {
    // MET (Metabolic Equivalent) calculation
    let met = 2.0; // Light walking
    if (speed >= 3 && speed < 4) met = 3.0;
    if (speed >= 4 && speed < 5) met = 3.5;
    if (speed >= 5 && speed < 6) met = 4.3;
    if (speed >= 6) met = 5.0;
    // Calories per minute = MET * weight(kg) * 3.5 / 200
    return met * weight * 3.5 / 200;
  };
  const getHydrationRecommendation = (duration: number, intensity: string) => {
    const hours = duration / 3600;
    let mlPerHour = 200; // Base recommendation
    if (intensity === 'Modérée') mlPerHour = 300;
    if (intensity === 'Intense') mlPerHour = 400;
    if (intensity === 'Très intense') mlPerHour = 500;
    return Math.round(mlPerHour * hours);
  };
  const getRecoveryRecommendation = (
  duration: number,
  age: number,
  intensity: string) =>
  {
    const minutes = duration / 60;
    if (minutes < 15) {
      return {
        title: 'Récupération légère',
        suggestions: ['Hydratez-vous', 'Étirements légers (5 min)']
      };
    }
    if (minutes < 30) {
      return {
        title: 'Récupération modérée',
        suggestions: [
        "Buvez 250ml d'eau",
        'Étirements des jambes (10 min)',
        age > 50 ? 'Repos assis 5-10 min' : 'Marche lente 5 min']

      };
    }
    return {
      title: 'Récupération complète',
      suggestions: [
      "Hydratation : 500ml d'eau",
      'Étirements complets (15 min)',
      'Repos 15-20 minutes',
      age > 50 ?
      'Surveillez votre fréquence cardiaque' :
      'Snack protéiné recommandé']

    };
  };
  const getHeartRateZone = (age: number, intensity: string) => {
    const maxHR = 220 - age;
    if (intensity === 'Légère') {
      return {
        zone: 'Zone 1 - Récupération',
        range: `${Math.round(maxHR * 0.5)}-${Math.round(maxHR * 0.6)} bpm`,
        benefit: 'Amélioration de la santé générale'
      };
    }
    if (intensity === 'Modérée') {
      return {
        zone: 'Zone 2 - Endurance',
        range: `${Math.round(maxHR * 0.6)}-${Math.round(maxHR * 0.7)} bpm`,
        benefit: 'Brûlage des graisses optimal'
      };
    }
    return {
      zone: 'Zone 3 - Aérobie',
      range: `${Math.round(maxHR * 0.7)}-${Math.round(maxHR * 0.8)} bpm`,
      benefit: 'Amélioration cardiovasculaire'
    };
  };
  // Real-time step counter simulation
  useEffect(() => {
    if (!activeSession || isPaused) return;
    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const stepIncrement = Math.floor(Math.random() * 3) + 1;
        const newSteps = prev.steps + stepIncrement;
        const newDuration = prev.duration + 1;
        const newDistance = newSteps / 1000 * 0.8;
        const newCalories = Math.floor(newSteps * 0.04);
        return {
          ...prev,
          steps: newSteps,
          duration: newDuration,
          distance: parseFloat(newDistance.toFixed(2)),
          calories: newCalories
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession, isPaused]);
  const startSession = () => {
    const newSession: WalkSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      steps: 0,
      duration: 0,
      distance: 0,
      calories: 0,
      isActive: true
    };
    setActiveSession(newSession);
    setIsPaused(false);
  };
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  const endSession = () => {
    if (!activeSession) return;
    const completedSession = {
      ...activeSession,
      endTime: new Date(),
      isActive: false
    };
    setSessions([...sessions, completedSession]);
    setActiveSession(null);
    setIsPaused(false);
  };
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    return `${minutes}m ${secs}s`;
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const updateGoal = () => {
    setGoal(newGoal);
    setShowGoalModal(false);
  };
  const weekData = [
  {
    day: 'Lun',
    steps: 7200,
    completed: true
  },
  {
    day: 'Mar',
    steps: 8500,
    completed: true
  },
  {
    day: 'Mer',
    steps: 6800,
    completed: false
  },
  {
    day: 'Jeu',
    steps: 9200,
    completed: true
  },
  {
    day: 'Ven',
    steps: totalSteps,
    completed: totalSteps >= goal
  },
  {
    day: 'Sam',
    steps: 0,
    completed: false
  },
  {
    day: 'Dim',
    steps: 0,
    completed: false
  }];

  // Get current insights
  const intensity = getWalkingIntensity(
    activeSession ? currentSpeed : averageSpeed
  );
  const calorieBurnRate = getCalorieBurnRate(
    userProfile.weight,
    activeSession ? currentSpeed : averageSpeed
  );
  const hydrationNeeded = getHydrationRecommendation(
    totalDuration,
    intensity.level
  );
  const recovery = getRecoveryRecommendation(
    totalDuration,
    userProfile.age,
    intensity.level
  );
  const heartRate = getHeartRateZone(userProfile.age, intensity.level);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 pt-8 pb-12">
        <button
          onClick={() => navigate('/health')}
          className="flex items-center text-white/90 hover:text-white mb-6">
          
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Footprints className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Activité Physique</h1>
              <p className="text-indigo-100">
                Suivi de la marche en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Active Session Card */}
        {activeSession &&
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl border-0 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold">Session en cours</span>
              </div>
              <span className="text-sm text-indigo-100">
                Démarrée à {formatTime(activeSession.startTime)}
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl font-bold mb-2">
                {activeSession.steps}
              </div>
              <div className="text-indigo-100">pas</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {activeSession.distance.toFixed(1)}
                </div>
                <div className="text-xs text-indigo-100">km</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatDuration(activeSession.duration)}
                </div>
                <div className="text-xs text-indigo-100">durée</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {activeSession.calories}
                </div>
                <div className="text-xs text-indigo-100">kcal</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
              onClick={togglePause}
              className="flex-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg">
              
                {isPaused ?
              <>
                    <Play className="h-5 w-5 mr-2" />
                    Reprendre
                  </> :

              <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
              }
              </Button>
              <Button
              onClick={endSession}
              className="flex-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-lg">
              
                <Square className="h-5 w-5 mr-2" />
                Terminer
              </Button>
            </div>
          </Card>
        }

        {/* Smart Insights - Only show when there's activity */}
        {(activeSession || totalSteps > 0) &&
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border-0 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-bold">Insights Intelligents</h3>
            </div>

            <div className="space-y-4">
              {/* Walking Intensity */}
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <span className="font-semibold">Intensité de marche</span>
                  </div>
                  <span
                  className={`px-3 py-1 rounded-full text-sm font-bold bg-${intensity.color}-500`}>
                  
                    {intensity.level}
                  </span>
                </div>
                <p className="text-sm text-purple-100">
                  {intensity.description}
                </p>
                {activeSession &&
              <p className="text-xs text-purple-200 mt-1">
                    Vitesse actuelle: {currentSpeed.toFixed(1)} km/h
                  </p>
              }
              </div>

              {/* Calorie Burn */}
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">Brûlage calorique</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{totalCalories}</span>
                  <span className="text-sm text-purple-100">kcal brûlées</span>
                </div>
                <p className="text-xs text-purple-200 mt-1">
                  Taux: ~{calorieBurnRate.toFixed(1)} kcal/min à votre poids (
                  {userProfile.weight}kg)
                </p>
              </div>

              {/* Hydration */}
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-5 w-5" />
                  <span className="font-semibold">Hydratation recommandée</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{hydrationNeeded}</span>
                  <span className="text-sm text-purple-100">ml d'eau</span>
                </div>
                <p className="text-xs text-purple-200 mt-1">
                  Basé sur {(totalDuration / 60).toFixed(0)} minutes d'activité{' '}
                  {intensity.level.toLowerCase()}
                </p>
              </div>

              {/* Heart Rate Zone */}
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">
                    Zone de fréquence cardiaque
                  </span>
                </div>
                <div className="mb-1">
                  <span className="font-bold">{heartRate.zone}</span>
                </div>
                <p className="text-sm text-purple-100 mb-1">
                  {heartRate.range}
                </p>
                <p className="text-xs text-purple-200">
                  💡 {heartRate.benefit}
                </p>
              </div>

              {/* Recovery Recommendations */}
              {totalDuration > 300 &&
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">{recovery.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {recovery.suggestions.map((suggestion, index) =>
                <li
                  key={index}
                  className="text-sm text-purple-100 flex items-start gap-2">
                  
                        <span className="text-purple-300">•</span>
                        {suggestion}
                      </li>
                )}
                  </ul>
                </div>
            }
            </div>
          </Card>
        }

        {/* Start Session Button */}
        {!activeSession &&
        <Card className="bg-white shadow-xl border-0 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Footprints className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                Prêt pour une marche ?
              </h3>
              <p className="text-gray-600 mb-4">
                Démarrez une nouvelle session de marche
              </p>
              <Button
              onClick={startSession}
              variant="primary"
              className="w-full">
              
                <Play className="h-5 w-5 mr-2" />
                Démarrer une session
              </Button>
            </div>
          </Card>
        }

        {/* Today's Total Progress */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">Total aujourd'hui</div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {totalSteps.toLocaleString()}
            </div>
            <div className="text-gray-600">pas sur {goal.toLocaleString()}</div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min(percentage, 100)}%`
                }}>
                
                {percentage >= 10 &&
                <span className="text-xs font-bold text-white">
                    {Math.round(percentage)}%
                  </span>
                }
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalDistance.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">km parcourus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(totalDuration / 60)}
              </div>
              <div className="text-xs text-gray-600">minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {totalCalories}
              </div>
              <div className="text-xs text-gray-600">calories</div>
            </div>
          </div>
        </Card>

        {/* Sessions History */}
        {sessions.length > 0 &&
        <Card className="bg-white shadow-md border-0 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Sessions d'aujourd'hui
            </h3>
            <div className="space-y-3">
              {sessions.map((session, index) =>
            <div
              key={session.id}
              className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium text-gray-900">
                        Session {sessions.length - index}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatTime(session.startTime)} -{' '}
                      {session.endTime && formatTime(session.endTime)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-indigo-600">
                        {session.steps}
                      </div>
                      <div className="text-xs text-gray-600">pas</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-600">
                        {session.distance.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">km</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-600">
                        {Math.floor(session.duration / 60)}m
                      </div>
                      <div className="text-xs text-gray-600">durée</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-600">
                        {session.calories}
                      </div>
                      <div className="text-xs text-gray-600">kcal</div>
                    </div>
                  </div>
                </div>
            )}
            </div>
          </Card>
        }

        {/* Weekly Chart */}
        <Card className="bg-white shadow-md border-0 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Cette semaine</h3>
          <div className="space-y-3">
            {weekData.map((day, index) =>
            <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {day.day}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {day.steps > 0 ? day.steps.toLocaleString() : '-'}
                    </span>
                    {day.completed &&
                  <Award className="h-4 w-4 text-indigo-600" />
                  }
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(day.steps / goal * 100, 100)}%`
                  }} />
                
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Goal Settings */}
        <Card className="bg-white shadow-md border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Objectif quotidien</h3>
                <p className="text-sm text-gray-600">
                  {goal.toLocaleString()} pas
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGoalModal(true)}>
              
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-900">
            <p className="font-medium mb-1">💡 Conseil personnalisé</p>
            <p className="text-indigo-700">
              Marchez 30 minutes par jour pour atteindre votre objectif et
              améliorer votre santé cardiovasculaire.
            </p>
          </div>
        </Card>
      </div>

      {/* Goal Modal */}
      {showGoalModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-md w-full">
            <h3 className="font-bold text-gray-900 mb-4">
              Modifier l'objectif quotidien
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de pas par jour
              </label>
              <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="1000"
              step="500" />
            
              <p className="text-xs text-gray-500 mt-2">
                Recommandation OMS : 8 000 à 10 000 pas par jour
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={updateGoal} variant="primary" className="flex-1">
                Enregistrer
              </Button>
              <Button
              onClick={() => {
                setShowGoalModal(false);
                setNewGoal(goal);
              }}
              variant="outline"
              className="flex-1">
              
                Annuler
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}