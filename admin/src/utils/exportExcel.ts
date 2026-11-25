export interface ExportColumn {
  header: string;
  key: string;
  transform?: (value: any, row: any) => string | number;
}

async function loadExcelJs(): Promise<any> {
  return import('exceljs');
}

function triggerDownload(buffer: BlobPart, fileName: string): void {
  const blob = new Blob(
    [buffer],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  );
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
}

export async function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  fileName: string,
  sheetName: string = 'Sheet1',
  footerRows: Array<Array<string | number>> = []
): Promise<void> {
  const excelJsModule = await loadExcelJs();
  const ExcelJS = (excelJsModule as any).default ?? excelJsModule;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: Math.max(col.header.length + 2, 12)
  }));

  data.forEach((row) => {
    const preparedRow = columns.reduce<Record<string, string | number>>((accumulator, col) => {
      if (col.transform) {
        accumulator[col.key] = col.transform(row[col.key], row);
      } else {
        const value = row[col.key];
        accumulator[col.key] = value != null ? value : '';
      }
      return accumulator;
    }, {});

    worksheet.addRow(preparedRow);
  });

  footerRows.forEach((footerRow) => {
    worksheet.addRow(footerRow);
  });

  worksheet.getRow(1).font = { bold: true };

  worksheet.columns.forEach((column, index) => {
    const headerLength = columns[index]?.header.length ?? 10;
    let maxDataLength = headerLength;

    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const cellValue = cell.value == null ? '' : String(cell.value);
      maxDataLength = Math.max(maxDataLength, cellValue.length);
    });

    column.width = Math.min(Math.max(maxDataLength + 2, 12), 50);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  triggerDownload(buffer, `${fileName}.xlsx`);
}
