import { findMatchingColumn, extractDateRangeFromHeader } from "./columnMapping";

export interface MetricAnalysisResult {
  metrics: Record<string, any>;
  recommendations: string[];
}

export function analyzeMetrics(data: any[], headers: string[]): MetricAnalysisResult {
  const metrics: Record<string, any> = {};
  const recommendations: string[] = [];

  // Example analysis logic
  const costPerResultColumn = findMatchingColumn(headers, 'cost_per_result');
  const conversionRateColumn = findMatchingColumn(headers, 'conversion_rate');

  if (costPerResultColumn && conversionRateColumn) {
    data.forEach(row => {
      const costPerResult = row[costPerResultColumn];
      const conversionRate = row[conversionRateColumn];

      if (costPerResult < 10) {
        recommendations.push("Consider increasing your budget for better results.");
      }

      metrics['cost_per_result'] = (metrics['cost_per_result'] || 0) + costPerResult;
      metrics['conversion_rate'] = (metrics['conversion_rate'] || 0) + conversionRate;
    });

    metrics['cost_per_result'] /= data.length;
    metrics['conversion_rate'] /= data.length;
  }

  return { metrics, recommendations };
}
