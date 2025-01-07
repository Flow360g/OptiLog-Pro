import { findMatchingColumn, extractDateRangeFromHeader } from "./columnMapping";

export function parseCSVData(csvData: string): { headers: string[]; rows: any[] } {
  const lines = csvData.split("\n").map(line => line.trim()).filter(line => line);
  const headers = lines[0].split(",").map(header => header.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(",").map(value => value.trim());
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] || null;
      return acc;
    }, {} as Record<string, any>);
  });
  return { headers, rows };
}

export function cleanData(rows: any[], targetColumns: string[]): any[] {
  return rows.map(row => {
    const cleanedRow: Record<string, any> = {};
    targetColumns.forEach(column => {
      const matchingColumn = findMatchingColumn(Object.keys(row), column);
      if (matchingColumn) {
        cleanedRow[column] = row[matchingColumn];
      }
    });
    return cleanedRow;
  });
}

export function analyzeMetrics(rows: any[], metrics: string[]): Record<string, any> {
  const analysis: Record<string, any> = {};
  metrics.forEach(metric => {
    analysis[metric] = rows.reduce((sum, row) => sum + (parseFloat(row[metric]) || 0), 0);
  });
  return analysis;
}

export function getDateRange(rows: any[]): { startDate: Date; endDate: Date } {
  const dates = rows.map(row => new Date(row.date));
  return {
    startDate: new Date(Math.min(...dates.map(date => date.getTime()))),
    endDate: new Date(Math.max(...dates.map(date => date.getTime())))
  };
}
