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

function calculatePeriodMetrics(data: CSVData[]): Record<string, PeriodComparison> {
  if (!data || data.length < 2) {
    throw new Error("Insufficient data for analysis. Need at least two periods of data.");
  }

  const currentPeriod = data[0];
  const previousPeriod = data[1];

  const metrics: Record<string, PeriodComparison> = {
    cost_per_result: {
      currentPeriod: currentPeriod.cost_per_result,
      previousPeriod: previousPeriod.cost_per_result,
      percentChange: calculatePercentChange(currentPeriod.cost_per_result, previousPeriod.cost_per_result)
    },
    conversion_rate: {
      currentPeriod: currentPeriod.conversion_rate,
      previousPeriod: previousPeriod.conversion_rate,
      percentChange: calculatePercentChange(currentPeriod.conversion_rate, previousPeriod.conversion_rate)
    },
    cpc: {
      currentPeriod: currentPeriod.cpc,
      previousPeriod: previousPeriod.cpc,
      percentChange: calculatePercentChange(currentPeriod.cpc, previousPeriod.cpc)
    },
    ctr: {
      currentPeriod: currentPeriod.ctr,
      previousPeriod: previousPeriod.ctr,
      percentChange: calculatePercentChange(currentPeriod.ctr, previousPeriod.ctr)
    },
    cpm: {
      currentPeriod: currentPeriod.cpm,
      previousPeriod: previousPeriod.cpm,
      percentChange: calculatePercentChange(currentPeriod.cpm, previousPeriod.cpm)
    }
  };

  return metrics;
}

function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function determineImpact(
  metric: string,
  metrics: Record<string, PeriodComparison>
): number {
  const metricData = metrics[metric];
  if (!metricData) return 0;
  
  return Math.abs(metricData.percentChange);
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
  const metrics = calculatePeriodMetrics(data);

  // Calculate impact scores
  const relationships = { ...METRIC_RELATIONSHIPS };
  Object.keys(relationships).forEach(metric => {
    relationships[metric].impact = determineImpact(metric, metrics);
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