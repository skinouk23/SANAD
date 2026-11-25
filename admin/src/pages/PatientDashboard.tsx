import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Bell,
  Settings,
  X,
  Mail,
  UserPlus,
  Shield,
  Trash2,
  MessageCircle,
  Gift,
  Crown } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CareStreak } from '../components/CareStreak';
import { AppointmentCard } from '../components/AppointmentCard';
import { QuickActions } from '../components/QuickActions';
import { ProgressMilestone } from '../components/ProgressMilestone';
import { PendingValidationCard } from '../components/PendingValidationCard';
import { ValidationCodeModal } from '../components/ValidationCodeModal';
import { EmergencyButtons } from '../components/EmergencyButtons';
import { NotificationsPanel } from '../components/NotificationsPanel';
import {
  usePendingValidations,
  usePatientFamilyMembers } from
'../hooks/usePatientDashboard';
interface FamilyMember {
  id: string;
  name: string;
  initial: string;
  email: string;
  role: string;
  color: string;
}
export function PatientDashboard() {
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState<any>(null);
  // Hook-based data fetching
  const {
    data: pendingValidations,
    removeValidation,
    getValidation
  } = usePendingValidations();
  const {
    members: familyMembers,
    addMember,
    removeMember
  } = usePatientFamilyMembers();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const handleValidate = async (id: string) => {
    const validation = getValidation(id);
    if (validation) {
      setSelectedValidation(validation);
      setShowValidationModal(true);
    }
  };
  const handleValidateWithCode = async (code: string) => {
    console.log('Validating with code:', code);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    removeValidation(selectedValidation?.id);
    setShowValidationModal(false);
    setSelectedValidation(null);
    alert('✅ Service validé avec succès !');
    return true;
  };
  const handleReportIssue = (id: string) => {
    alert('Signalement de problème pour: ' + id);
  };
  const handleAddMember = () => {
    if (newMemberEmail && newMemberName && newMemberRole) {
      addMember({
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
        color: ''
      });
      setNewMemberEmail('');
      setNewMemberName('');
      setNewMemberRole('');
      setShowAddMemberModal(false);
    }
  };
  const handleRemoveMember = (id: string) => {
    removeMember(id);
  };
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Bonjour, Mohamed 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Voici votre suivi santé aujourd'hui.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 relative transition-colors">
              
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActions />
                <EmergencyButtons variant="inline" size="large" />
              </div>
            </section>

            {/* Pending Validations */}
            {pendingValidations.length > 0 &&
            <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    ⏳ En attente de validation
                  </h2>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
                    {pendingValidations.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingValidations.map((validation) =>
                <PendingValidationCard
                  key={validation.id}
                  validation={validation}
                  onValidate={handleValidate}
                  onReportIssue={handleReportIssue} />

                )}
                </div>
              </section>
            }

            {/* Upcoming Appointments */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Prochains Rendez-vous
                </h2>
                <Link
                  to="#"
                  className="text-teal-600 text-sm font-medium hover:underline">
                  
                  Voir tout
                </Link>
              </div>
              <div className="space-y-4">
                <AppointmentCard
                  providerName="Amel Ben Youssef"
                  providerImage="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100"
                  service="Soins Infirmiers"
                  date="Aujourd'hui"
                  time="14:00"
                  status="confirmed"
                  appointmentId="apt_001"
                  showTracking={true} />
                
                <AppointmentCard
                  providerName="Dr. Sami Kallel"
                  providerImage="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100"
                  service="Kinésithérapie"
                  date="Demain"
                  time="10:30"
                  status="pending"
                  appointmentId="apt_002" />
                
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            {/* Gamification / Streak */}
            <Card className="bg-white text-center" padding="lg">
              <h3 className="font-bold text-gray-900 mb-2">Votre Suivi</h3>
              <CareStreak days={12} />
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">
                  Prochain badge dans 2 jours
                </p>
                <div className="flex justify-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-lg"
                    title="Débutant">
                    
                    🌱
                  </div>
                  <div
                    className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-lg"
                    title="Régulier">
                    
                    ⭐
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg opacity-30">
                    🏆
                  </div>
                </div>
              </div>
            </Card>

            {/* Family Circle */}
            <Card
              className="bg-gradient-to-br from-teal-500 to-teal-600 text-white"
              padding="lg">
              
              <h3 className="font-bold text-lg mb-2">Cercle Familial</h3>
              <p className="text-teal-100 text-sm mb-6">
                Partagé avec {familyMembers.length} membre
                {familyMembers.length > 1 ? 's' : ''} de la famille pour
                coordonner les soins.
              </p>
              <div className="flex -space-x-2 mb-6">
                {familyMembers.map((member) =>
                <div
                  key={member.id}
                  className={`w-10 h-10 rounded-full border-2 border-teal-500 ${member.color} flex items-center justify-center font-bold`}
                  title={member.name}>
                  
                    {member.initial}
                  </div>
                )}
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="w-10 h-10 rounded-full border-2 border-teal-500 bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 transition-colors"
                  title="Ajouter un membre">
                  
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <Button
                onClick={() => setShowFamilyModal(true)}
                variant="secondary"
                size="sm"
                fullWidth
                className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white hover:from-emerald-500 hover:to-teal-500 border-none shadow-lg font-semibold">
                
                Gérer les accès
              </Button>
            </Card>

            {/* Health Goals - Moved from left column */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Objectifs Santé
              </h2>
              <div className="space-y-4">
                <ProgressMilestone
                  title="Prise de tension"
                  progress={5}
                  total={7} />
                
                <ProgressMilestone
                  title="Marche quotidienne"
                  progress={3000}
                  total={5000}
                  icon={<span className="text-lg">👣</span>} />
                
              </div>
            </section>

            {/* Quick Access Cards - Moved from left column */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Accès Rapide
              </h2>
              <div className="space-y-3">
                <Link to="/messages">
                  <Card
                    hover
                    className="cursor-pointer bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Messages</h3>
                        <p className="text-sm text-gray-600">
                          2 nouveaux messages
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/rewards">
                  <Card
                    hover
                    className="cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Récompenses</h3>
                        <p className="text-sm text-gray-600">
                          450 points • Silver
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/health-concierge">
                  <Card
                    hover
                    className="cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          Concierge Santé
                        </h3>
                        <p className="text-sm text-gray-600">Assistance 24/7</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/subscriptions">
                  <Card
                    hover
                    className="cursor-pointer bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Abonnements</h3>
                        <p className="text-sm text-gray-600">
                          Plan Gratuit • 15% commission
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)} />
      

      {/* Family Management Modal */}
      {showFamilyModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Gestion du Cercle Familial
              </h3>
              <button
              onClick={() => setShowFamilyModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-teal-900">
                    Partage sécurisé
                  </p>
                  <p className="text-xs text-teal-700 mt-1">
                    Les membres de votre cercle familial peuvent consulter vos
                    rendez-vous et coordonner les soins.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-semibold text-gray-900">
                Membres ({familyMembers.length})
              </h4>
              {familyMembers.map((member) =>
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              
                  <div className="flex items-center gap-3">
                    <div
                  className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center font-bold text-lg`}>
                  
                      {member.initial}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Retirer l'accès">
                
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
            )}
            </div>

            <div className="flex gap-3">
              <Button
              onClick={() => {
                setShowFamilyModal(false);
                setShowAddMemberModal(true);
              }}
              variant="primary"
              className="flex-1">
              
                <UserPlus className="h-5 w-5 mr-2" />
                Ajouter un membre
              </Button>
              <Button
              onClick={() => setShowFamilyModal(false)}
              variant="outline"
              className="px-6">
              
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Add Member Modal */}
      {showAddMemberModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Ajouter un membre
              </h3>
              <button
              onClick={() => setShowAddMemberModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Ex: Sarah Trabelsi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation
                </label>
                <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                
                  <option value="">Sélectionner...</option>
                  <option value="Conjoint(e)">Conjoint(e)</option>
                  <option value="Fils">Fils</option>
                  <option value="Fille">Fille</option>
                  <option value="Frère">Frère</option>
                  <option value="Sœur">Sœur</option>
                  <option value="Parent">Parent</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Un email d'invitation sera envoyé à cette adresse avec les
                    instructions pour accéder au cercle familial.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
              onClick={handleAddMember}
              variant="primary"
              className="flex-1"
              disabled={!newMemberEmail || !newMemberName || !newMemberRole}>
              
                Envoyer l'invitation
              </Button>
              <Button
              onClick={() => setShowAddMemberModal(false)}
              variant="outline"
              className="px-6">
              
                Annuler
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Validation Code Modal */}
      {showValidationModal && selectedValidation &&
      <ValidationCodeModal
        isOpen={showValidationModal}
        onClose={() => {
          setShowValidationModal(false);
          setSelectedValidation(null);
        }}
        appointment={{
          id: selectedValidation.id,
          providerName: selectedValidation.providerName,
          serviceName: selectedValidation.serviceName,
          amount: selectedValidation.amount,
          date: selectedValidation.date
        }}
        onValidate={handleValidateWithCode} />

      }
    </div>);

}