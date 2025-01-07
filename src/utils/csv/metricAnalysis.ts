import { CSVData } from './parser';

export interface MetricRelationships {
  [key: string]: {
    parent: string | null;
    children: string[];
    impact: number;
  };
}

interface PeriodComparison {
  currentPeriod: number;
  previousPeriod: number;
  percentChange: number;
}

interface MetricAnalysis {
  metrics: Record<string, PeriodComparison>;
  relationships: MetricRelationships;
  rootCauses: string[];
  recommendations: string[];
}

const METRIC_RELATIONSHIPS: MetricRelationships = {
  cost_per_result: {
    parent: null,
    children: ['conversion_rate', 'cpc'],
    impact: 0
  },
  conversion_rate: {
    parent: 'cost_per_result',
    children: [],
    impact: 0
  },
  cpc: {
    parent: 'cost_per_result',
    children: ['ctr', 'cpm'],
    impact: 0
  },
  ctr: {
    parent: 'cpc',
    children: [],
    impact: 0
  },
  cpm: {
    parent: 'cpc',
    children: [],
    impact: 0
  }
};

function extractMetricValue(data: CSVData[], metricName: string, isCurrentPeriod: boolean): number {
  if (!data || data.length === 0) return 0;

  // Get the appropriate row based on period
  const row = isCurrentPeriod ? data[data.length - 1] : data[0];

  switch(metricName.toLowerCase()) {
    case 'cost_per_result':
      return row.cost_per_result || 0;
    case 'conversion_rate':
      return row.conversion_rate || 0;
    case 'cpc':
      return row.cpc || 0;
    case 'ctr':
      return row.ctr || 0;
    case 'cpm':
      return row.cpm || 0;
    default:
      return 0;
  }
}

function calculatePeriodMetrics(data: CSVData[]): Record<string, number> {
  if (!data || data.length === 0) {
    return {};
  }

  // Get metrics from the last row (current period) and first row (previous period)
  const currentPeriodData = data[data.length - 1];
  const previousPeriodData = data[0];

  return {
    cost_per_result: Number(currentPeriodData.cost_per_result) || 0,
    conversion_rate: Number(currentPeriodData.conversion_rate) || 0,
    cpc: Number(currentPeriodData.cpc) || 0,
    ctr: Number(currentPeriodData.ctr) || 0,
    cpm: Number(currentPeriodData.cpm) || 0
  };
}

function calculatePercentChange(current: number, previous: number): number {
  if (isNaN(current) || isNaN(previous) || previous === 0) {
    return 0;
  }
  return ((current - previous) / previous) * 100;
}

function determineImpact(metric: string, currentMetrics: Record<string, number>, previousMetrics: Record<string, number>): number {
  const percentChange = calculatePercentChange(currentMetrics[metric], previousMetrics[metric]);
  return isNaN(percentChange) ? 0 : Math.abs(percentChange);
}

function generateRecommendations(rootCauses: string[]): string[] {
  const recommendationMap: Record<string, string[]> = {
    cpm: [
      "Review audience targeting to optimize reach efficiency",
      "Adjust bid strategy to control impression costs",
      "Analyze ad placement performance and optimize distribution"
    ],
    ctr: [
      "Test new ad creative variations to improve engagement",
      "Review ad copy and call-to-action effectiveness",
      "Optimize ad placement for better visibility"
    ],
    conversion_rate: [
      "Analyze landing page performance and optimize conversion paths",
      "Review audience targeting for conversion intent",
      "Test different call-to-action variations"
    ],
    cpc: [
      "Optimize bid strategies based on performance data",
      "Review keyword quality scores and relevance",
      "Adjust campaign scheduling for better efficiency"
    ]
  };

  return rootCauses.flatMap(cause => recommendationMap[cause] || []);
}

export function analyzeMetricRelationships(data: CSVData[]): MetricAnalysis {
  if (!data || data.length < 2) {
    throw new Error("Insufficient data for analysis. Need at least two periods of data.");
  }

  // Calculate metrics for both periods
  const metrics: Record<string, PeriodComparison> = {};
  const metricKeys = ['cost_per_result', 'conversion_rate', 'cpc', 'ctr', 'cpm'];

  metricKeys.forEach(metric => {
    const currentPeriod = extractMetricValue(data, metric, true);
    const previousPeriod = extractMetricValue(data, metric, false);
    
    metrics[metric] = {
      currentPeriod,
      previousPeriod,
      percentChange: calculatePercentChange(currentPeriod, previousPeriod)
    };
  });

  // Calculate impact scores
  const relationships = { ...METRIC_RELATIONSHIPS };
  Object.keys(relationships).forEach(metric => {
    relationships[metric].impact = determineImpact(
      metric,
      { ...metrics, [metric]: metrics[metric]?.currentPeriod || 0 },
      { ...metrics, [metric]: metrics[metric]?.previousPeriod || 0 }
    );
  });

  // Identify root causes
  const rootCauses = Object.entries(relationships)
    .filter(([metric, rel]) => {
      const change = metrics[metric]?.percentChange || 0;
      return rel.parent && Math.abs(change) > 10;
    })
    .sort((a, b) => b[1].impact - a[1].impact)
    .map(([metric]) => metric);

  // Generate recommendations
  const recommendations = generateRecommendations(rootCauses);

  return {
    metrics,
    relationships,
    rootCauses,
    recommendations
  };
}