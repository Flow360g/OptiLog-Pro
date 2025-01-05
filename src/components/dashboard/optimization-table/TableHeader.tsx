import { PriorityTooltip } from "./PriorityTooltip";

export function TableHeader() {
  return (
    <tr className="border-b border-gray-200 bg-gray-50">
      <th className="text-left p-4 text-gray-900">
        <div className="flex items-center gap-1">
          Priority
          <PriorityTooltip />
        </div>
      </th>
      <th className="text-left p-4 text-gray-900">Campaign</th>
      <th className="text-left p-4 text-gray-900">Platform</th>
      <th className="text-left p-4 text-gray-900">KPI</th>
      <th className="text-left p-4 text-gray-900">Action</th>
      <th className="text-left p-4 text-gray-900">Categories</th>
      <th className="text-left p-4 text-gray-900">Date</th>
      <th className="text-left p-4 text-gray-900">Effort</th>
      <th className="text-left p-4 text-gray-900">Impact</th>
      <th className="text-left p-4 text-gray-900">Status</th>
    </tr>
  );
}