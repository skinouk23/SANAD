import { useState } from 'react';
import {
  Activity,
  Apple,
  Award,
  ChevronRight,
  Droplets,
  Footprints,
  Heart,
  Plus,
  Target,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';

export function HealthTrackingScreen() {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(4);
  const [steps] = useState(6543);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const dailyWaterGoal = 8;
  const dailyStepsGoal = 8000;
  const waterPercentage = (waterIntake / dailyWaterGoal) * 100;
  const stepsPercentage = (steps / dailyStepsGoal) * 100;

  const weeklyData = [
    {
      day: 'Lundi',
      date: '18 Nov',
      steps: 7200,
      distance: 5.8,
      duration: 58,
      calories: 288,
      completed: true,
    },
    {
      day: 'Mardi',
      date: '19 Nov',
      steps: 8500,
      distance: 6.8,
      duration: 68,
      calories: 340,
      completed: true,
    },
    {
      day: 'Mercredi',
      date: '20 Nov',
      steps: 6800,
      distance: 5.4,
      duration: 54,
      calories: 272,
      completed: false,
    },
    {
      day: 'Jeudi',
      date: '21 Nov',
      steps: 9200,
      distance: 7.4,
      duration: 74,
      calories: 368,
      completed: true,
    },
    {
      day: 'Vendredi',
      date: '22 Nov',
      steps: 6543,
      distance: 5.2,
      duration: 52,
      calories: 262,
      completed: false,
    },
    {
      day: 'Samedi',
      date: '23 Nov',
      steps: 0,
      distance: 0,
      duration: 0,
      calories: 0,
      completed: false,
    },
    {
      day: 'Dimanche',
      date: '24 Nov',
      steps: 0,
      distance: 0,
      duration: 0,
      calories: 0,
      completed: false,
    },
  ];

  const weeklyStats = {
    totalSteps: weeklyData.reduce((sum, day) => sum + day.steps, 0),
    totalDistance: weeklyData.reduce((sum, day) => sum + day.distance, 0),
    totalDuration: weeklyData.reduce((sum, day) => sum + day.duration, 0),
    totalCalories: weeklyData.reduce((sum, day) => sum + day.calories, 0),
    daysCompleted: weeklyData.filter((day) => day.completed).length,
    averageSteps: Math.round(weeklyData.reduce((sum, day) => sum + day.steps, 0) / 7),
  };

  const addWater = () => {
    if (waterIntake < dailyWaterGoal) {
      setWaterIntake(waterIntake + 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 px-4 py-8 text-gray-900 dark:from-slate-950 dark:via-teal-950/40 dark:to-purple-950/50 dark:text-slate-100">
      <div className="mx-auto mb-6 max-w-4xl rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8 text-white shadow-lg shadow-teal-900/10 dark:from-teal-500 dark:to-teal-700 dark:shadow-teal-950/40">
        <h1 className="mb-2 text-3xl font-bold">Mon Suivi Santé</h1>
        <p className="text-teal-100">Suivez votre activité quotidienne</p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-0 bg-white p-4 text-gray-900 shadow-lg shadow-slate-200/70 dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-slate-950/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/15">
                <Footprints className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                Aujourd'hui
              </span>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {steps.toLocaleString()}
            </div>
            <div className="mb-3 text-sm text-gray-600 dark:text-slate-300">
              pas / {dailyStepsGoal.toLocaleString()}
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-[width] duration-500"
                style={{ width: `${Math.min(stepsPercentage, 100)}%` }}
              />
            </div>
          </Card>

          <Card className="border-0 bg-white p-4 text-gray-900 shadow-lg shadow-slate-200/70 dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-slate-950/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/15">
                <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <button
                onClick={addWater}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm shadow-blue-500/30 transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
              {waterIntake}
            </div>
            <div className="mb-3 text-sm text-gray-600 dark:text-slate-300">
              verres / {dailyWaterGoal}
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-[width] duration-500"
                style={{ width: `${Math.min(waterPercentage, 100)}%` }}
              />
            </div>
          </Card>
        </div>

        <div className="mb-6 space-y-4">
          <Card
            className="cursor-pointer border-0 bg-white p-4 text-gray-900 shadow-md shadow-slate-200/70 transition-shadow hover:shadow-lg dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-slate-950/40"
            onClick={() => navigate('/health/activity')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25">
                  <Activity className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Activité Physique
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">Marche & mouvement</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 text-center dark:border-slate-800">
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                  {steps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-400">Pas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">4.2</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">km</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">52</div>
                <div className="text-xs text-gray-600 dark:text-slate-400">min</div>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer border-0 bg-white p-4 text-gray-900 shadow-md shadow-slate-200/70 transition-shadow hover:shadow-lg dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-slate-950/40"
            onClick={() => navigate('/health/hydration')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25">
                  <Droplets className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hydratation</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">Suivi de l'eau</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-slate-800">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-slate-300">
                  Objectif quotidien
                </span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
                  {waterIntake}/{dailyWaterGoal} verres
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-[width] duration-500"
                  style={{ width: `${Math.min(waterPercentage, 100)}%` }}
                />
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer border-0 bg-white p-4 text-gray-900 shadow-md shadow-slate-200/70 transition-shadow hover:shadow-lg dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-slate-950/40"
            onClick={() => navigate('/health/nutrition')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                  <Apple className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nutrition</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    Recommandations personnalisées
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                <span>✓</span>
                <span>Profil nutritionnel configuré</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-6 border-0 bg-white p-4 text-gray-900 shadow-md shadow-slate-200/70 dark:bg-slate-900/90 dark:text-slate-100 dark:shadow-slate-950/40">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Progression hebdomadaire</h3>
            <button
              onClick={() => setShowWeeklyModal(true)}
              className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
            >
              Voir tout
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
              const isToday = index === 4;
              const completed = index < 5;

              return (
                <div key={index} className="text-center">
                  <div
                    className={`mb-2 text-xs ${isToday ? 'font-bold text-teal-600 dark:text-teal-300' : 'text-gray-600 dark:text-slate-400'}`}
                  >
                    {day}
                  </div>
                  <div
                    className={`flex h-12 items-center justify-center rounded-lg ${completed ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-sm shadow-teal-500/25' : 'bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500'}`}
                  >
                    {completed ? <Award className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mb-6 border-0 bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-md shadow-purple-500/25 dark:from-purple-600 dark:to-purple-800 dark:shadow-purple-950/40">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h4 className="mb-2 font-bold">Conseil du jour</h4>
              <p className="text-sm text-purple-100">
                Buvez un verre d'eau dès le réveil pour réhydrater votre corps après la nuit.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showWeeklyModal} onOpenChange={setShowWeeklyModal}>
        <DialogContent
          size="lg"
          scroll="content"
          className="border-teal-100 bg-white text-gray-900 shadow-2xl shadow-teal-900/20 ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:ring-teal-900/30"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Progression hebdomadaire
            </DialogTitle>
            <DialogDescription className="sr-only">
              Statistiques et activités quotidiennes de la semaine.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 p-4 sm:grid-cols-3 dark:from-teal-950/50 dark:to-blue-950/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                  {weeklyStats.totalSteps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">Total pas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                  {weeklyStats.totalDistance.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">km parcourus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                  {weeklyStats.totalCalories}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">kcal brûlées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                  {Math.floor(weeklyStats.totalDuration / 60)}h {weeklyStats.totalDuration % 60}m
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">Durée totale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                  {weeklyStats.daysCompleted}/7
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">Jours réussis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-300">
                  {weeklyStats.averageSteps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-300">Moyenne/jour</div>
              </div>
            </div>

            <div className="space-y-3">
              {weeklyData.map((day, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 transition-colors ${day.completed ? 'border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30' : day.steps > 0 ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/25' : 'border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-900/70'}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{day.day}</div>
                      <div className="text-xs text-gray-600 dark:text-slate-400">{day.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {day.completed ? (
                        <span className="flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/60 dark:text-teal-200">
                          <Award className="h-3 w-3" />
                          Objectif atteint
                        </span>
                      ) : null}
                      {day.steps > 0 && !day.completed ? (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-200">
                          En cours
                        </span>
                      ) : null}
                      {day.steps === 0 ? (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                          Repos
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {day.steps > 0 ? (
                    <>
                      <div className="mb-3 grid grid-cols-4 gap-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {day.steps.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">pas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {day.distance}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">km</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {day.duration}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">min</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {day.calories}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">kcal</div>
                        </div>
                      </div>

                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                        <div
                          className={`h-2 rounded-full transition-[width] ${day.completed ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'}`}
                          style={{ width: `${Math.min((day.steps / dailyStepsGoal) * 100, 100)}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500 dark:text-slate-400">
                      Aucune activité enregistrée
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="w-full bg-teal-600 text-white shadow-sm shadow-teal-500/20 hover:bg-teal-700 hover:text-white"
              >
                Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
