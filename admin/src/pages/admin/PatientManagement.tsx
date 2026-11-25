import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Star,
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Shield,
  AlertTriangle,
  HeartPulse,
  Stethoscope,
  FileText,
  User } from
'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { StatusBadge } from '../../components/admin/shared/StatusBadge';
import { DetailDrawer } from '../../components/admin/shared/DetailDrawer';
import { Modal } from '../../components/admin/shared/Modal';
import { mockPatients } from '../../data/mock/adminMockData';
import { AdminPatient } from '../../types/admin.types';
export function PatientManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<AdminPatient | null>(
    null
  );
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionPatient, setActionPatient] = useState<AdminPatient | null>(null);
  const filteredData = useMemo(() => {
    return mockPatients.filter((p) => {
      const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      const matchesCity = cityFilter ? p.city === cityFilter : true;
      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [search, statusFilter, cityFilter]);
  const handleAction = (
  e: React.MouseEvent,
  patient: AdminPatient,
  action: 'edit' | 'suspend' | 'delete') =>
  {
    e.stopPropagation();
    setActionPatient(patient);
    if (action === 'edit') setIsEditModalOpen(true);
    if (action === 'suspend') setIsSuspendModalOpen(true);
    if (action === 'delete') setIsDeleteModalOpen(true);
  };
  const columns = [
  {
    header: 'Patient',
    accessor: (row: AdminPatient) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white">
            {row.name}
          </div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>,

    sortable: true,
    sortKey: 'name',
    filterable: true,
    filterKey: 'name'
  },
  {
    header: 'Phone',
    accessor: 'phone',
    sortable: true,
    filterable: true
  },
  {
    header: 'City',
    accessor: 'city',
    sortable: true,
    filterable: true
  },
  {
    header: 'Bookings',
    accessor: 'bookingsCount',
    sortable: true,
    filterable: true
  },
  {
    header: 'Total Spent',
    accessor: (row: AdminPatient) => `${row.totalSpent} TND`,
    sortable: true,
    sortKey: 'totalSpent',
    filterable: true,
    filterKey: 'totalSpent'
  },
  {
    header: 'Status',
    accessor: (row: AdminPatient) => <StatusBadge status={row.status} />,
    sortable: true,
    sortKey: 'status',
    filterable: true,
    filterKey: 'status'
  },
  {
    header: 'Actions',
    accessor: (row: AdminPatient) =>
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}>
      
          <button
        onClick={() => setSelectedPatient(row)}
        className="p-1 text-slate-400 hover:text-teal-600 transition-colors"
        title="View Details">
        
            <Eye className="w-4 h-4" />
          </button>
          <button
        onClick={(e) => handleAction(e, row, 'edit')}
        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
        title="Edit">
        
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'active' ?
      <button
        onClick={(e) => handleAction(e, row, 'suspend')}
        className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
        title="Suspend">
        
              <Ban className="w-4 h-4" />
            </button> :

      <button
        onClick={(e) => handleAction(e, row, 'suspend')}
        className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
        title="Activate">
        
              <CheckCircle className="w-4 h-4" />
            </button>
      }
          <button
        onClick={(e) => handleAction(e, row, 'delete')}
        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
        title="Delete">
        
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

  }];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Patients
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage patient accounts and history
        </p>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        filters={[
        {
          id: 'status',
          label: 'All Statuses',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
          {
            label: 'Active',
            value: 'active'
          },
          {
            label: 'Suspended',
            value: 'suspended'
          }]

        },
        {
          id: 'city',
          label: 'All Cities',
          value: cityFilter,
          onChange: setCityFilter,
          options: [
          {
            label: 'Tunis',
            value: 'Tunis'
          },
          {
            label: 'Sfax',
            value: 'Sfax'
          },
          {
            label: 'Sousse',
            value: 'Sousse'
          },
          {
            label: 'Monastir',
            value: 'Monastir'
          },
          {
            label: 'Bizerte',
            value: 'Bizerte'
          },
          {
            label: 'Nabeul',
            value: 'Nabeul'
          }]

        }]
        } />
      

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(row) => row.id}
        onRowClick={setSelectedPatient}
        exportConfig={{
          fileName: 'Patients',
          columns: [
          {
            header: 'Nom',
            key: 'name'
          },
          {
            header: 'Email',
            key: 'email'
          },
          {
            header: 'Téléphone',
            key: 'phone'
          },
          {
            header: 'Ville',
            key: 'city'
          },
          {
            header: 'Réservations',
            key: 'bookingsCount'
          },
          {
            header: 'Total Dépensé (TND)',
            key: 'totalSpent'
          },
          {
            header: 'Statut',
            key: 'status'
          }]

        }} />
      

      <DetailDrawer
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title="Détails du Patient"
        footer={
        <div className="flex justify-end gap-2 w-full">
            <button
            onClick={() => {
              if (selectedPatient) {
                setActionPatient(selectedPatient);
                setIsEditModalOpen(true);
              }
            }}
            className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
            
              Modifier le Profil
            </button>
            <button
            onClick={() => {
              if (selectedPatient) {
                navigate(`/admin/patients/${selectedPatient.id}/reservations`);
              }
            }}
            className="px-3 py-1.5 text-sm font-medium bg-teal-600 text-white rounded-md hover:bg-teal-700">
            
              Voir les Réservations
            </button>
          </div>
        }>
        
        {selectedPatient &&
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-2xl font-bold text-teal-700 dark:text-teal-300">
                  {selectedPatient.name.
                split(' ').
                map((n) => n[0]).
                join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedPatient.name}
                    <StatusBadge status={selectedPatient.status} />
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedPatient.email}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ID: {selectedPatient.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-md border border-slate-200 dark:border-slate-700">
                <button
                onClick={() => {
                  setActionPatient(selectedPatient);
                  setIsEditModalOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                title="Modifier">
                
                  <Edit className="w-4 h-4" />
                </button>
                <button
                onClick={() => {
                  setActionPatient(selectedPatient);
                  setIsSuspendModalOpen(true);
                }}
                className={`p-1.5 rounded transition-colors ${selectedPatient.status === 'active' ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`}
                title={
                selectedPatient.status === 'active' ?
                'Suspendre' :
                'Activer'
                }>
                
                  {selectedPatient.status === 'active' ?
                <Ban className="w-4 h-4" /> :

                <CheckCircle className="w-4 h-4" />
                }
                </button>
                <button
                onClick={() => {
                  setActionPatient(selectedPatient);
                  setIsDeleteModalOpen(true);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Supprimer">
                
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Informations Personnelles */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Informations Personnelles
              </h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Date de naissance
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(selectedPatient.dateOfBirth).toLocaleDateString(
                    'fr-FR'
                  )}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Genre</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                    {selectedPatient.gender === 'male' ? 'Homme' : 'Femme'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Groupe Sanguin
                  </p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {selectedPatient.bloodType}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Langue</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white uppercase">
                    {selectedPatient.preferredLanguage}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-500 uppercase">
                    Téléphone
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedPatient.phone}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-500 uppercase">
                    Adresse
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedPatient.address}, {selectedPatient.city}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Date d'inscription
                  </p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {new Date(selectedPatient.joinedDate).toLocaleDateString(
                    'fr-FR'
                  )}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Dernière activité
                  </p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {new Date(
                    selectedPatient.lastActivityDate
                  ).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Assurance & Contact d'Urgence */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                Assurance & Urgence
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Assurance
                    </span>
                  </div>
                  {selectedPatient.insuranceProvider ?
                <>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedPatient.insuranceProvider}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-1">
                        {selectedPatient.insuranceNumber}
                      </p>
                    </> :

                <p className="text-xs text-slate-400 italic">
                      Non renseigné
                    </p>
                }
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Contact d'Urgence
                    </span>
                  </div>
                  {selectedPatient.emergencyContactName ?
                <>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedPatient.emergencyContactName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedPatient.emergencyContactPhone}
                      </p>
                    </> :

                <p className="text-xs text-slate-400 italic">
                      Non renseigné
                    </p>
                }
                </div>
              </div>
            </div>

            {/* Informations Médicales */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                Informations Médicales
              </h4>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Allergies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.allergies.length > 0 ?
                  selectedPatient.allergies.map((allergy, idx) =>
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full border border-red-200 dark:border-red-800/50">
                    
                          {allergy}
                        </span>
                  ) :

                  <span className="text-xs text-slate-400 italic">
                        Aucune allergie connue
                      </span>
                  }
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                    <HeartPulse className="w-3 h-3" /> Conditions Chroniques
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.chronicConditions.length > 0 ?
                  selectedPatient.chronicConditions.map(
                    (condition, idx) =>
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800/50">
                      
                            {condition}
                          </span>

                  ) :

                  <span className="text-xs text-slate-400 italic">
                        Aucune condition signalée
                      </span>
                  }
                  </div>
                </div>
              </div>
            </div>

            {/* Statistique d'Activité */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Statistiques d'Activité
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">
                    Total Réservations
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedPatient.bookingsCount}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">Total Dépensé</p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                    {selectedPatient.totalSpent.toLocaleString()}{' '}
                    <span className="text-sm font-normal text-slate-500">
                      TND
                    </span>
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">
                    Note Moyenne Donnée
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedPatient.averageRating.toFixed(1)}
                    </p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">
                    Taux d'Annulation
                  </p>
                  <p
                  className={`text-xl font-bold ${selectedPatient.cancellationRate < 5 ? 'text-emerald-600 dark:text-emerald-400' : selectedPatient.cancellationRate < 15 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                  
                    {selectedPatient.cancellationRate.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {selectedPatient.totalCancellations} annulations
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {selectedPatient.notes &&
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/40">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
                  Notes Administratives
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {selectedPatient.notes}
                </p>
              </div>
          }
          </div>
        }
      </DetailDrawer>

      {/* Action Modals */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le Patient"
        maxWidth="xl"
        footer={
        <>
            <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md">
            
              Enregistrer
            </button>
          </>
        }>
        
        {actionPatient &&
        <div className="space-y-5">
            {/* Section: Informations Personnelles */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Informations Personnelles
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Nom Complet
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.name}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Genre
                  </label>
                  <select
                  defaultValue={actionPatient.gender}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                  type="email"
                  defaultValue={actionPatient.email}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Téléphone
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.phone}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Date de Naissance
                  </label>
                  <input
                  type="date"
                  defaultValue={actionPatient.dateOfBirth}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Groupe Sanguin
                  </label>
                  <select
                  defaultValue={actionPatient.bloodType}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                    (bt) =>
                    <option key={bt} value={bt}>
                          {bt}
                        </option>

                  )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Langue Préférée
                  </label>
                  <select
                  defaultValue={actionPatient.preferredLanguage}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                  
                    <option value="fr">Français</option>
                    <option value="ar">Arabe</option>
                    <option value="en">Anglais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Ville
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.city}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Adresse
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.address}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
              </div>
            </div>

            {/* Section: Assurance & Contact d'Urgence */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                Assurance & Contact d'Urgence
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Assurance
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.insuranceProvider || ''}
                  placeholder="Ex: CNAM, Star Assurances..."
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    N° d'Assurance
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.insuranceNumber || ''}
                  placeholder="Numéro de police"
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Contact d'Urgence
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.emergencyContactName || ''}
                  placeholder="Nom complet"
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Tél. Contact d'Urgence
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.emergencyContactPhone || ''}
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
              </div>
            </div>

            {/* Section: Informations Médicales */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                Informations Médicales
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Allergies{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      (séparées par des virgules)
                    </span>
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.allergies.join(', ')}
                  placeholder="Ex: Pénicilline, Arachides..."
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Conditions Chroniques{' '}
                    <span className="text-[10px] text-slate-400 font-normal">
                      (séparées par des virgules)
                    </span>
                  </label>
                  <input
                  type="text"
                  defaultValue={actionPatient.chronicConditions.join(', ')}
                  placeholder="Ex: Diabète, Hypertension..."
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                
                </div>
              </div>
            </div>

            {/* Section: Notes Administratives */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Notes Administratives
              </h4>
              <textarea
              defaultValue={actionPatient.notes || ''}
              rows={2}
              className="w-full px-2.5 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Notes visibles uniquement par les administrateurs..." />
            
            </div>
          </div>
        }
      </Modal>

      <Modal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        title={
        actionPatient?.status === 'active' ?
        'Suspendre le Patient' :
        'Activer le Patient'
        }
        footer={
        <>
            <button
            onClick={() => setIsSuspendModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            onClick={() => setIsSuspendModalOpen(false)}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${actionPatient?.status === 'active' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            
              {actionPatient?.status === 'active' ?
            'Confirmer la suspension' :
            "Confirmer l'activation"}
            </button>
          </>
        }>
        
        {actionPatient &&
        <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Êtes-vous sûr de vouloir{' '}
              {actionPatient.status === 'active' ? 'suspendre' : 'activer'} le
              compte de{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {actionPatient.name}
              </span>{' '}
              ?
            </p>
            {actionPatient.status === 'active' &&
          <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Raison de la suspension
                </label>
                <select className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500">
                  <option>Annulations répétées</option>
                  <option>Comportement inapproprié</option>
                  <option>Fraude suspectée</option>
                  <option>Autre</option>
                </select>
              </div>
          }
          </div>
        }
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Supprimer le Patient"
        footer={
        <>
            <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md">
            
              Annuler
            </button>
            <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">
            
              Supprimer définitivement
            </button>
          </>
        }>
        
        {actionPatient &&
        <div className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                  Action irréversible
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  Vous êtes sur le point de supprimer le compte de{' '}
                  <span className="font-bold">{actionPatient.name}</span>.
                  Toutes ses données, réservations et historique seront
                  anonymisés ou supprimés conformément au RGPD.
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Pour confirmer, tapez "SUPPRIMER"
              </label>
              <input
              type="text"
              className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="SUPPRIMER" />
            
            </div>
          </div>
        }
      </Modal>
    </div>);

}