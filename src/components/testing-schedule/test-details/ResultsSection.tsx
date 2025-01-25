import { Test, TestResult } from "../types";
import { TestResultsChart } from "./TestResultsChart";
import { TestResultsForm } from "./TestResultsForm";
import { TestSignificanceResults } from "./TestSignificanceResults";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface ResultsSectionProps {
  test: Test;
  results: TestResult;
  onResultsChange: (results: TestResult) => void;
}

export function ResultsSection({ test, results, onResultsChange }: ResultsSectionProps) {
  const { toast } = useToast();

  const handleResultsChange = async (newResults: TestResult) => {
    try {
      // Merge the new results with any existing statistical data
      const updatedResults: TestResult = {
        control: newResults.control,
        experiment: newResults.experiment,
        statistical_data: results.statistical_data
      };

      const { error } = await supabase
        .from('tests')
        .update({ results: updatedResults as Json })
        .eq('id', test.id);

      if (error) throw error;

      onResultsChange(updatedResults);
      
      toast({
        title: "Results updated",
        description: "Test results have been saved successfully.",
      });
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
    <>
      <TestResultsChart results={results} kpi={test.kpi} />
      
      <TestResultsForm 
        results={results}
        kpi={test.kpi} 
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
    </>
  );
}