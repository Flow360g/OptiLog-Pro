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
  const { error } = await supabase
    .from('tests')
    .update({
      results: {
        statistical_data: {
          control: convertToJson(controlData),
          experiment: convertToJson(experimentData)
        }
      }
    })
    .eq('id', testId);

  if (error) {
    console.error('Error updating test statistics:', error);
    throw error;
  }
}