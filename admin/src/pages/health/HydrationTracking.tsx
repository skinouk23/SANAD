import React, { useState } from 'react';
import {
  ArrowLeft,
  Droplets,
  Plus,
  Minus,
  TrendingUp,
  Clock } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
export function HydrationTracking() {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(4);
  const [goal] = useState(8);
  const percentage = waterIntake / goal * 100;
  const addWater = () => {
    if (waterIntake < goal + 5) setWaterIntake(waterIntake + 1);
  };
  const removeWater = () => {
    if (waterIntake > 0) setWaterIntake(waterIntake - 1);
  };
  const drinkHistory = [
  {
    time: '08:30',
    amount: 1
  },
  {
    time: '10:15',
    amount: 1
  },
  {
    time: '12:45',
    amount: 1
  },
  {
    time: '15:20',
    amount: 1
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 pt-8 pb-12">
        <button
          onClick={() => navigate('/health')}
          className="flex items-center text-white/90 hover:text-white mb-6">
          
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hydratation</h1>
              <p className="text-blue-100">Suivi quotidien de l'eau</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Water Counter */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">Aujourd'hui</div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {waterIntake}
            </div>
            <div className="text-gray-600">verres sur {goal}</div>
          </div>

          {/* Water Glass Visual */}
          <div className="relative w-32 h-48 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-300 rounded-b-full">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-b-full transition-all duration-500"
                style={{
                  height: `${Math.min(percentage, 100)}%`
                }} />
              
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-bold text-blue-600 z-10">
                {Math.round(percentage)}%
              </div>
            </div>
          </div>

          {/* Add/Remove Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={removeWater}
              className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
              
              <Minus className="h-5 w-5 text-gray-700" />
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {waterIntake * 250}
              </div>
              <div className="text-xs text-gray-600">ml</div>
            </div>
            <button
              onClick={addWater}
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
              
              <Plus className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Quick Add */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
            <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-1">🥤</div>
              <div className="text-xs text-gray-700">Verre</div>
              <div className="text-xs text-gray-500">250ml</div>
            </button>
            <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-1">🍶</div>
              <div className="text-xs text-gray-700">Bouteille</div>
              <div className="text-xs text-gray-500">500ml</div>
            </button>
            <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-1">🧃</div>
              <div className="text-xs text-gray-700">Grande</div>
              <div className="text-xs text-gray-500">1L</div>
            </button>
          </div>
        </Card>

        {/* History */}
        <Card className="bg-white shadow-md border-0 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-gray-900">Historique du jour</h3>
          </div>
          <div className="space-y-3">
            {drinkHistory.map((entry, index) =>
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {entry.amount} verre
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.amount * 250}ml
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{entry.time}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md border-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Recommandation personnalisée</h4>
              <p className="text-sm text-blue-100 mb-3">
                Votre objectif est de 2L par jour (8 verres). Buvez
                régulièrement tout au long de la journée.
              </p>
              <div className="text-xs text-blue-200">
                Calculé selon : Âge, poids, niveau d'activité
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}