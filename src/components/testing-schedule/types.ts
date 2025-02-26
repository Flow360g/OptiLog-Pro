export interface TestResult {
  [key: string]: string | StatisticalData | undefined;
  control: string;
  experiment: string;
  statistical_data?: StatisticalData;
}

export interface StatisticalData {
  control: {
    conversions: string;
    impressions: string;
  };
  experiment: {
    conversions: string;
    impressions: string;
  };
}

export type TestPlatform = 'facebook' | 'google' | 'tiktok';

export interface Test {
  id: string;
  name: string;
  platform: TestPlatform;
  kpi: string;
  hypothesis: string;
  start_date: string | null;
  end_date: string | null;
  effort_level: number | null;
  impact_level: number | null;
  results: TestResult | null | any;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled' | 'scheduled';
  test_types: {
    name: string;
    test_categories: {
      name: string;
    };
  };
  executive_summary: string | null;
  user_id: string;
  client: string;
  created_at: string;
  test_type_id: string;
}

export interface PDFTest extends Omit<Test, 'results'> {
  results: TestResult;
}

export interface StatisticalGroupData {
  conversions: string;
  impressions: string;
}

export interface SignificanceResult {
  isSignificant: boolean;
  controlRate: number;
  experimentRate: number;
  relativeLift: number;
  pValue: number;
}