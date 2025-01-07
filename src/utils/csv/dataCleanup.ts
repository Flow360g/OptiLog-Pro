import { CSVData } from './parser';

export function cleanData(rawData: any[]): CSVData[] {
  return rawData.map(row => ({
    date: new Date(row.date).toISOString().split('T')[0],
    spend: Number(row.spend) || 0,
    impressions: Number(row.impressions) || 0,
    clicks: Number(row.clicks) || 0,
    conversions: Number(row.conversions) || 0,
    ctr: Number(row.ctr) || (row.clicks / row.impressions) || 0,
    cpc: Number(row.cpc) || (row.spend / row.clicks) || 0,
    cpm: Number(row.cpm) || (row.spend / row.impressions * 1000) || 0,
    conversion_rate: Number(row.conversion_rate) || (row.conversions / row.clicks) || 0,
    cost_per_result: Number(row.cost_per_result) || (row.spend / row.conversions) || 0
  }));
}