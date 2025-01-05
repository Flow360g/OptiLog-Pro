export interface Optimization {
  id: string;
  campaign_name: string;
  platform: string;
  kpi: string;
  recommended_action: string;
  categories: string[];
  effort_level: number;
  impact_level: number;
  optimization_date: string;
  status: string;
  client: string;
  user_first_name: string | null;
}

export interface OptimizationsByClient {
  [key: string]: Optimization[];
}