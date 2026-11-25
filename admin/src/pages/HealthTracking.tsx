import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Apple,
  Award,
  Target,
  ChevronRight,
  Plus,
  Footprints,
  Heart } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
export function HealthTracking() {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(4);
  const dailyWaterGoal = 8;
  const [steps] = useState(6543);
  const dailyStepsGoal = 8000;
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const addWater = () => {
    if (waterIntake < dailyWaterGoal) {
      setWaterIntake(waterIntake + 1);
    }
  };
  const waterPercentage = waterIntake / dailyWaterGoal * 100;
  const stepsPercentage = steps / dailyStepsGoal * 100;
  // Extended weekly data with more details
  const weeklyData = [
  {
    day: 'Lundi',
    date: '18 Nov',
    steps: 7200,
    distance: 5.8,
    duration: 58,
    calories: 288,
    completed: true
  },
  {
    day: 'Mardi',
    date: '19 Nov',
    steps: 8500,
    distance: 6.8,
    duration: 68,
    calories: 340,
    completed: true
  },
  {
    day: 'Mercredi',
    date: '20 Nov',
    steps: 6800,
    distance: 5.4,
    duration: 54,
    calories: 272,
    completed: false
  },
  {
    day: 'Jeudi',
    date: '21 Nov',
    steps: 9200,
    distance: 7.4,
    duration: 74,
    calories: 368,
    completed: true
  },
  {
    day: 'Vendredi',
    date: '22 Nov',
    steps: 6543,
    distance: 5.2,
    duration: 52,
    calories: 262,
    completed: false
  },
  {
    day: 'Samedi',
    date: '23 Nov',
    steps: 0,
    distance: 0,
    duration: 0,
    calories: 0,
    completed: false
  },
  {
    day: 'Dimanche',
    date: '24 Nov',
    steps: 0,
    distance: 0,
    duration: 0,
    calories: 0,
    completed: false
  }];

  const weeklyStats = {
    totalSteps: weeklyData.reduce((sum, day) => sum + day.steps, 0),
    totalDistance: weeklyData.reduce((sum, day) => sum + day.distance, 0),
    totalDuration: weeklyData.reduce((sum, day) => sum + day.duration, 0),
    totalCalories: weeklyData.reduce((sum, day) => sum + day.calories, 0),
    daysCompleted: weeklyData.filter((day) => day.completed).length,
    averageSteps: Math.round(
      weeklyData.reduce((sum, day) => sum + day.steps, 0) / 7
    )
  };
  return (
    <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-8 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-8 rounded-2xl mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Mon Suivi Santé</h1>
        <p className="text-teal-100">Suivez votre activité quotidienne</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Steps Card */}
          <Card className="bg-white shadow-lg border-0">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Footprints className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">
                Aujourd'hui
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {steps.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              pas / {dailyStepsGoal.toLocaleString()}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(stepsPercentage, 100)}%`
                }} />
              
            </div>
          </Card>

          {/* Water Card */}
          <Card className="bg-white shadow-lg border-0">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Droplets className="h-5 w-5 text-blue-600" />
              </div>
              <button
                onClick={addWater}
                className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {waterIntake}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              verres / {dailyWaterGoal}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(waterPercentage, 100)}%`
                }} />
              
            </div>
          </Card>
        </div>

        {/* Main Modules */}
        <div className="space-y-4 mb-6">
          {/* Activity Module */}
          <Card
            className="bg-white shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/health/activity')}>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Activité Physique
                  </h3>
                  <p className="text-sm text-gray-600">Marche & mouvement</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {steps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Pas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">4.2</div>
                <div className="text-xs text-gray-600">km</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">52</div>
                <div className="text-xs text-gray-600">min</div>
              </div>
            </div>
          </Card>

          {/* Hydration Module */}
          <Card
            className="bg-white shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/health/hydration')}>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Droplets className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Hydratation
                  </h3>
                  <p className="text-sm text-gray-600">Suivi de l'eau</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Objectif quotidien
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {waterIntake}/{dailyWaterGoal} verres
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(waterPercentage, 100)}%`
                  }} />
                
              </div>
            </div>
          </Card>

          {/* Nutrition Module */}
          <Card
            className="bg-white shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/health/nutrition')}>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Apple className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Nutrition</h3>
                  <p className="text-sm text-gray-600">
                    Recommandations personnalisées
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <span>✓</span>
                <span>Profil nutritionnel configuré</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="bg-white shadow-md border-0 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">
              Progression hebdomadaire
            </h3>
            <button
              onClick={() => setShowWeeklyModal(true)}
              className="text-sm text-teal-600 font-medium hover:text-teal-700 transition-colors">
              
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
                    className={`text-xs mb-2 ${isToday ? 'text-teal-600 font-bold' : 'text-gray-600'}`}>
                    
                    {day}
                  </div>
                  <div
                    className={`h-12 rounded-lg flex items-center justify-center ${completed ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    
                    {completed ?
                    <Award className="h-5 w-5" /> :

                    <Target className="h-5 w-5" />
                    }
                  </div>
                </div>);

            })}
          </div>
        </Card>

        {/* Health Tips */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md border-0 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Conseil du jour</h4>
              <p className="text-sm text-purple-100">
                Buvez un verre d'eau dès le réveil pour réhydrater votre corps
                après la nuit.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Progress Modal */}
      {showWeeklyModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="bg-white max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Progression hebdomadaire
              </h3>
              <button
              onClick={() => setShowWeeklyModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              
                <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                
                  <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
                
                </svg>
              </button>
            </div>

            {/* Weekly Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {weeklyStats.totalSteps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Total pas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {weeklyStats.totalDistance.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">km parcourus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {weeklyStats.totalCalories}
                </div>
                <div className="text-xs text-gray-600">kcal brûlées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {Math.floor(weeklyStats.totalDuration / 60)}h{' '}
                  {weeklyStats.totalDuration % 60}m
                </div>
                <div className="text-xs text-gray-600">Durée totale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {weeklyStats.daysCompleted}/7
                </div>
                <div className="text-xs text-gray-600">Jours réussis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {weeklyStats.averageSteps.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Moyenne/jour</div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {weeklyData.map((day, index) =>
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${day.completed ? 'bg-teal-50 border-teal-200' : day.steps > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900">{day.day}</div>
                      <div className="text-xs text-gray-600">{day.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {day.completed &&
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Objectif atteint
                        </span>
                  }
                      {day.steps > 0 && !day.completed &&
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                          En cours
                        </span>
                  }
                      {day.steps === 0 &&
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          Repos
                        </span>
                  }
                    </div>
                  </div>

                  {day.steps > 0 ?
              <>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {day.steps.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">pas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {day.distance}
                          </div>
                          <div className="text-xs text-gray-600">km</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {day.duration}
                          </div>
                          <div className="text-xs text-gray-600">min</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {day.calories}
                          </div>
                          <div className="text-xs text-gray-600">kcal</div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                    className={`h-2 rounded-full transition-all ${day.completed ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'}`}
                    style={{
                      width: `${Math.min(day.steps / dailyStepsGoal * 100, 100)}%`
                    }} />
                  
                      </div>
                    </> :

              <div className="text-center py-4 text-gray-500 text-sm">
                      Aucune activité enregistrée
                    </div>
              }
                </div>
            )}
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <Button
              onClick={() => setShowWeeklyModal(false)}
              variant="primary"
              className="w-full">
              
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}