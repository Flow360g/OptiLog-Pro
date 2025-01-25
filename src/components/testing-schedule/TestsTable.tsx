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

  // Subscribe to real-time updates
  useEffect(() => {
    if (!tests.length) return; // Only subscribe if we have tests

    // Get the client from the first test since all tests in a view are for the same client
    const client = tests[0].client;

    console.log('Subscribing to real-time updates for client:', client);

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tests',
          filter: `client=eq.${client}`
        },
        async (payload) => {
          console.log('Received real-time update:', payload);

          // Fetch the complete test data including relations when we receive an update
          const fetchCompleteTest = async (testId: string) => {
            const { data, error } = await supabase
              .from('tests')
              .select(`
                *,
                test_types (
                  name,
                  test_categories (
                    name
                  )
                )
              `)
              .eq('id', testId)
              .single();

            if (error) {
              console.error('Error fetching complete test data:', error);
              return null;
            }
            return data;
          };

          if (payload.eventType === 'UPDATE') {
            const completeTest = await fetchCompleteTest(payload.new.id);
            if (completeTest) {
              setTests(prevTests => 
                prevTests.map(test => 
                  test.id === completeTest.id ? completeTest : test
                )
              );
              // Also update the selected test if it's the one being viewed
              if (selectedTest?.id === completeTest.id) {
                setSelectedTest(completeTest);
              }
            }
          } else if (payload.eventType === 'INSERT') {
            const completeTest = await fetchCompleteTest(payload.new.id);
            if (completeTest) {
              setTests(prevTests => [...prevTests, completeTest]);
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedTest = payload.old as Test;
            setTests(prevTests => 
              prevTests.filter(test => test.id !== deletedTest.id)
            );
            if (selectedTest?.id === deletedTest.id) {
              setSelectedTest(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from real-time updates');
      supabase.removeChannel(channel);
    };
  }, [tests, selectedTest]);

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

      toast({
        title: "Status updated",
        description: "Test status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
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
              <TableHeader tests={sortedTests} />
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