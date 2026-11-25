import {
  Calendar,
  Check,
  Download,
  Eye,
  FileText,
  Search,
  Stethoscope,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';

import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Field, FieldLabel } from '@/shared/ui/primitives/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

import {
  getDocumentTypeColor,
  getDocumentTypeGradient,
  getDocumentTypeLabel,
  manageDocumentStatCards,
} from './manageDocuments.data';
import type {
  PatientDocument,
  PatientDocumentTab,
  PatientDocumentType,
} from './manageDocuments.types';

function ManageDocumentsModalCloseButton({ label }: { label: string }) {
  return (
    <DialogClose asChild>
      <button
        type="button"
        aria-label={label}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </button>
    </DialogClose>
  );
}

export function ManageDocumentsStats({ documents }: { documents: PatientDocument[] }) {
  const stats = {
    prescription: documents.filter((document) => document.type === 'prescription').length,
    results: documents.filter((document) => document.type === 'results').length,
    report: documents.filter((document) => document.type === 'report').length,
    total: documents.length,
  };

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      {manageDocumentStatCards.map((stat) => (
        <div
          key={stat.key}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-105 dark:border-slate-700/50 dark:bg-slate-800/50"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
            >
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-slate-400">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats[stat.key]}</p>
        </div>
      ))}
    </div>
  );
}

export function ManageDocumentsToolbar({
  activeTab,
  documents,
  filteredDocuments,
  onSearchChange,
  onTabChange,
  searchQuery,
}: {
  activeTab: PatientDocumentTab;
  documents: PatientDocument[];
  filteredDocuments: PatientDocument[];
  onSearchChange: (value: string) => void;
  onTabChange: (tab: PatientDocumentTab) => void;
  searchQuery: string;
}) {
  return (
    <>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher un document..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-green-500 dark:focus:ring-green-500/20"
          />
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'all' as PatientDocumentTab, label: `Tous (${documents.length})` },
            {
              id: 'prescriptions' as PatientDocumentTab,
              label: `Ordonnances (${documents.filter((document) => document.type === 'prescription').length})`,
            },
            {
              id: 'results' as PatientDocumentTab,
              label: `Résultats (${documents.filter((document) => document.type === 'results').length})`,
            },
            {
              id: 'reports' as PatientDocumentTab,
              label: `Comptes-rendus (${documents.filter((document) => document.type === 'report').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 px-6 py-4 font-semibold transition-all ${activeTab === tab.id ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-300'}`}
            >
              {tab.label}
              {activeTab === tab.id ? (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <EmptyState
          title="Aucun document trouvé"
          description="Essayez de modifier vos filtres de recherche."
          icon={<FileText className="h-5 w-5" />}
        />
      ) : null}
    </>
  );
}

export function ManageDocumentsGrid({
  documents,
  onDelete,
  onDownload,
  onView,
}: {
  documents: PatientDocument[];
  onDelete: (id: number) => void;
  onDownload: (document: PatientDocument) => void;
  onView: (document: PatientDocument) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {documents.map((document, index) => (
        <div
          key={document.id}
          className="animate-in slide-in-from-bottom-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-slate-300 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-slate-600"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="mb-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${getDocumentTypeGradient(document.type)} shadow-lg`}
            >
              <document.icon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 truncate font-bold text-gray-900 dark:text-white">
                {document.name}
              </h3>
              <span
                className={`inline-block rounded-full border px-2 py-1 text-xs font-bold ${getDocumentTypeColor(document.type)}`}
              >
                {getDocumentTypeLabel(document.type)}
              </span>
            </div>
          </div>

          <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span>{document.doctor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span>{document.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span>{document.date}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-slate-700">
            <span className="text-xs text-gray-500 dark:text-slate-500">{document.size}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(document)}
                className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                title="Voir"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDownload(document)}
                className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                title="Télécharger"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(document.id)}
                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-500/20"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ManageDocumentsUploadModal({
  onClose,
  onSubmit,
  onTypeChange,
  open,
  uploadType,
}: {
  onClose: () => void;
  onSubmit: () => void;
  onTypeChange: (type: PatientDocumentType) => void;
  open: boolean;
  uploadType: PatientDocumentType;
}) {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="sm">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Ajouter un document
          </DialogTitle>
          <ManageDocumentsModalCloseButton label="Fermer l'ajout de document" />
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel
              htmlFor="document-upload-type"
              className="font-semibold text-gray-900 dark:text-white"
            >
              Type de document
            </FieldLabel>
            <Select
              value={uploadType}
              onValueChange={(value) => onTypeChange(value as PatientDocumentType)}
            >
              <SelectTrigger
                id="document-upload-type"
                className="h-11 w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 focus-visible:border-green-500 focus-visible:ring-green-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="prescription">Ordonnance</SelectItem>
                  <SelectItem value="results">Résultats</SelectItem>
                  <SelectItem value="report">Compte-rendu</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-green-400 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-green-500">
            <Upload className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-slate-400" />
            <p className="mb-2 text-sm text-gray-700 dark:text-slate-300">
              Glissez-déposez votre fichier ou
            </p>
            <Button variant="outline" size="sm">
              Parcourir
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              Annuler
            </Button>
            <Button
              onClick={onSubmit}
              className="flex-1 border-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ManageDocumentsViewModal({
  document,
  onClose,
  onDownload,
  open,
}: {
  document: PatientDocument | null;
  onClose: () => void;
  onDownload: (document: PatientDocument) => void;
  open: boolean;
}) {
  if (!open || !document) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={false} size="lg">
        <DialogHeader className="flex-row items-center justify-between gap-4">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {document.name}
          </DialogTitle>
          <ManageDocumentsModalCloseButton label="Fermer l'aperçu du document" />
        </DialogHeader>

        <div className="mb-6 rounded-xl bg-gray-50 p-8 text-center dark:bg-slate-700/50">
          <document.icon className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-slate-400" />
          <p className="text-gray-600 dark:text-slate-400">Aperçu du document</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onDownload(document)}
            className="flex-1 border-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
