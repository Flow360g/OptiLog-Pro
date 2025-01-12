import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatisticalGroupData } from "../../types";
import { isStatisticalData } from "./utils/typeGuards";
import { updateTestStatistics } from "./utils/dataOperations";

export function useStatisticalData(testId: string) {
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
      const rawData = test.results.statistical_data as unknown;
      if (isStatisticalData(rawData)) {
        setControlData(rawData.control);
        setExperimentData(rawData.experiment);
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

    await updateTestStatistics(testId, 
      variant === "control" ? newData : controlData,
      variant === "experiment" ? newData : experimentData
    );
  };

  return {
    controlData,
    experimentData,
    handleInputChange,
  };
}