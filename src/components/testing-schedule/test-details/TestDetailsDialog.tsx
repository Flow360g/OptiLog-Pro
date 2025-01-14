import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test, isTestResult } from "../types";
import { TestInformation } from "./TestInformation";
import { TestResultsForm } from "./TestResultsForm";
import { TestResultsChart } from "./TestResultsChart";
import { TestSignificanceResults } from "./TestSignificanceResults";
import { generatePDF } from "../utils/pdfGenerator";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DialogHeader } from "./DialogHeader";
import { ExecutiveSummarySection } from "./ExecutiveSummarySection";

interface TestDetailsDialogProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
}

export function TestDetailsDialog({
  test,
  isOpen,
  onClose,
}: TestDetailsDialogProps) {
  const { toast } = useToast();
  const [executiveSummary, setExecutiveSummary] = useState(test.executive_summary || '');
  const [currentResults, setCurrentResults] = useState(test.results || {
    control: "0",
    experiment: "0"
  });

  const handleDownloadPDF = async () => {
    if (!test.results || !isTestResult(test.results)) return;
    await generatePDF({ ...test, results: test.results });
  };

  const generateExecutiveSummary = () => {
    if (!currentResults || !isTestResult(currentResults)) return;
    
    const control = parseFloat(currentResults.control);
    const experiment = parseFloat(currentResults.experiment);
    const percentageChange = ((experiment - control) / control) * 100;
    const improvement = percentageChange > 0;
    
    const summary = `Test Results Summary:
The ${test.name} test ${improvement ? 'showed positive results' : 'did not show improvement'} for ${test.kpi}.
The experiment group ${improvement ? 'outperformed' : 'underperformed compared to'} the control group by ${Math.abs(percentageChange).toFixed(2)}%.
Control group: ${currentResults.control}
Experiment group: ${currentResults.experiment}`;

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

  const handleResultsChange = async (newResults: { control: string; experiment: string }) => {
    setCurrentResults(newResults);
    
    const { error } = await supabase
      .from('tests')
      .update({ results: newResults })
      .eq('id', test.id);

    if (error) {
      toast({
        title: "Error updating results",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const defaultResults = {
    control: "0",
    experiment: "0"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          <DialogHeader test={test} onDownloadPDF={handleDownloadPDF} />

          <TestInformation test={test} />

          <TestResultsChart 
            results={isTestResult(currentResults) ? currentResults : defaultResults} 
            kpi={test.kpi} 
          />
          
          <TestResultsForm 
            results={isTestResult(currentResults) ? currentResults : defaultResults}
            kpi={test.kpi} 
            onChange={handleResultsChange}
          />

          {currentResults && isTestResult(currentResults) && (
            <TestSignificanceResults
              controlRate={parseFloat(currentResults.control)}
              experimentRate={parseFloat(currentResults.experiment)}
              testId={test.id}
            />
          )}
          
          {!currentResults && (
            <div className="text-center text-sm text-gray-500 mt-2">
              No results have been recorded yet
            </div>
          )}

          <ExecutiveSummarySection
            executiveSummary={executiveSummary}
            onSummaryChange={setExecutiveSummary}
            onSummaryBlur={() => updateExecutiveSummary(executiveSummary)}
            onGenerateSummary={generateExecutiveSummary}
            hasResults={!!currentResults && isTestResult(currentResults)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}