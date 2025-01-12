import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { StatisticalGroupData } from "../../../types";
import { useToast } from "@/hooks/use-toast";

export const updateTestStatistics = async (
  testId: string,
  controlData: StatisticalGroupData,
  experimentData: StatisticalGroupData,
  showToast: boolean = true
) => {
  const { toast } = useToast();
  
  const { data: currentTest, error: fetchError } = await supabase
    .from('tests')
    .select('results')
    .eq('id', testId)
    .single();

  if (fetchError) {
    console.error('Error fetching current test data:', fetchError);
    return;
  }

  const currentResults = currentTest?.results || {};
  if (typeof currentResults !== 'object') {
    console.error('Current results is not an object');
    return;
  }

  const statisticalData = {
    control: { ...controlData } as Json,
    experiment: { ...experimentData } as Json
  };

  const updatedResults = {
    ...currentResults,
    statistical_data: statisticalData
  } as Json;

  const { error: updateError } = await supabase
    .from('tests')
    .update({ results: updatedResults })
    .eq('id', testId);

  if (updateError && showToast) {
    console.error('Error saving statistical data:', updateError);
    toast({
      title: "Error saving data",
      description: "Failed to save statistical test data",
      variant: "destructive",
    });
  }
};