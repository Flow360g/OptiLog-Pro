import { PriorityTooltip } from "@/components/dashboard/optimization-table/PriorityTooltip";
import { Test } from "../types";

interface TableHeaderProps {
  tests: Test[];
}

export function TableHeader({ tests }: TableHeaderProps) {
  return (
    <tr className="bg-gray-50 border-b border-gray-200">
      <th className="p-4 text-left text-gray-600 font-medium w-12">
        <div className="flex items-center gap-1">
          Priority
          <PriorityTooltip optimizations={tests.map(test => ({
            id: test.id,
            impact_level: test.impact_level,
            effort_level: test.effort_level,
          }))} />
        </div>
      </th>
      <th className="p-4 text-left text-gray-600 font-medium w-48">Name</th>
      <th className="p-4 text-left text-gray-600 font-medium w-24">Platform</th>
      <th className="p-4 text-left text-gray-600 font-medium w-32">KPI</th>
      <th className="p-4 text-left text-gray-600 font-medium w-48">Type</th>
      <th className="p-4 text-left text-gray-600 font-medium w-64">Hypothesis</th>
      <th className="p-4 text-left text-gray-600 font-medium w-32">Start Date</th>
      <th className="p-4 text-left text-gray-600 font-medium w-32">End Date</th>
      <th className="p-4 text-left text-gray-600 font-medium w-24">Effort</th>
      <th className="p-4 text-left text-gray-600 font-medium w-24">Impact</th>
      <th className="p-4 text-left text-gray-600 font-medium w-32">Status</th>
    </tr>
  );
}