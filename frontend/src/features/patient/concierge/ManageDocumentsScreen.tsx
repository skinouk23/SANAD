import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ConfirmDialog } from '@/shared/ui/composites/confirm-dialog';
import { Button } from '@/shared/ui/primitives/button';

import {
  ManageDocumentsGrid,
  ManageDocumentsStats,
  ManageDocumentsToolbar,
  ManageDocumentsUploadModal,
  ManageDocumentsViewModal,
} from './ManageDocumentsSections';
import { useManageDocumentsScreen } from './useManageDocumentsScreen';

export function ManageDocumentsScreen() {
  const navigate = useNavigate();
  const screen = useManageDocumentsScreen();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-96 w-96 rounded-full bg-green-300/20 blur-3xl dark:bg-green-500/20" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/health-concierge')}
              className="flex items-center font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au concierge
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  Gérer mes documents
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-400">
                Centralisez ordonnances et résultats médicaux
              </p>
            </div>

            <Button
              onClick={() => screen.setShowUploadModal(true)}
              size="lg"
              className="w-fit border-0 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30 hover:from-green-700 hover:to-emerald-700"
              aria-label="Ajouter un document"
            >
              <Upload className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ManageDocumentsStats documents={screen.documents} />

        <ManageDocumentsToolbar
          activeTab={screen.activeTab}
          documents={screen.documents}
          filteredDocuments={screen.filteredDocuments}
          onSearchChange={screen.setSearchQuery}
          onTabChange={screen.setActiveTab}
          searchQuery={screen.searchQuery}
        />

        {screen.filteredDocuments.length > 0 ? (
          <ManageDocumentsGrid
            documents={screen.filteredDocuments}
            onDelete={screen.handleDeleteDocument}
            onDownload={screen.handleDownloadDocument}
            onView={screen.handleViewDocument}
          />
        ) : null}
      </div>

      <ManageDocumentsUploadModal
        onClose={() => screen.setShowUploadModal(false)}
        onSubmit={screen.handleUploadDocument}
        onTypeChange={screen.setUploadType}
        open={screen.showUploadModal}
        uploadType={screen.uploadType}
      />

      <ManageDocumentsViewModal
        document={screen.selectedDocument}
        onClose={() => screen.setShowViewModal(false)}
        onDownload={screen.handleDownloadDocument}
        open={screen.showViewModal}
      />

      <ConfirmDialog
        open={screen.pendingDeleteDocument !== null}
        onOpenChange={(open) => {
          if (!open) {
            screen.clearPendingDeleteDocument();
          }
        }}
        title="Supprimer ce document ?"
        description={
          screen.pendingDeleteDocument
            ? `Le document "${screen.pendingDeleteDocument.name}" sera retiré de votre espace.`
            : undefined
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        destructive
        onConfirm={screen.handleConfirmDeleteDocument}
      />
    </div>
  );
}
