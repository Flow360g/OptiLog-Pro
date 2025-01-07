import { CSVData } from './parser';

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

function parseDate(dateStr: string): string {
  if (!dateStr) throw new Error("Date field is required");
  
  // Try different date formats
  const date = new Date(dateStr);
  if (!isValidDate(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Please ensure dates are in YYYY-MM-DD format.`);
  }
  
  return date.toISOString().split('T')[0];
}

function parseNumber(value: any, fieldName: string): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number format for ${fieldName}: ${value}`);
  }
  
  return num;
}

export function cleanData(rawData: any[]): CSVData[] {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    throw new Error("CSV file appears to be empty or invalid");
  }

  // Validate required columns
  const requiredColumns = ['date', 'spend', 'impressions', 'clicks', 'conversions'];
  const missingColumns = requiredColumns.filter(col => !rawData[0].hasOwnProperty(col));
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  return rawData.map((row, index) => {
    try {
      const spend = parseNumber(row.spend, 'spend');
      const impressions = parseNumber(row.impressions, 'impressions');
      const clicks = parseNumber(row.clicks, 'clicks');
      const conversions = parseNumber(row.conversions, 'conversions');

      return {
        date: parseDate(row.date),
        spend,
        impressions,
        clicks,
        conversions,
        ctr: clicks > 0 && impressions > 0 ? (clicks / impressions) : 0,
        cpc: clicks > 0 ? (spend / clicks) : 0,
        cpm: impressions > 0 ? (spend / impressions * 1000) : 0,
        conversion_rate: clicks > 0 ? (conversions / clicks) : 0,
        cost_per_result: conversions > 0 ? (spend / conversions) : 0
      };
    } catch (error) {
      throw new Error(`Error processing row ${index + 1}: ${error.message}`);
    }
  });
}