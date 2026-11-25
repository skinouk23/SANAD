import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Droplets,
  Edit,
  Footprints,
  Heart,
  Pause,
  Play,
  Sparkles,
  Square,
  Target,
  TrendingUp,
  Zap,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Input } from '@/shared/ui/primitives/input';
import { cn } from '@/shared/lib/utils';

import type { WalkSession } from './activityTracking.types';

export function ActivityTrackingHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 pb-12 pt-8 text-white shadow-lg shadow-indigo-900/10 dark:from-indigo-700 dark:to-indigo-900">
      <button
        onClick={() => navigate('/health')}
        className="mb-6 flex items-center text-white/90 transition-colors hover:text-white"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Retour
      </button>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner shadow-white/10">
            <Footprints className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Activité Physique</h1>
            <p className="text-indigo-100">Suivi de la marche en temps réel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivitySessionCard({
  activeSession,
  formatDuration,
  formatTime,
  isPaused,
  onEnd,
  onTogglePause,
}: {
  activeSession: WalkSession;
  formatDuration: (seconds: number) => string;
  formatTime: (date: Date) => string;
  isPaused: boolean;
  onEnd: () => void;
  onTogglePause: () => void;
}) {
  return (
    <Card className="mb-6 border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-xl shadow-indigo-500/25 dark:from-indigo-500 dark:to-indigo-700">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
          <span className="font-bold">Session en cours</span>
        </div>
        <span className="text-sm text-indigo-100">
          Démarrée à {formatTime(activeSession.startTime)}
        </span>
      </div>

      <div className="mb-6 text-center">
        <div className="mb-2 text-6xl font-bold">{activeSession.steps}</div>
        <div className="text-indigo-100">pas</div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{activeSession.distance.toFixed(1)}</div>
          <div className="text-xs text-indigo-100">km</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{formatDuration(activeSession.duration)}</div>
          <div className="text-xs text-indigo-100">durée</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{activeSession.calories}</div>
          <div className="text-xs text-indigo-100">kcal</div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onTogglePause}
          className="flex-1 border-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
        >
          {isPaused ? (
            <>
              <Play className="mr-2 h-5 w-5" />
              Reprendre
            </>
          ) : (
            <>
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </>
          )}
        </Button>
        <Button
          onClick={onEnd}
          className="flex-1 border-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
        >
          <Square className="mr-2 h-5 w-5" />
          Terminer
        </Button>
      </div>
    </Card>
  );
}

