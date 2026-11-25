type JsPDFModule = typeof import('jspdf');
type JsPDFDocument = InstanceType<JsPDFModule['jsPDF']>;

let jsPdfModulePromise: Promise<JsPDFModule> | null = null;

export interface BillingInvoice {
  id: string;
  patientName: string;
  service: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentReferenceNumber?: string;
  notes?: string;
  patientPhone?: string;
  patientAddress?: string;
}

export interface BillingSummarySnapshot {
  revenue: number;
  expenses: number;
  net: number;
  currency: string;
  invoiceCount: number;
  pendingCount: number;
  pendingAmount: number;
}

export interface BillingProviderIdentity {
  displayName: string;
  businessName?: string;
  email?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  licenseNumber?: string;
}

export interface BillingReportPeriod {
  label: string;
  fileLabel: string;
}

export interface BillingBreakdownLine {
  label: string;
  amount: number;
}

export interface BillingDocumentContext {
  provider: BillingProviderIdentity;
  period: BillingReportPeriod;
  notes?: string[];
}

export interface BillingBalanceSheetData {
  revenueLines?: BillingBreakdownLine[];
  expenseLines?: BillingBreakdownLine[];
}

export function preloadBillingPdfModule(): Promise<JsPDFModule> {
  jsPdfModulePromise ??= (import('jspdf') as Promise<JsPDFModule>).catch((error: unknown) => {
    jsPdfModulePromise = null;
    throw error;
  });

  return jsPdfModulePromise;
}

async function createPdfDocument(buildDocument: (doc: JsPDFDocument) => void): Promise<void> {
  const { jsPDF } = await preloadBillingPdfModule();
  const doc = new jsPDF();
  buildDocument(doc);
}

function formatAmount(value: number, currency: string): string {
  return `${value.toFixed(3)} ${currency}`;
}

function safeFileToken(value: string): string {
  const normalized = value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '_');

  return normalized.length > 0 ? normalized : 'document';
}

function humanizeToken(value: string): string {
  const normalized = value.replace(/[_-]+/g, ' ').trim();

  if (!normalized.length) {
    return 'Inconnu';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function ensurePage(doc: JsPDFDocument, y: number, blockHeight: number = 12): number {
  if (y + blockHeight <= 272) {
    return y;
  }

  doc.addPage();
  return 20;
}

function buildProviderLines(provider: BillingProviderIdentity): string[] {
  const address = [provider.addressLine, provider.city, provider.postalCode]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(', ');

  return [
    provider.businessName?.trim() && provider.businessName !== provider.displayName
      ? provider.businessName.trim()
      : null,
    provider.displayName.trim(),
    provider.licenseNumber?.trim() ? `Licence: ${provider.licenseNumber.trim()}` : null,
    address || null,
    provider.phone?.trim() ? `Tel: ${provider.phone.trim()}` : null,
    provider.email?.trim() ? `Email: ${provider.email.trim()}` : null,
  ].filter((value): value is string => Boolean(value?.trim()));
}

function buildPatientLines(invoice: BillingInvoice): string[] {
  return [
    invoice.patientName.trim(),
    invoice.patientPhone?.trim() ? `Tel: ${invoice.patientPhone.trim()}` : null,
    invoice.patientAddress?.trim() || null,
  ].filter((value): value is string => Boolean(value?.trim()));
}

function drawNotes(doc: JsPDFDocument, title: string, notes: string[], y: number): number {
  if (!notes.length) {
    return y;
  }

  let nextY = ensurePage(doc, y, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, nextY);
  nextY += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  notes.forEach((note) => {
    nextY = ensurePage(doc, nextY, 10);
    const lines = doc.splitTextToSize(`- ${note}`, 170);
    doc.text(lines, 20, nextY);
    nextY += lines.length * 5;
  });

  return nextY + 2;
}

function drawProviderAndPatientBlocks(
  doc: JsPDFDocument,
  providerLines: string[],
  patientLines: string[],
  y: number,
): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Prestataire', 20, y);
  doc.text('Client', 120, y);

  doc.setFont('helvetica', 'normal');
  doc.text(providerLines.length > 0 ? providerLines : ['Information indisponible'], 20, y + 7);
  doc.text(patientLines.length > 0 ? patientLines : ['Information indisponible'], 120, y + 7);

  return y + 12 + Math.max(providerLines.length, patientLines.length) * 5;
}

function drawSummaryRows(
  doc: JsPDFDocument,
  rows: Array<{ label: string; value: string }>,
  y: number,
): number {
  let nextY = y;

  doc.setFontSize(10);
  rows.forEach((row) => {
    nextY = ensurePage(doc, nextY, 8);
    doc.setFont('helvetica', 'normal');
    doc.text(row.label, 20, nextY);
    doc.text(row.value, 170, nextY, { align: 'right' });
    nextY += 8;
  });

  return nextY;
}

function drawBreakdownTable(
  doc: JsPDFDocument,
  title: string,
  lines: BillingBreakdownLine[],
  emptyLabel: string,
  currency: string,
  y: number,
): number {
  let nextY = ensurePage(doc, y, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, nextY);
  nextY += 7;
  doc.line(20, nextY, 190, nextY);
  nextY += 8;

  if (!lines.length) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(emptyLabel, 20, nextY);
    return nextY + 10;
  }

  lines.forEach((line) => {
    nextY = ensurePage(doc, nextY, 8);
    const labelLines = doc.splitTextToSize(line.label, 110);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(labelLines, 20, nextY);
    doc.text(formatAmount(line.amount, currency), 170, nextY, { align: 'right' });
    nextY += Math.max(labelLines.length * 5, 8);
  });

  return nextY + 2;
}

