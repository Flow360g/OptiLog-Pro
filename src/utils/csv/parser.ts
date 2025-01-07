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
  
  const parsedValue = parseFloat(cleanValue);
  return isNaN(parsedValue) ? 0 : parsedValue;
}

function extractDateRangeFromHeader(header: string): { isPrevious: boolean } {
  const cleanHeader = header.toLowerCase();
  const isPrevious = cleanHeader.includes('previous') || 
                    cleanHeader.includes('prior') || 
                    cleanHeader.includes('last') ||
                    /\([^)]*previous[^)]*\)/i.test(header);
  return { isPrevious };
}

function identifyMetricType(header: string): string | null {
  const cleanHeader = header.toLowerCase().trim();
  
  if (cleanHeader.includes('cost_per_result') || cleanHeader.includes('cost per result')) return 'cost_per_result';
  if (cleanHeader.includes('conversion_rate') || cleanHeader.includes('conversion rate')) return 'conversion_rate';
  if (cleanHeader.includes('cpc')) return 'cpc';
  if (cleanHeader.includes('ctr')) return 'ctr';
  if (cleanHeader.includes('cpm')) return 'cpm';
  if (cleanHeader.includes('spend') || cleanHeader.includes('cost')) return 'spend';
  if (cleanHeader.includes('impressions')) return 'impressions';
  if (cleanHeader.includes('clicks')) return 'clicks';
  if (cleanHeader.includes('conversions') || cleanHeader.includes('results')) return 'conversions';
  
  return null;
}

function organizeMetricsByPeriod(data: any[]): ParsedMetrics {
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

  // Process the first row of data which contains our metrics
  const firstRow = data[0];
  
  Object.entries(firstRow).forEach(([header, value]) => {
    const { isPrevious } = extractDateRangeFromHeader(header);
    const period = isPrevious ? 'previous' : 'current';
    const metricType = identifyMetricType(header);
    
    if (metricType && value !== undefined && value !== null) {
      const numericValue = parseNumericValue(value.toString());
      metrics[period][metricType as keyof typeof metrics.current] = numericValue;
    }
  });

  // Calculate derived metrics if they're not present in the data
  ['current', 'previous'].forEach(period => {
    const p = period as keyof ParsedMetrics;
    const m = metrics[p];

    // Calculate CTR if not present
    if (m.ctr === 0 && m.clicks > 0 && m.impressions > 0) {
      m.ctr = (m.clicks / m.impressions) * 100;
    }

    // Calculate CPC if not present
    if (m.cpc === 0 && m.clicks > 0 && m.spend > 0) {
      m.cpc = m.spend / m.clicks;
    }

    // Calculate CPM if not present
    if (m.cpm === 0 && m.impressions > 0 && m.spend > 0) {
      m.cpm = (m.spend / m.impressions) * 1000;
    }

    // Calculate Conversion Rate if not present
    if (m.conversion_rate === 0 && m.conversions > 0 && m.clicks > 0) {
      m.conversion_rate = (m.conversions / m.clicks) * 100;
    }

    // Calculate Cost per Result if not present
    if (m.cost_per_result === 0 && m.conversions > 0 && m.spend > 0) {
      m.cost_per_result = m.spend / m.conversions;
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

          console.log('Parsed CSV data:', results.data);
          
          // Process the data to organize metrics by period
          const metrics = organizeMetricsByPeriod(results.data);
          console.log('Organized metrics:', metrics);

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

          console.log('Processed data:', processedData);
          resolve(processedData);
        } catch (error) {
          console.error('Error processing CSV:', error);
          reject(new Error(`Failed to process CSV: ${error.message}`));
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}