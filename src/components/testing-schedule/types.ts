export interface TestResult {
  [key: string]: string | StatisticalData;
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

export interface Test {
  id: string;
  name: string;
  platform: string;
  kpi: string;
  hypothesis: string;
  start_date: string | null;
  end_date: string | null;
  effort_level: number | null;
  impact_level: number | null;
  results: TestResult | null;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  test_types: {
    name: string;
    test_categories: {
      name: string;
    };
  };
  executive_summary: string | null;
  user_id: string;
}

export interface PDFTest extends Test {
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