import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import {
  FileText,
  Download,
  DollarSign,
  Activity,
  TrendingUp,
  MapPin,
  Users,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock } from
'lucide-react';
import {
  mockMonthlyRevenue,
  mockServiceUtilization,
  mockInvestorKPIs } from
'../../data/mock/adminMockData';
import { exportToExcel } from '../../utils/exportExcel';
// Existing mock data
const growthData = [
{
  month: 'Jan',
  patients: 400,
  providers: 40
},
{
  month: 'Fév',
  patients: 600,
  providers: 55
},
{
  month: 'Mar',
  patients: 900,
  providers: 80
},
{
  month: 'Avr',
  patients: 1200,
  providers: 110
},
{
  month: 'Mai',
  patients: 1600,
  providers: 145
},
{
  month: 'Juin',
  patients: 2100,
  providers: 190
}];

const regionData = [
{
  region: 'Tunis',
  revenue: 45000
},
{
  region: 'Sfax',
  revenue: 28000
},
{
  region: 'Sousse',
  revenue: 22000
},
{
  region: 'Nabeul',
  revenue: 15000
},
{
  region: 'Bizerte',
  revenue: 12000
}];

const retentionData = [
{
  month: 'Jan',
  rate: 85
},
{
  month: 'Fév',
  rate: 86
},
{
  month: 'Mar',
  rate: 84
},
{
  month: 'Avr',
  rate: 88
},
{
  month: 'Mai',
  rate: 89
},
{
  month: 'Juin',
  rate: 91
}];

const providerPerformance = Array.from({
  length: 30
}).map(() => ({
  bookings: Math.floor(Math.random() * 200) + 20,
  rating: Math.random() * 1.5 + 3.5,
  revenue: Math.floor(Math.random() * 10000) + 1000
}));
type ReportType =
'financier' |
'operationnel' |
'croissance' |
'regionale' |
'performance' |
'investisseurs';
interface ReportConfig {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  data: any[];
  columns: {
    header: string;
    key: string;
  }[];
}
const reports: ReportConfig[] = [
{
  id: 'financier',
  title: 'Rapport Financier',
  description: 'Revenus, commissions, abonnements et tendances mensuelles.',
  icon: DollarSign,
  color:
  'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
  data: mockMonthlyRevenue,
  columns: [
  {
    header: 'Mois',
    key: 'month'
  },
  {
    header: 'Revenu Total (TND)',
    key: 'revenue'
  },
  {
    header: 'Commissions (TND)',
    key: 'commissions'
  },
  {
    header: 'Abonnements (TND)',
    key: 'subscriptions'
  },
  {
    header: 'Marge Nette (TND)',
    key: 'netProfit'
  }]

},
{
  id: 'operationnel',
  title: 'Rapport Opérationnel',
  description:
  'Volume de réservations, annulations et utilisation par service.',
  icon: Activity,
  color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  data: mockServiceUtilization,
  columns: [
  {
    header: 'Service',
    key: 'service'
  },
  {
    header: 'Réservations',
    key: 'bookings'
  },
  {
    header: 'Revenu (TND)',
    key: 'revenue'
  },
  {
    header: 'Note Moyenne',
    key: 'avgRating'
  },
  {
    header: 'Taux Annulation (%)',
    key: 'cancellationRate'
  }]

},
{
  id: 'croissance',
  title: 'Croissance Utilisateurs',
  description: 'Acquisition patients/professionnels et taux de rétention.',
  icon: TrendingUp,
  color:
  'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
  data: growthData,
  columns: [
  {
    header: 'Mois',
    key: 'month'
  },
  {
    header: 'Patients Actifs',
    key: 'patients'
  },
  {
    header: 'Professionnels',
    key: 'providers'
  }]

},
{
  id: 'regionale',
  title: 'Analyse Régionale',
  description: 'Pénétration du marché et revenus par région tunisienne.',
  icon: MapPin,
  color:
  'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
  data: regionData,
  columns: [
  {
    header: 'Région',
    key: 'region'
  },
  {
    header: 'Revenu (TND)',
    key: 'revenue'
  }]

},
{
  id: 'performance',
  title: 'Performance Professionnels',
  description: 'Évaluation, complétion et revenus des prestataires.',
  icon: Users,
  color:
  'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
  data: providerPerformance.slice(0, 10),
  columns: [
  {
    header: 'Réservations',
    key: 'bookings'
  },
  {
    header: 'Note (/5)',
    key: 'rating'
  },
  {
    header: 'Revenu (TND)',
    key: 'revenue'
  }]

},
{
  id: 'investisseurs',
  title: 'Rapport Investisseurs',
  description: 'Résumé exécutif, KPIs clés, GMV, CAC et LTV.',
  icon: Briefcase,
  color: 'text-slate-800 bg-slate-200 dark:bg-slate-700 dark:text-slate-300',
  data: mockInvestorKPIs,
  columns: [
  {
    header: 'Métrique',
    key: 'metric'
  },
  {
    header: 'Valeur',
    key: 'value'
  },
  {
    header: 'Évolution',
    key: 'change'
  },
  {
    header: 'Tendance',
    key: 'trend'
  }]

}];

