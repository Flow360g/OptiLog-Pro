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
import { QuestionMarkCircledIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OptimizationTableProps {
  optimizations: Optimization[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function OptimizationTable({ optimizations, onStatusChange }: OptimizationTableProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#0FA0CE] text-white';
      case 'Disapproved':
        return 'bg-[#ea384c] text-white';
      default:
        return 'bg-white';
    }
  };

  const calculatePriority = (impact: number, effort: number) => {
    return impact + (6 - effort);
  };

  const sortedOptimizations = [...optimizations].sort((a, b) => {
    const priorityA = calculatePriority(a.impact_level, a.effort_level);
    const priorityB = calculatePriority(b.impact_level, b.effort_level);
    return priorityB - priorityA;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-4 text-gray-900">
                <div className="flex items-center gap-1">
                  Priority
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="w-64 p-4">
                        <div className="space-y-3">
                          <div className="border rounded p-3 bg-gray-50">
                            <div className="text-center mb-2 font-semibold">Effort vs. Impact Matrix</div>
                            <div className="relative h-32 border-b border-l">
                              <div className="absolute -left-3 top-1/2 -translate-y-1/2 transform -rotate-90 text-xs">
                                Impact
                              </div>
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs">
                                Effort
                              </div>
                            </div>
                          </div>
                          <p className="text-sm">
                            Priority Score = Impact + (6 - Effort). The higher the Impact and the lower
                            the Effort, the higher the priority.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          </thead>
          <tbody>
            {sortedOptimizations.map((opt, index) => (
              <tr 
                key={opt.id} 
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-700 font-medium">{index + 1}</td>
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
                    <SelectTrigger className={`w-[130px] ${getStatusStyles(opt.status || "Pending")}`}>
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