import { findMatchingColumn, extractDateRangeFromHeader } from "./columnMapping";

export function cleanData(headers: string[], data: any[]): any[] {
  return data.map(row => {
    const cleanedRow: Record<string, any> = {};
    
    for (const key of Object.keys(row)) {
      const matchingColumn = findMatchingColumn(headers, key);
      if (matchingColumn) {
        cleanedRow[matchingColumn] = row[key];
      }
    }
    
    return cleanedRow;
  });
}

export function parseDateRange(headers: string[]): { isPrevious: boolean }[] {
  return headers.map(header => {
    return extractDateRangeFromHeader(header);
  });
}
