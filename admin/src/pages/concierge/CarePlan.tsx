import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Calendar,
  Clock,
  Pill,
  Activity,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Moon,
  Sun,
  X,
  Check,
  Save } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  useChronicConditions,
  useMedications,
  useCarePlanAppointments,
  useDailyTasks } from
'../../hooks/useCarePlan';
import { useTheme } from '../../contexts/ThemeContext';
interface Medication {
  id: number;
  name: string;
  dosage: string;
  condition: string;
  stock: number;
  nextRefill: string;
}
interface Condition {
  id: number;
  name: string;
  icon: string;
  since: string;
  status: 'controlled' | 'monitored' | 'attention';
}
interface Appointment {
  id: number;
  type: string;
  date: string;
  time: string;
  doctor?: string;
  location?: string;
}
export function CarePlan() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  // Hook-based data fetching
  const { data: initialConditions } = useChronicConditions();
  const { data: initialMedications } = useMedications();
  const { data: initialAppointments } = useCarePlanAppointments();
  const {
    data: tasks,
    toggleTask,
    completedCount,
    totalCount
  } = useDailyTasks();
  const [conditions, setConditions] = useState<Condition[]>(
    initialConditions ?? []
  );
  const [medications, setMedications] = useState<Medication[]>(
    initialMedications ?? []
  );
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointments ?? []
  );
  // Modal states
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showEditMedicationModal, setShowEditMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] =
  useState<Medication | null>(null);
  // Form states
  const [newCondition, setNewCondition] = useState({
    name: '',
    icon: '❤️',
    since: '',
    status: 'monitored' as const
  });
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    condition: '',
    stock: 30,
    nextRefill: ''
  });
  const [newAppointment, setNewAppointment] = useState({
    type: '',
    date: '',
    time: '',
    doctor: '',
    location: ''
  });
  // Handlers
  const handleAddCondition = () => {
    if (!newCondition.name || !newCondition.since) return;
    const condition: Condition = {
      id: conditions.length + 1,
      ...newCondition
    };
    setConditions([...conditions, condition]);
    setNewCondition({
      name: '',
      icon: '❤️',
      since: '',
      status: 'monitored'
    });
    setShowAddConditionModal(false);
  };
  const handleDeleteCondition = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette condition ?')) {
      setConditions(conditions.filter((c) => c.id !== id));
    }
  };
  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) return;
    const medication: Medication = {
      id: medications.length + 1,
      ...newMedication
    };
    setMedications([...medications, medication]);
    setNewMedication({
      name: '',
      dosage: '',
      condition: '',
      stock: 30,
      nextRefill: ''
    });
    setShowAddMedicationModal(false);
  };
  const handleEditMedication = (med: Medication) => {
    setSelectedMedication(med);
    setShowEditMedicationModal(true);
  };
  const handleSaveEditMedication = () => {
    if (!selectedMedication) return;
    setMedications(
      medications.map((m) =>
      m.id === selectedMedication.id ? selectedMedication : m
      )
    );
    setShowEditMedicationModal(false);
    setSelectedMedication(null);
  };
  const handleDeleteMedication = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      setMedications(medications.filter((m) => m.id !== id));
    }
  };
  const handleAddAppointment = () => {
    if (!newAppointment.type || !newAppointment.date || !newAppointment.time)
    return;
    const appointment: Appointment = {
      id: appointments.length + 1,
      ...newAppointment
    };
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      type: '',
      date: '',
      time: '',
      doctor: '',
      location: ''
    });
    setShowAddAppointmentModal(false);
  };
  const handleDeleteAppointment = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      setAppointments(appointments.filter((a) => a.id !== id));
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'controlled':
        return isDark ?
        'bg-green-500/20 text-green-400 border-green-500/30' :
        'bg-green-100 text-green-700 border-green-200';
      case 'monitored':
        return isDark ?
        'bg-blue-500/20 text-blue-400 border-blue-500/30' :
        'bg-blue-100 text-blue-700 border-blue-200';
      case 'attention':
        return isDark ?
        'bg-amber-500/20 text-amber-400 border-amber-500/30' :
        'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return isDark ?
        'bg-slate-500/20 text-slate-400 border-slate-500/30' :
        'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'controlled':
        return 'Contrôlé';
      case 'monitored':
        return 'Surveillé';
      case 'attention':
        return 'Attention';
      default:
        return 'Inconnu';
    }
  };
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-rose-500' : 'bg-rose-300'}`}>
        </div>
        <div
          className={`absolute bottom-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-purple-500' : 'bg-purple-300'}`}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/health-concierge')}
              className={`flex items-center font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au concierge
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-gray-50 text-slate-700 shadow-sm'}`}>
              
              {isDark ?
              <Sun className="h-5 w-5" /> :

              <Moon className="h-5 w-5" />
              }
            </button>
          </div>

          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                Plan de soins
              </span>
            </h1>
            <p
              className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
              Organisez vos soins chroniques
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Tasks */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                  Tâches du jour
                </h2>
                <span
                  className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                  {completedCount}/{totalCount} complétées
                </span>
              </div>
              <div className="space-y-3">
                {tasks.map((task) =>
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border-2 transition-all ${task.completed ? isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200' : isDark ? 'bg-slate-700/50 border-slate-600 hover:border-rose-500/50' : 'bg-white border-gray-200 hover:border-rose-300'}`}>
                  
                    <div className="flex items-start gap-4">
                      <button
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${task.completed ? isDark ? 'bg-green-500 border-green-500' : 'bg-green-600 border-green-600' : isDark ? 'border-slate-500 hover:border-rose-500' : 'border-gray-300 hover:border-rose-500'}`}
                      onClick={() => toggleTask(task.id)}>
                      
                        {task.completed &&
                      <CheckCircle2 className="h-4 w-4 text-white" />
                      }
                      </button>
                      <div className="flex-1">
                        <h3
                        className={`font-semibold mb-1 ${task.completed ? isDark ? 'text-slate-500 line-through' : 'text-gray-500 line-through' : isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                          {task.title}
                        </h3>
                        <div
                        className={`flex items-center gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
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
                )}
              </div>
            </div>

            {/* Medications */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                  Médicaments
                </h2>
                <Button
                  onClick={() => setShowAddMedicationModal(true)}
                  variant="outline"
                  size="sm"
                  className={
                  isDark ?
                  'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
                  ''
                  }>
                  
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {medications.map((med) =>
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'}`}>
                  
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3
                        className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                          {med.name}
                        </h3>
                        <p
                        className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
                          {med.dosage}
                        </p>
                        <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        
                          {med.condition}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                        onClick={() => handleEditMedication(med)}
                        className={`p-1 rounded transition-all ${isDark ? 'hover:bg-slate-600 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}>
                        
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                        onClick={() => handleDeleteMedication(med.id)}
                        className={`p-1 rounded transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
                        
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p
                        className={
                        isDark ? 'text-slate-400' : 'text-gray-600'
                        }>
                        
                          Stock restant :{' '}
                          <span
                          className={`font-bold ${med.stock < 10 ? isDark ? 'text-red-400' : 'text-red-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
                          
                            {med.stock} jours
                          </span>
                        </p>
                        <p
                        className={
                        isDark ? 'text-slate-400' : 'text-gray-600'
                        }>
                        
                          Renouvellement : {med.nextRefill}
                        </p>
                      </div>
                      {med.stock < 10 &&
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                      
                          <AlertCircle className="h-3 w-3" />
                          Bientôt épuisé
                        </span>
                    }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                  Rendez-vous à venir
                </h2>
                <Button
                  onClick={() => setShowAddAppointmentModal(true)}
                  variant="outline"
                  size="sm"
                  className={
                  isDark ?
                  'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
                  ''
                  }>
                  
                  <Plus className="h-4 w-4 mr-2" />
                  Planifier
                </Button>
              </div>
              <div className="space-y-3">
                {appointments.map((apt) =>
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-rose-500/50' : 'bg-gray-50 border-gray-200 hover:border-rose-300'}`}>
                  
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                        className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                          {apt.type}
                        </h3>
                        <div
                        className={`flex items-center gap-3 text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {apt.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {apt.time}
                          </span>
                        </div>
                        <p
                        className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        
                          {apt.doctor || apt.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                        variant="outline"
                        size="sm"
                        className={
                        isDark ?
                        'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
                        ''
                        }>
                        
                          Détails
                        </Button>
                        <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className={`p-1 rounded transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
                        
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Conditions */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
              
              <h3
                className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Conditions chroniques
              </h3>
              <div className="space-y-3">
                {conditions.map((condition) =>
                <div
                  key={condition.id}
                  className={`p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                  
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{condition.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4
                            className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            
                              {condition.name}
                            </h4>
                            <p
                            className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            
                              {condition.since}
                            </p>
                          </div>
                          <button
                          onClick={() => handleDeleteCondition(condition.id)}
                          className={`p-1 rounded transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
                          
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(condition.status)}`}>
                    
                      {getStatusLabel(condition.status)}
                    </span>
                  </div>
                )}
                <Button
                  onClick={() => setShowAddConditionModal(true)}
                  variant="outline"
                  fullWidth
                  size="sm"
                  className={
                  isDark ?
                  'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
                  ''
                  }>
                  
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une condition
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-rose-900/40 to-pink-900/40 border-rose-500/30' : 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200'}`}>
              
              <h3
                className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Suivi cette semaine
              </h3>
              <div className="space-y-3">
                {[
                {
                  label: 'Médicaments pris',
                  value: '14/14'
                },
                {
                  label: 'Mesures tension',
                  value: '7/7'
                },
                {
                  label: 'Activité physique',
                  value: '5/7'
                }].
                map((stat, index) =>
                <div
                  key={index}
                  className="flex items-center justify-between">
                  
                    <span
                    className={`text-sm ${isDark ? 'text-rose-300' : 'text-gray-700'}`}>
                    
                      {stat.label}
                    </span>
                    <span
                    className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {stat.value}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Concierge Help */}
            <div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
              
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-600'}`}>
                  
                  <Heart
                    className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-white'}`} />
                  
                </div>
                <h3
                  className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                  Besoin d'aide ?
                </h3>
                <p
                  className={`text-sm mb-4 ${isDark ? 'text-purple-300' : 'text-gray-700'}`}>
                  
                  Notre concierge peut optimiser votre plan de soins
                </p>
                <Button
                  variant="primary"
                  fullWidth
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/30">
                  
                  Contacter le concierge
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Condition Modal */}
      {showAddConditionModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`max-w-md w-full rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-6">
              <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Ajouter une condition
              </h3>
              <button
              onClick={() => setShowAddConditionModal(false)}
              className={
              isDark ?
              'text-slate-400 hover:text-white' :
              'text-gray-500 hover:text-gray-900'
              }>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Nom de la condition
                </label>
                <input
                type="text"
                value={newCondition.name}
                onChange={(e) =>
                setNewCondition({
                  ...newCondition,
                  name: e.target.value
                })
                }
                placeholder="Ex: Hypertension"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Icône
                </label>
                <input
                type="text"
                value={newCondition.icon}
                onChange={(e) =>
                setNewCondition({
                  ...newCondition,
                  icon: e.target.value
                })
                }
                placeholder="❤️"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Depuis
                </label>
                <input
                type="text"
                value={newCondition.since}
                onChange={(e) =>
                setNewCondition({
                  ...newCondition,
                  since: e.target.value
                })
                }
                placeholder="Ex: 2020"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Statut
                </label>
                <select
                value={newCondition.status}
                onChange={(e) =>
                setNewCondition({
                  ...newCondition,
                  status: e.target.value as any
                })
                }
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent'}`}>
                
                  <option value="controlled">Contrôlé</option>
                  <option value="monitored">Surveillé</option>
                  <option value="attention">Attention</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                onClick={() => setShowAddConditionModal(false)}
                variant="outline"
                className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                
                  Annuler
                </Button>
                <Button
                onClick={handleAddCondition}
                variant="primary"
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-0">
                
                  <Check className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Add Medication Modal - Reduced height */}
      {showAddMedicationModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`max-w-md w-full rounded-2xl p-5 border max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-4">
              <h3
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Ajouter un médicament
              </h3>
              <button
              onClick={() => setShowAddMedicationModal(false)}
              className={
              isDark ?
              'text-slate-400 hover:text-white' :
              'text-gray-500 hover:text-gray-900'
              }>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label
                className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Nom du médicament
                </label>
                <input
                type="text"
                value={newMedication.name}
                onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  name: e.target.value
                })
                }
                placeholder="Ex: Aspirine"
                className={`w-full px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Dosage
                </label>
                <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  dosage: e.target.value
                })
                }
                placeholder="Ex: 100mg matin et soir"
                className={`w-full px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Condition
                </label>
                <input
                type="text"
                value={newMedication.condition}
                onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  condition: e.target.value
                })
                }
                placeholder="Ex: Hypertension"
                className={`w-full px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Stock (jours)
                </label>
                <input
                type="number"
                value={newMedication.stock}
                onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  stock: parseInt(e.target.value)
                })
                }
                className={`w-full px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Prochain renouvellement
                </label>
                <input
                type="date"
                value={newMedication.nextRefill}
                onChange={(e) =>
                setNewMedication({
                  ...newMedication,
                  nextRefill: e.target.value
                })
                }
                className={`w-full px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                onClick={() => setShowAddMedicationModal(false)}
                variant="outline"
                className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                
                  Annuler
                </Button>
                <Button
                onClick={handleAddMedication}
                variant="primary"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0">
                
                  <Check className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Edit Medication Modal */}
      {showEditMedicationModal && selectedMedication &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`max-w-md w-full rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-6">
              <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Modifier le médicament
              </h3>
              <button
              onClick={() => setShowEditMedicationModal(false)}
              className={
              isDark ?
              'text-slate-400 hover:text-white' :
              'text-gray-500 hover:text-gray-900'
              }>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Nom
                </label>
                <input
                type="text"
                value={selectedMedication.name}
                onChange={(e) =>
                setSelectedMedication({
                  ...selectedMedication,
                  name: e.target.value
                })
                }
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Dosage
                </label>
                <input
                type="text"
                value={selectedMedication.dosage}
                onChange={(e) =>
                setSelectedMedication({
                  ...selectedMedication,
                  dosage: e.target.value
                })
                }
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Stock (jours)
                </label>
                <input
                type="number"
                value={selectedMedication.stock}
                onChange={(e) =>
                setSelectedMedication({
                  ...selectedMedication,
                  stock: parseInt(e.target.value)
                })
                }
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent'}`} />
              
              </div>

              <div className="flex gap-3">
                <Button
                onClick={() => setShowEditMedicationModal(false)}
                variant="outline"
                className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                
                  Annuler
                </Button>
                <Button
                onClick={handleSaveEditMedication}
                variant="primary"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0">
                
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Add Appointment Modal */}
      {showAddAppointmentModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`max-w-md w-full rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-6">
              <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Planifier un rendez-vous
              </h3>
              <button
              onClick={() => setShowAddAppointmentModal(false)}
              className={
              isDark ?
              'text-slate-400 hover:text-white' :
              'text-gray-500 hover:text-gray-900'
              }>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Type de rendez-vous
                </label>
                <input
                type="text"
                value={newAppointment.type}
                onChange={(e) =>
                setNewAppointment({
                  ...newAppointment,
                  type: e.target.value
                })
                }
                placeholder="Ex: Consultation cardiologie"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent'}`} />
              
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                  className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Date
                  </label>
                  <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    date: e.target.value
                  })
                  }
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent'}`} />
                
                </div>

                <div>
                  <label
                  className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Heure
                  </label>
                  <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    time: e.target.value
                  })
                  }
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent'}`} />
                
                </div>
              </div>

              <div>
                <label
                className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  Médecin / Lieu
                </label>
                <input
                type="text"
                value={newAppointment.doctor || newAppointment.location}
                onChange={(e) =>
                setNewAppointment({
                  ...newAppointment,
                  doctor: e.target.value
                })
                }
                placeholder="Ex: Dr. Trabelsi"
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent'}`} />
              
              </div>

              <div className="flex gap-3">
                <Button
                onClick={() => setShowAddAppointmentModal(false)}
                variant="outline"
                className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                
                  Annuler
                </Button>
                <Button
                onClick={handleAddAppointment}
                variant="primary"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0">
                
                  <Check className="h-4 w-4 mr-2" />
                  Planifier
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}