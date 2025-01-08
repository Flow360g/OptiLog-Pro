import { Table } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { TestDetailsDialog } from "./TestDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Test } from "./types";
import { TableHeader } from "./table/TableHeader";
import { TableRow } from "./table/TableRow";

interface TestsTableProps {
  tests: Test[];
}

export function TestsTable({ tests: initialTests }: TestsTableProps) {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const { toast } = useToast();

  // Update local state when props change
  useEffect(() => {
    setTests(initialTests);
  }, [initialTests]);

  const calculatePriority = (impact: number, effort: number) => {
    return impact + (6 - effort);
  };

  const sortedTests = [...tests].sort((a, b) => {
    if (!a.impact_level || !a.effort_level || !b.impact_level || !b.effort_level) return 0;
    const priorityA = calculatePriority(a.impact_level, a.effort_level);
    const priorityB = calculatePriority(b.impact_level, b.effort_level);
    return priorityB - priorityA;
  });

  const handleStatusChange = async (testId: string, newStatus: Test['status']) => {
    try {
      const { error } = await supabase
        .from('tests')
        .update({ status: newStatus })
        .eq('id', testId);

      if (error) throw error;

      // Update local state immediately
      setTests(prevTests => 
        prevTests.map(test => 
          test.id === testId ? { ...test, status: newStatus } : test
        )
      );

      toast({
        title: "Status updated",
        description: "Test status has been updated successfully.",
        duration: 2000,
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
              <TableHeader />
            </thead>
            <tbody>
              {sortedTests.map((test, index) => (
                <TableRow
                  key={test.id}
                  test={test}
                  index={index}
                  onStatusChange={handleStatusChange}
                  onRowClick={setSelectedTest}
                />
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