import { useState } from 'react';

import { formatDate } from '@/shared/lib/i18n/formatting';
import { showInfoToast, showSuccessToast } from '@/shared/lib/notifications/toast';

import { documentIconByType, initialDocuments } from './manageDocuments.data';
import type {
  PatientDocument,
  PatientDocumentTab,
  PatientDocumentType,
} from './manageDocuments.types';

export function useManageDocumentsScreen() {
  const [activeTab, setActiveTab] = useState<PatientDocumentTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PatientDocument | null>(null);
  const [uploadType, setUploadType] = useState<PatientDocumentType>('prescription');
  const [documents, setDocuments] = useState<PatientDocument[]>(initialDocuments);
  const [pendingDeleteDocumentId, setPendingDeleteDocumentId] = useState<number | null>(null);

  const pendingDeleteDocument =
    pendingDeleteDocumentId === null
      ? null
      : (documents.find((document) => document.id === pendingDeleteDocumentId) ?? null);

  const handleViewDocument = (document: PatientDocument) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleDownloadDocument = (document: PatientDocument) => {
    showInfoToast(`Téléchargement de ${document.name} en cours.`);
  };

  const handleDeleteDocument = (id: number) => {
    setPendingDeleteDocumentId(id);
  };

  const handleConfirmDeleteDocument = () => {
    if (pendingDeleteDocumentId === null) {
      return;
    }

    setDocuments((currentDocuments) =>
      currentDocuments.filter((document) => document.id !== pendingDeleteDocumentId),
    );
    setPendingDeleteDocumentId(null);
  };

  const clearPendingDeleteDocument = () => {
    setPendingDeleteDocumentId(null);
  };

  const handleUploadDocument = () => {
    const newDocument: PatientDocument = {
      id: Date.now(),
      name: `Nouveau document ${documents.length + 1}`,
      type: uploadType,
      date: formatDate(new Date()),
      doctor: 'Dr. Example',
      category: 'Catégorie',
      size: '500 KB',
      icon: documentIconByType[uploadType],
    };

    setDocuments((currentDocuments) => [newDocument, ...currentDocuments]);
    setShowUploadModal(false);
    showSuccessToast('Document ajouté avec succès.');
  };

  const filteredDocuments = documents.filter((document) => {
    const matchesTab = activeTab === 'all' || document.type === activeTab.replace('s', '');
    const matchesSearch =
      searchQuery === '' ||
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.doctor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return {
    activeTab,
    clearPendingDeleteDocument,
    handleConfirmDeleteDocument,
    documents,
    filteredDocuments,
    handleDeleteDocument,
    handleDownloadDocument,
    handleUploadDocument,
    handleViewDocument,
    pendingDeleteDocument,
    searchQuery,
    selectedDocument,
    setActiveTab,
    setSearchQuery,
    setSelectedDocument,
    setShowUploadModal,
    setShowViewModal,
    setUploadType,
    showUploadModal,
    showViewModal,
    uploadType,
  };
}
