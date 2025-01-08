import { format } from "date-fns";
import { Test } from "../types";
import { StatusSelect } from "./StatusSelect";

interface TableRowProps {
  test: Test;
  index: number;
  onStatusChange: (testId: string, newStatus: Test['status']) => void;
  onRowClick: (test: Test) => void;
}

export function TableRow({ test, index, onStatusChange, onRowClick }: TableRowProps) {
  return (
    <tr
      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onRowClick(test)}
    >
      <td className="p-4 text-gray-700">{index + 1}</td>
      <td className="p-4 text-gray-700">{test.name}</td>
      <td className="p-4 text-gray-700">{test.platform}</td>
      <td className="p-4 text-gray-700">{test.kpi}</td>
      <td className="p-4 text-gray-700">
        {test.test_types.test_categories.name} - {test.test_types.name}
      </td>
      <td className="p-4 text-gray-700">{test.hypothesis}</td>
      <td className="p-4 text-gray-700">
        {test.start_date ? format(new Date(test.start_date), "MMM d, yyyy") : "-"}
      </td>
      <td className="p-4 text-gray-700">
        {test.end_date ? format(new Date(test.end_date), "MMM d, yyyy") : "-"}
      </td>
      <td className="p-4 text-gray-700">{test.effort_level || "-"}</td>
      <td className="p-4 text-gray-700">{test.impact_level || "-"}</td>
      <td className="p-4 text-gray-700" onClick={(e) => e.stopPropagation()}>
        <StatusSelect
          status={test.status}
          onStatusChange={(newStatus) => onStatusChange(test.id, newStatus)}
        />
      </td>
    </tr>
  );
}