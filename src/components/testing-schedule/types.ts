export interface TestResult {
  [key: string]: string;
  control: string;
  experiment: string;
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
  test_types: {
    name: string;
    test_categories: {
      name: string;
    };
  };
}