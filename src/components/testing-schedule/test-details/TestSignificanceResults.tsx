import { Card } from "@/components/ui/card";
import { calculateStatisticalSignificance } from "../utils/statisticalCalculations";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatisticalData } from "../types";

interface TestSignificanceResultsProps {
  controlRate: number;
  experimentRate: number;
  testId: string;
}

export function TestSignificanceResults({
  controlRate,
  experimentRate,
  testId,
}: TestSignificanceResultsProps) {
  const { toast } = useToast();
  const [controlData, setControlData] = useState({
    conversions: "",
    impressions: "1000",
  });
  const [experimentData, setExperimentData] = useState({
    conversions: "",
    impressions: "1000",
  });

  useEffect(() => {
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
        const statisticalData = (test.results.statistical_data as unknown) as StatisticalData;
        if (statisticalData && 'control' in statisticalData && 'experiment' in statisticalData) {
          setControlData(statisticalData.control);
          setExperimentData(statisticalData.experiment);
        }
      }
    };

    loadStatisticalData();
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

    const updatedResults = {
      ...(currentTest?.results || {}),
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

  const results = calculateStatisticalSignificance({
    conversions: parseInt(controlData.conversions) || 0,
    impressions: parseInt(controlData.impressions) || 1000
  }, {
    conversions: parseInt(experimentData.conversions) || 0,
    impressions: parseInt(experimentData.impressions) || 1000
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium">Control Group Data</h3>
          <div className="space-y-2">
            <Label htmlFor="control-conversions">Conversions</Label>
            <Input
              id="control-conversions"
              type="number"
              min="0"
              value={controlData.conversions}
              onChange={(e) => handleInputChange("control", "conversions", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="control-impressions">Impressions</Label>
            <Input
              id="control-impressions"
              type="number"
              min="1"
              value={controlData.impressions}
              onChange={(e) => handleInputChange("control", "impressions", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Experiment Group Data</h3>
          <div className="space-y-2">
            <Label htmlFor="experiment-conversions">Conversions</Label>
            <Input
              id="experiment-conversions"
              type="number"
              min="0"
              value={experimentData.conversions}
              onChange={(e) => handleInputChange("experiment", "conversions", e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experiment-impressions">Impressions</Label>
            <Input
              id="experiment-impressions"
              type="number"
              min="1"
              value={experimentData.impressions}
              onChange={(e) => handleInputChange("experiment", "impressions", e.target.value)}
            />
          </div>
        </div>
      </div>

      {(parseInt(controlData.impressions) > 0 && parseInt(experimentData.impressions) > 0) && (
        <Card className={`p-6 ${results.isSignificant ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className="text-lg font-semibold mb-4">
            {results.isSignificant ? "Significant test result!" : "No significant difference"}
          </h3>
          <p className="text-gray-700">
            {results.isSignificant ? (
              `Variation B's observed conversion rate (${(results.experimentRate * 100).toFixed(2)}%) was ${Math.abs(results.relativeLift).toFixed(2)}% ${results.relativeLift > 0 ? 'higher' : 'lower'} than Variation A's conversion rate (${(results.controlRate * 100).toFixed(2)}%). You can be 95% confident that this result is a consequence of the changes you made and not a result of random chance.`
            ) : (
              `The difference between Variation A (${(results.controlRate * 100).toFixed(2)}%) and Variation B (${(results.experimentRate * 100).toFixed(2)}%) is not statistically significant. This means we cannot be confident that the observed difference is not due to random chance.`
            )}
          </p>
          <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
            <span className="font-bold">P-value:</span>
            <span>{results.pValue.toFixed(4)}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="ml-1 text-gray-400 hover:text-gray-600">
                  (?)
                </TooltipTrigger>
                <TooltipContent className="max-w-sm p-4">
                  <p>A p-value, or probability value, is a number describing how likely it is that your data would have occurred by random chance (i.e., that the null hypothesis is true).</p>
                  <p className="mt-2">The level of statistical significance is often expressed as a p-value between 0 and 1. To achieve a statistical significance of 95%, we need a p-value of 0.05 or lower.</p>
                  <p className="mt-2">The smaller the p-value, the less likely the results occurred by random chance, and the stronger the evidence that you should reject the null hypothesis.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      )}
    </div>
  );
}