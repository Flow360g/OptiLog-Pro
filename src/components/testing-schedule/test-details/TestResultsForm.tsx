import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TestResult } from "../types";

interface TestResultsFormProps {
  results: TestResult;
  kpi: string;
  onChange: (results: TestResult) => void;
}

export function TestResultsForm({ results, kpi, onChange }: TestResultsFormProps) {
  const handleChange = (field: keyof TestResult, value: string) => {
    // Only allow numbers and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange({ ...results, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="control">Control {kpi}</Label>
        <Input
          id="control"
          type="text"
          value={results.control}
          onChange={(e) => handleChange("control", e.target.value)}
          placeholder="Enter control value"
        />
      </div>

      <div>
        <Label htmlFor="experiment">Experiment {kpi}</Label>
        <Input
          id="experiment"
          type="text"
          value={results.experiment}
          onChange={(e) => handleChange("experiment", e.target.value)}
          placeholder="Enter experiment value"
        />
      </div>
    </div>
  );
}