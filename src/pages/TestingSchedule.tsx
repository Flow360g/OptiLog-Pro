import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { ClientSelectionScreen } from "@/components/testing-schedule/ClientSelectionScreen";
import { Button } from "@/components/ui/button";
import { TestsTable } from "@/components/testing-schedule/TestsTable";

export default function TestingSchedule() {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const { data: tests, isLoading } = useQuery({
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

  const handleBackClick = () => {
    setSelectedClient(null);
  };

  const groupTestsByStatus = (tests: any[]) => {
    return {
      pipeline: tests.filter(test => test.status === 'draft'),
      upcoming: tests.filter(test => test.status === 'scheduled'),
      live: tests.filter(test => test.status === 'in_progress'),
      completed: tests.filter(test => test.status === 'completed')
    };
  };

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
                <div className="space-y-8">
                  {tests && Object.entries(groupTestsByStatus(tests)).map(([status, statusTests]) => (
                    statusTests.length > 0 && (
                      <section key={status} className="space-y-4">
                        <h2 className="text-2xl font-semibold capitalize">
                          {status === 'pipeline' ? 'Test Pipeline' :
                           status === 'upcoming' ? 'Up Next' :
                           status === 'live' ? 'Live Tests' :
                           'Completed Tests'}
                        </h2>
                        <TestsTable tests={statusTests} />
                      </section>
                    )
                  ))}
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