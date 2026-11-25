import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Star,
  CreditCard,
  Banknote,
  Smartphone,
  Activity,
  User,
  Clock,
  Stethoscope,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Timer } from
'lucide-react';
import { DataTable } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { mockPatients, mockReservations } from '../../data/mock/adminMockData';
import { PatientReservation } from '../../types/admin.types';
export function PatientReservations() {
  const { patientId } = useParams<{
    patientId: string;
  }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const patient = useMemo(
    () => mockPatients.find((p) => p.id === patientId),
    [patientId]
  );
  const filteredData = useMemo(() => {
    return mockReservations.
    filter((r) => {
      if (r.patientId !== patientId) return false;
      const matchesSearch =
      r.providerName.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      const matchesService = serviceFilter ?
      r.serviceType === serviceFilter :
      true;
      return matchesSearch && matchesStatus && matchesService;
    }).
    sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patientId, search, statusFilter, serviceFilter]);
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Patient introuvable
        </p>
        <button
          onClick={() => navigate('/admin/patients')}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
          
          <ArrowLeft className="w-4 h-4" /> Retour aux patients
        </button>
      </div>);

  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            <CheckCircle2 className="w-3 h-3" /> Confirmé
          </span>);

      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" /> Terminé
          </span>);

      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
            <XCircle className="w-3 h-3" /> Annulé
          </span>);

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <Timer className="w-3 h-3" /> En attente
          </span>);

      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
            <Activity className="w-3 h-3" /> En cours
          </span>);

      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <AlertCircle className="w-3 h-3" /> Non présenté
          </span>);

      default:
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {status}
          </span>);

    }
  };
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-3 h-3" />;
      case 'cash':
        return <Banknote className="w-3 h-3" />;
      case 'd17':
      case 'flouci':
        return <Smartphone className="w-3 h-3" />;
      default:
        return <CreditCard className="w-3 h-3" />;
    }
  };
  const columns = [
  {
    header: 'Date & Heure',
    accessor: (row: PatientReservation) =>
    <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(row.date).toLocaleDateString('fr-FR')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3" />
            {row.time} - {row.endTime}
          </div>
        </div>

  },
  {
    header: 'Service',
    accessor: (row: PatientReservation) =>
    <div>
          <div
        className="font-medium text-slate-900 dark:text-white truncate max-w-[150px]"
        title={row.serviceName}>
        
            {row.serviceName}
          </div>
          <div className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-wider">
            {row.serviceType}
          </div>
        </div>

  },
  {
    header: 'Professionnel',
    accessor: (row: PatientReservation) =>
    <div>
          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            {row.providerName}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-slate-500">
              {row.providerSpecialty}
            </span>
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              <Star className="w-2.5 h-2.5 fill-amber-400" />
              {row.providerRating.toFixed(1)}
            </div>
          </div>
        </div>

  },
  {
    header: 'Adresse',
    accessor: (row: PatientReservation) =>
    <div>
          <div
        className="text-sm text-slate-900 dark:text-white truncate max-w-[180px]"
        title={row.address}>
        
            {row.address}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {row.city}
          </div>
        </div>

  },
  {
    header: 'Montant',
    accessor: (row: PatientReservation) =>
    <div>
          <div className="font-bold text-teal-600 dark:text-teal-400">
            {row.amount} TND
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase mt-0.5">
            {getPaymentIcon(row.paymentMethod)}
            {row.paymentMethod}
          </div>
        </div>

  },
  {
    header: 'Statut',
    accessor: (row: PatientReservation) => getStatusBadge(row.status)
  }];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/patients')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Retour">
              
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-lg font-bold text-teal-700 dark:text-teal-300">
              {patient.name.
              split(' ').
              map((n) => n[0]).
              join('')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Réservations: {patient.name}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {patient.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Total Réservations
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {patient.bookingsCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Total Dépensé
            </p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {patient.totalSpent.toLocaleString()} TND
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Taux d'Annulation
            </p>
            <p
              className={`text-lg font-bold ${patient.cancellationRate < 5 ? 'text-emerald-600 dark:text-emerald-400' : patient.cancellationRate < 15 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
              
              {patient.cancellationRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Note Moyenne
            </p>
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {patient.averageRating.toFixed(1)}
              </p>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher par professionnel ou service..."
        filters={[
        {
          id: 'status',
          label: 'Tous les statuts',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
          {
            label: 'Confirmé',
            value: 'confirmed'
          },
          {
            label: 'Terminé',
            value: 'completed'
          },
          {
            label: 'Annulé',
            value: 'cancelled'
          },
          {
            label: 'En attente',
            value: 'pending'
          },
          {
            label: 'En cours',
            value: 'in_progress'
          },
          {
            label: 'Non présenté',
            value: 'no_show'
          }]

        },
        {
          id: 'service',
          label: 'Tous les services',
          value: serviceFilter,
          onChange: setServiceFilter,
          options: [
          {
            label: 'Soins infirmiers',
            value: 'nursing'
          },
          {
            label: 'Kinésithérapie',
            value: 'physio'
          },
          {
            label: 'Laboratoire',
            value: 'laboratory'
          },
          {
            label: 'Pharmacie',
            value: 'pharmacy'
          },
          {
            label: 'Ambulance',
            value: 'ambulance'
          },
          {
            label: 'Nutrition',
            value: 'nutrition'
          }]

        }]
        } />
      

      <DataTable
        columns={columns}
        data={filteredData}
        keyExtractor={(row) => row.id}
        exportConfig={{
          fileName: `Reservations_${patient?.name?.replace(/\s+/g, '_') || 'Patient'}`,
          columns: [
          {
            header: 'Date',
            key: 'date',
            transform: (v: string) => new Date(v).toLocaleDateString('fr-FR')
          },
          {
            header: 'Heure',
            key: 'time'
          },
          {
            header: 'Professionnel',
            key: 'providerName'
          },
          {
            header: 'Service',
            key: 'serviceName'
          },
          {
            header: 'Type Service',
            key: 'serviceType'
          },
          {
            header: 'Durée (min)',
            key: 'duration'
          },
          {
            header: 'Montant (TND)',
            key: 'amount'
          },
          {
            header: 'Paiement',
            key: 'paymentMethod'
          },
          {
            header: 'Statut',
            key: 'status'
          }]

        }} />
      
    </div>);

}