function drawDocumentFooter(doc: JsPDFDocument, text: string) {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(text, 105, 284, { align: 'center' });
}

export async function saveInvoicePdf(
  invoice: BillingInvoice,
  context: BillingDocumentContext,
): Promise<void> {
  await createPdfDocument((doc) => {
    const providerLines = buildProviderLines(context.provider);
    const patientLines = buildPatientLines(invoice);
    const notes = [invoice.notes, ...(context.notes ?? [])].filter((note): note is string =>
      Boolean(note?.trim()),
    );

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reference: ${invoice.id}`, 20, 34);
    doc.text(`Date: ${invoice.date}`, 20, 40);
    doc.text(`Statut: ${humanizeToken(invoice.status)}`, 20, 46);

    let y = drawProviderAndPatientBlocks(doc, providerLines, patientLines, 60);
    y = ensurePage(doc, y, 24);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Service', 20, y);
    doc.text('Paiement', 118, y);
    doc.text('Montant', 170, y, { align: 'right' });
    y += 4;
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    const serviceLines = doc.splitTextToSize(invoice.service, 88);
    doc.text(serviceLines, 20, y);
    doc.text(invoice.paymentMethod || '--', 118, y);
    doc.text(formatAmount(invoice.amount, invoice.currency), 170, y, { align: 'right' });
    y += Math.max(serviceLines.length * 5, 8);

    if (invoice.paymentReferenceNumber) {
      y = ensurePage(doc, y, 8);
      doc.setFontSize(9);
      doc.text(`Reference paiement: ${invoice.paymentReferenceNumber}`, 20, y);
      doc.setFontSize(10);
      y += 8;
    }

    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Total facture', 20, y);
    doc.text(formatAmount(invoice.amount, invoice.currency), 170, y, { align: 'right' });
    y += 12;

    drawNotes(doc, 'Notes', notes, y);
    drawDocumentFooter(
      doc,
      'Document genere depuis les donnees de reservation et de paiement actuellement disponibles.',
    );
    doc.save(`Facture_${safeFileToken(invoice.id)}.pdf`);
  });
}

export async function saveTvaDeclarationPdf(
  summary: BillingSummarySnapshot,
  context: BillingDocumentContext,
): Promise<void> {
  await createPdfDocument((doc) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SYNTHESE TVA', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Periode: ${context.period.label}`, 105, 30, { align: 'center' });

    let y = drawProviderAndPatientBlocks(doc, buildProviderLines(context.provider), [], 46);
    y += 4;
    doc.line(20, y, 190, y);
    y += 10;

    y = drawSummaryRows(
      doc,
      [
        {
          label: 'Chiffre d affaires observe',
          value: formatAmount(summary.revenue, summary.currency),
        },
        {
          label: 'Depenses canoniques disponibles',
          value: formatAmount(summary.expenses, summary.currency),
        },
        {
          label: 'Resultat net observe',
          value: formatAmount(summary.net, summary.currency),
        },
        {
          label: 'Factures retenues',
          value: String(summary.invoiceCount),
        },
        {
          label: 'Montant encore en attente',
          value: formatAmount(summary.pendingAmount, summary.currency),
        },
      ],
      y,
    );

    drawNotes(doc, 'A verifier avant depot', context.notes ?? [], y + 4);
    drawDocumentFooter(
      doc,
      'Synthese generee a partir des donnees financieres canoniques actuellement exposes par la plateforme.',
    );
    doc.save(`Synthese_TVA_${safeFileToken(context.period.fileLabel)}.pdf`);
  });
}

