import { Table } from "@/components/ui/table";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Optimization } from "@/types/optimization";

interface OptimizationTableProps {
  optimizations: Optimization[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function OptimizationTable({ optimizations, onStatusChange }: OptimizationTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
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
          </thead>
          <tbody>
            {optimizations.map((opt) => (
              <tr 
                key={opt.id} 
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-700">{opt.campaign_name}</td>
                <td className="p-4 text-gray-700">{opt.platform}</td>
                <td className="p-4 text-gray-700">{opt.kpi}</td>
                <td className="p-4 text-gray-700">{opt.recommended_action}</td>
                <td className="p-4 text-gray-700">{opt.categories.join(", ")}</td>
                <td className="p-4 text-gray-700">
                  {format(new Date(opt.optimization_date), "MMM d, yyyy")}
                </td>
                <td className="p-4 text-gray-700">{opt.effort_level}</td>
                <td className="p-4 text-gray-700">{opt.impact_level}</td>
                <td className="p-4 text-gray-700">
                  <Select
                    value={opt.status || "Pending"}
                    onValueChange={(value) => onStatusChange(opt.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Disapproved">Disapproved</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}