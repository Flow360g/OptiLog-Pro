import { PriorityTooltip } from "./PriorityTooltip";
import { Optimization } from "@/types/optimization";

interface TableHeaderProps {
  optimizations: Optimization[];
  visibleColumns: string[];
}

export function TableHeader({ optimizations, visibleColumns }: TableHeaderProps) {
  const columns = [
    { key: "priority", label: "Priority", width: "w-20" },
    { key: "campaign", label: "Campaign", width: "w-48" },
    { key: "platform", label: "Platform", width: "w-24" },
    { key: "kpi", label: "KPI", width: "w-32" },
    { key: "action", label: "Action", width: "w-64" },
    { key: "categories", label: "Categories", width: "w-48" },
    { key: "date", label: "Date", width: "w-32" },
    { key: "added_by", label: "Added By", width: "w-32" },
    { key: "effort", label: "Effort", width: "w-24" },
    { key: "impact", label: "Impact", width: "w-24" },
    { key: "status", label: "Status", width: "w-32" },
  ];

  return (
    <tr className="bg-gray-50 border-b border-gray-200">
      {columns.map((column) => 
        visibleColumns.includes(column.key) && (
          <th 
            key={column.key} 
            className={`p-4 text-left text-gray-600 font-medium whitespace-nowrap ${column.width}`}
          >
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