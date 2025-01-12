import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatisticalData, StatisticalGroupData } from "../../types";

export function useStatisticalData(testId: string) {
  const { toast } = useToast();
  const [controlData, setControlData] = useState<StatisticalGroupData>({
    conversions: "",
    impressions: "1000",
  });
  const [experimentData, setExperimentData] = useState<StatisticalGroupData>({
    conversions: "",
    impressions: "1000",
  });

  useEffect(() => {
    loadStatisticalData();
  }, [testId]);

  const loadStatisticalData = async () => {
    const { data: test, error } = await supabase
      .from('tests')
      .select('results')
      .eq('id', testId)
      .single();

    if (error) {
      console.error('Error loading statistical data:', error);
      return;
    }

    if (test?.results && typeof test.results === 'object' && 'statistical_data' in test.results) {
      const statisticalData = test.results.statistical_data as StatisticalData;
      if (statisticalData && 'control' in statisticalData && 'experiment' in statisticalData) {
        setControlData(statisticalData.control);
        setExperimentData(statisticalData.experiment);
      }
    }
  };

  const handleInputChange = async (
    variant: "control" | "experiment",
    field: "conversions" | "impressions",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const newData = {
      ...(variant === "control" ? controlData : experimentData),
      [field]: field === "conversions" ? value : numValue.toString()
    };

    if (variant === "control") {
      setControlData(newData);
    } else {
      setExperimentData(newData);
    }

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

    const updatedResults = {
      ...currentResults,
      statistical_data: {
        control: variant === "control" ? newData : controlData,
        experiment: variant === "experiment" ? newData : experimentData
      }
    };

    const { error: updateError } = await supabase
      .from('tests')
      .update({ results: updatedResults })
      .eq('id', testId);

    if (updateError) {
      console.error('Error saving statistical data:', updateError);
      toast({
        title: "Error saving data",
        description: "Failed to save statistical test data",
        variant: "destructive",
      });
    }
  };

  return {
    controlData,
    experimentData,
    handleInputChange,
  };
}