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

  const calculatePercentChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

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

  console.log('Calculated period metrics:', metrics);
  return metrics;
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
  console.log('Analyzing data:', data);
  
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

  // Identify root causes (metrics with significant changes)
  const rootCauses = Object.entries(metrics)
    .filter(([_, data]) => Math.abs(data.percentChange) > 10)
    .map(([metric]) => metric)
    .filter(metric => METRIC_RELATIONSHIPS[metric]?.parent);

  // Generate recommendations based on root causes
  const recommendations = generateRecommendations(rootCauses);

  console.log('Analysis results:', {
    metrics,
    relationships,
    rootCauses,
    recommendations
  });

  return {
    metrics,
    relationships,
    rootCauses,
    recommendations
  };
}