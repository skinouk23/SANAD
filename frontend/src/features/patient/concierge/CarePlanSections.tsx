import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Heart,
  Plus,
  Trash2,
} from 'lucide-react';

import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Button } from '@/shared/ui/primitives/button';

import type { CarePlanAppointment, CarePlanCondition, CarePlanMedication } from './carePlan.types';

export function CarePlanMainContent({
  appointments,
  completedCount,
  medications,
  onAddAppointment,
  onAddMedication,
  onDeleteAppointment,
  onDeleteMedication,
  onEditMedication,
  onToggleTask,
  tasks,
  totalCount,
}: {
  appointments: CarePlanAppointment[];
  completedCount: number;
  medications: CarePlanMedication[];
  onAddAppointment: () => void;
  onAddMedication: () => void;
  onDeleteAppointment: (id: number) => void;
  onDeleteMedication: (id: number) => void;
  onEditMedication: (medication: CarePlanMedication) => void;
  onToggleTask: (id: number) => void;
  tasks: Array<{ id: number; title: string; time: string; frequency: string; completed: boolean }>;
  totalCount: number;
}) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tâches du jour</h2>
          <span className="text-sm text-gray-600 dark:text-slate-400">
            {completedCount}/{totalCount} complétées
          </span>
        </div>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl border-2 p-4 transition-all ${task.completed ? 'border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10' : 'border-gray-200 bg-white hover:border-rose-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-rose-500/50'}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${task.completed ? 'border-green-600 bg-green-600 dark:border-green-500 dark:bg-green-500' : 'border-gray-300 hover:border-rose-500 dark:border-slate-500 dark:hover:border-rose-500'}`}
                    onClick={() => onToggleTask(task.id)}
                  >
                    {task.completed ? <CheckCircle2 className="h-4 w-4 text-white" /> : null}
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`mb-1 font-semibold ${task.completed ? 'text-gray-500 line-through dark:text-slate-500' : 'text-gray-900 dark:text-white'}`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.time}
                      </span>
                      <span>•</span>
                      <span>{task.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Aucune tâche planifiée"
              description="Ajoutez vos rappels de suivi pour les retrouver ici."
              icon={<Clock className="h-5 w-5" />}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Médicaments</h2>
          <Button
            onClick={onAddMedication}
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-4">
          {medications.length > 0 ? (
            medications.map((medication) => (
              <div
                key={medication.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all dark:border-slate-600 dark:bg-slate-700/50"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                      {medication.name}
                    </h3>
                    <p className="mb-2 text-sm text-gray-600 dark:text-slate-400">
                      {medication.dosage}
                    </p>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                      {medication.condition}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditMedication(medication)}
                      className="rounded p-1 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMedication(medication.id)}
                      className="rounded p-1 text-red-600 transition-all hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-slate-400">
                      Stock restant :{' '}
                      <span
                        className={`font-bold ${medication.stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
                      >
                        {medication.stock} jours
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-slate-400">
                      Renouvellement : {medication.nextRefill}
                    </p>
                  </div>
                  {medication.stock < 10 ? (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-500/20 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      Bientôt épuisé
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Aucun médicament suivi"
              description="Ajoutez vos traitements pour gérer vos renouvellements."
              icon={<Heart className="h-5 w-5" />}
            />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rendez-vous à venir</h2>
          <Button
            onClick={onAddAppointment}
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Planifier
          </Button>
        </div>
        <div className="space-y-3">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:scale-[1.02] hover:border-rose-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-rose-500/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                      {appointment.type}
                    </h3>
                    <div className="mb-2 flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {appointment.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {appointment.doctor || appointment.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                    >
                      Détails
                    </Button>
                    <button
                      onClick={() => onDeleteAppointment(appointment.id)}
                      className="rounded p-1 text-red-600 transition-all hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Aucun rendez-vous planifié"
              description="Ajoutez vos prochains rendez-vous pour garder une vue centralisée."
              icon={<Calendar className="h-5 w-5" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function CarePlanSidebar({
  conditions,
  getStatusColor,
  getStatusLabel,
  onAddCondition,
  onDeleteCondition,
}: {
  conditions: CarePlanCondition[];
  getStatusColor: (status: CarePlanCondition['status']) => string;
  getStatusLabel: (status: CarePlanCondition['status']) => string;
  onAddCondition: () => void;
  onDeleteCondition: (id: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <h3 className="mb-4 font-bold text-gray-900 dark:text-white">Conditions chroniques</h3>
        <div className="space-y-3">
          {conditions.length > 0 ? (
            conditions.map((condition) => (
              <div key={condition.id} className="rounded-xl bg-gray-50 p-3 dark:bg-slate-700/50">
                <div className="mb-2 flex items-start gap-3">
                  <span className="text-2xl">{condition.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                          {condition.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          {condition.since}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteCondition(condition.id)}
                        className="rounded p-1 text-red-600 transition-all hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-block rounded-full border px-2 py-1 text-xs font-bold ${getStatusColor(condition.status)}`}
                >
                  {getStatusLabel(condition.status)}
                </span>
              </div>
            ))
          ) : (
            <EmptyState
              title="Aucune condition ajoutée"
              description="Renseignez vos pathologies suivies."
              icon={<Heart className="h-5 w-5" />}
              className="px-4 py-8"
            />
          )}
          <Button
            onClick={onAddCondition}
            variant="outline"
            size="sm"
            className="w-full border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une condition
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-6 shadow-sm backdrop-blur-sm dark:border-rose-500/30 dark:from-rose-900/40 dark:to-pink-900/40">
        <h3 className="mb-4 font-bold text-gray-900 dark:text-white">Suivi cette semaine</h3>
        <div className="space-y-3">
          {[
            { label: 'Médicaments pris', value: '14/14' },
            { label: 'Mesures tension', value: '7/7' },
            { label: 'Activité physique', value: '5/7' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-rose-300">{stat.label}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:from-purple-900/40 dark:to-indigo-900/40">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 shadow-lg dark:bg-purple-500/20">
            <Heart className="h-6 w-6 text-white dark:text-purple-400" />
          </div>
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">Besoin d'aide ?</h3>
          <p className="mb-4 text-sm text-gray-700 dark:text-purple-300">
            Notre concierge peut optimiser votre plan de soins
          </p>
          <Button className="w-full border-0 bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700">
            Contacter le concierge
          </Button>
        </div>
      </div>
    </div>
  );
}
