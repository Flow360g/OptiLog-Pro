import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { ClientSelectionScreen } from "@/components/testing-schedule/ClientSelectionScreen";
import { Button } from "@/components/ui/button";
import { TestsTable } from "@/components/testing-schedule/TestsTable";
import { generateGanttPDF } from "@/components/testing-schedule/utils/pdf/ganttChartGenerator";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUserClients } from "@/hooks/useUserClients";
import { useNavigate } from "react-router-dom";

export default function TestingSchedule() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { data: userClients = [], isLoading: isClientsLoading } = useUserClients();
  const navigate = useNavigate();

  // Check session and redirect if not logged in
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
      return;
    }
  }, [session, isSessionLoading, navigate]);

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

      return data;
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
    if (!tests || !selectedClient) return;
    
    try {
      await generateGanttPDF(tests, selectedClient);
      toast({
        title: "Success",
        description: "Gantt chart PDF has been generated and downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate Gantt chart PDF.",
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

  // Only show loading state while checking session
  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If no session, redirect to login
  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isClientsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading client data...</p>
            </div>
          ) : userClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No clients assigned. Please update your settings.</p>
            </div>
          ) : selectedClient ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBackClick}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Client Selection
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadGantt}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Gantt Chart
                </Button>
              </div>
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
