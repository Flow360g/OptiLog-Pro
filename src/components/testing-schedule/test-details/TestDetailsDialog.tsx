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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [editedTest, setEditedTest] = useState({
    name: test.name,
    hypothesis: test.hypothesis,
    kpi: test.kpi,
    start_date: test.start_date || '',
    end_date: test.end_date || '',
    platform: test.platform as "facebook" | "google" | "tiktok",
    status: test.status,
    test_type_id: test.test_type_id
  });

  const handleTestUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .update(editedTest)
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
        onSave?.(data as Test);
        toast({
          title: "Test updated",
          description: "Test details have been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating test:', error);
      toast({
        title: "Error updating test",
        description: "There was a problem saving the test details.",
        variant: "destructive",
      });
    }
  };

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

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select 
              value={editedTest.platform}
              onValueChange={(value: "facebook" | "google" | "tiktok") => {
                setEditedTest(prev => ({ ...prev, platform: value }));
                handleTestUpdate();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={editedTest.status}
              onValueChange={(value: "draft" | "in_progress" | "completed" | "cancelled" | "scheduled") => {
                setEditedTest(prev => ({ ...prev, status: value }));
                handleTestUpdate();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Planning</SelectItem>
                <SelectItem value="in_progress">Working on it</SelectItem>
                <SelectItem value="completed">Live</SelectItem>
                <SelectItem value="cancelled">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                  .select()
                  .single();
                
                if (error) {
                  console.error('Error updating executive summary:', error);
                  toast({
                    title: "Error updating executive summary",
                    description: error.message,
                    variant: "destructive",
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
