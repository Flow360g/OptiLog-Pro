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

          {test.status === "completed" ? (
            <>
              <TestResultsChart results={test.results} />
              <TestResultsForm test={test} />
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Results will be available once the test is completed
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}