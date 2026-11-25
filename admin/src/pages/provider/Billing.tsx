import React, { useState, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Crown,
  Plus,
  X,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  Check } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useTodayAppointments } from '../../hooks/useAppointments';
// Types
interface Invoice {
  id: string;
  patientName: string;
  service: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
  patientPhone?: string;
  patientAddress?: string;
}
interface Expense {
  id: string;
  category: string;
  description: string;
  date: string;
  amount: number;
  receipt: boolean;
}
interface CompletedAppointment {
  id: string;
  patientName: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  patientPhone?: string;
  patientAddress?: string;
}
export function Billing() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<
    'invoices' | 'expenses' | 'reports'>(
    'invoices');
  // Fetch completed appointments
  const { data: todayAppointments } = useTodayAppointments();
  const completedAppointments: CompletedAppointment[] = (
  todayAppointments?.filter((apt) => apt.status === 'completed') || []).
  map((apt) => ({
    id: apt.id,
    patientName: apt.patientName || 'Patient',
    service: apt.serviceName || 'Service',
    date: new Date(apt.scheduledAt).toLocaleDateString('fr-FR'),
    time: new Date(apt.scheduledAt).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    amount: apt.price || 0,
    patientPhone: apt.patientPhone,
    patientAddress: apt.patientAddress
  }));
  // Modal states
  const [showSelectOperationModal, setShowSelectOperationModal] =
  useState(false);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] =
  useState<Invoice | null>(null);
  const [showExpenseDetailModal, setShowExpenseDetailModal] =
  useState<Expense | null>(null);
  const [selectedOperation, setSelectedOperation] =
  useState<CompletedAppointment | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const invoices = [
  {
    id: 'INV-2024-001',
    patientName: 'Mohamed Ali',
    patientPhone: '+216 98 123 456',
    patientAddress: '15 Avenue Habib Bourguiba, Tunis',
    service: 'Soins infirmiers',
    date: '15 Jan 2024',
    amount: 60,
    status: 'paid' as const,
    paymentMethod: 'Carte bancaire'
  },
  {
    id: 'INV-2024-002',
    patientName: 'Fatma Ben Said',
    patientPhone: '+216 22 456 789',
    patientAddress: '42 Rue de la Liberté, Ariana',
    service: 'Kinésithérapie',
    date: '14 Jan 2024',
    amount: 80,
    status: 'paid' as const,
    paymentMethod: 'Espèces'
  },
  {
    id: 'INV-2024-003',
    patientName: 'Ahmed Trabelsi',
    patientPhone: '+216 55 789 123',
    patientAddress: '8 Avenue de Carthage, La Marsa',
    service: 'Consultation',
    date: '13 Jan 2024',
    amount: 50,
    status: 'pending' as const,
    paymentMethod: 'En attente'
  },
  {
    id: 'INV-2024-004',
    patientName: 'Leila Gharbi',
    patientPhone: '+216 24 567 890',
    patientAddress: '33 Rue de Marseille, Tunis',
    service: 'Garde de nuit',
    date: '12 Jan 2024',
    amount: 120,
    status: 'overdue' as const,
    paymentMethod: 'Chèque'
  }];

  const expenses = [
  {
    id: 'EXP-2024-001',
    category: 'Matériel médical',
    description: 'Seringues et compresses',
    date: '10 Jan 2024',
    amount: 45,
    receipt: true
  },
  {
    id: 'EXP-2024-002',
    category: 'Transport',
    description: 'Essence - déplacements patients',
    date: '8 Jan 2024',
    amount: 30,
    receipt: true
  },
  {
    id: 'EXP-2024-003',
    category: 'Formation',
    description: 'Séminaire soins palliatifs',
    date: '5 Jan 2024',
    amount: 150,
    receipt: false
  }];

  const monthlyStats = {
    revenue: 4250,
    expenses: 850,
    net: 3400,
    invoiceCount: 42,
    paidCount: 38,
    pendingCount: 3,
    overdueCount: 1
  };
  const getStatusColor = (status: string) => {
    if (isDark) {
      switch (status) {
        case 'paid':
          return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'pending':
          return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        case 'overdue':
          return 'bg-red-500/20 text-red-400 border-red-500/30';
        default:
          return 'bg-slate-700 text-slate-300 border-slate-600';
      }
    } else {
      switch (status) {
        case 'paid':
          return 'bg-green-100 text-green-700 border-green-200';
        case 'pending':
          return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'overdue':
          return 'bg-red-100 text-red-700 border-red-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      default:
        return 'Inconnu';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  // Generate PDF with proper error handling
  const loadJsPDF = async (): Promise<any> => import('jspdf');
  // Generate PDF for invoice
  const generateInvoicePDF = async (invoice: Invoice) => {
    try {
      const jsPDFModule = await loadJsPDF();
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURE', 105, 20, {
        align: 'center'
      });
      // Invoice details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`N° Facture: ${invoice.id}`, 20, 40);
      doc.text(`Date: ${invoice.date}`, 20, 47);
      // Provider info
      doc.setFont('helvetica', 'bold');
      doc.text('Prestataire:', 20, 60);
      doc.setFont('helvetica', 'normal');
      doc.text('Care@Home Tunisia', 20, 67);
      doc.text('Adresse: 123 Avenue Habib Bourguiba, Tunis', 20, 74);
      doc.text('Matricule Fiscal: 123456789/A/M/000', 20, 81);
      // Patient info
      doc.setFont('helvetica', 'bold');
      doc.text('Client:', 120, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.patientName, 120, 67);
      if (invoice.patientPhone) doc.text(invoice.patientPhone, 120, 74);
      if (invoice.patientAddress) doc.text(invoice.patientAddress, 120, 81);
      // Line
      doc.line(20, 95, 190, 95);
      // Service details
      doc.setFont('helvetica', 'bold');
      doc.text('Désignation', 20, 105);
      doc.text('Montant HT', 150, 105);
      doc.line(20, 108, 190, 108);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.service, 20, 118);
      doc.text(`${(invoice.amount / 1.19).toFixed(3)} TND`, 150, 118);
      // Totals
      doc.line(20, 130, 190, 130);
      const htAmount = invoice.amount / 1.19;
      const tvaAmount = invoice.amount - htAmount;
      doc.text('Total HT:', 120, 140);
      doc.text(`${htAmount.toFixed(3)} TND`, 170, 140, {
        align: 'right'
      });
      doc.text('TVA (19%):', 120, 147);
      doc.text(`${tvaAmount.toFixed(3)} TND`, 170, 147, {
        align: 'right'
      });
      doc.text('Timbre Fiscal:', 120, 154);
      doc.text('0.600 TND', 170, 154, {
        align: 'right'
      });
      doc.setFont('helvetica', 'bold');
      doc.text('Total TTC:', 120, 164);
      doc.text(`${(invoice.amount + 0.6).toFixed(3)} TND`, 170, 164, {
        align: 'right'
      });
      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Conforme à la législation tunisienne - TVA 19% - Timbre fiscal 0.600 TND',
        105,
        280,
        {
          align: 'center'
        }
      );
      doc.save(`Facture_${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };
  // Generate PDF for TVA declaration
  const generateTVAPDF = async () => {
    try {
      const jsPDFModule = await loadJsPDF();
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('DÉCLARATION TVA', 105, 20, {
        align: 'center'
      });
      doc.setFontSize(12);
      doc.text('Période: Janvier 2024', 105, 35, {
        align: 'center'
      });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Déclarant:', 20, 50);
      doc.setFont('helvetica', 'normal');
      doc.text('Care@Home Tunisia', 20, 57);
      doc.text('Matricule Fiscal: 123456789/A/M/000', 20, 64);
      doc.line(20, 75, 190, 75);
      doc.setFont('helvetica', 'bold');
      doc.text("Chiffre d'affaires HT:", 20, 85);
      doc.text(`${(monthlyStats.revenue / 1.19).toFixed(3)} TND`, 170, 85, {
        align: 'right'
      });
      doc.text('TVA collectée (19%):', 20, 95);
      doc.text(
        `${(monthlyStats.revenue - monthlyStats.revenue / 1.19).toFixed(3)} TND`,
        170,
        95,
        {
          align: 'right'
        }
      );
      doc.text('TVA déductible:', 20, 105);
      doc.text(`${(monthlyStats.expenses * 0.19).toFixed(3)} TND`, 170, 105, {
        align: 'right'
      });
      doc.line(20, 115, 190, 115);
      doc.setFontSize(12);
      doc.text('TVA à payer:', 20, 125);
      const tvaToPay =
      monthlyStats.revenue -
      monthlyStats.revenue / 1.19 -
      monthlyStats.expenses * 0.19;
      doc.text(`${tvaToPay.toFixed(3)} TND`, 170, 125, {
        align: 'right'
      });
      doc.setFontSize(8);
      doc.text(
        'Document généré automatiquement - Conforme à la législation tunisienne',
        105,
        280,
        {
          align: 'center'
        }
      );
      doc.save('Declaration_TVA_Janvier_2024.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };
  // Generate Bilan Comptable
  const generateBilanPDF = async () => {
    try {
      const jsPDFModule = await loadJsPDF();
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('BILAN COMPTABLE', 105, 20, {
        align: 'center'
      });
      doc.setFontSize(12);
      doc.text('Année 2024', 105, 30, {
        align: 'center'
      });
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RECETTES', 20, 50);
      doc.line(20, 53, 190, 53);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Prestations de services', 20, 63);
      doc.text(`${monthlyStats.revenue.toFixed(3)} TND`, 170, 63, {
        align: 'right'
      });
      doc.setFont('helvetica', 'bold');
      doc.text('Total Recettes:', 20, 75);
      doc.text(`${monthlyStats.revenue.toFixed(3)} TND`, 170, 75, {
        align: 'right'
      });
      doc.setFontSize(14);
      doc.text('DÉPENSES', 20, 95);
      doc.line(20, 98, 190, 98);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Matériel médical', 20, 108);
      doc.text('450.000 TND', 170, 108, {
        align: 'right'
      });
      doc.text('Transport', 20, 115);
      doc.text('200.000 TND', 170, 115, {
        align: 'right'
      });
      doc.text('Formation', 20, 122);
      doc.text('200.000 TND', 170, 122, {
        align: 'right'
      });
      doc.setFont('helvetica', 'bold');
      doc.text('Total Dépenses:', 20, 134);
      doc.text(`${monthlyStats.expenses.toFixed(3)} TND`, 170, 134, {
        align: 'right'
      });
      doc.line(20, 145, 190, 145);
      doc.setFontSize(12);
      doc.text('RÉSULTAT NET:', 20, 157);
      doc.text(`${monthlyStats.net.toFixed(3)} TND`, 170, 157, {
        align: 'right'
      });
      doc.setFontSize(8);
      doc.text('Bilan conforme aux normes comptables tunisiennes', 105, 280, {
        align: 'center'
      });
      doc.save('Bilan_Comptable_2024.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };
  // Generate CNSS Declaration
  const generateCNSSPDF = async () => {
    try {
      const jsPDFModule = await loadJsPDF();
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('DÉCLARATION CNSS', 105, 20, {
        align: 'center'
      });
      doc.setFontSize(12);
      doc.text('Trimestre: T1 2024', 105, 30, {
        align: 'center'
      });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Déclarant:', 20, 50);
      doc.setFont('helvetica', 'normal');
      doc.text('Care@Home Tunisia', 20, 57);
      doc.text('N° Affiliation CNSS: 123456', 20, 64);
      doc.line(20, 75, 190, 75);
      doc.setFont('helvetica', 'bold');
      doc.text('Assiette de cotisation:', 20, 85);
      doc.text(`${monthlyStats.revenue.toFixed(3)} TND`, 170, 85, {
        align: 'right'
      });
      doc.text('Cotisation patronale (16.57%):', 20, 95);
      doc.text(`${(monthlyStats.revenue * 0.1657).toFixed(3)} TND`, 170, 95, {
        align: 'right'
      });
      doc.text('Cotisation salariale (9.18%):', 20, 105);
      doc.text(`${(monthlyStats.revenue * 0.0918).toFixed(3)} TND`, 170, 105, {
        align: 'right'
      });
      doc.line(20, 115, 190, 115);
      doc.setFontSize(12);
      doc.text('Total cotisations:', 20, 125);
      doc.text(`${(monthlyStats.revenue * 0.2575).toFixed(3)} TND`, 170, 125, {
        align: 'right'
      });
      doc.setFontSize(8);
      doc.text(
        'Déclaration conforme à la réglementation CNSS tunisienne',
        105,
        280,
        {
          align: 'center'
        }
      );
      doc.save('Declaration_CNSS_T1_2024.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };
  // Generate Livre de Recettes
  const generateLivreRecettesPDF = async () => {
    try {
      const jsPDFModule = await loadJsPDF();
      const { jsPDF } = jsPDFModule;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('LIVRE DE RECETTES', 105, 20, {
        align: 'center'
      });
      doc.setFontSize(12);
      doc.text('Janvier 2024', 105, 30, {
        align: 'center'
      });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Date', 20, 50);
      doc.text('N° Facture', 50, 50);
      doc.text('Client', 90, 50);
      doc.text('Montant TTC', 150, 50);
      doc.line(20, 53, 190, 53);
      let yPos = 63;
      doc.setFont('helvetica', 'normal');
      invoices.forEach((inv) => {
        doc.text(inv.date, 20, yPos);
        doc.text(inv.id, 50, yPos);
        doc.text(inv.patientName, 90, yPos);
        doc.text(`${inv.amount.toFixed(3)} TND`, 170, yPos, {
          align: 'right'
        });
        yPos += 7;
      });
      doc.line(20, yPos + 5, 190, yPos + 5);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', 120, yPos + 15);
      doc.text(`${monthlyStats.revenue.toFixed(3)} TND`, 170, yPos + 15, {
        align: 'right'
      });
      doc.setFontSize(8);
      doc.text(
        "Livre de recettes conforme à l'article 62 du Code de l'IRPP et de l'IS",
        105,
        280,
        {
          align: 'center'
        }
      );
      doc.save('Livre_Recettes_Janvier_2024.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  };
  // Handle operation selection and invoice generation
  const handleSelectOperation = (operation: CompletedAppointment) => {
    setSelectedOperation(operation);
  };
  const handleGenerateInvoice = async () => {
    if (!selectedOperation) return;
    const newInvoice: Invoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      patientName: selectedOperation.patientName,
      patientPhone: selectedOperation.patientPhone,
      patientAddress: selectedOperation.patientAddress,
      service: selectedOperation.service,
      date: selectedOperation.date,
      amount: selectedOperation.amount,
      status: 'pending',
      paymentMethod: 'En attente'
    };
    // Generate PDF immediately
    await generateInvoicePDF(newInvoice);
    // Close modal and reset
    setShowSelectOperationModal(false);
    setSelectedOperation(null);
    setAdditionalNotes('');
  };
  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-stone-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/provider-dashboard')}
            className={`flex items-center mb-4 font-medium ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-600 hover:text-gray-900'}`}>
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Facturation & Comptabilité
              </h1>
              <p
                className={`mt-2 text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                
                Gérez vos finances professionnelles
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none">
                
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => setShowSelectOperationModal(true)}>
                
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Nouvelle</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Elite Badge */}
        <div
          className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl border ${isDark ? 'bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-700/30' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'}`}>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base sm:text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                Facturation et Comptabilité Incluses
              </h3>
              <p
                className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                
                Fonctionnalité exclusive • Conforme aux normes tunisiennes
              </p>
            </div>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-600 text-white text-xs sm:text-sm font-bold rounded-full whitespace-nowrap">
              👑 Elite
            </span>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${period === 'month' ? 'bg-amber-600 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
              
              Ce mois
            </button>
            <button
              onClick={() => setPeriod('quarter')}
              className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${period === 'quarter' ? 'bg-amber-600 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
              
              Trimestre
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${period === 'year' ? 'bg-amber-600 text-white' : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
              
              Année
            </button>
          </div>
          <div
            className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            
            Janvier 2024
          </div>
        </div>

        {/* Financial Summary - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div
            className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30' : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'}`}>
            
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-green-700/30' : 'bg-green-200'}`}>
                
                <TrendingUp
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                
              </div>
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold ${isDark ? 'bg-green-700/30 text-green-400' : 'bg-green-200 text-green-700'}`}>
                
                +12%
              </div>
            </div>
            <p
              className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              
              Chiffre d'affaires
            </p>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-green-300' : 'text-green-900'}`}>
              
              {monthlyStats.revenue}
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? 'text-green-500' : 'text-green-600'}`}>
              
              {monthlyStats.invoiceCount} factures
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-red-900/20 to-red-900/20 border-red-700/30' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
            
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-red-700/30' : 'bg-red-200'}`}>
                
                <DollarSign
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                
              </div>
            </div>
            <p
              className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              
              Dépenses
            </p>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-red-300' : 'text-red-900'}`}>
              
              {monthlyStats.expenses}
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? 'text-red-500' : 'text-red-600'}`}>
              
              20% du CA
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-blue-900/20 border-blue-700/30' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
            
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-700/30' : 'bg-blue-200'}`}>
                
                <CheckCircle2
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                
              </div>
            </div>
            <p
              className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              
              Bénéfice net
            </p>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
              
              {monthlyStats.net}
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>
              
              Marge : 80%
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-amber-900/20 to-amber-900/20 border-amber-700/30' : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'}`}>
            
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-700/30' : 'bg-amber-200'}`}>
                
                <Clock
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                
              </div>
            </div>
            <p
              className={`text-xs sm:text-sm font-medium mb-1 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              
              En attente
            </p>
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
              
              {monthlyStats.pendingCount}
            </p>
            <p
              className={`text-xs mt-1 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
              
              {monthlyStats.overdueCount} en retard
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`mb-6 rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          
          <div
            className={`flex border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors relative text-xs sm:text-base ${activeTab === 'invoices' ? isDark ? 'text-amber-400 bg-amber-900/20' : 'text-amber-600 bg-amber-50' : isDark ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 inline-block sm:mr-2" />
              <span className="hidden sm:inline">
                Factures ({invoices.length})
              </span>
              <span className="sm:hidden">({invoices.length})</span>
              {activeTab === 'invoices' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors relative text-xs sm:text-base ${activeTab === 'expenses' ? isDark ? 'text-amber-400 bg-amber-900/20' : 'text-amber-600 bg-amber-50' : isDark ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 inline-block sm:mr-2" />
              <span className="hidden sm:inline">
                Dépenses ({expenses.length})
              </span>
              <span className="sm:hidden">({expenses.length})</span>
              {activeTab === 'expenses' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              }
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors relative text-xs sm:text-base ${activeTab === 'reports' ? isDark ? 'text-amber-400 bg-amber-900/20' : 'text-amber-600 bg-amber-50' : isDark ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 inline-block sm:mr-2" />
              <span className="hidden sm:inline">Rapports</span>
              <span className="sm:hidden">Rap.</span>
              {activeTab === 'reports' &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              }
            </button>
          </div>
        </div>

        {/* Invoices Tab */}
        {activeTab === 'invoices' &&
        <div
          className={`rounded-xl border p-4 sm:p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
              
                <input
                type="text"
                placeholder="Rechercher..."
                className={`w-full pl-9 sm:pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'border-gray-200 text-gray-900 placeholder-gray-400'}`} />
              
              </div>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {invoices.map((invoice) =>
            <div
              key={invoice.id}
              className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span
                    className={`font-mono text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                        {invoice.id}
                      </span>
                      <h3
                    className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                        {invoice.patientName}
                      </h3>
                      <p
                    className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                        {invoice.service}
                      </p>
                    </div>
                    <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)}`}>
                  
                      {getStatusIcon(invoice.status)}
                      {getStatusLabel(invoice.status)}
                    </span>
                  </div>
                  <div
                className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                
                    <div>
                      <p
                    className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                    
                        {invoice.date}
                      </p>
                      <p
                    className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                        {invoice.amount} TND
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                    onClick={() => setShowInvoiceDetailModal(invoice)}
                    className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
                    
                        <Eye
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                    
                      </button>
                      <button
                    onClick={() => generateInvoicePDF(invoice)}
                    className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
                    
                        <Download
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                    
                      </button>
                    </div>
                  </div>
                </div>
            )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                  className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      N° Facture
                    </th>
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Patient
                    </th>
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Service
                    </th>
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Date
                    </th>
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Montant
                    </th>
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Statut
                    </th>
                    <th
                    className={`text-left py-3 px-4 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) =>
                <tr
                  key={invoice.id}
                  className={`border-b transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                  
                      <td className="py-4 px-4">
                        <span
                      className={`font-mono text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-900'}`}>
                      
                          {invoice.id}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                      className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-900'}`}>
                      
                          {invoice.patientName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                      className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                          {invoice.service}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                      className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                          {invoice.date}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                      className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                          {invoice.amount} TND
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)}`}>
                      
                          {getStatusIcon(invoice.status)}
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                        onClick={() => setShowInvoiceDetailModal(invoice)}
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200'}`}
                        title="Voir">
                        
                            <Eye
                          className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                        
                          </button>
                          <button
                        onClick={() => generateInvoicePDF(invoice)}
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200'}`}
                        title="Télécharger">
                        
                            <Download
                          className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                        
                          </button>
                          {invoice.status === 'pending' &&
                      <button
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200'}`}
                        title="Envoyer rappel">
                        
                              <Send
                          className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                        
                            </button>
                      }
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        }

        {/* Expenses Tab */}
        {activeTab === 'expenses' &&
        <div
          className={`rounded-xl border p-4 sm:p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          
            <div className="space-y-3 sm:space-y-4">
              {expenses.map((expense) =>
            <div
              key={expense.id}
              className={`p-4 rounded-lg border flex flex-col sm:flex-row items-start justify-between gap-4 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                  
                      <DollarSign
                    className={`h-5 w-5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                        <h3
                      className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                          {expense.category}
                        </h3>
                        <span
                      className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      
                          {expense.id}
                        </span>
                      </div>
                      <p
                    className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                        {expense.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span
                      className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      
                          <Calendar className="h-3 w-3" />
                          {expense.date}
                        </span>
                        {expense.receipt &&
                    <span
                      className={`flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      
                            <CheckCircle2 className="h-3 w-3" />
                            Justificatif
                          </span>
                    }
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                    <p
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                      {expense.amount} TND
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                    onClick={() => setShowExpenseDetailModal(expense)}
                    className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
                    
                        <Eye
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                    
                      </button>
                      <button
                    className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}>
                    
                        <Download
                      className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                    
                      </button>
                    </div>
                  </div>
                </div>
            )}
            </div>
          </div>
        }

        {/* Reports Tab - 2 columns grid */}
        {activeTab === 'reports' &&
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div
            onClick={generateTVAPDF}
            className={`p-4 sm:p-6 rounded-xl border cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-600' : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-lg'}`}>
            
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                
                  <FileText
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Déclaration TVA
                  </h3>
                  <p
                  className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                    Rapport mensuel
                  </p>
                </div>
              </div>
              <Button variant="outline" fullWidth size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>

            <div
            onClick={generateBilanPDF}
            className={`p-4 sm:p-6 rounded-xl border cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-green-600' : 'bg-white border-gray-200 hover:border-green-500 hover:shadow-lg'}`}>
            
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                
                  <TrendingUp
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Bilan comptable
                  </h3>
                  <p
                  className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                    Synthèse annuelle
                  </p>
                </div>
              </div>
              <Button variant="outline" fullWidth size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger Excel
              </Button>
            </div>

            <div
            onClick={generateCNSSPDF}
            className={`p-4 sm:p-6 rounded-xl border cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-purple-600' : 'bg-white border-gray-200 hover:border-purple-500 hover:shadow-lg'}`}>
            
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                
                  <FileText
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Déclaration CNSS
                  </h3>
                  <p
                  className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                    Cotisations sociales
                  </p>
                </div>
              </div>
              <Button variant="outline" fullWidth size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>

            <div
            onClick={generateLivreRecettesPDF}
            className={`p-4 sm:p-6 rounded-xl border cursor-pointer transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-amber-600' : 'bg-white border-gray-200 hover:border-amber-500 hover:shadow-lg'}`}>
            
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                
                  <DollarSign
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Livre de recettes
                  </h3>
                  <p
                  className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  
                    Conforme législation TN
                  </p>
                </div>
              </div>
              <Button variant="outline" fullWidth size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        }

        {/* Tax Info Banner */}
        <div
          className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl border ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
          
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-blue-700' : 'bg-blue-600'}`}>
              
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-bold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                📋 Conformité fiscale tunisienne
              </h3>
              <p
                className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                
                Toutes vos factures et déclarations sont conformes aux exigences
                de la législation tunisienne.
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  
                  TVA 19%
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  
                  CNSS
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  
                  Timbre fiscal
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  
                  Livre de recettes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Select Operation Modal */}
      {showSelectOperationModal &&
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
          className={`w-full max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          
            <div
            className={`sticky top-0 flex items-center justify-between p-6 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            
              <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Sélectionner une opération
              </h2>
              <button
              onClick={() => {
                setShowSelectOperationModal(false);
                setSelectedOperation(null);
                setAdditionalNotes('');
              }}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {completedAppointments.length > 0 ?
            <div className="space-y-3 mb-6">
                  {completedAppointments.map((operation) =>
              <div
                key={operation.id}
                onClick={() => handleSelectOperation(operation)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedOperation?.id === operation.id ? isDark ? 'border-amber-500 bg-amber-900/20' : 'border-amber-500 bg-amber-50' : isDark ? 'border-slate-700 hover:border-slate-600 bg-slate-900/50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}>
                
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                        className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        
                              {operation.patientName}
                            </h3>
                            {selectedOperation?.id === operation.id &&
                      <Check className="h-5 w-5 text-amber-500" />
                      }
                          </div>
                          <p
                      className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      
                            {operation.service}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span
                        className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                        
                              <Calendar className="h-3 w-3" />
                              {operation.date} à {operation.time}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                      className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      
                            {operation.amount} TND
                          </p>
                        </div>
                      </div>
                    </div>
              )}
                </div> :

            <div className="text-center py-12">
                  <CheckCircle2
                className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
              
                  <p
                className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                
                    Aucune opération terminée disponible
                  </p>
                </div>
            }

              {selectedOperation &&
            <div className="space-y-4">
                  <div>
                    <label
                  className={`block text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                      Notes additionnelles (optionnel)
                    </label>
                    <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                  placeholder="Ajoutez des informations supplémentaires si nécessaire..."
                  className={`w-full px-4 py-3 border rounded-lg transition-all resize-none ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500'}`} />
                
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSelectOperationModal(false);
                    setSelectedOperation(null);
                    setAdditionalNotes('');
                  }}>
                  
                      Annuler
                    </Button>
                    <Button
                  variant="primary"
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={handleGenerateInvoice}>
                  
                      Générer la facture
                    </Button>
                  </div>
                </div>
            }
            </div>
          </div>
        </div>
      }

      {/* Invoice Detail Modal */}
      {showInvoiceDetailModal &&
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
          className={`w-full max-w-2xl rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          
            <div
            className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            
              <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Détails de la facture
              </h2>
              <button
              onClick={() => setShowInvoiceDetailModal(null)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div
              className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
              
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      N° Facture
                    </p>
                    <p
                    className={`font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showInvoiceDetailModal.id}
                    </p>
                  </div>
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      Date
                    </p>
                    <p
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showInvoiceDetailModal.date}
                    </p>
                  </div>
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      Patient
                    </p>
                    <p
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showInvoiceDetailModal.patientName}
                    </p>
                  </div>
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      Téléphone
                    </p>
                    <p
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showInvoiceDetailModal.patientPhone}
                    </p>
                  </div>
                </div>
              </div>

              <div
              className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
              
                <p
                className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                
                  Service
                </p>
                <p
                className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  {showInvoiceDetailModal.service}
                </p>
              </div>

              <div
              className={`p-4 rounded-lg border ${isDark ? 'bg-amber-900/20 border-amber-700/30' : 'bg-amber-50 border-amber-200'}`}>
              
                <div className="flex justify-between items-center">
                  <span
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Montant total
                  </span>
                  <span className="text-3xl font-bold text-amber-600">
                    {showInvoiceDetailModal.amount} TND
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => generateInvoicePDF(showInvoiceDetailModal)}>
                
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={() => setShowInvoiceDetailModal(null)}>
                
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Expense Detail Modal */}
      {showExpenseDetailModal &&
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
          className={`w-full max-w-2xl rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
          
            <div
            className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            
              <h2
              className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Détails de la dépense
              </h2>
              <button
              onClick={() => setShowExpenseDetailModal(null)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
              
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div
              className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
              
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      N° Dépense
                    </p>
                    <p
                    className={`font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showExpenseDetailModal.id}
                    </p>
                  </div>
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      Date
                    </p>
                    <p
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showExpenseDetailModal.date}
                    </p>
                  </div>
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      Catégorie
                    </p>
                    <p
                    className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    
                      {showExpenseDetailModal.category}
                    </p>
                  </div>
                  <div>
                    <p
                    className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    
                      Justificatif
                    </p>
                    <p
                    className={`font-semibold ${showExpenseDetailModal.receipt ? 'text-green-500' : 'text-red-500'}`}>
                    
                      {showExpenseDetailModal.receipt ? 'Oui' : 'Non'}
                    </p>
                  </div>
                </div>
              </div>

              <div
              className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
              
                <p
                className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                
                  Description
                </p>
                <p
                className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                  {showExpenseDetailModal.description}
                </p>
              </div>

              <div
              className={`p-4 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-700/30' : 'bg-red-50 border-red-200'}`}>
              
                <div className="flex justify-between items-center">
                  <span
                  className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    Montant
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    {showExpenseDetailModal.amount} TND
                  </span>
                </div>
              </div>

              <Button
              variant="primary"
              fullWidth
              onClick={() => setShowExpenseDetailModal(null)}>
              
                Fermer
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}
