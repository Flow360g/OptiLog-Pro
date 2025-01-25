import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Test, TestResult } from "../types";
import { TestInformation } from "./TestInformation";
import { TestResultsForm } from "./TestResultsForm";
import { TestResultsChart } from "./TestResultsChart";
import { TestSignificanceResults } from "./TestSignificanceResults";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestDetailsDialogProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedTest: Test) => void;
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
  onSave
}: TestDetailsDialogProps) {
  const { toast } = useToast();
  const [executiveSummary, setExecutiveSummary] = useState(test.executive_summary || '');
  const [results, setResults] = useState<TestResult>(parseResults(test.results));

  const handleDownloadPDF = async () => {
    if (!test.results) return;
    const parsedResults = parseResults(test.results);
    await generatePDF({ ...test, results: parsedResults });
  };

  const handleResultsChange = async (newResults: TestResult) => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .update({ 
          results: {
            control: newResults.control,
            experiment: newResults.experiment
          }
        })
        .eq('id', test.id)
        .select(`
          *,
          test_types (
            name,
            test_categories (
              name
            )
          )
        `)
        .single();

      if (error) throw error;

      if (data) {
        setResults(newResults);
        onSave?.(data as Test);
        
        toast({
          title: "Results updated",
          description: "Test results have been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating results:', error);
      toast({
        title: "Error updating results",
        description: "There was a problem saving the test results.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold mb-4">Test Details</DialogTitle>
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            {results && (
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2 ml-auto"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>

          <TestInformation test={test} onSave={onSave} />

          <TestResultsChart results={results} kpi={test.kpi} />
          
          <TestResultsForm 
            results={results}
            kpi={test.kpi} 
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
            </div>
            <Textarea
              id="executive-summary"
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              onBlur={async () => {
                const { data, error } = await supabase
                  .from('tests')
                  .update({ executive_summary: executiveSummary })
                  .eq('id', test.id)
                  .select(`
                    *,
                    test_types (
                      name,
                      test_categories (
                        name
                      )
                    )
                  `)
                  .single();
                
                if (error) {
                  console.error('Error updating executive summary:', error);
                  toast({
                    title: "Error updating executive summary",
                    description: error.message,
                    variant: "destructive",
                  });
                } else if (data) {
                  onSave?.(data as Test);
                  toast({
                    title: "Executive summary updated",
                    description: "The executive summary has been saved successfully.",
                  });
                }
              }}
              placeholder="Enter or generate an executive summary for this test..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}