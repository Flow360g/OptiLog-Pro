import { Table } from "@/components/ui/table";
import { Optimization } from "@/types/optimization";
import { TableHeader } from "./optimization-table/TableHeader";
import { TableRow } from "./optimization-table/TableRow";
import { useState } from "react";

interface OptimizationTableProps {
  optimizations: Optimization[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function OptimizationTable({ optimizations, onStatusChange }: OptimizationTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "priority",
    "campaign",
    "platform",
    "kpi",
    "action",
    "categories",
    "added_by",
    "status"
  ]);

  const calculatePriority = (impact: number, effort: number) => {
    return impact + (6 - effort);
  };

  const sortedOptimizations = [...optimizations].sort((a, b) => {
    const priorityA = calculatePriority(a.impact_level, a.effort_level);
    const priorityB = calculatePriority(b.impact_level, b.effort_level);
    return priorityB - priorityA;
  });

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <TableHeader 
              optimizations={sortedOptimizations}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
            />
          </thead>
          <tbody>
            {sortedOptimizations.map((opt, index) => (
              <TableRow
                key={opt.id}
                optimization={opt}
                index={index}
                visibleColumns={visibleColumns}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}