import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TestResult } from "../types";

interface TestResultsFormProps {
  results: TestResult;
  kpi: string;
  onChange: (results: TestResult) => void;
}

export function TestResultsForm({ results, kpi, onChange }: TestResultsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="control">Control {kpi}</Label>
        <Input
          id="control"
          value={results.control}
          onChange={(e) => onChange({ ...results, control: e.target.value })}
          placeholder="Enter control value"
        />
      </div>

      <div>
        <Label htmlFor="experiment">Experiment {kpi}</Label>
        <Input
          id="experiment"
          value={results.experiment}
          onChange={(e) => onChange({ ...results, experiment: e.target.value })}
          placeholder="Enter experiment value"
        />
      </div>
    </div>
  );
}