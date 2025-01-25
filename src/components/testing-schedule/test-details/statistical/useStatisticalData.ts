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
    const loadStatisticalData = async () => {
      try {
        const { data: test, error } = await supabase
          .from('tests')
          .select('results')
          .eq('id', testId)
          .single();

        if (error) {
          console.error('Error loading statistical data:', error);
          return;
        }

        if (test?.results && typeof test.results === 'object') {
          const statisticalData = test.results.statistical_data;
          if (statisticalData && isStatisticalData(statisticalData)) {
            setControlData(statisticalData.control);
            setExperimentData(statisticalData.experiment);
          }
        }
      } catch (error) {
        console.error('Error in loadStatisticalData:', error);
      }
    };

    if (testId) {
      loadStatisticalData();
    }
  }, [testId]);

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

    // Update local state first
    if (variant === "control") {
      setControlData(newData);
    } else {
      setExperimentData(newData);
    }

    // Then update in Supabase
    try {
      await updateTestStatistics(
        testId,
        variant === "control" ? newData : controlData,
        variant === "experiment" ? newData : experimentData
      );
    } catch (error) {
      console.error('Error updating statistical data:', error);
    }
  };

  return {
    controlData,
    experimentData,
    handleInputChange,
  };
}