import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test } from "./types";
import { TestInformation } from "./test-details/TestInformation";
import { TestResultsForm } from "./test-details/TestResultsForm";
import { TestResultsChart } from "./test-details/TestResultsChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generatePDF } from "./utils/pdfGenerator";

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
  const handleDownloadPDF = async () => {
    if (!test.results) return;
    await generatePDF(test);
  };

  const defaultResults = {
    control: "0",
    experiment: "0"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{test.name}</h2>
            {test.results && (
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

          <TestInformation test={test} />

          <TestResultsChart results={test.results || defaultResults} kpi={test.kpi} />
          <TestResultsForm 
            results={test.results || defaultResults} 
            kpi={test.kpi} 
            onChange={() => {}}
          />
          
          {!test.results && (
            <div className="text-center text-sm text-gray-500 mt-2">
              No results have been recorded yet
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}