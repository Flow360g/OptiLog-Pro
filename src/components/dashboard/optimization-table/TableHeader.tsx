import { PriorityTooltip } from "./PriorityTooltip";
import { Optimization } from "@/types/optimization";

interface TableHeaderProps {
  optimizations: Optimization[];
  visibleColumns: string[];
}

export function TableHeader({ optimizations, visibleColumns }: TableHeaderProps) {
  const columns = [
    { key: "priority", label: "Priority" },
    { key: "campaign", label: "Campaign" },
    { key: "platform", label: "Platform" },
    { key: "kpi", label: "KPI" },
    { key: "action", label: "Action" },
    { key: "categories", label: "Categories" },
    { key: "date", label: "Date" },
    { key: "added_by", label: "Added By" },
    { key: "effort", label: "Effort" },
    { key: "impact", label: "Impact" },
    { key: "status", label: "Status" },
  ];

  return (
    <tr className="bg-gray-50 border-b border-gray-200">
      {columns.map((column) => 
        visibleColumns.includes(column.key) && (
          <th key={column.key} className="p-4 text-left text-gray-600 font-medium">
            {column.key === "priority" ? (
              <div className="flex items-center gap-2">
                {column.label}
                <PriorityTooltip optimizations={optimizations} />
              </div>
            ) : (
              column.label
            )}
          </th>
        )
      )}
    </tr>
  );
}