import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test, TestResult } from "../types";
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
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@/components/ui/dialog";

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
  const [editedTest, setEditedTest] = useState({
    name: test.name,
    hypothesis: test.hypothesis,
    kpi: test.kpi,
    start_date: test.start_date || '',
    end_date: test.end_date || ''
  });

  const handleDownloadPDF = async () => {
    if (!test.results) return;
    const parsedResults = parseResults(test.results);
    await generatePDF({ ...test, results: parsedResults });
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

      setResults(newResults);
      
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

  const handleTestUpdate = async () => {
    try {
      const { error } = await supabase
        .from('tests')
        .update({
          name: editedTest.name,
          hypothesis: editedTest.hypothesis,
          kpi: editedTest.kpi,
          start_date: editedTest.start_date,
          end_date: editedTest.end_date
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
The ${editedTest.name} test ${improvement ? 'showed positive results' : 'did not show improvement'} for ${editedTest.kpi}.
The experiment group ${improvement ? 'outperformed' : 'underperformed compared to'} the control group by ${Math.abs(percentageChange).toFixed(2)}%.
Control group: ${results.control}
Experiment group: ${results.experiment}`;

    setExecutiveSummary(summary);
    updateExecutiveSummary(summary);
  };

  const updateExecutiveSummary = async (summary: string) => {
    const { error } = await supabase
      .from('tests')
      .update({ executive_summary: summary })
      .eq('id', test.id);

    if (error) {
      toast({
        title: "Error updating executive summary",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Executive summary updated",
        description: "The executive summary has been saved successfully.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-xl font-semibold">Test Details</DialogTitle>
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1 mr-4">
              <Label htmlFor="test-name">Test Name</Label>
              <Input
                id="test-name"
                value={editedTest.name}
                onChange={(e) => setEditedTest(prev => ({ ...prev, name: e.target.value }))}
                onBlur={handleTestUpdate}
                className="w-full"
              />
            </div>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hypothesis">Hypothesis</Label>
              <Textarea
                id="hypothesis"
                value={editedTest.hypothesis}
                onChange={(e) => setEditedTest(prev => ({ ...prev, hypothesis: e.target.value }))}
                onBlur={handleTestUpdate}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kpi">KPI</Label>
              <Input
                id="kpi"
                value={editedTest.kpi}
                onChange={(e) => setEditedTest(prev => ({ ...prev, kpi: e.target.value }))}
                onBlur={handleTestUpdate}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={editedTest.start_date}
                  onChange={(e) => setEditedTest(prev => ({ ...prev, start_date: e.target.value }))}
                  onBlur={handleTestUpdate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={editedTest.end_date}
                  onChange={(e) => setEditedTest(prev => ({ ...prev, end_date: e.target.value }))}
                  onBlur={handleTestUpdate}
                />
              </div>
            </div>
          </div>

          <TestResultsChart results={results} kpi={editedTest.kpi} />
          
          <TestResultsForm 
            results={results}
            kpi={editedTest.kpi} 
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