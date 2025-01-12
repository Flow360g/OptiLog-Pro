import { calculateStatisticalSignificance } from "../utils/statisticalCalculations";
import { StatisticalDataForm } from "./statistical/StatisticalDataForm";
import { SignificanceResultsCard } from "./statistical/SignificanceResultsCard";
import { useStatisticalData } from "./statistical/useStatisticalData";

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
  const { controlData, experimentData, handleInputChange } = useStatisticalData(testId);

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
        <StatisticalDataForm
          label="Control Group Data"
          data={controlData}
          onChange={(field, value) => handleInputChange("control", field, value)}
        />
        <StatisticalDataForm
          label="Experiment Group Data"
          data={experimentData}
          onChange={(field, value) => handleInputChange("experiment", field, value)}
        />
      </div>

      {(parseInt(controlData.impressions) > 0 && parseInt(experimentData.impressions) > 0) && (
        <SignificanceResultsCard results={results} />
      )}
    </div>
  );
}