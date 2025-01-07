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
      complete: (results) => {
        try {
          if (results.errors && results.errors.length > 0) {
            throw new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`);
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