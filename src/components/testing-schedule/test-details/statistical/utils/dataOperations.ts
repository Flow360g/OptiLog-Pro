import { supabase } from "@/integrations/supabase/client";
import { StatisticalGroupData } from "../../../types";

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
          control: controlData,
          experiment: experimentData
        }
      }
    })
    .eq('id', testId);

  if (error) {
    console.error('Error updating test statistics:', error);
    throw error;
  }
}