import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { ClientSelectionScreen } from "@/components/testing-schedule/ClientSelectionScreen";
import { Button } from "@/components/ui/button";
import { TestsTable } from "@/components/testing-schedule/TestsTable";
import { generateGanttChartPDF } from "@/components/testing-schedule/utils/pdf/ganttChartGenerator";
import { Test, isTestResult } from "@/components/testing-schedule/types";

export default function TestingSchedule() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const { data: tests, isLoading, refetch } = useQuery({
    queryKey: ['tests', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return [];

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
        .eq('client', selectedClient)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching tests",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      // Transform the data to ensure it matches the Test type
      return data.map((test): Test => ({
        ...test,
        results: test.results ? (isTestResult(test.results) ? test.results : null) : null,
      }));
    },
    enabled: !!selectedClient,
  });

  useEffect(() => {
    if (!selectedClient) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tests',
          filter: `client=eq.${selectedClient}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClient, refetch]);

  const handleBackClick = () => {
    setSelectedClient(null);
  };

  const handleDownloadGantt = async () => {
    if (!tests) return;
    
    try {
      await generateGanttChartPDF(tests);
      toast({
        title: "Success",
        description: "Gantt chart PDF has been generated and downloaded.",
      });
    } catch (error) {
      console.error('Error generating Gantt chart:', error);
      toast({
        title: "Error",
        description: "There was a problem generating the Gantt chart PDF.",
        variant: "destructive",
      });
    }
  };

  const groupTestsByStatus = (tests: any[]) => {
    return {
      pipeline: tests.filter(test => test.status === 'draft'),
      upcoming: tests.filter(test => test.status === 'in_progress'),
      live: tests.filter(test => test.status === 'completed'),
      completed: tests.filter(test => test.status === 'cancelled')
    };
  };

  const sections = [
    { key: 'pipeline', title: 'Test Pipeline' },
    { key: 'upcoming', title: 'Up Next' },
    { key: 'live', title: 'Live Tests' },
    { key: 'completed', title: 'Completed Tests' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {selectedClient ? (
            <>
              <Button
                variant="ghost"
                onClick={handleBackClick}
                className="flex items-center gap-2 mb-6"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Client Selection
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900">
                  Testing Schedule
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  {selectedClient.toUpperCase()}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-6">
                    <Button
                      onClick={handleDownloadGantt}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Gantt Chart
                    </Button>
                  </div>
                  <div className="space-y-8">
                    {tests && sections.map(({ key, title }) => {
                      const sectionTests = groupTestsByStatus(tests)[key as keyof ReturnType<typeof groupTestsByStatus>];
                      return (
                        <section key={key} className="space-y-4">
                          <h2 className="text-2xl font-semibold">
                            {title}
                          </h2>
                          {sectionTests.length > 0 ? (
                            <TestsTable tests={sectionTests} />
                          ) : (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
                              No tests are currently in this section
                            </div>
                          )}
                        </section>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <ClientSelectionScreen onClientSelect={setSelectedClient} />
          )}
        </div>
      </div>
    </div>
  );
}