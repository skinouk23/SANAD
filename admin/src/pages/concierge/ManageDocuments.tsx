import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Stethoscope,
  FlaskConical,
  Pill,
  FileCheck,
  Moon,
  Sun,
  X,
  Check } from
'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
interface Document {
  id: number;
  name: string;
  type: 'prescription' | 'results' | 'report';
  date: string;
  doctor: string;
  category: string;
  size: string;
  icon: any;
}
export function ManageDocuments() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'all' | 'prescriptions' | 'results' | 'reports'>(
    'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [uploadType, setUploadType] = useState<
    'prescription' | 'results' | 'report'>(
    'prescription');
  const [documents, setDocuments] = useState<Document[]>([
  {
    id: 1,
    name: 'Ordonnance - Dr. Trabelsi',
    type: 'prescription',
    date: '15 Jan 2024',
    doctor: 'Dr. Ahmed Trabelsi',
    category: 'Cardiologie',
    size: '245 KB',
    icon: Pill
  },
  {
    id: 2,
    name: 'Analyses sanguines',
    type: 'results',
    date: '12 Jan 2024',
    doctor: 'Laboratoire Central',
    category: 'Analyses',
    size: '1.2 MB',
    icon: FlaskConical
  },
  {
    id: 3,
    name: 'Compte-rendu consultation',
    type: 'report',
    date: '10 Jan 2024',
    doctor: 'Dr. Leila Ben Ali',
    category: 'Neurologie',
    size: '890 KB',
    icon: FileCheck
  },
  {
    id: 4,
    name: 'Ordonnance - Dr. Gharbi',
    type: 'prescription',
    date: '8 Jan 2024',
    doctor: 'Dr. Mohamed Gharbi',
    category: 'Médecine générale',
    size: '180 KB',
    icon: Pill
  },
  {
    id: 5,
    name: 'Radio thorax',
    type: 'results',
    date: '5 Jan 2024',
    doctor: 'Centre de Radiologie',
    category: 'Imagerie',
    size: '3.5 MB',
    icon: FlaskConical
  }]
  );
  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };
  const handleDownloadDocument = (doc: Document) => {
    alert(`Téléchargement de: ${doc.name}`);
  };
  const handleDeleteDocument = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };
  const handleUploadDocument = () => {
    const newDoc: Document = {
      id: documents.length + 1,
      name: `Nouveau document ${documents.length + 1}`,
      type: uploadType,
      date: new Date().toLocaleDateString('fr-FR'),
      doctor: 'Dr. Example',
      category: 'Catégorie',
      size: '500 KB',
      icon:
      uploadType === 'prescription' ?
      Pill :
      uploadType === 'results' ?
      FlaskConical :
      FileCheck
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    alert('Document ajouté avec succès!');
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return isDark ?
        'bg-green-500/20 text-green-400 border-green-500/30' :
        'bg-green-100 text-green-700 border-green-200';
      case 'results':
        return isDark ?
        'bg-blue-500/20 text-blue-400 border-blue-500/30' :
        'bg-blue-100 text-blue-700 border-blue-200';
      case 'report':
        return isDark ?
        'bg-purple-500/20 text-purple-400 border-purple-500/30' :
        'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return isDark ?
        'bg-slate-500/20 text-slate-400 border-slate-500/30' :
        'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'Ordonnance';
      case 'results':
        return 'Résultats';
      case 'report':
        return 'Compte-rendu';
      default:
        return 'Document';
    }
  };
  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'from-green-500 to-emerald-500';
      case 'results':
        return 'from-blue-500 to-cyan-500';
      case 'report':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };
  const filteredDocuments = documents.filter((doc) => {
    const matchesTab =
    activeTab === 'all' || doc.type === activeTab.replace('s', '');
    const matchesSearch =
    searchQuery === '' ||
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-green-500' : 'bg-green-300'}`}>
        </div>
        <div
          className={`absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-blue-500' : 'bg-blue-300'}`}>
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

          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Gérer mes documents
                </span>
              </h1>
              <p
                className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                
                Centralisez ordonnances et résultats médicaux
              </p>
            </div>
            <Button
              onClick={() => setShowUploadModal(true)}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg shadow-green-500/30">
              
              <Upload className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
          {
            icon: Pill,
            label: 'Ordonnances',
            value: documents.filter((d) => d.type === 'prescription').length,
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            icon: FlaskConical,
            label: 'Résultats',
            value: documents.filter((d) => d.type === 'results').length,
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            icon: FileCheck,
            label: 'Comptes-rendus',
            value: documents.filter((d) => d.type === 'report').length,
            gradient: 'from-purple-500 to-pink-500'
          },
          {
            icon: FileText,
            label: 'Total documents',
            value: documents.length,
            gradient: 'from-amber-500 to-orange-500'
          }].
          map((stat, index) =>
          <div
            key={index}
            className={`rounded-2xl p-6 border backdrop-blur-sm transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
            
              <div className="flex items-center justify-between mb-4">
                <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p
              className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
                {stat.label}
              </p>
              <p
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                {stat.value}
              </p>
            </div>
          )}
        </div>

        {/* Search */}
        <div
          className={`rounded-2xl p-6 mb-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un document..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20' : 'bg-white border-gray-200 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent'}`} />
            
          </div>
        </div>

        {/* Tabs */}
        <div
          className={`rounded-2xl overflow-hidden mb-6 border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          
          <div
            className={`flex border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            
            {[
            {
              id: 'all',
              label: `Tous (${documents.length})`
            },
            {
              id: 'prescriptions',
              label: `Ordonnances (${documents.filter((d) => d.type === 'prescription').length})`
            },
            {
              id: 'results',
              label: `Résultats (${documents.filter((d) => d.type === 'results').length})`
            },
            {
              id: 'reports',
              label: `Comptes-rendus (${documents.filter((d) => d.type === 'report').length})`
            }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === tab.id ? isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50' : isDark ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              
                {tab.label}
                {activeTab === tab.id &&
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              }
              </button>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocuments.map((doc, index) =>
          <div
            key={doc.id}
            className={`rounded-2xl p-6 border backdrop-blur-sm transition-all hover:scale-105 animate-in slide-in-from-bottom-4 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'}`}
            style={{
              animationDelay: `${index * 50}ms`
            }}>
            
              <div className="flex items-start gap-4 mb-4">
                <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${getTypeGradient(doc.type)}`}>
                
                  <doc.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                  className={`font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  
                    {doc.name}
                  </h3>
                  <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-bold border ${getTypeColor(doc.type)}`}>
                  
                    {getTypeLabel(doc.type)}
                  </span>
                </div>
              </div>

              <div
              className={`space-y-2 text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              
                <div className="flex items-center gap-2">
                  <User
                  className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                
                  <span>{doc.doctor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope
                  className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                
                  <span>{doc.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar
                  className={`h-4 w-4 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                
                  <span>{doc.date}</span>
                </div>
              </div>

              <div
              className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
              
                <span
                className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                
                  {doc.size}
                </span>
                <div className="flex items-center gap-2">
                  <button
                  onClick={() => handleViewDocument(doc)}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                  title="Voir">
                  
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                  onClick={() => handleDownloadDocument(doc)}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                  title="Télécharger">
                  
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                  title="Supprimer">
                  
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 &&
        <div
          className={`rounded-2xl p-12 text-center border backdrop-blur-sm ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          
            <FileText
            className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} />
          
            <h3
            className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            
              Aucun document trouvé
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        }
      </div>

      {/* Upload Modal */}
      {showUploadModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`max-w-md w-full rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-6">
              <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                Ajouter un document
              </h3>
              <button
              onClick={() => setShowUploadModal(false)}
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
                
                  Type de document
                </label>
                <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as any)}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent'}`}>
                
                  <option value="prescription">Ordonnance</option>
                  <option value="results">Résultats</option>
                  <option value="report">Compte-rendu</option>
                </select>
              </div>

              <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDark ? 'border-slate-600 hover:border-green-500 bg-slate-700/50' : 'border-gray-300 hover:border-green-400 bg-gray-50'}`}>
              
                <Upload
                className={`h-12 w-12 mx-auto mb-3 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
              
                <p
                className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                
                  Glissez-déposez votre fichier ou
                </p>
                <Button variant="outline" size="sm">
                  Parcourir
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                onClick={() => setShowUploadModal(false)}
                variant="outline"
                className={`flex-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}>
                
                  Annuler
                </Button>
                <Button
                onClick={handleUploadDocument}
                variant="primary"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0">
                
                  <Check className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* View Modal */}
      {showViewModal && selectedDocument &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
          className={`max-w-2xl w-full rounded-2xl p-6 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          
            <div className="flex items-center justify-between mb-6">
              <h3
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              
                {selectedDocument.name}
              </h3>
              <button
              onClick={() => setShowViewModal(false)}
              className={
              isDark ?
              'text-slate-400 hover:text-white' :
              'text-gray-500 hover:text-gray-900'
              }>
              
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
            className={`rounded-xl p-8 mb-6 text-center ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
            
              <selectedDocument.icon
              className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            
              <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
                Aperçu du document
              </p>
            </div>

            <div className="flex gap-3">
              <Button
              onClick={() => handleDownloadDocument(selectedDocument)}
              variant="primary"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0">
              
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
              onClick={() => setShowViewModal(false)}
              variant="outline"
              className={
              isDark ?
              'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' :
              ''
              }>
              
                Fermer
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}