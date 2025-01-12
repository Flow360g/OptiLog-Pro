import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test } from "../types";
import { TestInformation } from "./TestInformation";
import { TestResultsForm } from "./TestResultsForm";
import { TestResultsChart } from "./TestResultsChart";
import { TestSignificanceResults } from "./TestSignificanceResults";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "../utils/pdfGenerator";
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
  const [executiveSummary, setExecutiveSummary] = useState(
    test.executive_summary || ""
  );

  const handleDownloadPDF = async () => {
    if (!test.results) return;
    await generatePDF(test);
  };

  const generateExecutiveSummary = () => {
    if (!test.results) return;

    const control = parseFloat(test.results.control);
    const experiment = parseFloat(test.results.experiment);
    const percentageChange = ((experiment - control) / control) * 100;
    const improvement = percentageChange > 0;

    const summary = `Test Results Summary:
The ${test.name} test ${
      improvement ? "showed positive results" : "did not show improvement"
    } for ${test.kpi}.
The experiment group ${
      improvement ? "outperformed" : "underperformed compared to"
    } the control group by ${Math.abs(percentageChange).toFixed(2)}%.
Control group: ${test.results.control}
Experiment group: ${test.results.experiment}`;

    setExecutiveSummary(summary);
    updateExecutiveSummary(summary);
  };

  const updateExecutiveSummary = async (summary: string) => {
    const { error } = await supabase
      .from("tests")
      .update({ executive_summary: summary })
      .eq("id", test.id);

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
    experiment: "0",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          <DialogHeader test={test} onDownloadPDF={handleDownloadPDF} />

          <TestInformation test={test} />

          <TestResultsChart
            results={test.results || defaultResults}
            kpi={test.kpi}
          />

          <TestResultsForm
            results={test.results || defaultResults}
            kpi={test.kpi}
            onChange={() => {}}
          />

          {test.results && (
            <TestSignificanceResults
              controlRate={parseFloat(test.results.control)}
              experimentRate={parseFloat(test.results.experiment)}
              testId={test.id}
            />
          )}

          {!test.results && (
            <div className="text-center text-sm text-gray-500 mt-2">
              No results have been recorded yet
            </div>
          )}

          <ExecutiveSummarySection
            executiveSummary={executiveSummary}
            onSummaryChange={setExecutiveSummary}
            onSummaryBlur={() => updateExecutiveSummary(executiveSummary)}
            onGenerateSummary={generateExecutiveSummary}
            hasResults={!!test.results}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}