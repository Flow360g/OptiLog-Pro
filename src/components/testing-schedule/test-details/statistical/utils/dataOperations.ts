import { supabase } from "@/integrations/supabase/client";
import { StatisticalGroupData } from "../../../types";
import { Json } from "@/integrations/supabase/types";

const convertToJson = (data: StatisticalGroupData): Json => {
  return {
    conversions: data.conversions,
    impressions: data.impressions
  };
};

export async function updateTestStatistics(
  testId: string,
  controlData: StatisticalGroupData,
  experimentData: StatisticalGroupData
) {
  // First get the current results to preserve the CTR values
  const { data: currentTest, error: fetchError } = await supabase
    .from('tests')
    .select('results')
    .eq('id', testId)
    .single();

  if (fetchError) {
    console.error('Error fetching current test data:', fetchError);
    throw fetchError;
  }

  // Merge the statistical data with existing results
  const updatedResults = {
    ...(currentTest?.results || {}),
    statistical_data: {
      control: convertToJson(controlData),
      experiment: convertToJson(experimentData)
    }
  };

  const { error } = await supabase
    .from('tests')
    .update({ results: updatedResults })
    .eq('id', testId);

  if (error) {
    console.error('Error updating test statistics:', error);
    throw error;
  }
}