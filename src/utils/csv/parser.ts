import Papa from 'papaparse';
import { cleanData } from './dataCleanup';
import { MetricRelationships, analyzeMetricRelationships } from './metricAnalysis';

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
          const cleanedData = cleanData(results.data as any[]);
          resolve(cleanedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
}