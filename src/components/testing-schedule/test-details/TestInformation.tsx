import { Test } from "../types";

interface TestInformationProps {
  test: Test;
}

export function TestInformation({ test }: TestInformationProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Platform</p>
          <p className="text-sm text-gray-500">{test.platform}</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">KPI</p>
          <p className="text-sm text-gray-500">{test.kpi}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Test Type</p>
        <p className="text-sm text-gray-500">
          {test.test_types.test_categories.name} - {test.test_types.name}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Hypothesis</p>
        <p className="text-sm text-gray-500">{test.hypothesis}</p>
      </div>
    </div>
  );
}