type LegacyWorksheet = {
  rows: Record<string, any>[];
  footerRows: Array<Array<string | number>>;
};

type LegacyWorkbook = {
  sheetName: string;
  worksheet: LegacyWorksheet | null;
};

const XLSX = {
  utils: {
    json_to_sheet: (rows: Record<string, any>[]): LegacyWorksheet => ({
      rows,
      footerRows: []
    }),
    book_new: (): LegacyWorkbook => ({
      sheetName: 'Sheet1',
      worksheet: null
    }),
    book_append_sheet: (
      workbook: LegacyWorkbook,
      worksheet: LegacyWorksheet,
      sheetName: string
    ) => {
      workbook.sheetName = sheetName;
      workbook.worksheet = worksheet;
    },
    sheet_add_aoa: (
      worksheet: LegacyWorksheet,
      rows: Array<Array<string | number>>
    ) => {
      worksheet.footerRows.push(...rows);
    }
  },
  writeFile: (workbook: LegacyWorkbook, fileName: string) => {
    const worksheet = workbook.worksheet;
    if (!worksheet) {
      return;
    }

    const columns = Object.keys(worksheet.rows[0] ?? {}).map((key) => ({
      header: key,
      key
    }));

    void exportToExcel(
      worksheet.rows,
      columns,
      fileName.replace(/\.xlsx$/i, ''),
      workbook.sheetName,
      worksheet.footerRows
    );
  }
};

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [dateRange, setDateRange] = useState('6 Derniers Mois');
  const handleExportPDF = async (report: ReportConfig, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    // Header
    doc.setFontSize(20);
    doc.setTextColor(13, 148, 136); // Teal 600
    doc.text('CareAtHome', 14, 22);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(report.title, 14, 32);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(
      `Période: ${dateRange} | Généré le: ${new Date().toLocaleDateString('fr-FR')}`,
      14,
      40
    );
    // Table
    const tableColumn = report.columns.map((col) => col.header);
    const tableRows = report.data.map((row) =>
    report.columns.map((col) => {
      const val = row[col.key];
      return typeof val === 'number' &&
      col.key !== 'rating' &&
      col.key !== 'cancellationRate' ?
      val.toLocaleString() :
      typeof val === 'number' ?
      val.toFixed(1) :
      val;
    })
    );
    // Draw table manually
    const startY = 45;
    const cellPadding = 4;
    const fontSize = 9;
    const headerFontSize = 9;
    const colWidth = (doc.internal.pageSize.width - 28) / tableColumn.length;
    const rowHeight = fontSize + cellPadding * 2;
    // Header row
    doc.setFillColor(13, 148, 136);
    doc.rect(14, startY, doc.internal.pageSize.width - 28, rowHeight, 'F');
    doc.setFontSize(headerFontSize);
    doc.setTextColor(255, 255, 255);
    tableColumn.forEach((col, i) => {
      doc.text(
        String(col),
        14 + i * colWidth + cellPadding,
        startY + cellPadding + fontSize - 1
      );
    });
    // Data rows
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(fontSize);
    tableRows.forEach((row, rowIdx) => {
      const y = startY + rowHeight * (rowIdx + 1);
      if (y + rowHeight > doc.internal.pageSize.height - 20) return; // skip if overflow
      if (rowIdx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, doc.internal.pageSize.width - 28, rowHeight, 'F');
      }
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, doc.internal.pageSize.width - 28, rowHeight, 'S');
      row.forEach((cell, i) => {
        doc.text(
          String(cell ?? ''),
          14 + i * colWidth + cellPadding,
          y + cellPadding + fontSize - 1
        );
      });
    });
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Confidentiel - Réservé aux investisseurs et à la direction de CareAtHome',
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }
    doc.save(
      `CareAtHome_${report.id}_${new Date().toISOString().split('T')[0]}.pdf`
    );
  };
  const handleExportExcel = async (report: ReportConfig, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Format data for Excel
    const excelData = report.data.map((row) => {
      const formattedRow: any = {};
      report.columns.forEach((col) => {
        formattedRow[col.header] = row[col.key];
      });
      return formattedRow;
    });
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
    // Add summary row if applicable
    if (report.id === 'financier') {
      const totalRevenue = report.data.reduce(
        (sum, row) => sum + row.revenue,
        0
      );
      XLSX.utils.sheet_add_aoa(worksheet, [['Total', totalRevenue]], {
        origin: -1
      });
    }
    XLSX.writeFile(
      workbook,
      `CareAtHome_${report.id}_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  };
  const renderPreviewCharts = (reportId: ReportType) => {
    switch (reportId) {
      case 'financier':
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockMonthlyRevenue}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}>
                
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dx={-10}
                  tickFormatter={(v) => `${v / 1000}k`} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenu Total"
                  stroke="#0d9488"
                  fillOpacity={1}
                  fill="url(#colorRevenue)" />
                
                <Area
                  type="monotone"
                  dataKey="netProfit"
                  name="Marge Nette"
                  stroke="#3b82f6"
                  fillOpacity={0.3}
                  fill="#3b82f6" />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>);

      case 'operationnel':
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockServiceUtilization}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  dataKey="service"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10
                  }}
                  dy={10} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dx={-10} />
                
                <Tooltip
                  cursor={{
                    fill: '#f1f5f9'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none'
                  }} />
                
                <Bar
                  dataKey="bookings"
                  name="Réservations"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>);

      case 'croissance':
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={growthData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dy={10} />
                
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dx={-10} />
                
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dx={10} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none'
                  }} />
                
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="patients"
                  name="Patients"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={false} />
                
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="providers"
                  name="Professionnels"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>);

      case 'regionale':
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 10,
                  left: 20,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }} />
                
                <YAxis
                  dataKey="region"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#f1f5f9'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none'
                  }} />
                
                <Bar
                  dataKey="revenue"
                  name="Revenu (TND)"
                  fill="#f59e0b"
                  radius={[0, 4, 4, 0]}
                  barSize={24} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>);

      case 'performance':
        return (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.2} />
                
                <XAxis
                  type="number"
                  dataKey="bookings"
                  name="Réservations"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dy={10} />
                
                <YAxis
                  type="number"
                  dataKey="rating"
                  name="Note"
                  domain={[3, 5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12
                  }}
                  dx={-10} />
                
                <Tooltip
                  cursor={{
                    strokeDasharray: '3 3'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none'
                  }} />
                
                <Scatter
                  name="Professionnels"
                  data={providerPerformance}
                  fill="#8b5cf6" />
                
              </ScatterChart>
            </ResponsiveContainer>
          </div>);

      case 'investisseurs':
        return (
          <div className="h-72 w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 w-full">
              {mockInvestorKPIs.map((kpi, i) =>
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                
                  <p className="text-xs text-slate-500 mb-1">{kpi.metric}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {kpi.value}
                  </p>
                  <p
                  className={`text-xs mt-1 font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  
                    {kpi.change} vs mois préc.
                  </p>
                </div>
              )}
            </div>
          </div>);

      default:
        return null;
    }
  };
  const activeReportConfig = reports.find((r) => r.id === selectedReport);
  return (
    <div className="space-y-6">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Centre de Rapports BI
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Génération de rapports pour investisseurs et parties prenantes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
            
            <option>Dernier Mois</option>
            <option>Dernier Trimestre</option>
            <option>6 Derniers Mois</option>
            <option>Année en Cours</option>
            <option>Personnalisé</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-medium text-slate-500">
              Rapports Générés
            </h3>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            1,284
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-medium text-slate-500">
              Dernier Export
            </h3>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            Il y a 2h
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-medium text-slate-500">
              Rapports Planifiés
            </h3>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-medium text-slate-500">
              Exports ce Mois
            </h3>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">45</p>
        </div>
      </div>

      {/* Report Catalog */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Catalogue des Rapports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const isSelected = selectedReport === report.id;
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`bg-white dark:bg-slate-800 rounded-lg border transition-all cursor-pointer overflow-hidden ${isSelected ? 'border-teal-500 dark:border-teal-400 ring-1 ring-teal-500 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md'}`}>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${report.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected &&
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    }
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <button
                      onClick={(e) => handleExportPDF(report, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded text-xs font-medium transition-colors">
                      
                      <FileText className="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button
                      onClick={(e) => handleExportExcel(report, e)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 rounded text-xs font-medium transition-colors">
                      
                      <Download className="w-3.5 h-3.5" />
                      Excel
                    </button>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>

      {/* Preview Panel */}
      {activeReportConfig &&
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <activeReportConfig.icon className="w-5 h-5 text-teal-600" />
                Aperçu: {activeReportConfig.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Période: {dateRange} • Généré le{' '}
                {new Date().toLocaleDateString('fr-FR')} à{' '}
                {new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
              onClick={() => handleExportPDF(activeReportConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-sm font-medium transition-colors">
              
                <FileText className="w-4 h-4 text-red-500" />
                Exporter PDF
              </button>
              <button
              onClick={() => handleExportExcel(activeReportConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white hover:bg-teal-700 rounded text-sm font-medium transition-colors">
              
                <Download className="w-4 h-4" />
                Exporter Excel
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Chart Preview */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Visualisation des Données
              </h3>
              {renderPreviewCharts(activeReportConfig.id)}
            </div>

            {/* Table Preview */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Extrait des Données
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {activeReportConfig.columns.map((col, i) =>
                    <th
                      key={i}
                      className="px-4 py-2.5 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      
                          {col.header}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {activeReportConfig.data.slice(0, 5).map((row, i) =>
                  <tr
                    key={i}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    
                        {activeReportConfig.columns.map((col, j) => {
                      const val = row[col.key];
                      const displayVal =
                      typeof val === 'number' &&
                      col.key !== 'rating' &&
                      col.key !== 'cancellationRate' ?
                      val.toLocaleString() :
                      typeof val === 'number' ?
                      val.toFixed(1) :
                      val;
                      return (
                        <td
                          key={j}
                          className="px-4 py-2 text-slate-700 dark:text-slate-300">
                          
                              {displayVal}
                            </td>);

                    })}
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-center text-slate-500 mt-3">
                Affichage des 5 premières lignes. Exportez le rapport pour voir
                l'intégralité des données.
              </p>
            </div>
          </div>
        </div>
      }
    </div>);

}
