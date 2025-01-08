import { PriorityTooltip } from "@/components/dashboard/optimization-table/PriorityTooltip";

export function TableHeader() {
  return (
    <tr className="bg-gray-50 border-b border-gray-200">
      <th className="p-4 text-left text-gray-600 font-medium w-12">
        <div className="flex items-center gap-1">
          Priority
          <PriorityTooltip optimizations={[]} />
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