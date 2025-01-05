import { format } from "date-fns";
import { Optimization } from "@/types/optimization";
import { StatusCell } from "./table-row/StatusCell";
import { CategoriesCell } from "./table-row/CategoriesCell";
import { PlatformCell } from "./table-row/PlatformCell";

interface TableRowProps {
  optimization: Optimization;
  index: number;
  visibleColumns: string[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function TableRow({ optimization: opt, index, visibleColumns, onStatusChange }: TableRowProps) {
  const columnMap = {
    priority: <td className="p-4 text-gray-700 font-medium w-20">{index + 1}</td>,
    campaign: <td className="p-4 text-gray-700 w-48">{opt.campaign_name}</td>,
    platform: <PlatformCell platform={opt.platform} />,
    kpi: <td className="p-4 text-gray-700 w-32">{opt.kpi}</td>,
    action: <td className="p-4 text-gray-700 w-64">{opt.recommended_action}</td>,
    categories: <CategoriesCell categories={opt.categories} />,
    date: (
      <td className="p-4 text-gray-700 w-32">
        {format(new Date(opt.optimization_date), "MMM d, yyyy")}
      </td>
    ),
    added_by: <td className="p-4 text-gray-700 w-32">{opt.user_first_name || 'Unknown'}</td>,
    effort: <td className="p-4 text-gray-700 w-24">{opt.effort_level}</td>,
    impact: <td className="p-4 text-gray-700 w-24">{opt.impact_level}</td>,
    status: <StatusCell 
      status={opt.status || "Pending"} 
      optimizationId={opt.id} 
      onStatusChange={onStatusChange} 
    />
  };

  // Sort cells based on visibleColumns order
  const sortedCells = visibleColumns.map(columnKey => 
    columnMap[columnKey as keyof typeof columnMap]
  );

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {sortedCells}
    </tr>
  );
}