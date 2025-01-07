import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  [key: string]: string; // This makes TestResult indexable by string, matching Json type
  control: string;
  experiment: string;
}

interface Test {
  id: string;
  name: string;
  platform: string;
  kpi: string;
  hypothesis: string;
  start_date: string | null;
  end_date: string | null;
  effort_level: number | null;
  impact_level: number | null;
  results: TestResult | null;
  test_types: {
    name: string;
    test_categories: {
      name: string;
    };
  };
}

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Platform</p>
              <p className="text-sm text-gray-500">{test.platform}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">KPI</p>
              <p className="text-sm text-gray-500">{test.kpi}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Test Type</p>
            <p className="text-sm text-gray-500">
              {test.test_types.test_categories.name} - {test.test_types.name}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Hypothesis</p>
            <p className="text-sm text-gray-500">{test.hypothesis}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="control">Control {test.kpi}</Label>
              <Input
                id="control"
                value={results.control}
                onChange={(e) => setResults({ ...results, control: e.target.value })}
                placeholder="Enter control value"
              />
            </div>

            <div>
              <Label htmlFor="experiment">Experiment {test.kpi}</Label>
              <Input
                id="experiment"
                value={results.experiment}
                onChange={(e) => setResults({ ...results, experiment: e.target.value })}
                placeholder="Enter experiment value"
              />
            </div>
          </div>

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