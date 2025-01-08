import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TestInformation } from "./test-details/TestInformation";
import { TestResultsForm } from "./test-details/TestResultsForm";
import { TestResultsChart } from "./test-details/TestResultsChart";
import { generateTestResultsPDF } from "./utils/pdfGenerator";
import { Test, TestResult } from "./types";
import { Download } from "lucide-react";

interface TestDetailsDialogProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
}

export function TestDetailsDialog({ test, isOpen, onClose }: TestDetailsDialogProps) {
  const { toast } = useToast();
  const [results, setResults] = useState<TestResult>(
    test.results || { control: "", experiment: "" }
  );

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("tests")
        .update({ results })
        .eq("id", test.id);

      if (error) throw error;

      toast({
        title: "Results saved",
        description: "Test results have been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error saving results",
        description: "There was a problem saving the test results.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    generateTestResultsPDF({ ...test, results });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{test.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <TestInformation test={test} />
          <TestResultsForm 
            results={results}
            kpi={test.kpi}
            onChange={setResults}
          />

          {results.control && results.experiment && (
            <>
              <TestResultsChart results={results} kpi={test.kpi} />
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
              >
                <Download className="w-4 h-4" />
                Download Results PDF
              </Button>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Results</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}