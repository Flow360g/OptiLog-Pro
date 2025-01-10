interface TestData {
  conversions: number;
  impressions: number;
}

export function calculateStatisticalSignificance(
  control: TestData,
  experiment: TestData
): {
  isSignificant: boolean;
  pValue: number;
  relativeLift: number;
  controlRate: number;
  experimentRate: number;
} {
  // Calculate conversion rates
  const controlRate = control.conversions / control.impressions;
  const experimentRate = experiment.conversions / experiment.impressions;

  // Calculate pooled proportion
  const totalConversions = control.conversions + experiment.conversions;
  const totalImpressions = control.impressions + experiment.impressions;
  const pooledProportion = totalConversions / totalImpressions;

  // Calculate standard error
  const standardError = Math.sqrt(
    pooledProportion * (1 - pooledProportion) * 
    (1 / control.impressions + 1 / experiment.impressions)
  );

  // Calculate z-score
  const zScore = Math.abs((experimentRate - controlRate) / standardError);

  // Calculate p-value (two-tailed test)
  const pValue = 2 * (1 - normalCDF(zScore));

  // Calculate relative lift
  const relativeLift = ((experimentRate - controlRate) / controlRate) * 100;

  return {
    isSignificant: pValue < 0.05,
    pValue,
    relativeLift,
    controlRate,
    experimentRate,
  };
}

// Helper function to calculate normal cumulative distribution function
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - probability : probability;
}