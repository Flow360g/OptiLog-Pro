import { PriorityTooltip } from "./PriorityTooltip";
import { Optimization } from "@/types/optimization";

interface TableHeaderProps {
  optimizations: Optimization[];
}

export function TableHeader({ optimizations }: TableHeaderProps) {
  return (
    <tr className="bg-gray-50 border-b border-gray-200">
      <th className="p-4 text-left text-gray-600 font-medium flex items-center gap-2">
        Priority
        <PriorityTooltip optimizations={optimizations} />
      </th>
      <th className="p-4 text-left text-gray-600 font-medium">Campaign</th>
      <th className="p-4 text-left text-gray-600 font-medium">Platform</th>
      <th className="p-4 text-left text-gray-600 font-medium">KPI</th>
      <th className="p-4 text-left text-gray-600 font-medium">Action</th>
      <th className="p-4 text-left text-gray-600 font-medium">Categories</th>
      <th className="p-4 text-left text-gray-600 font-medium">Date</th>
      <th className="p-4 text-left text-gray-600 font-medium">Effort</th>
      <th className="p-4 text-left text-gray-600 font-medium">Impact</th>
      <th className="p-4 text-left text-gray-600 font-medium">Status</th>
    </tr>
  );
}