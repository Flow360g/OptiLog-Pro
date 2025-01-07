import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TestInformation } from "./test-details/TestInformation";
import { TestResultsForm } from "./test-details/TestResultsForm";
import { Test, TestResult } from "./types";

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