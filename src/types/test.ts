export type TestPlatform = 'facebook' | 'google' | 'tiktok';
export type TestStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface TestCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface TestType {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  tooltip: string | null;
  default_hypothesis: string | null;
  category?: TestCategory;
}

export interface Test {
  id: string;
  user_id: string;
  client: string;
  test_type_id: string;
  platform: TestPlatform;
  name: string;
  hypothesis: string;
  start_date: string | null;
  end_date: string | null;
  status: TestStatus;
  effort_level: number | null;
  impact_level: number | null;
  created_at: string;
  updated_at: string;
  test_type?: TestType;
}