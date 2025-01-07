import { Table } from "@/components/ui/table";
import { format } from "date-fns";

interface Test {
  id: string;
  name: string;
  platform: string;
  kpi: string;
  hypothesis: string;
  start_date: string | null;
  end_date: string | null;
  effort_level: number | null;
  impact_level: number | null;
  test_types: {
    name: string;
    test_categories: {
      name: string;
    };
  };
}

interface TestsTableProps {
  tests: Test[];
}

export function TestsTable({ tests }: TestsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-left text-gray-600 font-medium w-48">Name</th>
              <th className="p-4 text-left text-gray-600 font-medium w-24">Platform</th>
              <th className="p-4 text-left text-gray-600 font-medium w-32">KPI</th>
              <th className="p-4 text-left text-gray-600 font-medium w-48">Type</th>
              <th className="p-4 text-left text-gray-600 font-medium w-64">Hypothesis</th>
              <th className="p-4 text-left text-gray-600 font-medium w-32">Start Date</th>
              <th className="p-4 text-left text-gray-600 font-medium w-32">End Date</th>
              <th className="p-4 text-left text-gray-600 font-medium w-24">Effort</th>
              <th className="p-4 text-left text-gray-600 font-medium w-24">Impact</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}