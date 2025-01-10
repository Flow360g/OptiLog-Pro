import { Card } from "@/components/ui/card";
import { calculateStatisticalSignificance } from "../utils/statisticalCalculations";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TestSignificanceResultsProps {
  controlRate: number;
  experimentRate: number;
}

export function TestSignificanceResults({
  controlRate,
  experimentRate,
}: TestSignificanceResultsProps) {
  const [controlData, setControlData] = useState({
    conversions: 0,
    impressions: 1000,
  });
  const [experimentData, setExperimentData] = useState({
    conversions: 0,
    impressions: 1000,
  });

  const handleInputChange = (
    variant: "control" | "experiment",
    field: "conversions" | "impressions",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    if (variant === "control") {
      setControlData(prev => ({ ...prev, [field]: numValue }));
    } else {
      setExperimentData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const results = calculateStatisticalSignificance(controlData, experimentData);

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

      {(controlData.impressions > 0 && experimentData.impressions > 0) && (
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
          <p className="text-sm text-gray-500 mt-2">
            P-value: {results.pValue.toFixed(4)}
          </p>
        </Card>
      )}
    </div>
  );
}