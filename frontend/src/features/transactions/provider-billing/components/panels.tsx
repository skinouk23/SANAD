import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  Eye,
  FileText,
  Search,
  TrendingUp,
} from 'lucide-react';

import { formatCurrency } from '@/shared/lib/i18n/formatting';
import { EmptyState } from '@/shared/ui/composites/empty-state';
import { Badge } from '@/shared/ui/primitives/badge';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { Separator } from '@/shared/ui/primitives/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/primitives/table';

import {
  getInvoiceStatusMeta,
  type Expense,
  type Invoice,
} from '@/features/transactions/provider-billing/providerBilling.hooks';

export function BillingInvoicesPanel({
  exportBusy,
  exportingInvoiceId,
  invoices,
  searchQuery,
  onSearchChange,
  onDownload,
  onExportPreload,
  onOpen,
}: {
  exportBusy: boolean;
  exportingInvoiceId: string | null;
  invoices: Invoice[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onDownload: (invoice: Invoice) => void;
  onExportPreload: () => void;
  onOpen: (invoice: Invoice) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher une facture, un patient ou une reference..."
            className="pl-9 text-sm sm:pl-10"
          />
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          className="bg-muted py-8"
          description={
            searchQuery.trim().length > 0
              ? 'Aucune facture ne correspond a la recherche en cours.'
              : 'La periode selectionnee ne contient pas encore de reservation terminee facturable.'
          }
          icon={<FileText className="h-10 w-10" />}
          title="Aucune facture canonique disponible"
        />
      ) : null}

      {invoices.length > 0 ? (
        <div className="space-y-3 lg:hidden">
          {invoices.map((invoice) => {
            const status = getInvoiceStatusMeta(invoice.status);

            return (
              <div key={invoice.id} className="rounded-lg border border-border bg-muted p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      {invoice.id}
                    </span>
                    <h3 className="mt-1 font-semibold text-foreground">{invoice.patientName}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{invoice.service}</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {invoice.paymentMethod}
                      {invoice.paymentReferenceNumber ? ` • ${invoice.paymentReferenceNumber}` : ''}
                    </p>
                  </div>
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground/70">{invoice.date}</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {formatCurrency(invoice.amount, invoice.currency, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      aria-label="Voir la facture"
                      onClick={() => onOpen(invoice)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      aria-label="Telecharger la facture"
                      aria-busy={exportingInvoiceId === invoice.id || undefined}
                      disabled={exportBusy}
                      onClick={() => onDownload(invoice)}
                      onFocus={onExportPreload}
                      onMouseEnter={onExportPreload}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {invoices.length > 0 ? (
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  'N° Facture',
                  'Patient',
                  'Service',
                  'Date',
                  'Paiement',
                  'Montant',
                  'Statut',
                  'Actions',
                ].map((label) => (
                  <TableHead
                    key={label}
                    className="px-4 py-3 text-sm font-semibold text-muted-foreground"
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const status = getInvoiceStatusMeta(invoice.status);

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="px-4 py-4 font-mono text-sm font-medium text-foreground">
                      {invoice.id}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-foreground">
                      {invoice.patientName}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {invoice.service}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {invoice.date}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      <div>{invoice.paymentMethod}</div>
                      {invoice.paymentReferenceNumber ? (
                        <div className="mt-1 font-mono text-xs text-muted-foreground/70">
                          {invoice.paymentReferenceNumber}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm font-bold text-foreground">
                      {formatCurrency(invoice.amount, invoice.currency, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          aria-label="Voir la facture"
                          onClick={() => onOpen(invoice)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          aria-label="Telecharger la facture"
                          aria-busy={exportingInvoiceId === invoice.id || undefined}
                          disabled={exportBusy}
                          onClick={() => onDownload(invoice)}
                          onFocus={onExportPreload}
                          onMouseEnter={onExportPreload}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}

export function BillingExpensesPanel({
  expenses,
  emptyMessage,
  onOpen,
}: {
  expenses: Expense[];
  emptyMessage: string;
  onOpen: (expense: Expense) => void;
}) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <EmptyState
          className="bg-muted py-8"
          description={emptyMessage}
          icon={<DollarSign className="h-10 w-10" />}
          title="Depenses indisponibles"
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-muted p-4 sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <h3 className="font-semibold text-foreground">{expense.category}</h3>
                  <span className="text-xs text-muted-foreground/70">{expense.id}</span>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{expense.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground/70">
                    <Calendar className="h-3 w-3" />
                    {expense.date}
                  </span>
                  {expense.receipt ? (
                    <span className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      Justificatif
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end sm:justify-start">
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(expense.amount, 'TND', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Voir la depense"
                  onClick={() => onOpen(expense)}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BillingReportsPanel({
  exportBusy,
  exportingDocumentKey,
  periodLabel,
  onBalance,
  onCnss,
  onExportPreload,
  onLedger,
  onTva,
}: {
  exportBusy: boolean;
  exportingDocumentKey: 'balance' | 'cnss' | 'invoice' | 'ledger' | 'tva' | null;
  periodLabel: string;
  onBalance: () => void;
  onCnss: () => void;
  onExportPreload: () => void;
  onLedger: () => void;
  onTva: () => void;
}) {
  const reports = [
    {
      title: 'Synthese TVA',
      subtitle: periodLabel,
      icon: FileText,
      key: 'tva' as const,
      tone: 'blue',
      onClick: onTva,
      cta: 'Télécharger PDF',
    },
    {
      title: 'Bilan comptable',
      subtitle: periodLabel,
      icon: TrendingUp,
      key: 'balance' as const,
      tone: 'green',
      onClick: onBalance,
      cta: 'Télécharger PDF',
    },
    {
      title: 'Synthese CNSS',
      subtitle: periodLabel,
      icon: FileText,
      key: 'cnss' as const,
      tone: 'purple',
      onClick: onCnss,
      cta: 'Télécharger PDF',
    },
    {
      title: 'Livre de recettes',
      subtitle: periodLabel,
      icon: DollarSign,
      key: 'ledger' as const,
      tone: 'amber',
      onClick: onLedger,
      cta: 'Télécharger PDF',
    },
  ];

  const iconClasses: Record<string, string> = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-success/10 text-success',
    purple: 'bg-primary/10 text-primary',
    amber: 'bg-warning/10 text-warning',
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      {reports.map((report) => (
        <div
          key={report.title}
          onClick={() => {
            if (!exportBusy) {
              report.onClick();
            }
          }}
          onFocus={onExportPreload}
          onMouseEnter={onExportPreload}
          className={`rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong sm:p-6 ${exportBusy ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          <div className="mb-4 flex items-center gap-3 sm:gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl ${iconClasses[report.tone]}`}
            >
              <report.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground">{report.title}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{report.subtitle}</p>
            </div>
          </div>
          <Button
            aria-busy={exportingDocumentKey === report.key || undefined}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={exportBusy}
          >
            <Download className="mr-2 h-4 w-4" />
            {exportingDocumentKey === report.key ? 'Export...' : report.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}

export function BillingTaxBanner() {
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:mt-8 sm:p-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary sm:h-12 sm:w-12 sm:rounded-xl">
          <FileText className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 text-sm font-bold text-foreground sm:text-base">
            📋 Conformité fiscale tunisienne
          </h3>
          <p className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
            Les exports utilisent les donnees financieres disponibles dans la plateforme. Les
            identifiants fiscaux ou CNSS absents doivent etre completes manuellement avant depot.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Donnees live', 'TVA', 'CNSS', 'Livre de recettes'].map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
