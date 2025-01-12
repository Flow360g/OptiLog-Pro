import { StatisticalData } from "../../../types";

export const isStatisticalData = (data: unknown): data is StatisticalData => {
  if (!data || typeof data !== 'object') return false;
  const d = data as any;
  return (
    'control' in d &&
    'experiment' in d &&
    typeof d.control === 'object' &&
    typeof d.experiment === 'object' &&
    'conversions' in d.control &&
    'impressions' in d.control &&
    'conversions' in d.experiment &&
    'impressions' in d.experiment
  );
};