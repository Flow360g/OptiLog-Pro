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

interface ParsedMetrics {
  current: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    conversion_rate: number;
    cost_per_result: number;
  };
  previous: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    conversion_rate: number;
    cost_per_result: number;
  };
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

function extractDateRangeFromHeader(header: string): { isPrevious: boolean } {
  const cleanHeader = header.toLowerCase();
  // Look for date indicators in the header
  const isPrevious = cleanHeader.includes('previous') || 
                    cleanHeader.includes('prior') || 
                    cleanHeader.includes('last') ||
                    /\([^)]*previous[^)]*\)/i.test(header);
  return { isPrevious };
}

function organizeMetricsByPeriod(data: any): ParsedMetrics {
  const metrics: ParsedMetrics = {
    current: {
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      conversion_rate: 0,
      cost_per_result: 0
    },
    previous: {
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      conversion_rate: 0,
      cost_per_result: 0
    }
  };

  // Process each column in the data
  Object.entries(data[0]).forEach(([header, value]) => {
    const { isPrevious } = extractDateRangeFromHeader(header);
    const period = isPrevious ? 'previous' : 'current';
    
    // Try to identify the metric type from the header
    if (header.toLowerCase().includes('spend') || header.toLowerCase().includes('cost')) {
      metrics[period].spend = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('impressions')) {
      metrics[period].impressions = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('clicks')) {
      metrics[period].clicks = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('conversions') || header.toLowerCase().includes('results')) {
      metrics[period].conversions = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('ctr')) {
      metrics[period].ctr = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('cpc')) {
      metrics[period].cpc = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('cpm')) {
      metrics[period].cpm = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('conversion rate')) {
      metrics[period].conversion_rate = parseNumericValue(value as string);
    } else if (header.toLowerCase().includes('cost per result')) {
      metrics[period].cost_per_result = parseNumericValue(value as string);
    }
  });

  return metrics;
}

export async function parseCSVFile(file: File): Promise<CSVData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error("CSV file appears to be empty");
          }

          // Process the data to organize metrics by period
          const metrics = organizeMetricsByPeriod(results.data);

          // Create two data points representing current and previous periods
          const processedData: CSVData[] = [
            {
              date: new Date().toISOString().split('T')[0], // Current period
              ...metrics.current
            },
            {
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Previous period
              ...metrics.previous
            }
          ];

          resolve(processedData);
        } catch (error) {
          reject(new Error(`Failed to process CSV: ${error.message}`));
        }
      },
      error: (error) => reject(new Error(`Failed to parse CSV: ${error.message}`)),
    });
  });
}