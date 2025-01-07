import Papa from 'papaparse';
import { cleanData } from './dataCleanup';
import { findMatchingColumn } from './columnMapping';

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
      skipEmptyLines: 'greedy', // Skip empty lines and trim whitespace
      transformHeader: (header: string) => {
        // Normalize headers by removing quotes and whitespace
        return header.replace(/['"]+/g, '').trim();
      },
      transform: (value: string) => {
        // Remove any malformed quotes from values
        return typeof value === 'string' ? value.replace(/['"]+/g, '').trim() : value;
      },
      complete: (results) => {
        try {
          const headers = results.meta.fields || [];
          
          // Check for required columns using smart mapping
          const requiredColumns = ['date', 'spend', 'impressions', 'clicks', 'conversions'];
          const columnMap: { [key: string]: string } = {};
          const missingColumns: string[] = [];

          for (const required of requiredColumns) {
            const match = findMatchingColumn(headers, required);
            if (match) {
              columnMap[required] = match;
            } else {
              missingColumns.push(required);
            }
          }

          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Please ensure your CSV contains these or similar columns.`);
          }

          // Transform the data to use standardized column names
          const transformedData = results.data
            .filter((row: any) => Object.keys(row).length > 0) // Filter out empty rows
            .map((row: any) => {
              const newRow: any = {};
              for (const [standardName, originalName] of Object.entries(columnMap)) {
                newRow[standardName] = row[originalName];
              }
              return newRow;
            });

          // Only show critical parsing errors
          const criticalErrors = results.errors.filter(error => 
            error.type === 'Quotes' || error.type === 'Delimiter'
          );
          
          if (criticalErrors.length > 0) {
            const errorMessages = criticalErrors
              .map(error => `Row ${error.row + 1}: ${error.message}`)
              .slice(0, 3);
            
            throw new Error(`CSV parsing errors:\n${errorMessages.join('\n')}${
              criticalErrors.length > 3 ? `\n...and ${criticalErrors.length - 3} more errors` : ''
            }`);
          }
          
          const cleanedData = cleanData(transformedData);
          resolve(cleanedData);
        } catch (error) {
          reject(new Error(`Failed to process CSV: ${error.message}`));
        }
      },
      error: (error) => reject(new Error(`Failed to parse CSV: ${error.message}`)),
    });
  });
}