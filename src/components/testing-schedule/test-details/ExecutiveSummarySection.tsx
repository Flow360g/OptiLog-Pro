import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Test, TestResult } from "../types";

interface ExecutiveSummarySectionProps {
  test: Test;
  results: TestResult;
  executiveSummary: string;
  setExecutiveSummary: (summary: string) => void;
}

export function ExecutiveSummarySection({
  test,
  results,
  executiveSummary,
  setExecutiveSummary,
}: ExecutiveSummarySectionProps) {
  const { toast } = useToast();

  const generateExecutiveSummary = () => {
    if (!results) return;
    
    const control = parseFloat(results.control);
    const experiment = parseFloat(results.experiment);
    const percentageChange = ((experiment - control) / control) * 100;
    const improvement = percentageChange > 0;
    
    const summary = `Test Results Summary:
The ${test.name} test ${improvement ? 'showed positive results' : 'did not show improvement'} for ${test.kpi}.
The experiment group ${improvement ? 'outperformed' : 'underperformed compared to'} the control group by ${Math.abs(percentageChange).toFixed(2)}%.
Control group: ${results.control}
Experiment group: ${results.experiment}`;

    setExecutiveSummary(summary);
    updateExecutiveSummary(summary);
  };

  const updateExecutiveSummary = async (summary: string) => {
    try {
      const { error } = await supabase
        .from('tests')
        .update({ executive_summary: summary })
        .eq('id', test.id);

      if (error) throw error;

      toast({
        title: "Executive summary updated",
        description: "The executive summary has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating executive summary:', error);
      toast({
        title: "Error updating executive summary",
        description: "There was a problem updating the executive summary.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="executive-summary">Executive Summary</Label>
        {results && (
          <Button
            onClick={generateExecutiveSummary}
            variant="outline"
            size="sm"
          >
            Generate Summary
          </Button>
        )}
      </div>
      <Textarea
        id="executive-summary"
        value={executiveSummary}
        onChange={(e) => setExecutiveSummary(e.target.value)}
        onBlur={() => updateExecutiveSummary(executiveSummary)}
        placeholder="Enter or generate an executive summary for this test..."
        className="min-h-[100px]"
      />
    </div>
  );
}