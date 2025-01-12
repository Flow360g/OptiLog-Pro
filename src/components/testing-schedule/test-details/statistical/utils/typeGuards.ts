import { StatisticalData, StatisticalGroupData } from "../../../types";

export function isStatisticalGroupData(data: unknown): data is StatisticalGroupData {
  if (!data || typeof data !== 'object') return false;
  
  const groupData = data as StatisticalGroupData;
  return (
    typeof groupData.conversions === 'string' &&
    typeof groupData.impressions === 'string'
  );
}

export function isStatisticalData(data: unknown): data is StatisticalData {
  if (!data || typeof data !== 'object') return false;
  
  const statData = data as StatisticalData;
  return (
    isStatisticalGroupData(statData.control) &&
    isStatisticalGroupData(statData.experiment)
  );
}