export async function saveBalanceSheetPdf(
  summary: BillingSummarySnapshot,
  context: BillingDocumentContext,
  balanceSheetData?: BillingBalanceSheetData,
): Promise<void> {
  await createPdfDocument((doc) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BILAN COMPTABLE', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Periode: ${context.period.label}`, 105, 30, { align: 'center' });

    let y = drawProviderAndPatientBlocks(doc, buildProviderLines(context.provider), [], 46);
    y += 4;

    y = drawBreakdownTable(
      doc,
      'Recettes',
      balanceSheetData?.revenueLines ?? [],
      'Aucune ligne de recette canonique sur la periode selectionnee.',
      summary.currency,
      y,
    );

    y = drawBreakdownTable(
      doc,
      'Depenses',
      balanceSheetData?.expenseLines ?? [],
      'Aucune depense metier canonique disponible sur la periode selectionnee.',
      summary.currency,
      y,
    );

    y = ensurePage(doc, y, 24);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Total recettes', 20, y);
    doc.text(formatAmount(summary.revenue, summary.currency), 170, y, { align: 'right' });
    y += 8;
    doc.text('Total depenses', 20, y);
    doc.text(formatAmount(summary.expenses, summary.currency), 170, y, { align: 'right' });
    y += 8;
    doc.text('Resultat net', 20, y);
    doc.text(formatAmount(summary.net, summary.currency), 170, y, { align: 'right' });

    drawNotes(doc, 'Notes', context.notes ?? [], y + 10);
    drawDocumentFooter(
      doc,
      'Bilan genere uniquement depuis les montants exposes par les sources frontales canoniques.',
    );
    doc.save(`Bilan_Comptable_${safeFileToken(context.period.fileLabel)}.pdf`);
  });
}

export async function saveCnssDeclarationPdf(
  summary: BillingSummarySnapshot,
  context: BillingDocumentContext,
): Promise<void> {
  await createPdfDocument((doc) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SYNTHESE CNSS', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Periode: ${context.period.label}`, 105, 30, { align: 'center' });

    let y = drawProviderAndPatientBlocks(doc, buildProviderLines(context.provider), [], 46);
    y += 4;
    doc.line(20, y, 190, y);
    y += 10;

    y = drawSummaryRows(
      doc,
      [
        {
          label: 'Base de revenus observee',
          value: formatAmount(summary.revenue, summary.currency),
        },
        {
          label: 'Factures retenues',
          value: String(summary.invoiceCount),
        },
        {
          label: 'Factures encore en attente',
          value: String(summary.pendingCount),
        },
        {
          label: 'Montant en attente',
          value: formatAmount(summary.pendingAmount, summary.currency),
        },
      ],
      y,
    );

    drawNotes(doc, 'A verifier avant depot', context.notes ?? [], y + 4);
    drawDocumentFooter(
      doc,
      'Synthese CNSS generee sans identifiant d affiliation ni calcul de cotisation non expose par l API.',
    );
    doc.save(`Synthese_CNSS_${safeFileToken(context.period.fileLabel)}.pdf`);
  });
}

function drawRevenueLedgerHeader(doc: JsPDFDocument, y: number) {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', 20, y);
  doc.text('Reference', 48, y);
  doc.text('Client', 86, y);
  doc.text('Statut', 138, y);
  doc.text('Montant', 170, y, { align: 'right' });
  doc.line(20, y + 3, 190, y + 3);
}

export async function saveRevenueLedgerPdf(
  invoices: BillingInvoice[],
  summary: BillingSummarySnapshot,
  context: BillingDocumentContext,
): Promise<void> {
  await createPdfDocument((doc) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LIVRE DE RECETTES', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Periode: ${context.period.label}`, 105, 30, { align: 'center' });

    let y = drawProviderAndPatientBlocks(doc, buildProviderLines(context.provider), [], 46);
    y += 4;
    drawRevenueLedgerHeader(doc, y);
    y += 12;

    if (!invoices.length) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Aucune facture canonique n est disponible sur la periode selectionnee.', 20, y);
      y += 12;
    } else {
      invoices.forEach((invoice) => {
        y = ensurePage(doc, y, 10);
        if (y === 20) {
          drawRevenueLedgerHeader(doc, y);
          y += 12;
        }

        const reference = invoice.paymentReferenceNumber?.trim() || invoice.id;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.date, 20, y);
        doc.text(reference, 48, y);
        doc.text(doc.splitTextToSize(invoice.patientName, 46), 86, y);
        doc.text(humanizeToken(invoice.status), 138, y);
        doc.text(formatAmount(invoice.amount, invoice.currency), 170, y, { align: 'right' });
        y += 8;
      });
    }

    y = ensurePage(doc, y, 18);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total observe', 120, y);
    doc.text(formatAmount(summary.revenue, summary.currency), 170, y, { align: 'right' });

    drawNotes(doc, 'Notes', context.notes ?? [], y + 10);
    drawDocumentFooter(
      doc,
      'Livre de recettes genere a partir des factures derivees des reservations et paiements exposes par la plateforme.',
    );
    doc.save(`Livre_Recettes_${safeFileToken(context.period.fileLabel)}.pdf`);
  });
}
