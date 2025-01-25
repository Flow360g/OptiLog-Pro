import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Test, TestResult } from "./types";
import { TestInformation } from "./test-details/TestInformation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader } from "./test-details/DialogHeader";
import { ResultsSection } from "./test-details/ResultsSection";
import { ExecutiveSummarySection } from "./test-details/ExecutiveSummarySection";

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
  const [executiveSummary, setExecutiveSummary] = useState(test.executive_summary || '');
  const [results, setResults] = useState<TestResult>(parseResults(test.results));
  const [localTest, setLocalTest] = useState<Test>(test);

  // Update local state when test prop changes
  useEffect(() => {
    setLocalTest(test);
    setResults(parseResults(test.results));
    setExecutiveSummary(test.executive_summary || '');
  }, [test]);

  // Subscribe to real-time updates for this specific test
  useEffect(() => {
    console.log('Subscribing to real-time updates for test:', test.id);
    
    const fetchCompleteTest = async (testId: string) => {
      const { data, error } = await supabase
        .from('tests')
        .select(`
          *,
          test_types (
            name,
            test_categories (
              name
            )
          )
        `)
        .eq('id', testId)
        .single();

      if (error) {
        console.error('Error fetching complete test data:', error);
        return null;
      }
      return data;
    };
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tests',
          filter: `id=eq.${test.id}`
        },
        async (payload) => {
          console.log('Received real-time update for test:', payload);
          const completeTest = await fetchCompleteTest(payload.new.id);
          if (completeTest) {
            setLocalTest(completeTest as Test);
            setResults(parseResults(completeTest.results));
            setExecutiveSummary(completeTest.executive_summary || '');
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from real-time updates for test:', test.id);
      supabase.removeChannel(channel);
    };
  }, [test.id]);

  const handleTestUpdate = async (updatedFields: Partial<Test>) => {
    if (updatedFields.platform && !['facebook', 'google', 'tiktok'].includes(updatedFields.platform)) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tests')
        .update(updatedFields)
        .eq('id', test.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setLocalTest(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          <DialogHeader test={localTest} results={results} />
          
          <TestInformation test={localTest} onSave={handleTestUpdate} />

          <ResultsSection 
            test={localTest}
            results={results}
            onResultsChange={setResults}
          />

          <ExecutiveSummarySection
            test={localTest}
            results={results}
            executiveSummary={executiveSummary}
            setExecutiveSummary={setExecutiveSummary}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}