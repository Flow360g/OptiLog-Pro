import { Table } from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { TestDetailsDialog } from "./TestDetailsDialog";
import { PriorityTooltip } from "@/components/dashboard/optimization-table/PriorityTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  status: "draft" | "scheduled" | "in_progress" | "completed" | "cancelled";
  results: {
    control: string;
    experiment: string;
  } | null;
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
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const calculatePriority = (impact: number, effort: number) => {
    return impact + (6 - effort);
  };

  const sortedTests = [...tests].sort((a, b) => {
    if (!a.impact_level || !a.effort_level || !b.impact_level || !b.effort_level) return 0;
    const priorityA = calculatePriority(a.impact_level, a.effort_level);
    const priorityB = calculatePriority(b.impact_level, b.effort_level);
    return priorityB - priorityA;
  });

  const handleStatusChange = async (testId: string, newStatus: "draft" | "scheduled" | "in_progress" | "completed" | "cancelled") => {
    try {
      const { error } = await supabase
        .from('tests')
        .update({ status: newStatus })
        .eq('id', testId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: "Test status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "There was a problem updating the test status.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-left text-gray-600 font-medium w-12">
                  <div className="flex items-center gap-1">
                    Priority
                    <PriorityTooltip optimizations={sortedTests as any} />
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
            </thead>
            <tbody>
              {sortedTests.map((test, index) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTest(test)}
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
                    <Select
                      value={test.status}
                      onValueChange={(value) => handleStatusChange(test.id, value as Test['status'])}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Planning</SelectItem>
                        <SelectItem value="in_progress">Working on it</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {selectedTest && (
        <TestDetailsDialog
          test={selectedTest}
          isOpen={!!selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </>
  );
}