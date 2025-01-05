import { Table } from "@/components/ui/table";
import { Optimization } from "@/types/optimization";
import { TableHeader } from "./optimization-table/TableHeader";
import { TableRow } from "./optimization-table/TableRow";

interface OptimizationTableProps {
  optimizations: Optimization[];
  onStatusChange: (optimizationId: string, newStatus: string) => void;
}

export function OptimizationTable({ optimizations, onStatusChange }: OptimizationTableProps) {
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
            <TableHeader optimizations={sortedOptimizations} />
          </thead>
          <tbody>
            {sortedOptimizations.map((opt, index) => (
              <TableRow
                key={opt.id}
                optimization={opt}
                index={index}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}