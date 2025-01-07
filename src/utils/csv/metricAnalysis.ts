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

function calculatePeriodMetrics(data: CSVData[]): Record<string, number> {
  if (!data || data.length === 0) {
    return {};
  }

  const validNumbers = (numbers: number[]): number[] => 
    numbers.filter(n => !isNaN(n) && n !== null && n !== undefined);

  const safeAverage = (numbers: number[]): number => {
    const valid = validNumbers(numbers);
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : NaN;
  };

  return {
    cost_per_result: safeAverage(data.map(d => d.cost_per_result)),
    conversion_rate: safeAverage(data.map(d => d.conversion_rate)),
    cpc: safeAverage(data.map(d => d.cpc)),
    ctr: safeAverage(data.map(d => d.ctr)),
    cpm: safeAverage(data.map(d => d.cpm))
  };
}

function calculatePercentChange(current: number, previous: number): number {
  if (isNaN(current) || isNaN(previous) || previous === 0) {
    return NaN;
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
  // Split data into current and previous periods
  const midpoint = Math.floor(data.length / 2);
  const currentPeriodData = data.slice(midpoint);
  const previousPeriodData = data.slice(0, midpoint);

  // Calculate metrics for both periods
  const currentMetrics = calculatePeriodMetrics(currentPeriodData);
  const previousMetrics = calculatePeriodMetrics(previousPeriodData);

  // Calculate period-over-period changes
  const metrics: Record<string, PeriodComparison> = {};
  Object.keys(METRIC_RELATIONSHIPS).forEach(metric => {
    metrics[metric] = {
      currentPeriod: currentMetrics[metric] || 0,
      previousPeriod: previousMetrics[metric] || 0,
      percentChange: calculatePercentChange(currentMetrics[metric], previousMetrics[metric])
    };
  });

  // Calculate impact scores
  const relationships = { ...METRIC_RELATIONSHIPS };
  Object.keys(relationships).forEach(metric => {
    relationships[metric].impact = determineImpact(metric, currentMetrics, previousMetrics);
  });

  // Identify root causes (only include metrics with valid changes)
  const rootCauses = Object.entries(relationships)
    .filter(([metric, rel]) => {
      const change = metrics[metric].percentChange;
      return rel.parent && !isNaN(change) && Math.abs(change) > 10;
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