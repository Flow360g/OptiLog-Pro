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

function parseNumericValue(value: string): number {
  if (!value || value === '') return 0;
  
  // Remove currency symbols, parentheses, and commas
  const cleanValue = value.replace(/[($,)]/g, '').trim();
  
  // Convert percentage strings to decimals
  if (cleanValue.includes('%')) {
    return parseFloat(cleanValue) / 100;
  }
  
  return parseFloat(cleanValue) || 0;
}

export async function parseCSVFile(file: File): Promise<CSVData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false, // Set to false to handle custom parsing
      skipEmptyLines: 'greedy',
      transformHeader: (header: string) => {
        // Remove date ranges and clean up header
        return header.replace(/\([^)]*\)/g, '').replace(/['"]+/g, '').trim();
      },
      complete: (results) => {
        try {
          const headers = results.meta.fields || [];
          
          // Map columns to standardized names
          const columnMap: { [key: string]: string } = {};
          const requiredColumns = ['date', 'spend', 'impressions', 'clicks', 'conversions'];
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

          // Transform the data
          const transformedData = results.data
            .filter((row: any) => Object.keys(row).length > 0)
            .map((row: any) => {
              const newRow: any = {};
              
              // Map standard columns
              for (const [standardName, originalName] of Object.entries(columnMap)) {
                newRow[standardName] = parseNumericValue(row[originalName]);
              }

              // Handle specific metrics
              const costPerResultCol = headers.find(h => h.toLowerCase().includes('cost per result'));
              const ctrCol = headers.find(h => h.toLowerCase().includes('ctr') || h.toLowerCase().includes('click-through rate'));
              const cpcCol = headers.find(h => h.toLowerCase().includes('cost per click'));
              const cpmCol = headers.find(h => h.toLowerCase().includes('cpm'));
              const convRateCol = headers.find(h => h.toLowerCase().includes('conversion rate'));

              if (costPerResultCol) newRow.cost_per_result = parseNumericValue(row[costPerResultCol]);
              if (ctrCol) newRow.ctr = parseNumericValue(row[ctrCol]);
              if (cpcCol) newRow.cpc = parseNumericValue(row[cpcCol]);
              if (cpmCol) newRow.cpm = parseNumericValue(row[cpmCol]);
              if (convRateCol) newRow.conversion_rate = parseNumericValue(row[convRateCol]);

              return newRow;
            });

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