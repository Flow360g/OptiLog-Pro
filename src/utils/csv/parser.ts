import Papa from 'papaparse';
import { cleanData } from './dataCleanup';

export interface CSVData {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversion_rate: number;
  cost_per_result: number;
}

export async function parseCSVFile(file: File): Promise<CSVData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        // Normalize headers by removing quotes and whitespace
        return header.replace(/['"]+/g, '').trim().toLowerCase();
      },
      transform: (value: string) => {
        // Remove any malformed quotes from values
        return typeof value === 'string' ? value.replace(/['"]+/g, '').trim() : value;
      },
      complete: (results) => {
        try {
          // Check for required columns
          const requiredColumns = ['date', 'spend', 'impressions', 'clicks', 'conversions'];
          const headers = results.meta.fields || [];
          const missingColumns = requiredColumns.filter(col => 
            !headers.map(h => h.toLowerCase()).includes(col.toLowerCase())
          );

          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Please ensure your CSV contains these columns.`);
          }

          // Log parsing errors in a more user-friendly way
          if (results.errors && results.errors.length > 0) {
            const errorMessages = results.errors
              .map(error => `Row ${error.row + 1}: ${error.message}`)
              .slice(0, 3); // Show only first 3 errors to avoid overwhelming the user
            
            throw new Error(`CSV parsing errors:\n${errorMessages.join('\n')}${
              results.errors.length > 3 ? `\n...and ${results.errors.length - 3} more errors` : ''
            }`);
          }
          
          const cleanedData = cleanData(results.data as any[]);
          resolve(cleanedData);
        } catch (error) {
          reject(new Error(`Failed to process CSV: ${error.message}`));
        }
      },
      error: (error) => reject(new Error(`Failed to parse CSV: ${error.message}`)),
    });
  });
}