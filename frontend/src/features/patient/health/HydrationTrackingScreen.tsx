import { useState } from 'react';
import { ArrowLeft, Clock, Droplets, Minus, Plus, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/shared/ui/primitives/card';

export function HydrationTrackingScreen() {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(4);
  const [goal] = useState(8);

  const percentage = (waterIntake / goal) * 100;

  const addWater = () => {
    if (waterIntake < goal + 5) {
      setWaterIntake(waterIntake + 1);
    }
  };

  const removeWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(waterIntake - 1);
    }
  };

  const drinkHistory = [
    { time: '08:30', amount: 1 },
    { time: '10:15', amount: 1 },
    { time: '12:45', amount: 1 },
    { time: '15:20', amount: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20 dark:from-blue-950 dark:to-cyan-950">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pb-12 pt-8 text-white shadow-lg shadow-blue-900/10 dark:from-blue-700 dark:to-blue-900">
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
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hydratation</h1>
              <p className="text-blue-100">Suivi quotidien de l'eau</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-4xl px-4">
        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
          <div className="mb-6 text-center">
            <div className="mb-2 text-sm text-gray-600 dark:text-slate-300">Aujourd'hui</div>
            <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-white">
              {waterIntake}
            </div>
            <div className="text-gray-600 dark:text-slate-300">verres sur {goal}</div>
          </div>

          <div className="relative mx-auto mb-6 h-48 w-32">
            <div className="absolute inset-0 rounded-b-full border-4 border-blue-300 dark:border-blue-700">
              <div
                className="absolute bottom-0 left-0 right-0 rounded-b-full bg-gradient-to-t from-blue-500 to-blue-400 transition-[height] duration-500"
                style={{ height: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="z-10 text-2xl font-bold text-blue-600 dark:text-blue-200">
                {Math.round(percentage)}%
              </div>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-center gap-4">
            <button
              onClick={removeWater}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Minus className="h-5 w-5 text-gray-700 dark:text-slate-200" />
            </button>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                {waterIntake * 250}
              </div>
              <div className="text-xs text-gray-600 dark:text-slate-300">ml</div>
            </div>

            <button
              onClick={addWater}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6 dark:border-slate-800">
            <button className="rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/70">
              <div className="mb-1 text-2xl">🥤</div>
              <div className="text-xs text-gray-700 dark:text-blue-100">Verre</div>
              <div className="text-xs text-gray-500 dark:text-blue-200">250ml</div>
            </button>
            <button className="rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/70">
              <div className="mb-1 text-2xl">🍶</div>
              <div className="text-xs text-gray-700 dark:text-blue-100">Bouteille</div>
              <div className="text-xs text-gray-500 dark:text-blue-200">500ml</div>
            </button>
            <button className="rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/70">
              <div className="mb-1 text-2xl">🧃</div>
              <div className="text-xs text-gray-700 dark:text-blue-100">Grande</div>
              <div className="text-xs text-gray-500 dark:text-blue-200">1L</div>
            </button>
          </div>
        </Card>

        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-md dark:bg-slate-900 dark:text-white">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600 dark:text-slate-300" />
            <h3 className="font-bold text-gray-900 dark:text-white">Historique du jour</h3>
          </div>
          <div className="space-y-3">
            {drinkHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.amount} verre
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300">
                      {entry.amount * 250}ml
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-300">{entry.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-md shadow-blue-500/20 dark:from-blue-600 dark:to-blue-800">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="mb-2 font-bold">Recommandation personnalisée</h4>
              <p className="mb-3 text-sm text-blue-100">
                Votre objectif est de 2L par jour (8 verres). Buvez régulièrement tout au long de la
                journée.
              </p>
              <div className="text-xs text-blue-200">
                Calculé selon : Âge, poids, niveau d'activité
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
