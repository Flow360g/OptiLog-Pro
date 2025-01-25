import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test, TestResult } from "../types";
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
  const parsedResults = parseResults(test.results);

  const handleDownloadPDF = async () => {
    if (!test.results) return;
    await generatePDF({ ...test, results: parseResults(test.results) });
  };

  const generateExecutiveSummary = () => {
    if (!parsedResults) return;
    
    const control = parseFloat(parsedResults.control);
    const experiment = parseFloat(parsedResults.experiment);
    const percentageChange = ((experiment - control) / control) * 100;
    const improvement = percentageChange > 0;
    
    const summary = `Test Results Summary:
The ${test.name} test ${improvement ? 'showed positive results' : 'did not show improvement'} for ${test.kpi}.
The experiment group ${improvement ? 'outperformed' : 'underperformed compared to'} the control group by ${Math.abs(percentageChange).toFixed(2)}%.
Control group: ${parsedResults.control}
Experiment group: ${parsedResults.experiment}`;

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

          <TestResultsChart results={parsedResults || defaultResults} kpi={test.kpi} />
          
          <TestResultsForm 
            results={parsedResults || defaultResults} 
            kpi={test.kpi} 
            onChange={() => {}}
          />

          {parsedResults && (
            <TestSignificanceResults
              controlRate={parseFloat(parsedResults.control)}
              experimentRate={parseFloat(parsedResults.experiment)}
              testId={test.id}
            />
          )}
          
          {!parsedResults && (
            <div className="text-center text-sm text-gray-500 mt-2">
              No results have been recorded yet
            </div>
          )}

          <ExecutiveSummarySection
            executiveSummary={executiveSummary}
            onSummaryChange={setExecutiveSummary}
            onSummaryBlur={() => updateExecutiveSummary(executiveSummary)}
            onGenerateSummary={generateExecutiveSummary}
            hasResults={!!parsedResults}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}