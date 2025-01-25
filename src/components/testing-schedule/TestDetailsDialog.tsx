import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test, TestResult, TestPlatform } from "./types";
import { TestInformation } from "./test-details/TestInformation";
import { TestResultsForm } from "./test-details/TestResultsForm";
import { TestResultsChart } from "./test-details/TestResultsChart";
import { TestSignificanceResults } from "./test-details/TestSignificanceResults";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generatePDF } from "./utils/pdfGenerator";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestDetailsDialogProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
}

const parseResults = (results: Test['results']): TestResult => {
  if (!results) return { control: "0", experiment: "0" };
  if (typeof results === 'string') {
    try {
      return JSON.parse(results) as TestResult;
    } catch {
      return { control: "0", experiment: "0" };
    }
  }
  return results as TestResult;
};

export function TestDetailsDialog({
  test,
  isOpen,
  onClose,
}: TestDetailsDialogProps) {
  const { toast } = useToast();
  const [executiveSummary, setExecutiveSummary] = useState(test.executive_summary || '');
  const [results, setResults] = useState<TestResult>(parseResults(test.results));
  const [localTest, setLocalTest] = useState<Test>(test);

  // Subscribe to real-time updates for this specific test
  useEffect(() => {
    console.log('Subscribing to real-time updates for test:', test.id);
    
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
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tests',
          filter: `id=eq.${test.id}`
        },
        async (payload) => {
          console.log('Received real-time update for test:', payload);
          const completeTest = await fetchCompleteTest(payload.new.id);
          if (completeTest) {
            setLocalTest(completeTest as Test);
            setResults(parseResults(completeTest.results));
            setExecutiveSummary(completeTest.executive_summary || '');
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from real-time updates for test:', test.id);
      supabase.removeChannel(channel);
    };
  }, [test.id]);

  const handleDownloadPDF = async () => {
    if (!localTest.results) return;
    const parsedResults = parseResults(localTest.results);
    await generatePDF({ ...localTest, results: parsedResults });
  };

  const handleResultsChange = async (newResults: TestResult) => {
    try {
      const { error } = await supabase
        .from('tests')
        .update({ 
          results: {
            control: newResults.control,
            experiment: newResults.experiment
          }
        })
        .eq('id', test.id);

      if (error) throw error;

      toast({
        title: "Results updated",
        description: "Test results have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating results:', error);
      toast({
        title: "Error updating results",
        description: "There was a problem saving the test results.",
        variant: "destructive",
      });
    }
  };

  const handleTestUpdate = async (updatedFields: Partial<Test>) => {
    if (updatedFields.platform && !['facebook', 'google', 'tiktok'].includes(updatedFields.platform)) {
      toast({
        title: "Invalid platform",
        description: "Platform must be either 'facebook', 'google', or 'tiktok'",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('tests')
        .update({
          ...updatedFields,
          platform: updatedFields.platform as TestPlatform
        })
        .eq('id', test.id);

      if (error) throw error;

      toast({
        title: "Test updated",
        description: "Test details have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating test:', error);
      toast({
        title: "Error updating test",
        description: "There was a problem saving the test details.",
        variant: "destructive",
      });
    }
  };

  const generateExecutiveSummary = () => {
    if (!results) return;
    
    const control = parseFloat(results.control);
    const experiment = parseFloat(results.experiment);
    const percentageChange = ((experiment - control) / control) * 100;
    const improvement = percentageChange > 0;
    
    const summary = `Test Results Summary:
The ${localTest.name} test ${improvement ? 'showed positive results' : 'did not show improvement'} for ${localTest.kpi}.
The experiment group ${improvement ? 'outperformed' : 'underperformed compared to'} the control group by ${Math.abs(percentageChange).toFixed(2)}%.
Control group: ${results.control}
Experiment group: ${results.experiment}`;

    setExecutiveSummary(summary);
    updateExecutiveSummary(summary);
  };

  const updateExecutiveSummary = async (summary: string) => {
    try {
      const { error } = await supabase
        .from('tests')
        .update({ executive_summary: summary })
        .eq('id', test.id);

      if (error) throw error;

      toast({
        title: "Executive summary updated",
        description: "The executive summary has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating executive summary:', error);
      toast({
        title: "Error updating executive summary",
        description: "There was a problem updating the executive summary.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{localTest.name}</h2>
            {results && (
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>

          <TestInformation test={localTest} onSave={handleTestUpdate} />

          <TestResultsChart results={results} kpi={localTest.kpi} />
          
          <TestResultsForm 
            results={results}
            kpi={localTest.kpi} 
            onChange={handleResultsChange}
          />

          {results && (
            <TestSignificanceResults
              controlRate={parseFloat(results.control)}
              experimentRate={parseFloat(results.experiment)}
              testId={test.id}
            />
          )}
          
          {!results && (
            <div className="text-center text-sm text-gray-500 mt-2">
              No results have been recorded yet
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="executive-summary">Executive Summary</Label>
              {results && (
                <Button
                  onClick={generateExecutiveSummary}
                  variant="outline"
                  size="sm"
                >
                  Generate Summary
                </Button>
              )}
            </div>
            <Textarea
              id="executive-summary"
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              onBlur={() => updateExecutiveSummary(executiveSummary)}
              placeholder="Enter or generate an executive summary for this test..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}