export function ActivityInsightsCard({
  calorieBurnRate,
  currentSpeed,
  heartRate,
  hydrationNeeded,
  intensity,
  recovery,
  totalCalories,
  totalDuration,
  userWeight,
}: {
  calorieBurnRate: number;
  currentSpeed: number;
  heartRate: { benefit: string; range: string; zone: string };
  hydrationNeeded: number;
  intensity: { badgeClassName: string; description: string; level: string };
  recovery: { suggestions: string[]; title: string };
  totalCalories: number;
  totalDuration: number;
  userWeight: number;
}) {
  return (
    <Card className="mb-6 border-0 bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-xl shadow-purple-500/25 dark:from-purple-500 dark:to-purple-700">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-bold">Insights Intelligents</h3>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Intensité de marche</span>
            </div>
            <span
              className={cn('rounded-full px-3 py-1 text-sm font-bold', intensity.badgeClassName)}
            >
              {intensity.level}
            </span>
          </div>
          <p className="text-sm text-purple-100">{intensity.description}</p>
          {currentSpeed > 0 ? (
            <p className="mt-1 text-xs text-purple-200">
              Vitesse actuelle: {currentSpeed.toFixed(1)} km/h
            </p>
          ) : null}
        </div>

        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Brûlage calorique</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{totalCalories}</span>
            <span className="text-sm text-purple-100">kcal brûlées</span>
          </div>
          <p className="mt-1 text-xs text-purple-200">
            Taux: ~{calorieBurnRate.toFixed(1)} kcal/min à votre poids ({userWeight} kg)
          </p>
        </div>

        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            <span className="font-semibold">Hydratation recommandée</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{hydrationNeeded}</span>
            <span className="text-sm text-purple-100">ml d'eau</span>
          </div>
          <p className="mt-1 text-xs text-purple-200">
            Basé sur {(totalDuration / 60).toFixed(0)} minutes d'activité{' '}
            {intensity.level.toLowerCase()}
          </p>
        </div>

        <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <span className="font-semibold">Zone de fréquence cardiaque</span>
          </div>
          <div className="mb-1 font-bold">{heartRate.zone}</div>
          <p className="mb-1 text-sm text-purple-100">{heartRate.range}</p>
          <p className="text-xs text-purple-200">💡 {heartRate.benefit}</p>
        </div>

        {totalDuration > 300 ? (
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">{recovery.title}</span>
            </div>
            <ul className="space-y-1">
              {recovery.suggestions.map((suggestion) => (
                <li key={suggestion} className="flex items-start gap-2 text-sm text-purple-100">
                  <span className="text-purple-300">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export function ActivityStartCard({ onStart }: { onStart: () => void }) {
  return (
    <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
          <Footprints className="h-8 w-8" />
        </div>
        <h3 className="mb-2 font-bold text-gray-900 dark:text-white">Prêt pour une marche ?</h3>
        <p className="mb-4 text-gray-600 dark:text-slate-300">
          Démarrez une nouvelle session de marche
        </p>
        <Button
          onClick={onStart}
          className="w-full border-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-indigo-800"
        >
          <Play className="mr-2 h-5 w-5" />
          Démarrer une session
        </Button>
      </div>
    </Card>
  );
}

export function ActivityTotalsCard({
  goal,
  percentage,
  totalCalories,
  totalDistance,
  totalDuration,
  totalSteps,
}: {
  goal: number;
  percentage: number;
  totalCalories: number;
  totalDistance: number;
  totalDuration: number;
  totalSteps: number;
}) {
  return (
    <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
      <div className="mb-6 text-center">
        <div className="mb-2 text-sm text-gray-600 dark:text-slate-300">Total aujourd'hui</div>
        <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-white">
          {totalSteps.toLocaleString()}
        </div>
        <div className="text-gray-600 dark:text-slate-300">pas sur {goal.toLocaleString()}</div>
      </div>

      <div className="mb-6">
        <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-slate-700">
          <div
            className="flex h-4 items-center justify-end rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 pr-2 transition-[width] duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            {percentage >= 10 ? (
              <span className="text-xs font-bold text-white">{Math.round(percentage)}%</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 dark:border-slate-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalDistance.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-300">km parcourus</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.floor(totalDuration / 60)}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-300">minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCalories}</div>
          <div className="text-xs text-gray-600 dark:text-slate-300">calories</div>
        </div>
      </div>
    </Card>
  );
}

export function ActivitySessionsHistory({
  formatTime,
  sessions,
}: {
  formatTime: (date: Date) => string;
  sessions: WalkSession[];
}) {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-md dark:bg-slate-900 dark:text-white">
      <h3 className="mb-4 font-bold text-gray-900 dark:text-white">Sessions d'aujourd'hui</h3>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div
            key={session.id}
            className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Session {sessions.length - index}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-slate-300">
                {formatTime(session.startTime)} -{' '}
                {session.endTime ? formatTime(session.endTime) : ''}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
                  {session.steps}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">pas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
                  {session.distance.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">km</div>
              </div>
              <div>
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
                  {Math.floor(session.duration / 60)}m
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">durée</div>
              </div>
              <div>
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
                  {session.calories}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">kcal</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ActivityWeekChart({
  goal,
  weekData,
}: {
  goal: number;
  weekData: Array<{ day: string; steps: number; completed: boolean }>;
}) {
  return (
    <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-md dark:bg-slate-900 dark:text-white">
      <h3 className="mb-4 font-bold text-gray-900 dark:text-white">Cette semaine</h3>
      <div className="space-y-3">
        {weekData.map((day) => (
          <div key={day.day}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                {day.day}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {day.steps > 0 ? day.steps.toLocaleString() : '-'}
                </span>
                {day.completed ? (
                  <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                ) : null}
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-[width]"
                style={{ width: `${Math.min((day.steps / goal) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ActivityGoalCard({ goal, onEdit }: { goal: number; onEdit: () => void }) {
  return (
    <Card className="border-0 bg-white p-6 text-gray-900 shadow-md dark:bg-slate-900 dark:text-white">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Objectif quotidien</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">{goal.toLocaleString()} pas</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="border-indigo-200 bg-white text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
        >
          <Edit className="mr-1 h-4 w-4" />
          Modifier
        </Button>
      </div>
      <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-100">
        <p className="mb-1 font-medium">💡 Conseil personnalisé</p>
        <p className="text-indigo-700 dark:text-indigo-200">
          Marchez 30 minutes par jour pour atteindre votre objectif et améliorer votre santé
          cardiovasculaire.
        </p>
      </div>
    </Card>
  );
}

export function ActivityGoalModal({
  newGoal,
  onCancel,
  onChange,
  onSave,
  open,
}: {
  newGoal: number;
  onCancel: () => void;
  onChange: (value: number) => void;
  onSave: () => void;
  open: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onCancel();
        }
      }}
    >
      <DialogContent
        size="sm"
        className="border-0 bg-white text-gray-900 shadow-2xl shadow-indigo-950/20 dark:bg-slate-900 dark:text-white"
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Modifier l'objectif quotidien
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-slate-300">
            Recommandation OMS : 8 000 à 10 000 pas par jour
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-gray-700 dark:text-slate-300"
            htmlFor="activity-goal-input"
          >
            Nombre de pas par jour
          </label>
          <Input
            id="activity-goal-input"
            type="number"
            value={newGoal}
            onChange={(event) => onChange(parseInt(event.target.value))}
            min="1000"
            step="500"
            className="border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            Recommandation OMS : 8 000 à 10 000 pas par jour
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={onSave}
            className="flex-1 border-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
          >
            Enregistrer
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
