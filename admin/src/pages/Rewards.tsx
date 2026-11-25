import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Gift,
  Star,
  Zap,
  Crown,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Award,
  Target,
  XCircle,
  TrendingDown,
  Sparkles } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  useRewardsProfile,
  useRewardLevels,
  useRecentRewardActivity,
  useEarnPointsActions } from
'../hooks/useRewards';
export function Rewards() {
  const navigate = useNavigate();
  const { data: profile, loading: profileLoading } = useRewardsProfile();
  const { data: benefits, loading: levelsLoading } = useRewardLevels();
  const { data: recentActivity, loading: activityLoading } =
  useRecentRewardActivity();
  const { data: earnPoints, loading: earnLoading } = useEarnPointsActions();
  const userPoints = profile?.userPoints ?? 0;
  const userLevel = profile?.userLevel ?? 'Bronze';
  const nextLevelPoints = profile?.nextLevelPoints ?? 100;
  const completedAppointments = profile?.completedAppointments ?? 0;
  const cancelledAppointments = profile?.cancelledAppointments ?? 0;
  const cancellationRate = profile?.cancellationRate ?? 0;
  const bonusPoints = profile?.bonusPoints ?? 0;
  const loading =
  profileLoading || levelsLoading || activityLoading || earnLoading;
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>);

  }
  const progressPercentage = Math.min(userPoints / nextLevelPoints * 100, 100);
  const isLowCancellation = cancellationRate < 10;
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors">
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Programme de Fidélité
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Gagnez des points et profitez d'avantages exclusifs
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
              <span className="text-2xl font-bold text-purple-600">
                {userPoints} pts
              </span>
            </div>
          </div>
        </div>

        {/* Current Status - Enhanced */}
        <Card className="mb-8 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-purple-100 mb-1 text-sm font-medium">
                  Votre niveau actuel
                </p>
                <h2 className="text-5xl font-bold flex items-center gap-3">
                  <span className="text-6xl">
                    {benefits?.find((b) => b.current)?.icon || '🥈'}
                  </span>
                  {userLevel}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-purple-100 mb-1 text-sm font-medium">
                  Points totaux
                </p>
                <h2 className="text-5xl font-bold">{userPoints}</h2>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-purple-100">
                  Progression vers{' '}
                  {userLevel === 'Platinum' ? 'Maximum' : 'Gold'}
                </span>
                <span className="font-semibold">
                  {userPoints}/{nextLevelPoints} points
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-white to-purple-100 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{
                    width: `${progressPercentage}%`
                  }}>
                </div>
              </div>
            </div>

            {userLevel !== 'Platinum' &&
            <p className="text-purple-100 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Plus que {nextLevelPoints - userPoints} points pour débloquer le
                niveau supérieur ! 🎉
              </p>
            }
          </div>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <Award className="h-8 w-8 text-green-500 opacity-50" />
            </div>
            <p className="text-sm text-green-600 font-medium mb-1">
              Rendez-vous complétés
            </p>
            <p className="text-4xl font-bold text-green-900">
              {completedAppointments}
            </p>
            <p className="text-xs text-green-600 mt-2">
              +{completedAppointments * 50} points gagnés
            </p>
          </Card>

          <Card
            className={`bg-gradient-to-br ${isLowCancellation ? 'from-blue-50 to-cyan-50 border-blue-200' : 'from-red-50 to-rose-50 border-red-200'} hover:shadow-lg transition-shadow`}>
            
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLowCancellation ? 'bg-blue-200' : 'bg-red-200'}`}>
                
                {isLowCancellation ?
                <Target className="h-7 w-7 text-blue-600" /> :

                <XCircle className="h-7 w-7 text-red-600" />
                }
              </div>
              {isLowCancellation ?
              <TrendingUp className="h-8 w-8 text-blue-500 opacity-50" /> :

              <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
              }
            </div>
            <p
              className={`text-sm font-medium mb-1 ${isLowCancellation ? 'text-blue-600' : 'text-red-600'}`}>
              
              Taux de présence
            </p>
            <p
              className={`text-4xl font-bold ${isLowCancellation ? 'text-blue-900' : 'text-red-900'}`}>
              
              {(100 - cancellationRate).toFixed(0)}%
            </p>
            <p
              className={`text-xs mt-2 ${isLowCancellation ? 'text-blue-600' : 'text-red-600'}`}>
              
              {isLowCancellation ?
              `🎯 Excellent! +${bonusPoints} points bonus` :
              `${cancelledAppointments} annulations (-${cancelledAppointments * 25} pts)`}
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <Crown className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
            <p className="text-sm text-purple-600 font-medium mb-1">
              Points bonus
            </p>
            <p className="text-4xl font-bold text-purple-900">{bonusPoints}</p>
            <p className="text-xs text-purple-600 mt-2">Récompense fidélité</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Levels */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-600" />
              Niveaux de fidélité
            </h2>
            <div className="space-y-4">
              {(benefits || []).map((level) =>
              <Card
                key={level.level}
                className={`relative overflow-hidden transition-all hover:scale-[1.02] ${level.current ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:shadow-md'}`}>
                
                  {level.current &&
                <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        Actuel
                      </span>
                    </div>
                }
                  <div className="flex items-start gap-4">
                    <div
                    className={`w-16 h-16 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                    
                      {level.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {level.level}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        À partir de {level.minPoints} points
                      </p>
                      <ul className="space-y-2">
                        {level.benefits.map((benefit, index) =>
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700">
                        
                            <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                            {benefit}
                          </li>
                      )}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Earn Points & Activity */}
          <div className="space-y-8">
            {/* Earn Points */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Gift className="h-6 w-6 text-teal-600" />
                Comment gagner des points
              </h2>
              <div className="space-y-3">
                {(earnPoints || []).map((item) =>
                <Card
                  key={item.action}
                  hover
                  className="cursor-pointer transition-all hover:shadow-md">
                  
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.action}
                          </h3>
                          <p className="text-sm text-teal-600 font-bold">
                            +{item.points} points
                          </p>
                        </div>
                      </div>
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                Activité récente
              </h2>
              <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {(recentActivity || []).slice(0, 5).map((activity) =>
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-gray-50 transition-colors">
                    
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {activity.action}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {activity.date}
                          </p>
                        </div>
                        <span className="text-teal-600 font-bold flex items-center gap-1">
                          <Zap className="h-4 w-4" />+{activity.points}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-purple-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                🎁 Passez au niveau supérieur !
              </h3>
              <p className="text-gray-700 text-lg">
                Réservez votre prochain rendez-vous et gagnez 50 points
              </p>
              {!isLowCancellation &&
              <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Astuce: Maintenez un taux de présence élevé pour gagner 100
                  points bonus !
                </p>
              }
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/services')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg whitespace-nowrap">
              
              Réserver maintenant
            </Button>
          </div>
        </Card>
      </div>
    </div>);

}